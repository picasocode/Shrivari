'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Zap,
  Factory,
  Wrench,
  Shield,
  HardHat,
  Lightbulb,
  Settings,
  Cable,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { fetchServices, type Service } from '@/lib/api'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Factory,
  Wrench,
  Shield,
  HardHat,
  Lightbulb,
  Settings,
  Cable,
}

function getServiceIcon(name: string) {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('epc') || lowerName.includes('turnkey')) return Zap
  if (lowerName.includes('manufactur') || lowerName.includes('panel')) return Factory
  if (lowerName.includes('ceig') || lowerName.includes('cea') || lowerName.includes('approval')) return Shield
  if (lowerName.includes('transmission') || lowerName.includes('distribution')) return Cable
  if (lowerName.includes('maintenanc') || lowerName.includes('service')) return Wrench
  if (lowerName.includes('consult') || lowerName.includes('design')) return Lightbulb
  if (lowerName.includes('testing') || lowerName.includes('commission')) return Settings
  if (lowerName.includes('solar') || lowerName.includes('renewable')) return HardHat
  return Wrench
}

function ServiceCardSkeleton() {
  return (
    <Card className="border-none shadow-md rounded-xl">
      <CardContent className="p-6">
        <Skeleton className="w-12 h-12 rounded-xl mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-1" />
        <Skeleton className="h-4 w-4/6" />
      </CardContent>
    </Card>
  )
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const loadServices = () => {
    setLoading(true)
    setError(null)
    fetchServices(true)
      .then((data) => {
        setServices(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load services')
        setLoading(false)
      })
  }

  useEffect(() => {
    let cancelled = false
    fetchServices(true)
      .then((data) => {
        if (!cancelled) {
          setServices(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load services')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  return (
    <section id="services" className="py-16 md:py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-[28px] md:text-[40px] font-semibold text-[#0D1B3E] mb-4">
            Our Services
          </h2>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-[#718096] text-base md:text-lg max-w-2xl mx-auto">
            Comprehensive electrical engineering solutions from design to post-commissioning
          </p>
        </motion.div>

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-[#718096] mx-auto mb-4" />
            <p className="text-[#718096] mb-4">{error}</p>
            <Button variant="outline" onClick={loadServices}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Service cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const IconComponent = iconMap[service.icon] || getServiceIcon(service.name)
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                >
                  <Card className="card-hover h-full border-none shadow-md rounded-xl group">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-[#2196F3]/10 flex items-center justify-center mb-4 group-hover:bg-[#2196F3] transition-colors duration-300">
                        <IconComponent className="w-6 h-6 text-[#2196F3] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="text-lg md:text-xl font-medium text-[#0D1B3E] mb-2">
                        {service.name}
                      </h3>
                      <p className="text-[#718096] text-sm leading-relaxed">
                        {service.description}
                      </p>
                      {service.features && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {JSON.parse(service.features || '[]').slice(0, 3).map((feat: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-sm bg-[#E8ECF0] text-[#2D3748] px-2 py-1 rounded-md"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
