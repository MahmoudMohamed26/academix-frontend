"use client"

import Breadcrumb from "@/components/BreadCrumb"
import useAxios from "@/hooks/useAxios"
import { getCourse } from "@/lib/api/Courses"
import { Course } from "@/lib/types/course"
import { Section } from "@/lib/types/section"
import { useQuery } from "@tanstack/react-query"
import { formatDate } from "date-fns"
import {
  BadgeCheck,
  Clock,
  Heart,
  OctagonAlert,
  Presentation,
  Star,
  StarHalf,
  User,
} from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type CourseDetailsClientProps = {
  course: Course,
  sections: Section[]
}

export default function CourseDetailsClient({course, sections}: CourseDetailsClientProps) {
  const { id } = useParams()
  const Axios = useAxios()
  const [halfStar, setHalfStar] = useState(false)
  const [restStars, setRestStars] = useState(5)

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
          <div className="max-w-[600px] xl:max-w-[800px]">
            <h1 className="text-4xl font-semibold">{course?.title}</h1>
            <p className="mt-5 text-[oklch(100%_0_0)]">
              {course?.short_description}
            </p>
            <p className="mt-10 text-xs">
              <span className="flex gap-2 items-center">
                <User size={18} /> Created by {course?.instructor}
              </span>
              <span className="flex gap-2 mt-4 items-center">
                <OctagonAlert size={18} /> Last Updated {" "}
                {formatDate(course?.updated as any, "MMMM dd, yyyy")}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="container flex items-start justify-between -mt-12!">
        <div className="rounded-md w-fit overflow-hidden flex items-center border bg-white">
          <div className="bg-(--main-color) p-5 flex flex-col gap-2 items-center w-fit text-white">
            <BadgeCheck size={25} />
            <p className="font-semibold">Verified</p>
          </div>
          <div className="flex flex-col items-center gap-2 px-15">
            <p className="text-3xl font-bold">
              {course?.rating_avg.toFixed(1)}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: Math.floor(course?.rating_avg || 0) }).map(
                (_, index) => (
                  <Star key={index} fill="#C67514" color="#C67514" size={12} />
                )
              )}
              {halfStar && (
                <StarHalf fill="#C67514" color="#C67514" size={12} />
              )}
              {Array.from({ length: restStars }).map((_, index) => (
                <Star key={index} color="#C67514" size={12} />
              ))}
            </div>
            <p className="text-sm underline text-[#666]">140 Reviews</p>
          </div>
          <div className="h-[70px] border-e"></div>
          <div className="flex flex-col items-center gap-1 px-15">
            <Presentation size={25} />
            <p className="font-bold">{course?.lectures_count}</p>
            <p className="text-sm underline text-[#666]">Lectures</p>
          </div>
          <div className="h-[70px] border-e"></div>
          <div className="flex flex-col items-center gap-1 px-15">
            <Clock size={25} />
            <p className="font-bold">{course?.hours}</p>
            <p className="text-sm underline text-[#666]">Hours</p>
          </div>
          <div className="h-[70px] border-e"></div>
        </div>

        <div className="max-w-[350px] p-4 -mt-60 shadow-2xl bg-white flex-1 rounded-sm">
          <div className={`relative rounded-sm h-[175px]`}>
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
              <span className="text-[#666]">This course is verified by Academix admins</span>
            </p>
            <p className="text-3xl font-bold">${course?.price}</p>
            <p className="text-xs text-[#666]">This Course level is rated as {course?.level} level</p>
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
          <p className="text-center mt-4 text-xs text-[#666]">30-Day Money-Back Guarantee</p>
        </div>
      </div>
    </>
  )
}
