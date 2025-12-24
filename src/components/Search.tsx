"use client"

import { useTranslation } from "react-i18next"
import { Search, Star } from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import useAxios from "@/hooks/useAxios"
import Image from "next/image"
import type { Course } from "@/lib/types/course"
import { truncateText } from "@/helpers/word-cut"
import BtnLoad from "./BtnLoad"

export default function SearchInput({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const { t } = useTranslation()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState<Course[]>([])
  const [moreThanFive, setMoreThanFive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const Axios = useAxios()

  function useWordLimit() {
    const [limit, setLimit] = useState(30)

    useEffect(() => {
      const updateLimit = () => {
        const width = window.innerWidth

        if (width >= 1024) setLimit(100)
        else if (width >= 768) setLimit(50)
        else setLimit(30)
      }

      updateLimit()
      window.addEventListener("resize", updateLimit)

      return () => window.removeEventListener("resize", updateLimit)
    }, [])

    return limit
  }

  const wordLimit = useWordLimit()

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLAnchorElement[]>([])

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
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (search.trim()) {
      setLoading(true)
    } else {
      setSearchResults([])
      setOpen(false)
    }
    const debounce = setTimeout(() => {
      if (search.trim()) {
        searchFn(search)
      }
    }, 1000)
    return () => clearTimeout(debounce)
  }, [search])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setOpen(false)
        setSelectedIndex(-1)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || searchResults.length === 0) {
      if (e.key === "Enter" && search.trim()) {
        e.preventDefault()
        router.push(`/courses?search=${encodeURIComponent(search)}`)
        setOpen(false)
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < searchResults.length ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          const selectedCourse = searchResults[selectedIndex]
          router.push(`/course/${selectedCourse.id}`)
          setOpen(false)
        } else if (selectedIndex === searchResults.length && moreThanFive) {
          router.push(`/courses?search=${encodeURIComponent(search)}`)
          setOpen(false)
        } else if (search.trim()) {
          router.push(`/courses?search=${encodeURIComponent(search)}`)
          setOpen(false)
        }
        break
      case "Escape":
        e.preventDefault()
        setOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current[selectedIndex]) {
      resultsRef.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      })
    }
  }, [selectedIndex])

  const handleResultClick = (courseId: string) => {
    setOpen(false)
    setSelectedIndex(-1)
    router.push(`/courses/course-details/${courseId}`)
  }

  const showSearchResults = searchResults.map((el: Course, index: number) => (
    <Link
      href={`/courses/course-details/${el.id}`}
      key={el.id}
      tabIndex={0}
      ref={(el) => {
        if (el) resultsRef.current[index] = el
      }}
      onClick={(e) => {
        e.preventDefault()
        handleResultClick(el.id)
      }}
      onMouseEnter={() => setSelectedIndex(index)}
      className={`flex gap-6 bg-white border-b justify-between py-2 px-4 cursor-pointer ${
        selectedIndex === index ? "bg-gray-100!" : "hover:bg-gray-100"
      }`}
      role="option"
      aria-selected={selectedIndex === index}
    >
      <div className="flex gap-2">
        <div className="rounded-sm overflow-hidden w-20 h-10 lg:w-[150px] relative lg:h-[75px]">
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
          <h6 className="font-semibold">{truncateText(el.title, wordLimit)}</h6>
          <p className="text-sm text-[#666]">
            {truncateText(el.short_description, wordLimit)}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end min-w-[100px]">
        <div className="flex gap-1 items-center">
          <Star fill="#C67514" color="#C67514" size={12} aria-hidden="true" />
          <span className="text-sm text-[#666]">{el.rating_avg}</span>
        </div>
        <p className="text-sm text-[#666]">
          {t("search.reviews")} {el.rating_counts}
        </p>
        <p className="text-sm text-[#666]">
          {t("search.hours")} {el.hours}
        </p>
      </div>
    </Link>
  ))

  return (
    <div className="relative w-fit flex-1 rounded-sm">
      <div className="relative">
        <label htmlFor="course-search" className="sr-only">
          {t("search.searchPlaceholder")}
        </label>
        <input
          ref={inputRef}
          type="text"
          id="course-search"
          name="search"
          value={search}
          onFocus={() => {
            if (search.trim() && searchResults.length > 0) {
              setOpen(true)
            }
          }}
          onChange={(e) => {
            setSearch(e.target.value)
            if (e.target.value.trim()) {
              setOpen(true)
            }
            setSelectedIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          placeholder={t("search.searchPlaceholder")}
          className="border focus:border-(--main-color) text-gray-700 duration-300 text-sm py-2 border-[#e2e6f1] my-0 pe-[63px] xl:pe-[115px] rounded-sm outline-none p-2 w-full"
          role="combobox"
          aria-expanded={open}
          aria-controls="search-results"
          aria-autocomplete="list"
          aria-activedescendant={
            selectedIndex >= 0 ? `result-${selectedIndex}` : undefined
          }
        />
        <Link
          href={`/courses?search=${encodeURIComponent(search)}`}
          className="flex px-5 absolute rounded-e-md duration-300 end-0 -translate-y-1/2 top-1/2 h-full bg-(--main-color) hover:bg-(--main-darker-color) text-white"
          aria-label={t("search.search")}
          tabIndex={0}
        >
          <div className="flex gap-1 items-center justify-center">
            <p className="hidden sm:block">{t("search.search")}</p>
            <Search size={15} aria-hidden="true" />
          </div>
        </Link>
      </div>

      {open && (
        <div
          ref={dropdownRef}
          id="search-results"
          className={`shadow-lg border overflow-hidden bg-gray-50 w-full fixed top-[70px] start-0 xl:absolute xl:top-[54px] z-999  rounded-sm`}
          role="listbox"
          aria-label={t("search.searchResults")}
        >
          {loading && (
            <div className="py-4 flex justify-center" role="status">
              <BtnLoad color="main" size={30} />
              <span className="sr-only">{t("search.loading")}</span>
            </div>
          )}

          {!loading && searchResults.length === 0 && search.trim() && (
            <div className="py-4 px-4 text-center text-gray-500">
              {t("search.noResults")}
            </div>
          )}

          {!loading && searchResults.length > 0 && showSearchResults}

          {moreThanFive && !loading && (
            <Link
              href={`/courses?search=${encodeURIComponent(search)}`}
              ref={(el) => {
                if (el) resultsRef.current[searchResults.length] = el
              }}
              onClick={(e) => {
                e.preventDefault()
                router.push(`/courses?search=${encodeURIComponent(search)}`)
                setOpen(false)
              }}
              onMouseEnter={() => setSelectedIndex(searchResults.length)}
              className={`block text-center text-sm font-semibold text-white py-2 duration-300 rounded-b-sm cursor-pointer ${
                selectedIndex === searchResults.length
                  ? "bg-(--main-darker-color)"
                  : "bg-(--main-color) hover:bg-(--main-darker-color)"
              }`}
              role="option"
              aria-selected={selectedIndex === searchResults.length}
              tabIndex={0}
            >
              {t("search.seeAllResults")}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
