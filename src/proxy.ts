import { NextRequest, NextResponse } from "next/server"
import { jwtVerify, JWTPayload } from "jose"

const locales = ["en", "ar"]
const defaultLocale = "en"

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

const roleGuards: Record<string, string[]> = {
  "/dashboard/add-course": ["Owner", "instructor"],
}

async function verifyToken(token?: string): Promise<JWTPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  /* ----------------------------------------
    Ignore static & api
  ----------------------------------------- */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js)$/)
  ) {
    return NextResponse.next()
  }

  /* ----------------------------------------
    Locale handling
  ----------------------------------------- */
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )

  if (!hasLocale) {
    const locale = request.cookies.get("NEXT_LOCALE")?.value || defaultLocale
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url)
  }

  const locale = pathname.split("/")[1]
  const path = pathname.replace(`/${locale}`, "") || "/"

  const isDashboard = path.startsWith("/dashboard")
  const isAuthPage = path.startsWith("/login") || path.startsWith("/register")

  /* ----------------------------------------
    Not dashboard → skip auth
  ----------------------------------------- */
  if (!isDashboard) {
    return NextResponse.next()
  }

  /* ----------------------------------------
    Dashboard redirects
  ----------------------------------------- */
  if (path === "/dashboard/profile") {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/dashboard/profile/information`
    return NextResponse.redirect(url)
  }

  if (
    path === "/dashboard/courses/edit" ||
    path === "/dashboard/courses/sections"
  ) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/dashboard/courses`
    return NextResponse.redirect(url)
  }

  /* ----------------------------------------
    Dashboard → auth required
  ----------------------------------------- */
  const token = request.cookies.get("access_token")?.value
  const payload = await verifyToken(token)

  if (!payload) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`

    const res = NextResponse.redirect(url)
    if (token) {
      res.cookies.set("access_token", "", { maxAge: 0, path: "/" })
    }
    return res
  }

  /* ----------------------------------------
    🔐 ROLE-BASED ACCESS (SCALABLE)
  ----------------------------------------- */
  const role = payload.role as string | undefined
  for (const [route, allowedRoles] of Object.entries(roleGuards)) {
    if (path === route && !allowedRoles.includes(role ?? "")) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/dashboard`
      return NextResponse.redirect(url)
    }
  }

  /* ----------------------------------------
    Logged-in user accessing auth pages
  ----------------------------------------- */
  if (isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
}
