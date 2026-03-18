import type { Metadata } from "next"
import Link from "next/link"
import { Building2, MapPin, ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { EmptyState } from "@/components/shared/empty-state"
import { CompanyStatusBadge } from "@/components/shared/company-status-badge"
import { BusinessesTabsFilter } from "./_components/tabs-filter"
import { requireRole } from "@/features/profile/profile.guard"
import { ProfileRoles } from "@/features/profile/profile.types"
import { companyService } from "@/features/company/company.service"
import { CompanyStatuses } from "@/features/company/company.types"
import type { CompanyStatus } from "@/features/company/company.types"
import { ROUTE_PATHS } from "@/config/routes"

export const metadata: Metadata = {
  title: "Business Management",
  description: "View and manage all registered businesses.",
}

const PAGE_SIZE = 20
const VALID_STATUSES = Object.values(CompanyStatuses) as CompanyStatus[]

function isValidStatus(value: string | undefined): value is CompanyStatus {
  return VALID_STATUSES.includes(value as CompanyStatus)
}

function buildUrl(params: { status?: string; page?: number }) {
  const search = new URLSearchParams()
  if (params.status) search.set("status", params.status)
  if (params.page && params.page > 1) search.set("page", String(params.page))
  const qs = search.toString()
  return qs ? `${ROUTE_PATHS.AUTHED.ADMIN.BUSINESSES}?${qs}` : ROUTE_PATHS.AUTHED.ADMIN.BUSINESSES
}

export default async function BusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  await requireRole([ProfileRoles.ADMIN])

  const { status: rawStatus, page: rawPage } = await searchParams
  const activeStatus = isValidStatus(rawStatus) ? rawStatus : undefined
  const page = Math.max(1, parseInt(rawPage ?? "1"))

  const [{ data: counts }, { data: companies, total }] = await Promise.all([
    companyService.getStatusCounts(),
    companyService.listWithOwnersPaginated({
      page,
      pageSize: PAGE_SIZE,
      status: activeStatus,
    }),
  ])

  const totalPages = Math.ceil((total ?? 0) / PAGE_SIZE)

  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-6">
      <PageHeader
        title="Business Management"
        description="View companies, manage statuses, and oversee business profiles."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Businesses"
          value={counts?.total ?? 0}
          description="All registered companies"
          icon={<Building2 className="h-4 w-4" />}
        />
        <StatCard
          title="Pending Review"
          value={counts?.pending ?? 0}
          description="Awaiting approval"
          icon={<Clock className="h-4 w-4" />}
          trend={
            (counts?.pending ?? 0) > 0
              ? { label: "Needs attention", positive: false }
              : undefined
          }
        />
        <StatCard
          title="Approved"
          value={counts?.approved ?? 0}
          description="Active on platform"
          icon={<Building2 className="h-4 w-4" />}
          trend={
            (counts?.approved ?? 0) > 0
              ? { label: "Live", positive: true }
              : undefined
          }
        />
        <StatCard
          title="Declined"
          value={counts?.declined ?? 0}
          description="Declined businesses"
          icon={<Building2 className="h-4 w-4" />}
        />
      </div>

      <Card className="flex min-h-0 flex-1 flex-col">
        <CardHeader className="flex flex-row items-center justify-between gap-4 shrink-0">
          <CardTitle className="text-base">All Companies</CardTitle>
          <BusinessesTabsFilter
            activeStatus={activeStatus}
            counts={counts ?? undefined}
          />
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col p-0">
          {companies.length === 0 ? (
            <div className="px-6 pb-6">
              <EmptyState
                icon={<Building2 className="h-10 w-10" />}
                title="No companies found"
                description={
                  activeStatus
                    ? `There are no ${activeStatus} companies at the moment.`
                    : "No businesses have registered yet."
                }
              />
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Business</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="pr-6 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="pl-6">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium">{company.name}</span>
                            {company.contact_email && (
                              <span className="text-xs text-muted-foreground">
                                {company.contact_email}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {company.owner?.full_name ?? "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {company.location ? (
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 shrink-0" />
                              {company.location}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <CompanyStatusBadge status={company.status} />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(company.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <Button asChild variant="ghost" size="sm" className="gap-1">
                            <Link href={ROUTE_PATHS.AUTHED.ADMIN.BUSINESS_DETAIL(company.id)}>
                              Manage
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-6 py-3">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    {page > 1 ? (
                      <Button asChild variant="outline" size="sm" className="gap-1">
                        <Link href={buildUrl({ status: activeStatus, page: page - 1 })}>
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="gap-1" disabled>
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                    )}
                    {page < totalPages ? (
                      <Button asChild variant="outline" size="sm" className="gap-1">
                        <Link href={buildUrl({ status: activeStatus, page: page + 1 })}>
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="gap-1" disabled>
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
