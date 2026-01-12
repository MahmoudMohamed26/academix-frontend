import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronRight, Trash2, Video, FileQuestion } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import QuizMaker from "./quiz-maker"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import { toast } from "sonner"
import { ContentItem } from "@/lib/types/section"
import { Quiz } from "@/lib/types/quiz"
import { useMediaQuery } from "@/hooks/use-media-query"
import { getLectureVideo } from "@/lib/api/Lectures"

interface ContentSubFormProps {
  content: ContentItem
  onUpdate: (id: string, data: Partial<ContentItem>) => void
  onDelete: (id: string) => void
  sectionId: string
  courseId: string
  allContent: ContentItem[]
}

export default function ContentSubForm({
  content,
  onUpdate,
  onDelete,
  sectionId,
  courseId,
  allContent,
}: ContentSubFormProps) {
  const { t, i18n } = useTranslation()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [isOpen, setIsOpen] = useState(false)
  const [contentType, setContentType] = useState<"lecture" | "quiz" | null>(
    content.type
  )
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const Axios = useAxios()
  const queryClient = useQueryClient()

  const isNonLocalLecture = content.type === "lecture" && !content.id.startsWith("temp-")

  const { data: lectureVideoUrl, isLoading: isLoadingVideoUrl } = useQuery({
    queryKey: ["lecture_url", sectionId, content.id],
    queryFn: () => getLectureVideo(Axios, courseId, sectionId, content.id),
    enabled: isOpen && isNonLocalLecture,
  })

  const calculatePosition = () => {
    const savedContentCount = allContent.filter(
      (item) => !item.id.startsWith("temp-")
    ).length
    return savedContentCount + 1
  }

  const lectureValidationSchema = Yup.object({
    title: Yup.string().required(
      t("Dashboard.SectionContent.lectureTitleRequired")
    ),
    content: Yup.string().required(
      t("Dashboard.SectionContent.descriptionRequired")
    ),
    duration: Yup.number()
      .required(t("Dashboard.SectionContent.durationRequired"))
      .min(1, t("Dashboard.SectionContent.durationMin")),
    video_url: Yup.string()
      .url(t("Dashboard.SectionContent.videoUrlInvalid"))
      .required(t("Dashboard.SectionContent.videoUrlRequired")),
  })

  const lectureFormik = useFormik({
    initialValues: {
      title: content.type === "lecture" ? content.title || "" : "",
      content: content.type === "lecture" ? content.content || "" : "",
      duration: content.type === "lecture" ? content.duration || 0 : 0,
      video_url: content.type === "lecture" ? content.video_url || "" : "",
    },
    enableReinitialize: true,
    validationSchema: lectureValidationSchema,
    onSubmit: (values) => {
      saveLectureMutation.mutate(values)
    },
  })

  useEffect(() => {
    if (lectureVideoUrl && isNonLocalLecture) {
      lectureFormik.setFieldValue("video_url", lectureVideoUrl)
    }
  }, [lectureVideoUrl, isNonLocalLecture])

  const saveLectureMutation = useMutation({
    mutationFn: async (values: any) => {
      const isNewLecture = content.id.startsWith("temp-")
      const endpoint = `/courses/${courseId}/sections/${sectionId}/lectures`
      const position = isNewLecture ? calculatePosition() : content.position

      if (isNewLecture) {
        return await Axios.post(endpoint, {
          ...values,
          position,
          section_id: sectionId,
        })
      } else {
        return await Axios.patch(`${endpoint}/${content.id}`, {
          ...values,
          position,
        })
      }
    },
    onSuccess: (response) => {
      toast.success(t("Dashboard.SectionContent.lectureSaved"))
      queryClient.invalidateQueries({ queryKey: ["sections", courseId] })
      if (content.id.startsWith("temp-") && response.data?.id) {
        onUpdate(content.id, {
          ...lectureFormik.values,
          id: response.data.id,
          type: "lecture",
          position: response.data.position || calculatePosition(),
        })
      } else {
        onUpdate(content.id, {
          ...lectureFormik.values,
          type: "lecture",
          position: content.position,
        })
      }
      setIsOpen(false)
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          t("Dashboard.SectionContent.lectureSaveFailed")
      )
    },
  })

  const deleteLectureMutation = useMutation({
    mutationFn: async () => {
      if (!content.id.startsWith("temp-") && content.type === "lecture") {
        const endpoint = `/courses/${courseId}/sections/${sectionId}/lectures/${content.id}`
        return await Axios.delete(endpoint)
      }
    },
    onSuccess: () => {
      toast.success(t("Dashboard.SectionContent.lectureDeleted"))
      queryClient.invalidateQueries({ queryKey: ["sections", courseId] })
      onDelete(content.id)
      setIsDeleteDialogOpen(false)
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          t("Dashboard.SectionContent.lectureDeleteFailed")
      )
      setIsDeleteDialogOpen(false)
    },
  })

  const deleteQuizMutation = useMutation({
    mutationFn: async () => {
      if (!content.id.startsWith("temp-") && content.type === "quiz") {
        const endpoint = `/courses/${courseId}/sections/${sectionId}/quizzes/${content.id}`
        return await Axios.delete(endpoint)
      }
    },
    onSuccess: () => {
      toast.success(t("Dashboard.SectionContent.quizDeleted"))
      queryClient.invalidateQueries({ queryKey: ["sections", courseId] })
      onDelete(content.id)
      setIsDeleteDialogOpen(false)
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          t("Dashboard.SectionContent.quizDeleteFailed")
      )
      setIsDeleteDialogOpen(false)
    },
  })

  const handleSelectContentType = (type: "lecture" | "quiz") => {
    setContentType(type)
    if (type === "quiz") {
      setIsQuizDialogOpen(true)
    }
  }

  const handleQuizSave = (quizData: Omit<Quiz, "id" | "position" | "type">) => {
    const position = content.id.startsWith("temp-")
      ? calculatePosition()
      : content.position

    onUpdate(content.id, {
      ...quizData,
      type: "quiz",
      position,
    })
    setIsQuizDialogOpen(false)
    setIsOpen(false)
  }

  const handleDelete = () => {
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (content.type === "lecture") {
      deleteLectureMutation.mutate()
    } else if (content.type === "quiz") {
      deleteQuizMutation.mutate()
    }
  }

  const getContentTypeLabel = () => {
    return content.type === "lecture"
      ? t("Dashboard.SectionContent.lecture")
      : t("Dashboard.SectionContent.quiz")
  }

  const deleteDialogContent = (
    <>
      {isDesktop ? (
        <>
          <DialogHeader>
            <DialogTitle>
              {content.type === "lecture"
                ? t("Dashboard.SectionContent.deleteLecture")
                : t("Dashboard.SectionContent.deleteQuiz")}
            </DialogTitle>
            <DialogDescription>
              {t("Dashboard.SectionContent.deleteContentConfirmation", {
                type: getContentTypeLabel().toLowerCase(),
              })}
              {content.type === "quiz" && content.questions?.length > 0 && (
                <span className="block mt-2 text-red-600 font-medium">
                  {t("Dashboard.SectionContent.deleteQuizWarning", {
                    count: content.questions.length,
                  })}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={
                deleteLectureMutation.isPending || deleteQuizMutation.isPending
              }
            >
              {t("Dashboard.SectionContent.cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={
                deleteLectureMutation.isPending || deleteQuizMutation.isPending
              }
            >
              {deleteLectureMutation.isPending || deleteQuizMutation.isPending
                ? t("Dashboard.SectionContent.deleting")
                : t("Dashboard.SectionContent.delete")}
            </Button>
          </DialogFooter>
        </>
      ) : (
        <>
          <DrawerHeader>
            <DrawerTitle>
              {content.type === "lecture"
                ? t("Dashboard.SectionContent.deleteLecture")
                : t("Dashboard.SectionContent.deleteQuiz")}
            </DrawerTitle>
            <DrawerDescription>
              {t("Dashboard.SectionContent.deleteContentConfirmation", {
                type: getContentTypeLabel().toLowerCase(),
              })}
              {content.type === "quiz" && content.questions?.length > 0 && (
                <span className="block mt-2 text-red-600 font-medium">
                  {t("Dashboard.SectionContent.deleteQuizWarning", {
                    count: content.questions.length,
                  })}
                </span>
              )}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={
                deleteLectureMutation.isPending || deleteQuizMutation.isPending
              }
            >
              {deleteLectureMutation.isPending || deleteQuizMutation.isPending
                ? t("Dashboard.SectionContent.deleting")
                : t("Dashboard.SectionContent.delete")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={
                deleteLectureMutation.isPending || deleteQuizMutation.isPending
              }
            >
              {t("Dashboard.SectionContent.cancel")}
            </Button>
          </DrawerFooter>
        </>
      )}
    </>
  )

  const quizDialogContent = (
    <>
      {isDesktop ? (
        <>
          <DialogHeader>
            <DialogTitle>
              {t("Dashboard.SectionContent.quizMaker")}
            </DialogTitle>
            <DialogDescription>
              {t("Dashboard.SectionContent.quizMakerDescription")}
            </DialogDescription>
          </DialogHeader>
          <QuizMaker
            onSave={handleQuizSave}
            initialData={
              content.type === "quiz" ? content : undefined
            }
            courseId={courseId}
            allContent={allContent}
            sectionId={sectionId}
          />
        </>
      ) : (
        <>
          <DrawerHeader>
            <DrawerTitle>
              {t("Dashboard.SectionContent.quizMaker")}
            </DrawerTitle>
            <DrawerDescription>
              {t("Dashboard.SectionContent.quizMakerDescription")}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto max-h-[70vh]">
            <QuizMaker
              onSave={handleQuizSave}
              initialData={
                content.type === "quiz" ? content : undefined
              }
              courseId={courseId}
              allContent={allContent}
              sectionId={sectionId}
            />
          </div>
        </>
      )}
    </>
  )

  return (
    <>
      {isDesktop ? (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            {deleteDialogContent}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DrawerContent>
            {deleteDialogContent}
          </DrawerContent>
        </Drawer>
      )}

      <div>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="border border-gray-200 rounded-md bg-gray-50">
            <div className="flex items-center gap-2 px-3">
              {content.type === "lecture" ? (
                <Video className="h-4 w-4 text-gray-500" />
              ) : (
                <FileQuestion className="h-4 w-4 text-gray-500" />
              )}

              <CollapsibleTrigger className="p-3" asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  <ChevronRight
                    className={`h-3 w-3 transition-transform ${
                      isOpen
                        ? "transform rotate-90"
                        : i18n.language === "ar"
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                  <span className="text-sm text-gray-700">
                    {content.title || t("Dashboard.SectionContent.newContent")}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({getContentTypeLabel()})
                  </span>
                </button>
              </CollapsibleTrigger>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={
                  deleteLectureMutation.isPending ||
                  deleteQuizMutation.isPending
                }
                className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            <CollapsibleContent>
              <div className="px-3 pb-3 space-y-3 border-t border-gray-200 pt-3">
                {!contentType && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-3">
                      {t("Dashboard.SectionContent.selectContentType")}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSelectContentType("lecture")}
                        className="flex items-center gap-2 h-20 flex-col"
                      >
                        <Video className="h-5 w-5" />
                        <span>{t("Dashboard.SectionContent.lecture")}</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSelectContentType("quiz")}
                        className="flex items-center gap-2 h-20 flex-col"
                      >
                        <FileQuestion className="h-5 w-5" />
                        <span>{t("Dashboard.SectionContent.quiz")}</span>
                      </Button>
                    </div>
                  </div>
                )}

                {contentType === "lecture" && (
                  <>
                    <div>
                      <label className="text-xs text-gray-700 font-[501]">
                        {t("Dashboard.SectionContent.lectureTitle")}
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={lectureFormik.values.title}
                        onChange={lectureFormik.handleChange}
                        onBlur={lectureFormik.handleBlur}
                        className={`w-full text-sm outline-none my-1 border rounded-sm duration-200 p-2 focus:border-(--main-color) ${
                          lectureFormik.touched.title &&
                          lectureFormik.errors.title
                            ? "border-red-500"
                            : "border-[#e2e6f1]"
                        }`}
                        placeholder={t(
                          "Dashboard.SectionContent.lectureTitlePlaceholder"
                        )}
                      />
                      {lectureFormik.touched.title &&
                        lectureFormik.errors.title && (
                          <p className="text-red-500 text-xs">
                            {lectureFormik.errors.title}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="text-xs text-gray-700 font-[501]">
                        {t("Dashboard.SectionContent.description")}
                      </label>
                      <textarea
                        name="content"
                        value={lectureFormik.values.content}
                        onChange={lectureFormik.handleChange}
                        onBlur={lectureFormik.handleBlur}
                        rows={2}
                        className={`w-full text-sm outline-none my-1 border rounded-sm duration-200 p-2 focus:border-(--main-color) ${
                          lectureFormik.touched.content &&
                          lectureFormik.errors.content
                            ? "border-red-500"
                            : "border-[#e2e6f1]"
                        }`}
                        placeholder={t(
                          "Dashboard.SectionContent.descriptionPlaceholder"
                        )}
                      />
                      {lectureFormik.touched.content &&
                        lectureFormik.errors.content && (
                          <p className="text-red-500 text-xs">
                            {lectureFormik.errors.content}
                          </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-700 font-[501]">
                          {t("Dashboard.SectionContent.duration")}
                        </label>
                        <input
                          type="number"
                          name="duration"
                          value={lectureFormik.values.duration}
                          onChange={lectureFormik.handleChange}
                          onBlur={lectureFormik.handleBlur}
                          className={`w-full text-sm outline-none my-1 border rounded-sm duration-200 p-2 focus:border-(--main-color) ${
                            lectureFormik.touched.duration &&
                            lectureFormik.errors.duration
                              ? "border-red-500"
                              : "border-[#e2e6f1]"
                          }`}
                          placeholder={t(
                            "Dashboard.SectionContent.durationPlaceholder"
                          )}
                        />
                        {lectureFormik.touched.duration &&
                          lectureFormik.errors.duration && (
                            <p className="text-red-500 text-xs">
                              {lectureFormik.errors.duration}
                            </p>
                          )}
                      </div>

                      <div>
                        <label className="text-xs text-gray-700 font-[501]">
                          {t("Dashboard.SectionContent.videoUrl")}
                        </label>
                        {isLoadingVideoUrl && isNonLocalLecture ? (
                          <div className="w-full h-9 my-1 bg-gray-200 animate-pulse rounded-sm" />
                        ) : (
                          <input
                            type="url"
                            name="video_url"
                            value={lectureFormik.values.video_url}
                            onChange={lectureFormik.handleChange}
                            onBlur={lectureFormik.handleBlur}
                            className={`w-full text-sm outline-none my-1 border rounded-sm duration-200 p-2 focus:border-(--main-color) ${
                              lectureFormik.touched.video_url &&
                              lectureFormik.errors.video_url
                                ? "border-red-500"
                                : "border-[#e2e6f1]"
                            }`}
                            placeholder={t(
                              "Dashboard.SectionContent.videoUrlPlaceholder"
                            )}
                          />
                        )}
                        {lectureFormik.touched.video_url &&
                          lectureFormik.errors.video_url && (
                            <p className="text-red-500 text-xs">
                              {lectureFormik.errors.video_url}
                            </p>
                          )}
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => lectureFormik.handleSubmit()}
                      size="sm"
                      disabled={saveLectureMutation.isPending}
                      className="bg-(--main-color) my-5 hover:bg-(--main-darker-color)"
                    >
                      {saveLectureMutation.isPending
                        ? t("Dashboard.SectionContent.saving")
                        : t("Dashboard.SectionContent.saveLecture")}
                    </Button>
                  </>
                )}

                {contentType === "quiz" && (
                  <div className="space-y-3">
                    <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                      <p className="text-sm text-orange-500">
                        {content.type === "quiz" &&
                        content.id &&
                        !content.id.startsWith("temp-")
                          ? t("Dashboard.SectionContent.quizCreatedInfo")
                          : t("Dashboard.SectionContent.quizCreateInfo")}
                      </p>
                    </div>

                    {isDesktop ? (
                      <Dialog
                        open={isQuizDialogOpen}
                        onOpenChange={setIsQuizDialogOpen}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => setIsQuizDialogOpen(true)}
                        >
                          {content.type === "quiz" &&
                          content.id &&
                          !content.id.startsWith("temp-")
                            ? t("Dashboard.SectionContent.editQuiz")
                            : t("Dashboard.SectionContent.createQuiz")}
                        </Button>
                        <DialogContent
                          onInteractOutside={(e) => {
                            e.preventDefault()
                          }}
                          className="max-w-3xl max-h-[90vh] overflow-y-auto"
                        >
                          {quizDialogContent}
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Drawer
                        open={isQuizDialogOpen}
                        onOpenChange={setIsQuizDialogOpen}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => setIsQuizDialogOpen(true)}
                        >
                          {content.type === "quiz" &&
                          content.id &&
                          !content.id.startsWith("temp-")
                            ? t("Dashboard.SectionContent.editQuiz")
                            : t("Dashboard.SectionContent.createQuiz")}
                        </Button>
                        <DrawerContent className="max-h-[90vh]">
                          {quizDialogContent}
                        </DrawerContent>
                      </Drawer>
                    )}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </>
  )
}