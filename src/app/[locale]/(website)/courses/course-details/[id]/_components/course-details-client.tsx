"use client"

import {
  BadgeCheck,
  BookText,
  Clock,
  Heart,
  MonitorPlay,
  Play,
  Presentation,
  Section as SectionIcon,
  Star,
  StarHalf,
  Trophy,
  Users,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import truncate from "truncate-html"
import createDOMPurify from "dompurify"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import ShowLinksComponent from "@/components/ShowLinks"
import SectionItem from "./section-item"
import avatarImg from "@/assets/avatar.webp"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getSections } from "@/lib/api/Sections"
import useAxios from "@/hooks/useAxios"
import Skeleton from "react-loading-skeleton"
import ReviewsDialog from "./reviews-dialog"
import { getCourse, getFilterdCourses } from "@/lib/api/Courses"
import { useTranslation } from "react-i18next"
import { useParams, usePathname, useRouter } from "next/navigation"
import "react-loading-skeleton/dist/skeleton.css"
import VideoPreviewDialog from "./video-preview-dialog"
import SpecialHeader from "@/components/SpecialHeader"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import SingleCourse from "@/components/SingleCourse"
import { Course } from "@/lib/types/course"
import CourseSkeleton from "@/components/course-skeleton"
import { toast } from "sonner"
import BtnLoad from "@/components/BtnLoad"
import { getUser } from "@/lib/api/User"

const getStarDisplay = (rating: number) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating - fullStars >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return { fullStars, hasHalfStar, emptyStars }
}

