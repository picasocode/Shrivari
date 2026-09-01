'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  ChevronRight, ArrowRight, Check, PenTool, Hammer, FlaskConical,
  BarChart3, ShieldCheck, FileCheck, Building2, Sun,
  Zap, Network, Factory, Boxes, Plus,
  Layers, ArrowUpRight, Phone, MapPin, Sparkles, Globe2,
} from 'lucide-react'
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
    name: 'Liaison with Utilities',
    slug: 'liasion-utilities',
    description: 'Expert utility liaison services for power supply and grid connectivity across multiple state utilities including TNEB, KPTCL, APTRANSCO, and TSTRANSCO — TNPPCL, TNPGCL, TANTRANSCO, APSPDCL, APEPDCL, TSSPDCL, TSTRANSCO, OPTCL, OPDCL, BUSCOM and GMR Aerocity Goa.',
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
    tagline: 'Grid connectivity across 13 state utilities.',
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
  'Liaison with Utilities': Building2,
  'Solar Works': Sun,
  'Electrical EPC Solutions': Network,
  'EHV / HV Substations': Zap,
  'Industrial Electrification': Factory,
  'HT & LT Panel Manufacturing': Boxes,
}

/* ─── Category config ─── */
type CategoryKey = 'All' | 'Engineering' | 'EPC' | 'Manufacturing' | 'Maintenance' | 'Liaison' | 'Renewable'

const categoryConfig: { key: CategoryKey; label: string; short: string }[] = [
  { key: 'All',           label: 'All Services',  short: 'ALL' },
  { key: 'Engineering',   label: 'Engineering',   short: 'ENG' },
  { key: 'EPC',            label: 'EPC',           short: 'EPC' },
  { key: 'Manufacturing', label: 'Manufacturing', short: 'MFG' },
  { key: 'Maintenance',   label: 'Maintenance',   short: 'AMC' },
  { key: 'Liaison',       label: 'Liaison',       short: 'LIA' },
  { key: 'Renewable',     label: 'Renewable',     short: 'SOL' },
]

/* ─── Standards detail (for standards section) ─── */
const standardsDetail = [
  { code: 'IEEE-80',    label: 'Earth Mat Design',     desc: 'Substation grounding & step/touch voltage safety', services: ['Design & Engineering', 'EHV / HV Substations'] },
  { code: 'IS-2309',    label: 'Lightning System',     desc: 'Lightning protection & air termination design',     services: ['Design & Engineering', 'Industrial Electrification'] },
  { code: 'NABL',       label: 'Accredited Testing',    desc: 'Calibrated lab tests for CT/PT up to 33 kV',         services: ['Testing & Commissioning', 'Energy & Harmonic Audit'] },
  { code: 'IEC-61439',  label: 'Panel Manufacturing',   desc: 'Low-voltage switchgear assemblies & routine tests', services: ['HT & LT Panel Manufacturing', 'Industrial Electrification'] },
  { code: 'IS-3427',    label: 'HT Switchgear',        desc: 'High-voltage switchgear assemblies ≥ 1 kV',          services: ['EHV / HV Substations', 'HT & LT Panel Manufacturing'] },
  { code: '400 kV',     label: 'Voltage Class',         desc: 'Highest system voltage we engineer & execute',      services: ['Design & Engineering', 'EHV / HV Substations', 'Electrical EPC Solutions'] },
]

/* ─── Process steps (horizontal flow) ─── */
const processSteps = [
  { title: 'Discover',   desc: 'Site walk-down, scope alignment, statutory constraints',  icon: MapPin },
  { title: 'Design',     desc: 'SLDs, layouts, earth mat, protection coordination',       icon: PenTool },
  { title: 'Execute',    desc: 'Procurement, installation, testing, commissioning',       icon: Hammer },
  { title: 'Sustain',    desc: 'AMC, condition monitoring, audits, retrofits',            icon: ShieldCheck },
]

/* ─── Industries served ─── */
const industries = [
  'Cement', 'Steel', 'Petrochemical', 'Power Utility', 'Automotive', 'Data Center',
  'Pharma', 'Textile', 'Food & Beverage', 'Infrastructure', 'Renewable IPP', 'Commercial Real Estate',
]

