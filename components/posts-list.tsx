"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, Shield } from "lucide-react"
import { togglePostLike } from "@/lib/actions/posts"

interface Post {
  id: string
  content: string
  likes_count: number
  created_at: string
  admin_username: string
  user_has_liked?: boolean
}

interface PostsListProps {
  posts: Post[]
  userType: "user" | "admin" | null
}

export default function PostsList({ posts, userType }: PostsListProps) {
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set())
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set())

  const toggleExpanded = (postId: string) => {
    const newExpanded = new Set(expandedPosts)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
    }
    setExpandedPosts(newExpanded)
  }

  const handleLike = async (postId: string) => {
    if (userType !== "user") return

    setLikingPosts((prev) => new Set(prev).add(postId))
    try {
      await togglePostLike(postId)
    } catch (error) {
      console.error("Error liking post:", error)
    } finally {
      setLikingPosts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes}min atrás`
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d atrás`
    }
  }

  const truncateText = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="text-gray-500 mb-4">
          <Shield className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-sm sm:text-base">Nenhum comunicado ainda.</p>
          <p className="text-xs sm:text-sm">Os administradores podem criar posts aqui.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {posts.map((post) => {
        const isExpanded = expandedPosts.has(post.id)
        const shouldTruncate = post.content.length > 150
        const isLiking = likingPosts.has(post.id)

        return (
          <Card key={post.id} className="border-gray-200 hover:shadow-sm transition-shadow">
            <CardContent className="p-3 sm:p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3 gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 min-w-0 flex-1">
                  <Badge className="bg-blue-100 text-blue-800 text-xs w-fit">
                    <Shield className="h-3 w-3 mr-1" />
                    <span className="truncate">{post.admin_username}</span>
                  </Badge>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <span className="hidden sm:inline">•</span>
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>

                {/* Like button for users */}
                {userType === "user" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    disabled={isLiking}
                    className={`flex items-center space-x-1 text-xs px-2 py-1 h-auto min-w-0 flex-shrink-0 ${
                      post.user_has_liked ? "text-yellow-600 bg-yellow-50" : "text-gray-600 hover:text-yellow-600"
                    }`}
                  >
                    <Coins className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs">{post.likes_count}</span>
                  </Button>
                )}

                {/* Like count for admins (read-only) */}
                {userType === "admin" && (
                  <div className="flex items-center space-x-1 text-xs text-gray-600 flex-shrink-0">
                    <Coins className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{post.likes_count}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                  {isExpanded || !shouldTruncate ? post.content : truncateText(post.content)}
                </div>

                {/* Show more/less button */}
                {shouldTruncate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(post.id)}
                    className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto"
                  >
                    {isExpanded ? "ver menos" : "ver mais"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
