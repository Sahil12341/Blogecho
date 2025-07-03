"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validation schema
const createArticleSchema = z.object({
  userId: z.string().min(1, "User must be logged in"),
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
    userId: formData.get("userId"),
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
  const userId = parsed.data.userId;

  let existingUser = await prisma.profile.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    existingUser = await prisma.profile.create({
      data: {
        id: userId,
        email: `user-${userId}@echo.fake`,
        fullName: "Anonymous",
        avatarUrl: null,
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

  const categoryName = parsed.data.category.trim().toLowerCase()
  const categoryRecord = await prisma.category.upsert({
  where: { name: categoryName },
  update: {}, // No updates — just retrieve if exists
  create: { 
    name: categoryName,
    slug: categoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, ""),
  },
})


  await prisma.article.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
      category: {
        connect: { id: categoryRecord.id },
      },
      content: parsed.data.content,
      featuredImage: uploadResult.secure_url,
      author: {
        connect: { id: userId },
      },
    },
  });

  revalidatePath("/articles");

  // Return success — let client redirect
  return { success: true };
};
