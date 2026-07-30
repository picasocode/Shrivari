'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, MotionValue } from 'framer-motion'
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@/components/Router'
import { fetchMilestones, type Milestone } from '@/lib/api'

/* ─── Exact Content from Screenshot ─── */
const FALLBACK_MILESTONES: Milestone[] = [
  { id: 'm1', year: '1998', title: 'Inception', description: 'Shri Vaari Electricals was established as a firm in Chennai.', order: 1, active: true, createdAt: '', updatedAt: '' },
  { id: 'm2', year: '1999', title: 'AMC Services', description: 'Started Annual Maintenance Contract Services for industrial clients.', order: 2, active: true, createdAt: '', updatedAt: '' },
  { id: 'm3', year: '2003', title: 'New Office & Factory', description: 'Constructed state-of-the-art 20,000 sq ft facility at Guindy, Chennai.', order: 3, active: true, createdAt: '', updatedAt: '' },
  { id: 'm4', year: '2005', title: 'Private Limited Entity', description: 'Formally incorporated as a Private Limited corporate structure.', order: 4, active: true, createdAt: '', updatedAt: '' },
  { id: 'm5', year: '2009', title: 'First EHV Project', description: 'Executed our first Extra High Voltage electrical project successfully.', order: 5, active: true, createdAt: '', updatedAt: '' },
  { id: 'm6', year: '2014', title: 'Solar EPC Division', description: 'Expanded operations into turnkey Solar Power Plants EPC division.', order: 6, active: true, createdAt: '', updatedAt: '' },
  { id: 'm7', year: '2015', title: 'Schneider Partnership', description: 'Formed strategic alliance for High Voltage electrical distribution.', order: 7, active: true, createdAt: '', updatedAt: '' },
  { id: 'm8', year: '2018', title: '₹100+ Crores Turnover', description: 'Crossed the landmark revenue milestone of ₹100+ Crores.', order: 8, active: true, createdAt: '', updatedAt: '' },
  { id: 'm9', year: '2023', title: '55+ EHV Projects', description: 'Completed over 55+ major Extra High Voltage projects nationwide.', order: 9, active: true, createdAt: '', updatedAt: '' },
  { id: 'm10', year: '2025', title: 'IEC-61439 Certified', description: 'LT Switchgear panels certified to global IEC-61439 standards.', order: 10, active: true, createdAt: '', updatedAt: '' },
]

