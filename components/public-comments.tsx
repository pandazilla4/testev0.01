import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, MessageSquare, Coins } from "lucide-react"
import Link from "next/link"

export default async function PublicComments() {
  const supabase = createClient()

  // Get the 3 most recent posts with admin info (public view)
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

  const truncateText = (text: string, maxLength = 200) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-gray-600 hover:text-black">
                  ← Voltar
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-6 w-6 text-black" />
                <h1 className="text-xl font-bold text-black">Comentários</h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button className="bg-black hover:bg-gray-800 text-white">Fazer Login</Button>
              </Link>
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
            <p className="text-gray-600 text-sm">Acompanhe os comunicados mais recentes da administração</p>
            {posts && posts.length > 0 && (
              <p className="text-xs text-gray-500">Mostrando os {posts.length} comunicados mais recentes</p>
            )}
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <Card key={post.id} className="border-gray-200 hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          {post.admin.username}
                        </Badge>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{formatDate(post.created_at)}</span>
                      </div>

                      {/* Like count (read-only for public) */}
                      <div className="flex items-center space-x-1 text-xs text-gray-600">
                        <Coins className="h-4 w-4" />
                        <span>{post.likes_count}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <div className="text-sm text-gray-800 whitespace-pre-wrap">{truncateText(post.content)}</div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum comunicado ainda.</p>
                  <p className="text-sm">Os administradores podem criar posts aqui.</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-4">
              Faça login para curtir os posts e acessar todas as funcionalidades.
            </p>
            <Link href="/">
              <Button className="bg-black hover:bg-gray-800 text-white">Fazer Login / Criar Conta</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
