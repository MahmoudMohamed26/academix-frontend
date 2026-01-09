"use client"

import { BookOpenText, Dice6, GraduationCap, Users } from "lucide-react"
import { useTranslation } from "react-i18next";

export default function Stats() {
  const { t } = useTranslation();

  return (
    <div className="py-5 text-white bg-(--main-color)">
      <div className="flex justify-center gap-10 lg:gap-0 flex-wrap container">
        <div className="flex items-center w-full md:w-auto lg:w-[calc(100%/4)] justify-center flex-col gap-2">
          <Users size={50} />
          <p className="font-bold sm:text-xl">{t("stats.enrolledStudents")}</p>
        </div>
        <div className="flex items-center w-full md:w-auto lg:w-[calc(100%/4)] justify-center flex-col gap-2">
          <GraduationCap size={50} />
          <p className="font-bold sm:text-xl">{t("stats.instructors")}</p>
        </div>
        <div className="flex items-center w-full md:w-auto lg:w-[calc(100%/4)] justify-center flex-col gap-2">
          <BookOpenText size={50} />
          <p className="font-bold sm:text-xl">{t("stats.courses")}</p>
        </div>
        <div className="flex items-center w-full md:w-auto lg:w-[calc(100%/4)] justify-center flex-col gap-2">
          <Dice6 size={50} />
          <p className="font-bold sm:text-xl">{t("stats.categories")}</p>
        </div>
      </div>
    </div>
  )
}