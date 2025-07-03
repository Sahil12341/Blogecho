"use client";

import { FormEvent, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { createArticles } from "@/actions/create-articles";
import { useAuth } from "@/hooks/use-auth"; // custom hook to get user

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreateArticlePage() {
  const [content, setContent] = useState("");
  type FormState =
    | { errors: { [key: string]: string[] } }
    | { success: true };

  const [formState, setFormState] = useState<FormState>({ errors: {} });
  const [isPending, startTransition] = useTransition();

  const { user } = useAuth(); // Assuming you have access to the Supabase user

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.append("content", content);

    if (!user?.id) {
      setFormState({
        errors: { formErrors: ["You must be logged in to publish an article."] },
      });
      return;
    }

    formData.append("userId", user.id);

    startTransition(async () => {
      const result = await createArticles(undefined, formData);
      setFormState(result);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Article</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Article Title</Label>
              <Input id="title" name="title" placeholder="Enter article title" />
              {"errors" in formState && formState.errors.title && (
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.title[0]}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select Category</option>
                <option value="technology">Technology</option>
                <option value="programming">Programming</option>
                <option value="web-development">Web Development</option>
              </select>
              {"errors" in formState && formState.errors.category && (
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.category[0]}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image</Label>
              <Input id="featuredImage" name="featuredImage" type="file" accept="image/*" />
              {"errors" in formState && formState.errors.featuredImage && (
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.featuredImage[0]}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <ReactQuill theme="snow" value={content} onChange={setContent} />
              {"errors" in formState && formState.errors.content && (
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.content[0]}
                </span>
              )}
            </div>

            {"errors" in formState && formState.errors.formErrors && (
              <div className="bg-red-100 dark:bg-transparent p-2 border border-red-600">
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.formErrors[0]}
                </span>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button disabled={isPending} type="submit">
                {isPending ? "Publishing..." : "Publish Article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
