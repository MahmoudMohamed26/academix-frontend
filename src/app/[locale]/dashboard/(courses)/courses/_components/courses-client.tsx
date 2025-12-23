"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useParams } from "next/navigation"

import useAxios from "@/hooks/useAxios"
import { getFilterdCourses, useDeleteCourse } from "@/lib/api/Courses"

import DataTable from "../../../_components/tables"
import DeleteDialog from "../../../_components/delete-dialog"

import { TableHeader } from "@/lib/types/table"
import { Course, CourseSearchParams } from "@/lib/types/course"
import FilterDialog from "@/components/filter-dialog"
import Pagination from "@/components/pagination"

interface CategoriesClientProps {
  tableHeaders: TableHeader[]
  searchParams?: CourseSearchParams
}

const ALLOWED_PARAMS: readonly (keyof CourseSearchParams)[] = [
  "category_slug",
  "level",
  "min_price",
  "max_price",
  "min_hours",
  "max_hours",
  "min_rating",
  "sortBy",
  "orderedBy",
  "user_id",
  "search",
  "page",
] as const

function sanitizeSearchParams(
  params: CourseSearchParams = {}
): CourseSearchParams {
  const sanitized: CourseSearchParams = {}

  ALLOWED_PARAMS.forEach((key) => {
    const value = params[key]
    if (value !== undefined && value !== null && value !== "") {
      sanitized[key] = value
    }
  })

  return sanitized
}

export default function Courses({
  searchParams,
  tableHeaders,
}: CategoriesClientProps) {
  const Axios = useAxios()
  const { locale } = useParams<{ locale: string }>()
  const currLang = locale ?? "en"

  const deleteMutation = useDeleteCourse(Axios)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

  const sanitizedParams = sanitizeSearchParams(searchParams)

  const paramsSearch = new URLSearchParams()
  Object.entries(sanitizedParams).forEach(([key, value]) => {
    if (value) paramsSearch.append(key, value)
  })

  const url = `/courses/filter${
    paramsSearch.toString() ? `?${paramsSearch.toString()}` : ""
  }`

  const { data: courseData, isLoading } = useQuery({
    queryKey: ["courses", sanitizedParams],
    queryFn: () => getFilterdCourses(Axios, url),
  })

  const handleDeleteClick = (courseId: string) => {
    setSelectedCourseId(courseId)
    setIsDialogOpen(true)
  }

  const getCategoryName = (course: Course) => {
    return currLang === "ar" ? course.category.name_ar : course.category.name_en
  }

  return (
    <>
      <div className="mb-5">
        <FilterDialog currentFilters={searchParams || {}} />
      </div>
      <DataTable
        data={courseData?.courses || []}
        isLoading={isLoading}
        tableHeaders={tableHeaders}
        type="courses"
        onDelete={handleDeleteClick}
        getCategoryName={getCategoryName}
      />

      <DeleteDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        itemId={selectedCourseId}
        deleteMutation={deleteMutation}
      />
      <Pagination paginationLinks={courseData?.meta} />
    </>
  )
}
