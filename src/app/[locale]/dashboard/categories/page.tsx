import SpecialHeader from "@/components/SpecialHeader"
import CategoriesClient from "./_components/categories-client"
import { getCategories } from "@/lib/api/Categories"
import { getServerAxios } from "@/lib/axios-server"
import { useTranslation } from "@/lib/i18n-server"
import { TableHeader } from "@/lib/types/table"

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { t } = await useTranslation(locale)
  const axiosServer = await getServerAxios(locale)
  const categories = await getCategories(axiosServer)

  const tableHeaders: TableHeader[] = [
    { key: "name", name: t("Dashboard.categories.name") },
    { key: "createdAt", name: t("Dashboard.categories.createdAt") },
    { key: "updatedAt", name: t("Dashboard.categories.updatedAt") },
    { key: "actions", name: t("Dashboard.categories.actions") },
  ]

  return (
    <div>
      <SpecialHeader name={t("Dashboard.categories.title")} />

      <CategoriesClient
        initialCategories={categories}
        tableHeaders={tableHeaders}
      />
    </div>
  )
}
