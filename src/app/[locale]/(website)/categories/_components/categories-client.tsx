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
import useAxios from "@/hooks/useAxios"
import { getCategories } from "@/lib/api/Categories"
import { getCourses } from "@/lib/api/Courses"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useTranslation } from "react-i18next"

export default function CategoriesClient() {
  const { t, i18n } = useTranslation()
  const Axios = useAxios()

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(Axios),
    staleTime: 1000 * 60 * 5,
  })

  const { data: courses, isLoading: isCoursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getCourses(Axios),
    staleTime: 1000 * 60 * 5,
  })

  return (
    <>
      <div className="mt-5 space-y-10">
        {categories?.map((category, index) => (
          <div
            key={category.id}
            className={`${index === categories.length - 1 ? "" : "border-b"}`}
          >
            <SpecialHeader
              name={
                i18n.language === "en" ? category.name_en : category.name_ar
              }
            />
            <Carousel
              className="w-full"
              opts={{
                direction: i18n.language === "ar" ? "rtl" : "ltr",
                slidesToScroll: 'auto',
                
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {courses
                  ?.filter((course) => course.category.id === category.id)
                  .slice(0, 5)
                  .map((course) => (
                    <CarouselItem
                      key={course.id}
                      className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 flex"
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
                  i18n.language === "ar" ? "right-[calc(100%-25px)] rotate-180" : "-right-2"
                }`}
              />
            </Carousel>
            <div className="w-fit m-auto">
              <Link
                href={`/courses?category_slug=${category.id}`}
                className="py-2 block px-5 border border-(--main-color) text-(--main-color) hover:bg-orange-100 cursor-pointer my-10"
              >
                {t("categories.showall")}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
