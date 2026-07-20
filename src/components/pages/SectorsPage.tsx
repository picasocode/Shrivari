'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Zap, Factory, Droplets, Sun, Building2, Train, Hammer, FlaskConical, Heart, Globe,
  ChevronRight, ArrowRight, Phone, ChevronDown, MapPin, Shield, Award, Users,
  Clock, Target, Eye, CheckCircle2, Sparkles, Lightbulb, BadgeCheck, Wrench,
  Network, Cpu, TrendingUp, Handshake, FileCheck, Layers, Gauge,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/components/Router'

/* ═══════════════════════════════════════════════════════════
   ANIMATION HELPERS
   ═══════════════════════════════════════════════════════════ */

function FadeIn({ children, delay = 0, className = '', direction = 'up' }: {
  children: React.ReactNode; delay?: number; className?: string
  direction?: 'up' | 'left' | 'right' | 'scale'
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const variants: Record<string, any> = {
    up: { opacity: 0, y: 30 }, left: { opacity: 0, x: -30 },
    right: { opacity: 0, x: 30 }, scale: { opacity: 0, scale: 0.9 },
  }
  const animate: Record<string, any> = {
    up: { opacity: 1, y: 0 }, left: { opacity: 1, x: 0 },
    right: { opacity: 1, x: 0 }, scale: { opacity: 1, scale: 1 },
  }
  return (
    <motion.div ref={ref} initial={variants[direction]} animate={isInView ? animate[direction] : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }} className={className}>
      {children}
    </motion.div>
  )
}

function StaggerContainer({ children, className = '', staggerDelay = 0.08 }: {
  children: React.ReactNode; className?: string; staggerDelay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: staggerDelay } } }} className={className}>
      {children}
    </motion.div>
  )
}

function StaggerChild({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={{
      hidden: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
    }} className={className}>
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════════ */

function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
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
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isInView, value])

  return <span ref={ref} className="tabular-nums">{prefix}{count}{suffix}</span>
}

/* ═══════════════════════════════════════════════════════════
   CONSTELLATION SVG (Hero Background)
   ═══════════════════════════════════════════════════════════ */

function ConstellationSVG() {
  const nodes = [
    { cx: 80, cy: 60, r: 4 }, { cx: 200, cy: 40, r: 3 }, { cx: 340, cy: 80, r: 5 },
    { cx: 480, cy: 50, r: 3 }, { cx: 620, cy: 70, r: 4 }, { cx: 760, cy: 45, r: 3 },
    { cx: 900, cy: 65, r: 5 }, { cx: 1040, cy: 55, r: 4 }, { cx: 1200, cy: 75, r: 3 },
    { cx: 150, cy: 180, r: 3 }, { cx: 300, cy: 200, r: 4 }, { cx: 450, cy: 170, r: 3 },
    { cx: 600, cy: 210, r: 5 }, { cx: 750, cy: 185, r: 3 }, { cx: 900, cy: 200, r: 4 },
    { cx: 1050, cy: 175, r: 3 }, { cx: 1200, cy: 195, r: 4 },
    { cx: 100, cy: 320, r: 3 }, { cx: 280, cy: 340, r: 4 }, { cx: 430, cy: 310, r: 3 },
    { cx: 580, cy: 350, r: 4 }, { cx: 730, cy: 330, r: 3 }, { cx: 880, cy: 345, r: 4 },
    { cx: 1030, cy: 315, r: 3 }, { cx: 1180, cy: 340, r: 4 },
    { cx: 180, cy: 460, r: 3 }, { cx: 380, cy: 440, r: 4 }, { cx: 550, cy: 470, r: 3 },
    { cx: 720, cy: 450, r: 4 }, { cx: 870, cy: 465, r: 3 }, { cx: 1020, cy: 445, r: 4 },
  ]

  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8],
    [0, 9], [1, 10], [2, 11], [3, 12], [4, 13], [5, 14], [6, 15], [7, 16],
    [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16],
    [9, 17], [10, 18], [11, 19], [12, 20], [13, 21], [14, 22], [15, 23], [16, 23],
    [17, 18], [18, 19], [19, 20], [20, 21], [21, 22], [22, 23],
    [17, 24], [18, 25], [19, 26], [20, 27], [21, 28], [22, 29],
    [24, 25], [25, 26], [26, 27], [27, 28], [28, 29],
  ]

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1280 540" preserveAspectRatio="xMidYMid slice">
      {/* Connection lines */}
      {connections.map(([a, b], i) => (
        <motion.line
          key={`line-${i}`}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="rgba(232,117,26,0.08)" strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: i * 0.02, ease: 'easeOut' }}
        />
      ))}
      {/* Nodes */}
      {nodes.map((n, i) => (
        <motion.circle
          key={`node-${i}`}
          cx={n.cx} cy={n.cy} r={n.r}
          fill={i % 5 === 0 ? 'rgba(232,117,26,0.25)' : 'rgba(255,255,255,0.1)'}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 + i * 0.03, type: 'spring' }}
        />
      ))}
      {/* Animated pulse rings on key nodes */}
      {[2, 12, 20, 27].map((idx) => (
        <motion.circle
          key={`pulse-${idx}`}
          cx={nodes[idx].cx} cy={nodes[idx].cy} r={nodes[idx].r}
          fill="none" stroke="rgba(232,117,26,0.3)" strokeWidth="1"
          animate={{ r: [nodes[idx].r, nodes[idx].r + 12, nodes[idx].r], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, delay: idx * 0.3 }}
        />
      ))}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTOR DATA
   ═══════════════════════════════════════════════════════════ */

