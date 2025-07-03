"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

const createCommentSchema = z.object({
  body: z.string().min(1),
});

type CreateCommentFormState = {
  errors: {
    body?: string[];
    formErrors?: string[];
  };
};

export const createComments = async (
  articleId: string,
  prevState: CreateCommentFormState,
  formData: FormData
): Promise<CreateCommentFormState> => {
  // Validate form data
  const result = createCommentSchema.safeParse({
    body: formData.get("body") as string,
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
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
        formErrors: ["You have to login first."],
      },
    };
  }

  if (!user.email) {
    throw new Error("User email not found");
  }
  // Check if user exists in your DB
  let existingUser = await prisma.profile.findUnique({
    where: { email: user.email },
  });

  if (!existingUser) {
    const fullName = user.user_metadata?.full_name ?? "Anonymous";
    const avatar = user.user_metadata?.avatar_url ?? null;

    existingUser = await prisma.profile.create({
      data: {
        id: user.id,
        email: user.email,
        fullName: fullName,
        avatarUrl: avatar,
      },
    });
  }

  // 📝 Create comment in DB
  try {
    await prisma.comment.create({
      data: {
        content: result.data.body,
        authorId: existingUser.id,
        articleId: articleId,
        authorName: existingUser.fullName || "Anonymous",
        authorEmail: existingUser.email,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          formErrors: [error.message],
        },
      };
    } else {
      return {
        errors: {
          formErrors: ["Some internal server error while creating comment."],
        },
      };
    }
  }

  revalidatePath(`/articles/${articleId}`);

  return { errors: {} };
};
