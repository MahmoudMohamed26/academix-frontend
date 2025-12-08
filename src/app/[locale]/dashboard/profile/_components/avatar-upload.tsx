"use client"

import { useState, useEffect } from "react"
import { useFormik } from "formik"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { User, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ImageEditor } from "./image-editor"
import { useTranslation } from "react-i18next"
import useAxios from "@/hooks/useAxios"
import { getUser } from "@/lib/api/User"
import { ProfileAvatar } from "@/lib/types/user"
import Skeleton from "react-loading-skeleton"

const base64ToBlob = (base64: string): Blob => {
  const parts = base64.split(";base64,")
  const contentType = parts[0].split(":")[1]
  const raw = window.atob(parts[1])
  const rawLength = raw.length
  const uInt8Array = new Uint8Array(rawLength)

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }

  return new Blob([uInt8Array], { type: contentType })
}

export function AvatarUpload() {
  const { t } = useTranslation()
  const Axios = useAxios()
  const queryClient = useQueryClient()
  const [tempImage, setTempImage] = useState<string | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const { data: userData } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: () => getUser(Axios),
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: async (avatar: string) => {
      const formData = new FormData()

      const blob = base64ToBlob(avatar)
      formData.append("avatar", blob, "avatar.jpg")

      const response = await Axios.post("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loggedInUser"] })
    },
    onError: (error) => {
      console.error("Error uploading avatar:", error)
    },
  })

  const deleteAvatarMutation = useMutation({
    mutationFn: async () => {
      const response = await Axios.delete("/profile/avatar")
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loggedInUser"] })
    },
    onError: (error) => {
      console.error("Error deleting avatar:", error)
    },
  })

  const formik = useFormik<ProfileAvatar>({
    initialValues: {
      avatar: null,
    },
    onSubmit: async (values) => {
      console.log("Submitting avatar:", values)
      if (values.avatar) {
        uploadAvatarMutation.mutate(values.avatar)
      }
    },
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log(file)
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => {
        setTempImage(reader.result as string)
        setShowEditor(true)
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => {
        setTempImage(reader.result as string)
        setShowEditor(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = (croppedImage: string) => {
    setShowEditor(false)
    setTempImage(null)
    uploadAvatarMutation.mutate(croppedImage)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteAvatarMutation.mutate()
  }

  return (
    <>
      <div className="p-8 lg:p-15 pt-0 pb-10! flex-col border-b gap-4">
        <div className="">
          <div className="relative w-fit m-auto">
            {!userData ? <Skeleton width={158} height={158} className="rounded-full!" /> : <div
              className={cn(
                "group/avatar relative h-40 w-40 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/20",
                userData?.avatar_url && "border-solid"
              )}
              onDragEnter={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                setIsDragging(false)
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => document.getElementById("avatar-input")?.click()}
            >
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="sr-only"
              />

              {userData?.avatar_url ? (
                <img
                  src={userData.avatar_url}
                  alt={t("Dashboard.avatarUpload.avatarAlt")}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="size-6 text-muted-foreground" />
                </div>
              )}
            </div>}

            {userData?.avatar_url && (
              <Button
                size="icon"
                variant="outline"
                onClick={handleRemove}
                className="size-6 absolute end-0 top-0 rounded-full"
                aria-label={t("Dashboard.avatarUpload.removeAvatar")}
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-0.5 mt-5 text-center">
          <p className="text-sm font-medium">
            {userData?.avatar_url
              ? t("Dashboard.avatarUpload.avatarUploaded")
              : t("Dashboard.avatarUpload.uploadAvatar")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("Dashboard.avatarUpload.fileRequirements")}
          </p>
        </div>
      </div>

      {showEditor && tempImage && (
        <ImageEditor
          image={tempImage}
          onSave={handleSave}
          onClose={() => {
            setShowEditor(false)
            setTempImage(null)
          }}
        />
      )}
    </>
  )
}
