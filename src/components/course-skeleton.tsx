import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export default function CourseSkeleton({ grid }: { grid: boolean }) {
  return (
    <div className="border flex flex-col relative rounded-md">
      <div className={`p-4 ${!grid ? "lg:flex lg:flex-row lg:gap-10" : ""} flex-1 flex flex-col`}>
        <div
          className={`rounded-md overflow-hidden ${
            !grid ? "w-full lg:w-[500px]" : ""
          } relative h-[250px]`}
        >
          <Skeleton className="w-full h-full" />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="mt-2 relative">
            <Skeleton className="w-[60%]!" height={20} />
            <Skeleton className="w-[80%]!" height={10} />
            <Skeleton className="w-[50%]!" height={10} />
            <Skeleton className="w-[90%]!" height={10} />
            
            <p className="text-xs mt-2 text-[#666]"></p>
          </div>
          <div className={`${grid ? "mt-auto" : "mt-auto"}`}>
            <div className="flex gap-2 flex-wrap mt-8 text-[#333]">
              <Skeleton width={70} height={20} />
              <Skeleton width={50} height={20} />
              <Skeleton width={70} height={20} />
              <Skeleton width={40} height={20} />
              <Skeleton width={80} height={20} />
              <Skeleton width={30} height={20} />
            </div>
            <div className="mt-4 flex justify-between flex-wrap items-center">
              <Skeleton width={100} height={40} />
              <Skeleton width={150} height={35} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
