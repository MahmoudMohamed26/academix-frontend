import becomeInstructorImage from "@/assets/become-instructor.png"
import studentImage from "@/assets/student.png"
import Image from "next/image"
import Link from "next/link"

export default function BecomeInstructor() {
  return (
    <div className="container flex flex-col lg:flex-row gap-10">
      <div className="bg-blue-50 lg:w-[calc(100%/2)] rounded-md p-10!">
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row justify-between items-center gap-10">
          <div>
            <h6 className="font-semibold text-blue-500 mb-2 text-3xl">
              Learn Without Limits
            </h6>
            <p className="text-[#666]">
              Access high-quality courses from expert instructors and learn at
              your own pace, anytime and anywhere.
            </p>
            <Link
              className="block duration-300 hover:bg-blue-600 w-fit mt-10 font-semibold text-white bg-blue-500 rounded-sm py-2 px-4"
              href={`/courses`}
            >
              Start Learning
            </Link>
          </div>
          <div>
            <Image
              width={300}
              alt="become instructor image"
              src={studentImage}
            />
          </div>
        </div>
      </div>

      <div className="bg-orange-50 lg:w-[calc(100%/2)] rounded-md p-10!">
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row justify-between items-center gap-10">
          <div>
            <h6 className="font-semibold text-(--main-color) mb-2 text-3xl">
              Become An Instructor
            </h6>
            <p className="text-[#666]">
              Top instructors from around the world teach millions of students
              on Academix.
            </p>
            <Link
              className="block duration-300 hover:bg-(--main-darker-color) w-fit mt-10 font-semibold text-white bg-(--main-color) rounded-sm py-2 px-4"
              href={`/`}
            >
              Start Teaching today
            </Link>
          </div>
          <div>
            <Image
              width={300}
              alt="become instructor image"
              src={becomeInstructorImage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
