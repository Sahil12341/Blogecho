"use client";
import React, { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Prisma } from "@/app/generated/prisma";
import { deleteArticle } from "@/actions/delete-articles";

type RecentArticlesProps = {
  articles: Prisma.PostGetPayload<{
    include: {
      comments: true;
      author: {
        select: {
          name: true;
          email: true;
          image: true;
        };
      };
    };
  }>[];
};

const RecentArticles: React.FC<RecentArticlesProps> = ({ articles }) => {
  return (
    <Card className="w-full max-w-[990px] h-[480px] overflow-hidden border shadow-sm">
      <CardHeader className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Articles</CardTitle>
          <Button className="text-muted-foreground" size="sm" variant={"ghost"}>
            View All →
          </Button>
        </div>
      </CardHeader>

      {!articles.length ? (
        <CardContent className="py-12 text-center text-sm text-muted-foreground">No Articles</CardContent>
      ) : (
        <CardContent className="overflow-y-auto px-0 h-full">
          <div className="min-w-full">
            <Table className="min-w-full text-sm">
              <TableHeader>
                <TableRow className="sticky top-0 bg-background z-10 border-b">
                  <TableHead className="px-6 py-3">Title</TableHead>
                  <TableHead className="px-6 py-3">Status</TableHead>
                  <TableHead className="px-6 py-3">Comments</TableHead>
                  <TableHead className="px-6 py-3">Date</TableHead>
                  <TableHead className="px-6 py-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id} className="hover:bg-muted/50">
                    <TableCell className="px-6 py-3">{article.title}</TableCell>
                    <TableCell className="px-6 py-3">
                      <Badge
                        variant="secondary"
                        className="rounded-full bg-green-100 text-green-800"
                      >
                        Published
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-3">{article.comments.length}</TableCell>
                    <TableCell className="px-6 py-3">{article.createdAt.toDateString()}</TableCell>
                    <TableCell className="px-6 py-3">
                      <div className="flex gap-2">
                        <Link href={`/dashboard/articles/${article.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <DeleteButton articleId={article.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default RecentArticles;

type DeleteButtonProps = {
  articleId: string;
}

const DeleteButton : React.FC<DeleteButtonProps> = ({articleId}) => {
  const [isPending, startTransition] = useTransition();
  const [ error, setError ] = useState('')

   const HandleDelete =()=>{
      startTransition(async()=>{
        const result = await deleteArticle(articleId);

        if(!result.success){
          setError(result.error || "Something went wrong!");
        } else{
          setError('');
        }
      })
    }
  return(
    <div className="relative">

      <Button disabled={isPending} variant={"ghost"} size={"sm"} type="submit" onClick={HandleDelete}>
        {isPending ? "Deleting..." : "Delete"}
      </Button>
    
       {error && (
        <p className="absolute left-0 mt-1 text-xs text-red-500 opacity-80">
          {error}
        </p>
      )}
    </div>
  
  );
};