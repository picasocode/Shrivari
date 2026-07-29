'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  ChevronRight, Target, Eye, Heart, Shield, Award, Users, Clock,
  ChevronDown, Building2, Factory, Rocket, Sparkles, ArrowRight,
  MapPin, Zap, Sun, CheckCircle2, Globe, TrendingUp,
  Cpu, Wrench, FileCheck, Handshake, Lightbulb, BadgeCheck, Star,
  Factory as Manufacturing,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/components/Router'
import { fetchSettings, fetchMilestones, type SiteSettings, type Milestone } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'

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
  { value: 10000, suffix: '+', label: 'LT Panels Installed', maxVal: 11000, icon: Manufacturing },
  { value: 1200, suffix: '+', label: 'Projects Completed', maxVal: 1300, icon: Building2 },
]

/* ─── Icon maps for API data ─── */
const milestoneIconMap: Record<string, React.ElementType> = {
  Rocket, Wrench, Factory, Award, Zap, Sun, Handshake, TrendingUp, Building2, BadgeCheck,
  Sparkles, ArrowRight, MapPin, CheckCircle2, Globe, Cpu, FileCheck, Lightbulb, Shield, Star,
}

const branchIconMap: Record<string, React.ElementType> = {
  Building2, MapPin, Globe, Zap, Factory, Award,
}

