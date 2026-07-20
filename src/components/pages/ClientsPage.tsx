'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  MapPin,
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

/* ─── Brand Tokens ─── */
const NAVY = '#efefef'
const NAVY_DARK = '#efefef'
const ORANGE = '#E8751A'
const LIGHT_BG = '#F0F4F8'

/* ─── Industry → Color & Icon Map ─── */
const INDUSTRY_META: Record<string, { gradient: string; icon: React.ElementType }> = {
  'Auto & Ancillary': { gradient: 'from-red-500 to-orange-500', icon: Car },
  Engineering: { gradient: 'from-amber-500 to-yellow-500', icon: Factory },
  Forging: { gradient: 'from-orange-600 to-red-600', icon: Flame },
  Electronics: { gradient: 'from-cyan-500 to-blue-500', icon: Cpu },
  'Power & Energy': { gradient: 'from-yellow-400 to-amber-500', icon: Zap },
  Metal: { gradient: 'from-slate-500 to-zinc-600', icon: Factory },
  Chemicals: { gradient: 'from-[#4A90D9] to-green-500', icon: Droplets },
  Commercial: { gradient: 'from-sky-400 to-cyan-500', icon: Building2 },
  'Hospitals & Institutions': { gradient: 'from-rose-400 to-pink-500', icon: Heart },
  Petroleum: { gradient: 'from-slate-600 to-gray-700', icon: Droplets },
  'Food Industry': { gradient: 'from-lime-400 to-green-500', icon: Landmark },
  Textiles: { gradient: 'from-violet-400 to-purple-500', icon: GraduationCap },
  Pharma: { gradient: 'from-teal-400 to-[#2A5A8A]', icon: Heart },
  MNC: { gradient: 'from-blue-500 to-indigo-500', icon: Globe },
  IT: { gradient: 'from-cyan-400 to-sky-500', icon: Cpu },
  'Real Estate': { gradient: 'from-amber-400 to-orange-500', icon: Building2 },
  Cranes: { gradient: 'from-orange-500 to-amber-500', icon: Factory },
  Granites: { gradient: 'from-stone-400 to-stone-600', icon: Landmark },
  Government: { gradient: 'from-[#efefef] to-teal-600', icon: Landmark },
  Airport: { gradient: 'from-sky-500 to-blue-500', icon: Ship },
  Carbon: { gradient: 'from-gray-500 to-gray-700', icon: Flame },
  Media: { gradient: 'from-pink-400 to-rose-500', icon: Landmark },
  default: { gradient: `from-[#efefef] to-[#d4d4d4]`, icon: Building2 },
}