const sectors = [
  {
    name: 'Power & Utilities',
    icon: Zap,
    description: 'EHV substations, switchyards, and transmission lines up to 400KV. Trusted by state electricity boards across South India.',
    stat: '65+ Switchyards',
    statLabel: 'Delivered',
    gradient: 'from-[#efefef] to-[#2A5F9E]',
    accent: '#efefef',
    lightAccent: '#efefef',
    details: ['EHV Substations up to 400KV', 'Transmission Lines 100+ KMs', 'Switchyard EPC', 'UG Cable Works 45+ KMs'],
  },
  {
    name: 'Industrial & Manufacturing',
    icon: Factory,
    description: 'LT/HT panels, AMC services, and turnkey electrical solutions for factories and manufacturing plants.',
    stat: '10,000+',
    statLabel: 'Panels Installed',
    gradient: 'from-[#E8751A] to-[#F59E0B]',
    accent: '#E8751A',
    lightAccent: '#E8751A',
    details: ['LT/HT Panel Manufacturing', 'Industrial AMC Services', 'Plant Electrification', 'Motor Control Centers'],
  },
  {
    name: 'Oil & Gas / Petrochemical',
    icon: Droplets,
    description: 'GIS substations for refineries and petrochemical plants. Specialized hazardous area electrical installations.',
    stat: '10+',
    statLabel: 'GIS Substations',
    gradient: 'from-[#0D9488] to-[#14B8A6]',
    accent: '#0D9488',
    lightAccent: '#0D9488',
    details: ['GIS Substations', 'Hazardous Area Installations', 'Goa Bridge Project', 'Chemplast & Gujarat Fluorochemicals'],
  },
  {
    name: 'Solar & Renewable Energy',
    icon: Sun,
    description: 'Complete solar EPC solutions from rooftop to ground mount. Solar division since 2014 with MW-scale delivery.',
    stat: '450+ MW',
    statLabel: 'Solar Capacity',
    gradient: 'from-[#D97706] to-[#FBBF24]',
    accent: '#D97706',
    lightAccent: '#D97706',
    details: ['5.5 MW Rooftop Solar', '450 MW Ground Mount', 'Net Metering Integration', 'O&M Support'],
  },
  {
    name: 'Commercial & Real Estate',
    icon: Building2,
    description: 'IT parks, commercial buildings, and retail complexes. Complete electrical infrastructure from design to commissioning.',
    stat: '200+',
    statLabel: 'Projects',
    gradient: 'from-[#7C3AED] to-[#A78BFA]',
    accent: '#7C3AED',
    lightAccent: '#7C3AED',
    details: ['IT Park Electrification', 'Commercial Buildings', 'Retail Complexes', 'Building Management Systems'],
  },
  {
    name: 'Infrastructure & Transportation',
    icon: Train,
    description: 'Airports, metro, and port electrical infrastructure. Specialized projects including Goa Airport works.',
    stat: '50+',
    statLabel: 'Infra Projects',
    gradient: 'from-[#DC2626] to-[#F87171]',
    accent: '#DC2626',
    lightAccent: '#DC2626',
    details: ['Airport Electrical Works', 'Metro Rail Systems', 'Port Infrastructure', 'Goa Airport Project'],
  },
  {
    name: 'Cement & Heavy Industry',
    icon: Hammer,
    description: 'Electrical solutions for cement plants and heavy industries. Partners include Dalmia, India Cements, and Chettinad.',
    stat: '30+',
    statLabel: 'Heavy Industry',
    gradient: 'from-[#78716C] to-[#A8A29E]',
    accent: '#78716C',
    lightAccent: '#78716C',
    details: ['Dalmia Cement Projects', 'India Cements Works', 'Chettinad Cements', 'Heavy Duty Switchgear'],
  },
  {
    name: 'Chemical & Pharmaceutical',
    icon: FlaskConical,
    description: 'Specialized electrical installations for chemical and pharma facilities with strict compliance requirements.',
    stat: '25+',
    statLabel: 'Pharma/Chem Projects',
    gradient: 'from-[#2A5A8A] to-[#34D399]',
    accent: '#2A5A8A',
    lightAccent: '#2A5A8A',
    details: ['Gujarat Fluorochemicals', 'Clean Room Electrical', 'Hazardous Area Compliance', 'Process Control Panels'],
  },
  {
    name: 'Healthcare & Institutional',
    icon: Heart,
    description: 'Hospitals, educational institutions, and government buildings. Reliable power solutions for critical facilities.',
    stat: '100+',
    statLabel: 'Institutions Served',
    gradient: 'from-[#EC4899] to-[#F9A8D4]',
    accent: '#EC4899',
    lightAccent: '#EC4899',
    details: ['Hospital Power Systems', 'Educational Institutions', 'Government Buildings', 'Backup Power Solutions'],
  },
  {
    name: 'International Projects',
    icon: Globe,
    description: 'Electrical EPC projects across 6 countries — Nigeria, Qatar, Bangladesh, Sri Lanka, Oman, and Sierra Leone.',
    stat: '6',
    statLabel: 'Countries',
    gradient: 'from-[#2563EB] to-[#60A5FA]',
    accent: '#2563EB',
    lightAccent: '#2563EB',
    details: ['Nigeria Projects', 'Qatar Operations', 'Bangladesh Installations', 'Sri Lanka & Oman'],
  },
]

