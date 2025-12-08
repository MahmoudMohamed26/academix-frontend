"use client"

import "react-phone-input-2/lib/style.css"
import "react-calendar/dist/Calendar.css"
import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/lib/api/User"
import useAxios from "@/hooks/useAxios"
import Skeleton from "react-loading-skeleton"
import ProfileInforForm from "./_components/Profile-info-form"
import ChangePasswordForm from "./_components/change-password-form"
import LinksForm from "./_components/links-form"

export default function ProfileForm() {
  const Axios = useAxios()

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: () => getUser(Axios),
    staleTime: 10 * 60 * 1000,
  })


  return (
    <div className="flex-1">
      {userLoading ? (
        <div>
          <Skeleton height={30} width={250} className="mb-8" />
          <Skeleton height={30} width={850} className="mb-8" />
          <Skeleton height={30} width={650} className="mb-8" />
          <Skeleton height={30} width={950} className="mb-8" />
          <Skeleton height={30} width={450} className="mb-8" />
          <Skeleton height={30} width={550} className="mb-8" />
          <Skeleton height={30} width={750} className="mb-8" />
          <Skeleton height={30} width={50} className="mb-8" />
          <Skeleton height={30} width={250} className="mb-8" />
          <Skeleton height={30} width={850} className="mb-8" />
          <Skeleton height={30} width={650} className="mb-8" />
          <Skeleton height={30} width={150} className="mb-8" />
        </div>
      ) : (
        <>
          <ProfileInforForm user={user} />
          <hr className="my-10" />
          <ChangePasswordForm />
          <hr className="my-10" />
          <LinksForm user={user} />
        </>
      )}
    </div>
  )
}