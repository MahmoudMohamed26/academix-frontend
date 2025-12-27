import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronDown, GripVertical, Plus, Trash2 } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import ContentSubForm from "./content-subform"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import { toast } from "sonner"
import BtnLoad from "@/components/BtnLoad"
import { Lecture } from "@/lib/types/lecture"
import { Quiz } from "@/lib/types/quiz"
import { ContentItem } from "@/lib/types/section"

interface SectionItemProps {
  section: {
    id: string
    title: string
    description: string
    position: number
    lectures?: Lecture[]
    quizzes?: Quiz[]
  }
  onUpdate: (id: string, data: any) => void
  onDelete: (id: string) => void
  courseId: string
  reorder: boolean
}

export default function SectionItem({
  section,
  onUpdate,
  onDelete,
  courseId,
  reorder,
}: SectionItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [contents, setContents] = useState<ContentItem[]>([])
  const Axios = useAxios()
  const queryClient = useQueryClient()

  useEffect(() => {
    const lectureContents: Lecture[] = (section.lectures || []).map(
      (lecture) => ({
        ...lecture,
        type: "lecture" as const,
      })
    )
    const quizContents: Quiz[] = (section.quizzes || []).map((quiz) => ({
      ...quiz,
      type: "quiz" as const,
    }))
    setContents(
      [...lectureContents, ...quizContents].sort(
        (a, b) => a.position - b.position
      )
    )
  }, [section.lectures, section.quizzes])

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const validationSchema = Yup.object({
    title: Yup.string().required("Section title is required"),
    description: Yup.string().required("Section description is required"),
  })

  const formik = useFormik({
    initialValues: {
      title: section.title,
      description: section.description,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      saveSectionMutation.mutate(values)
    },
  })

  const saveSectionMutation = useMutation({
    mutationFn: async (values: { title: string; description: string }) => {
      const isNewSection = section.id.startsWith("temp-")
      const endpoint = `/courses/${courseId}/sections`

      const cachedData = queryClient.getQueryData(["sections", courseId]) as any

      const allSections = Array.isArray(cachedData)
        ? cachedData
        : cachedData?.sections || []
      const dbSections = allSections.filter(
        (s: any) => !s.id.startsWith("temp-")
      )
      const calculatedPosition = isNewSection
        ? dbSections.length + 1
        : section.position

      console.log("Saving section:", {
        isNewSection,
        allSections: allSections.length,
        dbSections: dbSections.length,
        calculatedPosition,
        sectionPosition: section.position,
      })

      if (isNewSection) {
        return await Axios.post(endpoint, {
          title: values.title,
          description: values.description,
          position: calculatedPosition,
        })
      } else {
        return await Axios.patch(`${endpoint}/${section.id}`, {
          title: values.title,
          description: values.description,
          position: section.position,
        })
      }
    },
    onSuccess: (response) => {
      toast.success("Section saved successfully")
      queryClient.invalidateQueries({ queryKey: ["sections", courseId] })
      if (section.id.startsWith("temp-") && response.data?.id) {
        onUpdate(section.id, { ...formik.values, id: response.data.id })
      } else {
        onUpdate(section.id, formik.values)
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to save section")
    },
  })

  const deleteSectionMutation = useMutation({
    mutationFn: async () => {
      if (!section.id.startsWith("temp-")) {
        return await Axios.delete(`/courses/${courseId}/sections/${section.id}`)
      }
    },
    onSuccess: () => {
      toast.success("Section deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["sections", courseId] })
      onDelete(section.id)
      setIsDeleteDialogOpen(false)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete section")
      setIsDeleteDialogOpen(false)
    },
  })

  const generateId = () =>
    `temp-content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const handleAddLecture = () => {
    const newLecture: Lecture = {
      id: generateId(),
      type: "lecture",
      title: "",
      content: "",
      position: contents.length + 1,
      duration: 0,
      video_url: "",
    }
    setContents([...contents, newLecture])
  }

  const handleAddQuiz = () => {
    const newQuiz: Quiz = {
      id: generateId(),
      type: "quiz",
      title: "",
      points: 0,
      time_limit: 0,
      description: "",
      position: contents.length + 1,
      questions: [],
    }
    setContents([...contents, newQuiz])
  }

  const handleUpdateContent = (id: string, data: Partial<ContentItem>) => {
    setContents(
      contents.map((content) =>
        content.id === id ? ({ ...content, ...data } as ContentItem) : content
      )
    )
  }

  const handleDeleteContent = (id: string) => {
    setContents(contents.filter((content) => content.id !== id))
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setContents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const reordered = arrayMove(items, oldIndex, newIndex)
        return reordered.map((item, index) => ({
          ...item,
          position: index,
        }))
      })
    }
  }

  const handleDeleteSection = () => {
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    deleteSectionMutation.mutate()
  }

  return (
    <>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Section</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this section? This action cannot
              be undone.
              {contents.length > 0 && (
                <span className="block mt-2 text-red-600 font-medium">
                  Warning: This section contains {contents.length} content
                  item(s) that will also be deleted.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteSectionMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteSectionMutation.isPending}
            >
              {deleteSectionMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div ref={setNodeRef} style={style} className="mb-2">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="border border-gray-200">
            <div className="flex items-center gap-2 bg-gray-100">
              {!reorder ? (
                <button
                  type="button"
                  className="cursor-grab active:cursor-grabbing"
                  {...attributes}
                  {...listeners}
                >
                  <GripVertical
                    className={`h-5 w-5 ms-5 ${
                      isOpen ? "text-gray-400" : "text-gray-400"
                    }`}
                  />
                </button>
              ) : (
                <button className="ms-5 opacity-70">
                  <BtnLoad color="main" size={20} />
                </button>
              )}

              <CollapsibleTrigger className="p-4" asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isOpen ? "transform rotate-180" : ""
                    }`}
                  />
                  <span className="font-medium text-gray-700">
                    {formik.values.title || section.title}
                  </span>
                </button>
              </CollapsibleTrigger>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleDeleteSection}
                disabled={deleteSectionMutation.isPending}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <CollapsibleContent>
              <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
                <div>
                  <label className="text-sm text-gray-700 font-[501]">
                    Section Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full text-sm outline-none my-2 border rounded-sm duration-200 p-2 focus:border-(--main-color) ${
                      formik.touched.title && formik.errors.title
                        ? "border-red-500"
                        : "border-[#e2e6f1]"
                    }`}
                    placeholder="Enter section title"
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="text-red-500 text-xs">
                      {formik.errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-[501]">
                    Section Description
                  </label>
                  <textarea
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={3}
                    className={`w-full text-sm outline-none my-2 border rounded-sm duration-200 p-2 focus:border-(--main-color) ${
                      formik.touched.description && formik.errors.description
                        ? "border-red-500"
                        : "border-[#e2e6f1]"
                    }`}
                    placeholder="Enter section description"
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="text-red-500 text-xs">
                      {formik.errors.description}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={() => formik.handleSubmit()}
                  size="sm"
                  disabled={saveSectionMutation.isPending}
                  className="bg-(--main-color) hover:bg-(--main-darker-color)"
                >
                  {saveSectionMutation.isPending ? "Saving..." : "Save Section"}
                </Button>

                {!section.id.startsWith("temp-") && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-700">
                        Content ({contents.length})
                      </h4>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={handleAddLecture}
                          size="sm"
                          variant="outline"
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Lecture
                        </Button>
                        <Button
                          type="button"
                          onClick={handleAddQuiz}
                          size="sm"
                          variant="outline"
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Quiz
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={contents.map((c) => c.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {contents.map((content) => (
                            <ContentSubForm
                              key={content.id}
                              content={content}
                              onUpdate={handleUpdateContent}
                              onDelete={handleDeleteContent}
                              sectionId={section.id}
                              courseId={courseId}
                              allContent={contents}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>

                      {contents.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-4">
                          No content yet. Click "Add Lecture" or "Add Quiz" to
                          create one.
                        </p>
                      )}
                    </div>
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
