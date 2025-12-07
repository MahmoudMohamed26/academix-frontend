"use client"

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { toast } from "sonner"
import { isAxiosError } from "axios"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import BtnLoad from "@/components/BtnLoad"
import Input from "@/components/Input"
import Logo from "@/components/Logo"
import Language from "@/components/Language"
import useAxios from "@/hooks/useAxios"

export default function LoginForm() {
  const [load, setLoad] = useState(false)
  const { t } = useTranslation()
  const Axios = useAxios()
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
      const res = await Axios.post(`/auth/login`, form.values)
      toast.success(t("login.success"))
      router.replace("/dashboard")
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 422)
          toast.error(t("login.errors.invalidCredentials"))
        else toast.error(t("genericError"))
        setLoad(false)
        form.setFieldValue("password", "")
      }
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
                  form.setFieldValue("remember", checked)
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
        <div className="flex gap-2 flex-wrap">
          <Link
            className="flex items-center gap-4 px-4 justify-center py-2 w-[calc(50%-4px)] font-semibold text-sm border rounded-md text-gray-700 hover:bg-gray-100 transition duration-300 mb-2"
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google`}
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
          </Link>

          <Link
            className="flex items-center gap-4 px-4 justify-center py-2 w-[calc(50%-4px)] font-semibold text-sm border rounded-md text-gray-700 hover:bg-gray-100 transition duration-300 mb-2"
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/github`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={23}
              shapeRendering="geometricPrecision"
              textRendering="geometricPrecision"
              imageRendering="optimizeQuality"
              fillRule="evenodd"
              clipRule="evenodd"
              viewBox="0 0 640 640"
            >
              <path d="M319.988 7.973C143.293 7.973 0 151.242 0 327.96c0 141.392 91.678 261.298 218.826 303.63 16.004 2.964 21.886-6.957 21.886-15.414 0-7.63-.319-32.835-.449-59.552-89.032 19.359-107.8-37.772-107.8-37.772-14.552-36.993-35.529-46.831-35.529-46.831-29.032-19.879 2.209-19.442 2.209-19.442 32.126 2.245 49.04 32.954 49.04 32.954 28.56 48.922 74.883 34.76 93.131 26.598 2.882-20.681 11.15-34.807 20.315-42.803-71.08-8.067-145.797-35.516-145.797-158.14 0-34.926 12.52-63.485 32.965-85.88-3.33-8.078-14.291-40.606 3.083-84.674 0 0 26.87-8.61 88.029 32.8 25.512-7.075 52.878-10.642 80.056-10.76 27.2.118 54.614 3.673 80.162 10.76 61.076-41.386 87.922-32.8 87.922-32.8 17.398 44.08 6.485 76.631 3.154 84.675 20.516 22.394 32.93 50.953 32.93 85.879 0 122.907-74.883 149.93-146.117 157.856 11.481 9.921 21.733 29.398 21.733 59.233 0 42.792-.366 77.28-.366 87.804 0 8.516 5.764 18.473 21.992 15.354 127.076-42.354 218.637-162.274 218.637-303.582 0-176.695-143.269-319.988-320-319.988l-.023.107z" />
            </svg>
            <p>{t("login.github")}</p>
          </Link>

          <Link
            className="flex items-center gap-4 px-4 py-2 w-full justify-center font-semibold text-sm border rounded-md text-gray-700 hover:bg-gray-100 transition duration-300 mb-2"
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/linkedin`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={23}
              shapeRendering="geometricPrecision"
              textRendering="geometricPrecision"
              imageRendering="optimizeQuality"
              fillRule="evenodd"
              clipRule="evenodd"
              viewBox="0 0 512 509.64"
            >
              <rect width="512" height="509.64" rx="115.61" ry="115.61" />
              <path
                fill="#fff"
                d="M204.97 197.54h64.69v33.16h.94c9.01-16.16 31.04-33.16 63.89-33.16 68.31 0 80.94 42.51 80.94 97.81v116.92h-67.46l-.01-104.13c0-23.81-.49-54.45-35.08-54.45-35.12 0-40.51 25.91-40.51 52.72v105.86h-67.4V197.54zm-38.23-65.09c0 19.36-15.72 35.08-35.08 35.08-19.37 0-35.09-15.72-35.09-35.08 0-19.37 15.72-35.08 35.09-35.08 19.36 0 35.08 15.71 35.08 35.08zm-70.17 65.09h70.17v214.73H96.57V197.54z"
              />
            </svg>
            <p>{t("login.linkedin")}</p>
          </Link>
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
