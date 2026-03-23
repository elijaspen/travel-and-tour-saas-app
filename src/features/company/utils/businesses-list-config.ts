import type { ListConfig } from "@/features/shared/list-params"

/**
 * List config for the admin businesses page. Safe to import in client components.
 * Keep in sync with companies table columns (database.ts).
 */
export const businessesListConfig: ListConfig = {
  filters: [
    {
      paramKey: "status",
      label: "Status",
      options: [
        { value: "all", label: "All" },
        {
          value: "pending",
          label: "Pending",
          filter: { column: "status", operator: "eq", value: "pending" },
        },
        {
          value: "approved",
          label: "Approved",
          filter: { column: "status", operator: "eq", value: "approved" },
        },
        {
          value: "declined",
          label: "Declined",
          filter: { column: "status", operator: "eq", value: "declined" },
        },
        {
          value: "suspended",
          label: "Suspended",
          filter: { column: "status", operator: "eq", value: "suspended" },
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
  ],
  defaultSort: "created_desc",
  pageSize: 20,
}
