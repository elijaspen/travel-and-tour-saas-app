import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

type PageSectionHeaderProps = {
  breadcrumb?: string | string[];
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function PageSectionHeader({
  breadcrumb,
  title,
  description,
  actions,
  className,
}: PageSectionHeaderProps) {
  const breadcrumbText =
    typeof breadcrumb === "string"
      ? breadcrumb
      : Array.isArray(breadcrumb)
        ? breadcrumb.join(" / ")
        : null;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {breadcrumbText ? (
        <div className="text-sm font-normal text-muted-foreground mb-2">
          {breadcrumbText}
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-4">
        <PageHeader title={title} description={description} />
        {actions ?? null}
      </div>
    </div>
  );
}
