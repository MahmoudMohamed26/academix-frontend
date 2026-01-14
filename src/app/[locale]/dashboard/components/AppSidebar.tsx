"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  Home,
  Search,
  Award,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Book,
  Dice6,
  Plus,
  NotebookText,
  Loader,
  ChartNoAxesCombined,
} from "lucide-react"
import Logo from "@/components/Logo"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import Language from "@/components/Language"
import useAxios from "@/hooks/useAxios"
import { getCategories } from "@/lib/api/Categories"
import SidebarSkeleton from "./SidebarSkeleton"
import { Category } from "@/lib/types/category"
import { getUser } from "@/lib/api/User"
import Image from "next/image"
import avatarFallbackImage from "@/assets/avatar.webp"
import { getEnrollments } from "@/lib/api/Enrollment"
import { EnrolledCourse } from "@/lib/types/enrolls"
import { truncateText } from "@/helpers/word-cut"

export function AppSidebar() {
  const { i18n, t } = useTranslation()
  const currLang = i18n.language as "en" | "ar"
  const router = useRouter()
  const pathname = usePathname()
  const [openCourses, setOpenCourses] = useState(false)
  const [openCategories, setOpenCategories] = useState(false)

  const { setOpenMobile } = useSidebar()
  const Axios = useAxios()
  const queryClient = useQueryClient()

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: () => getUser(Axios),
    staleTime: 10 * 60 * 1000,
  })

  const { data: categories = [], isLoading: catsLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(Axios),
    staleTime: 10 * 60 * 1000,
  })

  const { data: enrollmentsRes, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["loggedInUser", "enrollments"],
    queryFn: () => getEnrollments(Axios),
    staleTime: 10 * 60 * 1000,
  })

  const handleItemClick = () => {
    if (window.innerWidth < 768) {
      setOpenMobile(false)
    }
  }

  const navigationItems = [
    {
      title: t("sidebar.home"),
      url: "/",
      icon: Home,
      isActive: pathname === `/${currLang}`,
    },
    {
      title: t("sidebar.dashboard"),
      url: `/dashboard`,
      icon: ChartNoAxesCombined,
      isActive: pathname === `/${currLang}/dashboard`,
    },
    {
      title: t("sidebar.browseCourses"),
      url: "/courses",
      icon: Search,
      isActive: pathname === `/${currLang}/courses`,
    },
    {
      title: t("sidebar.myLearning"),
      url: "/dashboard/my-learning",
      icon: BookOpen,
      isActive: pathname === `/${currLang}/dashboard/my-learning`,
    },
    {
      title: t("sidebar.certificates"),
      url: "/certificates",
      icon: Award,
      isActive: pathname === "/certificates",
    },
  ]

  const enrollments: EnrolledCourse[] = enrollmentsRes?.enrollments || []
  const filterEnrollments = enrollments.filter((el) => el.status === "active")

  async function logout() {
    try {
      await Axios.post("/auth/logout")
      toast.success(t("sidebar.logoutSuccess"))
      queryClient.removeQueries({ queryKey: ["loggedInUser"] })
      router.replace("/")
      router.refresh()
    } catch (err) {
      console.log(err)
      toast.error(t("genericError"))
    }
  }
  const getCategoryName = (category: Category) => {
    return currLang === "ar" ? category.name_ar : category.name_en
  }

  return (
    <Sidebar
      side={i18n.language === "en" ? "left" : "right"}
      className="border-e"
    >
      <SidebarHeader>
        <div className="flex items-center justify-center space-x-2 px-2">
          <p className="text-3xl font-bold">Academix</p>
          <Logo w={80} h={80} />
        </div>
      </SidebarHeader>

      {catsLoading || enrollmentsLoading ? (
        <SidebarSkeleton />
      ) : (
        <SidebarContent>
          {/* Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>{t("sidebar.navigation")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link href={item.url} onClick={handleItemClick}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                {/* Courses Collapsible */}
                <Collapsible
                  open={openCourses}
                  onOpenChange={setOpenCourses}
                  className="group/collapsible"
                >
                  <CollapsibleTrigger className="w-full" asChild>
                    <SidebarMenuButton
                      isActive={openCourses}
                      className="group-data-[state=open]/collapsible:bg-sidebar-accent font-semibold"
                    >
                      <Book />
                      {t("sidebar.courses")}
                      <ChevronDown className="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ms-8 my-2 relative before:absolute before:w-px before:h-full before:bg-gray-300 before:-start-2">
                    <Link
                      href="/dashboard/add-course"
                      onClick={handleItemClick}
                    >
                      <SidebarMenuButton
                        isActive={pathname.includes("/add-course")}
                        className="flex items-center my-1 gap-1 w-full text-xs cursor-pointer"
                      >
                        <Plus size={12} />
                        <p>{t("sidebar.addCourse")}</p>
                      </SidebarMenuButton>
                    </Link>

                    <Link href="/dashboard/courses" onClick={handleItemClick}>
                      <SidebarMenuButton
                        isActive={pathname === "/dashboard/courses"}
                        className="flex items-center my-1 gap-1 w-full text-xs cursor-pointer"
                      >
                        <NotebookText size={12} />
                        <p>{t("sidebar.allCourses")}</p>
                      </SidebarMenuButton>
                    </Link>

                    <Link
                      href="/dashboard/pending-courses"
                      onClick={handleItemClick}
                    >
                      <SidebarMenuButton
                        isActive={pathname.includes("/pending-courses")}
                        className="flex items-center my-1 gap-1 w-full text-xs cursor-pointer"
                      >
                        <Loader size={12} />
                        <p>{t("sidebar.pendingCourses")}</p>
                      </SidebarMenuButton>
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                {/* Categories Collapsible */}
                <Collapsible
                  open={openCategories}
                  onOpenChange={setOpenCategories}
                  className="group/collapsible"
                >
                  <CollapsibleTrigger className="w-full" asChild>
                    <SidebarMenuButton
                      isActive={openCategories}
                      className="group-data-[state=open]/collapsible:bg-sidebar-accent font-semibold"
                    >
                      <Dice6 />
                      {t("sidebar.Categories")}
                      <ChevronDown className="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ms-8 my-2 relative before:absolute before:w-px before:h-full before:bg-gray-300 before:-start-2">
                    <Link
                      href="/dashboard/add-category"
                      onClick={handleItemClick}
                    >
                      <SidebarMenuButton
                        isActive={pathname.includes("/add-category")}
                        className="flex items-center my-1 gap-1 w-full text-xs cursor-pointer"
                      >
                        <Plus size={12} />
                        <p>{t("sidebar.addCategories")}</p>
                      </SidebarMenuButton>
                    </Link>

                    <Link
                      href="/dashboard/categories"
                      onClick={handleItemClick}
                    >
                      <SidebarMenuButton
                        isActive={pathname === "/dashboard/categories"}
                        className="flex items-center my-1 gap-1 w-full text-xs cursor-pointer"
                      >
                        <NotebookText size={12} />
                        <p>{t("sidebar.allCategories")}</p>
                      </SidebarMenuButton>
                    </Link>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Continue Learning */}
          {filterEnrollments.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>
                {t("sidebar.continueLearning")}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-3">
                  {filterEnrollments.slice(0,3).map((course, index) => (
                    <Link href={`/dashboard/my-learning/${course.course_id}`} key={index} className="space-y-2 py-1 px-2 hover:bg-sidebar-accent rounded-md block">
                      <div className="flex gap-4 items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {truncateText(course.title, 24)}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {course.progress}%
                        </span>
                      </div>
                      <Progress value={course.progress} />
                      <p className="text-xs text-gray-600">
                        {t("sidebar.by")} Mahmoud Kamel
                      </p>
                    </Link>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Dynamic Categories */}
          <SidebarGroup>
            <SidebarGroupLabel>{t("sidebar.categories")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {categories?.slice(0, 4).map((el: Category, index: number) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Link
                        className="flex justify-between"
                        href={`/courses?category_slug=${el.id}`}
                        onClick={handleItemClick}
                      >
                        <p>{getCategoryName(el)}</p>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      className="flex bg-orange-100 text-(--main-color) hover:bg-orange-100! hover:text-(--main-color)! justify-between"
                      href={`/categories`}
                    >
                      {t("categories.showall")}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      )}

      {/* Footer */}
      <SidebarFooter>
        {userLoading ? (
          <div className="flex gap-2">
            <Skeleton width={32} className="rounded-full!" height={32} />
            <div className="flex-1">
              <Skeleton className="w-full" height={20} />
              <Skeleton className="w-full" height={10} />
            </div>
            <div>
              <Skeleton width={20} height={30} />
            </div>
          </div>
        ) : (
          <>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.includes("/profile")}
                >
                  <Link href="/dashboard/profile" onClick={handleItemClick}>
                    <UserIcon />
                    <span>{t("sidebar.profile")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarMenu className="md:hidden">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div>
                    <Language form={2} />
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.avatar_url as any}
                  alt={t("Dashboard.avatarUpload.avatarAlt")}
                />
                <AvatarFallback>
                  <img
                    className="rounded-full"
                    src={avatarFallbackImage.src}
                    alt="avatar fall back image"
                  />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-600 truncate">{user?.email}</p>
              </div>
              <div title="Logout" onClick={logout}>
                <LogOut
                  className={`text-red-400 cursor-pointer ${
                    i18n.language === "ar" && "rotate-180"
                  } duration-300 hover:text-red-700`}
                  size={20}
                />
              </div>
            </div>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
