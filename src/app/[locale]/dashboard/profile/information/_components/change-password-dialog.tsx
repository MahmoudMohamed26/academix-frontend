"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import useAxios from "@/hooks/useAxios"
import { toast } from "sonner"
import BtnLoad from "@/components/BtnLoad"

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newPassword: string
  confirmPassword: string
  onSuccess?: () => void
}

export default function ChangePasswordDialog({
  open,
  onOpenChange,
  newPassword,
  confirmPassword,
  onSuccess,
}: ChangePasswordDialogProps) {
  const { t } = useTranslation()
  const Axios = useAxios()
  const [step, setStep] = useState<"request" | "verify">("request")
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState("")

  const requestOTP = async () => {
    setIsLoading(true)
    try {
      await Axios.post("/profile/reset-password")
      toast.success(t("Dashboard.profileForm.otpSentToEmail") || "We sent an OTP to your email")
      setStep("verify")
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          t("Dashboard.profileForm.otpRequestFailed") ||
          "Failed to send OTP. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!otp || otp.length < 6) {
      toast.error(t("Dashboard.profileForm.otpRequired") || "Please enter the OTP code")
      return
    }

    setIsLoading(true)
    try {
      await Axios.put("/profile/update-password", {
        otp: otp,
        password: newPassword,
        password_confirmation: confirmPassword,
      })
      toast.success(
        t("Dashboard.profileForm.passwordChanged") || "Password changed successfully!"
      )
      handleClose()
      onSuccess?.()
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          t("Dashboard.profileForm.passwordChangeFailed") ||
          "Failed to change password. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setOtp("")
    setStep("request")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("Dashboard.profileForm.changePassword")}</DialogTitle>
          <DialogDescription>
            {step === "request"
              ? t("Dashboard.profileForm.requestOtpDescription") ||
                "Click the button below to receive an OTP code via email"
              : t("Dashboard.profileForm.enterOtpDescription") ||
                "Enter the OTP code sent to your email"}
          </DialogDescription>
        </DialogHeader>

        {step === "request" ? (
          <div className="flex flex-col gap-4 pt-4">
            <button className={`bg-(--main-color) cursor-pointer flex justify-center text-sm text-white rounded py-2 px-4 hover:bg-(--main-darker-color) transition duration-300`} onClick={requestOTP} disabled={isLoading}>
              {isLoading
                ? <BtnLoad size={20} />
                : t("Dashboard.profileForm.requestOtp")}
            </button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {t("Dashboard.profileForm.otpCode") || "OTP Code"}
              </label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                className="rounded-sm cursor-pointer"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                {t("Dashboard.profileForm.cancel") || "Cancel"}
              </Button>
              <button className={`bg-(--main-color) cursor-pointer flex justify-center text-sm text-white rounded py-2 px-4 hover:bg-(--main-darker-color) transition duration-300`} type="button" onClick={handleSubmit} disabled={isLoading}>
                {isLoading
                  ? t("Dashboard.profileForm.changing") || "Changing..."
                  : t("Dashboard.profileForm.changePasswordButton") || "Change Password"}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}