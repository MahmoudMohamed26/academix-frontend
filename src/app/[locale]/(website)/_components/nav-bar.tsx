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
  ShoppingCart,
  User,
} from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { truncateText } from "@/helpers/word-cut"
import WebsiteSidebar from "./side-bar"
import SearchInput from "@/components/Search"
import { useState } from "react"

export default function NavBar() {
  const { t, i18n } = useTranslation()
  const Axios = useAxios()
  const [open , setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false)

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
          className="hover:bg-orange-100 text-sm hover:text-(--main-color) py-2 px-4"
          href={`/courses?category_slug=${el.id}`}
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
      setLoading(true)
      await Axios.post("/auth/logout")
      toast.success(t("sidebar.logoutSuccess"))
      queryClient.removeQueries({ queryKey: ["loggedInUser"] })
      window.location.href = "/";
    } catch (err) {
      console.log(err)
      toast.error(t("genericError"))
      setLoading(false)
    }
  }
  return (
    <div className={`shadow-md z-10 bg-white ${open ? "sticky top-0" : ""}`}>
      <div className="flex items-center gap-5 justify-between container py-1!">
        <div className="flex items-center flex-1 gap-3">
          <Logo h={64} w={64} />
          <SearchInput open={open} setOpen={setOpen} />
          <ul className="gap-2 hidden lg:flex">
            <li>
              <Link
                className="hover:bg-orange-100 text-sm hover:text-(--main-color) rounded-sm py-2 px-4"
                href="/"
              >
                {t("sidebar.home")}
              </Link>
            </li>
            <li>
              <Link
                className="hover:bg-orange-100 text-sm hover:text-(--main-color) rounded-sm py-2 px-4"
                href="/courses"
              >
                {t("sidebar.courses")}
              </Link>
            </li>
            <li>
              <Link
                className="hover:bg-orange-100 text-sm hover:text-(--main-color) rounded-sm py-2 px-4"
                href="/"
              >
                {t("sidebar.instructors")}
              </Link>
            </li>
            <li>
              <Link
                className="hover:bg-orange-100 text-sm hover:text-(--main-color) rounded-sm py-2 px-4"
                href="/"
              >
                {t("sidebar.aboutus")}
              </Link>
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
            <DropdownMenu>
              <DropdownMenuTrigger suppressHydrationWarning className="cursor-pointer">
                <Avatar className="outline-none!">
                  <AvatarImage
                    className="rounded-full h-8 w-8 outline-none!"
                    src={user?.avatar_url as any}
                    alt={`${user?.name} avatar`}
                  />
                  <AvatarFallback>
                    <img
                      className="rounded-full h-8 w-8 bg-gray-100"
                      src={avatarFallbackImage.src}
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
                  className="cursor-pointer disabled:opacity-50 p-1.5! text-red-500 hover:text-red-500!"
                  onClick={logout}
                  disabled={loading}
                >
                  <LogOut
                    className={`${i18n.language === "ar" && "rotate-180"} text-red-500`}
                    size={20}
                  />
                  {t("sidebar.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Language form={3} />
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
              href={"/register"}
            >
              {t("sidebar.register")}
            </Link>
            <Language form={3} />
          </div>
        )}
        <div className="lg:hidden">
          <WebsiteSidebar
            image={user?.avatar_url}
            name={user?.name}
            logout={logout}
            loading={loading}
          />
        </div>
      </div>
      <div className="container">
        <hr />
      </div>
      <ul className="flex gap-y-3 flex-wrap container py-4!">
        {showCategories}
        <li>
          <Link
            className="bg-orange-100 text-sm text-(--main-color) py-2 px-4"
            href="/categories"
          >
            {t("sidebar.showall")}...
          </Link>
        </li>
      </ul>
    </div>
  )
}
