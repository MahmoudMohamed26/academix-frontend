import LoginForm from "./loginForm"
import bgImg from "@/assets/loginImg.jpeg"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === "ar"
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

  return {
    title: isArabic ? "تسجيل الدخول | أكاديمكس" : "Login | Academix",

    description: isArabic
      ? "سجل الدخول إلى حسابك في أكاديمكس للوصول إلى الدورات ولوحة التحكم."
      : "Log in to your Academix account to access courses and your dashboard.",

    robots: {
      index: false,
      follow: false,
    },

    alternates: {
      canonical: `${siteUrl}/${locale}/login`,
    },
  }
}

export default function LoginPage() {
  return (
    <div className="bg-(--main-bg)">
      <div className="min-h-screen flex justify-center gap-10 lg:justify-between">
        <div className="flex flex-col justify-center items-center grow md:ms-10">
          <LoginForm />
        </div>

        <div
          className="h-screen w-full max-w-4xl hidden lg:block bg-gray-100 sticky top-0 
          before:absolute before:top-0 before:left-0 before:w-full before:h-full 
          before:bg-(--main-color) before:opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImg.src})` }}
        ></div>
      </div>
    </div>
  )
}
