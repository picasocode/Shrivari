'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight, Sparkles, CheckCircle2, Rocket, Factory, Building2, Zap, Sun,
  Handshake, Award, TrendingUp, Target, BadgeCheck, LayoutGrid, ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@/components/Router'
import { fetchMilestones, type Milestone } from '@/lib/api'

/* ─── Brand tokens ─── */
const NAVY = '#152D4F'
const NAVY_DEEP = '#0D1D3A'
const CORAL = '#E8751A'
const INK = '#1A1A2E'
const SLATE = '#6B7280'

/* ─── Content Data ─── */
const FALLBACK_MILESTONES: Milestone[] = [
  { id: 'm1', year: '1998', title: 'Inception', description: 'Shri Vaari Electricals established as a premier electrical firm in Chennai.', icon: 'Rocket', color: '#1B3A5C', order: 1, active: true, createdAt: '', updatedAt: '' },
  { id: 'm2', year: '1999', title: 'AMC Services', description: 'Initiated Annual Maintenance Contract services for industrial clients.', icon: 'ShieldCheck', color: '#1B3A5C', order: 2, active: true, createdAt: '', updatedAt: '' },
  { id: 'm3', year: '2003', title: 'New Facility', description: 'Built a state-of-the-art 20,000 sq ft manufacturing unit at Guindy.', icon: 'Factory', color: '#1B3A5C', order: 3, active: true, createdAt: '', updatedAt: '' },
  { id: 'm4', year: '2005', title: 'Pvt Ltd Entity', description: 'Formally incorporated as a Private Limited industrial corporation.', icon: 'Building2', color: '#1B3A5C', order: 4, active: true, createdAt: '', updatedAt: '' },
  { id: 'm5', year: '2009', title: 'First EHV Project', description: 'Successfully executed our landmark Extra High Voltage project.', icon: 'Zap', color: '#1B3A5C', order: 5, active: true, createdAt: '', updatedAt: '' },
  { id: 'm6', year: '2014', title: 'Solar Division', description: 'Expanded into turnkey Solar Power Plant EPC solutions.', icon: 'Sun', color: '#1B3A5C', order: 6, active: true, createdAt: '', updatedAt: '' },
  { id: 'm7', year: '2015', title: 'Schneider Partner', description: 'Formed strategic alliance for high-voltage power distribution.', icon: 'Handshake', color: '#1B3A5C', order: 7, active: true, createdAt: '', updatedAt: '' },
  { id: 'm8', year: '2018', title: '₹100+ Cr Turnover', description: 'Crossed the major revenue milestone of ₹100+ Crores.', icon: 'TrendingUp', color: '#1B3A5C', order: 8, active: true, createdAt: '', updatedAt: '' },
  { id: 'm9', year: '2023', title: '55+ EHV Projects', description: 'Completed over 55+ major EHV infrastructure projects.', icon: 'Award', color: '#1B3A5C', order: 9, active: true, createdAt: '', updatedAt: '' },
  { id: 'm10', year: '2025', title: 'IEC-61439 Certified', description: 'LT Switchgear panels certified to international IEC standards.', icon: 'BadgeCheck', color: '#1B3A5C', order: 10, active: true, createdAt: '', updatedAt: '' },
]

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Rocket, Factory, Building2, Zap, Sun, Handshake, Award, TrendingUp, Target, BadgeCheck, LayoutGrid, ShieldCheck,
}

export interface JourneyProps {
  label?: string
  title?: string
  description?: string
  ctaText?: string
  onCtaClick?: () => void
  className?: string
}

/* ═══════════════════════════════════════════════════════════
   Vertical alternating timeline — desktop: year & card alternate
   around a center rail; mobile: single left-rail column
   ═══════════════════════════════════════════════════════════ */
