"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

const labels: Record<string, Record<string, string>> = {
  en: {
    home: "Home",
    dashboard: "Dashboard",
    information: "Profile Information",
    courses: "Courses",
    settings: "Settings",
    users: "Users",
    posts: "Posts",
    products: "Products",
    orders: "Orders",
    analytics: "Analytics",
  },
  ar: {
    home: "الرئيسية",
    dashboard: "لوحة التحكم",
    information: "معلومات الملف الشخصي",
    courses: "الدورات",
    settings: "الإعدادات",
    users: "المستخدمون",
    posts: "المنشورات",
    products: "المنتجات",
    orders: "الطلبات",
    analytics: "التحليلات",
  },
}

export default function Breadcrumb({textColor}: {textColor?: "main" | "black"}) {
  const pathname = usePathname()

  const segments = pathname.split("/").filter(Boolean)

  const locales = ["en", "ar"]
  const locale = (locales.includes(segments[0]) ? segments[0] : "en") as "en" | "ar"
  
  const pathSegments = locales.includes(segments[0]) 
    ? segments.slice(1) 
    : segments

  if (pathSegments.length === 0) {
    return null
  }

  const currentLabels = labels[locale]
  const homeLabel = currentLabels.home

  const breadcrumbItems = pathSegments
    .map((segment, index) => {
      if (!currentLabels[segment]) {
        return null
      }

      const href = `/${locale}/${pathSegments.slice(0, index + 1).join("/")}`
      const label = currentLabels[segment]
      const isLast = index === pathSegments.length - 1

      return {
        href,
        label,
        isLast
      }
    })
    .filter((item): item is { href: string; label: string; isLast: boolean } => item !== null)

  const isRtl = locale === "ar"

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className={`flex items-center gap-2 text-sm ${textColor === "main" ? "text-(--main-color)" : "text-gray-600" }`}>
        <li>
          <Link
            href={`/${locale}`}
            className={`flex items-center gap-1 transition-colors ${textColor === "main" ? "hover:text-(--main-darker-color)" : "hover:text-gray-900" }`}
          >
            <Home className="w-4 h-4" />
            <span>{homeLabel}</span>
          </Link>
        </li>

        {breadcrumbItems.map((item) => (
          <li key={item.href} className="flex items-center gap-2">
            <span>
              <ChevronRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            </span>
            {item.isLast ? (
              <span className="font-medium text-gray-900" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className={`transition-colors ${textColor === "main" ? "hover:text-(--main-darker-color)" : "hover:text-gray-900" }`}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}