/* ═══════════════════════════════════════════════════════════
   UTILITY/BOARD DATA
   ═══════════════════════════════════════════════════════════ */

const utilities = [
  { name: 'TNPDCL', fullName: 'Tamil Nadu Power Distribution Corp', region: 'Tamil Nadu', x: 50, y: 65 },
  { name: 'TANTRANSCO', fullName: 'Tamil Nadu Transmission Corp', region: 'Tamil Nadu', x: 42, y: 55 },
  { name: 'APTRANSCO', fullName: 'AP Transmission Corp', region: 'Andhra Pradesh', x: 35, y: 60 },
  { name: 'TSTRANSCO', fullName: 'Telangana Transmission Corp', region: 'Telangana', x: 28, y: 50 },
  { name: 'APSPDCL', fullName: 'AP Southern Power Distribution', region: 'Andhra Pradesh', x: 40, y: 72 },
  { name: 'KPTCL', fullName: 'Karnataka Power Transmission Corp', region: 'Karnataka', x: 25, y: 62 },
  { name: 'KSEB', fullName: 'Kerala State Electricity Board', region: 'Kerala', x: 20, y: 72 },
  { name: 'GOA', fullName: 'Goa Electricity Dept', region: 'Goa', x: 17, y: 48 },
  { name: 'OPTCL', fullName: 'Odisha Power Transmission Corp', region: 'Odisha', x: 55, y: 40 },
  { name: 'OPDCL', fullName: 'Odisha Power Distribution Corp', region: 'Odisha', x: 60, y: 35 },
]

/* ═══════════════════════════════════════════════════════════
   PROJECT SHOWCASE DATA
   ═══════════════════════════════════════════════════════════ */

