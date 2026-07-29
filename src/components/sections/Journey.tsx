'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@/components/Router'
import { fetchMilestones, type Milestone } from '@/lib/api'

/* ─── Fade-in helper ─── */
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
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

/* ─── Fallback milestones (used if API is unavailable) ─── */
const FALLBACK_MILESTONES: Milestone[] = [
  { id: 'm1', year: '1998', title: 'Inception', description: 'Shri Vaari Electricals was established as a firm in Chennai', icon: 'Rocket', color: '#1F2937', order: 1, active: true, createdAt: '', updatedAt: '' },
  { id: 'm2', year: '1999', title: 'AMC Services Launched', description: 'Started a new business vertical — Annual Maintenance Contract Services for Industrial Customers', icon: 'Wrench', color: '#E8751A', order: 2, active: true, createdAt: '', updatedAt: '' },
  { id: 'm3', year: '2003', title: 'New Office & Factory', description: 'Constructed a new office and factory building at Guindy, Chennai with 20,000 sq ft space', icon: 'Factory', color: '#0D9488', order: 3, active: true, createdAt: '', updatedAt: '' },
  { id: 'm4', year: '2005', title: 'Private Limited Entity', description: 'The company was formally incorporated as a Private Limited Entity', icon: 'Award', color: '#1F2937', order: 4, active: true, createdAt: '', updatedAt: '' },
  { id: 'm5', year: '2009', title: 'First EHV Project', description: 'Executed our first Extra High Voltage project', icon: 'Zap', color: '#E8751A', order: 5, active: true, createdAt: '', updatedAt: '' },
  { id: 'm6', year: '2014', title: 'Solar EPC Division', description: 'Started Solar Plants EPC division', icon: 'Sun', color: '#0D9488', order: 6, active: true, createdAt: '', updatedAt: '' },
  { id: 'm7', year: '2015', title: 'Schneider Partnership', description: 'Formed a strategic partnership with Schneider Electric', icon: 'Handshake', color: '#1F2937', order: 7, active: true, createdAt: '', updatedAt: '' },
  { id: 'm8', year: '2018', title: '₹100+ Crores Turnover', description: 'Achieved a landmark turnover of ₹100+ Crores', icon: 'TrendingUp', color: '#E8751A', order: 8, active: true, createdAt: '', updatedAt: '' },
  { id: 'm9', year: '2025', title: 'IEC-61439 Certified', description: 'LT Panels tested to IEC-61439 standards', icon: 'BadgeCheck', color: '#0D9488', order: 9, active: true, createdAt: '', updatedAt: '' },
]

/* ─── Default stat strip ─── */
const DEFAULT_STATS: { value: string; label: string }[] = [
  { value: '29+', label: 'Years' },
  { value: '9', label: 'Milestones' },
  { value: '₹200Cr', label: 'Turnover' },
]

/* ─── Grid map for desktop snake order ─── */
const GRID_MAP = [
  'col-start-1 row-start-3', // 1 bottom-left
  'col-start-2 row-start-3', // 2 bottom-center
  'col-start-3 row-start-3', // 3 bottom-right
  'col-start-3 row-start-2', // 4 middle-right
  'col-start-2 row-start-2', // 5 middle-center
  'col-start-1 row-start-2', // 6 middle-left
  'col-start-1 row-start-1', // 7 top-left
  'col-start-2 row-start-1', // 8 top-center
  'col-start-3 row-start-1', // 9 top-right
]

/* SVG snake path — single coral line */
const SNAKE_PATH =
  'M 16.67,83.33 L 78.33,83.33 Q 83.33,83.33 83.33,78.33 L 83.33,55 Q 83.33,50 78.33,50 L 21.67,50 Q 16.67,50 16.67,45 L 16.67,21.67 Q 16.67,16.67 21.67,16.67 L 83.33,16.67'

export interface JourneyProps {
  /** Small uppercase label above the headline */
  label?: string
  /** Main headline */
  title?: string
  /** Supporting paragraph under the headline */
  description?: string
  /** CTA button text */
  ctaText?: string
  /** Click handler for CTA — defaults to navigating to the contact page */
  onCtaClick?: () => void
  /** Mini stats shown under the CTA */
  stats?: { value: string; label: string }[]
  /** Extra classes for the outer <section> wrapper */
  className?: string
}

