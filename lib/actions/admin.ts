"use server"

import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/session"
import { revalidatePath } from "next/cache"

// Generate random access code
function generateAccessCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function createAccessCode(prevState: any, formData: FormData) {
  const session = await getSession()

  if (!session || session.type !== "admin") {
    return { error: "Acesso negado" }
  }

  const expiresAt = formData.get("expiresAt") as string
  const supabase = createClient()

  const code = generateAccessCode()

  const { error } = await supabase.from("access_codes").insert({
    code,
    created_by_admin: session.userId,
    expires_at: expiresAt || null,
  })

  if (error) {
    return { error: "Erro ao criar código de acesso" }
  }

  revalidatePath("/admin")
  return { success: `Código criado: ${code}` }
}

export async function createUserAccessCode(prevState: any, formData: FormData) {
  const session = await getSession()

  if (!session || session.type !== "user") {
    return { error: "Acesso negado" }
  }

  const supabase = createClient()

  // Check if user has reached the limit
  const { data: user } = await supabase.from("users").select("codes_created_count").eq("id", session.userId).single()

  if (user && user.codes_created_count >= 3) {
    return { error: "Você já criou o máximo de 3 códigos de acesso" }
  }

  const expiresAt = formData.get("expiresAt") as string
  const code = generateAccessCode()

  const { error } = await supabase.from("access_codes").insert({
    code,
    created_by_user: session.userId,
    expires_at: expiresAt || null,
  })

  if (error) {
    return { error: "Erro ao criar código de acesso" }
  }

  // Update user's code count
  await supabase
    .from("users")
    .update({ codes_created_count: (user?.codes_created_count || 0) + 1 })
    .eq("id", session.userId)

  revalidatePath("/dashboard")
  return { success: `Código criado: ${code}` }
}

export async function deactivateAccessCode(codeId: string) {
  const session = await getSession()

  if (!session || (session.type !== "admin" && session.type !== "user")) {
    return { error: "Acesso negado" }
  }

  const supabase = createClient()

  const { error } = await supabase.from("access_codes").update({ is_active: false }).eq("id", codeId)

  if (error) {
    return { error: "Erro ao desativar código" }
  }

  revalidatePath("/admin")
  revalidatePath("/dashboard")
  return { success: "Código desativado com sucesso" }
}

export async function sendNotification(prevState: any, formData: FormData) {
  const session = await getSession()

  if (!session || session.type !== "admin") {
    return { error: "Acesso negado" }
  }

  const message = formData.get("message") as string

  if (!message) {
    return { error: "Mensagem é obrigatória" }
  }

  const supabase = createClient()

  const { error } = await supabase.from("notifications").insert({
    message,
    created_by_admin: session.userId,
  })

  if (error) {
    return { error: "Erro ao enviar notificação" }
  }

  revalidatePath("/admin")
  return { success: "Notificação enviada com sucesso!" }
}

export async function promoteToAdmin(userId: string) {
  const session = await getSession()

  if (!session || session.type !== "admin") {
    return { error: "Acesso negado" }
  }

  const supabase = createClient()

  const { error } = await supabase.from("users").update({ is_admin: true }).eq("id", userId)

  if (error) {
    return { error: "Erro ao promover usuário" }
  }

  revalidatePath("/admin")
  return { success: "Usuário promovido a administrador" }
}

export async function removeAdmin(userId: string) {
  const session = await getSession()

  if (!session || session.type !== "admin") {
    return { error: "Acesso negado" }
  }

  const supabase = createClient()

  // Check if current user is main admin
  const { data: currentUser } = await supabase.from("users").select("is_main_admin").eq("id", session.userId).single()

  if (!currentUser?.is_main_admin) {
    return { error: "Apenas o administrador principal pode remover outros administradores" }
  }

  // Don't allow removing main admin
  const { error } = await supabase.from("users").update({ is_admin: false }).eq("id", userId).eq("is_main_admin", false)

  if (error) {
    return { error: "Erro ao remover administrador" }
  }

  revalidatePath("/admin")
  return { success: "Administrador removido" }
}
