'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  ChevronRight, ArrowRight, PenTool, Hammer, FlaskConical,
  BarChart3, ShieldCheck, FileCheck, Building2, Sun,
  Zap, Wrench, Shield,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from '@/components/Router'

/* ═══════════════════════════════════════════════════════════
   STATIC DATA — All services, no database calls
   ═══════════════════════════════════════════════════════════ */

interface StaticService {
  id: string
  name: string
  slug: string
  description: string
  capabilities: string[]
  category: string
  image: string
}

const services: StaticService[] = [
  {
    id: 's1',
    name: 'Design & Engineering',
    slug: 'design-engineering',
    description: 'Comprehensive design and engineering services for electrical switchyards up to 400 KV. From single window approvals to earth mat design as per IEEE-80 and lightning system design as per IS-2309.',
    capabilities: [
      'Getting Single window approval',
      'Prelim and detailed design for civil works in switch yards up to 400 KV',
      'Prelim and detailed design for structural works in switch yards up to 400 KV',
      'Prelim and detailed design for electrical works in switch yards up to 400 KV',
      'Complete document preparation works',
      'Preparation of SLD/Electrical layout',
      'Design of Earth mat as per IEEE-80',
      'Design of Lightning system as per IS-2309',
    ],
    category: 'Engineering',
    image: '/images/services/design-engineering.png',
  },
  {
    id: 's2',
    name: 'Project Execution',
    slug: 'project-execution',
    description: 'Turnkey project management and execution with scheduling via Microsoft Project, weekly event-based tracking, and domain expertise across integration, procurement, risk, and stakeholder management.',
    capabilities: [
      'Project scheduling based on Microsoft Project software',
      'Tracking the project on weekly/event basis',
      'Domain expertise in comprehensive project management',
      'Integration management',
      'Procurement management',
      'Human resources management',
      'Communications management',
      'Risk management',
      'Stakeholder management',
    ],
    category: 'Engineering',
    image: '/images/services/project-execution.png',
  },
  {
    id: 's3',
    name: 'Testing & Commissioning',
    slug: 'testing',
    description: 'Comprehensive testing of CT/PT up to 33 KV with NABL-accredited lab. Testing and evaluation of transformers, earthing systems, lightning systems, and condition monitoring services.',
    capabilities: [
      'Comprehensive testing of CT/PT upto 33 KV — Lab accredited by NABL',
      'Testing and evaluation of Distribution and power transformers',
      'Testing and evaluation of Earthing systems',
      'Testing and evaluation of Lightning systems',
      'Testing and evaluation of current transformers/potential transformers',
      'Condition monitoring services for various electrical equipment',
    ],
    category: 'Engineering',
    image: '/images/services/testing.png',
  },
  {
    id: 's4',
    name: 'Energy & Harmonic Audit',
    slug: 'energy-harmonic-audit',
    description: 'Energy audit and harmonic analysis with wider industry base, value engineering-based solutions, comparison with industry benchmark & IEEE standards, and economic viability recommendations.',
    capabilities: [
      'Wider Industry base',
      'Comprehensive team with domain expertise in various Industries',
      'Value engineering-based solutions',
      'Comparison with relevant industry benchmark & IEEE',
      'Measurement at site',
      'Data analysis',
      'Recommendations based on economic viability — short term, medium term & long-term measures',
      'Report submission, discussion of recommendation with customer & finalizing the report',
    ],
    category: 'Engineering',
    image: '/images/services/energy-audit.png',
  },
  {
    id: 's5',
    name: 'AMC',
    slug: 'amc',
    description: 'Annual Maintenance Contracts with 150+ employees and 16+ years of experience. Exclusive services for multinational companies with standardized annual rate contracts for transparency.',
    capabilities: [
      'Wider Industry base',
      'Comprehensive team with domain expertise in Panels/Troubleshooting/Testing of equipment/HVAC/Solar',
      '150+ employees',
      '16+ years of experience in AMC services',
      'Exclusive services for Multinational companies',
      'Standardized annual rate contracts for transparency',
    ],
    category: 'Maintenance',
    image: '/images/services/amc.png',
  },
  {
    id: 's6',
    name: 'Liaison with CEIG',
    slug: 'liasion-ceig',
    description: 'Complete liaison services with the Chief Electrical Inspector to Government — from preparation of drawings and specifications to getting safety certificates and statutory approvals.',
    capabilities: [
      'Preparation of Drawings and specifications',
      'Submission to electrical inspectorate',
      'Getting Approvals',
      'Arranging Inspection',
      'Getting Safety certificate',
    ],
    category: 'Liaison',
    image: '/images/services/ceig-liaison.png',
  },
  {
    id: 's7',
    name: 'Liaison with TNEB/KPTCL/APTRANSCO/TSTRANSCO',
    slug: 'liasion-utilities',
    description: 'Utility liaison services for power supply and grid connectivity — coordination with Meter & Relay testing, SE-O&M, non-conventional energy, operations, SS Erection, and TLC departments.',
    capabilities: [
      'Coordination with Meter n Relay testing team',
      'Liaison with SE-O&M',
      'Liaison with Non-conventional energy department for SOLAR, WIND and others',
      'Liaison with Operations team for getting approvals',
      'Liaison with SS Erection department for approvals for drawings and specifications',
      'Liaison with TLC department (Transmission line construction) for line works',
    ],
    category: 'Liaison',
    image: '/images/services/utility-liaison.png',
  },
  {
    id: 's8',
    name: 'Solar Works',
    slug: 'solar-works',
    description: 'Leading EPC contractor for solar energy solutions. Tailored installations from 10KW to 100MW with expertise in residential, commercial, and industrial sectors. Comprehensive services from design to maintenance.',
    capabilities: [
      'Leading EPC contractor for solar energy solutions',
      'Tailored solar installations from 10KW to 100MW',
      'Expertise in diverse sectors including residential, commercial, and industrial',
      'Commitment to quality, reliability, and sustainability',
      'Comprehensive services from design to maintenance',
      'Proven track record of successful projects and customer satisfaction',
    ],
    category: 'Renewable',
    image: '/images/services/solar-works.png',
  },
]

