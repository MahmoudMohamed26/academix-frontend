"use client"

import ShowLinksComponent from "@/components/ShowLinks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useAxios from "@/hooks/useAxios"
import { getCourse } from "@/lib/api/Courses"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useParams } from "next/navigation"
import avatarImg from "@/assets/avatar.webp"
import Skeleton from "react-loading-skeleton"

export default function InstructorItem() {
  const { id } = useParams()
  const Axios = useAxios()

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourse(Axios, id),
    staleTime: 10 * 60 * 1000,
  })

  return isLoading ? (
    <div className="mt-4 flex gap-5">
      <Skeleton className="w-16! rounded-full! h-16!" />
      <div>
        <Skeleton className="w-[150px]! h-6!" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="w-4! h-4!" />
          <Skeleton className="w-4! h-4!" />
          <Skeleton className="w-4! h-4!" />
          <Skeleton className="w-4! h-4!" />
          <Skeleton className="w-4! h-4!" />
        </div>
      </div>
    </div>
  ) : (
    <div className="mt-4 flex gap-5">
      <Link href={`/instructors/${course?.instructor.id}`}>
        <Avatar className="w-16 h-16">
          <AvatarImage
            alt={`${course?.instructor.name} avatar`}
            src={course?.instructor.avatar_url as any}
          />
          <AvatarFallback>
            <img src={avatarImg.src as any} alt="avatar fall back" />
          </AvatarFallback>
        </Avatar>
      </Link>
      <div>
        <p className="text-[#333] font-semibold">{course?.instructor.name}</p>
        {course?.instructor.links && (
          <ShowLinksComponent links={course?.instructor.links as any} />
        )}
      </div>
    </div>
  )
}
