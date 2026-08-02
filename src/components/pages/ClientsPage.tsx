'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ChevronRight,
  Building2,
  Factory,
  Car,
  Cpu,
  Flame,
  Droplets,
  Zap,
  Heart,
  GraduationCap,
  Ship,
  Landmark,
  ArrowRight,
  Users,
  Globe,
  Award,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/components/Router'
import { fetchClients, type Client } from '@/lib/api'

/* ─── Tokens (used very sparingly — coral hairlines + navy text only) ─── */
const NAVY = '#152D4F'
const CORAL = '#E8751A'
const INK = '#1A1A2E'

/* ─── Industry → Icon (monochrome, no color) ─── */
const INDUSTRY_ICONS: Record<string, React.ElementType> = {
  'Auto & Ancillary': Car,
  Engineering: Factory,
  Forging: Flame,
  Electronics: Cpu,
  'Power & Energy': Zap,
  Metal: Factory,
  Chemicals: Droplets,
  Commercial: Building2,
  'Hospitals & Institutions': Heart,
  Petroleum: Droplets,
  'Food Industry': Landmark,
  Textiles: GraduationCap,
  Pharma: Heart,
  MNC: Globe,
  IT: Cpu,
  'Real Estate': Building2,
  Cranes: Factory,
  Granites: Landmark,
  Government: Landmark,
  Airport: Ship,
  Carbon: Flame,
  Media: Landmark,
}

function getIndustryIcon(industry: string): React.ElementType {
  const key = Object.keys(INDUSTRY_ICONS).find(
    k => k.toLowerCase() === industry?.toLowerCase()
  )
  return key ? INDUSTRY_ICONS[key] : Building2
}

