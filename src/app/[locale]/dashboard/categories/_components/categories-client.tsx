"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { getCategories, useDeleteCategory } from "@/lib/api/Categories"
import TableData from "../../_components/tables"
import DeleteDialog from "../../_components/delete-dialog"
import { useQuery } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import { Category } from "@/lib/types/category"
import type { TableHeader } from "@/lib/types/table"

interface CategoriesClientProps {
  tableHeaders: TableHeader[]
}

export default function CategoriesClient({
  tableHeaders,
}: CategoriesClientProps) {
  const params = useParams()
  const currLang = (params?.locale as string) || "en"
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  )
  const Axios = useAxios()
  const deleteMutation = useDeleteCategory(Axios)
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(Axios),
  })

  const handleDeleteClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setIsDialogOpen(true)
  }

  const getCategoryName = (category: Category) => {
    return currLang === "ar" ? category.name_ar : category.name_en
  }

  return (
    <>
      <TableData
        data={categories as any}
        isLoading={isLoading}
        tableHeaders={tableHeaders}
        type={"categories"}
        onDelete={handleDeleteClick}
        getCategoryName={getCategoryName}
      />

      <DeleteDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        itemId={selectedCategoryId}
        deleteMutation={deleteMutation}
      />
    </>
  )
}
