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

/* ─── A single logo item (NO name label, NO background box) ───
   Renders the client LOGO image larger and more visible (per user request:
   "logos need to be much more visible — remove white background, make logos
   fill the screen better, use a similar color treatment"). On image error,
   falls back to a clean monogram wordmark — NEVER a random industry icon. */
function LogoItem({ client }: { client: Client }) {
  const [errored, setErrored] = useState(false)
  const monogram = useMemo(() => buildMonogram(client.name), [client.name])

  if (client.logoUrl && !errored) {
    return (
      <div className="flex-shrink-0 mx-5 md:mx-8 lg:mx-10 h-16 md:h-20 lg:h-24 w-auto min-w-[7rem] flex items-center justify-center group cursor-default">
        <img
          src={client.logoUrl}
          alt=""
          aria-hidden="true"
          onError={() => setErrored(true)}
          className="max-h-full max-w-[9rem] w-auto object-contain opacity-80 grayscale-[20%] group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
          loading="lazy"
        />
      </div>
    )
  }

  // No logo / logo failed → clean monogram wordmark (logo-style, NOT an icon)
  return (
    <div className="flex-shrink-0 mx-5 md:mx-8 lg:mx-10 h-16 md:h-20 lg:h-24 min-w-[7rem] flex items-center justify-center group cursor-default">
      <span className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-500 group-hover:text-slate-800 transition-colors duration-300 select-none">
        {monogram}
      </span>
    </div>
  )
}

/* ─── Build a marquee track that is always long enough to loop seamlessly ─── */
function buildTrack(items: Client[], minCount = 12): Client[] {
  if (!items.length) return []
  const out: Client[] = []
  while (out.length < minCount) out.push(...items)
  return out
}

/* ─── Reusable marquee row renderer with edge fades ───
   Defined at module scope to satisfy react-hooks/static-components. */
function MarqueeRow({
  track,
  reverse,
  rowKey,
}: {
  track: Client[]
  reverse: boolean
  rowKey: string
}) {
  if (!track.length) return null
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-white to-transparent z-10" />
      <div className={`flex whitespace-nowrap w-max ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
        {track.map((c, i) => (
          <LogoItem key={`${rowKey}-${c.id}-${i}`} client={c} />
        ))}
      </div>
    </div>
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

  // Four rows for alternating-direction marquees (row1 L→R scroll, row2 R→L,
  // row3 L→R, row4 R→L). Distribute clients evenly across 4 rows.
  const { row1, row2, row3, row4 } = useMemo(() => {
    const n = filteredClients.length
    const q = Math.ceil(n / 4)
    const a = filteredClients.slice(0, q)
    const b = filteredClients.slice(q, q * 2)
    const c = filteredClients.slice(q * 2, q * 3)
    const d = filteredClients.slice(q * 3)
    return {
      row1: buildTrack(a, 10),
      row2: buildTrack(b, 10),
      row3: buildTrack(c, 10),
      row4: buildTrack(d, 10),
    }
  }, [filteredClients])

  // For seamless -50% translate, duplicate each track once
  const track1 = row1.length ? [...row1, ...row1] : []
  const track2 = row2.length ? [...row2, ...row2] : []
  const track3 = row3.length ? [...row3, ...row3] : []
  const track4 = row4.length ? [...row4, ...row4] : []

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

      {/* ════════════════ STATS — inline, no cards, no background ════════════════ */}
      <section className="border-y border-slate-100">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-10 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.08}>
                <div className="text-center md:px-4 md:border-l md:first:border-l-0 border-slate-100">
                  <div
                    className="text-4xl md:text-5xl font-extrabold mb-1"
                    style={{ color: INK }}
                  >
                    <AnimatedCounter target={stat.value} />
                    {stat.suffix}
                  </div>
                  <div className="text-xs md:text-sm text-slate-500 font-medium tracking-wide">
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

      {/* ════════════════ SCROLLING LOGOS — 4 ROWS, MAIN FEATURE ════════════════ */}
      {/* Only logos/icons. No names. No background boxes. No section background fill.
          Four rows alternating scroll direction for visual rhythm. */}
      <section className="bg-white py-8 md:py-12">
        {loading ? (
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8 space-y-8">
            {[0, 1, 2, 3].map(row => (
              <div key={row} className="flex justify-center gap-10">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 w-24 bg-slate-100 rounded-md animate-pulse"
                  />
                ))}
              </div>
            ))}
          </div>
        ) : track1.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 text-lg">No clients found.</p>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8">
            {/* Row 1 — scrolls left */}
            <MarqueeRow track={track1} reverse={false} rowKey="r1" />
            {/* Row 2 — scrolls right (reverse) */}
            <MarqueeRow track={track2} reverse={true} rowKey="r2" />
            {/* Row 3 — scrolls left */}
            <MarqueeRow track={track3} reverse={false} rowKey="r3" />
            {/* Row 4 — scrolls right (reverse) */}
            <MarqueeRow track={track4} reverse={true} rowKey="r4" />
          </div>
        )}
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