export default function VerticalTimelineJourney({
  label = 'OUR EVOLUTION',
  title = 'Three Decades of Engineering Milestones',
  description = 'From a visionary enterprise in 1998 to a ₹200+ Crore industry leader — explore our journey across three decades of growth.',
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
      className={`py-16 md:py-24 bg-[#F8FAFC] relative overflow-hidden font-sans ${className}`.trim()}
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      {/* Ambient glows */}
      <div className="absolute top-1/3 -left-32 w-[28rem] h-[28rem] bg-[#E8751A]/[0.05] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-32 w-[28rem] h-[28rem] bg-[#152D4F]/[0.04] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[1080px] mx-auto px-5 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8751A]/10 border border-[#E8751A]/25 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#E8751A]" />
              <span className="text-xs font-bold tracking-[0.2em] text-[#E8751A] uppercase">{label}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A2E] tracking-tight leading-tight mb-4">
              {title}
            </h2>
            <p className="text-[#6B7280] text-sm md:text-base leading-relaxed">{description}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCta}
              className="bg-[#E8751A] hover:bg-[#d96914] text-white rounded-full px-6 h-11 text-sm font-semibold shadow-lg shadow-[#E8751A]/20 transition-all hover:scale-105 active:scale-95"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-6">
                <Skeleton className={`h-24 rounded-2xl bg-white ${i % 2 === 0 ? '' : 'md:order-2'}`} />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Center rail — mobile: left rail */}
            <div
              className="absolute top-2 bottom-2 left-[23px] md:left-1/2 md:-translate-x-1/2 w-px"
              style={{ background: `linear-gradient(to bottom, ${CORAL} 0%, #CBD5E1 12%, #CBD5E1 88%, transparent 100%)` }}
            />

            <div className="space-y-8 md:space-y-12">
              {milestones.map((m, i) => {
                const Icon = iconMap[m.icon] || Rocket
                const isLeft = i % 2 === 0
                return (
                  <motion.div
                    key={m.id || i}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="relative pl-16 md:pl-0 md:grid md:grid-cols-2 md:gap-16 md:items-center"
                  >
                    {/* Node on the rail */}
                    <div className="absolute left-[23px] md:left-1/2 top-5 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-10">
                      <div
                        className="w-11 h-11 rounded-full bg-white border-2 flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-110"
                        style={{ borderColor: CORAL, boxShadow: `0 6px 16px ${CORAL}30` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: CORAL }} />
                      </div>
                    </div>

                    {/* Year — opposite cell, faces the rail */}
                    <div className={`${isLeft ? 'md:col-start-1 md:text-right' : 'md:col-start-2 md:order-2 md:text-left'} mb-3 md:mb-0`}>
                      <span
                        className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none"
                        style={{ color: i === milestones.length - 1 ? CORAL : NAVY }}
                      >
                        {m.year}
                      </span>
                    </div>

                    {/* Card */}
                    <div className={isLeft ? 'md:col-start-2' : 'md:col-start-1 md:order-1'}>
                      <div
                        className="group relative bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm hover:shadow-xl hover:border-[#E8751A]/40 transition-all duration-300 overflow-hidden"
                      >
                        {/* Top accent on hover */}
                        <div
                          className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ background: `linear-gradient(90deg, ${CORAL}, ${NAVY})` }}
                        />
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-bold leading-tight" style={{ color: INK }}>
                            {m.title}
                          </h3>
                          <span
                            className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#E8751A]/10 text-[10px] font-bold uppercase tracking-wide"
                            style={{ color: CORAL }}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Milestone
                          </span>
                        </div>
                        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: SLATE }}>
                          {m.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* End cap */}
            <div className="relative pl-16 md:pl-0 mt-8 md:mt-10">
              <div className="absolute left-[23px] md:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                <div className="w-3.5 h-3.5 rounded-full" style={{ background: NAVY_DEEP }} />
              </div>
              <p className="md:text-center text-xs font-bold uppercase tracking-[0.25em] text-[#94A3B8] pl-0 md:pl-0">
                The journey continues
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
