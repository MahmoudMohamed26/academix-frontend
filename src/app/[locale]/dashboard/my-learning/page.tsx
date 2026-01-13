import SpecialHeader from "@/components/SpecialHeader"
import MyLearningClient from "./_components/my-learning-client"
import { useTranslation } from "@/lib/i18n-server"

export default async function MyLearning({
  params,
}: {
  params: Promise<{ locale: string }>
}) {

  const { locale } = await params
  const { t } = await useTranslation(locale)

  return (
    <div>
      <SpecialHeader name={t("Dashboard.myLearning.title")} />
      <MyLearningClient />
    </div>
  )
}
