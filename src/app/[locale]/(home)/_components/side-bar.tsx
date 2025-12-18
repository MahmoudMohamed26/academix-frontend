"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export default function WebsiteSidebar() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <SidebarTrigger onClick={() => setIsOpen(true)} />
      <Sidebar
        forceMobile={true}
        open={isOpen}
        onOpenChange={setIsOpen}
        side={i18n.language === "en" ? "left" : "right"}
        className="border-e"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Link href={"/"}>
                      <span>test</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  )
}
