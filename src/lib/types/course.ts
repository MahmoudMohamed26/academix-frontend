import { CategoriesTopCourses } from "./category"
import { EnrollmentsLinks } from "./enrolls"
import { User } from "./user"

export interface Course {
  id: string
  title: string
  category_en: string
  category_ar: string
  short_description: string
  detailed_description: string
  instructor: User
  level: "beginner" | "intermediate" | "advanced"
  hours: number
  price: number
  enrolled: boolean
  lectures_count: number
  video_url: string
  sections_count: number
  enrollments_count: number
  image: string
  published: boolean
  rating_avg: number
  rating_counts: number
  created: string
  updated: string
  category: {
    id: string
    name_ar: string
    name_en: string
  }
}

export interface CourseLinks {
  next_cursor: string | null
  per_page: number
  prev_cursor: string | null
}

export type PaginationType = EnrollmentsLinks | CourseLinks

export interface CourseRes {
  courses: Course[]
  links: {}
  meta: CourseLinks
}

export interface SingleCourseProps {
  grid: boolean
  course: Course
  category?: CategoriesTopCourses
}

export interface CourseFormData {
  title: string
  detailed_description: string
  short_description: string
  image: string
  price: number
  video_url: string
  hours: number
  level: string
  category_slug: string
}

export interface CourseSearchParams {
  category_slug?: string
  level?: string
  min_price?: string
  max_price?: string
  min_hours?: string
  max_hours?: string
  min_rating?: string
  sortBy?: string
  orderedBy?: string
  user_id?: string
  search?: string
  page?: string
}

export interface CoursesListProps {
  searchParams: CourseSearchParams
}

export interface CoursePageProps{
  params: { locale: string }
  searchParams: Promise<CourseSearchParams>
}

export interface FilterDialogProps {
  currentFilters: {
    category_slug?: string
    level?: string
    min_price?: string
    max_price?: string
    min_hours?: string
    max_hours?: string
    min_rating?: string
    sortBy?: string
    orderedBy?: string
    user_id?: string
    search?: string
  }
}
