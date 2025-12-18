"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";
import Logo from "@/components/Logo";
import Language from "@/components/Language";
import { useTranslation } from "react-i18next";

export default function AppNavbar() {
  const { t } = useTranslation();

  return (
    <nav className="border-b bg-sidebar border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-wrap items-center justify-between px-2 py-4">
        <div className="flex items-center gap-2 flex-1 md:flex-0">
          <SidebarTrigger />
          <div className="block md:hidden">
            <Logo w={40} h={40} />
          </div>
          <div className="relative overflow-hidden flex-1 rounded-sm">
            <input
              type="text"
              name="search"
              placeholder={t("DashNavbar.searchPlaceholder")}
              className="border focus:border-(--main-color) text-gray-700 duration-300 text-sm py-2 border-[#e2e6f1] my-0 pe-[63px] xl:pe-[115px] rounded-sm outline-none p-2 xl:w-[600px] md:w-[250px] w-full"
            />
            <button className="hover:bg-(--main-darker-color) border-(--main-darker-color) duration-300 text-white font-semibold cursor-pointer h-full bg-(--main-color) px-5 absolute end-0 translate-y-half top-1/2">
              <div className="flex gap-1 items-center">
                <p className="hidden xl:block">{t("DashNavbar.search")}</p>
                <Search size={15} />
              </div>
            </button>
          </div>
        </div>
        <div className="md:block hidden">
          <Language form={1} />
        </div>
      </div>
    </nav>
  );
}