/**
 * Canonical product catalog defaults — the single source of truth for the
 * product range (LT Panels, HT Panels, Busducts).
 *
 * Used by:
 *  - /api/products GET  -> ensureDefaultProducts(): creates any missing
 *    canonical product rows and replaces legacy placeholder images, so the
 *    live database is always complete and every card is admin-editable.
 *  - /api/seed          -> fresh installs seed exactly this catalog.
 *
 * Product photos live in /public/images/products/<slug>.jpg (client-supplied,
 * named after the product slug). Products without a client photo have an
 * empty imageUrl (admin can set one in the admin panel at any time).
 */

export const LEGACY_PLACEHOLDER_IMAGE = 'https://shrivaarielectricals.com/img/portfolio/630x400.jpg'

export interface DefaultProduct {
  name: string
  slug: string
  category: 'LT Panels' | 'HT Panels' | 'Busducts'
  description: string
  features: string
  imageUrl: string
  order: number
}

export const DEFAULT_PRODUCTS: DefaultProduct[] = [
  {
    "name": "CRP - Control & Relay Panel",
    "slug": "crp-control-relay-panel",
    "category": "LT Panels",
    "description": "Control and Relay Panels are designed for protection, control, and monitoring of electrical power systems. These panels house relays, control switches, and indicating instruments for effective power system management. Built with high-quality components and strict adherence to IS/IEC standards, our CRP panels ensure reliable operation in demanding industrial environments.",
    "features": "[\"Numerical/digital relay integration\",\"SCADA compatibility\",\"Anti-pumping and trip circuit supervision\",\"Customized mimic bus bar arrangement\",\"Dust and vermin proof enclosures\",\"Type tested for short circuit withstand\"]",
    "order": 1,
    "imageUrl": "/images/products/crp-control-relay-panel.jpg"
  },
  {
    "name": "PCC - Power Control Centre",
    "slug": "pcc-power-control-centre",
    "category": "LT Panels",
    "description": "Power Control Centres are the central distribution boards that receive power from transformers or generators and distribute it to various loads. Our PCC panels are engineered for maximum safety, reliability, and ease of maintenance, featuring robust busbar systems and advanced protection schemes suitable for heavy industrial applications.",
    "features": "[\"Rated up to 6300A busbar capacity\",\"Fully type-tested assemblies\",\"Drawout and fixed type ACBs\",\"Integrated power monitoring systems\",\"Capacitor bank integration for PF correction\",\"Multi-tier busbar arrangements\"]",
    "order": 2,
    "imageUrl": "/images/products/pcc-power-control-centre.jpg"
  },
  {
    "name": "MCC - Motor Control Centre",
    "slug": "mcc-motor-control-centre",
    "category": "LT Panels",
    "description": "Motor Control Centres provide centralized control and protection for multiple electric motors. Our MCC panels feature intelligent motor protection relays, soft starters, and VFD integration, ensuring optimal motor performance and energy efficiency across industrial operations.",
    "features": "[\"Intelligent motor protection relays\",\"VFD and soft starter integration\",\"DOL and star-delta starters\",\"Auto/manual control modes\",\"Interlocking and safety features\",\"Plug-in type compartments for easy maintenance\"]",
    "order": 3,
    "imageUrl": "/images/products/mcc-motor-control-centre.jpg"
  },
  {
    "name": "PMCC - Power Motor Control Centre",
    "slug": "pmcc-power-motor-control-centre",
    "category": "LT Panels",
    "description": "Power Motor Control Centres combine the functionality of PCC and MCC in a single integrated panel. These hybrid panels are ideal for medium-scale industries that need both power distribution and motor control in a compact footprint, reducing installation costs and floor space requirements.",
    "features": "[\"Combined PCC and MCC functionality\",\"Optimized floor space utilization\",\"Integrated power and motor control\",\"Simplified cabling and installation\",\"Centralized monitoring and control\",\"Cost-effective solution for medium industries\"]",
    "order": 4,
    "imageUrl": "/images/products/pmcc-power-motor-control-centre.jpg"
  },
  {
    "name": "SSBs - Sub Switch Board",
    "slug": "ssbs-sub-switch-board",
    "category": "LT Panels",
    "description": "Sub Switch Boards distribute power from the main PCC to specific areas or departments within a facility. Designed for flexibility and safety, our SSBs feature modular construction, allowing easy expansion and modification as facility needs evolve.",
    "features": "[\"Modular and expandable design\",\"SFU/MCCB incoming options\",\"Outgoing feeders with individual protection\",\"Isolating switches for safe maintenance\",\"Compact footprint for space-constrained areas\",\"Compliance with IS 8623 / IEC 61439\"]",
    "order": 5,
    "imageUrl": "/images/products/ssbs-sub-switch-board.jpg"
  },
  {
    "name": "DG - DG Synchronization Panel",
    "slug": "dg-synchronization-panel",
    "category": "LT Panels",
    "description": "DG Synchronization Panels enable multiple diesel generators to operate in parallel, sharing the load efficiently. Our synchronization panels feature advanced auto-synch relays, load sharing controllers, and comprehensive protection systems for seamless power backup in critical facilities.",
    "features": "[\"Auto/manual synchronization modes\",\"Active and reactive load sharing\",\"Reverse power relay protection\",\"Black start capability\",\"Auto start-stop with mains failure detection\",\"Multi-generator paralleling up to 16 sets\"]",
    "order": 6,
    "imageUrl": "/images/products/dg-synchronization-panel.jpg"
  },
  {
    "name": "APFC - Automatic Power Factor Control",
    "slug": "apfc-automatic-power-factor-control",
    "category": "LT Panels",
    "description": "Automatic Power Factor Control panels dynamically switch capacitor banks to maintain the power factor close to unity, reducing electricity bills and avoiding penalties from utilities. Our APFC panels feature intelligent controllers with real-time monitoring and step-wise capacitor switching.",
    "features": "[\"Microcontroller-based APFC relay\",\"Real-time PF monitoring and display\",\"Step-wise automatic capacitor switching\",\"Harmonic filtering with detuned reactors\",\"THD monitoring and protection\",\"Target PF setting (0.95 to 0.99)\"]",
    "order": 7,
    "imageUrl": "/images/products/apfc-automatic-power-factor-control.jpg"
  },
  {
    "name": "PLC - Program Logic Control",
    "slug": "plc-program-logic-control",
    "category": "LT Panels",
    "description": "Programmable Logic Control panels integrate industrial automation with electrical power distribution. Our PLC panels feature industry-standard controllers from Siemens, Allen Bradley, and Schneider, enabling intelligent process control, data acquisition, and remote monitoring capabilities.",
    "features": "[\"SCADA and HMI integration\",\"Modular I/O configuration\",\"Communication protocols (Modbus, Profibus, Ethernet)\",\"Data logging and trending\",\"Alarm management systems\",\"Remote monitoring and control capability\"]",
    "order": 8,
    "imageUrl": "/images/products/plc-program-logic-control.jpg"
  },
  {
    "name": "Busducts",
    "slug": "busducts",
    "category": "LT Panels",
    "description": "Busducts are enclosed busbar systems used for high-current power distribution between transformers, panels, and loads. Our busducts are manufactured with high-conductivity copper or aluminum busbars, insulated and enclosed for safe, reliable, and efficient power transmission across industrial facilities.",
    "features": "[\"Copper and aluminum busbar options\",\"Ratings up to 6300A\",\"IP54/IP65 protection levels\",\"Plug-in tap-off boxes for flexibility\",\"Fire-rated and non-fire-rated variants\",\"Low impedance design for minimal voltage drop\"]",
    "order": 9,
    "imageUrl": "/images/products/busducts.jpg"
  },
  {
    "name": "11 KV Panel",
    "slug": "11-kv-panel",
    "category": "HT Panels",
    "description": "11 KV HT Panels are designed for receiving and distributing high tension power at 11kV voltage level. These panels feature vacuum circuit breakers, current and voltage transformers, and comprehensive protection relays for safe and reliable medium voltage power distribution in industrial and commercial facilities.",
    "features": "[\"VCB rated up to 630A/1250A\",\"Current transformer and potential transformer integration\",\"Numerical relay protection (overcurrent, earth fault)\",\"Busbar rating up to 1250A\",\"Interlocked and safety-grounded design\",\"Indoor and outdoor configurations\"]",
    "order": 10,
    "imageUrl": "/images/products/11-kv-panel.jpg"
  },
  {
    "name": "22 KV Panel",
    "slug": "22-kv-panel",
    "category": "HT Panels",
    "description": "22 KV HT Panels are engineered for medium voltage power distribution at the 22kV level. These panels are commonly used in large industrial plants and utility substations, featuring advanced vacuum circuit breaker technology and sophisticated protection systems for critical power infrastructure.",
    "features": "[\"VCB with high breaking capacity\",\"Comprehensive protection scheme\",\"Auto-reclosing functionality\",\"SCADA integration ready\",\"Seismic-qualified construction\",\"Type tested as per IS/IEC standards\"]",
    "order": 11,
    "imageUrl": "/images/products/22-kv-panel.jpg"
  },
  {
    "name": "33 KV Panel",
    "slug": "33-kv-panel",
    "category": "HT Panels",
    "description": "33 KV HT Panels are the highest voltage class panels in our product range, designed for heavy industrial applications and utility substations. These panels incorporate state-of-the-art vacuum/SF6 circuit breakers, advanced numerical relays, and robust busbar systems for mission-critical power distribution.",
    "features": "[\"VCB/SF6 circuit breaker options\",\"Busbar ratings up to 2000A\",\"Advanced numerical protection relays\",\"Differential protection for transformers\",\"Auto-changeover and interlocking\",\"Complete switchyard solutions\"]",
    "order": 12,
    "imageUrl": "/images/products/33-kv-panel.jpg"
  },
  {
    "name": "Segregated Phase Busduct",
    "slug": "segregated-phase-busduct",
    "category": "Busducts",
    "description": "Segregated phase busducts feature each phase conductor in its own grounded metallic enclosure, reducing electromagnetic forces and improving short-circuit withstand. Ideal for high-current generator connections and large industrial power distribution.",
    "features": "[\"Each phase in separate metallic enclosure\",\"Reduced electromagnetic forces between phases\",\"Ratings up to 6300A\",\"High short-circuit withstand capability\",\"Forced-air or natural cooling options\",\"Suitable for generator and transformer connections\"]",
    "order": 10,
    "imageUrl": "/images/products/segregated-phase-busduct.jpg"
  },
  {
    "name": "Non-Segregated Phase Busduct",
    "slug": "non-segregated-phase-busduct",
    "category": "Busducts",
    "description": "Non-segregated phase busducts house all phase conductors in a common metallic enclosure, offering a compact and economical solution for medium-current distribution between transformers, switchgear, and loads.",
    "features": "[\"All phases in a common enclosure\",\"Compact footprint for space-constrained installations\",\"Ratings up to 4000A\",\"Copper or aluminum busbar options\",\"Indoor and outdoor configurations\",\"Lower cost alternative for medium-current applications\"]",
    "order": 11,
    "imageUrl": "/images/products/non-segregated-phase-busduct.jpg"
  },
  {
    "name": "Isolated Phase Busduct (IPB)",
    "slug": "isolated-phase-busduct",
    "category": "Busducts",
    "description": "Isolated Phase Busducts enclose each phase conductor in its own individual housing, typically used for very high-current generator outputs in power plants. Provides maximum safety, minimal electromagnetic interference, and reliable power transmission.",
    "features": "[\"Individual phase enclosures for maximum safety\",\"Ratings from 4000A to 25000A\",\"Minimal electromagnetic field emissions\",\"Forced-air cooling for high-current ratings\",\"Generator and transformer terminal connections\",\"Power plant grade construction\"]",
    "order": 12,
    "imageUrl": ""
  },
  {
    "name": "Plug-in Tap-off Boxes",
    "slug": "plug-in-tap-off-boxes",
    "category": "Busducts",
    "description": "Plug-in tap-off boxes provide flexible power take-off points along a busduct run, enabling easy connection of loads or distribution panels without disrupting the main busbar. Available in various ratings with integrated protection.",
    "features": "[\"Hot-pluggable tap-off points\",\"Integrated MCCB or fuse protection\",\"Ratings from 100A to 630A\",\"Lockable safety interlocks\",\"Quick disconnect for maintenance\",\"Compatible with segregated and non-segregated busducts\"]",
    "order": 13,
    "imageUrl": ""
  }
]

/** slug -> bundled photo path (only products that have a real photo). */
export const DEFAULT_PRODUCT_IMAGES: Record<string, string> = Object.fromEntries(
  DEFAULT_PRODUCTS.filter(p => p.imageUrl).map(p => [p.slug, p.imageUrl])
)

/**
 * Returns the product with a resolved imageUrl: legacy placeholder URLs are
 * swapped for the bundled slug photo. Empty imageUrl is left empty (admin
 * intentionally cleared it).
 */
export function resolveProductImage<T extends { slug: string; imageUrl: string }>(
  product: T
): T {
  if (product.imageUrl === LEGACY_PLACEHOLDER_IMAGE && DEFAULT_PRODUCT_IMAGES[product.slug]) {
    return { ...product, imageUrl: DEFAULT_PRODUCT_IMAGES[product.slug] }
  }
  return product
}
