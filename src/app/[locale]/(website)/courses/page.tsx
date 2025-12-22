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
import { CoursePageProps } from "@/lib/types/course"
import { useTranslation } from "@/lib/i18n-server"

export default async function CoursesPage({
  searchParams,
  params,
}: CoursePageProps) {
  const queryClient = new QueryClient()
  const { locale } = await params
  const { t } = await useTranslation(locale)

  const resolvedParams = await searchParams
  const axiosInstance = await getServerAxios()

  const paramsSearch = new URLSearchParams()
  Object.entries(resolvedParams).forEach(([key, value]) => {
    if (value) paramsSearch.append(key, value)
  })

  const url = `/courses/filter${
    paramsSearch.toString() ? `?${paramsSearch.toString()}` : ""
  }`

  await queryClient.prefetchQuery({
    queryKey: ["filtered-courses", resolvedParams],
    queryFn: () => getFilterdCourses(axiosInstance, url),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container">
        <Breadcrumb />
        <SpecialHeader name={t("coursesPage.title")} size="big" />
        <div className="text-[#666] mb-5">
          {resolvedParams.search ? (
            <p className="text-sm">
              {t("coursesPage.resultsFor")} <span className="text-(--main-color) font-bold">"{resolvedParams.search}"</span>
            </p>
          ) : (
            t("coursesPage.description")
          )}
        </div>
        <CoursesList searchParams={resolvedParams} />
      </div>
    </HydrationBoundary>
  )
}
