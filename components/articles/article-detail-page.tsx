import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import CommentForm from "../comments/comment-form";
import CommentList from "../comments/comment-list";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { User } from "@/app/generated/prisma"; // Fixed import path
import LikeButton from "./like-button";

type ArticleDetailPageProps = {
  article: {
    id: string;
    title: string;
    content: string | null;
    category?: string | null;
    createdAt: Date;
    author?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } | null;
  };
};

export async function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  // Add error handling for database operations
  try {
    //  Fetch all data in parallel for better performance
    const [comments, likes, userId] = await Promise.all([
      prisma.comment.findMany({
        where: {
          postId: article.id,
        },
        include: {
          author: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      }),
      prisma.like.findMany({
        where: { postId: article.id }
      }),
      auth().then(auth => auth.userId)
    ]);

    // Handle case where user is not logged in
    let user: User | null = null;
    let isLiked = false;

    if (userId) {
      user = await prisma.user.findUnique({
        where: { clerkUserId: userId }
      });
      
      if (user) {
        isLiked = likes.some((like) => like.userId === user?.id);
      }
    }

    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <article className="mx-auto max-w-3xl">
            {/* Article Header */}
            <header className="mb-12">
              {/* ✅ Only show category if it exists */}
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
                  <AvatarImage src={article.author?.image || ''} />
                  <AvatarFallback>
                    {/* ✅ Better fallback logic */}
                    {article.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {article.author?.name || 'Anonymous'}
                  </p>
                  <p className="text-sm">
                    {article.createdAt.toDateString()} · 12 min read
                  </p>
                </div>
              </div>
            </header>

            {/* Article Content */}
            <section
              className="prose prose-lg dark:prose-invert max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: article.content || '' }}
            />

            {/* Article Actions */}
            <LikeButton 
              articleId={article.id} 
              likes={likes} 
              isLiked={isLiked}
            />

            {/* Comments Section */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-8">
                <MessageCircle className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">
                  {comments.length} Comments
                </h2>
              </div>

              {/* Comment Form - Only show if user is logged in */}
              {userId && <CommentForm articleId={article.id} />}

              {/* Comments List */}
              <CommentList comments={comments} />
            </Card>
          </article>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error in ArticleDetailPage:', error);
  }

    // Return a proper error state instead of throwing
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
