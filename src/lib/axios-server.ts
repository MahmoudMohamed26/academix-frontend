// lib/axios-server.ts
import axios from 'axios';
import { cookies } from 'next/headers';

export async function getServerAxios(locale: string = 'en') {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
      'x-language': locale,
      ...(cookieHeader && { Cookie: cookieHeader }),
    },
    withCredentials: true,
  });
}