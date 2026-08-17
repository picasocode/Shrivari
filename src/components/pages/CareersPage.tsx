'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Briefcase, MapPin, Clock, ChevronRight, ArrowRight, Users, TrendingUp,
  GraduationCap, Heart, Zap, Building2, Globe, Award, Target, Send,
  Shield, ChevronDown, Phone, Mail, Sparkles, Lightbulb,
  Hammer, FlaskConical, LayoutGrid,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useRouter } from '@/components/Router'

/* ────────────────────────────────────────────────────────────
   FADE-IN HELPER
   ──────────────────────────────────────────────────────────── */
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

/* ────────────────────────────────────────────────────────────
   DATA
   ──────────────────────────────────────────────────────────── */
const whyJoinData = [
  {
    title: 'Work on Mega Projects',
    desc: 'Be part of 400KV substations, 450MW solar plants, and EHV switchyards that power entire regions. Real infrastructure, real impact.',
    icon: Zap,
    accent: '#E8751A',
    bgAccent: '#FFF7ED',
    stat: '400KV',
    statLabel: 'Max Voltage',
  },
  {
    title: 'In-House Design',
    desc: 'We don\'t outsource engineering. Our design team handles everything from concept to commissioning — giving you real, hands-on experience.',
    icon: Lightbulb,
    accent: '#1B3A5C',
    bgAccent: '#EFF6FF',
    stat: '100%',
    statLabel: 'In-House',
  },
  {
    title: 'Rapid Growth',
    desc: 'With a 23% CAGR and an expanding team, SVEPL offers accelerated career growth. Your ambitions will always find room here.',
    icon: TrendingUp,
    accent: '#0D9488',
    bgAccent: '#F0FDFA',
    stat: '~23%',
    statLabel: 'CAGR',
  },
  {
    title: 'Pan-India Presence',
    desc: '8 branch offices across South India and international projects in 6 countries. Relocation and travel opportunities that broaden your horizons.',
    icon: Globe,
    accent: '#7C3AED',
    bgAccent: '#FAF5FF',
    stat: '8+6',
    statLabel: 'Branches & Countries',
  },
  {
    title: 'Safety First Culture',
    desc: '2000+ CEIG/CEA approvals reflect our unwavering safety commitment. Your well-being is never compromised on any project site.',
    icon: Shield,
    accent: '#DC2626',
    bgAccent: '#FEF2F2',
    stat: '2000+',
    statLabel: 'CEIG/CEA Approvals',
  },
  {
    title: 'Learn from Veterans',
    desc: 'Our leadership brings 180+ years of combined experience. Work alongside industry veterans who mentor the next generation of engineers.',
    icon: GraduationCap,
    accent: '#B45309',
    bgAccent: '#FFFBEB',
    stat: '180+',
    statLabel: 'Yrs Combined Exp',
  },
]

type Department = 'all' | 'Engineering' | 'Operations' | 'Design' | 'Service'

interface JobOpening {
  title: string
  location: string
  experience: string
  department: Department
  type: string
  icon: React.ElementType
}

const jobOpenings: JobOpening[] = [
  {
    title: 'Senior Electrical Engineer',
    location: 'Chennai',
    experience: '5-10 years',
    department: 'Engineering',
    type: 'Full-time',
    icon: Zap,
  },
  {
    title: 'Project Manager — Solar EPC',
    location: 'Bangalore',
    experience: '8-12 years',
    department: 'Operations',
    type: 'Full-time',
    icon: Hammer,
  },
  {
    title: 'Testing & Commissioning Engineer',
    location: 'Hyderabad',
    experience: '3-7 years',
    department: 'Engineering',
    type: 'Full-time',
    icon: FlaskConical,
  },
  {
    title: 'Site Engineer — Transmission Lines',
    location: 'Multiple Locations',
    experience: '2-5 years',
    department: 'Operations',
    type: 'Full-time',
    icon: Building2,
  },
  {
    title: 'Design Engineer — LT/HT Panels',
    location: 'Chennai',
    experience: '3-6 years',
    department: 'Design',
    type: 'Full-time',
    icon: Lightbulb,
  },
  {
    title: 'Liasion Officer — CEIG/TNEB',
    location: 'Chennai',
    experience: '5-10 years',
    department: 'Operations',
    type: 'Full-time',
    icon: Shield,
  },
  {
    title: 'AMC Service Technician',
    location: 'Pondicherry',
    experience: '2-4 years',
    department: 'Service',
    type: 'Full-time',
    icon: Sparkles,
  },
  {
    title: 'Graduate Engineer Trainee',
    location: 'All Branches',
    experience: 'Freshers Welcome',
    department: 'Engineering',
    type: 'Full-time',
    icon: GraduationCap,
  },
]

