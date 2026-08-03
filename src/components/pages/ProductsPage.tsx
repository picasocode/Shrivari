'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ChevronRight,
  CheckCircle,
  Zap,
  Shield,
  ArrowRight,
  ArrowUpRight,
  CircuitBoard,
  Boxes,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter, type PageName } from '@/components/Router'
import { fetchProducts, type Product } from '@/lib/api'

/* ─── Tokens (used sparingly — coral hairlines + ink text) ─── */
const CORAL = '#E8751A'
const INK = '#1A1A2E'

/* ─── FadeIn Helper ─── */
function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Helpers ─── */
function parseFeatures(features: string): string[] {
  try {
    const parsed = JSON.parse(features)
    if (Array.isArray(parsed)) return parsed
    return []
  } catch {
    return features ? features.split(',').map(f => f.trim()).filter(Boolean) : []
  }
}

/* ─── Comparison + Spec data ─── */
const COMPARISON_DATA = [
  { attribute: 'Voltage Range', lt: 'Up to 415V', ht: '11kV – 33kV', bd: 'Up to 6300A' },
  { attribute: 'Insulation Class', lt: 'Class B (130°C)', ht: 'Class F (155°C)', bd: 'Class F (155°C)' },
  { attribute: 'Busbar Material', lt: 'Copper / Aluminium', ht: 'Copper (Silver Plated)', bd: 'Copper / Aluminium' },
  { attribute: 'Protection Relay', lt: 'Thermal / Magnetic', ht: 'Numerical / Microprocessor', bd: 'MCCB / Fuses' },
  { attribute: 'Enclosure Rating', lt: 'IP42 – IP54', ht: 'IP54 – IP65', bd: 'IP54 – IP65' },
  { attribute: 'Short Circuit', lt: 'Up to 50 kA', ht: 'Up to 40 kA (1 sec)', bd: 'Up to 100 kA (1 sec)' },
  { attribute: 'Application', lt: 'Commercial / Residential', ht: 'Industrial / Utility', bd: 'High-current distribution' },
]

