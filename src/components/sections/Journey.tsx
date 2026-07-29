'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@/components/Router'
import { fetchMilestones, type Milestone } from '@/lib/api'

/* ─── Fallback 9 Milestones ─── */
const FALLBACK_MILESTONES: Milestone[] = [
  { id: 'm1', year: '1998', title: 'Inception', description: 'Shri Vaari Electricals was established as a firm in Chennai.', order: 1, active: true, createdAt: '', updatedAt: '' },
  { id: 'm2', year: '1999', title: 'AMC Services', description: 'Started Annual Maintenance Contract Services for industrial clients.', order: 2, active: true, createdAt: '', updatedAt: '' },
  { id: 'm3', year: '2003', title: 'Factory Facility', description: 'Constructed state-of-the-art 20,000 sq ft manufacturing unit at Guindy.', order: 3, active: true, createdAt: '', updatedAt: '' },
  { id: 'm4', year: '2005', title: 'Private Limited', description: 'Formally incorporated as a Private Limited industrial enterprise.', order: 4, active: true, createdAt: '', updatedAt: '' },
  { id: 'm5', year: '2009', title: 'First EHV Project', description: 'Successfully executed our first Extra High Voltage electrical project.', order: 5, active: true, createdAt: '', updatedAt: '' },
  { id: 'm6', year: '2014', title: 'Solar EPC Division', description: 'Expanded operations into turnkey Solar Power Plant EPC solutions.', order: 6, active: true, createdAt: '', updatedAt: '' },
  { id: 'm7', year: '2015', title: 'Strategic Partnership', description: 'Formed a strategic technology alliance with Schneider Electric.', order: 7, active: true, createdAt: '', updatedAt: '' },
  { id: 'm8', year: '2018', title: '₹100+ Cr Turnover', description: 'Crossed the landmark annual revenue milestone of ₹100+ Crores.', order: 8, active: true, createdAt: '', updatedAt: '' },
  { id: 'm9', year: '2025', title: 'IEC-61439 Certified', description: 'LT Switchgear Panels certified to international IEC quality standards.', order: 9, active: true, createdAt: '', updatedAt: '' },
]

export interface JourneyProps {
  label?: string
  title?: string
  description?: string
  ctaText?: string
  onCtaClick?: () => void
  className?: string
}

export default function Journey3x3AnimatedFlow({
  label = 'OUR EVOLUTION',
  title = 'Engineered for Scale and Precision',
  description = 'From a visionary enterprise in 1998 to a ₹200+ Crore industry leader — every milestone represents innovation and execution.',
  ctaText = 'Get Started',
  onCtaClick,
  className = '',
}: JourneyProps) {
  const { navigate } = useRouter()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  const sectionRef = useRef<HTMLElement>(null)

  /* Scroll Progress for Liquid Energy Beam */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 85%'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  })

  useEffect(() => {
    let isMounted = true
    fetchMilestones(true)
      .then((m) => {
        if (!isMounted) return
        const data = (m as Milestone[]) || []
        setMilestones(data.length >= 9 ? data.slice(0, 9) : FALLBACK_MILESTONES)
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
    Snake Mapping Matrix:
    Row 0: Cols 0, 1, 2  (Step 1, 2, 3) -> Left to Right
    Row 1: Cols 2, 1, 0  (Step 6, 5, 4) -> Right to Left
    Row 2: Cols 0, 1, 2  (Step 7, 8, 9) -> Left to Right
  */
  const getSnakeCard = (row: number, col: number) => {
    let index = 0
    if (row === 0) index = col
    else if (row === 1) index = 5 - col
    else if (row === 2) index = 6 + col

    return {
      milestone: milestones[index] || FALLBACK_MILESTONES[index],
      stepNumber: index + 1,
      isReversedRow: row === 1,
    }
  }

  /* Calculate trigger progress point per card for dynamic glow activation */
  const cardThreshold = (step: number) => (step - 0.5) / 9

  return (
    <section 
      ref={sectionRef} 
      className={`py-24 bg-slate-950 text-white relative overflow-hidden ${className}`.trim()}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B50]" />
              <span className="text-xs font-bold tracking-wider text-[#FF6B50] uppercase">
                {label}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-white">
              {title}
            </h2>

            <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              {description}
            </p>

            <Button
              onClick={handleCta}
              className="bg-[#FF6B50] hover:bg-[#e0583f] text-white rounded-full px-8 h-12 text-sm font-semibold shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* 3x3 Snake Container */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-2xl bg-slate-900" />
            ))}
          </div>
        ) : (
          <div className="relative">
            
            {/* Desktop SVG Fluid Energy Beam (Hidden on Mobile) */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
              <svg 
                className="w-full h-full" 
                viewBox="0 0 1200 900" 
                fill="none" 
                preserveAspectRatio="none"
              >
                {/* Background Dim Guide Line */}
                <path
                  d="M 200 150 L 1000 150 C 1180 150 1180 450 1000 450 L 200 450 C 20 450 20 750 200 750 L 1000 750"
                  stroke="#1E293B"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Animated Gradient Flowing Beam */}
                <motion.path
                  d="M 200 150 L 1000 150 C 1180 150 1180 450 1000 450 L 200 450 C 20 450 20 750 200 750 L 1000 750"
                  stroke="url(#snake-flow-gradient)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  style={{ pathLength: smoothProgress }}
                />

                <defs>
                  <linearGradient id="snake-flow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B50" />
                    <stop offset="50%" stopColor="#FF8C00" />
                    <stop offset="100%" stopColor="#FF3B00" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* 3x3 Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {[0, 1, 2].map((row) =>
                [0, 1, 2].map((col) => {
                  const { milestone, stepNumber, isReversedRow } = getSnakeCard(row, col)

                  return (
                    <motion.div
                      key={`${row}-${col}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ 
                        duration: 0.5, 
                        delay: (row * 3 + col) * 0.07,
                        ease: [0.21, 0.47, 0.32, 0.98]
                      }}
                      className="group relative"
                    >
                      <div className="relative p-7 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl transition-all duration-300 group-hover:-translate-y-2 group-hover:border-orange-500/50 group-hover:shadow-orange-500/10 flex flex-col justify-between min-h-[230px] overflow-hidden">
                        
                        {/* Animated Glow Highlight on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        {/* Large Step Watermark */}
                        <span className="absolute right-4 top-1 text-7xl font-black text-slate-800/50 pointer-events-none select-none group-hover:text-orange-500/10 transition-colors">
                          {String(stepNumber).padStart(2, '0')}
                        </span>

                        <div>
                          {/* Year Badge */}
                          <div className="mb-4">
                            <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#FF6B50] text-xs font-bold tracking-wider group-hover:bg-[#FF6B50] group-hover:text-white transition-colors">
                              {milestone.year}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-[#FF6B50] transition-colors">
                            {milestone.title}
                          </h3>

                          {/* Description */}
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>

                        {/* Footer Status */}
                        <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-medium text-slate-500">
                          <span>Milestone {stepNumber} / 9</span>
                          <span className="text-[#FF6B50] font-semibold group-hover:translate-x-1 transition-transform">
                            {isReversedRow ? '← Flow' : 'Flow →'}
                          </span>
                        </div>

                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  )
}
