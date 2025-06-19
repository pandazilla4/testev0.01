"use server"

import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/session"
import { revalidatePath } from "next/cache"

export async function createPost(prevState: any, formData: FormData) {
  const session = await getSession()

  if (!session || session.type !== "admin") {
    return { error: "Apenas administradores podem criar posts" }
  }

  const content = formData.get("content") as string

  if (!content || content.trim().length === 0) {
    return { error: "O conteúdo do post é obrigatório" }
  }

  if (content.length > 5000) {
    return { error: "O post não pode ter mais de 5000 caracteres" }
  }

  const supabase = createClient()

  try {
    // Create the new post with admin username directly
    const { error: insertError } = await supabase.from("posts").insert({
      admin_id: session.userId,
      admin_username: session.username,
      content: content.trim(),
    })

    if (insertError) {
      console.error("Error creating post:", insertError)
      return { error: "Erro ao criar post" }
    }

    // Keep only the 3 most recent posts (auto-delete older ones)
    const { data: allPosts } = await supabase.from("posts").select("id").order("created_at", { ascending: false })

    if (allPosts && allPosts.length > 3) {
      const postsToDelete = allPosts.slice(3).map((p) => p.id)
      await supabase.from("posts").delete().in("id", postsToDelete)
    }

    revalidatePath("/comunicacao-interna")
    return { success: "Post criado com sucesso!" }
  } catch (error) {
    console.error("Error in createPost:", error)
    return { error: "Erro inesperado ao criar post" }
  }
}

export async function togglePostLike(postId: string) {
  const session = await getSession()

  if (!session || session.type !== "user") {
    return { error: "Apenas usuários podem curtir posts" }
  }

  const supabase = createClient()

  try {
    // Check if user already liked this post
    const { data: existingLike } = await supabase
      .from("post_likes")
      .select("id")
      .eq("user_id", session.userId)
      .eq("post_id", postId)
      .single()

    if (existingLike) {
      // Remove like
      const { error } = await supabase.from("post_likes").delete().eq("user_id", session.userId).eq("post_id", postId)

      if (error) {
        return { error: "Erro ao remover curtida" }
      }
    } else {
      // Add like
      const { error } = await supabase.from("post_likes").insert({
        user_id: session.userId,
        post_id: postId,
      })

      if (error) {
        return { error: "Erro ao curtir post" }
      }
    }

    revalidatePath("/comunicacao-interna")
    return { success: "Curtida atualizada!" }
  } catch (error) {
    console.error("Error in togglePostLike:", error)
    return { error: "Erro inesperado" }
  }
}
