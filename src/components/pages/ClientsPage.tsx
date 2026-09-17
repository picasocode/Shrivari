'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ChevronRight,
  ChevronLeft,
  Building2,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/components/Router'
import { CLIENT_GALLERY, CATEGORY_LABELS, type GalleryClient } from '@/lib/client-gallery'

/* ─── Tokens (used very sparingly — coral hairlines + navy text only) ─── */
const CORAL = '#E8751A'
const INK = '#1A1A2E'

/* ─── Unified display item: official gallery logos only (no client names) ─── */
interface DisplayClient {
  key: string
  name: string
  src: string | null
  label: string
}

/* ─── FadeIn Helper ─── */
function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, duration = 1.6 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const step = target / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return <span ref={ref}>{count}</span>
}

/* ─── A single logo item for a clean carded grid ───
   Logo only — client identities are intentionally not displayed anywhere
   on the public page (no name captions, no tooltips). The logo fills the
   card area (object-contain — never cropped). */
function LogoItem({ client }: { client: DisplayClient }) {
  const [errored, setErrored] = useState(false)
  const showImage = client.src && !errored

  return (
    <div className="flex items-center justify-center p-2.5">
      <div
        className="relative flex items-center justify-center w-full max-w-[250px] h-36 md:h-48 rounded-xl border border-slate-200 bg-white shadow-md hover:shadow-xl hover:-translate-y-0.5 hover:border-slate-300 transition-all duration-300 p-4 md:p-5"
      >
        {showImage && (
          <img
            src={client.src as string}
            alt={client.name}
            onError={() => setErrored(true)}
            className="max-w-full max-h-full w-auto h-auto object-contain"
            loading="lazy"
          />
        )}
      </div>
    </div>
  )
}

/* ─── Pagination config: 5 logos per row, 10 rows per page = 50 per page ─── */
const PAGE_SIZE = 50

