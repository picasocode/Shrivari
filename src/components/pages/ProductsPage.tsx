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
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter, type PageName } from '@/components/Router'
import { fetchProducts, fetchSettings, type Product } from '@/lib/api'
import {
  parseComparisonRows,
  parseSpecRows,
  SITE_SETTINGS_DEFAULTS,
} from '@/lib/site-settings-defaults'

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

/* ─── Category meta ─── */
type Variant = 'lt' | 'ht' | 'busduct'
const CATEGORY_META: Record<Variant, { title: string; voltage: string; subtitle: string; Icon: React.ElementType }> = {
  lt: { title: 'Low Tension Panels', voltage: 'Up to 415V', subtitle: 'Distribution and control panels for commercial and residential applications.', Icon: Zap },
  ht: { title: 'High Tension Panels', voltage: '11kV – 33kV', subtitle: 'Switchgear and protection panels for industrial and utility-grade installations.', Icon: Shield },
  busduct: { title: 'Busducts', voltage: 'Up to 6300A', subtitle: 'Enclosed busbar systems for high-current power distribution.', Icon: Boxes },
}

/* ═════════════════════════ MAIN PAGE ═════════════════════════ */

export default function ProductsPage() {
  const { navigate, router } = useRouter()
  const [ltProducts, setLtProducts] = useState<Product[]>([])
  const [htProducts, setHtProducts] = useState<Product[]>([])
  const [bdProducts, setBdProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<Record<string, string>>(SITE_SETTINGS_DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Single source of truth for the active tab: the router param.
  const activeTab: Variant =
    router.params?.tab && ['lt', 'ht', 'busduct'].includes(router.params.tab)
      ? (router.params.tab as Variant)
      : 'lt'

  const handleTabChange = (tab: string) => {
    navigate('products', { tab })
  }

  const doLoad = () => {
    Promise.all([
      fetchProducts('LT Panels'),
      fetchProducts('HT Panels'),
      fetchProducts('Busducts'),
      fetchSettings().catch(() => null),
    ]).then(([lt, ht, bd, s]) => {
      setLtProducts(lt)
      setHtProducts(ht)
      setBdProducts(bd)
      if (s) setSettings(s)
      setLoading(false)
    }).catch((err) => {
      setError(err?.message || 'Failed to load products. Please try again.')
      setLoading(false)
    })
  }

  // Used by the Retry button — shows skeletons again while refetching.
  const loadContent = () => {
    setLoading(true)
    setError(null)
    doLoad()
  }

  useEffect(() => {
    doLoad()
  }, [])

  const currentProducts = activeTab === 'lt' ? ltProducts : activeTab === 'ht' ? htProducts : bdProducts
  const meta = CATEGORY_META[activeTab]
  const comparisonRows = parseComparisonRows(settings.products_comparison)
  const specRows = parseSpecRows(settings.products_specs)

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
                {settings.products_hero_eyebrow}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] mb-5" style={{ color: INK }}>
              {settings.products_hero_title}
            </h1>

            <p className="text-slate-500 text-lg md:text-xl max-w-2xl leading-relaxed">
              {settings.products_hero_subtitle}
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
          {/* Error state — fetch failed entirely */}
          {error ? (
            <div className="flex flex-col items-center py-16 text-center">
              <AlertCircle className="w-12 h-12 text-slate-300 mb-4" strokeWidth={1.5} />
              <p className="text-slate-600 mb-6">{error}</p>
              <button
                onClick={loadContent}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border-2 transition-all duration-300"
                style={{ borderColor: CORAL, color: CORAL }}
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
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
                  {comparisonRows.map((row, i) => (
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
                  {specRows.map((row, i) => (
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
                <div className="relative h-56 overflow-hidden bg-slate-50 border-b border-slate-100">
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
                <p className="text-slate-500 text-[15px] leading-relaxed mb-5 line-clamp-2">
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
