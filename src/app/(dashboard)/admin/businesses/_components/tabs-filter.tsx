import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompanyStatuses } from "@/features/company/company.types"
import type { StatusCounts } from "@/features/company/company.service"
import { ROUTE_PATHS } from "@/config/routes"

const ALL_TAB = "all"

const TABS = [
  { value: ALL_TAB, label: "All", countKey: "total" as const },
  { value: CompanyStatuses.PENDING, label: "Pending", countKey: "pending" as const },
  { value: CompanyStatuses.APPROVED, label: "Approved", countKey: "approved" as const },
  { value: CompanyStatuses.DECLINED, label: "Declined", countKey: "declined" as const },
  { value: CompanyStatuses.SUSPENDED, label: "Suspended", countKey: "suspended" as const },
]

type BusinessesTabsFilterProps = {
  activeStatus?: string
  counts?: StatusCounts
}

export function BusinessesTabsFilter({ activeStatus, counts }: BusinessesTabsFilterProps) {
  const currentTab = activeStatus ?? ALL_TAB

  return (
    <Tabs value={currentTab}>
      <TabsList>
        {TABS.map((tab) => {
          const href =
            tab.value === ALL_TAB
              ? ROUTE_PATHS.AUTHED.ADMIN.BUSINESSES
              : `${ROUTE_PATHS.AUTHED.ADMIN.BUSINESSES}?status=${tab.value}`
          const count = counts?.[tab.countKey]

          return (
            <TabsTrigger key={tab.value} value={tab.value} asChild>
              <Link href={href}>
                {tab.label}
                {count != null && count > 0 && (
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    ({count})
                  </span>
                )}
              </Link>
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
