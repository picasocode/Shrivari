'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  Linkedin, Mail, ChevronRight, ArrowRight, Users, Award,
  Briefcase, Shield, Sun, Cpu, FileCheck,
  Building2, Network, Clock, TrendingUp, Globe,
  Handshake, ChevronDown, CheckCircle2,
  PenTool, Hammer, FlaskConical, Factory,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/components/Router'

/* ─── Brand Tokens (strictly navy + coral, 2 colors only) ─── */
const NAVY_DEEP = '#0C2340'
const NAVY = '#152D4F'
const NAVY_MID = '#1B3A5C'
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
function AnimatedCounter({ value, suffix = '', duration = 2000 }: { value: number; suffix?: string; duration?: number }) {
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

  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>
}

/* ─── Leadership data ─── */
const leaders = [
  { name: 'Mr. Rengarajan', designation: 'Managing Director', responsibility: 'Design / Marketing / Liaisoning', experience: 38, initials: 'R' },
  { name: 'Mr. Sivagami Nathan', designation: 'Executive Director', responsibility: 'Administration / Finance / Tendering', experience: 45, initials: 'SN' },
  { name: 'Mr. Rakesh Kumar', designation: 'Operations Director', responsibility: 'Operations', experience: 10, initials: 'RK' },
  { name: 'Mr. Ambalarajan', designation: 'Director - Projects', responsibility: 'Project Execution / Renewable Energy', experience: 15, initials: 'A' },
  { name: 'Mr. Anand Purushothaman', designation: 'Technical Director', responsibility: 'Design / Marketing / Project Execution', experience: 35, initials: 'AP' },
  { name: 'Mr. Manjari', designation: 'Project Director', responsibility: 'EHV Projects', experience: 40, initials: 'M' },
]

/* ─── Philosophy data ─── */
const philosophyItems = [
  { icon: Cpu, title: 'In-House Expertise', description: 'Design and Engineering completely in-house — from concept to detailed engineering, every drawing and calculation is handled by our own team of specialists.' },
  { icon: Award, title: 'Industry Veterans', description: 'Combined 180+ years of leadership experience across all domains — EHV projects, manufacturing, operations, finance, and renewable energy.' },
  { icon: Handshake, title: 'Client First Approach', description: 'Fast decision making and flexible team principles — our lean organizational structure ensures rapid response times and personalized service for every client.' },
]

