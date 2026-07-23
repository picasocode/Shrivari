'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'

export type PageName = 'home' | 'about' | 'team' | 'sectors' | 'careers' | 'products' | 'services' | 'clients' | 'projects' | 'testimonials' | 'blog' | 'contact' | 'admin' | 'blog-post' | 'service-detail'

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

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [router, setRouter] = useState<RouterState>({ page: 'home', params: {} })

  const navigate = useCallback((page: PageName, params: Record<string, string> = {}) => {
    setRouter({ page, params })
    if (page === 'service-detail' && params.slug) {
      window.location.hash = `service-detail/${params.slug}`
    } else {
      window.location.hash = page
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goHome = useCallback(() => {
    navigate('home')
  }, [navigate])

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || 'home'
      // Handle service-detail/SLUG format
      if (hash.startsWith('service-detail/')) {
        const slug = hash.replace('service-detail/', '')
        setRouter({ page: 'service-detail', params: { slug } })
        return
      }
      if (['home', 'about', 'team', 'sectors', 'careers', 'products', 'services', 'clients', 'projects', 'testimonials', 'blog', 'contact', 'admin', 'blog-post', 'service-detail'].includes(hash)) {
        setRouter({ page: hash as PageName, params: {} })
      }
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
