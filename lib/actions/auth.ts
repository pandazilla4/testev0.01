"use server"

import { authenticateUser, authenticateAdmin, createUserWithCode } from "@/lib/auth"
import { createSession, deleteSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function loginUser(prevState: any, formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) {
    return { error: "Username e senha são obrigatórios" }
  }

  // First try admin authentication
  const admin = await authenticateAdmin(username, password)
  if (admin) {
    await createSession(admin.id, admin.username, "admin")
    redirect("/admin")
  }

  // Then try user authentication
  const user = await authenticateUser(username, password)
  if (user) {
    await createSession(user.id, user.username, "user")
    redirect("/dashboard")
  }

  return { error: "Credenciais inválidas" }
}

export async function registerUser(prevState: any, formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string
  const accessCode = formData.get("accessCode") as string

  if (!username || !password || !accessCode) {
    return { error: "Todos os campos são obrigatórios" }
  }

  const result = await createUserWithCode(username, password, accessCode)

  if (!result.success) {
    return { error: result.message }
  }

  return { success: result.message }
}

export async function logout() {
  deleteSession()
  redirect("/")
}

export async function promoteToAdmin(userId: string) {
  const supabase = createClient()

  const { error } = await supabase.from("users").update({ is_admin: true }).eq("id", userId)

  if (error) {
    return { error: "Erro ao promover usuário" }
  }

  return { success: "Usuário promovido a administrador" }
}

export async function removeAdmin(userId: string) {
  const supabase = createClient()

  const { error } = await supabase.from("users").update({ is_admin: false }).eq("id", userId).eq("is_main_admin", false) // Only non-main admins can be removed

  if (error) {
    return { error: "Erro ao remover administrador" }
  }

  return { success: "Administrador removido" }
}
