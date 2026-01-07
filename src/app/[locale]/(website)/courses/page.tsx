import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import Breadcrumb from "@/components/BreadCrumb"
import SpecialHeader from "@/components/SpecialHeader"
import CoursesList from "./_components/courses-list"
import { getFilterdCourses } from "@/lib/api/Courses"
import { getServerAxios } from "@/lib/axios-server"
import { CoursePageProps, CourseSearchParams } from "@/lib/types/course"
import { useTranslation } from "@/lib/i18n-server"
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
      ? "جميع الدورات | أكاديمكس"
      : "All Courses | Academix",

    description: isArabic
      ? "تصفح جميع الدورات المتاحة على أكاديمكس في البرمجة، التصميم، والتقنية، مع تقييمات ومحتوى منظم."
      : "Browse all available courses on Academix in programming, design, and technology, with ratings and structured learning paths.",

    openGraph: {
      title: isArabic
        ? "جميع الدورات التعليمية | أكاديمكس"
        : "Browse Online Courses | Academix",

      description: isArabic
        ? "استكشف مجموعة واسعة من الدورات التعليمية مع محتوى احترافي ومدربين خبراء."
        : "Explore a wide range of online courses with expert instructors and structured content.",

      url: `${siteUrl}/${locale}/courses`,
      siteName: "Academix",
      images: [
        {
          url: `${siteUrl}/og/courses.png`,
          width: 1200,
          height: 630,
          alt: "Academix Online Courses",
        },
      ],
      locale: isArabic ? "ar_AR" : "en_US",
      type: "website",
    },

    alternates: {
      canonical: `${siteUrl}/${locale}/courses`,
      languages: {
        en: `${siteUrl}/en/courses`,
        ar: `${siteUrl}/ar/courses`,
      },
    },

    robots: {
      index: true,
      follow: true,
    },
  }
}


const ALLOWED_PARAMS: readonly (keyof CourseSearchParams)[] = [
  "category_slug",
  "level",
  "min_price",
  "max_price",
  "min_hours",
  "max_hours",
  "min_rating",
  "sortBy",
  "orderedBy",
  "user_id",
  "search",
  "page",
] as const

function sanitizeSearchParams(
  params: Record<string, string | undefined>
): CourseSearchParams {
  const sanitized: CourseSearchParams = {}
  
  ALLOWED_PARAMS.forEach((key) => {
    const value = params[key]
    if (value !== undefined && value !== null && value !== "") {
      sanitized[key] = value
    }
  })
  
  return sanitized
}

export default async function CoursesPage({
  searchParams,
  params,
}: CoursePageProps) {
  const queryClient = new QueryClient()
  const { locale } = await params
  const { t } = await useTranslation(locale)

  const resolvedParams = await searchParams
  const axiosInstance = await getServerAxios()

  const sanitizedParams = sanitizeSearchParams(resolvedParams as any)

  const paramsSearch = new URLSearchParams()
  Object.entries(sanitizedParams).forEach(([key, value]) => {
    if (value) paramsSearch.append(key, value)
  })

  const url = `/courses/filter${
    paramsSearch.toString() ? `?${paramsSearch.toString()}` : ""
  }`

  await queryClient.prefetchQuery({
    queryKey: ["courses", sanitizedParams],
    queryFn: () => getFilterdCourses(axiosInstance, url),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container mt-5!">
        <Breadcrumb />
        <SpecialHeader name={t("coursesPage.title")} size="big" />
        <div className="text-[#666] mb-5">
          {sanitizedParams.search ? (
            <p className="text-sm">
              {t("coursesPage.resultsFor")} <span className="text-(--main-color) font-bold">"{sanitizedParams.search}"</span>
            </p>
          ) : (
            t("coursesPage.description")
          )}
        </div>
        <CoursesList searchParams={sanitizedParams} />
      </div>
    </HydrationBoundary>
  )
}