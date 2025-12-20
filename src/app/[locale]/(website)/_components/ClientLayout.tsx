"use client"

import { SidebarProvider } from "@/components/ui/sidebar"

export function ClientLayoutHome({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider  defaultOpen={false}>
        <div className="w-full flex-col flex">
          {children}
        </div>
    </SidebarProvider>
  )
}
