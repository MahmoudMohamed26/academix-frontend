"use client"

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { toast } from "sonner"
import axios, { isAxiosError } from "axios"
import { useTranslation } from "react-i18next"
import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import BtnLoad from "@/components/BtnLoad"
import Input from "@/components/Input"
import Logo from "@/components/Logo"
import Language from "@/components/Language"
import useAxios from "@/hooks/useAxios"
import { useRedirectParam } from "@/hooks/user-redirect"

export default function LoginForm() {
  const [load, setLoad] = useState(false)
  const { t } = useTranslation()
  const Axios = useAxios()
  const redirect = useRedirectParam()
  const router = useRouter()

  const validationSchema = Yup.object({
    email: Yup.string()
      .required(t("register.errors.emailRequired"))
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        t("register.errors.emailInvalid")
      ),
    password: Yup.string().required(t("login.errors.passwordRequired")),
  })

  const form = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember_me: false,
    },
    validationSchema,
    onSubmit: async () => {
      await handleLogin()
    },
  })

  async function handleLogin() {
    try {
      setLoad(true)
      await Axios.post(`/auth/login`, form.values)
      toast.success(t("login.success"))
      if(redirect){
        router.replace(redirect)
      }else{
        router.replace("/")
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 422 || err.response?.status === 401)
          toast.error(t("login.errors.invalidCredentials"))
        else toast.error(t("genericError"))
        setLoad(false)
        form.setFieldValue("password", "")
      }
    }
  }

  async function handleOAuth(){
    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/url`)
      .then(res => res.json())
      router.push(`${res.data}`)
    }catch(error){
      console.log(error);
    }
  }

  return (
    <>
      <Logo w={100} h={100} />
      <div className="bg-white rounded-md w-[400px] duration-300 md:w-[500px] py-4 px-4 shadow-xl">
        <h1 className="text-3xl font-semibold text-gray-900 text-center">
          {t("login.title")}{" "}
          <span className="text-(--main-color)">Academix</span>
        </h1>
        <p className="text-gray-600 text-sm mt-2 text-center">
          {t("login.description")}
        </p>

        <form className="mt-4" onSubmit={form.handleSubmit}>
          <div className="mb-4">
            <Input
              formik={form as any}
              placeholder={t("login.placeholder-email")}
              label={t("login.email")}
              name="email"
            />
          </div>
          <div className="mb-4">
            <Input
              formik={form as any}
              password
              placeholder={t("login.placeholder-password")}
              label={t("login.password")}
              name="password"
            />
          </div>

          <div className="flex items-center mb-4 justify-between">
            <div className="flex items-center">
              <Checkbox
                checked={form.values.remember_me}
                onCheckedChange={(checked: boolean) =>
                  form.setFieldValue("remember_me", checked)
                }
                name="remember"
                className="data-[state=checked]:bg-(--main-color) data-[state=checked]:border-(--main-color) outline-none"
                id="remember"
              />
              <Label className="ms-2 text-gray-700" htmlFor="remember">
                {t("login.rememberMe")}
              </Label>
            </div>
            <div>
              <Link
                href="/forgot-password"
                className="text-(--main-color) block text-sm hover:underline"
              >
                {t("login.forgotPassword")}
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={load}
            className={`bg-(--main-color) flex justify-center mb-4 w-full text-white rounded py-2 px-4 hover:bg-(--main-darker-color) transition duration-300 ${
              load ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
          >
            {load ? <BtnLoad size={24} /> : t("login.submit")}
          </button>
        </form>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              {t("login.orcontinueWith")}
            </span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="">
          <button
            className="flex items-center hover:cursor-pointer w-full gap-4 px-4 justify-center py-2 font-semibold text-sm border rounded-md text-gray-700 hover:bg-gray-100 transition duration-300 mb-2"
            onClick={handleOAuth}
          >
            <svg
              viewBox="0 0 512 512"
              width={23}
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
              strokeLinejoin="round"
              strokeMiterlimit="2"
            >
              <path d="M32.582 370.734C15.127 336.291 5.12 297.425 5.12 256c0-41.426 10.007-80.291 27.462-114.735C74.705 57.484 161.047 0 261.12 0c69.12 0 126.836 25.367 171.287 66.793l-73.31 73.309c-26.763-25.135-60.276-38.168-97.977-38.168-66.56 0-123.113 44.917-143.36 105.426-5.12 15.36-8.146 31.65-8.146 48.64 0 16.989 3.026 33.28 8.146 48.64l-.303.232h.303c20.247 60.51 76.8 105.426 143.36 105.426 34.443 0 63.534-9.31 86.341-24.67 27.23-18.152 45.382-45.148 51.433-77.032H261.12v-99.142h241.105c3.025 16.757 4.654 34.211 4.654 52.364 0 77.963-27.927 143.592-76.334 188.276-42.356 39.098-100.305 61.905-169.425 61.905-100.073 0-186.415-57.483-228.538-141.032v-.233z" />
            </svg>
            <p>{t("login.google")}</p>
          </button>

        </div>

        <p className="text-gray-600 text-sm mt-4 text-center">
          {t("login.donthaveAccount")}{" "}
          <Link
            href="/register"
            className="text-(--main-color) hover:underline"
          >
            {t("login.createAccount")}
          </Link>
        </p>
      </div>

      <div className="mt-10 pb-2 flex gap-2 items-center">
        <Language form={1} />
      </div>
    </>
  )
}