/* ─── Individual Node Card along Upward Graph ─── */
function UpwardCard({
  milestone,
  index,
  total,
  isEven,
  progress,
}: {
  milestone: Milestone
  index: number
  total: number
  isEven: boolean
  progress: MotionValue<number>
}) {
  const [isActive, setIsActive] = useState(false)
  const threshold = (index + 0.5) / total

  useEffect(() => {
    const unsub = progress.on('change', (v) => {
      setIsActive(v >= threshold)
    })
    return () => unsub()
  }, [progress, threshold])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`relative flex items-center justify-between gap-8 my-12 ${
        isEven ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Content Box */}
      <div className="w-[calc(50%-2.5rem)]">
        <div
          className={`p-6 sm:p-7 rounded-2xl bg-white border transition-all duration-500 relative overflow-hidden ${
            isActive
              ? 'border-slate-900 shadow-2xl shadow-orange-500/15 -translate-y-1'
              : 'border-slate-200/80 shadow-md shadow-slate-100 hover:border-slate-400'
          }`}
        >
          {/* Active Accent Header Line */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 transition-colors duration-500 ${
              isActive ? 'bg-[#FF6B50]' : 'bg-transparent'
            }`}
          />

          <div className="flex items-center justify-between mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wider transition-colors duration-500 ${
                isActive ? 'bg-slate-900 text-white' : 'bg-orange-50 text-[#FF6B50] border border-orange-200/60'
              }`}
            >
              {milestone.year}
            </span>
            <span className="text-xs font-bold text-slate-300">
              #{String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug tracking-tight">
            {milestone.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {milestone.description}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span className="flex items-center gap-1 text-[#FF6B50]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Growth
            </span>
            <span>Milestone {index + 1} of {total}</span>
          </div>
        </div>
      </div>

      {/* Central Graph Node Pulse Point */}
      <div className="relative z-20 flex items-center justify-center">
        <div
          className={`w-6 h-6 rounded-full border-4 bg-white transition-all duration-500 ${
            isActive
              ? 'border-[#FF6B50] scale-125 shadow-lg shadow-orange-500/50'
              : 'border-slate-300 scale-100'
          }`}
        >
          {isActive && (
            <span className="absolute inset-0 rounded-full bg-[#FF6B50] animate-ping opacity-40" />
          )}
        </div>
      </div>

      {/* Empty Balancing Spacer for Symmetric Layout */}
      <div className="w-[calc(50%-2.5rem)] hidden sm:block" />
    </motion.div>
  )
}

export interface JourneyProps {
  label?: string
  title?: string
  description?: string
  ctaText?: string
  onCtaClick?: () => void
  className?: string
}

export default function JourneyUpwardGraph({
  label = 'OUR JOURNEY',
  title = 'We have best team and best process',
  description = 'From a small firm in 1998 to a ₹200+ Crore enterprise — every milestone is a story of grit, innovation, and relentless pursuit of excellence.',
  ctaText = 'Get Started',
  onCtaClick,
  className = '',
}: JourneyProps) {
  const { navigate } = useRouter()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  const sectionRef = useRef<HTMLElement>(null)

  /* Scroll Progress for Upward Dynamic Graph Beam */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 70%', 'end 85%'],
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
        setMilestones(data.length ? data : FALLBACK_MILESTONES)
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
      ref={sectionRef}
      className={`py-24 bg-slate-50/70 text-slate-900 relative overflow-hidden font-sans ${className}`.trim()}
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Background Soft Glow Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-orange-200/20 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B50]" />
              <span className="text-xs font-bold tracking-wider text-[#FF6B50] uppercase">
                {label}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              {title}
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto tracking-normal">
              {description}
            </p>

            <Button
              onClick={handleCta}
              className="bg-[#FF6B50] hover:bg-[#e0583f] text-white rounded-full px-8 h-12 text-sm font-semibold shadow-lg shadow-orange-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* Upward Graph Container */}
        {loading ? (
          <div className="space-y-8 max-w-2xl mx-auto">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl bg-slate-200/60" />
            ))}
          </div>
        ) : (
          <div className="relative py-10">
            
            {/* Center Dynamic Upward Curved Beam Line */}
            <div className="absolute inset-0 flex justify-center pointer-events-none z-0">
              <svg
                className="h-full w-full max-w-2xl"
                viewBox="0 0 100 1000"
                fill="none"
                preserveAspectRatio="none"
              >
                {/* Background Dim Guide Curve */}
                <path
                  d="M 50 1000 L 50 0"
                  stroke="#E2E8F0"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />

                {/* Animated Liquid Upward Growing Line */}
                <motion.path
                  d="M 50 1000 L 50 0"
                  stroke="url(#upward-graph-gradient)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  style={{ pathLength: smoothProgress }}
                />

                <defs>
                  <linearGradient id="upward-graph-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#1E293B" />
                    <stop offset="50%" stopColor="#FF6B50" />
                    <stop offset="100%" stopColor="#FF3B00" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Render 10 Milestones Bottom to Top */}
            <div className="relative z-10">
              {milestones.map((m, i) => (
                <UpwardCard
                  key={m.id || i}
                  milestone={m}
                  index={i}
                  total={milestones.length}
                  isEven={i % 2 === 0}
                  progress={smoothProgress}
                />
              ))}
            </div>

          </div>
        )}

      </div>
    </section>
  )
}
