"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

//  Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validation schema
const updateArticleSchema = z.object({
  title: z.string().min(3).max(100),
  category: z.string().min(3).max(50),
  content: z.string().min(10),
});

type UpdateArticleFormState = {
  errors: {
    title?: string[];
    category?: string[];
    featuredImage?: string[];
    content?: string[];
    formErrors?: string[];
  };
  success?: boolean;
};

export const updateArticles = async (
  articleId: string,
  prevState: UpdateArticleFormState,
  formData: FormData
): Promise<UpdateArticleFormState> => {
  // Validate input
  const result = updateArticleSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !user.email) {
    return {
      errors: {
        formErrors: ["You must be logged in to update an article."],
      },
    };
  }

  // Fetch article
  const existingArticle = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!existingArticle) {
    return {
      errors: { formErrors: ["Article not found."] },
    };
  }

  // Find your user in DB using Supabase email
  const dbUser = await prisma.profile.findUnique({
    where: { email: user.email },
  });

  if (!dbUser || dbUser.id !== existingArticle.authorId) {
    return {
      errors: { formErrors: ["You are not authorized to edit this article."] },
    };
  }

  // Handle image upload
  let imageUrl = existingArticle.featuredImage;
  const imageFile = formData.get("featuredImage") as File | null;

  if (imageFile && imageFile.size > 0) {
    try {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (err, res) => (err ? reject(err) : resolve(res!))
        );
        stream.end(buffer);
      });

      imageUrl = uploadResult.secure_url ?? imageUrl;
    } catch (err) {
      return {
        errors: {
          featuredImage: ["Failed to upload image. Please try again."],
        },
      };
    }
  }

  // Update article
  try {
    await prisma.article.update({
      where: { id: articleId },
      data: {
        title: result.data.title,
        category: {
          connect: { name: result.data.category },
        },
        content: result.data.content,
        featuredImage: imageUrl,
      },
    });

    revalidatePath("/dashboard");

    return { errors: {}, success: true };
  } catch (err: unknown) {
    return {
      errors: {
        formErrors: [err instanceof Error ? err.message : "Unexpected error occurred."],
      },
    };
  }
};
