'use client';

import axios from "axios";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function useAxios() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  const instance = useMemo(() => {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      headers: {
        'x-language': locale
      },
      withCredentials: true
    });
  }, [locale]);

  return instance;
}