import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, X } from "lucide-react"

interface QuizAnswer {
  id: string
  text: string
  isCorrect: boolean
}

interface QuizQuestion {
  id: string
  question: string
  answers: QuizAnswer[]
}

interface Quiz {
  title: string
  description: string
  questions: QuizQuestion[]
}

interface QuizMakerProps {
  onSave: (quiz: Quiz) => void
  initialData?: {
    title: string
    description: string
    questions: QuizQuestion[]
  }
}

export default function QuizMaker({ onSave, initialData }: QuizMakerProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    initialData?.questions || []
  )
  const [errors, setErrors] = useState<{
    title?: string
    description?: string
    questions?: string
  }>({})

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: generateId(),
      question: "",
      answers: [
        { id: generateId(), text: "", isCorrect: false },
        { id: generateId(), text: "", isCorrect: false },
      ],
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId))
  }

  const updateQuestion = (questionId: string, questionText: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, question: questionText } : q
      )
    )
  }

  const addAnswer = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: [
                ...q.answers,
                { id: generateId(), text: "", isCorrect: false },
              ],
            }
          : q
      )
    )
  }

  const removeAnswer = (questionId: string, answerId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, answers: q.answers.filter((a) => a.id !== answerId) }
          : q
      )
    )
  }

  const updateAnswer = (
    questionId: string,
    answerId: string,
    text: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, text } : a
              ),
            }
          : q
      )
    )
  }

  const toggleCorrectAnswer = (questionId: string, answerId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) => ({
                ...a,
                isCorrect: a.id === answerId ? !a.isCorrect : false,
              })),
            }
          : q
      )
    )
  }

  const validateQuiz = () => {
    const newErrors: {
      title?: string
      description?: string
      questions?: string
    } = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!description.trim()) {
      newErrors.description = "Description is required"
    }

    if (questions.length === 0) {
      newErrors.questions = "At least one question is required"
    }

    const hasInvalidQuestions = questions.some((q) => {
      if (!q.question.trim()) return true
      if (q.answers.length < 2) return true
      if (q.answers.some((a) => !a.text.trim())) return true
      if (!q.answers.some((a) => a.isCorrect)) return true
      return false
    })

    if (hasInvalidQuestions) {
      newErrors.questions =
        "Each question must have a question text, at least 2 answers with text, and one correct answer marked"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateQuiz()) {
      onSave({
        title,
        description,
        questions,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Quiz Title *
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter quiz title"
            className={`mt-1 ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Quiz Description *
          </label>
          <Textarea
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
            placeholder="Enter quiz description"
            rows={3}
            className={`mt-1 ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
          <Button
            type="button"
            onClick={addQuestion}
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>

        {errors.questions && (
          <p className="text-red-500 text-sm mb-4">{errors.questions}</p>
        )}

        <div className="space-y-6">
          {questions.map((question, qIndex) => (
            <div
              key={question.id}
              className="border border-gray-200 rounded-lg p-4 space-y-4 bg-white"
            >
              <div className="flex items-start gap-3">
                <span className="text-sm font-medium text-gray-500 mt-2">
                  Q{qIndex + 1}
                </span>
                <div className="flex-1">
                  <Input
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(question.id, e.target.value)
                    }
                    placeholder="Enter question"
                    className="w-full"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(question.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="ml-8 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-600">
                    Answers (check one as correct)
                  </label>
                  <Button
                    type="button"
                    onClick={() => addAnswer(question.id)}
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Answer
                  </Button>
                </div>

                {question.answers.map((answer, aIndex) => (
                  <div
                    key={answer.id}
                    className="flex items-center gap-2 group"
                  >
                    <Checkbox
                      checked={answer.isCorrect}
                      onCheckedChange={() =>
                        toggleCorrectAnswer(question.id, answer.id)
                      }
                      className="mt-1"
                    />
                    <Input
                      value={answer.text}
                      onChange={(e) =>
                        updateAnswer(question.id, answer.id, e.target.value)
                      }
                      placeholder={`Answer ${aIndex + 1}`}
                      className="flex-1"
                    />
                    {question.answers.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAnswer(question.id, answer.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {questions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileQuestion className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No questions yet. Click "Add Question" to start.</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button
          type="button"
          onClick={handleSave}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Save Quiz
        </Button>
      </div>
    </div>
  )
}

function FileQuestion({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M10 14.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
      <path d="M12 16.5v2" />
    </svg>
  )
}