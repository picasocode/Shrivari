'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'

export type PageName = 'home' | 'about' | 'team' | 'sectors' | 'careers' | 'products' | 'manufacturing' | 'services' | 'clients' | 'projects' | 'testimonials' | 'blog' | 'contact' | 'admin' | 'blog-post' | 'service-detail' | 'quality'

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

const VALID_PAGES: PageName[] = ['home', 'about', 'team', 'sectors', 'careers', 'products', 'manufacturing', 'services', 'clients', 'projects', 'testimonials', 'blog', 'contact', 'admin', 'blog-post', 'service-detail', 'quality']

/** Parse a URL path into { page, params }.
 *  Supported formats:
 *   - "/products"                     (plain page)
 *   - "/products?tab=ht"              (page + query params)
 *   - "/service-detail/SLUG"          (legacy slug format, kept for old links)
 */
export function parsePath(path: string): { page: PageName; params: Record<string, string> } | null {
  const raw = (path.replace(/^\/+/, '').replace(/\/+$/, '') || 'home').split('#')[0]

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

/** Build the canonical clean path for a page + params (e.g. "/about", "/products?tab=ht"). */
function buildPath(page: PageName, params: Record<string, string>): string {
  if (page === 'service-detail' && params.slug) {
    return `/service-detail/${encodeURIComponent(params.slug)}`
  }
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
  const suffix = query ? `/${page}?${query}` : `/${page}`
  return page === 'home' ? (query ? `/?${query}` : '/') : suffix
}

export function RouterProvider({ children, initialPath }: { children: React.ReactNode; initialPath?: string }) {
  const [router, setRouter] = useState<RouterState>(() => {
    const path = initialPath ?? (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/')
    return parsePath(path) ?? { page: 'home', params: {} }
  })

  const navigate = useCallback((page: PageName, params: Record<string, string> = {}) => {
    setRouter({ page, params })
    const nextPath = buildPath(page, params)
    const current = window.location.pathname + window.location.search
    if (current !== nextPath) {
      window.history.pushState({}, '', nextPath)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goHome = useCallback(() => {
    navigate('home')
  }, [navigate])

  useEffect(() => {
    // Legacy hash links (#/about, #about, #products?tab=ht) → clean paths.
    const legacy = window.location.hash
    let legacyTimer: ReturnType<typeof setTimeout> | undefined
    if (legacy && legacy !== '#') {
      legacyTimer = setTimeout(() => {
        const raw = legacy.replace(/^#\/?/, '')
        const parsed = parsePath('/' + raw)
        if (parsed) {
          window.history.replaceState({}, '', raw ? `/${raw}` : '/')
          setRouter(parsed)
        }
      }, 0)
    }
    const handlePop = () => {
      setRouter(parsePath(window.location.pathname + window.location.search) ?? { page: 'home', params: {} })
    }
    window.addEventListener('popstate', handlePop)
    return () => {
      if (legacyTimer) clearTimeout(legacyTimer)
      window.removeEventListener('popstate', handlePop)
    }
  }, [])

  return (
    <RouterContext.Provider value={{ router, navigate, goHome }}>
      {children}
    </RouterContext.Provider>
  )
}
