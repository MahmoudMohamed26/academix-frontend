import SpecialHeader from "@/components/SpecialHeader"
import { useTranslation } from "@/lib/i18n-server"
import EditCategory from "./_components/edit-categories-client"

export default async function AddCategoryPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { t } = await useTranslation(locale)
  return (
    <>
      <SpecialHeader name={t("sidebar.editCategories")} />
      <EditCategory />
    </>
  )
}
