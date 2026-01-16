"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import avatarFallbackImage from "@/assets/avatar.webp"
import {
  Award,
  BookOpen,
  ChartColumnDecreasing,
  Home,
  Link2,
  LogOut,
  Search,
  User,
  UsersRound,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { truncateText } from "@/helpers/word-cut"
import Language from "@/components/Language"

type WebsiteSidebarProps = {
  image?: string | null
  name?: string
  logout?: any
  loading: boolean
}

export default function WebsiteSidebar({
  image,
  name,
  logout,
  loading,
}: WebsiteSidebarProps) {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const navigationItems = [
    {
      title: t("sidebar.home"),
      url: "/",
      icon: Home,
    },
    {
      title: t("sidebar.courses"),
      url: "/courses",
      icon: Search,
    },
    {
      title: t("sidebar.instructors"),
      url: "/instructors",
      icon: UsersRound,
    },
    {
      title: t("sidebar.aboutus"),
      url: "/about-us",
      icon: Link2,
    },
  ]

  const profileNavigation = [
    {
      title: t("sidebar.dashboard"),
      url: "/dashboard",
      icon: ChartColumnDecreasing,
    },
    {
      title: t("sidebar.profile"),
      url: "/profile",
      icon: User,
    },
    {
      title: t("sidebar.myLearning"),
      url: "/dashboard/my-learning",
      icon: BookOpen,
    },
    {
      title: t("sidebar.certificates"),
      url: "/certificates",
      icon: Award,
    },
  ]

  return (
    <>
      <SidebarTrigger onClick={() => setIsOpen(true)} />
      <Sidebar
        forceMobile={true}
        open={isOpen}
        onOpenChange={setIsOpen}
        side={i18n.language === "en" ? "left" : "right"}
        className="border-e"
      >
        <SidebarHeader>
          <div className="flex items-center space-x-2 py-4 px-2">
            <Avatar className="outline-none! w-16 h-16">
              <AvatarImage
                className="rounded-full outline-none!"
                src={image as any}
              />
              <AvatarFallback>
                <Image
                  className="rounded-full"
                  src={avatarFallbackImage}
                  alt="avatar fall back image"
                />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-2xl">{t("welcome")},</p>
              <p>
                {name ? truncateText(name?.split(" ")[0] as any, 10) : "Guest"}
              </p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t("sidebar.navigation")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    onClick={() => setIsOpen(false)}
                  >
                    <SidebarMenuButton asChild>
                      <Link className="py-5" href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {name ? (
            <SidebarGroup>
              <SidebarGroupLabel>{t("sidebar.account")}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {profileNavigation.map((item) => (
                    <SidebarMenuItem
                      key={item.title}
                      onClick={() => setIsOpen(false)}
                    >
                      <SidebarMenuButton asChild>
                        <Link className="py-5" href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem
                    className="py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    <SidebarMenuButton
                      onClick={logout}
                      disabled={loading}
                      className="text-red-500 disabled:opacity-50 hover:text-red-500 cursor-pointer"
                    >
                      <LogOut />
                      {t("sidebar.logout")}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            <div className="p-2">
              <Link
                className="py-2 text-center block px-8 bg-(--main-color) duration-300 border border-(--main-color) text-sm font-semibold text-white rounded-sm hover:bg-(--main-darker-color)"
                href={"/login"}
              >
                {t("sidebar.login")}
              </Link>
              <Link
                className="py-2 text-center mt-2 block px-8 hover:bg-(--main-color) duration-300 hover:text-white font-semibold text-sm border border-(--main-color) rounded-sm"
                href={"/register"}
              >
                {t("sidebar.register")}
              </Link>
            </div>
          )}
          <SidebarMenuItem className="p-2">
              <Language form={2} />
          </SidebarMenuItem>
        </SidebarContent>
      </Sidebar>
    </>
  )
}
