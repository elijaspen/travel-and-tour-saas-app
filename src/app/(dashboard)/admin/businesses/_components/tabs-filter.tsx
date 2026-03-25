import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { businessesListConfig } from "@/features/company/utils/businesses-list-config"
import type { StatusCounts } from "@/features/company/company.service"
import { buildListUrl } from "@/features/shared/list-params"
import { ROUTE_PATHS } from "@/config/routes"

const BASE_PATH = ROUTE_PATHS.AUTHED.ADMIN.BUSINESSES
const statusFilter = businessesListConfig.filters[0]

const COUNT_KEY_MAP: Record<string, keyof StatusCounts> = {
  all: "total",
  pending: "pending",
  approved: "approved",
  declined: "declined",
  suspended: "suspended",
}

type BusinessesTabsFilterProps = {
  activeStatus?: string
  counts?: StatusCounts
}

export function BusinessesTabsFilter({ activeStatus, counts }: BusinessesTabsFilterProps) {
  const currentTab = activeStatus ?? statusFilter.default

  return (
    <Tabs value={currentTab}>
      <TabsList>
        {statusFilter.options.map((option) => {
          const href = buildListUrl(BASE_PATH, businessesListConfig, {
            filters: { [statusFilter.paramKey]: option.value },
          })
          const countKey = COUNT_KEY_MAP[option.value]
          const count = countKey ? counts?.[countKey] : undefined

          return (
            <TabsTrigger key={option.value} value={option.value} asChild>
              <Link href={href}>
                {option.label}
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
