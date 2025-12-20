"use client"

import Breadcrumb from "@/components/BreadCrumb"
import SingleCourse from "@/components/SingleCourse"
import SpecialHeader from "@/components/SpecialHeader"
import { LayoutGrid, List } from "lucide-react"
import { useState } from "react"

export default function courses() {
  const [grid, setGrid] = useState<boolean>(true)
  return (
    <div className="container">
      <Breadcrumb />
      <SpecialHeader name="Courses" size="big" />
      <div className="border rounded-sm flex items-center mb-5 p-1">
        <button onClick={() => setGrid((prev) => !prev)}>
          {grid ? (
            <LayoutGrid
              className="text-(--main-color) hover:bg-gray-50 cursor-pointer p-2 rounded-sm"
              size={35}
            />
          ) : (
            <List
              className="text-(--main-color) hover:bg-gray-50 cursor-pointer p-2 rounded-sm"
              size={35}
            />
          )}
        </button>
      </div>
      <div className={`${grid ? "special-grid" : "block space-y-5"}`}>
        <SingleCourse grid={grid} />
        <SingleCourse grid={grid} />
        <SingleCourse grid={grid} />
        <SingleCourse grid={grid} />
        <SingleCourse grid={grid} />
      </div>
    </div>
  )
}