const departments: { label: string; value: Department }[] = [
  { label: 'All Departments', value: 'all' },
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Operations', value: 'Operations' },
  { label: 'Design', value: 'Design' },
  { label: 'Service', value: 'Service' },
]

const departmentColorMap: Record<string, string> = {
  Engineering: '#1B3A5C',
  Operations: '#E8751A',
  Design: '#7C3AED',
  Service: '#0D9488',
}

/* ────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ──────────────────────────────────────────────────────────── */
export default function CareersPage() {
  const { navigate } = useRouter()
  const [activeDepartment, setActiveDepartment] = useState<Department>('all')

  const filteredJobs = activeDepartment === 'all'
    ? jobOpenings
    : jobOpenings.filter(j => j.department === activeDepartment)

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          SECTION 1: HERO — Full-width with animated graph/arrow
          ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(160deg, #0C2340 0%, #1B3A5C 40%, #152D4F 100%)' }}>
        {/* Animated rising graph SVG in background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }} />

          {/* Animated rising graph arrows */}
          <svg className="absolute bottom-0 left-0 w-full h-full opacity-[0.06]" viewBox="0 0 1200 600" preserveAspectRatio="none">
            <motion.path
              d="M0 550 L200 480 L400 420 L600 340 L800 250 L1000 140 L1200 50"
              stroke="#E8751A"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
            />
            <motion.path
              d="M0 580 L200 530 L400 470 L600 400 L800 320 L1000 220 L1200 100"
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, delay: 0.3, ease: 'easeInOut' }}
            />
            {/* Arrow tip */}
            <motion.path
              d="M1150 70 L1200 50 L1170 30"
              stroke="#E8751A"
              strokeWidth="3"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.12 }}
              transition={{ delay: 2, duration: 0.5 }}
            />
          </svg>

          {/* Glow orbs */}
          <div className="absolute top-[15%] right-[10%] w-80 h-80 rounded-full bg-[#E8751A]/[0.06] blur-3xl" />
          <div className="absolute bottom-[10%] left-[5%] w-96 h-96 rounded-full bg-[#0D9488]/[0.04] blur-3xl" />

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#E8751A]/20 rounded-full"
              style={{ top: `${20 + i * 12}%`, left: `${10 + i * 15}%` }}
              animate={{ y: [-10, 10, -10], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-5 max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center gap-2 text-sm text-white/40 mb-8"
          >
            <button onClick={() => navigate('home')} className="hover:text-white/70 transition-colors">Home</button>
            <ChevronRight className="w-3 h-3" />
            <button onClick={() => navigate('about')} className="hover:text-white/70 transition-colors">Company</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#E8751A]">Careers</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Badge className="bg-[#E8751A]/15 text-[#E8751A] border border-[#E8751A]/25 rounded-full px-5 py-1.5 text-sm font-medium mb-6">
              <Briefcase className="w-3.5 h-3.5 mr-1.5" />
              Join Our Team — 364+ Strong &amp; Growing
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-5 tracking-tight leading-tight"
          >
            Build Your Career,<br />
            <span className="bg-gradient-to-r from-[#E8751A] to-[#F59E0B] bg-clip-text text-transparent">
              Power the Nation
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg md:text-xl text-white/50 font-light max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            From EHV substations to solar mega-projects — at SVEPL, every role powers India&apos;s infrastructure. Discover opportunities that match your ambition.
          </motion.p>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-wrap justify-center gap-6 md:gap-10"
          >
            {[
              { value: '364+', label: 'Team Members', icon: Users },
              { value: '~23%', label: 'CAGR', icon: TrendingUp },
              { value: '8', label: 'Branch Offices', icon: Building2 },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 bg-white/[0.06] backdrop-blur-sm rounded-xl px-5 py-3 border border-white/[0.08]">
                <div className="w-10 h-10 rounded-lg bg-[#E8751A]/15 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-5 h-5 text-[#E8751A]" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-[11px] text-white/40 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mt-10"
          >
            <Button
              onClick={() => {
                const el = document.getElementById('current-openings')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-lg px-7 h-12 text-sm font-semibold transition-colors"
            >
              View Open Positions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => navigate('contact')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-lg px-7 h-12 text-sm font-semibold transition-colors"
            >
              Contact HR
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-white/25 text-xs uppercase tracking-[0.2em]">Explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="w-5 h-5 text-white/25" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2: WHY JOIN SVEPL — 6 benefit cards
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#E8751A]/[0.03] rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1B3A5C]/[0.02] rounded-full translate-y-1/3 -translate-x-1/3" />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <Badge variant="outline" className="border-[#E8751A]/30 text-[#E8751A] rounded-full px-3 py-0.5 text-xs font-semibold mb-4">
                Why SVEPL
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">Why Join Shri Vaari Electricals?</h2>
              <div className="section-bar mx-auto mb-4" />
              <p className="text-[#6B7280] max-w-xl mx-auto text-sm">
                Six compelling reasons why engineers and professionals choose to build their careers with us.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyJoinData.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <Card className="group bg-white rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full card-hover">
                  <CardContent className="p-6">
                    {/* Top: Icon + Stat */}
                    <div className="flex items-start justify-between mb-5">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${item.accent}12` }}
                      >
                        <item.icon className="w-7 h-7" style={{ color: item.accent }} />
                      </motion.div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: item.accent }}>{item.stat}</p>
                        <p className="text-[10px] text-[#9CA3AF] font-medium">{item.statLabel}</p>
                      </div>
                    </div>

                    {/* Accent line */}
                    <div className="w-10 h-1 rounded-full mb-4" style={{ backgroundColor: item.accent }} />

                    {/* Title + Description */}
                    <h3 className="text-lg font-bold text-[#1A1A2E] mb-2 group-hover:translate-x-1 transition-transform duration-300">
                      {item.title}
                    </h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>

                    {/* Bottom decorative element */}
                    <div className="mt-5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.accent }} />
                      <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: `${item.accent}30` }} />
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3: LIFE AT SVEPL — Real office photos
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#F8FAFC] relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-12 md:mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8751A]/10 border border-[#E8751A]/25 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8751A]" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#E8751A] uppercase">Our Culture</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-[#1A1A2E] mb-3 tracking-tight">
                Life at SVEPL
              </h2>
              <p className="text-[#6B7280] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Collaborative reviews, engineering huddles, and a culture of
                mentorship — this is what a day at Shri Vaari looks like.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              { src: '/images/careers/life-1.jpg', caption: 'Project review sessions' },
              { src: '/images/careers/life-2.jpg', caption: 'Engineering huddles' },
              { src: '/images/careers/life-3.jpg', caption: 'Technical walk-throughs' },
            ].map((item, i) => (
              <FadeIn key={item.caption} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-64 md:h-72 overflow-hidden">
                    <img
                      src={item.src}
                      alt={`${item.caption} — Life at SVEPL`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1D3A]/80 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[#1A1A2E] text-xs font-bold tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8751A]" />
                      {item.caption}
                    </span>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4: CURRENT OPENINGS — Filterable job cards
          ═══════════════════════════════════════════════════════ */}
      <section id="current-openings" className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Decorative corner shapes */}
        <svg className="absolute top-0 right-0 w-40 h-40 opacity-[0.03]" viewBox="0 0 160 160">
          <rect x="0" y="0" width="160" height="160" fill="#1B3A5C" />
          <rect x="20" y="20" width="120" height="120" fill="white" />
          <rect x="40" y="40" width="80" height="80" fill="#1B3A5C" />
        </svg>

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-10">
              <Badge variant="outline" className="border-[#E8751A]/30 text-[#E8751A] rounded-full px-3 py-0.5 text-xs font-semibold mb-4">
                <Briefcase className="w-3 h-3 mr-1" />
                Open Positions
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">Current Openings</h2>
              <div className="section-bar mx-auto mb-4" />
              <p className="text-[#6B7280] max-w-xl mx-auto text-sm">
                Find your next role in electrical engineering, project management, design, or service operations.
              </p>
            </div>
          </FadeIn>

          {/* Department Filter */}
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {departments.map((dept) => (
                <button
                  key={dept.value}
                  onClick={() => setActiveDepartment(dept.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeDepartment === dept.value
                      ? 'bg-[#1B3A5C] text-white shadow-md'
                      : 'bg-[#F0F4F8] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#1A1A2E]'
                  }`}
                >
                  {dept.label}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* Job cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job, i) => {
                const deptColor = departmentColorMap[job.department] || '#6B7280'
                return (
                  <motion.div
                    key={job.title}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.97 }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                  >
                    <Card className="group bg-white rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Department icon */}
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${deptColor}10` }}>
                            <job.icon className="w-6 h-6" style={{ color: deptColor }} />
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Title */}
                            <h3 className="text-base font-bold text-[#1A1A2E] mb-2 group-hover:text-[#E8751A] transition-colors">
                              {job.title}
                            </h3>

                            {/* Badges row */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="outline" className="border-[#E5E7EB] text-[#374151] rounded-md px-2.5 py-0.5 text-xs font-medium gap-1">
                                <MapPin className="w-3 h-3 text-[#E8751A]" />
                                {job.location}
                              </Badge>
                              <Badge variant="outline" className="border-[#E5E7EB] text-[#374151] rounded-md px-2.5 py-0.5 text-xs font-medium gap-1">
                                <Clock className="w-3 h-3 text-[#0D9488]" />
                                {job.experience}
                              </Badge>
                              <Badge className="rounded-md px-2.5 py-0.5 text-xs font-semibold border-0" style={{ backgroundColor: `${deptColor}12`, color: deptColor }}>
                                {job.department}
                              </Badge>
                            </div>

                            {/* Bottom row: type + apply button */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-[#9CA3AF] font-medium">{job.type}</span>
                              <Button
                                onClick={() => navigate('contact')}
                                size="sm"
                                className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-md px-4 h-8 text-xs font-semibold transition-colors"
                              >
                                Apply Now
                                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* No results */}
          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-[#D1D5DB] mx-auto mb-3" />
              <p className="text-[#9CA3AF] text-sm">No openings in this department right now. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6: APPLICATION CTA — Contact and apply
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#F0F4F8] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[10%] left-[5%] w-48 h-48 bg-[#E8751A]/[0.04] rounded-full blur-2xl" />
        <div className="absolute bottom-[10%] right-[5%] w-64 h-64 bg-[#1B3A5C]/[0.04] rounded-full blur-2xl" />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <div className="relative bg-white rounded-2xl shadow-xl border border-[#E5E7EB] overflow-hidden">
            {/* Top accent bar */}
            <div className="h-2 bg-gradient-to-r from-[#1B3A5C] via-[#E8751A] to-[#0D9488]" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: CTA content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <FadeIn>
                  <Badge variant="outline" className="border-[#E8751A]/30 text-[#E8751A] rounded-full px-3 py-0.5 text-xs font-semibold mb-4">
                    <Send className="w-3 h-3 mr-1" />
                    Apply Now
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3 leading-snug">
                    Ready to Power<br />
                    <span className="text-[#E8751A]">Your Future?</span>
                  </h2>
                  <div className="section-bar mb-4" />
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-8 max-w-md">
                    Take the next step in your career. Send your resume to our HR team and we&apos;ll connect with you about opportunities that match your skills and aspirations.
                  </p>

                  {/* Contact methods */}
                  <div className="space-y-4 mb-8">
                    <a href="mailto:admin@shrivaarielectricals.com" className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-lg bg-[#E8751A]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#E8751A]/20 transition-colors">
                        <Mail className="w-5 h-5 text-[#E8751A]" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">Email</p>
                        <p className="text-sm font-semibold text-[#1A1A2E] group-hover:text-[#E8751A] transition-colors">admin@shrivaarielectricals.com</p>
                      </div>
                    </a>
                    <a href="tel:+919941905833" className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-lg bg-[#1B3A5C]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1B3A5C]/20 transition-colors">
                        <Phone className="w-5 h-5 text-[#1B3A5C]" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">Phone</p>
                        <p className="text-sm font-semibold text-[#1A1A2E] group-hover:text-[#1B3A5C] transition-colors">+91 9941905833</p>
                      </div>
                    </a>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => navigate('contact')}
                    className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-lg px-8 h-12 text-sm font-semibold transition-colors w-fit"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Your Resume
                  </Button>
                </FadeIn>
              </div>

              {/* Right: Decorative + Stats */}
              <div className="relative bg-gradient-to-br from-[#1B3A5C] to-[#0C2340] p-8 md:p-12 flex flex-col justify-center overflow-hidden">
                {/* Faded office background image */}
                <img
                  src="/images/careers/office-bg.jpg"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#1B3A5C]/80 to-[#0C2340]/90" />

                <div className="relative z-10">
                  <FadeIn delay={0.1}>
                    <h3 className="text-xl font-bold text-white mb-6">At a Glance</h3>
                  </FadeIn>

                  <div className="space-y-4">
                    {[
                      { value: '29+', label: 'Years of Excellence', icon: Award },
                      { value: '364+', label: 'Team Members', icon: Users },
                      { value: '₹200+ Cr', label: 'Annual Revenue', icon: TrendingUp },
                      { value: '8', label: 'Branch Offices', icon: Building2 },
                      { value: '6', label: 'Countries Served', icon: Globe },
                      { value: '2000+', label: 'CEIG/CEA Approvals', icon: Shield },
                    ].map((stat, i) => (
                      <FadeIn key={stat.label} delay={0.1 + i * 0.06}>
                        <div className="flex items-center gap-3 bg-white/[0.06] rounded-lg px-4 py-3 border border-white/[0.06]">
                          <stat.icon className="w-5 h-5 text-[#E8751A] flex-shrink-0" />
                          <div className="flex-1 flex items-center justify-between">
                            <span className="text-white/60 text-sm">{stat.label}</span>
                            <span className="text-white font-bold text-sm">{stat.value}</span>
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
