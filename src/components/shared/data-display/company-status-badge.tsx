import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CompanyStatus } from "@/modules/company/company.types"

const STATUS_CONFIG: Record<
  CompanyStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  approved: {
    label: "Approved",
    className: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  declined: {
    label: "Declined",
    className: "border-red-300 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
  suspended: {
    label: "Suspended",
    className: "border-slate-300 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  },
}

type CompanyStatusBadgeProps = {
  status: CompanyStatus
  className?: string
}

export function CompanyStatusBadge({ status, className }: CompanyStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
