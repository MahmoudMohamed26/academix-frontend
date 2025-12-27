"use client"

import { useFormik } from "formik"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import * as Yup from "yup"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import Input from "@/components/Input"
import BtnLoad from "@/components/BtnLoad"
import { CategoryFormData } from "@/lib/types/category"
import { useParams, useRouter } from "next/navigation"
import Skeleton from "react-loading-skeleton"
import { useEffect, useState } from "react"
import { getCategory } from "@/lib/api/Categories"

export default function EditCategory() {
  const { t } = useTranslation()
  const { id } = useParams()
  const Axios = useAxios()
  const queryClient = useQueryClient()
  const [category, setCategory] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true)
        const response = await getCategory(Axios, id)
        setCategory(response)
      } catch (error) {
        console.error("Error fetching category:", error)
        toast.error("Failed to load category")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategory()
  }, [id, Axios])

  const validationSchema = Yup.object({
    name_en: Yup.string().required(t("Dashboard.addCategory.requiredEnError")),
    name_ar: Yup.string().required(t("Dashboard.addCategory.requiredArError")),
  })


  const updateCategoryMutation = useMutation({
    mutationFn: async (values: CategoryFormData) => {
      const response = await Axios.patch(`/categories/${id}`, values)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })

      router.replace(`/dashboard/categories`)
      toast.success(t("Dashboard.addCategory.successMessage"))
    },
    onError: (error) => {
      console.error("Error creating category:", error)
      toast.error(t("Dashboard.addCategory.errorMessage"))
    },
  })

  const form = useFormik({
    initialValues: {
      name_en: category?.name_en || "",
      name_ar: category?.name_ar || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      updateCategoryMutation.mutate(values)
    },
  })

  return (
    <>
      <div>
        <div className="px-2 py-2 mt-10 bg-[#ffff] rounded-md">
          {isLoading ? (
            <div>
              <div className="flex gap-2 md:gap-4 mb-14 flex-col md:flex-row">
                <div className="max-w-[400px] flex-1">
                  <Skeleton height={30} />
                </div>
                <div className="max-w-[400px] flex-1">
                  <Skeleton height={30} />
                </div>
              </div>
              <Skeleton width={200} height={30} />
            </div>
          ) : (
            <form className="mt-2" onSubmit={form.handleSubmit}>
              <div className="flex gap-2 md:gap-4 flex-col md:flex-row">
                <div className="max-w-[400px] flex-1">
                  <Input
                    formik={form as any}
                    placeholder={t("Dashboard.addCategory.namePlaceholderEn")}
                    label={t("Dashboard.addCategory.nameLabelEn")}
                    name="name_en"
                  />
                </div>
                <div className="max-w-[400px] flex-1">
                  <Input
                    formik={form as any}
                    placeholder={t("Dashboard.addCategory.namePlaceholderAr")}
                    label={t("Dashboard.addCategory.nameLabelAr")}
                    name="name_ar"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={updateCategoryMutation.isPending}
                className={`bg-(--main-color) flex justify-center mb-4 text-sm text-white rounded mt-4 py-2 px-4 hover:bg-(--main-darker-color) transition duration-300 ${
                  updateCategoryMutation.isPending
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >
                {updateCategoryMutation.isPending ? (
                  <BtnLoad size={20} />
                ) : (
                  t("Dashboard.addCategory.submitButton")
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
