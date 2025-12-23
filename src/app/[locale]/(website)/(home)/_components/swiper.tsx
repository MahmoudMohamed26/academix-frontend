"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/scrollbar"
import Link from "next/link"
import swiper1 from "@/assets/swiper1.png"
import swiper2 from "@/assets/swiper2.png"
import swiper3 from "@/assets/swiper3.png"

export default function SwipperSlider() {
  return (
    <>
      <div className="mainSwiper mt-5">
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
        >
          <SwiperSlide>
            <Link href={"/courses"}>
              <img src={swiper1.src} alt="academix master new skill" loading="lazy" />
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link href={"/courses"}>
              <img src={swiper2.src} alt="academix unlock your potential" loading="lazy" />
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link href={"/courses"}>
              <img src={swiper3.src} alt="academix master community" loading="lazy" />
            </Link>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  )
}
