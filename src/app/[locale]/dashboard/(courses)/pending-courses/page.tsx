import SpecialHeader from "@/components/SpecialHeader"
import { useTranslation } from "@/lib/i18n-server"
import { TableHeader } from "@/lib/types/table"
import PendingCourses from "./_components/pending-courses-client"

type CoursePageProps = {
  searchParams: Record<string, string | undefined>
  params: Promise<{ locale: string }>
}

export default async function PendingCoursesPage({
  searchParams,
  params,
}: CoursePageProps) {
  const { locale } = await params
  const resolvedParams = await searchParams
  const { t } = await useTranslation(locale)

  const tableHeaders: TableHeader[] = [
    { key: "image", name: t("Dashboard.courses.image") },
    { key: "title", name: t("Dashboard.courses.title") },
    { key: "category", name: t("Dashboard.courses.category") },
    { key: "short_description", name: t("Dashboard.courses.description") },
    { key: "price", name: t("Dashboard.courses.price") },
    { key: "hours", name: t("Dashboard.courses.hours") },
    { key: "rating_avg", name: t("Dashboard.courses.rating") },
    { key: "created", name: t("Dashboard.courses.createdAt") },
    { key: "updated", name: t("Dashboard.courses.updatedAt") },
    { key: "actions", name: t("Dashboard.courses.actions") },
  ]

  return (
    <div>
      <SpecialHeader name={t("Dashboard.pending-courses.title")} />
      <PendingCourses tableHeaders={tableHeaders} searchParams={resolvedParams} />
    </div>
  )
}
