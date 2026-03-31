import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type CenteredPageLoadingProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function CenteredPageLoading({
  title,
  description,
  className,
}: CenteredPageLoadingProps) {
  const statusLabel = [title, description].filter(Boolean).join(". ") || "Loading";

  return (
    <div
      className={cn(
        "flex min-h-[min(24rem,55vh)] w-full flex-col items-center justify-center gap-3",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={statusLabel}
    >
      <div className="relative flex size-14 items-center justify-center">
        <span
          className="absolute inline-flex size-14 animate-ping rounded-full bg-primary/15"
          aria-hidden
        />
        <Loader2
          className="relative size-9 animate-spin text-primary"
          aria-hidden
        />
      </div>
      {(title ?? description) ? (
        <div className="flex max-w-sm flex-col items-center gap-1 text-center">
          {title ? (
            <p className="font-medium text-foreground">{title}</p>
          ) : null}
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
