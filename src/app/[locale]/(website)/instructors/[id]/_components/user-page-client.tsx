"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import useAxios from "@/hooks/useAxios"
import { getFilterdCourses } from "@/lib/api/Courses"
import { getProfile } from "@/lib/api/User"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { useQuery } from "@tanstack/react-query"
import { useParams, useSearchParams } from "next/navigation"
import avatarFallbackImage from "@/assets/avatar.webp"
import "react-loading-skeleton/dist/skeleton.css"
import Skeleton from "react-loading-skeleton"
import ShowLinksComponent from "@/components/ShowLinks"
import SpecialHeader from "@/components/SpecialHeader"
import SingleCourse from "@/components/SingleCourse"
import { Course, CourseLinks } from "@/lib/types/course"
import CourseSkeleton from "@/components/course-skeleton"
import { useTranslation } from "react-i18next"
import Pagination from "@/components/pagination"

export default function UserPageClient() {
  const { id } = useParams()
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const Axios = useAxios()

  const buildQueryString = () => {
    const params = new URLSearchParams()
    params.append('user_id', id as string)
    
    const page = searchParams.get('page')
    if (page) {
      params.append('page', page)
    }
    
    return params.toString()
  }

  const { data: courseData, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["courses", id, searchParams.get('page')],
    queryFn: () => getFilterdCourses(Axios, `/courses/filter?${buildQueryString()}`),
  })

  const { data: instructor, isLoading: isLoadingInstructor } = useQuery({
    queryKey: ["instructors", id],
    queryFn: () => getProfile(Axios, id),
  })

  const filteredCourses: Course[] = courseData?.courses ?? []
  const paginationLinks: CourseLinks | undefined = courseData?.meta

  return (
    <>
      <div className="bg-[#17161C] pt-5 pb-30">
        <div className="container text-white">
          {isLoadingInstructor ? (
            <Skeleton
              width={300}
              height={36}
              baseColor="#2a2a2a"
              highlightColor="#3a3a3a"
            />
          ) : (
            <h1 className="text-4xl font-bold">{instructor?.name}</h1>
          )}
        </div>
      </div>
      <div className="flex justify-between gap-10 container">
        <div className="mt-5 flex-1">
          <SpecialHeader name="Courses" />
          {isLoadingCourses ? (
            <div className={`special-grid`}>
              <CourseSkeleton grid={true} />
              <CourseSkeleton grid={true} />
              <CourseSkeleton grid={true} />
              <CourseSkeleton grid={true} />
              <CourseSkeleton grid={true} />
              <CourseSkeleton grid={true} />
            </div>
          ) : filteredCourses && filteredCourses.length > 0 ? (
            <div className={`special-grid`}>
              {filteredCourses.map((course) => (
                <SingleCourse
                  key={course.id}
                  grid={true}
                  course={course as any}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              {t("coursesPage.noCourses")}
            </div>
          )}
          <Pagination paginationLinks={paginationLinks || undefined} />
        </div>
        {isLoadingInstructor ? (
          <div className="flex items-center flex-col">
            <Skeleton
              className="w-48! h-48! block! -mt-25! rounded-full!"
            />
            <Skeleton
              className="block! rounded-md"
              width={120}
              height={20}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-48 h-48 -mt-25 shadow-2xl bg-gray-100">
              <AvatarImage src={instructor?.avatar_url as any} />
              <AvatarFallback>
                <img
                  className="rounded-full h-8 w-8"
                  src={avatarFallbackImage.src}
                  alt="avatar fall back image"
                />
              </AvatarFallback>
            </Avatar>
            {instructor?.links && (
              <ShowLinksComponent links={instructor?.links} size={20} />
            )}
          </div>
        )}
      </div>
    </>
  )
}