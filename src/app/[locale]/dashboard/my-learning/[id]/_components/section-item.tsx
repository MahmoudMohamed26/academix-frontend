"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Lecture } from "@/lib/types/lecture"
import { Quiz } from "@/lib/types/quiz"
import { ContentItem, Section } from "@/lib/types/section"
import { BookText, ChevronDown, MonitorPlay } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

interface SectionItemProbs {
  section: Section
  last: boolean
}

export default function SectionItem({ section, last }: SectionItemProbs) {
  const [open, setOpen] = useState<boolean>(true)
  const [contents, setContents] = useState<ContentItem[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    const lectureContents: Lecture[] = (section.lectures || []).map(
      (lecture) => ({
        ...lecture,
        type: "lecture" as const,
      })
    )
    const quizContents: Quiz[] = (section.quizzes || []).map((quiz) => ({
      ...quiz,
      type: "quiz" as const,
    }))
    setContents(
      [...lectureContents, ...quizContents].sort(
        (a, b) => a.position - b.position
      )
    )
  }, [section.lectures, section.quizzes])

  return (
    <Collapsible
      open={open}
      className={`border ${!last && open ? "border-b-transparent" : ""}`}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger
        className={`p-4 bg-gray-100 ${open ? "border-b" : ""} w-full text-left`}
      >
        <div className="flex gap-4 items-center">
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              open ? "transform rotate-180" : ""
            }`}
          />
          {section.title}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul>
          {contents.map((content) => (
            <li
              key={content.id}
              className="flex text-[#666] p-3 text-sm justify-between items-center"
            >
              <Link href={content.type === "lecture" ? `?section=${section.id}&v=${content.id}` : `quiz/${content.id}`} className="flex hover:underline gap-2 items-center">
                {content.type === "lecture" ? (
                  <MonitorPlay size={14} />
                ) : (
                  <BookText size={14} />
                )}
                <span>{content.title}</span>
              </Link>
              <p>
                {content.type === "lecture" ? (
                  <span>
                    {content.duration} {t("courseDetails.minute")}
                  </span>
                ) : (
                  <span>
                    {content.points} {t("courseDetails.point")}
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}
