import { getSession } from "@/lib/session"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LogOut, Shield, MessageSquare } from "lucide-react"
import { logout } from "@/lib/actions/auth"
import CreatePostForm from "@/components/create-post-form"
import PostsList from "@/components/posts-list"
import Link from "next/link"

// Public component for non-logged users
async function PublicCommunication() {
  const supabase = createClient()

  // Get the 3 most recent posts (public view)
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      likes_count,
      created_at,
      admin_username
    `)
    .order("created_at", { ascending: false })
    .limit(3)

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black text-xs sm:text-sm">
                  ← Voltar
                </Button>
              </Link>
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-black flex-shrink-0" />
                <h1 className="text-lg sm:text-xl font-bold text-black truncate">Comunicação Interna</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link href="/">
                <Button size="sm" className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm">
                  Fazer Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Page Description */}
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-black">Comunicados da Administração</h2>
            <p className="text-gray-600 text-sm">Acompanhe os comunicados mais recentes da administração</p>
            {posts && posts.length > 0 && (
              <p className="text-xs text-gray-500">Mostrando os {posts.length} comunicados mais recentes</p>
            )}
          </div>

          {/* Posts List */}
          <PostsList posts={posts || []} userType={null} />

          {/* Footer Info */}
          <div className="text-center pt-6 sm:pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-4">
              Faça login para curtir os posts e acessar todas as funcionalidades.
            </p>
            <Link href="/">
              <Button className="bg-black hover:bg-gray-800 text-white text-sm">Fazer Login / Criar Conta</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default async function ComunicacaoInternaPage() {
  const session = await getSession()

  // If no session, show public view
  if (!session) {
    return <PublicCommunication />
  }

  // If session exists but wrong type, show public view
  if (session.type !== "user" && session.type !== "admin") {
    return <PublicCommunication />
  }

  const supabase = createClient()

  // Get the 3 most recent posts
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      likes_count,
      created_at,
      admin_username
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
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
              <Link href={session.type === "admin" ? "/admin" : "/dashboard"}>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black text-xs sm:text-sm">
                  ← Voltar
                </Button>
              </Link>
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-black flex-shrink-0" />
                <h1 className="text-lg sm:text-xl font-bold text-black truncate">Comunicação Interna</h1>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Badge variant="secondary" className="text-xs">
                  <span className="truncate max-w-16 sm:max-w-none">{session.username}</span>
                </Badge>
                {session.type === "admin" && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Admin</span>
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Show create post button only for admins */}
              {session.type === "admin" && <CreatePostForm />}

              <form action={logout}>
                <Button
                  variant="outline"
                  size="sm"
                  type="submit"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Page Description */}
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-black">Comunicados da Administração</h2>
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
          <div className="text-center pt-6 sm:pt-8 border-t border-gray-200">
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
