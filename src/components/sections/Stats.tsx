'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Building2, MapPin, TrendingUp, Globe, Route, UserCheck, HardHat } from 'lucide-react'
import { fetchSettings, type SiteSettings } from '@/lib/api'

interface StatItem {
  icon: React.ComponentType<{ className?: string }>
  value: number
  suffix: string
  label: string
}

const defaultStats: StatItem[] = [
  { icon: Users, value: 3000, suffix: '+', label: 'Customers' },
  { icon: UserCheck, value: 400, suffix: '+', label: 'Employees' },
  { icon: MapPin, value: 7, suffix: '', label: 'Branches' },
  { icon: TrendingUp, value: 125, suffix: ' Cr', label: 'Turnover' },
  { icon: Globe, value: 20, suffix: '+', label: 'MNCs' },
  { icon: Route, value: 100, suffix: 'Km+', label: 'Transmission Lines' },
  { icon: Building2, value: 20, suffix: '+', label: 'Consultants' },
  { icon: HardHat, value: 30, suffix: '+', label: 'EHV Projects' },
]

function AnimatedCounter({ value, suffix, duration = 2 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.floor(eased * value))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [isInView, value, duration])

  return (
    <span ref={ref} className="text-3xl md:text-4xl font-semibold text-white">
      {count}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => {})
  }, [])

  // Override with settings if available
  const stats = defaultStats.map((stat) => {
    const key = stat.label.toLowerCase().replace(/\s+/g, '_')
    const settingsValue = settings?.[`stat_${key}`]
    if (settingsValue) {
      const numMatch = settingsValue.match(/(\d+)/)
      if (numMatch) {
        return { ...stat, value: parseInt(numMatch[1]), suffix: settingsValue.replace(numMatch[1], '') }
      }
    }
    return stat
  })

  return (
    <section
      className="py-16 md:py-24 bg-[#0D1B3E] relative overflow-hidden"
      ref={ref}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute w-96 h-96 rounded-full bg-[#2196F3] -top-48 -right-48" />
        <div className="absolute w-64 h-64 rounded-full bg-[#2196F3] -bottom-32 -left-32" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-[28px] md:text-[40px] font-semibold text-white mb-4">
            Our Achievements
          </h2>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto">
            Numbers that reflect our commitment to excellence
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-4">
                <stat.icon className="w-7 h-7 text-[#2196F3]" />
              </div>
              <div className="mb-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-white/60 text-sm font-light">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
