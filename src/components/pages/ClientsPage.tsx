'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ChevronRight,
  ChevronLeft,
  Building2,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/components/Router'
import { fetchClients, type Client } from '@/lib/api'

/* ─── Tokens (used very sparingly — coral hairlines + navy text only) ─── */
const CORAL = '#E8751A'
const INK = '#1A1A2E'

/* ─── Fallback clients with REAL brand logo URLs (Google favicon API). ───
   Used when the Supabase API is unavailable. In production, real logos
   come from the Client table's logoUrl field. Each logo has an
   onError → monogram fallback for resilience. */
const FAV = (d: string) => `https://www.google.com/s2/favicons?domain=${d}&sz=128`
const FALLBACK_CLIENTS: Client[] = [
  { id: 'f1', name: 'Ashok Leyland', industry: 'Auto & Ancillary', location: '', logoUrl: FAV('ashokleyland.com'), description: '', order: 1, active: true, createdAt: '', updatedAt: '' },
  { id: 'f2', name: 'TVS Motor', industry: 'Auto & Ancillary', location: '', logoUrl: FAV('tvsmotor.com'), description: '', order: 2, active: true, createdAt: '', updatedAt: '' },
  { id: 'f3', name: 'Tata Motors', industry: 'Auto & Ancillary', location: '', logoUrl: FAV('tatamotors.com'), description: '', order: 3, active: true, createdAt: '', updatedAt: '' },
  { id: 'f4', name: 'Mahindra', industry: 'Auto & Ancillary', location: '', logoUrl: FAV('mahindra.com'), description: '', order: 4, active: true, createdAt: '', updatedAt: '' },
  { id: 'f5', name: 'Bajaj Auto', industry: 'Auto & Ancillary', location: '', logoUrl: FAV('bajajauto.com'), description: '', order: 5, active: true, createdAt: '', updatedAt: '' },
  { id: 'f6', name: 'Hyundai Motor', industry: 'Auto & Ancillary', location: '', logoUrl: FAV('hyundai.com'), description: '', order: 6, active: true, createdAt: '', updatedAt: '' },
  { id: 'f7', name: 'Maruti Suzuki', industry: 'Auto & Ancillary', location: '', logoUrl: FAV('marutisuzuki.com'), description: '', order: 7, active: true, createdAt: '', updatedAt: '' },
  { id: 'f8', name: 'Larsen & Toubro', industry: 'Engineering', location: '', logoUrl: FAV('larsentoubro.com'), description: '', order: 8, active: true, createdAt: '', updatedAt: '' },
  { id: 'f9', name: 'Bharat Forge', industry: 'Forging', location: '', logoUrl: FAV('bharatforge.com'), description: '', order: 9, active: true, createdAt: '', updatedAt: '' },
  { id: 'f10', name: 'Cummins India', industry: 'Engineering', location: '', logoUrl: FAV('cummins.com'), description: '', order: 10, active: true, createdAt: '', updatedAt: '' },
  { id: 'f11', name: 'Schneider Electric', industry: 'Electronics', location: '', logoUrl: FAV('se.com'), description: '', order: 11, active: true, createdAt: '', updatedAt: '' },
  { id: 'f12', name: 'Siemens', industry: 'Electronics', location: '', logoUrl: FAV('siemens.com'), description: '', order: 12, active: true, createdAt: '', updatedAt: '' },
  { id: 'f13', name: 'ABB', industry: 'Electronics', location: '', logoUrl: FAV('abb.com'), description: '', order: 13, active: true, createdAt: '', updatedAt: '' },
  { id: 'f14', name: 'Havells', industry: 'Electronics', location: '', logoUrl: FAV('havells.com'), description: '', order: 14, active: true, createdAt: '', updatedAt: '' },
  { id: 'f15', name: 'Crompton', industry: 'Electronics', location: '', logoUrl: FAV('crompton.co.in'), description: '', order: 15, active: true, createdAt: '', updatedAt: '' },
  { id: 'f16', name: 'BHEL', industry: 'Power Equipment', location: '', logoUrl: FAV('bhel.in'), description: '', order: 16, active: true, createdAt: '', updatedAt: '' },
  { id: 'f17', name: 'Tata Power', industry: 'Power & Energy', location: '', logoUrl: FAV('tatapower.com'), description: '', order: 17, active: true, createdAt: '', updatedAt: '' },
  { id: 'f18', name: 'Adani Power', industry: 'Power & Energy', location: '', logoUrl: FAV('adani.com'), description: '', order: 18, active: true, createdAt: '', updatedAt: '' },
  { id: 'f19', name: 'NTPC', industry: 'Power & Energy', location: '', logoUrl: FAV('ntpc.co.in'), description: '', order: 19, active: true, createdAt: '', updatedAt: '' },
  { id: 'f20', name: 'Power Grid', industry: 'Power & Energy', location: '', logoUrl: FAV('powergrid.in'), description: '', order: 20, active: true, createdAt: '', updatedAt: '' },
  { id: 'f21', name: 'JSW Steel', industry: 'Metal', location: '', logoUrl: FAV('jsw.in'), description: '', order: 21, active: true, createdAt: '', updatedAt: '' },
  { id: 'f22', name: 'Tata Steel', industry: 'Metal', location: '', logoUrl: FAV('tatasteel.com'), description: '', order: 22, active: true, createdAt: '', updatedAt: '' },
  { id: 'f23', name: 'Vedanta', industry: 'Metal', location: '', logoUrl: FAV('vedantaresources.com'), description: '', order: 23, active: true, createdAt: '', updatedAt: '' },
  { id: 'f24', name: 'Hindalco', industry: 'Metal', location: '', logoUrl: FAV('hindalco.com'), description: '', order: 24, active: true, createdAt: '', updatedAt: '' },
  { id: 'f25', name: 'SAIL', industry: 'Metal', location: '', logoUrl: FAV('sail.co.in'), description: '', order: 25, active: true, createdAt: '', updatedAt: '' },
  { id: 'f26', name: 'Reliance Industries', industry: 'Petroleum', location: '', logoUrl: FAV('ril.com'), description: '', order: 26, active: true, createdAt: '', updatedAt: '' },
  { id: 'f27', name: 'IOCL', industry: 'Petroleum', location: '', logoUrl: FAV('iocl.com'), description: '', order: 27, active: true, createdAt: '', updatedAt: '' },
  { id: 'f28', name: 'BPCL', industry: 'Petroleum', location: '', logoUrl: FAV('bharatpetroleum.com'), description: '', order: 28, active: true, createdAt: '', updatedAt: '' },
  { id: 'f29', name: 'HPCL', industry: 'Petroleum', location: '', logoUrl: FAV('hpcl.co.in'), description: '', order: 29, active: true, createdAt: '', updatedAt: '' },
  { id: 'f30', name: 'ONGC', industry: 'Petroleum', location: '', logoUrl: FAV('ongcindia.com'), description: '', order: 30, active: true, createdAt: '', updatedAt: '' },
  { id: 'f31', name: 'Tata Chemicals', industry: 'Chemicals', location: '', logoUrl: FAV('tatachemicals.com'), description: '', order: 31, active: true, createdAt: '', updatedAt: '' },
  { id: 'f32', name: 'UPL', industry: 'Chemicals', location: '', logoUrl: FAV('upl-ltd.com'), description: '', order: 32, active: true, createdAt: '', updatedAt: '' },
  { id: 'f33', name: 'Pidilite', industry: 'Chemicals', location: '', logoUrl: FAV('pidilite.com'), description: '', order: 33, active: true, createdAt: '', updatedAt: '' },
  { id: 'f34', name: 'TCS', industry: 'IT', location: '', logoUrl: FAV('tcs.com'), description: '', order: 34, active: true, createdAt: '', updatedAt: '' },
  { id: 'f35', name: 'Infosys', industry: 'IT', location: '', logoUrl: FAV('infosys.com'), description: '', order: 35, active: true, createdAt: '', updatedAt: '' },
  { id: 'f36', name: 'Wipro', industry: 'IT', location: '', logoUrl: FAV('wipro.com'), description: '', order: 36, active: true, createdAt: '', updatedAt: '' },
  { id: 'f37', name: 'HCL Tech', industry: 'IT', location: '', logoUrl: FAV('hcltech.com'), description: '', order: 37, active: true, createdAt: '', updatedAt: '' },
  { id: 'f38', name: 'Tech Mahindra', industry: 'IT', location: '', logoUrl: FAV('techmahindra.com'), description: '', order: 38, active: true, createdAt: '', updatedAt: '' },
  { id: 'f39', name: 'Apollo Hospitals', industry: 'Hospitals & Institutions', location: '', logoUrl: FAV('apollohospitals.com'), description: '', order: 39, active: true, createdAt: '', updatedAt: '' },
  { id: 'f40', name: 'Fortis Healthcare', industry: 'Hospitals & Institutions', location: '', logoUrl: FAV('fortishealthcare.com'), description: '', order: 40, active: true, createdAt: '', updatedAt: '' },
  { id: 'f41', name: 'Cipla', industry: 'Pharma', location: '', logoUrl: FAV('cipla.com'), description: '', order: 41, active: true, createdAt: '', updatedAt: '' },
  { id: 'f42', name: 'Sun Pharma', industry: 'Pharma', location: '', logoUrl: FAV('sunpharma.com'), description: '', order: 42, active: true, createdAt: '', updatedAt: '' },
  { id: 'f43', name: 'Dr. Reddy\'s', industry: 'Pharma', location: '', logoUrl: FAV('drreddys.com'), description: '', order: 43, active: true, createdAt: '', updatedAt: '' },
  { id: 'f44', name: 'Lupin', industry: 'Pharma', location: '', logoUrl: FAV('lupin.com'), description: '', order: 44, active: true, createdAt: '', updatedAt: '' },
  { id: 'f45', name: 'DLF', industry: 'Real Estate', location: '', logoUrl: FAV('dlf.in'), description: '', order: 45, active: true, createdAt: '', updatedAt: '' },
  { id: 'f46', name: 'Godrej Properties', industry: 'Real Estate', location: '', logoUrl: FAV('godrejproperties.com'), description: '', order: 46, active: true, createdAt: '', updatedAt: '' },
  { id: 'f47', name: 'ITC', industry: 'Food Industry', location: '', logoUrl: FAV('itcportal.com'), description: '', order: 47, active: true, createdAt: '', updatedAt: '' },
  { id: 'f48', name: 'Britannia', industry: 'Food Industry', location: '', logoUrl: FAV('britannia.co.in'), description: '', order: 48, active: true, createdAt: '', updatedAt: '' },
  { id: 'f49', name: 'UltraTech', industry: 'Cement', location: '', logoUrl: FAV('ultratechcement.com'), description: '', order: 49, active: true, createdAt: '', updatedAt: '' },
  { id: 'f50', name: 'Ambuja', industry: 'Cement', location: '', logoUrl: FAV('ambujacement.com'), description: '', order: 50, active: true, createdAt: '', updatedAt: '' },
]

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

