'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  ChevronRight, ArrowRight, ArrowUpRight, PenTool, Hammer, FlaskConical,
  BarChart3, ShieldCheck, FileCheck, Building2, Sun,
  Zap, Wrench, Network, Factory, Boxes, Plus, Minus,
  Cpu, Award, ScrollText, Layers,
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
  tagline: string
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
    tagline: 'From concept to commissioning — engineered to standard.',
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
    tagline: 'On schedule. On budget. On standard.',
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
    tagline: 'NABL-accredited. Every parameter verified.',
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
    tagline: 'Measure. Analyse. Optimise.',
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
    tagline: '150+ technicians. 16+ years. Zero downtime.',
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
    tagline: 'Statutory approvals, handled end-to-end.',
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
    tagline: 'Grid connectivity across four state utilities.',
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
    tagline: 'From 10 kW rooftops to 100 MW farms.',
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
    tagline: 'One contract. Full accountability.',
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
    tagline: 'Up to 400 kV — AIS & GIS.',
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
    tagline: 'Greenfield, brownfield, retrofit.',
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
    tagline: 'In-house. IEC-61439 certified.',
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

/* ─── Category config ─── */
type CategoryKey = 'All' | 'Engineering' | 'EPC' | 'Manufacturing' | 'Maintenance' | 'Liaison' | 'Renewable'

const categoryConfig: { key: CategoryKey; label: string; short: string }[] = [
  { key: 'All',           label: 'All Services', short: 'All' },
  { key: 'Engineering',   label: 'Engineering',  short: 'ENG' },
  { key: 'EPC',            label: 'EPC',          short: 'EPC' },
  { key: 'Manufacturing', label: 'Manufacturing', short: 'MFG' },
  { key: 'Maintenance',   label: 'Maintenance',  short: 'AMC' },
  { key: 'Liaison',       label: 'Liaison',      short: 'LIA' },
  { key: 'Renewable',     label: 'Renewable',    short: 'SOL' },
]

/* ─── Standards strip ─── */
const standards = [
  { code: 'IEEE-80',    label: 'Earth Mat Design' },
  { code: 'IS-2309',    label: 'Lightning System' },
  { code: 'NABL',       label: 'Accredited Testing' },
  { code: 'IEC-61439',  label: 'Panel Manufacturing' },
  { code: 'IS-3427',    label: 'HT Switchgear' },
  { code: '400 kV',     label: 'Voltage Class' },
]

