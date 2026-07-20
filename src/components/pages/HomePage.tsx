'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight, Star, Users, Building2,
  MapPin, TrendingUp, Globe, Route, UserCheck, HardHat,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Hero from '@/components/sections/Hero'
import { useRouter } from '@/components/Router'
import {
  fetchSettings, fetchProjects, fetchTestimonials, fetchBlogs,
  type SiteSettings, type Project, type Testimonial, type Blog,
} from '@/lib/api'

/* ─── animated counter ─── */
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
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isInView, value, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ─── stat definitions ─── */
const stats = [
  { icon: Users, value: 3000, suffix: '+', label: 'Customers' },
  { icon: UserCheck, value: 400, suffix: '+', label: 'Employees' },
  { icon: MapPin, value: 7, suffix: '', label: 'Branches' },
  { icon: TrendingUp, value: 125, suffix: ' Cr', label: 'Turnover' },
  { icon: Globe, value: 20, suffix: '+', label: 'MNCs' },
  { icon: Route, value: 100, suffix: 'Km+', label: 'Lines' },
  { icon: Building2, value: 20, suffix: '+', label: 'Consultants' },
  { icon: HardHat, value: 30, suffix: '+', label: 'EHV Projects' },
]



/* ─── fade-in wrapper ─── */
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

