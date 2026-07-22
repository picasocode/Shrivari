'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  ChevronRight, Target, Eye, Heart, Shield, Award, Users, Clock,
  ChevronDown, Building2, Factory, Rocket, Sparkles, ArrowRight,
  MapPin, Zap, Sun, CheckCircle2, XCircle, Globe, TrendingUp,
  Cpu, Wrench, FileCheck, Handshake, Lightbulb, BadgeCheck, Star,
  Factory as Manufacturing, Network, LayoutGrid,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/components/Router'
import { fetchSettings, fetchMilestones, fetchBranches, type SiteSettings, type Milestone, type Branch } from '@/lib/api'
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

const uspData = [
  { category: 'Products', svepl: 'LT/HT/Indoor/Outdoor/CRP — all under one roof with independent Type tested design certified by CPRI/CE', competitor: 'Usually specialize in only 1-2 product categories; rely on third-party type testing', sveplHas: true },
  { category: 'Projects', svepl: 'All Industries / Commercial / Residential / All Voltages bundled together — single window solution', competitor: 'Typically limited to specific industries or voltage levels; fragmented offerings', sveplHas: true },
  { category: 'CEIG/TNEB Compliances', svepl: '100% compliance — 2000+ approvals and Safety certificates obtained', competitor: 'Often outsource compliance; limited in-house expertise; lower approval rates', sveplHas: true },
  { category: 'Organization', svepl: 'Fast decision making / Flexible team principles — agile and responsive', competitor: 'Bureaucratic processes; slow turnaround times; rigid structures', sveplHas: true },
  { category: 'Design & Engineering', svepl: 'Completely IN-HOUSE design and engineering capability', competitor: 'Depend on external design consultants; limited customization', sveplHas: true },
  { category: 'Infrastructure', svepl: 'Comprehensive infrastructure including own Transport fleet', competitor: 'Limited infrastructure; rely on external logistics', sveplHas: true },
  { category: 'Licenses', svepl: 'ESA License issued by all CEIGs in South India & approved by CEA; TNEB Class-1 Contractor', competitor: 'Limited regional licenses; cannot operate pan-South India', sveplHas: true },
]



const projectStats = [
  { label: 'EHV Overhead Lines', value: '100+ KMs', icon: Network },
  { label: 'EHV UG Cable Works', value: '45+ KMs', icon: Zap },
  { label: 'EHV Switchyards', value: '65 Projects', icon: Building2 },
  { label: 'GIS Substations', value: '10+ Projects', icon: LayoutGrid },
  { label: 'Solar Rooftop', value: '5.5 MW', icon: Sun },
  { label: 'Solar Ground Mount', value: '450 MW', icon: Sun },
  { label: 'CEIG/CEA Approvals', value: '2000+', icon: FileCheck },
  { label: 'AMC Customers', value: '10+', icon: Wrench },
  { label: 'Liasion Approvals', value: '2500+', icon: Shield },
  { label: 'LT Panels', value: '10000+', icon: Manufacturing },
  { label: '11/22/33 KV Projects', value: '1200+', icon: Cpu },
]

