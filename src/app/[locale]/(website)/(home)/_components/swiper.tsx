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
            <Link href={"/shop"}>
              <img src={swiper1.src} alt="img1" />
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link href={"/shop"}>
              <img src={swiper2.src} alt="img2" />
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link href={"/shop"}>
              <img src={swiper3.src} alt="img3" />
            </Link>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  )
}