/* ─── Fallback clients (used when the API is unavailable) ─── */
const FALLBACK_CLIENTS: Client[] = [
  { id: 'f1', name: 'Ashok Leyland', industry: 'Auto & Ancillary', location: '', logoUrl: '', description: '', order: 1, active: true, createdAt: '', updatedAt: '' },
  { id: 'f2', name: 'TVS Group', industry: 'Auto & Ancillary', location: '', logoUrl: '', description: '', order: 2, active: true, createdAt: '', updatedAt: '' },
  { id: 'f3', name: 'Larsen & Toubro', industry: 'Engineering', location: '', logoUrl: '', description: '', order: 3, active: true, createdAt: '', updatedAt: '' },
  { id: 'f4', name: 'Bharat Forge', industry: 'Forging', location: '', logoUrl: '', description: '', order: 4, active: true, createdAt: '', updatedAt: '' },
  { id: 'f5', name: 'Schneider Electric', industry: 'Electronics', location: '', logoUrl: '', description: '', order: 5, active: true, createdAt: '', updatedAt: '' },
  { id: 'f6', name: 'Tamil Nadu Power', industry: 'Power & Energy', location: '', logoUrl: '', description: '', order: 6, active: true, createdAt: '', updatedAt: '' },
  { id: 'f7', name: 'JSW Steel', industry: 'Metal', location: '', logoUrl: '', description: '', order: 7, active: true, createdAt: '', updatedAt: '' },
  { id: 'f8', name: 'Reliance Industries', industry: 'Petroleum', location: '', logoUrl: '', description: '', order: 8, active: true, createdAt: '', updatedAt: '' },
  { id: 'f9', name: 'TCS', industry: 'IT', location: '', logoUrl: '', description: '', order: 9, active: true, createdAt: '', updatedAt: '' },
  { id: 'f10', name: 'Apollo Hospitals', industry: 'Hospitals & Institutions', location: '', logoUrl: '', description: '', order: 10, active: true, createdAt: '', updatedAt: '' },
  { id: 'f11', name: 'DLF', industry: 'Real Estate', location: '', logoUrl: '', description: '', order: 11, active: true, createdAt: '', updatedAt: '' },
  { id: 'f12', name: 'Cipla', industry: 'Pharma', location: '', logoUrl: '', description: '', order: 12, active: true, createdAt: '', updatedAt: '' },
  { id: 'f13', name: 'Tata Chemicals', industry: 'Chemicals', location: '', logoUrl: '', description: '', order: 13, active: true, createdAt: '', updatedAt: '' },
  { id: 'f14', name: 'Infosys', industry: 'IT', location: '', logoUrl: '', description: '', order: 14, active: true, createdAt: '', updatedAt: '' },
  { id: 'f15', name: 'Winch & Crane Co', industry: 'Cranes', location: '', logoUrl: '', description: '', order: 15, active: true, createdAt: '', updatedAt: '' },
  { id: 'f16', name: 'Granite India', industry: 'Granites', location: '', logoUrl: '', description: '', order: 16, active: true, createdAt: '', updatedAt: '' },
  { id: 'f17', name: 'Government of TN', industry: 'Government', location: '', logoUrl: '', description: '', order: 17, active: true, createdAt: '', updatedAt: '' },
  { id: 'f18', name: 'Chennai Airport', industry: 'Airport', location: '', logoUrl: '', description: '', order: 18, active: true, createdAt: '', updatedAt: '' },
  { id: 'f19', name: 'Carbon Tech', industry: 'Carbon', location: '', logoUrl: '', description: '', order: 19, active: true, createdAt: '', updatedAt: '' },
  { id: 'f20', name: 'Sun Pharma', industry: 'Pharma', location: '', logoUrl: '', description: '', order: 20, active: true, createdAt: '', updatedAt: '' },
  { id: 'f21', name: 'ITC Foods', industry: 'Food Industry', location: '', logoUrl: '', description: '', order: 21, active: true, createdAt: '', updatedAt: '' },
  { id: 'f22', name: 'Arvind Textiles', industry: 'Textiles', location: '', logoUrl: '', description: '', order: 22, active: true, createdAt: '', updatedAt: '' },
  { id: 'f23', name: 'Siemens', industry: 'Electronics', location: '', logoUrl: '', description: '', order: 23, active: true, createdAt: '', updatedAt: '' },
  { id: 'f24', name: 'Adani Power', industry: 'Power & Energy', location: '', logoUrl: '', description: '', order: 24, active: true, createdAt: '', updatedAt: '' },
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

/* ─── A single scrolling logo item (NO name, NO background) ─── */
function LogoItem({ client, Icon }: { client: Client; Icon: React.ElementType }) {
  if (client.logoUrl) {
    return (
      <div className="flex-shrink-0 mx-6 md:mx-10 h-12 md:h-14 w-auto flex items-center justify-center group cursor-default">
        <img
          src={client.logoUrl}
          alt=""
          aria-hidden="true"
          className="max-h-full w-auto object-contain opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
          loading="lazy"
        />
      </div>
    )
  }

  // No logo → industry icon only (monochrome)
  return (
    <div className="flex-shrink-0 mx-6 md:mx-10 h-12 md:h-14 flex items-center justify-center group cursor-default">
      <Icon
        className="w-7 h-7 md:w-8 md:h-8 text-slate-400 group-hover:text-slate-700 transition-colors duration-300"
        strokeWidth={1.5}
      />
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
    const locations = new Set(clients.map(c => c.location).filter(Boolean))
    return [
      { label: 'Trusted Clients', value: clients.length, suffix: '+' },
      { label: 'Industries Served', value: industries.length, suffix: '' },
      { label: 'Global Locations', value: locations.size, suffix: '' },
      { label: 'Years of Trust', value: 29, suffix: '+' },
    ]
  }, [clients, industries])

  // Two rows for opposite-direction marquees
  const { rowA, rowB } = useMemo(() => {
    const half = Math.ceil(filteredClients.length / 2)
    const a = filteredClients.slice(0, half)
    const b = filteredClients.slice(half)
    return {
      rowA: buildTrack(a, 14),
      rowB: buildTrack(b, 14),
    }
  }, [filteredClients])

  // For seamless -50% translate, duplicate the track once
  const trackA = rowA.length ? [...rowA, ...rowA] : []
  const trackB = rowB.length ? [...rowB, ...rowB] : []

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

      {/* ════════════════ SCROLLING LOGOS — MAIN FEATURE ════════════════ */}
      {/* Only logos/icons. No names. No background boxes. No section background fill. */}
      <section className="bg-white py-6 md:py-10">
        {loading ? (
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
            <div className="flex justify-center gap-10 mb-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-24 bg-slate-100 rounded-md animate-pulse"
                />
              ))}
            </div>
            <div className="flex justify-center gap-10">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-24 bg-slate-100 rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : trackA.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 text-lg">No clients found.</p>
          </div>
        ) : (
          <div className="space-y-8 md:space-y-10">
            {/* Row 1 — scrolls left */}
            <div className="relative overflow-hidden">
              {/* edge fade masks */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-white to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-white to-transparent z-10" />
              <div className="flex animate-marquee whitespace-nowrap w-max">
                {trackA.map((c, i) => {
                  const Icon = getIndustryIcon(c.industry)
                  return <LogoItem key={`a-${c.id}-${i}`} client={c} Icon={Icon} />
                })}
              </div>
            </div>

            {/* Row 2 — scrolls right (reverse), only if there's a second row */}
            {trackB.length > 0 && (
              <div className="relative overflow-hidden">
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-white to-transparent z-10" />
                <div className="flex animate-marquee-reverse whitespace-nowrap w-max">
                  {trackB.map((c, i) => {
                    const Icon = getIndustryIcon(c.industry)
                    return <LogoItem key={`b-${c.id}-${i}`} client={c} Icon={Icon} />
                  })}
                </div>
              </div>
            )}
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