/* ─── Icon Map ─── */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Design & Engineering': PenTool,
  'Project Execution': Hammer,
  'Testing & Commissioning': FlaskConical,
  'Energy & Harmonic Audit': BarChart3,
  'AMC': ShieldCheck,
  'Liaison with CEIG': FileCheck,
  'Liaison with TNEB/KPTCL/APTRANSCO/TSTRANSCO': Building2,
  'Solar Works': Sun,
}

/* ─── Accent Colors per Service — NAVY THEME ─── */
type AccentDef = { bg: string; light: string; border: string; text: string; ring: string }

const accentMap: Record<string, AccentDef> = {
  'Design & Engineering':                              { bg: 'bg-[#0D1D3A]',     light: 'bg-[#0D1D3A]/5',   border: 'border-[#334155]',     text: 'text-[#444444]',     ring: 'ring-[#5A7EA8]' },
  'Project Execution':                                 { bg: 'bg-amber-500',      light: 'bg-amber-50',      border: 'border-amber-500',      text: 'text-amber-600',      ring: 'ring-amber-200' },
  'Testing & Commissioning':                           { bg: 'bg-teal-600',       light: 'bg-teal-50',       border: 'border-teal-600',       text: 'text-teal-700',       ring: 'ring-teal-200' },
  'Energy & Harmonic Audit':                           { bg: 'bg-green-600',      light: 'bg-green-50',      border: 'border-green-600',      text: 'text-green-700',      ring: 'ring-green-200' },
  'AMC':                                               { bg: 'bg-[#0D1D3A]',     light: 'bg-[#0D1D3A]/5',   border: 'border-[#334155]',     text: 'text-[#444444]',     ring: 'ring-[#5A7EA8]' },
  'Liaison with CEIG':                                 { bg: 'bg-slate-600',      light: 'bg-slate-50',      border: 'border-slate-600',      text: 'text-slate-600',      ring: 'ring-slate-200' },
  'Liaison with TNEB/KPTCL/APTRANSCO/TSTRANSCO':      { bg: 'bg-cyan-600',       light: 'bg-cyan-50',       border: 'border-cyan-600',       text: 'text-cyan-700',       ring: 'ring-cyan-200' },
  'Solar Works':                                       { bg: 'bg-orange-500',     light: 'bg-orange-50',     border: 'border-orange-500',     text: 'text-orange-600',     ring: 'ring-orange-200' },
}

const defaultAccent: AccentDef = {
  bg: 'bg-[#0D1D3A]', light: 'bg-[#0D1D3A]/5', border: 'border-[#334155]', text: 'text-[#444444]', ring: 'ring-[#5A7EA8]',
}

function getAccent(name: string): AccentDef {
  return accentMap[name] || defaultAccent
}

/* ─── Category ─── */
type CategoryKey = 'All' | 'Engineering' | 'Maintenance' | 'Liaison' | 'Renewable'
const categories: CategoryKey[] = ['All', 'Engineering', 'Maintenance', 'Liaison', 'Renewable']

/* ─── Floating icons for hero background ─── */
const floatingIcons = [Zap, Wrench, Shield, Sun, PenTool, Hammer, BarChart3, FlaskConical, ShieldCheck]

