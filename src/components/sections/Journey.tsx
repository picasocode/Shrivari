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
      initial={{ opacity: 0, y: 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
      transition={{ duration: 0.45, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
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
  label = 'STOCKIES OPERATION ACROSS THE WORLD',
  title = 'We have best team and best process',
  description = 'From a visionary small enterprise in 1998 to a ₹200+ Crore industry leader — every milestone represents innovation, grit, and structural integrity.',
  ctaText = 'Get Started',
  onCtaClick,
  stats = DEFAULT_STATS,
  className = '',
}: JourneyProps) {
  const { navigate } = useRouter()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  const journeyRef = useRef<HTMLElement>(null)

  /* ─── Scroll Progress Hooks ─── */
  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ['start 60%', 'end 80%'],
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

  // Coordinates along the wave path for dynamic horizontal node placement
  const getNodePosition = (index: number, total: number) => {
    const leftPct = ((index + 0.6) / total) * 100
    // Dynamic sine-wave vertical offset matching SVG curve topology
    const topPct = 50 + Math.sin((index / (total - 1 || 1)) * Math.PI * 2) * 22
    return { left: `${Math.min(Math.max(leftPct, 10), 90)}%`, top: `${topPct}%` }
  }

  return (
    <section 
      ref={journeyRef} 
      className={`py-16 md:py-24 bg-white relative overflow-hidden ${className}`.trim()}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center min-h-[520px]">
          
          {/* ─── Left Panel: Hero Title & Description ─── */}
          <div className="lg:col-span-4 z-20">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#E8751A]" />
                <span className="text-[11px] font-bold tracking-wider text-[#E8751A] uppercase">
                  {label}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                {title}
              </h2>

              <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
                {description}
              </p>

              <Button
                onClick={handleCta}
                className="bg-[#FF6B50] hover:bg-[#e0583f] text-white rounded-full px-8 h-12 text-sm font-semibold shadow-lg shadow-orange-500/20 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Stats Bar */}
              {stats && stats.length > 0 && (
                <div className="mt-10 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 max-w-sm">
                  {stats.map((s) => (
                    <div key={s.label} className="flex flex-col">
                      <span className="text-xl font-black text-slate-900 tabular-nums">
                        {s.value}
                      </span>
                      <span className="text-xs font-medium text-slate-400 mt-0.5">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </FadeIn>
          </div>

          {/* ─── Right Panel: Curved Horizontal S-Flow Timeline ─── */}
          <div className="lg:col-span-8 relative min-h-[450px] w-full flex items-center justify-center">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-44 w-full rounded-2xl" />
                ))}
              </div>
            ) : milestones.length === 0 ? (
              <div className="text-center py-12 text-slate-400">No milestones available.</div>
            ) : (
              <div className="relative w-full h-full min-h-[420px]">
                
                {/* ─── Desktop View: Curved SVG S-Wave Path ─── */}
                <div className="hidden sm:block absolute inset-0 pointer-events-none z-0">
                  <svg 
                    className="w-full h-full overflow-visible" 
                    viewBox="0 0 900 400" 
                    fill="none" 
                    preserveAspectRatio="none"
                  >
                    {/* Shadow / Base Stroke */}
                    <path
                      d="M 0 240 C 150 350, 280 340, 420 220 C 560 100, 680 260, 900 120"
                      stroke="#F3F4F6"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    
                    {/* Dynamic Scroll Animated Gradient Wave */}
                    <motion.path
                      d="M 0 240 C 150 350, 280 340, 420 220 C 560 100, 680 260, 900 120"
                      stroke="#FF6B50"
                      strokeWidth="4"
                      strokeLinecap="round"
                      style={{ pathLength: smoothProgress }}
                    />
                  </svg>
                </div>

                {/* ─── Horizontal Node Items (Desktop) ─── */}
                <div className="hidden sm:block relative w-full h-full z-10">
                  {milestones.map((m, i) => {
                    const pos = getNodePosition(i, milestones.length)

                    return (
                      <div
                        key={m.id || (m.year + i)}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-start max-w-[220px] group"
                        style={{ left: pos.left, top: pos.top }}
                      >
                        {/* Interactive Node Dot */}
                        <div className="relative mb-3 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-slate-300 border-4 border-white shadow-md z-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-125 group-hover:bg-[#FF6B50]">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>
                        </div>

                        {/* Text Content with Giant Watermark Number */}
                        <div className="relative pt-1">
                          <span className="absolute -top-12 left-2 text-7xl font-black text-slate-100/90 -z-10 select-none pointer-events-none transition-colors duration-300 group-hover:text-orange-500/10">
                            {i + 1}
                          </span>

                          <div className="inline-block px-2 py-0.5 rounded bg-orange-50 text-[#FF6B50] text-[10px] font-bold tracking-wide uppercase mb-1">
                            {m.year}
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug group-hover:text-[#FF6B50] transition-colors">
                            {m.title}
                          </h3>

                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                            {m.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* ─── Mobile View: Clean Vertical Fallback ─── */}
                <div className="block sm:hidden space-y-6 pl-6 relative border-l-2 border-slate-100 ml-2">
                  {milestones.map((m, i) => (
                    <div key={m.id || i} className="relative pl-4">
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#FF6B50] border-2 border-white shadow-sm" />
                      <span className="text-3xl font-black text-slate-100 absolute right-2 top-0 -z-10">
                        {i + 1}
                      </span>
                      <span className="text-[10px] font-bold text-orange-500 uppercase">{m.year}</span>
                      <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{m.description}</p>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
