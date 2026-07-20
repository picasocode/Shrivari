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
import { useRouter } from '@/components/Router'
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
  { attribute: 'Voltage Range', lt: 'Up to 415V', ht: '11kV – 33kV' },
  { attribute: 'Insulation Class', lt: 'Class B (130°C)', ht: 'Class F (155°C)' },
  { attribute: 'Busbar Material', lt: 'Copper / Aluminium', ht: 'Copper (Silver Plated)' },
  { attribute: 'Protection Relay', lt: 'Thermal / Magnetic', ht: 'Numerical / Microprocessor' },
  { attribute: 'Enclosure Rating', lt: 'IP42 – IP54', ht: 'IP54 – IP65' },
  { attribute: 'Short Circuit Level', lt: 'Up to 50 kA', ht: 'Up to 40 kA (1 sec)' },
  { attribute: 'Typical Application', lt: 'Commercial / Residential', ht: 'Industrial / Utility' },
]

const SPEC_TABLE_DATA = [
  { param: 'Rated Voltage', lt: '415V', ht: '11kV / 33kV' },
  { param: 'Rated Current', lt: '630A – 6300A', ht: '630A – 4000A' },
  { param: 'Frequency', lt: '50 Hz', ht: '50 Hz' },
  { param: 'Busbar System', lt: 'Single / Double', ht: 'Single Busbar' },
  { param: 'Cable Entry', lt: 'Bottom / Top', ht: 'Bottom' },
  { param: 'Paint Finish', lt: 'Powder Coated (RAL 7035)', ht: 'Powder Coated (RAL 7035)' },
  { param: 'Standards', lt: 'IS 8623 / IEC 61439', ht: 'IS 3427 / IEC 62271' },
  { param: 'Degree of Protection', lt: 'IP42 / IP54', ht: 'IP54 / IP65' },
  { param: 'Operating Temp.', lt: '-5°C to +50°C', ht: '-5°C to +50°C' },
  { param: 'Humidity', lt: '≤ 95% RH', ht: '≤ 95% RH' },
]

/* ─────────────────────────── main ─────────────────────────── */