/* ─── Main Component ─── */
export default function AboutPage() {
  const { navigate } = useRouter()
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  /* Parallax hero scroll */
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    Promise.all([
      fetchSettings().catch(() => null),
      fetchMilestones(true).catch(() => []),
    ]).then(([s, m]) => {
      setSettings(s as SiteSettings | null)
      setMilestones(m as Milestone[])
      setLoading(false)
    })
  }, [])

  const aboutText = settings?.about_text || 'Shri Vaari Electricals Private Limited (SVEPL) is a professionally managed engineering firm established in 1998 in Chennai, India. With over 29 years of expertise, we have grown from a small firm to a 364+ strong organization, becoming one of South India\'s most trusted names in EPC solutions, panel manufacturing, and comprehensive electrical services. Our commitment to quality, safety, and innovation has earned us the trust of clients across India and internationally.'

  const mission = settings?.mission || 'To deliver world-class electrical engineering solutions — from concept to commissioning — with unwavering commitment to safety, quality, and innovation, empowering industries and infrastructure across India and beyond.'

  const vision = settings?.vision || 'To become India\'s leading integrated electrical solutions provider, setting benchmarks in quality, safety, and sustainability while powering the nation\'s infrastructure growth and contributing to a greener energy future.'

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
          OUR STORY — Split layout with connecting line
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
              <p className="text-[#374151] leading-relaxed mb-4">{aboutText}</p>
              <p className="text-[#374151] leading-relaxed mb-4">
                Headquartered at C-37, Thiru-Vi-Ka Industrial Estate, Guindy, Chennai, we operate across 8 branch offices in South India. We hold an ESA License issued by all CEIGs in South India and approved by CEA, and are a TNEB Class-1 Contractor approved by AP/Telangana/Karnataka utilities. Our capabilities span up to 400 KV, with international project experience in Nigeria, Qatar, Bangladesh, Sri Lanka, Oman, and Sierra Leone.
              </p>
              <p className="text-[#374151] leading-relaxed mb-6">
                We have worked with leading consultants including CRN, SME, NNE, JACOBS, TCE, and ABBETT, and are approved by TNPDCL, TANTRANSCO, APTRANSCO, TSTRANSCO, APSPDCL, KPTCL, KSEB, GOA, OPTCL, and OPDCL.
              </p>
              <div className="flex flex-wrap gap-3">
                {['EPC Solutions', 'Panel Manufacturing', 'EHV up to 400KV', 'Solar EPC', 'AMC Services', 'Liasion Services'].map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1F2937] bg-[#F0F4F8] rounded-full px-3 py-1.5">
                    <ChevronRight className="w-3 h-3 text-[#E8751A]" />
                    {tag}
                  </span>
                ))}
              </div>
            </FadeIn>

            {/* Right — Image with decorative frame + Project Stats */}
            <FadeIn delay={0.15} className="relative">
              <div className="relative">
                {/* Decorative offset frame */}
                <div className="absolute -top-4 -right-4 w-full h-full rounded-lg border-2 border-[#E8751A]/20 -z-0 hidden md:block" />
                <div className="relative rounded-lg overflow-hidden shadow-xl">
                  <img
                    src="/images/about-team.jpg"
                    alt="SVEPL Team and Facilities at Guindy, Chennai"
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
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Decorative vertical connector to next section */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-[#E8751A]/40" />
      </section>

      {/* ═══════════════════════════════════════════════════════
          JOURNEY TIMELINE — Horizontal milestone timeline
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <Badge variant="outline" className="border-[#E8751A]/30 text-[#E8751A] rounded-full px-3 py-0.5 text-xs font-semibold mb-4">
                Our Journey
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">Milestones That Define Us</h2>
              <div className="section-bar mx-auto mb-4" />
              <p className="text-[#6B7280] max-w-xl mx-auto text-sm">
                From a small firm in 1998 to a ₹200+ Crore enterprise — every milestone is a story of grit, innovation, and the relentless pursuit of excellence.
              </p>
            </div>
          </FadeIn>

          {/* Milestone Cards — equal height, modern design */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="bg-white rounded-2xl border border-[#E5E7EB]">
                  <CardContent className="p-6 space-y-3">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 [grid-auto-rows:1fr]">
              {milestones.map((m, i) => {
                const MIcon = milestoneIconMap[m.icon] || Zap
                return (
                  <FadeIn key={m.year + m.title} delay={i * 0.06} className="h-full">
                    <Card className="group relative bg-white rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full min-h-[300px] flex flex-col overflow-hidden">
                      {/* Top accent bar */}
                      <div className="h-1.5 w-full" style={{ backgroundColor: m.color }} />
                      <CardContent className="p-6 flex flex-col flex-1">
                        {/* Icon + Year row */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${m.color}12` }}>
                            <MIcon className="w-6 h-6" style={{ color: m.color }} />
                          </div>
                          <span className="text-2xl font-extrabold tabular-nums" style={{ color: `${m.color}` }}>
                            {m.year}
                          </span>
                        </div>
                        {/* Title */}
                        <h3 className="text-base font-bold text-[#1A1A2E] mb-2 leading-snug">{m.title}</h3>
                        {/* Description — clamped for equal height */}
                        <p className="text-[#6B7280] text-sm leading-relaxed line-clamp-3 flex-1">{m.description}</p>
                        {/* Bottom index marker */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#F3F4F6]">
                          <span className="text-[10px] font-bold tracking-widest text-[#9CA3AF]">
                            {String(i + 1).padStart(2, '0')} / {String(milestones.length).padStart(2, '0')}
                          </span>
                          <div className="flex-1 h-px bg-[#F3F4F6]" />
                          <ArrowRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#E8751A] group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MISSION / VISION / VALUES — Three overlapping accent cards
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <Badge variant="outline" className="border-[#E8751A]/30 text-[#E8751A] rounded-full px-3 py-0.5 text-xs font-semibold mb-4">
                What Drives Us
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">Mission, Vision &amp; Values</h2>
              <div className="section-bar mx-auto" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:-mb-6">
            {/* Mission — Navy accent */}
            <FadeIn delay={0}>
              <div className="relative group">
                <div className="absolute -top-3 -left-3 w-20 h-20 rounded-xl bg-[#1F2937] -z-10 opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
                <Card className="bg-white rounded-xl border-l-4 border-l-[#1F2937] border-y border-r border-y-[#E5E7EB] border-r-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-[#1F2937]/8 flex items-center justify-center mb-5">
                      <Target className="w-7 h-7 text-[#1F2937]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1A1A2E] mb-3">Our Mission</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{mission}</p>
                  </CardContent>
                </Card>
              </div>
            </FadeIn>

            {/* Vision — Orange accent */}
            <FadeIn delay={0.1}>
              <div className="relative group md:-mt-4">
                <div className="absolute -top-3 -right-3 w-20 h-20 rounded-xl bg-[#E8751A] -z-10 opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
                <Card className="bg-white rounded-xl border-l-4 border-l-[#E8751A] border-y border-r border-y-[#E5E7EB] border-r-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow duration-300 h-full md:shadow-lg">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-[#E8751A]/8 flex items-center justify-center mb-5">
                      <Eye className="w-7 h-7 text-[#E8751A]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1A1A2E] mb-3">Our Vision</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{vision}</p>
                  </CardContent>
                </Card>
              </div>
            </FadeIn>

            {/* Values — Teal accent */}
            <FadeIn delay={0.2}>
              <div className="relative group">
                <div className="absolute -bottom-3 -left-3 w-20 h-20 rounded-xl bg-[#0D9488] -z-10 opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
                <Card className="bg-white rounded-xl border-l-4 border-l-[#0D9488] border-y border-r border-y-[#E5E7EB] border-r-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-[#0D9488]/8 flex items-center justify-center mb-5">
                      <Heart className="w-7 h-7 text-[#0D9488]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1A1A2E] mb-3">Our Values</h3>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Safety First', icon: Shield },
                        { label: 'Quality Without Compromise', icon: BadgeCheck },
                        { label: 'Integrity & Transparency', icon: CheckCircle2 },
                        { label: 'Innovation & Adaptability', icon: Lightbulb },
                        { label: 'Client Partnership', icon: Handshake },
                      ].map((v) => (
                        <div key={v.label} className="flex items-center gap-2">
                          <v.icon className="w-4 h-4 text-[#0D9488] flex-shrink-0" />
                          <span className="text-[#6B7280] text-sm">{v.label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </FadeIn>
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
