'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  UserCircle, Linkedin, Mail, ChevronRight, ArrowRight, Users, Award,
  Target, Briefcase, Zap, Shield, Sun, Cpu, Wrench, FileCheck,
  Building2, Network, LayoutGrid, Clock, TrendingUp, Globe,
  Lightbulb, Handshake, ChevronDown, CheckCircle2, Sparkles, Star,
  PenTool, Hammer, FlaskConical, BarChart3, Factory, RefreshCw,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/components/Router'

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

/* ─── Leadership data ─── */
const leaders = [
  {
    name: 'Mr. Rengarajan',
    designation: 'Managing Director',
    responsibility: 'Design / Marketing / Liaisoning',
    experience: 38,
    initials: 'R',
    gradient: 'from-[#efefef] to-[#2A5F8F]',
    accent: '#efefef',
    accentLight: 'rgba(27,58,92,0.10)',
    accentMid: 'rgba(27,58,92,0.20)',
    borderColor: 'border-[#334155]',
    badgeBg: 'bg-[#455a64]/10',
    badgeText: 'text-[#37474f]',
    barGradient: 'from-[#efefef] to-[#3B6FA0]',
  },
  {
    name: 'Mr. Sivagami Nathan',
    designation: 'Executive Director',
    responsibility: 'Administration / Finance / Tendering',
    experience: 45,
    initials: 'SN',
    gradient: 'from-[#E8751A] to-[#F59E0B]',
    accent: '#E8751A',
    accentLight: 'rgba(232,117,26,0.10)',
    accentMid: 'rgba(232,117,26,0.20)',
    borderColor: 'border-[#E8751A]',
    badgeBg: 'bg-[#E8751A]/10',
    badgeText: 'text-[#E8751A]',
    barGradient: 'from-[#E8751A] to-[#F59E0B]',
  },
  {
    name: 'Mr. Rakesh Kumar',
    designation: 'Operations Director',
    responsibility: 'Operations',
    experience: 10,
    initials: 'RK',
    gradient: 'from-[#0D9488] to-[#2DD4BF]',
    accent: '#0D9488',
    accentLight: 'rgba(13,148,136,0.10)',
    accentMid: 'rgba(13,148,136,0.20)',
    borderColor: 'border-[#0D9488]',
    badgeBg: 'bg-[#0D9488]/10',
    badgeText: 'text-[#0D9488]',
    barGradient: 'from-[#0D9488] to-[#2DD4BF]',
  },
  {
    name: 'Mr. Ambalarajan',
    designation: 'Director - Projects',
    responsibility: 'Project Execution / Renewable Energy',
    experience: 15,
    initials: 'A',
    gradient: 'from-[#2A5A8A] to-[#34D399]',
    accent: '#2A5A8A',
    accentLight: 'rgba(5,150,105,0.10)',
    accentMid: 'rgba(5,150,105,0.20)',
    borderColor: 'border-[#2A5A8A]',
    badgeBg: 'bg-[#2A5A8A]/10',
    badgeText: 'text-[#2A5A8A]',
    barGradient: 'from-[#2A5A8A] to-[#34D399]',
  },
  {
    name: 'Mr. Anand Purushothaman',
    designation: 'Technical Director',
    responsibility: 'Design / Marketing / Project Execution',
    experience: 35,
    initials: 'AP',
    gradient: 'from-[#7C3AED] to-[#A78BFA]',
    accent: '#7C3AED',
    accentLight: 'rgba(124,58,237,0.10)',
    accentMid: 'rgba(124,58,237,0.20)',
    borderColor: 'border-[#7C3AED]',
    badgeBg: 'bg-[#7C3AED]/10',
    badgeText: 'text-[#7C3AED]',
    barGradient: 'from-[#7C3AED] to-[#A78BFA]',
  },
  {
    name: 'Mr. Manjari',
    designation: 'Project Director',
    responsibility: 'EHV Projects',
    experience: 40,
    initials: 'M',
    gradient: 'from-[#D97706] to-[#FBBF24]',
    accent: '#D97706',
    accentLight: 'rgba(217,119,6,0.10)',
    accentMid: 'rgba(217,119,6,0.20)',
    borderColor: 'border-[#D97706]',
    badgeBg: 'bg-[#D97706]/10',
    badgeText: 'text-[#D97706]',
    barGradient: 'from-[#D97706] to-[#FBBF24]',
  },
]

