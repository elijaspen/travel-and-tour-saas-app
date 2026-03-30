"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PaginationVariant = "compact" | "full";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: PaginationVariant;
  /** For "full" variant: pages to show on each side of current (default: 2) */
  siblingCount?: number;
  className?: string;
};

function getPageNumbers(
  page: number,
  totalPages: number,
  siblingCount: number
): (number | "ellipsis")[] {
  if (totalPages <= 1) return [];
  if (totalPages <= siblingCount * 2 + 3) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(1, page - siblingCount);
  const rightSibling = Math.min(totalPages, page + siblingCount);

  const pageSet = new Set<number>();
  pageSet.add(1);
  pageSet.add(totalPages);
  for (let i = leftSibling; i <= rightSibling; i++) pageSet.add(i);

  const sorted = [...pageSet].sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    result.push(sorted[i]);
    if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
      result.push("ellipsis");
    }
  }
  return result;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  variant = "full",
  siblingCount = 2,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center justify-between border-t px-6 py-3",
          className
        )}
      >
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={!canGoPrev}
            onClick={() => canGoPrev && onPageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={!canGoNext}
            onClick={() => canGoNext && onPageChange(page + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const pageNumbers = getPageNumbers(page, totalPages, siblingCount);

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2",
        className
      )}
    >
      <Button
        variant="outline"
        size="sm"
        disabled={!canGoPrev}
        onClick={() => canGoPrev && onPageChange(page - 1)}
      >
        Previous
      </Button>
      {pageNumbers.map((item, idx) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${idx}`}
            className="px-2 text-sm text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Button
            key={item}
            variant={page === item ? "default" : "outline"}
            size="icon"
            className="h-10 w-10"
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        )
      )}
      <Button
        variant="outline"
        size="sm"
        disabled={!canGoNext}
        onClick={() => canGoNext && onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
