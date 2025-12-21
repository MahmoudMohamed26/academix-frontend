"use client"

import { useTranslation } from "react-i18next"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import useAxios from "@/hooks/useAxios"

export default function SearchInput() {
  const { t } = useTranslation()
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [moreThanFive, setMoreThanFive] = useState(false)
  const [loading, setLoading] = useState(false)
  const Axios = useAxios()


  const searchFn = async (search: string) => {
    try{
      setLoading(true);
      const res = await Axios.get(`/courses?search=${search}`)
      let filteredResults = res.data.data.courses;
      if(res.data.data.courses.length > 5 ){
        filteredResults = res.data.data.courses.slice(0,5)
        setMoreThanFive(true);
      }
      setSearchResults(filteredResults)
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false);
    }
  }

  console.log(searchResults)


  useEffect(() => {
    const debounce = setTimeout(() => {
      if(search.trim()){
        searchFn(search)
      }
    }, 1000)
    return () => clearTimeout(debounce)
  } , [search])

  return (
    <>
      <div className="relative w-fit flex-1 rounded-sm">
        <input
          type="text"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("DashNavbar.searchPlaceholder")}
          className="border focus:border-(--main-color) text-gray-700 duration-300 text-sm py-2 border-[#e2e6f1] my-0 pe-[63px] xl:pe-[115px] rounded-sm outline-none p-2 xl:w-[500px] md:w-[250px] w-full"
        />
        <Link
          href={`/courses?search=${search}`}
          className={`flex px-5 absolute end-0 -translate-y-1/2 top-1/2 h-full bg-(--main-color) hover:bg-(--main-darker-color) text-white`}
        >
          <div className="flex gap-1 items-center justify-center">
            <p className="hidden xl:block">{t("DashNavbar.search")}</p>
            <Search size={15} />
          </div>
        </Link>
        <span className="absolute w-0 h-0 border-10 border-t-transparent border-r-transparent border-l-transparent border-b-gray-50 -bottom-4 start-10"></span>
        <div className="shadow-sm bg-gray-50 w-[800px] absolute -bottom-14 h-10 start-0 rounded-sm">

        </div>
      </div>
    </>
  )
}
