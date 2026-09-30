import AppRoot from '@/components/AppRoot'

/**
 * Optional catch-all — serves every page of the SPA at clean URLs
 * (/, /about, /products?tab=ht, /service-detail/SLUG, /admin, ...).
 * The server passes the resolved path to the client router so the
 * first paint already matches the URL (no flash, no hydration mismatch).
 */
export default async function CatchAllPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug } = await params
  const sp = await searchParams
  const qs = Object.entries(sp ?? {})
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(Array.isArray(v) ? v.join(',') : v as string)}`)
    .join('&')
  const initialPath = '/' + (slug ?? []).join('/') + (qs ? `?${qs}` : '')
  return <AppRoot initialPath={initialPath} />
}
