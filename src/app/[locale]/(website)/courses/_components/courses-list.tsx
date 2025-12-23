"use client"

import SingleCourse from "@/components/SingleCourse"
import useAxios from "@/hooks/useAxios"
import { getFilterdCourses } from "@/lib/api/Courses"
import { useQuery } from "@tanstack/react-query"
import { LayoutGrid, List } from "lucide-react"
import { useState } from "react"
import FilterDialog from "../../../../../components/filter-dialog"
import CourseSkeleton from "./course-skeleton"
import { useTranslation } from "react-i18next"
import { Course, CourseLinks, CoursesListProps } from "@/lib/types/course"
import Pagination from "../../../../../components/pagination"

export default function CoursesList({ searchParams }: CoursesListProps) {
  const [grid, setGrid] = useState<boolean>(true)
  const Axios = useAxios()
  const { t } = useTranslation()

  const params = new URLSearchParams()
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.append(key, value)
  })

  const url = `/courses/filter${
    params.toString() ? `?${params.toString()}` : ""
  }`

  const { data: courseData, isLoading } = useQuery({
    queryKey: ["courses", searchParams],
    queryFn: () => getFilterdCourses(Axios, url),
  })

  const filteredCourses: Course[] = courseData?.courses ?? []
  const paginationLinks: CourseLinks | undefined = courseData?.meta

  return (
    <>
      <div className="rounded-sm flex gap-7 items-center mb-5">
        <button 
          onClick={() => setGrid((prev) => !prev)}
          aria-label={grid ? t("coursesPage.listView") : t("coursesPage.gridView")}
        >
          {grid ? (
            <LayoutGrid
              className="text-black hover:bg-gray-50 cursor-pointer p-2 rounded-sm"
              size={38}
            />
          ) : (
            <List
              className="text-black hover:bg-gray-50 cursor-pointer p-2 rounded-sm"
              size={38}
            />
          )}
        </button>
        <FilterDialog currentFilters={searchParams} />
      </div>

      {isLoading ? (
        <div className={`${grid ? "special-grid" : "block space-y-5"}`}>
          <CourseSkeleton grid={grid} />
          <CourseSkeleton grid={grid} />
          <CourseSkeleton grid={grid} />
          <CourseSkeleton grid={grid} />
          <CourseSkeleton grid={grid} />
          <CourseSkeleton grid={grid} />
        </div>
      ) : filteredCourses && filteredCourses.length > 0 ? (
        <div className={`${grid ? "special-grid" : "block space-y-5"}`}>
          {filteredCourses.map((course) => (
            <SingleCourse key={course.id} grid={grid} course={course as any} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          {t("coursesPage.noCourses")}
        </div>
      )}
      <Pagination paginationLinks={paginationLinks || undefined} />
    </>
  )
}