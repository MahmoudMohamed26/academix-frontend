"use client"

import Input from "@/components/Input"
import { useFormik } from "formik"
import { useContext, useState } from "react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import "react-calendar/dist/Calendar.css"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  ChangePasswordFormValues,
  Links,
  ProfileFormValues,
} from "@/lib/types/user"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/lib/api/User"
import useAxios from "@/hooks/useAxios"
import Skeleton from "react-loading-skeleton"
import ChangePasswordDialog from "./_components/change-password-dialog"

export default function ProfileForm() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const Axios = useAxios()

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: () => getUser(Axios),
    staleTime: 10 * 60 * 1000,
  })

  const profileValidationSchema = Yup.object({
    name: Yup.string()
      .required(t("Dashboard.profileForm.validation.nameRequired"))
      .min(2, t("Dashboard.profileForm.validation.nameMinLength"))
      .max(30, t("Dashboard.profileForm.validation.nameMaxLength")),
    email: Yup.string()
      .required(t("Dashboard.profileForm.validation.emailRequired"))
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        t("Dashboard.profileForm.validation.emailInvalid")
      ),
    phone: Yup.string().min(
      10,
      t("Dashboard.profileForm.validation.phoneMinLength")
    ),
    dateOfBirth: Yup.date()
      .max(new Date(), t("Dashboard.profileForm.validation.dateOfBirthFuture"))
      .test(
        "age",
        t("Dashboard.profileForm.validation.ageMinimum"),
        function (value) {
          if (!value) return false
          const cutoff = new Date()
          cutoff.setFullYear(cutoff.getFullYear() - 13)
          return value <= cutoff
        }
      ),
  })

  const changePasswordValidationSchema = Yup.object({
    newpassword: Yup.string()
      .required(t("Dashboard.profileForm.validation.newPasswordRequired"))
      .min(8, t("Dashboard.profileForm.validation.passwordMinLength")),
    confirmnewpassword: Yup.string()
      .required(t("Dashboard.profileForm.validation.confirmPasswordRequired"))
      .oneOf(
        [Yup.ref("newpassword")],
        t("Dashboard.profileForm.validation.passwordsNotMatch")
      ),
  })

  const linksValidationSchema = Yup.object({
    website: Yup.string()
      .url(t("Dashboard.profileForm.validation.invalidUrl"))
      .matches(
        /^https?:\/\/.+/,
        t("Dashboard.profileForm.validation.websiteUrlFormat")
      ),
    facebook: Yup.string()
      .url(t("Dashboard.profileForm.validation.invalidUrl"))
      .matches(
        /^https?:\/\/(www\.)?(facebook|fb)\.com\/.+/,
        t("Dashboard.profileForm.validation.facebookUrlFormat")
      ),
    github: Yup.string()
      .url(t("Dashboard.profileForm.validation.invalidUrl"))
      .matches(
        /^https?:\/\/(www\.)?github\.com\/.+/,
        t("Dashboard.profileForm.validation.githubUrlFormat")
      ),
    linkedin: Yup.string()
      .url(t("Dashboard.profileForm.validation.invalidUrl"))
      .matches(
        /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/.+/,
        t("Dashboard.profileForm.validation.linkedinUrlFormat")
      ),
    instagram: Yup.string()
      .url(t("Dashboard.profileForm.validation.invalidUrl"))
      .matches(
        /^https?:\/\/(www\.)?instagram\.com\/.+/,
        t("Dashboard.profileForm.validation.instagramUrlFormat")
      ),
  })

  const form = useFormik<ProfileFormValues>({
    initialValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      dob: undefined,
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      console.log(values)
    },
  })

  const changepassword = useFormik<ChangePasswordFormValues>({
    initialValues: {
      newpassword: "",
      confirmnewpassword: "",
    },
    validationSchema: changePasswordValidationSchema,
    onSubmit: async (values) => {
      // Validation passed, open dialog
      setPasswordDialogOpen(true)
    },
  })

  const links = useFormik<Links>({
    initialValues: {
      website: "",
      facebook: "",
      github: "",
      linkedin: "",
      instagram: "",
    },
    validationSchema: linksValidationSchema,
    onSubmit: async (values) => {
      console.log(values)
    },
  })

  const handleDialogClose = () => {
    setPasswordDialogOpen(false)
  }

  const handlePasswordChangeSuccess = () => {
    changepassword.resetForm()
    setPasswordDialogOpen(false)
  }

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
          <section>
            <h2 className="text-2xl mb-10 font-semibold">
              {t("Dashboard.profileForm.profileInformation")}
            </h2>
            <div className="flex gap-2 md:gap-4 flex-col lg:flex-row mb-4">
              <div className="max-w-[400px] flex-1">
                <Input
                  formik={form as any}
                  placeholder={t(
                    "Dashboard.profileForm.accountTypePlaceholder"
                  )}
                  label={t("Dashboard.profileForm.accountTypeLabel")}
                  name="type"
                  disabled={true}
                  type={user?.role}
                />
              </div>
              <div className="max-w-[400px] flex-1">
                <Input
                  formik={form as any}
                  placeholder={t("Dashboard.profileForm.namePlaceholder")}
                  label={t("Dashboard.profileForm.nameLabel")}
                  name="name"
                />
              </div>
            </div>

            <div className="flex gap-2 md:gap-4 flex-col lg:flex-row mb-4">
              <div className="max-w-[400px] flex-1">
                <label className="text-sm text-gray-700 block mb-3 font-[501]">
                  {t("Dashboard.profileForm.phoneLabel")}
                </label>
                <PhoneInput
                  country={"eg"}
                  value={form.values.phone}
                  onChange={(phone) => form.setFieldValue("phone", phone)}
                  onBlur={() => form.setFieldTouched("phone", true)}
                />
                {form.touched.phone && form.errors.phone && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.errors.phone}
                  </p>
                )}
              </div>
              <div className="max-w-[400px] flex-1">
                <label className="text-sm text-gray-700 font-[501] block mb-3">
                  {t("Dashboard.profileForm.dateOfBirthLabel")}
                </label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-full justify-between font-normal h-[38px]"
                      onBlur={() => form.setFieldTouched("dob", true)}
                    >
                      {form.values.dob
                        ? form.values.dob.toLocaleDateString()
                        : t("Dashboard.profileForm.selectDate")}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={form.values.dob}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        form.setFieldValue("dateOfBirth", date)
                        setOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {form.touched.dob && form.errors.dob && (
                  <p className="text-xs text-red-500 mt-1">
                    {String(form.errors.dob)}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              onClick={form.handleSubmit as any}
              className={`bg-(--main-color) mt-6 cursor-pointer flex justify-center mb-4 text-sm text-white rounded py-2 px-4 hover:bg-(--main-darker-color) transition duration-300`}
            >
              {t("Dashboard.profileForm.saveChanges")}
            </button>
          </section>
          <hr className="my-10" />
          <section>
            <h2 className="text-2xl mb-10 font-semibold">
              {t("Dashboard.profileForm.changePasswordTitle")}
            </h2>
            <div className="max-w-[816px] space-y-4">
              <form>
                <Input
                  formik={changepassword as any}
                  placeholder={t(
                    "Dashboard.profileForm.newPasswordPlaceholder"
                  )}
                  label={t("Dashboard.profileForm.newPasswordLabel")}
                  name="newpassword"
                  password={true}
                />

                <Input
                  formik={changepassword as any}
                  placeholder={t(
                    "Dashboard.profileForm.confirmNewPasswordPlaceholder"
                  )}
                  label={t("Dashboard.profileForm.confirmNewPasswordLabel")}
                  name="confirmnewpassword"
                  password={true}
                />
              </form>
            </div>
            <button
              type="button"
              onClick={changepassword.handleSubmit as any}
              className={`bg-(--main-color) mt-6 cursor-pointer flex justify-center mb-4 text-sm text-white rounded py-2 px-4 hover:bg-(--main-darker-color) transition duration-300`}
            >
              {t("Dashboard.profileForm.changePasswordButton")}
            </button>
            <ChangePasswordDialog
              open={passwordDialogOpen}
              onOpenChange={handleDialogClose}
              newPassword={changepassword.values.newpassword}
              confirmPassword={changepassword.values.confirmnewpassword}
              onSuccess={handlePasswordChangeSuccess}
            />
          </section>
          <hr className="my-10" />
          <section>
            <h2 className="text-2xl mb-10 font-semibold">
              {t("Dashboard.profileForm.links")}
            </h2>
            <div className="max-w-[816px]">
              <Input
                formik={links as any}
                placeholder={t("Dashboard.profileForm.websitePlaceholder")}
                label={t("Dashboard.profileForm.websiteLabel")}
                name="website"
              />
              <Input
                formik={links as any}
                placeholder={t("Dashboard.profileForm.facebookPlaceholder")}
                label={t("Dashboard.profileForm.facebookLabel")}
                name="facebook"
              />
              <Input
                formik={links as any}
                placeholder={t("Dashboard.profileForm.githubPlaceholder")}
                label={t("Dashboard.profileForm.githubLabel")}
                name="github"
              />
              <Input
                formik={links as any}
                placeholder={t("Dashboard.profileForm.linkedinPlaceholder")}
                label={t("Dashboard.profileForm.linkedinLabel")}
                name="linkedin"
              />
              <Input
                formik={links as any}
                placeholder={t("Dashboard.profileForm.instagramPlaceholder")}
                label={t("Dashboard.profileForm.instagramLabel")}
                name="instagram"
              />
            </div>
            <button
              type="submit"
              onClick={links.handleSubmit as any}
              className={`bg-(--main-color) mt-6 cursor-pointer flex justify-center mb-4 text-sm text-white rounded py-2 px-4 hover:bg-(--main-darker-color) transition duration-300`}
            >
              {t("Dashboard.profileForm.saveLinks")}
            </button>
          </section>
        </>
      )}
    </div>
  )
}
