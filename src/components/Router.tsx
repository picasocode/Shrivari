'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'

export type PageName = 'home' | 'about' | 'team' | 'sectors' | 'careers' | 'products' | 'manufacturing' | 'services' | 'clients' | 'projects' | 'testimonials' | 'blog' | 'contact' | 'admin' | 'blog-post' | 'service-detail'

interface RouterState {
  page: PageName
  params: Record<string, string>
}

interface RouterContextType {
  router: RouterState
  navigate: (page: PageName, params?: Record<string, string>) => void
  goHome: () => void
}

const RouterContext = createContext<RouterContextType>({
  router: { page: 'home', params: {} },
  navigate: () => {},
  goHome: () => {},
})

export const useRouter = () => useContext(RouterContext)

const VALID_PAGES: PageName[] = ['home', 'about', 'team', 'sectors', 'careers', 'products', 'manufacturing', 'services', 'clients', 'projects', 'testimonials', 'blog', 'contact', 'admin', 'blog-post', 'service-detail']

/** Parse a location.hash into { page, params }.
 *  Supported formats:
 *   - "#products"                     (plain page)
 *   - "#products?tab=ht"              (page + query params)
 *   - "#service-detail/SLUG"          (legacy slug format, kept for old links)
 */
function parseHash(hash: string): { page: PageName; params: Record<string, string> } | null {
  const raw = hash.replace(/^#/, '') || 'home'

  // Legacy "service-detail/SLUG" format
  if (raw.startsWith('service-detail/')) {
    return { page: 'service-detail', params: { slug: decodeURIComponent(raw.replace('service-detail/', '')) } }
  }

  const [page, query = ''] = raw.split('?')
  if (!VALID_PAGES.includes(page as PageName)) return null

  const params: Record<string, string> = {}
  for (const pair of query.split('&')) {
    if (!pair) continue
    const eq = pair.indexOf('=')
    const key = eq === -1 ? pair : pair.slice(0, eq)
    const value = eq === -1 ? '' : pair.slice(eq + 1)
    if (key) params[decodeURIComponent(key)] = decodeURIComponent(value)
  }
  return { page: page as PageName, params }
}

/** Build the canonical hash for a page + params. */
function buildHash(page: PageName, params: Record<string, string>): string {
  if (page === 'service-detail' && params.slug) {
    // Keep the legacy "/slug" format for service detail pages
    return `service-detail/${encodeURIComponent(params.slug)}`
  }
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
  return query ? `${page}?${query}` : page
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [router, setRouter] = useState<RouterState>({ page: 'home', params: {} })

  const navigate = useCallback((page: PageName, params: Record<string, string> = {}) => {
    setRouter({ page, params })
    const nextHash = buildHash(page, params)
    if (window.location.hash !== `#${nextHash}`) {
      window.location.hash = nextHash
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goHome = useCallback(() => {
    navigate('home')
  }, [navigate])

  useEffect(() => {
    const handleHash = () => {
      const parsed = parseHash(window.location.hash)
      if (parsed) setRouter(parsed)
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  return (
    <RouterContext.Provider value={{ router, navigate, goHome }}>
      {children}
    </RouterContext.Provider>
  )
}
