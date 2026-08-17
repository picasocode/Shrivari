'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight, Star, MapPin, Award, TrendingUp, Zap, Users,
  MapPinned, Factory, Settings, ShieldCheck, Layers, Network,
  HardHat, Cpu, Target,
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

      {/* ─── Key Statistics ─── */}
      <section className="py-14 md:py-20 bg-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #1B3A5C 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8751A]/10 border border-[#E8751A]/25 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8751A]" />
                <span className="text-xs font-bold tracking-[0.2em] text-[#E8751A] uppercase">Key Statistics</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">
                Our Performance in <span className="text-[#E8751A]">Numbers</span>
              </h2>
              <p className="text-[#6B7280] text-sm md:text-base max-w-2xl mx-auto">
                Delivering excellence at scale with proven expertise across India&apos;s electrical infrastructure landscape.
              </p>
            </div>
          </FadeIn>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Award, value: '2000+', label: 'Projects Executed', desc: 'Successfully delivered across India' },
              { icon: TrendingUp, value: '28+', label: 'Years of Industry Experience', desc: 'Since 1998, trusted engineering partner' },
              { icon: Zap, value: '400 kV', label: 'Voltage Expertise', desc: 'EHV, HV, MV & LV systems' },
              { icon: Users, value: '>90%', label: 'Industrial Customers Served', desc: 'Of total projects executed' },
              { icon: MapPinned, value: 'Pan-India', label: 'Execution Capability', desc: 'AP, Telangana, Goa, Karnataka, UP, Maharashtra, Assam, Pondicherry, West Bengal, Gujarat, Odisha' },
              { icon: Factory, value: 'In-house', label: 'Engineering & Manufacturing', desc: 'No outsourcing — full control' },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <FadeIn key={i} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="group relative h-full p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#E8751A]/40 shadow-sm hover:shadow-xl hover:shadow-[#E8751A]/5 transition-all duration-500 overflow-hidden"
                  >
                    {/* Coral accent bar on hover */}
                    <div className="absolute top-0 left-0 h-1 w-0 bg-[#E8751A] group-hover:w-full transition-all duration-500" />
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#E8751A]/10 flex items-center justify-center shrink-0 group-hover:bg-[#E8751A] transition-colors duration-300">
                        <Icon className="w-6 h-6 text-[#E8751A] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-2xl md:text-3xl font-bold text-[#1A1A2E] tracking-tight leading-tight">
                          {stat.value}
                        </div>
                        <p className="text-sm font-bold text-[#1A1A2E] mt-0.5 mb-1">{stat.label}</p>
                        <p className="text-xs text-[#6B7280] leading-relaxed">{stat.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── About Preview ─── */}
      <section className="py-14 md:py-20 bg-[#F0F4F8]">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">About Our Company</h2>
              <div className="section-bar mb-6" />
              <p className="text-[#374151] leading-relaxed mb-6">{aboutText}</p>
              <Button
                onClick={() => navigate('about')}
                variant="outline"
                className="border-[#1F2937] text-[#1F2937] hover:bg-[#1F2937] hover:text-white rounded-md px-6 h-10 font-semibold transition-colors"
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

          {/* Real photos strip — best of SVEPL */}
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 md:mt-12">
              {[
                { src: '/images/home/about-1.jpg', caption: 'Panel assembly' },
                { src: '/images/home/about-2.jpg', caption: 'Engineering office' },
                { src: '/images/home/about-3.jpg', caption: 'Team collaboration' },
              ].map((item, i) => (
                <FadeIn key={item.caption} delay={0.25 + i * 0.08}>
                  <div className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={item.src}
                      alt={`${item.caption} — SVEPL`}
                      className="w-full h-48 md:h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1D3A]/80 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[#1A1A2E] text-xs font-bold tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8751A]" />
                      {item.caption}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="py-14 md:py-20 bg-[#0D1D3A] relative overflow-hidden">
        {/* Ambient coral glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 70%)' }} />
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8751A]/15 border border-[#E8751A]/30 mb-4">
                <Target className="w-3.5 h-3.5 text-[#E8751A]" />
                <span className="text-xs font-bold tracking-[0.2em] text-[#E8751A] uppercase">Why Choose Us</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Engineering <span className="text-[#E8751A]">Excellence</span>
              </h2>
              <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                <span className="text-[#E8751A] font-semibold">VALUE ENGINEERING</span> is in the DNA of the Management and that results a <span className="text-white font-semibold">WIN-WIN</span> for customers and us.
              </p>
            </div>
          </FadeIn>

          {/* Why Choose Us grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Cpu, title: 'Engineering Excellence', desc: 'Comprehensive engineering expertise across EHV, HV, MV, and LV electrical systems with a focus on reliability, safety, and operational efficiency.' },
              { icon: Network, title: 'End-to-End EPC Capability', desc: 'Single-point responsibility from concept design to commissioning and utility approvals. We offer pre-ordering stage consultancy also.' },
              { icon: Layers, title: 'Industry-Focused Solutions', desc: 'Customized electrical infrastructure solutions tailored to industry-specific operational requirements across various industries, states, countries, and electricity boards.' },
              { icon: HardHat, title: 'Experienced Project Execution', desc: 'Dedicated hardcore project management and site execution teams ensuring timely project delivery across diverse environments.' },
              { icon: ShieldCheck, title: 'Safety & Quality Compliance', desc: 'Strict adherence to electrical safety standards, quality assurance procedures, and statutory regulations including CEA/CEIG requirements.' },
              { icon: Settings, title: 'Integrated Manufacturing', desc: 'In-house panel manufacturing and system integration capabilities for optimized project control and quality assurance.' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <FadeIn key={i} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="group relative h-full p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#E8751A]/40 transition-all duration-500 overflow-hidden"
                  >
                    {/* Coral accent line on hover */}
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#E8751A] group-hover:w-full transition-all duration-500" />
                    <div className="w-12 h-12 rounded-xl bg-[#E8751A]/15 flex items-center justify-center mb-4 group-hover:bg-[#E8751A] transition-colors duration-300">
                      <Icon className="w-6 h-6 text-[#E8751A] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                </FadeIn>
              )
            })}
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
                className="hidden md:inline-flex border-[#E5E7EB] text-[#1F2937] hover:bg-[#1F2937] hover:text-white hover:border-[#1F2937] rounded-md"
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
            <p className="text-[#6B7280]">No ongoing projects at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((p, i) => (
                <FadeIn key={p.id} delay={i * 0.08}>
                  <Card className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm card-hover h-full">
                    <CardContent className="p-6">
                      <Badge className="bg-[#F0F4F8] text-[#1F2937] hover:bg-[#E5E7EB] mb-3 rounded text-xs font-semibold">{p.category || 'Ongoing'}</Badge>
                      <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">{p.name}</h3>
                      <p className="text-[#6B7280] text-sm mb-3 leading-relaxed line-clamp-3">{p.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B7280]">
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
              className="border-[#E5E7EB] text-[#1F2937] rounded-md"
            >
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Testimonials Preview ─── */}
      <section className="py-14 md:py-20 bg-[#F0F4F8]">
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
                className="hidden md:inline-flex border-[#E5E7EB] text-[#1F2937] hover:bg-[#1F2937] hover:text-white hover:border-[#1F2937] rounded-md"
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
                  <Card className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm h-full">
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
                      <div className="border-t border-[#E5E7EB] pt-4">
                        <p className="font-semibold text-[#1A1A2E] text-sm">{t.name}</p>
                        <p className="text-[#6B7280] text-xs">{t.designation}{t.designation && t.company ? ', ' : ''}{t.company}</p>
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
              className="border-[#E5E7EB] text-[#1F2937] rounded-md"
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
                className="hidden md:inline-flex border-[#E5E7EB] text-[#1F2937] hover:bg-[#1F2937] hover:text-white hover:border-[#1F2937] rounded-md"
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
                  <Card className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm card-hover h-full">
                    {b.coverImageUrl ? (
                      <div className="h-40 bg-cover bg-center rounded-t-lg" style={{ backgroundImage: `url(${b.coverImageUrl})` }} />
                    ) : (
                      <div className="h-40 bg-[#F0F4F8] flex items-center justify-center rounded-t-lg">
                        <span className="text-4xl font-bold text-[#1F2937]/10">{b.title.charAt(0)}</span>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <p className="text-xs text-[#6B7280] mb-2">
                        {new Date(b.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}{b.author ? ` · ${b.author}` : ''}
                      </p>
                      <h3 className="text-lg font-bold text-[#1A1A2E] mb-2 line-clamp-2">{b.title}</h3>
                      <p className="text-[#6B7280] text-sm leading-relaxed line-clamp-3">{b.excerpt}</p>
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
              className="border-[#E5E7EB] text-[#1F2937] rounded-md"
            >
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>


    </>
  )
}
