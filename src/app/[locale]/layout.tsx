import { ReactNode } from "react"
import { notFound } from "next/navigation"
import I18nProvider from "@/components/I18nProvider"
import "../../app/globals.css"
import { Providers } from "@/components/Providers"
import NextTopLoader from 'nextjs-toploader';

const locales = ["en", "ar"]

export const metadata = {
  title: "Academix"
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale)) {
    notFound()
  }

  const direction = locale === "ar" ? "rtl" : "ltr"

  return (
    <html lang={locale} dir={direction}>
      <body suppressHydrationWarning>
        <I18nProvider locale={locale}>
          <NextTopLoader color="#F87317" showSpinner={false} />
          <Providers>
            {children}
          </Providers>
        </I18nProvider>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }]
}
