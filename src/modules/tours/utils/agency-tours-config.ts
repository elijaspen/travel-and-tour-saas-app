import type { ListConfig } from "@/modules/shared/list-params"

/**
 * List config for the agency tours page. Safe to import in client components.
 * Keep in sync with tours table columns (database.ts).
 */
export const agencyToursConfig: ListConfig = {
  filters: [
    {
      paramKey: "status",
      label: "Publication",
      options: [
        { value: "all", label: "All tours" },
        {
          value: "published",
          label: "Published",
          filter: { column: "is_active", operator: "eq", value: true },
        },
        {
          value: "unpublished",
          label: "Unpublished",
          filter: { column: "is_active", operator: "eq", value: false },
        },
      ],
      default: "all",
    },
    {
      paramKey: "tourType",
      label: "Schedule type",
      options: [
        { value: "all", label: "All schedule types" },
        {
          value: "on_demand",
          label: "On demand",
          filter: { column: "tour_type", operator: "eq", value: "on_demand" },
        },
        {
          value: "fixed_schedule",
          label: "Fixed schedule",
          filter: {
            column: "tour_type",
            operator: "eq",
            value: "fixed_schedule",
          },
        },
      ],
      default: "all",
    },
  ],
  sorts: [
    {
      value: "created_desc",
      label: "Newest first",
      sort: { column: "created_at", ascending: false },
    },
    {
      value: "created_asc",
      label: "Oldest first",
      sort: { column: "created_at", ascending: true },
    },
    {
      value: "title_asc",
      label: "Title A–Z",
      sort: { column: "title", ascending: true },
    },
    {
      value: "title_desc",
      label: "Title Z–A",
      sort: { column: "title", ascending: false },
    },
    {
      value: "duration_asc",
      label: "Duration (short to long)",
      sort: { column: "duration_days", ascending: true, nullsFirst: false },
    },
    {
      value: "duration_desc",
      label: "Duration (long to short)",
      sort: { column: "duration_days", ascending: false, nullsFirst: false },
    },
  ],
  defaultSort: "created_desc",
  searchColumns: ["title", "city"],
  pageSize: 5,
}
