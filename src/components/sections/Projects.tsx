'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Building2, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { fetchProjects, type Project } from '@/lib/api'

function ProjectCardSkeleton() {
  return (
    <Card className="border-none shadow-md rounded-xl">
      <CardContent className="p-6">
        <Skeleton className="h-5 w-3/4 mb-3" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3 mb-4" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
    </Card>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const loadProjects = () => {
    setLoading(true)
    setError(null)
    fetchProjects()
      .then((data) => {
        setProjects(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load projects')
        setLoading(false)
      })
  }

  useEffect(() => {
    let cancelled = false
    fetchProjects()
      .then((data) => {
        if (!cancelled) {
          setProjects(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load projects')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  return (
    <section id="projects" className="py-16 md:py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-[28px] md:text-[40px] font-semibold text-[#0D1B3E] mb-4">
            Our Projects
          </h2>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-[#718096] text-base md:text-lg max-w-2xl mx-auto">
            Showcasing our expertise through successful project delivery across India
          </p>
        </motion.div>

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-[#718096] mx-auto mb-4" />
            <p className="text-[#718096] mb-4">{error}</p>
            <Button variant="outline" onClick={loadProjects}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Project cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              >
                <Card className="card-hover h-full border-none shadow-md rounded-xl overflow-hidden">
                  {/* Status stripe */}
                  <div
                    className={`h-1.5 ${
                      project.category === 'ongoing'
                        ? 'bg-[#2196F3]'
                        : 'bg-[#2A5A8A]'
                    }`}
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg md:text-xl font-medium text-[#0D1B3E] leading-tight pr-2">
                        {project.name}
                      </h3>
                      <Badge
                        variant={project.category === 'ongoing' ? 'default' : 'secondary'}
                        className={`shrink-0 text-xs ${
                          project.category === 'ongoing'
                            ? 'bg-[#2196F3]/10 text-[#2196F3] border-[#2196F3]/20'
                            : 'bg-[#1B3A5C]/5 text-[#1B3A5C] border-[#5A7EA8]'
                        }`}
                      >
                        {project.category === 'ongoing' ? 'Ongoing' : 'Completed'}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      {project.client && (
                        <div className="flex items-center gap-2 text-sm text-[#2D3748]">
                          <Building2 className="w-4 h-4 text-[#718096] shrink-0" />
                          <span className="truncate">{project.client}</span>
                        </div>
                      )}
                      {project.location && (
                        <div className="flex items-center gap-2 text-sm text-[#718096]">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span>{project.location}</span>
                        </div>
                      )}
                    </div>

                    {project.description && (
                      <p className="text-[#718096] text-sm leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
