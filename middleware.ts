import { NextResponse, type NextRequest } from "next/server"

async function getSessionFromRequest(request: NextRequest) {
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

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Allow access to home page, admin login, communication page (public), and static files
  const isPublicPath =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/admin/login") ||
    request.nextUrl.pathname.startsWith("/comunicacao-interna") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/favicon")

  if (isPublicPath) {
    return response
  }

  // For protected routes, check session
  const session = await getSessionFromRequest(request)

  if (!session) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Check admin routes
  if (request.nextUrl.pathname.startsWith("/admin") && session.type !== "admin") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Check user routes
  if (request.nextUrl.pathname.startsWith("/dashboard") && session.type !== "user") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
