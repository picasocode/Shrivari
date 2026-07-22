'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Zap, Factory, Wrench } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { fetchSettings, type SiteSettings } from '@/lib/api'

const features = [
  {
    icon: Zap,
    title: 'EPC',
    subtitle: 'Electrical Systems upto 400KV',
    description:
      'Complete Engineering, Procurement and Construction services for electrical systems ranging from low voltage to Extra High Voltage up to 400KV.',
    color: '#2196F3',
  },
  {
    icon: Factory,
    title: 'Manufacturing',
    subtitle: 'Panel Boards 415V to 33KV',
    description:
      'State-of-the-art manufacturing facility for LT and HT Panel Boards, from 415V distribution panels to 33KV switchgear panels with ISI certification.',
    color: '#0D1B3E',
  },
  {
    icon: Wrench,
    title: 'Services',
    subtitle: 'CEIG/CEA/Transmission & Distribution',
    description:
      'Comprehensive electrical services including CEIG approvals, CEA compliance, and Transmission & Distribution project execution across South India.',
    color: '#2196F3',
  },
]

const fallbackText =
  'Shri Vaari Electricals Pvt. Ltd. is a professionally managed, multi-location based engineering firm established with a vision to provide comprehensive electrical solutions. With over two decades of experience, we have grown into one of South India\'s leading electrical engineering companies, offering services from design to post-commissioning.'

export default function About() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch(() => {})
  }, [])

  const aboutText = settings?.about_text || fallbackText

  return (
    <section id="about" className="py-16 md:py-24 bg-[#F8F9FA]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-[28px] md:text-[40px] font-semibold text-[#0D1B3E] mb-4">
            About Our Company
          </h2>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-[#2D3748] text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            {aboutText}
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
            >
              <Card className="card-hover h-full border-none shadow-md rounded-xl overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <feature.icon
                      className="w-7 h-7"
                      style={{ color: feature.color }}
                    />
                  </div>
                  <h3 className="text-xl md:text-2xl font-medium text-[#0D1B3E] mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-[#2196F3] text-sm font-medium mb-3">
                    {feature.subtitle}
                  </p>
                  <p className="text-[#718096] text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
