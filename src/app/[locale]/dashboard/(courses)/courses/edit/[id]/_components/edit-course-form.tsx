"use client"

import useAxios from "@/hooks/useAxios"
import { useFormik } from "formik"
import { useEffect, useRef, useState } from "react"
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
import { getCategories } from "@/lib/api/Categories"
import { Category } from "@/lib/types/category"
import Input from "@/components/Input"
import BtnLoad from "@/components/BtnLoad"
import { CourseFormData } from "@/lib/types/course"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { getCourse } from "@/lib/api/Courses"
import { useParams, useRouter } from "next/navigation"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ListItemNode, ListNode } from "@lexical/list"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { LinkNode } from "@lexical/link"
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $getRoot, $insertNodes } from "lexical"
import ToolbarPlugin from "@/components/tool-bar-plugin"

const editorConfig = {
  namespace: "CourseEditor",
  theme: {
    paragraph: "mb-2",
    heading: {
      h1: "text-xl font-semibold mb-4",
      h2: "text-2xl font-semibold mb-3",
      h3: "text-xl font-semibold mb-2",
    },
    list: {
      ul: "list-disc list-inside mb-2",
      ol: "list-decimal list-inside mb-2",
      listitem: "ml-4",
    },
    text: {
      bold: "font-semibold",
      italic: "italic",
      underline: "underline",
    },
    quote: "border-l-4 border-gray-300 pl-4 italic my-2",
  },
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
  onError: (error: Error) => {
    console.error(error)
  },
}

function HtmlPlugin({ onChange }: { onChange: (html: string) => void }) {
  const [editor] = useLexicalComposerContext()

  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor, null)
          const textContent = html.replace(/<[^>]*>/g, '').trim()
          const cleanHtml = textContent ? html : ''
          onChange(cleanHtml)
        })
      }}
    />
  )
}

function InitialContentPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (html && !isInitialized) {
      editor.update(() => {
        const parser = new DOMParser()
        const dom = parser.parseFromString(html, "text/html")
        const nodes = $generateNodesFromDOM(editor, dom)
        const root = $getRoot()
        root.clear()
        $insertNodes(nodes)
      })
      setIsInitialized(true)
    }
  }, [editor, html, isInitialized])

  return null
}

