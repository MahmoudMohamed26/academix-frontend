"use client"

import { Course } from "@/lib/types/course"
import {
  BadgeCheck,
  BookText,
  Clock,
  Heart,
  MonitorPlay,
  Presentation,
  Section as SectionIcon,
  Star,
  StarHalf,
  Trophy,
  User,
  Users,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import truncate from "truncate-html"
import createDOMPurify from "dompurify"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import ShowLinksComponent from "@/components/ShowLinks"
import SectionItem from "./section-item"
import avatarImg from "@/assets/avatar.webp"
import { useQuery } from "@tanstack/react-query"
import { getSections } from "@/lib/api/Sections"
import useAxios from "@/hooks/useAxios"
import Skeleton from "react-loading-skeleton"
import ReviewsDialog from "./reviews-dialog"
import { getCourse } from "@/lib/api/Courses"
import { useTranslation } from "react-i18next"

const getStarDisplay = (rating: number) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating - fullStars >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return { fullStars, hasHalfStar, emptyStars }
}

export default function CourseDetailsClient({
  course: initialCourse,
}: {
  course: Course
}) {
  const [showAll, setShowAll] = useState<boolean>(false)
  const { t, i18n } = useTranslation()
  const [cleanHtml, setCleanHtml] = useState("")
  const [openReviews, setOpenReviews] = useState<boolean>(false)
  const Axios = useAxios()

  const html = showAll ? cleanHtml : truncate(cleanHtml, 1000)

  const { data: course } = useQuery({
    queryKey: ["course", initialCourse.id],
    queryFn: () => getCourse(Axios, initialCourse.id),
    initialData: initialCourse,
    staleTime: 10 * 60 * 1000,
  })

  const { data: sections, isLoading: sectionsLoading } = useQuery({
    queryKey: ["sections", course.id],
    queryFn: () => getSections(Axios, course.id),
    staleTime: 10 * 60 * 1000,
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const DOMPurify = createDOMPurify(window)
      setCleanHtml(DOMPurify.sanitize(course?.detailed_description || ""))
    }
  }, [course])

  const { fullStars, hasHalfStar, emptyStars } = getStarDisplay(
    course?.rating_avg || 0
  )

  console.log(course)

  return (
    <>
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
                {Array.from({ length: fullStars }).map((_, index) => (
                  <Star key={index} fill="#C67514" color="#C67514" size={12} />
                ))}
                {hasHalfStar && (
                  <StarHalf className={`${i18n.language === "ar" ? "rotate-180" : ""}`} fill="#C67514" color="#C67514" size={12} />
                )}
                {Array.from({ length: emptyStars }).map((_, index) => (
                  <Star key={`empty-${index}`} color="#C67514" size={12} />
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
                  <span>{course?.sections_count} Sections</span>
                </li>
                <li className="flex items-center gap-4">
                  <MonitorPlay size={16} />
                  <span>{course?.lectures_count} lectures</span>
                </li>
              </ul>
              <ul className="space-y-4 text-[#333] mt-4 sm:mt-0">
                <li className="flex items-center gap-4">
                  <BookText size={16} />
                  <span>12 Quiz to rate your level</span>
                </li>
                <li className="flex items-center gap-4">
                  <Users size={16} />
                  <span>{course.enrollments_count} Enrolled students</span>
                </li>
                <li className="flex items-center gap-4">
                  <Trophy size={16} />
                  <span>Verified certificate from academix</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-semibold text-2xl">Course Content:</h2>
            <div className="mt-5">
              <p className="text-[#333] text-sm mb-2">
                {course?.sections_count} Sections • {course?.lectures_count}{" "}
                Lectures
              </p>
              {sectionsLoading ? (
                <Skeleton className="w-full! h-[400px]" />
              ) : (
                sections?.map((section, index) => (
                  <div key={section.id}>
                    <SectionItem
                      last={sections.length - 1 === index}
                      section={section}
                    />
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="my-10">
            <h2 className="font-semibold text-2xl">Description:</h2>
            <div
              className="prose mt-4 text-[#333] text-sm"
              dangerouslySetInnerHTML={{
                __html: html,
              }}
            />
            {course?.detailed_description.length > 4000 && (
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="mt-2 py-2 px-4 bg-orange-100 text-(--main-color) text-sm cursor-pointer rounded-sm"
              >
                {showAll ? "Show less" : "Show all"}
              </button>
            )}
          </section>

          <section className="mt-10">
            <h2 className="font-semibold text-2xl">Instructor:</h2>
            <div className="mt-5 flex gap-5">
              <Link href={`/instructors/${course.instructor.id}`}>
                <Avatar className="w-16 h-16">
                  <AvatarImage src={course.instructor.avatar_url as any} />
                  <AvatarFallback>
                    <img src={avatarImg.src as any} alt="avatar fall back" />
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <p className="text-[#333] font-semibold">
                  {course.instructor.name}
                </p>
                {course.instructor.links && (
                  <ShowLinksComponent links={course.instructor.links} />
                )}
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-semibold text-2xl">Reviews:</h2>
            <div className="mt-5 flex gap-5">
              <button
                onClick={() => setOpenReviews((prev) => !prev)}
                className="cursor-pointer w-full outline-none bg-gray-50 rounded-md py-5 flex justify-center flex-col gap-2 hover:bg-gray-100"
              >
                <p className="text-5xl font-bold">
                  {course?.rating_avg.toFixed(1)}
                </p>
                <div className="flex justify-center gap-1">
                  {Array.from({ length: fullStars }).map((_, index) => (
                    <Star
                      key={index}
                      fill="#C67514"
                      color="#C67514"
                      size={12}
                    />
                  ))}
                  {hasHalfStar && (
                    <StarHalf className={`${i18n.language === "ar" ? "rotate-180" : ""}`} fill="#C67514" color="#C67514" size={12} />
                  )}
                  {Array.from({ length: emptyStars }).map((_, index) => (
                    <Star key={`empty-${index}`} color="#C67514" size={12} />
                  ))}
                </div>
                <p className="text-sm underline text-[#666]">
                  {course?.rating_counts} Reviews
                </p>
              </button>
            </div>
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

      <ReviewsDialog
        course={course}
        open={openReviews}
        setOpen={setOpenReviews}
      />
    </>
  )
}
