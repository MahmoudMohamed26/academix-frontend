import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronRight, GripVertical, Trash2, Video, FileQuestion } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import QuizMaker from "./quiz-maker"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import { toast } from "sonner"

interface Lecture {
  id: string
  type: "lecture"
  title: string
  content: string
  position: number
  duration: number
  video_url: string
}

interface Quiz {
  id: string
  type: "quiz"
  title: string
  description: string
  position: number
  questions: QuizQuestion[]
}

interface QuizQuestion {
  id: string
  question: string
  answers: QuizAnswer[]
}

interface QuizAnswer {
  id: string
  text: string
  isCorrect: boolean
}

type ContentItem = Lecture | Quiz

interface ContentSubFormProps {
  content: ContentItem
  onUpdate: (id: string, data: Partial<ContentItem>) => void
  onDelete: (id: string) => void
  sectionId: string
  courseId: string
}

export default function ContentSubForm({
  content,
  onUpdate,
  onDelete,
  sectionId,
  courseId,
}: ContentSubFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [contentType, setContentType] = useState<"lecture" | "quiz" | null>(
    content.type
  )
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false)
  const Axios = useAxios()
  const queryClient = useQueryClient()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: content.id,
    disabled: isOpen,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const lectureValidationSchema = Yup.object({
    title: Yup.string().required("Lecture title is required"),
    content: Yup.string().required("Lecture description is required"),
    duration: Yup.number()
      .required("Duration is required")
      .min(1, "Duration must be at least 1 minute"),
    video_url: Yup.string()
      .url("Must be a valid URL")
      .required("Video URL is required"),
  })

  const lectureFormik = useFormik({
    initialValues: {
      title: content.type === "lecture" ? content.title : "",
      content: content.type === "lecture" ? content.content : "",
      duration: content.type === "lecture" ? content.duration : 0,
      video_url: content.type === "lecture" ? content.video_url : "",
    },
    enableReinitialize: true,
    validationSchema: lectureValidationSchema,
    onSubmit: (values) => {
      saveLectureMutation.mutate(values)
    },
  })

  // Save lecture mutation
  const saveLectureMutation = useMutation({
    mutationFn: async (values: any) => {
      const isNewLecture = content.id.startsWith('temp-')
      const endpoint = `/courses/${courseId}/sections/${sectionId}/lectures`
      
      if (isNewLecture) {
        return await Axios.post(endpoint, {
          ...values,
          position: content.position
        })
      } else {
        return await Axios.put(`${endpoint}/${content.id}`, {
          ...values,
          position: content.position
        })
      }
    },
    onSuccess: (response) => {
      toast.success("Lecture saved successfully")
      queryClient.invalidateQueries({ queryKey: ["sections", courseId] })
      if (content.id.startsWith('temp-') && response.data?.id) {
        onUpdate(content.id, { 
          ...lectureFormik.values, 
          id: response.data.id,
          type: "lecture",
          position: content.position 
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
      toast.error(error?.response?.data?.message || "Failed to save lecture")
    }
  })

  // Delete lecture mutation
  const deleteLectureMutation = useMutation({
    mutationFn: async () => {
      if (!content.id.startsWith('temp-') && content.type === "lecture") {
        const endpoint = `/courses/${courseId}/sections/${sectionId}/lectures/${content.id}`
        return await Axios.delete(endpoint)
      }
    },
    onSuccess: () => {
      toast.success("Lecture deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["sections", courseId] })
      onDelete(content.id)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete lecture")
    }
  })

  const handleSelectContentType = (type: "lecture" | "quiz") => {
    setContentType(type)
    if (type === "quiz") {
      setIsQuizDialogOpen(true)
    }
  }

  const handleQuizSave = (quizData: Omit<Quiz, "id" | "position" | "type">) => {
    onUpdate(content.id, {
      ...quizData,
      type: "quiz",
      position: content.position,
    })
    setIsQuizDialogOpen(false)
    setIsOpen(false)
  }

  const handleQuizEdit = () => {
    setIsQuizDialogOpen(true)
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this ${content.type}?`)) {
      if (content.type === "lecture") {
        deleteLectureMutation.mutate()
      } else {
        // For quiz deletion, add similar logic when implementing quiz API
        onDelete(content.id)
      }
    }
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="border border-gray-200 rounded-md bg-gray-50">
          <div className="flex items-center gap-2 p-3">
            <button
              type="button"
              className={`${isOpen ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}`}
              {...attributes}
              {...listeners}
            >
              <GripVertical className={`h-4 w-4 ${isOpen ? "text-gray-300" : "text-gray-400"}`} />
            </button>

            {content.type === "lecture" ? (
              <Video className="h-4 w-4 text-gray-500" />
            ) : (
              <FileQuestion className="h-4 w-4 text-gray-500" />
            )}

            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 flex-1 text-left"
              >
                <ChevronRight
                  className={`h-3 w-3 transition-transform ${
                    isOpen ? "transform rotate-90" : ""
                  }`}
                />
                <span className="text-sm text-gray-700">
                  {content.title || "New Content"}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({content.type === "lecture" ? "Lecture" : "Quiz"})
                </span>
              </button>
            </CollapsibleTrigger>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deleteLectureMutation.isPending}
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
                    Select content type:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSelectContentType("lecture")}
                      className="flex items-center gap-2 h-20 flex-col"
                    >
                      <Video className="h-5 w-5" />
                      <span>Lecture</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSelectContentType("quiz")}
                      className="flex items-center gap-2 h-20 flex-col"
                    >
                      <FileQuestion className="h-5 w-5" />
                      <span>Quiz</span>
                    </Button>
                  </div>
                </div>
              )}

              {contentType === "lecture" && (
                <>
                  <div>
                    <label className="text-xs text-gray-700 font-[501]">
                      Lecture Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={lectureFormik.values.title}
                      onChange={lectureFormik.handleChange}
                      onBlur={lectureFormik.handleBlur}
                      className={`w-full text-sm outline-none my-1 border rounded-sm duration-200 p-2 focus:border-blue-500 ${
                        lectureFormik.touched.title && lectureFormik.errors.title
                          ? "border-red-500"
                          : "border-[#e2e6f1]"
                      }`}
                      placeholder="Enter lecture title"
                    />
                    {lectureFormik.touched.title && lectureFormik.errors.title && (
                      <p className="text-red-500 text-xs">{lectureFormik.errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-700 font-[501]">
                      Description
                    </label>
                    <textarea
                      name="content"
                      value={lectureFormik.values.content}
                      onChange={lectureFormik.handleChange}
                      onBlur={lectureFormik.handleBlur}
                      rows={2}
                      className={`w-full text-sm outline-none my-1 border rounded-sm duration-200 p-2 focus:border-blue-500 ${
                        lectureFormik.touched.content && lectureFormik.errors.content
                          ? "border-red-500"
                          : "border-[#e2e6f1]"
                      }`}
                      placeholder="Enter lecture description"
                    />
                    {lectureFormik.touched.content && lectureFormik.errors.content && (
                      <p className="text-red-500 text-xs">
                        {lectureFormik.errors.content}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-700 font-[501]">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={lectureFormik.values.duration}
                        onChange={lectureFormik.handleChange}
                        onBlur={lectureFormik.handleBlur}
                        className={`w-full text-sm outline-none my-1 border rounded-sm duration-200 p-2 focus:border-blue-500 ${
                          lectureFormik.touched.duration && lectureFormik.errors.duration
                            ? "border-red-500"
                            : "border-[#e2e6f1]"
                        }`}
                        placeholder="60"
                      />
                      {lectureFormik.touched.duration && lectureFormik.errors.duration && (
                        <p className="text-red-500 text-xs">
                          {lectureFormik.errors.duration}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs text-gray-700 font-[501]">
                        Video URL
                      </label>
                      <input
                        type="url"
                        name="video_url"
                        value={lectureFormik.values.video_url}
                        onChange={lectureFormik.handleChange}
                        onBlur={lectureFormik.handleBlur}
                        className={`w-full text-sm outline-none my-1 border rounded-sm duration-200 p-2 focus:border-blue-500 ${
                          lectureFormik.touched.video_url && lectureFormik.errors.video_url
                            ? "border-red-500"
                            : "border-[#e2e6f1]"
                        }`}
                        placeholder="https://example.com/video.mp4"
                      />
                      {lectureFormik.touched.video_url && lectureFormik.errors.video_url && (
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
                    className="bg-blue-600 hover:bg-blue-700 w-full"
                  >
                    {saveLectureMutation.isPending ? "Saving..." : "Save Lecture"}
                  </Button>
                </>
              )}

              {contentType === "quiz" && (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-sm text-blue-800">
                      {content.type === "quiz" && content.questions?.length > 0
                        ? `Quiz created with ${content.questions.length} question(s)`
                        : "Quiz not created yet"}
                    </p>
                  </div>
                  
                  <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                      >
                        {content.type === "quiz" && content.questions?.length > 0
                          ? "Edit Quiz"
                          : "Create Quiz"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Quiz Maker</DialogTitle>
                      </DialogHeader>
                      <QuizMaker
                        onSave={handleQuizSave}
                        initialData={content.type === "quiz" ? content : undefined}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  )
}