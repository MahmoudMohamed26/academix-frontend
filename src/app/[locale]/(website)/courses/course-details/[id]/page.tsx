import { getCourse } from "@/lib/api/Courses"
import { getServerAxios } from "@/lib/axios-server"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import CourseDetailsClient from "./_components/course-details-client";

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const axiosInstance = await getServerAxios(locale)
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["course-details", id],
    queryFn: () => getCourse(axiosInstance, id),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CourseDetailsClient />
    </HydrationBoundary>
  )
}
