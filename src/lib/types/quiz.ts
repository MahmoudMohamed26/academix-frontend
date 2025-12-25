export interface QuizAnswer {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  question: string
  answers: QuizAnswer[]
}

export interface Quiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
  position?: number
  points?: number
  time_limit?: number
  type: "quiz"
}

interface QuizMakerProps {
  onSave: (quiz: Quiz) => void
  initialData?: Quiz
  courseId: string
  sectionId: string
  isOpen?: boolean
}