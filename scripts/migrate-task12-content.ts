/**
 * Task 12 — Content corrections from client doc "Website - New.docx"
 * 1. about_text: add "and entered into overseas market."
 * 2. Service renames: Testing → Testing & Commissioning; Liasion → Liaison (CEIG);
 *    Liasion with TNEB/... → Liaison with Utilities
 * 3. Refresh descriptions to the client-approved wording (exact doc text)
 * 4. Deactivate HT/LT Panel Retrofitting (not in the client's 12-service list)
 * 5. Add 4 missing services: Electrical EPC Solutions, EHV / HV Substations,
 *    Industrial Electrification, HT & LT Panel Manufacturing
 * 6. Renumber orders 1..12 to match the doc sequence
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const ABOUT_TEXT =
  'Shri Vaari Electricals Pvt. Ltd. is a professionally managed, multi-location based engineering firm, having market leadership in South India and on its way to establish significant position in the pan Indian market and entered into overseas market. We offer innovative and value-added solutions to our customers for total electrical systems from design to commissioning.'

const SERVICES: {
  slug: string
  name: string
  description: string
  features: string[]
  order: number
  active: boolean
}[] = [
  {
    slug: 'design-engineering',
    name: 'Design & Engineering',
    description:
      'SVEPL provides comprehensive design and engineering services for electrical switchyards up to 400 KV. Our team of experienced engineers delivers preliminary and detailed designs for civil, structural, and electrical works, ensuring full compliance with IS/IEC standards.',
    features: [
      'Getting Single window approval',
      'Prelim and detailed design for civil works in switch yards up to 400 KV',
      'Prelim and detailed design for structural works in switch yards up to 400 KV',
      'Prelim and detailed design for electrical works in switch yards up to 400 KV',
      'Complete document preparation works',
      'Preparation of SLD/Electrical layout',
      'Design of Earth mat as per IEEE-80',
      'Design of Lightning system as per IS-2309',
    ],
    order: 1,
    active: true,
  },
  {
    slug: 'project-execution',
    name: 'Project Execution',
    description:
      'SVEPL offers turnkey project management and execution services with a proven track record of delivering complex electrical projects on time and within budget. Our comprehensive approach encompasses scheduling via Microsoft Project, weekly event-based tracking, and domain expertise across all project management areas.',
    features: [
      'Project scheduling based on Microsoft Project software',
      'Tracking the project on weekly/event basis',
      'Domain expertise in comprehensive project management — Integration, Scope, Time, Cost, Quality',
      'Procurement, Human resources, Communications',
      'Risk management',
      'Stakeholder management',
    ],
    order: 2,
    active: true,
  },
  {
    slug: 'testing',
    name: 'Testing & Commissioning',
    description:
      'SVEPL provides comprehensive electrical testing and commissioning services with a NABL-accredited laboratory for CT/PT testing up to 33 KV. Our certified test engineers deliver detailed testing and evaluation of transformers, earthing systems, lightning systems, and condition monitoring services.',
    features: [
      'Comprehensive testing of CT/PT upto 33 KV — Lab accredited by NABL',
      'Testing and evaluation of Distribution and power transformers',
      'Testing and evaluation of Earthing systems',
      'Testing and evaluation of Lightning systems',
      'Testing and evaluation of current transformers/potential transformers',
      'Condition monitoring services for various electrical equipment',
    ],
    order: 3,
    active: true,
  },
  {
    slug: 'energy-harmonic-audit',
    name: 'Energy & Harmonic Audit',
    description:
      'SVEPL offers specialized energy and harmonic audit services backed by a comprehensive team with domain expertise across various industries. Our value engineering-based solutions include on-site measurement, detailed data analysis, and recommendations based on economic viability — covering short term, medium term, and long-term measures, all benchmarked against IEEE standards.',
    features: [
      'Wider Industry base',
      'Comprehensive team with domain expertise in various industries',
      'Value engineering based solutions',
      'Comparison with relevant industry benchmark & IEEE',
      'Preliminary data analysis / Measurement at site / Data analysis',
      'Recommendations based on economic viability — short, medium & long-term measures',
      'Report submission, discussion of recommendation with the customer & finalizing the report',
    ],
    order: 4,
    active: true,
  },
  {
    slug: 'amc',
    name: 'AMC',
    description:
      'SVEPL provides comprehensive Annual Maintenance Contract services with 16+ years of experience and a team of 150+ employees. Our specialized teams offer preventive and breakdown maintenance for panels, troubleshooting, testing of equipment, HVAC, and solar systems. We serve multinational companies with standardized annual rate contracts for complete transparency.',
    features: [
      'Wider Industry base',
      'Comprehensive team with domain expertise in Panels/Troubleshooting/Testing of equipment/HVAC/Solar',
      '150+ employees',
      '16+ years of experience in AMC services',
      'Exclusive services for Multinational companies',
      'Standardized annual rate contracts for transparency',
    ],
    order: 5,
    active: true,
  },
  {
    slug: 'liasion-ceig',
    name: 'Liaison with CEIG',
    description:
      'SVEPL facilitates all statutory approvals and CEIG certification for electrical installations. Our established relationships with the electrical inspectorate ensure faster approvals through proper documentation preparation, timely submission, inspection coordination, and safety certificate procurement.',
    features: [
      'Preparation of Drawings and specifications',
      'Submission to electrical inspectorate',
      'Getting Approvals',
      'Arranging Inspection',
      'Getting Safety certificate',
    ],
    order: 6,
    active: true,
  },
  {
    slug: 'liasion-utilities',
    name: 'Liaison with Utilities',
    description:
      'SVEPL provides expert utility liaison services for power supply and grid connectivity across multiple state utilities including TNEB, KPTCL, APTRANSCO, and TSTRANSCO. Our established relationships ensure faster processing of applications, load enhancements, and grid connectivity coordination.',
    features: [
      'Utilities: TNPPCL, TNPGCL, TANTRANSCO',
      'APSPDCL, APEPDCL, APTRANSCO',
      'TSSPDCL, TSTRANSCO, OPTCL, OPDCL',
      'KPTCL, BUSCOM',
      'GMR Aerocity Goa',
      'Coordination with Meter n Relay testing team',
      'Liaison with SE-O&M',
      'Liaison with Non-conventional energy department for approvals — SOLAR, WIND and others',
    ],
    order: 7,
    active: true,
  },
  {
    slug: 'solar-works',
    name: 'Solar Works',
    description:
      'We provide comprehensive Engineering, Procurement, and Construction (EPC) services for rooftop and ground-mounted solar photovoltaic (PV) power plants. Our turnkey solutions cover every stage of the project — from feasibility studies and system design to installation, commissioning, and long term operation and maintenance. With a focus on quality, safety, and performance, we deliver reliable solar energy systems from 10KW to 100MW that help commercial, industrial, institutional, and utility-scale customers reduce energy costs and achieve sustainability goals.',
    features: [
      'Engineering — site survey, energy yield analysis, SLD, grid interconnection design',
      'Procurement — PV modules, inverters, structures, HT/LT switchgear, SCADA, BESS',
      'Construction — civil works, module mounting, HT/LT panel installation, grid synchronization',
      'Solar Solutions — Industrial/Commercial Rooftop, Ground-Mounted, Open Access, Hybrid, Utility-Scale',
      'Battery Energy Storage Solutions (BESS)',
      'Operation & Maintenance Services',
    ],
    order: 8,
    active: true,
  },
  {
    slug: 'electrical-epc-solutions',
    name: 'Electrical EPC Solutions',
    description:
      'SVEPL delivers comprehensive electrical EPC services covering the complete project lifecycle — engineering, procurement, installation, testing, commissioning, and maintenance — for industrial and infrastructure projects. Our single-window accountability ensures seamless execution from concept to commissioning.',
    features: [
      'Electrical system design',
      'Detailed engineering',
      'Equipment procurement',
      'Installation & erection',
      'Testing & commissioning',
      'Utility coordination',
      'Project management',
      'Operation support',
    ],
    order: 9,
    active: true,
  },
  {
    slug: 'ehv-hv-substations',
    name: 'EHV / HV Substations',
    description:
      'SVEPL engineers and executes AIS and GIS substations up to 400 kV with reliable power distribution and protection systems. Our expertise spans switchyard construction, transformer installations, protection systems, relay coordination, SCADA integration, bus duct systems, and grounding systems.',
    features: [
      'Switchyard construction',
      'GIS/AIS substations',
      'Transformer installations',
      'Protection systems',
      'Relay coordination',
      'SCADA integration',
      'Bus duct systems',
      'Grounding systems',
    ],
    order: 10,
    active: true,
  },
  {
    slug: 'industrial-electrification',
    name: 'Industrial Electrification',
    description:
      'SVEPL provides complete industrial electrification solutions for manufacturing plants, process industries, commercial facilities, and infrastructure projects. From power distribution systems to motor control, lighting, earthing, DG synchronization, energy management, and retrofitting — we deliver end-to-end electrification.',
    features: [
      'Power distribution systems',
      'Cable laying and termination',
      'Motor control systems',
      'Lighting systems',
      'Earthing systems',
      'DG synchronization',
      'Energy management',
      'Retrofitting solutions',
    ],
    order: 11,
    active: true,
  },
  {
    slug: 'ht-lt-panel-manufacturing',
    name: 'HT & LT Panel Manufacturing',
    description:
      'SVEPL designs and manufactures high-quality HT Panels, LT panels, and Bus ducts customized to project and industry requirements. Our state-of-the-art 20,000 sq ft manufacturing facility at Guindy produces PCC, MCC, APFC, PLC, Synchronization, VFD, AMF panels, distribution boards, and bus duct systems — all certified to IEC-61439 standards.',
    features: [
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
    order: 12,
    active: true,
  },
]

async function main() {
  // 1. about_text
  await db.siteSetting.update({ where: { key: 'about_text' }, data: { value: ABOUT_TEXT } })
  console.log('✓ about_text updated (entered into overseas market)')

  // 2. Deactivate retrofitting service
  const retro = await db.service.updateMany({
    where: { slug: 'ht-lt-panel-retrofitting' },
    data: { active: false, order: 13 },
  })
  console.log(`✓ HT/LT Panel Retrofitting deactivated (${retro.count})`)

  // 3. Upsert the 12 doc services
  for (const s of SERVICES) {
    const existing = await db.service.findUnique({ where: { slug: s.slug } })
    const data = {
      name: s.name,
      description: s.description,
      features: JSON.stringify(s.features),
      order: s.order,
      active: s.active,
    }
    if (existing) {
      await db.service.update({ where: { slug: s.slug }, data })
      console.log(`✓ updated  [${s.order}] ${s.name}`)
    } else {
      await db.service.create({ data: { slug: s.slug, ...data } })
      console.log(`✓ created  [${s.order}] ${s.name}`)
    }
  }

  const total = await db.service.count({ where: { active: true } })
  console.log(`\nActive services now: ${total} (doc: 12)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