/* ─── Stats data ─── */
const teamStats = [
  { value: 364, suffix: '+', label: 'Team Members', icon: Users },
  { value: 180, suffix: '+', label: 'Years Combined', icon: Clock },
  { value: 6, suffix: '', label: 'Directors', icon: Briefcase },
  { value: 8, suffix: '', label: 'Branch Offices', icon: Building2 },
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

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          SECTION 1: HERO — Clean editorial, navy bg, coral hairline only
          ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, ${NAVY_MID} 50%, ${NAVY} 100%)` }}>
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }} />
          {/* Single subtle navy glow (no coral orbs) */}
          <div className="absolute top-[10%] right-[5%] w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
        </motion.div>

        {/* Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1280px] mx-auto px-5 lg:px-8 pt-[100px] pb-20 md:pb-28">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-2 text-sm text-white/40 mb-12"
          >
            <button onClick={() => navigate('home')} className="hover:text-white/70 transition-colors">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button onClick={() => navigate('about')} className="hover:text-white/70 transition-colors">Company</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/70">Team</span>
          </motion.div>

          {/* Centered editorial headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.05]">
              Leadership that
              <br />
              <span style={{ color: CORAL }}>powers excellence.</span>
            </h1>

            {/* Coral hairline divider — the ONLY coral element in hero */}
            <div className="w-16 h-[2px] mb-6" style={{ background: CORAL }} />

            <p className="text-lg sm:text-xl text-white/55 font-light mb-3 max-w-xl leading-relaxed">
              180+ years of combined experience driving India&apos;s power infrastructure.
            </p>

            <p className="text-sm md:text-base text-white/40 max-w-xl leading-relaxed mb-8">
              Meet the visionaries behind SVEPL&apos;s 29-year journey — from managing EHV projects to pioneering renewable energy solutions across South India.
            </p>
          </motion.div>

          {/* Stats row — clean, no colored tiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl"
          >
            {[
              { value: 6, suffix: '', label: 'Directors' },
              { value: 180, suffix: '+', label: 'Years Combined' },
              { value: 364, suffix: '+', label: 'Team Members' },
              { value: 29, suffix: '+', label: 'Years of Trust' },
            ].map((s, i) => (
              <div key={s.label} className={i > 0 ? 'md:border-l md:border-white/10 md:pl-6' : ''}>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-white/45 font-medium uppercase tracking-wider">{s.label}</div>
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
          <span className="text-white/30 text-xs uppercase tracking-[0.2em]">Explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="w-5 h-5 text-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2: LEADERSHIP GRID — clean white cards, navy accents
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: LIGHT_BG }}>
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: NAVY_MID }}>Our Directors</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight" style={{ color: INK }}>
                Six directors. One mission.
              </h2>
              <p className="max-w-xl text-sm" style={{ color: SLATE }}>
                Six seasoned professionals with deep expertise across electrical engineering, operations, finance, and renewable energy — steering SVEPL&apos;s growth since 1998.
              </p>
            </div>
          </FadeIn>

          {/* Leadership cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaders.map((leader, i) => (
              <FadeIn key={leader.name} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                  <Card className="relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-400 h-full overflow-hidden">
                    {/* Navy left border (2px) — the only color accent on card */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: NAVY_MID }} />
                    {/* Faded index number */}
                    <span className="absolute top-5 right-6 text-5xl font-black leading-none select-none text-slate-100">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <CardContent className="p-6 pl-7">
                      {/* Top row: Avatar + Name/Designation */}
                      <div className="flex items-start gap-4 mb-5">
                        {/* Avatar — navy */}
                        <div className="relative flex-shrink-0">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center"
                            style={{ background: NAVY_MID }}
                          >
                            <span className="text-xl font-bold text-white">{leader.initials}</span>
                          </div>
                          {/* Experience badge — coral, small */}
                          <div
                            className="absolute -bottom-1 -right-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold shadow-sm"
                            style={{ background: CORAL, color: '#FFFFFF' }}
                          >
                            {leader.experience}y
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold leading-tight mb-1.5 truncate" style={{ color: INK }}>{leader.name}</h3>
                          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: SLATE }}>
                            {leader.designation}
                          </p>
                        </div>
                      </div>

                      {/* Responsibility */}
                      <div className="mb-5">
                        <p className="text-[10px] uppercase tracking-wider mb-1 font-medium text-slate-400">Responsibility</p>
                        <p className="text-sm font-medium" style={{ color: '#374151' }}>{leader.responsibility}</p>
                      </div>

                      {/* Experience bar — navy only */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-medium text-slate-400">Experience</span>
                          <span className="text-sm font-bold" style={{ color: NAVY_MID }}>{leader.experience}+ Years</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(leader.experience / 50) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: NAVY_MID }}
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-xs h-8 rounded-lg text-slate-500 hover:text-slate-700"
                          onClick={() => window.open('https://linkedin.com', '_blank')}
                        >
                          <Linkedin className="w-3.5 h-3.5 mr-1.5" />
                          LinkedIn
                        </Button>
                        <div className="w-px h-5 bg-slate-100" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-xs h-8 rounded-lg text-slate-500 hover:text-slate-700"
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
          SECTION 3: LEADERSHIP PHILOSOPHY — navy bg, white cards
          ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${NAVY_DEEP} 0%, ${NAVY} 60%, ${NAVY_DEEP} 100%)` }}>
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-16 md:py-20 relative z-10">
          <FadeIn>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Our Philosophy</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">How We Lead</h2>
              <p className="text-white/40 max-w-lg text-sm">
                Three core principles that define our leadership approach and drive our organizational culture.
              </p>
            </div>
          </FadeIn>

          {/* Three philosophy cards — white icons, coral hairline on hover only */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {philosophyItems.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                  <div className="relative rounded-2xl border p-6 md:p-8 h-full group transition-colors duration-300" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.10)' }}>
                    {/* Faded big index */}
                    <span className="absolute top-5 right-6 text-6xl font-black leading-none select-none text-white/[0.06]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {/* White outline icon — no colored tile */}
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/15">
                      <item.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                    {/* Coral hairline on hover */}
                    <div className="mt-6 h-[2px] w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: CORAL }} />
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4: TEAM STATS — navy bg, clean numbers
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: NAVY_DEEP }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-3 mb-4 justify-center">
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Team At Scale</span>
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">Strength in numbers.</h2>
              <p className="text-white/40 max-w-lg mx-auto text-sm">
                A 364+ strong organization led by industry veterans — delivering excellence from concept to commissioning since 1998.
              </p>
            </div>
          </FadeIn>

          {/* Stats grid — clean, no colored tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {teamStats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.1}>
                <div className="bg-[#0C2340] p-6 md:p-8 text-center h-full">
                  <stat.icon className="w-6 h-6 mx-auto mb-3 text-white/30" strokeWidth={1.5} />
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-white/40 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5: ORGANIZATIONAL CAPABILITIES — clean grid
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: NAVY_MID }}>Capabilities</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight" style={{ color: INK }}>
                Built in-house. No outsourcing.
              </h2>
              <p className="max-w-xl text-sm" style={{ color: SLATE }}>
                Every capability below is delivered by our own team — ensuring quality, speed, and accountability from concept to commissioning.
              </p>
            </div>
          </FadeIn>

          {/* Capabilities grid — Journey-style neutral boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {capabilities.map((cap, i) => (
              <FadeIn key={cap.label} delay={i * 0.06}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                  <div className="relative rounded-2xl p-5 md:p-6 h-full group transition-all duration-300 border-2 border-slate-200 bg-white hover:border-slate-300 hover:shadow-md">
                    {/* Faded index */}
                    <span className="absolute top-4 right-5 text-2xl font-extrabold leading-none select-none text-slate-100">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {/* Navy outline icon */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 border-2" style={{ borderColor: NAVY_MID }}>
                      <cap.icon className="w-6 h-6" style={{ color: NAVY_MID }} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-sm font-bold mb-1" style={{ color: INK }}>{cap.label}</h3>
                    <p className="text-[11px] font-medium text-slate-400">{cap.sub}</p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          {/* Central message */}
          <FadeIn delay={0.4}>
            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-3 rounded-full px-6 py-3 border border-slate-200 bg-slate-50">
                <CheckCircle2 className="w-4 h-4" style={{ color: NAVY_MID }} />
                <span className="text-sm font-medium" style={{ color: '#374151' }}>
                  All capabilities are <strong style={{ color: NAVY_MID }}>in-house</strong> — ensuring quality, speed, and accountability
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6: CTA — navy bg, single coral button
          ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-24" style={{ background: NAVY_DEEP }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-3 mb-6 justify-center">
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Careers</span>
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                Join our team.
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-white/55 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Be part of a 364+ strong team that&apos;s powering India&apos;s infrastructure. We offer challenging projects, growth opportunities, and a culture of excellence.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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

            {/* Mini stats row — clean */}
            <FadeIn delay={0.4}>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-10 pt-8 border-t border-white/10">
                {[
                  { label: '29+ Years', icon: Clock },
                  { label: '364+ Team', icon: Users },
                  { label: '8 Offices', icon: Building2 },
                  { label: '6 Countries', icon: Globe },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-white/50">
                    <item.icon className="w-4 h-4" strokeWidth={1.5} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}
