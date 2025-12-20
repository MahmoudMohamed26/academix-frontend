export default function SpecialHeader({ name, size }: { name: string, size?: "big" | "small" }) {
  return (
    <h1 className={`font-bold mb-10 ${size === "big" ? "text-4xl" : "text-2xl"} w-fit relative before:absolute before:w-full before:h-0.5 before:bg-[#DDD] before:-bottom-2.5 before:start-0 after:absolute after:bg-(--main-color) after:w-[40%] after:-bottom-2.5 after:start-0 after:h-[3px]`}>
      {name}
    </h1>
  )
}
