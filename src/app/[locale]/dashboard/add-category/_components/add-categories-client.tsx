"use client"

import { useFormik } from "formik"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import * as Yup from "yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import Input from "@/components/Input"
import SlugMaker from "@/helpers/slug-maker"
import BtnLoad from "@/components/BtnLoad"
import { CategoryFormData } from "@/lib/types/category"

export default function AddCategory() {
  const { t } = useTranslation()
  const Axios = useAxios()
  const queryClient = useQueryClient()

  const validationSchema = Yup.object({
    name_en: Yup.string().required(t("Dashboard.addCategory.requiredEnError")),
    name_ar: Yup.string().required(t("Dashboard.addCategory.requiredArError")),
  })

  const createCategoryMutation = useMutation({
    mutationFn: async (values: CategoryFormData) => {
      const response = await Axios.post("/category", values)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })

      form.resetForm()
      toast.success(t("Dashboard.addCategory.successMessage"))
    },
    onError: (error) => {
      console.error("Error creating category:", error)
      toast.error(t("Dashboard.addCategory.errorMessage"))
    },
  })

  const form = useFormik({
    initialValues: {
      name_en: "",
      name_ar: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      createCategoryMutation.mutate(values)
    },
  })

  return (
    <>
      <div>
        <div className="px-2 py-2 mt-10 bg-[#ffff] rounded-md">
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
              disabled={createCategoryMutation.isPending}
              className={`bg-(--main-color) flex justify-center mb-4 text-sm text-white rounded mt-4 py-2 px-4 hover:bg-(--main-darker-color) transition duration-300 ${
                createCategoryMutation.isPending
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              {createCategoryMutation.isPending ? (
                <BtnLoad size={20} />
              ) : (
                t("Dashboard.addCategory.submitButton")
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
