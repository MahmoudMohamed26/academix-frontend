"use client"

import useAxios from "@/hooks/useAxios"
import { getEnrollments } from "@/lib/api/Enrollment"
import { EnrolledCourse } from "@/lib/types/enrolls"
import { useQuery } from "@tanstack/react-query"
import LearnItem from "./learn-item"
import Skeleton from "react-loading-skeleton"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import Pagination from "@/components/pagination"
import { useSearchParams } from "next/navigation"

export default function MyLearningClient() {
  const Axios = useAxios()
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const page = searchParams.get('page')
  console.log(page);
  const { data: enrollmentsRes, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["loggedInUser", "enrollments", page ? `${page}` : 1],
    queryFn: () => getEnrollments(Axios, page),
    staleTime: 10 * 60 * 1000,
  })

  const enrollments: EnrolledCourse[] = enrollmentsRes?.enrollments || []
  const enrollmentsPagination = enrollmentsRes?.links

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
          {enrollments.length === 0 && <p className="text-[#666] font-semibold">{t("Dashboard.myLearning.noEnroll")} <Link className="font-semibold text-(--main-color) hover:underline" href={`/courses`}>{t("Dashboard.myLearning.browseCourses")}</Link></p>}
        </div>
      )}
      <Pagination paginationLinks={enrollmentsPagination} />
    </>
  )
}
