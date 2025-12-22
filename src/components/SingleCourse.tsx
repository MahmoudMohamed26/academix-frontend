"use client"

import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { useTranslation } from "react-i18next"
import { SingleCourseProps } from "@/lib/types/course"

export default function SingleCourse({ grid, course }: SingleCourseProps) {
  const { i18n } = useTranslation()
  return (
    <Link href={"/course"} className="border flex flex-col relative hover:bg-gray-50 rounded-md">
      <div className={`p-4 ${!grid ? "lg:flex lg:flex-row lg:gap-10" : ""} flex-1 flex flex-col`}>
        <div
          className={`rounded-md overflow-hidden ${
            !grid ? "w-full lg:w-[500px]" : ""
          } relative h-[250px]`}
        >
          <Image
            src={course.image}
            fill
            alt={course.title}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            loading="eager"
            unoptimized
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div>
            <h3 className="font-semibold mt-2 text-xl">{course.title}</h3>
            <p className="text-sm text-[#666] mt-2">
              {course.short_description}
            </p>
            <p className="text-xs mt-2 text-[#666]">{course.instructor}</p>
          </div>
          <div className={`${grid ? "mt-auto" : "mt-auto"}`}>
            <div className="flex gap-2 flex-wrap mt-8 text-[#333]">
              <span className="border rounded-sm py-1 px-2 flex gap-1 items-center text-xs">
                {i18n.language === "en"
                  ? course.category.name_en
                  : course.category.name_ar}
              </span>
              <span className="border rounded-sm py-1 px-2 flex gap-1 items-center text-xs">
                <Star fill="#C67514" color="#C67514" size={12} />
                {course.rating_avg}
              </span>
              <span className="border rounded-sm py-1 px-2 flex gap-1 items-center text-xs">
                Reviews ({course.rating_counts})
              </span>
              <span className="border rounded-sm py-1 px-2 flex gap-1 items-center text-xs">
                Total hours {course.hours}
              </span>
              <span className="border rounded-sm py-1 px-2 flex gap-1 items-center text-xs">
                Lectures
              </span>
              <span className="border rounded-sm py-1 px-2 flex gap-1 items-center text-xs">
                {course.level}
              </span>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-3xl font-bold">${course.price}</p>
              <button className="bg-(--main-color) py-2 px-4 text-white text-sm rounded-md cursor-pointer duration-300 hover:bg-transparent border border-(--main-color) hover:text-(--main-color)">
                Enroll now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}