/* ─── Main Component ─── */
export default function ClientsPage() {
  const { navigate } = useRouter()
  const [activeFilter, setActiveFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  /* Categories in first-appearance order (mirrors the official grouping) */
  const categories = useMemo(() => {
    const seen: string[] = []
    for (const c of CLIENT_GALLERY) {
      if (!seen.includes(c.category)) seen.push(c.category)
    }
    return seen
  }, [])

  /* Official gallery only — exactly the logos from the company's official
     clients page, no DB-sourced entries. */
  const allClients = useMemo<DisplayClient[]>(() => {
    return CLIENT_GALLERY.map((c: GalleryClient) => ({
      key: c.id,
      name: c.name,
      src: c.src,
      label: CATEGORY_LABELS[c.category] || c.category,
    }))
  }, [])

  const filteredClients = useMemo(() => {
    if (activeFilter === 'All') return allClients
    const label = CATEGORY_LABELS[activeFilter]
    return allClients.filter(c => c.label === label)
  }, [allClients, activeFilter])

  const stats = useMemo(() => {
    return [
      { label: 'Trusted Clients', value: allClients.length, suffix: '+' },
      { label: 'Industries Served', value: categories.length, suffix: '' },
      { label: 'Projects Delivered', value: 500, suffix: '+' },
      { label: 'Years of Trust', value: 29, suffix: '+' },
    ]
  }, [allClients, categories])

  const listedClients = filteredClients

  // Pagination: slice the filtered list to the current page
  const totalPages = Math.max(1, Math.ceil(listedClients.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const startIdx = (safePage - 1) * PAGE_SIZE
  const endIdx = startIdx + PAGE_SIZE
  const pageClients = listedClients.slice(startIdx, endIdx)

  // Change filter AND reset to page 1 in the same handler (avoids effect-based setState)
  const handleFilterChange = (cat: string) => {
    setActiveFilter(cat)
    setCurrentPage(1)
  }

  const goToPage = (p: number) => {
    setCurrentPage(p)
    // Scroll the logo grid into view so the user sees the new page
    if (typeof window !== 'undefined') {
      const el = document.getElementById('client-logos')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* ════════════════ HERO — minimal, white, no background fill ════════════════ */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-[116px] pb-14 md:pb-20">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm mb-10"
          >
            <button
              onClick={() => navigate('home')}
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-slate-700 font-medium">Clients</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-3xl"
          >
            {/* Coral hairline label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-[2px]" style={{ background: CORAL }} />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
                Partnership Showcase
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] mb-5" style={{ color: INK }}>
              Trusted By
              <br />
              Industry Leaders
            </h1>

            <p className="text-slate-500 text-lg md:text-xl max-w-2xl leading-relaxed">
              We build lasting partnerships with companies that shape the
              future. A growing network of organizations across every major
              industry that rely on us to power their success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ KEY INSIGHTS — single-color editorial stats band ════════════════ */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-14 md:py-16">
          {/* Single-color label (no coral) */}
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-10 md:mb-12">
              <span className="h-px w-8 bg-slate-300" />
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-slate-400">
                By the Numbers
              </span>
              <span className="h-px w-8 bg-slate-300" />
            </div>
          </FadeIn>

          {/* Monochrome stats — all INK, no color accents */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-y-0">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.08}>
                <div className="text-center md:px-4">
                  <div className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-3" style={{ color: INK }}>
                    <AnimatedCounter target={stat.value} />
                    {stat.suffix}
                  </div>
                  <div className="text-[11px] md:text-xs font-semibold tracking-[0.15em] uppercase text-slate-500">
                    {stat.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ FILTER — minimal pills, mirrors official industry grouping ════════════════ */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-10">
          <FadeIn>
            <div className="flex flex-wrap justify-center gap-2">
              {['All', ...categories].map(cat => {
                const active = activeFilter === cat
                const label = cat === 'All' ? 'All' : CATEGORY_LABELS[cat] || cat
                return (
                  <button
                    key={cat}
                    onClick={() => handleFilterChange(cat)}
                    className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border"
                    style={{
                      background: active ? INK : 'transparent',
                      color: active ? '#FFFFFF' : '#6B7280',
                      borderColor: active ? INK : '#E5E7EB',
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════ CLIENT LOGOS — BIG CARDED GRID, 5 PER ROW, PAGINATED ════════════════ */}
      {/* Each card: logo only — no client names are shown on the public page. */}
      <section id="client-logos" className="bg-white py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
          {/* Section label */}
          <div className="flex items-center justify-center gap-3 mb-10 md:mb-12">
            <span className="h-px w-8 bg-slate-300" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-slate-400">
              Our Clients
            </span>
            <span className="h-px w-8 bg-slate-300" />
          </div>

          {listedClients.length === 0 ? (
            <div className="text-center py-20">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500 text-lg">No clients found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4">
              {pageClients.map(c => (
                <LogoItem key={c.key} client={c} />
              ))}
            </div>
          )}

          {/* Range + count footer */}
          {listedClients.length > 0 && (
            <p className="text-center text-xs text-slate-400 mt-10 tracking-wide">
              Showing {startIdx + 1}–{Math.min(endIdx, listedClients.length)} of {listedClients.length} clients
              {activeFilter !== 'All'
                ? ` in ${CATEGORY_LABELS[activeFilter] || activeFilter}`
                : ' across all industries'}
            </p>
          )}

          {/* Pagination controls — only if more than one page */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage === 1}
                aria-label="Previous page"
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1
                const active = page === safePage
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    aria-label={`Page ${page}`}
                    aria-current={active ? 'page' : undefined}
                    className="w-10 h-10 rounded-full border text-sm font-semibold transition-colors"
                    style={{
                      background: active ? '#1A1A2E' : 'transparent',
                      color: active ? '#FFFFFF' : '#475569',
                      borderColor: active ? '#1A1A2E' : '#E5E7EB',
                    }}
                  >
                    {page}
                  </button>
                )
              })}

              <button
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage === totalPages}
                aria-label="Next page"
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════ CTA — minimal, white, no background fill ════════════════ */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-20 md:py-28 text-center">
          <FadeIn>
            {/* Coral hairlines flanking label */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="w-8 h-[2px]" style={{ background: CORAL }} />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
                Become a Partner
              </span>
              <span className="w-8 h-[2px]" style={{ background: CORAL }} />
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold mb-5 leading-tight" style={{ color: INK }}>
              Ready to Join Our
              <br />
              Network of Leaders?
            </h2>

            <p className="text-slate-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Partner with us and gain access to world-class solutions,
              dedicated support, and a community of industry pioneers.
            </p>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 py-6 text-base font-semibold border-2 transition-all duration-300 group hover:text-white"
              style={{ borderColor: CORAL, color: CORAL }}
              onClick={() => navigate('contact')}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLButtonElement).style.background = CORAL
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              }}
            >
              Get In Touch
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
