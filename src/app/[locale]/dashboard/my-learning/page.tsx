import SpecialHeader from "@/components/SpecialHeader"
import MyLearningClient from "./_components/my-learning-client"

export default function MyLearning({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return (
    <div>
      <SpecialHeader name={"My Learning"} />
      <MyLearningClient />
    </div>
  )
}
