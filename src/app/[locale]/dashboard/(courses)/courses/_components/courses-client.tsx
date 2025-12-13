"use client"
import { useQuery } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import { useState } from "react"
import { getCourses, useDeleteCourse } from "@/lib/api/Courses"
import DataTable from "../../../_components/tables"
import DeleteDialog from "../../../_components/delete-dialog"
import { TableHeader } from "@/lib/types/table"
import { useParams } from "next/navigation"
import { Category } from "@/lib/types/category"

interface CategoriesClientProps {
  tableHeaders: TableHeader[]
}

export default function Courses({ tableHeaders }: CategoriesClientProps) {
  const Axios = useAxios()
  const params = useParams()
  const currLang = (params?.locale as string) || "en"
  const deleteMutation = useDeleteCourse(Axios)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getCourses(Axios),
  })

  const handleDeleteClick = (courseId: string) => {
    setSelectedCourseId(courseId)
    setIsDialogOpen(true)
  }
  console.log(courses)
  const getCategoryName = (category: Category) => {
    return currLang === "ar" ? category.name_ar : category.name_en
  }

  return (
    <>
      <DataTable
        data={courses}
        isLoading={isLoading}
        tableHeaders={tableHeaders}
        type={"courses"}
        onDelete={handleDeleteClick}
        getCategoryName={getCategoryName}
      />

      <DeleteDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        itemId={selectedCourseId}
        deleteMutation={deleteMutation}
      />
    </>
  )
}
