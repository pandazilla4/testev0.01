import { getSession } from "@/lib/session"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LogOut, Shield, MessageSquare } from "lucide-react"
import { logout } from "@/lib/actions/auth"
import CreatePostForm from "@/components/create-post-form"
import PostsList from "@/components/posts-list"
import PublicComments from "@/components/public-comments"
import Link from "next/link"

export default async function ComentariosPage() {
  const session = await getSession()

  // If no session, show public view
  if (!session) {
    return <PublicComments />
  }

  // If session exists but wrong type, redirect
  if (session.type !== "user" && session.type !== "admin") {
    return <PublicComments />
  }

  const supabase = createClient()

  // Get the 3 most recent posts with admin info and user likes
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      likes_count,
      created_at,
      admin:admin_id (
        username
      )
    `)
    .order("created_at", { ascending: false })
    .limit(3)

  // If user is logged in, get their likes for these posts
  let postsWithLikes = posts || []
  if (session.type === "user" && posts) {
    const postIds = posts.map((p) => p.id)
    const { data: userLikes } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", session.userId)
      .in("post_id", postIds)

    const likedPostIds = new Set(userLikes?.map((like) => like.post_id) || [])

    postsWithLikes = posts.map((post) => ({
      ...post,
      user_has_liked: likedPostIds.has(post.id),
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href={session.type === "admin" ? "/admin" : "/dashboard"}>
                <Button variant="ghost" className="text-gray-600 hover:text-black">
                  ← Voltar
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-6 w-6 text-black" />
                <h1 className="text-xl font-bold text-black">Comentários</h1>
                <Badge variant="secondary" className="text-xs">
                  {session.username}
                </Badge>
                {session.type === "admin" && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Show create post button only for admins */}
              {session.type === "admin" && <CreatePostForm />}

              <form action={logout}>
                <Button variant="outline" type="submit" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Description */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-black">Comunicados da Administração</h2>
            <p className="text-gray-600 text-sm">
              {session.type === "admin"
                ? "Compartilhe comunicados importantes com todos os usuários"
                : "Acompanhe os comunicados mais recentes da administração"}
            </p>
            {postsWithLikes.length > 0 && (
              <p className="text-xs text-gray-500">Mostrando os {postsWithLikes.length} comunicados mais recentes</p>
            )}
          </div>

          {/* Posts List */}
          <PostsList posts={postsWithLikes} userType={session.type} />

          {/* Footer Info */}
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              {session.type === "admin"
                ? "Apenas administradores podem criar posts. Os posts mais antigos são removidos automaticamente."
                : "Curta os posts que você considera úteis usando o botão da moedinha."}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
