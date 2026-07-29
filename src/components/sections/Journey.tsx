'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion'
import { 
  ArrowRight, 
  Sparkles, 
  Rocket, 
  Wrench, 
  Factory, 
  Award, 
  Zap, 
  Sun, 
  Handshake, 
  TrendingUp, 
  BadgeCheck,
  CheckCircle2,
  LucideIcon 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@/components/Router'
import { fetchMilestones, type Milestone } from '@/lib/api'

/* ─── Icon Resolver Helper ─── */
const ICON_MAP: Record<string, LucideIcon> = {
  Rocket,
  Wrench,
  Factory,
  Award,
  Zap,
  Sun,
  Handshake,
  TrendingUp,
  BadgeCheck,
}

function GetMilestoneIcon({ name, className }: { name?: string; className?: string }) {
  const IconComponent = (name && ICON_MAP[name]) ? ICON_MAP[name] : CheckCircle2
  return <IconComponent className={className} />
}

/* ─── Fade-in Motion Wrapper ─── */
function FadeIn({ 
  children, 
  delay = 0, 
  className = '' 
}: { 
  children: React.ReactNode
  delay?: number
  className?: string 
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Fallback Data ─── */
const FALLBACK_MILESTONES: Milestone[] = [
  { id: 'm1', year: '1998', title: 'Inception', description: 'Shri Vaari Electricals was established as a firm in Chennai.', icon: 'Rocket', color: '#1F2937', order: 1, active: true, createdAt: '', updatedAt: '' },
  { id: 'm2', year: '1999', title: 'AMC Services Launched', description: 'Started Annual Maintenance Contract Services for industrial clients.', icon: 'Wrench', color: '#E8751A', order: 2, active: true, createdAt: '', updatedAt: '' },
  { id: 'm3', year: '2003', title: 'New Office & Factory', description: 'Constructed state-of-the-art 20,000 sq ft factory at Guindy, Chennai.', icon: 'Factory', color: '#0D9488', order: 3, active: true, createdAt: '', updatedAt: '' },
  { id: 'm4', year: '2005', title: 'Private Limited Entity', description: 'Formally incorporated as a Private Limited company.', icon: 'Award', color: '#1F2937', order: 4, active: true, createdAt: '', updatedAt: '' },
  { id: 'm5', year: '2009', title: 'First EHV Project', description: 'Successfully executed our first Extra High Voltage electrical project.', icon: 'Zap', color: '#E8751A', order: 5, active: true, createdAt: '', updatedAt: '' },
  { id: 'm6', year: '2014', title: 'Solar EPC Division', description: 'Expanded operations into Solar Power Plant EPC solutions.', icon: 'Sun', color: '#0D9488', order: 6, active: true, createdAt: '', updatedAt: '' },
  { id: 'm7', year: '2015', title: 'Schneider Partnership', description: 'Formed a strategic alliance with Schneider Electric.', icon: 'Handshake', color: '#1F2937', order: 7, active: true, createdAt: '', updatedAt: '' },
  { id: 'm8', year: '2018', title: '₹100+ Cr Turnover', description: 'Crossed the landmark revenue milestone of ₹100+ Crores.', icon: 'TrendingUp', color: '#E8751A', order: 8, active: true, createdAt: '', updatedAt: '' },
  { id: 'm9', year: '2025', title: 'IEC-61439 Certified', description: 'LT Panels certified to international IEC-61439 quality standards.', icon: 'BadgeCheck', color: '#0D9488', order: 9, active: true, createdAt: '', updatedAt: '' },
]

const DEFAULT_STATS = [
  { value: '29+', label: 'Years Experience' },
  { value: '9', label: 'Key Milestones' },
  { value: '₹200Cr+', label: 'Turnover' },
]

export interface JourneyProps {
  label?: string
  title?: string
  description?: string
  ctaText?: string
  onCtaClick?: () => void
  stats?: { value: string; label: string }[]
  className?: string
}

export default function Journey({
  label = 'Our Journey',
  title = 'Engineering Excellence Through the Decades',
  description = 'From a visionary small enterprise in 1998 to a ₹200+ Crore industry leader — every milestone represents innovation, grit, and structural integrity.',
  ctaText = 'Get In Touch',
  onCtaClick,
  stats = DEFAULT_STATS,
  className = '',
}: JourneyProps) {
  const { navigate } = useRouter()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  const journeyRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  /* ─── Scroll Progress Hooks ─── */
  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ['start 60%', 'end 90%'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  })

  useEffect(() => {
    let isMounted = true
    fetchMilestones(true)
      .then((m) => {
        if (!isMounted) return
        const data = (m as Milestone[]) || []
        setMilestones(data.length > 0 ? data : FALLBACK_MILESTONES)
      })
      .catch(() => {
        if (isMounted) setMilestones(FALLBACK_MILESTONES)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleCta = onCtaClick ?? (() => navigate('contact'))

  return (
    <section 
      ref={journeyRef} 
      className={`py-20 md:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden ${className}`.trim()}
    >
      {/* Background Decorator Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ─── Header / Hero Banner ─── */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-24">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-[#E8751A]" />
              <span className="text-xs font-bold tracking-wider text-[#E8751A] uppercase">
                {label}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              {title}
            </h2>

            <div className="w-20 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mx-auto mb-6" />

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                onClick={handleCta}
                className="bg-[#E8751A] hover:bg-[#d56817] text-white shadow-xl shadow-orange-500/25 rounded-xl px-8 h-12 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Stats Counter Bar */}
            {stats && stats.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-xl mx-auto">
                {stats.map((s) => (
                  <div key={s.label} className="flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
                      {s.value}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </FadeIn>
        </div>

        {/* ─── Interactive S-Curve Timeline Section ─── */}
        <div ref={timelineRef} className="relative">
          {loading ? (
            <div className="space-y-8 max-w-2xl mx-auto">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-white/80 rounded-2xl border border-slate-200/80 shadow-sm">
                  <CardContent className="p-6 space-y-3">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : milestones.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No milestones available.</div>
          ) : (
            <div className="relative min-h-[600px]">
              
              {/* ─── S-Curve Background Animated SVG Line (Desktop) ─── */}
              <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 1000">
                  <defs>
                    <linearGradient id="sCurveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#E8751A" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#0D9488" />
                    </linearGradient>
                  </defs>

                  {/* Static Grey Guide Path */}
                  <path
                    d={generateSCurvePath(milestones.length)}
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="4"
                    strokeDasharray="6 6"
                  />

                  {/* Dynamic Scroll Animated Path */}
                  <motion.path
                    d={generateSCurvePath(milestones.length)}
                    fill="none"
                    stroke="url(#sCurveGradient)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    style={{ pathLength: smoothProgress }}
                  />
                </svg>
              </div>

              {/* ─── Vertical Line Fallback (Mobile/Tablet) ─── */}
              <div className="block lg:hidden absolute left-6 sm:left-8 top-4 bottom-6 w-1 bg-slate-200 rounded-full">
                <motion.div
                  style={{ scaleY: smoothProgress }}
                  className="w-full h-full bg-gradient-to-b from-[#E8751A] via-amber-500 to-teal-500 origin-top rounded-full"
                />
              </div>

              {/* ─── Timeline Items Flow ─── */}
              <div className="space-y-12 lg:space-y-24 relative z-10">
                {milestones.map((m, i) => {
                  const isEven = i % 2 === 0
                  return (
                    <FadeIn key={m.id || (m.year + m.title)} delay={i * 0.05}>
                      <div className={`flex flex-col lg:flex-row items-center gap-6 lg:gap-16 ${
                        isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                      }`}>
                        
                        {/* Milestone Content Card */}
                        <div className="w-full lg:w-1/2 pl-12 lg:pl-0">
                          <Card className="bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-md hover:shadow-xl hover:border-orange-300 transition-all duration-300 rounded-2xl overflow-hidden group hover:-translate-y-1">
                            <CardContent className="p-6 sm:p-8 relative">
                              
                              {/* Background Index Number */}
                              <span
                                aria-hidden="true"
                                className="absolute right-4 top-2 text-6xl sm:text-7xl font-black text-slate-100 select-none pointer-events-none transition-colors duration-300 group-hover:text-orange-500/10"
                              >
                                {String(i + 1).padStart(2, '0')}
                              </span>

                              <div className="relative z-10 space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-50 text-[#E8751A] text-xs font-extrabold tracking-wider uppercase border border-orange-200/60">
                                  <span>{m.year}</span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#E8751A] transition-colors">
                                  {m.title}
                                </h3>

                                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                  {m.description}
                                </p>
                              </div>

                            </CardContent>
                          </Card>
                        </div>

                        {/* Interactive Node Marker Center Point */}
                        <div className="absolute left-6 sm:left-8 lg:relative lg:left-0 flex items-center justify-center flex-shrink-0 z-20">
                          <motion.div 
                            whileHover={{ scale: 1.2 }}
                            className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white border-4 border-[#E8751A] text-[#E8751A] shadow-lg shadow-orange-500/20 group cursor-pointer"
                          >
                            <GetMilestoneIcon name={m.icon} className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                            <span className="absolute -inset-2 rounded-full border border-orange-400/30 animate-ping pointer-events-none" />
                          </motion.div>
                        </div>

                        {/* Spacer Column for Opposite Side (Desktop) */}
                        <div className="hidden lg:block lg:w-1/2" />

                      </div>
                    </FadeIn>
                  )
                })}
              </div>

              {/* ─── Timeline End Marker ─── */}
              <div className="mt-16 text-center pl-10 lg:pl-0">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white shadow-xl">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">
                    The Journey Continues...
                  </span>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  )
}

/* ─── S-Curve Dynamic SVG Path Generator ─── */
function generateSCurvePath(totalItems: number): string {
  if (totalItems <= 0) return ''
  
  const width = 1000
  const stepY = 1000 / (totalItems + 0.5)
  let path = `M ${width / 2} 20`

  for (let i = 0; i < totalItems; i++) {
    const currentY = (i + 0.5) * stepY
    const nextY = (i + 1.5) * stepY
    const isEven = i % 2 === 0

    // Control point offsets for alternating smooth curves
    const controlX1 = isEven ? width * 0.85 : width * 0.15
    const controlX2 = isEven ? width * 0.15 : width * 0.85

    path += ` C ${controlX1} ${currentY}, ${controlX2} ${nextY}, ${width / 2} ${nextY}`
  }

  return path
}
