import Input from "@/components/Input"
import { useTranslation } from "react-i18next"
import * as Yup from "yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ProfileFormValues, User } from "@/lib/types/user"
import useAxios from "@/hooks/useAxios"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useFormik } from "formik"
import PhoneInput from "react-phone-input-2"
import BtnLoad from "@/components/BtnLoad"

function formatDateToDDMMYYYY(
  date: Date | undefined | null
): string | undefined {
  if (!date) return undefined
  const d = date.getDate().toString().padStart(2, "0")
  const m = (date.getMonth() + 1).toString().padStart(2, "0")
  const y = date.getFullYear().toString()
  return `${y}-${m}-${d}`
}

function parseDobFromBackend(
  dob: string | number | null | undefined
): Date | undefined {
  if (!dob) return undefined

  if (typeof dob === "number") {
    return new Date(dob)
  }

  const [d, m, y] = dob.split("-").map(Number)
  if (!d || !m || !y) return undefined
  return new Date(y, m - 1, d)
}

export default function ProfileInforForm({ user }: { user?: User }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const Axios = useAxios()

  const profileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const payload = {
        ...values,
        dob: formatDateToDDMMYYYY(values.dob as any),
      }

      const response = await Axios.patch("/profile", payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loggedInUser"] })
      toast.success(t("Dashboard.profileForm.profileSaved"))
    },
    onError: () => {
      toast.error(t("Dashboard.profileForm.profileSaveFailed"))
    },
  })

  const profileValidationSchema = Yup.object({
    name: Yup.string()
      .required(t("Dashboard.profileForm.validation.nameRequired"))
      .min(2, t("Dashboard.profileForm.validation.nameMinLength"))
      .max(30, t("Dashboard.profileForm.validation.nameMaxLength")),
  })

  const form = useFormik<ProfileFormValues>({
    initialValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      dob: parseDobFromBackend(user?.dob as any),
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      profileMutation.mutate(values)
    },
  })

  return (
    <section>
      <h2 className="text-2xl mb-10 font-semibold">
        {t("Dashboard.profileForm.profileInformation")}
      </h2>

      <div className="flex gap-2 md:gap-4 flex-col lg:flex-row mb-4">
        <div className="max-w-[400px] flex-1">
          <Input
            formik={form as any}
            placeholder={t("Dashboard.profileForm.accountTypePlaceholder")}
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
            <p className="text-xs text-red-500 mt-1">{form.errors.phone}</p>
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
                  ? (form.values.dob as any as Date).toLocaleDateString()
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
                selected={form.values.dob as any}
                captionLayout="dropdown"
                onSelect={(date) => {
                  form.setFieldValue("dob", date)
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
        className={`bg-(--main-color) flex justify-center my-4 text-sm text-white rounded py-2 px-4 hover:bg-(--main-darker-color) transition duration-300 ${
          profileMutation.isPending
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }`}
        disabled={profileMutation.isPending}
      >
        {profileMutation.isPending ? (
          <BtnLoad size={20} />
        ) : (
          t("Dashboard.profileForm.saveChanges")
        )}
      </button>
    </section>
  )
}
