"use client"

import { useEffect, useState } from "react"

export function useRedirectParam() {
  const [redirect, setRedirect] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setRedirect(params.get("redirect"))
  }, [])

  return redirect
}
