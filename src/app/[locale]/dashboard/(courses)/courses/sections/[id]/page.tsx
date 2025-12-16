import SpecialHeader from "@/components/SpecialHeader"
import { useTranslation } from "@/lib/i18n-server"
import SectionsForm from "./_components/SectionsForm"

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { t } = await useTranslation(locale)

  return (
    <div>
      <SpecialHeader name={"Course Sections"} />
      <SectionsForm />
    </div>
  )
}
