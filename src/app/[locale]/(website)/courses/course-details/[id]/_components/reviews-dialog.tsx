import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import ReviewItem from "./review-item"
import { Course } from "@/lib/types/course"
import { Star, StarHalf } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useFormik } from "formik"
import * as Yup from "yup"
import avatarImg from "@/assets/avatar.webp"

interface ReviewDialog {
  course: Course
  open: boolean
  setOpen: (open: boolean) => void
}

const reviewSchema = Yup.object({
  rate: Yup.number()
    .min(1, "Please select a rating")
    .max(5, "Rating must be between 1 and 5")
    .required("Rating is required"),
  comment: Yup.string()
    .min(10, "Comment must be at least 10 characters")
    .max(500, "Comment must not exceed 500 characters")
    .required("Comment is required"),
})

export default function ReviewsDialog({ course, open, setOpen }: ReviewDialog) {
  const [halfStar, setHalfStar] = useState(false)
  const [restStars, setRestStars] = useState(5)
  const [hoveredStar, setHoveredStar] = useState(0)

  const formik = useFormik({
    initialValues: {
      rate: 0,
      comment: "",
    },
    validationSchema: reviewSchema,
    onSubmit: (values) => {
      console.log("Review submitted:", values)
      formik.resetForm()
    },
  })

  const handleStarClick = (rating: number) => {
    formik.setFieldValue("rate", rating)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false} className="min-w-[800px] p-0!">
        <VisuallyHidden>
          <DialogTitle>Reviews</DialogTitle>
          <DialogDescription className="text-sm text-[#666]">
            Check all reviews for this course
          </DialogDescription>
        </VisuallyHidden>
        <div className="flex gap-20 max-h-[800px] overflow-y-auto p-5">
          <div className="flex flex-1 sticky top-0 items-center gap-2 flex-col bg-white">
            <p className="text-5xl font-bold">
              {course?.rating_avg.toFixed(1)}
            </p>
            <div className="flex justify-center gap-1">
              {Array.from({
                length: Math.floor(course?.rating_avg || 0),
              }).map((_, index) => (
                <Star key={index} fill="#C67514" color="#C67514" size={12} />
              ))}
              {halfStar && (
                <StarHalf fill="#C67514" color="#C67514" size={12} />
              )}
              {Array.from({ length: restStars }).map((_, index) => (
                <Star key={index} color="#C67514" size={12} />
              ))}
            </div>
            <p className="text-sm underline text-[#666]">
              {course?.rating_counts} Reviews
            </p>

            {/* Review Form */}
          </div>
          <div className="flex-1/2">
            <ReviewItem />
            <div className="w-full mt-6 space-y-4">
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
                          size={24}
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
                    {formik.touched.rate && formik.errors.rate && (
                      <p className="text-xs text-red-500">
                        {formik.errors.rate}
                      </p>
                    )}
                  </div>

                  <Textarea
                    placeholder="Share your thoughts about this course..."
                    className="min-h-[100px] resize-none"
                    value={formik.values.comment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="comment"
                  />
                  {formik.touched.comment && formik.errors.comment && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.comment}
                    </p>
                  )}

                  <Button
                    onClick={() => formik.handleSubmit()}
                    className="mt-3 bg-[#C67514] hover:bg-[#a56010]"
                  >
                    Submit Review
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
