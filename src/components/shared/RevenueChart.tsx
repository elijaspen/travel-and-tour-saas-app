"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MonthlyRevenue {
  month: string
  amount: number
}

interface RevenueChartProps {
  data: MonthlyRevenue[]
}

const CHART_HEIGHT = 180
const BAR_WIDTH = 32
const BAR_GAP = 48

export function RevenueChart({ data }: RevenueChartProps) {
  const [activeBar, setActiveBar] = useState<number | null>(null)

  const maxAmount = data.length > 0 ? Math.max(...data.map((d) => d.amount)) : 1
  const barHeight = (amount: number) => (amount / maxAmount) * CHART_HEIGHT
  const totalWidth = Math.max(0, data.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP)

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-sm font-semibold">Revenue Overview</CardTitle>
          <CardDescription>Monthly performance comparison</CardDescription>
        </div>

        <Select defaultValue="6months">
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="12months">Last 12 months</SelectItem>
            <SelectItem value="year">This year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {/* Tooltip — shown above active bar */}
        <div className="relative">
          {activeBar !== null && (
            <div className="absolute right-0 top-0 z-10 rounded-lg border bg-popover px-3 py-1.5 text-xs shadow-md">
              <span className="font-medium">{data[activeBar].month}</span>
              <span className="ml-2 text-muted-foreground">
                ${data[activeBar].amount.toLocaleString()}
              </span>
            </div>
          )}

          <svg
            viewBox={`0 0 ${totalWidth} ${CHART_HEIGHT + 24}`}
            className="w-full"
            aria-label="Monthly revenue bar chart"
          >
            {data.map((d, i) => {
              const x = i * (BAR_WIDTH + BAR_GAP)
              const h = barHeight(d.amount)
              const y = CHART_HEIGHT - h
              const isActive = activeBar === i

              return (
                <g
                  key={d.month}
                  onMouseEnter={() => setActiveBar(i)}
                  onMouseLeave={() => setActiveBar(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x={x}
                    y={y}
                    width={BAR_WIDTH}
                    height={h}
                    rx={4}
                    className={
                      isActive
                        ? "fill-foreground"
                        : "fill-foreground/20 transition-all hover:fill-foreground/60"
                    }
                  />
                  <text
                    x={x + BAR_WIDTH / 2}
                    y={CHART_HEIGHT + 18}
                    textAnchor="middle"
                    fontSize={11}
                    className="fill-muted-foreground"
                  >
                    {d.month}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}