export default function CourseDetailsClient() {
  const [showAll, setShowAll] = useState<boolean>(false)
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const [cleanHtml, setCleanHtml] = useState("")
  const [enrollLoading, setEnrollLoading] = useState(false)
  const [openReviews, setOpenReviews] = useState<boolean>(false)
  const [openPreview, setOpenPreview] = useState<boolean>(false)
  const Axios = useAxios()
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname()

  const html = showAll ? cleanHtml : truncate(cleanHtml, 1000)

  const { data: course } = useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourse(Axios, id),
    staleTime: 10 * 60 * 1000,
  })
  
  const { data: sections, isLoading: sectionsLoading } = useQuery({
    queryKey: ["sections", course?.id],
    queryFn: () => getSections(Axios, course?.id),
    enabled: !!course,
    staleTime: 10 * 60 * 1000,
  })

  const { data: relatedCoursesRes, isLoading: isRelatedLoading } = useQuery({
    queryKey: ["relatedCoursesRes"],
    queryFn: () =>
      getFilterdCourses(
        Axios,
        `/courses/filter?category_slug=${course?.category.id}`
      ),
    enabled: !!course,
    staleTime: 10 * 60 * 1000,
  })

  const { data: user } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: () => getUser(Axios),
    staleTime: 10 * 60 * 1000,
    retry: false,
  })

  const enrollMutation = useMutation({
    mutationFn: async (courseId: string | undefined) => {
      const res = await Axios.post(`/courses/${courseId}/enroll`, {
        course_id: courseId,
      })
      return res
    },
    onSuccess: () => {
      toast.success("Course enrolled successfully")
      queryClient.invalidateQueries({ queryKey: ["course", id] })
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      queryClient.invalidateQueries({ queryKey: ["loggedInUser", "enrollments"] })
      router.push(`/dashboard/my-learning`)
    },
    onError: () => {
      toast.error(t("genericError"))
    },
  })

  function handleEnroll(courseId: string | undefined) {
    if(!user){
      setEnrollLoading(true);
      router.push(`/login?redirect=${pathname}`)
    }else{
      enrollMutation.mutate(courseId)
    }
  }

  const relatedCourses: Course[] = relatedCoursesRes?.courses ?? []

  useEffect(() => {
    if (typeof window !== "undefined") {
      const DOMPurify = createDOMPurify(window)
      setCleanHtml(DOMPurify.sanitize(course?.detailed_description || ""))
    }
  }, [course])

  const { fullStars, hasHalfStar, emptyStars } = getStarDisplay(
    course?.rating_avg || 0
  )

  return (
    <>
      <div className="container flex flex-col-reverse lg:flex-row lg:gap-0 gap-10 items-start justify-between lg:-mt-12!">
        <div className="xl:w-[800px] lg:w-[623px] w-full">
          <section className="rounded-md justify-between overflow-hidden flex flex-col md:flex-row items-center border bg-white">
            <div className="md:bg-(--main-color) p-5 flex flex-col gap-2 justify-center border-b md:border-none items-center w-full md:w-[calc(100%/4)] md:text-white">
              <BadgeCheck size={25} />
              <p className="font-semibold">{t("courseDetails.verified")}</p>
            </div>
            <div className="flex flex-col items-center gap-1 w-full border-b md:border-e md:border-b-0 py-5 md:py-0 md:w-[calc(100%/4)]">
              <p className="text-3xl font-bold">
                {course?.rating_avg.toFixed(1)}
              </p>
              <div className="flex gap-1">
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
            <div className="flex flex-col items-center w-full border-b md:border-e md:border-b-0 py-5 md:py-0 md:w-[calc(100%/4)] gap-1">
              <Presentation size={25} />
              <p className="font-bold">{course?.lectures_count}</p>
              <p className="text-sm underline text-[#666]">
                {t("courseDetails.lectures")}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1 w-full py-5 md:py-0 md:w-[calc(100%/4)]">
              <Clock size={25} />
              <p className="font-bold">{course?.hours}</p>
              <p className="text-sm underline text-[#666]">
                {t("courseDetails.hours")}
              </p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-semibold text-2xl">
              {t("courseDetails.courseIncludes")}
            </h2>
            <div className="flex flex-col sm:flex-row mt-5 justify-between">
              <ul className="space-y-4 text-[#333]">
                <li className="flex items-center gap-4">
                  <Clock size={16} />
                  <span>
                    {course?.hours} {t("courseDetails.hoursOfLearning")}
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <SectionIcon size={16} />
                  <span>
                    {course?.sections_count} {t("courseDetails.sections")}
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <MonitorPlay size={16} />
                  <span>
                    {course?.lectures_count}{" "}
                    {t("courseDetails.lecturesLowercase")}
                  </span>
                </li>
              </ul>
              <ul className="space-y-4 text-[#333] mt-4 sm:mt-0">
                <li className="flex items-center gap-4">
                  <BookText size={16} />
                  <span>12 {t("courseDetails.quizToRate")}</span>
                </li>
                <li className="flex items-center gap-4">
                  <Users size={16} />
                  <span>
                    {course?.enrollments_count}{" "}
                    {t("courseDetails.enrolledStudents")}
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <Trophy size={16} />
                  <span>{t("courseDetails.verifiedCertificate")}</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-semibold text-2xl">
              {t("courseDetails.courseContent")}
            </h2>
            <div className="mt-5">
              <p className="text-[#333] text-sm mb-2">
                {course?.sections_count} {t("courseDetails.sections")} •{" "}
                {course?.lectures_count} {t("courseDetails.lectures")}
              </p>
              {sectionsLoading ? (
                <Skeleton className="w-full! h-[400px]" />
              ) : (
                sections?.map((section, index) => (
                  <div key={section.id}>
                    <SectionItem
                      last={sections.length - 1 === index}
                      section={section}
                    />
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="my-10">
            <h2 className="font-semibold text-2xl">
              {t("courseDetails.description")}
            </h2>
            <div
              className="prose mt-4 text-[#333] text-sm"
              dangerouslySetInnerHTML={{
                __html: html,
              }}
            />
            {(course?.detailed_description.length as any) > 4000 && (
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="mt-2 py-2 px-4 bg-orange-100 text-(--main-color) text-sm cursor-pointer rounded-sm"
              >
                {showAll
                  ? t("courseDetails.showLess")
                  : t("courseDetails.showAll")}
              </button>
            )}
          </section>

          <section className="mt-10">
            <h2 className="font-semibold text-2xl">
              {t("courseDetails.instructor")}
            </h2>
            <div className="mt-5 flex gap-5">
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
                <p className="text-[#333] font-semibold">
                  {course?.instructor.name}
                </p>
                {course?.instructor.links && (
                  <ShowLinksComponent links={course?.instructor.links as any} />
                )}
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-semibold text-2xl">
              {t("courseDetails.reviewsSection")}
            </h2>
            <div className="mt-5 flex gap-5">
              <button
                onClick={() => setOpenReviews((prev) => !prev)}
                className="cursor-pointer w-full outline-none bg-gray-50 rounded-md py-5 flex justify-center flex-col gap-2 hover:bg-gray-100"
              >
                <p className="text-5xl font-bold">
                  {course?.rating_avg.toFixed(1)}
                </p>
                <div className="flex justify-center gap-1">
                  {Array.from({ length: fullStars }).map((_, index) => (
                    <Star
                      key={index}
                      fill="#C67514"
                      color="#C67514"
                      size={12}
                    />
                  ))}
                  {hasHalfStar && (
                    <StarHalf
                      className={`${
                        i18n.language === "ar" ? "rotate-180" : ""
                      }`}
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
              </button>
            </div>
          </section>
        </div>

        <section className="lg:max-w-[350px] w-full lg:p-4 mt-5 lg:-mt-60 lg:shadow-2xl bg-white lg:sticky top-2 flex-1 rounded-sm">
          <div className={`relative rounded-sm h-[300px] lg:h-[175px]`}>
            <div className="absolute z-10 top-1/2 left-1/2 -translate-1/2">
              <button
                aria-label="play preview video"
                onClick={() => setOpenPreview(true)}
                className="outline-0 group bg-white p-3 rounded-full cursor-pointer"
              >
                <Play className="fill-(--main-color) duration-300 group-hover:scale-110 text-(--main-color)" />
              </button>
            </div>
            <Image
              src={course?.image as any}
              fill
              alt={course?.title as any}
              className="object-cover rounded-sm"
              sizes="(max-width: 768px) 100vw, 400px"
              loading="eager"
              unoptimized
            />
          </div>
          <div className="mt-2 space-y-2">
            <p className="text-xs flex gap-2 items-center">
              <BadgeCheck size={12} className="text-(--main-color)" />
              <span className="text-[#666]">
                {t("courseDetails.courseVerified")}
              </span>
            </p>
            <p className="text-3xl font-bold">{course?.price === 0 ? t("coursesPage.free") : `$${course?.price}`}</p>
            <p className="text-xs text-[#666]">
              {t("courseDetails.courseLevel")} {course?.level}
            </p>
            <div className="flex gap-2 mt-5">
              {course?.enrolled ? (
                <Link
                  href={`/dashboard/my-learning`}
                  className="w-full font-semibold text-center py-3 rounded-sm bg-(--main-color) border border-(--main-color) duration-300 text-white hover:bg-(--main-darker-color) cursor-pointer"
                >
                  {t("coursesPage.gotocourse")}
                </Link>
              ) : (
                <button
                  onClick={() => handleEnroll(course?.id)}
                  disabled={enrollMutation.isPending || enrollLoading}
                  className="w-full disabled:opacity-50 disabled:cursor-not-allowed py-3 font-semibold rounded-sm bg-(--main-color) border border-(--main-color) duration-300 text-white hover:bg-(--main-darker-color) cursor-pointer"
                >
                  {enrollMutation.isPending || enrollLoading ? (
                    <div className="flex justify-center items-center">
                      <BtnLoad size={24} />
                    </div>
                  ) : (
                    t("courseDetails.enroll")
                  )}
                </button>
              )}
              <button
                aria-label="add wishlist"
                className="border cursor-pointer duration-300 border-(--main-color) text-(--main-color) hover:bg-(--main-color) group p-2 rounded-sm"
              >
                <Heart
                  className="fill-(--main-color) group-hover:fill-white"
                  size={30}
                />
              </button>
            </div>
            <button className="w-full mt-2 py-3 rounded-sm duration-300 hover:bg-orange-50 bg-white text-(--main-color) border border-(--main-color) cursor-pointer">
              {t("courseDetails.buyNow")}
            </button>
          </div>
          <p className="text-center mt-4 text-xs text-[#666]">
            {t("courseDetails.moneyBackGuarantee")}
          </p>
        </section>
      </div>

      <div className="mt-20! container">
        <SpecialHeader name={"Related Courses"} />
        <Carousel
          className="w-full"
          opts={{
            direction: i18n.language === "ar" ? "rtl" : "ltr",
            slidesToScroll: "auto",
            loop: isRelatedLoading,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {isRelatedLoading ? (
              <>
                <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 xl:basis-1/3 justify-center flex">
                  <CourseSkeleton grid={true} />
                </CarouselItem>
                <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 xl:basis-1/3 justify-center flex">
                  <CourseSkeleton grid={true} />
                </CarouselItem>
                <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 xl:basis-1/3 justify-center flex">
                  <CourseSkeleton grid={true} />
                </CarouselItem>
                <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 xl:basis-1/3 justify-center flex">
                  <CourseSkeleton grid={true} />
                </CarouselItem>
              </>
            ) : (
              relatedCourses.map((course) => (
                <CarouselItem
                  key={course.id}
                  className="pl-2 md:pl-4 md:basis-1/2 xl:basis-1/3 flex"
                >
                  <div className="w-full h-full">
                    <SingleCourse grid={true} course={course} />
                  </div>
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          <CarouselPrevious
            className={`shadow-2xl bg-(--main-color) hover:bg-(--main-darker-color) hover:text-white text-white ${
              i18n.language === "ar" ? "-right-2 rotate-180" : "-left-2"
            }`}
          />
          <CarouselNext
            className={`shadow-2xl bg-(--main-color) hover:bg-(--main-darker-color) hover:text-white text-white ${
              i18n.language === "ar"
                ? "right-[calc(100%-25px)] rotate-180"
                : "-right-2"
            }`}
          />
        </Carousel>
        <div className="w-fit m-auto">
          <Link
            href={`/courses?category_slug=${course?.category.id}`}
            className="py-2 block px-5 border border-(--main-color) text-(--main-color) hover:bg-orange-100 cursor-pointer my-10"
          >
            {t("categories.showall")}
          </Link>
        </div>
      </div>

      <VideoPreviewDialog
        open={openPreview}
        setOpen={setOpenPreview}
        video={course?.video_url || ""}
      />

      <ReviewsDialog
        course={course as any}
        open={openReviews}
        setOpen={setOpenReviews}
      />
    </>
  )
}
