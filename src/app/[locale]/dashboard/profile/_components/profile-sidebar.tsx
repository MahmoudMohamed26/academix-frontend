"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function ProfileSidebar() {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  
  const linkClasses = (href: string) =>
    pathname === `/${locale}${href}`
      ? "block font-semibold p-2 bg-[#F5F5F5] rounded-sm"
      : "block font-semibold p-2 hover:bg-[#F5F5F5] rounded-sm";

  return (
    <>
      <ul className="py-3 space-y-2 border-b sm:border-none">
        <li>
          <Link
            href={`/${locale}/dashboard/profile/not-ready`}
            className={linkClasses("/dashboard/profile/not-ready")}
          >
            {t("Dashboard.profileSidebar.viewProfile")}
          </Link>
        </li>
        <li>
          <Link
            href={`/${locale}/dashboard/profile/information`}
            className={linkClasses("/dashboard/profile/information")}
          >
            {t("Dashboard.profileSidebar.profileInformation")}
          </Link>
        </li>
        <li>
          <Link
            href={`/${locale}/dashboard/profile/payments`}
            className={linkClasses("/dashboard/profile/payments")}
          >
            {t("Dashboard.profileSidebar.paymentsHistory")}
          </Link>
        </li>
      </ul>
    </>
  )
}