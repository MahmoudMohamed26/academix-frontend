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
    title: string
    detailed_description: string
    short_description: string
    image: string
    price: number
    hours: number
    level: string
    category_slug: string
}