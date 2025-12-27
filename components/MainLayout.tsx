"use client"

import * as React from "react"
import { useState } from "react"
import { AppSidebar } from "./Sidebar"
import { SiteHeader } from "./Header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

interface MainLayoutProps {
    children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [activeItem, setActiveItem] = useState("Tableau de bord")

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" activeItem={activeItem} setActiveItem={setActiveItem} />
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
