"use client"

import { WriteEditor } from "@/components/text-editor/write-editor"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth/auth-modal"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PenTool, BookOpen, Users, Loader2 } from "lucide-react"
import Link from "next/link"
import { createArticles } from "@/actions/create-articles"

function WritePageContent() {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true)
    }
  }, [user, loading])

  const handleSave = (content: any) => {
    console.log("Saving article:", content)
    // Here you would save to your database
    // For example, with Supabase:
    // await supabase.from('articles').insert(content)
  }

  const handlePublish = async (content: any) => {
    if (!user?.id) {
      console.error("No user ID available for publishing")
      alert("Please sign in to publish articles")
      return
    }

    try {
      console.log("Publishing article for user:", user.id)

      const formData = new FormData()
      formData.set("userId", user.id)
      formData.set("title", content.title)
      formData.set("category", content.category)
      formData.set("content", content.content)
      formData.set("featuredImage", content.featuredImage)

      const result = await createArticles({}, formData)

      if (!result.success) {
        console.error("Validation errors:", result.errors)
        alert(
          "Validation failed:\n" +
            Object.entries(result.errors)
              .map(([field, msgs]) => `${field}: ${msgs?.join(", ")}`)
              .join("\n"),
        )
      } else {
        console.log("Article published successfully")
        // Redirect from client if needed
        window.location.href = "/articles"
      }
    } catch (err) {
      console.error("Failed to publish article:", err)
      alert("Failed to publish article. Please try again.")
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Link href="/" className="flex items-center justify-center space-x-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-3xl font-semibold">
              Echo
            </span>
          </Link>
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show auth modal if not authenticated
  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <PenTool className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Start Writing on Echo</CardTitle>
              <CardDescription>Sign in to share your stories and ideas with our community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Write</p>
                  <p className="text-xs text-gray-500">Share your expertise</p>
                </div>
                <div>
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Connect</p>
                  <p className="text-xs text-gray-500">Build your audience</p>
                </div>
                <div>
                  <PenTool className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Grow</p>
                  <p className="text-xs text-gray-500">Develop your voice</p>
                </div>
              </div>
              <Button onClick={() => setShowAuthModal(true)} className="w-full">
                Sign In to Start Writing
              </Button>
            </CardContent>
          </Card>
        </div>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultMode="login" />
      </>
    )
  }

  // Show profile loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Link href="/" className="flex items-center justify-center space-x-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-3xl font-semibold">
              Echo
            </span>
          </Link>
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-gray-600">Setting up your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show editor when user is authenticated and profile is loaded
  return (
    <div className="min-h-screen bg-white">
      <WriteEditor onSave={handleSave} onPublish={handlePublish} />
    </div>
  )
}

export default function WritePage() {
  return (
      <WritePageContent />
  )
}
