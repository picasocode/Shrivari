'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronRight, Star, Quote, Play, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@/components/Router'
import { fetchTestimonials, type Testimonial } from '@/lib/api'

/* ── FadeIn animation helper ── */
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── Star Rating component ── */
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' }
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeMap[size]} ${i < rating ? 'text-[#E8751A] fill-[#E8751A]' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  )
}

/* ── Avatar circle with initials ── */
function InitialsAvatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const sizeMap = {
    sm: 'w-9 h-9 text-sm',
    md: 'w-11 h-11 text-sm',
    lg: 'w-16 h-16 text-xl',
  }

  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-bold shrink-0`}
      style={{
        background: '#37474f',
        color: '#FFFFFF',
      }}
    >
      {initials}
    </div>
  )
}

/* ── Extract YouTube video ID from URL ── */
function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/)
  return match ? match[1] : null
}

/* ── Rating pill filter ── */
function RatingPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
        active
          ? 'bg-[#455a64] text-[#1A1A2E] border-[#334155] shadow-md'
          : 'bg-white text-[#37474f] border-[#D1D9E6] hover:border-[#334155] hover:bg-[#eceff1]'
      }`}
    >
      <Star className={`w-3.5 h-3.5 ${active ? 'text-[#E8751A] fill-[#E8751A]' : 'text-[#E8751A] fill-[#E8751A]'}`} />
      {label}
      <span className={`text-sm ${active ? 'text-white/70' : 'text-gray-400'}`}>({count})</span>
    </button>
  )
}

