"use client"

import { useState } from "react"
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { SidebarMenuSubButton } from "@/components/ui/sidebar"
import { Collapsible } from "@radix-ui/react-collapsible"
import { useFormik } from "formik"
import { 
  ChevronDown, 
  Pencil, 
  Folder,
  Trash2,
} from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import LectureSubForm from "./lecture-subform"
import QuizSubForm from "./quiz-subform"
import Input from "@/components/Input"
import BtnLoad from "@/components/BtnLoad"

type Section = {
  id: number
  title: string
  description: string
  courseId: number
  order: number
}

type SectionFormData = {
  title: string
  description: string
}

export default function SectionItem({
  section,
  index,
  updateSectionMutation,
  validationSchema,
  t,
}: {
  section: Section
  index: number
  updateSectionMutation: any
  validationSchema: any
  t: any
}) {
  const Axios = useAxios()
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const sectionForm = useFormik<SectionFormData>({
    initialValues: {
      title: section.title,
      description: section.description,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      updateSectionMutation.mutate({
        sectionId: section.id,
        values,
      })
    },
  })

  // Fetch existing lectures
  const { data: lectures = [] } = useQuery({
    queryKey: ["lectures", section.id.toString()],
    queryFn: async () => {
      const response = await Axios.get(`/sections/${section.id}/contents`)
      return response.data
    },
  })

  // Delete section mutation
  const deleteSectionMutation = useMutation({
    mutationFn: async (sectionId: number) => {
      const response = await Axios.delete(`/sections/${sectionId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sections", section.courseId.toString()],
      })
      toast.success(t("Dashboard.addCourse.sectionDeletedSuccess"))
      setIsDialogOpen(false)
    },
    onError: (error) => {
      console.error("Error deleting section:", error)
      toast.error(t("Dashboard.addCourse.sectionDeletedError"))
    },
  })

  const removeSection = () => {
    deleteSectionMutation.mutate(section.id)
  }

  return (
    <div className="flex items-start gap-2 justify-between">
      <Collapsible className="border border-[#e2e6f1] rounded-sm flex-1">
        <div className="flex items-center gap-2">
          <CollapsibleTrigger className="flex-1" asChild>
            <SidebarMenuSubButton className="group-data-[state=open]/collapsible:bg-sidebar-accent select-none font-semibold">
              <Folder />
              {section.title || `${t("Dashboard.addCourse.sectionTitle")} ${index + 1}`}
              <ChevronDown className="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuSubButton>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="p-4 border-t">
          <div className="space-y-4">
            <div>
              <Input
                formik={sectionForm as any}
                placeholder={t("Dashboard.addCourse.sectionTitlePlaceholder")}
                label={t("Dashboard.addCourse.sectionTitleLabel")}
                name="title"
              />
            </div>

            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault()
                sectionForm.handleSubmit()
              }}
              disabled={updateSectionMutation.isPending}
              className="flex items-center cursor-pointer gap-2 bg-(--main-color) text-white text-sm rounded py-2 px-4 hover:bg-(--main-darker-color) transition disabled:opacity-50"
            >
              {updateSectionMutation.isPending ? (
                <BtnLoad size={16} />
              ) : (
                <>
                  <Pencil size={16} />
                  {t("Dashboard.addCourse.saveSectionButton")}
                </>
              )}
            </button>

            <LectureSubForm 
              sectionId={section.id} 
              existingLectures={lectures}
            />

            <QuizSubForm sectionId={section.id} />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="p-1 cursor-pointer hover:bg-red-100 rounded text-red-500 transition">
            <Trash2 size={22} />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Dashboard.addCourse.confirmDeleteSectionTitle")}</DialogTitle>
            <DialogDescription>
              {t("Dashboard.addCourse.confirmDeleteSectionDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="cursor-pointer"
            >
              {t("Dashboard.addCourse.cancelButton")}
            </Button>
            <Button
              onClick={removeSection}
              disabled={deleteSectionMutation.isPending}
              className="bg-red-500 cursor-pointer hover:bg-red-600"
            >
              {deleteSectionMutation.isPending ? (
                <BtnLoad size={16} />
              ) : (
                t("Dashboard.addCourse.deleteButton")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}