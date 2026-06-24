'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, Search, Filter, MapPin, Building2, Zap, Calendar,
  FolderKanban, ArrowRight, X, FileText, Database, TrendingUp,
  Factory, Car, Cpu, Droplets, Wind, Heart, GraduationCap, Ship,
  Landmark, Globe, Award, Briefcase, Home as HomeIcon, ShoppingBag,
  Package, Server, Plane, Train, Anchor, Waves, BookOpen, Hotel,
  Shield, Mountain, Box, Sprout, LayoutGrid, Sun,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@/components/Router'

/* ─── Types ─── */
interface ProjectRecord {
  sno: number
  customer: string
  voltage: string
  industry: string
  scope: string
  location: string
  state: string
  value: string
  year: string
}

interface Meta {
  total: number
  industries: string[]
  states: string[]
  years: string[]
}

/* ─── Industry → Icon & Color Map ─── */
const INDUSTRY_ICONS: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  'Automotive & Auto Components': { icon: Car, color: 'text-red-600', bg: 'bg-red-50' },
  'Manufacture & Indstrial Enginering': { icon: Factory, color: 'text-amber-600', bg: 'bg-amber-50' },
  'Renewable energy & Solar Infrastructure': { icon: Sun, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  'Oil, Gas, Petrochemical & Chemical Industries': { icon: Droplets, color: 'text-purple-600', bg: 'bg-purple-50' },
  'Airport & Aviation Infrastructure': { icon: Plane, color: 'text-sky-600', bg: 'bg-sky-50' },
  'IT Parks, Technology Campus, Data Centres & Mission Critical Facilities': { icon: Server, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  'Cement, Steel & Heavy Industries': { icon: Factory, color: 'text-slate-600', bg: 'bg-slate-50' },
  'Pharmaceuticals & Healthcare': { icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
  'Commercial Buildings & Real Estates': { icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
  'Textiles & Garments Industries': { icon: Package, color: 'text-violet-600', bg: 'bg-violet-50' },
  'Electronics & Electrical Manufacturing': { icon: Cpu, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'Educational Institution & Campuses': { icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'Food Processing & Beverage Industries': { icon: ShoppingBag, color: 'text-lime-600', bg: 'bg-lime-50' },
  'Residential & Township Developments': { icon: HomeIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
  'FMCG & Consumer Goods': { icon: ShoppingBag, color: 'text-pink-600', bg: 'bg-pink-50' },
  'Water Treatment & Environmental Infrastructure': { icon: Waves, color: 'text-teal-600', bg: 'bg-teal-50' },
  'Paper & Printing Industries': { icon: BookOpen, color: 'text-stone-600', bg: 'bg-stone-50' },
  'Infrastructure & Urban Development': { icon: Landmark, color: 'text-gray-600', bg: 'bg-gray-50' },
  'Warehousing & Logistics': { icon: Package, color: 'text-brown-600', bg: 'bg-amber-50' },
  'Government & Public Sector': { icon: Shield, color: 'text-[#1B3A5C]', bg: 'bg-[#1B3A5C]/5' },
  'Hospitality & Entertainment': { icon: Hotel, color: 'text-pink-600', bg: 'bg-pink-50' },
  'Process Industries': { icon: Factory, color: 'text-amber-700', bg: 'bg-amber-50' },
  'Ports & Marine Infrastructure': { icon: Anchor, color: 'text-blue-700', bg: 'bg-blue-50' },
  'Glass & Ceramics Industries': { icon: Box, color: 'text-cyan-700', bg: 'bg-cyan-50' },
  'Utilities & Power Sector': { icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  'Rubber, Plastics & Polymer Industries': { icon: Box, color: 'text-purple-700', bg: 'bg-purple-50' },
  default: { icon: Building2, color: 'text-[#1B3A5C]', bg: 'bg-[#1B3A5C]/5' },
}

function getIndustryMeta(industry: string) {
  return INDUSTRY_ICONS[industry] || INDUSTRY_ICONS.default
}

/* ─── FadeIn Helper ─── */
function FadeIn({ children, delay = 0, className = '' }: {
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

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function ProjectsPage() {
  const { navigate } = useRouter()
  const [records, setRecords] = useState<ProjectRecord[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [industryFilter, setIndustryFilter] = useState('All')
  const [stateFilter, setStateFilter] = useState('All')
  const [yearFilter, setYearFilter] = useState('All')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  // Pagination
  const [page, setPage] = useState(1)
  const pageSize = 25

  // Fetch meta (industries, states, years) on mount
  useEffect(() => {
    fetch('/api/project-records/meta')
      .then(r => r.json())
      .then(d => setMeta(d))
      .catch(e => console.error(e))
  }, [])

  // Fetch records whenever filters change
  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      try {
        const params = new URLSearchParams()
        if (industryFilter !== 'All') params.set('industry', industryFilter)
        if (stateFilter !== 'All') params.set('state', stateFilter)
        if (yearFilter !== 'All') params.set('year', yearFilter)
        if (search.trim()) params.set('search', search.trim())

        const r = await fetch(`/api/project-records?${params.toString()}`)
        if (!r.ok) throw new Error('Failed to fetch')
        const d = await r.json()
        if (cancelled) return
        setRecords(d.records || [])
        setPage(1)
        setError(null)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    setLoading(true)
    fetchData()
    return () => { cancelled = true }
  }, [industryFilter, stateFilter, yearFilter, search])

  // Debounce search input
  const [searchInput, setSearchInput] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350)
    return () => clearTimeout(t)
  }, [searchInput])

  const totalPages = Math.max(1, Math.ceil(records.length / pageSize))
  const pagedRecords = useMemo(() => {
    const start = (page - 1) * pageSize
    return records.slice(start, start + pageSize)
  }, [records, page])

  const clearAllFilters = () => {
    setSearchInput('')
    setIndustryFilter('All')
    setStateFilter('All')
    setYearFilter('All')
  }

  const hasActiveFilters = search || industryFilter !== 'All' || stateFilter !== 'All' || yearFilter !== 'All'

  /* ─── Stats ─── */
  const stats = [
    { label: 'Total Projects', value: meta?.total ?? 0, icon: FolderKanban, color: 'text-[#1B3A5C]', bg: 'bg-[#1B3A5C]/10' },
    { label: 'Industries Served', value: meta?.industries.length ?? 0, icon: LayoutGrid, color: 'text-[#E8751A]', bg: 'bg-[#E8751A]/10' },
    { label: 'States Covered', value: meta?.states.length ?? 0, icon: MapPin, color: 'text-[#1B3A5C]', bg: 'bg-[#1B3A5C]/10' },
    { label: 'Years of Projects', value: meta?.years.length ?? 0, icon: Calendar, color: 'text-[#E8751A]', bg: 'bg-[#E8751A]/10' },
  ]

  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B3A5C 0%, #152D4F 50%, #0D1D3A 100%)' }}>
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(232,117,26,0.08) 0%, transparent 40%)',
        }} />

        {/* Floating icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[FolderKanban, Building2, Factory, Zap, MapPin, Calendar].map((Icon, i) => {
            const positions = [
              { x: '8%', y: '25%' }, { x: '85%', y: '20%' }, { x: '20%', y: '70%' },
              { x: '70%', y: '65%' }, { x: '50%', y: '15%' }, { x: '90%', y: '55%' },
            ]
            const pos = positions[i]
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: pos.x, top: pos.y }}
                animate={{ y: [0, -18, 0], opacity: [0.07, 0.14, 0.07] }}
                transition={{ duration: 5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
              >
                <Icon className="text-white" style={{ width: 24 + i * 2, height: 24 + i * 2 }} />
              </motion.div>
            )
          })}
        </div>

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 pt-[100px] pb-16">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm mb-8"
          >
            <button onClick={() => navigate('home')} className="text-white/60 hover:text-white transition-colors">
              Home
            </button>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <button onClick={() => navigate('clients')} className="text-white/60 hover:text-white transition-colors">
              Clients
            </button>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <span className="text-[#E8751A] font-medium">Projects</span>
          </motion.div>

          {/* Badge + Heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge className="mb-5 bg-[#E8751A]/15 text-[#E8751A] border border-[#E8751A]/30 px-4 py-1.5 text-sm font-semibold rounded-full backdrop-blur-sm">
              <FolderKanban className="w-3.5 h-3.5 mr-1.5" />
              {meta?.total ?? '—'} Projects Executed
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-3xl"
          >
            Projects &{' '}
            <span className="relative inline-block">
              Execution Portfolio
              <motion.span
                className="absolute -bottom-1 left-0 h-1 rounded-full bg-[#E8751A]"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-lg text-white/70 max-w-2xl mb-8"
          >
            Explore our comprehensive portfolio of {meta?.total ?? '150+'} electrical infrastructure projects executed across diverse industries and states in India. Search, filter, and discover detailed project information.
          </motion.p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl"
          >
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg p-3 sm:p-4">
                <div className={`w-8 h-8 rounded-md ${stat.bg} flex items-center justify-center mb-2`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/60">{stat.label}</div>
              </div>
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
          FILTERS + CONTENT
          ══════════════════════════════════════════════ */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          {/* Search + Filters bar */}
          <FadeIn>
            <Card className="border border-gray-200 shadow-sm mb-6">
              <CardContent className="p-4 md:p-5">
                {/* Search row */}
                <div className="flex flex-col md:flex-row gap-3 md:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by customer, location, scope, voltage..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="pl-10 h-10 border-gray-200 focus:border-[#1B3A5C] focus:ring-[#1B3A5C]/20"
                    />
                    {searchInput && (
                      <button
                        onClick={() => setSearchInput('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* View toggle */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        viewMode === 'table' ? 'bg-white text-[#1B3A5C] shadow-sm' : 'text-gray-500'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5 inline mr-1" />
                      Table
                    </button>
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        viewMode === 'cards' ? 'bg-white text-[#1B3A5C] shadow-sm' : 'text-gray-500'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 inline mr-1" />
                      Cards
                    </button>
                  </div>
                </div>

                {/* Filters row */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mr-1">
                    <Filter className="w-3.5 h-3.5" />
                    Filters:
                  </div>

                  {/* Industry filter */}
                  <select
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="text-xs h-8 px-2.5 rounded-md border border-gray-200 bg-white text-gray-700 focus:border-[#1B3A5C] focus:outline-none cursor-pointer max-w-[240px]"
                  >
                    <option value="All">All Industries</option>
                    {meta?.industries.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>

                  {/* State filter */}
                  <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="text-xs h-8 px-2.5 rounded-md border border-gray-200 bg-white text-gray-700 focus:border-[#1B3A5C] focus:outline-none cursor-pointer"
                  >
                    <option value="All">All States</option>
                    {meta?.states.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  {/* Year filter */}
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="text-xs h-8 px-2.5 rounded-md border border-gray-200 bg-white text-gray-700 focus:border-[#1B3A5C] focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Years</option>
                    {meta?.years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>

                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs h-8 px-3 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Clear All
                    </button>
                  )}

                  <div className="ml-auto text-xs text-gray-500">
                    Showing <span className="font-semibold text-[#1B3A5C]">{records.length}</span> of {meta?.total ?? 0} projects
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Error state */}
          {error && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <X className="w-7 h-7 text-red-500" />
              </div>
              <p className="text-gray-700 text-lg font-medium mb-2">Failed to load projects</p>
              <p className="text-gray-500 text-sm mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} className="bg-[#1B3A5C] hover:bg-[#0D1D3A] text-white">
                Retry
              </Button>
            </div>
          )}

          {/* Loading state */}
          {loading && !error && (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-md" />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && records.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FolderKanban className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-700 text-lg font-medium mb-2">No projects found</p>
              <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search query</p>
              {hasActiveFilters && (
                <Button onClick={clearAllFilters} variant="outline" className="border-[#1B3A5C] text-[#1B3A5C]">
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Results - Table view */}
          {!loading && !error && records.length > 0 && viewMode === 'table' && (
            <FadeIn>
              <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#1B3A5C] text-white sticky top-0 z-10">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide w-12">#</th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">Customer</th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide w-20">Voltage</th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">Industry</th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide hidden lg:table-cell">Scope of Work</th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">Location</th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide hidden md:table-cell">State</th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide w-16">Year</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {pagedRecords.map((p, i) => {
                        const meta = getIndustryMeta(p.industry)
                        const Icon = meta.icon
                        return (
                          <tr key={p.sno} className="hover:bg-[#F0F4F8] transition-colors group">
                            <td className="px-4 py-3 text-gray-500 text-xs font-medium">
                              {(page - 1) * pageSize + i + 1}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-md ${meta.bg} flex items-center justify-center shrink-0`}>
                                  <Icon className={`w-4 h-4 ${meta.color}`} />
                                </div>
                                <span className="font-semibold text-[#1A1A2E] text-sm group-hover:text-[#1B3A5C] transition-colors">
                                  {p.customer}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {p.voltage ? (
                                <Badge className="bg-[#1B3A5C]/10 text-[#1B3A5C] border-0 text-xs font-semibold">
                                  <Zap className="w-3 h-3 mr-1" />
                                  {p.voltage} KV
                                </Badge>
                              ) : (
                                <span className="text-gray-300 text-xs">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs text-gray-600 line-clamp-1 max-w-[200px]" title={p.industry}>
                                {p.industry}
                              </span>
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <span className="text-xs text-gray-500 line-clamp-1 max-w-[280px]" title={p.scope}>
                                {p.scope || '—'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                {p.location}
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-500">
                              {p.state}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="text-xs font-medium border-gray-200 text-gray-600">
                                {p.year}
                              </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Results - Cards view */}
          {!loading && !error && records.length > 0 && viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pagedRecords.map((p, i) => {
                const meta = getIndustryMeta(p.industry)
                const Icon = meta.icon
                return (
                  <motion.div
                    key={p.sno}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
                  >
                    <Card className="h-full border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                      <div className={`h-1.5 ${meta.bg.replace('/5', '/20')}`} />
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 rounded-lg ${meta.bg} flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${meta.color}`} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            {p.voltage && (
                              <Badge className="bg-[#1B3A5C]/10 text-[#1B3A5C] border-0 text-xs font-semibold">
                                {p.voltage} KV
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs font-medium border-gray-200 text-gray-600">
                              {p.year}
                            </Badge>
                          </div>
                        </div>
                        <h3 className="font-bold text-[#1A1A2E] text-base mb-1 group-hover:text-[#1B3A5C] transition-colors">
                          {p.customer}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-1">{p.industry}</p>
                        {p.scope && (
                          <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                            {p.scope}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {p.location}, {p.state}
                          </div>
                          <span className="text-[10px] text-gray-400">#{p.sno}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && records.length > pageSize && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-gray-500">
                Page <span className="font-semibold text-[#1B3A5C]">{page}</span> of {totalPages} • Showing {pagedRecords.length} of {records.length} records
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="border-gray-200 text-gray-600 h-8 px-3 text-xs disabled:opacity-40"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }).map((_, idx) => {
                    let pageNum: number
                    if (totalPages <= 7) {
                      pageNum = idx + 1
                    } else if (page <= 4) {
                      pageNum = idx + 1
                    } else if (page >= totalPages - 3) {
                      pageNum = totalPages - 6 + idx
                    } else {
                      pageNum = page - 3 + idx
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
                          page === pageNum
                            ? 'bg-[#1B3A5C] text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="border-gray-200 text-gray-600 h-8 px-3 text-xs disabled:opacity-40"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA BANNER
          ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B3A5C 0%, #152D4F 50%, #0D1D3A 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5" />
        </div>
        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 py-14 md:py-16 text-center">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Have a Project in Mind?
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto text-sm md:text-base">
              Join our growing list of satisfied clients. Let our expert team deliver your next electrical infrastructure project on time and on budget.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={() => navigate('contact')}
                className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-lg px-8 h-12 font-semibold text-sm transition-colors shadow-lg shadow-[#E8751A]/25">
                Get a Quote <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 hover:border-white rounded-lg px-8 h-12 font-semibold text-sm transition-colors"
                onClick={() => navigate('clients')}>
                View Our Clients
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
