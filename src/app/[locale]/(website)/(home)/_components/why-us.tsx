import SpecialHeader from "@/components/SpecialHeader"
import {
  BadgeCheck,
  Globe,
  Layers,
  Loader,
  ScanEye,
  UserCheck,
} from "lucide-react"

export default function WhyUs() {
  return (
    <div className="container">
        <SpecialHeader size="big" name="Why join Academix ?" />
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <div className="item mt-10">
            <div className="flex gap-4">
              <div>
                <Layers size={30} />
              </div>
              <div>
                <h6 className="font-semibold text-[#333]">
                  Structured Learning
                </h6>
                <p className="text-[#666]">
                  Carefully organized courses with sections, lessons, and
                  quizzes to keep learning focused and effective.
                </p>
              </div>
            </div>
          </div>

          <div className="item mt-10">
            <div className="flex gap-4">
              <div>
                <UserCheck size={30} />
              </div>
              <div>
                <h6 className="font-semibold text-[#333]">
                  Expert Instructors
                </h6>
                <p className="text-[#666]">
                  Learn from instructors with real-world experience, not just
                  theory.
                </p>
              </div>
            </div>
          </div>

          <div className="item mt-10">
            <div className="flex gap-4">
              <div>
                <ScanEye size={30} />
              </div>
              <div>
                <h6 className="font-semibold text-[#333]">
                  Learn at Your Pace
                </h6>
                <p className="text-[#666]">
                  Access content anytime, anywhere, and learn on your own
                  schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="item mt-10">
            <div className="flex gap-4">
              <div>
                <Globe size={30} />
              </div>
              <div>
                <h6 className="font-semibold text-[#333]">
                  Multilingual Experience
                </h6>
                <p className="text-[#666]">
                  Full support for English and Arabic with a seamless
                  experience.
                </p>
              </div>
            </div>
          </div>

          <div className="item mt-10">
            <div className="flex gap-4">
              <div>
                <Loader size={30} />
              </div>
              <div>
                <h6 className="font-semibold text-[#333]">
                  Track Your Progress
                </h6>
                <p className="text-[#666]">
                  Stay motivated with clear progress tracking across lessons and
                  courses.
                </p>
              </div>
            </div>
          </div>

          <div className="item mt-10">
            <div className="flex gap-4">
              <div>
                <BadgeCheck size={30} />
              </div>
              <div>
                <h6 className="font-semibold text-[#333]">Verified Content</h6>
                <p className="text-[#666]">
                  Courses are reviewed and approved to ensure quality and
                  accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
