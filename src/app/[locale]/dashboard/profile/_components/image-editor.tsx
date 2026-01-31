"use client"

import { useState, useRef, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Camera, X, RotateCw, ZoomIn, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useAxios from "@/hooks/use-axios"
import { useLocale } from "@/hooks/use-locale"
import { getTranslator } from "@/lib/i18n"
import { updateProfile } from "@/lib/apis/authClient"
import type { Area, Point } from "react-easy-crop"

interface ProfileImageProps {
  currentImage?: string | null | undefined
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener("load", () => resolve(img))
    img.addEventListener("error", reject)
    img.setAttribute("crossOrigin", "anonymous")
    img.src = url
  })

// ────────────────────────────────────────────────
// Very reliable cropping function (same as reference)
const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<Blob> => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) throw new Error("Cannot get 2d context")

  const safeArea = Math.max(image.width, image.height) * 2.828 // ≈ √8 = 2 * √2
  canvas.width = safeArea
  canvas.height = safeArea

  // center & rotate
  ctx.translate(safeArea / 2, safeArea / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.translate(-safeArea / 2, -safeArea / 2)

  // draw rotated/scaled image
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  )

  // extract cropped portion
  const data = ctx.getImageData(0, 0, safeArea, safeArea)
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/jpeg",
      0.92
    )
  })
}

export default function ProfileImage({ currentImage }: ProfileImageProps) {
  const locale = useLocale()
  const { t } = getTranslator(locale)
  const axios = useAxios()
  const queryClient = useQueryClient()

  const [isEditing, setIsEditing] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateProfileMutation = useMutation({
    mutationFn: async (blob: Blob) => {
      const formData = new FormData()
      formData.append("image", blob, "profile.jpg")
      formData.append("_method", "PATCH")

      return updateProfile(axios, formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })
      handleClose()
    },
    onError: (err) => console.error("Upload failed", err),
  })

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImage(reader.result as string)
      setIsEditing(true)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setRotation(0)
      setCroppedAreaPixels(null)
    }
    reader.readAsDataURL(file)

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleClose = () => {
    setIsEditing(false)
    setSelectedImage(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    setCroppedAreaPixels(null)
  }

  const handleSave = async () => {
    if (!selectedImage || !croppedAreaPixels) return

    try {
      const croppedBlob = await getCroppedImg(selectedImage, croppedAreaPixels, rotation)
      console.log("Cropped blob ready:", croppedBlob.size, croppedBlob.type)

      updateProfileMutation.mutate(croppedBlob)
    } catch (err) {
      console.error("Crop failed:", err)
    }
  }

  const handleImageClick = () => fileInputRef.current?.click()

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div
          className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer group overflow-hidden"
          onClick={handleImageClick}
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera size={40} className="text-gray-400" />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={32} className="text-white" />
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <p className="text-sm text-gray-500">{t("account.info.uploadPhoto")}</p>
      </div>

      <Dialog open={isEditing} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("account.info.editPhoto")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Cropper container */}
            <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              {selectedImage && (
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}                  // square → circle
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                />
              )}
            </div>

            {/* Controls */}
            <div className="space-y-4 px-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <ZoomIn size={16} />
                    {t("account.info.zoom")}
                  </label>
                  <span className="text-sm text-gray-500">{Math.round(zoom * 100)}%</span>
                </div>
                <Slider
                  value={[zoom]}
                  onValueChange={([v]) => setZoom(v)}
                  min={1}
                  max={5}
                  step={0.05}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <RotateCw size={16} />
                    {t("account.info.rotate")}
                  </label>
                  <span className="text-sm text-gray-500">{rotation}°</span>
                </div>
                <Slider
                  value={[rotation]}
                  onValueChange={([v]) => setRotation(v)}
                  min={-180}
                  max={180}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={updateProfileMutation.isPending}
              >
                <X size={16} className="mr-2" />
                {t("common.cancel")}
              </Button>
              <Button
                className="flex-1"
                onClick={handleSave}
                disabled={updateProfileMutation.isPending || !croppedAreaPixels}
              >
                <Check size={16} className="mr-2" />
                {updateProfileMutation.isPending ? t("common.saving") : t("common.save")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}