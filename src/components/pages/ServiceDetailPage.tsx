'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import {
  ChevronRight, ArrowRight, Phone, Check, ArrowUpRight,
  PenTool, Hammer, FlaskConical, BarChart3, ShieldCheck,
  FileCheck, Building2, Sun, Zap, MapPin, Mail, Sparkles,
  Award, Globe, Users, Clock, HardHat,
  Network, Factory, Boxes, Layers,
} from 'lucide-react'
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
  utilities?: string[]
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
    highlights: ['CT/PT up to 33 KV', 'Condition Monitoring', 'Transformer Testing', 'IS/IEC Compliant'],
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
    shortName: 'Liaison with CEIG',
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
    name: 'Liaison with Utilities',
    slug: 'liasion-utilities',
    shortName: 'Liaison with Utilities',
    description: 'SVEPL provides expert utility liaison services for power supply and grid connectivity across multiple state utilities including TNEB, KPTCL, APTRANSCO, and TSTRANSCO. Our established relationships ensure faster processing of applications, load enhancements, and grid connectivity coordination.',
    tagline: 'Utility Liaison for Power Supply & Grid Connectivity',
    utilities: [
      'TNPPCL', 'TNPGCL', 'TANTRANSCO',
      'APSPDCL', 'APEPDCL', 'APTRANSCO',
      'TSSPDCL', 'TSTRANSCO', 'OPTCL',
      'OPDCL', 'KPTCL', 'BUSCOM',
      'GMR Aerocity Goa',
    ],
    capabilities: [
      { text: 'Coordination with Meter n Relay testing team' },
      { text: 'Liaison with SE-O&M' },
      { text: 'Liaison with Non-conventional energy department for getting approvals for SOLAR, WIND and others' },
      { text: 'Liaison with Operations team for getting approvals' },
      { text: 'Liaison with SS Erection department for getting approvals for drawings and specifications' },
      { text: 'Liaison with TLC department (Transmission line construction) for line works' },
    ],
    processSteps: [
      { title: 'Requirement Assessment', desc: 'Analysis of power requirements and utility options available' },
      { title: 'Application Processing', desc: 'Preparation and filing of applications with state utilities' },
      { title: 'Technical Evaluation', desc: 'Coordination of technical evaluation and site surveys' },
      { title: 'Agreement Finalization', desc: 'Negotiation and finalization of power supply agreements' },
      { title: 'Grid Connectivity', desc: 'Coordination for grid connectivity and metering installation' },
    ],
    highlights: ['Multi-utility Expertise', '13 State Utilities', 'Solar/Wind Approvals', 'Grid Connectivity'],
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
    description: 'We provide comprehensive Engineering, Procurement, and Construction (EPC) services for rooftop and ground-mounted solar photovoltaic (PV) power plants. Our turnkey solutions cover every stage of the project — from feasibility studies and system design to installation, commissioning, and long-term operation and maintenance. With a focus on quality, safety, and performance, we deliver reliable solar energy systems from 10KW to 100MW that help commercial, industrial, institutional, and utility-scale customers reduce energy costs and achieve sustainability goals.',
    tagline: 'End-to-End Solar EPC Solutions — 10KW to 100MW',
    capabilities: [
      { text: 'Engineering', subItems: [
        'Site survey and feasibility assessment',
        'Energy yield analysis',
        'System design and optimization',
        'Electrical and structural engineering',
        'Single Line Diagram (SLD) preparation',
        'Load flow and protection studies',
        'Grid interconnection design',
        'Regulatory and statutory compliance',
      ]},
      { text: 'Procurement', subItems: [
        'High-efficiency solar PV modules',
        'String and central inverters',
        'Module mounting structures',
        'DC and AC cables',
        'Transformers and HT/LT switchgear',
        'SCADA and remote monitoring systems',
        'Battery Energy Storage Systems (BESS)',
        'Balance of System (BoS) components from trusted manufacturers',
      ]},
      { text: 'Construction', subItems: [
        'Civil and structural works',
        'Module mounting installation',
        'Electrical installation and cable laying',
        'Inverter and transformer installation',
        'HT/LT panel installation',
        'Earthing and lightning protection',
        'Testing and commissioning',
        'Utility grid synchronization',
      ]},
      { text: 'Solar Solutions We Deliver', subItems: [
        'Industrial Rooftop Solar Systems',
        'Commercial Rooftop Solar Systems',
        'Ground-Mounted Solar Power Plants',
        'Captive and Open Access Solar Projects',
        'Solar with Battery Energy Storage Systems (BESS)',
        'Hybrid Solar Power Systems',
        'Utility-Scale Solar Projects',
      ]},
      { text: 'Battery Energy Storage Solutions (BESS)', subItems: [
        'Peak shaving',
        'Load shifting',
        'Backup power',
        'Time-of-day optimization',
        'Demand charge reduction',
        'Renewable energy integration',
        'Energy management and monitoring',
      ]},
      { text: 'Operation & Maintenance Services', subItems: [
        'Preventive and corrective maintenance',
        'Performance monitoring',
        'Module cleaning recommendations',
        'Thermal imaging inspections',
        'Inverter health checks',
        'Battery health monitoring',
        'Annual performance audits',
        'Emergency breakdown support',
      ]},
    ],
    solarReferences: ['VOC Port', 'Juwi Solar', 'Tata Solar', 'Bharathiyar University', 'CTS-Shozhinganalur', 'Saveetha School Of Engineering', 'Etica Power'],
    processSteps: [
      { title: 'Site Survey & Energy Assessment', desc: 'Comprehensive site survey, solar irradiance analysis, and energy yield assessment' },
      { title: 'System Design & Engineering', desc: 'Optimized system design with SLD preparation, load flow studies, and grid interconnection design' },
      { title: 'Technical Proposal & Cost Estimation', desc: 'Detailed technical proposal with cost estimation and economic viability analysis' },
      { title: 'Procurement of Quality Equipment', desc: 'High-efficiency PV modules, inverters, mounting structures, and BoS components from trusted manufacturers' },
      { title: 'Installation & Construction', desc: 'Civil works, module mounting, electrical installation, and cable laying' },
      { title: 'Testing & Commissioning', desc: 'Comprehensive testing of all electrical and mechanical systems before energization' },
      { title: 'Grid Synchronization', desc: 'Utility grid synchronization, net metering setup, and grid connectivity approval' },
      { title: 'Performance Verification', desc: 'Performance verification and energy yield validation against design estimates' },
      { title: 'Operation & Maintenance Support', desc: 'Long-term O&M support including preventive maintenance, monitoring, and emergency response' },
    ],
    highlights: ['10KW to 100MW', 'Rooftop & Ground-Mounted', 'BESS Integration', 'O&M Support'],
    relatedProjects: [
      { name: '33KV Bay Extension for 10MW Solar', client: 'Solon India', location: 'Mothagam' },
      { name: '11KV Transformer/VCB Panels', client: 'Delta Electronics', location: 'Hosur' },
    ],
    image: '/images/services/solar-works.png',
  },
  'electrical-epc-solutions': {
    name: 'Electrical EPC Solutions',
    slug: 'electrical-epc-solutions',
    shortName: 'EPC Solutions',
    description: 'SVEPL delivers comprehensive electrical EPC services covering the complete project lifecycle — engineering, procurement, installation, testing, commissioning, and maintenance — for industrial and infrastructure projects. Our single-window accountability ensures seamless execution from concept to commissioning.',
    tagline: 'Concept to Commissioning — Single Window EPC',
    capabilities: [
      { text: 'Electrical system design' },
      { text: 'Detailed engineering' },
      { text: 'Equipment procurement' },
      { text: 'Installation & erection' },
      { text: 'Testing & commissioning' },
      { text: 'Utility coordination' },
      { text: 'Project management' },
      { text: 'Operation support' },
    ],
    processSteps: [
      { title: 'Engineering & Design', desc: 'Detailed electrical system design and engineering with load flow and short circuit studies' },
      { title: 'Procurement', desc: 'Quality equipment procurement from approved vendors with warranty assurance' },
      { title: 'Installation & Erection', desc: 'Professional installation and erection of electrical equipment and systems' },
      { title: 'Testing & Commissioning', desc: 'Comprehensive testing and commissioning with NABL-accredited lab support' },
      { title: 'Handover & Support', desc: 'Project handover with documentation, training, and ongoing operation support' },
    ],
    highlights: ['Single Window EPC', '415V to 400 kV', 'Turnkey Execution', 'Operation Support'],
    relatedProjects: [
      { name: '110KV/11KV Switchyard', client: 'Ashok Leyland', location: 'Hosur' },
      { name: '132KV/11KV Switchyard', client: 'MM Forging', location: 'Viralimalai' },
    ],
    image: '/images/services/electrical-epc-solutions.png',
  },
  'ehv-hv-substations': {
    name: 'EHV / HV Substations',
    slug: 'ehv-hv-substations',
    shortName: 'EHV Substations',
    description: 'SVEPL engineers and executes AIS and GIS substations up to 400 kV with reliable power distribution and protection systems. Our expertise spans switchyard construction, transformer installations, protection systems, relay coordination, SCADA integration, bus duct systems, and grounding systems.',
    tagline: 'AIS & GIS Substations Up to 400 kV',
    capabilities: [
      { text: 'Switchyard construction' },
      { text: 'GIS/AIS substations' },
      { text: 'Transformer installations' },
      { text: 'Protection systems' },
      { text: 'Relay coordination' },
      { text: 'SCADA integration' },
      { text: 'Bus duct systems' },
      { text: 'Grounding systems' },
    ],
    processSteps: [
      { title: 'Site Preparation', desc: 'Civil works, structural design, and earth mat design as per IEEE-80' },
      { title: 'Equipment Erection', desc: 'Installation of transformers, breakers, isolators, and bus structures' },
      { title: 'Protection & Control', desc: 'Relay panel installation, relay coordination, and SCADA integration' },
      { title: 'Testing & Commissioning', desc: 'Pre-commissioning tests, protection relay testing, and live energization' },
      { title: 'Energization', desc: 'Statutory approvals, safety certification, and grid synchronization' },
    ],
    highlights: ['Up to 400 kV', 'AIS & GIS', 'SCADA Integrated', 'IEEE-80 Compliant'],
    relatedProjects: [
      { name: '110KV/11KV Switchyard', client: 'Ashok Leyland', location: 'Hosur' },
      { name: '132KV/11KV Switchyard', client: 'MM Forging', location: 'Viralimalai' },
    ],
    image: '/images/services/ehv-hv-substations.png',
  },
  'industrial-electrification': {
    name: 'Industrial Electrification',
    slug: 'industrial-electrification',
    shortName: 'Industrial Elec.',
    description: 'SVEPL provides complete industrial electrification solutions for manufacturing plants, process industries, commercial facilities, and infrastructure projects. From power distribution systems to motor control, lighting, earthing, DG synchronization, energy management, and retrofitting — we deliver end-to-end electrification.',
    tagline: 'Complete Industrial Electrification Solutions',
    capabilities: [
      { text: 'Power distribution systems' },
      { text: 'Cable laying and termination' },
      { text: 'Motor control systems' },
      { text: 'Lighting systems' },
      { text: 'Earthing systems' },
      { text: 'DG synchronization' },
      { text: 'Energy management' },
      { text: 'Retrofitting solutions' },
    ],
    processSteps: [
      { title: 'Load Assessment', desc: 'Detailed load analysis and power distribution system design' },
      { title: 'Installation', desc: 'Cable laying, panel installation, motor control centers, and lighting systems' },
      { title: 'Integration', desc: 'DG synchronization, energy management systems, and SCADA integration' },
      { title: 'Testing', desc: 'Earthing system testing, insulation testing, and commissioning' },
      { title: 'Retrofitting', desc: 'Upgradation and retrofitting of existing electrical systems' },
    ],
    highlights: ['Manufacturing Plants', 'DG Synchronization', 'Energy Management', 'Retrofitting'],
    relatedProjects: [
      { name: 'Industrial Electrification', client: 'Ashok Leyland', location: 'Hosur' },
      { name: 'Plant Electrification', client: 'MM Forging', location: 'Viralimalai' },
    ],
    image: '/images/services/industrial-electrification.png',
  },
  'ht-lt-panel-manufacturing': {
    name: 'HT & LT Panel Manufacturing',
    slug: 'ht-lt-panel-manufacturing',
    shortName: 'Panel Mfg.',
    description: 'SVEPL designs and manufactures high-quality HT Panels, LT panels, and Bus ducts customized to project and industry requirements. Our state-of-the-art 20,000 sq ft manufacturing facility at Guindy produces PCC, MCC, APFC, PLC, Synchronization, VFD, AMF panels, distribution boards, and bus duct systems — all certified to IEC-61439 standards.',
    tagline: 'Custom-Built Panels & Bus Duct Systems',
    capabilities: [
      { text: 'PCC Panels' },
      { text: 'MCC Panels' },
      { text: 'APFC Panels' },
      { text: 'PLC Panels' },
      { text: 'Synchronization Panels' },
      { text: 'VFD Panels' },
      { text: 'AMF Panels' },
      { text: 'Distribution Boards' },
      { text: 'Bus Duct Systems' },
    ],
    processSteps: [
      { title: 'Design & Engineering', desc: 'Custom panel design based on load requirements and project specifications' },
      { title: 'Manufacturing', desc: 'Precision manufacturing at our 20,000 sq ft Guindy facility with quality control' },
      { title: 'Assembly & Wiring', desc: 'Professional assembly, wiring, and bus bar fabrication' },
      { title: 'Testing', desc: 'IEC-61439 compliant testing including routine and type tests' },
      { title: 'Delivery & Commissioning', desc: 'Delivery, installation support, and on-site commissioning' },
    ],
    highlights: ['IEC-61439 Certified', '20,000 sq ft Facility', 'Custom Design', 'Bus Duct Systems'],
    relatedProjects: [
      { name: 'LT Panel Supply', client: 'Ashok Leyland', location: 'Hosur' },
      { name: 'PCC/MCC Panels', client: 'MM Forging', location: 'Viralimalai' },
    ],
    image: '/images/services/ht-lt-panel-manufacturing.png',
  },
}

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

