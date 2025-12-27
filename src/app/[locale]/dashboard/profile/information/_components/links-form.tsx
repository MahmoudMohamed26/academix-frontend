import * as Yup from "yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Links, User } from "@/lib/types/user"
import { useTranslation } from "react-i18next"
import { Axios } from "axios"
import useAxios from "@/hooks/useAxios"
import { toast } from "sonner"
import { useFormik } from "formik"
import Input from "@/components/Input"
import BtnLoad from "@/components/BtnLoad"

export default function LinksForm({ user }: { user?: User }) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const Axios = useAxios()

  const linksMutation = useMutation({
    mutationFn: async (values: Links) => {
      const response = await Axios.patch("/profile/links", values)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loggedInUser"] })
      toast.success(t("Dashboard.profileForm.linksSaved"))
    },
    onError: () => {
      toast.error(t("Dashboard.profileForm.linksSaveFailed"))
    },
  })

  const linksValidationSchema = Yup.object({
    links: Yup.object({
      personalSite: Yup.string()
        .url(t("Dashboard.profileForm.validation.invalidUrl"))
        .matches(
          /^https?:\/\/.+/,
          t("Dashboard.profileForm.validation.websiteUrlFormat")
        )
        .nullable()
        .notRequired(),

      facebook: Yup.string()
        .url(t("Dashboard.profileForm.validation.invalidUrl"))
        .matches(
          /^https?:\/\/(www\.)?(facebook|fb)\.com\/.+/,
          t("Dashboard.profileForm.validation.facebookUrlFormat")
        )
        .nullable()
        .notRequired(),

      github: Yup.string()
        .url(t("Dashboard.profileForm.validation.invalidUrl"))
        .matches(
          /^https?:\/\/(www\.)?github\.com\/.+/,
          t("Dashboard.profileForm.validation.githubUrlFormat")
        )
        .nullable()
        .notRequired(),

      linkedin: Yup.string()
        .url(t("Dashboard.profileForm.validation.invalidUrl"))
        .matches(
          /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/.+/,
          t("Dashboard.profileForm.validation.linkedinUrlFormat")
        )
        .nullable()
        .notRequired(),

      instagram: Yup.string()
        .url(t("Dashboard.profileForm.validation.invalidUrl"))
        .matches(
          /^https?:\/\/(www\.)?instagram\.com\/.+/,
          t("Dashboard.profileForm.validation.instagramUrlFormat")
        )
        .nullable()
        .notRequired(),
    }),
  })

  const links = useFormik<Links>({
    initialValues: {
      links: {
        personalSite: user?.links?.personalSite || "",
        facebook: user?.links?.facebook || "",
        github: user?.links?.github || "",
        linkedin: user?.links?.linkedin || "",
        instagram: user?.links?.instagram || "",
      },
    },
    validationSchema: linksValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      linksMutation.mutate(values)
    },
  })

  return (
    <section>
      <h2 className="text-2xl mb-10 font-semibold">
        {t("Dashboard.profileForm.links")}
      </h2>
      <div className="max-w-[816px]">
        <Input
          formik={links as any}
          placeholder={t("Dashboard.profileForm.websitePlaceholder")}
          label={t("Dashboard.profileForm.websiteLabel")}
          name="links.personalSite"
        />
        <Input
          formik={links as any}
          placeholder={t("Dashboard.profileForm.facebookPlaceholder")}
          label={t("Dashboard.profileForm.facebookLabel")}
          name="links.facebook"
        />
        <Input
          formik={links as any}
          placeholder={t("Dashboard.profileForm.githubPlaceholder")}
          label={t("Dashboard.profileForm.githubLabel")}
          name="links.github"
        />
        <Input
          formik={links as any}
          placeholder={t("Dashboard.profileForm.linkedinPlaceholder")}
          label={t("Dashboard.profileForm.linkedinLabel")}
          name="links.linkedin"
        />
        <Input
          formik={links as any}
          placeholder={t("Dashboard.profileForm.instagramPlaceholder")}
          label={t("Dashboard.profileForm.instagramLabel")}
          name="links.instagram"
        />
      </div>
      <button
        type="submit"
        onClick={links.handleSubmit as any}
        className={`bg-(--main-color) flex justify-center my-4 text-sm text-white rounded py-2 px-4 hover:bg-(--main-darker-color) transition duration-300 ${
          linksMutation.isPending
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }`}
      >
        {linksMutation.isPending ? (
          <BtnLoad size={20} />
        ) : (
          t("Dashboard.profileForm.saveLinks")
        )}
      </button>
    </section>
  )
}
