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
import { Pencil, Plus } from "lucide-react"
import SectionItem from "./section-item"
import { useParams } from "next/navigation"
import SpecialHeader from "@/components/SpecialHeader"
import Input from "@/components/Input"
import BtnLoad from "@/components/BtnLoad"
import { Course, CourseFormData } from "@/lib/types/course"
import { Section, SectionFormData } from "@/lib/types/section"

// Separate validation schemas
const courseValidationSchema = (t: any) =>
  Yup.object({
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

const sectionValidationSchema = (t: any) =>
  Yup.object({
    title: Yup.string().required(
      t("Dashboard.addCourse.requiredSectionNameError")
    ),
    description: Yup.string(),
  })

export default function EditCourseForm() {
  const { t, i18n } = useTranslation()
  const Axios = useAxios()
  const { id: courseId } = useParams()
  const queryClient = useQueryClient()

  // Fetch course data
  const { data: courseData, isLoading: courseLoading } = useQuery<Course>({
    queryKey: ["course", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("No course ID")
      const response = await Axios.get(`/courses/${courseId}`)
      return response.data
    },
    enabled: !!courseId,
  })

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await Axios.get("/categories")
      return response.data
    },
  })

  // Course form
  const courseForm = useFormik<CourseFormData>({
    initialValues: {
      slug: courseData?.slug || "",
      title: courseData?.title || "",
      description: courseData?.description || "",
      categoryId: courseData?.categoryId !== undefined ? courseData.categoryId.toString() : "none",
    },
    enableReinitialize: true,
    validationSchema: courseValidationSchema(t),
    onSubmit: async (values) => {
      updateCourseMutation.mutate(values)
    },
  })

  useEffect(() => {
    courseForm.validateForm()
  }, [i18n.language])

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: async (values: CourseFormData) => {
      if (!courseId) throw new Error("No course ID")
      const response = await Axios.put(`/courses/${courseId}`, values)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      queryClient.invalidateQueries({ queryKey: ["course", courseId] })
      toast.success(t("Dashboard.addCourse.editSuccessMessage"))
    },
    onError: (error) => {
      console.error("Error updating course:", error)
      toast.error(t("Dashboard.addCourse.editErrorMessage"))
    },
  })

  // Fetch sections for this course
  const { data: sections = [], isLoading: sectionsLoading } = useQuery<Section[]>({
    queryKey: ["sections", courseId],
    queryFn: async () => {
      if (!courseId) return []
      const response = await Axios.get(`/courses/${courseId}/sections`)
      return response.data
    },
    enabled: !!courseId,
  })

  // Create section mutation
  const createSectionMutation = useMutation({
    mutationFn: async () => {
      if (!courseId) throw new Error("No course ID")
      const response = await Axios.post(`courses/${courseId}/sections`, {
        title: "",
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections", courseId] })
      toast.success(t("Dashboard.addCourse.sectionCreatedSuccess"))
    },
    onError: (error) => {
      console.error("Error creating section:", error)
      toast.error(t("Dashboard.addCourse.sectionCreatedError"))
    },
  })

  // Update section mutation
  const updateSectionMutation = useMutation({
    mutationFn: async ({
      sectionId,
      values,
    }: {
      sectionId: number
      values: SectionFormData
    }) => {
      if (!courseId) throw new Error("No course ID")
      const response = await Axios.put(`/sections/${sectionId}`, values)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections", courseId] })
      toast.success(t("Dashboard.addCourse.sectionUpdatedSuccess"))
    },
    onError: (error) => {
      console.error("Error updating section:", error)
      toast.error(t("Dashboard.addCourse.sectionUpdatedError"))
    },
  })

  useEffect(() => {
    courseForm.setFieldValue("slug", SlugMaker(courseForm.values.title))
  }, [courseForm.values.title])

  const isLoading = courseLoading || categoriesLoading || sectionsLoading

  return (
    <div>
      <div className="px-2 py-2 mt-10 bg-[#ffff] rounded-md">
        {isLoading ? (
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
          <form className="mt-2" onSubmit={courseForm.handleSubmit}>
            <div className="flex md:gap-4 flex-col md:flex-row">
              <div className="max-w-[400px] flex-1">
                <Input
                  formik={courseForm as any}
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
                  key={courseForm.values.categoryId}
                  dir={i18n.language === "en" ? "ltr" : "rtl"}
                  value={courseForm.values.categoryId?.toString() || "none"}
                  onValueChange={(val) => {
                    courseForm.setFieldValue("categoryId", Number(val))
                    courseForm.setFieldTouched("categoryId", true)
                  }}
                  onOpenChange={(open) => {
                    if (!open) {
                      courseForm.setFieldTouched("categoryId", true)
                    }
                  }}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger
                    className={`w-full my-2 rounded-sm border text-sm 
                      ${
                        courseForm.touched.categoryId &&
                        courseForm.errors.categoryId
                          ? "border-red-500!"
                          : "border-[#e2e6f1] focus-visible:border-(--main-color) data-[state=open]:border-(--main-color)"
                      }
                    `}
                  >
                    <SelectValue
                      placeholder={t("Dashboard.addCourse.categoryPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem disabled value="none">
                      {t("Dashboard.addCourse.categoryPlaceholder")}
                    </SelectItem>
                    {categories?.map((category: any) => (
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
                {courseForm.touched.categoryId &&
                  courseForm.errors.categoryId && (
                    <p className="text-red-500 text-xs">
                      {courseForm.errors.categoryId}
                    </p>
                  )}
              </div>
            </div>

            <label className="text-sm text-gray-700 font-[501]">
              {t("Dashboard.addCourse.descriptionLabel")}
            </label>
            <textarea
              className={`w-full text-sm outline-none my-2 border rounded-sm duration-200 p-2 focus:border-(--main-color) ${
                courseForm.touched.description && courseForm.errors.description
                  ? "border-red-500!"
                  : "border-[#e2e6f1] special_shadow"
              }`}
              name="description"
              rows={4}
              placeholder={t("Dashboard.addCourse.descriptionPlaceholder")}
              value={courseForm.values.description}
              onChange={courseForm.handleChange}
              onBlur={courseForm.handleBlur}
            />
            {courseForm.touched.description &&
              courseForm.errors.description && (
                <p className="text-red-500 text-xs">
                  {courseForm.errors.description}
                </p>
              )}

            {courseId && (
              <>
                <label className="text-sm text-gray-700 font-[501] mt-4 block">
                  {t("Dashboard.addCourse.sectionHTitle")}
                </label>

                <div className="space-y-2 my-2">
                  {sections.map((section, index) => (
                    <SectionItem
                      key={section.id}
                      section={section}
                      index={index}
                      updateSectionMutation={updateSectionMutation}
                      validationSchema={sectionValidationSchema(t)}
                      t={t}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={() => createSectionMutation.mutate()}
                    disabled={createSectionMutation.isPending}
                    className="flex items-center cursor-pointer gap-2 p-2 rounded-sm hover:bg-sidebar-accent transition-colors w-full border border-dashed border-gray-300"
                  >
                    <Plus size={20} />
                    <span className="text-sm">
                      {t("Dashboard.addCourse.addSectionButton")}
                    </span>
                  </button>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={updateCourseMutation.isPending}
              className={`bg-(--main-color) flex justify-center mb-4 text-sm text-white rounded mt-4 py-2 px-4 hover:bg-(--main-darker-color) transition duration-300 ${
                updateCourseMutation.isPending
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              {updateCourseMutation.isPending ? (
                <BtnLoad size={20} />
              ) : (
                <div className="flex items-center gap-2">
                  <Pencil size={16} />
                  {t("Dashboard.addCourse.submitButton")}
                </div>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}