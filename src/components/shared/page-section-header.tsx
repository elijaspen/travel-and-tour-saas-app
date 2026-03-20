import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PageSectionHeaderProps = {
  className?: string;
  /** Parent link shown before the breadcrumb trail when combined, or on its own row otherwise. */
  back?: { href: string; label: string };
  /** Directory segments (e.g. `["Agency", "Tours"]`). When the first segment matches `back.label`, it merges with the back control to save vertical space. */
  breadcrumb?: string | string[];
  /**
   * Main page title, left-aligned below the breadcrumb row (list / detail pages).
   * Ignored when `centerTitle` is set — use one or the other for the primary heading.
   */
  title?: string;
  /** Shown under the title when `title` is set. */
  description?: string;
  /**
   * Centered title in a single toolbar row with back/breadcrumb on the left and `actions` on the right.
   * Use for wizards or flows where the page name should read in the middle.
   */
  centerTitle?: string;
  actions?: React.ReactNode;
};

function normalizeSegment(s: string) {
  return s.trim().toLowerCase();
}

function breadcrumbParts(breadcrumb: string | string[]): string[] {
  if (typeof breadcrumb === "string") {
    return breadcrumb
      .split("/")
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return breadcrumb.map((p) => p.trim()).filter(Boolean);
}

export function PageSectionHeader({
  className,
  back,
  breadcrumb,
  title,
  description,
  centerTitle,
  actions,
}: PageSectionHeaderProps) {
  const parts = breadcrumb ? breadcrumbParts(breadcrumb) : [];
  const canMergeBack =
    Boolean(back) &&
    parts.length > 0 &&
    normalizeSegment(parts[0]!) === normalizeSegment(back!.label);
  const tailParts = canMergeBack ? parts.slice(1) : parts;

  const showDescription = Boolean(title && description && !centerTitle);
  const showTitleRow = Boolean(!centerTitle && (title || actions));

  const breadcrumbNav =
    back || parts.length > 0 ? (
      <>
        {back ? (
          <>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-7 shrink-0 gap-1 px-1.5 -ml-1.5 text-muted-foreground hover:text-foreground"
            >
              <Link href={back.href}>
                <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                <span>{back.label}</span>
              </Link>
            </Button>
            {canMergeBack && tailParts.length > 0 ? (
              <>
                {tailParts.map((segment, i) => (
                  <span key={`${segment}-${i}`} className="flex items-center gap-1">
                    <ChevronRight
                      className="h-3.5 w-3.5 shrink-0 opacity-50"
                      aria-hidden
                    />
                    <span
                      className={
                        i === tailParts.length - 1
                          ? "font-medium text-foreground"
                          : undefined
                      }
                    >
                      {segment}
                    </span>
                  </span>
                ))}
              </>
            ) : null}
            {!canMergeBack && parts.length > 0 ? (
              <>
                {parts.map((segment, i) => (
                  <span key={`${segment}-${i}`} className="flex items-center gap-1">
                    <ChevronRight
                      className="h-3.5 w-3.5 shrink-0 opacity-50"
                      aria-hidden
                    />
                    <span
                      className={
                        i === parts.length - 1
                          ? "font-medium text-foreground"
                          : undefined
                      }
                    >
                      {segment}
                    </span>
                  </span>
                ))}
              </>
            ) : null}
          </>
        ) : (
          parts.map((segment, i) => (
            <span key={`${segment}-${i}`} className="flex items-center gap-1">
              {i > 0 ? (
                <ChevronRight
                  className="h-3.5 w-3.5 shrink-0 opacity-50"
                  aria-hidden
                />
              ) : null}
              <span
                className={
                  i === parts.length - 1
                    ? "font-medium text-foreground"
                    : undefined
                }
              >
                {segment}
              </span>
            </span>
          ))
        )}
      </>
    ) : null;

  if (centerTitle) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <div
          className={cn(
            "grid w-full items-center gap-x-3 gap-y-1",
            "grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
          )}
        >
          <div className="flex min-w-0 items-center justify-start">
            {breadcrumbNav ? (
              <nav
                aria-label="Breadcrumb"
                className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5 text-xs text-muted-foreground"
              >
                {breadcrumbNav}
              </nav>
            ) : null}
          </div>

          <div className="mx-auto flex min-w-0 max-w-[min(24rem,70vw)] items-center justify-center px-2 text-center">
            <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
              {centerTitle}
            </h1>
          </div>

          <div className="flex min-w-0 justify-end">{actions ?? null}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {breadcrumbNav ? (
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5 text-xs text-muted-foreground"
        >
          {breadcrumbNav}
        </nav>
      ) : null}

      {showTitleRow ? (
        <div
          className={cn(
            "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
            !title && "sm:justify-end"
          )}
        >
          {title ? (
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <h1 className="text-2xl font-semibold tracking-tight">
                {title}
              </h1>
              {showDescription ? (
                <p className="text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
          ) : null}
          {actions ?? null}
        </div>
      ) : null}
    </div>
  );
}
