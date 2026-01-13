"use client"

import useAxios from "@/hooks/useAxios"
import { getEnrollments } from "@/lib/api/Enrollment"
import { EnrolledCourse } from "@/lib/types/enrolls"
import { useQuery } from "@tanstack/react-query"
import LearnItem from "./learn-item"
import Skeleton from "react-loading-skeleton"

export default function MyLearningClient() {
  const Axios = useAxios()
  const { data: enrollmentsRes, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["loggedInUser", "enrollments"],
    queryFn: () => getEnrollments(Axios),
    staleTime: 10 * 60 * 1000,
  })

  const enrollments: EnrolledCourse[] = enrollmentsRes?.enrollments || []
  const enrollmentsPagination = enrollmentsRes?.links ?? []
  console.log(enrollments)

  return (
    <>
      {enrollmentsLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full! h-[210px]!" />
          <Skeleton className="w-full! h-[210px]!" />
          <Skeleton className="w-full! h-[210px]!" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {enrollments?.map((course) => (
            <div key={course.id}>
              <LearnItem enrollments={course} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
