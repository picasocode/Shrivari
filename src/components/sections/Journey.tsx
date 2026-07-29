'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useSpring } from 'framer-motion'
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
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@/components/Router'
import { fetchMilestones, type Milestone } from '@/lib/api'

/* ─── Icon Map Resolver ─── */
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

/* ─── Motion Wrapper ─── */
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Fallback Milestones ─── */
const FALLBACK_MILESTONES: Milestone[] = [
  { id: 'm1', year: '1998', title: 'Inception', description: 'Established as a electrical solution provider in Chennai.', icon: 'Rocket', color: '#1F2937', order: 1, active: true, createdAt: '', updatedAt: '' },
  { id: 'm2', year: '2003', title: 'Factory Expansion', description: 'Constructed state-of-the-art manufacturing facility.', icon: 'Factory', color: '#0D9488', order: 2, active: true, createdAt: '', updatedAt: '' },
  { id: 'm3', year: '2009', title: 'First EHV Project', description: 'Successfully executed landmark Extra High Voltage project.', icon: 'Zap', color: '#E8751A', order: 3, active: true, createdAt: '', updatedAt: '' },
  { id: 'm4', year: '2015', title: 'Global Strategic Alliances', description: 'Formed key international technology partnerships.', icon: 'Handshake', color: '#1F2937', order: 4, active: true, createdAt: '', updatedAt: '' },
  { id: 'm5', year: '2025', title: 'IEC Quality Certification', description: 'Certified to top global industrial quality standards.', icon: 'BadgeCheck', color: '#0D9488', order: 5, active: true, createdAt: '', updatedAt: '' },
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
  label = 'OUR EVOLUTIONARY JOURNEY',
  title = 'Engineered for Excellence and Continuous Scale',
  description = 'From a visionary small enterprise to an industry leader — every milestone represents innovation, precision, and structural growth.',
  ctaText = 'Get Started',
  onCtaClick,
  stats = DEFAULT_STATS,
  className = '',
}: JourneyProps) {
  const { navigate } = useRouter()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  const journeyRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ['start 70%', 'end 80%'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
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

  /* 
    Precise Bézier Curve Node Calculation
    Target ViewBox: 1000 x 400
    SVG Path: M 50,200 C 250,50 400,350 600,200 C 750,80 850,320 950,200
  */
  const getCurveCoordinates = (index: number, total: number) => {
    const t = total <= 1 ? 0.5 : index / (total - 1)
    
    // Horizontal spacing along 1000px width viewBox
    const x = 60 + t * 880

    // Parametric S-curve height oscillation
    const y = 200 + Math.sin(t * Math.PI * 2) * 110

    return { 
      left: `${(x / 1000) * 100}%`, 
      top: `${(y / 400) * 100}%`,
      isTop: Math.sin(t * Math.PI * 2) >= 0 
    }
  }

  return (
    <section 
      ref={journeyRef} 
      className={`py-20 bg-slate-50/50 relative overflow-hidden ${className}`.trim()}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B50]" />
              <span className="text-xs font-bold tracking-wider text-[#FF6B50] uppercase">
                {label}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              {title}
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
              {description}
            </p>

            <div className="flex items-center gap-6">
              <Button
                onClick={handleCta}
                className="bg-[#FF6B50] hover:bg-[#e0583f] text-white rounded-full px-8 h-12 text-sm font-semibold shadow-lg shadow-orange-500/25 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              {stats && stats.length > 0 && (
                <div className="hidden sm:flex items-center gap-6 border-l border-slate-200 pl-6">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <div className="text-xl font-extrabold text-slate-900">{s.value}</div>
                      <div className="text-xs font-medium text-slate-500">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>
        </div>

        {/* Dynamic S-Wave Section */}
        <div className="relative w-full min-h-[460px] flex items-center justify-center">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-2xl" />
              ))}
            </div>
          ) : milestones.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No milestones found.</div>
          ) : (
            <div className="relative w-full h-[460px]">
              
              {/* Desktop View: Mathematical SVG S-Wave Path */}
              <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
                <svg 
                  className="w-full h-full" 
                  viewBox="0 0 1000 400" 
                  fill="none" 
                  preserveAspectRatio="none"
                >
                  {/* Background Track */}
                  <path
                    d="M 60,200 C 250,50 400,350 600,200 C 750,80 850,320 940,200"
                    stroke="#E2E8F0"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  
                  {/* Active Animated Gradient Path */}
                  <motion.path
                    d="M 60,200 C 250,50 400,350 600,200 C 750,80 850,320 940,200"
                    stroke="url(#orange-gradient)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    style={{ pathLength: smoothProgress }}
                  />

                  <defs>
                    <linearGradient id="orange-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF6B50" />
                      <stop offset="100%" stopColor="#FF9F43" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Desktop Node Placement */}
              <div className="hidden md:block relative w-full h-full z-10">
                {milestones.map((m, i) => {
                  const pos = getCurveCoordinates(i, milestones.length)

                  return (
                    <div
                      key={m.id || i}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                      style={{ left: pos.left, top: pos.top }}
                    >
                      {/* Central Node Ring */}
                      <div className="relative flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white border-4 border-[#FF6B50] shadow-md z-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-125">
                          <GetMilestoneIcon name={m.icon} className="w-3.5 h-3.5 text-[#FF6B50]" />
                        </div>
                        
                        {/* Pulse Ring on Hover */}
                        <div className="absolute inset-0 rounded-full bg-orange-400/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Content Card with Alternating Offset */}
                      <div 
                        className={`absolute left-1/2 transform -translate-x-1/2 w-64 p-4 rounded-xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 transition-all duration-300 group-hover:-translate-y-1 ${
                          pos.isTop ? 'bottom-12' : 'top-12'
                        }`}
                      >
                        {/* Giant Step Number Watermark */}
                        <span className="absolute right-3 top-1 text-5xl font-black text-slate-100 select-none pointer-events-none group-hover:text-orange-500/10 transition-colors">
                          0{i + 1}
                        </span>

                        <div className="inline-block px-2 py-0.5 rounded bg-orange-50 text-[#FF6B50] text-[10px] font-bold tracking-wide uppercase mb-1.5">
                          {m.year}
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug group-hover:text-[#FF6B50] transition-colors">
                          {m.title}
                        </h3>

                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {m.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Mobile View: Clean Vertical Timeline */}
              <div className="block md:hidden space-y-6 pl-6 relative border-l-2 border-orange-200 ml-3 py-2">
                {milestones.map((m, i) => (
                  <div key={m.id || i} className="relative pl-6 group">
                    <div className="absolute -left-[31px] top-1 w-6 h-6 rounded-full bg-white border-2 border-[#FF6B50] shadow-sm flex items-center justify-center">
                      <GetMilestoneIcon name={m.icon} className="w-3 h-3 text-[#FF6B50]" />
                    </div>
                    <span className="text-xs font-bold text-[#FF6B50] uppercase">{m.year}</span>
                    <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{m.description}</p>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  )
}
