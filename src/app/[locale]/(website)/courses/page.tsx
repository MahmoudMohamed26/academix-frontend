import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import Breadcrumb from "@/components/BreadCrumb"
import SpecialHeader from "@/components/SpecialHeader"
import CoursesList from "./_components/courses-list"
import { getFilterdCourses } from "@/lib/api/Courses"
import { getServerAxios } from "@/lib/axios-server"
import { useTranslation } from "@/lib/i18n-server"

interface CoursesPageProps {
  searchParams: Promise<{
    category_slug?: string
    level?: string
    min_price?: string
    max_price?: string
    min_hours?: string
    max_hours?: string
    min_rating?: string
    sortBy?: string
    orderedBy?: string
    user_id?: string
    search?: string
  }>
  params: Promise<{ locale: string }>
}

export default async function CoursesPage({ searchParams, params }: CoursesPageProps) {
  const queryClient = new QueryClient()
  const {locale} = await params 
  const { t } = await useTranslation(locale)
  
  const resolvedParams = await searchParams
  const axiosInstance = await getServerAxios()
  
  const paramsSearch = new URLSearchParams()
  Object.entries(resolvedParams).forEach(([key, value]) => {
    if (value) paramsSearch.append(key, value)
  })
  
  const url = `/courses/filter${paramsSearch.toString() ? `?${paramsSearch.toString()}` : ''}`
  
  await queryClient.prefetchQuery({
    queryKey: ["filtered-courses", resolvedParams],
    queryFn: () => getFilterdCourses(axiosInstance, url)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container">
        <Breadcrumb />
        <SpecialHeader name={t("coursesPage.title")} size="big" />
        <CoursesList searchParams={resolvedParams} />
      </div>
    </HydrationBoundary>
  )
}