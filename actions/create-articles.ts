"use server";

import { prisma } from "@/lib/prisma";
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
  title: z.string().min(3, "Title is too short").max(100),
  category: z.string().min(3, "Category is too short").max(50),
  content: z.string().min(10, "Content is too short"),
});

type CreateArticleResult =
  | { success: true }
  | {
      success: false;
      errors: {
        title?: string[];
        category?: string[];
        content?: string[];
        featuredImage?: string[];
        formErrors?: string[];
      };
    };

export const createArticles = async (
  _prevState: any,
  formData: FormData
): Promise<CreateArticleResult> => {
  const parsed = createArticleSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      success: false,
      errors: {
        formErrors: ["You must be logged in to publish an article."],
      },
    };
  }

  let existingUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!existingUser) {
    existingUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata.full_name ?? "Anonymous",
        image: user.user_metadata.avatar_url ?? null,
      },
    });
  }

  const imageFile = formData.get("featuredImage") as File | null;

  if (!imageFile || imageFile.name === "undefined") {
    return {
      success: false,
      errors: {
        featuredImage: ["Featured image is required."],
      },
    };
  }

  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let uploadResult: UploadApiResponse;
  try {
    uploadResult = await new Promise((resolve, reject) => {
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
  } catch (e) {
    return {
      success: false,
      errors: {
        featuredImage: ["Image upload failed."],
      },
    };
  }

  await prisma.post.create({
    data: {
      title: parsed.data.title,
      category: parsed.data.category,
      content: parsed.data.content,
      featuredImage: uploadResult.secure_url,
      authorId: existingUser.id,
    },
  });

  revalidatePath("/articles");

  // Return success — let client redirect
  return { success: true };
};
