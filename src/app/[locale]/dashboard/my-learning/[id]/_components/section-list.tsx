"use client"

import useAxios from "@/hooks/useAxios"
import { getSections } from "@/lib/api/Sections"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import SectionItem from "./section-item"
import Skeleton from "react-loading-skeleton"
import { useTranslation } from "react-i18next"

export default function SectionList() {
  const { id } = useParams()
  const Axios = useAxios()
  const { t } = useTranslation()
  const { data: sections, isLoading: sectionsLoading } = useQuery({
    queryKey: ["sections", id],
    queryFn: () => getSections(Axios, id),
    staleTime: 10 * 60 * 1000,
  })

  return (
    <div>
      {sectionsLoading ? (
        <div>
          <Skeleton className="w-[100px]! mb-4" height={28} />
          <Skeleton className="w-full!" height={200} />
          <Skeleton className="w-full!" height={200} />
          <Skeleton className="w-full!" height={200} />
        </div>
      ) : (
        <>
          <h3 className="mb-4 font-semibold text-xl text-[#333]">{t("Dashboard.myLearning.sections")}</h3>
          {sections?.map((section, index) => (
            <div key={section.id}>
              <SectionItem
                section={section}
                last={sections.length - 1 === index}
              />
            </div>
          ))}
        </>
      )}
    </div>
  )
}
