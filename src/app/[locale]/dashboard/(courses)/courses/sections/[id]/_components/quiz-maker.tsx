import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash2, X, Loader2 } from "lucide-react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import { toast } from "sonner"
import { Quiz, QuizQuestion } from "@/lib/types/quiz"

interface QuizMakerProps {
  onSave: (quiz: Quiz) => void
  initialData?: Quiz
  courseId: string
  sectionId: string
  isOpen?: boolean
}

export default function QuizMaker({
  onSave,
  initialData,
  courseId,
  sectionId,
  isOpen = true,
}: QuizMakerProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [points, setPoints] = useState(initialData?.points || 10)
  const [timeLimit, setTimeLimit] = useState(initialData?.time_limit || 60)
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    initialData?.questions || []
  )
  const [quizId, setQuizId] = useState<string | undefined>(initialData?.id)
  const [errors, setErrors] = useState<{
    title?: string
    description?: string
    points?: string
    time_limit?: string
    questions?: string
  }>({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null)
  const [updatingQuestionId, setUpdatingQuestionId] = useState<string | null>(
    null
  )

  const Axios = useAxios()
  const queryClient = useQueryClient()

  const generateId = () => `temp-${Math.random().toString(36).substr(2, 9)}`

  const isEditMode = !!initialData?.id && !initialData?.id.startsWith("temp-")

  // Fetch existing quiz questions when in edit mode
  const { data: quizData, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["quiz-questions", courseId, sectionId, initialData?.id],
    queryFn: async () => {
      if (!isEditMode) return null
      const response = await Axios.get(
        `/courses/${courseId}/sections/${sectionId}/quizzes/${initialData?.id}/questions`
      )
      return response.data
    },
    enabled: isOpen && isEditMode,
  })

  // Update state when quiz data is fetched
  useEffect(() => {
    if (quizData?.data?.Questions && Array.isArray(quizData.data.Questions)) {
      const fetchedQuestions = quizData.data.Questions.map((q: any) => ({
        id: q.id?.toString() || generateId(),
        question: q.question || "",
        answers: Array.isArray(q.answers)
          ? q.answers.map((ans: string) => ({
              id: generateId(),
              text: ans,
              isCorrect: q.correct_answer === ans,
            }))
          : [],
      }))

      if (fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions)
      }
    }
  }, [quizData])

  // Create or Update Quiz Mutation
  const saveQuizMutation = useMutation({
    mutationFn: async (data: {
      title: string
      description: string
      position: number
      points: number
      time_limit: number
    }) => {
      if (isEditMode) {
        // Update existing quiz
        return await Axios.patch(
          `/courses/${courseId}/sections/${sectionId}/quizzes/${initialData?.id}`,
          data
        )
      } else {
        // Create new quiz
        return await Axios.post(
          `/courses/${courseId}/sections/${sectionId}/quizzes`,
          data
        )
      }
    },
    onSuccess: (response) => {
      toast.success(
        isEditMode ? "Quiz updated successfully" : "Quiz created successfully"
      )
      if (!isEditMode) {
        setQuizId(response.data.id)
      }
      queryClient.invalidateQueries({ queryKey: ["sections", courseId] })
      queryClient.invalidateQueries({
        queryKey: ["quiz-questions", courseId, sectionId, initialData?.id],
      })
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} quiz`
      )
    },
  })

  // Add Questions Mutation (bulk add - only for newly created quiz)
  const addQuestionsMutation = useMutation({
    mutationFn: async (questionsData: any[]) => {
      return await Axios.post(
        `/courses/${courseId}/sections/${sectionId}/quizzes/${quizId}/questions`,
        { questions: questionsData }
      )
    },
    onSuccess: () => {
      toast.success("Questions added successfully")
      queryClient.invalidateQueries({ queryKey: ["sections", courseId] })
      queryClient.invalidateQueries({
        queryKey: ["quiz-questions", courseId, sectionId, quizId],
      })
      onSave({
        id: quizId!,
        title,
        description,
        questions,
        position: initialData?.position || 0,
        points,
        time_limit: timeLimit,
        type: "quiz"
      })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add questions")
    },
  })

  // Update Question Mutation (individual question update)
  const updateQuestionMutation = useMutation({
    mutationFn: async ({
      questionId,
      data,
    }: {
      questionId: string
      data: any
    }) => {
      return await Axios.patch(
        `/courses/${courseId}/sections/${sectionId}/quizzes/${
          quizId || initialData?.id
        }/questions/${questionId}`,
        data
      )
    },
    onSuccess: () => {
      toast.success("Question updated successfully")
      queryClient.invalidateQueries({ queryKey: ["sections", courseId] })
      queryClient.invalidateQueries({
        queryKey: [
          "quiz-questions",
          courseId,
          sectionId,
          quizId || initialData?.id,
        ],
      })
      setUpdatingQuestionId(null)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update question")
      setUpdatingQuestionId(null)
    },
  })

  // Delete Question Mutation
  const deleteQuestionMutation = useMutation({
    mutationFn: async (questionId: string) => {
      return await Axios.delete(
        `/courses/${courseId}/sections/${sectionId}/quizzes/${
          quizId || initialData?.id
        }/questions/${questionId}`
      )
    },
    onSuccess: () => {
      toast.success("Question deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["sections", courseId] })
      queryClient.invalidateQueries({
        queryKey: [
          "quiz-questions",
          courseId,
          sectionId,
          quizId || initialData?.id,
        ],
      })
      setIsDeleteDialogOpen(false)
      setQuestionToDelete(null)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete question")
      setIsDeleteDialogOpen(false)
    },
  })

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
    const isRealQuestion = !questionId.startsWith("temp-")

    if (isRealQuestion) {
      setQuestionToDelete(questionId)
      setIsDeleteDialogOpen(true)
    } else {
      setQuestions(questions.filter((q) => q.id !== questionId))
    }
  }

  const confirmDeleteQuestion = () => {
    if (questionToDelete) {
      if (!questionToDelete.startsWith("temp-")) {
        deleteQuestionMutation.mutate(questionToDelete)
      }
      setQuestions(questions.filter((q) => q.id !== questionToDelete))
    }
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

  const updateAnswer = (questionId: string, answerId: string, text: string) => {
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

  const validateQuizBasicInfo = () => {
    const newErrors: any = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!points || points < 1) {
      newErrors.points = "Points must be at least 1"
    }

    if (!timeLimit || timeLimit < 1) {
      newErrors.time_limit = "Time limit must be at least 1 minute"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateQuestions = () => {
    const newErrors: any = {}

    if (questions.length === 0) {
      newErrors.questions = "At least one question is required"
      setErrors(newErrors)
      return false
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

  const handleSaveQuiz = async () => {
    if (!validateQuizBasicInfo()) return

    await saveQuizMutation.mutateAsync({
      title,
      description,
      position: initialData?.position || 0,
      points,
      time_limit: timeLimit,
    })
  }

  const handleAddQuestions = async () => {
    if (!validateQuestions()) return

    // Filter only local (newly added) questions
    const localQuestions = questions.filter((q) => q.id.startsWith("temp-"))

    if (localQuestions.length === 0) {
      toast.info("No new questions to add")
      return
    }

    const questionsData = localQuestions.map((q) => {
      const correctAnswer = q.answers.find((a) => a.isCorrect)
      return {
        question: q.question,
        correct_answer: correctAnswer?.text || "",
        answers: q.answers.map((a) => a.text),
      }
    })

    await addQuestionsMutation.mutateAsync(questionsData)
  }

  const handleUpdateQuestion = async (questionId: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    if (!question.question.trim()) {
      toast.error("Question text is required")
      return
    }

    if (question.answers.length < 2) {
      toast.error("At least 2 answers are required")
      return
    }

    if (question.answers.some((a) => !a.text.trim())) {
      toast.error("All answers must have text")
      return
    }

    if (!question.answers.some((a) => a.isCorrect)) {
      toast.error("One answer must be marked as correct")
      return
    }

    const correctAnswer = question.answers.find((a) => a.isCorrect)
    const questionData = {
      question: question.question,
      correct_answer: correctAnswer?.text || "",
      answers: question.answers.map((a) => a.text),
    }

    setUpdatingQuestionId(questionId)
    await updateQuestionMutation.mutateAsync({
      questionId,
      data: questionData,
    })
  }

  const isQuizCreated = (!!quizId && !quizId.startsWith("temp-")) || isEditMode
  const hasLocalQuestions = questions.some((q) => q.id.startsWith("temp-"))

  return (
    <>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteQuestionMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteQuestion}
              disabled={deleteQuestionMutation.isPending}
            >
              {deleteQuestionMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Points *
              </label>
              <Input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                placeholder="10"
                className={`mt-1 ${errors.points ? "border-red-500" : ""}`}
              />
              {errors.points && (
                <p className="text-red-500 text-xs mt-1">{errors.points}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Time Limit (minutes) *
              </label>
              <Input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                placeholder="60"
                className={`mt-1 ${errors.time_limit ? "border-red-500" : ""}`}
              />
              {errors.time_limit && (
                <p className="text-red-500 text-xs mt-1">{errors.time_limit}</p>
              )}
            </div>
          </div>

          <Button
            type="button"
            onClick={handleSaveQuiz}
            disabled={saveQuizMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {saveQuizMutation.isPending
              ? isEditMode
                ? "Updating Quiz..."
                : "Creating Quiz..."
              : isEditMode
              ? "Update Quiz"
              : "Create Quiz"}
          </Button>
        </div>

        {isQuizCreated && (
          <div className="border-t pt-4">
            {isLoadingQuestions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading questions...</span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Questions
                  </h3>
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
                  <p className="text-red-500 text-sm mb-4">
                    {errors.questions}
                  </p>
                )}

                <div className="space-y-6">
                  {questions.map((question, qIndex) => {
                    const isLocalQuestion = question.id.startsWith("temp-")

                    return (
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
                                  updateAnswer(
                                    question.id,
                                    answer.id,
                                    e.target.value
                                  )
                                }
                                placeholder={`Answer ${aIndex + 1}`}
                                className="flex-1"
                              />
                              {question.answers.length > 2 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    removeAnswer(question.id, answer.id)
                                  }
                                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Show update button only for real (non-local) questions */}
                        {!isLocalQuestion && (
                          <div className="ml-8 pt-2">
                            <Button
                              type="button"
                              onClick={() => handleUpdateQuestion(question.id)}
                              size="sm"
                              disabled={updatingQuestionId === question.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {updatingQuestionId === question.id
                                ? "Updating..."
                                : "Update Question"}
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {questions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {/* <FileQuestion className="h-12 w-12 mx-auto mb-2 opacity-50" /> */}
                    <p className="text-sm">
                      No questions yet. Click "Add Question" to start.
                    </p>
                  </div>
                )}

                {/* Show "Add Questions" button only if there are local questions */}
                {hasLocalQuestions && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      type="button"
                      onClick={handleAddQuestions}
                      disabled={addQuestionsMutation.isPending}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {addQuestionsMutation.isPending
                        ? "Adding Questions..."
                        : "Add Questions"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}

// function FileQuestion({ className }: { className?: string }) {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//     >
//       <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
//       <polyline points="14 2 14 8 20 8" />
//       <path d="M10 14.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
//       <path d="M12 16.5v2" />
//     </svg>
//   )
// }
