import { getCourse } from "@/lib/api/Courses"
import { getServerAxios } from "@/lib/axios-server"
import CourseDetailsClient from "./_components/course-details-client"
import { OctagonAlert, User } from "lucide-react"
import Breadcrumb from "@/components/BreadCrumb"
import { formatDate } from "date-fns"
import { 
  dehydrate, 
  HydrationBoundary, 
  QueryClient 
} from "@tanstack/react-query"
import { useTranslation } from "@/lib/i18n-server"

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const axiosInstance = await getServerAxios(locale)
  const { t } = await useTranslation(locale)
  const queryClient = new QueryClient()
  
  await queryClient.prefetchQuery({
    queryKey: ["course", id],
    queryFn: () => getCourse(axiosInstance, id),
    staleTime: 10 * 60 * 1000,
  })

  const course = queryClient.getQueryData(["course", id]) as any

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="bg-[#17161C] pt-5 pb-5 lg:pb-20">
        <div className="container text-white">
          <Breadcrumb textColor="main" />
          <div className="w-full lg:max-w-[600px] xl:max-w-[800px]">
            <h1 className="text-4xl font-semibold">{course?.title}</h1>
            <p className="mt-5 text-[oklch(100%_0_0)]">
              {course?.short_description}
            </p>
            <p className="mt-10 text-xs">
              <span className="flex gap-2 items-center">
                <User size={18} /> Created by {course?.instructor.name}
              </span>
              <span className="flex gap-2 mt-4 items-center">
                <OctagonAlert size={18} /> Last Updated{" "}
                {formatDate(course?.updated as any, "MMMM dd, yyyy")}
              </span>
            </p>
          </div>
        </div>
      </div>
      <CourseDetailsClient course={course} />
    </HydrationBoundary>
  )
}