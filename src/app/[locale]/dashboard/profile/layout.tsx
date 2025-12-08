import { AvatarUpload } from "./_components/avatar-upload"
import SpecialHeader from "@/components/SpecialHeader"
import { useTranslation } from "@/lib/i18n-server"
import ProfileSidebar from "./_components/profile-sidebar"
import Breadcrumb from "@/components/BreadCrumb"

export const metadata = {
  title: "Profile | Dashboard | Academix",
}

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
      <Breadcrumb />
      <SpecialHeader name={t("sidebar.profile")} />
      <div className="px-2 py-4 mt-10 bg-white rounded-md">
        <div className="flex gap-8 sm:flex-row flex-col">
          <div className="sm:border-e pe-2">
            <div className="sticky top-0">
              <AvatarUpload />
              <ProfileSidebar />
            </div>
          </div>

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  )
}