/* ─── Build a clean monogram from a client name (logo-style mark) ─── */
function buildMonogram(name: string): string {
  const parts = (name || '?').trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  // Single short word + next word → combine initials (e.g. "Adani Power" → "AP")
  if (parts[0].length <= 4) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
  }
  return parts[0].slice(0, 2).toUpperCase()
}

/* ─── A single logo item for a clean listed grid ───
   No box, no border, no animation. Logo renders in its OWN color (natural).
   Falls back to a clean monogram if the image fails. */
function LogoItem({ client }: { client: Client }) {
  const [errored, setErrored] = useState(false)
  const monogram = useMemo(() => buildMonogram(client.name), [client.name])

  return (
    <div className="flex items-center justify-center h-20 md:h-24 px-3">
      {client.logoUrl && !errored ? (
        <img
          src={client.logoUrl}
          alt={client.name}
          onError={() => setErrored(true)}
          className="max-h-full max-w-full w-auto object-contain"
          loading="lazy"
        />
      ) : (
        <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-700 select-none">
          {monogram}
        </span>
      )}
    </div>
  )
}

/* ─── Pagination config: 5 logos per row, 10 rows per page = 50 per page ─── */
const PAGE_SIZE = 50

/* ─── Main Component ─── */
export default function ClientsPage() {
  const { navigate } = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let mounted = true
    fetchClients(true)
      .then(data => {
        if (!mounted) return
        setClients(data && data.length ? data : FALLBACK_CLIENTS)
        setLoading(false)
      })
      .catch(() => {
        if (!mounted) return
        setClients(FALLBACK_CLIENTS)
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const industries = useMemo(
    () => [...new Set(clients.map(c => c.industry).filter(Boolean))],
    [clients]
  )

  const filteredClients = useMemo(
    () =>
      activeFilter === 'All'
        ? clients
        : clients.filter(c => c.industry === activeFilter),
    [clients, activeFilter]
  )

  const stats = useMemo(() => {
    return [
      { label: 'Trusted Clients', value: clients.length, suffix: '+' },
      { label: 'Industries Served', value: industries.length, suffix: '' },
      { label: 'Projects Delivered', value: 500, suffix: '+' },
      { label: 'Years of Trust', value: 29, suffix: '+' },
    ]
  }, [clients, industries])

  // Clients are listed in a static grid — 4 per row, paginated.
  const listedClients = filteredClients

  // Pagination: slice the filtered list to the current page
  const totalPages = Math.max(1, Math.ceil(listedClients.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const startIdx = (safePage - 1) * PAGE_SIZE
  const endIdx = startIdx + PAGE_SIZE
  const pageClients = listedClients.slice(startIdx, endIdx)

  // Change filter AND reset to page 1 in the same handler (avoids effect-based setState)
  const handleFilterChange = (ind: string) => {
    setActiveFilter(ind)
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
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-[100px] pb-14 md:pb-20">
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

      {/* ════════════════ FILTER — minimal pills, no background fill ════════════════ */}
      {!loading && industries.length > 0 && (
        <section className="bg-white">
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-10">
            <FadeIn>
              <div className="flex flex-wrap justify-center gap-2">
                {['All', ...industries].map(ind => {
                  const active = activeFilter === ind
                  return (
                    <button
                      key={ind}
                      onClick={() => handleFilterChange(ind)}
                      className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border"
                      style={{
                        background: active ? INK : 'transparent',
                        color: active ? '#FFFFFF' : '#6B7280',
                        borderColor: active ? INK : '#E5E7EB',
                      }}
                    >
                      {ind}
                    </button>
                  )
                })}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ════════════════ CLIENT LOGOS — CLEAN LISTED GRID, 5 PER ROW, PAGINATED ════════════════ */}
      {/* Logos in their own color. No borders, no animation. 5 per row × 10 rows = 50 per page. */}
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

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-y-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 md:h-24 mx-auto w-full max-w-[10rem] bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : pageClients.length === 0 ? (
            <div className="text-center py-20">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500 text-lg">No clients found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-y-4">
              {pageClients.map(c => (
                <LogoItem key={c.id} client={c} />
              ))}
            </div>
          )}

          {/* Range + count footer */}
          {!loading && listedClients.length > 0 && (
            <p className="text-center text-xs text-slate-400 mt-10 tracking-wide">
              Showing {startIdx + 1}–{Math.min(endIdx, listedClients.length)} of {listedClients.length} clients
              {activeFilter !== 'All' ? ` in ${activeFilter}` : ' across all industries'}
            </p>
          )}

          {/* Pagination controls — only if more than one page */}
          {!loading && totalPages > 1 && (
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
