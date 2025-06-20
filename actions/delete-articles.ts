"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const deleteArticle = async (articleId: string) => {
  // Inline Supabase client creation
  const supabase = createServerComponentClient({ cookies });

  // Get logged-in user session
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { success: false, error: "Unauthorized, please log in!" };
  }

  // 🔍 Find the article and the author's email
  const article = await prisma.post.findUnique({
    where: { id: articleId },
    select: {
      author: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!article) {
    return { success: false, error: "Article not found!" };
  }

  // Check if the user is the author
  if (article.author.email !== user.email) {
    return {
      success: false,
      error: "You are not authorized to delete this article.",
    };
  }

  //Delete the article
  await prisma.post.delete({
    where: { id: articleId },
  });

  // Refresh the page
  revalidatePath("/dashboard");
  return { success: true };
};
