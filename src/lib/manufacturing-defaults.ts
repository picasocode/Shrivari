// ───────────────────────────────────────────────────────────────────────────
// Canonical Manufacturing page catalog.
//
// Mirrors the cards hardcoded on the Manufacturing page before it became
// DB-backed. Used by the /api/manufacturing bootstrap to self-provision the
// table + rows on first request (so production MySQL needs no manual
// migration), and as the public page's offline fallback.
// ───────────────────────────────────────────────────────────────────────────

export interface ManufacturingDefault {
  slug: string
  name: string
  tagline: string
  description: string
  image: string
  features: string[]
  icon: string
  order: number
}

export const MANUFACTURING_DEFAULTS: ManufacturingDefault[] = [
  {
    slug: 'pcc',
    name: 'PCC Panels',
    tagline: 'Power Control Center',
    description: 'Power control center panels designed for efficient and centralized power distribution across industrial and infrastructure installations.',
    image: '/images/manufacturing/pcc.jpg',
    icon: 'Zap',
    features: ['Centralized distribution', 'Main incoming breaker', 'Bus bar design up to 6300A', 'Metering & protection'],
    order: 1,
  },
  {
    slug: 'mcc',
    name: 'MCC Panels',
    tagline: 'Motor Control Center',
    description: 'Motor control center panels for industrial motor operations and process control, engineered for reliability and safety.',
    image: '/images/manufacturing/mcc.jpg',
    icon: 'Cpu',
    features: ['Motor starters', 'Contactor & relay logic', 'DOL / Star-Delta / RDF', 'Process interlocks'],
    order: 2,
  },
  {
    slug: 'apfc',
    name: 'APFC Panels',
    tagline: 'Automatic Power Factor Correction',
    description: 'Automatic power factor correction panels for energy efficiency optimization, reducing kVA demand and penalty charges.',
    image: '/images/manufacturing/apfc.jpg',
    icon: 'Gauge',
    features: ['Capacitor banks', 'Reactor harmonics control', 'Automatic controller', 'Step-wise switching'],
    order: 3,
  },
  {
    slug: 'plc',
    name: 'PLC Automation Panels',
    tagline: 'Programmable Logic Control',
    description: 'Automation and process control panels with advanced PLC integration, enabling smart industrial operations and remote monitoring.',
    image: '/images/manufacturing/plc.jpg',
    icon: 'CircuitBoard',
    features: ['PLC integrated control', 'HMI touch interface', 'I/O modules', 'SCADA ready'],
    order: 4,
  },
  {
    slug: 'sync',
    name: 'Synchronization Panels',
    tagline: 'Generator & Utility Sync',
    description: 'Generator and utility synchronization systems for uninterrupted operations, enabling seamless parallel operation and load sharing.',
    image: '/images/manufacturing/sync.jpg',
    icon: 'RefreshCw',
    features: ['Auto / manual sync', 'Load sharing', 'Mains & DG parallel', 'Reverse power protection'],
    order: 5,
  },
  {
    slug: 'vfd',
    name: 'VFD Panels',
    tagline: 'Variable Frequency Drive',
    description: 'Variable frequency drive panels for motor speed control and energy optimization across pumps, fans, and process loads.',
    image: '/images/manufacturing/vfd.jpg',
    icon: 'Activity',
    features: ['Speed control', 'Energy optimization', 'Soft start / stop', 'Harmonics mitigation'],
    order: 6,
  },
  {
    slug: 'scada',
    name: 'SAS / SCADA Systems',
    tagline: 'Substation Automation & Supervisory Control',
    description: 'Substation automation systems and SCADA solutions for real-time monitoring, control, and data acquisition across electrical networks.',
    image: '/images/manufacturing/scada-panel.jpg',
    icon: 'MonitorPlay',
    features: ['Real-time monitoring', 'Remote control', 'Data acquisition', 'Event & alarm logging'],
    order: 7,
  },
  {
    slug: 'cr',
    name: 'C&R Panels',
    tagline: 'Control & Relay Panel',
    description: 'Control and relay panels for controlling and protecting electrical equipment — housing protection relays, auxiliary relays, MCBs, control switches, and indication lamps.',
    image: '/images/manufacturing/cr-panel-svepl.jpg',
    icon: 'ShieldCheck',
    features: ['Overcurrent & earth fault relays', 'Breaker trip signal', 'Breaker control & status indication', 'Alarms & interlocking'],
    order: 8,
  },
]

// Default careers shown on the public Careers page — seeded once via the
// /api/careers bootstrap (deduped by title) so admins can edit them from
// the panel. Accent colors mirror the page's department color map.
export const CAREER_DEFAULTS = [
  { title: 'Senior Electrical Engineer', location: 'Chennai', experience: '5-10 years', department: 'Engineering', type: 'Full-time', icon: 'Zap', accent: '#1B3A5C' },
  { title: 'Project Manager — Solar EPC', location: 'Bangalore', experience: '8-12 years', department: 'Operations', type: 'Full-time', icon: 'Hammer', accent: '#E8751A' },
  { title: 'Testing & Commissioning Engineer', location: 'Hyderabad', experience: '3-7 years', department: 'Engineering', type: 'Full-time', icon: 'FlaskConical', accent: '#1B3A5C' },
  { title: 'Site Engineer — Transmission Lines', location: 'Multiple Locations', experience: '2-5 years', department: 'Operations', type: 'Full-time', icon: 'Building2', accent: '#E8751A' },
  { title: 'Design Engineer — LT/HT Panels', location: 'Chennai', experience: '3-6 years', department: 'Design', type: 'Full-time', icon: 'Lightbulb', accent: '#7C3AED' },
  { title: 'Liasion Officer — CEIG/TNEB', location: 'Chennai', experience: '5-10 years', department: 'Operations', type: 'Full-time', icon: 'Shield', accent: '#E8751A' },
  { title: 'AMC Service Technician', location: 'Pondicherry', experience: '2-4 years', department: 'Service', type: 'Full-time', icon: 'Sparkles', accent: '#0D9488' },
  { title: 'Graduate Engineer Trainee', location: 'All Branches', experience: 'Freshers Welcome', department: 'Engineering', type: 'Full-time', icon: 'GraduationCap', accent: '#1B3A5C' },
]

// ───────────────────────────────────────────────────────────────────────────
// Raw SQL that creates the ManufacturingItem table — written to be valid on
// BOTH MySQL (production) and SQLite (local snapshots). No identifier quotes
// except backticks around the reserved word `order` (SQLite accepts MySQL
// backtick quoting too). TEXT columns carry no SQL-level defaults (MySQL
// forbids them); the Prisma model supplies app-level defaults instead.
// ───────────────────────────────────────────────────────────────────────────
export const MANUFACTURING_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS ManufacturingItem (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  tagline VARCHAR(191) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(1024) NOT NULL,
  features TEXT NOT NULL,
  icon VARCHAR(191) NOT NULL,
  \`order\` INT NOT NULL,
  active BOOLEAN NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
)`.trim()

export const CAREER_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS Career (
  id VARCHAR(191) PRIMARY KEY,
  title VARCHAR(191) NOT NULL,
  location VARCHAR(191) NOT NULL,
  experience VARCHAR(191) NOT NULL,
  department VARCHAR(191) NOT NULL,
  type VARCHAR(191) NOT NULL,
  icon VARCHAR(191) NOT NULL,
  accent VARCHAR(191) NOT NULL,
  \`order\` INT NOT NULL,
  active BOOLEAN NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
)`.trim()
