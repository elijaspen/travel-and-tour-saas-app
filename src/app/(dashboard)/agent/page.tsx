import { BarChart2, BookOpen, Package, Star, Bell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatsCard } from "@/components/shared/StatsCard"
import { RevenueChart } from "@/components/shared/RevenueChart"
import { RecentBookings } from "@/components/shared/RecentBookings"
import { ActivePromotions } from "@/components/shared/ActivePromotions"
import { TopPackages } from "@/components/shared/TopPackages"
import type { Booking } from "@/components/shared/RecentBookings"
import type { Promo } from "@/components/shared/ActivePromotions"
import type { TourPackage } from "@/components/shared/TopPackages"

const MOCK_REVENUE = [
  { month: "Jan", amount: 8400  },
  { month: "Feb", amount: 9200  },
  { month: "Mar", amount: 11000 },
  { month: "Apr", amount: 10500 },
  { month: "May", amount: 9800  },
  { month: "Jun", amount: 14200 },
  { month: "Jul", amount: 12800 },
]

const MOCK_BOOKINGS: Booking[] = [
  { id: "1", customerName: "Alice Freeman",  packageName: "Bali Jungle Trek",        dateRange: "Oct 12-19", status: "Confirmed",  amount: 450  },
  { id: "2", customerName: "Mark Taylor",    packageName: "Komodo Island",           dateRange: "Nov 02-05", status: "Pending",    amount: 1250 },
  { id: "3", customerName: "Sophie Wu",      packageName: "Tokyo City Tour",         dateRange: "Dec 10-15", status: "Confirmed",  amount: 850  },
  { id: "4", customerName: "James Miller",   packageName: "Iceland Northern Lights", dateRange: "Jan 05-10", status: "Cancelled",  amount: 1899 },
  { id: "5", customerName: "Emma Wilson",    packageName: "Paris Romantic Getaway",  dateRange: "Feb 14-18", status: "Confirmed",  amount: 2100 },
]

const MOCK_PROMOS: Promo[] = [
  { id: "p1", code: "SUMMER2024", description: "20% Off", isActive: true  },
  { id: "p2", code: "BALIBLISS",  description: "$50 Off", isActive: true  },
  { id: "p3", code: "EARLYBIRD",  description: "15% Off", isActive: false },
  { id: "p4", code: "FAMILYFUN",  description: "10% Off", isActive: false },
]

const MOCK_PACKAGES: TourPackage[] = [
  { id: "t1", name: "Ubud Cultural Trek", imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=120&q=80", salesCount: 42, salesChange: 12  },
  { id: "t2", name: "Kyoto Tea Ceremony", imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=120&q=80", salesCount: 28, salesChange: 5   },
  { id: "t3", name: "Northern Lights",    imageUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=120&q=80", salesCount: 15, salesChange: -2  },
  { id: "t4", name: "Safari Adventure",   imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=120&q=80", salesCount: 12, salesChange: 8   },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <nav className="text-sm text-muted-foreground">
          <span>Dashboard</span>
          <span className="mx-1.5">/</span>
          <span className="font-medium text-foreground">Overview</span>
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 w-full pl-8 text-sm sm:w-64"
            />
          </div>

          {/* Notification bell — size="icon" gives it a square aspect ratio */}
          <Button variant="outline" size="icon" className="relative h-9 w-9 shrink-0">
            <Bell size={15} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
          </Button>

          {/* Primary CTA */}
          <Button size="sm" className="shrink-0">
            <Plus size={14} />
            <span className="hidden sm:inline">Create New</span>
          </Button>
        </div>
      </header>

      {/* ── KPI Stats ────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Revenue"   value="$124,500" change={12} subtitle="vs last month"        icon={BarChart2} />
        <StatsCard title="Active Bookings" value="84"       change={5}  subtitle="Current travelers"    icon={BookOpen}  />
        <StatsCard title="Packages Sold"   value="312"      change={18} subtitle="This month"           icon={Package}   />
        <StatsCard title="Avg. Rating"     value="4.9"      change={3}  subtitle="Customer satisfaction" icon={Star}     />
      </section>

      {/* ── Revenue chart + Promotions ───────────────────────────────── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={MOCK_REVENUE} />
        </div>
        <ActivePromotions promos={MOCK_PROMOS} />
      </section>

      {/* ── Bookings table + Top packages ────────────────────────────── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentBookings bookings={MOCK_BOOKINGS} />
        </div>
        <TopPackages packages={MOCK_PACKAGES} />
      </section>

    </div>
  )
}