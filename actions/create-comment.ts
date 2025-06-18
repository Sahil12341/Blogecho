"use server"
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { clerkClient } from "@clerk/clerk-sdk-node";

const createCommentSchema = z.object({
    body: z.string().min(1)
});

type CreateCommentFormState = {
    errors: {
        body?: string[];
        formErrors?: string[];
    };
}

export const createComments = async (articleId:string,prevState: CreateCommentFormState, formData: FormData): Promise<CreateCommentFormState> => {
    const result = createCommentSchema.safeParse({
        body:formData.get('body') as string
    });
    if(!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        }
    }
    const {userId} = await auth();
    if(!userId){
        return {
            errors:{
                formErrors:['You have to login first']
            }
        }
    }

    let existingUser = await prisma.user.findUnique({
  where: { clerkUserId: userId },
});

if (!existingUser) {
  const clerkUser = await clerkClient.users.getUser(userId); // fetch from Clerk backend
  if (!clerkUser) {
    return {
      errors: {
        formErrors: ["User not found in Clerk."],
      },
    };
  }
  // Create user in your DB using Clerk info
  existingUser = await prisma.user.create({
    data: {
      clerkUserId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      name: clerkUser.username || `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`,
      image: clerkUser.imageUrl,
    },
  });
}

    try {
        await prisma.comment.create({
            data:{
                body:result.data.body,
                authorId:existingUser.id,
                postId:articleId
            }
        })
    } catch (error:unknown) {
        if(error instanceof Error){
            return {
                errors:{
                    formErrors:[error.message]
                }
            }
        }else{
            return {
                errors:{
                    formErrors:['Some internal server error while creating comment']
                }
            }
        }
    }
    revalidatePath(`/articles/${articleId}`);
    return {errors:{}}
}