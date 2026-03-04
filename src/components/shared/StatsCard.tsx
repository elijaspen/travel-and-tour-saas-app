import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StatsCardProps {
  title: string
  value: string
  change: number
  subtitle: string
  icon: LucideIcon
}

export function StatsCard({ title, value, change, subtitle, icon: Icon }: StatsCardProps) {
  const isPositive = change >= 0

  return (
    <Card>
      <CardContent className="pt-5">
        {/* Header row */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          <Icon size={16} className="text-muted-foreground" />
        </div>

        {/* Value + trend */}
        <div className="mb-1 flex items-end gap-2">
          <p className="text-2xl font-bold tracking-tight">{value}</p>

          <Badge
            variant="outline"
            className={cn(
              "mb-0.5 flex items-center gap-0.5 border-0",
              isPositive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            )}
          >
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {isPositive ? "+" : ""}{change}%
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  )
}