import { createClient as createServerClient } from "@supabase/utils/server"
import type { Database } from "@supabase/types/database"

type Tables = Database["public"]["Tables"]
type TableName = keyof Tables

export type TableRow<T extends TableName> = Tables[T]["Row"]
export type TableInsert<T extends TableName> = Tables[T]["Insert"]
export type TableUpdate<T extends TableName> = Tables[T]["Update"]

export type ServiceResult<T = unknown> = {
  data: T | null
  error: unknown
}
export type OffsetResult<Row> = { data: Row[]; total: number | null; error: unknown }

export type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "like"
  | "ilike"
  | "is"
  | "in"

export type QueryFilter<Row> = {
  column: keyof Row & string
  operator: FilterOperator
  value: unknown
}

export type QuerySort<Row> = {
  column: keyof Row & string
  ascending?: boolean
  nullsFirst?: boolean
}
type CursorResult<Row> = { data: Row[]; nextCursor?: string; error: unknown }
type SelectParams = { select?: string }

export function supabaseService<T extends TableName>(table: T) {
  type Row = TableRow<T>
  type Insert = TableInsert<T>
  type Update = TableUpdate<T>

  async function getClient() {
    return createServerClient()
  }

  // Note: ignoring any because supabase types are not compatible our service factory
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const from = () => (getClient() as Promise<any>).then((s) => s.from(table))

  return {
    async create(payload: Insert): Promise<ServiceResult<Row>> {
      const q = await from()
      const { data, error } = await q.insert(payload as object).select().single()
      return { data: (data ?? null) as Row | null, error }
    },

    async getById(id: string, params?: SelectParams): Promise<ServiceResult<Row>> {
      const q = await from()
      const select = params?.select ?? "*"
      const { data, error } = await q.select(select).eq("id", id as string).single()
      return { data: (data ?? null) as Row | null, error }
    },

    async update(id: string, payload: Update): Promise<ServiceResult<Row>> {
      const q = await from()
      const { data, error } = await q.update(payload as object).eq("id", id as string).select().single()
      return { data: (data ?? null) as Row | null, error }
    },

    async patch(id: string, patch: Partial<Update>): Promise<ServiceResult<Row>> {
      const q = await from()
      const { data, error } = await q.update(patch as object).eq("id", id as string).select().single()
      return { data: (data ?? null) as Row | null, error }
    },

    async remove(id: string): Promise<ServiceResult<null>> {
      const q = await from()
      const { error } = await q.delete().eq("id", id as string)
      return { data: null, error }
    },

    async listOffset(params?: {
      page?: number
      pageSize?: number
      select?: string
      filters?: QueryFilter<Row>[]
      sorts?: QuerySort<Row>[]
      or?: string
    }): Promise<OffsetResult<Row>> {
      const q = await from()
      const page = params?.page ?? 1
      const pageSize = params?.pageSize ?? 20
      const rangeFrom = (page - 1) * pageSize
      const rangeTo = rangeFrom + pageSize - 1
      const select = params?.select ?? "*"

      let query = q.select(select, { count: "exact" })

      if (params?.filters?.length) {
        for (const f of params.filters) {
          query = query.filter(f.column, f.operator, f.value)
        }
      }

      if (params?.or) {
        query = query.or(params.or)
      }

      if (params?.sorts?.length) {
        for (const s of params.sorts) {
          query = query.order(s.column, {
            ascending: s.ascending ?? true,
            nullsFirst: s.nullsFirst ?? false,
          })
        }
      } else {
        query = query.order("id" as keyof Row & string, { ascending: false })
      }

      const { data, error, count } = await query.range(rangeFrom, rangeTo)

      return { data: (data ?? []) as unknown as Row[], total: count ?? null, error }
    },

    async listCursor(params?: {
      limit?: number
      cursor?: string
      select?: string
      filters?: QueryFilter<Row>[]
      sorts?: QuerySort<Row>[]
    }): Promise<CursorResult<Row>> {
      const q = await from()
      const limit = params?.limit ?? 20
      const select = params?.select ?? "*"
      const firstSort = params?.sorts?.[0]
      const orderBy = (firstSort?.column as string) ?? "id"
      const ascending = firstSort?.ascending ?? false

      let query = q.select(select)

      if (params?.filters?.length) {
        for (const f of params.filters) {
          query = query.filter(f.column, f.operator, f.value)
        }
      }

      if (params?.sorts?.length) {
        for (const s of params.sorts) {
          query = query.order(s.column, {
            ascending: s.ascending ?? true,
            nullsFirst: s.nullsFirst ?? false,
          })
        }
      } else {
        query = query.order("id" as keyof Row & string, { ascending: false })
      }

      query = query.limit(limit + 1)

      if (params?.cursor) {
        query = ascending
          ? query.gt(orderBy, params.cursor)
          : query.lt(orderBy, params.cursor)
      }

      const { data, error } = await query
      if (error || !data) return { data: [], error }

      const hasMore = data.length > limit
      const pageData = hasMore ? data.slice(0, limit) : data
      const nextCursor = hasMore
        ? (pageData[pageData.length - 1] as Record<string, string>)[orderBy]
        : undefined

      return { data: pageData as unknown as Row[], nextCursor, error: null }
    },
  }
}

