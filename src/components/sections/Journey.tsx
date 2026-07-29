'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@/components/Router'
import { fetchMilestones, type Milestone } from '@/lib/api'

const FALLBACK_MILESTONES: Milestone[] = [
  { id: 'm1', year: '1998', title: 'Inception', description: 'Shri Vaari Electricals was established as a firm in Chennai.', order: 1, active: true, createdAt: '', updatedAt: '' },
  { id: 'm2', year: '1999', title: 'AMC Services', description: 'Started Annual Maintenance Contract Services for industrial clients.', order: 2, active: true, createdAt: '', updatedAt: '' },
  { id: 'm3', year: '2003', title: 'New Factory', description: 'Constructed state-of-the-art 20,000 sq ft factory at Guindy.', order: 3, active: true, createdAt: '', updatedAt: '' },
  { id: 'm4', year: '2005', title: 'Private Limited', description: 'Formally incorporated as a Private Limited company.', order: 4, active: true, createdAt: '', updatedAt: '' },
  { id: 'm5', year: '2009', title: 'First EHV Project', description: 'Successfully executed our first Extra High Voltage electrical project.', order: 5, active: true, createdAt: '', updatedAt: '' },
  { id: 'm6', year: '2014', title: 'Solar EPC Division', description: 'Expanded operations into Solar Power Plant EPC solutions.', order: 6, active: true, createdAt: '', updatedAt: '' },
  { id: 'm7', year: '2015', title: 'Schneider Partner', description: 'Formed strategic alliance with Schneider Electric.', order: 7, active: true, createdAt: '', updatedAt: '' },
  { id: 'm8', year: '2018', title: '₹100+ Cr Turnover', description: 'Crossed landmark revenue milestone of ₹100+ Crores.', order: 8, active: true, createdAt: '', updatedAt: '' },
  { id: 'm9', year: '2023', title: '55+ Major Projects', description: 'Completed over 55+ major EHV turnkey installations.', order: 9, active: true, createdAt: '', updatedAt: '' },
  { id: 'm10', year: '2025', title: 'IEC-61439 Certified', description: 'LT Panels certified to international quality standards.', order: 10, active: true, createdAt: '', updatedAt: '' },
]

export default function JourneySlider() {
  const { navigate } = useRouter()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMilestones(true)
      .then((m) => setMilestones(m?.length ? m : FALLBACK_MILESTONES))
      .catch(() => setMilestones(FALLBACK_MILESTONES))
      .finally(() => setLoading(false))
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const scrollAmount = direction === 'left' ? -320 : 320
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <section className="py-20 bg-slate-95/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-4 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B50]" />
              <span className="text-xs font-bold tracking-wider text-[#FF6B50] uppercase">
                OUR JOURNEY
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              We have best team and best process
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              From a small firm in 1998 to a ₹200+ Crore enterprise — every milestone is a story of grit, innovation, and pursuit of excellence.
            </p>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('contact')}
                className="bg-[#FF6B50] hover:bg-[#e0583f] text-white rounded-full px-7 h-12 text-sm font-semibold shadow-lg shadow-orange-500/20"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {/* Slider Nav Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scroll('left')}
                  className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-sm"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-sm"
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Non-Overlapping Wave Cards */}
          <div className="lg:col-span-8 relative">
            {loading ? (
              <div className="flex gap-4 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-64 w-64 rounded-2xl shrink-0" />
                ))}
              </div>
            ) : (
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scrollbar-none py-8 px-2 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {milestones.map((m, i) => {
                  const isEven = i % 2 === 0
                  return (
                    <div
                      key={m.id || i}
                      className={`relative shrink-0 w-64 p-6 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 transition-transform hover:-translate-y-2 duration-300 flex flex-col justify-between ${
                        isEven ? 'mt-0' : 'mt-8'
                      }`}
                    >
                      <span className="absolute -top-6 right-4 text-6xl font-black text-slate-100/80 pointer-events-none select-none">
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      <div>
                        <div className="inline-block px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF6B50] text-xs font-bold mb-3">
                          {m.year}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                          {m.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {m.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center text-[11px] font-semibold text-[#FF6B50]">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Milestone Verified
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
