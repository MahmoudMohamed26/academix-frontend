"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useParams } from "next/navigation"

import useAxios from "@/hooks/useAxios"
import { getNonPublishedCourses, useRejectCourse } from "@/lib/api/Courses"

import DataTable from "../../../_components/tables"
import DeleteDialog from "../../../_components/delete-dialog"

import { TableHeader } from "@/lib/types/table"
import { Course, CourseSearchParams } from "@/lib/types/course"
import FilterDialog from "@/components/filter-dialog"
import Pagination from "@/components/pagination"
import { toast } from "sonner"

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

export default function PendingCourses({
  searchParams,
  tableHeaders,
}: CategoriesClientProps) {
  const Axios = useAxios()
  const { locale } = useParams<{ locale: string }>()
  const currLang = locale ?? "en"

  const deleteMutation = useRejectCourse(Axios)
  const queryClient =  useQueryClient()
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
    queryKey: ["non-published-courses", sanitizedParams],
    queryFn: () => getNonPublishedCourses(Axios, url),
  })

  const handleDeleteClick = (courseId: string) => {
    setSelectedCourseId(courseId)
    setIsDialogOpen(true)
  }

  const approveCourseMutation = useMutation({
    mutationFn: (courseId: string) =>
      Axios.patch(`courses/${courseId}/publication-status`, {
        status: true,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      queryClient.invalidateQueries({ queryKey: ["non-published-courses"] })
      toast.success("Course accepted successfully")
    },

    onError: (error) => {
      console.error(error)
    },
  })

  const handleApprove = async (courseId: string) => {
    approveCourseMutation.mutate(courseId)
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
        onApprove={handleApprove}
        type="pending-courses"
        onDelete={handleDeleteClick}
        getCategoryName={getCategoryName}
      />

      <DeleteDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        itemId={selectedCourseId}
        deleteMutation={deleteMutation}
        type="pending-courses"
      />
      <Pagination paginationLinks={courseData?.meta} />
    </>
  )
}
