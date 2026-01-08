import Stats from "./_components/stats"
import SwipperSlider from "./_components/swiper"
import type { Metadata } from "next"
import WhyUs from "./_components/why-us"
import FeaturedCourses from "./_components/featured-courses"
import { getServerAxios } from "@/lib/axios-server"
import { QueryClient } from "@tanstack/react-query"
import { getFilterdCourses } from "@/lib/api/Courses"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
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

export default async function home({params}: {params: Promise<{locale: string}>}) {

  const { locale } = await params
  const axiosInstance = await getServerAxios(locale)
  const queryClient = new QueryClient()

  const courseRes = await queryClient.fetchQuery({
    queryKey: ["featured-courses"],
    queryFn: () => getFilterdCourses(axiosInstance, "/courses/filter?sortBy=rating_avg&orderedBy=desc")
  })
  console.log(courseRes);

  return (
    <div className="min-h-[8000px]">
      <section className="container">
        <SwipperSlider />
      </section>

      <section>
        <Stats />
      </section>

      <section className="py-30">
        <WhyUs />
      </section>

      <section className="pb-30">
        <FeaturedCourses courses={courseRes.courses} />
      </section>
    </div>
  )
}
