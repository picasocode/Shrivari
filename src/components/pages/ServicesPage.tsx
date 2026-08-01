'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  ChevronRight, ArrowRight, ArrowUpRight, PenTool, Hammer, FlaskConical,
  BarChart3, ShieldCheck, FileCheck, Building2, Sun,
  Zap, Wrench, Shield, Network, Factory, Boxes, Search, X,
  Sparkles, Layers, Workflow, Gauge, CheckCircle2, Phone,
} from 'lucide-react'
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
  featured?: boolean
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
    featured: true,
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
  {
    id: 's9',
    name: 'Electrical EPC Solutions',
    slug: 'electrical-epc-solutions',
    description: 'Comprehensive electrical EPC services covering engineering, procurement, installation, testing, commissioning, and maintenance for industrial and infrastructure projects.',
    capabilities: [
      'Electrical system design',
      'Detailed engineering',
      'Equipment procurement',
      'Installation & erection',
      'Testing & commissioning',
      'Utility coordination',
      'Project management',
      'Operation support',
    ],
    category: 'EPC',
    image: '/images/services/electrical-epc-solutions.png',
  },
  {
    id: 's10',
    name: 'EHV / HV Substations',
    slug: 'ehv-hv-substations',
    description: 'Engineering and execution of AIS and GIS substations up to 400 kV with reliable power distribution and protection systems.',
    capabilities: [
      'Switchyard construction',
      'GIS/AIS substations',
      'Transformer installations',
      'Protection systems',
      'Relay coordination',
      'SCADA integration',
      'Bus duct systems',
      'Grounding systems',
    ],
    category: 'EPC',
    image: '/images/services/ehv-hv-substations.png',
  },
  {
    id: 's11',
    name: 'Industrial Electrification',
    slug: 'industrial-electrification',
    description: 'Complete industrial electrification solutions for manufacturing plants, process industries, commercial facilities, and infrastructure projects.',
    capabilities: [
      'Power distribution systems',
      'Cable laying and termination',
      'Motor control systems',
      'Lighting systems',
      'Earthing systems',
      'DG synchronization',
      'Energy management',
      'Retrofitting solutions',
    ],
    category: 'EPC',
    image: '/images/services/industrial-electrification.png',
  },
  {
    id: 's12',
    name: 'HT & LT Panel Manufacturing',
    slug: 'ht-lt-panel-manufacturing',
    description: 'Design and manufacture of high-quality HT Panels, LT panels and Bus ducts customized to project and industry requirements.',
    capabilities: [
      'PCC Panels',
      'MCC Panels',
      'APFC Panels',
      'PLC Panels',
      'Synchronization Panels',
      'VFD Panels',
      'AMF Panels',
      'Distribution Boards',
      'Bus Duct Systems',
    ],
    category: 'Manufacturing',
    image: '/images/services/ht-lt-panel-manufacturing.png',
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
  'Electrical EPC Solutions': Network,
  'EHV / HV Substations': Zap,
  'Industrial Electrification': Factory,
  'HT & LT Panel Manufacturing': Boxes,
}

/* ─── Category config: vertical sidebar ─── */
type CategoryKey = 'All' | 'Engineering' | 'EPC' | 'Manufacturing' | 'Maintenance' | 'Liaison' | 'Renewable'

const categoryConfig: { key: CategoryKey; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { key: 'All',           label: 'All Services', icon: Layers,    desc: 'Everything we offer' },
  { key: 'Engineering',   label: 'Engineering',  icon: PenTool,   desc: 'Design & analysis' },
  { key: 'EPC',            label: 'EPC',          icon: Network,   desc: 'Turnkey execution' },
  { key: 'Manufacturing', label: 'Manufacturing', icon: Boxes,   desc: 'Panels & bus ducts' },
  { key: 'Maintenance',   label: 'Maintenance',  icon: Wrench,   desc: 'AMC & upkeep' },
  { key: 'Liaison',       label: 'Liaison',      icon: FileCheck, desc: 'Statutory approvals' },
  { key: 'Renewable',     label: 'Renewable',    icon: Sun,       desc: 'Solar & green energy' },
]