const SPEC_TABLE_DATA = [
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

/* ─── Category meta ─── */
type Variant = 'lt' | 'ht' | 'busduct'
const CATEGORY_META: Record<Variant, { title: string; voltage: string; subtitle: string; Icon: React.ElementType }> = {
  lt: { title: 'Low Tension Panels', voltage: 'Up to 415V', subtitle: 'Distribution and control panels for commercial and residential applications.', Icon: Zap },
  ht: { title: 'High Tension Panels', voltage: '11kV – 33kV', subtitle: 'Switchgear and protection panels for industrial and utility-grade installations.', Icon: Shield },
  busduct: { title: 'Busducts', voltage: 'Up to 6300A', subtitle: 'Enclosed busbar systems for high-current power distribution.', Icon: Boxes },
}

/* ─── Fallback data ─── */
const FALLBACK_IMG = '/images/services/ht-lt-panel-manufacturing.png'
const mkProduct = (p: { name: string; slug: string; category: string; description: string; features: string[]; order: number }): Product => ({
  id: `fallback-${p.slug}`,
  name: p.name,
  slug: p.slug,
  category: p.category,
  description: p.description,
  features: JSON.stringify(p.features),
  imageUrl: FALLBACK_IMG,
  order: p.order,
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

const FALLBACK_LT: Product[] = [
  { name: 'CRP - Control & Relay Panel', slug: 'crp-control-relay-panel', category: 'LT Panels', order: 1, description: 'Control and Relay Panels are designed for protection, control, and monitoring of electrical power systems. These panels house relays, control switches, and indicating instruments for effective power system management.', features: ['Numerical/digital relay integration', 'SCADA compatibility', 'Anti-pumping and trip circuit supervision', 'Customized mimic bus bar arrangement', 'Dust and vermin proof enclosures', 'Type tested for short circuit withstand'] },
  { name: 'PCC - Power Control Centre', slug: 'pcc-power-control-centre', category: 'LT Panels', order: 2, description: 'Power Control Centres are the central distribution boards that receive power from transformers or generators and distribute it to various loads. Our PCC panels feature robust busbar systems and advanced protection schemes.', features: ['Rated up to 6300A busbar capacity', 'Fully type-tested assemblies', 'Drawout and fixed type ACBs', 'Integrated power monitoring systems', 'Capacitor bank integration for PF correction', 'Multi-tier busbar arrangements'] },
  { name: 'MCC - Motor Control Centre', slug: 'mcc-motor-control-centre', category: 'LT Panels', order: 3, description: 'Motor Control Centres provide centralized control and protection for multiple electric motors. Our MCC panels feature intelligent motor protection relays, soft starters, and VFD integration.', features: ['Intelligent motor protection relays', 'VFD and soft starter integration', 'DOL and star-delta starters', 'Auto/manual control modes', 'Interlocking and safety features', 'Plug-in type compartments for maintenance'] },
  { name: 'APFC - Automatic Power Factor Control', slug: 'apfc-automatic-power-factor-control', category: 'LT Panels', order: 4, description: 'Automatic Power Factor Control panels dynamically switch capacitor banks to maintain the power factor close to unity, reducing electricity bills and avoiding penalties from utilities.', features: ['Microcontroller-based APFC relay', 'Real-time PF monitoring and display', 'Step-wise automatic capacitor switching', 'Harmonic filtering with detuned reactors', 'THD monitoring and protection', 'Target PF setting (0.95 to 0.99)'] },
  { name: 'DG Synchronization Panel', slug: 'dg-synchronization-panel', category: 'LT Panels', order: 5, description: 'DG Synchronization Panels enable multiple diesel generators to operate in parallel, sharing the load efficiently. Our synchronization panels feature advanced auto-synch relays and load sharing controllers.', features: ['Auto/manual synchronization modes', 'Active and reactive load sharing', 'Reverse power relay protection', 'Black start capability', 'Auto start-stop with mains failure detection', 'Multi-generator paralleling up to 16 sets'] },
  { name: 'PLC - Program Logic Control', slug: 'plc-program-logic-control', category: 'LT Panels', order: 6, description: 'Programmable Logic Control panels integrate industrial automation with electrical power distribution. Our PLC panels feature industry-standard controllers from Siemens, Allen Bradley, and Schneider.', features: ['SCADA and HMI integration', 'Modular I/O configuration', 'Communication protocols (Modbus, Profibus, Ethernet)', 'Data logging and trending', 'Alarm management systems', 'Remote monitoring and control capability'] },
].map(mkProduct)

const FALLBACK_HT: Product[] = [
  { name: '11 KV Panel', slug: '11-kv-panel', category: 'HT Panels', order: 1, description: '11 KV HT Panels are designed for receiving and distributing high tension power at 11kV voltage level. These panels feature vacuum circuit breakers, current and voltage transformers, and comprehensive protection relays.', features: ['VCB rated up to 630A/1250A', 'Current transformer and potential transformer integration', 'Numerical relay protection (overcurrent, earth fault)', 'Busbar rating up to 1250A', 'Interlocked and safety-grounded design', 'Indoor and outdoor configurations'] },
  { name: '22 KV Panel', slug: '22-kv-panel', category: 'HT Panels', order: 2, description: '22 KV HT Panels are engineered for medium voltage power distribution at the 22kV level. These panels are commonly used in large industrial plants and utility substations, featuring advanced vacuum circuit breaker technology.', features: ['VCB with high breaking capacity', 'Comprehensive protection scheme', 'Auto-reclosing functionality', 'SCADA integration ready', 'Seismic-qualified construction', 'Type tested as per IS/IEC standards'] },
  { name: '33 KV Panel', slug: '33-kv-panel', category: 'HT Panels', order: 3, description: '33 KV HT Panels are designed for high voltage power distribution at the 33kV level. These panels are used in major industrial installations, utility substations, and power transmission networks.', features: ['High breaking capacity VCB', 'Comprehensive numerical protection', 'CT/PT integration for metering', 'Busbar differential protection', 'Auto-reclosing and sectionalizing', 'Type tested for 33kV class'] },
  { name: 'VCB Panel', slug: 'vcb-panel', category: 'HT Panels', order: 4, description: 'Vacuum Circuit Breaker panels provide reliable switching and protection for medium voltage systems. Our VCB panels use vacuum interrupter technology for arc extinction, offering maintenance-free operation and long service life.', features: ['Vacuum interrupter technology', 'Maintenance-free operation', 'Fast fault clearance time', 'High mechanical endurance', 'Motor/spring operating mechanism', 'Integrated protection and control'] },
].map(mkProduct)

const FALLBACK_BD: Product[] = [
  { name: 'Segregated Phase Busduct', slug: 'segregated-phase-busduct', category: 'Busducts', order: 1, description: 'Segregated phase busducts feature each phase conductor in its own grounded metallic enclosure, reducing electromagnetic forces and improving short-circuit withstand. Ideal for high-current generator connections and large industrial power distribution.', features: ['Each phase in separate metallic enclosure', 'Reduced electromagnetic forces between phases', 'Ratings up to 6300A', 'High short-circuit withstand capability', 'Forced-air or natural cooling options', 'Suitable for generator and transformer connections'] },
  { name: 'Non-Segregated Phase Busduct', slug: 'non-segregated-phase-busduct', category: 'Busducts', order: 2, description: 'Non-segregated phase busducts house all phase conductors in a common metallic enclosure, offering a compact and economical solution for medium-current distribution between transformers, switchgear, and loads.', features: ['All phases in a common enclosure', 'Compact footprint for space-constrained installations', 'Ratings up to 4000A', 'Copper or aluminum busbar options', 'Indoor and outdoor configurations', 'Lower cost alternative for medium-current applications'] },
  { name: 'Isolated Phase Busduct (IPB)', slug: 'isolated-phase-busduct', category: 'Busducts', order: 3, description: 'Isolated Phase Busducts enclose each phase conductor in its own individual housing, typically used for very high-current generator outputs in power plants. Provides maximum safety, minimal electromagnetic interference, and reliable power transmission.', features: ['Individual phase enclosures for maximum safety', 'Ratings from 4000A to 25000A', 'Minimal electromagnetic field emissions', 'Forced-air cooling for high-current ratings', 'Generator and transformer terminal connections', 'Power plant grade construction'] },
  { name: 'Plug-in Tap-off Boxes', slug: 'plug-in-tap-off-boxes', category: 'Busducts', order: 4, description: 'Plug-in tap-off boxes provide flexible power take-off points along a busduct run, enabling easy connection of loads or distribution panels without disrupting the main busbar. Available in various ratings with integrated protection.', features: ['Hot-pluggable tap-off points', 'Integrated MCCB or fuse protection', 'Ratings from 100A to 630A', 'Lockable safety interlocks', 'Quick disconnect for maintenance', 'Compatible with segregated and non-segregated busducts'] },
].map(mkProduct)

/* ═════════════════════════ MAIN PAGE ═════════════════════════ */

export default function ProductsPage() {
  const { navigate, router } = useRouter()
  const [ltProducts, setLtProducts] = useState<Product[]>([])
  const [htProducts, setHtProducts] = useState<Product[]>([])
  const [bdProducts, setBdProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Single source of truth for the active tab: the router param.
  const activeTab: Variant =
    router.params?.tab && ['lt', 'ht', 'busduct'].includes(router.params.tab)
      ? (router.params.tab as Variant)
      : 'lt'

  const handleTabChange = (tab: string) => {
    navigate('products', { tab })
  }

  useEffect(() => {
    Promise.all([
      fetchProducts('LT Panels').catch(() => []),
      fetchProducts('HT Panels').catch(() => []),
      fetchProducts('Busducts').catch(() => []),
    ]).then(([lt, ht, bd]) => {
      setLtProducts(lt.length > 0 ? lt : FALLBACK_LT)
      setHtProducts(ht.length > 0 ? ht : FALLBACK_HT)
      setBdProducts(bd.length > 0 ? bd : FALLBACK_BD)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const currentProducts = activeTab === 'lt' ? ltProducts : activeTab === 'ht' ? htProducts : bdProducts
  const meta = CATEGORY_META[activeTab]

  return (
    <div className="bg-white min-h-screen">
      {/* ═══════════ HERO — minimal white ═══════════ */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-[100px] pb-12 md:pb-16">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm mb-10"
          >
            <button onClick={() => navigate('home')} className="text-slate-400 hover:text-slate-700 transition-colors">
              Home
            </button>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-slate-700 font-medium">Products</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-3xl"
          >
            {/* Coral hairline label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-[2px]" style={{ background: CORAL }} />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
                Technical Catalog
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] mb-5" style={{ color: INK }}>
              Precision-Built Panels
            </h1>

            <p className="text-slate-500 text-lg md:text-xl max-w-2xl leading-relaxed">
              Engineered for reliability. Our LT panels, HT switchgear, and
              busduct systems meet the most demanding industrial standards with
              uncompromising quality.
            </p>
          </motion.div>

          {/* Tab switcher — clean outline pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10"
          >
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="bg-transparent border-0 p-0 h-auto gap-2 flex-wrap shadow-none">
                {(['lt', 'ht', 'busduct'] as Variant[]).map(v => {
                  const m = CATEGORY_META[v]
                  const active = activeTab === v
                  return (
                    <TabsTrigger
                      key={v}
                      value={v}
                      className="rounded-full px-5 py-2.5 text-sm font-medium border transition-all data-[state=active]:shadow-none"
                      style={{
                        background: active ? INK : 'transparent',
                        color: active ? '#FFFFFF' : '#475569',
                        borderColor: active ? INK : '#E5E7EB',
                      }}
                    >
                      <m.Icon className="w-4 h-4 mr-2" />
                      {m.title}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ PRODUCTS GRID ═══════════ */}
      <section className="bg-white pb-16 md:pb-24">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          {/* Section header */}
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-12 border-t border-slate-100 pt-10">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <meta.Icon className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                  <span className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
                    {meta.voltage}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: INK }}>
                  {meta.title}
                </h2>
                <p className="text-slate-500 max-w-xl">{meta.subtitle}</p>
              </div>
              <div className="shrink-0 text-sm text-slate-400">
                {currentProducts.length} products
              </div>
            </div>
          </FadeIn>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[0, 1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-72 rounded-2xl" />
                ))}
              </div>
            ) : (
              <>
                <TabsContent value="lt">
                  <ProductGrid products={ltProducts} onNavigate={navigate} />
                </TabsContent>
                <TabsContent value="ht">
                  <ProductGrid products={htProducts} onNavigate={navigate} />
                </TabsContent>
                <TabsContent value="busduct">
                  <ProductGrid products={bdProducts} onNavigate={navigate} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </section>

      {/* ═══════════ COMPARISON — clean side-by-side ═══════════ */}
      <section className="bg-[#F8FAFC] py-16 md:py-24 border-y border-slate-100">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="mb-10 md:mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-[2px]" style={{ background: CORAL }} />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
                  At a Glance
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: INK }}>
                LT, HT & Busducts
              </h2>
              <p className="text-slate-500 max-w-xl">
                Key engineering differences between our three product lines —
                voltage class, protection, and typical application.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            {/* Clean comparison table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left px-5 md:px-6 py-5 font-semibold text-slate-400 text-xs uppercase tracking-wider">
                      Attribute
                    </th>
                    {([
                      { key: 'lt', label: 'LT Panels', sub: 'Up to 415V', Icon: Zap },
                      { key: 'ht', label: 'HT Panels', sub: '11kV – 33kV', Icon: Shield },
                      { key: 'bd', label: 'Busducts', sub: 'Up to 6300A', Icon: Boxes },
                    ] as const).map(c => (
                      <th key={c.key} className="text-left px-5 md:px-6 py-5">
                        <div className="flex items-center gap-2.5">
                          <c.Icon className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
                          <div>
                            <div className="font-bold text-base" style={{ color: INK }}>{c.label}</div>
                            <div className="text-xs text-slate-400 font-normal">{c.sub}</div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_DATA.map((row, i) => (
                    <tr
                      key={row.attribute}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                    >
                      <td className="px-5 md:px-6 py-4 font-medium text-slate-700">
                        {row.attribute}
                      </td>
                      <td className="px-5 md:px-6 py-4 text-slate-600">{row.lt}</td>
                      <td className="px-5 md:px-6 py-4 text-slate-600">{row.ht}</td>
                      <td className="px-5 md:px-6 py-4 text-slate-600">{row.bd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════ TECHNICAL SPECS TABLE ═══════════ */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="mb-10 md:mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-[2px]" style={{ background: CORAL }} />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
                  Specifications
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: INK }}>
                Technical Specifications
              </h2>
              <p className="text-slate-500 max-w-xl">
                Standard specifications across our product range. Custom
                configurations available on request.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left px-5 md:px-6 py-5 font-semibold text-slate-400 text-xs uppercase tracking-wider">
                      Parameter
                    </th>
                    <th className="text-left px-5 md:px-6 py-5 font-semibold text-slate-700">LT Panels</th>
                    <th className="text-left px-5 md:px-6 py-5 font-semibold text-slate-700">HT Panels</th>
                    <th className="text-left px-5 md:px-6 py-5 font-semibold text-slate-700">Busducts</th>
                  </tr>
                </thead>
                <tbody>
                  {SPEC_TABLE_DATA.map((row, i) => (
                    <tr
                      key={row.param}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                    >
                      <td className="px-5 md:px-6 py-4 font-medium text-slate-700">
                        {row.param}
                      </td>
                      <td className="px-5 md:px-6 py-4 text-slate-600">{row.lt}</td>
                      <td className="px-5 md:px-6 py-4 text-slate-600">{row.ht}</td>
                      <td className="px-5 md:px-6 py-4 text-slate-600">{row.bd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xs text-slate-400 mt-4">
              * All specifications are subject to change. Contact our engineering
              team for project-specific requirements.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════ CTA — minimal white ═══════════ */}
      <section className="bg-white pb-20 md:pb-28">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="w-8 h-[2px]" style={{ background: CORAL }} />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
                Get Started
              </span>
              <span className="w-8 h-[2px]" style={{ background: CORAL }} />
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold mb-5 leading-tight" style={{ color: INK }}>
              Need a Custom Panel
              <br />
              Configuration?
            </h2>

            <p className="text-slate-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Our engineering team designs bespoke panel systems tailored to
              your project specifications, site conditions, and compliance
              requirements.
            </p>

            <button
              onClick={() => navigate('contact')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold border-2 transition-all duration-300 group hover:text-white"
              style={{ borderColor: CORAL, color: CORAL }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = CORAL)}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
            >
              Request a Quote
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

/* ═════════════════════════ PRODUCT GRID ═════════════════════════ */

function ProductGrid({
  products,
  onNavigate,
}: {
  products: Product[]
  onNavigate: (page: PageName, params?: Record<string, string>) => void
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <CircuitBoard className="w-12 h-12 text-slate-300 mx-auto mb-4" strokeWidth={1.5} />
        <p className="text-slate-500">No products found in this category.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {products.map((p, i) => {
        const features = parseFeatures(p.features)
        return (
          <FadeIn key={p.id} delay={i * 0.06}>
            {/* Journey-style clean white box */}
            <article className="group relative h-full bg-white rounded-2xl border-2 border-slate-200 overflow-hidden transition-all duration-300 hover:border-slate-300 hover:shadow-lg">
              {/* Large product image */}
              {p.imageUrl && (
                <div className="relative h-52 overflow-hidden bg-slate-50 border-b border-slate-100">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="p-6 md:p-7">
                {/* Category — tiny gray uppercase */}
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400 mb-2">
                  {p.category}
                </p>

                {/* Name */}
                <h3 className="text-xl font-bold mb-3 leading-snug transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: INK }}>
                  {p.name}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-sm leading-relaxed mb-5 line-clamp-2">
                  {p.description}
                </p>

                {/* Features as inline tags */}
                {features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {features.slice(0, 4).map((f, fi) => (
                      <span
                        key={fi}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100"
                      >
                        <CheckCircle className="w-3 h-3 text-slate-300" strokeWidth={2} />
                        {f}
                      </span>
                    ))}
                    {features.length > 4 && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 bg-slate-50 border border-slate-100">
                        +{features.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Request Quote — subtle text link */}
                <button
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 text-slate-700 hover:text-slate-900"
                >
                  Request Quote
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </article>
          </FadeIn>
        )
      })}
    </div>
  )
}