/* ─── Main Component ─── */
export default function AboutPage() {
  const { navigate } = useRouter()
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
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
      fetchBranches(true).catch(() => []),
    ]).then(([s, m, b]) => {
      setSettings(s as SiteSettings | null)
      setMilestones(m as Milestone[])
      setBranches(b as Branch[])
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
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-[#1A1A2E] mb-5 tracking-tight"
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
            className="text-lg sm:text-xl md:text-2xl text-[#4B5563] font-light mb-3 tracking-wide"
          >
            Shri Vaari Electricals Pvt Ltd — 29+ Years of Engineering Excellence
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: 'easeOut' }}
            className="text-sm md:text-base text-[#6B7280] max-w-2xl mx-auto leading-relaxed"
          >
            From a small firm in Chennai to one of South India&apos;s most trusted electrical engineering companies —
            with operations across 8 cities, projects in 6 countries, and a turnover exceeding ₹200 Crores.
          </motion.p>

          {/* Quick stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: 'easeOut' }}
            className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8"
          >
            {[
              { label: 'CRISIL BB+', icon: Shield },
              { label: 'TNEB Class-1', icon: Award },
              { label: 'Up to 400 KV', icon: Zap },
              { label: '6 Countries', icon: Globe },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-[#4B5563]">
                <item.icon className="w-4 h-4 text-[#E8751A]" />
                <span className="text-xs md:text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </motion.div>
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

              {/* Mini project stats grid below image */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {projectStats.slice(0, 6).map((ps) => (
                  <div key={ps.label} className="bg-[#F0F4F8] rounded-lg p-3 text-center">
                    <ps.icon className="w-4 h-4 text-[#E8751A] mx-auto mb-1" />
                    <p className="text-sm font-bold text-[#1A1A2E]">{ps.value}</p>
                    <p className="text-[10px] text-[#6B7280] leading-tight">{ps.label}</p>
                  </div>
                ))}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {milestones.map((m, i) => {
                const MIcon = milestoneIconMap[m.icon] || Zap
                return (
                  <FadeIn key={m.year + m.title} delay={i * 0.06}>
                    <Card className="group relative bg-white rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col overflow-hidden">
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
          PROJECT STATS — Horizontal scrollable cards
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white relative overflow-hidden">

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <Badge variant="outline" className="border-[#1F2937]/20 text-[#1F2937] rounded-full px-3 py-0.5 text-xs font-semibold mb-4">
                Project Portfolio
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">Delivered at Scale</h2>
              <div className="section-bar mx-auto mb-4" />
              <p className="text-[#6B7280] max-w-xl mx-auto text-sm">
                From EHV switchyards to LT panels, from solar plants to CEIG approvals — our delivery record speaks for itself.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {projectStats.map((ps, i) => (
              <FadeIn key={ps.label} delay={i * 0.04}>
                <Card className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm card-hover text-center h-full">
                  <CardContent className="p-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1F2937]/8 flex items-center justify-center mx-auto mb-3">
                      <ps.icon className="w-5 h-5 text-[#1F2937]" />
                    </div>
                    <p className="text-xl font-bold text-[#1F2937] mb-1">{ps.value}</p>
                    <p className="text-[10px] text-[#6B7280] leading-tight">{ps.label}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          OUR USP — Comparison table
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1F2937]/[0.02] rounded-full -translate-y-1/2 translate-x-1/3" />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <Badge variant="outline" className="border-[#E8751A]/30 text-[#E8751A] rounded-full px-3 py-0.5 text-xs font-semibold mb-4">
                What Sets Us Apart
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">Our Unique Selling Proposition</h2>
              <div className="section-bar mx-auto mb-4" />
              <p className="text-[#6B7280] max-w-xl mx-auto text-sm">
                See how SVEPL&apos;s comprehensive capabilities compare with typical competitors in the electrical engineering space.
              </p>
            </div>
          </FadeIn>

          {/* Desktop table */}
          <FadeIn delay={0.1}>
            <div className="hidden md:block rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="bg-[#1F2937] text-white text-left px-6 py-4 text-sm font-semibold w-[15%]">Category</th>
                    <th className="bg-[#1F2937] text-white text-left px-6 py-4 text-sm font-semibold w-[42.5%]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#E8751A]" />
                        SVEPL
                      </div>
                    </th>
                    <th className="bg-[#F0F4F8] text-[#6B7280] text-left px-6 py-4 text-sm font-semibold w-[42.5%]">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-[#9CA3AF]" />
                        Typical Competitor
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {uspData.map((row, i) => (
                    <tr key={row.category} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFC]'}>
                      <td className="px-6 py-4 border-t border-[#E5E7EB]">
                        <Badge className="bg-[#1F2937]/8 text-[#1F2937] border-0 rounded-full px-3 py-1 text-xs font-semibold">
                          {row.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 border-t border-[#E5E7EB]">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#0D9488] flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-[#374151] leading-relaxed">{row.svepl}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-t border-[#E5E7EB]">
                        <div className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-[#D1D5DB] flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-[#9CA3AF] leading-relaxed">{row.competitor}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {uspData.map((row, i) => (
              <FadeIn key={row.category} delay={i * 0.05}>
                <Card className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-[#1F2937] px-4 py-2.5">
                      <Badge className="bg-white/15 text-white border-0 rounded-full px-3 py-1 text-xs font-semibold">
                        {row.category}
                      </Badge>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0D9488] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-semibold text-[#0D9488] uppercase tracking-wider mb-0.5">SVEPL</p>
                          <span className="text-sm text-[#374151] leading-relaxed">{row.svepl}</span>
                        </div>
                      </div>
                      <div className="h-px bg-[#E5E7EB]" />
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-[#D1D5DB] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-0.5">Typical Competitor</p>
                          <span className="text-sm text-[#9CA3AF] leading-relaxed">{row.competitor}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          BRANCHES — Map-like grid
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#EFEFEF] relative overflow-hidden">
        {/* South India silhouette suggestion */}
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.04]" viewBox="0 0 500 500">
          <ellipse cx="250" cy="250" rx="200" ry="220" stroke="#1F2937" strokeWidth="2" fill="none" />
          <ellipse cx="250" cy="250" rx="140" ry="160" stroke="#1F2937" strokeWidth="1" fill="none" />
          <ellipse cx="250" cy="250" rx="80" ry="100" stroke="#1F2937" strokeWidth="0.5" fill="none" />
          <line x1="250" y1="30" x2="250" y2="470" stroke="#1F2937" strokeWidth="0.5" />
          <line x1="30" y1="250" x2="470" y2="250" stroke="#1F2937" strokeWidth="0.5" />
        </svg>

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <Badge variant="outline" className="border-[#1F2937]/20 text-[#1F2937] rounded-full px-3 py-0.5 text-xs font-semibold mb-4">
                Our Presence
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">Across South India</h2>
              <div className="section-bar mx-auto mb-4" />
              <p className="text-[#6B7280] max-w-xl mx-auto text-sm">
                With our headquarters in Chennai and 8 branch offices across South India, we ensure rapid response and local expertise for every project.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {branches.map((branch, i) => (
              <FadeIn key={branch.city} delay={i * 0.06}>
                <Card className={`bg-white rounded-xl border shadow-sm card-hover h-full overflow-hidden ${branch.isHQ ? 'border-[#E8751A]/30 ring-1 ring-[#E8751A]/10' : 'border-[#E5E7EB]'}`}>
                  <CardContent className="p-0">
                    {/* Colored header strip */}
                    <div className={`h-2 ${branch.isHQ ? 'bg-[#E8751A]' : 'bg-[#1F2937]/20'}`} />
                    <div className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${branch.isHQ ? 'bg-[#E8751A]/10' : 'bg-[#1F2937]/8'}`}>
                          <branch.icon className={`w-5 h-5 ${branch.isHQ ? 'text-[#E8751A]' : 'text-[#1F2937]'}`} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#1A1A2E]">{branch.city}</h3>
                          <p className="text-xs text-[#6B7280]">{branch.state}</p>
                        </div>
                      </div>
                      {branch.isHQ ? (
                        <Badge className="bg-[#E8751A]/10 text-[#E8751A] border-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Headquarters
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-[#1F2937]/15 text-[#1F2937]/70 rounded-full px-3 py-1 text-[10px] font-medium">
                          {branch.type}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          {/* International presence */}
          <FadeIn delay={0.3}>
            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-2 bg-white rounded-full border border-[#E5E7EB] px-5 py-2.5 shadow-sm">
                <Globe className="w-4 h-4 text-[#1F2937]" />
                <span className="text-xs font-medium text-[#6B7280]">International Projects:</span>
                <div className="flex gap-1.5">
                  {['Nigeria', 'Qatar', 'Bangladesh', 'Sri Lanka', 'Oman', 'Sierra Leone'].map(country => (
                    <span key={country} className="inline-flex items-center text-[10px] font-semibold text-[#1F2937] bg-[#F0F4F8] rounded-full px-2 py-0.5">
                      {country}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Approved by utilities */}
          <FadeIn delay={0.4}>
            <div className="mt-8 text-center">
              <p className="text-xs text-[#9CA3AF] mb-3 font-medium uppercase tracking-wider">Approved By</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['TNPDCL', 'TANTRANSCO', 'APTRANSCO', 'TSTRANSCO', 'APSPDCL', 'KPTCL', 'KSEB', 'GOA', 'OPTCL', 'OPDCL'].map(util => (
                  <span key={util} className="text-[10px] font-semibold text-[#1F2937]/70 bg-white border border-[#E5E7EB] rounded-md px-2.5 py-1">
                    {util}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
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
