"use client"

import { useState } from "react"
import { Video, Trash2 } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"
import useAxios from "@/hooks/useAxios"
import { toast } from "sonner"
import { ExistingLectureFormValues, Lecture, LocalLecture } from "@/lib/types/lecture"
import Input from "@/components/Input"
import BtnLoad from "@/components/BtnLoad"

export default function LectureSubForm({ 
  sectionId, 
  existingLectures 
}: { 
  sectionId: number
  existingLectures: Lecture[]
}) {
  const { t } = useTranslation()
  const Axios = useAxios()
  const queryClient = useQueryClient()
  const [lectures, setLectures] = useState<LocalLecture[]>([])
  const [savingLectureId, setSavingLectureId] = useState<string | null>(null)

  const lectureValidationSchema = Yup.object({
    title: Yup.string()
      .required(t("Dashboard.lecture.titleRequired"))
      .min(3, t("Dashboard.lecture.titleMinLength")),
    url: Yup.string()
      .required(t("Dashboard.lecture.urlRequired"))
      .url(t("Dashboard.lecture.urlValid"))
      .matches(
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
        t("Dashboard.lecture.youtubeUrlValid")
      ),
  })

  // Single formik instance for all new lectures
  const newLecturesFormik = useFormik({
    initialValues: lectures.reduce((acc, lecture) => {
      acc[lecture.id] = { title: lecture.title, url: lecture.url }
      return acc
    }, {} as Record<string, { title: string, url: string }>),
    enableReinitialize: true,
    validationSchema: Yup.object().shape(
      lectures.reduce((acc, lecture) => {
        acc[lecture.id] = Yup.object({
          title: Yup.string()
            .required(t("Dashboard.lecture.titleRequired"))
            .min(3, t("Dashboard.lecture.titleMinLength")),
          url: Yup.string()
            .required(t("Dashboard.lecture.urlRequired"))
            .url(t("Dashboard.lecture.urlValid"))
            .matches(
              /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
              t("Dashboard.lecture.youtubeUrlValid")
            ),
        })
        return acc
      }, {} as Record<string, any>)
    ),
    onSubmit: () => {}, // Not used, we handle submit per lecture
  })

  // Formik instance for existing lectures
  const existingLecturesFormik = useFormik<ExistingLectureFormValues>({
    initialValues: existingLectures.reduce((acc, lecture) => {
      acc[lecture.id] = { 
        title: lecture.title, 
        url: lecture.video.url 
      }
      return acc
    }, {} as ExistingLectureFormValues),
    enableReinitialize: true,
    validationSchema: Yup.object().shape(
      existingLectures.reduce((acc, lecture) => {
        acc[lecture.id] = Yup.object({
          title: Yup.string()
            .required(t("Dashboard.lecture.titleRequired"))
            .min(3, t("Dashboard.lecture.titleMinLength")),
          url: Yup.string()
            .required(t("Dashboard.lecture.urlRequired"))
            .url(t("Dashboard.lecture.urlValid"))
            .matches(
              /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
              t("Dashboard.lecture.youtubeUrlValid")
            ),
        })
        return acc
      }, {} as Record<string, any>)
    ),
    onSubmit: () => {}, // Not used
  })

  const saveLectureMutation = useMutation({
    mutationFn: async ({ 
      lectureId, 
      title, 
      url 
    }: { 
      lectureId: string
      title: string
      url: string 
    }) => {
      const response = await Axios.post(`/sections/${sectionId}/videos`, {
        title,
        url,
      })
      return { data: response.data, lectureId }
    },
    onSuccess: (result) => {
      // Remove the saved lecture from local state
      setLectures(prev => prev.filter(lecture => lecture.id !== result.lectureId))
      setSavingLectureId(null)
      
      queryClient.invalidateQueries({
        queryKey: ["lectures", sectionId.toString()],
      })
      toast.success(t("Dashboard.lecture.savedSuccessfully"))
    },
    onError: (error) => {
      console.error("Error saving lecture:", error)
      toast.error(t("Dashboard.lecture.saveFailed"))
      setSavingLectureId(null)
    },
  })

  const updateLectureMutation = useMutation({
    mutationFn: async ({ 
      lectureId, 
      title, 
      url 
    }: { 
      lectureId: string
      title: string
      url: string 
    }) => {
      const response = await Axios.put(`/sections/${sectionId}/videos/${lectureId}`, {
        title,
        url,
      })
      return response.data
    },
    onSuccess: () => {
      setSavingLectureId(null)
      queryClient.invalidateQueries({
        queryKey: ["lectures", sectionId.toString()],
      })
      toast.success(t("Dashboard.lecture.updatedSuccessfully"))
    },
    onError: (error) => {
      console.error("Error updating lecture:", error)
      toast.error(t("Dashboard.lecture.updateFailed"))
      setSavingLectureId(null)
    },
  })

  const addLecture = () => {
    const newLecture: LocalLecture = {
      id: `lecture-${Date.now()}`,
      title: "",
      url: ""
    }
    
    // Initialize formik values for the new lecture immediately
    newLecturesFormik.setFieldValue(newLecture.id, {
      title: "",
      url: ""
    })
    
    setLectures([...lectures, newLecture])
  }

  const deleteLecture = (id: string) => {
    setLectures(lectures.filter(lecture => lecture.id !== id))
  }

  const saveLecture = async (lectureId: string) => {
    // Validate this specific lecture
    const lectureData = newLecturesFormik.values[lectureId]
    
    try {
      await lectureValidationSchema.validate(lectureData, { abortEarly: false })
      
      setSavingLectureId(lectureId)
      saveLectureMutation.mutate({
        lectureId,
        title: lectureData.title,
        url: lectureData.url,
      })
    } catch (error: any) {
      // Mark fields as touched to show errors
      newLecturesFormik.setFieldTouched(`${lectureId}.title`, true)
      newLecturesFormik.setFieldTouched(`${lectureId}.url`, true)
      toast.error(t("Dashboard.lecture.fixValidationErrors"))
    }
  }

  const updateExistingLecture = async (lectureId: string) => {
    const lectureData = existingLecturesFormik.values[lectureId]
    
    try {
      await lectureValidationSchema.validate(lectureData, { abortEarly: false })
      
      setSavingLectureId(lectureId)
      updateLectureMutation.mutate({
        lectureId,
        title: lectureData.title,
        url: lectureData.url,
      })
    } catch (error: any) {
      existingLecturesFormik.setFieldTouched(`${lectureId}.title`, true)
      existingLecturesFormik.setFieldTouched(`${lectureId}.url`, true)
      toast.error(t("Dashboard.lecture.fixValidationErrors"))
    }
  }

  // const deleteExistingLecture = (id: string) => {
  //   // API call would go here
  //   // await Axios.delete(`/sections/${sectionId}/videos/${id}`)
  //   toast.success(t("Dashboard.lecture.deletedSuccessfully"))
  // }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 pt-4 border-t">
        <button
          type="button"
          onClick={addLecture}
          className="flex items-center gap-2 bg-blue-500 text-white text-sm rounded py-2 px-4 hover:bg-blue-600 transition cursor-pointer"
        >
          <Video size={16} />
          {t("Dashboard.lecture.addLecture")}
        </button>
      </div>

      {/* Existing Lectures */}
      {existingLectures.map((lecture) => (
        <div key={lecture.id} className="ms-4 border-s-2 border-blue-300 ps-4 space-y-3">
          <div className="flex items-center gap-2">
            <Video size={18} className="text-blue-500" />
            <span className="font-semibold text-sm">{t("Dashboard.lecture.lecture")}</span>
            <button
              type="button"
              // onClick={() => deleteExistingLecture(lecture.id)}
              className="ms-auto p-1 hover:bg-red-100 rounded text-red-500 transition cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <Input
            label={t("Dashboard.lecture.lectureTitle")}
            lecture={true}
            name={`${lecture.id}.title` as any}
            formik={existingLecturesFormik as any}
            placeholder={t("Dashboard.lecture.enterLectureTitle")}
          />

          <Input
            label={t("Dashboard.lecture.youtubeUrl")}
            lecture={true}
            name={`${lecture.id}.url` as any}
            formik={existingLecturesFormik as any}
            placeholder={t("Dashboard.lecture.youtubeUrlPlaceholder")}
          />

          <button
            type="button"
            onClick={() => updateExistingLecture(lecture.id)}
            disabled={savingLectureId === lecture.id}
            className="flex items-center gap-2 bg-blue-500 text-white text-sm rounded py-2 px-4 hover:bg-blue-600 transition cursor-pointer disabled:opacity-50"
          >
            {savingLectureId === lecture.id ? (
              <BtnLoad size={16} />
            ) : (
              <>
                <Video size={16} />
                {t("Dashboard.lecture.updateLecture")}
              </>
            )}
          </button>
        </div>
      ))}

      {/* New Lectures */}
      {lectures.map((lecture) => (
        <div 
          key={lecture.id} 
          className="ms-4 border-s-2 border-blue-300 ps-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Video size={18} className="text-blue-500" />
            <span className="font-semibold text-sm">{t("Dashboard.lecture.newLecture")}</span>
            <button
              type="button"
              onClick={() => deleteLecture(lecture.id)}
              className="ms-auto p-1 hover:bg-red-100 rounded text-red-500 transition cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <Input
            label={t("Dashboard.lecture.lectureTitle")}
            lecture={true}
            name={`${lecture.id}.title` as any}
            formik={newLecturesFormik as any}
            placeholder={t("Dashboard.lecture.enterLectureTitle")}
          />

          <Input
            label={t("Dashboard.lecture.youtubeUrl")}
            lecture={true}
            name={`${lecture.id}.url` as any}
            formik={newLecturesFormik as any}
            placeholder={t("Dashboard.lecture.youtubeUrlPlaceholder")}
          />

          <button
            type="button"
            onClick={() => saveLecture(lecture.id)}
            disabled={savingLectureId === lecture.id}
            className="flex items-center gap-2 bg-blue-500 text-white text-sm rounded py-2 px-4 hover:bg-blue-600 transition cursor-pointer disabled:opacity-50"
          >
            {savingLectureId === lecture.id ? (
              <BtnLoad size={16} />
            ) : (
              <>
                <Video size={16} />
                {t("Dashboard.lecture.saveLecture")}
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  )
}