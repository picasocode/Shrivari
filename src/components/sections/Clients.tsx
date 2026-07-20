'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { fetchClients, type Client } from '@/lib/api'

function ClientCardSkeleton() {
  return (
    <Card className="border-none shadow-md rounded-xl">
      <CardContent className="p-5">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  )
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const loadClients = () => {
    setLoading(true)
    setError(null)
    fetchClients(true)
      .then((data) => {
        setClients(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load clients')
        setLoading(false)
      })
  }

  useEffect(() => {
    let cancelled = false
    fetchClients(true)
      .then((data) => {
        if (!cancelled) {
          setClients(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load clients')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  return (
    <section id="clients" className="py-16 md:py-24 bg-[#F8F9FA]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-[28px] md:text-[40px] font-semibold text-[#0D1B3E] mb-4">
            Our Clients
          </h2>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-[#718096] text-base md:text-lg max-w-2xl mx-auto">
            Trusted by leading organizations across India and beyond
          </p>
        </motion.div>

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-[#718096] mx-auto mb-4" />
            <p className="text-[#718096] mb-4">{error}</p>
            <Button variant="outline" onClick={loadClients}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ClientCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Marquee row */}
        {!loading && !error && clients.length > 0 && (
          <>
            {/* Scrolling marquee */}
            <div className="overflow-hidden mb-10 relative">
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#F8F9FA] to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F8F9FA] to-transparent z-10" />
              <motion.div
                className="flex gap-4"
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 30,
                    ease: 'linear',
                  },
                }}
              >
                {[...clients, ...clients].map((client, i) => (
                  <div
                    key={`${client.id}-${i}`}
                    className="shrink-0 w-48 md:w-56 bg-white rounded-xl p-4 border border-[#E8ECF0] hover:border-[#2196F3]/30 transition-colors flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-[#2196F3]/10 flex items-center justify-center mx-auto mb-2">
                        <span className="text-[#2196F3] font-semibold text-lg">
                          {client.name.charAt(0)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[#0D1B3E] truncate">
                        {client.name}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {clients.map((client, i) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.05 + i * 0.05 }}
                >
                  <Card className="card-hover h-full border-none shadow-md rounded-xl">
                    <CardContent className="p-5">
                      <div className="w-11 h-11 rounded-full bg-[#0D1B3E]/10 flex items-center justify-center mb-3">
                        <span className="text-[#0D1B3E] font-semibold">
                          {client.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-sm md:text-base font-medium text-[#0D1B3E] mb-1.5 leading-tight">
                        {client.name}
                      </h3>
                      {client.industry && (
                        <Badge
                          variant="secondary"
                          className="text-sm bg-[#2196F3]/10 text-[#2196F3] border-0 mb-1.5"
                        >
                          {client.industry}
                        </Badge>
                      )}
                      {client.location && (
                        <div className="flex items-center gap-1 text-sm text-[#718096]">
                          <MapPin className="w-3 h-3" />
                          <span>{client.location}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
