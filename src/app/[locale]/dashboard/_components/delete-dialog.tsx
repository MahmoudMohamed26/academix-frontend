"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BtnLoad from "@/components/BtnLoad";
import { useTranslation } from "react-i18next";

interface DeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string | null;
  deleteMutation: any;
}

export default function DeleteDialog({
  isOpen,
  onOpenChange,
  itemId,
  deleteMutation,
}: DeleteDialogProps) {
  const { t } = useTranslation();

  const handleDeleteConfirm = () => {
    if (itemId) {
      deleteMutation.mutate(itemId, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("Dashboard.categories.confirmDeleteTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("Dashboard.categories.confirmDeleteDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
            className="cursor-pointer"
          >
            {t("Dashboard.categories.cancelButton")}
          </Button>

          <Button
            onClick={handleDeleteConfirm}
            disabled={deleteMutation.isPending}
            className="bg-red-500 cursor-pointer hover:bg-red-600"
          >
            {deleteMutation.isPending ? (
              <BtnLoad size={16} />
            ) : (
              t("Dashboard.categories.deleteButton")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
