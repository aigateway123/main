export function getApiBaseUrl(): string {
  // In production (Docker + Nginx), API is proxied via same-origin /api/
  // In development, set VITE_API_BASE_URL=http://localhost:8080
  return import.meta.env.VITE_API_BASE_URL ?? ''
}