const showcaseProjects = [
  {
    sector: 'Power & Utilities',
    title: '230KV Substation',
    year: '2023',
    value: '₹25 Cr+',
    description: '230KV/110KV substation with complete switchyard, protection systems, and SCADA integration for state utility.',
    icon: Zap,
    color: '#efefef',
  },
  {
    sector: 'Industrial',
    title: '110KV GIS Substation',
    year: '2022',
    value: '₹18 Cr+',
    description: 'Gas Insulated Substation for a major industrial client, offering compact footprint and enhanced reliability.',
    icon: Factory,
    color: '#E8751A',
  },
  {
    sector: 'Renewable',
    title: '450MW Solar Plant',
    year: '2024',
    value: '₹200 Cr+',
    description: 'Ground-mount solar EPC spanning multiple sites with 450+ MW cumulative capacity across India.',
    icon: Sun,
    color: '#D97706',
  },
  {
    sector: 'Infrastructure',
    title: 'Goa Airport Works',
    year: '2021',
    value: '₹12 Cr+',
    description: 'Complete electrical infrastructure for Goa Airport including substations, lighting, and backup systems.',
    icon: Train,
    color: '#DC2626',
  },
  {
    sector: 'International',
    title: '6-Country Projects',
    year: 'Ongoing',
    value: 'Multi-Crore',
    description: 'Electrical EPC projects across Nigeria, Qatar, Bangladesh, Sri Lanka, Oman, and Sierra Leone.',
    icon: Globe,
    color: '#2563EB',
  },
  {
    sector: 'Cement & Heavy',
    title: 'Dalmia Cement Plant',
    year: '2022',
    value: '₹15 Cr+',
    description: 'Complete electrical installation for cement manufacturing facility including HT panels and switchyard.',
    icon: Hammer,
    color: '#78716C',
  },
]

/* ═══════════════════════════════════════════════════════════
   CONSULTANT PARTNERS DATA
   ═══════════════════════════════════════════════════════════ */

const consultants = [
  { name: 'CRN', fullName: 'CRN Consultants', specialty: 'Power Systems' },
  { name: 'SME', fullName: 'SME Consulting', specialty: 'Industrial Design' },
  { name: 'NNE', fullName: 'NNE Engineering', specialty: 'Pharma & Clean Rooms' },
  { name: 'JACOBS', fullName: 'Jacobs Engineering', specialty: 'Infrastructure' },
  { name: 'TCE', fullName: 'Tata Consulting Engineers', specialty: 'Multi-Discipline' },
  { name: 'ABBETT', fullName: 'Abbett & Associates', specialty: 'Project Management' },
]

/* ═══════════════════════════════════════════════════════════
   BRANCH OFFICES DATA
   ═══════════════════════════════════════════════════════════ */

const branches = [
  { city: 'Chennai', state: 'Tamil Nadu', type: 'HQ', x: 62, y: 72, isHQ: true },
  { city: 'Bangalore', state: 'Karnataka', x: 44, y: 68, isHQ: false },
  { city: 'Hyderabad', state: 'Telangana', x: 35, y: 52, isHQ: false },
  { city: 'Vishakhapatnam', state: 'Andhra Pradesh', x: 52, y: 50, isHQ: false },
  { city: 'Tirupati', state: 'Andhra Pradesh', x: 50, y: 66, isHQ: false },
  { city: 'Pondicherry', state: 'Puducherry', x: 63, y: 68, isHQ: false },
  { city: 'Hosur', state: 'Tamil Nadu', x: 50, y: 70, isHQ: false },
  { city: 'Trivandrum', state: 'Kerala', x: 40, y: 85, isHQ: false },
]

