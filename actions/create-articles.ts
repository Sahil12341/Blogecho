"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validation schema
const createArticleSchema = z.object({
  title: z.string().min(3).max(100),
  category: z.string().min(3).max(50),
  content: z.string().min(10),
});

// Form state type
type CreateArticleFormState = {
  errors: {
    title?: string[];
    category?: string[];
    featuredImage?: string[];
    content?: string[];
    formErrors?: string[];
  };
};


// Main server action
export const createArticles = async (
  prevState: CreateArticleFormState,
  formData: FormData
): Promise<CreateArticleFormState> => {
  // Zod validation
  const result = createArticleSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    content: formData.get("content"),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  // Get Supabase user
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      errors: {
        formErrors: ["You must be logged in to submit an article."],
      },
    };
  }

  // Fetch or create user in your DB
  let existingUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!existingUser) {
    existingUser = await prisma.user.create({
      data: {
        id:user.id,
        email: user.email!,
        name: user.user_metadata.full_name ?? "Anonymous",
        image: user.user_metadata.avatar_url ?? null,
      },
    });
  }

  // Handle image upload
  const imageFile = formData.get("featuredImage") as File | null;
  if (!imageFile || imageFile.name === "undefined") {
    return {
      errors: {
        featuredImage: ["Image file is required."],
      },
    };
  }

  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "articles" },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Image upload failed"));
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });

  // Save article in DB
  await prisma.post.create({
    data: {
      title: result.data.title,
      category: result.data.category,
      content: result.data.content,
      featuredImage: uploadResult.secure_url,
      authorId: existingUser.id,
    },
  });

  revalidatePath("/articles");
  redirect("/articles");

  return { errors: {} }; 
};
