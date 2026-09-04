'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@/components/Router'
import { fetchMilestones, type Milestone } from '@/lib/api'

/* ─── Brand tokens ─── */
const NAVY = '#152D4F'
const CORAL = '#E8751A'

/* ─── Content Data ─── */
const FALLBACK_MILESTONES: Milestone[] = [
  { id: 'm1', year: '1998', title: 'Inception', description: 'Shri Vaari Electricals established as a premier electrical firm in Chennai.', icon: 'Rocket', color: '#1B3A5C', order: 1, active: true, createdAt: '', updatedAt: '' },
  { id: 'm2', year: '1999', title: 'AMC Services', description: 'Initiated Annual Maintenance Contract services for industrial clients.', icon: 'Rocket', color: '#1B3A5C', order: 2, active: true, createdAt: '', updatedAt: '' },
  { id: 'm3', year: '2003', title: 'New Facility', description: 'Built a state-of-the-art 20,000 sq ft manufacturing unit at Guindy.', icon: 'Rocket', color: '#1B3A5C', order: 3, active: true, createdAt: '', updatedAt: '' },
  { id: 'm4', year: '2005', title: 'Pvt Ltd Entity', description: 'Formally incorporated as a Private Limited industrial corporation.', icon: 'Rocket', color: '#1B3A5C', order: 4, active: true, createdAt: '', updatedAt: '' },
  { id: 'm5', year: '2009', title: 'First EHV Project', description: 'Successfully executed our landmark Extra High Voltage project.', icon: 'Rocket', color: '#1B3A5C', order: 5, active: true, createdAt: '', updatedAt: '' },
  { id: 'm6', year: '2014', title: 'Solar Division', description: 'Expanded into turnkey Solar Power Plant EPC solutions.', icon: 'Rocket', color: '#1B3A5C', order: 6, active: true, createdAt: '', updatedAt: '' },
  { id: 'm7', year: '2015', title: 'Schneider Partner', description: 'Formed strategic alliance for high-voltage power distribution.', icon: 'Rocket', color: '#1B3A5C', order: 7, active: true, createdAt: '', updatedAt: '' },
  { id: 'm8', year: '2018', title: '₹100+ Cr Turnover', description: 'Crossed the major revenue milestone of ₹100+ Crores.', icon: 'Rocket', color: '#1B3A5C', order: 8, active: true, createdAt: '', updatedAt: '' },
  { id: 'm9', year: '2023', title: '55+ EHV Projects', description: 'Completed over 55+ major EHV infrastructure projects.', icon: 'Rocket', color: '#1B3A5C', order: 9, active: true, createdAt: '', updatedAt: '' },
  { id: 'm10', year: '2025', title: 'IEC-61439 Certified', description: 'LT Switchgear panels certified to international IEC standards.', icon: 'Rocket', color: '#1B3A5C', order: 10, active: true, createdAt: '', updatedAt: '' },
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
    const scrollAmount = 320
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section
      className={`py-16 md:py-24 bg-[#F8FAFC] relative overflow-hidden font-sans ${className}`.trim()}
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      {/* Ambient coral glow */}
      <div className="absolute top-1/3 -left-32 w-[28rem] h-[28rem] bg-[#E8751A]/[0.05] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-32 w-[28rem] h-[28rem] bg-[#E8751A]/[0.04] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">

        {/* Header Block with Scroll Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8751A]/10 border border-[#E8751A]/25 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#E8751A]" />
              <span className="text-xs font-bold tracking-[0.2em] text-[#E8751A] uppercase">
                {label}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A2E] tracking-tight leading-tight mb-4">
              {title}
            </h2>

            <p className="text-[#6B7280] text-sm md:text-base leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleCta}
              className="bg-[#E8751A] hover:bg-[#d96914] text-white rounded-full px-6 h-11 text-sm font-semibold shadow-lg shadow-[#E8751A]/20 transition-all hover:scale-105 active:scale-95"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#1A1A2E] hover:text-[#E8751A] hover:border-[#E8751A]/40 transition-colors shadow-sm"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#1A1A2E] hover:text-[#E8751A] hover:border-[#E8751A]/40 transition-colors shadow-sm"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* BOX-TYPE horizontal track layout */}
        {loading ? (
          <div className="flex gap-5 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 min-w-[280px] rounded-2xl bg-white" />
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Main Progress Rail — thin line */}
            <div className="absolute top-[34px] left-0 right-0 h-px bg-slate-200 z-0" />
            {/* Animated progress fill */}
            <div
              className="absolute top-[34px] left-0 h-[2px] z-0 transition-all duration-500"
              style={{
                width: `${((activeIndex + 1) / milestones.length) * 100}%`,
                maxWidth: '100%',
                background: `linear-gradient(90deg, ${CORAL} 0%, ${NAVY} 100%)`,
              }}
            />

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-6 pt-2 px-1 z-10 relative"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {milestones.map((m, i) => {
                const isActive = activeIndex === i
                const isPast = i < activeIndex

                return (
                  <motion.div
                    key={m.id || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    onClick={() => setActiveIndex(i)}
                    className="min-w-[280px] sm:min-w-[300px] flex-shrink-0 cursor-pointer group"
                  >
                    {/* Top Connection Node — BOX TYPE (square) */}
                    <div className="flex items-center mb-4 relative">
                      <div
                        className={`relative w-12 h-12 flex items-center justify-center font-bold text-xs transition-all duration-300 z-10 rounded-xl border-2 ${
                          isActive
                            ? 'text-white scale-110 shadow-lg'
                            : isPast
                              ? 'text-white border-transparent'
                              : 'bg-white text-[#1F2937] border-slate-200 group-hover:border-[#E8751A]/40'
                        }`}
                        style={{
                          backgroundColor: isActive ? CORAL : isPast ? NAVY : '#FFFFFF',
                          boxShadow: isActive ? `0 8px 20px ${CORAL}40` : isPast ? 'none' : undefined,
                          borderColor: isActive ? CORAL : isPast ? NAVY : undefined,
                        }}
                      >
                        {m.year}
                      </div>
                    </div>

                    {/* BOX-TYPE Card — clean rectangular design with rounded corners */}
                    <div
                      className={`relative rounded-2xl p-5 border-2 transition-all duration-300 h-[160px] flex flex-col justify-between overflow-hidden ${
                        isActive
                          ? 'bg-white shadow-xl'
                          : 'bg-white/80 group-hover:bg-white group-hover:shadow-md'
                      }`}
                      style={{
                        borderColor: isActive ? `${CORAL}55` : isPast ? `${NAVY}30` : '#E5E7EB',
                      }}
                    >
                      {/* Coral top accent bar (only when active) */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(90deg, ${CORAL} 0%, ${NAVY} 100%)`,
                          opacity: isActive ? 1 : 0,
                        }}
                      />
                      <div className="relative z-10">
                        <h3
                          className={`text-base font-bold mb-1.5 transition-colors leading-tight ${
                            isActive ? 'text-[#1A1A2E]' : 'text-[#1A1A2E] group-hover:text-[#E8751A]'
                          }`}
                        >
                          {m.title}
                        </h3>
                        <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">
                          {m.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium relative z-10">
                        <span className={`flex items-center gap-1 ${isActive ? 'text-[#E8751A]' : 'text-[#9CA3AF]'}`}>
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
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
