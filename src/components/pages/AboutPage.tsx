'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  ChevronDown, Building2, ArrowRight,
  Sun, CheckCircle2, TrendingUp,
  Factory,
  Target, Eye, Shield, Users, Clock,
  Zap, Boxes, FileCheck, RefreshCw,
  ClipboardCheck, Network,
  BadgeCheck,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/components/Router'
import { fetchSettings, type SiteSettings } from '@/lib/api'
import Journey from '@/components/sections/Journey'

/* ─── Fade-in helper ─── */
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

/* ─── Animated bar counter ─── */
function BarCounter({ value, suffix, label, maxVal, delay = 0, icon: Icon }: { value: number; suffix: string; label: string; maxVal: number; delay?: number; icon: React.ElementType }) {
  const [count, setCount] = useState(0)
  const [width, setWidth] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * value))
      setWidth(eased * (value / maxVal) * 100)
      if (progress < 1) requestAnimationFrame(step)
    }
    setTimeout(() => requestAnimationFrame(step), delay)
  }, [isInView, value, maxVal, delay])

  return (
    <div ref={ref} className="group">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-[#E8751A]/15 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-[#E8751A]" />
        </div>
        <div className="flex-1 flex items-baseline justify-between">
          <span className="text-[#6B7280] text-sm font-medium">{label}</span>
          <span className="text-2xl md:text-3xl font-bold text-[#1A1A2E] tabular-nums">
            {count}{suffix}
          </span>
        </div>
      </div>
      <div className="h-2.5 bg-[#1F2937]/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: 'linear-gradient(90deg, #E8751A 0%, #F59E0B 100%)',
          }}
        />
      </div>
    </div>
  )
}

/* ─── Data ─── */
const statsData = [
  { value: 29, suffix: '+', label: 'Years of Expertise', maxVal: 32, icon: Clock },
  { value: 364, suffix: '+', label: 'Team Members', maxVal: 400, icon: Users },
  { value: 200, suffix: '+ Cr', label: 'Annual Revenue', maxVal: 220, icon: TrendingUp },
  { value: 450, suffix: '+ MW', label: 'Solar Capacity', maxVal: 500, icon: Sun },
  { value: 10000, suffix: '+', label: 'LT Panels Installed', maxVal: 11000, icon: Factory },
  { value: 1200, suffix: '+', label: 'Projects Completed', maxVal: 1300, icon: Building2 },
]

const EXPERTISE: { label: string; icon: LucideIcon }[] = [
  { label: 'EHV / HV / MV / LV Electrical Systems', icon: Zap },
  { label: 'AIS & GIS Substations', icon: Network },
  { label: 'Industrial Electrification', icon: Factory },
  { label: 'HT & LT Panel Manufacturing', icon: Boxes },
  { label: 'Solar EPC', icon: Sun },
  { label: 'Utility Liaison & CEIG Approvals', icon: FileCheck },
  { label: 'Testing & Commissioning', icon: ClipboardCheck },
  { label: 'Electrical Retrofitting & Upgradation', icon: RefreshCw },
]

const MISSION_POINTS = [
  'Deliver reliable and efficient electrical engineering solutions',
  'Maintain the highest standards of quality and safety',
  'Build long-term client relationships through execution excellence',
  'Continuously adopt modern technologies and engineering practices',
  'Create sustainable value for customers and stakeholders',
]

const CORE_VALUES: { name: string; desc: string; image: string }[] = [
  { name: 'Integrity', desc: 'Transparent and ethical business practices in every engagement.', image: '/images/values/integrity.png' },
  { name: 'Engineering Excellence', desc: 'Commitment to technical precision and quality execution.', image: '/images/values/excellence.png' },
  { name: 'Safety', desc: 'Prioritizing personnel, equipment, and operational safety.', image: '/images/values/safety.png' },
  { name: 'Innovation', desc: 'Adopting advanced technologies and engineering methodologies.', image: '/images/values/innovation.png' },
  { name: 'Customer Commitment', desc: 'Delivering solutions aligned with client objectives and timelines.', image: '/images/values/commitment.png' },
]

