'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import {
  ChevronRight, CheckCircle, ArrowRight, Phone,
  PenTool, Hammer, FlaskConical, BarChart3, ShieldCheck,
  FileCheck, Building2, Sun, Zap, Clock, Award,
  Cpu, Wrench, Shield, FileText, Lightbulb, Users,
  ClipboardCheck, Settings, HardHat, TrendingUp,
  BadgeCheck, Stamp, Globe, Sparkles,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from '@/components/Router'

/* ═══════════════════════════════════════════════════════════
   STATIC DATA — ALL service content, no database calls
   ═══════════════════════════════════════════════════════════ */

interface ServiceCapability {
  text: string
  subItems?: string[]
}

interface StaticServiceData {
  name: string
  slug: string
  shortName: string
  description: string
  tagline: string
  capabilities: ServiceCapability[]
  processSteps: { title: string; desc: string }[]
  highlights: string[]
  relatedProjects: { name: string; client: string; location: string }[]
  solarReferences?: string[]
  image: string
}

const serviceData: Record<string, StaticServiceData> = {
  'design-engineering': {
    name: 'Design & Engineering',
    slug: 'design-engineering',
    shortName: 'Design & Engg',
    description: 'SVEPL provides comprehensive design and engineering services for electrical switchyards up to 400 KV. Our team of experienced engineers delivers preliminary and detailed designs for civil, structural, and electrical works, ensuring full compliance with IS/IEC standards.',
    tagline: 'From Concept to Detailed Engineering',
    capabilities: [
      { text: 'Getting Single window approval' },
      { text: 'Prelim and detailed design for civil works in switch yards up to 400 KV' },
      { text: 'Prelim and detailed design for structural works in switch yards up to 400 KV' },
      { text: 'Prelim and detailed design for electrical works in switch yards up to 400 KV' },
      { text: 'Complete document preparation works' },
      { text: 'Preparation of SLD/Electrical layout' },
      { text: 'Design of Earth mat as per IEEE-80' },
      { text: 'Design of Lightning system as per IS-2309' },
    ],
    processSteps: [
      { title: 'Requirement Analysis', desc: 'Understanding project scope, load requirements, and environmental conditions' },
      { title: 'System Design', desc: 'Single line diagrams, protection schemes, and equipment specifications' },
      { title: 'Load Flow Studies', desc: 'Detailed analysis of power flow, voltage profiles, and short circuit levels' },
      { title: 'Protection Coordination', desc: 'Relay coordination studies and protection scheme design' },
      { title: 'Documentation', desc: 'Complete Bill of Materials, drawings, and technical specifications' },
    ],
    highlights: ['Up to 400 KV Design', 'IEEE-80 Compliant', 'IS-2309 Standards', 'Single Window Approval'],
    relatedProjects: [
      { name: '110KV/11KV Switchyard', client: 'Ashok Leyland', location: 'Hosur' },
      { name: '132KV/11KV Switchyard', client: 'MM Forging', location: 'Viralimalai' },
    ],
    image: '/images/services/design-engineering.png',
  },
  'project-execution': {
    name: 'Project Execution',
    slug: 'project-execution',
    shortName: 'Project Execution',
    description: 'SVEPL offers turnkey project management and execution services with a proven track record of delivering complex electrical projects on time and within budget. Our comprehensive approach encompasses scheduling via Microsoft Project, weekly event-based tracking, and domain expertise across all project management areas.',
    tagline: 'Turnkey Project Management & Execution',
    capabilities: [
      { text: 'Project scheduling based on Microsoft Project software' },
      { text: 'Tracking the project on weekly/event basis' },
      { text: 'Domain expertise in comprehensive project management in the following areas', subItems: [
        'Integration', 'Scope', 'Time', 'Cost', 'Quality', 'Procurement',
        'Human resources', 'Communications', 'Risk management', 'Stakeholder management',
      ]},
    ],
    processSteps: [
      { title: 'Project Planning', desc: 'Detailed project schedule, resource allocation, and milestone definition' },
      { title: 'Procurement', desc: 'Quality equipment sourcing, vendor management, and logistics coordination' },
      { title: 'Installation', desc: 'Professional erection and installation with safety protocols' },
      { title: 'Testing', desc: 'Comprehensive testing as per IS/IEC standards and specifications' },
      { title: 'Commissioning', desc: 'System commissioning, performance verification, and handover' },
    ],
    highlights: ['MS Project Scheduling', '10 PM Domains', 'Weekly Tracking', 'Turnkey Delivery'],
    relatedProjects: [
      { name: '11KV/433V Electrification', client: 'Madras Security Printers', location: 'Chennai' },
      { name: '11KV/433V Electrification', client: 'PSG Institute of Technology', location: 'Coimbatore' },
    ],
    image: '/images/services/project-execution.png',
  },
  'testing': {
    name: 'Testing & Commissioning',
    slug: 'testing',
    shortName: 'Testing',
    description: 'SVEPL provides comprehensive electrical testing and commissioning services with a NABL-accredited laboratory for CT/PT testing up to 33 KV. Our certified test engineers deliver detailed testing and evaluation of transformers, earthing systems, lightning systems, and condition monitoring services.',
    tagline: 'Comprehensive Electrical Testing & Commissioning',
    capabilities: [
      { text: 'Comprehensive testing of CT/PT upto 33 KV — Lab accredited by NABL' },
      { text: 'Testing and evaluation of Distribution and power transformers' },
      { text: 'Testing and evaluation of Earthing systems' },
      { text: 'Testing and evaluation of Lightning systems' },
      { text: 'Testing and evaluation of current transformers/potential transformers' },
      { text: 'Condition monitoring services for various electrical equipment' },
    ],
    processSteps: [
      { title: 'Pre-Test Inspection', desc: 'Visual inspection and documentation review before testing begins' },
      { title: 'Type Testing', desc: 'Verification of design compliance with applicable standards' },
      { title: 'Routine Testing', desc: 'Standard tests on each panel/equipment as per specifications' },
      { title: 'Relay Calibration', desc: 'Numerical relay testing, setting verification, and coordination checks' },
      { title: 'Commissioning', desc: 'Live commissioning with load testing and performance verification' },
    ],
    highlights: ['NABL Accredited Lab', 'CT/PT up to 33 KV', 'Condition Monitoring', 'IS/IEC Compliant'],
    relatedProjects: [
      { name: '33KV 1250A VCB Panel', client: 'M.J. Casting Limited', location: 'Hosur' },
      { name: '11KV VCB Panels', client: 'TVS Srichakra', location: 'Madurai' },
    ],
    image: '/images/services/testing.png',
  },
  'energy-harmonic-audit': {
    name: 'Energy & Harmonic Audit',
    slug: 'energy-harmonic-audit',
    shortName: 'Energy & Harmonic',
    description: 'SVEPL offers specialized energy and harmonic audit services backed by a comprehensive team with domain expertise across various industries. Our value engineering-based solutions include on-site measurement, detailed data analysis, and recommendations based on economic viability — covering short term, medium term, and long-term measures, all benchmarked against IEEE standards.',
    tagline: 'Optimize Energy Efficiency & Power Quality',
    capabilities: [
      { text: 'Wider Industry base' },
      { text: 'Comprehensive team with domain expertise in various Industries' },
      { text: 'Value engineering-based solutions' },
      { text: 'Comparison with relevant industry benchmark & IEEE' },
      { text: 'Preliminary data analysis' },
      { text: 'Measurement at site' },
      { text: 'Data analysis' },
      { text: 'Recommendations based on economic viability — short term, medium term & long-term measures' },
      { text: 'Report submission, discussion of recommendation with the customer & finalizing the report with the customer' },
    ],
    processSteps: [
      { title: 'Preliminary Data Analysis', desc: 'Review of electricity bills, SLD, and equipment details' },
      { title: 'On-Site Monitoring', desc: 'Power quality analyzers deployed for 7-15 days of data logging' },
      { title: 'Data Analysis', desc: 'Detailed analysis of voltage, current, PF, harmonics, and load patterns' },
      { title: 'Recommendations', desc: 'Short, medium and long-term measures based on economic viability' },
      { title: 'Report & Discussion', desc: 'Report submission, discussion with customer & finalizing the report' },
    ],
    highlights: ['IEEE Benchmarked', 'Value Engineering', 'Economic Viability', 'Multi-industry'],
    relatedProjects: [
      { name: '11KV Transformer/VCB Panels', client: 'Delta Electronics', location: 'Hosur' },
      { name: '33KV 1250A VCB Panel', client: 'M.J. Casting Limited', location: 'Hosur' },
    ],
    image: '/images/services/energy-audit.png',
  },
  'amc': {
    name: 'AMC',
    slug: 'amc',
    shortName: 'AMC',
    description: 'SVEPL provides comprehensive Annual Maintenance Contract services with 16+ years of experience and a team of 150+ employees. Our specialized teams offer preventive and breakdown maintenance for panels, troubleshooting, testing of equipment, HVAC, and solar systems. We serve multinational companies with standardized annual rate contracts for complete transparency.',
    tagline: 'Preventive & Breakdown Maintenance Services',
    capabilities: [
      { text: 'Wider Industry base' },
      { text: 'Comprehensive team with domain expertise in Panels/Troubleshooting/Testing of equipment/HVAC/Solar' },
      { text: '150+ employees' },
      { text: '16+ years of experience in AMC services' },
      { text: 'Exclusive services for Multinational companies' },
      { text: 'Standardized annual rate contracts for transparency' },
    ],
    processSteps: [
      { title: 'System Assessment', desc: 'Comprehensive assessment of existing electrical installations' },
      { title: 'Maintenance Schedule', desc: 'Customized preventive maintenance schedule based on equipment criticality' },
      { title: 'Periodic Inspections', desc: 'Scheduled inspections with thermography and oil testing' },
      { title: 'Breakdown Response', desc: '24/7 emergency breakdown support with rapid response teams' },
      { title: 'Performance Reporting', desc: 'Regular reports on equipment health and maintenance activities' },
    ],
    highlights: ['150+ Employees', '16+ Years Experience', 'MNC Clients', 'Transparent Rates'],
    relatedProjects: [
      { name: '110KV/11KV Switchyard', client: 'Ashok Leyland', location: 'Hosur' },
      { name: '132KV/11KV Switchyard', client: 'MM Forging', location: 'Viralimalai' },
    ],
    image: '/images/services/amc.png',
  },
  'liasion-ceig': {
    name: 'Liaison with CEIG',
    slug: 'liasion-ceig',
    shortName: 'Liasion with CEIG',
    description: 'SVEPL facilitates all statutory approvals and CEIG certification for electrical installations. Our established relationships with the electrical inspectorate ensure faster approvals through proper documentation preparation, timely submission, inspection coordination, and safety certificate procurement.',
    tagline: 'Statutory Approvals & CEIG Certification',
    capabilities: [
      { text: 'Preparation of Drawings and specifications' },
      { text: 'Submission to electrical inspectorate' },
      { text: 'Getting Approvals' },
      { text: 'Arranging Inspection' },
      { text: 'Getting Safety certificate' },
    ],
    processSteps: [
      { title: 'Documentation', desc: 'Preparation of all required drawings and specifications' },
      { title: 'Application Filing', desc: 'Submission of applications to CEIG with proper documentation' },
      { title: 'Inspection Coordination', desc: 'Scheduling and coordination of statutory inspections' },
      { title: 'Compliance Resolution', desc: 'Addressing any observations from the inspectorate' },
      { title: 'Certificate Procurement', desc: 'Follow-up and procurement of final safety certificates' },
    ],
    highlights: ['Statutory Approvals', 'Safety Certificates', 'Inspectorate Liaison', 'Faster Processing'],
    relatedProjects: [
      { name: '11KV/433V Electrification', client: 'PSG Institute of Technology', location: 'Coimbatore' },
      { name: '11KV Transformer/VCB Panels', client: 'Delta Electronics', location: 'Hosur' },
    ],
    image: '/images/services/ceig-liaison.png',
  },
  'liasion-utilities': {
    name: 'Liaison with TNEB/KPTCL/APTRANSCO/TSTRANSCO',
    slug: 'liasion-utilities',
    shortName: 'Liasion with Govt',
    description: 'SVEPL provides expert utility liaison services for power supply and grid connectivity across multiple state utilities including TNEB, KPTCL, APTRANSCO, and TSTRANSCO. Our established relationships ensure faster processing of applications, load enhancements, and grid connectivity coordination.',
    tagline: 'Utility Liaison for Power Supply & Grid Connectivity',
    capabilities: [
      { text: 'Coordination with Meter n Relay testing team' },
      { text: 'Liaison with SE-O&M' },
      { text: 'Liaison with Non-conventional energy department for getting approvals for SOLAR, WIND and others' },
      { text: 'Liaison with Operations team for getting approvals' },
      { text: 'Liaison with SS Erection department for getting approvals for drawings and specifications' },
      { text: 'Liaison with TLC department (Transmission line construction) for getting approvals for line works' },
    ],
    processSteps: [
      { title: 'Requirement Assessment', desc: 'Analysis of power requirements and utility options available' },
      { title: 'Application Processing', desc: 'Preparation and filing of applications with state utilities' },
      { title: 'Technical Evaluation', desc: 'Coordination of technical evaluation and site surveys' },
      { title: 'Agreement Finalization', desc: 'Negotiation and finalization of power supply agreements' },
      { title: 'Grid Connectivity', desc: 'Coordination for grid connectivity and metering installation' },
    ],
    highlights: ['Multi-utility Expertise', 'TNEB/KPTCL/APTRANSCO', 'Solar/Wind Approvals', 'Grid Connectivity'],
    relatedProjects: [
      { name: '33KV Bay Extension for 10MW Solar', client: 'Solon India', location: 'Mothagam' },
      { name: '110KV/11KV Switchyard', client: 'Ashok Leyland', location: 'Hosur' },
    ],
    image: '/images/services/utility-liaison.png',
  },
  'solar-works': {
    name: 'Solar Works',
    slug: 'solar-works',
    shortName: 'Solar Works',
    description: 'SVEPL is a leading EPC contractor for solar energy solutions, offering tailored solar installations from 10KW to 100MW. Our expertise spans diverse sectors including residential, commercial, and industrial, with a commitment to quality, reliability, and sustainability. From design to maintenance, we deliver comprehensive services with a proven track record of successful projects.',
    tagline: 'Complete Solar EPC Solutions',
    capabilities: [
      { text: 'Leading EPC contractor for solar energy solutions' },
      { text: 'Tailored solar installations from 10KW to 100MW' },
      { text: 'Expertise in diverse sectors including residential, commercial, and industrial' },
      { text: 'Commitment to quality, reliability, and sustainability' },
      { text: 'Comprehensive services from design to maintenance' },
      { text: 'Proven track record of successful projects and customer satisfaction' },
    ],
    solarReferences: ['VOC Port', 'Juwi Solar', 'Tata Solar', 'Bharathiyar University', 'CTS-Shozhinganalur', 'Saveetha School Of Engineering', 'Etica Power'],
    processSteps: [
      { title: 'Site Assessment', desc: 'Detailed site survey, solar irradiance analysis, and feasibility study' },
      { title: 'System Design', desc: 'Optimized system design with string configuration and inverter selection' },
      { title: 'Procurement', desc: 'Quality solar components procurement with warranty assurance' },
      { title: 'Installation', desc: 'Professional installation of panels, inverters, and BOS components' },
      { title: 'Grid Integration', desc: 'HT panel integration, net metering setup, and grid connectivity' },
    ],
    highlights: ['10KW to 100MW', 'EPC Contractor', 'Net Metering', 'O&M Support'],
    relatedProjects: [
      { name: '33KV Bay Extension for 10MW Solar', client: 'Solon India', location: 'Mothagam' },
      { name: '11KV Transformer/VCB Panels', client: 'Delta Electronics', location: 'Hosur' },
    ],
    image: '/images/services/solar-works.png',
  },
}

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

