import SpecialHeader from "@/components/SpecialHeader"
import { useTranslation } from "@/lib/i18n-server"
import EditCourseForm from "./_components/edit-course-form"

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { t } = await useTranslation(locale)
  return (
    <>
      <SpecialHeader name={t("Dashboard.addCourse.editTitle")} />
      <EditCourseForm />
    </>
  )
}
