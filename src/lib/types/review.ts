import { CourseLinks } from "./course"

export interface ReviewRes {
  reviews: Review[]
  links: {
    next: string
  }
  meta: CourseLinks
}


export interface Review {
  user_name: string,
  user_avatar: string,
  course_id: string,
  rating: number,
  comment: string,
  created: string,
  updated: string
}