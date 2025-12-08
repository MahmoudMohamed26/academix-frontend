// app/[locale]/dashboard/layout.tsx
import { ClientLayout } from "./components/ClientLayout"
import AppNavbar from "./components/AppNavbar"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { getCategories } from "@/lib/api/Categories"
import { getServerAxios } from "@/lib/axios-server"
import { getUser } from "@/lib/api/User"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Dashboard | Academix",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const queryClient = new QueryClient()
  const serverAxios = await getServerAxios(locale)

  // try {
  //   await queryClient.prefetchQuery({
  //     queryKey: ["loggedInUser"],
  //     queryFn: () => getUser(serverAxios),
  //     staleTime: 10 * 60 * 1000,
  //   })
  // } catch (err: any) {
  //   redirect("/login")
  // }

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientLayout>
        <AppNavbar />
        <div className="p-4">{children}</div>
      </ClientLayout>
    // </HydrationBoundary>
  )
}