const slugToName: Record<string, string> = {
  'design-engineering': 'Design & Engineering',
  'project-execution': 'Project Execution',
  'testing': 'Testing & Commissioning',
  'energy-harmonic-audit': 'Energy & Harmonic Audit',
  'amc': 'AMC',
  'liasion-ceig': 'Liaison with CEIG',
  'liasion-utilities': 'Liaison with Utilities',
  'solar-works': 'Solar Works',
  'electrical-epc-solutions': 'Electrical EPC Solutions',
  'ehv-hv-substations': 'EHV / HV Substations',
  'industrial-electrification': 'Industrial Electrification',
  'ht-lt-panel-manufacturing': 'HT & LT Panel Manufacturing',
}

/* ─── Phone helper ─── */
function telLink(phone: string): string {
  const cleaned = phone.replace(/[\s\-]/g, '')
  if (cleaned.startsWith('+')) return `tel:${cleaned}`
  if (cleaned.length === 10) return `tel:+91${cleaned}`
  return `tel:${cleaned}`
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

/* ─── Quick stats for sidebar ─── */
const quickStats = [
  { icon: Award,    label: '28+ Years Experience',     color: 'text-[#152D4F]' },
  { icon: Users,    label: '150+ Expert Employees',    color: 'text-[#E8751A]' },
  { icon: Globe,    label: 'Pan-India Presence',       color: 'text-[#152D4F]' },
  { icon: ShieldCheck, label: 'ISO Certified Processes', color: 'text-[#E8751A]' },
]

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function ServiceDetailPage({ slug }: { slug: string }) {
  const { navigate } = useRouter()
  const data = serviceData[slug]

  if (!data) {
    return (
      <section className="py-20 text-center">
        <h2 className="text-2xl font-bold text-[#152D4F] mb-4">Service Not Found</h2>
        <button
          onClick={() => navigate('services')}
          className="inline-flex items-center gap-2 bg-[#152D4F] hover:bg-[#0D1D3A] text-white font-semibold px-6 py-3 rounded-full transition-colors"
        >
          Back to Services <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    )
  }

  const Icon = iconMap[data.name] || PenTool

  // Get next service for navigation
  const slugKeys = Object.keys(serviceData)
  const currentIndex = slugKeys.indexOf(slug)
  const nextSlug = slugKeys[(currentIndex + 1) % slugKeys.length]
  const nextData = serviceData[nextSlug]

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          HERO — Spacious split, light bg, with image
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
        {/* Coral glow */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none opacity-10"
          style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 65%)' }}
        />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 pt-[110px] pb-14 lg:pb-16">
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
            <button onClick={() => navigate('services')} className="text-gray-400 hover:text-[#152D4F] transition-colors">
              Services
            </button>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="text-[#E8751A] font-semibold">{data.shortName}</span>
          </motion.div>

          {/* Split — left text, right image */}
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center">
            {/* LEFT — Text content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-3 mb-5"
              >
                <div className="w-9 h-9 rounded-lg bg-[#152D4F] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                  Service · {data.highlights[0] || 'Capability'}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[#152D4F] leading-[1.05] tracking-tight mb-3"
              >
                {data.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-[#E8751A] font-semibold italic mb-5"
              >
                {data.tagline}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-gray-600 leading-relaxed mb-7 max-w-xl"
              >
                {data.description}
              </motion.p>

              {/* Utilities list — Liaison with Utilities */}
              {data.utilities && data.utilities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="mb-7 max-w-xl"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#152D4F] mb-3">
                    Utilities &amp; Power Boards We Liaison With
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.utilities.map((u) => (
                      <span
                        key={u}
                        className="text-xs font-semibold text-[#152D4F] bg-white border border-[#152D4F]/15 px-3 py-1.5 rounded-full shadow-sm"
                      >
                        {u}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap items-center gap-3"
              >
                <button
                  onClick={() => navigate('contact')}
                  className="inline-flex items-center gap-2 bg-[#E8751A] hover:bg-[#D4691A] text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-lg shadow-[#E8751A]/25 group"
                >
                  Get a quote
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <a
                  href={telLink('9941905833')}
                  className="inline-flex items-center gap-2 text-[#152D4F] hover:text-[#E8751A] font-semibold text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +91 99419 05833
                </a>
              </motion.div>
            </div>

            {/* RIGHT — Tall image with overlay */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2 relative"
            >
              <div className="relative aspect-[4/3] lg:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-[#152D4F]/15">
                <Image
                  src={data.image}
                  alt={data.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1D3A] via-[#0D1D3A]/20 to-transparent" />

                {/* Top floating badge */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/95 backdrop-blur-sm text-[#152D4F] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    <Icon className="w-3 h-3 text-[#E8751A]" />
                    {data.shortName}
                  </span>
                </div>

                {/* Bottom overlay — tagline */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[#E8751A] text-xs font-bold uppercase tracking-wider mb-1">
                    {data.highlights[0]}
                  </p>
                  <p className="text-white text-lg font-bold leading-tight">
                    {data.name}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MAIN CONTENT — Capabilities grid + sticky sidebar
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-14 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">

            {/* LEFT — Capabilities grid */}
            <div className="lg:col-span-8 min-w-0">
              <FadeIn>
                <div className="flex items-center gap-3 mb-3">
                  <Layers className="w-4 h-4 text-[#E8751A]" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8751A]">
                    Capabilities
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#152D4F] leading-tight mb-3">
                  What this service delivers.
                </h2>
                <p className="text-gray-500 leading-relaxed text-sm mb-8 max-w-2xl">
                  Each capability below is delivered by an in-house team — no sub-contracted scope, no finger-pointing. Every line item is auditable to a recognised national or international standard.
                </p>
              </FadeIn>

              {/* Capabilities grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.capabilities.map((cap, i) => (
                  <FadeIn key={i} delay={i * 0.05}>
                    <div className="group h-full bg-[#F7F9FC] border border-gray-200 rounded-xl p-5 hover:border-[#E8751A]/40 hover:bg-white hover:shadow-lg hover:shadow-[#152D4F]/5 transition-all">
                      <div className="mb-2">
                        <h3 className="text-sm font-bold text-[#152D4F] group-hover:text-[#E8751A] transition-colors leading-snug pt-1">
                          {cap.text}
                        </h3>
                      </div>
                      {cap.subItems && cap.subItems.length > 0 && (
                        <ul className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                          {cap.subItems.map((sub, j) => (
                            <li key={j} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                              <Check className="w-3 h-3 text-[#E8751A] flex-shrink-0 mt-0.5" />
                              {sub}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>

            {/* RIGHT — Sticky sidebar */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32 space-y-5">
                {/* Contact card */}
                <FadeIn delay={0.1}>
                  <div className="bg-[#152D4F] rounded-2xl p-6 relative overflow-hidden">
                    <div
                      className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none opacity-10"
                      style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 65%)' }}
                    />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-[#E8751A]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#E8751A]">
                          Get a quote
                        </span>
                      </div>
                      <h3 className="text-white text-lg font-bold leading-tight mb-2">
                        Talk to an engineer about {data.shortName}.
                      </h3>
                      <p className="text-white/60 text-xs leading-relaxed mb-5">
                        Within 48 hours, you&apos;ll get a capability-mapped proposal — engineered, costed, accountable.
                      </p>
                      <button
                        onClick={() => navigate('contact')}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#E8751A] hover:bg-[#D4691A] text-white font-semibold px-5 py-3 rounded-lg transition-colors text-sm mb-3 group"
                      >
                        Request a quote
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </button>
                      <a
                        href={telLink('9941905833')}
                        className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-5 py-3 rounded-lg transition-colors text-sm border border-white/15"
                      >
                        <Phone className="w-4 h-4" />
                        +91 99419 05833
                      </a>
                    </div>
                  </div>
                </FadeIn>

                {/* Quick stats */}
                <FadeIn delay={0.15}>
                  <div className="bg-[#F7F9FC] border border-gray-200 rounded-2xl p-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                      Why choose SVEPL
                    </h4>
                    <div className="space-y-3">
                      {quickStats.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                            <item.icon className={`w-4 h-4 ${item.color}`} />
                          </div>
                          <span className="text-sm text-[#152D4F] font-medium">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>

                {/* Back to all services */}
                <FadeIn delay={0.2}>
                  <button
                    onClick={() => navigate('services')}
                    className="w-full inline-flex items-center justify-center gap-2 text-[#152D4F] hover:text-[#E8751A] font-semibold text-sm transition-colors py-3"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Back to all services
                  </button>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          RELATED PROJECTS / SOLAR REFERENCES
          ════════════════════════════════════════════════════════════ */}
      {data.solarReferences && data.solarReferences.length > 0 && (
        <section className="bg-white py-14 lg:py-20 border-t border-gray-100">
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
            <FadeIn>
              <div className="grid lg:grid-cols-12 gap-6 mb-10 items-end">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3 mb-3">
                    <Sun className="w-4 h-4 text-[#E8751A]" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8751A]">
                      Solar references
                    </span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-[#152D4F] leading-tight">
                    Solar projects we&apos;ve delivered.
                  </h2>
                </div>
                <div className="lg:col-span-5">
                  <p className="text-gray-500 leading-relaxed text-sm">
                    A snapshot of rooftops, ground-mounts, and utility-scale plants we&apos;ve commissioned across India.
                  </p>
                </div>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.solarReferences.map((ref, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className="group bg-[#F7F9FC] border border-gray-200 rounded-xl p-5 hover:border-[#E8751A]/40 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E8751A]/10 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-[#E8751A]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#152D4F] group-hover:text-[#E8751A] transition-colors">
                          {ref}
                        </p>
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider">
                          Solar reference
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.relatedProjects.length > 0 && !data.solarReferences && (
        <section className="bg-white py-14 lg:py-20 border-t border-gray-100">
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
            <FadeIn>
              <div className="grid lg:grid-cols-12 gap-6 mb-10 items-end">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3 mb-3">
                    <HardHat className="w-4 h-4 text-[#E8751A]" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8751A]">
                      Related projects
                    </span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-[#152D4F] leading-tight">
                    Delivered work that uses this service.
                  </h2>
                </div>
                <div className="lg:col-span-5">
                  <p className="text-gray-500 leading-relaxed text-sm">
                    A snapshot of recent commissions where this capability was a core scope item.
                  </p>
                </div>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.relatedProjects.map((proj, i) => (
                <FadeIn key={i} delay={i * 0.06}>
                  <div className="group bg-[#F7F9FC] border border-gray-200 rounded-xl p-5 hover:border-[#E8751A]/40 hover:bg-white hover:shadow-md transition-all">
                    <div className="min-w-0">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#152D4F] group-hover:text-[#E8751A] transition-colors">
                          {proj.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {proj.client}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {proj.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          NEXT SERVICE — Inline CTA
          ════════════════════════════════════════════════════════════ */}
      {nextData && nextData.slug !== slug && (
        <section className="bg-[#0D1D3A] py-12 relative overflow-hidden">
          <div
            className="absolute top-1/2 -translate-y-1/2 -left-32 w-[400px] h-[400px] rounded-full pointer-events-none opacity-10"
            style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 65%)' }}
          />
          <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8">
            <button
              onClick={() => navigate('service-detail', { slug: nextData.slug })}
              className="group w-full flex flex-col md:flex-row md:items-center justify-between gap-4 text-left"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8751A] mb-2">
                  Next service
                </p>
                <h3 className="text-2xl lg:text-3xl font-bold text-white group-hover:text-[#E8751A] transition-colors">
                  {nextData.name}
                </h3>
                <p className="text-white/50 text-sm mt-1 italic">
                  {nextData.tagline}
                </p>
              </div>
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-[#E8751A] group-hover:border-[#E8751A] transition-colors">
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          FINAL CTA — Spacious split
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#152D4F] relative overflow-hidden">
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
            {/* Left */}
            <div className="lg:col-span-7">
              <FadeIn>
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
                  Tell us your voltage class, site, and timeline. Within 48 hours, you&apos;ll get a capability-mapped proposal — engineered, costed, accountable.
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
              </FadeIn>
            </div>

            {/* Right — Direct contact card */}
            <FadeIn delay={0.15} className="lg:col-span-5">
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
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Email a brief</p>
                    <p className="text-white font-semibold group-hover:text-[#E8751A] transition-colors break-all">
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
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}
