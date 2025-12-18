import NavBar from "./_components/nav-bar"
import { ClientLayoutHome } from "./_components/ClientLayout"
import { getServerAxios } from "@/lib/axios-server"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { getUser } from "@/lib/api/User"
import { getCategories } from "@/lib/api/Categories"

export default async function HomeLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const axiosInstance = await getServerAxios(locale)

  const queryClient = new QueryClient()
  try {
    await queryClient.fetchQuery({
      queryKey: ["loggedInUser"],
      queryFn: () => getUser(axiosInstance),
      staleTime: 10 * 60 * 1000,
    })
  } catch (err) {
    console.log("User not logged in (401)")
  }

  try {
    await queryClient.fetchQuery({
      queryKey: ["categories"],
      queryFn: () => getCategories(axiosInstance),
      staleTime: 10 * 60 * 1000,
    })
  } catch (err) {
    console.log("err")
  }
  return (
    <>
      <ClientLayoutHome>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <NavBar />
          {children}
        </HydrationBoundary>
      </ClientLayoutHome>
    </>
  )
}
