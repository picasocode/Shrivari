'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  Building2,
  Factory,
  Car,
  Cpu,
  Flame,
  Droplets,
  Wind,
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
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@/components/Router'
import { fetchClients, type Client } from '@/lib/api'

/* ─── Brand Tokens (single coral + navy palette) ─── */
const NAVY = '#1B3A5C'
const NAVY_DARK = '#152D4F'
const NAVY_DEEP = '#0C2340'
const CORAL = '#E8751A'
const LIGHT_BG = '#F0F4F8'

/* ─── Industry → Icon Map (NO per-industry colour — single coral accent) ─── */
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

/* ─── Floating Particles ─── */
function FloatingParticles({ names }: { names: string[] }) {
  const particles = useMemo(() => {
    if (!names.length) return []
    return names.slice(0, 12).map((name, i) => ({
      id: i,
      name,
      x: 5 + (i * 37) % 90,
      y: 10 + (i * 23) % 75,
      size: 10 + (i * 7) % 14,
      delay: i * 0.7,
      duration: 4 + (i % 4) * 1.5,
    }))
  }, [names])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {particles.map(p => (
        <motion.span
          key={p.id}
          className="absolute text-white/[0.06] font-bold whitespace-nowrap"
          style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size }}
          animate={{
            y: [0, -18, 0, 12, 0],
            opacity: [0.04, 0.09, 0.04, 0.07, 0.04],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {p.name}
        </motion.span>
      ))}
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
    fetchClients(true)
      .then(data => {
        setClients(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
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
      { label: 'Trusted Clients', value: clients.length, icon: Users },
      { label: 'Industries Served', value: industries.length, icon: Award },
      { label: 'Global Locations', value: locations.size, icon: Globe },
      { label: 'Years of Trust', value: 15, icon: TrendingUp },
    ]
  }, [clients, industries])

  return (
    <>
      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, ${NAVY} 45%, ${NAVY_DARK} 100%)` }}>
        <FloatingParticles names={clients.map(c => c.name)} />

        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full border border-white/[0.04]" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full border border-white/[0.04]" />
        <div className="absolute top-1/2 right-[15%] w-[160px] h-[160px] rounded-full border border-white/[0.03]" />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 pt-[100px] pb-20 md:pb-28">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm mb-10"
          >
            <button
              onClick={() => navigate('home')}
              className="text-white/50 hover:text-white transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-4 h-4 text-white/25" />
            <span style={{ color: CORAL }}>Clients</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <Badge
              className="mb-6 text-xs font-medium tracking-wider uppercase px-4 py-1.5 rounded-full border-0"
              style={{ background: 'rgba(232,117,26,0.15)', color: CORAL }}
            >
              Partnership Showcase
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-5">
              Trusted By
              <br />
              <span style={{ color: CORAL }}>Industry Leaders</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed">
              We build lasting partnerships with companies that shape the future.
              Discover the organizations that rely on us to power their success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ STATS BAR ════════════════ */}
      <section
        className="relative -mt-10 z-10"
        style={{ background: 'transparent' }}
      >
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <FadeIn key={stat.label} delay={i * 0.1}>
                  <div
                    className="relative rounded-2xl p-5 md:p-6 text-center border-2 border-slate-200 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-md"
                  >
                    <Icon className="w-5 h-5 mx-auto mb-3 text-slate-400" />
                    <div
                      className="text-3xl md:text-4xl font-extrabold"
                      style={{ color: NAVY_DARK }}
                    >
                      <AnimatedCounter target={stat.value} />
                      {stat.label === 'Years of Trust' && '+'}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════ MARQUEE ════════════════ */}
      {!loading && clients.length > 0 && (
        <section
          className="py-6 overflow-hidden border-b"
          style={{ background: LIGHT_BG, borderColor: '#E5E7EB' }}
        >
          <div className="flex animate-marquee whitespace-nowrap">
            {[...clients, ...clients, ...clients, ...clients].map((c, i) => (
              <span
                key={`mq-${c.id}-${i}`}
                className="flex items-center mx-5 text-sm font-semibold select-none gap-2"
                style={{ color: `${NAVY}18` }}
              >
                {c.logoUrl ? (
                  <img
                    src={c.logoUrl}
                    alt={c.name}
                    className="w-5 h-5 object-contain rounded-sm"
                    loading="lazy"
                  />
                ) : null}
                {c.name}
                <span className="ml-5 w-1.5 h-1.5 rounded-full inline-block" style={{ background: `${NAVY}12` }} />
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ════════════════ CLIENT GRID ════════════════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10">
              <h2
                className="text-3xl md:text-4xl font-extrabold mb-3"
                style={{ color: '#1A1A2E' }}
              >
                Companies That Trust Us
              </h2>
              <div className="section-bar mx-auto mb-4" />
              <p className="text-gray-500 max-w-lg mx-auto">
                Explore our growing network of partners across every major industry.
              </p>
            </div>
          </FadeIn>

          {/* Industry Filter Pills */}
          {!loading && industries.length > 0 && (
            <FadeIn>
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {['All', ...industries].map(ind => (
                  <button
                    key={ind}
                    onClick={() => setActiveFilter(ind)}
                    className="relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                    style={{
                      background:
                        activeFilter === ind ? NAVY : 'transparent',
                      color:
                        activeFilter === ind ? '#FFFFFF' : '#6B7280',
                      border: `1.5px solid ${activeFilter === ind ? NAVY : '#D1D5DB'}`,
                    }}
                  >
                    {ind}
                    {activeFilter === ind && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: NAVY, zIndex: -1 }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </FadeIn>
          )}

          {/* Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-2xl" />
              ))}
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filteredClients.map((c, i) => {
                  const Icon = getIndustryIcon(c.industry)
                  const initial = c.name?.charAt(0)?.toUpperCase() || '?'

                  // Logo card variant — Journey-style neutral box
                  if (c.logoUrl) {
                    return (
                      <motion.div
                        key={c.id}
                        layout
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.35, delay: i * 0.04 }}
                      >
                        <Card className="relative overflow-hidden bg-white rounded-2xl border-2 border-slate-200 shadow-sm card-hover h-full group transition-all duration-300 hover:border-slate-300 hover:shadow-lg">
                          {/* Faded index number (like Journey) */}
                          <span className="absolute top-3 right-4 text-2xl font-extrabold leading-none select-none text-slate-100">
                            {String(i + 1).padStart(2, '0')}
                          </span>

                          <CardContent className="p-5 flex flex-col items-center text-center">
                            {/* Client Logo — clean white box */}
                            <div className="w-full h-24 flex items-center justify-center mb-3 bg-[#FAFBFC] rounded-xl p-3 border border-slate-100">
                              <img
                                src={c.logoUrl}
                                alt={c.name}
                                className="max-w-full max-h-full object-contain"
                                loading="lazy"
                              />
                            </div>

                            {/* Industry — gray uppercase text (no colored badge) */}
                            {c.industry && (
                              <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase mb-1.5">
                                {c.industry}
                              </p>
                            )}

                            {/* Name */}
                            <h3
                              className="text-sm font-bold group-hover:translate-x-0.5 transition-transform duration-200"
                              style={{ color: '#1A1A2E' }}
                            >
                              {c.name}
                            </h3>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  }

                  // Fallback: text-based card with initial letter — Journey-style neutral box
                  return (
                    <motion.div
                      key={c.id}
                      layout
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                    >
                      <Card className="relative overflow-hidden bg-white rounded-2xl border-2 border-slate-200 shadow-sm card-hover h-full group transition-all duration-300 hover:border-slate-300 hover:shadow-lg">
                        {/* Faded index number (like Journey) */}
                        <span className="absolute top-3 right-4 text-2xl font-extrabold leading-none select-none text-slate-100">
                          {String(i + 1).padStart(2, '0')}
                        </span>

                        <CardContent className="p-5 flex flex-col items-center text-center">
                          {/* Decorative initial + icon (neutral) */}
                          <div className="relative mb-3 w-full h-24 flex items-center justify-center bg-[#FAFBFC] rounded-xl p-3 border border-slate-100">
                            <span
                              className="text-5xl font-black leading-none select-none"
                              style={{ color: `${NAVY}0A` }}
                            >
                              {initial}
                            </span>
                            <div className="absolute bottom-2 right-2 w-5 h-5 rounded-md flex items-center justify-center bg-white border border-slate-200">
                              <Icon className="w-3 h-3 text-slate-400" />
                            </div>
                          </div>

                          {/* Industry — gray uppercase text (no colored badge) */}
                          {c.industry && (
                            <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase mb-1.5">
                              {c.industry}
                            </p>
                          )}

                          {/* Name */}
                          <h3
                            className="text-sm font-bold group-hover:translate-x-0.5 transition-transform duration-200"
                            style={{ color: '#1A1A2E' }}
                          >
                            {c.name}
                          </h3>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty state */}
          {!loading && filteredClients.length === 0 && (
            <div className="text-center py-20">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">
                No clients found for this industry.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════ CTA ════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY} 100%)` }}
      >
        <div className="absolute -top-20 -right-20 w-[350px] h-[350px] rounded-full border border-white/[0.04]" />
        <div className="absolute -bottom-16 -left-16 w-[250px] h-[250px] rounded-full border border-white/[0.04]" />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 py-20 md:py-28 text-center">
          <FadeIn>
            <Badge
              className="mb-5 text-xs font-medium tracking-wider uppercase px-4 py-1.5 rounded-full border-0"
              style={{ background: 'rgba(232,117,26,0.15)', color: CORAL }}
            >
              Become a Partner
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
              Ready to Join Our
              <br />
              <span style={{ color: CORAL }}>Network of Leaders?</span>
            </h2>
            <p className="text-white/55 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Partner with us and gain access to world-class solutions, dedicated
              support, and a community of industry pioneers.
            </p>
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              style={{ background: CORAL, color: '#FFFFFF' }}
              onClick={() => navigate('contact')}
            >
              Get In Touch
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
