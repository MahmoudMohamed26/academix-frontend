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
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Home, Search, Award, LogOut, User } from "lucide-react"
import Logo from "../../website/Components/Logo"
import { Link, useNavigate } from "react-router"
import { t } from "i18next"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/Context/AuthContext"
import Language from "@/website/Components/Language"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { toast } from "sonner"

export function AppSidebar() {
  const navigationItems = [
    { title: t("sidebar.home"), url: "/", icon: Home, isActive: true },
    { title: t("sidebar.browseCourses"), url: "/courses", icon: Search },
    { title: t("sidebar.myLearning"), url: "/learning", icon: BookOpen },
    { title: t("sidebar.certificates"), url: "/certificates", icon: Award },
  ]

  const { i18n } = useTranslation()
  const nav = useNavigate()

  const categories = [
    { title: "برمجة الويب", count: 1250, icon: "💻" },
    { title: "Data Science", count: 890, icon: "📊" },
    { title: "Design", count: 670, icon: "🎨" },
    { title: "Marketing", count: 540, icon: "📈" },
    { title: "Business", count: 430, icon: "💼" },
    { title: "Photography", count: 320, icon: "📸" },
  ]

  const recentCourses = [
    { title: "React Fundamentals", progress: 75, instructor: "John Doe" },
    { title: "Python for Beginners", progress: 45, instructor: "Jane Smith" },
    { title: "UI/UX Design", progress: 90, instructor: "Mike Johnson" },
  ]

  const { user } = useAuth()
  let secondname = user.name.split(" ")[1] || ""

  async function logout() {
    try {
      await axios.post("/auth/logout")
      toast.success(t("sidebar.logoutSuccess"))
      nav("/login", { replace: true })
    } catch (err) {
      console.log(err)
      toast.error(t("genericError"))
    }
  }

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

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.navigation")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.continueLearning")}</SidebarGroupLabel>
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

        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.categories")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <SidebarMenuItem key={category.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      className="flex justify-between"
                      to={`/category/${category.title
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      <div className="flex items-center space-x-2">
                        <p className="text-base">{category.icon}</p>
                        <p className="">{category.title}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        ({category.count})
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/profile">
                <User />
                <span>{t("sidebar.profile")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu className="md:hidden">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Language form={2} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>
              {user.name.charAt(0) + secondname.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
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
      </SidebarFooter>
    </Sidebar>
  )
}