export default function EditCourseForm() {
  const { t, i18n } = useTranslation()
  const Axios = useAxios()
  const { id } = useParams()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isFormReady, setIsFormReady] = useState(false)
  const [editorKey, setEditorKey] = useState(0)
  const router = useRouter()

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(Axios),
    staleTime: 10 * 60 * 1000,
  })

  const { data: course, isLoading } = useQuery({
    queryKey: ["courses", id],
    queryFn: () => getCourse(Axios, id),
    staleTime: 10 * 60 * 1000,
    enabled: !!categories,
  })

  useEffect(() => {
    if (course?.image) {
      setImagePreview(course.image)
    }
  }, [course?.image])

  useEffect(() => {
    if (course?.detailed_description) {
      setEditorKey((prev) => prev + 1)
    }
  }, [course?.detailed_description])

  const validationSchema = Yup.object({
    title: Yup.string().required(t("Dashboard.addCourse.requiredNameError")),
    short_description: Yup.string().required(
      t("Dashboard.addCourse.requiredShortDescError")
    ),
    detailed_description: Yup.string().required(
      t("Dashboard.addCourse.requiredDetailedDescError")
    ),
    category_slug: Yup.string().required(
      t("Dashboard.addCourse.requiredCategoryError")
    ),
    price: Yup.number()
      .required(t("Dashboard.addCourse.requiredPriceError"))
      .min(0, t("Dashboard.addCourse.minPriceError")),
    hours: Yup.number()
      .required(t("Dashboard.addCourse.requiredHoursError"))
      .min(0.1, t("Dashboard.addCourse.minHoursError")),
    level: Yup.string().required(t("Dashboard.addCourse.requiredLevelError")),
    image: Yup.mixed(),
  })

  const form = useFormik<CourseFormData>({
    initialValues: {
      title: course?.title || "",
      short_description: course?.short_description || "",
      detailed_description: course?.detailed_description || "",
      image: course?.image || "",
      video_url: course?.video_url || "",
      price: course?.price || 0,
      hours: course?.hours || 0,
      level: course?.level || "beginner",
      category_slug: course?.category?.id || "none",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      if (!imageFile && !course?.image) {
        toast.error(t("Dashboard.addCourse.requiredImageError"))
        return
      }

      createCourseMutation.mutate(values)
    },
  })

  const createCourseMutation = useMutation({
    mutationFn: async (values: CourseFormData) => {
      const formData = new FormData()
      formData.append("title", values.title)
      formData.append("short_description", values.short_description)
      formData.append("detailed_description", values.detailed_description)
      formData.append("price", values.price.toString())
      formData.append("hours", values.hours.toString())
      formData.append("level", values.level)
      formData.append("category_slug", values.category_slug.toString())
      formData.append("_method", "PATCH")

      if (imageFile) {
        formData.append("image", imageFile)
      }
      const response = await Axios.post(`/courses/${id}`, formData)
      return response.data
    },
    onSuccess: () => {
      if(course?.published){
        queryClient.invalidateQueries({ queryKey: ["published-courses"] })
      }else{
        queryClient.invalidateQueries({ queryKey: ["non-published-courses"] })
      }
      router.push("/dashboard/courses")
      toast.success(t("Dashboard.addCourse.editSuccessMessage"))
    },
    onError: (error) => {
      console.error("Error creating course:", error)
      toast.error(t("Dashboard.addCourse.editErrorMessage"))
    },
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error(t("Dashboard.addCourse.invalidImageError"))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("Dashboard.addCourse.imageSizeError"))
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setImageFile(file)
    form.setFieldValue("image", file.name)
    form.setFieldTouched("image", true)
  }

  const handleRemoveImage = () => {
    setImagePreview("")
    setImageFile(null)
    form.setFieldValue("image", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  useEffect(() => {
    if (course) {
      setTimeout(() => setIsFormReady(true), 0)
    }
  }, [course])

  const handleImageClick = () => {
    if (!imagePreview) {
      fileInputRef.current?.click()
    }
  }

  const handleEditorChange = (html: string) => {
    form.setFieldValue("detailed_description", html)
  }

  const handleEditorBlur = () => {
    form.setFieldTouched("detailed_description", true)
  }

  return (
    <>
      <div>
        <div className="px-2 py-2 mt-10 bg-[#ffff] rounded-md">
          {categoriesLoading || isLoading ? (
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
              <div className="lg:flex gap-10">
                <div className="mb-4 max-w-[400px] flex-1/4">
                  <label className="text-sm text-gray-700 font-[501]">
                    {t("Dashboard.addCourse.imageLabel")}
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="relative">
                    <div
                      onClick={handleImageClick}
                      className={`w-full h-50 my-2 border-2 rounded-sm overflow-hidden ${
                        imagePreview
                          ? "border-[#e2e6f1]"
                          : "border-dashed cursor-pointer hover:border-(--main-color)"
                      } ${
                        form.touched.image && form.errors.image
                          ? "border-red-500"
                          : "border-[#e2e6f1]"
                      }`}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Course preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm">
                            {t("Dashboard.addCourse.imageUploadPlaceholder")}
                          </p>
                        </div>
                      )}
                    </div>
                    {imagePreview && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleRemoveImage}
                        className="size-6 absolute -end-2 -top-2 rounded-full"
                        aria-label={t("Dashboard.avatarUpload.removeAvatar")}
                      >
                        <X className="size-3.5" />
                      </Button>
                    )}
                  </div>
                  {form.touched.image && form.errors.image && (
                    <p className="text-red-500 text-xs">{form.errors.image}</p>
                  )}
                </div>
                <div className="flex-1">
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
                        value={form.values.category_slug || "none"}
                        onValueChange={(val) => {
                          if (isFormReady) {
                            form.setFieldValue("category_slug", val)
                            form.setFieldTouched("category_slug", true)
                          }
                        }}
                        onOpenChange={(open) => {
                          if (!open) {
                            form.setFieldTouched("category_slug", true)
                          }
                        }}
                      >
                        <SelectTrigger
                          className={`w-full my-2 rounded-sm border text-sm 
                        ${
                          form.touched.category_slug &&
                          form.errors.category_slug
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
                          {categories?.map((category: any) => (
                            <SelectItem key={category.id} value={category.id}>
                              {i18n.language === "en"
                                ? category.name_en
                                : category.name_ar}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.touched.category_slug &&
                        form.errors.category_slug && (
                          <p className="text-red-500 text-xs">
                            {form.errors.category_slug}
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="flex md:gap-4 flex-col md:flex-row">
                    <div className="max-w-[400px] flex-1">
                      <Input
                        formik={form as any}
                        placeholder={t("Dashboard.addCourse.pricePlaceholder")}
                        label={t("Dashboard.addCourse.priceLabel")}
                        name="price"
                        number={true}
                      />
                    </div>

                    <div className="max-w-[400px] flex-1">
                      <Input
                        formik={form as any}
                        placeholder={t("Dashboard.addCourse.hoursPlaceholder")}
                        label={t("Dashboard.addCourse.hoursLabel")}
                        name="hours"
                        number={true}
                      />
                    </div>
                  </div>

                  <div className="max-w-[400px] flex-1 mb-4">
                    <label className="text-sm text-gray-700 font-[501]">
                      {t("Dashboard.addCourse.levelLabel")}
                    </label>
                    <Select
                      dir={i18n.language === "en" ? "ltr" : "rtl"}
                      value={form.values.level || "none"}
                      onValueChange={(val) => {
                        if (isFormReady) {
                          form.setFieldValue("level", val)
                          form.setFieldTouched("level", true)
                        }
                      }}
                      onOpenChange={(open) => {
                        if (!open) {
                          form.setFieldTouched("level", true)
                        }
                      }}
                    >
                      <SelectTrigger
                        className={`w-full my-2 rounded-sm border text-sm 
                      ${
                        form.touched.level && form.errors.level
                          ? "border-red-500!"
                          : "border-[#e2e6f1] focus-visible:border-(--main-color) data-[state=open]:border-(--main-color)"
                      }
                    `}
                      >
                        <SelectValue
                          placeholder={t(
                            "Dashboard.addCourse.levelPlaceholder"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem disabled value="none">
                          {t("Dashboard.addCourse.levelPlaceholder")}
                        </SelectItem>
                        <SelectItem value="beginner">
                          {t("Dashboard.addCourse.levelBeginner")}
                        </SelectItem>
                        <SelectItem value="intermediate">
                          {t("Dashboard.addCourse.levelIntermediate")}
                        </SelectItem>
                        <SelectItem value="advanced">
                          {t("Dashboard.addCourse.levelAdvanced")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {form.touched.level && form.errors.level && (
                      <p className="text-red-500 text-xs">
                        {form.errors.level}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <label className="text-sm text-gray-700 font-[501]">
                {t("Dashboard.addCourse.shortDescriptionLabel")}
              </label>
              <textarea
                className={`w-full text-sm outline-none my-2 border rounded-sm duration-200 p-2 focus:border-(--main-color) ${
                  form.touched.short_description &&
                  form.errors.short_description
                    ? "border-red-500!"
                    : "border-[#e2e6f1] special_shadow"
                }`}
                name="short_description"
                rows={3}
                placeholder={t(
                  "Dashboard.addCourse.shortDescriptionPlaceholder"
                )}
                value={form.values.short_description}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
              {form.touched.short_description &&
                form.errors.short_description && (
                  <p className="text-red-500 text-xs">
                    {form.errors.short_description}
                  </p>
                )}

              <label className="text-sm text-gray-700 font-[501]">
                {t("Dashboard.addCourse.detailedDescriptionLabel")}
              </label>
              <div
                className={`my-2 border rounded-sm ${
                  form.touched.detailed_description &&
                  form.errors.detailed_description
                    ? "border-red-500"
                    : "border-[#e2e6f1]"
                }`}
              >
                <LexicalComposer key={editorKey} initialConfig={editorConfig}>
                  <ToolbarPlugin />
                  <div className="relative">
                    <RichTextPlugin
                      contentEditable={
                        <ContentEditable
                          className="min-h-[400px] outline-none p-4 text-sm"
                          onBlur={handleEditorBlur}
                        />
                      }
                      placeholder={
                        <div className="absolute top-4 left-4 text-gray-400 text-sm pointer-events-none">
                          {t(
                            "Dashboard.addCourse.detailedDescriptionPlaceholder"
                          )}
                        </div>
                      }
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                  </div>
                  <HistoryPlugin />
                  <ListPlugin />
                  <HtmlPlugin onChange={handleEditorChange} />
                  <InitialContentPlugin
                    html={course?.detailed_description || ""}
                  />
                </LexicalComposer>
              </div>
              {form.touched.detailed_description &&
                form.errors.detailed_description && (
                  <p className="text-red-500 text-xs">
                    {form.errors.detailed_description}
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