export default function ProductsPage() {
  const { navigate } = useRouter()
  const [ltProducts, setLtProducts] = useState<Product[]>([])
  const [htProducts, setHtProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('lt')

  useEffect(() => {
    Promise.all([
      fetchProducts('LT Panels').catch(() => []),
      fetchProducts('HT Panels').catch(() => []),
    ]).then(([lt, ht]) => {
      setLtProducts(lt)
      setHtProducts(ht)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const loadProducts = useCallback(() => {
    setLoading(true)
    Promise.all([
      fetchProducts('LT Panels').catch(() => []),
      fetchProducts('HT Panels').catch(() => []),
    ]).then(([lt, ht]) => {
      setLtProducts(lt)
      setHtProducts(ht)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const heroImage = activeTab === 'lt' ? '/images/lt-panel.jpg' : '/images/ht-panel.jpg'
  const currentProducts = activeTab === 'lt' ? ltProducts : htProducts
  const totalProducts = ltProducts.length + htProducts.length
  const accentColor = activeTab === 'lt' ? '#efefef' : '#E8751A'
  const accentLabel = activeTab === 'lt' ? 'LT Panels (415V)' : 'HT Panels (11KV–33KV)'

  return (
    <>
      {/* ═══════════ HERO – Split Layout ═══════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '440px' }}>
        {/* Background gradient for entire hero */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D2340] via-[#efefef] to-[#d4d4d4]" />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              '#37474f 1px, transparent 1px), #37474f 1px, transparent 1px)',
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
                <span className="text-white/80 text-sm font-medium tracking-wide uppercase">
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
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-xl p-1.5 h-auto gap-1">
                  <TabsTrigger
                    value="lt"
                    className="rounded-lg px-6 py-3 text-sm font-semibold data-[state=active]:bg-[#0D1D3A] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#efefef]/40 text-white/60 hover:text-white/80 transition-all"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    LT Panels (415V)
                  </TabsTrigger>
                  <TabsTrigger
                    value="ht"
                    className="rounded-lg px-6 py-3 text-sm font-semibold data-[state=active]:bg-[#E8751A] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#E8751A]/40 text-white/60 hover:text-white/80 transition-all"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    HT Panels (11KV–33KV)
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
                      className="text-sm font-semibold tracking-wide border-0"
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
                  {activeTab === 'lt' ? 'Low Tension Panels' : 'High Tension Panels'}
                </h2>
                <p className="text-[#666666] mt-2 text-sm">
                  {activeTab === 'lt'
                    ? 'Distribution and control panels rated up to 415V for commercial and residential applications.'
                    : 'Switchgear and protection panels rated 11kV–33kV for industrial and utility-grade installations.'}
                </p>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#dddddd] text-sm text-[#666666] shadow-sm">
                  <FileText className="w-4 h-4" />
                  Showing <strong className="text-[#1A1A2E]">{currentProducts.length}</strong> of{' '}
                  <strong className="text-[#1A1A2E]">{totalProducts}</strong> products
                </span>
              </div>
            </div>
          </FadeIn>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                LT vs HT — At a Glance
              </h2>
              <p className="text-[#666666] max-w-xl mx-auto text-sm">
                Understand the key engineering differences between our Low Tension and High Tension panel systems.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LT Card */}
              <div className="relative rounded-2xl overflow-hidden border border-[#dddddd] bg-white shadow-sm">
                <div className="h-2 bg-[#0D1D3A]" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-[#0D1D3A]/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-[#444444]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A2E] text-lg">LT Panels</h3>
                      <p className="text-sm text-[#666666]">Up to 415V</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {COMPARISON_DATA.map((row, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-[#444444] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-[#1A1A2E]">{row.attribute}:</span>{' '}
                          <span className="text-[#666666]">{row.lt}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* HT Card */}
              <div className="relative rounded-2xl overflow-hidden border border-[#dddddd] bg-white shadow-sm">
                <div className="h-2 bg-[#E8751A]" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-[#E8751A]/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#E8751A]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A2E] text-lg">HT Panels</h3>
                      <p className="text-sm text-[#666666]">11kV – 33kV</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {COMPARISON_DATA.map((row, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-[#E8751A] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-[#1A1A2E]">{row.attribute}:</span>{' '}
                          <span className="text-[#666666]">{row.ht}</span>
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
              <p className="text-[#666666] max-w-xl mx-auto text-sm">
                Standard specifications across our product range. Custom configurations available on request.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="rounded-2xl overflow-hidden border border-[#dddddd] bg-white shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#0D1D3A] hover:bg-[#0D1D3A]">
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
                      <TableCell className="px-6 py-3.5 text-[#666666] text-sm">
                        {row.lt}
                      </TableCell>
                      <TableCell className="px-6 py-3.5 text-[#666666] text-sm">
                        {row.ht}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <p className="text-center text-sm text-[#9CA3AF] mt-4">
              * All specifications are subject to change. Contact our engineering team for project-specific requirements.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D2340] via-[#efefef] to-[#d4d4d4]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              '#37474f 1px, transparent 1px), #37474f 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 mb-6">
              <Battery className="w-4 h-4 text-[#E8751A]" />
              <span className="text-white/80 text-sm font-medium tracking-wide uppercase">
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
  variant: 'lt' | 'ht'
  onNavigate: (page: string, params?: Record<string, string>) => void
}) {
  const barColor = variant === 'lt' ? '#efefef' : '#E8751A'
  const barColorLight = variant === 'lt' ? 'bg-[#0D1D3A]/8' : 'bg-[#E8751A]/8'
  const iconColor = variant === 'lt' ? 'text-[#444444]' : 'text-[#E8751A]'
  const btnBg = variant === 'lt' ? 'bg-[#0D1D3A] hover:bg-[#142D48]' : 'bg-[#E8751A] hover:bg-[#D06818]'
  const badgeBg = variant === 'lt' ? 'bg-[#0D1D3A]/10 text-[#444444]' : 'bg-[#E8751A]/10 text-[#E8751A]'
  const Icon = variant === 'lt' ? Zap : Shield

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <CircuitBoard className="w-12 h-12 text-[#CBD5E1] mx-auto mb-4" />
        <p className="text-[#666666] text-sm">No products found in this category.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map((p, i) => {
        const features = parseFeatures(p.features)
        return (
          <FadeIn key={p.id} delay={i * 0.07}>
            <Card className="bg-white rounded-2xl border border-[#dddddd] shadow-sm card-hover h-full overflow-hidden py-0 gap-0">
              {/* Colored top bar */}
              <div className="h-1.5" style={{ backgroundColor: barColor }} />

              {/* Product image strip */}
              {p.imageUrl && (
                <div className="relative h-40 overflow-hidden bg-[#efefef]">
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
                <p className="text-[#666666] text-sm leading-relaxed mb-4 line-clamp-2">
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
                        <li key={fi} className="flex items-start gap-2 text-sm text-[#666666]">
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
