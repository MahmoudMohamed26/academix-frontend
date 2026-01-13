"use client"

import { EnrolledCourse } from "@/lib/types/enrolls"
import { formatDate } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "react-i18next"

export default function LearnItem({
  enrollments,
}: {
  enrollments: EnrolledCourse
}) {
  const { t } = useTranslation()

  return (
    <div className="block p-4 border rounded-md">
      <div className="flex flex-col lg:flex-row gap-4">
        <div
          className={`rounded-md m-auto sm:m-0 overflow-hidden w-full sm:w-[330px] relative h-[180px]`}
        >
          <Image
            src={enrollments.image}
            fill
            alt={"test"}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            loading="eager"
            unoptimized
          />
        </div>
        <div className="flex flex-1 gap-y-5 flex-col justify-between">
          <div>
            <h4 className="text-xl mb-3 font-semibold text-[#333]">
              {enrollments.title}
            </h4>
            <p className="text-sm text-[#666]">
              {enrollments.short_description}
            </p>
          </div>
          <div className="flex items-center flex-wrap gap-2 justify-between">
            <div className="flex gap-2 flex-wrap">
              {enrollments.started && (
                <>
                  <span className="text-[12px] text-[#666] py-1 px-2 border rounded-sm">
                    {t("Dashboard.myLearning.enrolledOn")}{" "}
                    {formatDate(enrollments.started, "MMMM dd, yyyy")}
                  </span>
                  <span className="text-[12px] text-[#666] py-1 px-2 border rounded-sm">
                    {t("Dashboard.myLearning.progress")} {enrollments.progress}{" "}
                    %
                  </span>
                </>
              )}
              <span
                className={`text-[12px] ${
                  enrollments.status === "pending"
                    ? "border border-yellow-300 bg-yellow-100 text-yellow-600"
                    : "border-green-300 bg-green-100 text-green-600"
                } text-[#666] py-1 px-2 border rounded-sm`}
              >
                {t(`Dashboard.myLearning.status.${enrollments.status}`)}
              </span>
            </div>
            <div>
              {enrollments.status === "active" ? (
                <Link
                  href={`/dashboard/my-learning/${enrollments.course_id}`}
                  className="py-2 px-4 block text-white rounded-sm bg-(--main-color) hover:bg-(--main-darker-color) duration-300 text-sm font-semibold"
                >
                  {t("Dashboard.myLearning.watchNow")}
                </Link>
              ) : (
                <Link
                  href={`/dashboard/pay/under-development`}
                  className="py-2 px-4 block text-white rounded-sm bg-(--main-color) hover:bg-(--main-darker-color) duration-300 text-sm font-semibold"
                >
                  {t("Dashboard.myLearning.buyNow")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