/* ──────────────────────────────────────────────── */
export default function TestimonialsPage() {
  const { navigate } = useRouter()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<number | null>(null) // null = all
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  useEffect(() => {
    fetchTestimonials()
      .then(data => {
        setTestimonials(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  /* ── Derived data ── */
  const videoTestimonials = useMemo(() => testimonials.filter(t => t.videoUrl), [testimonials])

  const filteredTestimonials = useMemo(
    () => (activeFilter === null ? testimonials : testimonials.filter(t => t.rating === activeFilter)),
    [testimonials, activeFilter]
  )

  const ratingCounts = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    testimonials.forEach(t => { if (counts[t.rating] !== undefined) counts[t.rating]++ })
    return counts
  }, [testimonials])

  const avgRating = useMemo(() => {
    if (testimonials.length === 0) return 0
    const sum = testimonials.reduce((acc, t) => acc + t.rating, 0)
    return Math.round((sum / testimonials.length) * 10) / 10
  }, [testimonials])

  /* Featured testimonial = highest rating, then first */
  const featured = useMemo(() => {
    if (testimonials.length === 0) return null
    return testimonials.reduce((best, t) => (t.rating >= best.rating ? t : best), testimonials[0])
  }, [testimonials])

  /* ── Render ── */
  return (
    <>
      {/* ════════════════════════════════════════════
          HERO — Warm navy-to-teal gradient with decorative quote
          ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-[100px] pb-20 md:pb-28">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{ background: '#37474f' }}
        />

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large decorative quotation mark */}
          <Quote
            className="absolute -top-8 -right-4 md:top-[-2rem] md:right-[5%] w-48 h-48 md:w-72 md:h-72 text-white/[0.06] fill-white/[0.06]"
            strokeWidth={1}
          />
          <Quote
            className="absolute bottom-4 left-4 md:bottom-8 md:left-[8%] w-32 h-32 md:w-48 md:h-48 text-white/[0.04] fill-white/[0.04] rotate-180"
            strokeWidth={1}
          />
          {/* Floating circles */}
          <div className="absolute top-20 left-[15%] w-64 h-64 rounded-full bg-[#E8751A]/5 blur-3xl" />
          <div className="absolute bottom-10 right-[20%] w-80 h-80 rounded-full bg-[#1A8A8A]/10 blur-3xl" />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Small accent line */}
            <div className="flex justify-center mb-5">
              <div className="w-10 h-1 rounded-full bg-[#E8751A]" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              Voices of Trust
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-6 leading-relaxed">
              Real stories from real clients — discover how we&apos;ve helped businesses transform and thrive.
            </p>

            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-sm">
              <button onClick={() => navigate('home')} className="text-white/50 hover:text-white transition-colors">
                Home
              </button>
              <ChevronRight className="w-4 h-4 text-white/30" />
              <span className="text-[#E8751A] font-medium">Testimonials</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURED TESTIMONIAL SPOTLIGHT
          ════════════════════════════════════════════ */}
      {featured && !loading && (
        <section className="relative -mt-14 md:-mt-16 z-10 pb-16 md:pb-20">
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
            <FadeIn>
              <div
                className="relative rounded-2xl p-8 md:p-12 overflow-hidden"
                style={{
                  background: '#37474f',
                  boxShadow: '0 20px 60px rgba(27,58,92,0.12), 0 4px 16px rgba(27,58,92,0.06)',
                }}
              >
                {/* Decorative quote marks */}
                <Quote className="absolute top-4 left-6 w-16 h-16 md:w-24 md:h-24 text-[#37474f]/[0.06] fill-[#efefef]/[0.06]" strokeWidth={1} />
                <Quote className="absolute bottom-4 right-6 w-12 h-12 md:w-18 md:h-18 text-[#37474f]/[0.04] fill-[#efefef]/[0.04] rotate-180" strokeWidth={1} />

                {/* Orange accent bar */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#E8751A] to-[#E8751A]/30 rounded-r-full" />

                <div className="relative flex flex-col md:flex-row items-start gap-6 md:gap-10">
                  {/* Avatar + info column */}
                  <div className="flex flex-col items-center text-center md:text-left md:items-start shrink-0">
                    <InitialsAvatar name={featured.name} size="lg" />
                    <div className="mt-3">
                      <h3 className="text-xl md:text-2xl font-bold text-[#37474f]">{featured.name}</h3>
                      <p className="text-[#546e7a] text-sm mt-0.5">{featured.designation}</p>
                      <Badge className="mt-2 bg-[#455a64]/10 text-[#37474f] hover:bg-[#455a64]/20 border-0 font-medium text-sm">
                        {featured.company}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <StarRating rating={featured.rating} size="lg" />
                    </div>
                  </div>

                  {/* Quote content */}
                  <div className="flex-1 pt-2">
                    <p className="text-lg md:text-xl lg:text-2xl text-[#1A1A2E]/85 leading-relaxed font-medium italic">
                      &ldquo;{featured.content}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          RATING SUMMARY BAR
          ════════════════════════════════════════════ */}
      {!loading && testimonials.length > 0 && (
        <section className="pb-10 md:pb-14">
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
            <FadeIn>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-6 px-8 rounded-2xl bg-[#F8FAFB] border border-[#E2E8F0]">
                {/* Average rating */}
                <div className="flex items-center gap-3">
                  <span className="text-4xl md:text-5xl font-bold text-[#37474f]">{avgRating}</span>
                  <div>
                    <StarRating rating={Math.round(avgRating)} size="md" />
                    <p className="text-sm text-[#546e7a] mt-0.5">{testimonials.length} review{testimonials.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-12 bg-[#D1D9E6]" />
                <div className="sm:hidden w-24 h-px bg-[#D1D9E6]" />

                {/* Rating breakdown bars */}
                <div className="flex flex-col gap-1.5 w-full sm:w-auto sm:min-w-[200px]">
                  {[5, 4, 3, 2, 1].map(r => {
                    const pct = testimonials.length > 0 ? (ratingCounts[r] / testimonials.length) * 100 : 0
                    return (
                      <div key={r} className="flex items-center gap-2 text-sm">
                        <span className="w-3 text-[#37474f] font-medium">{r}</span>
                        <Star className="w-3 h-3 text-[#E8751A] fill-[#E8751A]" />
                        <div className="flex-1 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-[#E8751A] to-[#F0A050]"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                          />
                        </div>
                        <span className="w-6 text-right text-[#546e7a] text-sm">{ratingCounts[r]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          FILTER BY RATING
          ════════════════════════════════════════════ */}
      {!loading && testimonials.length > 0 && (
        <section className="pb-8 md:pb-10">
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
            <FadeIn>
              <div className="flex flex-wrap items-center gap-3 justify-center">
                <span className="text-sm font-medium text-[#546e7a] mr-1">Filter:</span>
                <RatingPill
                  label="All"
                  count={testimonials.length}
                  active={activeFilter === null}
                  onClick={() => setActiveFilter(null)}
                />
                {[5, 4, 3, 2, 1].map(r => (
                  <RatingPill
                    key={r}
                    label={`${r}-Star`}
                    count={ratingCounts[r]}
                    active={activeFilter === r}
                    onClick={() => setActiveFilter(activeFilter === r ? null : r)}
                  />
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          TESTIMONIALS GRID
          ════════════════════════════════════════════ */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10 md:mb-14">
              <div className="flex items-center justify-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-[#E8751A]" />
                <span className="text-sm font-semibold text-[#E8751A] uppercase tracking-wider">Testimonials</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#37474f] mb-3">What Our Clients Say</h2>
              <div className="section-bar mx-auto" />
            </div>
          </FadeIn>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="w-12 h-12 text-[#D1D9E6] mx-auto mb-4" />
              <p className="text-[#546e7a] text-lg">
                {activeFilter !== null
                  ? `No ${activeFilter}-star testimonials found.`
                  : 'No testimonials yet.'}
              </p>
              {activeFilter !== null && (
                <Button
                  variant="outline"
                  className="mt-4 border-[#334155] text-[#37474f] hover:bg-[#455a64] hover:text-white"
                  onClick={() => setActiveFilter(null)}
                >
                  Show All
                </Button>
              )}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter ?? 'all'}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredTestimonials.map((t, i) => (
                  <FadeIn key={t.id} delay={i * 0.06}>
                    <Card className="group relative rounded-xl border border-[#E2E8F0] overflow-hidden h-full card-hover">
                      {/* Subtle gradient background on card */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: '#37474f 0%, rgba(26,92,107,0.05) 100%)',
                        }}
                      />

                      {/* Top accent line */}
                      <div
                        className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: '#37474f' }}
                      />

                      <CardContent className="relative p-6">
                        {/* Decorative small quote */}
                        <Quote className="absolute top-3 right-4 w-8 h-8 text-[#37474f]/[0.07] fill-[#efefef]/[0.07]" strokeWidth={1} />

                        {/* Star rating */}
                        <div className="mb-4">
                          <StarRating rating={t.rating} />
                        </div>

                        {/* Quote text */}
                        <p className="text-[#1A1A2E]/80 text-sm leading-relaxed mb-6 italic min-h-[4.5rem]">
                          &ldquo;{t.content}&rdquo;
                        </p>

                        {/* Person info */}
                        <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
                          <InitialsAvatar name={t.name} size="sm" />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#37474f] text-sm truncate">{t.name}</p>
                            <p className="text-[#546e7a] text-sm truncate">
                              {t.designation}{t.designation && t.company ? ', ' : ''}{t.company}
                            </p>
                          </div>
                          <Badge
                            className="ml-auto shrink-0 bg-[#E8751A]/10 text-[#E8751A] border-0 text-[10px] px-2 py-0.5"
                          >
                            {t.rating}★
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          VIDEO TESTIMONIALS
          ════════════════════════════════════════════ */}
      {videoTestimonials.length > 0 && (
        <section className="py-14 md:py-20 bg-[#F8FAFB]">
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
            <FadeIn>
              <div className="text-center mb-10 md:mb-14">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Play className="w-5 h-5 text-[#E8751A]" />
                  <span className="text-sm font-semibold text-[#E8751A] uppercase tracking-wider">Video Stories</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#37474f] mb-3">Hear It From Them</h2>
                <div className="section-bar mx-auto" />
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {videoTestimonials.map((t, i) => {
                const ytId = getYouTubeId(t.videoUrl)
                const isPlaying = playingVideo === t.id
                const thumbnailUrl = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : ''

                return (
                  <FadeIn key={t.id} delay={i * 0.1}>
                    <div className="rounded-xl overflow-hidden shadow-lg border border-[#E2E8F0] bg-white">
                      {/* Video embed area */}
                      <div className="relative aspect-video bg-[#455a64]">
                        {isPlaying && ytId ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                            title={`${t.name} testimonial`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <>
                            {/* Thumbnail */}
                            {thumbnailUrl && (
                              <img
                                src={thumbnailUrl}
                                alt={`${t.name} video testimonial`}
                                className="w-full h-full object-cover"
                              />
                            )}
                            {/* Play overlay */}
                            <button
                              onClick={() => setPlayingVideo(t.id)}
                              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group/play"
                            >
                              <div className="w-16 h-16 rounded-full bg-[#E8751A] flex items-center justify-center shadow-lg group-hover/play:scale-110 transition-transform">
                                <Play className="w-7 h-7 text-white fill-white ml-1" />
                              </div>
                            </button>
                          </>
                        )}
                      </div>

                      {/* Person info */}
                      <div className="p-5 flex items-center gap-3">
                        <InitialsAvatar name={t.name} size="sm" />
                        <div>
                          <p className="font-semibold text-[#37474f] text-sm">{t.name}</p>
                          <p className="text-[#546e7a] text-sm">
                            {t.designation}{t.designation && t.company ? ', ' : ''}{t.company}
                          </p>
                        </div>
                        <div className="ml-auto">
                          <StarRating rating={t.rating} size="sm" />
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          CTA SECTION
          ════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{ background: '#37474f' }}
        />

        {/* Decorative circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#E8751A]/5 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/[0.03] blur-2xl" />
          <Quote className="absolute bottom-4 right-8 w-32 h-32 text-white/[0.04] fill-white/[0.04] rotate-180" strokeWidth={1} />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 text-center">
          <FadeIn>
            <MessageSquare className="w-10 h-10 text-[#E8751A] mx-auto mb-5" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Ready to Join Our Story?
            </h2>
            <p className="text-lg text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
              Every great partnership begins with a conversation. Let&apos;s write your success story together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-[#E8751A] hover:bg-[#D06815] text-white px-8 py-3 text-base font-semibold rounded-lg shadow-lg shadow-[#E8751A]/25"
                onClick={() => navigate('contact')}
              >
                Get In Touch
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white px-8 py-3 text-base font-semibold rounded-lg bg-transparent"
                onClick={() => navigate('services')}
              >
                Explore Our Services
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
