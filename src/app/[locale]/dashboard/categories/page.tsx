import SpecialHeader from "@/components/SpecialHeader"
import CategoriesClient from "./_components/categories-client"
import { useTranslation } from "@/lib/i18n-server"
import { TableHeader } from "@/lib/types/table"

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { t } = await useTranslation(locale)

  const tableHeaders: TableHeader[] = [
    { key: "name", name: t("Dashboard.categories.name") },
    { key: "created", name: t("Dashboard.categories.createdAt") },
    { key: "updated", name: t("Dashboard.categories.updatedAt") },
    { key: "actions", name: t("Dashboard.categories.actions") },
  ]

  return (
    <div>
      <SpecialHeader name={t("Dashboard.categories.title")} />

      <CategoriesClient
        tableHeaders={tableHeaders}
      />
    </div>
  )
}
