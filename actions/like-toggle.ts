"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function toggleLike(postId: string) {
  const supabase = createServerComponentClient({ cookies: () => cookies() });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be logged in to like an article.");
  }

  // Ensure the user exists in your local database
  const dbUser = await prisma.profile.findUnique({
    where: { email: user.email! }, // or supabaseUserId: user.id if you track it
  });

  if (!dbUser) {
    throw new Error("User does not exist in the database.");
  }

  // Check if the user already liked the post
  const existingLike = await prisma.articleLike.findFirst({
    where: {
      articleId: postId,
      userId: dbUser.id,
    },
  });

  if (existingLike) {
    // Unlike
    await prisma.articleLike.delete({
      where: { id: existingLike.id },
    });
  } else {
    // Like
    await prisma.articleLike.create({
      data: {
        articleId: postId,
        userId: dbUser.id,
      },
    });
  }

  revalidatePath(`/article/${postId}`);
}
