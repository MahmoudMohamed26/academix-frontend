import SpecialHeader from "@/components/SpecialHeader"
import { useTranslation } from "@/lib/i18n-server"
import CategoriesClient from "./_components/categories-client"
import { getServerAxios } from "@/lib/axios-server"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { getCategories } from "@/lib/api/Categories"
import { getCourses } from "@/lib/api/Courses"
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
    title: isArabic
      ? "تصنيفات الدورات | أكاديمكس"
      : "Course Categories | Academix",

    description: isArabic
      ? "استكشف تصنيفات الدورات في أكاديمكس، بما في ذلك البرمجة، التصميم، والتقنية، مع أفضل الدورات في كل مجال."
      : "Explore course categories on Academix, including programming, design, and technology, with top courses in each category.",

    openGraph: {
      title: isArabic
        ? "تصنيفات الدورات | أكاديمكس"
        : "Course Categories | Academix",

      description: isArabic
        ? "تصفح تصنيفات الدورات التعليمية مع مجموعة مختارة من أفضل الدورات في كل تصنيف."
        : "Browse learning categories with a curated selection of top courses in each category.",

      url: `${siteUrl}/${locale}/categories`,
      siteName: "Academix",
      images: [
        {
          url: `${siteUrl}/og/categories.png`,
          width: 1200,
          height: 630,
          alt: "Academix Course Categories",
        },
      ],
      locale: isArabic ? "ar_AR" : "en_US",
      type: "website",
    },

    alternates: {
      canonical: `${siteUrl}/${locale}/categories`,
      languages: {
        en: `${siteUrl}/en/categories`,
        ar: `${siteUrl}/ar/categories`,
      },
    },

    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { t } = await useTranslation(locale)
  const axiosInstance = await getServerAxios(locale)
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(axiosInstance),
  })

  await queryClient.prefetchQuery({
    queryKey: ["courses"],
    queryFn: () => getCourses(axiosInstance),
  })

  return (
    <>
      <div className="mt-5! container">
        <SpecialHeader name={t("categories.title")} size="big" />
        <p className="text-[#666]">{t("categories.description")}</p>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CategoriesClient />
        </HydrationBoundary>
      </div>
    </>
  )
}
