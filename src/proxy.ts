// middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const locales = ["en", "ar"]
const defaultLocale = "en"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

async function isValidToken(token: string | undefined) {
  if (!token || !secret) return false

  try {
    await jwtVerify(token, secret)
    return true
  } catch (error) {
    return false
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js)$/)
  ) {
    return NextResponse.next()
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (!pathnameHasLocale) {
    const locale = request.cookies.get("NEXT_LOCALE")?.value || defaultLocale
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url)
  }

  const locale = pathname.split("/")[1] || defaultLocale

  // Redirect /dashboard/profile to /dashboard/profile/information
  const profileMatch = pathname.match(/^\/[^\/]+\/dashboard\/profile\/?$/)
  if (profileMatch) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/dashboard/profile/information`
    return NextResponse.redirect(url)
  }

  const authPages = ["/login", "/register"]
  const protectedPages = ["/dashboard"]

  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/"

  const isAuthPage = authPages.some((page) =>
    pathWithoutLocale.startsWith(page),
  )
  const isProtectedPage = protectedPages.some((page) =>
    pathWithoutLocale.startsWith(page),
  )

  const tokenCookie = request.cookies.get("access_token")
  const token = tokenCookie?.value

  const tokenIsValid = await isValidToken(token)

  if (token && !tokenIsValid) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`

    const res = NextResponse.redirect(url)
    res.cookies.set({
      name: "access_token",
      value: "",
      maxAge: 0,
      path: "/",
    })

    return res
  }

  if (tokenIsValid && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}`
    return NextResponse.redirect(url)
  }

  if (!tokenIsValid && isProtectedPage) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
}