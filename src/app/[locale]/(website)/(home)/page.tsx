import SwipperSlider from "./_components/swiper"
import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

export async function generateMetadata({ params }: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === "ar"

  return {
    title: isArabic
      ? "أكاديمكس | تعلم المهارات من خبراء المجال"
      : "Academix | Learn Skills from Expert Instructors",

    description: isArabic
      ? "أكاديمكس منصة تعليمية حديثة تقدم دورات احترافية."
      : "Academix is a modern learning platform offering expert-led courses.",

    openGraph: {
      url: `${siteUrl}/${locale}`,
      siteName: "Academix",
      images: [
        {
          url: `${siteUrl}/og/home.png`,
          width: 1200,
          height: 630,
          alt: "Academix LMS Platform",
        },
      ],
      locale: isArabic ? "ar_AR" : "en_US",
      type: "website",
    },

    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        ar: `${siteUrl}/ar`,
      },
    },
  }
}

export default function home() {
  console.log(siteUrl)
  return (
    <>
      <section className="container">
        <SwipperSlider />
      </section>
    </>
  )
}