const slugToName: Record<string, string> = {
  'design-engineering': 'Design & Engineering',
  'project-execution': 'Project Execution',
  'testing': 'Testing & Commissioning',
  'energy-harmonic-audit': 'Energy & Harmonic Audit',
  'amc': 'AMC',
  'liasion-ceig': 'Liaison with CEIG',
  'liasion-utilities': 'Liaison with TNEB/KPTCL/APTRANSCO/TSTRANSCO',
  'solar-works': 'Solar Works',
}

/* ─── Animation helper ─── */
function FadeIn({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }} className={className}>
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function ServiceDetailPage({ slug }: { slug: string }) {
  const { navigate } = useRouter()
  const data = serviceData[slug]

  if (!data) {
    return (
      <section className="py-20 text-center">
        <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">Service Not Found</h2>
        <Button onClick={() => navigate('services')} className="bg-[#0D1D3A] hover:bg-[#0D1D3A] text-[#1A1A2E]">
          Back to Services
        </Button>
      </section>
    )
  }

  const Icon = iconMap[data.name] || PenTool

  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO SECTION — Navy gradient with image overlay
          ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#37474f' }}>
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(232,117,26,0.08) 0%, transparent 40%)',
        }} />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 pt-[100px] pb-12 md:pb-16">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm mb-6"
          >
            <button onClick={() => navigate('home')} className="text-white/60 hover:text-white transition-colors">
              Home
            </button>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <button onClick={() => navigate('services')} className="text-white/60 hover:text-white transition-colors">
              Service
            </button>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <span className="text-[#E8751A] font-medium">{data.shortName}</span>
          </motion.div>

          {/* Hero content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-start gap-4 mb-4"
          >
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-white/10 backdrop-blur-sm border border-white/20">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                {data.name}
              </h1>
              <p className="text-[#7A9CC6] text-lg mt-1 font-light">{data.tagline}</p>
            </div>
          </motion.div>

          {/* Highlights badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap gap-2 mt-4"
          >
            {data.highlights.map((h, i) => (
              <Badge key={i} className="bg-white/10 text-white border border-white/20 px-3 py-1 text-sm font-medium rounded-full backdrop-blur-sm">
                {h}
              </Badge>
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
          MAIN CONTENT — Two-column layout like original site
          Left: Capabilities list | Right: Image + Sidebar
          ══════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* LEFT PART — Service Description & Capabilities */}
            <div className="flex-1 min-w-0">
              {/* Description */}
              <FadeIn>
                <p className="text-[#374151] leading-relaxed text-base md:text-lg mb-8">
                  {data.description}
                </p>
              </FadeIn>

              {/* Capabilities List */}
              <FadeIn delay={0.1}>
                <div className="bg-[#efefef] rounded-xl p-6 md:p-8 border border-gray-100">
                  <h2 className="text-xl md:text-2xl font-bold text-[#1A1A2E] mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0D1D3A]/10 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-[#444444]" />
                    </div>
                    Service Capabilities
                  </h2>
                  <ul className="space-y-3">
                    {data.capabilities.map((cap, i) => (
                      <li key={i}>
                        <motion.div
                          initial={{ opacity: 0, x: -16 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.06 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#0D1D3A]/10 flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle className="w-3.5 h-3.5 text-[#444444]" />
                            </div>
                            <div>
                              <span className="text-[#374151] text-sm md:text-base leading-relaxed">{cap.text}</span>
                              {cap.subItems && cap.subItems.length > 0 && (
                                <ul className="mt-2 ml-2 space-y-1.5">
                                  {cap.subItems.map((sub, j) => (
                                    <li key={j} className="flex items-center gap-2 text-[#666666] text-sm">
                                      <div className="w-1.5 h-1.5 rounded-full bg-[#4A90D9] shrink-0" />
                                      {sub}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>

              {/* Process Steps */}
              {data.processSteps.length > 0 && (
                <FadeIn delay={0.15}>
                  <div className="mt-8">
                    <h2 className="text-xl md:text-2xl font-bold text-[#1A1A2E] mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#E8751A]/10 flex items-center justify-center">
                        <ClipboardCheck className="w-4 h-4 text-[#E8751A]" />
                      </div>
                      Our Process
                    </h2>
                    <div className="space-y-4">
                      {data.processSteps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.08 }}
                          className="flex gap-4 items-start"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#0D1D3A] text-[#1A1A2E] flex items-center justify-center shrink-0 font-bold text-sm shadow-md">
                            {i + 1}
                          </div>
                          <div className="flex-1 pt-1">
                            <h4 className="font-semibold text-[#1A1A2E] text-base">{step.title}</h4>
                            <p className="text-[#666666] text-sm mt-0.5">{step.desc}</p>
                          </div>
                          {i < data.processSteps.length - 1 && (
                            <div className="hidden lg:block absolute left-5 mt-10 w-0.5 h-6 bg-[#5A7EA8]" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* Solar References */}
              {data.solarReferences && data.solarReferences.length > 0 && (
                <FadeIn delay={0.2}>
                  <div className="mt-8">
                    <h2 className="text-xl md:text-2xl font-bold text-[#1A1A2E] mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Sun className="w-4 h-4 text-[#E8751A]" />
                      </div>
                      Our Solar Projects
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {data.solarReferences.map((ref, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.06 }}
                          className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#0D1D3A]/10 flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4 text-[#444444]" />
                          </div>
                          <span className="text-[#374151] text-sm font-medium">{ref}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* Related Projects */}
              {data.relatedProjects.length > 0 && !data.solarReferences && (
                <FadeIn delay={0.2}>
                  <div className="mt-8">
                    <h2 className="text-xl md:text-2xl font-bold text-[#1A1A2E] mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0D1D3A]/10 flex items-center justify-center">
                        <HardHat className="w-4 h-4 text-[#444444]" />
                      </div>
                      Related Projects
                    </h2>
                    <div className="space-y-3">
                      {data.relatedProjects.map((proj, i) => (
                        <div key={i} className="flex items-center gap-4 bg-[#efefef] rounded-lg p-4 border border-gray-100">
                          <div className="w-10 h-10 rounded-full bg-[#0D1D3A] text-[#1A1A2E] flex items-center justify-center shrink-0 font-bold text-sm">
                            {i + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-[#1A1A2E] text-sm">{proj.name}</h4>
                            <p className="text-[#666666] text-sm">{proj.client} — {proj.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}
            </div>

            {/* RIGHT PART — Image + Sidebar */}
            <div className="lg:w-[400px] xl:w-[440px] shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Service Image */}
                <FadeIn delay={0.1} className="relative rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={data.image}
                    alt={data.name}
                    width={440}
                    height={252}
                    className="w-full h-auto object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-[#0D1D3A] text-[#1A1A2E] border-0 px-3 py-1 text-sm font-medium">
                      <Icon className="w-3.5 h-3.5 mr-1.5" />
                      {data.name}
                    </Badge>
                  </div>
                </FadeIn>

                {/* Contact Card */}
                <FadeIn delay={0.15}>
                  <Card className="border-2 border-[#334155]/10 shadow-lg overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-[#efefef] to-[#2A5A8A]" />
                    <CardContent className="p-5">
                      <div className="text-center mb-4">
                        <div className="w-14 h-14 rounded-xl bg-[#0D1D3A]/10 flex items-center justify-center mx-auto mb-3">
                          <Icon className="w-7 h-7 text-[#444444]" />
                        </div>
                        <h3 className="font-bold text-[#1A1A2E] text-base">{data.name}</h3>
                        <p className="text-sm text-[#666666] mt-1">{data.tagline}</p>
                      </div>
                      <Button onClick={() => navigate('contact')}
                        className="w-full bg-[#0D1D3A] hover:bg-[#0D1D3A] text-[#1A1A2E] rounded-lg h-11 font-semibold text-sm mb-3 transition-colors">
                        Get a Quote <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                      <a href="tel:+919941905833"
                        className="w-full flex items-center justify-center gap-2 text-[#444444] font-semibold text-sm h-10 rounded-lg border border-[#334155]/20 hover:bg-[#0D1D3A]/5 transition-colors">
                        <Phone className="w-4 h-4" /> +91 9941905833
                      </a>
                    </CardContent>
                  </Card>
                </FadeIn>

                {/* Quick Stats */}
                <FadeIn delay={0.2}>
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-5">
                      <h4 className="font-bold text-[#1A1A2E] text-sm mb-4">Why Choose SVEPL?</h4>
                      <div className="space-y-3">
                        {[
                          { icon: Award, label: '20+ Years Experience', color: 'text-[#444444]' },
                          { icon: Users, label: '150+ Expert Employees', color: 'text-[#E8751A]' },
                          { icon: Globe, label: 'Pan-India Presence', color: 'text-[#444444]' },
                          { icon: Shield, label: 'ISO Certified Processes', color: 'text-[#E8751A]' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#efefef] flex items-center justify-center shrink-0">
                              <item.icon className={`w-4 h-4 ${item.color}`} />
                            </div>
                            <span className="text-[#374151] text-sm">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA BANNER
          ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#37474f' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 py-14 md:py-16 text-center">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to Get Started?
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto text-sm md:text-base">
              Let our expert team help you with your next {data.name.toLowerCase()} project. Get in touch today for a free consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={() => navigate('contact')}
                className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-lg px-8 h-12 font-semibold text-sm transition-colors shadow-lg shadow-[#E8751A]/25">
                Get a Quote <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 hover:border-white rounded-lg px-8 h-12 font-semibold text-sm transition-colors"
                asChild>
                <a href="tel:+919941905833"><Phone className="mr-2 w-4 h-4" />Call Us</a>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
