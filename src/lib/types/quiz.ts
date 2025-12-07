export type QuizOption = {
  id: string
  text: string
  isCorrect: boolean
}

export type QuizQuestion = {
  id: string
  text: string
  options: QuizOption[]
}

export type Quiz = {
  id: string
  title: string
  questions: QuizQuestion[]
}