import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  PauseCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CompanyStatusBadge } from "@/components/shared/company-status-badge"
import { requireRole } from "@/features/profile/profile.guard"
import { ProfileRoles } from "@/features/profile/profile.types"
import { companyService } from "@/features/company/company.service"
import { updateCompanyStatusAction } from "@/features/company/company.actions"
import { CompanyStatuses } from "@/features/company/company.types"
import { ROUTE_PATHS } from "@/config/routes"

export const metadata: Metadata = {
  title: "Business Details",
}

type DetailRowProps = { icon: React.ReactNode; label: string; value: string | null | undefined }

function DetailRow({ icon, label, value }: DetailRowProps) {
  const displayValue = value ?? "—"
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span
          className={cn(
            "text-sm font-medium",
            !value && "text-muted-foreground"
          )}
        >
          {displayValue}
        </span>
      </div>
    </div>
  )
}

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireRole([ProfileRoles.ADMIN])
  const { id } = await params

  const { data: company, error } = await companyService.getWithOwner(id)
  if (error || !company) notFound()

  const companyId = company.id

  const { data: ownerEmail } = company.owner?.id
    ? await companyService.getOwnerEmail(company.owner.id)
    : { data: null }

  const approveAction = updateCompanyStatusAction.bind(null, companyId, CompanyStatuses.APPROVED)
  const declineAction = updateCompanyStatusAction.bind(null, companyId, CompanyStatuses.DECLINED)
  const suspendAction = updateCompanyStatusAction.bind(null, companyId, CompanyStatuses.SUSPENDED)

  const { status } = company

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5 text-muted-foreground">
          <Link href={ROUTE_PATHS.AUTHED.ADMIN.BUSINESSES}>
            <ArrowLeft className="h-4 w-4" />
            Business Management
          </Link>
        </Button>
      </div>

      {/* Page title */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-muted">
          <Building2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tight">{company.name}</h1>
          <p className="text-sm text-muted-foreground">
            Registered{" "}
            {new Date(company.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Status card — clear section for understanding and changing status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Status</CardTitle>
          <p className="text-sm text-muted-foreground">
            {status === CompanyStatuses.PENDING &&
              "This business is awaiting your review. Approve to make it live on the platform, or decline to reject the application."}
            {status === CompanyStatuses.APPROVED &&
              "This business is live and visible to customers. You can suspend it to temporarily disable access."}
            {status === CompanyStatuses.DECLINED &&
              "This application was rejected. You can approve to reconsider and make the business live."}
            {status === CompanyStatuses.SUSPENDED &&
              "This business is temporarily disabled and not visible to customers. Approve to reactivate."}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Current:</span>
              <CompanyStatusBadge status={company.status} />
            </div>
            <span className="text-sm text-muted-foreground">→</span>
            {status === CompanyStatuses.PENDING && (
              <div className="flex flex-wrap gap-2">
                <form action={approveAction}>
                  <Button
                    type="submit"
                    size="sm"
                    className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve and make live
                  </Button>
                </form>
                <form action={declineAction}>
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="gap-2 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                  >
                    <XCircle className="h-4 w-4" />
                    Decline
                  </Button>
                </form>
              </div>
            )}
            {status === CompanyStatuses.APPROVED && (
              <form action={suspendAction}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <PauseCircle className="h-4 w-4" />
                  Suspend business
                </Button>
              </form>
            )}
            {status === CompanyStatuses.SUSPENDED && (
              <form action={approveAction}>
                <Button
                  type="submit"
                  size="sm"
                  className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Reactivate
                </Button>
              </form>
            )}
            {status === CompanyStatuses.DECLINED && (
              <form action={approveAction}>
                <Button
                  type="submit"
                  size="sm"
                  className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve and make live
                </Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Business information
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
        {/* Company Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" />
              Company Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {company.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {company.description}
              </p>
            )}
            {company.description && <Separator />}
            <div className="flex flex-col gap-3">
              <DetailRow
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value={company.location}
              />
              <DetailRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={company.contact_email}
              />
              <DetailRow
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={company.contact_phone}
              />
              <DetailRow
                icon={<Globe className="h-4 w-4" />}
                label="Website"
                value={company.website_url}
              />
              <DetailRow
                icon={<Calendar className="h-4 w-4" />}
                label="Registered"
                value={new Date(company.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Owner Profile */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Owner Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {company.owner ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold uppercase text-muted-foreground">
                    {company.owner.full_name.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium">{company.owner.full_name}</p>
                    <Badge
                      variant="outline"
                      className={
                        company.owner.status === "active"
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700 text-xs"
                          : "border-red-300 bg-red-50 text-red-700 text-xs"
                      }
                    >
                      {company.owner.status === "active" ? "Active account" : "Suspended account"}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="flex flex-col gap-3">
                  <DetailRow
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={ownerEmail}
                  />
                  <DetailRow
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone"
                    value={company.owner.phone}
                  />
                  <DetailRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Member Since"
                    value={new Date(company.owner.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  />
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Owner profile unavailable.</p>
            )}
          </CardContent>
        </Card>
        </div>
      </section>
    </div>
  )
}
