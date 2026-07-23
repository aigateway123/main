export interface ApiResponse<T> {
  code: number | string
  message: string
  data: T
  traceId?: string
}
