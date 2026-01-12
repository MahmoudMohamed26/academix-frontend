import SpecialHeader from "@/components/SpecialHeader"

export default function MyLearning({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return (
    <div>
      <SpecialHeader name={"My Learning"} />
      
    </div>
  )
}
