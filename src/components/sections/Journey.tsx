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
  { id: 'm1', year: '1998', title: 'Inception', description: 'Party we years to order allow asked of. We so opinion friends me message as delight.', icon: 'Rocket', color: '#E8751A', order: 1, active: true, createdAt: '', updatedAt: '' },
  { id: 'm2', year: '2005', title: 'Private Limited Entity', description: 'His defective nor convinced residence own. Connection has put impossible own apartments boisterous.', icon: 'Wrench', color: '#E8751A', order: 2, active: true, createdAt: '', updatedAt: '' },
  { id: 'm3', year: '2018', title: '₹100+ Cr Turnover', description: 'From they fine john he give of rich he. They age and draw mrs like. Improving end distrusts may instantly.', icon: 'TrendingUp', color: '#E8751A', order: 3, active: true, createdAt: '', updatedAt: '' },
]

const DEFAULT_STATS = [
  { value: '29+', label: 'Years' },
  { value: '9', label: 'Milestones' },
  { value: '₹200Cr', label: 'Turnover' },
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
  label = 'OUR JOURNEY ACROSS THE WORLD',
  title = 'We have best team and best process',
  description = 'Yet bed any for travelling assistance indulgence unpleasing. Not thoughts all exercise blessing. Indulgence way everything joy.',
  ctaText = 'Get Started',
  onCtaClick,
  stats = DEFAULT_STATS,
  className = '',
}: JourneyProps) {
  const { navigate } = useRouter()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  const journeyRef = useRef<HTMLElement>(null)

  /* Scroll Progress for line drawing */
  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ['start 70%', 'end 80%'],
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

  // Coordinates for 3 milestone nodes along the SVG wave curve
  const nodePositions = [
    { left: '16%', top: '65%' },
    { left: '50%', top: '53%' },
    { left: '83%', top: '23%' },
  ]

  return (
    <section 
      ref={journeyRef} 
      className={`py-16 md:py-24 bg-white relative overflow-hidden ${className}`.trim()}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[500px]">
          
          {/* ─── Left Column: Hero Text Panel ─── */}
          <div className="lg:col-span-4 z-20">
            <FadeIn>
              <span className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-3 block">
                {label}
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                {title}
              </h2>

              <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm">
                {description}
              </p>

              <Button
                onClick={handleCta}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-7 h-11 text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {ctaText}
              </Button>
            </FadeIn>
          </div>

          {/* ─── Right Column: Curved Horizontal Flow ─── */}
          <div className="lg:col-span-8 relative h-[420px] w-full flex items-center justify-center">
            {loading ? (
              <div className="flex gap-6 w-full">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-40 flex-1 rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center">
                
                {/* Background SVG Wave Line */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  <svg 
                    className="w-full h-full overflow-visible" 
                    viewBox="0 0 800 400" 
                    fill="none" 
                    preserveAspectRatio="none"
                  >
                    {/* Shadow / Base Gray Stroke */}
                    <path
                      d="M 0 230 C 100 320, 200 320, 300 210 C 400 100, 500 240, 600 210 C 680 180, 740 100, 800 120"
                      stroke="#F3F4F6"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    
                    {/* Dynamic Animated Orange Wave Stroke */}
                    <motion.path
                      d="M 0 230 C 100 320, 200 320, 300 210 C 400 100, 500 240, 600 210 C 680 180, 740 100, 800 120"
                      stroke="#FF6B50"
                      strokeWidth="4"
                      strokeLinecap="round"
                      style={{ pathLength: smoothProgress }}
                    />
                  </svg>
                </div>

                {/* Horizontal Nodes List */}
                <div className="relative w-full h-full z-10">
                  {milestones.slice(0, 3).map((m, i) => {
                    const pos = nodePositions[i] || nodePositions[0]

                    return (
                      <div
                        key={m.id || i}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-start max-w-[210px]"
                        style={{ left: pos.left, top: pos.top }}
                      >
                        {/* Node Dot / Circle */}
                        <div className="relative mb-3 flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full bg-slate-300 border-4 border-white shadow-md z-10 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                          </div>
                        </div>

                        {/* Text Container with Large Watermark Number */}
                        <div className="relative pt-2">
                          {/* Giant Watermark Background Number */}
                          <span className="absolute -top-10 left-6 text-8xl font-black text-slate-100/80 -z-10 select-none pointer-events-none">
                            {i + 1}
                          </span>

                          <h3 className="text-sm font-bold text-slate-900 mb-1">
                            {m.title}
                          </h3>

                          <p className="text-xs text-slate-500 leading-relaxed">
                            {m.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
