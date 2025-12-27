"use client"
import { Section } from "@/lib/types/section"
import { useTranslation } from "react-i18next"
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
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import SectionItem from "./section-item"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { getSections } from "@/lib/api/Sections"
import useAxios from "@/hooks/useAxios"
import Skeleton from "react-loading-skeleton"
import { toast } from "sonner"

export default function SectionsForm() {
  const { t } = useTranslation()
  const [sections, setSections] = useState<Section[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const isUpdatingRef = useRef(false)
  const { id } = useParams()
  const Axios = useAxios()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["sections", id],
    queryFn: () => getSections(Axios, id),
  })

  useEffect(() => {
    if (data) {
      setSections(data)
    }
  }, [data])

  const updateSectionPosition = async ({
    sectionId,
    title,
    description,
    position,
  }: {
    sectionId: string
    title: string
    description: string
    position: number
  }) => {
    if (isUpdatingRef.current) {
      return
    }

    try {
      isUpdatingRef.current = true
      setIsUpdating(true)

      await Axios.patch(`/courses/${id}/sections/${sectionId}`, {
        title,
        description,
        position,
      })

      toast.success(t("SectionForm.positionUpdated"))
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || t("SectionForm.positionUpdateFailed")
      )

      if (data) {
        setSections(data)
      }
    } finally {
      setIsUpdating(false)
      isUpdatingRef.current = false
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = sections.findIndex((item) => item.id === active.id)
    const newIndex = sections.findIndex((item) => item.id === over.id)

    const reordered = arrayMove(sections, oldIndex, newIndex)

    const savedSections = reordered.filter((s) => !s.id.startsWith("temp-"))
    const updatedSections = reordered.map((item) => {
      if (item.id.startsWith("temp-")) {
        return item
      }
      const savedIndex = savedSections.findIndex((s) => s.id === item.id)
      return {
        ...item,
        position: savedIndex + 1,
      }
    })

    setSections(updatedSections)

    const draggedSection = updatedSections.find((s) => s.id === active.id)

    if (draggedSection && !draggedSection.id.startsWith("temp-")) {
      updateSectionPosition({
        sectionId: draggedSection.id,
        title: draggedSection.title,
        description: draggedSection.description,
        position: draggedSection.position,
      })
    }
  }

  const handleCreateSection = () => {
    const savedSections = sections.filter((s) => !s.id.startsWith("temp-"))
    const position = savedSections.length + 1

    const newSection: Section = {
      id: `temp-section-${Date.now()}`,
      title: `${t("SectionForm.section")} ${sections.length + 1}`,
      description: "",
      position: position,
      lectures: [],
      quizzes: [],
    }
    setSections([...sections, newSection])
  }

  const handleUpdateSection = (id: string, data: Partial<Section>) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, ...data } : section
      )
    )
  }

  const handleDeleteSection = (id: string) => {
    setSections(sections.filter((section) => section.id !== id))
  }

  if (isLoading) {
    return (
      <div className="px-2 py-4 mt-6 bg-[#ffff] rounded-md">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7! w-40!" />
          <Skeleton className="h-10! w-36!" />
        </div>
        <div>
          <Skeleton height={600} className="w-full! mb-5" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="px-2 py-4 mt-6 bg-[#ffff] rounded-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {t("Dashboard.SectionForm.courseSections")}
          </h3>
          <Button
            type="button"
            onClick={handleCreateSection}
            className="bg-(--main-color) hover:bg-(--main-darker-color) gap-2"
            disabled={isUpdating}
          >
            <Plus className="h-4 w-4" />
            {t("Dashboard.SectionForm.createSection")}
          </Button>
        </div>
        {sections.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">
              {t("Dashboard.SectionForm.noSections")}
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => (
                <SectionItem
                  key={section.id}
                  section={section as any}
                  onUpdate={handleUpdateSection}
                  onDelete={handleDeleteSection}
                  reorder={isUpdating}
                  courseId={id as string}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </>
  )
}