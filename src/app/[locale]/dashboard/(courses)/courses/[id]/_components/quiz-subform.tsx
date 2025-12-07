"use client"

import { useState } from "react"
import { FileQuestion, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Quiz, QuizOption, QuizQuestion } from "@/lib/types/quiz"

export default function QuizSubForm({ sectionId }: { sectionId: number }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])

  const addQuiz = () => {
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: "",
      questions: [],
    }
    setQuizzes([...quizzes, newQuiz])
  }

  const updateQuiz = (id: string, field: keyof Quiz, value: any) => {
    setQuizzes(quizzes.map(quiz => 
      quiz.id === id ? { ...quiz, [field]: value } : quiz
    ))
  }

  const deleteQuiz = (id: string) => {
    setQuizzes(quizzes.filter(quiz => quiz.id !== id))
  }

  const addQuestion = (quizId: string) => {
    const newQuestion: QuizQuestion = {
      id: `question-${Date.now()}`,
      text: "",
      options: [],
    }
    setQuizzes(quizzes.map(quiz =>
      quiz.id === quizId
        ? { ...quiz, questions: [...quiz.questions, newQuestion] }
        : quiz
    ))
  }

  const updateQuestion = (quizId: string, questionId: string, text: string) => {
    setQuizzes(quizzes.map(quiz =>
      quiz.id === quizId
        ? {
            ...quiz,
            questions: quiz.questions.map(q =>
              q.id === questionId ? { ...q, text } : q
            ),
          }
        : quiz
    ))
  }

  const deleteQuestion = (quizId: string, questionId: string) => {
    setQuizzes(quizzes.map(quiz =>
      quiz.id === quizId
        ? {
            ...quiz,
            questions: quiz.questions.filter(q => q.id !== questionId),
          }
        : quiz
    ))
  }

  const addOption = (quizId: string, questionId: string) => {
    const newOption: QuizOption = {
      id: `option-${Date.now()}`,
      text: "",
      isCorrect: false,
    }
    setQuizzes(quizzes.map(quiz =>
      quiz.id === quizId
        ? {
            ...quiz,
            questions: quiz.questions.map(q =>
              q.id === questionId
                ? { ...q, options: [...q.options, newOption] }
                : q
            ),
          }
        : quiz
    ))
  }

  const updateOption = (
    quizId: string,
    questionId: string,
    optionId: string,
    field: keyof QuizOption,
    value: any
  ) => {
    setQuizzes(quizzes.map(quiz =>
      quiz.id === quizId
        ? {
            ...quiz,
            questions: quiz.questions.map(q =>
              q.id === questionId
                ? {
                    ...q,
                    options: q.options.map(opt =>
                      opt.id === optionId ? { ...opt, [field]: value } : opt
                    ),
                  }
                : q
            ),
          }
        : quiz
    ))
  }

  const deleteOption = (quizId: string, questionId: string, optionId: string) => {
    setQuizzes(quizzes.map(quiz =>
      quiz.id === quizId
        ? {
            ...quiz,
            questions: quiz.questions.map(q =>
              q.id === questionId
                ? {
                    ...q,
                    options: q.options.filter(opt => opt.id !== optionId),
                  }
                : q
            ),
          }
        : quiz
    ))
  }

  const saveQuiz = (quizId: string) => {
    // API call would go here
    // await Axios.post(`/sections/${sectionId}/quizzes`, quizData)
    toast.success("Quiz saved successfully")
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 pt-4 border-t">
        <button
          onClick={addQuiz}
          className="flex items-center gap-2 bg-green-500 text-white text-sm rounded py-2 px-4 hover:bg-green-600 transition cursor-pointer"
        >
          <FileQuestion size={16} />
          Add Quiz
        </button>
      </div>

      {quizzes.map((quiz) => (
        <div key={quiz.id} className="ms-4 border-s-2 border-green-300 ps-4 space-y-3">
          <div className="flex items-center gap-2">
            <FileQuestion size={18} className="text-green-500" />
            <span className="font-semibold text-sm">Quiz</span>
            <button
              onClick={() => deleteQuiz(quiz.id)}
              className="ms-auto p-1 hover:bg-red-100 rounded text-red-500 transition cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quiz Title</label>
            <input
              type="text"
              value={quiz.title}
              onChange={(e) => updateQuiz(quiz.id, "title", e.target.value)}
              placeholder="Enter quiz title"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            onClick={() => addQuestion(quiz.id)}
            className="flex items-center gap-2 bg-green-500 text-white text-sm rounded py-2 px-3 hover:bg-green-600 transition cursor-pointer"
          >
            <FileQuestion size={16} />
            Add Question
          </button>

          {quiz.questions.map((question, qIndex) => (
            <div key={question.id} className="ms-4 border-s-2 border-yellow-300 ps-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">Question {qIndex + 1}</span>
                <button
                  onClick={() => deleteQuestion(quiz.id, question.id)}
                  className="ms-auto p-1 hover:bg-red-100 rounded text-red-500 transition cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Question Text</label>
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => updateQuestion(quiz.id, question.id, e.target.value)}
                  placeholder="Enter question text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <button
                onClick={() => addOption(quiz.id, question.id)}
                className="flex items-center gap-2 bg-yellow-500 text-white text-sm rounded py-1.5 px-3 hover:bg-yellow-600 transition cursor-pointer"
              >
                <FileQuestion size={14} />
                Add Option
              </button>

              {question.options.map((option, oIndex) => (
                <div key={option.id} className="ms-4 border-s-2 border-gray-300 ps-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Option {oIndex + 1}</span>
                    <button
                      onClick={() => deleteOption(quiz.id, question.id, option.id)}
                      className="ms-auto p-1 hover:bg-red-100 rounded text-red-500 transition cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => updateOption(quiz.id, question.id, option.id, "text", e.target.value)}
                      placeholder="Enter option text"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={(e) => updateOption(quiz.id, question.id, option.id, "isCorrect", e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label className="text-sm">Correct Answer</label>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <button
            onClick={() => saveQuiz(quiz.id)}
            className="flex items-center gap-2 bg-green-500 text-white text-sm rounded py-2 px-4 hover:bg-green-600 transition cursor-pointer"
          >
            <FileQuestion size={16} />
            Save Quiz
          </button>
        </div>
      ))}
    </div>
  )
}