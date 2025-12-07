"use client"

import useAxios from "@/hooks/useAxios"
import { useFormik } from "formik"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import * as Yup from "yup"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Skeleton from "react-loading-skeleton"
import SlugMaker from "@/helpers/slug-maker"
import { getCategories } from "@/lib/api/Categories"
import { Category } from "@/lib/types/category"
import Input from "@/components/Input"
import BtnLoad from "@/components/BtnLoad"
import { CourseFormData } from "@/lib/types/course"
import { useRouter } from "next/navigation"

interface AddCourseClientProps {
  initialCategories: Category[]
}

export default function AddCourseForm({ initialCategories }: AddCourseClientProps) {
  const { t, i18n } = useTranslation()
  const Axios = useAxios()
  const queryClient = useQueryClient()
  const router = useRouter();
  const validationSchema = Yup.object({
    title: Yup.string().required(t("Dashboard.addCourse.requiredNameError")),
    description: Yup.string().required(
      t("Dashboard.addCourse.requiredDescError")
    ),
    categoryId: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "none" ? null : value
      )
      .required(t("Dashboard.addCourse.requiredCategoryError")),
  })

  const form = useFormik<CourseFormData>({
    initialValues: {
      slug: "",
      title: "",
      description: "",
      categoryId: "none",
    },
    validationSchema,
    onSubmit: async (values) => {
      createCourseMutation.mutate(values)
    },
  })

  const createCourseMutation = useMutation({
    mutationFn: async (values: CourseFormData) => {
      const response = await Axios.post("/courses", values)
      return response.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      form.resetForm()
      toast.success(t("Dashboard.addCourse.successMessage"))
      router.push(`/dashboard/courses/${res.id}`)
    },
    onError: (error) => {
      console.error("Error creating course:", error)
      toast.error(t("Dashboard.addCourse.errorMessage"))
    },
  })


  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(Axios),
    initialData: initialCategories,
  })
  console.log(i18n.language);

  useEffect(() => {
    form.setFieldValue("slug", SlugMaker(form.values.title))
  }, [form.values.title])

  return (
    <>
      <div>
        <div className="px-2 py-2 mt-10 bg-[#ffff] rounded-md">
          {categoriesLoading ? (
            <div>
              <Skeleton height={20} width={"80%"} className="mb-2" />
              <Skeleton height={40} width={"100%"} className="mb-4" />
              <Skeleton height={20} width={"60%"} className="mb-2" />
              <Skeleton height={40} width={"100%"} className="mb-4" />
              <Skeleton height={20} width={"40%"} className="mb-2" />
              <Skeleton height={80} width={"100%"} className="mb-4" />
              <Skeleton height={20} width={"50%"} className="mb-2" />
              <Skeleton height={60} width={"100%"} className="mb-2" />
              <Skeleton height={60} width={"100%"} className="mb-2" />
              <Skeleton height={40} width={"20%"} className="mb-4" />
            </div>
          ) : (
            <form className="mt-2" onSubmit={form.handleSubmit}>
              <div className="flex md:gap-4 flex-col md:flex-row">
                <div className="max-w-[400px] flex-1">
                  <Input
                    formik={form as any}
                    placeholder={t("Dashboard.addCourse.namePlaceholder")}
                    label={t("Dashboard.addCourse.nameLabel")}
                    name="title"
                  />
                </div>

                <div className="max-w-[400px] flex-1">
                  <label className="text-sm text-gray-700 font-[501]">
                    {t("Dashboard.addCourse.categoryLabel")}
                  </label>
                  <Select
                    dir={i18n.language === "en" ? "ltr" : "rtl"}
                    value={form.values.categoryId?.toString() || "none"}
                    onValueChange={(val) => {
                      form.setFieldValue("categoryId", Number(val))
                      form.setFieldTouched("categoryId", true)
                    }}
                    onOpenChange={(open) => {
                      if (!open) {
                        form.setFieldTouched("categoryId", true)
                      }
                    }}
                  >
                    <SelectTrigger
                      className={`w-full my-2 rounded-sm border text-sm 
                        ${
                          form.touched.categoryId && form.errors.categoryId
                            ? "border-red-500!"
                            : "border-[#e2e6f1] focus-visible:border-(--main-color) data-[state=open]:border-(--main-color)"
                        }
                      `}
                    >
                      <SelectValue
                        placeholder={t(
                          "Dashboard.addCourse.categoryPlaceholder"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem disabled value="none">
                        {t("Dashboard.addCourse.categoryPlaceholder")}
                      </SelectItem>
                      {categories.map((category: any) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {i18n.language === "en"
                            ? category.translations.en.name
                            : category.translations.ar.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.touched.categoryId && form.errors.categoryId && (
                    <p className="text-red-500 text-xs">
                      {form.errors.categoryId}
                    </p>
                  )}
                </div>
              </div>

              <label className="text-sm text-gray-700 font-[501]">
                {t("Dashboard.addCourse.descriptionLabel")}
              </label>
              <textarea
                className={`w-full text-sm outline-none my-2 border rounded-sm duration-200 p-2 focus:border-(--main-color) ${
                  form.touched.description && form.errors.description
                    ? "border-red-500!"
                    : "border-[#e2e6f1] special_shadow"
                }`}
                name="description"
                rows={4}
                placeholder={t("Dashboard.addCourse.descriptionPlaceholder")}
                value={form.values.description}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
              {form.touched.description && form.errors.description && (
                <p className="text-red-500 text-xs">
                  {form.errors.description}
                </p>
              )}

              <button
                type="submit"
                disabled={createCourseMutation.isPending}
                className={`bg-(--main-color) flex justify-center mb-4 text-sm text-white rounded mt-4 py-2 px-4 hover:bg-(--main-darker-color) transition duration-300 ${
                  createCourseMutation.isPending
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >
                {createCourseMutation.isPending ? (
                  <BtnLoad size={20} />
                ) : (
                  t("Dashboard.addCourse.submitButton")
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
