import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type BookingStatus = "Confirmed" | "Pending" | "Cancelled"

export interface Booking {
  id: string
  customerName: string
  packageName: string
  dateRange: string
  status: BookingStatus
  amount: number
}

interface RecentBookingsProps {
  bookings: Booking[]
}

const STATUS_BADGE: Record<BookingStatus, { variant: "default" | "secondary" | "outline"; className: string }> = {
  Confirmed: { variant: "default",   className: ""                              },
  Pending:   { variant: "outline",   className: "border-amber-300 bg-amber-50 text-amber-700" },
  Cancelled: { variant: "secondary", className: "text-muted-foreground"         },
}

function getInitials(name: string): string {
  return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2)
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-sm font-semibold">Recent Bookings</CardTitle>
          <CardDescription>Latest customer reservations</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
          View All
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {bookings.map((booking) => {
                const { variant, className } = STATUS_BADGE[booking.status]

                return (
                  <TableRow key={booking.id}>
                    {/* Avatar + Name in the same cell */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                          {getInitials(booking.customerName)}
                        </div>
                        <span className="whitespace-nowrap text-sm font-medium">{booking.customerName}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {booking.packageName}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {booking.dateRange}
                    </TableCell>

                    <TableCell>
                      <Badge variant={variant} className={cn(className)}>
                        {booking.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-right font-medium">
                      ${booking.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}