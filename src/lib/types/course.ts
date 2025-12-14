import { Category } from "./category"

export interface Course {
  id: string
  title: string
  category_en: string
  category_ar: string
  short_description: string
  detailed_description: string
  instructor: string
  level: "beginner" | "intermediate" | "advanced"
  hours: number
  price: number
  image: string
  published: boolean
  rating_avg: number
  rating_counts: number
  created: string
  updated: string
}

export interface CourseFormData {
  title: string
  detailed_description: string
  short_description: string
  image: string
  price: number
  hours: number
  level: string
  category_slug: string
}
