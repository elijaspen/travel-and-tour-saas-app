"use client"

import { useState } from "react"
import { Plus, MoreHorizontal } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface Promo {
  id: string
  code: string
  description: string
  isActive: boolean
}

interface ActivePromotionsProps {
  promos: Promo[]
}

export function ActivePromotions({ promos: initialPromos }: ActivePromotionsProps) {
  const [promos, setPromos] = useState(initialPromos)

  const handleToggle = (id: string) => {
    setPromos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold">Active Promotions</CardTitle>
        
        {/* Ghost icon button */}
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal size={15} />
          <span className="sr-only">More options</span>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {/* Promo rows */}
        <div className="divide-y">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="flex items-center justify-between px-6 py-3.5"
            >
              <div>
                <p className="text-sm font-semibold">{promo.code}</p>
                <p className="text-xs text-muted-foreground">{promo.description}</p>
              </div>

              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "text-xs font-medium",
                    promo.isActive ? "text-emerald-600" : "text-muted-foreground"
                  )}
                >
                  {promo.isActive ? "Active" : "Inactive"}
                </span>

                <Switch
                  id={`promo-${promo.id}`}
                  checked={promo.isActive}
                  onCheckedChange={() => handleToggle(promo.id)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Create Promo CTA */}
        <div className="px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-dashed text-muted-foreground"
          >
            <Plus size={13} />
            Create Promo Code
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
