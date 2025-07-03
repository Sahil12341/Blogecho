import { ArticleDetailPage } from "@/components/articles/article-detail-page";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: { id: string };
};

export default async function Page({ params }: PageProps) {
  const article = await prisma.article.findUnique({
    where: {
      id: params.id,
    },
    include: {
      author: {
        select: {
          email: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!article) {
    return <h1 className="text-center mt-20 text-xl">Article not found</h1>;
  }

  return (
    <ArticleDetailPage
      article={{
        id: article.id,
        title: article.title,
        content: article.content,
        category: article.category?.name,
        createdAt: article.createdAt,
        author: article.author,
      }}
    />
  );
}
