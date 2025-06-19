"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
 
export const deleteArticle = async (articleId: string) => {
    const { userId } = await auth();

    if(!userId){
       return { success: false, error: "Unauthorized, Please Login!"}
}
    const article = await prisma.post.findUnique({
        where: {id: articleId},
        select : { author : { select : {  clerkUserId: true}}},
    })

    if(!article){
        return {success: false, error: "Article not Found!"};
    }

    if(article.author.clerkUserId != userId){
        return { success: false, error: "You are not authorized to delete this article"};
    }

    await prisma.post.delete({
        where: { id : articleId}
    })

    revalidatePath("/dashboard");
    return {success : true}
}