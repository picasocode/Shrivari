'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  CheckCircle,
  Zap,
  Shield,
  ArrowRight,
  FileText,
  Gauge,
  Battery,
  CircuitBoard,
  Phone,
  Mail,
  Boxes,
} from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useRouter, type PageName } from '@/components/Router'
import { fetchProducts, type Product } from '@/lib/api'

/* ─────────────────────────── helpers ─────────────────────────── */

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

function parseFeatures(features: string): string[] {
  try {
    const parsed = JSON.parse(features)
    if (Array.isArray(parsed)) return parsed
    return []
  } catch {
    return features ? features.split(',').map(f => f.trim()).filter(Boolean) : []
  }
}

/* ─────────────────────────── data ─────────────────────────── */

const COMPARISON_DATA = [
  { attribute: 'Voltage Range', lt: 'Up to 415V', ht: '11kV – 33kV', bd: 'Up to 6300A' },
  { attribute: 'Insulation Class', lt: 'Class B (130°C)', ht: 'Class F (155°C)', bd: 'Class F (155°C)' },
  { attribute: 'Busbar Material', lt: 'Copper / Aluminium', ht: 'Copper (Silver Plated)', bd: 'Copper / Aluminium' },
  { attribute: 'Protection Relay', lt: 'Thermal / Magnetic', ht: 'Numerical / Microprocessor', bd: 'MCCB / Fuses' },
  { attribute: 'Enclosure Rating', lt: 'IP42 – IP54', ht: 'IP54 – IP65', bd: 'IP54 – IP65' },
  { attribute: 'Short Circuit Level', lt: 'Up to 50 kA', ht: 'Up to 40 kA (1 sec)', bd: 'Up to 100 kA (1 sec)' },
  { attribute: 'Typical Application', lt: 'Commercial / Residential', ht: 'Industrial / Utility', bd: 'High-current distribution' },
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

/* ─────────────────────────── main ─────────────────────────── */

/* Static fallback products — used when the API returns no data (e.g. when the
   database / Supabase isn't configured). Mirrors the seed dataset so the page
   always renders real content for the demo. */
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

const FALLBACK_LT: ReturnType<typeof mkProduct>[] = [
  { name: 'CRP - Control & Relay Panel', slug: 'crp-control-relay-panel', category: 'LT Panels', order: 1, description: 'Control and Relay Panels are designed for protection, control, and monitoring of electrical power systems. These panels house relays, control switches, and indicating instruments for effective power system management.', features: ['Numerical/digital relay integration', 'SCADA compatibility', 'Anti-pumping and trip circuit supervision', 'Customized mimic bus bar arrangement', 'Dust and vermin proof enclosures', 'Type tested for short circuit withstand'] },
  { name: 'PCC - Power Control Centre', slug: 'pcc-power-control-centre', category: 'LT Panels', order: 2, description: 'Power Control Centres are the central distribution boards that receive power from transformers or generators and distribute it to various loads. Our PCC panels feature robust busbar systems and advanced protection schemes.', features: ['Rated up to 6300A busbar capacity', 'Fully type-tested assemblies', 'Drawout and fixed type ACBs', 'Integrated power monitoring systems', 'Capacitor bank integration for PF correction', 'Multi-tier busbar arrangements'] },
  { name: 'MCC - Motor Control Centre', slug: 'mcc-motor-control-centre', category: 'LT Panels', order: 3, description: 'Motor Control Centres provide centralized control and protection for multiple electric motors. Our MCC panels feature intelligent motor protection relays, soft starters, and VFD integration.', features: ['Intelligent motor protection relays', 'VFD and soft starter integration', 'DOL and star-delta starters', 'Auto/manual control modes', 'Interlocking and safety features', 'Plug-in type compartments for easy maintenance'] },
  { name: 'APFC - Automatic Power Factor Control', slug: 'apfc-automatic-power-factor-control', category: 'LT Panels', order: 4, description: 'Automatic Power Factor Control panels dynamically switch capacitor banks to maintain the power factor close to unity, reducing electricity bills and avoiding penalties from utilities.', features: ['Microcontroller-based APFC relay', 'Real-time PF monitoring and display', 'Step-wise automatic capacitor switching', 'Harmonic filtering with detuned reactors', 'THD monitoring and protection', 'Target PF setting (0.95 to 0.99)'] },
  { name: 'DG Synchronization Panel', slug: 'dg-synchronization-panel', category: 'LT Panels', order: 5, description: 'DG Synchronization Panels enable multiple diesel generators to operate in parallel, sharing the load efficiently. Our synchronization panels feature advanced auto-synch relays and load sharing controllers.', features: ['Auto/manual synchronization modes', 'Active and reactive load sharing', 'Reverse power relay protection', 'Black start capability', 'Auto start-stop with mains failure detection', 'Multi-generator paralleling up to 16 sets'] },
  { name: 'PLC - Program Logic Control', slug: 'plc-program-logic-control', category: 'LT Panels', order: 6, description: 'Programmable Logic Control panels integrate industrial automation with electrical power distribution. Our PLC panels feature industry-standard controllers from Siemens, Allen Bradley, and Schneider.', features: ['SCADA and HMI integration', 'Modular I/O configuration', 'Communication protocols (Modbus, Profibus, Ethernet)', 'Data logging and trending', 'Alarm management systems', 'Remote monitoring and control capability'] },
].map(mkProduct)

const FALLBACK_HT: ReturnType<typeof mkProduct>[] = [
  { name: '11 KV Panel', slug: '11-kv-panel', category: 'HT Panels', order: 1, description: '11 KV HT Panels are designed for receiving and distributing high tension power at 11kV voltage level. These panels feature vacuum circuit breakers, current and voltage transformers, and comprehensive protection relays.', features: ['VCB rated up to 630A/1250A', 'Current transformer and potential transformer integration', 'Numerical relay protection (overcurrent, earth fault)', 'Busbar rating up to 1250A', 'Interlocked and safety-grounded design', 'Indoor and outdoor configurations'] },
  { name: '22 KV Panel', slug: '22-kv-panel', category: 'HT Panels', order: 2, description: '22 KV HT Panels are engineered for medium voltage power distribution at the 22kV level. These panels are commonly used in large industrial plants and utility substations, featuring advanced vacuum circuit breaker technology.', features: ['VCB with high breaking capacity', 'Comprehensive protection scheme', 'Auto-reclosing functionality', 'SCADA integration ready', 'Seismic-qualified construction', 'Type tested as per IS/IEC standards'] },
  { name: '33 KV Panel', slug: '33-kv-panel', category: 'HT Panels', order: 3, description: '33 KV HT Panels are designed for high voltage power distribution at the 33kV level. These panels are used in major industrial installations, utility substations, and power transmission networks.', features: ['High breaking capacity VCB', 'Comprehensive numerical protection', 'CT/PT integration for metering', 'Busbar differential protection', 'Auto-reclosing and sectionalizing', 'Type tested for 33kV class'] },
  { name: 'VCB Panel', slug: 'vcb-panel', category: 'HT Panels', order: 4, description: 'Vacuum Circuit Breaker panels provide reliable switching and protection for medium voltage systems. Our VCB panels use vacuum interrupter technology for arc extinction, offering maintenance-free operation and long service life.', features: ['Vacuum interrupter technology', 'Maintenance-free operation', 'Fast fault clearance time', 'High mechanical endurance', 'Motor/spring operating mechanism', 'Integrated protection and control'] },
].map(mkProduct)

const FALLBACK_BD: ReturnType<typeof mkProduct>[] = [
  { name: 'Segregated Phase Busduct', slug: 'segregated-phase-busduct', category: 'Busducts', order: 1, description: 'Segregated phase busducts feature each phase conductor in its own grounded metallic enclosure, reducing electromagnetic forces and improving short-circuit withstand. Ideal for high-current generator connections and large industrial power distribution.', features: ['Each phase in separate metallic enclosure', 'Reduced electromagnetic forces between phases', 'Ratings up to 6300A', 'High short-circuit withstand capability', 'Forced-air or natural cooling options', 'Suitable for generator and transformer connections'] },
  { name: 'Non-Segregated Phase Busduct', slug: 'non-segregated-phase-busduct', category: 'Busducts', order: 2, description: 'Non-segregated phase busducts house all phase conductors in a common metallic enclosure, offering a compact and economical solution for medium-current distribution between transformers, switchgear, and loads.', features: ['All phases in a common enclosure', 'Compact footprint for space-constrained installations', 'Ratings up to 4000A', 'Copper or aluminum busbar options', 'Indoor and outdoor configurations', 'Lower cost alternative for medium-current applications'] },
  { name: 'Isolated Phase Busduct (IPB)', slug: 'isolated-phase-busduct', category: 'Busducts', order: 3, description: 'Isolated Phase Busducts enclose each phase conductor in its own individual housing, typically used for very high-current generator outputs in power plants. Provides maximum safety, minimal electromagnetic interference, and reliable power transmission.', features: ['Individual phase enclosures for maximum safety', 'Ratings from 4000A to 25000A', 'Minimal electromagnetic field emissions', 'Forced-air cooling for high-current ratings', 'Generator and transformer terminal connections', 'Power plant grade construction'] },
  { name: 'Plug-in Tap-off Boxes', slug: 'plug-in-tap-off-boxes', category: 'Busducts', order: 4, description: 'Plug-in tap-off boxes provide flexible power take-off points along a busduct run, enabling easy connection of loads or distribution panels without disrupting the main busbar. Available in various ratings with integrated protection.', features: ['Hot-pluggable tap-off points', 'Integrated MCCB or fuse protection', 'Ratings from 100A to 630A', 'Lockable safety interlocks', 'Quick disconnect for maintenance', 'Compatible with segregated and non-segregated busducts'] },
].map(mkProduct)

export default function ProductsPage() {
  const { navigate, router } = useRouter()
  const [ltProducts, setLtProducts] = useState<Product[]>([])
  const [htProducts, setHtProducts] = useState<Product[]>([])
  const [bdProducts, setBdProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Single source of truth for the active tab: the router param.
  // The navbar dropdown AND in-page tab clicks both call navigate('products', { tab }).
  const activeTab: string =
    router.params?.tab && ['lt', 'ht', 'busduct'].includes(router.params.tab)
      ? router.params.tab
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
      // Fall back to static seed data when the API returns no products
      // (e.g. when Supabase/database isn't configured in this environment).
      setLtProducts(lt.length > 0 ? lt : FALLBACK_LT)
      setHtProducts(ht.length > 0 ? ht : FALLBACK_HT)
      setBdProducts(bd.length > 0 ? bd : FALLBACK_BD)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const loadProducts = useCallback(() => {
    setLoading(true)
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

  const heroImage = activeTab === 'lt' ? '/images/lt-panel.jpg' : activeTab === 'ht' ? '/images/ht-panel.jpg' : '/images/services/ht-lt-panel-manufacturing.png'
  const currentProducts = activeTab === 'lt' ? ltProducts : activeTab === 'ht' ? htProducts : bdProducts
  const totalProducts = ltProducts.length + htProducts.length + bdProducts.length
  const accentColor = activeTab === 'lt' ? '#1B3A5C' : activeTab === 'ht' ? '#E8751A' : '#0D1D3A'
  const accentLabel = activeTab === 'lt' ? 'LT Panels (415V)' : activeTab === 'ht' ? 'HT Panels (11KV–33KV)' : 'Busducts (Up to 6300A)'

  return (
    <>
      {/* ═══════════ HERO – Split Layout ═══════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '440px' }}>
        {/* Background gradient for entire hero */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D2340] via-[#1B3A5C] to-[#152D4F]" />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 flex flex-col md:flex-row items-stretch" style={{ minHeight: '440px' }}>
          {/* Left — Text + Tabs */}
          <div className="flex-1 flex flex-col justify-center py-16 md:py-20 md:pr-12">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 text-sm mb-8"
            >
              <button onClick={() => navigate('home')} className="text-white/50 hover:text-white transition-colors">
                Home
              </button>
              <ChevronRight className="w-4 h-4 text-white/25" />
              <span className="text-[#E8751A] font-medium">Products</span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 mb-6">
                <Gauge className="w-4 h-4 text-[#E8751A]" />
                <span className="text-white/80 text-xs font-medium tracking-wide uppercase">
                  Technical Catalog
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.1] mb-4">
                Precision-Built<br />
                <span className="bg-gradient-to-r from-[#E8751A] to-[#F5A623] bg-clip-text text-transparent">
                  Panels
                </span>
              </h1>
              <p className="text-white/60 text-base md:text-lg max-w-lg leading-relaxed">
                Engineered for reliability. Our LT and HT panels meet the most demanding industrial standards with uncompromising quality.
              </p>
            </motion.div>

            {/* Large Stylish Tab Switcher */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-10"
            >
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-xl p-1.5 h-auto gap-1 flex-wrap">
                  <TabsTrigger
                    value="lt"
                    className="rounded-lg px-4 lg:px-6 py-3 text-sm font-semibold data-[state=active]:bg-[#1B3A5C] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#1B3A5C]/40 text-white/60 hover:text-white/80 transition-all"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    LT Panels (415V)
                  </TabsTrigger>
                  <TabsTrigger
                    value="ht"
                    className="rounded-lg px-4 lg:px-6 py-3 text-sm font-semibold data-[state=active]:bg-[#E8751A] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#E8751A]/40 text-white/60 hover:text-white/80 transition-all"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    HT Panels (11KV–33KV)
                  </TabsTrigger>
                  <TabsTrigger
                    value="busduct"
                    className="rounded-lg px-4 lg:px-6 py-3 text-sm font-semibold data-[state=active]:bg-[#0D1D3A] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#0D1D3A]/40 text-white/60 hover:text-white/80 transition-all"
                  >
                    <Boxes className="w-4 h-4 mr-2" />
                    Busducts (Up to 6300A)
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>
          </div>

          {/* Right — Hero Image */}
          <div className="flex-1 relative hidden md:flex items-center justify-center py-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.92, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.92, x: -30 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative w-full max-w-md"
              >
                {/* Glow */}
                <div
                  className="absolute -inset-8 rounded-3xl blur-2xl opacity-20"
                  style={{ background: accentColor }}
                />
                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/30">
                  <img
                    src={heroImage}
                    alt={accentLabel}
                    className="w-full h-[320px] object-cover"
                  />
                  {/* Overlay tag */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                    <Badge
                      className="text-xs font-semibold tracking-wide border-0"
                      style={{
                        backgroundColor: accentColor,
                        color: '#fff',
                      }}
                    >
                      {accentLabel}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════════ PRODUCTS GRID ═══════════ */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          {/* Section header + product count */}
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <div className="section-bar mb-3" />
                <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E]">
                  {activeTab === 'lt' ? 'Low Tension Panels' : activeTab === 'ht' ? 'High Tension Panels' : 'Busducts'}
                </h2>
                <p className="text-[#6B7280] mt-2 text-sm">
                  {activeTab === 'lt'
                    ? 'Distribution and control panels rated up to 415V for commercial and residential applications.'
                    : activeTab === 'ht'
                    ? 'Switchgear and protection panels rated 11kV–33kV for industrial and utility-grade installations.'
                    : 'Enclosed busbar systems for high-current power distribution between transformers, panels, and loads.'}
                </p>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5E7EB] text-sm text-[#6B7280] shadow-sm">
                  <FileText className="w-4 h-4" />
                  Showing <strong className="text-[#1A1A2E]">{currentProducts.length}</strong> of{' '}
                  <strong className="text-[#1A1A2E]">{totalProducts}</strong> products
                </span>
              </div>
            </div>
          </FadeIn>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-3 w-24 rounded" />
                    <Skeleton className="h-56 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <TabsContent value="lt">
                  <ProductGrid products={ltProducts} variant="lt" onNavigate={navigate} />
                </TabsContent>
                <TabsContent value="ht">
                  <ProductGrid products={htProducts} variant="ht" onNavigate={navigate} />
                </TabsContent>
                <TabsContent value="busduct">
                  <ProductGrid products={bdProducts} variant="busduct" onNavigate={navigate} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </section>

      {/* ═══════════ COMPARISON SECTION ═══════════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="section-bar mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] mb-3">
                LT, HT & Busducts — At a Glance
              </h2>
              <p className="text-[#6B7280] max-w-xl mx-auto text-sm">
                Understand the key engineering differences between our Low Tension panels, High Tension switchgear, and Busduct systems.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* LT Card */}
              <div className="relative rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
                <div className="h-2 bg-[#1B3A5C]" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-[#1B3A5C]/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-[#1B3A5C]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A2E] text-lg">LT Panels</h3>
                      <p className="text-xs text-[#6B7280]">Up to 415V</p>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {COMPARISON_DATA.map((row, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle className="w-4 h-4 text-[#1B3A5C] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-[#1A1A2E]">{row.attribute}:</span>{' '}
                          <span className="text-[#6B7280]">{row.lt}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* HT Card */}
              <div className="relative rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
                <div className="h-2 bg-[#E8751A]" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-[#E8751A]/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#E8751A]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A2E] text-lg">HT Panels</h3>
                      <p className="text-xs text-[#6B7280]">11kV – 33kV</p>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {COMPARISON_DATA.map((row, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle className="w-4 h-4 text-[#E8751A] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-[#1A1A2E]">{row.attribute}:</span>{' '}
                          <span className="text-[#6B7280]">{row.ht}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Busduct Card */}
              <div className="relative rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
                <div className="h-2 bg-[#0D1D3A]" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-[#0D1D3A]/10 flex items-center justify-center">
                      <Boxes className="w-5 h-5 text-[#0D1D3A]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A2E] text-lg">Busducts</h3>
                      <p className="text-xs text-[#6B7280]">Up to 6300A</p>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {COMPARISON_DATA.map((row, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle className="w-4 h-4 text-[#0D1D3A] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-[#1A1A2E]">{row.attribute}:</span>{' '}
                          <span className="text-[#6B7280]">{row.bd}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════ TECHNICAL SPECS TABLE ═══════════ */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="section-bar mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] mb-3">
                Technical Specifications
              </h2>
              <p className="text-[#6B7280] max-w-xl mx-auto text-sm">
                Standard specifications across our product range. Custom configurations available on request.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1B3A5C] hover:bg-[#1B3A5C]">
                    <TableHead className="text-white font-semibold text-sm px-6 py-4">Parameter</TableHead>
                    <TableHead className="text-white font-semibold text-sm px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        LT Panels
                      </div>
                    </TableHead>
                    <TableHead className="text-white font-semibold text-sm px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        HT Panels
                      </div>
                    </TableHead>
                    <TableHead className="text-white font-semibold text-sm px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Boxes className="w-4 h-4" />
                        Busducts
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SPEC_TABLE_DATA.map((row, i) => (
                    <TableRow
                      key={i}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}
                    >
                      <TableCell className="px-6 py-3.5 font-medium text-[#1A1A2E] text-sm">
                        {row.param}
                      </TableCell>
                      <TableCell className="px-6 py-3.5 text-[#6B7280] text-sm">
                        {row.lt}
                      </TableCell>
                      <TableCell className="px-6 py-3.5 text-[#6B7280] text-sm">
                        {row.ht}
                      </TableCell>
                      <TableCell className="px-6 py-3.5 text-[#6B7280] text-sm">
                        {row.bd}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <p className="text-center text-xs text-[#9CA3AF] mt-4">
              * All specifications are subject to change. Contact our engineering team for project-specific requirements.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D2340] via-[#1B3A5C] to-[#152D4F]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 mb-6">
              <Battery className="w-4 h-4 text-[#E8751A]" />
              <span className="text-white/80 text-xs font-medium tracking-wide uppercase">
                Get Started
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto leading-tight">
              Need a Custom Panel Configuration?
            </h2>
            <p className="text-white/60 max-w-lg mx-auto mb-10 text-sm leading-relaxed">
              Our engineering team designs bespoke panel systems tailored to your project specifications, site conditions, and compliance requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-[#E8751A] hover:bg-[#D06818] text-white font-semibold px-8 rounded-xl shadow-lg shadow-[#E8751A]/25"
                onClick={() => navigate('contact')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Request a Quote
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white font-semibold px-8 rounded-xl"
                onClick={() => navigate('contact')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Talk to Engineering
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}

/* ──────────────────── Product Grid ──────────────────── */

function ProductGrid({
  products,
  variant,
  onNavigate,
}: {
  products: Product[]
  variant: 'lt' | 'ht' | 'busduct'
  onNavigate: (page: PageName, params?: Record<string, string>) => void
}) {
  const barColor = variant === 'lt' ? '#1B3A5C' : variant === 'ht' ? '#E8751A' : '#0D1D3A'
  const barColorLight = variant === 'lt' ? 'bg-[#1B3A5C]/8' : variant === 'ht' ? 'bg-[#E8751A]/8' : 'bg-[#0D1D3A]/8'
  const iconColor = variant === 'lt' ? 'text-[#1B3A5C]' : variant === 'ht' ? 'text-[#E8751A]' : 'text-[#0D1D3A]'
  const btnBg = variant === 'lt' ? 'bg-[#1B3A5C] hover:bg-[#142D48]' : variant === 'ht' ? 'bg-[#E8751A] hover:bg-[#D06818]' : 'bg-[#0D1D3A] hover:bg-[#081226]'
  const badgeBg = variant === 'lt' ? 'bg-[#1B3A5C]/10 text-[#1B3A5C]' : variant === 'ht' ? 'bg-[#E8751A]/10 text-[#E8751A]' : 'bg-[#0D1D3A]/10 text-[#0D1D3A]'
  const Icon = variant === 'lt' ? Zap : variant === 'ht' ? Shield : Boxes

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <CircuitBoard className="w-12 h-12 text-[#CBD5E1] mx-auto mb-4" />
        <p className="text-[#6B7280] text-sm">No products found in this category.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map((p, i) => {
        const features = parseFeatures(p.features)
        return (
          <FadeIn key={p.id} delay={i * 0.07}>
            <Card className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm card-hover h-full overflow-hidden py-0 gap-0">
              {/* Colored top bar */}
              <div className="h-1.5" style={{ backgroundColor: barColor }} />

              {/* Product image strip */}
              {p.imageUrl && (
                <div className="relative h-40 overflow-hidden bg-[#F0F4F8]">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={`text-[10px] font-semibold tracking-wide border-0 ${badgeBg}`}>
                      {p.category}
                    </Badge>
                  </div>
                </div>
              )}

              <CardContent className="p-6 pt-5">
                {/* Header row */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg ${barColorLight} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-[#1A1A2E] leading-snug truncate">
                      {p.name}
                    </h3>
                    {!p.imageUrl && (
                      <Badge className={`text-[10px] font-semibold tracking-wide border-0 mt-1 ${badgeBg}`}>
                        {p.category}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[#6B7280] text-sm leading-relaxed mb-4 line-clamp-2">
                  {p.description}
                </p>

                {/* Features checklist */}
                {features.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em] mb-2.5">
                      Key Features
                    </p>
                    <ul className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                      {features.slice(0, 6).map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-sm text-[#4B5563]">
                          <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
                          <span className="leading-snug">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>

              {/* Footer with CTA */}
              <CardFooter className="px-6 pb-5 pt-0">
                <Button
                  className={`w-full ${btnBg} text-white font-semibold rounded-xl shadow-sm`}
                  size="sm"
                  onClick={() => onNavigate('contact')}
                >
                  Request Quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </FadeIn>
        )
      })}
    </div>
  )
}
