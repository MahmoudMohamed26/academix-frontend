import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import ReviewItem from "./review-item"
import { Course } from "@/lib/types/course"
import { Star, StarHalf } from "lucide-react"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useFormik } from "formik"
import * as Yup from "yup"
import avatarImg from "@/assets/avatar.webp"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getReviews } from "@/lib/api/Reviews"
import useAxios from "@/hooks/useAxios"
import { useTranslation } from "react-i18next"
import BtnLoad from "@/components/BtnLoad"
import { Review } from "@/lib/types/review"

interface ReviewDialog {
  course: Course
  open: boolean
  setOpen: (open: boolean) => void
}

const getStarDisplay = (rating: number) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating - fullStars >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return { fullStars, hasHalfStar, emptyStars }
}

export default function ReviewsDialog({ course, open, setOpen }: ReviewDialog) {
  const [hoveredStar, setHoveredStar] = useState(0)
  const [additionalReviews, setAdditionalReviews] = useState<Review[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const Axios = useAxios()
  const { t, i18n } = useTranslation()
  const queryClient = useQueryClient()

  const reviewSchema = Yup.object({
    rate: Yup.number()
      .min(1, t("courseDetails.ratingRequired"))
      .max(5, t("courseDetails.ratingRange"))
      .required(t("courseDetails.ratingRequired")),
    comment: Yup.string()
      .min(10, t("courseDetails.commentMinLength"))
      .max(500, t("courseDetails.commentMaxLength"))
      .required(t("courseDetails.commentRequired")),
  })

  const { fullStars, hasHalfStar, emptyStars } = getStarDisplay(
    course?.rating_avg || 0
  )

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", course.id],
    queryFn: () => getReviews(Axios, course.id),
    staleTime: 10 * 60 * 1000,
  })

  useEffect(() => {
    if (reviewsData?.links?.next) {
      setNextUrl(reviewsData.links.next)
    } else {
      setNextUrl(null)
    }
  }, [reviewsData])

  const reviews: Review[] = reviewsData?.reviews ?? []

  const loadMoreReviews = async () => {
    if (!nextUrl || isLoadingMore) return

    setIsLoadingMore(true)
    try {
      const response = await Axios.get(nextUrl)
      const newReviews = response.data?.data.reviews ?? []
      const newNext = response.data?.links?.next ?? null

      setAdditionalReviews((prev) => [...prev, ...newReviews])
      setNextUrl(newNext)
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || t("courseDetails.loadMoreError")
      toast.error(errorMessage)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const mutation = useMutation({
    mutationFn: async (values: { rate: number; comment: string }) => {
      const response = await Axios.post(`/courses/${course.id}/rating`, values)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", course.id] })
      queryClient.invalidateQueries({ queryKey: ["reviews", course.id] })
      formik.resetForm()
      toast.success(t("courseDetails.reviewSuccess"))
      setAdditionalReviews([])
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || t("courseDetails.reviewError")
      toast.error(errorMessage)
    },
  })

  const formik = useFormik({
    initialValues: {
      rate: 0,
      comment: "",
    },
    validationSchema: reviewSchema,
    onSubmit: (values) => {
      mutation.mutate(values)
    },
  })

  const handleStarClick = (rating: number) => {
    formik.setFieldValue("rate", rating)
  }

  const allReviews = [...reviews, ...additionalReviews]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="md:min-w-[700px] lg:min-w-[800px] p-0!"
      >
        <VisuallyHidden>
          <DialogTitle>{t("courseDetails.reviewsDialogTitle")}</DialogTitle>
          <DialogDescription className="text-sm text-[#666]">
            {t("courseDetails.reviewsDialogDescription")}
          </DialogDescription>
        </VisuallyHidden>
        <div className="flex flex-col md:flex-row gap-10 h-[700px] overflow-y-auto p-5 pb-0!">
          <div className="flex flex-1 md:sticky top-0 items-center gap-2 flex-col bg-white">
            <p className="text-5xl font-bold">
              {course?.rating_avg.toFixed(1)}
            </p>
            <div className="flex justify-center gap-1">
              {Array.from({ length: fullStars }).map((_, index) => (
                <Star key={index} fill="#C67514" color="#C67514" size={12} />
              ))}
              {hasHalfStar && (
                <StarHalf
                  className={`${i18n.language === "ar" ? "rotate-180" : ""}`}
                  fill="#C67514"
                  color="#C67514"
                  size={12}
                />
              )}
              {Array.from({ length: emptyStars }).map((_, index) => (
                <Star key={`empty-${index}`} color="#C67514" size={12} />
              ))}
            </div>
            <p className="text-sm underline text-[#666]">
              {course?.rating_counts} {t("courseDetails.reviews")}
            </p>
          </div>
          <div className="relative flex flex-col justify-between flex-1/2">
            {reviewsLoading ? (
              <div className="space-y-4 flex-1 flex justify-center items-center">
                <BtnLoad color="main" size={30} />
              </div>
            ) : allReviews && allReviews.length > 0 ? (
              <div className="space-y-4">
                <div>
                  {allReviews.map((review, index) => (
                    <ReviewItem
                      key={`${review.created}-${index}`}
                      review={review}
                    />
                  ))}
                </div>

                {nextUrl && (
                  <div className="flex justify-center pb-4">
                    <Button
                      onClick={loadMoreReviews}
                      disabled={isLoadingMore}
                      className="w-full bg-(--main-color) hover:bg-(--main-darker-color) disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    >
                      {isLoadingMore ? (
                        <BtnLoad size={20} />
                      ) : (
                        t("courseDetails.loadMore")
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-10 text-center text-[#666]">
                <p>{t("courseDetails.noReviews")}</p>
              </div>
            )}
            <div className=" py-2 space-y-4 start-0 sticky bg-white bottom-0">
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={avatarImg.src as any} />
                  <AvatarFallback>
                    <img src={avatarImg.src as any} alt="avatar fall back" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-3">
                    <div
                      className="flex gap-1 mb-1"
                      onMouseLeave={() => setHoveredStar(0)}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className="cursor-pointer transition-colors"
                          fill={
                            star <= (hoveredStar || formik.values.rate)
                              ? "#C67514"
                              : "none"
                          }
                          color="#C67514"
                          onClick={() => handleStarClick(star)}
                          onMouseEnter={() => setHoveredStar(star)}
                        />
                      ))}
                    </div>
                  </div>

                  <Textarea
                    placeholder={t("courseDetails.shareThoughts")}
                    className="min-h-[100px] resize-none"
                    value={formik.values.comment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="comment"
                  />
                  {formik.touched.comment && formik.errors.comment && (
                    <span className="text-xs text-red-500 mt-1">
                      {formik.errors.comment}
                      {formik.touched.rate && formik.errors.rate && (
                        <span className="text-xs text-red-500">
                          , {formik.errors.rate}
                        </span>
                      )}
                    </span>
                  )}
                  <Button
                    onClick={() => formik.handleSubmit()}
                    className="mt-3 block bg-(--main-color) hover:bg-(--main-darker-color)"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending
                      ? t("courseDetails.submitting")
                      : t("courseDetails.submitReview")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
