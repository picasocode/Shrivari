'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote, AlertCircle, RefreshCw, Play } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { fetchTestimonials, type Testimonial } from '@/lib/api'

function TestimonialSkeleton() {
  return (
    <Card className="border-none shadow-md rounded-xl">
      <CardContent className="p-6">
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-1" />
        <Skeleton className="h-4 w-4/6 mb-4" />
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-4 h-4 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-4 w-1/3 mb-1" />
        <Skeleton className="h-3 w-1/4" />
      </CardContent>
    </Card>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-[#E8ECF0] text-[#E8ECF0]'
          }`}
        />
      ))}
    </div>
  )
}

function getYouTubeEmbedUrl(url: string) {
  if (!url) return null
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/
  )
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const loadTestimonials = () => {
    setLoading(true)
    setError(null)
    fetchTestimonials(true)
      .then((data) => {
        setTestimonials(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load testimonials')
        setLoading(false)
      })
  }

  useEffect(() => {
    let cancelled = false
    fetchTestimonials(true)
      .then((data) => {
        if (!cancelled) {
          setTestimonials(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load testimonials')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  // Find testimonials with video
  const videoTestimonial = testimonials.find((t) => t.videoUrl)

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-[28px] md:text-[40px] font-semibold text-[#0D1B3E] mb-4">
            What Our Clients Say
          </h2>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-[#718096] text-base md:text-lg max-w-2xl mx-auto">
            Hear from the people who trust us with their electrical infrastructure
          </p>
        </motion.div>

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-[#718096] mx-auto mb-4" />
            <p className="text-[#718096] mb-4">{error}</p>
            <Button variant="outline" onClick={loadTestimonials}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <TestimonialSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Testimonials carousel */}
        {!loading && !error && testimonials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Carousel
              opts={{ align: 'start', loop: true }}
              className="w-full"
            >
              <CarouselContent className="-ml-6">
                {testimonials.map((testimonial) => (
                  <CarouselItem
                    key={testimonial.id}
                    className="pl-6 md:basis-1/2 lg:basis-1/3"
                  >
                    <Card className="border-none shadow-md rounded-xl h-full">
                      <CardContent className="p-6 flex flex-col h-full">
                        <Quote className="w-8 h-8 text-[#2196F3]/20 mb-3" />
                        <p className="text-[#2D3748] text-sm leading-relaxed flex-1 mb-4">
                          &ldquo;{testimonial.content}&rdquo;
                        </p>
                        <StarRating rating={testimonial.rating} />
                        <div className="mt-3 pt-3 border-t border-[#E8ECF0]">
                          <p className="text-[#0D1B3E] font-medium text-sm">
                            {testimonial.name}
                          </p>
                          <p className="text-[#718096] text-xs">
                            {testimonial.designation}
                            {testimonial.company && `, ${testimonial.company}`}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12" />
              <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>

            {/* YouTube video section */}
            {videoTestimonial && getYouTubeEmbedUrl(videoTestimonial.videoUrl) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12 max-w-3xl mx-auto"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 text-[#0D1B3E] font-medium">
                    <Play className="w-5 h-5 text-[#2196F3]" />
                    Video Testimonial
                  </div>
                </div>
                <div className="relative pb-[56.25%] rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src={getYouTubeEmbedUrl(videoTestimonial.videoUrl)!}
                    title={`Testimonial by ${videoTestimonial.name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
