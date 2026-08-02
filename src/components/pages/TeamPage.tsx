'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  UserCircle, Linkedin, Mail, ChevronRight, ArrowRight, Users, Award,
  Briefcase, Zap, Shield, Sun, Cpu, Wrench, FileCheck,
  Building2, Network, Clock, TrendingUp, Globe,
  Lightbulb, Handshake, ChevronDown, CheckCircle2, Sparkles,
  PenTool, Hammer, FlaskConical, Factory,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/components/Router'

/* ─── Brand Tokens (single coral + navy palette) ─── */
const NAVY_DEEP = '#0C2340'
const NAVY = '#152D4F'
const NAVY_MID = '#1B3A5C'
const NAVY_DARK = '#0D1D3A'
const CORAL = '#E8751A'
const INK = '#1A1A2E'
const SLATE = '#6B7280'
const LIGHT_BG = '#F7F9FC'

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

/* ─── Animated counter ─── */
function AnimatedCounter({ value, suffix = '', prefix = '', duration = 2000 }: { value: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isInView, value, duration])

  return <span ref={ref} className="tabular-nums">{prefix}{count}{suffix}</span>
}

/* ─── Leadership data (NO per-leader multicolour — single navy + coral) ─── */
const leaders = [
  {
    name: 'Mr. Rengarajan',
    designation: 'Managing Director',
    responsibility: 'Design / Marketing / Liaisoning',
    experience: 38,
    initials: 'R',
  },
  {
    name: 'Mr. Sivagami Nathan',
    designation: 'Executive Director',
    responsibility: 'Administration / Finance / Tendering',
    experience: 45,
    initials: 'SN',
  },
  {
    name: 'Mr. Rakesh Kumar',
    designation: 'Operations Director',
    responsibility: 'Operations',
    experience: 10,
    initials: 'RK',
  },
  {
    name: 'Mr. Ambalarajan',
    designation: 'Director - Projects',
    responsibility: 'Project Execution / Renewable Energy',
    experience: 15,
    initials: 'A',
  },
  {
    name: 'Mr. Anand Purushothaman',
    designation: 'Technical Director',
    responsibility: 'Design / Marketing / Project Execution',
    experience: 35,
    initials: 'AP',
  },
  {
    name: 'Mr. Manjari',
    designation: 'Project Director',
    responsibility: 'EHV Projects',
    experience: 40,
    initials: 'M',
  },
]

/* ─── Philosophy data (single coral accent) ─── */
const philosophyItems = [
  {
    icon: Cpu,
    title: 'In-House Expertise',
    description: 'Design and Engineering completely in-house — from concept to detailed engineering, every drawing and calculation is handled by our own team of specialists.',
  },
  {
    icon: Award,
    title: 'Industry Veterans',
    description: 'Combined 180+ years of leadership experience across all domains — EHV projects, manufacturing, operations, finance, and renewable energy.',
  },
  {
    icon: Handshake,
    title: 'Client First Approach',
    description: 'Fast decision making and flexible team principles — our lean organizational structure ensures rapid response times and personalized service for every client.',
  },
]

/* ─── Stats data (single coral accent) ─── */
const teamStats = [
  { value: 364, suffix: '+', label: 'Team Members', icon: Users },
  { value: 180, suffix: '+', label: 'Combined Years of Leadership', icon: Clock },
  { value: 6, suffix: '', label: 'Directors', icon: Briefcase },
  { value: 8, suffix: '', label: 'Branch Offices', icon: Building2 },
]

/* ─── Quick facts for CTA ─── */
const quickFacts = [
  { value: '29+', label: 'Years Strong' },
  { value: '364+', label: 'Team Members' },
  { value: '6', label: 'Directors' },
  { value: '8', label: 'Branch Offices' },
]

