import { getCourse } from "@/lib/api/Courses"
import { getServerAxios } from "@/lib/axios-server"
import CourseDetailsClient from "./_components/course-details-client";
import { getSections } from "@/lib/api/Sections";

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const axiosInstance = await getServerAxios(locale)

  const course = await getCourse(axiosInstance, id)

  const sections = await getSections(axiosInstance, id)

  return (
      <CourseDetailsClient course={course} sections={sections} />
  )
}
