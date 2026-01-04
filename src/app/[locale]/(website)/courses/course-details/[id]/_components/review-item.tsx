import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import avatarImg from "@/assets/avatar.webp"
import { Star } from "lucide-react"
import { formatDate } from "date-fns"
import { Review } from "@/lib/types/review"

interface ReviewItemProps {
  review: Review
}

const getStarDisplay = (rating: number) => {
  const fullStars = Math.floor(rating)
  const emptyStars = 5 - fullStars
  
  return { fullStars, emptyStars }
}

export default function ReviewItem({ review }: ReviewItemProps) {
  const { fullStars, emptyStars } = getStarDisplay(review.rating)

  return (
    <div className="flex gap-4 border-b py-5">
      <Avatar className="w-12 h-12">
        <AvatarImage src={review.user_avatar} />
        <AvatarFallback>
          <img src={avatarImg.src as any} alt="avatar fallback" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h6 className="font-semibold text-sm">{review.user_name}</h6>
          <div className="flex gap-0.5">
            {Array.from({ length: fullStars }).map((_, index) => (
              <Star key={index} fill="#C67514" color="#C67514" size={12} />
            ))}
            {Array.from({ length: emptyStars }).map((_, index) => (
              <Star key={`empty-${index}`} color="#C67514" size={12} />
            ))}
          </div>
        </div>
        <p className="text-xs text-[#666]">
          {formatDate(new Date(review.created), "MMMM dd, yyyy")}
        </p>
        <p className="text-sm mt-2">{review.comment}</p>
      </div>
    </div>
  )
}