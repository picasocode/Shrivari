'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion'
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
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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
  label = 'Our Journey',
  title = 'Engineering Excellence Through the Decades',
  description = 'From a visionary small enterprise in 1998 to a ₹200+ Crore industry leader — every milestone represents innovation, grit, and structural integrity.',
  ctaText = 'Get In Touch',
  onCtaClick,
  stats = DEFAULT_STATS,
  className = '',
}: JourneyProps) {
  const { navigate } = useRouter()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  const journeyRef = useRef<HTMLElement>(null)

  /* Scroll Progress Line */
  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ['start 70%', 'end 80%'],
  })

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
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

  return (
    <section 
      ref={journeyRef} 
      className={`py-20 md:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden ${className}`.trim()}
    >
      {/* Background Decorator Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ─── Left Sticky Hero Panel ─── */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#E8751A]" />
                <span className="text-xs font-bold tracking-wider text-[#E8751A] uppercase">
                  {label}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                {title}
              </h2>

              <div className="w-16 h-1 bg-[#E8751A] rounded-full mb-6" />

              <p className="text-slate-600 text-base leading-relaxed mb-8">
                {description}
              </p>

              <Button
                onClick={handleCta}
                className="bg-[#E8751A] hover:bg-[#d56817] text-white shadow-lg shadow-orange-500/20 rounded-xl px-7 h-12 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Stats Bar */}
              {stats && stats.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4">
                  {stats.map((s) => (
                    <div key={s.label} className="flex flex-col">
                      <span className="text-2xl font-black text-slate-900 tabular-nums">
                        {s.value}
                      </span>
                      <span className="text-xs font-medium text-slate-500 mt-1">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </FadeIn>
          </div>

          {/* ─── Right Timeline Section ─── */}
          <div className="lg:col-span-8">
            {loading ? (
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="bg-white/80 rounded-2xl border border-slate-200/80 shadow-sm">
                    <CardContent className="p-6 space-y-3">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : milestones.length === 0 ? (
              <div className="text-center py-12 text-slate-500">No milestones available.</div>
            ) : (
              <div className="relative pl-6 sm:pl-8">
                
                {/* Dynamic Scroll Animated Background Line */}
                <div className="absolute left-[17px] sm:left-[25px] top-4 bottom-6 w-0.5 bg-slate-200" />
                <motion.div
                  style={{ scaleY }}
                  className="absolute left-[17px] sm:left-[25px] top-4 bottom-6 w-0.5 bg-gradient-to-b from-[#E8751A] via-amber-500 to-teal-500 origin-top"
                />

                {/* Timeline Cards Container */}
                <div className="space-y-8">
                  {milestones.map((m, i) => (
                    <FadeIn key={m.id || (m.year + m.title)} delay={i * 0.05}>
                      <div className="relative group flex items-start gap-4 sm:gap-6">
                        
                        {/* Timeline Node Point with Icon */}
                        <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-[#E8751A] text-[#E8751A] shadow-md group-hover:bg-[#E8751A] group-hover:text-white transition-colors duration-300">
                          <GetMilestoneIcon name={m.icon} className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
                        </div>

                        {/* Content Card */}
                        <div className="flex-1">
                          <Card className="bg-white/90 backdrop-blur-sm border border-slate-200/70 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-2xl overflow-hidden">
                            <CardContent className="p-5 sm:p-6 relative">
                              
                              {/* Background Index Number */}
                              <span
                                aria-hidden="true"
                                className="absolute right-4 top-2 text-5xl sm:text-6xl font-black text-slate-100 select-none pointer-events-none transition-colors duration-300 group-hover:text-orange-500/10"
                              >
                                {String(i + 1).padStart(2, '0')}
                              </span>

                              <div className="relative z-10 space-y-2">
                                <div className="inline-block px-2.5 py-0.5 rounded-md bg-orange-50 text-[#E8751A] text-xs font-extrabold tracking-wider uppercase border border-orange-200/60">
                                  {m.year}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#E8751A] transition-colors">
                                  {m.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                  {m.description}
                                </p>
                              </div>

                            </CardContent>
                          </Card>
                        </div>

                      </div>
                    </FadeIn>
                  ))}
                </div>

                {/* Timeline End Cap */}
                <div className="mt-10 pl-10 sm:pl-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white shadow-md">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold tracking-wider uppercase">
                      The Journey Continues...
                    </span>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