function getIndustryMeta(industry: string) {
  const key = Object.keys(INDUSTRY_META).find(
    k => k.toLowerCase() === industry?.toLowerCase()
  )
  return key ? INDUSTRY_META[key] : INDUSTRY_META.default
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
      { label: 'Trusted Clients', value: clients.length, icon: Users, color: NAVY },
      { label: 'Industries Served', value: industries.length, icon: Award, color: ORANGE },
      { label: 'Global Locations', value: locations.size, icon: Globe, color: '#2A5A8A' },
      { label: 'Years of Trust', value: 15, icon: TrendingUp, color: '#7C3AED' },
    ]
  }, [clients, industries])

  return (
    <>
      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${NAVY_DARK} 0%, ${NAVY} 40%, #2A5F8A 100%)` }}>
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
            <span style={{ color: ORANGE }}>Clients</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <Badge
              className="mb-6 text-sm font-medium tracking-wider uppercase px-4 py-1.5 rounded-full border-0"
              style={{ background: 'rgba(232,117,26,0.15)', color: ORANGE }}
            >
              Partnership Showcase
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-5">
              Trusted By
              <br />
              <span style={{ color: ORANGE }}>Industry Leaders</span>
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
                    className="rounded-2xl p-5 md:p-6 text-center backdrop-blur-xl border border-white/20"
                    style={{
                      background: 'rgba(255,255,255,0.78)',
                      boxShadow: '0 8px 32px rgba(27,58,92,0.10)',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: `${stat.color}12` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <div
                      className="text-3xl md:text-4xl font-extrabold"
                      style={{ color: stat.color }}
                    >
                      <AnimatedCounter target={stat.value} />
                      {stat.label === 'Years of Trust' && '+'}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 font-medium">
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
                        activeFilter === ind ? '#FFFFFF' : '#4B5563',
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
                  const meta = getIndustryMeta(c.industry)
                  const Icon = meta.icon
                  const initial = c.name?.charAt(0)?.toUpperCase() || '?'

                  // Logo card variant
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
                        <Card className="relative overflow-hidden bg-white rounded-2xl border border-[#E5E7EB] shadow-sm card-hover h-full group">
                          {/* Gradient left border */}
                          <div
                            className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${meta.gradient}`}
                          />

                          <CardContent className="p-5 pl-7 flex flex-col items-center text-center">
                            {/* Client Logo - prominently displayed */}
                            <div className="w-full h-24 flex items-center justify-center mb-3 bg-[#FAFBFC] rounded-xl p-3">
                              <img
                                src={c.logoUrl}
                                alt={c.name}
                                className="max-w-full max-h-full object-contain"
                                loading="lazy"
                              />
                            </div>

                            {/* Industry badge */}
                            {c.industry && (
                              <Badge
                                className="text-[10px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-md border-0 mb-2"
                                style={{
                                  background: 'rgba(232,117,26,0.10)',
                                  color: ORANGE,
                                }}
                              >
                                {c.industry}
                              </Badge>
                            )}

                            {/* Name */}
                            <h3
                              className="text-sm font-bold mb-1 group-hover:translate-x-0.5 transition-transform duration-200"
                              style={{ color: '#1A1A2E' }}
                            >
                              {c.name}
                            </h3>

                            {/* Location */}
                            {c.location && (
                              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                                <MapPin className="w-3.5 h-3.5" style={{ color: ORANGE }} />
                                <span>{c.location}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  }

                  // Fallback: text-based card with initial letter + icon
                  return (
                    <motion.div
                      key={c.id}
                      layout
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                    >
                      <Card className="relative overflow-hidden bg-white rounded-2xl border border-[#E5E7EB] shadow-sm card-hover h-full group">
                        {/* Gradient left border */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${meta.gradient}`}
                        />

                        <CardContent className="p-5 pl-7 flex flex-col items-center text-center">
                          {/* Decorative initial + icon */}
                          <div className="relative mb-3">
                            <span
                              className="text-4xl font-black leading-none select-none"
                              style={{ color: `${NAVY}08` }}
                            >
                              {initial}
                            </span>
                            <div
                              className="absolute -bottom-0.5 -right-1 w-5 h-5 rounded-md flex items-center justify-center"
                              style={{ background: `${NAVY}0A` }}
                            >
                              <Icon className="w-3 h-3" style={{ color: NAVY }} />
                            </div>
                          </div>

                          {/* Industry badge */}
                          {c.industry && (
                            <Badge
                              className="text-[10px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-md border-0 mb-2"
                              style={{
                                background: 'rgba(232,117,26,0.10)',
                                color: ORANGE,
                              }}
                            >
                              {c.industry}
                            </Badge>
                          )}

                          {/* Name */}
                          <h3
                            className="text-sm font-bold mb-1 group-hover:translate-x-0.5 transition-transform duration-200"
                            style={{ color: '#1A1A2E' }}
                          >
                            {c.name}
                          </h3>

                          {/* Location */}
                          {c.location && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-400">
                              <MapPin className="w-3.5 h-3.5" style={{ color: ORANGE }} />
                              <span>{c.location}</span>
                            </div>
                          )}
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

      {/* ════════════════ INDUSTRIES WE SERVE ════════════════ */}
      {!loading && industries.length > 0 && (
        <section style={{ background: LIGHT_BG }}>
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-16 md:py-24">
            <FadeIn>
              <div className="text-center mb-12">
                <h2
                  className="text-3xl md:text-4xl font-extrabold mb-3"
                  style={{ color: '#1A1A2E' }}
                >
                  Industries We Serve
                </h2>
                <div className="section-bar mx-auto mb-4" />
                <p className="text-gray-500 max-w-lg mx-auto">
                  Deep expertise across diverse sectors — delivering tailored solutions
                  for every industry challenge.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {industries.map((ind, i) => {
                const meta = getIndustryMeta(ind)
                const Icon = meta.icon
                const count = clients.filter(c => c.industry === ind).length
                return (
                  <FadeIn key={ind} delay={i * 0.06}>
                    <div className="group relative bg-white rounded-2xl border border-[#E5E7EB] p-5 text-center card-hover cursor-default overflow-hidden">
                      {/* Hover gradient overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      />
                      <div className="relative z-10">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors duration-500"
                          style={{ background: `${NAVY}0A` }}
                        >
                          <Icon
                            className="w-6 h-6 transition-colors duration-500"
                            style={{ color: NAVY }}
                          />
                        </div>
                        <h4
                          className="text-sm font-bold mb-1 transition-colors duration-500"
                          style={{ color: '#1A1A2E' }}
                        >
                          {ind}
                        </h4>
                        <span className="text-sm text-gray-400 group-hover:text-white/80 transition-colors duration-500">
                          {count} partner{count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </FadeIn>
                )
              })}
            </div>
          </div>
        </section>
      )}

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
              className="mb-5 text-sm font-medium tracking-wider uppercase px-4 py-1.5 rounded-full border-0"
              style={{ background: 'rgba(232,117,26,0.15)', color: ORANGE }}
            >
              Become a Partner
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
              Ready to Join Our
              <br />
              <span style={{ color: ORANGE }}>Network of Leaders?</span>
            </h2>
            <p className="text-white/55 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Partner with us and gain access to world-class solutions, dedicated
              support, and a community of industry pioneers.
            </p>
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              style={{ background: ORANGE, color: '#FFFFFF' }}
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
