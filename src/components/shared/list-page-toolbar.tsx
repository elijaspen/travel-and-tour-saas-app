import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ListPageToolbarProps = {
  primaryAction: ReactNode;
  children: ReactNode;
  className?: string;
};

export function ListPageToolbar({
  primaryAction,
  children,
  className,
}: ListPageToolbarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between flex-wrap gap-4",
        className
      )}
    >
      {primaryAction}
      <div className="flex items-center gap-3 flex-wrap">{children}</div>
    </div>
  );
}
