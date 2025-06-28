import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { ArrowRight, Badge, Calendar, User } from "lucide-react";
import { Button } from "../ui/button";

export default async function TopArticles() {
  const articles = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return (
    <div>
       <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Articles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked stories from our community of writers, covering the latest trends and insights.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {articles.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={post.featuredImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  <Badge
                    className={`absolute top-4 left-4 ${post.category === "Technology" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}
                  >
                    {post.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.content.length > 100 ? post.content.slice(0, 100) + "..." : post.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>{post.author?.name}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Posts</h2>
              <p className="text-gray-600">Stay up to date with our latest articles and insights.</p>
            </div>
            <Button variant="outline" className="hidden sm:flex">
              View All Posts
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          {/* Define recentPosts as the 4 most recent articles */}
          {(() => {
            const recentPosts = articles
              .slice(0, 4)
              .map((post) => ({
                ...post,
                author: post.author?.name || "Unknown",
                date: new Date(post.createdAt).toLocaleDateString(),
                readTime: `${Math.max(1, Math.round((post.content.length || 0) / 500))} min read`,
              }));
            return (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <Badge className="mb-3 bg-gray-100 text-gray-800">{post.category}</Badge>
                      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                      <div className="text-sm text-gray-500 space-y-1">
                        <div className="flex items-center space-x-2">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3" />
                          <span>{post.date}</span>
                        </div>
                        <span>{post.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })()}
          <div className="text-center mt-8 sm:hidden">
            <Button variant="outline">
              View All Posts
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
