export interface EnrolledCourse {
  id: string
  course_id: string
  title: string
  image: string
  short_description: string
  created: string
  started: string
  progress: number
  status: string
}

export interface EnrollmentslRes {
  enrollments: EnrolledCourse[]
  links: {
    first: string
    last: string
    next: string | null
    prev: string | null
  }
}
