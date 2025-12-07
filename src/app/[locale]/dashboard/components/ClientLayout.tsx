"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { AuthProvider } from "@/context/authContext"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AuthProvider>
        <AppSidebar />
        <main className="flex-1 bg-[#F8F9FA] min-w-0">{children}</main>
      </AuthProvider>
    </SidebarProvider>
  )
}
