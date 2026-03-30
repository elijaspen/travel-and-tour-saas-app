import { Clock, XCircle, ShieldOff } from "lucide-react";

import { CompanyStatuses, type CompanyStatus } from "@/features/company/company.types";
import { Card, CardContent } from "@/components/ui/card";

const STATUS_WALLS: Record<
  Exclude<CompanyStatus, "approved">,
  { icon: typeof Clock; title: string; description: string }
> = {
  [CompanyStatuses.PENDING]: {
    icon: Clock,
    title: "Application under review",
    description:
      "Your business application is being reviewed by our team. You'll be notified once it's approved. This usually takes 1–2 business days.",
  },
  [CompanyStatuses.DECLINED]: {
    icon: XCircle,
    title: "Application declined",
    description:
      "Unfortunately your business application was not approved. If you believe this was an error, please contact our support team for more information.",
  },
  [CompanyStatuses.SUSPENDED]: {
    icon: ShieldOff,
    title: "Account suspended",
    description:
      "Your business account has been suspended. Please contact our support team to resolve any outstanding issues.",
  },
};

export function AgencyStatusWall({ status }: { status: CompanyStatus }) {
  if (status === CompanyStatuses.APPROVED) return null;
  const wall = STATUS_WALLS[status];
  if (!wall) return null;
  const Icon = wall.icon;

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Icon className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">{wall.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{wall.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
