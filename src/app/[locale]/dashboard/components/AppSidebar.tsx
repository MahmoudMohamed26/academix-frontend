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
} from "lucide-react"
import Logo from "@/components/Logo"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { useContext, useState } from "react"
import Language from "@/components/Language"
import useAxios from "@/hooks/useAxios"
import { getCategories } from "@/lib/api/Categories"
import SidebarSkeleton from "./SidebarSkeleton"
import { AuthContext } from "@/context/authContext"
import { Category } from "@/lib/types/category"
import { getUser } from "@/lib/api/User"

export function AppSidebar() {
  const { i18n, t } = useTranslation()
  const currLang = i18n.language as "en" | "ar"
  const router = useRouter()
  const pathname = usePathname()
  const [openCourses, setOpenCourses] = useState(false)
  const [openCategories, setOpenCategories] = useState(false)

  const { setOpenMobile } = useSidebar()
  const Axios = useAxios()

  // const { data: categories = [], isLoading: catsLoading } = useQuery({
  //   queryKey: ["categories"],
  //   queryFn: () => getCategories(Axios),
  //   staleTime: 10 * 60 * 1000,
  // })

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: () => getUser(Axios),
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
      url: "/dashboard",
      icon: Home,
      isActive: pathname === "/dashboard",
    },
    {
      title: t("sidebar.browseCourses"),
      url: "/courses",
      icon: Search,
      isActive: pathname === "/courses",
    },
    {
      title: t("sidebar.myLearning"),
      url: "/learning",
      icon: BookOpen,
      isActive: pathname === "/learning",
    },
    {
      title: t("sidebar.certificates"),
      url: "/certificates",
      icon: Award,
      isActive: pathname === "/certificates",
    },
  ]

    const recentCourses = [
    { title: "React Fundamentals", progress: 75, instructor: "John Doe" },
    { title: "Python for Beginners", progress: 45, instructor: "Jane Smith" },
    { title: "UI/UX Design", progress: 90, instructor: "Mike Johnson" },
  ]

  const secondname = user?.name.split(" ")[1] || ""

  async function logout() {
    try {
      await Axios.post("/auth/logout")
      toast.success(t("sidebar.logoutSuccess"))
      router.replace("/login")
      router.refresh()
    } catch (err) {
      console.log(err)
      toast.error(t("genericError"))
    }
  }

  console.log(user)

  return (
    <Sidebar
      side={i18n.language === "en" ? "left" : "right"}
      className="border-e"
    >
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-2">
          <p className="text-3xl font-bold">Academix</p>
          <Logo w={80} h={80} />
        </div>
      </SidebarHeader>

      {false ? (
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
          <SidebarGroup>
            <SidebarGroupLabel>
              {t("sidebar.continueLearning")}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-3 px-2">
                {recentCourses.map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {course.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {course.progress}%
                      </span>
                    </div>
                    <Progress value={course.progress} />
                    <p className="text-xs text-gray-600">
                      {t("sidebar.by")} {course.instructor}
                    </p>
                  </div>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Dynamic Categories */}
          {/* <SidebarGroup>
            <SidebarGroupLabel>{t("sidebar.categories")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {categories?.map((el: Category, index: number) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.includes(`/category/${el.slug}`)}
                    >
                      <Link
                        className="flex justify-between"
                        href={`/dashboard/category/${el.slug}`}
                        onClick={handleItemClick}
                      >
                        <p>{el.translations[currLang].name}</p>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup> */}
        </SidebarContent>
      )}

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.includes("/profile")}>
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

        {!false ? (
          <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar_url as any} alt={t("Dashboard.avatarUpload.avatarAlt")} />
              <AvatarFallback>
                {user?.name.charAt(0) + secondname.charAt(0)}
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
        ) : (
          <Skeleton height={52} />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
