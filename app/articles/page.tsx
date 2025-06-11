import { AllArticlesPage } from "@/components/articles/all-articles-page";
import ArticleSearchInput from "@/components/articles/article-search-input";
import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";
import { fetchArticleByQuery } from "@/lib/query/fetch-articles";
import Link from "next/link";
import { AllArticlesPageSkeleton } from "@/components/skeletons/article-skeleton";
export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams: Promise<{ search?: string; page?: string }>;
};

const ITEMS_PER_PAGE = 3; // Number of items per page

const page: React.FC<SearchPageProps> = async ({ searchParams }) => {
  // Await the searchParams Promise
  const params = await searchParams;
  const searchText = params.search || "";
  const currentPage = Number(params.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const take = ITEMS_PER_PAGE;

  const { articles, total } = await fetchArticleByQuery(searchText, skip, take);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Helper function to build search URLs
  const buildSearchUrl = (page: number) => {
    const url = new URLSearchParams();
    if (searchText) url.set("search", searchText);
    if (page > 1) url.set("page", page.toString());
    return `?${url.toString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            All Articles
          </h1>
          {/* Search Bar */}
          <Suspense fallback={<div />}>
            <ArticleSearchInput />
          </Suspense>
        </div>

        {/* Search Results Info */}
        {searchText && (
          <div className="mb-6 text-center text-sm text-muted-foreground">
            {total > 0 ? (
              <>{`Found ${total} article${
                total !== 1 ? "s" : ""
              } for "${searchText}"`}</>
            ) : (
              <>{`No articles found for "${searchText}"`}</>
            )}
          </div>
        )}

        {/* All article page */}
        <Suspense fallback={<AllArticlesPageSkeleton />}>
          <AllArticlesPage articles={articles} />
        </Suspense>

        {/* Pagination - Only show if there are articles and multiple pages */}
        {total > 0 && totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2 flex-wrap">
            {/* Prev Button */}
            {currentPage > 1 ? (
              <Link href={buildSearchUrl(currentPage - 1)}>
                <Button variant="ghost" size="sm">
                  ← Prev
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" size="sm" disabled>
                ← Prev
              </Button>
            )}

            {/* Page Numbers - Show smart pagination for large page counts */}
            {totalPages <= 7 ? (
              // Show all pages if 7 or fewer
              Array.from({ length: totalPages }).map((_, index) => {
                const pageNum = index + 1;
                return (
                  <Link key={pageNum} href={buildSearchUrl(pageNum)}>
                    <Button
                      variant={
                        currentPage === pageNum ? "destructive" : "ghost"
                      }
                      size="sm"
                      disabled={currentPage === pageNum}
                    >
                      {pageNum}
                    </Button>
                  </Link>
                );
              })
            ) : (
              // Smart pagination for many pages
              <>
                {/* First page */}
                <Link href={buildSearchUrl(1)}>
                  <Button
                    variant={currentPage === 1 ? "destructive" : "ghost"}
                    size="sm"
                    disabled={currentPage === 1}
                  >
                    1
                  </Button>
                </Link>

                {/* Ellipsis if needed */}
                {currentPage > 4 && <span className="px-2">...</span>}

                {/* Pages around current */}
                {Array.from({ length: 3 }).map((_, index) => {
                  const pageNum = Math.max(
                    2,
                    Math.min(totalPages - 1, currentPage - 1 + index)
                  );
                  if (pageNum === 1 || pageNum === totalPages) return null;

                  return (
                    <Link key={pageNum} href={buildSearchUrl(pageNum)}>
                      <Button
                        variant={
                          currentPage === pageNum ? "destructive" : "ghost"
                        }
                        size="sm"
                        disabled={currentPage === pageNum}
                      >
                        {pageNum}
                      </Button>
                    </Link>
                  );
                })}

                {/* Ellipsis if needed */}
                {currentPage < totalPages - 3 && (
                  <span className="px-2">...</span>
                )}

                {/* Last page */}
                {totalPages > 1 && (
                  <Link href={buildSearchUrl(totalPages)}>
                    <Button
                      variant={
                        currentPage === totalPages ? "destructive" : "ghost"
                      }
                      size="sm"
                      disabled={currentPage === totalPages}
                    >
                      {totalPages}
                    </Button>
                  </Link>
                )}
              </>
            )}

            {/* Next Button */}
            {currentPage < totalPages ? (
              <Link href={buildSearchUrl(currentPage + 1)}>
                <Button variant="ghost" size="sm">
                  Next →
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" size="sm" disabled>
                Next →
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default page;