export default function ServicesPage() {
  const { navigate } = useRouter()
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('All')
  const [activeId, setActiveId] = useState<string>(services[0].id)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredServices = useMemo(() => {
    if (activeCategory === 'All') return services
    return services.filter(s => s.category === activeCategory)
  }, [activeCategory])

  // Ensure activeId is valid within the filtered list
  const activeService = useMemo(() => {
    const found = filteredServices.find(s => s.id === activeId)
    return found || filteredServices[0] || services[0]
  }, [filteredServices, activeId])

  // Reset activeId when category changes
  const handleCategoryChange = (cat: CategoryKey) => {
    setActiveCategory(cat)
    const newFiltered = cat === 'All' ? services : services.filter(s => s.category === cat)
    if (newFiltered.length > 0) setActiveId(newFiltered[0].id)
  }

  const ActiveIcon = iconMap[activeService.name] || PenTool
  const activeIndex = filteredServices.findIndex(s => s.id === activeService.id)

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          HERO — Cinematic full-bleed with manifesto
          ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0D1D3A]">
        {/* Background image with heavy overlay */}
        <div className="absolute inset-0">
          <Image
            src={services[0].image}
            alt=""
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0D1D3A] via-[#0D1D3A]/85 to-[#152D4F]/90" />
        </div>

        {/* Decorative coral glow */}
        <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none opacity-10"
          style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 65%)' }} />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 pt-[110px] pb-20 lg:pb-28">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm mb-12"
          >
            <button onClick={() => navigate('home')} className="text-white/40 hover:text-white/70 transition-colors">
              Home
            </button>
            <ChevronRight className="w-4 h-4 text-white/20" />
            <span className="text-[#E8751A] font-semibold">Services</span>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8 items-end">
            {/* Left — Big manifesto */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="h-px w-12 bg-[#E8751A]" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#E8751A]">Capabilities</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-4xl sm:text-5xl lg:text-[4.5rem] font-bold text-white leading-[1.02] tracking-tight mb-6"
              >
                We engineer power.
                <br />
                <span className="text-[#E8751A]">You stay switched on.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-lg text-white/55 leading-relaxed max-w-2xl"
              >
                Twelve specialised services — from 400 kV switchyard design to rooftop solar — delivered by a single, accountable partner. Hover any service in the index to bring it into focus.
              </motion.p>
            </div>

            {/* Right — counter */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-4 lg:text-right"
            >
              <div className="inline-block">
                <div className="text-[7rem] lg:text-[9rem] font-bold leading-none text-[#E8751A]/15">
                  {String(services.length).padStart(2, '0')}
                </div>
                <div className="text-sm font-semibold text-white/60 -mt-4 lg:-mt-6">
                  services under one roof
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Standards strip at bottom of hero */}
        <div className="relative border-t border-white/10 bg-[#0A1730]/60 backdrop-blur-sm">
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-4">
            <div className="flex items-center gap-4 lg:gap-6 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 flex-shrink-0">
                Built to
              </span>
              {standards.map((s, i) => (
                <div key={i} className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-bold text-[#E8751A]">{s.code}</span>
                  <span className="text-xs text-white/50 hidden sm:inline">{s.label}</span>
                  {i < standards.length - 1 && <span className="text-white/15 ml-2">/</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MAIN — Magazine Menu + Spotlight (interactive two-panel)
          ════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-[#F7F9FC]">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          {/* Section heading */}
          <div className="grid lg:grid-cols-12 gap-6 mb-10 items-end">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-3">
                <Layers className="w-4 h-4 text-[#E8751A]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8751A]">The Index</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#152D4F] leading-tight">
                Every capability, in focus.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-gray-500 leading-relaxed text-sm">
                Hover a service on the left to bring it into the spotlight on the right. Click through for full capabilities, standards, and case notes.
              </p>
            </div>
          </div>

          {/* Category filter row */}
          <div className="flex flex-wrap items-center gap-2 mb-8 pb-6 border-b border-gray-200">
            {categoryConfig.map(cat => {
              const isActive = activeCategory === cat.key
              const count = cat.key === 'All'
                ? services.length
                : services.filter(s => s.category === cat.key).length
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-[#152D4F] text-white shadow-md shadow-[#152D4F]/15'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#E8751A]/40 hover:text-[#152D4F]'
                  }`}
                >
                  <span className={`text-[10px] font-bold ${isActive ? 'text-[#E8751A]' : 'text-gray-400'}`}>
                    {cat.short}
                  </span>
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/15 text-white/80' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Two-panel: index list + spotlight */}
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
            {/* ─── LEFT: Numbered index list ─── */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* List header */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-[#152D4F]">
                  <div className="flex items-center gap-2">
                    <ScrollText className="w-4 h-4 text-[#E8751A]" />
                    <span className="text-sm font-bold text-white">Service Index</span>
                  </div>
                  <span className="text-xs text-white/50">
                    {String(filteredServices.length).padStart(2, '0')} listed
                  </span>
                </div>

                {/* The list */}
                <div className="divide-y divide-gray-100">
                  {filteredServices.map((s, i) => {
                    const Icon = iconMap[s.name] || PenTool
                    const isActive = s.id === activeService.id
                    const num = String(i + 1).padStart(2, '0')
                    return (
                      <button
                        key={s.id}
                        onMouseEnter={() => setActiveId(s.id)}
                        onClick={() => navigate('service-detail', { slug: s.slug })}
                        className={`group w-full flex items-center gap-4 px-5 py-4 text-left transition-all duration-300 ${
                          isActive
                            ? 'bg-[#F0F4F8] border-l-4 border-l-[#E8751A]'
                            : 'border-l-4 border-l-transparent hover:bg-gray-50'
                        }`}
                      >
                        {/* Number */}
                        <span className={`text-2xl font-bold tabular-nums transition-colors ${
                          isActive ? 'text-[#E8751A]' : 'text-gray-300 group-hover:text-gray-400'
                        }`}>
                          {num}
                        </span>

                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-[#152D4F]'
                            : 'bg-gray-100 group-hover:bg-gray-200'
                        }`}>
                          <Icon className={`w-4 h-4 transition-colors ${
                            isActive ? 'text-white' : 'text-[#152D4F]'
                          }`} />
                        </div>

                        {/* Name + category */}
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-bold leading-tight transition-colors ${
                            isActive ? 'text-[#152D4F]' : 'text-[#152D4F] group-hover:text-[#E8751A]'
                          }`}>
                            {s.name}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            {s.category} · {s.capabilities.length} capabilities
                          </div>
                        </div>

                        {/* Arrow */}
                        <ArrowUpRight className={`w-4 h-4 transition-all ${
                          isActive
                            ? 'text-[#E8751A] opacity-100 translate-x-0'
                            : 'text-gray-300 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0'
                        }`} />
                      </button>
                    )
                  })}
                </div>

                {/* List footer */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Hover to preview · Click to explore</span>
                  <button
                    onClick={() => navigate('contact')}
                    className="text-xs font-semibold text-[#E8751A] hover:underline inline-flex items-center gap-1"
                  >
                    Need help choosing? <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* ─── RIGHT: Spotlight detail panel ─── */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-6"
                >
                  {/* Big image header */}
                  <div className="relative h-64 lg:h-72 overflow-hidden">
                    <Image
                      src={activeService.image}
                      alt={activeService.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1D3A] via-[#0D1D3A]/40 to-transparent" />

                    {/* Category + index chip */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-[#E8751A] text-white text-[10px] font-bold uppercase tracking-wider">
                        {activeService.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-sm text-white text-[10px] font-bold border border-white/20">
                        {String(activeIndex + 1).padStart(2, '0')} / {String(filteredServices.length).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Big faded number */}
                    <div className="absolute top-2 right-4 text-[7rem] lg:text-[9rem] font-bold text-white/10 leading-none pointer-events-none">
                      {String(activeIndex + 1).padStart(2, '0')}
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                      <div className="w-12 h-12 rounded-xl bg-[#E8751A] flex items-center justify-center mb-3 shadow-lg shadow-[#E8751A]/30">
                        <ActiveIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight mb-1">
                        {activeService.name}
                      </h3>
                      <p className="text-sm text-[#E8751A] font-semibold">
                        {activeService.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 lg:p-6">
                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed mb-5">
                      {activeService.description}
                    </p>

                    {/* Capabilities — expandable accordion */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-[#152D4F]" />
                          <span className="text-sm font-bold text-[#152D4F]">
                            Capabilities
                          </span>
                          <span className="text-xs text-gray-400">
                            ({activeService.capabilities.length})
                          </span>
                        </div>
                        <button
                          onClick={() => setExpandedId(expandedId === activeService.id ? null : activeService.id)}
                          className="text-xs font-semibold text-[#E8751A] hover:underline inline-flex items-center gap-1"
                        >
                          {expandedId === activeService.id ? (
                            <>Collapse <Minus className="w-3 h-3" /></>
                          ) : (
                            <>Expand all <Plus className="w-3 h-3" /></>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeService.capabilities.slice(0, expandedId === activeService.id ? undefined : 4).map((c, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.04 }}
                            className="flex items-start gap-2 p-2.5 rounded-lg bg-[#F7F9FC] border border-gray-100"
                          >
                            <span className="w-5 h-5 rounded flex items-center justify-center bg-[#152D4C] text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="text-xs text-gray-700 leading-snug">{c}</span>
                          </motion.div>
                        ))}
                      </div>

                      {activeService.capabilities.length > 4 && expandedId !== activeService.id && (
                        <div className="mt-2 text-xs text-gray-400 text-center">
                          + {activeService.capabilities.length - 4} more capabilities
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => navigate('service-detail', { slug: activeService.slug })}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#152D4F] hover:bg-[#0D1D3A] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm group"
                      >
                        Explore full service
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </button>
                      <button
                        onClick={() => navigate('contact')}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#E8751A] hover:bg-[#D4691A] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                      >
                        Request a quote
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STANDARDS & CERTIFICATIONS BAND
          ════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-center mb-8">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-4 h-4 text-[#E8751A]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8751A]">Compliance & Standards</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#152D4F] leading-tight">
                Every service is engineered to a standard you can audit.
              </h2>
            </div>
            <div className="lg:col-span-6">
              <p className="text-gray-500 leading-relaxed text-sm">
                We don&apos;t just deliver — we document. Every design, test, and install is traceable to a recognised national or international standard, signed off by accredited engineers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {standards.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group relative bg-[#F7F9FC] border border-gray-200 rounded-xl p-4 hover:border-[#E8751A]/40 hover:bg-white transition-all text-center"
              >
                <div className="text-base font-bold text-[#152D4F] group-hover:text-[#E8751A] transition-colors">
                  {s.code}
                </div>
                <div className="text-[11px] text-gray-500 mt-1 leading-snug">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA — Minimal dark
          ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#152D4F]">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 65%)' }} />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-5 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 65%)' }} />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 py-16 lg:py-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-12 bg-[#E8751A]" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#E8751A]">Ready When You Are</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-5">
                One conversation away from a single-source electrical partner.
              </h2>
              <p className="text-white/55 leading-relaxed mb-8 max-w-lg">
                Tell us your voltage class, site, and timeline. Within 48 hours, you&apos;ll get a capability-mapped proposal — engineered, costed, and accountable.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('contact')}
                  className="inline-flex items-center gap-2 bg-[#E8751A] hover:bg-[#D4691A] text-white font-semibold px-7 py-3 rounded-full transition-colors shadow-lg shadow-[#E8751A]/25 group"
                >
                  Start a conversation
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => navigate('projects')}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-7 py-3 rounded-full transition-colors border border-white/15"
                >
                  See delivered projects
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
