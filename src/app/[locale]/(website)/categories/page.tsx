import SpecialHeader from "@/components/SpecialHeader"
import { useTranslation } from "@/lib/i18n-server"
import CategoriesClient from "./_components/categories-client"
import { getServerAxios } from "@/lib/axios-server"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { getCategories } from "@/lib/api/Categories"
import { getCourses } from "@/lib/api/Courses"

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { t } = await useTranslation(locale)
  const axiosInstance = await getServerAxios(locale)
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(axiosInstance),
  })

  await queryClient.prefetchQuery({
    queryKey: ["courses"],
    queryFn: () => getCourses(axiosInstance),
  })

  return (
    <>
      <div className="mt-5! container">
        <SpecialHeader name={t("categories.title")} size="big" />
        <p className="text-[#666]">{t("categories.description")}</p>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CategoriesClient />
        </HydrationBoundary>
      </div>
    </>
  )
}