/* ─── Phone helper ─── */
function telLink(phone: string): string {
  const cleaned = phone.replace(/[\s\-]/g, '')
  if (cleaned.startsWith('+')) return `tel:${cleaned}`
  if (cleaned.length === 10) return `tel:+91${cleaned}`
  return `tel:${cleaned}`
}

/* ═══════════════════════════════════════════════════════════
   ServiceShowcase sub-component
   Alternating full-width row: image on one side, content on other
   ═══════════════════════════════════════════════════════════ */
function ServiceShowcase({
  service,
  index,
  onExplore,
  onQuote,
}: {
  service: StaticService
  index: number
  onExplore: () => void
  onQuote: () => void
}) {
  const Icon = iconMap[service.name] || PenTool
  const isEven = index % 2 === 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center py-12 lg:py-16 border-t border-gray-100 first:border-t-0"
    >
      {/* IMAGE — alternating side */}
      <div className={`relative ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl shadow-[#152D4F]/8 group">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1D3A]/40 via-transparent to-transparent" />

          {/* Category chip on image */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/95 backdrop-blur-sm text-[#152D4F] text-[10px] font-bold uppercase tracking-wider shadow-sm">
              <Icon className="w-3 h-3 text-[#E8751A]" />
              {service.category}
            </span>
          </div>

          {/* Tagline at bottom of image */}
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white text-sm font-semibold italic drop-shadow-md">
              &ldquo;{service.tagline}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT — alternating side */}
      <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
        {/* Eyebrow with icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-[#152D4F] flex items-center justify-center">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            {service.category}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-2xl lg:text-3xl font-bold text-[#152D4F] leading-tight mb-3">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-5 text-sm lg:text-base">
          {service.description}
        </p>

        {/* Capability chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {service.capabilities.slice(0, 4).map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F9FC] border border-gray-200 text-xs font-medium text-[#152D4F]"
            >
              <Check className="w-3 h-3 text-[#E8751A]" />
              {c.length > 38 ? `${c.slice(0, 38)}…` : c}
            </span>
          ))}
          {service.capabilities.length > 4 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8751A]/10 border border-[#E8751A]/30 text-xs font-semibold text-[#E8751A]">
              <Plus className="w-3 h-3" />
              {service.capabilities.length - 4} more capabilities
            </span>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 bg-[#152D4F] hover:bg-[#0D1D3A] text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm group"
          >
            Explore service
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={onQuote}
            className="inline-flex items-center gap-2 text-[#E8751A] hover:text-[#D4691A] font-semibold text-sm transition-colors"
          >
            Get a quote
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function ServicesPage() {
  const { navigate } = useRouter()
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('All')

  const filteredServices = useMemo(() => {
    if (activeCategory === 'All') return services
    return services.filter(s => s.category === activeCategory)
  }, [activeCategory])

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          HERO — Spacious split with magazine feel
          ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#F7F9FC]">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, #1B3A5C 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Coral glow accents */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none opacity-10"
          style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 65%)' }}
        />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 pt-[110px] pb-16 lg:pb-20">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm mb-10"
          >
            <button onClick={() => navigate('home')} className="text-gray-400 hover:text-[#152D4F] transition-colors">
              Home
            </button>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="text-[#E8751A] font-semibold">Services</span>
          </motion.div>

          {/* Asymmetric split — left 3 cols text, right 2 cols image */}
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center">
            {/* LEFT — Big editorial heading */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-3 mb-5"
              >
                <span className="h-px w-12 bg-[#E8751A]" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#E8751A]">
                  What we do
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-4xl sm:text-5xl lg:text-[4rem] font-bold text-[#152D4F] leading-[1.05] tracking-tight mb-6"
              >
                One partner.
                <br />
                Twelve services.
                <br />
                <span className="text-[#E8751A]">Zero hand-offs.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-xl mb-8"
              >
                From 400 kV switchyard design to rooftop solar, every electrical scope is delivered by a single, accountable team — engineering, EPC, manufacturing, liaison, and maintenance under one roof.
              </motion.p>

              {/* Inline stats strip */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-wrap items-center gap-6 lg:gap-8 mb-8"
              >
                {[
                  { v: '400', u: 'kV' },
                  { v: '2000', u: '+ Projects' },
                  { v: '28', u: '+ Years' },
                ].map((s, i) => (
                  <div key={i} className="flex items-baseline gap-2">
                    <span className="text-3xl lg:text-4xl font-bold text-[#152D4F] tabular-nums">
                      {s.v}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {s.u}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex flex-wrap items-center gap-3"
              >
                <button
                  onClick={() => navigate('contact')}
                  className="inline-flex items-center gap-2 bg-[#E8751A] hover:bg-[#D4691A] text-white font-semibold px-7 py-3 rounded-full transition-colors shadow-lg shadow-[#E8751A]/25 group"
                >
                  Talk to an engineer
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => navigate('projects')}
                  className="inline-flex items-center gap-2 text-[#152D4F] hover:text-[#E8751A] font-semibold text-sm transition-colors group"
                >
                  See delivered projects
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </motion.div>
            </div>

            {/* RIGHT — Tall portrait image with overlay */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2 relative"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-[#152D4F]/15">
                <Image
                  src={services[0].image}
                  alt="Electrical engineering"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1D3A] via-[#0D1D3A]/20 to-transparent" />

                {/* Floating badge top */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/95 backdrop-blur-sm text-[#152D4F] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    <Sparkles className="w-3 h-3 text-[#E8751A]" />
                    ISO-certified delivery
                  </span>
                </div>

                {/* Bottom overlay — count + tagline */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-[5rem] font-bold text-white/15 leading-none mb-1">
                    12
                  </div>
                  <p className="text-white text-lg font-bold leading-tight">
                    services under one roof
                  </p>
                  <p className="text-[#E8751A] text-xs font-semibold uppercase tracking-wider mt-1">
                    Single-source electrical partner
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STICKY CATEGORY FILTER STRIP
          ════════════════════════════════════════════════════════════ */}
      <section className="sticky top-[72px] z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-3.5">
          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400 flex-shrink-0">
              <Layers className="w-3.5 h-3.5" />
              Filter
            </span>
            <div className="flex items-center gap-2 flex-wrap flex-1">
              {categoryConfig.map(cat => {
                const isActive = activeCategory === cat.key
                const count = cat.key === 'All'
                  ? services.length
                  : services.filter(s => s.category === cat.key).length
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-[#152D4F] text-white shadow-md shadow-[#152D4F]/15'
                        : 'bg-[#F7F9FC] text-gray-600 border border-gray-200 hover:border-[#E8751A]/40 hover:text-[#152D4F]'
                    }`}
                  >
                    <span className={`text-[9px] font-bold ${isActive ? 'text-[#E8751A]' : 'text-gray-400'}`}>
                      {cat.short}
                    </span>
                    <span>{cat.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/15 text-white/80' : 'bg-white text-gray-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          ALTERNATING SHOWCASE SECTIONS — Each service gets a full-width row
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-14 lg:py-20">
          {/* Section intro */}
          <div className="grid lg:grid-cols-12 gap-6 mb-12 items-end">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-3">
                <Layers className="w-4 h-4 text-[#E8751A]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8751A]">
                  The Catalogue
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#152D4F] leading-tight">
                {activeCategory === 'All'
                  ? 'Every service, in editorial detail.'
                  : `${categoryConfig.find(c => c.key === activeCategory)?.label} capabilities.`}
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-gray-500 leading-relaxed text-sm">
                Each capability below is delivered by an in-house team — no sub-contracted scope, no finger-pointing. Click any service for full capabilities, standards, and process.
              </p>
            </div>
          </div>

          {/* The showcase list */}
          {filteredServices.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">No services in this category yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredServices.map((s, i) => (
                <ServiceShowcase
                  key={s.id}
                  service={s}
                  index={i}
                  onExplore={() => navigate('service-detail', { slug: s.slug })}
                  onQuote={() => navigate('contact')}
                />
              ))}
            </div>
          )}

          {/* Inline helper */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Not sure which service fits your scope? Our engineers will map it for you.
            </p>
            <button
              onClick={() => navigate('contact')}
              className="inline-flex items-center gap-2 text-[#E8751A] hover:text-[#D4691A] font-semibold text-sm transition-colors"
            >
              Ask an expert <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STANDARDS & COMPLIANCE — Detailed cards
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#F7F9FC] py-16 lg:py-20 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          {/* Heading */}
          <div className="grid lg:grid-cols-12 gap-6 mb-10 items-end">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-4 h-4 text-[#E8751A]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8751A]">
                  Compliance & Standards
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#152D4F] leading-tight">
                Engineered to standards you can audit.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-gray-500 leading-relaxed text-sm">
                Every design, test, and install is traceable to a recognised national or international standard, signed off by accredited engineers.
              </p>
            </div>
          </div>

          {/* Standards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {standardsDetail.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-[#E8751A]/40 hover:shadow-lg hover:shadow-[#152D4F]/5 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-lg font-bold text-[#152D4F] group-hover:text-[#E8751A] transition-colors">
                      {s.code}
                    </div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      {s.label}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#152D4F]/5 flex items-center justify-center group-hover:bg-[#E8751A]/10 transition-colors">
                    <ShieldCheck className="w-4 h-4 text-[#152D4F] group-hover:text-[#E8751A] transition-colors" />
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  {s.desc}
                </p>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Applied in
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.services.map((svc, j) => (
                      <span key={j} className="text-[10px] font-medium text-[#152D4F] bg-[#F7F9FC] border border-gray-200 px-2 py-0.5 rounded">
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          PROCESS TIMELINE — Horizontal 4-step flow
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-6 mb-10 items-end">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-3">
                <Hammer className="w-4 h-4 text-[#E8751A]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8751A]">
                  Delivery Model
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#152D4F] leading-tight">
                Four moves from scope to sustain.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-gray-500 leading-relaxed text-sm">
                The same in-house team walks your project from the first site walk-down to the AMC renewal — no hand-offs, no re-explaining.
              </p>
            </div>
          </div>

          {/* Process grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden lg:block absolute top-9 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent pointer-events-none" />

            {processSteps.map((step, i) => {
              const StepIcon = step.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Number badge */}
                  <div className="relative z-10 w-18 h-18 mx-auto mb-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-white border-2 border-gray-100 flex items-center justify-center group hover:border-[#E8751A] hover:bg-[#E8751A] transition-all duration-300">
                      <StepIcon className="w-6 h-6 text-[#152D4F] group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="text-center px-2">
                    <h3 className="text-base font-bold text-[#152D4F] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          INDUSTRIES MARQUEE
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0D1D3A] py-14 lg:py-16 relative overflow-hidden">
        {/* Decorative coral glow */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -left-32 w-[400px] h-[400px] rounded-full pointer-events-none opacity-10"
          style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 65%)' }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -right-32 w-[400px] h-[400px] rounded-full pointer-events-none opacity-10"
          style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 65%)' }}
        />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Globe2 className="w-4 h-4 text-[#E8751A]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8751A]">
                  Industries we power
                </span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                Trusted across 12 verticals.
              </h2>
            </div>
            <p className="text-white/50 text-sm max-w-md">
              Cement, steel, pharma, data centers, renewables — anywhere reliable power is mission-critical.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {industries.map((ind, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium hover:border-[#E8751A]/50 hover:bg-[#E8751A]/5 transition-all cursor-default"
              >
                {ind}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA — Spacious split with quick contact
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#152D4F] relative overflow-hidden">
        {/* Decorative glows */}
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none opacity-10"
          style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 65%)' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none opacity-5"
          style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 65%)' }}
        />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left — Heading + CTAs */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-px w-12 bg-[#E8751A]" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#E8751A]">
                    Ready when you are
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-5">
                  One conversation away from a single-source electrical partner.
                </h2>
                <p className="text-white/55 leading-relaxed mb-7 max-w-xl">
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

            {/* Right — Direct contact card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-7">
                <p className="text-xs font-bold uppercase tracking-wider text-[#E8751A] mb-4">
                  Talk directly
                </p>
                <a
                  href={telLink('9941905833')}
                  className="flex items-center gap-3 mb-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#E8751A] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Call our engineers</p>
                    <p className="text-white font-semibold group-hover:text-[#E8751A] transition-colors">
                      +91 99419 05833
                    </p>
                  </div>
                </a>
                <a
                  href="mailto:info@shri_vaari_electricals.com"
                  className="flex items-center gap-3 mb-5 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Email a brief</p>
                    <p className="text-white font-semibold group-hover:text-[#E8751A] transition-colors">
                      info@shri_vaari_electricals.com
                    </p>
                  </div>
                </a>
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#E8751A] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-white/50 mb-0.5">Corporate office</p>
                      <p className="text-xs text-white/80 leading-relaxed">
                        Plot No. 120, SIDCO Industrial Estate, Guindy, Chennai — 600032
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
