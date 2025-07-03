"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";

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

  // Find the article and the author's email
  const article = await prisma.article.findUnique({
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
  await prisma.article.delete({
    where: { id: articleId },
  });

  // Refresh the page
  revalidatePath("/dashboard");
  return { success: true };
};
