'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ChevronRight,
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
  { id: 'f3', name: 'Larsen & Toubro', industry: 'Engineering', location: '', logoUrl: FAV('larsentoubro.com'), description: '', order: 3, active: true, createdAt: '', updatedAt: '' },
  { id: 'f4', name: 'Bharat Forge', industry: 'Forging', location: '', logoUrl: FAV('bharatforge.com'), description: '', order: 4, active: true, createdAt: '', updatedAt: '' },
  { id: 'f5', name: 'Schneider Electric', industry: 'Electronics', location: '', logoUrl: FAV('se.com'), description: '', order: 5, active: true, createdAt: '', updatedAt: '' },
  { id: 'f6', name: 'Siemens', industry: 'Electronics', location: '', logoUrl: FAV('siemens.com'), description: '', order: 6, active: true, createdAt: '', updatedAt: '' },
  { id: 'f7', name: 'ABB', industry: 'Electronics', location: '', logoUrl: FAV('abb.com'), description: '', order: 7, active: true, createdAt: '', updatedAt: '' },
  { id: 'f8', name: 'General Electric', industry: 'Electronics', location: '', logoUrl: FAV('ge.com'), description: '', order: 8, active: true, createdAt: '', updatedAt: '' },
  { id: 'f9', name: 'Tata Power', industry: 'Power & Energy', location: '', logoUrl: FAV('tatapower.com'), description: '', order: 9, active: true, createdAt: '', updatedAt: '' },
  { id: 'f10', name: 'Adani Power', industry: 'Power & Energy', location: '', logoUrl: FAV('adani.com'), description: '', order: 10, active: true, createdAt: '', updatedAt: '' },
  { id: 'f11', name: 'JSW Steel', industry: 'Metal', location: '', logoUrl: FAV('jsw.in'), description: '', order: 11, active: true, createdAt: '', updatedAt: '' },
  { id: 'f12', name: 'Vedanta', industry: 'Metal', location: '', logoUrl: FAV('vedantaresources.com'), description: '', order: 12, active: true, createdAt: '', updatedAt: '' },
  { id: 'f13', name: 'Reliance Industries', industry: 'Petroleum', location: '', logoUrl: FAV('ril.com'), description: '', order: 13, active: true, createdAt: '', updatedAt: '' },
  { id: 'f14', name: 'Tata Chemicals', industry: 'Chemicals', location: '', logoUrl: FAV('tatachemicals.com'), description: '', order: 14, active: true, createdAt: '', updatedAt: '' },
  { id: 'f15', name: 'TCS', industry: 'IT', location: '', logoUrl: FAV('tcs.com'), description: '', order: 15, active: true, createdAt: '', updatedAt: '' },
  { id: 'f16', name: 'Infosys', industry: 'IT', location: '', logoUrl: FAV('infosys.com'), description: '', order: 16, active: true, createdAt: '', updatedAt: '' },
  { id: 'f17', name: 'Wipro', industry: 'IT', location: '', logoUrl: FAV('wipro.com'), description: '', order: 17, active: true, createdAt: '', updatedAt: '' },
  { id: 'f18', name: 'Apollo Hospitals', industry: 'Hospitals & Institutions', location: '', logoUrl: FAV('apollohospitals.com'), description: '', order: 18, active: true, createdAt: '', updatedAt: '' },
  { id: 'f19', name: 'Cipla', industry: 'Pharma', location: '', logoUrl: FAV('cipla.com'), description: '', order: 19, active: true, createdAt: '', updatedAt: '' },
  { id: 'f20', name: 'Sun Pharma', industry: 'Pharma', location: '', logoUrl: FAV('sunpharma.com'), description: '', order: 20, active: true, createdAt: '', updatedAt: '' },
  { id: 'f21', name: 'Dr. Reddy\'s', industry: 'Pharma', location: '', logoUrl: FAV('drreddys.com'), description: '', order: 21, active: true, createdAt: '', updatedAt: '' },
  { id: 'f22', name: 'DLF', industry: 'Real Estate', location: '', logoUrl: FAV('dlf.in'), description: '', order: 22, active: true, createdAt: '', updatedAt: '' },
  { id: 'f23', name: 'ITC', industry: 'Food Industry', location: '', logoUrl: FAV('itcportal.com'), description: '', order: 23, active: true, createdAt: '', updatedAt: '' },
  { id: 'f24', name: 'Arvind', industry: 'Textiles', location: '', logoUrl: FAV('arvind.com'), description: '', order: 24, active: true, createdAt: '', updatedAt: '' },
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

/* ─── A single logo cell for a static grid ───
   Renders the client LOGO in a uniform single-color (monochrome) treatment
   inside a bordered cell so the grid reads as a clean, listed catalog. */
function LogoCell({ client, index }: { client: Client; index: number }) {
  const [errored, setErrored] = useState(false)
  const monogram = useMemo(() => buildMonogram(client.name), [client.name])

  return (
    <FadeIn delay={Math.min(index * 0.03, 0.4)}>
      <div className="group relative aspect-[4/3] flex items-center justify-center bg-white border border-slate-200 hover:border-slate-300 transition-colors">
        {client.logoUrl && !errored ? (
          <img
            src={client.logoUrl}
            alt=""
            aria-hidden="true"
            onError={() => setErrored(true)}
            className="max-h-[60%] max-w-[70%] w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
            style={{ filter: 'grayscale(1) contrast(1.15) brightness(0.7)' }}
            loading="lazy"
          />
        ) : (
          <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-400 group-hover:text-slate-700 transition-colors duration-300 select-none">
            {monogram}
          </span>
        )}
      </div>
    </FadeIn>
  )
}

/* ─── Main Component ─── */
export default function ClientsPage() {
  const { navigate } = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

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

  // Clients are listed in a static grid (no scrolling marquee).
  const listedClients = filteredClients

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
                      onClick={() => setActiveFilter(ind)}
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

      {/* ════════════════ CLIENT LOGOS — STATIC LISTED GRID ════════════════ */}
      {/* Logos listed in a clean bordered grid. No scrolling, no marquee. */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          {/* Section label */}
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-10 md:mb-12">
              <span className="h-px w-8 bg-slate-300" />
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-slate-400">
                Our Clients
              </span>
              <span className="h-px w-8 bg-slate-300" />
            </div>
          </FadeIn>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-slate-200">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] bg-white animate-pulse"
                />
              ))}
            </div>
          ) : listedClients.length === 0 ? (
            <div className="text-center py-20">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500 text-lg">No clients found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-slate-200 border border-slate-200">
              {listedClients.map((c, i) => (
                <LogoCell key={c.id} client={c} index={i} />
              ))}
            </div>
          )}

          {/* Count footer */}
          {!loading && listedClients.length > 0 && (
            <p className="text-center text-xs text-slate-400 mt-6 tracking-wide">
              Showing {listedClients.length} clients
              {activeFilter !== 'All' ? ` in ${activeFilter}` : ' across all industries'}
            </p>
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