export default function Journey({
  label = 'Our Journey',
  title = 'We have best team and best process',
  description = 'From a small firm in 1998 to a ₹200+ Crore enterprise — every milestone is a story of grit, innovation, and the relentless pursuit of excellence.',
  ctaText = 'Get Started',
  onCtaClick,
  stats = DEFAULT_STATS,
  className = '',
}: JourneyProps) {
  const { navigate } = useRouter()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  /* Journey S-curve draw on scroll */
  const journeyRef = useRef<HTMLElement>(null)
  const { scrollYProgress: journeyProgress } = useScroll({
    target: journeyRef,
    offset: ['start end', 'end start'],
  })
  const pathLengthRaw = useTransform(journeyProgress, [0.05, 0.85], [0, 1])
  const pathLength = useSpring(pathLengthRaw, { stiffness: 80, damping: 20, restDelta: 0.001 })

  useEffect(() => {
    fetchMilestones(true)
      .catch(() => [])
      .then((m) => {
        const data = (m as Milestone[]) || []
        setMilestones(data.length > 0 ? data : FALLBACK_MILESTONES)
        setLoading(false)
      })
  }, [])

  const handleCta = onCtaClick ?? (() => navigate('contact'))

  return (
    <section ref={journeyRef} className={`py-16 md:py-24 bg-white relative overflow-hidden ${className}`.trim()}>
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

          {/* ─── Left: Intro text panel (sticky on desktop) ─── */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <FadeIn>
              <span className="block text-[#E8751A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                {label}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-[#1A1A2E] mb-4 leading-[1.1]">
                {title}
              </h2>
              <div className="section-bar mb-5" />
              <p className="text-[#6B7280] text-sm leading-relaxed mb-7 max-w-md">{description}</p>
              <Button
                onClick={handleCta}
                className="bg-[#E8751A] hover:bg-[#d56817] text-white rounded-full px-6 h-11 font-semibold shadow-md hover:shadow-lg transition-all"
              >
                {ctaText} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              {/* Mini stat strip */}
              {stats && stats.length > 0 && (
                <div className="mt-10 pt-8 border-t border-[#F3F4F6] grid grid-cols-3 gap-4">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <p className="text-2xl font-bold text-[#1A1A2E] tabular-nums">{s.value}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </FadeIn>
          </div>

          {/* ─── Right: S-curve timeline ─── */}
          <div className="lg:col-span-8">
            {loading ? (
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="bg-white rounded-2xl border border-[#E5E7EB]">
                    <CardContent className="p-6 space-y-3">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : milestones.length === 0 ? (
              <p className="text-[#6B7280] text-sm">No milestones to display.</p>
            ) : (
              <div className="relative">
                {/* ─── Desktop: Horizontal snake S-curve ─── */}
                <div className="hidden lg:block relative min-h-[640px]">
                  {/* SVG snake curve (single coral line) */}
                  <svg
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full pointer-events-none z-0"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    {/* Subtle glow underlay */}
                    <motion.path
                      d={SNAKE_PATH}
                      stroke="#E8751A"
                      strokeWidth="9"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                      style={{ pathLength, opacity: 0.1 }}
                    />
                    {/* Main line */}
                    <motion.path
                      d={SNAKE_PATH}
                      stroke="#E8751A"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                      style={{ pathLength, opacity: 0.85 }}
                    />
                  </svg>

                  {/* 3x3 grid of milestones (snake order) */}
                  <div className="relative z-10 grid grid-cols-3 grid-rows-3 gap-x-6 gap-y-2 h-full min-h-[640px]">
                    {milestones.slice(0, 9).map((m, i) => {
                      const isLast = i === Math.min(milestones.length, 9) - 1
                      return (
                        <FadeIn key={m.id || (m.year + m.title)} delay={i * 0.06} className={`relative ${GRID_MAP[i] || ''}`}>
                          <div className="relative h-full flex flex-col items-center justify-center text-center px-2 py-3">
                            {/* Last milestone: subtle circular background */}
                            {isLast && (
                              <div className="absolute inset-0 -m-3 rounded-full bg-[#F0F4F8] -z-10" />
                            )}
                            {/* Large faded background number */}
                            <span
                              aria-hidden="true"
                              className="absolute text-8xl xl:text-[7rem] font-extrabold text-[#E8EAEF] select-none pointer-events-none leading-none z-0"
                              style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                            >
                              {i + 1}
                            </span>
                            {/* Content */}
                            <div className="relative z-10 max-w-[190px]">
                              {/* Small gray circle marker */}
                              <div className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF] mx-auto mb-3 ring-4 ring-white shadow-sm" />
                              <div className="text-[11px] font-bold tracking-wider text-[#E8751A] mb-1 uppercase">{m.year}</div>
                              <h3 className="text-sm font-bold text-[#1A1A2E] mb-1.5 leading-snug">{m.title}</h3>
                              <p className="text-[11px] text-[#6B7280] leading-relaxed line-clamp-3">{m.description}</p>
                            </div>
                          </div>
                        </FadeIn>
                      )
                    })}
                  </div>

                  {/* End cap */}
                  <div className="flex justify-center mt-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFEFEF] border border-[#E5E7EB]">
                      <Sparkles className="w-3.5 h-3.5 text-[#E8751A]" />
                      <span className="text-[11px] font-semibold text-[#1F2937] tracking-wider">THE JOURNEY CONTINUES…</span>
                    </div>
                  </div>
                </div>

                {/* ─── Mobile: Vertical timeline with faded numbers ─── */}
                <div className="lg:hidden relative pl-8">
                  {/* Vertical line */}
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-[#E8751A] opacity-40" />
                  <div className="space-y-5">
                    {milestones.map((m, i) => (
                      <FadeIn key={m.id || (m.year + m.title)} delay={i * 0.05}>
                        <div className="relative">
                          {/* Marker */}
                          <div className="absolute -left-[1.45rem] top-3 w-3 h-3 rounded-full bg-[#9CA3AF] ring-4 ring-white shadow-sm z-10" />
                          {/* Card */}
                          <div className="relative bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm overflow-hidden">
                            {/* Large faded background number */}
                            <span
                              aria-hidden="true"
                              className="absolute text-6xl font-extrabold text-[#E8EAEF] select-none pointer-events-none leading-none"
                              style={{ top: '-0.25rem', right: '0.5rem' }}
                            >
                              {i + 1}
                            </span>
                            <div className="relative z-10">
                              <div className="text-[11px] font-bold tracking-wider text-[#E8751A] mb-1 uppercase">{m.year}</div>
                              <h3 className="text-sm font-bold text-[#1A1A2E] mb-1.5 leading-snug">{m.title}</h3>
                              <p className="text-xs text-[#6B7280] leading-relaxed">{m.description}</p>
                            </div>
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
