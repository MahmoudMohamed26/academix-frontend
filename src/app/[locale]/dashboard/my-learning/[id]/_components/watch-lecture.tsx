"use client"

import { toYoutubeEmbed } from "@/helpers/to-youtube-embed"
import { truncateText } from "@/helpers/word-cut"
import useAxios from "@/hooks/useAxios"
import { getCourse } from "@/lib/api/Courses"
import { getLectureData, getLectureVideo } from "@/lib/api/Lectures"
import { useQuery } from "@tanstack/react-query"
import { formatDate } from "date-fns"
import { useParams, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import Skeleton from "react-loading-skeleton"

export default function WatchLecture() {
  const { id } = useParams()
  const Axios = useAxios()
  const searchParams = useSearchParams()
  const { t } = useTranslation()

  const sectionId = searchParams.get("section")
  const lectureId = searchParams.get("v")
  const isVideo = !!sectionId && !!lectureId

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourse(Axios, id),
    staleTime: 10 * 60 * 1000,
  })

  const { data: lecture, isLoading: lectureLoading } = useQuery({
    queryKey: ["lecture", id, sectionId, lectureId],
    queryFn: () => getLectureData(Axios, id, sectionId, lectureId),
    staleTime: 10 * 60 * 1000,
    enabled: isVideo,
  })

  const { data: lectureUrl, isLoading: urlLoading } = useQuery({
    queryKey: ["lecture_url", sectionId, lectureId],
    queryFn: () => getLectureVideo(Axios, id, sectionId, lectureId),
    staleTime: 10 * 60 * 1000,
    enabled: isVideo,
  })

  console.log(course?.created);

  const [expandDesc, setExpandDesc] = useState<boolean>(false)
  return (
    <>
      {isLoading || (isVideo && (lectureLoading || urlLoading)) ? (
        <>
          <div>
            <Skeleton className="aspect-[2/1.11]!" />
          </div>
          <Skeleton className="w-full! h-8! my-2" />
          <Skeleton className="w-full! h-[88px] my-2" />
        </>
      ) : (
        <>
          <div>
            <iframe
              suppressHydrationWarning
              className="w-full aspect-[2/1.125]"
              src={toYoutubeEmbed(isVideo ? lectureUrl : course?.video_url as any)}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <h2 className="text-[#333] font-bold text-2xl my-2">
            {isVideo ? lecture?.title : course?.title}
          </h2>
          <button
            onClick={() => setExpandDesc((prev) => !prev)}
            className="bg-gray-100 cursor-pointer hover:bg-gray-200 my-2 text-sm py-4 px-2 w-full text-start rounded-md"
          >
            <span className="text-xs text-[#666]">
              {t("Dashboard.myLearning.created")} {formatDate(isVideo ? lecture?.created as any : course?.created as any, "MMMM dd, yyyy")},
            </span>
            <span className="text-xs text-[#666]">
              {" "}
              {t("Dashboard.myLearning.updated")} {formatDate(isVideo ? lecture?.updated as any : course?.updated as any, "MMMM dd, yyyy")}
            </span>
            <p className="mt-4 text-[#333]">
              {!isVideo ? course?.short_description : lecture?.content.length as any > 40
                ? expandDesc
                  ? lecture?.content
                  : truncateText(lecture?.content as any, 40)
                : lecture?.content}
            </p>
          </button>
        </>
      )}
    </>
  )
}
