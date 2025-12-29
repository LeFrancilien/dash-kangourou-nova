"use client"

import { SiteHeader } from "./Header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import dynamic from "next/dynamic"

const AppSidebar = dynamic(() => import("./Sidebar").then((mod) => mod.Sidebar), {
    ssr: false,
})

interface MainLayoutProps {
    children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
