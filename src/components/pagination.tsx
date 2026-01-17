"use client"

import { CourseLinks, PaginationType } from "@/lib/types/course"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"

function isCourseLinks(links: PaginationType): links is CourseLinks {
  return 'prev_cursor' in links
}

function extractPageParam(url: string | null): string | null {
  if (!url) return null
  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.get('page')
  } catch {
    return null
  }
}

export default function Pagination({
  paginationLinks,
}: {
  paginationLinks: PaginationType | undefined
}) {
  const { t, i18n } = useTranslation()
  
  if (!paginationLinks) return null
  
  const prevLink = isCourseLinks(paginationLinks) 
    ? paginationLinks.prev_cursor 
    : extractPageParam(paginationLinks.prev)
    
  const nextLink = isCourseLinks(paginationLinks)
    ? paginationLinks.next_cursor
    : extractPageParam(paginationLinks.next)
  
  return (
    <div className="mt-5 flex gap-2 justify-end">
      {prevLink ? (
        <Link
          href={`?page=${prevLink}`}
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
      {nextLink ? (
        <Link
          href={`?page=${nextLink}`}
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