export type ActionResult<T = undefined> = {
  success: boolean
  message?: string
  fieldErrors?: Record<string, string[]>
  data?: T
}

