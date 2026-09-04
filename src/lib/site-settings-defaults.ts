/**
 * Site settings defaults — every editable site setting with its fallback
 * value. The /api/settings GET endpoint merges these under the live database
 * values, so:
 *   - the public pages always have a sensible value to render, and
 *   - the admin Settings screen shows every editable key (existing or not)
 *     and any value saved there overrides the default from then on.
 *
 * Values are all plain strings; JSON-valued keys (products_comparison,
 * products_specs) are parsed with the helpers at the bottom of this file.
 */

/* ── Products page structured-content defaults ──────────────────────────── */

export interface ComparisonRow {
  attribute: string
  lt: string
  ht: string
  bd: string
}

export interface SpecRow {
  param: string
  lt: string
  ht: string
  bd: string
}

export const DEFAULT_COMPARISON_ROWS: ComparisonRow[] = [
  { attribute: 'Voltage Range', lt: 'Up to 415V', ht: '11kV – 33kV', bd: 'Up to 6300A' },
  { attribute: 'Insulation Class', lt: 'Class B (130°C)', ht: 'Class F (155°C)', bd: 'Class F (155°C)' },
  { attribute: 'Busbar Material', lt: 'Copper / Aluminium', ht: 'Copper (Silver Plated)', bd: 'Copper / Aluminium' },
  { attribute: 'Protection Relay', lt: 'Thermal / Magnetic', ht: 'Numerical / Microprocessor', bd: 'MCCB / Fuses' },
  { attribute: 'Enclosure Rating', lt: 'IP42 – IP54', ht: 'IP54 – IP65', bd: 'IP54 – IP65' },
  { attribute: 'Short Circuit', lt: 'Up to 50 kA', ht: 'Up to 40 kA (1 sec)', bd: 'Up to 100 kA (1 sec)' },
  { attribute: 'Application', lt: 'Commercial / Residential', ht: 'Industrial / Utility', bd: 'High-current distribution' },
]

export const DEFAULT_SPEC_ROWS: SpecRow[] = [
  { param: 'Rated Voltage', lt: '415V', ht: '11kV / 33kV', bd: 'Up to 1000V' },
  { param: 'Rated Current', lt: '630A – 6300A', ht: '630A – 4000A', bd: '630A – 6300A' },
  { param: 'Frequency', lt: '50 Hz', ht: '50 Hz', bd: '50 Hz' },
  { param: 'Busbar System', lt: 'Single / Double', ht: 'Single Busbar', bd: 'Segregated / Non-seg.' },
  { param: 'Cable Entry', lt: 'Bottom / Top', ht: 'Bottom', bd: 'Plug-in / Bolted' },
  { param: 'Paint Finish', lt: 'Powder Coated (RAL 7035)', ht: 'Powder Coated (RAL 7035)', bd: 'Powder Coated (RAL 7035)' },
  { param: 'Standards', lt: 'IS 8623 / IEC 61439', ht: 'IS 3427 / IEC 62271', bd: 'IEC 61439 / IS 8623' },
  { param: 'Degree of Protection', lt: 'IP42 / IP54', ht: 'IP54 / IP65', bd: 'IP54 / IP65' },
  { param: 'Operating Temp.', lt: '-5°C to +50°C', ht: '-5°C to +50°C', bd: '-5°C to +50°C' },
  { param: 'Humidity', lt: '≤ 95% RH', ht: '≤ 95% RH', bd: '≤ 95% RH' },
]

/* ── Settings map ───────────────────────────────────────────────────────── */

export const SITE_SETTINGS_DEFAULTS: Record<string, string> = {
  // ── Company ────────────────────────────────────────────────────────────
  company_name: 'Shri Vaari Electricals Pvt Ltd',
  company_email: 'srivaari@gmail.com',
  company_phone: '+91 9941905833',
  company_address: 'Chennai, Tamil Nadu, India',
  business_hours: 'Mon-Sat: 9:30am to 6:30pm',
  about_text:
    'Shri Vaari Electricals Pvt. Ltd. is a professionally managed, multi-location based engineering firm, having market leadership in South India and on its way to establish significant position in the pan Indian market. We offer innovative and value-added solutions to our customers for total electrical systems from design to commissioning.',
  youtube_video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',

  // ── Home hero ──────────────────────────────────────────────────────────
  hero_subtitle: 'Design to Post-commissioning',

  // ── Home stats ─────────────────────────────────────────────────────────
  stat_turnover: '125 Crores',
  stat_transmission: '100Km+',
  stat_customers: '3000+',
  stat_employees: '400+',
  stat_branches: '7',
  stat_consultants: '20+',
  stat_mncs: '20+',
  stat_ehv: '30+',

  // ── Products page ──────────────────────────────────────────────────────
  products_hero_eyebrow: 'Technical Catalog',
  products_hero_title: 'Precision-Built Panels',
  products_hero_subtitle:
    'Engineered for reliability. Our LT panels, HT switchgear, and busduct systems meet the most demanding industrial standards with uncompromising quality.',
  /** JSON array of { attribute, lt, ht, bd } rows for the "At a Glance" comparison table. */
  products_comparison: JSON.stringify(DEFAULT_COMPARISON_ROWS),
  /** JSON array of { param, lt, ht, bd } rows for the "Technical Specifications" table. */
  products_specs: JSON.stringify(DEFAULT_SPEC_ROWS),
}

/* ── Parsers ────────────────────────────────────────────────────────────── */

/** Parse the products_comparison setting, falling back to the bundled rows. */
export function parseComparisonRows(raw: string | undefined): ComparisonRow[] {
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as ComparisonRow[]
    } catch {
      /* fall through to defaults */
    }
  }
  return DEFAULT_COMPARISON_ROWS
}

/** Parse the products_specs setting, falling back to the bundled rows. */
export function parseSpecRows(raw: string | undefined): SpecRow[] {
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as SpecRow[]
    } catch {
      /* fall through to defaults */
    }
  }
  return DEFAULT_SPEC_ROWS
}
