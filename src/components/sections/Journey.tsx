'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@/components/Router'
import { fetchMilestones, type Milestone } from '@/lib/api'

/* ─── Content Data ─── */
const FALLBACK_MILESTONES: Milestone[] = [
  { id: 'm1', year: '1998', title: 'Inception', description: 'Shri Vaari Electricals established as a premier electrical firm in Chennai.', order: 1, active: true, createdAt: '', updatedAt: '' },
  { id: 'm2', year: '1999', title: 'AMC Services', description: 'Initiated Annual Maintenance Contract services for industrial clients.', order: 2, active: true, createdAt: '', updatedAt: '' },
  { id: 'm3', year: '2003', title: 'New Facility', description: 'Built a state-of-the-art 20,000 sq ft manufacturing unit at Guindy.', order: 3, active: true, createdAt: '', updatedAt: '' },
  { id: 'm4', year: '2005', title: 'Pvt Ltd Entity', description: 'Formally incorporated as a Private Limited industrial corporation.', order: 4, active: true, createdAt: '', updatedAt: '' },
  { id: 'm5', year: '2009', title: 'First EHV Project', description: 'Successfully executed our landmark Extra High Voltage project.', order: 5, active: true, createdAt: '', updatedAt: '' },
  { id: 'm6', year: '2014', title: 'Solar Division', description: 'Expanded into turnkey Solar Power Plant EPC solutions.', order: 6, active: true, createdAt: '', updatedAt: '' },
  { id: 'm7', year: '2015', title: 'Schneider Partner', description: 'Formed strategic alliance for high-voltage power distribution.', order: 7, active: true, createdAt: '', updatedAt: '' },
  { id: 'm8', year: '2018', title: '₹100+ Cr Turnover', description: 'Crossed the major revenue milestone of ₹100+ Crores.', order: 8, active: true, createdAt: '', updatedAt: '' },
  { id: 'm9', year: '2023', title: '55+ EHV Projects', description: 'Completed over 55+ major EHV infrastructure projects.', order: 9, active: true, createdAt: '', updatedAt: '' },
  { id: 'm10', year: '2025', title: 'IEC-61439 Certified', description: 'LT Switchgear panels certified to international IEC standards.', order: 10, active: true, createdAt: '', updatedAt: '' },
]

export interface JourneyProps {
  label?: string
  title?: string
  description?: string
  ctaText?: string
  onCtaClick?: () => void
  className?: string
}

export default function HorizontalInfographicJourney({
  label = 'OUR EVOLUTION',
  title = 'Engineered for Scale & Precision',
  description = 'From a visionary enterprise in 1998 to a ₹200+ Crore industry leader — explore our journey across three decades of growth.',
  ctaText = 'Get Started',
  onCtaClick,
  className = '',
}: JourneyProps) {
  const { navigate } = useRouter()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const scrollAmount = 340
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section
      className={`py-24 bg-slate-950 text-white relative overflow-hidden font-sans ${className}`.trim()}
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-800/20 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block with Scroll Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B50]" />
              <span className="text-xs font-bold tracking-wider text-[#FF6B50] uppercase">
                {label}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {title}
            </h2>

            <p className="text-slate-400 text-base leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleCta}
              className="bg-[#FF6B50] hover:bg-[#e0583f] text-white rounded-full px-6 h-11 text-sm font-semibold shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-11 h-11 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-11 h-11 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Track Layout */}
        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64 min-w-[300px] rounded-2xl bg-slate-900" />
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Main Progress Rail */}
            <div className="absolute top-[27px] left-0 right-0 h-0.5 bg-slate-800 z-0" />

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-8 pt-2 px-2 z-10 relative"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {milestones.map((m, i) => {
                const isActive = activeIndex === i

                return (
                  <motion.div
                    key={m.id || i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    onClick={() => setActiveIndex(i)}
                    className="min-w-[300px] sm:min-w-[340px] flex-shrink-0 cursor-pointer group"
                  >
                    {/* Top Connection Node */}
                    <div className="flex items-center mb-6 relative">
                      <div
                        className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 ${
                          isActive
                            ? 'bg-[#FF6B50] border-[#FF6B50] text-white shadow-lg shadow-orange-500/30 scale-110'
                            : 'bg-slate-900 border-slate-800 text-slate-400 group-hover:border-slate-700 group-hover:text-white'
                        }`}
                      >
                        {m.year}
                      </div>
                      <div className="ml-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Step {String(i + 1).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Infographic Card */}
                    <div
                      className={`p-6 rounded-2xl border transition-all duration-300 h-[220px] flex flex-col justify-between ${
                        isActive
                          ? 'bg-slate-900 border-orange-500/50 shadow-2xl shadow-orange-500/10'
                          : 'bg-slate-900/60 border-slate-800/80 group-hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div>
                        <h3
                          className={`text-lg font-bold mb-2 transition-colors ${
                            isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                          }`}
                        >
                          {m.title}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {m.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1 text-[#FF6B50]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                        <span>Phase {i + 1}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