/* ─── Process steps ─── */
const processSteps = [
  { n: '01', title: 'Discover', desc: 'Understand scope, site, statutory needs & client objectives', icon: Search },
  { n: '02', title: 'Design',   desc: 'Engineering, SLD, earth mat, lightning & protection design', icon: PenTool },
  { n: '03', title: 'Execute',   desc: 'Procurement, installation, testing & commissioning on schedule', icon: Hammer },
  { n: '04', title: 'Sustain',  desc: 'AMC, audits, condition monitoring & statutory renewals', icon: ShieldCheck },
]

/* ─── Industries served ─── */
const industries = [
  'Cement', 'Steel', 'Petrochemical', 'Power Utility', 'Automotive',
  'Data Center', 'Pharma', 'Textile', 'Food & Beverage', 'Infrastructure',
  'Renewable IPP', 'Commercial Real Estate',
]

export default function ServicesPage() {
  const { navigate } = useRouter()
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('All')
  const [query, setQuery] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filteredServices = useMemo(() => {
    let list = activeCategory === 'All'
      ? services
      : services.filter(s => s.category === activeCategory)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.capabilities.some(c => c.toLowerCase().includes(q))
      )
    }
    return list
  }, [activeCategory, query])

  const totalCount = services.length
  const activeCount = filteredServices.length

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          HERO — Light editorial split layout (NO navy gradient)
          ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#F7F9FC]">
        {/* Decorative coral arc — top right */}
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 65%)' }} />
        {/* Decorative navy arc — bottom left */}
        <div className="absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full pointer-events-none opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #1B3A5C 0%, transparent 65%)' }} />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#1B3A5C 1px, transparent 1px), linear-gradient(90deg, #1B3A5C 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 pt-[110px] pb-16 lg:pb-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* LEFT — Editorial copy */}
            <div className="lg:col-span-7">
              {/* Breadcrumb */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2 text-sm mb-6"
              >
                <button onClick={() => navigate('home')} className="text-gray-400 hover:text-[#1B3A5C] transition-colors">
                  Home
                </button>
                <ChevronRight className="w-4 h-4 text-gray-300" />
                <span className="text-[#E8751A] font-semibold">Services</span>
              </motion.div>

              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="inline-flex items-center gap-2 mb-5"
              >
                <span className="w-8 h-px bg-[#E8751A]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8751A]">What We Do</span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] text-[#152D4F] mb-5 tracking-tight"
              >
                One partner.{' '}
                <span className="relative inline-block text-[#E8751A]">
                  Twelve services.
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none">
                    <motion.path
                      d="M2 8 Q 150 2, 298 7"
                      stroke="#E8751A"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.9, delay: 0.6, ease: 'easeOut' }}
                    />
                  </svg>
                </span>
                <br />
                Zero hand-offs.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-gray-500 leading-relaxed max-w-xl mb-8"
              >
                From 400 kV switchyard design to rooftop solar — every capability you need to energise, protect and maintain your plant sits under one roof. No fragmentation, no finger-pointing.
              </motion.p>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-3 gap-4 max-w-lg"
              >
                {[
                  { v: '400', u: 'kV', l: 'Up to' },
                  { v: '12', u: '', l: 'Service lines' },
                  { v: '2000+', u: '', l: 'Projects delivered' },
                ].map((s, i) => (
                  <div key={i} className="border-l-2 border-[#E8751A]/40 pl-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl lg:text-3xl font-bold text-[#152D4F]">{s.v}</span>
                      {s.u && <span className="text-sm font-semibold text-[#E8751A]">{s.u}</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — Category cluster card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative bg-white rounded-2xl shadow-xl shadow-gray-200/60 p-6 lg:p-7 border border-gray-100">
                {/* Coral corner accent */}
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-[#E8751A] rounded-tr-2xl rounded-bl-2xl opacity-10" />

                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E8751A]" />
                    <span className="text-sm font-bold text-[#152D4F]">Service Universe</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400">{totalCount} total</span>
                </div>

                {/* Category mini-grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {categoryConfig.filter(c => c.key !== 'All').map((cat, i) => {
                    const Icon = cat.icon
                    const count = services.filter(s => s.category === cat.key).length
                    const isActive = activeCategory === cat.key
                    return (
                      <motion.button
                        key={cat.key}
                        onClick={() => {
                          setActiveCategory(cat.key)
                          document.getElementById('service-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }}
                        whileHover={{ y: -2 }}
                        className={`relative text-left p-3 rounded-xl border transition-all duration-300 ${
                          isActive
                            ? 'bg-[#152D4F] border-[#152D4F] text-white'
                            : 'bg-[#F7F9FC] border-gray-200 hover:border-[#E8751A]/40 hover:bg-white'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-2 ${isActive ? 'text-[#E8751A]' : 'text-[#152D4F]'}`} />
                        <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-[#152D4F]'}`}>
                          {cat.label}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${isActive ? 'text-white/60' : 'text-gray-400'}`}>
                          {count} {count === 1 ? 'service' : 'services'}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Bottom CTA strip */}
                <button
                  onClick={() => navigate('contact')}
                  className="mt-5 w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#E8751A] hover:bg-[#D4691A] text-white font-semibold text-sm transition-colors group"
                >
                  <span>Not sure what you need?</span>
                  <span className="flex items-center gap-1">
                    Ask an expert
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-4 -left-4 lg:-left-8 bg-white rounded-xl shadow-lg shadow-gray-200/60 px-4 py-2.5 border border-gray-100 flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold text-[#152D4F]">ISO-certified delivery</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MAIN — Sticky sidebar + bento grid
          ════════════════════════════════════════════════════════════ */}
      <section id="service-grid" className="py-14 lg:py-20 bg-white scroll-mt-20">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
            {/* ─── LEFT: Sticky sidebar ─── */}
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Search */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Try 'solar' or 'substation'..."
                      className="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border border-gray-200 bg-[#F7F9FC] focus:bg-white focus:border-[#E8751A] focus:outline-none focus:ring-2 focus:ring-[#E8751A]/15 transition-all"
                    />
                    {query && (
                      <button
                        onClick={() => setQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Category list */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">Categories</label>
                  <div className="space-y-1">
                    {categoryConfig.map(cat => {
                      const Icon = cat.icon
                      const isActive = activeCategory === cat.key
                      const count = cat.key === 'All'
                        ? services.length
                        : services.filter(s => s.category === cat.key).length
                      return (
                        <button
                          key={cat.key}
                          onClick={() => setActiveCategory(cat.key)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-300 group ${
                            isActive
                              ? 'bg-[#152D4F] text-white shadow-md shadow-[#152D4F]/15'
                              : 'hover:bg-[#F7F9FC] text-gray-600'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isActive ? 'bg-[#E8751A]' : 'bg-gray-100 group-hover:bg-gray-200'
                          }`}>
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#152D4F]'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-[#152D4F]'}`}>
                              {cat.label}
                            </div>
                            <div className={`text-[11px] truncate ${isActive ? 'text-white/60' : 'text-gray-400'}`}>
                              {cat.desc}
                            </div>
                          </div>
                          <span className={`text-xs font-bold ${isActive ? 'text-[#E8751A]' : 'text-gray-300'}`}>
                            {count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Help card */}
                <div className="rounded-xl p-4 bg-gradient-to-br from-[#152D4F] to-[#1B3A5C] text-white">
                  <Phone className="w-5 h-5 text-[#E8751A] mb-2" />
                  <div className="text-sm font-bold mb-1">Need a custom scope?</div>
                  <div className="text-xs text-white/60 mb-3 leading-relaxed">
                    Our engineers will assemble the right combination of services for your plant.
                  </div>
                  <button
                    onClick={() => navigate('contact')}
                    className="text-xs font-semibold text-[#E8751A] hover:underline inline-flex items-center gap-1"
                  >
                    Talk to engineering <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </aside>

            {/* ─── RIGHT: Bento grid ─── */}
            <div className="lg:col-span-9">
              {/* Result bar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-[#152D4F]">
                    {activeCategory === 'All' ? 'All Services' : activeCategory}
                  </h2>
                  <Badge className="bg-[#E8751A]/10 text-[#E8751A] border border-[#E8751A]/20 text-xs font-bold rounded-md">
                    {activeCount} {activeCount === 1 ? 'result' : 'results'}
                  </Badge>
                </div>
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="text-xs text-gray-500 hover:text-[#E8751A] inline-flex items-center gap-1"
                  >
                    Clear search <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Bento grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCategory}-${query}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[minmax(260px,auto)]"
                >
                  {filteredServices.map((s, i) => {
                    const Icon = iconMap[s.name] || PenTool
                    const isFeatured = Boolean(s.featured) && activeCategory === 'All' && !query
                    return (
                      <ServiceBentoCard
                        key={s.id}
                        service={s}
                        icon={Icon}
                        index={i}
                        isFeatured={isFeatured}
                        isHovered={hoveredId === s.id}
                        onHover={(h) => setHoveredId(h ? s.id : null)}
                        onClick={() => navigate('service-detail', { slug: s.slug })}
                      />
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
                    <Search className="w-7 h-7 text-gray-400" />
                  </div>
                  <p className="text-[#152D4F] text-lg font-semibold mb-1">No services match your search</p>
                  <p className="text-gray-500 text-sm mb-4">Try a different keyword or clear the filter.</p>
                  <button
                    onClick={() => { setQuery(''); setActiveCategory('All') }}
                    className="text-[#E8751A] text-sm font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Reset filters <X className="w-3 h-3" />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          PROCESS — How we deliver
          ════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-[#F7F9FC] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#1B3A5C 1px, transparent 1px), linear-gradient(90deg, #1B3A5C 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }} />
        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 mb-10 items-end">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-8 h-px bg-[#E8751A]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8751A]">Delivery Model</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#152D4F] leading-tight">
                Four moves from <span className="text-[#E8751A]">scope</span> to <span className="text-[#E8751A]">sustain</span>.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-gray-500 leading-relaxed">
                Every service we offer follows the same disciplined delivery arc — so whether you engage us for a single audit or a 400 kV greenfield switchyard, you get predictability, traceability and accountability.
              </p>
            </div>
          </div>

          {/* Process steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {processSteps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#E8751A]/30 hover:shadow-lg hover:shadow-gray-200/50 transition-all group"
                >
                  {/* Big faded number */}
                  <div className="absolute top-4 right-5 text-5xl font-bold text-gray-100 group-hover:text-[#E8751A]/10 transition-colors">
                    {step.n}
                  </div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#152D4F] flex items-center justify-center mb-4 group-hover:bg-[#E8751A] transition-colors">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#152D4F] mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>

                  {/* Connector arrow */}
                  {i < processSteps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-gray-200 items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-[#E8751A]" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          INDUSTRIES MARQUEE
          ════════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-white border-y border-gray-100">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-[#E8751A]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8751A]">Industries We Power</span>
              <span className="w-8 h-px bg-[#E8751A]" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#152D4F]">
              Trusted across {industries.length} verticals
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            {industries.map((ind, i) => (
              <motion.span
                key={ind}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="px-4 py-2 rounded-full bg-[#F7F9FC] border border-gray-200 text-sm font-semibold text-[#152D4F] hover:border-[#E8751A]/40 hover:bg-white hover:text-[#E8751A] transition-all cursor-default"
              >
                {ind}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA — Split with stats
          ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#152D4F]">
        {/* Decorative coral arc */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-5 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 70%)' }} />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left — copy + CTA */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 mb-5">
                  <span className="w-8 h-px bg-[#E8751A]" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8751A]">Get Started</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                  Tell us your scope.<br />
                  <span className="text-[#E8751A]">We&apos;ll bring the rest.</span>
                </h2>
                <p className="text-white/60 leading-relaxed max-w-lg mb-7">
                  Share your site, voltage class and timeline. Within 48 hours, you&apos;ll receive a capability-mapped proposal — no obligation, no jargon.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate('contact')}
                    className="inline-flex items-center gap-2 bg-[#E8751A] hover:bg-[#D4691A] text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-lg shadow-[#E8751A]/25 group"
                  >
                    Request a proposal
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <button
                    onClick={() => navigate('projects')}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3 rounded-full transition-colors border border-white/15"
                  >
                    View past projects
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right — trust stats */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { icon: Gauge,    v: '28+',  l: 'Years in business' },
                  { icon: Workflow, v: '2000+', l: 'Projects delivered' },
                  { icon: CheckCircle2, v: '>90%', l: 'Industrial clients' },
                  { icon: Building2,    v: '11',   l: 'States served' },
                ].map((s, i) => {
                  const Icon = s.icon
                  return (
                    <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <Icon className="w-5 h-5 text-[#E8751A] mb-3" />
                      <div className="text-2xl font-bold text-white">{s.v}</div>
                      <div className="text-xs text-white/50 mt-0.5">{s.l}</div>
                    </div>
                  )
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ════════════════════════════════════════════════════════════
   BENTO CARD — supports featured (large) + regular variants
   ════════════════════════════════════════════════════════════ */
function ServiceBentoCard({
  service, icon: Icon, index, isFeatured, isHovered, onHover, onClick,
}: {
  service: StaticService
  icon: React.ComponentType<{ className?: string }>
  index: number
  isFeatured: boolean
  isHovered: boolean
  onHover: (hovered: boolean) => void
  onClick: () => void
}) {
  // Featured card: spans 2 cols + 2 rows on lg, shows big image + overlay
  if (isFeatured) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: index * 0.05 }}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onClick={onClick}
        className="group relative sm:col-span-2 lg:col-span-2 lg:row-span-2 text-left overflow-hidden rounded-2xl bg-[#152D4F] cursor-pointer min-h-[300px] lg:min-h-[540px]"
      >
        {/* Image */}
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1D3A] via-[#0D1D3A]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1D3A]/70 via-transparent to-transparent" />

        {/* Coral corner accent */}
        <div className="absolute top-5 right-5 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-[#E8751A] text-white text-[11px] font-bold uppercase tracking-wider">
            Featured
          </span>
        </div>

        {/* Top-left: category */}
        <div className="absolute top-5 left-5">
          <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-[11px] font-semibold border border-white/20">
            {service.category}
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="w-14 h-14 rounded-2xl bg-[#E8751A] flex items-center justify-center mb-4 shadow-lg shadow-[#E8751A]/30">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
            {service.name}
          </h3>
          <p className="text-white/70 leading-relaxed mb-5 max-w-md line-clamp-3">
            {service.description}
          </p>

          {/* Capabilities preview */}
          <div className="flex flex-wrap gap-1.5 mb-5 max-h-20 overflow-hidden">
            {service.capabilities.slice(0, 4).map((c, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-sm text-white/80 text-[11px] border border-white/10">
                {c.length > 28 ? c.slice(0, 28) + '…' : c}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/15">
            <span className="text-sm text-white/60">
              {service.capabilities.length} capabilities
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E8751A] group-hover:gap-2.5 transition-all">
              Explore service
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </motion.button>
    )
  }

  // Regular card: image-top with hover overlay showing capabilities preview
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onClick}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-2xl border border-gray-200 hover:border-[#E8751A]/40 hover:shadow-xl hover:shadow-gray-200/60 transition-all cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Image with overlay */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1D3A]/80 via-[#0D1D3A]/20 to-transparent" />

        {/* Category chip */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-[#152D4F] text-[10px] font-bold uppercase tracking-wider">
            {service.category}
          </span>
        </div>

        {/* Icon badge */}
        <div className="absolute -bottom-5 right-4 w-10 h-10 rounded-xl bg-[#E8751A] flex items-center justify-center shadow-lg shadow-[#E8751A]/30 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-7 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-[#152D4F] mb-2 leading-snug group-hover:text-[#E8751A] transition-colors">
          {service.name}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">
          {service.description}
        </p>

        {/* Capabilities hover preview */}
        <div className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: isHovered ? '120px' : '0px' }}
        >
          <div className="pt-3 border-t border-gray-100 space-y-1.5">
            {service.capabilities.slice(0, 3).map((c, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[11px] text-gray-500">
                <CheckCircle2 className="w-3 h-3 text-[#E8751A] mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{c}</span>
              </div>
            ))}
            {service.capabilities.length > 3 && (
              <div className="text-[11px] font-semibold text-[#E8751A] pl-4">
                +{service.capabilities.length - 3} more
              </div>
            )}
          </div>
        </div>

        {/* Default footer (when not hovered) */}
        <div className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: isHovered ? '0px' : '60px', opacity: isHovered ? 0 : 1 }}
        >
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-400">
              {service.capabilities.length} capabilities
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#152D4F] group-hover:text-[#E8751A] transition-colors">
              View
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
