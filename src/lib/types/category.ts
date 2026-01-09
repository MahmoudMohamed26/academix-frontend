import { Course } from "./course"

export interface CategoryTranslation {
  name: string
}

export interface Category {
  id: string
  name_ar: string
  name_en: string
  createdAt: string
  updatedAt: string
  slug: string
}

export interface CategoryFormData {
  name_ar: string
  name_en: string
}

export interface CategoriesTopCourses {
  id: string
  name_ar: string
  name_en: string
  createdAt: string
  updatedAt: string
  slug: string
  courses: Course[]
}