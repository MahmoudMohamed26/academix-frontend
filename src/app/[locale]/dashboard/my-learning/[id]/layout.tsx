import { useTranslation } from "@/lib/i18n-server"
import CourseHeader from "./_components/course-header"
import InstructorItem from "./_components/instructor-item"
import SectionList from "./_components/section-list"

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { t } = await useTranslation(locale)

  return (
    <>
      <>
      <CourseHeader />
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="flex-1">
          {children}
          <InstructorItem />
        </div>
        <div className="flex-1">
          <SectionList />
        </div>
      </div>
    </>
    </>
  )
}
