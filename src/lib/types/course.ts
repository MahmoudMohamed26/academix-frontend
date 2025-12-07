import { Category } from "./category"

export interface Course {
  id: string
  title: string
  categoryId: number
  description: string
  createdAt: string
  updatedAt: string
  category: Category
  slug: string
}

export interface CourseFormData {
    slug: string
    title: string
    description: string
    categoryId: number | string
  }