"use client"

import Language from "@/components/Language"
import Logo from "@/components/Logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useAxios from "@/hooks/useAxios"
import { getCategories } from "@/lib/api/Categories"
import { getUser } from "@/lib/api/User"
import { Category } from "@/lib/types/category"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import avatarFallbackImage from "@/assets/avatar.webp"
import { QueryClient, useQuery } from "@tanstack/react-query"
import {
  Award,
  BookOpenText,
  ChartNoAxesColumn,
  Heart,
  LogOut,
  Search,
  ShoppingCart,
  User,
} from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import Image from "next/image"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { truncateText } from "@/helpers/word-cut"
import WebsiteSidebar from "./side-bar"

export default function NavBar() {
  const { t, i18n } = useTranslation()
  const Axios = useAxios()

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: () => getUser(Axios),
    staleTime: 10 * 60 * 1000,
    retry: false,
  })

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(Axios),
    staleTime: 10 * 60 * 1000,
  })

  const getCategoryName = (category: Category) => {
    return i18n.language === "ar" ? category.name_ar : category.name_en
  }

  const showCategories = categories?.map((el, index) => {
    return (
      <li key={index}>
        <Link
          className="hover:bg-orange-100 text-sm hover:text-(--main-color) rounded-sm py-2 px-4"
          href={`/courses/${el.id}`}
        >
          {getCategoryName(el)}
        </Link>
      </li>
    )
  })

  const queryClient = new QueryClient()
  const router = useRouter()

  async function logout() {
    try {
      await Axios.post("/auth/logout")
      toast.success(t("sidebar.logoutSuccess"))
      queryClient.removeQueries({ queryKey: ["loggedInUser"] })
      router.replace("/login")
      router.refresh()
    } catch (err) {
      console.log(err)
      toast.error(t("genericError"))
    }
  }

  return (
    <div>
      <div className="bg-[#333]">
        <div className="flex justify-between container items-center">
          <p className="text-xs font-semibold text-white">CURRENCY: US</p>
          <Language form={3} />
        </div>
      </div>
      <div className="flex items-center justify-between container py-1!">
        <div className="flex items-center gap-3">
          <Logo h={64} w={64} />
          <div className="relative w-fit overflow-hidden flex-1 rounded-sm">
            <input
              type="text"
              name="search"
              placeholder={t("DashNavbar.searchPlaceholder")}
              className="border focus:border-(--main-color) text-gray-700 duration-300 text-sm py-2 border-[#e2e6f1] my-0 pe-[63px] xl:pe-[115px] rounded-sm outline-none p-2 xl:w-[500px] md:w-[250px] w-full"
            />
            <button className="hover:bg-(--main-darker-color) border-(--main-darker-color) duration-300 text-white font-semibold cursor-pointer h-full bg-(--main-color) px-5 absolute end-0 translate-y-half top-1/2">
              <div className="flex gap-1 items-center">
                <p className="hidden xl:block">{t("DashNavbar.search")}</p>
                <Search size={15} />
              </div>
            </button>
          </div>
          <ul className="gap-2 hidden lg:flex">
            <li>
              <a
                className="hover:bg-orange-100 text-sm hover:text-(--main-color) rounded-sm py-2 px-4"
                href="/"
              >
                {t("sidebar.home")}
              </a>
            </li>
            <li>
              <a
                className="hover:bg-orange-100 text-sm hover:text-(--main-color) rounded-sm py-2 px-4"
                href="/"
              >
                {t("sidebar.courses")}
              </a>
            </li>
            <li>
              <a
                className="hover:bg-orange-100 text-sm hover:text-(--main-color) rounded-sm py-2 px-4"
                href="/"
              >
                {t("sidebar.instructors")}
              </a>
            </li>
            <li>
              <a
                className="hover:bg-orange-100 text-sm hover:text-(--main-color) rounded-sm py-2 px-4"
                href="/"
              >
                {t("sidebar.aboutus")}
              </a>
            </li>
          </ul>
        </div>

        {user ? (
          <div className="items-center gap-5 hidden lg:flex">
            <Link href={"/cart"} className="relative">
              <span className="text-xs text-white bg-red-600 rounded-full absolute -top-3 -end-3 px-[7px] py-0.5 ">
                2
              </span>
              <Heart className="text-[#666]" />
            </Link>
            <Link href={"/cart"} className="relative">
              <span className="text-xs text-white bg-red-600 rounded-full absolute -top-3 -end-3 px-[7px] py-0.5 ">
                2
              </span>
              <ShoppingCart className="text-[#666]" />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 cursor-pointer">
                <Avatar className="outline-none!">
                  <AvatarImage
                    className="rounded-full outline-none!"
                    src={user?.avatar_url as any}
                  />
                  <AvatarFallback>
                    <Image
                      className="rounded-full"
                      src={avatarFallbackImage}
                      alt="avatar fall back image"
                    />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-[200px]"
                align={i18n.language === "en" ? "end" : "start"}
              >
                <DropdownMenuLabel dir={i18n.language === "ar" ? "rtl" : "ltr"}>
                  {t("welcome")}, {truncateText(user?.name.split(" ")[0], 10)}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem dir={i18n.language === "ar" ? "rtl" : "ltr"}>
                  <Link className="flex gap-2 w-full p-1.5" href="/dashboard">
                    <ChartNoAxesColumn /> {t("sidebar.dashboard")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem dir={i18n.language === "ar" ? "rtl" : "ltr"}>
                  <Link
                    className="flex gap-2 w-full p-1.5"
                    href="/dashboard/profile"
                  >
                    <User /> {t("sidebar.profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem dir={i18n.language === "ar" ? "rtl" : "ltr"}>
                  <Link
                    className="flex gap-2 w-full p-1.5"
                    href="/dashboard/my-learning"
                  >
                    <BookOpenText /> {t("sidebar.myLearning")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem dir={i18n.language === "ar" ? "rtl" : "ltr"}>
                  <Link
                    className="flex gap-2 w-full p-1.5"
                    href="/dashboard/certificates"
                  >
                    <Award /> {t("sidebar.certificates")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  dir={i18n.language === "ar" ? "rtl" : "ltr"}
                  className="cursor-pointer p-1.5! text-red-500 hover:text-red-500!"
                  onClick={logout}
                >
                  <LogOut
                    className={`${i18n.language === "ar" && "rotate-180"} text-red-500`}
                    size={20}
                  />
                  {t("sidebar.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="lg:flex hidden gap-2">
            <Link
              className="py-2 px-8 bg-(--main-color) duration-300 border border-(--main-color) text-sm font-semibold text-white rounded-sm hover:bg-(--main-darker-color)"
              href={"/login"}
            >
              {t("sidebar.login")}
            </Link>
            <Link
              className="py-2 px-8 hover:bg-(--main-color) duration-300 hover:text-white font-semibold text-sm border border-(--main-color) rounded-sm"
              href={"/login"}
            >
              {t("sidebar.register")}
            </Link>
          </div>
        )}
        <div className="lg:hidden">
          <WebsiteSidebar
            image={user?.avatar_url}
            name={user?.name}
            logout={logout}
          />
        </div>
      </div>
      <div className="container">
        <hr />
      </div>
      <ul className="flex flex-wrap gap-5 container py-4!">
        {showCategories}
        <li>
          <Link
            className="hover:bg-orange-100 hover:text-(--main-color) rounded-sm py-2 px-4"
            href="/categories"
          >
            Show all...
          </Link>
        </li>
      </ul>
    </div>
  )
}
