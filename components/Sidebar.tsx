'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Home, FileText, Users, KanbanSquare, Calendar, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: Home },
  { name: 'Devis', href: '/devis', icon: FileText },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Vue Kanban', href: '/kanban', icon: KanbanSquare },
  { name: 'Calendrier', href: '/calendrier', icon: Calendar },
]

export function Sidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<{ email?: string, name?: string } | null>(null)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser({
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0]
        })
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0]
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-900">
      {/* Logo */}
      <div className="flex h-20 items-center px-6">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded bg-white">
            <Image
              src="/kangourou-kids-logo.png"
              alt="Kangourou Kids"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-semibold text-white">K-Flow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-slate-800 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center justify-between gap-3 outline-none hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-medium text-white">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 overflow-hidden text-left">
                  <p className="truncate text-sm font-medium text-white">{user?.name || 'Utilisateur'}</p>
                  <p className="truncate text-xs text-slate-400">{user?.email || 'Non connecté'}</p>
                </div>
              </div>
              <LogOut className="h-4 w-4 text-slate-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-white">
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            {user ? (
              <DropdownMenuItem
                className="cursor-pointer focus:bg-slate-800 focus:text-white"
                onClick={async () => {
                  await supabase.auth.signOut()
                  setUser(null)
                  window.location.reload()
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-slate-800 focus:text-white">
                <Link href="/login">
                  <LogOut className="mr-2 h-4 w-4 rotate-180" />
                  <span>Se connecter</span>
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
