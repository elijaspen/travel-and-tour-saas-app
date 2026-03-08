"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Package, CalendarCheck,
  Tag, Users, BarChart2, Settings, LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { ElementType } from "react"

interface NavItem {
  label: string
  href: string
  icon: ElementType
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview",  href: "/dashboard",           icon: LayoutDashboard },
  { label: "Packages",  href: "/dashboard/packages",  icon: Package         },
  { label: "Bookings",  href: "/dashboard/bookings",  icon: CalendarCheck   },
  { label: "Promos",    href: "/dashboard/promos",    icon: Tag             },
  { label: "Customers", href: "/dashboard/customers", icon: Users           },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2       },
  { label: "Settings", href: "/dashboard/settings", icon: Settings          },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-56 flex-col overflow-hidden border-r bg-background px-3 py-6">
      {/* Brand */}
      <Link href="/" className="mb-8 px-3">
        <span className="text-2xl font-bold tracking-tight">Travel and Tour</span>
      </Link>

      {/* Agent profile */}
      <div className="mb-6 flex flex-col items-center gap-2 px-2">
        <div className="h-12 w-12 overflow-hidden rounded-full bg-muted ring-2 ring-border">
          <img src="https://placehold.co/100x100" alt="placeholder" className="w-full h-full object-cover" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold">Eli Jaspen</p>
          <p className="text-xs text-muted-foreground">Premier Agent</p>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Primary nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href)

          return (
            <Button
              key={href}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start gap-3 shrink-0"
              asChild
            >
              <Link href={href}>
                <Icon size={15} />
                {label}
              </Link>
            </Button>
          )
        })}
      </nav>

      <Separator className="my-4 shrink-0" />

      {/* Footer */}
      <div className="flex flex-col gap-0.5 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground"
        >
          <LogOut size={15} />
          Log Out
        </Button>
      </div>
    </aside>
  )
}