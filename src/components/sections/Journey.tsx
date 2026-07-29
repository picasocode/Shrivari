'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@/components/Router'
import { fetchMilestones, type Milestone } from '@/lib/api'

/* ─── Motion Fade Wrapper ─── */
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
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.45, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

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

export default function Journey3x3Snake({
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
    Calculate Snake Order for 3x3 Grid:
    Row 0: [0, 1, 2] -> Left to Right (01, 02, 03)
    Row 1: [5, 4, 3] -> Right to Left (06, 05, 04)
    Row 2: [6, 7, 8] -> Left to Right (07, 08, 09)
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

  return (
    <section className={`py-20 bg-slate-50/50 relative overflow-hidden ${className}`.trim()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
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

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              {description}
            </p>

            <Button
              onClick={handleCta}
              className="bg-[#FF6B50] hover:bg-[#e0583f] text-white rounded-full px-8 h-12 text-sm font-semibold shadow-lg shadow-orange-500/20 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </FadeIn>
        </div>

        {/* 3x3 S-Snake Grid Container */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-52 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="relative">
            
            {/* Desktop Background S-Connecting Curve Lines */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
              <svg 
                className="w-full h-full" 
                viewBox="0 0 1200 900" 
                fill="none" 
                preserveAspectRatio="none"
              >
                {/* Row 1 Path */}
                <path d="M 200 150 L 1000 150" stroke="#FF6B50" strokeWidth="3" strokeDasharray="6 6" opacity="0.3" />
                {/* Right S-Turn (Row 1 -> Row 2) */}
                <path d="M 1000 150 C 1160 150, 1160 450, 1000 450" stroke="#FF6B50" strokeWidth="3" strokeDasharray="6 6" opacity="0.3" />
                {/* Row 2 Path */}
                <path d="M 1000 450 L 200 450" stroke="#FF6B50" strokeWidth="3" strokeDasharray="6 6" opacity="0.3" />
                {/* Left S-Turn (Row 2 -> Row 3) */}
                <path d="M 200 450 C 40 450, 40 750, 200 750" stroke="#FF6B50" strokeWidth="3" strokeDasharray="6 6" opacity="0.3" />
                {/* Row 3 Path */}
                <path d="M 200 750 L 1000 750" stroke="#FF6B50" strokeWidth="3" strokeDasharray="6 6" opacity="0.3" />
              </svg>
            </div>

            {/* 3x3 Matrix Rendering */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {[0, 1, 2].map((row) =>
                [0, 1, 2].map((col) => {
                  const { milestone, stepNumber, isReversedRow } = getSnakeCard(row, col)

                  return (
                    <FadeIn key={`${row}-${col}`} delay={(row * 3 + col) * 0.06}>
                      <div className="relative p-7 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 transition-all duration-300 hover:-translate-y-2 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-500/10 group flex flex-col justify-between min-h-[220px]">
                        
                        {/* Large Background Step Number */}
                        <span className="absolute right-5 top-3 text-6xl font-black text-slate-100/90 pointer-events-none select-none group-hover:text-orange-500/10 transition-colors">
                          {String(stepNumber).padStart(2, '0')}
                        </span>

                        <div>
                          {/* Top Year Badge */}
                          <div className="mb-4">
                            <span className="inline-block px-3 py-1 rounded-md bg-orange-50 text-[#FF6B50] text-xs font-bold tracking-wide">
                              {milestone.year}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-[#FF6B50] transition-colors">
                            {milestone.title}
                          </h3>

                          {/* Description */}
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>

                        {/* Bottom Footer Info */}
                        <div className="mt-6 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                          <span>Milestone {stepNumber} / 9</span>
                          <span className="text-[#FF6B50] group-hover:translate-x-1 transition-transform">
                            {isReversedRow ? '← Flow' : 'Flow →'}
                          </span>
                        </div>

                      </div>
                    </FadeIn>
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
