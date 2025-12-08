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
          <Skeleton height={30} className="mb-8 w-[40%]!" />
          <Skeleton height={30} className="mb-8 w-[80%]!" />
          <Skeleton height={30} className="mb-8 w-[60%]!" />
          <Skeleton height={30} className="mb-8 w-[20%]!" />
          <Skeleton height={30} className="mb-8 w-[40%]!" />
          <Skeleton height={30} className="mb-8 w-[30%]!" />
          <Skeleton height={30} className="mb-8 w-[60%]!" />
          <Skeleton height={30} className="mb-8 w-[70%]!" />
          <Skeleton height={30} className="mb-8 w-[40%]!" />
          <Skeleton height={30} className="mb-8 w-[90%]!" />
          <Skeleton height={30} className="mb-8 w-[10%]!" />
          <Skeleton height={30} className="mb-8 w-[50%]!" />
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