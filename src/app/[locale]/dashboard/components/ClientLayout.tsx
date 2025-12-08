"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 bg-[#F8F9FA] min-w-0">{children}</main>
    </SidebarProvider>
  )
}
