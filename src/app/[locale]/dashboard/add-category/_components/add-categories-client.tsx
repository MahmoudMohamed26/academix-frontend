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

export default function AddCategory() {
  const { t } = useTranslation()
  const Axios = useAxios()
  const queryClient = useQueryClient()

  const validationSchema = Yup.object({
    slug: Yup.string(),
    translations: Yup.object({
      en: Yup.object({
        name: Yup.string().required(t("Dashboard.addCategory.requiredEnError")),
      }),
      ar: Yup.object({
        name: Yup.string().required(t("Dashboard.addCategory.requiredArError")),
      }),
    }),
  })

  type CategoryFormData = {
    slug: string
    translations: {
      en: { name: string }
      ar: { name: string }
    }
  }

  const createCategoryMutation = useMutation({
    mutationFn: async (values: CategoryFormData) => {
      const response = await Axios.post("/categories", values)
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
      slug: "",
      translations: { en: { name: "" }, ar: { name: "" } },
    },
    validationSchema,
    onSubmit: async (values) => {
      createCategoryMutation.mutate(values)
    },
  })

  useEffect(() => {
    form.setFieldValue("slug", SlugMaker(form.values.translations.en.name))
  }, [form.values.translations.en.name])

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
                  name="translations.en.name"
                />
              </div>
              <div className="max-w-[400px] flex-1">
                <Input
                  formik={form as any}
                  placeholder={t("Dashboard.addCategory.namePlaceholderAr")}
                  label={t("Dashboard.addCategory.nameLabelAr")}
                  name="translations.ar.name"
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
