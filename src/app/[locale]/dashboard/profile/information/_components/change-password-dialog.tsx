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
  const [otpLoading, setOtpLoading] = useState(false)
  const [otp, setOtp] = useState("")

  const requestOTP = async () => {
    setIsLoading(true)
    try {
      await Axios.post("/profile/reset-password")
      toast.success(
        t("Dashboard.profileForm.otpSentToEmail") ||
          "We sent an OTP to your email"
      )
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
      toast.error(
        t("Dashboard.profileForm.otpRequired") || "Please enter the OTP code"
      )
      return
    }

    setOtpLoading(true)
    try {
      await Axios.put("/profile/update-password", {
        otp: otp,
        password: newPassword,
        password_confirmation: confirmPassword,
      })
      toast.success(
        t("Dashboard.profileForm.passwordChanged") ||
          "Password changed successfully!"
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
      setOtpLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setOtp("")
    setStep("request")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[500px] **:data-dialog-close:hidden"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl text-center">
            {t("Dashboard.profileForm.changePassword")}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === "request"
              ? t("Dashboard.profileForm.requestOtpDescription") ||
                "Click the button below to receive an OTP code via email"
              : t("Dashboard.profileForm.enterOtpDescription") ||
                "Enter the OTP code sent to your email"}
          </DialogDescription>
        </DialogHeader>

        {step === "request" ? (
          <div className="flex flex-col gap-4 pt-4">
            <button
              className={`bg-(--main-color) cursor-pointer flex justify-center text-sm text-white rounded py-2 px-4 hover:bg-(--main-darker-color) transition duration-300`}
              onClick={requestOTP}
              disabled={isLoading}
            >
              {isLoading ? (
                <BtnLoad size={20} />
              ) : (
                t("Dashboard.profileForm.requestOtp")
              )}
            </button>
            <Button
              type="button"
              className="rounded-sm cursor-pointer"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              {t("Dashboard.profileForm.cancel") || "Cancel"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            <div className="flex flex-col gap-2">
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

            <div className="flex flex-col gap-2 justify-end pt-4 text-sm">
              <p className="text-muted-foreground">
                {t("Dashboard.profileForm.didntReceive")}{" "}
                <button
                  className="cursor-pointer hover:underline text-(--main-color)"
                  onClick={requestOTP}
                >
                  {isLoading
                    ? t("Dashboard.profileForm.sending")
                    : t("Dashboard.profileForm.resend")}
                </button>
              </p>
              <button
                className={`bg-(--main-color) cursor-pointer flex justify-center text-sm text-white rounded py-2 px-4 hover:bg-(--main-darker-color) transition duration-300`}
                type="button"
                onClick={handleSubmit}
                disabled={otpLoading}
              >
                {otpLoading ? (
                  <BtnLoad size={20} />
                ) : (
                  t("Dashboard.profileForm.changePasswordButton") ||
                  "Change Password"
                )}
              </button>
              <Button
                type="button"
                className="rounded-sm cursor-pointer"
                variant="outline"
                onClick={handleClose}
                disabled={otpLoading}
              >
                {t("Dashboard.profileForm.cancel") || "Cancel"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
