"use client"

import { CourseLinks } from "@/lib/types/course"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"

export default function Pagination({
  paginationLinks,
}: {
  paginationLinks: CourseLinks
}) {
  const { t, i18n } = useTranslation()
  return (
    <div className="my-10 flex gap-2 justify-end">
      {paginationLinks.prev_cursor ? (
        <Link
          scroll={true}
          href={`courses?page=${paginationLinks.prev_cursor}`}
          className="flex items-center hover:underline"
        >
          <ChevronLeft
            className={`${i18n.language === "ar" && "rotate-180"}`}
            size={20}
          />{" "}
          <span>{t("pagination.prev")}</span>
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center disabled:opacity-50"
        >
          <ChevronLeft
            className={`${i18n.language === "ar" && "rotate-180"}`}
            size={20}
          />{" "}
          <span>{t("pagination.prev")}</span>
        </button>
      )}
      {paginationLinks.next_cursor ? (
        <Link
          scroll={true}
          href={`courses?page=${paginationLinks.next_cursor}`}
          className="flex items-center hover:underline"
        >
          <span className="ms-2">{t("pagination.next")}</span>{" "}
          <ChevronRight
            className={`${i18n.language === "ar" && "rotate-180"}`}
            size={20}
          />
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center disabled:opacity-50"
        >
          <span className="ms-2">{t("pagination.next")}</span>{" "}
          <ChevronRight
            className={`${i18n.language === "ar" && "rotate-180"}`}
            size={20}
          />
        </button>
      )}
    </div>
  )
}
