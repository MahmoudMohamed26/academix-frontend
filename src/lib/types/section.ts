import { Lecture } from "./lecture"
import { Quiz } from "./quiz"

export type SectionFormData = {
  title: string
  description: string
}

export interface Section {
  id: string
  title: string
  description: string
  position: number
  lectures: Lecture[]
  quizzes?: Quiz[]
}

export type ContentItem = Lecture | Quiz