export default function HomePage() {
  const { navigate } = useRouter()
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchSettings().catch(() => null),
      fetchProjects('ongoing').catch(() => []),
      fetchTestimonials(true).catch(() => []),
      fetchBlogs(true).catch(() => []),
    ]).then(([s, p, t, b]) => {
      setSettings(s)
      setProjects(p as Project[])
      setTestimonials((t as Testimonial[]).slice(0, 3))
      setBlogs((b as Blog[]).slice(0, 3))
      setLoading(false)
    })
  }, [])

  const aboutText = settings?.about_text || 'Shri Vaari Electricals Pvt Ltd is a professionally managed engineering firm offering EPC solutions, panel manufacturing, and comprehensive electrical services. With over two decades of experience, we have established ourselves as a trusted partner for industries across India, delivering excellence from design to commissioning.'

  return (
    <>
      {/* ─── Hero ─── */}
      <Hero />

      {/* ─── About Preview ─── */}
      <section className="py-14 md:py-20 bg-[#eceff1]">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">About Our Company</h2>
              <div className="section-bar mb-6" />
              <p className="text-[#374151] leading-relaxed mb-6">{aboutText}</p>
              <Button
                onClick={() => navigate('about')}
                variant="outline"
                className="border-[#334155] text-[#37474f] hover:bg-[#455a64] hover:text-white rounded-md px-6 h-10 font-semibold transition-colors"
              >
                Read More <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </FadeIn>
            <FadeIn delay={0.15}>
              <img
                src="/images/about-team.jpg"
                alt="Our Team"
                className="rounded-lg shadow w-full object-cover"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Stats Counter ─── */}
      <section className="py-14 md:py-20 bg-[#455a64]">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Our Achievements</h2>
            <div className="section-bar mx-auto mb-4" />
            <p className="text-white/60 mb-12 max-w-2xl mx-auto text-sm">
              Numbers that reflect our commitment to excellence and decades of trusted service.
            </p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.06}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 mb-3">
                    <s.icon className="w-5 h-5 text-[#E8751A]" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </div>
                  <p className="text-white/60 text-sm">{s.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Ongoing Projects ─── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">Ongoing Projects</h2>
                <div className="section-bar" />
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('services')}
                className="hidden md:inline-flex border-[#cfd8dc] text-[#37474f] hover:bg-[#455a64] hover:text-white hover:border-[#334155] rounded-md"
              >
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </FadeIn>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => <Skeleton key={i} className="h-48 rounded-lg" />)}
            </div>
          ) : projects.length === 0 ? (
            <p className="text-[#546e7a]">No ongoing projects at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((p, i) => (
                <FadeIn key={p.id} delay={i * 0.08}>
                  <Card className="bg-white rounded-lg border border-[#cfd8dc] shadow-sm card-hover h-full">
                    <CardContent className="p-6">
                      <Badge className="bg-[#eceff1] text-[#37474f] hover:bg-[#E5E7EB] mb-3 rounded text-sm font-semibold">{p.category || 'Ongoing'}</Badge>
                      <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">{p.name}</h3>
                      <p className="text-[#546e7a] text-sm mb-3 leading-relaxed line-clamp-3">{p.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#546e7a]">
                        {p.client && <span>Client: {p.client}</span>}
                        {p.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#E8751A]" />
                            {p.location}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          )}
          <div className="md:hidden mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => navigate('services')}
              className="border-[#cfd8dc] text-[#37474f] rounded-md"
            >
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Testimonials Preview ─── */}
      <section className="py-14 md:py-20 bg-[#eceff1]">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">Client Testimonials</h2>
                <div className="section-bar" />
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('testimonials')}
                className="hidden md:inline-flex border-[#cfd8dc] text-[#37474f] hover:bg-[#455a64] hover:text-white hover:border-[#334155] rounded-md"
              >
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </FadeIn>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => <Skeleton key={i} className="h-48 rounded-lg" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <FadeIn key={t.id} delay={i * 0.08}>
                  <Card className="bg-white rounded-lg border border-[#cfd8dc] shadow-sm h-full">
                    <CardContent className="p-6">
                      <div className="flex gap-0.5 mb-4">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star
                            key={si}
                            className={`w-4 h-4 ${si < t.rating ? 'text-[#E8751A] fill-[#E8751A]' : 'text-[#E5E7EB]'}`}
                          />
                        ))}
                      </div>
                      <p className="text-[#1A1A2E] text-sm leading-relaxed mb-5 italic">
                        &ldquo;{t.content}&rdquo;
                      </p>
                      <div className="border-t border-[#cfd8dc] pt-4">
                        <p className="font-semibold text-[#1A1A2E] text-sm">{t.name}</p>
                        <p className="text-[#546e7a] text-sm">{t.designation}{t.designation && t.company ? ', ' : ''}{t.company}</p>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          )}
          <div className="md:hidden mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => navigate('testimonials')}
              className="border-[#cfd8dc] text-[#37474f] rounded-md"
            >
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Blog Preview ─── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">Blog &amp; Insights</h2>
                <div className="section-bar" />
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('blog')}
                className="hidden md:inline-flex border-[#cfd8dc] text-[#37474f] hover:bg-[#455a64] hover:text-white hover:border-[#334155] rounded-md"
              >
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </FadeIn>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => <Skeleton key={i} className="h-56 rounded-lg" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((b, i) => (
                <FadeIn key={b.id} delay={i * 0.08}>
                  <Card className="bg-white rounded-lg border border-[#cfd8dc] shadow-sm card-hover h-full">
                    {b.coverImageUrl ? (
                      <div className="h-40 bg-cover bg-center rounded-t-lg" style={{ backgroundImage: `url(${b.coverImageUrl})` }} />
                    ) : (
                      <div className="h-40 bg-[#eceff1] flex items-center justify-center rounded-t-lg">
                        <span className="text-4xl font-bold text-[#37474f]/10">{b.title.charAt(0)}</span>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <p className="text-sm text-[#546e7a] mb-2">
                        {new Date(b.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}{b.author ? ` · ${b.author}` : ''}
                      </p>
                      <h3 className="text-lg font-bold text-[#1A1A2E] mb-2 line-clamp-2">{b.title}</h3>
                      <p className="text-[#546e7a] text-sm leading-relaxed line-clamp-3">{b.excerpt}</p>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          )}
          <div className="md:hidden mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => navigate('blog')}
              className="border-[#cfd8dc] text-[#37474f] rounded-md"
            >
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>


    </>
  )
}
