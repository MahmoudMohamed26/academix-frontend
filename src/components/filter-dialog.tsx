"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ListFilter, Loader2, Star } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import useAxios from "@/hooks/useAxios"
import { getCategories } from "@/lib/api/Categories"
import { useTranslation } from "react-i18next"
import { FilterDialogProps } from "@/lib/types/course"

const MAX_PRICE = 1000
const MAX_HOURS = 200

export default function FilterDialog({ currentFilters }: FilterDialogProps) {
  const [open, setOpen] = useState(false)
  const Axios = useAxios()
  const { i18n, t } = useTranslation()

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(Axios),
    staleTime: 10 * 60 * 1000,
  })

  // Form state
  const [filters, setFilters] = useState({
    min_price: currentFilters.min_price || "",
    max_price: currentFilters.max_price || "",
    min_hours: currentFilters.min_hours || "",
    max_hours: currentFilters.max_hours || "",
    min_rating: currentFilters.min_rating || "",
    sortBy: currentFilters.sortBy || "",
    orderedBy: currentFilters.orderedBy || "",
    category_slug: currentFilters.category_slug || "",
    level: currentFilters.level || "",
    user_id: currentFilters.user_id || "",
  })

  const [priceRange, setPriceRange] = useState([
    Number(currentFilters.min_price) || 0,
    Number(currentFilters.max_price) || MAX_PRICE,
  ])

  const [hoursRange, setHoursRange] = useState([
    Number(currentFilters.min_hours) || 0,
    Number(currentFilters.max_hours) || MAX_HOURS,
  ])

  const activeFiltersCount = Object.entries(currentFilters).filter(
    ([key, value]) => key !== "search" && key !== "page" && value && value.trim() !== ""
  ).length

  useEffect(() => {
    const newFilters = {
      min_price: currentFilters.min_price || "",
      max_price: currentFilters.max_price || "",
      min_hours: currentFilters.min_hours || "",
      max_hours: currentFilters.max_hours || "",
      min_rating: currentFilters.min_rating || "",
      sortBy: currentFilters.sortBy || "",
      orderedBy: currentFilters.orderedBy || "",
      category_slug: currentFilters.category_slug || "",
      level: currentFilters.level || "",
      user_id: currentFilters.user_id || "",
    }
    setFilters(newFilters)

    setPriceRange([
      Number(currentFilters.min_price) || 0,
      Number(currentFilters.max_price) || MAX_PRICE,
    ])

    setHoursRange([
      Number(currentFilters.min_hours) || 0,
      Number(currentFilters.max_hours) || MAX_HOURS,
    ])
  }, [currentFilters])

  const buildFilterUrl = () => {
    const params = new URLSearchParams()

    // Add price range (don't add max if it's at maximum)
    if (priceRange[0] > 0) {
      params.append("min_price", priceRange[0].toString())
    }
    if (priceRange[1] < MAX_PRICE) {
      params.append("max_price", priceRange[1].toString())
    }

    // Add hours range (don't add max if it's at maximum)
    if (hoursRange[0] > 0) {
      params.append("min_hours", hoursRange[0].toString())
    }
    if (hoursRange[1] < MAX_HOURS) {
      params.append("max_hours", hoursRange[1].toString())
    }

    // Add other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (
        key !== "min_price" &&
        key !== "max_price" &&
        key !== "min_hours" &&
        key !== "max_hours" &&
        value &&
        value.trim() !== ""
      ) {
        params.append(key, value)
      }
    })

    if (currentFilters.search) {
      params.append("search", currentFilters.search)
    }

    // Build the URL path - use current pathname if available, otherwise default to current location
    const basePath = window.location.pathname
    return `${basePath}${params.toString() ? `?${params.toString()}` : ""}`
  }

  const handleResetFilters = () => {
    setFilters({
      min_price: "",
      max_price: "",
      min_hours: "",
      max_hours: "",
      min_rating: "",
      sortBy: "",
      orderedBy: "",
      category_slug: "",
      level: "",
      user_id: "",
    })
    setPriceRange([0, MAX_PRICE])
    setHoursRange([0, MAX_HOURS])
  }

  const handleLinkClick = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex gap-2 items-center duration-300 hover:text-white hover:bg-black py-2 px-4 border border-black rounded-full cursor-pointer text-sm">
          <ListFilter size={15} />
          <span>{t("filters.allFilters")}</span>
          {activeFiltersCount > 0 && (
            <span className="flex items-center justify-center h-5 px-[7px] bg-black text-white text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("filters.filterCourses")}</DialogTitle>
          <DialogDescription>
            {t("filters.filterDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              {t("filters.priceRange")}
            </Label>
            <div className="space-y-4 px-2">
              <Slider
                value={priceRange}
                dir={i18n.language === "en" ? "ltr" : "rtl"}
                onValueChange={setPriceRange}
                min={0}
                max={MAX_PRICE}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {priceRange[0] === 0
                    ? t("coursesPage.free")
                    : `${priceRange[0]} $`}
                </span>
                <span>${priceRange[1]}{priceRange[1] === MAX_PRICE && '+'}</span>
              </div>
            </div>
          </div>

          {/* Hours Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              {t("filters.courseDuration")}
            </Label>
            <div className="space-y-4 px-2">
              <Slider
                value={hoursRange}
                dir={i18n.language === "en" ? "ltr" : "rtl"}
                onValueChange={setHoursRange}
                min={0}
                max={MAX_HOURS}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{hoursRange[0]}</span>
                <span>{hoursRange[1]}{hoursRange[1] === MAX_HOURS && '+'}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              {t("filters.minimumRating")}
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      min_rating: star.toString(),
                    })
                  }
                  className="cursor-pointer"
                >
                  <Star
                    size={24}
                    className={
                      parseInt(filters.min_rating) >= star
                        ? "fill-[#C67514] text-[#C67514]"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
              {filters.min_rating && (
                <button
                  type="button"
                  onClick={() =>
                    setFilters({ ...filters, min_rating: "" })
                  }
                  className="ml-2 text-sm hover:underline cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  {t("filters.clear")}
                </button>
              )}
            </div>
          </div>

          {/* Category and Level */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-semibold">
                {t("filters.category")}
              </Label>
              <Select
                value={filters.category_slug || "all"}
                dir={i18n.language === "en" ? "ltr" : "rtl"}
                onValueChange={(value) =>
                  setFilters({ ...filters, category_slug: value === "all" ? "" : value })
                }
              >
                <SelectTrigger className="w-full" id="category">
                  <SelectValue placeholder={t("filters.allCategories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.allCategories")}</SelectItem>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {i18n.language === "en"
                        ? category.name_en
                        : category.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level" className="text-base font-semibold">
                {t("filters.courseLevel")}
              </Label>
              <Select
                value={filters.level || "all"}
                dir={i18n.language === "en" ? "ltr" : "rtl"}
                onValueChange={(value) =>
                  setFilters({ ...filters, level: value === "all" ? "" : value })
                }
              >
                <SelectTrigger className="w-full" id="level">
                  <SelectValue placeholder={t("filters.allLevels")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.allLevels")}</SelectItem>
                  <SelectItem value="beginner">{t("filters.beginner")}</SelectItem>
                  <SelectItem value="intermediate">{t("filters.intermediate")}</SelectItem>
                  <SelectItem value="advanced">{t("filters.advanced")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sort By */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sortBy" className="text-base font-semibold">
                {t("filters.sortBy")}
              </Label>
              <Select
                value={filters.sortBy}
                dir={i18n.language === "en" ? "ltr" : "rtl"}
                onValueChange={(value) =>
                  setFilters({ ...filters, sortBy: value })
                }
              >
                <SelectTrigger className="w-full" id="sortBy">
                  <SelectValue placeholder={t("filters.selectPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">{t("filters.title")}</SelectItem>
                  <SelectItem value="price">{t("filters.price")}</SelectItem>
                  <SelectItem value="hours">{t("filters.hours")}</SelectItem>
                  <SelectItem value="rating_avg">{t("filters.rating")}</SelectItem>
                  <SelectItem value="created_at">{t("filters.dateCreated")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderedBy" className="text-base font-semibold">
                {t("filters.order")}
              </Label>
              <Select
                value={filters.orderedBy}
                dir={i18n.language === "en" ? "ltr" : "rtl"}
                onValueChange={(value) =>
                  setFilters({ ...filters, orderedBy: value })
                }
              >
                <SelectTrigger className="w-full" id="orderedBy">
                  <SelectValue placeholder={t("filters.selectPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">{t("filters.ascending")}</SelectItem>
                  <SelectItem value="desc">{t("filters.descending")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user_id" className="text-base font-semibold">
              {t("filters.instructorId")}
            </Label>
            <Input
              id="user_id"
              type="text"
              placeholder={t("filters.instructorIdPlaceholder")}
              value={filters.user_id}
              onChange={(e) =>
                setFilters({ ...filters, user_id: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleResetFilters}>
            {t("filters.resetFilters")}
          </Button>
          <Button className="bg-(--main-color) hover:bg-(--main-darker-color)" asChild>
            <Link href={buildFilterUrl()} onClick={handleLinkClick}>
              {t("filters.applyFilters")}
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}