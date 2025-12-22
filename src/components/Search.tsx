"use client"

import { useTranslation } from "react-i18next"
import { Search, Star } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import useAxios from "@/hooks/useAxios"
import Image from "next/image"
import type { Course } from "@/lib/types/course"
import { truncateText } from "@/helpers/word-cut"
import BtnLoad from "./BtnLoad"

export default function SearchInput({open, setOpen}: {open: boolean, setOpen: (open: boolean) => void}) {
  const { t } = useTranslation()
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [moreThanFive, setMoreThanFive] = useState(false)
  const [loading, setLoading] = useState(false)
  const Axios = useAxios()

  const searchFn = async (search: string) => {
    try {
      setMoreThanFive(false)
      const res = await Axios.get(`/courses/filter?search=${search}`)
      let filteredResults = res.data.data.courses
      if (res.data.data.courses.length > 5) {
        filteredResults = res.data.data.courses.slice(0, 5)
        setMoreThanFive(true)
      }
      setSearchResults(filteredResults)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (search.trim()) {
      setLoading(true)
    }
    const debounce = setTimeout(() => {
      if (search.trim()) {
        searchFn(search)
      }
    }, 1000)
    return () => clearTimeout(debounce)
  }, [search])

  const showSearchResults = searchResults.map((el: Course, index: number) => (
    <Link
      href={`/course/${el.id}`}
      key={index}
      onClick={() => setOpen(false)}
      className="flex hover:bg-gray-100 gap-6 rounded-sm justify-between py-2 px-4"
    >
      <div className="flex gap-2">
        <div
          className={`rounded-sm overflow-hidden w-[150px] relative h-[75px]`}
        >
          <Image
            src={el.image}
            fill
            alt={el.title}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            loading="eager"
            unoptimized
          />
        </div>
        <div className="flex-1">
          <h6 className="font-semibold">{el.title}</h6>
          <p className="text-sm text-[#666]">
            {truncateText(el.short_description, 100)}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end min-w-[100px]">
        <div className="flex gap-1 items-center">
          <Star fill="#C67514" color="#C67514" size={12} />
          <span className="text-sm text-[#666]">{el.rating_avg}</span>
        </div>
        <p className="text-sm text-[#666]">Reviews ({el.rating_counts})</p>
        <p className="text-sm text-[#666]">Hours {el.hours}</p>
      </div>
    </Link>
  ))

  return (
    <>
      {open && <div onClick={() => setOpen(false)} className="fixed z-10 w-full h-screen start-0 top-0 bg-transparent"></div>}
      <div className="relative w-fit flex-1 rounded-sm">
        <input
          type="text"
          name="search"
          value={search}
          onFocus={() => {
            if(search.trim()){
              setOpen(true)
            }
          }}
          onBlur={() => setOpen(false)}
          onChange={(e) => {
            setSearch(e.target.value)
            if (e.target.value.trim()) {
              setOpen(true)
            }
          }}
          placeholder={t("search.searchPlaceholder")}
          className="border focus:border-(--main-color) text-gray-700 duration-300 text-sm py-2 border-[#e2e6f1] my-0 pe-[63px] xl:pe-[115px] rounded-sm outline-none p-2 xl:w-[500px] md:w-[250px] w-full"
        />
        <Link
          href={`/courses?search=${search}`}
          className={`flex px-5 absolute rounded-e-md duration-300 end-0 -translate-y-1/2 top-1/2 h-full bg-(--main-color) hover:bg-(--main-darker-color) text-white`}
        >
          <div className="flex gap-1 items-center justify-center">
            <p className="hidden xl:block">{t("search.search")}</p>
            <Search size={15} />
          </div>
        </Link>
        <span className="absolute w-0 h-0 border-10 border-t-transparent border-r-transparent border-l-transparent border-b-gray-50 -bottom-4 start-10"></span>
        {open && (
          <div 
            className="shadow-lg bg-gray-50 w-[800px] absolute top-[54px] z-999 start-0 rounded-sm"
            onMouseDown={(e) => e.preventDefault()}
          >
            {!loading && showSearchResults}
            {loading && (
              <div className="py-4 flex justify-center">
                <BtnLoad color="main" size={30} />
              </div>
            )}
            {moreThanFive && !loading && (
              <Link
                href={`/courses?search=${search}`}
                onClick={() => setOpen(false)}
                className="block text-center text-sm font-semibold text-white bg-(--main-color) py-2 hover:bg-(--main-darker-color) duration-300 rounded-sm"
              >
                {t("search.seeAllResults")}
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  )
}