export default function ServicesPage() {
  const { navigate } = useRouter()
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('All')

  const filteredServices = useMemo(() => {
    if (activeCategory === 'All') return services
    return services.filter(s => s.category === activeCategory)
  }, [activeCategory])

  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO SECTION — Navy gradient + floating icons
          ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#37474f' }}>
        {/* Animated floating icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingIcons.map((Icon, i) => {
            const positions = [
              { x: '8%', y: '25%', size: 28 },
              { x: '85%', y: '20%', size: 24 },
              { x: '20%', y: '70%', size: 20 },
              { x: '70%', y: '65%', size: 26 },
              { x: '50%', y: '15%', size: 22 },
              { x: '90%', y: '55%', size: 18 },
              { x: '35%', y: '80%', size: 24 },
              { x: '60%', y: '40%', size: 20 },
              { x: '12%', y: '50%', size: 22 },
            ]
            const pos = positions[i] || positions[0]
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: pos.x, top: pos.y }}
                animate={{
                  y: [0, -18, 0],
                  rotate: [0, i % 2 === 0 ? 8 : -8, 0],
                  opacity: [0.07, 0.14, 0.07],
                }}
                transition={{
                  duration: 5 + i * 0.7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.4,
                }}
              >
                <Icon style={{ width: pos.size, height: pos.size }} className="text-white" />
              </motion.div>
            )
          })}
        </div>

        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 70%)' }}
        />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 pt-[100px] pb-16">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm mb-8"
          >
            <button onClick={() => navigate('home')} className="text-white/50 hover:text-white/80 transition-colors">
              Home
            </button>
            <ChevronRight className="w-4 h-4 text-white/25" />
            <span className="text-[#E8751A] font-medium">Services</span>
          </motion.div>

          {/* Badge + Heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge className="mb-5 bg-[#E8751A]/15 text-[#E8751A] border border-[#E8751A]/30 px-4 py-1.5 text-sm font-semibold rounded-full backdrop-blur-sm">
              {services.length} Services
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-2xl"
          >
            Comprehensive Electrical{' '}
            <span className="relative inline-block">
              Solutions
              <motion.span
                className="absolute -bottom-1 left-0 h-1 rounded-full bg-[#E8751A]"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-lg text-white/60 max-w-xl mb-8"
          >
            {services.length} Specialized Services Under One Roof — From design to commissioning, we deliver end-to-end electrical excellence.
          </motion.p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap items-center gap-3 sm:gap-6"
          >
            {[
              { value: '3000+', label: 'Projects' },
              { value: '20+', label: 'Years' },
              { value: `${services.length}`, label: 'Services' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className="text-sm text-white/50">{stat.label}</span>
                {i < 2 && <span className="hidden sm:inline text-white/20 mx-2">|</span>}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V20C240 50 480 0 720 20C960 40 1200 0 1440 20V60H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CATEGORY TABS + SERVICE GRID
          ══════════════════════════════════════════════ */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          {/* Category filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center gap-2 mb-10"
          >
            {categories.map(cat => {
              const isActive = activeCategory === cat
              const count = cat === 'All'
                ? services.length
                : services.filter(s => s.category === cat).length

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                    ${isActive
                      ? 'bg-[#0D1D3A] text-[#1A1A2E] shadow-lg shadow-[#efefef]/20'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                  `}
                >
                  {cat}
                  <span className={`ml-2 text-sm ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                    ({count})
                  </span>
                </button>
              )
            })}
          </motion.div>

          {/* Service grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredServices.map((s, i) => {
                const Icon = iconMap[s.name] || PenTool
                const accent = getAccent(s.name)

                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className="group"
                  >
                    <Card
                      className={`
                        relative overflow-hidden rounded-xl border-0 shadow-md
                        bg-white cursor-pointer
                        transition-shadow duration-300
                        group-hover:shadow-xl group-hover:shadow-gray-200/60
                      `}
                      onClick={() => navigate('service-detail', { slug: s.slug })}
                    >
                      {/* Service image */}
                      <div className="relative h-44 overflow-hidden">
                        <Image
                          src={s.image}
                          alt={s.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                          <Badge className={`${accent.bg} text-white border-0 px-2.5 py-0.5 text-sm font-semibold`}>
                            {s.category}
                          </Badge>
                          <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Icon className="w-4.5 h-4.5 text-white" />
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-5">
                        {/* Title */}
                        <h3 className="text-lg font-bold text-[#1A1A2E] mb-2 leading-snug group-hover:text-[#444444] transition-colors">
                          {s.name}
                        </h3>

                        {/* Description — truncated to 2 lines */}
                        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                          {s.description}
                        </p>

                        {/* Bottom row: feature count + explore link */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <Badge
                            className={`${accent.light} ${accent.text} border-0 text-sm font-semibold rounded-md px-2.5 py-1`}
                          >
                            {s.capabilities.length} Capabilities
                          </Badge>

                          <span className={`
                            inline-flex items-center gap-1 text-sm font-semibold
                            text-[#444444]
                            transition-all duration-300
                            group-hover:gap-2
                          `}>
                            Explore
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>

          {/* Empty state */}
          {filteredServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No services found in this category.</p>
              <button
                onClick={() => setActiveCategory('All')}
                className="mt-3 text-[#E8751A] text-sm font-semibold hover:underline"
              >
                View all services
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA BANNER
          ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#37474f' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #E8751A, transparent 70%)' }}
          />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 py-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Need a Custom Solution?
            </h2>
            <p className="text-white/60 max-w-lg mx-auto mb-6">
              Our experts combine services to deliver tailored electrical solutions for your unique requirements.
            </p>
            <button
              onClick={() => navigate('contact')}
              className="inline-flex items-center gap-2 bg-[#E8751A] hover:bg-[#D4691A] text-white font-semibold px-7 py-3 rounded-full transition-colors shadow-lg shadow-[#E8751A]/25"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
