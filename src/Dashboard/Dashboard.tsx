import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./Components/AppSidebar";
import AppNavbar from "./Components/AppNavbar";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <AppNavbar />
      </main>
    </SidebarProvider>
  )
}