"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import BtnLoad from "@/components/BtnLoad"
import { useTranslation } from "react-i18next"

interface DeleteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  itemId: string | null
  deleteMutation: any
  type: "categories" | "courses" | "payments" | "default" | "pending-courses"
}

export default function DeleteDialog({
  isOpen,
  onOpenChange,
  itemId,
  type,
  deleteMutation,
}: DeleteDialogProps) {
  const { t } = useTranslation()

  const handleDeleteConfirm = () => {
    if (itemId) {
      deleteMutation.mutate(itemId, {
        onSuccess: () => {
          onOpenChange(false)
        },
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "categories"
              ? t("Dashboard.deleteDialog.confirmDeleteTitleCategory")
              : type === "courses"
              ? t("Dashboard.deleteDialog.confirmDeleteTitleCourse")
              : type === "pending-courses"
              ? t("Dashboard.deleteDialog.confirmDeleteTitlePendingCourses")
              : ""}
          </DialogTitle>
          <DialogDescription>
            {type === "categories"
              ? t("Dashboard.deleteDialog.confirmDeleteDescriptionCategory")
              : type === "courses"
              ? t("Dashboard.deleteDialog.confirmDeleteDescriptionCourse")
              : type === "pending-courses"
              ? t("Dashboard.deleteDialog.confirmDeleteDescriptionPendingCourse")
              : ""}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
            className="cursor-pointer"
          >
            {t("Dashboard.deleteDialog.cancelButton")}
          </Button>

          <Button
            onClick={handleDeleteConfirm}
            disabled={deleteMutation.isPending}
            className="bg-red-500 cursor-pointer hover:bg-red-600"
          >
            {deleteMutation.isPending ? (
              <BtnLoad size={16} />
            ) : (
              type === "categories"
              ? t("Dashboard.deleteDialog.deleteButton")
              : type === "courses"
              ? t("Dashboard.deleteDialog.deleteButton")
              : type === "pending-courses"
              ? t("Dashboard.deleteDialog.RejectButton")
              : ""
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
