"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search } from "lucide-react"
import Logo from "@/components/Logo"
import Language from "@/components/Language"
import { useTranslation } from "react-i18next"
import SearchInput from "@/components/Search"
import { useState } from "react"

export default function AppNavbar() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <nav className="border-b bg-sidebar border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center gap-2 lg:gap-10 justify-between px-2 py-4">
        <div className="flex items-center gap-2 flex-1">
          <SidebarTrigger />
          <div className="block md:hidden">
            <Logo w={40} h={40} />
          </div>
            <SearchInput open={open} setOpen={setOpen} />
        </div>
        <div className="md:block hidden">
          <Language form={1} />
        </div>
      </div>
    </nav>
  )
}
