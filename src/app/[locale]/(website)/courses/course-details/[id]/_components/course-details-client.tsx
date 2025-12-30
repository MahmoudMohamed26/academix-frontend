"use client"

import Breadcrumb from "@/components/BreadCrumb"
import { Course } from "@/lib/types/course"
import { Section } from "@/lib/types/section"
import { formatDate } from "date-fns"
import {
  BadgeCheck,
  BookText,
  Clock,
  Heart,
  MonitorPlay,
  OctagonAlert,
  Presentation,
  Section as SectionIcon,
  Star,
  StarHalf,
  Trophy,
  User,
  Users,
} from "lucide-react"
import Image from "next/image"
import DOMPurify from "dompurify"
import { useEffect, useState } from "react"
import SectionItem from "./section-item"
import truncate from "truncate-html"

type CourseDetailsClientProps = {
  course: Course
  sections: Section[]
}

export default function CourseDetailsClient({
  course,
  sections,
}: CourseDetailsClientProps) {
  const [halfStar, setHalfStar] = useState(false)
  const [restStars, setRestStars] = useState(5)
  const [showAll, setShowAll] = useState<boolean>(false)
  const cleanHtml = DOMPurify.sanitize(course?.detailed_description || "")

  const html = showAll
  ? cleanHtml
  : truncate(cleanHtml, 1000)

  useEffect(() => {
    course?.rating_avg || 0 - Math.floor(course?.rating_avg || 0) >= 0.5
      ? setHalfStar(true)
      : setHalfStar(false)
    halfStar
      ? setRestStars(5 - Math.floor(course?.rating_avg || 0) - 1)
      : setRestStars(5 - Math.floor(course?.rating_avg || 0))
  }, [course])

  return (
    <>
      <div className="bg-[#17161C] pt-5 pb-20">
        <div className="container text-white">
          <Breadcrumb textColor="main" />
          <div className="w-full lg:max-w-[600px] xl:max-w-[800px]">
            <h1 className="text-4xl font-semibold">{course?.title}</h1>
            <p className="mt-5 text-[oklch(100%_0_0)]">
              {course?.short_description}
            </p>
            <p className="mt-10 text-xs">
              <span className="flex gap-2 items-center">
                <User size={18} /> Created by {course?.instructor}
              </span>
              <span className="flex gap-2 mt-4 items-center">
                <OctagonAlert size={18} /> Last Updated{" "}
                {formatDate(course?.updated as any, "MMMM dd, yyyy")}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="container flex flex-col-reverse lg:flex-row lg:gap-0 gap-10 items-start justify-between lg:-mt-12!">
        <div className="xl:w-[800px] lg:w-[623px] w-full">
          <section className="rounded-md justify-between overflow-hidden flex flex-col md:flex-row items-center border bg-white">
            <div className="md:bg-(--main-color) p-5 flex flex-col gap-2 justify-center border-b md:border-none items-center w-full md:w-[calc(100%/4)] md:text-white">
              <BadgeCheck size={25} />
              <p className="font-semibold">Verified</p>
            </div>
            <div className="flex flex-col items-center gap-1 w-full border-b md:border-e md:border-b-0 py-5 md:py-0 md:w-[calc(100%/4)]">
              <p className="text-3xl font-bold">
                {course?.rating_avg.toFixed(1)}
              </p>
              <div className="flex gap-1">
                {Array.from({
                  length: Math.floor(course?.rating_avg || 0),
                }).map((_, index) => (
                  <Star key={index} fill="#C67514" color="#C67514" size={12} />
                ))}
                {halfStar && (
                  <StarHalf fill="#C67514" color="#C67514" size={12} />
                )}
                {Array.from({ length: restStars }).map((_, index) => (
                  <Star key={index} color="#C67514" size={12} />
                ))}
              </div>
              <p className="text-sm underline text-[#666]">
                {course?.rating_counts} Reviews
              </p>
            </div>
            <div className="flex flex-col items-center w-full border-b md:border-e md:border-b-0 py-5 md:py-0 md:w-[calc(100%/4)] gap-1">
              <Presentation size={25} />
              <p className="font-bold">{course?.lectures_count}</p>
              <p className="text-sm underline text-[#666]">Lectures</p>
            </div>
            <div className="flex flex-col items-center gap-1 w-full py-5 md:py-0 md:w-[calc(100%/4)]">
              <Clock size={25} />
              <p className="font-bold">{course?.hours}</p>
              <p className="text-sm underline text-[#666]">Hours</p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-semibold text-2xl">This course includes:</h2>
            <div className="flex flex-col sm:flex-row mt-5 justify-between">
              <ul className="space-y-4 text-[#333]">
                <li className="flex items-center gap-4">
                  <Clock size={16} />
                  <span>{course?.hours} hours of learning</span>
                </li>
                <li className="flex items-center gap-4">
                  <SectionIcon size={16} />
                  <span>{course?.sections_count} Section</span>
                </li>
                <li className="flex items-center gap-4">
                  <MonitorPlay size={16} />
                  <span>{course?.lectures_count} lecture</span>
                </li>
              </ul>
              <ul className="space-y-4 text-[#333] mt-4 sm:mt-0">
                <li className="flex items-center gap-4">
                  <BookText size={16} />
                  <span>12 Quiz to rate your level</span>
                </li>
                <li className="flex items-center gap-4">
                  <Users size={16} />
                  <span>113 Enrolled students</span>
                </li>
                <li className="flex items-center gap-4">
                  <Trophy size={16} />
                  <span>Verified certificate from academix</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-semibold text-2xl">Course Content</h2>
            <div className="mt-5">
              <p className="text-[#333] text-sm mb-2">
                {course?.sections_count} Sections • {course?.lectures_count}{" "}
                Lectures
              </p>
              {sections.map((section, index) => (
                <div key={section.id}>
                  <SectionItem
                    last={sections.length - 1 === index}
                    section={section}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="my-10">
            <h2 className="font-semibold text-2xl">Description:</h2>
            <div
              className="prose mt-4 text-[#333] text-sm"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(html),
              }}
            />
            {course?.detailed_description.length > 4000 && (
              <button onClick={() => setShowAll((prev) => !prev)} className="mt-2 py-2 px-4 bg-orange-100 text-(--main-color) text-sm cursor-pointer rounded-sm">
                {showAll ? "Show less" : "Show all"}
              </button>
            )}
          </section>
        </div>
        <section className="lg:max-w-[350px] w-full lg:p-4 mt-5 lg:-mt-60 lg:shadow-2xl bg-white lg:sticky top-2 flex-1 rounded-sm">
          <div className={`relative rounded-sm h-[300px] lg:h-[175px]`}>
            <Image
              src={course?.image as any}
              fill
              alt={course?.title as any}
              className="object-cover rounded-sm"
              sizes="(max-width: 768px) 100vw, 400px"
              loading="eager"
              unoptimized
            />
          </div>
          <div className="mt-2 space-y-2">
            <p className="text-xs flex gap-2 items-center">
              <BadgeCheck size={12} className="text-(--main-color)" />
              <span className="text-[#666]">
                This course is verified by Academix admins
              </span>
            </p>
            <p className="text-3xl font-bold">${course?.price}</p>
            <p className="text-xs text-[#666]">
              This Course level is rated as {course?.level} level
            </p>
            <div className="flex gap-2 mt-5">
              <button className="w-full py-3 rounded-sm bg-(--main-color) border border-(--main-color) duration-300 text-white hover:bg-(--main-darker-color) cursor-pointer">
                Enroll
              </button>
              <button className="border cursor-pointer duration-300 border-(--main-color) text-(--main-color) hover:bg-(--main-color) group p-2 rounded-sm">
                <Heart
                  className="fill-(--main-color) group-hover:fill-white"
                  size={30}
                />
              </button>
            </div>
            <button className="w-full mt-2 py-3 rounded-sm duration-300 hover:bg-orange-50 bg-white text-(--main-color) border border-(--main-color) cursor-pointer">
              Buy now
            </button>
          </div>
          <p className="text-center mt-4 text-xs text-[#666]">
            30-Day Money-Back Guarantee
          </p>
        </section>
      </div>
    </>
  )
}
