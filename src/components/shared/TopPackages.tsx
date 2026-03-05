import { TrendingUp, TrendingDown } from "lucide-react"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface TourPackage {
  id: string
  name: string
  imageUrl: string
  salesCount: number
  salesChange: number
}

interface TopPackagesProps {
  packages: TourPackage[]
}

export function TopPackages({ packages }: TopPackagesProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Top Packages</CardTitle>
        <CardDescription>Best selling tours this month</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col p-0">
        <div className="flex-1 divide-y">
          {packages.map((pkg) => {
            const isPositive = pkg.salesChange >= 0

            return (
              <div key={pkg.id} className="flex items-center gap-3 px-6 py-3.5">
                {/* Thumbnail */}
                <div className="h-10 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    width={56}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Name + sales count */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{pkg.name}</p>
                  <p className="text-xs text-muted-foreground">{pkg.salesCount} sales</p>
                </div>

                <Badge
                  variant="outline"
                  className={cn(
                    "flex items-center gap-0.5 border-0",
                    isPositive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  )}
                >
                  {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {isPositive ? "+" : ""}{pkg.salesChange}%
                </Badge>
              </div>
            )
          })}
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4">
          <Button variant="outline" size="sm" className="w-full">
            View All Packages
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}