const INFRASTRUCTURE: { title: string; desc: string; image: string }[] = [
  { title: 'Engineering Team', desc: 'Experienced electrical engineers, project managers, testing engineers, and commissioning specialists.', image: '/images/infra/team.png' },
  { title: 'Manufacturing Facility', desc: 'Modern panel manufacturing infrastructure with quality-focused production processes.', image: '/images/infra/manufacturing.png' },
  { title: 'Project Execution', desc: 'Capability to execute projects across industrial plants, substations, infrastructure facilities, and commercial developments.', image: '/images/infra/execution.png' },
  { title: 'Testing & Commissioning', desc: 'Advanced testing procedures and commissioning practices for reliable system operation.', image: '/images/infra/testing.png' },
]

const VISION_TEXT = 'To become a trusted leader in integrated electrical infrastructure solutions through engineering excellence, innovation, safety, and customer satisfaction.'

/* ─── Main Component ─── */
export default function AboutPage() {
  const { navigate } = useRouter()
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  /* Parallax hero scroll */
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    fetchSettings()
      .catch(() => null)
      .then((s) => {
        setSettings(s as SiteSettings | null)
        setLoading(false)
      })
  }, [])

  const aboutText = settings?.about_text || 'Shri Vaari Electricals Pvt. Ltd. is a professionally managed electrical engineering and EPC company specializing in the design, engineering, supply, installation, testing, commissioning, and maintenance of electrical infrastructure projects from 415 volts up to 400 kV.'

  const vision = settings?.vision || VISION_TEXT

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          HERO — Plain light theme (no gradient)
          ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[90vh] min-h-[560px] overflow-hidden flex items-center justify-center bg-[#EFEFEF]">
        {/* Plain background with subtle parallax */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 bg-[#EFEFEF]"
        />

        {/* Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-5 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          >
            <Badge className="bg-[#E8751A]/15 text-[#E8751A] border border-[#E8751A]/25 rounded-full px-5 py-1.5 text-sm font-medium mb-6">
              Est. 1998 — Chennai, India
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-black mb-5 tracking-tight"
          >
            Concept to{' '}
            <span className="text-[#E8751A]">
              Commissioning
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
            className="text-lg sm:text-xl md:text-2xl text-black font-light mb-3 tracking-wide"
          >
            Shri Vaari Electricals Pvt Ltd — 29+ Years of Engineering Excellence
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: 'easeOut' }}
            className="text-sm md:text-base text-black max-w-2xl mx-auto leading-relaxed"
          >
            From a small firm in Chennai to one of South India&apos;s most trusted electrical engineering companies —
            with operations across 8 cities, projects in 6 countries, and a turnover exceeding ₹200 Crores.
          </motion.p>

        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-[#9CA3AF] text-xs uppercase tracking-[0.2em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          OUR STORY — Split layout with expertise grid
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-16 md:py-24 bg-white">
        {/* Decorative vertical connector */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-[#1F2937] to-transparent" />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — Text */}
            <FadeIn>
              <Badge variant="outline" className="border-[#E8751A]/30 text-[#E8751A] rounded-full px-3 py-0.5 text-xs font-semibold mb-4">
                Our Story
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3 leading-snug">
                Powering India<br />
                <span className="text-[#1F2937]">Since 1998</span>
              </h2>
              <div className="section-bar mb-6" />
              <p className="text-[#374151] leading-relaxed mb-4">
                <span className="font-semibold text-[#1A1A2E]">{aboutText}</span> Started in 1998, SHRI VAARI ELECTRICALS is the fastest growing company in India in the field of electrical engineering.
              </p>
              <p className="text-[#374151] leading-relaxed mb-4">
                A professionally managed, multi-location engineering firm with market leadership in India, we are establishing a significant position in overseas markets such as Nepal, Bhutan, and Qatar in the EPC field (Engineering, Procurement and Construction).
              </p>
              <p className="text-[#374151] leading-relaxed mb-6">
                We offer integrated design and engineering consultancy services from concept to completion for a wide range of projects across industries. We also specialize in project planning and appraisal, economic evaluation, design and detailed engineering, energy audit, safety audit, and supervision of construction and erection.
              </p>

              {/* Expertise Grid */}
              <div className="bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] p-5 md:p-6">
                <h4 className="text-sm font-bold text-[#1A1A2E] uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-[#E8751A] rounded-full" />
                  Our Expertise
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  {EXPERTISE.map((item) => (
                    <div key={item.label} className="flex items-start gap-2.5 group">
                      <div className="w-7 h-7 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 group-hover:border-[#E8751A]/40 group-hover:bg-[#E8751A]/5 transition-colors">
                        <item.icon className="w-3.5 h-3.5 text-[#E8751A]" />
                      </div>
                      <span className="text-sm text-[#374151] font-medium leading-tight pt-0.5">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Right — Image with decorative frame + Project Stats */}
            <FadeIn delay={0.15} className="relative">
              <div className="relative">
                {/* Decorative offset frame */}
                <div className="absolute -top-4 -right-4 w-full h-full rounded-lg border-2 border-[#E8751A]/20 -z-0 hidden md:block" />
                <div className="relative rounded-lg overflow-hidden shadow-xl">
                  <img
                    src="/images/about/office-exterior.jpg"
                    alt="Shri Vaari Electricals — Corporate Office, Guindy, Chennai"
                    className="w-full object-cover min-h-[320px] md:min-h-[380px]"
                  />
                  {/* Overlay badge */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E8751A]/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-[#E8751A]" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-[#1A1A2E] leading-tight">29+ Years</p>
                        <p className="text-xs text-[#6B7280]">of Engineering Excellence</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Inset credential detail — ISO 9001:2015 signage */}
                <div className="absolute -bottom-6 -right-4 md:-right-6 w-28 h-28 md:w-36 md:h-36 rounded-lg overflow-hidden border-4 border-white shadow-xl hidden sm:block z-10">
                  <img
                    src="/images/about/credential-badge.jpg"
                    alt="SVEPL ISO 9001:2015 certified signage"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Decorative vertical connector to next section */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-[#E8751A]/40" />
      </section>

      {/* ═══════════════════════════════════════════════════════
          JOURNEY — Horizontal slider timeline
          ═══════════════════════════════════════════════════════ */}
      <Journey
        label="Our Journey"
        title="We have best team and best process"
        description="From a small firm in 1998 to a ₹200+ Crore enterprise — every milestone is a story of grit, innovation, and the relentless pursuit of excellence."
        ctaText="Get Started"
        onCtaClick={() => navigate('contact')}
      />

      {/* ═══════════════════════════════════════════════════════
          MISSION & VISION — Image-forward dual cards
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 right-1/4 w-[24rem] h-[24rem] bg-[#E8751A]/[0.04] blur-[140px] rounded-full pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8751A]/10 border border-[#E8751A]/25 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8751A]" />
                <span className="text-xs font-bold tracking-[0.2em] text-[#E8751A] uppercase">What Drives Us</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A2E] mb-3 leading-tight tracking-tight">
                Our Mission &amp; <span className="text-[#E8751A]">Vision</span>
              </h2>
              <p className="text-[#6B7280] text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                The principles that guide our engineering practice and the future we are building together.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Mission — Image-forward with bullet points */}
            <FadeIn delay={0}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="group relative h-full overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-[#1F2937]/30 shadow-sm hover:shadow-2xl hover:shadow-[#1F2937]/10 transition-all duration-500"
              >
                {/* Image header */}
                <div className="relative overflow-hidden h-52 md:h-56">
                  <motion.img
                    src="/images/mission-vision/mission.png"
                    alt="Our Mission — Engineering team collaboration"
                    className="w-full h-full object-cover"
                    initial={false}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                  />
                  {/* Navy gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937]/70 via-[#1F2937]/20 to-transparent" />
                  {/* Navy accent line */}
                  <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#1F2937] group-hover:w-full transition-all duration-500 ease-out" />
                  {/* Icon + title overlay on image */}
                  <div className="absolute bottom-4 left-5 right-5 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg flex-shrink-0">
                      <Target className="w-6 h-6 text-[#1F2937]" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold tracking-[0.2em] text-white/80 uppercase">Our Direction</span>
                      <h3 className="text-xl md:text-2xl font-bold text-white leading-tight tracking-tight">Our Mission</h3>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                  <ul className="space-y-3">
                    {MISSION_POINTS.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#1F2937]/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#1F2937]/15 transition-colors">
                          <CheckCircle2 className="w-3 h-3 text-[#1F2937]" />
                        </div>
                        <span className="text-[#374151] text-sm leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </FadeIn>

            {/* Vision — Image-forward with statement */}
            <FadeIn delay={0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="group relative h-full overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-[#E8751A]/40 shadow-sm hover:shadow-2xl hover:shadow-[#E8751A]/10 transition-all duration-500"
              >
                {/* Image header */}
                <div className="relative overflow-hidden h-52 md:h-56">
                  <motion.img
                    src="/images/mission-vision/vision.png"
                    alt="Our Vision — Looking toward the future"
                    className="w-full h-full object-cover"
                    initial={false}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                  />
                  {/* Coral gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#E8751A]/60 via-black/20 to-transparent" />
                  {/* Coral accent line */}
                  <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#E8751A] group-hover:w-full transition-all duration-500 ease-out" />
                  {/* Icon + title overlay on image */}
                  <div className="absolute bottom-4 left-5 right-5 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg flex-shrink-0">
                      <Eye className="w-6 h-6 text-[#E8751A]" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold tracking-[0.2em] text-white/80 uppercase">Our Horizon</span>
                      <h3 className="text-xl md:text-2xl font-bold text-white leading-tight tracking-tight">Our Vision</h3>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 flex flex-col h-[calc(100%-14rem)]">
                  <p className="text-[#374151] text-base leading-relaxed flex-1">
                    {vision}
                  </p>
                  <div className="mt-6 pt-5 border-t border-[#E5E7EB]">
                    <div className="flex items-center gap-2 text-[#E8751A]">
                      <BadgeCheck className="w-5 h-5" />
                      <span className="text-sm font-semibold uppercase tracking-wider">Engineering Excellence</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CORE VALUES — Image-forward bento grid, single coral accent
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#F8FAFC] relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        {/* Ambient coral glow */}
        <div className="absolute top-1/3 -left-32 w-[28rem] h-[28rem] bg-[#E8751A]/[0.05] blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 -right-32 w-[28rem] h-[28rem] bg-[#E8751A]/[0.04] blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 items-end">
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8751A]/10 border border-[#E8751A]/25 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8751A]" />
                  <span className="text-xs font-bold tracking-[0.2em] text-[#E8751A] uppercase">Our Principles</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A2E] mb-3 leading-tight tracking-tight">
                  Core Values That<br />
                  <span className="text-[#E8751A]">Define Us</span>
                </h2>
              </div>
              <p className="text-[#6B7280] text-sm leading-relaxed lg:max-w-xs">
                Five principles that guide every decision, every project, and every relationship we build — from the drawing board to commissioning.
              </p>
            </div>
          </FadeIn>

          {/* Bento grid: 3 cards top row, 2 wide cards bottom row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5">
            {CORE_VALUES.map((value, i) => {
              const isWide = i >= 3 // last 2 cards are wide
              const colSpan = isWide ? 'lg:col-span-3' : 'lg:col-span-2'
              return (
                <FadeIn key={value.name} delay={i * 0.08} className={colSpan}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="group relative h-full overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-[#E8751A]/40 shadow-sm hover:shadow-2xl hover:shadow-[#E8751A]/10 transition-all duration-500"
                  >
                    {/* Image */}
                    <div className={`relative overflow-hidden ${isWide ? 'h-48 md:h-56' : 'h-52 md:h-60'}`}>
                      <motion.img
                        src={value.image}
                        alt={value.name}
                        className="w-full h-full object-cover"
                        initial={false}
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                      />
                      {/* Coral sweep overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {/* Coral accent line on hover */}
                      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#E8751A] group-hover:w-full transition-all duration-500 ease-out" />
                    </div>

                    {/* Content */}
                    <div className="p-5 md:p-6">
                      <h3 className={`font-bold text-[#1A1A2E] mb-2 leading-tight tracking-tight ${isWide ? 'text-xl md:text-2xl' : 'text-lg'}`}>
                        {value.name}
                      </h3>
                      <p className="text-[#6B7280] text-sm leading-relaxed">
                        {value.desc}
                      </p>
                    </div>
                  </motion.div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          INFRASTRUCTURE & CAPABILITIES — Image-forward cards, single coral
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 items-end">
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8751A]/10 border border-[#E8751A]/25 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8751A]" />
                  <span className="text-xs font-bold tracking-[0.2em] text-[#E8751A] uppercase">Built To Deliver</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A2E] mb-3 leading-tight tracking-tight">
                  Infrastructure &amp;<br />
                  <span className="text-[#E8751A]">Capabilities</span>
                </h2>
              </div>
              <p className="text-[#6B7280] text-sm leading-relaxed lg:max-w-xs">
                A robust foundation of engineering talent, modern manufacturing infrastructure, and proven execution capabilities — built to deliver complex projects at scale.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INFRASTRUCTURE.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="group relative h-full overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-[#E8751A]/40 shadow-sm hover:shadow-2xl hover:shadow-[#E8751A]/10 transition-all duration-500"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-52 md:h-56">
                    <motion.img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      initial={false}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                    />
                    {/* Coral sweep overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Coral accent line on hover */}
                    <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#E8751A] group-hover:w-full transition-all duration-500 ease-out" />
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6">
                    <h3 className="text-base md:text-lg font-bold text-[#1A1A2E] mb-2 leading-tight tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS — Horizontal bar chart style on light background
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-[#EFEFEF]">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Text */}
            <FadeIn>
              <Badge className="bg-[#E8751A]/10 text-[#E8751A] border border-[#E8751A]/20 rounded-full px-3 py-0.5 text-xs font-semibold mb-4">
                By The Numbers
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3 leading-snug">
                Numbers That Tell<br />Our Story
              </h2>
              <div className="section-bar mb-4" />
              <p className="text-[#6B7280] text-sm leading-relaxed max-w-md mb-6">
                Nearly three decades of relentless commitment reflected in every project delivered, every team member empowered, and every client relationship sustained. A CAGR of ~23% speaks to our consistent growth trajectory.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-[#E5E7EB] shadow-sm">
                  <Shield className="w-5 h-5 text-[#E8751A] mb-2" />
                  <p className="text-[#1A1A2E] text-sm font-semibold">CRISIL Rating</p>
                  <p className="text-[#E8751A] text-lg font-bold">BB+</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-[#E5E7EB] shadow-sm">
                  <TrendingUp className="w-5 h-5 text-[#0D9488] mb-2" />
                  <p className="text-[#1A1A2E] text-sm font-semibold">Revenue CAGR</p>
                  <p className="text-[#0D9488] text-lg font-bold">~23%</p>
                </div>
              </div>
            </FadeIn>

            {/* Right — Bar counters */}
            <div className="space-y-5">
              {statsData.map((s, i) => (
                <FadeIn key={s.label} delay={i * 0.08}>
                  <BarCounter
                    value={s.value}
                    suffix={s.suffix}
                    label={s.label}
                    maxVal={s.maxVal}
                    delay={i * 150}
                    icon={s.icon}
                  />
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA — Join Our Journey
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-[#EFEFEF]">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 text-center relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <Shield className="w-4 h-4 text-[#E8751A]" />
              <span className="text-[#4B5563] text-xs font-medium">29+ Years of Trusted Partnerships</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A2E] mb-4 leading-tight">
              Join Our Journey
            </h2>
            <p className="text-[#6B7280] mb-8 max-w-xl mx-auto text-sm leading-relaxed">
              Whether you&apos;re a client seeking reliable electrical solutions from concept to commissioning, or a professional looking to build a meaningful career — we&apos;d love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => navigate('contact')}
                className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-full px-8 h-12 font-semibold transition-colors shadow-lg shadow-[#E8751A]/20"
              >
                Get In Touch <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                onClick={() => navigate('services')}
                variant="outline"
                className="border-[#1F2937] text-[#1F2937] hover:bg-[#1F2937] hover:text-white rounded-full px-8 h-12 font-semibold transition-colors"
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
