import { prisma } from "@/lib/prisma";
import { ArticlesManagement } from "@/components/dashboard/article-management";

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { fullName: true } },
      category: { select: { name: true } },
      comments: true,
      
    },
  });

  const mappedArticles = articles.map((article) => ({
    id: article.id,
    title: article.title,
    author: { fullName: article.author?.fullName ?? "" },
    category: { name: article.category?.name ?? "" },
    status: article.status,
    comments: article.comments.map((comment) => ({ id: comment.id })),
    featured: article.featured,
    createdAt: article.createdAt.toISOString(),
    views: article.viewCount ?? 0,
  }));

  return <ArticlesManagement articles={mappedArticles} />;
}
