import type { FilterOperator, QueryFilter, QuerySort } from "./supabase-service"

// ---------------------------------------------------------------------------
// Config types – each service exports one of these as the source of truth
// ---------------------------------------------------------------------------

export type FilterOption = {
  value: string
  label: string
  /** When omitted (e.g. "all"), the filter is not applied. */
  filter?: { column: string; operator: FilterOperator; value: unknown }
}

export type FilterDef = {
  paramKey: string
  label: string
  options: FilterOption[]
  default: string
}

export type SortDef = {
  value: string
  label: string
  sort: { column: string; ascending: boolean; nullsFirst?: boolean }
}

export type ListConfig = {
  filters: FilterDef[]
  sorts: SortDef[]
  defaultSort: string
  searchColumns?: string[]
  pageSize: number
}

// ---------------------------------------------------------------------------
// Parsed params – the shape every list method receives
// ---------------------------------------------------------------------------

export type ListParams = {
  page: number
  pageSize: number
  search: string
  filters: Record<string, string>
  sort: string
}

// ---------------------------------------------------------------------------
// Parse raw URL searchParams into validated ListParams
// ---------------------------------------------------------------------------

export function parseListParams(
  config: ListConfig,
  rawSearchParams: Record<string, string | undefined>,
): ListParams {
  const page = Math.max(1, parseInt(rawSearchParams.page ?? "1", 10) || 1)
  const search = (rawSearchParams.search ?? rawSearchParams.q ?? "").trim()

  const filters: Record<string, string> = {}
  for (const filterDef of config.filters) {
    const rawFilterValue = rawSearchParams[filterDef.paramKey]
    const isValid = filterDef.options.some(
      (option) => option.value === rawFilterValue,
    )
    filters[filterDef.paramKey] = isValid ? rawFilterValue! : filterDef.default
  }

  const isSortValid = config.sorts.some(
    (sortDef) => sortDef.value === rawSearchParams.sort,
  )
  const sort = isSortValid ? rawSearchParams.sort! : config.defaultSort

  return { page, pageSize: config.pageSize, search, filters, sort }
}

// ---------------------------------------------------------------------------
// Build a URL string from ListParams, omitting defaults
// ---------------------------------------------------------------------------

export function buildListUrl(
  basePath: string,
  config: ListConfig,
  params: Partial<ListParams>,
): string {
  const searchParams = new URLSearchParams()

  if (params.search?.trim())
    searchParams.set("search", params.search.trim())
  if (params.page && params.page > 1)
    searchParams.set("page", String(params.page))

  if (params.filters) {
    for (const filterDef of config.filters) {
      const filterValue = params.filters[filterDef.paramKey]
      if (filterValue && filterValue !== filterDef.default)
        searchParams.set(filterDef.paramKey, filterValue)
    }
  }

  if (params.sort && params.sort !== config.defaultSort) {
    searchParams.set("sort", params.sort)
  }

  const queryString = searchParams.toString()
  return queryString ? `${basePath}?${queryString}` : basePath
}

// ---------------------------------------------------------------------------
// Convert ListParams into the shape accepted by base.listOffset()
// ---------------------------------------------------------------------------

export function toQueryParams<Row extends Record<string, unknown> = Record<string, unknown>>(
  config: ListConfig,
  params: ListParams,
) {
  const filters: QueryFilter<Row>[] = []

  for (const filterDef of config.filters) {
    const selectedValue = params.filters[filterDef.paramKey]
    const matchingOption = filterDef.options.find(
      (option) => option.value === selectedValue,
    )
    if (matchingOption?.filter) {
      filters.push(matchingOption.filter as QueryFilter<Row>)
    }
  }

  const sortDef = config.sorts.find(
    (sortOption) => sortOption.value === params.sort,
  )
  const sorts: QuerySort<Row>[] = sortDef
    ? [sortDef.sort as QuerySort<Row>]
    : []

  let searchOrClause: string | undefined
  if (params.search && config.searchColumns?.length) {
    const safeSearchText = params.search.replace(/[%_,()]/g, "")
    if (safeSearchText) {
      searchOrClause = config.searchColumns
        .map((column) => `${column}.ilike.%${safeSearchText}%`)
        .join(",")
    }
  }

  return {
    page: params.page,
    pageSize: params.pageSize,
    filters,
    sorts,
    or: searchOrClause,
  }
}
