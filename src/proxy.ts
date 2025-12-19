import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const locales = ["en", "ar"]
const defaultLocale = "en"

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

async function isValidToken(token?: string) {
  if (!token) return false
  try {
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js)$/)
  ) {
    return NextResponse.next()
  }

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

  const token = request.cookies.get("access_token")?.value
  const isLoggedIn = await isValidToken(token)

  const isAuthPage = path.startsWith("/login") || path.startsWith("/register")
  const isDashboard = path.startsWith("/dashboard")

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

  if (isLoggedIn && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}`
    return NextResponse.redirect(url)
  }

  if (!isLoggedIn && isDashboard) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    return NextResponse.redirect(url)
  }

  if (token && !isLoggedIn) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`

    const res = NextResponse.redirect(url)
    res.cookies.set("access_token", "", { maxAge: 0, path: "/" })
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
}
