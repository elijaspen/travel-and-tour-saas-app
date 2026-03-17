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

    async getById(
      id: Row["id"],
      params?: SelectParams,
    ): Promise<ServiceResult<Row>> {
      const q = await from()
      const select = params?.select ?? "*"
      const { data, error } = await q.select(select).eq("id", id as string).single()
      return { data: (data ?? null) as Row | null, error }
    },

    async update(id: Row["id"], payload: Update): Promise<ServiceResult<Row>> {
      const q = await from()
      const { data, error } = await q.update(payload as object).eq("id", id as string).select().single()
      return { data: (data ?? null) as Row | null, error }
    },

    async patch(id: Row["id"], patch: Partial<Update>): Promise<ServiceResult<Row>> {
      const q = await from()
      const { data, error } = await q.update(patch as object).eq("id", id as string).select().single()
      return { data: (data ?? null) as Row | null, error }
    },

    async remove(id: Row["id"]): Promise<ServiceResult<null>> {
      const q = await from()
      const { error } = await q.delete().eq("id", id as string)
      return { data: null, error }
    },

    async listOffset(params?: {
      page?: number
      pageSize?: number
      orderBy?: keyof Row
      ascending?: boolean
      select?: string
      eq?: Partial<Record<keyof Row, unknown>>
    }): Promise<OffsetResult<Row>> {
      const q = await from()
      const page = params?.page ?? 1
      const pageSize = params?.pageSize ?? 20
      const rangeFrom = (page - 1) * pageSize
      const rangeTo = rangeFrom + pageSize - 1
      const orderBy = (params?.orderBy as string) ?? "created_at"
      const ascending = params?.ascending ?? false
      const select = params?.select ?? "*"

      let query = q.select(select, { count: "exact" })
      for (const [col, val] of Object.entries(params?.eq ?? {})) {
        if (val !== undefined) query = query.eq(col, val)
      }
      const { data, error, count } = await query
        .order(orderBy, { ascending })
        .range(rangeFrom, rangeTo)

      return { data: (data ?? []) as unknown as Row[], total: count ?? null, error }
    },

    async listCursor(params?: {
      limit?: number
      cursor?: string
      orderBy?: keyof Row
      ascending?: boolean
      select?: string
      eq?: Partial<Record<keyof Row, unknown>>
    }): Promise<CursorResult<Row>> {
      const q = await from()
      const limit = params?.limit ?? 20
      const orderBy = (params?.orderBy as string) ?? "id"
      const ascending = params?.ascending ?? false
      const select = params?.select ?? "*"

      let query = q.select(select)
      for (const [col, val] of Object.entries(params?.eq ?? {})) {
        if (val !== undefined) query = query.eq(col, val)
      }
      query = query.order(orderBy, { ascending }).limit(limit + 1)

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

