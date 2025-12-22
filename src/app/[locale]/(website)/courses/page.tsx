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
    queryKey: ["filtered-courses", sanitizedParams],
    queryFn: () => getFilterdCourses(axiosInstance, url),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container">
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