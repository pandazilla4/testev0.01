import { createClient } from "@/lib/supabase/server"

export interface User {
  id: string
  username: string
  created_at: string
}

export interface Admin {
  id: string
  username: string
  created_at: string
}

// Simple password comparison for now (in production, use proper hashing)
function comparePassword(plaintext: string, stored: string): boolean {
  // For the admin account, we'll use direct comparison temporarily
  if (stored === "ADMIN2025_TEMP") {
    return plaintext === "ADMIN2025"
  }
  // For other accounts, implement proper bcrypt later
  return plaintext === stored
}

// User authentication
export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const supabase = createClient()

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("is_active", true)
    .single()

  if (error || !user) return null

  const isValid = comparePassword(password, user.password_hash)
  if (!isValid) return null

  return {
    id: user.id,
    username: user.username,
    created_at: user.created_at,
  }
}

// Admin authentication
export async function authenticateAdmin(username: string, password: string): Promise<Admin | null> {
  const supabase = createClient()

  const { data: admin, error } = await supabase
    .from("admins")
    .select("*")
    .eq("username", username)
    .eq("is_active", true)
    .single()

  if (error || !admin) return null

  const isValid = comparePassword(password, admin.password_hash)
  if (!isValid) return null

  return {
    id: admin.id,
    username: admin.username,
    created_at: admin.created_at,
  }
}

// Create user with access code
export async function createUserWithCode(
  username: string,
  password: string,
  accessCode: string,
): Promise<{ success: boolean; message: string }> {
  const supabase = createClient()

  // Check if access code is valid
  const { data: codeData, error: codeError } = await supabase
    .from("access_codes")
    .select("*")
    .eq("code", accessCode)
    .eq("is_active", true)
    .is("used_by_user", null)
    .single()

  if (codeError || !codeData) {
    return { success: false, message: "Código de acesso inválido ou já utilizado" }
  }

  // Check if code is expired
  if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
    return { success: false, message: "Código de acesso expirado" }
  }

  // Check if username already exists
  const { data: existingUser } = await supabase.from("users").select("username").eq("username", username).single()

  if (existingUser) {
    return { success: false, message: "Nome de usuário já existe" }
  }

  // Store password directly for now (implement proper hashing later)
  const passwordHash = password

  // Create user
  const { data: newUser, error: userError } = await supabase
    .from("users")
    .insert({
      username,
      password_hash: passwordHash,
      access_code_used: accessCode,
    })
    .select()
    .single()

  if (userError) {
    return { success: false, message: "Erro ao criar usuário" }
  }

  // Mark access code as used
  await supabase
    .from("access_codes")
    .update({
      used_by_user: newUser.id,
      used_at: new Date().toISOString(),
    })
    .eq("code", accessCode)

  return { success: true, message: "Usuário criado com sucesso!" }
}
