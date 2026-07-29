'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
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

/* ─── Motion Fade Wrapper ─── */
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

/* ─── Fallback 9 Milestones ─── */
const FALLBACK_MILESTONES: Milestone[] = [
  { id: 'm1', year: '1998', title: 'Inception', description: 'Shri Vaari Electricals was established as a firm in Chennai.', icon: 'Rocket', order: 1, active: true, createdAt: '', updatedAt: '' },
  { id: 'm2', year: '1999', title: 'AMC Services', description: 'Started Annual Maintenance Contract Services for industrial clients.', icon: 'Wrench', order: 2, active: true, createdAt: '', updatedAt: '' },
  { id: 'm3', year: '2003', title: 'New Office & Factory', description: 'Constructed state-of-the-art 20,000 sq ft factory at Guindy.', icon: 'Factory', order: 3, active: true, createdAt: '', updatedAt: '' },
  { id: 'm4', year: '2005', title: 'Private Limited Entity', description: 'Formally incorporated as a Private Limited company.', icon: 'Award', order: 4, active: true, createdAt: '', updatedAt: '' },
  { id: 'm5', year: '2009', title: 'First EHV Project', description: 'Executed our first Extra High Voltage electrical project.', icon: 'Zap', order: 5, active: true, createdAt: '', updatedAt: '' },
  { id: 'm6', year: '2014', title: 'Solar EPC Division', description: 'Expanded operations into Solar Power Plant EPC solutions.', icon: 'Sun', order: 6, active: true, createdAt: '', updatedAt: '' },
  { id: 'm7', year: '2015', title: 'Schneider Partnership', description: 'Formed a strategic alliance with Schneider Electric.', icon: 'Handshake', order: 7, active: true, createdAt: '', updatedAt: '' },
  { id: 'm8', year: '2018', title: '₹100+ Cr Turnover', description: 'Crossed the landmark revenue milestone of ₹100+ Crores.', icon: 'TrendingUp', order: 8, active: true, createdAt: '', updatedAt: '' },
  { id: 'm9', year: '2025', title: 'IEC-61439 Certified', description: 'LT Panels certified to international quality standards.', icon: 'BadgeCheck', order: 9, active: true, createdAt: '', updatedAt: '' },
]

export interface JourneyProps {
  label?: string
  title?: string
  description?: string
  ctaText?: string
  onCtaClick?: () => void
  className?: string
}

export default function Journey3x3({
  label = 'OUR EVOLUTION',
  title = 'We have best team and best process',
  description = 'From a small firm in 1998 to a ₹200+ Crore enterprise — every milestone is a story of grit, innovation, and structural excellence.',
  ctaText = 'Get Started',
  onCtaClick,
  className = '',
}: JourneyProps) {
  const { navigate } = useRouter()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMilestones(true)
      .then((m) => {
        const data = (m as Milestone[]) || []
        setMilestones(data.length >= 9 ? data.slice(0, 9) : FALLBACK_MILESTONES)
      })
      .catch(() => setMilestones(FALLBACK_MILESTONES))
      .finally(() => setLoading(false))
  }, [])

  const handleCta = onCtaClick ?? (() => navigate('contact'))

  /* 
    3x3 Matrix Order Mapping for Snake Flow
    Row 0 (1 -> 2 -> 3): Col 0, 1, 2
    Row 1 (6 <- 5 <- 4): Col 2, 1, 0  (Reversed for S-curve)
    Row 2 (7 -> 8 -> 9): Col 0, 1, 2
  */
  const getGridIndex = (index: number) => {
    const row = Math.floor(index / 3)
    const isEvenRow = row % 2 === 0
    const colInRow = index % 3
    const col = isEvenRow ? colInRow : 2 - colInRow
    return { row, col, stepNumber: index + 1 }
  }

  return (
    <section className={`py-20 bg-slate-50/50 relative overflow-hidden ${className}`.trim()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
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

            <Button
              onClick={handleCta}
              className="bg-[#FF6B50] hover:bg-[#e0583f] text-white rounded-full px-8 h-12 text-sm font-semibold shadow-lg shadow-orange-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </FadeIn>
        </div>

        {/* 3x3 S-Snake Layout */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="relative">
            
            {/* Desktop SVG S-Connecting Line Path */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
              <svg className="w-full h-full" viewBox="0 0 1200 900" fill="none" preserveAspectRatio="none">
                {/* Row 1 Path: Left -> Right */}
                <path d="M 200,150 L 1000,150" stroke="#FF6B50" strokeWidth="4" strokeDasharray="8 8" opacity="0.4" />
                {/* Turn 1: Right down to Row 2 */}
                <path d="M 1000,150 C 1150,150 1150,450 1000,450" stroke="#FF6B50" strokeWidth="4" strokeDasharray="8 8" opacity="0.4" />
                {/* Row 2 Path: Right -> Left */}
                <path d="M 1000,450 L 200,450" stroke="#FF6B50" strokeWidth="4" strokeDasharray="8 8" opacity="0.4" />
                {/* Turn 2: Left down to Row 3 */}
                <path d="M 200,450 C 50,450 50,750 200,750" stroke="#FF6B50" strokeWidth="4" strokeDasharray="8 8" opacity="0.4" />
                {/* Row 3 Path: Left -> Right */}
                <path d="M 200,750 L 1000,750" stroke="#FF6B50" strokeWidth="4" strokeDasharray="8 8" opacity="0.4" />
              </svg>
            </div>

            {/* 3x3 Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {milestones.slice(0, 9).map((m, i) => {
                const { row, col, stepNumber } = getGridIndex(i)
                const isReversedRow = row === 1

                return (
                  <FadeIn key={m.id || i} delay={i * 0.08}>
                    <div 
                      className={`relative p-6 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 hover:border-orange-200 group flex flex-col justify-between min-h-[220px] ${
                        isReversedRow ? 'md:bg-orange-50/20' : ''
                      }`}
                    >
                      {/* Step Number Background */}
                      <span className="absolute right-4 top-2 text-6xl font-black text-slate-100/80 group-hover:text-orange-500/10 transition-colors pointer-events-none select-none">
                        {String(stepNumber).padStart(2, '0')}
                      </span>

                      <div>
                        {/* Header Node */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-[#FF6B50] text-xs font-extrabold tracking-wide">
                            {m.year}
                          </span>
                          <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-[#FF6B50] group-hover:text-white transition-colors">
                            <GetMilestoneIcon name={m.icon} className="w-4 h-4 text-[#FF6B50] group-hover:text-white transition-colors" />
                          </div>
                        </div>

                        {/* Title & Desc */}
                        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-[#FF6B50] transition-colors">
                          {m.title}
                        </h3>

                        <p className="text-xs text-slate-500 leading-relaxed">
                          {m.description}
                        </p>
                      </div>

                      {/* Direction Flow Indicator */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                        <span>Step {stepNumber} of 9</span>
                        <span className="text-[#FF6B50]">
                          {isReversedRow ? '← Snake Flow' : 'Snake Flow →'}
                        </span>
                      </div>
                    </div>
                  </FadeIn>
                )
              })}
            </div>

          </div>
        )}

      </div>
    </section>
  )
}
