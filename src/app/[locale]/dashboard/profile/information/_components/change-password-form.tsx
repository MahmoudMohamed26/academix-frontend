import Input from "@/components/Input";
import ChangePasswordDialog from "./change-password-dialog";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { ChangePasswordFormValues } from "@/lib/types/user";
import * as Yup from "yup";
import { useState } from "react";

export default function ChangePasswordForm() {
  const { t } = useTranslation();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)

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

  const changepassword = useFormik<ChangePasswordFormValues>({
    initialValues: {
      newpassword: "",
      confirmnewpassword: "",
    },
    validationSchema: changePasswordValidationSchema,
    onSubmit: async () => {
      setPasswordDialogOpen(true)
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
    <section>
      <h2 className="text-2xl mb-10 font-semibold">
        {t("Dashboard.profileForm.changePasswordTitle")}
      </h2>
      <div className="max-w-[816px] space-y-4">
        <form>
          <Input
            formik={changepassword as any}
            placeholder={t("Dashboard.profileForm.newPasswordPlaceholder")}
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
  )
}
