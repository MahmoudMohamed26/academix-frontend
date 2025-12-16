import { Lecture } from "./lecture"

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
  quizzes?: any
}