/* ─── Philosophy data ─── */
const philosophyItems = [
  {
    icon: Cpu,
    title: 'In-House Expertise',
    description: 'Design and Engineering completely in-house — from concept to detailed engineering, every drawing and calculation is handled by our own team of specialists.',
    accent: '#efefef',
  },
  {
    icon: Award,
    title: 'Industry Veterans',
    description: 'Combined 180+ years of leadership experience across all domains — EHV projects, manufacturing, operations, finance, and renewable energy.',
    accent: '#E8751A',
  },
  {
    icon: Handshake,
    title: 'Client First Approach',
    description: 'Fast decision making and flexible team principles — our lean organizational structure ensures rapid response times and personalized service for every client.',
    accent: '#0D9488',
  },
]

/* ─── Stats data ─── */
const teamStats = [
  { value: 364, suffix: '+', label: 'Team Members', icon: Users, color: '#E8751A' },
  { value: 180, suffix: '+', label: 'Combined Years of Leadership', icon: Clock, color: '#F59E0B' },
  { value: 6, suffix: '', label: 'Directors', icon: Briefcase, color: '#0D9488' },
  { value: 8, suffix: '', label: 'Branch Offices', icon: Building2, color: '#7C3AED' },
]

/* ─── Capabilities data ─── */
const capabilities = [
  { icon: PenTool, label: 'Design Engineering', sub: 'In-House', accent: '#efefef' },
  { icon: Factory, label: 'Manufacturing', sub: '20,000 sq ft Guindy', accent: '#E8751A' },
  { icon: Hammer, label: 'Project Execution', sub: 'Up to 400KV', accent: '#0D9488' },
  { icon: FlaskConical, label: 'Testing & Commissioning', sub: 'All Voltages', accent: '#2A5A8A' },
  { icon: Shield, label: 'AMC Services', sub: 'Industrial & Commercial', accent: '#7C3AED' },
  { icon: Sun, label: 'Solar EPC', sub: 'Rooftop & Ground Mount', accent: '#D97706' },
  { icon: FileCheck, label: 'CEIG/CEA Liaison', sub: '2000+ Approvals', accent: '#efefef' },
  { icon: Network, label: 'Utility Liaison', sub: '10+ State Boards', accent: '#E8751A' },
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
          SECTION 1: HERO — Full-width navy gradient with floating elements
          ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[85vh] min-h-[540px] overflow-hidden flex items-center justify-center">
        <motion.div style={{ y: heroY }} className="absolute inset-0 bg-[#0C2340]">
          {/* Diagonal line pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              #fff 40px,
              #fff 41px
            )`,
          }} />
          {/* Radial gradient overlay */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at 30% 40%, rgba(232,117,26,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 65%, rgba(13,148,136,0.08) 0%, transparent 45%), #37474f',
          }} />
          {/* Floating accent orbs */}
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[15%] right-[10%] w-64 h-64 rounded-full bg-[#E8751A]/[0.06] blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[20%] left-[8%] w-80 h-80 rounded-full bg-[#0D9488]/[0.05] blur-3xl"
          />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[50%] right-[30%] w-48 h-48 rounded-full bg-[#7C3AED]/[0.04] blur-3xl"
          />

          {/* Decorative SVG shapes */}
          <svg className="absolute top-[12%] left-[5%] w-48 h-48 opacity-[0.04]" viewBox="0 0 200 200">
            <polygon points="100,20 180,80 150,170 50,170 20,80" stroke="#E8751A" strokeWidth="1" fill="none" />
            <polygon points="100,45 155,85 135,145 65,145 45,85" stroke="#E8751A" strokeWidth="0.5" fill="none" />
          </svg>
          <svg className="absolute bottom-[15%] right-[8%] w-36 h-36 opacity-[0.04]" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="55" stroke="#fff" strokeWidth="0.8" fill="none" />
            <circle cx="70" cy="70" r="35" stroke="#fff" strokeWidth="0.5" fill="none" />
            <line x1="70" y1="15" x2="70" y2="125" stroke="#fff" strokeWidth="0.4" />
            <line x1="15" y1="70" x2="125" y2="70" stroke="#fff" strokeWidth="0.4" />
          </svg>

          {/* Floating team-related icons */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[25%] left-[15%] opacity-[0.06]"
          >
            <Users className="w-12 h-12 text-white" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[30%] right-[15%] opacity-[0.06]"
          >
            <Award className="w-10 h-10 text-white" />
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-5 max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center gap-2 text-sm text-white/40 mb-8"
          >
            <button onClick={() => navigate('home')} className="hover:text-white/70 transition-colors">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button onClick={() => navigate('about')} className="hover:text-white/70 transition-colors">Company</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/70">Team</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Badge className="bg-[#E8751A]/15 text-[#E8751A] border border-[#E8751A]/25 rounded-full px-5 py-1.5 text-sm font-medium mb-6">
              <Users className="w-3.5 h-3.5 mr-1.5" />
              Our Leadership
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-5 tracking-tight"
          >
            Leadership That{' '}
            <span className="bg-gradient-to-r from-[#E8751A] to-[#F59E0B] bg-clip-text text-transparent">
              Powers Excellence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg sm:text-xl text-white/50 font-light mb-4 tracking-wide"
          >
            180+ Years of Combined Experience Driving India&apos;s Power Infrastructure
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-sm md:text-base text-white/35 max-w-2xl mx-auto leading-relaxed"
          >
            Meet the visionaries behind SVEPL&apos;s 29-year journey — from managing EHV projects
            to pioneering renewable energy solutions across South India.
          </motion.p>

          {/* Quick leader badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {leaders.slice(0, 4).map((l) => (
              <div key={l.name} className="flex items-center gap-2 bg-white/[0.06] backdrop-blur-sm rounded-full pl-1 pr-3 py-1 border border-white/[0.08]">
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${l.gradient} flex items-center justify-center`}>
                  <span className="text-[10px] font-bold text-white">{l.initials}</span>
                </div>
                <span className="text-sm text-white/60 font-medium">{l.name.replace('Mr. ', '')}</span>
              </div>
            ))}
            <div className="flex items-center gap-1 bg-white/[0.06] backdrop-blur-sm rounded-full px-3 py-1 border border-white/[0.08]">
              <span className="text-sm text-white/50 font-medium">+2 More</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-sm uppercase tracking-[0.2em]">Explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="w-5 h-5 text-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2: LEADERSHIP GRID — 6 cards with unique accents
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#F8FAFB] relative overflow-hidden">
        {/* Decorative background pattern — hexagonal dots */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #efefef 1.5px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#455a64]/[0.02] rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E8751A]/[0.02] rounded-full translate-y-1/2 -translate-x-1/3" />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <Badge variant="outline" className="border-[#334155]/20 text-[#37474f] rounded-full px-3 py-0.5 text-sm font-semibold mb-4">
                Our Directors
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">
                Meet the <span className="text-[#37474f]">Leadership</span>
              </h2>
              <div className="section-bar mx-auto mb-4" />
              <p className="text-[#546e7a] max-w-xl mx-auto text-sm">
                Six seasoned professionals with deep expertise across electrical engineering, operations, finance, and renewable energy — steering SVEPL&apos;s growth since 1998.
              </p>
            </div>
          </FadeIn>

          {/* Leadership cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaders.map((leader, i) => (
              <FadeIn key={leader.name} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                  <Card className={`bg-white rounded-2xl border ${leader.borderColor} border-l-[3px] shadow-sm hover:shadow-xl transition-shadow duration-400 h-full overflow-hidden`}>
                    <CardContent className="p-6">
                      {/* Top row: Avatar + Name/Designation */}
                      <div className="flex items-start gap-4 mb-5">
                        {/* Avatar circle with gradient */}
                        <div className="relative flex-shrink-0">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${leader.gradient} flex items-center justify-center shadow-lg`}>
                            <span className="text-xl font-bold text-white">{leader.initials}</span>
                          </div>
                          {/* Experience badge */}
                          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center">
                            <span className="text-[9px] font-bold" style={{ color: leader.accent }}>{leader.experience}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-[#1A1A2E] leading-tight mb-1 truncate">{leader.name}</h3>
                          <Badge className={`${leader.badgeBg} ${leader.badgeText} border-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold`}>
                            {leader.designation}
                          </Badge>
                        </div>
                      </div>

                      {/* Responsibility */}
                      <div className="mb-4">
                        <p className="text-sm text-[#9CA3AF] uppercase tracking-wider mb-1 font-medium">Responsibility</p>
                        <p className="text-sm text-[#374151] font-medium">{leader.responsibility}</p>
                      </div>

                      {/* Experience bar */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-[#9CA3AF] font-medium">Experience</span>
                          <span className="text-sm font-bold" style={{ color: leader.accent }}>{leader.experience}+ Years</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(leader.experience / 50) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                            className={`h-full rounded-full bg-gradient-to-r ${leader.barGradient}`}
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-[#546e7a] hover:text-[#37474f] text-sm h-8 rounded-lg"
                          onClick={() => window.open('https://linkedin.com', '_blank')}
                        >
                          <Linkedin className="w-3.5 h-3.5 mr-1.5" />
                          LinkedIn
                        </Button>
                        <div className="w-px h-5 bg-gray-100" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-[#546e7a] hover:text-[#37474f] text-sm h-8 rounded-lg"
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
          SECTION 3: LEADERSHIP PHILOSOPHY — Horizontal banner
          ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#37474f' }}>
        {/* Decorative pattern — overlapping circles */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        {/* Accent diagonal stripe */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.06]" style={{
          background: 'repeating-#37474f',
        }} />
        <div className="absolute top-[20%] right-[5%] w-72 h-72 rounded-full bg-[#E8751A]/[0.04] blur-3xl" />
        <div className="absolute bottom-[10%] left-[10%] w-60 h-60 rounded-full bg-[#0D9488]/[0.04] blur-3xl" />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-16 md:py-20 relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <Badge className="bg-white/10 text-white/80 border border-white/10 rounded-full px-4 py-1 text-sm font-semibold mb-4">
                <Sparkles className="w-3 h-3 mr-1.5" />
                Our Philosophy
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                How We Lead
              </h2>
              <div className="w-10 h-[3px] bg-[#E8751A] rounded mx-auto mb-4" />
              <p className="text-white/40 max-w-lg mx-auto text-sm">
                Three core principles that define our leadership approach and drive our organizational culture.
              </p>
            </div>
          </FadeIn>

          {/* Three philosophy cards — horizontal layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {philosophyItems.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                  <div className="bg-white/[0.07] backdrop-blur-sm rounded-2xl border border-white/[0.10] p-6 md:p-8 h-full group hover:bg-white/[0.10] transition-colors duration-300">
                    {/* Icon with accent glow */}
                    <div className="relative mb-6">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.accent}20` }}>
                        <item.icon className="w-7 h-7" style={{ color: item.accent }} />
                      </div>
                      {/* Connecting dot */}
                      <div className="absolute -bottom-3 left-7 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.accent }} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                    {/* Bottom accent line */}
                    <div className="mt-6 h-0.5 w-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: item.accent }} />
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4: TEAM STATS — Dark background with animated counters
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: '#37474f' }}>
        {/* Background texture — subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: '#37474f, #37474f',
          backgroundSize: '60px 60px',
        }} />
        {/* Accent glow */}
        <div className="absolute top-[20%] left-[-5%] w-96 h-96 rounded-full bg-[#E8751A]/[0.04] blur-3xl" />
        <div className="absolute bottom-[10%] right-[-5%] w-80 h-80 rounded-full bg-[#0D9488]/[0.04] blur-3xl" />

        {/* Decorative corner brackets */}
        <svg className="absolute top-6 left-6 w-16 h-16 opacity-[0.08]" viewBox="0 0 60 60">
          <path d="M0 20 L0 0 L20 0" stroke="#E8751A" strokeWidth="2" fill="none" />
        </svg>
        <svg className="absolute bottom-6 right-6 w-16 h-16 opacity-[0.08]" viewBox="0 0 60 60">
          <path d="M60 40 L60 60 L40 60" stroke="#E8751A" strokeWidth="2" fill="none" />
        </svg>

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <Badge className="bg-white/10 text-white/70 border border-white/10 rounded-full px-3 py-0.5 text-sm font-semibold mb-4">
                <TrendingUp className="w-3 h-3 mr-1" />
                Team At Scale
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Strength in <span className="text-[#E8751A]">Numbers</span>
              </h2>
              <div className="w-10 h-[3px] bg-[#E8751A] rounded mx-auto mb-4" />
              <p className="text-white/40 max-w-lg mx-auto text-sm">
                A 364+ strong organization led by industry veterans — delivering excellence from concept to commissioning since 1998.
              </p>
            </div>
          </FadeIn>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teamStats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-white/[0.05] backdrop-blur-sm rounded-2xl border border-white/[0.08] p-6 md:p-8 text-center group hover:bg-white/[0.08] transition-colors duration-300"
                >
                  <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                    <stat.icon className="w-7 h-7" style={{ color: stat.color }} />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-white/50 text-sm font-medium">{stat.label}</p>
                  {/* Bottom accent line */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '40%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                    className="h-0.5 rounded-full mx-auto mt-4"
                    style={{ backgroundColor: stat.color }}
                  />
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5: ORGANIZATIONAL CAPABILITIES — Hexagonal/circular grid
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Decorative pattern — circuit-board lines */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            #37474f,
            #37474f
          `,
          backgroundSize: '80px 80px',
        }} />
        {/* Decorative hexagon shapes */}
        <svg className="absolute top-[5%] right-[3%] w-32 h-32 opacity-[0.04]" viewBox="0 0 120 120">
          <polygon points="60,10 110,35 110,85 60,110 10,85 10,35" stroke="#efefef" strokeWidth="1" fill="none" />
        </svg>
        <svg className="absolute bottom-[8%] left-[5%] w-24 h-24 opacity-[0.04]" viewBox="0 0 120 120">
          <polygon points="60,10 110,35 110,85 60,110 10,85 10,35" stroke="#E8751A" strokeWidth="1" fill="none" />
        </svg>

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <Badge variant="outline" className="border-[#E8751A]/30 text-[#E8751A] rounded-full px-3 py-0.5 text-sm font-semibold mb-4">
                <Target className="w-3 h-3 mr-1" />
                Capabilities
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">
                End-to-End <span className="text-[#37474f]">Under One Roof</span>
              </h2>
              <div className="section-bar mx-auto mb-4" />
              <p className="text-[#546e7a] max-w-xl mx-auto text-sm">
                From design engineering to CEIG approvals, our comprehensive capabilities ensure seamless project delivery — no outsourcing, no gaps.
              </p>
            </div>
          </FadeIn>

          {/* Capabilities hexagonal grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {capabilities.map((cap, i) => (
              <FadeIn key={cap.label} delay={i * 0.06}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                  <div className="relative bg-[#eceff1] rounded-2xl p-5 md:p-6 text-center h-full group hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100">
                    {/* Hexagonal icon frame */}
                    <div className="relative mx-auto mb-4 w-16 h-16">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 64">
                        <polygon
                          points="32,4 58,18 58,46 32,60 6,46 6,18"
                          fill={`${cap.accent}10`}
                          stroke={cap.accent}
                          strokeWidth="1.5"
                          className="transition-all duration-300 group-hover:fill-opacity-20"
                          style={{ fillOpacity: 0.1 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <cap.icon className="w-6 h-6 transition-colors duration-300" style={{ color: cap.accent }} />
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-[#1A1A2E] mb-1 group-hover:text-[#37474f] transition-colors">{cap.label}</h3>
                    <p className="text-[11px] text-[#9CA3AF] font-medium">{cap.sub}</p>
                    {/* Hover accent dot */}
                    <motion.div
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ backgroundColor: cap.accent }}
                    />
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          {/* Central connecting message */}
          <FadeIn delay={0.4}>
            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-3 bg-[#455a64]/[0.04] rounded-full px-6 py-3 border border-[#334155]/[0.08]">
                <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                <span className="text-sm text-[#374151] font-medium">All capabilities are <strong className="text-[#37474f]">in-house</strong> — ensuring quality, speed, and accountability</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6: CTA — Join Our Team
          ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-24" style={{ background: '#37474f' }}>
        {/* Decorative pattern — sunburst rays */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: `repeating-conic-gradient(from 0deg at 50% 120%, #fff 0deg 1.5deg, transparent 1.5deg 15deg)`,
        }} />
        {/* Floating shapes */}
        <div className="absolute top-[15%] left-[10%] w-40 h-40 rounded-full bg-white/[0.06] blur-2xl" />
        <div className="absolute bottom-[20%] right-[8%] w-56 h-56 rounded-full bg-white/[0.04] blur-3xl" />
        {/* Corner accent */}
        <svg className="absolute top-0 right-0 w-32 h-32 opacity-[0.08]" viewBox="0 0 120 120">
          <path d="M120 0 L120 40 L80 0 Z" fill="#fff" />
        </svg>

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20"
              >
                <Users className="w-10 h-10 text-white" />
              </motion.div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Join Our Team
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-white/70 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Be part of a 364+ strong team that&apos;s powering India&apos;s infrastructure.
                We offer challenging projects, growth opportunities, and a culture of excellence.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={() => navigate('contact')}
                  className="bg-white text-[#E8751A] hover:bg-white/90 font-semibold rounded-xl px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  View Open Positions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={() => navigate('about')}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl px-8 h-12 text-base backdrop-blur-sm transition-all duration-300"
                >
                  Learn About SVEPL
                </Button>
              </div>
            </FadeIn>

            {/* Mini stats row */}
            <FadeIn delay={0.4}>
              <div className="flex flex-wrap justify-center gap-6 mt-10">
                {[
                  { label: '29+ Years', icon: Clock },
                  { label: '364+ Team', icon: Users },
                  { label: '8 Offices', icon: Building2 },
                  { label: '6 Countries', icon: Globe },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-white/60">
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
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
