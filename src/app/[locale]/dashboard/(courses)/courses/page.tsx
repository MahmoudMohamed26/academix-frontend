import SpecialHeader from "@/components/SpecialHeader"
import { useTranslation } from "@/lib/i18n-server"
import CoursesClient from "./_components/courses-client"
import { TableHeader } from "@/lib/types/table"

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { t } = await useTranslation(locale)

  const tableHeaders: TableHeader[] = [
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
      <SpecialHeader name={t("Dashboard.courses.pageTitle")} />
        <CoursesClient tableHeaders={tableHeaders} />
    </div>
  )
}
