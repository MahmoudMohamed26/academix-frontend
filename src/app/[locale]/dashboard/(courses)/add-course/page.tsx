import SpecialHeader from "@/components/SpecialHeader"
import { useTranslation } from "@/lib/i18n-server"
import { TableHeader } from "@/lib/types/table"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { getServerAxios } from "@/lib/axios-server"
import AddCourseForm from "./_components/add-course-form"
import { getCategories } from "@/lib/api/Categories"

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { t } = await useTranslation(locale)
  const queryClient = new QueryClient()
  const serverAxios = await getServerAxios(locale)
  const initialCategories = await getCategories(serverAxios)

  return (
    <div>
      <SpecialHeader name={t("Dashboard.addCourse.title")} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AddCourseForm initialCategories={initialCategories} />
      </HydrationBoundary>
    </div>
  )
}
