import { cookies } from "next/headers"

// Simple session management without JWT for now
export async function createSession(userId: string, username: string, type: "user" | "admin") {
  const sessionData = JSON.stringify({ userId, username, type, timestamp: Date.now() })

  cookies().set("session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })
}

export async function getSession() {
  const session = cookies().get("session")?.value
  if (!session) return null

  try {
    const sessionData = JSON.parse(session)

    // Check if session is expired (24 hours)
    if (Date.now() - sessionData.timestamp > 24 * 60 * 60 * 1000) {
      return null
    }

    return sessionData
  } catch {
    return null
  }
}

export function deleteSession() {
  cookies().delete("session")
}

// For middleware usage
export async function getSessionFromRequest(request: any) {
  const session = request.cookies.get("session")?.value
  if (!session) return null

  try {
    const sessionData = JSON.parse(session)

    // Check if session is expired (24 hours)
    if (Date.now() - sessionData.timestamp > 24 * 60 * 60 * 1000) {
      return null
    }

    return sessionData
  } catch {
    return null
  }
}
