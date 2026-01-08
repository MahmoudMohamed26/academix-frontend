"use client"

import SingleCourse from "@/components/SingleCourse"
import SpecialHeader from "@/components/SpecialHeader"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Course } from "@/lib/types/course"
import Link from "next/link"
import { useTranslation } from "react-i18next"

export default function FeaturedCourses({ courses }: { courses: Course[] }) {
  const { t, i18n } = useTranslation()
  return (
    <div className="container">
        <SpecialHeader size="big" name="Featured Courses" />
      <Carousel
        className="w-full"
        opts={{
          direction: i18n.language === "ar" ? "rtl" : "ltr",
          slidesToScroll: "auto",
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {courses.map((course) => (
            <CarouselItem
              key={course.id}
              className="pl-2 md:pl-4 md:basis-1/2 xl:basis-1/3 flex"
            >
              <div className="w-full h-full">
                <SingleCourse grid={true} course={course} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className={`shadow-2xl bg-(--main-color) hover:bg-(--main-darker-color) hover:text-white text-white ${
            i18n.language === "ar" ? "-right-2 rotate-180" : "-left-2"
          }`}
        />
        <CarouselNext
          className={`shadow-2xl bg-(--main-color) hover:bg-(--main-darker-color) hover:text-white text-white ${
            i18n.language === "ar"
              ? "right-[calc(100%-25px)] rotate-180"
              : "-right-2"
          }`}
        />
      </Carousel>
      <div className="w-fit m-auto">
        <Link
          href={`/courses?sortBy=rating_avg&orderedBy=desc`}
          className="py-2 block px-5 border border-(--main-color) text-(--main-color) hover:bg-orange-100 cursor-pointer my-10"
        >
          {t("categories.showall")}
        </Link>
      </div>
    </div>
  )
}
