import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { MoreHorizontal, Settings, Eye, Save, Send, X, Plus, Type } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })
import "react-quill-new/dist/quill.snow.css";
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

interface WriteEditorProps {
  onSave?: (content: any) => void
  onPublish?: (content: any) => void
  initialContent?: any
}

export function WriteEditor({ onSave, onPublish, initialContent }: WriteEditorProps) {
  const { user, loading } = useAuth()
  const [title, setTitle] = useState(initialContent?.title || "")
  const [subtitle, setSubtitle] = useState(initialContent?.subtitle || "")
  const [content, setContent] = useState(initialContent?.content || "")
  const [tags, setTags] = useState<string[]>(initialContent?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [category, setCategory] = useState(initialContent?.category || "")
  const [featuredImage, setFeaturedImage] = useState(initialContent?.featuredImage || "") // Added featured image
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false)
  const [publishSettings, setPublishSettings] = useState({
    featured: false,
    allowComments: true,
    publishNow: true,
    scheduledDate: "",
  })

  const titleRef = useRef<HTMLInputElement>(null)
  const subtitleRef = useRef<HTMLInputElement>(null)
  const quillRef = useRef<any>(null)

  useEffect(() => {
    // Auto-focus title on mount
    if (titleRef.current && !title) {
      titleRef.current.focus()
    }
  }, [title])

  
useEffect(() => {
  if (!loading) {
    console.log("DEBUG WriteEditor user:", user);
  }
}, [user, loading]);

if (loading || !user) {
  return <div className="p-4 text-gray-500">Authenticating...</div>;
}

  // Custom Quill modules and formats
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link", "image"],
          [{ align: [] }],
          [{ color: [] }, { background: [] }],
          ["clean"],
        ],
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  )

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "link",
    "image",
    "align",
    "color",
    "background",
    "code-block",
  ]

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handleSave = () => {
    if (!user?.id) {
      console.error("No user ID for save");
      alert("Please ensure you are logged in before saving.");
      return;
    }

    const articleData = {
      title,
      subtitle,
      content,
      tags,
      category,
      featuredImage,
      status: "draft",
      updatedAt: new Date().toISOString(),
    }
    
    console.log("Saving article data:", articleData);
    onSave?.(articleData)
  }

  const handlePublish = () => {
    if (!user?.id) {
      console.error("No user ID for publish");
      alert("Please ensure you are logged in before publishing.");
      return;
    }

    // Validate required fields
    if (!title.trim()) {
      alert("Please add a title before publishing.");
      return;
    }

    if (!content.trim()) {
      alert("Please add content before publishing.");
      return;
    }

    if (!category) {
      alert("Please select a category before publishing.");
      return;
    }

    const articleData = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      content,
      tags,
      category,
      featuredImage,
      status: "published",
      publishSettings,
      publishedAt: new Date().toISOString(),
    }
    
    console.log("Publishing article data:", articleData);
    onPublish?.(articleData)
    setIsPublishDialogOpen(false)
  }

  // Calculate word count from HTML content
  const getWordCount = (html: string) => {
    const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")
    return text.split(/\s+/).filter((word) => word.length > 0).length
  }

  const wordCount = getWordCount(content)
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-3xl font-semibold">
                    Echo
                  </span>
                </Link>
              </div>
              <span className="text-sm text-gray-500">Draft</span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 hidden sm:block">
                {wordCount} words • {readTime} min read
              </span>
              <Button variant="ghost" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" disabled={!user?.id}>
                    <Send className="h-4 w-4 mr-2" />
                    Publish
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Publish Article</DialogTitle>
                    <DialogDescription>Configure your article settings before publishing.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="programming">Programming</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="react">React</SelectItem>
                          <SelectItem value="css">CSS</SelectItem>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="featuredImage">Featured Image URL</Label>
                      <Input
                        id="featuredImage"
                        placeholder="https://example.com/image.jpg"
                        value={featuredImage}
                        onChange={(e) => setFeaturedImage(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags (max 5)</Label>
                      <div className="flex space-x-2 mt-1">
                        <Input
                          placeholder="Add tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={handleKeyPress}
                          disabled={tags.length >= 5}
                        />
                        <Button onClick={addTag} size="sm" disabled={tags.length >= 5 || !newTag.trim()}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                              <span>{tag}</span>
                              <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600">
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="featured">Featured Article</Label>
                        <Switch
                          id="featured"
                          checked={publishSettings.featured}
                          onCheckedChange={(checked) => setPublishSettings({ ...publishSettings, featured: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="comments">Allow Comments</Label>
                        <Switch
                          id="comments"
                          checked={publishSettings.allowComments}
                          onCheckedChange={(checked) =>
                            setPublishSettings({ ...publishSettings, allowComments: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="publishNow">Publish Now</Label>
                        <Switch
                          id="publishNow"
                          checked={publishSettings.publishNow}
                          onCheckedChange={(checked) => setPublishSettings({ ...publishSettings, publishNow: checked })}
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setIsPublishDialogOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handlePublish} className="flex-1" disabled={!title.trim() || !content.trim() || !category}>
                        Publish Article
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {user && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* User Status Debug (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 text-sm">
          Debug: User ID: {user?.id || 'No user ID'} | Email: {user?.email || 'No email'}
        </div>
      )}

      {/* Editor */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <Input
              ref={titleRef}
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-4xl font-bold border-none shadow-none px-0 py-4 placeholder:text-gray-400 focus-visible:ring-0"
              style={{ fontSize: "2.25rem", lineHeight: "2.5rem" }}
            />
          </div>

          {/* Subtitle */}
          <div>
            <Input
              ref={subtitleRef}
              placeholder="Subtitle (optional)"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="text-xl text-gray-600 border-none shadow-none px-0 py-2 placeholder:text-gray-400 focus-visible:ring-0"
              style={{ fontSize: "1.25rem", lineHeight: "1.75rem" }}
            />
          </div>

          {/* Author Info */}
          {user && (
            <div className="flex items-center space-x-3 py-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.user_metadata?.full_name || user.email}</p>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* React Quill Editor */}
          <div className="min-h-[500px]">
            <style jsx global>{`
              .ql-editor {
                font-size: 1.125rem !important;
                line-height: 1.75rem !important;
                padding: 1rem 0 !important;
                border: none !important;
                min-height: 500px !important;
              }
              
              .ql-editor.ql-blank::before {
                color: #9ca3af !important;
                font-style: normal !important;
                font-size: 1.125rem !important;
                line-height: 1.75rem !important;
              }
              
              .ql-toolbar {
                border: none !important;
                border-bottom: 1px solid #e5e7eb !important;
                padding: 0.75rem 0 !important;
                margin-bottom: 1rem !important;
                position: sticky !important;
                top: 64px !important;
                background: white !important;
                z-index: 40 !important;
              }
              
              .ql-container {
                border: none !important;
                font-family: inherit !important;
              }
              
              .ql-toolbar .ql-formats {
                margin-right: 1rem !important;
              }
              
              .ql-toolbar button {
                padding: 0.375rem !important;
                margin: 0 0.125rem !important;
                border-radius: 0.375rem !important;
              }
              
              .ql-toolbar button:hover {
                background-color: #f3f4f6 !important;
              }
              
              .ql-toolbar button.ql-active {
                background-color: #dbeafe !important;
                color: #2563eb !important;
              }
              
              .ql-editor h1 {
                font-size: 2rem !important;
                font-weight: 700 !important;
                margin: 1.5rem 0 1rem 0 !important;
                line-height: 1.25 !important;
              }
              
              .ql-editor h2 {
                font-size: 1.5rem !important;
                font-weight: 600 !important;
                margin: 1.25rem 0 0.75rem 0 !important;
                line-height: 1.375 !important;
              }
              
              .ql-editor h3 {
                font-size: 1.25rem !important;
                font-weight: 600 !important;
                margin: 1rem 0 0.5rem 0 !important;
                line-height: 1.5 !important;
              }
              
              .ql-editor p {
                margin: 0.75rem 0 !important;
                line-height: 1.75rem !important;
              }
              
              .ql-editor blockquote {
                border-left: 4px solid #e5e7eb !important;
                padding-left: 1rem !important;
                margin: 1rem 0 !important;
                font-style: italic !important;
                color: #6b7280 !important;
              }
              
              .ql-editor ul, .ql-editor ol {
                margin: 0.75rem 0 !important;
                padding-left: 1.5rem !important;
              }
              
              .ql-editor li {
                margin: 0.25rem 0 !important;
                line-height: 1.75rem !important;
              }
              
              .ql-editor code {
                background-color: #f3f4f6 !important;
                padding: 0.125rem 0.25rem !important;
                border-radius: 0.25rem !important;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
                font-size: 0.875rem !important;
              }
              
              .ql-editor pre {
                background-color: #f8fafc !important;
                border: 1px solid #e2e8f0 !important;
                border-radius: 0.5rem !important;
                padding: 1rem !important;
                margin: 1rem 0 !important;
                overflow-x: auto !important;
              }
              
              .ql-editor img {
                max-width: 100% !important;
                height: auto !important;
                margin: 1rem 0 !important;
                border-radius: 0.5rem !important;
              }
              
              .ql-editor a {
                color: #2563eb !important;
                text-decoration: underline !important;
              }
              
              .ql-editor a:hover {
                color: #1d4ed8 !important;
              }
              
              /* Custom dropdown styles */
              .ql-picker-options {
                background: white !important;
                border: 1px solid #e5e7eb !important;
                border-radius: 0.5rem !important;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
              }
              
              .ql-picker-item {
                padding: 0.5rem 0.75rem !important;
              }
              
              .ql-picker-item:hover {
                background-color: #f3f4f6 !important;
              }
            `}</style>

            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Tell your story..."
            />
          </div>

          {/* Additional Options */}
          <div className="flex items-center justify-between pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  More Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Article
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Editor Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Type className="mr-2 h-4 w-4" />
                  Word Count: {wordCount}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="text-sm text-gray-500">Last saved: {new Date().toLocaleTimeString()}</div>
          </div>

          {/* Writing Tips */}
          <div className="bg-gray-50 rounded-lg p-6 mt-12">
            <h3 className="font-semibold mb-3">Writing Tips</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Use the toolbar to format your text with headings, bold, italic, and more</li>
              <li>• Add images by clicking the image icon in the toolbar</li>
              <li>• Use blockquotes to highlight important information</li>
              <li>• Create lists to organize your content clearly</li>
              <li>• Add links to reference external sources</li>
              <li>• Use code blocks for technical content</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}