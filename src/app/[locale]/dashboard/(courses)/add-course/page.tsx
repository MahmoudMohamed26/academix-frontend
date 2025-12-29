import SpecialHeader from "@/components/SpecialHeader"
import { useTranslation } from "@/lib/i18n-server"
import AddCourseForm from "./_components/add-course-form"

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { t } = await useTranslation(locale)

  return (
    <div>
      <SpecialHeader name={t("Dashboard.addCourse.title")} />
        <AddCourseForm />
    </div>
  )
}
