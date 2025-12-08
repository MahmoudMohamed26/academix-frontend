"use client"

import { useTranslation } from "react-i18next"
import * as Yup from "yup"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { isAxiosError } from "axios"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import useAxios from "@/hooks/useAxios"
import Language from "@/components/Language"
import Link from "next/link"
import BtnLoad from "@/components/BtnLoad"
import Input from "@/components/Input"
import Logo from "@/components/Logo"
import { useRouter } from "next/navigation"

export default function RegisterForm() {
  const [load, setLoad] = useState<boolean>(false)
  const Axios = useAxios()
  const router = useRouter()
  const [usedEmail, setUsedEmail] = useState<boolean>(false)
  const { i18n, t } = useTranslation()
  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t("register.errors.nameRequired"))
      .min(8, t("register.errors.nameMinLength"))
      .max(30, t("register.errors.nameMaxLength")),
    email: Yup.string()
      .required(t("register.errors.emailRequired"))
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        t("register.errors.emailInvalid")
      ),
    password: Yup.string().required(t("register.errors.passwordRequired")),
    // .matches(
    //   /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/,
    //   t("register.errors.passwordStrong")
    // ),
    password_confirmation: Yup.string()
      .required(t("register.errors.confirmPasswordRequired"))
      .oneOf([Yup.ref("password")], t("register.errors.passwordsNotMatch")),
  })
  const form = useFormik({
    initialValues: {
      name: "",
      password_confirmation: "",
      email: "",
      password: "",
      remember: false,
    },
    validationSchema,
    onSubmit: async () => {
      await register()
      console.log(form.values)
    },
  })

  async function register() {
    try {
      setLoad(true)
      await Axios.post(`/auth/register`, form.values)
      setLoad(false)
      setUsedEmail(false)
      toast.success(t("register.success"))
      router.replace("/dashboard")
    } catch (err) {
      setLoad(false)
      if (isAxiosError(err)) {
        if (err.response?.data.message === "This email is already in use") {
          setUsedEmail(true)
          toast.error(t("register.errors.emailExists"))
        }
      }
    }
  }

  useEffect(() => {
    form.validateForm()
  }, [i18n.language])

  return (
    <>
      <Logo w={100} h={100} />
      <div className="bg-white rounded-md w-[400px] duration-300 md:w-[500px] py-4 px-4 shadow-xl">
        <h1 className="text-3xl font-semibold text-gray-900 text-center">
          {t("register.title")}{" "}
          <span className="text-(--main-color)">Academix</span>
        </h1>
        <p className="text-gray-600 text-sm mt-2 text-center">
          {t("register.description")}
        </p>
        <form className="mt-4" onSubmit={form.handleSubmit}>
          <div className="mb-4">
            <Input
              formik={form as any}
              placeholder={t("register.placeholder-name")}
              label={t("register.name")}
              name="name"
            />
          </div>
          <div className="mb-4">
            <Input
              formik={form as any}
              placeholder={t("register.placeholder-email")}
              label={t("register.email")}
              name="email"
              emailExist={usedEmail}
            />
            {usedEmail && (
              <p className="text-xs text-red-500">
                {t("register.errors.emailExists")}
              </p>
            )}
          </div>
          <div className="mb-4">
            <Input
              formik={form as any}
              password={true}
              placeholder={t("register.placeholder-password")}
              label={t("register.password")}
              name="password"
            />
          </div>
          <div className="mb-4">
            <Input
              formik={form as any}
              password={true}
              placeholder={t("register.placeholder-confirmPassword")}
              label={t("register.confirmPassword")}
              name="password_confirmation"
            />
          </div>
          <div className="flex items-center mb-4 justify-between">
            <div className="flex items-center">
              <Checkbox
                checked={form.values.remember}
                onCheckedChange={(checked) =>
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
          </div>
          <button
            type="submit"
            disabled={load}
            className={`bg-(--main-color) flex justify-center mb-4 w-full text-white rounded py-2 px-4 hover:bg-(--main-darker-color) transition duration-300 ${
              load ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
          >
            {load ? <BtnLoad size={24} /> : t("register.submit")}
          </button>
        </form>

        <div className="flex gap-2 flex-wrap">
        </div>
        <p className="text-gray-600 text-sm mt-4">
          {t("register.alreadyHaveAccount")}{" "}
          <Link
            href="/login"
            className="text-(--main-color) hover:underline"
          >
            {t("register.loginNow")}
          </Link>
        </p>
      </div>
      <div className="mt-10 pb-2 flex gap-2 items-center">
        <Language form={1} />
      </div>
    </>
  )
}