/* ─── Capabilities data ─── */
const capabilities = [
  { icon: PenTool, label: 'Design Engineering', sub: 'In-House' },
  { icon: Factory, label: 'Manufacturing', sub: '20,000 sq ft Guindy' },
  { icon: Hammer, label: 'Project Execution', sub: 'Up to 400KV' },
  { icon: FlaskConical, label: 'Testing & Commissioning', sub: 'All Voltages' },
  { icon: Shield, label: 'AMC Services', sub: 'Industrial & Commercial' },
  { icon: Sun, label: 'Solar EPC', sub: 'Rooftop & Ground Mount' },
  { icon: FileCheck, label: 'CEIG/CEA Liaison', sub: '2000+ Approvals' },
  { icon: Network, label: 'Utility Liaison', sub: '10+ State Boards' },
]

/* ─── Main Component ─── */
export default function TeamPage() {
  const { navigate } = useRouter()

  /* Parallax hero scroll */
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          SECTION 1: HERO — Spacious editorial split, navy + coral only
          ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, ${NAVY_MID} 45%, ${NAVY} 100%)` }}>
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          {/* Diagonal line pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, #fff 40px, #fff 41px)`,
          }} />
          {/* Coral-only ambient glows */}
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse at 30% 40%, rgba(232,117,26,0.14) 0%, transparent 50%), radial-gradient(ellipse at 75% 70%, rgba(232,117,26,0.06) 0%, transparent 45%)`,
          }} />
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[15%] right-[10%] w-64 h-64 rounded-full blur-3xl"
            style={{ background: 'rgba(232,117,26,0.08)' }}
          />
          <motion.div
            animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[18%] left-[8%] w-80 h-80 rounded-full blur-3xl"
            style={{ background: 'rgba(232,117,26,0.05)' }}
          />
          {/* Concentric coral arcs (top-right) */}
          <svg className="absolute -top-20 -right-20 w-[420px] h-[420px] opacity-[0.10]" viewBox="0 0 420 420">
            <circle cx="210" cy="210" r="200" stroke={CORAL} strokeWidth="1" fill="none" />
            <circle cx="210" cy="210" r="160" stroke={CORAL} strokeWidth="0.8" fill="none" />
            <circle cx="210" cy="210" r="120" stroke={CORAL} strokeWidth="0.6" fill="none" />
            <circle cx="210" cy="210" r="80" stroke={CORAL} strokeWidth="0.5" fill="none" />
          </svg>
        </motion.div>

        {/* Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1280px] mx-auto px-5 lg:px-8 pt-[100px] pb-20 md:pb-28">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-2 text-sm text-white/40 mb-10"
          >
            <button onClick={() => navigate('home')} className="hover:text-white/70 transition-colors">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button onClick={() => navigate('about')} className="hover:text-white/70 transition-colors">Company</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/70">Team</span>
          </motion.div>

          {/* Asymmetric 7:5 split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* LEFT — headline + intro + CTAs */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Badge
                  className="rounded-full px-5 py-1.5 text-sm font-medium mb-6 border"
                  style={{ background: 'rgba(232,117,26,0.15)', color: CORAL, borderColor: 'rgba(232,117,26,0.30)' }}
                >
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  Our Leadership
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.05]"
              >
                Leadership that
                <br />
                <span style={{ color: CORAL }}>powers excellence.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="text-lg sm:text-xl text-white/55 font-light mb-3 max-w-xl leading-relaxed"
              >
                180+ years of combined experience driving India&apos;s power infrastructure.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65 }}
                className="text-sm md:text-base text-white/40 max-w-xl leading-relaxed mb-8"
              >
                Meet the visionaries behind SVEPL&apos;s 29-year journey — from managing EHV projects to pioneering renewable energy solutions across South India.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <Button
                  onClick={() => navigate('careers')}
                  className="rounded-xl px-7 h-12 text-base font-semibold shadow-lg transition-all duration-300"
                  style={{ background: CORAL, color: '#FFFFFF' }}
                >
                  Join Our Team
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={() => navigate('about')}
                  variant="outline"
                  className="rounded-xl px-7 h-12 text-base font-semibold backdrop-blur-sm transition-all duration-300 border-white/25 text-white hover:bg-white/10"
                >
                  About SVEPL
                </Button>
              </motion.div>
            </div>

            {/* RIGHT — glassmorphic "Leadership At A Glance" card */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                className="relative rounded-3xl border backdrop-blur-xl p-7 md:p-8"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderColor: 'rgba(255,255,255,0.10)',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.30)',
                }}
              >
                {/* Floating "ESTABLISHED 1998" coral badge */}
                <div
                  className="absolute -top-4 -right-4 rounded-xl px-3 py-1.5 text-[11px] font-bold tracking-wider shadow-lg"
                  style={{ background: CORAL, color: '#FFFFFF' }}
                >
                  ESTABLISHED 1998
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(232,117,26,0.20)' }}>
                    <Award className="w-4 h-4" style={{ color: CORAL }} />
                  </div>
                  <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">Leadership At A Glance</span>
                </div>

                {/* 4-stat grid */}
                <div className="grid grid-cols-2 gap-5 mb-6">
                  {[
                    { value: 6, suffix: '', label: 'Directors' },
                    { value: 180, suffix: '+', label: 'Years Combined' },
                    { value: 364, suffix: '+', label: 'Team Members' },
                    { value: 29, suffix: '+', label: 'Years of Trust' },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="text-3xl font-bold text-white mb-1">
                        <AnimatedCounter value={s.value} suffix={s.suffix} />
                      </div>
                      <div className="text-xs text-white/45 font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Directors chip strip */}
                <div className="pt-5 border-t border-white/10">
                  <div className="text-[11px] text-white/40 uppercase tracking-wider mb-3 font-semibold">The Six Directors</div>
                  <div className="flex flex-wrap gap-2">
                    {leaders.map((l) => (
                      <div
                        key={l.name}
                        className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 border"
                        style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.10)' }}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: NAVY_MID, border: `1px solid ${CORAL}` }}
                        >
                          <span className="text-[9px] font-bold text-white">{l.initials}</span>
                        </div>
                        <span className="text-[11px] text-white/65 font-medium">{l.name.replace('Mr. ', '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-xs uppercase tracking-[0.2em]">Explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="w-5 h-5 text-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2: LEADERSHIP GRID — single coral accent, no multicolour
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: LIGHT_BG }}>
        {/* Decorative dot pattern */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${NAVY_MID} 1.5px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/3" style={{ background: 'rgba(232,117,26,0.03)' }} />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <Badge
                variant="outline"
                className="rounded-full px-3 py-0.5 text-xs font-semibold mb-4"
                style={{ borderColor: 'rgba(232,117,26,0.30)', color: CORAL }}
              >
                Our Directors
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: INK }}>
                Six directors. <span style={{ color: CORAL }}>One mission.</span>
              </h2>
              <div className="section-bar mx-auto mb-4" />
              <p className="max-w-xl mx-auto text-sm" style={{ color: SLATE }}>
                Six seasoned professionals with deep expertise across electrical engineering, operations, finance, and renewable energy — steering SVEPL&apos;s growth since 1998.
              </p>
            </div>
          </FadeIn>

          {/* Leadership cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaders.map((leader, i) => (
              <FadeIn key={leader.name} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                  <Card className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-400 h-full overflow-hidden">
                    {/* Coral top accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ background: CORAL }} />
                    {/* Faded index number */}
                    <span
                      className="absolute top-4 right-5 text-5xl font-black leading-none select-none"
                      style={{ color: 'rgba(232,117,26,0.08)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <CardContent className="p-6">
                      {/* Top row: Avatar + Name/Designation */}
                      <div className="flex items-start gap-4 mb-5">
                        {/* Avatar — uniform navy with coral experience badge */}
                        <div className="relative flex-shrink-0">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                            style={{ background: NAVY_MID, border: `1px solid ${CORAL}` }}
                          >
                            <span className="text-xl font-bold text-white">{leader.initials}</span>
                          </div>
                          {/* Experience badge — coral */}
                          <div
                            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                            style={{ background: CORAL }}
                          >
                            <span className="text-[10px] font-bold text-white">{leader.experience}y</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold leading-tight mb-1 truncate" style={{ color: INK }}>{leader.name}</h3>
                          <Badge
                            className="border-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                            style={{ background: 'rgba(232,117,26,0.12)', color: CORAL }}
                          >
                            {leader.designation}
                          </Badge>
                        </div>
                      </div>

                      {/* Responsibility */}
                      <div className="mb-4">
                        <p className="text-xs uppercase tracking-wider mb-1 font-medium" style={{ color: '#9CA3AF' }}>Responsibility</p>
                        <p className="text-sm font-medium" style={{ color: '#374151' }}>{leader.responsibility}</p>
                      </div>

                      {/* Experience bar — navy → coral */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-medium" style={{ color: '#9CA3AF' }}>Experience</span>
                          <span className="text-sm font-bold" style={{ color: CORAL }}>{leader.experience}+ Years</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(leader.experience / 50) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(to right, ${NAVY_MID}, ${CORAL})` }}
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-xs h-8 rounded-lg"
                          style={{ color: SLATE }}
                          onClick={() => window.open('https://linkedin.com', '_blank')}
                        >
                          <Linkedin className="w-3.5 h-3.5 mr-1.5" />
                          LinkedIn
                        </Button>
                        <div className="w-px h-5 bg-gray-100" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-xs h-8 rounded-lg"
                          style={{ color: SLATE }}
                          onClick={() => navigate('contact')}
                        >
                          <Mail className="w-3.5 h-3.5 mr-1.5" />
                          Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3: LEADERSHIP PHILOSOPHY — navy bg, coral-only accents
          ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${NAVY_MID} 0%, ${NAVY} 60%, ${NAVY_MID} 100%)` }}>
        {/* Decorative dot pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        {/* Coral diagonal stripe */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.06]" style={{
          background: `repeating-linear-gradient(135deg, transparent, transparent 20px, ${CORAL} 20px, ${CORAL} 21px)`,
        }} />
        <div className="absolute top-[20%] right-[5%] w-72 h-72 rounded-full blur-3xl" style={{ background: 'rgba(232,117,26,0.06)' }} />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-16 md:py-20 relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <Badge
                className="rounded-full px-4 py-1 text-xs font-semibold mb-4 border"
                style={{ background: 'rgba(232,117,26,0.15)', color: CORAL, borderColor: 'rgba(232,117,26,0.30)' }}
              >
                <Sparkles className="w-3 h-3 mr-1.5" />
                Our Philosophy
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">How We Lead</h2>
              <div className="w-10 h-[3px] rounded mx-auto mb-4" style={{ background: CORAL }} />
              <p className="text-white/40 max-w-lg mx-auto text-sm">
                Three core principles that define our leadership approach and drive our organizational culture.
              </p>
            </div>
          </FadeIn>

          {/* Three philosophy cards — coral-only accents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {philosophyItems.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                  <div className="relative rounded-2xl border p-6 md:p-8 h-full group transition-colors duration-300" style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.10)' }}>
                    {/* Faded big index */}
                    <span className="absolute top-5 right-6 text-6xl font-black leading-none select-none" style={{ color: 'rgba(232,117,26,0.10)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {/* Coral icon tile */}
                    <div className="relative mb-6">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(232,117,26,0.18)' }}>
                        <item.icon className="w-7 h-7" style={{ color: CORAL }} />
                      </div>
                      <div className="absolute -bottom-3 left-7 w-1.5 h-1.5 rounded-full" style={{ background: CORAL }} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                    {/* Hover coral accent line */}
                    <div className="mt-6 h-0.5 w-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: CORAL }} />
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4: TEAM STATS — navy bg, single coral accent
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, ${NAVY_MID} 50%, ${NAVY_DEEP} 100%)` }}>
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Coral glow accents */}
        <div className="absolute top-[20%] left-[-5%] w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(232,117,26,0.05)' }} />
        <div className="absolute bottom-[10%] right-[-5%] w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(232,117,26,0.04)' }} />

        {/* Corner brackets */}
        <svg className="absolute top-6 left-6 w-16 h-16 opacity-[0.10]" viewBox="0 0 60 60">
          <path d="M0 20 L0 0 L20 0" stroke={CORAL} strokeWidth="2" fill="none" />
        </svg>
        <svg className="absolute bottom-6 right-6 w-16 h-16 opacity-[0.10]" viewBox="0 0 60 60">
          <path d="M60 40 L60 60 L40 60" stroke={CORAL} strokeWidth="2" fill="none" />
        </svg>

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <Badge
                className="rounded-full px-3 py-0.5 text-xs font-semibold mb-4 border"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.70)', borderColor: 'rgba(255,255,255,0.12)' }}
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Team At Scale
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Strength in <span style={{ color: CORAL }}>numbers.</span>
              </h2>
              <div className="w-10 h-[3px] rounded mx-auto mb-4" style={{ background: CORAL }} />
              <p className="text-white/40 max-w-lg mx-auto text-sm">
                A 364+ strong organization led by industry veterans — delivering excellence from concept to commissioning since 1998.
              </p>
            </div>
          </FadeIn>

          {/* Stats grid — single coral palette */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teamStats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="relative rounded-2xl border p-6 md:p-8 text-center group transition-colors duration-300 overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  {/* Coral top accent bar */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-b-full" style={{ background: CORAL }} />
                  {/* Coral icon tile */}
                  <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(232,117,26,0.18)' }}>
                    <stat.icon className="w-7 h-7" style={{ color: CORAL }} />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-white/50 text-sm font-medium">{stat.label}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5: ORGANIZATIONAL CAPABILITIES — navy→coral hover
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Circuit-board grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(90deg, ${NAVY_MID} 1px, transparent 1px), linear-gradient(${NAVY_MID} 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <Badge
                variant="outline"
                className="rounded-full px-3 py-0.5 text-xs font-semibold mb-4"
                style={{ borderColor: 'rgba(232,117,26,0.30)', color: CORAL }}
              >
                Capabilities
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: INK }}>
                Built in-house. <span style={{ color: CORAL }}>No outsourcing.</span>
              </h2>
              <div className="section-bar mx-auto mb-4" />
              <p className="max-w-xl mx-auto text-sm" style={{ color: SLATE }}>
                Every capability below is delivered by our own team — ensuring quality, speed, and accountability from concept to commissioning.
              </p>
            </div>
          </FadeIn>

          {/* Capabilities grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {capabilities.map((cap, i) => (
              <FadeIn key={cap.label} delay={i * 0.06}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                  <div className="relative rounded-2xl p-5 md:p-6 h-full group transition-all duration-300 border" style={{ background: LIGHT_BG, borderColor: 'transparent' }}>
                    {/* Faded index */}
                    <span className="absolute top-4 right-5 text-3xl font-black leading-none select-none transition-colors duration-300 group-hover:text-opacity-20" style={{ color: NAVY_MID, opacity: 0.10 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {/* Navy icon tile → swaps to coral on hover */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105" style={{ background: NAVY_MID }}>
                      <cap.icon className="w-6 h-6 text-white transition-colors duration-300 group-hover:text-white" />
                    </div>
                    <h3 className="text-sm font-bold mb-1" style={{ color: INK }}>{cap.label}</h3>
                    <p className="text-[11px] font-medium" style={{ color: '#9CA3AF' }}>{cap.sub}</p>
                    {/* Hover coral dot */}
                    <motion.div
                      className="absolute bottom-3 left-5 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: CORAL }}
                    />
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          {/* Central connecting message */}
          <FadeIn delay={0.4}>
            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-3 rounded-full px-6 py-3 border" style={{ background: 'rgba(27,58,92,0.04)', borderColor: 'rgba(27,58,92,0.10)' }}>
                <CheckCircle2 className="w-4 h-4" style={{ color: CORAL }} />
                <span className="text-sm font-medium" style={{ color: '#374151' }}>
                  All capabilities are <strong style={{ color: NAVY_MID }}>in-house</strong> — ensuring quality, speed, and accountability
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6: CTA — navy bg with coral arcs (NOT coral gradient)
          ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-24" style={{ background: `linear-gradient(135deg, ${NAVY_DEEP} 0%, ${NAVY_MID} 50%, ${NAVY_DEEP} 100%)` }}>
        {/* Coral arcs (concentric) */}
        <svg className="absolute -top-40 -right-40 w-[500px] h-[500px] opacity-[0.10]" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="240" stroke={CORAL} strokeWidth="1" fill="none" />
          <circle cx="250" cy="250" r="190" stroke={CORAL} strokeWidth="0.8" fill="none" />
          <circle cx="250" cy="250" r="140" stroke={CORAL} strokeWidth="0.6" fill="none" />
          <circle cx="250" cy="250" r="90" stroke={CORAL} strokeWidth="0.5" fill="none" />
        </svg>
        <svg className="absolute -bottom-40 -left-40 w-[420px] h-[420px] opacity-[0.08]" viewBox="0 0 420 420">
          <circle cx="210" cy="210" r="200" stroke={CORAL} strokeWidth="0.8" fill="none" />
          <circle cx="210" cy="210" r="150" stroke={CORAL} strokeWidth="0.6" fill="none" />
        </svg>
        {/* Coral ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: 'rgba(232,117,26,0.06)' }} />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* LEFT — headline + CTAs */}
            <div className="lg:col-span-7">
              <FadeIn>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(232,117,26,0.18)' }}>
                  <Briefcase className="w-7 h-7" style={{ color: CORAL }} />
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <Badge
                  className="rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-5 border"
                  style={{ background: 'rgba(232,117,26,0.15)', color: CORAL, borderColor: 'rgba(232,117,26,0.30)' }}
                >
                  Careers
                </Badge>
              </FadeIn>
              <FadeIn delay={0.2}>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                  Join our team.
                </h2>
              </FadeIn>
              <FadeIn delay={0.3}>
                <p className="text-white/55 text-base md:text-lg mb-8 max-w-xl leading-relaxed">
                  Be part of a 364+ strong team that&apos;s powering India&apos;s infrastructure. We offer challenging projects, growth opportunities, and a culture of excellence.
                </p>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button
                    onClick={() => navigate('careers')}
                    className="rounded-xl px-8 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{ background: CORAL, color: '#FFFFFF' }}
                  >
                    View Open Positions
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    onClick={() => navigate('about')}
                    variant="outline"
                    className="rounded-xl px-8 h-12 text-base font-semibold backdrop-blur-sm transition-all duration-300 border-white/25 text-white hover:bg-white/10"
                  >
                    Learn About SVEPL
                  </Button>
                </div>
              </FadeIn>
            </div>

            {/* RIGHT — glassmorphic Quick Facts card */}
            <div className="lg:col-span-5">
              <FadeIn delay={0.3}>
                <div
                  className="rounded-3xl border backdrop-blur-xl p-7 md:p-8"
                  style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.10)' }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(232,117,26,0.20)' }}>
                      <Globe className="w-4 h-4" style={{ color: CORAL }} />
                    </div>
                    <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">Quick Facts</span>
                  </div>
                  <div className="grid grid-cols-2 gap-5 mb-6">
                    {quickFacts.map((q) => (
                      <div key={q.label}>
                        <div className="text-3xl font-bold mb-1" style={{ color: CORAL }}>{q.value}</div>
                        <div className="text-xs text-white/45 font-medium">{q.label}</div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => navigate('contact')}
                    variant="outline"
                    className="w-full rounded-xl h-11 text-sm font-semibold border-white/20 text-white hover:bg-white/10"
                  >
                    Talk to our team
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
