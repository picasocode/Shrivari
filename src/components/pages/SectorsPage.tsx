'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ChevronDown, ChevronRight, ArrowRight } from 'lucide-react'
import { useRouter } from '@/components/Router'

/* ═══════════════════════════════════════════════════════════
   COLOR SYSTEM (STRICT MONOCHROME + SINGLE CORAL ACCENT)
   INK: #1A1A2E
   Slate grays: slate-200 → slate-700
   Coral accent (hero badge + CTA only): #E8751A
   ═══════════════════════════════════════════════════════════ */

const INK = '#1A1A2E'
const CORAL = '#E8751A'

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

function StaggerContainer({ children, className = '', staggerDelay = 0.06 }: {
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
   SECTOR DATA — 27 sectors, monochrome treatment (no per-sector color)
   ═══════════════════════════════════════════════════════════ */

interface Sector {
  name: string
  description: string
  image: string
  clients: string[]
}

const SECTORS: Sector[] = [
  {
    name: 'Automotive & Auto Components',
    description: 'Electrical infrastructure solutions for automobile manufacturing plants, EV facilities, assembly lines, paint shops, testing facilities, robotic manufacturing systems, and auto ancillary industries.',
    image: '/images/sectors/automotive.png',
    clients: [
      'Ashok Leyland – Ennore and Hosur',
      'AIA Engineering Ltd. - Trichy',
      'Sundram Fastners Ltd – Gummidipoondi & Chennai',
      'Hanon Automotive - Chennai',
      'TVS Motors – Hosur',
      'Caparo World class facility – Jamshedpur',
      'Brakes Foundries – Solingar & Naidupet',
      'TVS Tyres - Madurai',
      'Exide Industries Limited - Hosur',
      'Apollo Tyres – Oragadam',
      'Royal Enfield – Thiruvottiyur',
      'ATG – Gangaikondan',
      'Allison Power Transformer – Oragadam',
    ],
  },
  {
    name: 'Manufacturing & Industrial Engineering',
    description: 'Complete electrical EPC solutions for heavy engineering industries, machine manufacturing units, fabrication facilities, precision engineering plants, and industrial production facilities.',
    image: '/images/sectors/manufacturing.png',
    clients: [
      'My Home Industries - Odisha',
      'Ramakrishna Titagarh Rail Wheels Limited – Poduvoyal',
      'Pou Chen Group – Ulundurpet',
      'Anugraha Valve Castings Limited',
      'Master Forging - Thiruvallur',
      'Sree Rangaraj Isapt - Perundurai',
      'Sooryadeva Street – Gummidipoondi',
      'Nippon Paint – Sriperumbudur',
      'Toaka Chemical – Tambaram',
      'M.M Forging – Viralimalai',
      'Balaji Action Buildwell Pvt Ltd - Vizag',
      'Jotham Ferro Alloys',
      'Roshil Decor - Vizag',
    ],
  },
  {
    name: 'Infrastructure & Urban Development',
    description: 'Electrical systems for infrastructure projects including smart cities, transportation facilities, metro infrastructure, public utilities, integrated townships, and government infrastructure developments.',
    image: '/images/sectors/infrastructure.png',
    clients: [
      'Apollo infrastructure – Oragadam',
      'Zelestra - Samayapuram',
      'Aryan Granites – Hosur',
    ],
  },
  {
    name: 'Commercial Buildings & Real Estate',
    description: 'Power distribution systems, substations, backup power systems, lighting systems, and energy-efficient electrical infrastructure for commercial complexes, IT parks, business centers, malls, hotels, and high-rise developments.',
    image: '/images/sectors/commercial.png',
    clients: [
      'DLF – Chennai',
      'DLF – Gachibowli – Hyderabad',
      'Shanthi Builders – Chennai',
      'Akshaya Homes – Chennai',
      'Eversendai Constructions Pvt Ltd',
      'Express Avanue – Chennai',
      'Purvankara - Chennai',
    ],
  },
  {
    name: 'Renewable Energy & Solar Infrastructure',
    description: 'Integrated electrical solutions for rooftop solar, ground-mounted solar plants, hybrid energy systems, renewable energy evacuation systems, and utility-connected renewable infrastructure.',
    image: '/images/sectors/solar.png',
    clients: [
      'Solon India Pvt Ltd - Hyderabad',
      'CtrlS Datacenters - Maharashtra',
      'JSW Energy – Tuticorin',
      'Radiance TN Sunrise one Pvt Ltd',
      'Bondada Engineering Ltd – Vellalaviduthi & Thennampatti',
      'Evolve Green Energies Pvt Ltd',
      'Clean Max Enviro Energy Solutions – Bangalore',
      'Vikram Solar',
      'Tata Power Solar – Avadi, Ambattur',
      'PV Solar - Bangalore',
      'ENZEN GLOBAL SOLUTIONS - Trichy',
      'Perniyx - Trichy',
      'Kaval Power – Bangalore',
      'Jiwi Solar – Bangalore',
      'CAPSOL Energy Private Limited – Madurai',
    ],
  },
  {
    name: 'IT Parks, Technology Campuses & Data Centers',
    description: 'Reliable power infrastructure solutions for IT campuses, software parks, R&D centers, data centers, server farms, colocation facilities, mission-critical power systems, UPS integration, redundancy systems, and backup power architecture.',
    image: '/images/sectors/datacenter.png',
    clients: [
      'CtrlS Datacenters Limited – Maharashtra',
      'Minerva Veritas Data Centre – Ambattur',
      'Sycamore Properties Private Limited - Pallikkaranai',
      'HCL',
      'Robert Bosch – Coimbatore',
      'IIT Madras Research Park – Chennai',
      'L&T Realty – Ramavaram',
      'CTS – 9 Locations',
      'TCS – Chennai',
    ],
  },
  {
    name: 'Pharmaceuticals & Healthcare',
    description: 'Electrical systems for pharmaceutical manufacturing facilities, formulation plants, clean-room environments, research laboratories, hospitals, diagnostic centers, and healthcare infrastructure.',
    image: '/images/sectors/pharma.png',
    clients: [
      'Suriyan Pharma – Chennai',
      'Orchid Pharma – Chennai',
      'Shield Health Care – Chennai',
      'Equitas Health Care Foundation – Selaiyur',
      'Til Health Care - Sricity',
      'IDBL Pharma – Ramavaram',
      'HLL Biotech - Chengalpet',
      'Delta Biopharma Pvt Ltd – Naidupet',
      'Sri Ramachandra Hospital - Chennai',
      'MIOT Hospital – Chennai',
      'Rohini Hospital – Chennai',
      'RELA Hospital – Chennai',
      'Saveetha Dental Hospital',
      'SRM – Chennai',
    ],
  },
  {
    name: 'Cement, Steel & Heavy Industries',
    description: 'Robust electrical infrastructure for cement plants, steel rolling mills, foundries, metallurgical industries, mining operations, and other heavy industrial process facilities.',
    image: '/images/sectors/cement-steel.png',
    clients: [
      'My Home Cements – Tamilnadu/Telangana/Odisha',
      'Dhandapani Cements – Tamilnadu',
      'Kobelco - Sricity',
      'Terex – Hosur',
      'Gimmco – Thiruvallur',
      'Tata Blue Scope – Sriperumbudur',
      'JSW Steel Limited – Salem',
      'SBQ Steels – Gudur',
      'Ramco Cements',
    ],
  },
  {
    name: 'Process Industries',
    description: 'Electrical engineering solutions for chemical plants, process manufacturing units, industrial processing facilities, and continuous process industries requiring high operational reliability.',
    image: '/images/sectors/manufacturing.png',
    clients: [
      'My Home Industries Private Limited - Hyderabad',
      'PCBL - Thervoy kandigai',
    ],
  },
  {
    name: 'Utilities & Power Sector',
    description: 'Substations, switchyards, utility interface systems, power evacuation infrastructure, transmission and distribution systems, and utility-grade electrical engineering solutions.',
    image: '/images/sectors/hero-sectors.png',
    clients: [
      'TNEB',
      'TNPDCL',
      'TNGECL',
      'APSPDCL',
      'TSSPDCL',
      'OPTCL',
      'KPTCL',
      'MPDCL',
    ],
  },
  {
    name: 'Oil & Gas',
    description: 'Electrical systems for refineries, terminals, storage facilities, pipeline infrastructure, gas processing facilities, and associated industrial utility systems.',
    image: '/images/sectors/oil-gas.png',
    clients: [
      'Supreme Petrochemicals – Chennai',
      'ONGC – Narimanam',
      'Manali Petrochemicals Limited - Manali',
      'CPCL - Manali',
      'ONGC – Karaikal',
      'BPCL – Cochin',
      'Tagros Chemicals Private Limited – Cuddalore',
      'Detergeo Chem Private Limited – Gummidipoondi',
      'Ultra Marine Pigments Private Limited',
    ],
  },
  {
    name: 'Petrochemical & Chemical Industries',
    description: 'Specialized electrical infrastructure for hazardous-area facilities, petrochemical processing units, specialty chemical plants, and chemical manufacturing industries.',
    image: '/images/sectors/oil-gas.png',
    clients: [
      'Chemplast Sanmar Limited – Hosur',
      'Manali Petrochemicals Limited',
      'CPCL',
      'ONGC – Karaikal',
      'BPCL Cochin',
      'Tagros Chemicals Private Limited – Cuddalore',
      'Detergeo Chem Private Limited',
      'Ultra Marine Pigments Private Limited - Naidupet',
      'Kothari Petrochemical Ltd – Manali',
      'Supreme Petrochemicals – Manali',
    ],
  },
  {
    name: 'FMCG & Consumer Goods',
    description: 'Electrical distribution systems and industrial electrification solutions for FMCG manufacturing units, packaging industries, food processing plants, and consumer goods production facilities.',
    image: '/images/sectors/manufacturing.png',
    clients: [
      'HUL – Vadamangalam - Pondicherry',
      'GRB Dairy Foods Private Limited - Hosur',
      'Hamilton Housewares Private Limited - Sricity',
      'Adyar Ananda Bhavan - Ulundurpet & Chennai',
    ],
  },
  {
    name: 'Food Processing & Beverage Industries',
    description: 'Power infrastructure for food manufacturing, cold storage facilities, beverage plants, dairy processing units, packaging lines, and hygienic processing environments.',
    image: '/images/sectors/pharma.png',
    clients: [
      'SKYGOURMET – Pallavaram',
      'Rosa Foods - Nagari',
      'GHO Diary - Villuppuram',
      'CP Aqua - Redhills',
    ],
  },
  {
    name: 'Textile & Garment Industries',
    description: 'Electrical solutions for spinning mills, weaving units, textile processing facilities, garment manufacturing units, and export-oriented textile industries.',
    image: '/images/sectors/manufacturing.png',
    clients: [
      'Loyal Textiles – Madurai',
      'Sri Kanniga Parameshwari Textiles',
      'Sri Parameshwari Spinning Mills',
      'Pachaiyappas – Kancheepuram',
      'RMKV Silks – Tirunelveli',
    ],
  },
  {
    name: 'Paper & Printing Industries',
    description: 'Power distribution and industrial electrification solutions for paper mills, packaging industries, printing facilities, and pulp processing plants.',
    image: '/images/sectors/manufacturing.png',
    clients: [
      'Cholan Paper Mills',
      'HTL Limited - Guindy',
      'BYD Electronics – Irungattukottai',
      'Delta Electronics',
      'Cholan Paper Mills - Maduranthagam',
      'TNPL - Trichy',
    ],
  },
  {
    name: 'Electronics & Electrical Manufacturing',
    description: 'Electrical infrastructure for electronics manufacturing facilities, semiconductor support infrastructure, electrical equipment manufacturing, and precision production environments.',
    image: '/images/sectors/datacenter.png',
    clients: [
      'Samsung Electronics - Sunguvachatram',
      'Tata Electronics Private Limited – Kelamangalam',
    ],
  },
  {
    name: 'Warehousing & Logistics',
    description: 'Electrical solutions for logistics parks, warehouses, cold chain facilities, fulfillment centers, industrial storage facilities, and integrated logistics infrastructure.',
    image: '/images/sectors/infrastructure.png',
    clients: [
      'Kailash Logistics – Chennai',
      'Indospace Logistics – Chennai',
      'YCH Logistics – Sungavachtram',
    ],
  },
  {
    name: 'Airports & Aviation Infrastructure',
    description: 'Power distribution systems, backup power infrastructure, lighting systems, and utility support systems for airport and aviation-related infrastructure.',
    image: '/images/sectors/infrastructure.png',
    clients: [
      'AAI – Chennai',
      'AAI – Salem',
      'AAI – Pondicherry',
      'AAI – Renigunta',
      'GMR - Goa',
    ],
  },
  {
    name: 'Railway & Transportation Infrastructure',
    description: 'Electrical systems for railway facilities, transportation terminals, depots, signaling support infrastructure, and allied transportation facilities.',
    image: '/images/sectors/infrastructure.png',
    clients: ['Projects available on request'],
  },
  {
    name: 'Ports & Marine Infrastructure',
    description: 'Industrial electrical infrastructure for ports, container terminals, marine facilities, shipyards, and coastal industrial developments.',
    image: '/images/sectors/infrastructure.png',
    clients: [
      'Kamarajar Port – Ennore',
      'Chennai Port – Chennai',
      'VOC Port - Tuticorin',
    ],
  },
  {
    name: 'Water Treatment & Environmental Infrastructure',
    description: 'Electrical systems for water treatment plants, sewage treatment plants, pumping stations, desalination facilities, and environmental infrastructure projects.',
    image: '/images/sectors/infrastructure.png',
    clients: [
      'VA Tech Wabag – Chennai',
      'TWAD Board – Multiple Locations',
      'IVRCL',
    ],
  },
  {
    name: 'Educational Institutions & Campuses',
    description: 'Reliable electrical distribution systems for universities, colleges, institutional campuses, training centers, and research facilities.',
    image: '/images/sectors/commercial.png',
    clients: [
      'Sri Ramachandra Medical College - Chennai',
      'Chennai Institute of Technology – Chennai',
      'Saveetha College of Engineering – Thandalam',
      'SRM – Ramapuram',
    ],
  },
  {
    name: 'Hospitality & Entertainment',
    description: 'Electrical infrastructure for hotels, resorts, convention centers, entertainment facilities, multiplexes, and hospitality developments.',
    image: '/images/sectors/commercial.png',
    clients: [
      'Sri Ramachandra Hospital',
      'MIOT Hospital',
      'Rohini Hospital',
      'RELA Hospital',
      'Saveetha Dental Hospital',
    ],
  },
  {
    name: 'Government & Public Sector Projects',
    description: 'Execution support for government infrastructure projects, PSU facilities, institutional infrastructure, and public utility developments.',
    image: '/images/sectors/infrastructure.png',
    clients: [
      'HVF – Avadi',
      'MES - Ooty',
      'ISRO Propulsion Complex – Mahendragiri',
    ],
  },
  {
    name: 'Glass & Ceramics Industries',
    description: 'Electrical systems for glass manufacturing, ceramics production units, kiln operations, and temperature-critical industrial processes.',
    image: '/images/sectors/cement-steel.png',
    clients: [
      'Saint Gobain – Sriperumbudur',
      'Carborundum Universal Limited – Various plants',
      'SNJ India Glasses – Tiruvallur',
    ],
  },
  {
    name: 'Telecom & Communication Infrastructure',
    description: 'Power systems, backup infrastructure, and electrical integration solutions for telecom facilities, communication towers, and network infrastructure.',
    image: '/images/sectors/datacenter.png',
    clients: [
      'Aircel',
      'Airtel',
      'Idea Cellular',
      'Vodafone',
    ],
  },
]

/* ═══════════════════════════════════════════════════════════
   HERO INTRO COPY
   ═══════════════════════════════════════════════════════════ */

const HERO_INTRO =
  'Shri Vaari Electricals delivers integrated electrical EPC, power infrastructure, industrial electrification, substations, testing & commissioning, and utility coordination solutions across a wide spectrum of industries and critical infrastructure sectors throughout India. Our multidisciplinary engineering and execution capability enables us to support greenfield, brownfield, expansion, modernization, retrofitting, and utility integration projects across diverse industrial environments.'

/* ═══════════════════════════════════════════════════════════
   SECTOR CARD
   ═══════════════════════════════════════════════════════════ */

function SectorCard({ sector, index, isExpanded, onToggle }: {
  sector: Sector
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const clientCount = sector.clients.length

  return (
    <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-[#1A1A2E]">
        <img
          src={sector.image}
          alt={sector.name}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {/* Subtle INK gradient overlay at bottom for text legibility */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(26,26,46,0.55), rgba(26,26,46,0))' }}
        />
        {/* Client count badge */}
        <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur text-[11px] font-semibold tracking-wide text-slate-700 border border-slate-200 shadow-sm">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-500" />
          {clientCount} {clientCount === 1 ? 'Client' : 'Clients'}
        </span>
        {/* Faded index number watermark */}
        <span className="absolute bottom-2 left-3 text-3xl font-extrabold leading-none text-white/25 select-none">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-[#1A1A2E] leading-snug">
          {sector.name}
        </h3>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3">
          {sector.description}
        </p>

        {/* Expand toggle */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-controls={`sector-clients-${index}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A1A2E] hover:text-slate-700 transition-colors w-fit"
        >
          {isExpanded ? 'Hide clients' : `View ${clientCount} ${clientCount === 1 ? 'client' : 'clients'}`}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            strokeWidth={2.5}
          />
        </button>

        {/* Collapsible client list */}
        {isExpanded && (
          <div
            id={`sector-clients-${index}`}
            className="mt-4 bg-slate-50 border-t border-slate-100 p-4 rounded-md"
          >
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-500 mb-3">
              Notable Clients
            </p>
            <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {sector.clients.map((client, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                  <span
                    className="mt-1.5 inline-block h-1 w-1 rounded-full bg-slate-500 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{client}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */

export default function SectorsPage() {
  const { navigate } = useRouter()
  const [expandedSector, setExpandedSector] = useState<number | null>(null)

  const toggle = (i: number) => {
    setExpandedSector((prev) => (prev === i ? null : i))
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ─────────────────────────────────────────
          HERO
          ───────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: INK }}
      >
        {/* Background image with dark INK overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/sectors/hero-sectors.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(26,26,46,0.75)' }}
          />
        </div>

        {/* Subtle top fade for breadcrumb legibility */}
        <div
          className="absolute inset-x-0 top-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(26,26,46,0.55), rgba(26,26,46,0))' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
          {/* Breadcrumb */}
          <FadeIn>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
              <button
                onClick={() => navigate('home')}
                className="hover:text-white transition-colors"
              >
                Home
              </button>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-white font-medium">Sectors</span>
            </nav>
          </FadeIn>

          {/* Coral badge */}
          <FadeIn delay={0.08} className="mt-8">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.12em] uppercase text-white"
              style={{ backgroundColor: CORAL }}
            >
              27 Sectors • 1200+ Projects • 29+ Years
            </span>
          </FadeIn>

          {/* Headline */}
          <FadeIn delay={0.16}>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05] max-w-4xl">
              Key Sectors We Serve
            </h1>
          </FadeIn>

          {/* Subtitle / hero intro */}
          <FadeIn delay={0.24}>
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              {HERO_INTRO}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          SECTOR GRID
          ───────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <FadeIn className="mb-10 md:mb-14">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500">
                Our Reach
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1A2E]">
                Industries & Infrastructure We Power
              </h2>
              <p className="mt-4 text-base text-slate-500 leading-relaxed">
                From automotive plants to data centers, from ports to solar farms — explore the 27 sectors
                where our engineering teams have delivered critical electrical infrastructure. Click any
                sector to view notable clients.
              </p>
            </div>
          </FadeIn>

          {/* Grid */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTORS.map((sector, i) => (
              <StaggerChild key={i}>
                <SectorCard
                  sector={sector}
                  index={i}
                  isExpanded={expandedSector === i}
                  onToggle={() => toggle(i)}
                />
              </StaggerChild>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          CTA — simple white section, coral button
          ───────────────────────────────────────── */}
      <section className="bg-white pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="border-t border-slate-200 pt-14 md:pt-20 text-center">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500">
                Let's Build Together
              </p>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1A1A2E] max-w-3xl mx-auto">
                Have a project in one of these sectors?
              </h2>
              <p className="mt-5 text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
                Talk to our engineering team about your electrical EPC, substation, industrial electrification,
                or renewable energy requirements.
              </p>
              <div className="mt-9 flex justify-center">
                <button
                  onClick={() => navigate('contact')}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md text-sm font-semibold text-white transition-all hover:opacity-90 hover:gap-3 shadow-sm"
                  style={{ backgroundColor: CORAL }}
                >
                  Get a Quote
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  )
}
