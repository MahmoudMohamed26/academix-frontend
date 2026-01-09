import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Plus, Trash2, X } from "lucide-react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import { toast } from "sonner"
import { Quiz, QuizQuestion } from "@/lib/types/quiz"
import * as Yup from "yup"
import BtnLoad from "@/components/BtnLoad"
import { getQuestions } from "@/lib/api/Quizes"
import { useMediaQuery } from "@/hooks/use-media-query"

interface QuizMakerProps {
  onSave: (quiz: Quiz) => void
  initialData?: Quiz
  courseId: string
  sectionId: string
  isOpen?: boolean
  allContent?: any[]
}

export default function QuizMaker({
  onSave,
  initialData,
  courseId,
  sectionId,
  isOpen = true,
  allContent = [],
}: QuizMakerProps) {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery("(min-width: 768px)")
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

  const calculatePosition = () => {
    const savedContentCount = allContent.filter(
      item => !item.id.startsWith("temp-")
    ).length
    return savedContentCount + 1
  }

  // Validation schemas with translations
  const quizBasicInfoSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .required(t("Dashboard.QuizMaker.quizTitleRequired"))
      .min(1, t("Dashboard.QuizMaker.quizTitleRequired")),
    description: Yup.string()
      .trim()
      .required(t("Dashboard.QuizMaker.quizDescriptionRequired"))
      .min(1, t("Dashboard.QuizMaker.quizDescriptionRequired")),
    points: Yup.number()
      .required(t("Dashboard.QuizMaker.pointsRequired"))
      .min(1, t("Dashboard.QuizMaker.pointsMin"))
      .integer(t("Dashboard.QuizMaker.pointsInteger")),
    time_limit: Yup.number()
      .required(t("Dashboard.QuizMaker.timeLimitRequired"))
      .min(1, t("Dashboard.QuizMaker.timeLimitMin"))
      .integer(t("Dashboard.QuizMaker.timeLimitInteger")),
  })

  const answerSchema = Yup.object().shape({
    id: Yup.string().required(),
    text: Yup.string().trim().required(t("Dashboard.QuizMaker.answerRequired")),
    isCorrect: Yup.boolean().required(),
  })

  const questionSchema = Yup.object().shape({
    id: Yup.string().required(),
    question: Yup.string().trim().required(t("Dashboard.QuizMaker.questionRequired")),
    answers: Yup.array()
      .of(answerSchema)
      .min(2, t("Dashboard.QuizMaker.answersMin"))
      .test(
        "has-correct-answer",
        t("Dashboard.QuizMaker.hasCorrectAnswer"),
        (answers) => answers?.some((a) => a.isCorrect) ?? false
      ),
  })

  const questionsSchema = Yup.object().shape({
    questions: Yup.array()
      .of(questionSchema)
      .min(1, t("Dashboard.QuizMaker.questionsMin")),
  })

  const { data: quizData, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["quiz-questions", courseId, sectionId, initialData?.id],
    queryFn: async () => {
      if (!isEditMode) return null
      return getQuestions(Axios, courseId, sectionId, initialData?.id)
    },
    enabled: isOpen && isEditMode,
  })

  useEffect(() => {
    if (quizData && Array.isArray(quizData)) {
      const fetchedQuestions = quizData.map((q: any) => ({
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

  const saveQuizMutation = useMutation({
    mutationFn: async (data: {
      title: string
      description: string
      position: number
      points: number
      time_limit: number
    }) => {
      if (isEditMode) {
        return await Axios.patch(
          `/courses/${courseId}/sections/${sectionId}/quizzes/${initialData?.id}`,
          data
        )
      } else {
        return await Axios.post(
          `/courses/${courseId}/sections/${sectionId}/quizzes`,
          data
        )
      }
    },
    onSuccess: (response) => {
      toast.success(
        isEditMode 
          ? t("Dashboard.QuizMaker.quizUpdated") 
          : t("Dashboard.QuizMaker.quizCreated")
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
          (isEditMode 
            ? t("Dashboard.QuizMaker.quizUpdateFailed")
            : t("Dashboard.QuizMaker.quizCreateFailed"))
      )
    },
  })

  const addQuestionsMutation = useMutation({
    mutationFn: async (questionsData: any[]) => {
      return await Axios.post(
        `/courses/${courseId}/sections/${sectionId}/quizzes/${quizId}/questions`,
        { questions: questionsData }
      )
    },
    onSuccess: () => {
      toast.success(t("Dashboard.QuizMaker.questionsAdded"))
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
      toast.error(error?.response?.data?.message || t("Dashboard.QuizMaker.questionsAddFailed"))
    },
  })

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
      toast.success(t("Dashboard.QuizMaker.questionUpdated"))
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
      toast.error(error?.response?.data?.message || t("Dashboard.QuizMaker.questionUpdateFailed"))
      setUpdatingQuestionId(null)
    },
  })

  const deleteQuestionMutation = useMutation({
    mutationFn: async (questionId: string) => {
      return await Axios.delete(
        `/courses/${courseId}/sections/${sectionId}/quizzes/${
          quizId || initialData?.id
        }/questions/${questionId}`
      )
    },
    onSuccess: () => {
      toast.success(t("Dashboard.QuizMaker.questionDeleted"))
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
      toast.error(error?.response?.data?.message || t("Dashboard.QuizMaker.questionDeleteFailed"))
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

  const validateQuizBasicInfo = async () => {
    try {
      await quizBasicInfoSchema.validate(
        {
          title,
          description,
          points,
          time_limit: timeLimit,
        },
        { abortEarly: false }
      )
      setErrors({})
      return true
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: any = {}
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const validateQuestions = async () => {
    try {
      await questionsSchema.validate({ questions }, { abortEarly: false })
      setErrors({})
      return true
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: any = {}
        if (err.errors.length > 0) {
          newErrors.questions = err.errors[0]
        }
        setErrors(newErrors)
      }
      return false
    }
  }

  const validateSingleQuestion = async (question: QuizQuestion) => {
    try {
      await questionSchema.validate(question, { abortEarly: false })
      return { isValid: true, errors: [] }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        return { isValid: false, errors: err.errors }
      }
      return { isValid: false, errors: [t("Dashboard.QuizMaker.fixValidationErrors")] }
    }
  }

  const handleSaveQuiz = async () => {
    const isValid = await validateQuizBasicInfo()
    if (!isValid) return

    const position = (initialData?.id && !initialData?.id.startsWith("temp-")) 
      ? initialData?.position || 0 
      : calculatePosition()

    await saveQuizMutation.mutateAsync({
      title,
      description,
      position,
      points,
      time_limit: timeLimit,
    })
  }

  const handleAddQuestions = async () => {
    const isValid = await validateQuestions()
    if (!isValid) return

    const localQuestions = questions.filter((q) => q.id.startsWith("temp-"))

    if (localQuestions.length === 0) {
      toast.info(t("Dashboard.QuizMaker.noNewQuestions"))
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

    const validation = await validateSingleQuestion(question)
    
    if (!validation.isValid) {
      toast.error(validation.errors[0] || t("Dashboard.QuizMaker.fixValidationErrors"))
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

  const deleteDialogContent = (
    <>
      {isDesktop ? (
        <DialogHeader>
          <DialogTitle>{t("Dashboard.QuizMaker.deleteQuestion")}</DialogTitle>
          <DialogDescription>
            {t("Dashboard.QuizMaker.deleteQuestionConfirmation")}
          </DialogDescription>
        </DialogHeader>
      ) : (
        <DrawerHeader>
          <DrawerTitle>{t("Dashboard.QuizMaker.deleteQuestion")}</DrawerTitle>
          <DrawerDescription>
            {t("Dashboard.QuizMaker.deleteQuestionConfirmation")}
          </DrawerDescription>
        </DrawerHeader>
      )}

      {isDesktop ? (
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(false)}
            disabled={deleteQuestionMutation.isPending}
          >
            {t("Dashboard.QuizMaker.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={confirmDeleteQuestion}
            disabled={deleteQuestionMutation.isPending}
          >
            {deleteQuestionMutation.isPending 
              ? t("Dashboard.QuizMaker.deleting") 
              : t("Dashboard.QuizMaker.delete")}
          </Button>
        </DialogFooter>
      ) : (
        <DrawerFooter>
          <Button
            type="button"
            variant="destructive"
            onClick={confirmDeleteQuestion}
            disabled={deleteQuestionMutation.isPending}
          >
            {deleteQuestionMutation.isPending 
              ? t("Dashboard.QuizMaker.deleting") 
              : t("Dashboard.QuizMaker.delete")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(false)}
            disabled={deleteQuestionMutation.isPending}
          >
            {t("Dashboard.QuizMaker.cancel")}
          </Button>
        </DrawerFooter>
      )}
    </>
  )

  return (
    <>
      {isDesktop ? (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            {deleteDialogContent}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DrawerContent>
            {deleteDialogContent}
          </DrawerContent>
        </Drawer>
      )}

      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("Dashboard.QuizMaker.quizTitle")} {t("Dashboard.QuizMaker.required")}
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("Dashboard.QuizMaker.quizTitlePlaceholder")}
              className={`mt-1 ${errors.title ? "border-red-500" : ""}`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("Dashboard.QuizMaker.quizDescription")} {t("Dashboard.QuizMaker.required")}
            </label>
            <Textarea
              value={description}
              onChange={(e: any) => setDescription(e.target.value)}
              placeholder={t("Dashboard.QuizMaker.quizDescriptionPlaceholder")}
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
                {t("Dashboard.QuizMaker.points")} {t("Dashboard.QuizMaker.required")}
              </label>
              <Input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                placeholder={t("Dashboard.QuizMaker.pointsPlaceholder")}
                className={`mt-1 ${errors.points ? "border-red-500" : ""}`}
              />
              {errors.points && (
                <p className="text-red-500 text-xs mt-1">{errors.points}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("Dashboard.QuizMaker.timeLimit")} {t("Dashboard.QuizMaker.required")}
              </label>
              <Input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                placeholder={t("Dashboard.QuizMaker.timeLimitPlaceholder")}
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
            className="w-full bg-(--main-color) hover:bg-(--main-darker-color)"
          >
            {saveQuizMutation.isPending
              ? (isEditMode
                ? t("Dashboard.QuizMaker.updatingQuiz")
                : t("Dashboard.QuizMaker.creatingQuiz"))
              : (isEditMode
              ? t("Dashboard.QuizMaker.updateQuiz")
              : t("Dashboard.QuizMaker.createQuiz"))}
          </Button>
        </div>

        {isQuizCreated && (
          <div className="border-t pt-4">
            {isLoadingQuestions ? (
              <div className="flex items-center justify-center py-8">
                <BtnLoad color="main" size={35} />
                <span className="ml-2 text-gray-600">
                  {t("Dashboard.QuizMaker.loadingQuestions")}
                </span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("Dashboard.QuizMaker.questions")}
                  </h3>
                  <Button
                    type="button"
                    onClick={addQuestion}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    {t("Dashboard.QuizMaker.addQuestion")}
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
                            {t("Dashboard.QuizMaker.questionLabel", { index: qIndex + 1 })}
                          </span>
                          <div className="flex-1">
                            <Input
                              value={question.question}
                              onChange={(e) =>
                                updateQuestion(question.id, e.target.value)
                              }
                              placeholder={t("Dashboard.QuizMaker.questionPlaceholder")}
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
                              {t("Dashboard.QuizMaker.answersLabel")}
                            </label>
                            <Button
                              type="button"
                              onClick={() => addAnswer(question.id)}
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {t("Dashboard.QuizMaker.addAnswer")}
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
                                placeholder={t("Dashboard.QuizMaker.answerPlaceholder", { index: aIndex + 1 })}
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
                                ? t("Dashboard.QuizMaker.updatingQuestion")
                                : t("Dashboard.QuizMaker.updateQuestion")}
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {questions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">
                      {t("Dashboard.QuizMaker.noQuestions")}
                    </p>
                  </div>
                )}

                {hasLocalQuestions && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      type="button"
                      onClick={handleAddQuestions}
                      disabled={addQuestionsMutation.isPending}
                      className="flex-1 bg-(--main-color) hover:bg-(--main-darker-color)"
                    >
                      {addQuestionsMutation.isPending
                        ? t("Dashboard.QuizMaker.addingQuestions")
                        : t("Dashboard.QuizMaker.addQuestions")}
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