const internationalOffices = [
  { country: 'Nigeria', flag: '🇳🇬' },
  { country: 'Qatar', flag: '🇶🇦' },
  { country: 'Bangladesh', flag: '🇧🇩' },
  { country: 'Sri Lanka', flag: '🇱🇰' },
  { country: 'Oman', flag: '🇴🇲' },
  { country: 'Sierra Leone', flag: '🇸🇱' },
]

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function SectorsPage() {
  const { navigate } = useRouter()
  const [hoveredSector, setHoveredSector] = useState<number | null>(null)

  /* Hero parallax */
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  /* Horizontal scroll ref for project showcase */
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = scrollContainerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  const scrollProjects = (dir: 'left' | 'right') => {
    const el = scrollContainerRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'right' ? 400 : -400, behavior: 'smooth' })
    setTimeout(checkScroll, 400)
  }

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll)
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [])

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          1. HERO — Constellation Network Background
          ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[85vh] min-h-[560px] overflow-hidden flex items-center justify-center">
        <motion.div style={{ y: heroY }} className="absolute inset-0 bg-[#0C2340]">
          {/* Gradient */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at 30% 40%, rgba(232,117,26,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(13,148,136,0.08) 0%, transparent 50%), linear-gradient(160deg, #0C2340 0%, #efefef 40%, #0C2340 100%)',
          }} />
          {/* Constellation SVG */}
          <ConstellationSVG />
          {/* Glow accents */}
          <div className="absolute top-[20%] right-[10%] w-80 h-80 rounded-full bg-[#E8751A]/5 blur-3xl" />
          <div className="absolute bottom-[10%] left-[5%] w-96 h-96 rounded-full bg-[#0D9488]/5 blur-3xl" />
        </motion.div>

        {/* Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-5 max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center gap-2 text-sm mb-8"
          >
            <button onClick={() => navigate('home')} className="text-white/50 hover:text-white transition-colors">Home</button>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <button onClick={() => navigate('about')} className="text-white/50 hover:text-white transition-colors">Company</button>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <span className="text-[#E8751A]">Key Sectors</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Badge className="bg-[#E8751A]/15 text-[#E8751A] border border-[#E8751A]/25 rounded-full px-5 py-1.5 text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5 mr-1.5" /> 10 Sectors • 6 Countries • 29+ Years
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-5 tracking-tight"
          >
            Powering Every{' '}
            <span className="bg-gradient-to-r from-[#E8751A] to-[#F59E0B] bg-clip-text text-transparent">Sector</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg md:text-xl text-white/50 font-light mb-3 max-w-2xl mx-auto"
          >
            From 400KV substations to rooftop solar, from cement plants to international airports —
            SVEPL delivers across every vertical of electrical engineering.
          </motion.p>

          {/* Quick stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-wrap justify-center gap-6 md:gap-10 mt-8"
          >
            {[
              { label: '10 Sectors', icon: Layers },
              { label: '10+ Utility Approvals', icon: Shield },
              { label: '6 Countries', icon: Globe },
              { label: '1200+ Projects', icon: CheckCircle2 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-white/50">
                <item.icon className="w-4 h-4 text-[#E8751A]/70" />
                <span className="text-sm md:text-sm font-medium">{item.label}</span>
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
          <span className="text-white/30 text-sm uppercase tracking-[0.2em]">Explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="w-5 h-5 text-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. SECTOR GRID — 10 Sector Cards with Hover Expand
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #efefef 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <Badge variant="outline" className="border-[#E8751A]/30 text-[#E8751A] rounded-full px-3 py-0.5 text-sm font-semibold mb-4">
                Our Expertise
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">Key Sectors We Serve</h2>
              <div className="section-bar mx-auto mb-4" />
              <p className="text-[#4B5563] max-w-2xl mx-auto text-sm">
                Nearly three decades of experience across diverse industries, from power utilities to international projects —
                every sector benefits from our integrated EPC approach.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5" staggerDelay={0.07}>
            {sectors.map((sector, idx) => {
              const Icon = sector.icon
              const isHovered = hoveredSector === idx
              return (
                <StaggerChild key={sector.name}>
                  <motion.div
                    onMouseEnter={() => setHoveredSector(idx)}
                    onMouseLeave={() => setHoveredSector(null)}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full"
                  >
                    <Card className="relative overflow-hidden rounded-xl border border-[#E5E7EB] shadow-sm h-full cursor-pointer group">
                      {/* Top gradient bar */}
                      <div className={`h-1.5 bg-gradient-to-r ${sector.gradient}`} />

                      <CardContent className="p-5">
                        {/* Icon with gradient background */}
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${sector.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>

                        {/* Sector name */}
                        <h3 className="text-base font-bold text-[#1A1A2E] mb-2 group-hover:text-[#334155] transition-colors">
                          {sector.name}
                        </h3>

                        {/* Description */}
                        <p className="text-[#4B5563] text-sm leading-relaxed mb-4 line-clamp-3">
                          {sector.description}
                        </p>

                        {/* Key stat */}
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-2xl font-bold" style={{ color: sector.accent }}>
                              <AnimatedCounter value={parseInt(sector.stat) || 0} suffix={sector.stat.replace(/[0-9,]/g, '')} />
                            </p>
                            <p className="text-[10px] text-[#9CA3AF] font-medium uppercase tracking-wider">{sector.statLabel}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#E8751A] group-hover:translate-x-1 transition-all" />
                        </div>

                        {/* Hover expanded details */}
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-2">
                                {sector.details.map((detail, dIdx) => (
                                  <div key={dIdx} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: sector.accent }} />
                                    <span className="text-[#374151] text-sm">{detail}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerChild>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. POWER UTILITY MAP — Connected Nodes
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 relative overflow-hidden" style={{
        background: 'linear-gradient(160deg, #0C2340 0%, #efefef 50%, #1E3A5F 100%)',
      }}>
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }} />
        <div className="absolute top-[5%] right-[-5%] w-80 h-80 rounded-full bg-[#E8751A]/5 blur-3xl" />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <Badge className="bg-white/10 text-white/70 border border-white/10 rounded-full px-3 py-0.5 text-sm font-semibold mb-4">
                Approved By
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Utility & Board Approvals</h2>
              <div className="section-bar mx-auto mb-4" />
              <p className="text-white/50 max-w-xl mx-auto text-sm">
                Approved by 10+ state electricity boards and utilities across India — a testament to our quality and compliance.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left — Map visualization */}
            <FadeIn direction="left">
              <div className="relative bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8 backdrop-blur-sm">
                {/* Simplified South India map outline */}
                <svg viewBox="0 0 100 100" className="w-full max-w-md mx-auto">
                  {/* South India outline */}
                  <path
                    d="M15,35 Q20,25 30,22 Q40,18 50,22 Q60,20 70,25 Q80,30 85,40 Q90,55 82,70 Q75,82 65,88 Q55,92 45,90 Q35,88 28,80 Q20,72 15,60 Q12,48 15,35Z"
                    fill="rgba(232,117,26,0.05)"
                    stroke="rgba(232,117,26,0.15)"
                    strokeWidth="0.5"
                  />
                  {/* Connection lines between utilities */}
                  {[
                    [0, 1], [1, 2], [2, 3], [2, 4], [3, 5], [5, 6], [5, 7], [3, 8], [8, 9],
                  ].map(([a, b], i) => (
                    <motion.line
                      key={`util-line-${i}`}
                      x1={utilities[a].x} y1={utilities[a].y}
                      x2={utilities[b].x} y2={utilities[b].y}
                      stroke="rgba(232,117,26,0.2)" strokeWidth="0.3"
                      strokeDasharray="1.5,1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 0.3 + i * 0.1 }}
                    />
                  ))}
                  {/* Utility nodes */}
                  {utilities.map((util, i) => (
                    <motion.g key={util.name} initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.08, type: 'spring' }}>
                      {/* Outer ring */}
                      <circle cx={util.x} cy={util.y} r="3.5" fill="none" stroke="rgba(232,117,26,0.3)" strokeWidth="0.4" />
                      {/* Inner dot */}
                      <circle cx={util.x} cy={util.y} r="1.8" fill="rgba(232,117,26,0.6)" />
                      {/* Label */}
                      <text x={util.x} y={util.y - 5} textAnchor="middle" fill="white" fontSize="2.5" fontWeight="600" fontFamily="Inter, sans-serif">
                        {util.name}
                      </text>
                    </motion.g>
                  ))}
                  {/* Animated pulse on key node */}
                  <motion.circle
                    cx={utilities[0].x} cy={utilities[0].y} r={3.5}
                    fill="none" stroke="rgba(232,117,26,0.4)" strokeWidth="0.5"
                    animate={{ r: [3.5, 7, 3.5], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                </svg>
              </div>
            </FadeIn>

            {/* Right — Utility list */}
            <FadeIn direction="right">
              <div className="grid grid-cols-2 gap-3">
                {utilities.map((util, i) => (
                  <motion.div
                    key={util.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors group cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-[#E8751A]/20 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 text-[#E8751A]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{util.name}</p>
                        <p className="text-white/40 text-[10px]">{util.region}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. PROJECT SHOWCASE — Horizontal Scrolling
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#f1f5f9] relative overflow-hidden">
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #efefef 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }} />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="flex items-end justify-between mb-10">
              <div>
                <Badge variant="outline" className="border-[#334155]/20 text-[#334155] rounded-full px-3 py-0.5 text-sm font-semibold mb-4">
                  Notable Projects
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-2">Project Showcase by Sector</h2>
                <div className="section-bar mb-3" />
                <p className="text-[#4B5563] text-sm max-w-lg">Landmark projects across sectors that define our capability and commitment.</p>
              </div>
              {/* Scroll arrows */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => scrollProjects('left')}
                  disabled={!canScrollLeft}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${canScrollLeft ? 'border-[#334155] text-[#334155] hover:bg-[#334155] hover:text-white' : 'border-[#D1D5DB] text-[#D1D5DB] cursor-not-allowed'}`}
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <button
                  onClick={() => scrollProjects('right')}
                  disabled={!canScrollRight}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${canScrollRight ? 'border-[#334155] text-[#334155] hover:bg-[#334155] hover:text-white' : 'border-[#D1D5DB] text-[#D1D5DB] cursor-not-allowed'}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {showcaseProjects.map((project, i) => {
              const Icon = project.icon
              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="snap-start shrink-0 w-[320px] md:w-[380px]"
                >
                  <Card className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-lg transition-shadow duration-300 h-full overflow-hidden group">
                    {/* Top color bar */}
                    <div className="h-2" style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}88)` }} />
                    <CardContent className="p-6">
                      {/* Sector badge + Year */}
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="rounded-full text-sm font-semibold border-0" style={{
                          backgroundColor: `${project.color}15`,
                          color: project.color,
                        }}>
                          {project.sector}
                        </Badge>
                        <span className="text-sm text-[#9CA3AF] font-medium">{project.year}</span>
                      </div>

                      {/* Icon */}
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{
                        background: `linear-gradient(135deg, ${project.color}, ${project.color}88)`,
                      }}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">{project.title}</h3>

                      {/* Description */}
                      <p className="text-[#4B5563] text-sm leading-relaxed mb-4">{project.description}</p>

                      {/* Value */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#F0F4F8]">
                        <div>
                          <p className="text-sm text-[#9CA3AF] font-medium uppercase tracking-wider">Project Value</p>
                          <p className="text-lg font-bold" style={{ color: project.color }}>{project.value}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-[#D1D5DB] group-hover:text-[#E8751A] group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. CONSULTANT PARTNERS — Badge Row
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#334155]/[0.02] rounded-full -translate-y-1/2 translate-x-1/3" />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <Badge variant="outline" className="border-[#334155]/20 text-[#334155] rounded-full px-3 py-0.5 text-sm font-semibold mb-4">
                Trusted Partnerships
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">Consultant Partners</h2>
              <div className="section-bar mx-auto mb-4" />
              <p className="text-[#4B5563] max-w-xl mx-auto text-sm">
                We work with India&apos;s leading engineering consultants to deliver world-class projects.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4" staggerDelay={0.06}>
            {consultants.map((consultant) => (
              <StaggerChild key={consultant.name}>
                <Card className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center group h-full">
                  <CardContent className="p-5">
                    {/* Consultant monogram */}
                    <div className="w-16 h-16 rounded-full bg-[#334155]/5 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#334155] transition-colors duration-300">
                      <span className="text-lg font-bold text-[#334155] group-hover:text-white transition-colors duration-300">
                        {consultant.name.slice(0, 2)}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#1A1A2E] text-sm mb-1">{consultant.name}</h3>
                    <p className="text-[10px] text-[#9CA3AF]">{consultant.specialty}</p>
                  </CardContent>
                </Card>
              </StaggerChild>
            ))}
          </StaggerContainer>

          {/* Decorative partnership line */}
          <FadeIn delay={0.3}>
            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />
              <div className="flex items-center gap-2 text-[#9CA3AF]">
                <Handshake className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Strategic Partnerships</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          6. GEOGRAPHIC REACH — Map Visualization
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#F8FAFB] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #efefef 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }} />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <Badge variant="outline" className="border-[#E8751A]/30 text-[#E8751A] rounded-full px-3 py-0.5 text-sm font-semibold mb-4">
                Our Presence
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">Geographic Reach</h2>
              <div className="section-bar mx-auto mb-4" />
              <p className="text-[#4B5563] max-w-xl mx-auto text-sm">
                8 branch offices across South India with headquarters in Chennai, plus international operations in 6 countries.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left — Map visualization */}
            <FadeIn direction="left">
              <div className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 md:p-8">
                <svg viewBox="0 0 100 100" className="w-full max-w-lg mx-auto">
                  {/* South India outline */}
                  <path
                    d="M15,35 Q20,25 30,22 Q40,18 50,22 Q60,20 70,25 Q80,30 85,40 Q90,55 82,70 Q75,82 65,88 Q55,92 45,90 Q35,88 28,80 Q20,72 15,60 Q12,48 15,35Z"
                    fill="#F0F4F8"
                    stroke="#E5E7EB"
                    strokeWidth="0.5"
                  />
                  {/* Connection lines from HQ to branches */}
                  {branches.filter(b => !b.isHQ).map((branch, i) => (
                    <motion.line
                      key={`branch-line-${i}`}
                      x1={branches[0].x} y1={branches[0].y}
                      x2={branch.x} y2={branch.y}
                      stroke="#E8751A" strokeWidth="0.3" strokeDasharray="2,1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    />
                  ))}
                  {/* Branch markers */}
                  {branches.map((branch, i) => (
                    <motion.g key={branch.city} initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.08, type: 'spring' }}>
                      {branch.isHQ ? (
                        <>
                          {/* HQ pulse */}
                          <motion.circle cx={branch.x} cy={branch.y} r={4}
                            fill="none" stroke="#E8751A" strokeWidth="0.6"
                            animate={{ r: [4, 8, 4], opacity: [0.4, 0, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          {/* HQ marker */}
                          <circle cx={branch.x} cy={branch.y} r={3.5} fill="#E8751A" />
                          <circle cx={branch.x} cy={branch.y} r={1.5} fill="white" />
                        </>
                      ) : (
                        <>
                          <circle cx={branch.x} cy={branch.y} r={2} fill="#efefef" />
                          <circle cx={branch.x} cy={branch.y} r={0.8} fill="white" />
                        </>
                      )}
                      {/* Label */}
                      <text x={branch.x} y={branch.y - 5} textAnchor="middle"
                        fill={branch.isHQ ? '#E8751A' : '#efefef'}
                        fontSize={branch.isHQ ? '3' : '2.2'}
                        fontWeight={branch.isHQ ? '700' : '600'}
                        fontFamily="Inter, sans-serif">
                        {branch.city}{branch.isHQ ? ' HQ' : ''}
                      </text>
                    </motion.g>
                  ))}
                </svg>

                {/* Map legend */}
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#E8751A]" />
                    <span className="text-sm text-[#4B5563]">Headquarters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#334155]" />
                    <span className="text-sm text-[#4B5563]">Branch Office</span>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right — Branch list + International */}
            <FadeIn direction="right">
              <div className="space-y-4">
                {/* Branch offices */}
                <div className="grid grid-cols-2 gap-3">
                  {branches.map((branch, i) => (
                    <motion.div
                      key={branch.city}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className={`rounded-lg p-3 border transition-colors ${
                        branch.isHQ
                          ? 'bg-[#E8751A]/5 border-[#E8751A]/20'
                          : 'bg-white border-[#E5E7EB] hover:border-[#334155]/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                          branch.isHQ ? 'bg-[#E8751A]' : 'bg-[#334155]/8'
                        }`}>
                          {branch.isHQ ? (
                            <Building2 className="w-4 h-4 text-white" />
                          ) : (
                            <MapPin className="w-4 h-4 text-[#334155]" />
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${branch.isHQ ? 'text-[#E8751A]' : 'text-[#1A1A2E]'}`}>
                            {branch.city}{branch.isHQ ? ' HQ' : ''}
                          </p>
                          <p className="text-[10px] text-[#9CA3AF]">{branch.state}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* International presence */}
                <div className="mt-6 bg-[#334155] rounded-xl p-5 border border-[#334155]">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-[#E8751A]" />
                    <h3 className="text-white font-bold text-sm">International Presence</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {internationalOffices.map((country, i) => (
                      <motion.div
                        key={country.country}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.06 }}
                        className="bg-white/5 rounded-lg p-2.5 text-center border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <span className="text-lg mb-1 block">{country.flag}</span>
                        <p className="text-white/70 text-[10px] font-medium">{country.country}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          7. CTA — Power Your Sector
          ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #E8751A 0%, #C55F10 50%, #F59231 100%)',
      }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Decorative circles */}
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/[0.02]" />
        </div>

        {/* Decorative SVG grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 py-20 md:py-28 text-center">
          <FadeIn direction="scale">
            <div className="flex items-center justify-center gap-3 mb-6">
              {[Zap, Sun, Building2, Factory, Globe].map((Icon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center"
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>
              ))}
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Power Your Sector
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Whatever your industry, SVEPL has the expertise, approvals, and track record to deliver.
              From concept to commissioning — let&apos;s power your next project together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={() => navigate('contact')}
                className="bg-white text-[#E8751A] hover:bg-white/90 rounded-md px-8 h-12 font-semibold text-sm transition-colors shadow-lg">
                Get a Quote <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 hover:border-white rounded-md px-8 h-12 font-semibold text-sm transition-colors" asChild>
                <a href="tel:+919941905833"><Phone className="mr-2 w-4 h-4" />Call Us</a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {[
                { label: '29+ Years', icon: Clock },
                { label: '1200+ Projects', icon: CheckCircle2 },
                { label: 'CRISIL BB+', icon: Shield },
                { label: '10+ Utility Approvals', icon: Award },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-white/60">
                  <badge.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
