import Image from "next/image"
import courseImage from "@/assets/courseImage.webp"
import Link from "next/link"
import { Star } from "lucide-react"

export default function SingleCourse({ grid }: { grid: boolean }) {
  return (
    <Link href={"/course"} className="border block hover:bg-gray-50 rounded-md">
      <div className={`p-4 ${!grid && "flex"} gap-10`}>
        <div
          className={`rounded-md overflow-hidden ${
            !grid && "w-full lg:w-[500px]"
          } relative h-[250px]`}
        >
          <Image
            src={courseImage}
            fill
            alt="Course preview"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            loading="eager"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mt-2 text-xl">
            The complete Fullstack course
          </h3>
          <p className="text-sm text-[#666] mt-2">
            Become a Full-Stack Web Developer with just ONE course. HTML, CSS,
            Javascript, Node, React, PostgreSQL, Web3 and DApps Bestseller
          </p>
          <p className="text-xs mt-2 text-[#666]">Jonas Schmedtmann</p>
          <div className="flex gap-2 flex-wrap mt-8 text-[#333]">
            <span className="border rounded-sm py-1 px-2 flex gap-1 items-center text-xs">
              Web Development
            </span>
            <span className="border rounded-sm py-1 px-2 flex gap-1 items-center text-xs">
              <Star fill="#C67514" color="#C67514" size={12} />
              4.8
            </span>
            <span className="border rounded-sm py-1 px-2 flex gap-1 items-center text-xs">
              Reviews (117,88)
            </span>
            <span className="border rounded-sm py-1 px-2 flex gap-1 items-center text-xs">
              Total hours 120
            </span>
            <span className="border rounded-sm py-1 px-2 flex gap-1 items-center text-xs">
              331 Lectures
            </span>
            <span className="border rounded-sm py-1 px-2 flex gap-1 items-center text-xs">
              Advanced
            </span>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-3xl font-bold">$120</p>
            <button className="bg-(--main-color) py-2 px-4 text-white text-sm rounded-md cursor-pointer duration-300 hover:bg-transparent border border-(--main-color) hover:text-(--main-color)">
              Enroll now
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
