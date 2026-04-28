"use client";

import type { ReactNode } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  /** Fixed width, e.g. "60px", "100px", "min-content" */
  width?: string;
  /** Use flex-1 for flexible width (only one column per table should use this typically) */
  flex?: boolean;
  /** Alignment: "left" | "center" | "right" */
  align?: "left" | "center" | "right";
  /** Additional class for header cell */
  headerClassName?: string;
  /** Additional class for body cells */
  cellClassName?: string;
  /** Render cell content */
  cell: (row: T) => ReactNode;
};

export type DataTableDensity = "compact" | "default" | "relaxed";

export type DataTableLayout = "table" | "flex";

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  /** Extract unique key for each row */
  getRowId: (row: T) => string | number;
  /** Row density affects min-height and padding */
  density?: DataTableDensity;
  /** "table" uses semantic table; "flex" uses div-based flex layout (original tours style) */
  layout?: DataTableLayout;
  /** Show checkbox column; "all" shows header "All" checkbox for bulk select */
  selectable?: boolean | "all";
  /** Selected row IDs (when selectable) */
  selectedIds?: Set<string | number>;
  /** Called when selection changes (when selectable) */
  onSelectionChange?: (selectedIds: Set<string | number>) => void;
  /** Content when data is empty */
  emptyState?: ReactNode;
  /** Additional class for the wrapper */
  className?: string;
};

const DENSITY_STYLES: Record<
  DataTableDensity,
  { header: string; row: string; cell: string; flexCell: string }
> = {
  compact: {
    header: "h-9 px-4",
    row: "min-h-9",
    cell: "px-4 py-2",
    flexCell: "py-2",
  },
  default: {
    header: "min-h-12 px-6",
    row: "min-h-12",
    cell: "px-6 py-3",
    flexCell: "py-3",
  },
  relaxed: {
    header: "min-h-12 px-6",
    row: "min-h-[96px]",
    cell: "px-6 py-4",
    flexCell: "py-4",
  },
};

export function DataTable<T>({
  columns,
  data,
  getRowId,
  density = "default",
  layout = "table",
  selectable = false,
  selectedIds,
  onSelectionChange,
  emptyState,
  className,
}: DataTableProps<T>) {
  const densityStyles = DENSITY_STYLES[density];
  const allSelected =
    selectable && data.length > 0 && selectedIds
      ? data.every((row) => selectedIds.has(getRowId(row)))
      : false;
  const someSelected =
    selectable && selectedIds && selectedIds.size > 0 ? true : false;

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(data.map((row) => getRowId(row))));
    }
  };

  const handleSelectRow = (id: string | number) => {
    if (!onSelectionChange || !selectedIds) return;
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  };

  const getCellWidthClass = (col: DataTableColumn<T>) =>
    col.flex ? "flex-1 min-w-0" : "";

  if (layout === "flex") {
    return (
      <div
        className={cn(
          "rounded-lg border border-border bg-card overflow-hidden",
          className
        )}
      >
        {/* Flex header row */}
        <div
          className={cn(
            "flex items-center border-b border-border bg-muted px-6",
            densityStyles.header
          )}
        >
          {selectable && (
            <div className="flex w-[60px] shrink-0 items-center gap-2">
              <Checkbox
                checked={
                  someSelected && !allSelected ? "indeterminate" : allSelected
                }
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
              {selectable === "all" && (
                <span className="text-[13px] font-medium">All</span>
              )}
            </div>
          )}
          {columns.map((col) => (
            <div
              key={col.id}
              className={cn(
                "text-[13px] font-semibold text-foreground",
                getCellWidthClass(col),
                col.align === "center" && "text-center",
                col.align === "right" && "text-right"
              )}
              style={
                col.width && !col.flex
                  ? { width: col.width, minWidth: col.width }
                  : undefined
              }
            >
              {col.header}
            </div>
          ))}
        </div>
        {/* Flex body rows */}
        {data.length === 0 ? (
          <div className="px-6 py-12 text-center text-muted-foreground">
            {emptyState || "No data"}
          </div>
        ) : (
          data.map((row) => {
            const id = getRowId(row);
            const isSelected = selectable && selectedIds?.has(id);
            return (
              <div
                key={id}
                className={cn(
                  "flex items-center border-b border-border px-6 transition-colors last:border-b-0 hover:bg-muted/50",
                  densityStyles.row
                )}
              >
                {selectable && (
                  <div className="flex w-[60px] shrink-0 items-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleSelectRow(id)}
                      aria-label={`Select row ${id}`}
                    />
                  </div>
                )}
                {columns.map((col) => (
                  <div
                    key={col.id}
                    className={cn(
                      getCellWidthClass(col),
                      col.cellClassName,
                      densityStyles.flexCell,
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right"
                    )}
                    style={
                      col.width && !col.flex
                        ? { width: col.width, minWidth: col.width }
                        : undefined
                    }
                  >
                    {col.cell(row)}
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card overflow-hidden",
        className
      )}
    >
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="border-b border-border hover:bg-transparent bg-muted">
            {selectable && (
              <TableHead
                className={cn(
                  "pl-6 pr-0",
                  densityStyles.header,
                  density === "relaxed" && "align-middle"
                )}
                style={{ width: 60, minWidth: 60 }}
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      someSelected && !allSelected ? "indeterminate" : allSelected
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                  {selectable === "all" && (
                    <span className="text-[13px] font-medium">All</span>
                  )}
                </div>
              </TableHead>
            )}
            {columns.map((col) => (
              <TableHead
                key={col.id}
                className={cn(
                  "text-[13px] font-semibold",
                  col.headerClassName,
                  densityStyles.header,
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                  density === "relaxed" && "align-middle"
                )}
                style={
                  col.width && !col.flex
                    ? { width: col.width, minWidth: col.width }
                    : col.flex
                      ? { width: "1%" }
                      : undefined
                }
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            emptyState ? (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="p-0 border-0"
                >
                  {emptyState}
                </TableCell>
              </TableRow>
            ) : (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-12 text-center text-muted-foreground"
                >
                  No data
                </TableCell>
              </TableRow>
            )
          ) : (
            data.map((row) => {
              const id = getRowId(row);
              const isSelected = selectable && selectedIds?.has(id);

              return (
                <TableRow
                  key={id}
                  className={cn(
                    densityStyles.row,
                    "border-b border-border last:border-b-0"
                  )}
                >
                  {selectable && (
                    <TableCell
                      className={cn(
                        "pl-6 pr-0",
                        densityStyles.cell,
                        "align-middle"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleSelectRow(id)}
                        aria-label={`Select row ${id}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      className={cn(
                        col.cellClassName,
                        densityStyles.cell,
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                        density === "relaxed" && "align-middle",
                        col.flex && "w-0"
                      )}
                      style={
                        col.width && !col.flex
                          ? { width: col.width, minWidth: col.width }
                          : col.flex
                            ? { width: "1%" }
                            : undefined
                      }
                    >
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
