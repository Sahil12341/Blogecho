import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import CommentForm from "../comments/comment-form";
import CommentList from "../comments/comment-list";
import { prisma } from "@/lib/prisma";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import LikeButton from "./like-button";

type ArticleDetailPageProps = {
  article: {
    id: string;
    title: string;
    content: string | null;
    category?: string | null;
    createdAt: Date;
    author?: {
      fullName?: string | null;
      email?: string | null;
      image?: string | null;
    } | null;
  };
};

export async function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  try {
    const supabase = createServerComponentClient({ cookies });

    const [
      comments,
      likes,
      {
        data: { user },
      },
    ] = await Promise.all([
      prisma.comment.findMany({
        where: {
          articleId: article.id,
        },
        include: {
          author: {
            select: {
              email: true,
              fullName : true,
            },
          },
        },
      }),
      prisma.articleLike.findMany({
        where: { articleId: article.id },
      }),
      supabase.auth.getUser(),
    ]);

    let isLiked = false;
    let dbUser: { id: string } | null = null;

    if (user && user.email) {
      dbUser = await prisma.profile.findUnique({
        where: { email: user.email },
        select: { id: true },
      });

      if (dbUser) {
        isLiked = likes.some((like) => like.userId === dbUser?.id);
      }
    }

    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <article className="mx-auto max-w-3xl">
            {/* Article Header */}
            <header className="mb-12">
              {article.category && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                    {article.category}
                  </span>
                </div>
              )}

              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
                {article.title}
              </h1>

              <div className="flex items-center gap-4 text-muted-foreground">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={article.author?.image || ""} />
                  <AvatarFallback>
                    {article.author?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {article.author?.fullName || "Anonymous"}
                  </p>
                  <p className="text-sm">
                    {article.createdAt.toDateString()} · 12 min read
                  </p>
                </div>
              </div>
            </header>

            <section
              className="prose prose-lg dark:prose-invert max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: article.content || "" }}
            />

            <LikeButton articleId={article.id} likes={likes} isLiked={isLiked} />

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-8">
                <MessageCircle className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">
                  {comments.length} Comments
                </h2>
              </div>

              {user && <CommentForm articleId={article.id} />}

              <CommentList comments={comments} />
            </Card>
          </article>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error in ArticleDetailPage:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Card className="p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Error Loading Article
            </h1>
            <p className="text-muted-foreground">
              We encountered an error while loading this article. Please try refreshing the page.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
