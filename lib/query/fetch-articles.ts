import { prisma } from "@/lib/prisma";

export const fetchArticleByQuery = async (searchText: string, skip: number, take: number) => {
  const [articles, total] = await prisma.$transaction([
    prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: searchText, mode: 'insensitive' } },
          { category: { name: { contains: searchText, mode: 'insensitive' } } },
        ],
      },
      include: {
        author: true,
      },
      skip: skip,
      take: take,
    }),
    prisma.article.count({
      where: {
        OR: [
          { title: { contains: searchText, mode: 'insensitive' } },
          { category: { name: { contains: searchText, mode: 'insensitive' } } },
        ],
      },
    }),
  ]);

  return { articles, total };
};