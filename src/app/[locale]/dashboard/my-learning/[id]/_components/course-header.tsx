"use client"

import SpecialHeader from "@/components/SpecialHeader";
import useAxios from "@/hooks/useAxios";
import { getCourse } from "@/lib/api/Courses";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";

export default function CourseHeader(){

  const { id } = useParams()
  const Axios = useAxios()

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourse(Axios, id),
    staleTime: 10 * 60 * 1000,
  })

  return isLoading ? <Skeleton className="w-[40%]! h-[52px] mb-4" /> : <SpecialHeader name={course?.title as any} />
}