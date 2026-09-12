'use client'

import { useState, useEffect, useCallback, useRef, createContext, useContext, useMemo } from 'react'
import {
  X, Package, Wrench, Users, MessageSquareQuote, FileText,
  Mail, Settings, Plus, Pencil, Trash2, Check, RefreshCw, UserPlus,
  Loader2, AlertCircle, LogOut, Shield, CheckCircle2, XCircle, Youtube, Upload,
  ListChecks, Search, Info, Image as ImageIcon, LayoutDashboard,
  Briefcase, Zap, Cpu, Gauge, Activity, MonitorPlay, CircuitBoard,
  ShieldCheck, Factory, Award, Boxes, FileCheck, Hammer, FlaskConical,
  Building2, Globe, Target, Sparkles, GraduationCap, Lightbulb,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import {
  fetchProducts, fetchServices, fetchClients, fetchTestimonials,
  fetchBlogs, fetchAPI,
  fetchCareers, fetchManufacturing,
  createItem, updateItem, deleteItem,
  type Product, type Service, type Client, type Testimonial,
  type Blog,
  type Career, type ManufacturingItem,
} from '@/lib/api'
import { useAuth } from '@/lib/auth'

// Rich text (WYSIWYG markdown) editor for blog posts — client-side only.
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => <Skeleton className="h-[340px] rounded-md" />,
})

/* ─── Toast notification system ─── */
interface Toast { id: number; type: 'success' | 'error'; message: string }
const ToastContext = createContext<{ notify: (type: 'success' | 'error', message: string) => void }>({ notify: () => {} })

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const notify = useCallback((type: 'success' | 'error', message: string) => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, type, message }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])
  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md shadow-lg text-sm font-medium ${
              t.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {t.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
const useToast = () => useContext(ToastContext)

/* ─── Image upload (bytes stored in the database — survive every deploy) ─── */
const UPLOAD_MAX_MB = 5
const UPLOAD_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']

function validateImageFile(file: File): string | null {
  if (!UPLOAD_ALLOWED_TYPES.includes(file.type)) return 'Please choose a JPG, PNG, WebP, GIF, AVIF or SVG image'
  if (file.size > UPLOAD_MAX_MB * 1024 * 1024) return `Image must be ${UPLOAD_MAX_MB}MB or smaller`
  return null
}

async function uploadImageFile(file: File): Promise<string> {
  const body = new FormData()
  body.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || 'Upload failed')
  return data.url as string
}

function ImageUpload({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const { notify } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File) => {
    const problem = validateImageFile(file)
    if (problem) { notify('error', problem); return }
    setUploading(true)
    try {
      onChange(await uploadImageFile(file))
      notify('success', 'Image uploaded — click Save to apply')
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="rounded-md border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-3">
        {value ? (
          <img src={value} alt={`${label} preview`} className="mx-auto max-h-32 w-auto rounded-md border border-[#E2E8F0] bg-white object-contain p-1" />
        ) : (
          <div className="flex h-20 flex-col items-center justify-center gap-1 text-[#94A3B8]">
            <ImageIcon className="h-6 w-6" />
            <span className="text-xs">No image yet</span>
          </div>
        )}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) void handleFile(f); e.target.value = '' }}
          />
          <Button type="button" variant="outline" size="sm" className="h-8 rounded-md text-xs" disabled={uploading} onClick={() => inputRef.current?.click()}>
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" className="h-8 rounded-md text-xs text-red-600 hover:text-red-700 hover:bg-red-50" disabled={uploading} onClick={() => onChange('')}>
              <X className="h-3.5 w-3.5" /> Remove
            </Button>
          )}
        </div>
      </div>
      <Input value={value} onChange={e => onChange(e.target.value)} className="rounded-md h-9 text-sm" placeholder="…or paste an image URL" disabled={uploading} />
      <p className="text-[11px] text-[#6B7280]">Upload a file (stored safely in the database, survives redeploys) or paste a URL. Max {UPLOAD_MAX_MB}MB.</p>
    </div>
  )
}

/* ─── types ─── */
type Section = 'dashboard' | 'products' | 'manufacturing' | 'services' | 'clients' | 'testimonials' | 'careers' | 'applications' | 'blogs' | 'records' | 'messages'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

const navItems: { key: Section; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'manufacturing', label: 'Manufacturing', icon: Factory },
  { key: 'services', label: 'Services', icon: Wrench },
  { key: 'clients', label: 'Clients', icon: Users },
  { key: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { key: 'careers', label: 'Careers', icon: Briefcase },
  { key: 'applications', label: 'Applications', icon: UserPlus },
  { key: 'blogs', label: 'Blogs', icon: FileText },
  { key: 'records', label: 'Project Records', icon: ListChecks },
  { key: 'messages', label: 'Messages', icon: Mail },
]

/* ─── generic CRUD state ─── */
function useCrud<T>(fetchFn: () => Promise<T[]>) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Store fetchFn in a ref so it's always the latest version but doesn't
  // become a useEffect/useCallback dependency. Callers pass an inline arrow
  // function (e.g. `() => fetchProducts()`), which is a NEW reference on every
  // render — if it were a dep, the effect below would re-run every render and
  // cause an infinite fetch loop (hammering the API and freezing the UI).
  const fetchFnRef = useRef(fetchFn)
  useEffect(() => { fetchFnRef.current = fetchFn })

  const load = useCallback(() => {
    setLoading(true)
    setError(false)
    fetchFnRef.current()
      .then(data => { setItems(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  useEffect(() => {
    fetchFnRef.current()
      .then(data => { setItems(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  return { items, setItems, loading, error, load }
}

/* ─── main component ─── */
interface AdminPanelProps {
  onClose: () => void
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeSection, setActiveSection] = useState<Section>('dashboard')
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    onClose()
  }

  return (
    <ToastProvider>
    <div className="fixed inset-0 z-[100] bg-white flex flex-col md:flex-row">
      {/* Sidebar — desktop */}
      <div className="hidden md:flex w-56 bg-[#1B3A5C] flex-col shrink-0">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#E8751A]" />
            <h2 className="text-white font-bold text-lg">Admin</h2>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeSection === item.key
                  ? 'bg-[#E8751A]/15 text-[#E8751A]'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/90'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        {/* User info & logout */}
        {user && (
          <div className="p-3 border-t border-white/10">
            <div className="px-3 py-2 mb-2">
              <p className="text-white text-sm font-medium truncate">{user.name}</p>
              <p className="text-white/40 text-xs truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar — section picker replaces the sidebar */}
        <div className="md:hidden bg-[#1B3A5C] px-3 py-2.5 flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 shrink-0">
            <Shield className="w-5 h-5 text-[#E8751A]" />
            <span className="text-white font-bold">Admin</span>
          </div>
          <Select value={activeSection} onValueChange={v => setActiveSection(v as Section)}>
            <SelectTrigger className="flex-1 min-w-0 h-8 rounded-md bg-white/10 border-white/20 text-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {navItems.map(item => (
                <SelectItem key={item.key} value={item.key} className="text-xs">
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {user && (
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="shrink-0 p-1.5 rounded-md text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} aria-label="Close admin panel" className="shrink-0 text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-[#F0F4F8]">
          <div className="p-4 md:p-8">
            {activeSection === 'dashboard' && <DashboardSection onNavigate={setActiveSection} />}
            {activeSection === 'products' && <ProductsSection />}
            {activeSection === 'manufacturing' && <ManufacturingSection />}
            {activeSection === 'services' && <ServicesSection />}
            {activeSection === 'clients' && <ClientsSection />}
            {activeSection === 'testimonials' && <TestimonialsSection />}
            {activeSection === 'careers' && <CareersSection />}
            {activeSection === 'blogs' && <BlogsSection />}
            {activeSection === 'applications' && <ApplicationsSection />}
            {activeSection === 'records' && <RecordsSection />}
            {activeSection === 'messages' && <MessagesSection />}
          </div>
        </div>
      </div>
    </div>
    </ToastProvider>
  )
}

/* ═══════════════════════════════════════════
   SHARED TABLE WRAPPER
   ═══════════════════════════════════════════ */
function SectionWrapper({ title, loading, error, onRetry, onAdd, children }: {
  title: string; loading: boolean; error: boolean; onRetry: () => void; onAdd?: () => void; children: React.ReactNode
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1A1A2E]">{title}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRetry} className="rounded-md text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </Button>
          {onAdd && (
            <Button size="sm" onClick={onAdd} className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-md text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add
            </Button>
          )}
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[#1B3A5C] animate-spin" /></div>
      ) : error ? (
        <div className="flex flex-col items-center py-20 text-[#6B7280]">
          <AlertCircle className="w-10 h-10 mb-3" />
          <p className="mb-2">Failed to load data.</p>
          <Button variant="outline" onClick={onRetry} className="rounded-md">Try Again</Button>
        </div>
      ) : (
        children
      )}
    </>
  )
}

/* ═══════════════════════════════════════════
   SEARCH / FILTER TOOLBAR (shared by all sections)
   ═══════════════════════════════════════════ */
function FilterBar({ placeholder, search, onSearch, count, total, children }: {
  placeholder: string
  search: string
  onSearch: (v: string) => void
  count: number
  total: number
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
        <Input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder={placeholder}
          className="pl-9 h-9 rounded-md text-sm bg-white"
        />
      </div>
      {children}
      <span className="text-xs text-[#9CA3AF] sm:ml-auto shrink-0">
        {count} of {total}
      </span>
    </div>
  )
}

/** Case-insensitive substring match across a row's searchable text. */
function rowMatches(fields: (string | number | boolean | undefined | null)[], query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return fields.some(f => String(f ?? '').toLowerCase().includes(q))
}

/** Dropdown filter for a single-key facet (status, category, …). */
function FilterSelect({ value, onChange, options, label }: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  label: string
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="sm:w-[150px] h-9 rounded-md text-xs bg-white">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {options.map(o => (
          <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

function statusFilterMatch(item: { active?: boolean; published?: boolean }, filter: string): boolean {
  if (filter === 'all') return true
  const flag = item.published !== undefined ? item.published : item.active !== false
  return filter === 'active' ? flag : !flag
}

/* ═══════════════════════════════════════════
   DASHBOARD SECTION
   ═══════════════════════════════════════════ */
interface DashboardStats {
  products: number
  ltPanels: number
  htPanels: number
  busducts: number
  services: number
  servicesActive: number
  clients: number
  clientsActive: number
  testimonials: number
  blogs: number
  blogsPublished: number
  applications: number
  newApplications: number
  records: number
  messages: number
  unreadMessages: number
}

function DashboardSection({ onNavigate }: { onNavigate: (section: Section) => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([])
  const [allMessages, setAllMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchAll = useCallback(() => {
    // Project Records has a JSON fallback, but guard anyway so one flaky
    // endpoint can never blank out the whole dashboard.
    const recordsCount = fetchAPI<ProjectRecordsResponse>('/project-records')
      .then(r => r.records?.length ?? 0)
      .catch(() => 0)
    return Promise.all([
      fetchAPI<Product[]>('/products'),
      fetchAPI<Service[]>('/services'),
      fetchAPI<Client[]>('/clients'),
      fetchAPI<Testimonial[]>('/testimonials'),
      fetchAPI<Blog[]>('/blogs'),
      fetchAPI<JobApplication[]>('/applications'),
      fetchAPI<ContactMessage[]>('/contact/messages'),
      recordsCount,
    ])
  }, [])

  const apply = useCallback(([
    products, services, clients, testimonials, blogs, applications, messages, records,
  ]: Awaited<ReturnType<typeof fetchAll>>) => {
    setStats({
      products: products.length,
      ltPanels: products.filter(p => p.category === 'LT Panels').length,
      htPanels: products.filter(p => p.category === 'HT Panels').length,
      busducts: products.filter(p => p.category === 'Busducts').length,
      services: services.length,
      servicesActive: services.filter(s => s.active).length,
      clients: clients.length,
      clientsActive: clients.filter(c => c.active).length,
      testimonials: testimonials.length,
      blogs: blogs.length,
      blogsPublished: blogs.filter(b => b.published).length,
      applications: applications.length,
      newApplications: applications.filter(a => a.status === 'new').length,
      records,
      messages: messages.length,
      unreadMessages: messages.filter(m => !m.read).length,
    })
    setRecentMessages(messages.slice(0, 4))
    setAllMessages(messages)
    setLoading(false)
  }, [])

  const load = useCallback(() => {
    setLoading(true)
    setError(false)
    fetchAll().then(apply).catch(() => {
      setError(true)
      setLoading(false)
    })
  }, [fetchAll, apply])

  // Initial fetch — no synchronous setState here (mirrors useCrud), all
  // state updates happen in the promise callbacks.
  useEffect(() => {
    fetchAll().then(apply).catch(() => {
      setError(true)
      setLoading(false)
    })
  }, [fetchAll, apply])

  // Inquiries per month — last 6 calendar months, newest on the right
  const chartData = useMemo(() => {
    const buckets: { key: string; label: string; count: number }[] = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      buckets.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString('en-IN', { month: 'short' }),
        count: 0,
      })
    }
    for (const m of allMessages) {
      const d = new Date(m.createdAt)
      const bucket = buckets.find(b => b.key === `${d.getFullYear()}-${d.getMonth()}`)
      if (bucket) bucket.count++
    }
    return buckets
  }, [allMessages])

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Dashboard</h2>
          <Button variant="outline" size="sm" onClick={load} className="rounded-md text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <Skeleton key={i} className="h-28 rounded-md" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-md lg:col-span-2" />
          <Skeleton className="h-64 rounded-md" />
        </div>
      </>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-20 text-[#6B7280]">
        <AlertCircle className="w-10 h-10 mb-3" />
        <p className="mb-2">Failed to load dashboard.</p>
        <Button variant="outline" onClick={load} className="rounded-md">Try Again</Button>
      </div>
    )
  }

  if (!stats) return null

  const statCards: {
    key: string; label: string; value: number; sub: string
    icon: React.ComponentType<{ className?: string }>; section: Section; highlight?: boolean
  }[] = [
    { key: 'products', label: 'Products', value: stats.products, sub: `${stats.ltPanels} LT · ${stats.htPanels} HT · ${stats.busducts} Busduct`, icon: Package, section: 'products' },
    { key: 'messages', label: 'Messages', value: stats.messages, sub: `${stats.unreadMessages} unread`, icon: Mail, section: 'messages', highlight: stats.unreadMessages > 0 },
    { key: 'services', label: 'Services', value: stats.services, sub: `${stats.servicesActive} active`, icon: Wrench, section: 'services' },
    { key: 'clients', label: 'Clients', value: stats.clients, sub: `${stats.clientsActive} active`, icon: Users, section: 'clients' },
    { key: 'blogs', label: 'Blogs', value: stats.blogs, sub: `${stats.blogsPublished} published`, icon: FileText, section: 'blogs' },
    { key: 'applications', label: 'Applications', value: stats.applications, sub: stats.newApplications > 0 ? `${stats.newApplications} new` : 'job applications', icon: UserPlus, section: 'applications', highlight: stats.newApplications > 0 },
    { key: 'records', label: 'Project Records', value: stats.records, sub: 'site installations', icon: ListChecks, section: 'records' },
    { key: 'testimonials', label: 'Testimonials', value: stats.testimonials, sub: 'client reviews', icon: MessageSquareQuote, section: 'testimonials' },
  ]

  const quickActions: { label: string; icon: React.ComponentType<{ className?: string }>; section: Section }[] = [
    { label: 'Manage Products', icon: Package, section: 'products' },
    { label: 'Manufacturing Cards', icon: Factory, section: 'manufacturing' },
    { label: 'Manage Careers', icon: Briefcase, section: 'careers' },
    { label: 'Write a Blog Post', icon: FileText, section: 'blogs' },
    { label: 'Review Messages', icon: Mail, section: 'messages' },
    { label: 'Project Records', icon: ListChecks, section: 'records' },
    { label: 'Job Applications', icon: UserPlus, section: 'applications' },
  ]

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Dashboard</h2>
          <p className="text-sm text-[#6B7280] mt-0.5">Site content and inquiries at a glance.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} className="rounded-md text-xs">
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
        </Button>
      </div>

      {/* Stat cards — click any card to jump to its section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(card => (
          <button
            key={card.key}
            onClick={() => onNavigate(card.section)}
            className="text-left bg-white rounded-md border border-[#E5E7EB] shadow-sm p-4 hover:shadow-md hover:border-[#E8751A]/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-md flex items-center justify-center ${card.highlight ? 'bg-[#E8751A]/10' : 'bg-[#1B3A5C]/5'}`}>
                <card.icon className={`w-4 h-4 ${card.highlight ? 'text-[#E8751A]' : 'text-[#1B3A5C]'}`} />
              </div>
              {card.highlight && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8751A] text-white">
                  NEW
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-[#1A1A2E] leading-none">{card.value}</p>
            <p className="text-xs font-medium text-[#6B7280] mt-1.5">{card.label}</p>
            <p className="text-[11px] text-[#9CA3AF] mt-1 truncate">{card.sub}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Inquiries chart */}
        <div className="lg:col-span-2 relative bg-white rounded-md border border-[#E5E7EB] shadow-sm p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-sm text-[#1A1A2E]">Inquiries — last 6 months</h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">{stats.messages} contact messages received</p>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} dy={4} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip
                cursor={{ fill: 'rgba(232,117,26,0.06)' }}
                contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }}
              />
              <Bar dataKey="count" name="Messages" fill="#E8751A" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-md border border-[#E5E7EB] shadow-sm p-5">
          <h3 className="font-semibold text-sm text-[#1A1A2E] mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map(action => (
              <button
                key={action.label}
                onClick={() => onNavigate(action.section)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md border border-[#E5E7EB] hover:border-[#E8751A]/50 hover:bg-[#E8751A]/[0.02] transition-colors text-sm text-[#374151]"
              >
                <action.icon className="w-4 h-4 text-[#1B3A5C] shrink-0" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent messages — full width, two-up on desktop */}
      <div className="bg-white rounded-md border border-[#E5E7EB] shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-[#1A1A2E]">Recent Messages</h3>
          <Button variant="outline" size="sm" onClick={() => onNavigate('messages')} className="rounded-md text-xs">
            View all
          </Button>
        </div>
        {recentMessages.length === 0 ? (
          <p className="text-[#6B7280] text-sm py-8 text-center">No messages yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentMessages.map(m => (
              <button
                key={m.id}
                onClick={() => onNavigate('messages')}
                className={`text-left p-3 rounded-md border transition-colors hover:border-[#E8751A]/50 hover:bg-[#E8751A]/[0.02] ${m.read ? 'border-[#E5E7EB]' : 'border-[#E8751A]/30 bg-[#E8751A]/[0.02]'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="font-semibold text-sm text-[#1A1A2E] truncate">{m.name}</p>
                    {!m.read && <Badge className="bg-[#E8751A]/10 text-[#E8751A] text-xs rounded shrink-0">New</Badge>}
                  </div>
                  <span className="text-[11px] text-[#9CA3AF] shrink-0">
                    {new Date(m.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] truncate mt-1">{m.subject || m.message}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════
   PRODUCTS SECTION
   ═══════════════════════════════════════════ */
function ProductsSection() {
  const { items, setItems, loading, error, load } = useCrud<Product>(() => fetchProducts())
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const { notify } = useToast()

  const filtered = useMemo(() => items.filter(p =>
    rowMatches([p.name, p.slug, p.category, p.description], search) &&
    (category === 'all' || p.category === category)
  ), [items, search, category])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    try { await deleteItem('/products', id); setItems(prev => prev.filter(p => p.id !== id)); notify('success', 'Product deleted') }
    catch (e) { notify('error', `Delete failed: ${(e as Error).message}`) }
  }

  const handleSave = async (data: Partial<Product>) => {
    try {
      if (editing) {
        const updated = await updateItem<Product>('/products', editing.id, data)
        setItems(prev => prev.map(p => p.id === editing.id ? updated : p))
        notify('success', 'Product updated')
      } else {
        const created = await createItem<Product>('/products', data)
        setItems(prev => [...prev, created])
        notify('success', 'Product created')
      }
      setEditing(null); setCreating(false)
    } catch (e) {
      notify('error', `Save failed: ${(e as Error).message}`)
    }
  }

  return (
    <SectionWrapper title="Products" loading={loading} error={error} onRetry={load} onAdd={() => setCreating(true)}>
      <FilterBar placeholder="Search products…" search={search} onSearch={setSearch} count={filtered.length} total={items.length}>
        <FilterSelect
          value={category}
          onChange={setCategory}
          label="Category"
          options={[
            { value: 'all', label: 'All categories' },
            { value: 'LT Panels', label: 'LT Panels' },
            { value: 'HT Panels', label: 'HT Panels' },
            { value: 'Busducts', label: 'Busducts' },
          ]}
        />
      </FilterBar>
      <div className="bg-white rounded-md border border-[#E5E7EB] shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F0F4F8]">
              <TableHead className="text-xs font-semibold">Name</TableHead>
              <TableHead className="text-xs font-semibold hidden md:table-cell">Category</TableHead>
              <TableHead className="text-xs font-semibold hidden lg:table-cell">Active</TableHead>
              <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium text-sm">{p.name}</TableCell>
                <TableCell className="hidden md:table-cell"><Badge variant="secondary" className="text-xs rounded">{p.category}</Badge></TableCell>
                <TableCell className="hidden lg:table-cell">{p.active ? <Badge className="bg-green-50 text-green-600 text-xs rounded">Active</Badge> : <Badge variant="secondary" className="text-xs rounded">Inactive</Badge>}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(p)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => handleDelete(p.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {(editing || creating) && (
        <ProductDialog item={editing} onClose={() => { setEditing(null); setCreating(false) }} onSave={handleSave} />
      )}
    </SectionWrapper>
  )
}

function ProductDialog({ item, onClose, onSave }: { item: Product | null; onClose: () => void; onSave: (data: Partial<Product>) => void }) {
  const [form, setForm] = useState(() =>
    item
      ? { name: item.name, slug: item.slug, category: item.category, description: item.description, features: item.features, imageUrl: item.imageUrl, order: item.order, active: item.active }
      : { name: '', slug: '', category: 'LT Panels', description: '', features: '', imageUrl: '', order: 0, active: true }
  )

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-md">
        <DialogHeader><DialogTitle>{item ? 'Edit Product' : 'Add Product'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs font-medium">Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs font-medium">Slug</Label><Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs font-medium">Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger className="rounded-md h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="LT Panels">LT Panels</SelectItem><SelectItem value="HT Panels">HT Panels</SelectItem><SelectItem value="Busducts">Busducts</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label className="text-xs font-medium">Order</Label><Input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs font-medium">Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="rounded-md text-sm resize-none" /></div>
          <div className="space-y-1.5"><Label className="text-xs font-medium">Features (JSON array or comma-separated)</Label><Textarea value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} rows={3} className="rounded-md text-sm resize-none" /></div>
          <ImageUpload label="Image URL" value={form.imageUrl} onChange={url => setForm(f => ({ ...f, imageUrl: url }))} />
          <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} /><Label className="text-xs font-medium">Active</Label></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-md">Cancel</Button>
          <Button onClick={() => onSave(form)} className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-md">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ═══════════════════════════════════════════
   SERVICES SECTION
   ═══════════════════════════════════════════ */
function ServicesSection() {
  const { items, setItems, loading, error, load } = useCrud<Service>(() => fetchServices())
  const [editing, setEditing] = useState<Service | null>(null)
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const { notify } = useToast()

  const filtered = useMemo(() => items.filter(s =>
    rowMatches([s.name, s.slug, s.description], search) && statusFilterMatch(s, status)
  ), [items, search, status])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return
    try { await deleteItem('/services', id); setItems(prev => prev.filter(s => s.id !== id)); notify('success', 'Service deleted') }
    catch (e) { notify('error', `Delete failed: ${(e as Error).message}`) }
  }

  const handleSave = async (data: Partial<Service>) => {
    try {
      if (editing) {
        const updated = await updateItem<Service>('/services', editing.id, data)
        setItems(prev => prev.map(s => s.id === editing.id ? updated : s))
        notify('success', 'Service updated')
      } else {
        const created = await createItem<Service>('/services', data)
        setItems(prev => [...prev, created])
        notify('success', 'Service created')
      }
      setEditing(null); setCreating(false)
    } catch (e) {
      notify('error', `Save failed: ${(e as Error).message}`)
    }
  }

  return (
    <SectionWrapper title="Services" loading={loading} error={error} onRetry={load} onAdd={() => setCreating(true)}>
      <FilterBar placeholder="Search services…" search={search} onSearch={setSearch} count={filtered.length} total={items.length}>
        <FilterSelect value={status} onChange={setStatus} label="Status" options={STATUS_OPTIONS} />
      </FilterBar>
      <div className="bg-white rounded-md border border-[#E5E7EB] shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F0F4F8]">
              <TableHead className="text-xs font-semibold">Name</TableHead>
              <TableHead className="text-xs font-semibold hidden md:table-cell">Slug</TableHead>
              <TableHead className="text-xs font-semibold hidden lg:table-cell">Active</TableHead>
              <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium text-sm">{s.name}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-[#6B7280]">{s.slug}</TableCell>
                <TableCell className="hidden lg:table-cell">{s.active ? <Badge className="bg-green-50 text-green-600 text-xs rounded">Active</Badge> : <Badge variant="secondary" className="text-xs rounded">Inactive</Badge>}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(s)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => handleDelete(s.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {(editing || creating) && (
        <ServiceDialog item={editing} onClose={() => { setEditing(null); setCreating(false) }} onSave={handleSave} />
      )}
    </SectionWrapper>
  )
}

function ServiceDialog({ item, onClose, onSave }: { item: Service | null; onClose: () => void; onSave: (data: Partial<Service>) => void }) {
  const [form, setForm] = useState(() =>
    item
      ? { name: item.name, slug: item.slug, description: item.description, icon: item.icon, features: item.features, imageUrl: item.imageUrl, order: item.order, active: item.active }
      : { name: '', slug: '', description: '', icon: '', features: '', imageUrl: '', order: 0, active: true }
  )

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-md">
        <DialogHeader><DialogTitle>{item ? 'Edit Service' : 'Add Service'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs font-medium">Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs font-medium">Slug</Label><Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs font-medium">Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="rounded-md text-sm resize-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs font-medium">Icon</Label><Input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs font-medium">Order</Label><Input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs font-medium">Features (JSON array or comma-separated)</Label><Textarea value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} rows={3} className="rounded-md text-sm resize-none" /></div>
          <ImageUpload label="Image URL" value={form.imageUrl} onChange={url => setForm(f => ({ ...f, imageUrl: url }))} />
          <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} /><Label className="text-xs font-medium">Active</Label></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-md">Cancel</Button>
          <Button onClick={() => onSave(form)} className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-md">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ═══════════════════════════════════════════
   CLIENTS SECTION
   ═══════════════════════════════════════════ */
function ClientsSection() {
  const { items, setItems, loading, error, load } = useCrud<Client>(() => fetchClients())
  const [editing, setEditing] = useState<Client | null>(null)
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const { notify } = useToast()

  const filtered = useMemo(() => items.filter(c =>
    rowMatches([c.name, c.industry, c.location], search) && statusFilterMatch(c, status)
  ), [items, search, status])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client?')) return
    try { await deleteItem('/clients', id); setItems(prev => prev.filter(c => c.id !== id)); notify('success', 'Client deleted') }
    catch (e) { notify('error', `Delete failed: ${(e as Error).message}`) }
  }

  const handleSave = async (data: Partial<Client>) => {
    try {
      if (editing) {
        const updated = await updateItem<Client>('/clients', editing.id, data)
        setItems(prev => prev.map(c => c.id === editing.id ? updated : c))
        notify('success', 'Client updated')
      } else {
        const created = await createItem<Client>('/clients', data)
        setItems(prev => [...prev, created])
        notify('success', 'Client created')
      }
      setEditing(null); setCreating(false)
    } catch (e) {
      notify('error', `Save failed: ${(e as Error).message}`)
    }
  }

  return (
    <SectionWrapper title="Clients" loading={loading} error={error} onRetry={load} onAdd={() => setCreating(true)}>
      <FilterBar placeholder="Search clients…" search={search} onSearch={setSearch} count={filtered.length} total={items.length}>
        <FilterSelect value={status} onChange={setStatus} label="Status" options={STATUS_OPTIONS} />
      </FilterBar>
      <div className="bg-white rounded-md border border-[#E5E7EB] shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F0F4F8]">
              <TableHead className="text-xs font-semibold">Name</TableHead>
              <TableHead className="text-xs font-semibold hidden md:table-cell">Industry</TableHead>
              <TableHead className="text-xs font-semibold hidden lg:table-cell">Location</TableHead>
              <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-medium text-sm">{c.name}</TableCell>
                <TableCell className="hidden md:table-cell"><Badge variant="secondary" className="text-xs rounded">{c.industry}</Badge></TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-[#6B7280]">{c.location}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(c)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => handleDelete(c.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {(editing || creating) && (
        <ClientDialog item={editing} onClose={() => { setEditing(null); setCreating(false) }} onSave={handleSave} />
      )}
    </SectionWrapper>
  )
}

function ClientDialog({ item, onClose, onSave }: { item: Client | null; onClose: () => void; onSave: (data: Partial<Client>) => void }) {
  const [form, setForm] = useState(() =>
    item
      ? { name: item.name, industry: item.industry, location: item.location, logoUrl: item.logoUrl, description: item.description, order: item.order, active: item.active }
      : { name: '', industry: '', location: '', logoUrl: '', description: '', order: 0, active: true }
  )

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-md">
        <DialogHeader><DialogTitle>{item ? 'Edit Client' : 'Add Client'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs font-medium">Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs font-medium">Industry</Label><Input value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs font-medium">Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs font-medium">Order</Label><Input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs font-medium">Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="rounded-md text-sm resize-none" /></div>
          <ImageUpload label="Logo URL" value={form.logoUrl} onChange={url => setForm(f => ({ ...f, logoUrl: url }))} />
          <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} /><Label className="text-xs font-medium">Active</Label></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-md">Cancel</Button>
          <Button onClick={() => onSave(form)} className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-md">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ═══════════════════════════════════════════
   TESTIMONIALS SECTION
   ═══════════════════════════════════════════ */
function TestimonialsSection() {
  const { items, setItems, loading, error, load } = useCrud<Testimonial>(() => fetchTestimonials())
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const { notify } = useToast()

  const filtered = useMemo(() => items.filter(t =>
    rowMatches([t.name, t.company, t.designation, t.content], search) && statusFilterMatch(t, status)
  ), [items, search, status])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    try { await deleteItem('/testimonials', id); setItems(prev => prev.filter(t => t.id !== id)); notify('success', 'Testimonial deleted') }
    catch (e) { notify('error', `Delete failed: ${(e as Error).message}`) }
  }

  const handleSave = async (data: Partial<Testimonial>) => {
    try {
      if (editing) {
        const updated = await updateItem<Testimonial>('/testimonials', editing.id, data)
        setItems(prev => prev.map(t => t.id === editing.id ? updated : t))
        notify('success', 'Testimonial updated')
      } else {
        const created = await createItem<Testimonial>('/testimonials', data)
        setItems(prev => [...prev, created])
        notify('success', 'Testimonial created')
      }
      setEditing(null); setCreating(false)
    } catch (e) {
      notify('error', `Save failed: ${(e as Error).message}`)
    }
  }

  return (
    <SectionWrapper title="Testimonials" loading={loading} error={error} onRetry={load} onAdd={() => setCreating(true)}>
      <FilterBar placeholder="Search testimonials…" search={search} onSearch={setSearch} count={filtered.length} total={items.length}>
        <FilterSelect value={status} onChange={setStatus} label="Status" options={STATUS_OPTIONS} />
      </FilterBar>
      <div className="bg-white rounded-md border border-[#E5E7EB] shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F0F4F8]">
              <TableHead className="text-xs font-semibold">Name</TableHead>
              <TableHead className="text-xs font-semibold hidden md:table-cell">Company</TableHead>
              <TableHead className="text-xs font-semibold hidden lg:table-cell">Rating</TableHead>
              <TableHead className="text-xs font-semibold hidden md:table-cell">Video</TableHead>
              <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(t => (
              <TableRow key={t.id}>
                <TableCell className="font-medium text-sm">{t.name}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-[#6B7280]">{t.company}</TableCell>
                <TableCell className="hidden lg:table-cell"><Badge className="bg-[#E8751A]/10 text-[#E8751A] text-xs rounded">{t.rating}/5</Badge></TableCell>
                <TableCell className="hidden md:table-cell">
                  {t.videoUrl ? (
                    <Badge className="bg-red-50 text-red-600 text-xs rounded gap-1"><Youtube className="w-3 h-3" /> YouTube</Badge>
                  ) : (
                    <span className="text-xs text-[#9CA3AF]">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(t)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => handleDelete(t.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {(editing || creating) && (
        <TestimonialDialog item={editing} onClose={() => { setEditing(null); setCreating(false) }} onSave={handleSave} />
      )}
    </SectionWrapper>
  )
}

function TestimonialDialog({ item, onClose, onSave }: { item: Testimonial | null; onClose: () => void; onSave: (data: Partial<Testimonial>) => void }) {
  const [form, setForm] = useState(() =>
    item
      ? { name: item.name, company: item.company, designation: item.designation, content: item.content, rating: item.rating, videoUrl: item.videoUrl, imageUrl: item.imageUrl, order: item.order, active: item.active }
      : { name: '', company: '', designation: '', content: '', rating: 5, videoUrl: '', imageUrl: '', order: 0, active: true }
  )
  const [saving, setSaving] = useState(false)

  // Extract YouTube ID for live preview
  const ytMatch = form.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/)
  const ytId = ytMatch ? ytMatch[1] : null

  const handleSave = async () => {
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-md">
        <DialogHeader><DialogTitle>{item ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs font-medium">Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs font-medium">Company</Label><Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs font-medium">Designation</Label><Input value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs font-medium">Rating</Label><Input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseInt(e.target.value) || 5 }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs font-medium">Content</Label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={4} className="rounded-md text-sm resize-none" /></div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium flex items-center gap-1.5"><Youtube className="w-3.5 h-3.5 text-red-600" /> YouTube Video URL</Label>
            <Input value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." className="rounded-md h-9 text-sm" />
            <p className="text-[11px] text-[#6B7280]">Paste a YouTube link to show this testimonial as a video review on the website. Supported: youtube.com/watch?v=, youtu.be/, embed/</p>
            {ytId && (
              <div className="mt-2 rounded-md overflow-hidden border border-[#E5E7EB]">
                <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt="Video preview" className="w-full h-24 object-cover" />
                <div className="px-2 py-1 bg-green-50 text-green-700 text-[11px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Valid YouTube video — preview above</div>
              </div>
            )}
            {form.videoUrl && !ytId && (
              <p className="text-[11px] text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Not a valid YouTube URL</p>
            )}
          </div>
          <ImageUpload label="Image URL (optional avatar)" value={form.imageUrl} onChange={url => setForm(f => ({ ...f, imageUrl: url }))} />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs font-medium">Order</Label><Input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="rounded-md h-9 text-sm" /></div>
            <div className="flex items-center gap-2 pt-5"><Switch checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} /><Label className="text-xs font-medium">Active</Label></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-md">Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-md">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ═══════════════════════════════════════════
   BLOGS SECTION
   ═══════════════════════════════════════════ */
function BlogsSection() {
  const { items, setItems, loading, error, load } = useCrud<Blog>(() => fetchBlogs())
  const [editing, setEditing] = useState<Blog | null>(null)
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const { notify } = useToast()

  const filtered = useMemo(() => items.filter(b =>
    rowMatches([b.title, b.author, b.slug, b.excerpt], search) && statusFilterMatch(b, status)
  ), [items, search, status])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return
    try { await deleteItem('/blogs', id); setItems(prev => prev.filter(b => b.id !== id)); notify('success', 'Blog post deleted') }
    catch (e) { notify('error', `Delete failed: ${(e as Error).message}`) }
  }

  const handleSave = async (data: Partial<Blog>) => {
    try {
      if (editing) {
        const updated = await updateItem<Blog>('/blogs', editing.id, data)
        setItems(prev => prev.map(b => b.id === editing.id ? updated : b))
        notify('success', 'Blog post updated')
      } else {
        const created = await createItem<Blog>('/blogs', data)
        setItems(prev => [...prev, created])
        notify('success', 'Blog post created')
      }
      setEditing(null); setCreating(false)
    } catch (e) {
      notify('error', `Save failed: ${(e as Error).message}`)
    }
  }

  return (
    <SectionWrapper title="Blog Posts" loading={loading} error={error} onRetry={load} onAdd={() => setCreating(true)}>
      <FilterBar placeholder="Search posts…" search={search} onSearch={setSearch} count={filtered.length} total={items.length}>
        <FilterSelect
          value={status}
          onChange={setStatus}
          label="Status"
          options={[
            { value: 'all', label: 'All posts' },
            { value: 'active', label: 'Published' },
            { value: 'inactive', label: 'Draft' },
          ]}
        />
      </FilterBar>
      <div className="bg-white rounded-md border border-[#E5E7EB] shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F0F4F8]">
              <TableHead className="text-xs font-semibold">Title</TableHead>
              <TableHead className="text-xs font-semibold hidden md:table-cell">Author</TableHead>
              <TableHead className="text-xs font-semibold hidden lg:table-cell">Published</TableHead>
              <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(b => (
              <TableRow key={b.id}>
                <TableCell className="font-medium text-sm max-w-xs truncate">{b.title}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-[#6B7280]">{b.author}</TableCell>
                <TableCell className="hidden lg:table-cell">{b.published ? <Badge className="bg-green-50 text-green-600 text-xs rounded">Published</Badge> : <Badge variant="secondary" className="text-xs rounded">Draft</Badge>}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(b)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => handleDelete(b.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {(editing || creating) && (
        <BlogDialog key={editing?.id ?? 'new'} item={editing} onClose={() => { setEditing(null); setCreating(false) }} onSave={handleSave} />
      )}
    </SectionWrapper>
  )
}

function BlogDialog({ item, onClose, onSave }: { item: Blog | null; onClose: () => void; onSave: (data: Partial<Blog>) => void }) {
  const [form, setForm] = useState(() =>
    item
      ? { title: item.title, slug: item.slug, excerpt: item.excerpt, content: item.content, coverImageUrl: item.coverImageUrl, author: item.author, published: item.published }
      : { title: '', slug: '', excerpt: '', content: '', coverImageUrl: '', author: '', published: false }
  )

  // Auto-slug from the title while the slug field is untouched
  const [slugTouched, setSlugTouched] = useState(!!item)
  const handleTitle = (title: string) => {
    setForm(f => ({
      ...f,
      title,
      slug: slugTouched ? f.slug : title.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, ''),
    }))
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-md">
        <DialogHeader><DialogTitle>{item ? 'Edit Blog Post' : 'Add Blog Post'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs font-medium">Title</Label><Input value={form.title} onChange={e => handleTitle(e.target.value)} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs font-medium">Slug</Label><Input value={form.slug} onChange={e => { setSlugTouched(true); setForm(f => ({ ...f, slug: e.target.value })) }} className="rounded-md h-9 text-sm" placeholder="auto-generated-from-title" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs font-medium">Author</Label><Input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <ImageUpload label="Cover Image URL" value={form.coverImageUrl} onChange={url => setForm(f => ({ ...f, coverImageUrl: url }))} />
          </div>
          <div className="space-y-1.5"><Label className="text-xs font-medium">Excerpt</Label><Textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} className="rounded-md text-sm resize-none" /></div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Content (rich text editor — saved as markdown)</Label>
            <RichTextEditor
              markdown={form.content || ''}
              onChange={md => setForm(f => ({ ...f, content: md }))}
            />
            <p className="text-[11px] text-[#6B7280]">Bold, italic, headings, lists, quotes and links via the toolbar. Renders on the public blog page exactly as shown.</p>
          </div>
          <div className="flex items-center gap-2"><Switch checked={form.published} onCheckedChange={v => setForm(f => ({ ...f, published: v }))} /><Label className="text-xs font-medium">Published</Label></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-md">Cancel</Button>
          <Button onClick={() => onSave(form)} className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-md">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ═══════════════════════════════════════════
   MANUFACTURING SECTION
   ═══════════════════════════════════════════ */
const MANUFACTURING_ICON_NAMES = [
  'Zap', 'Cpu', 'Gauge', 'Activity', 'RefreshCw', 'MonitorPlay', 'CircuitBoard',
  'ShieldCheck', 'Factory', 'Settings', 'Award', 'Boxes', 'FileCheck', 'CheckCircle2',
]

const MANUFACTURING_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap, Cpu, Gauge, Activity, RefreshCw, MonitorPlay, CircuitBoard,
  ShieldCheck, Factory, Settings, Award, Boxes, FileCheck, CheckCircle2,
}

function ManufacturingSection() {
  const { items, setItems, loading, error, load } = useCrud<ManufacturingItem>(() => fetchManufacturing())
  const [editing, setEditing] = useState<ManufacturingItem | null>(null)
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const { notify } = useToast()

  const filtered = useMemo(() => items.filter(m =>
    rowMatches([m.name, m.tagline, m.description], search) && statusFilterMatch(m, status)
  ), [items, search, status])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this manufacturing card? The public page falls back to bundled defaults only when the catalog is empty.')) return
    try { await deleteItem('/manufacturing', id); setItems(prev => prev.filter(m => m.id !== id)); notify('success', 'Manufacturing card deleted') }
    catch (e) { notify('error', `Delete failed: ${(e as Error).message}`) }
  }

  const handleSave = async (data: Partial<ManufacturingItem>) => {
    try {
      if (editing) {
        const updated = await updateItem<ManufacturingItem>('/manufacturing', editing.id, data)
        setItems(prev => prev.map(m => m.id === editing.id ? updated : m))
        notify('success', 'Manufacturing card updated')
      } else {
        const created = await createItem<ManufacturingItem>('/manufacturing', data)
        setItems(prev => [...prev, created])
        notify('success', 'Manufacturing card created')
      }
      setEditing(null); setCreating(false)
    } catch (e) {
      notify('error', `Save failed: ${(e as Error).message}`)
    }
  }

  return (
    <SectionWrapper title="Manufacturing Cards" loading={loading} error={error} onRetry={load} onAdd={() => setCreating(true)}>
      <p className="text-xs text-[#6B7280] mb-3">These cards power the public Manufacturing page — edit names, photos, descriptions and features here.</p>
      <FilterBar placeholder="Search cards…" search={search} onSearch={setSearch} count={filtered.length} total={items.length}>
        <FilterSelect value={status} onChange={setStatus} label="Status" options={STATUS_OPTIONS} />
      </FilterBar>
      <div className="bg-white rounded-md border border-[#E5E7EB] shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F0F4F8]">
              <TableHead className="text-xs font-semibold">Name</TableHead>
              <TableHead className="text-xs font-semibold hidden md:table-cell">Tagline</TableHead>
              <TableHead className="text-xs font-semibold hidden lg:table-cell">Order</TableHead>
              <TableHead className="text-xs font-semibold hidden md:table-cell">Active</TableHead>
              <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(m => {
              const IconPreview = MANUFACTURING_ICON_MAP[m.icon] || Factory
              return (
                <TableRow key={m.id}>
                  <TableCell className="font-medium text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-md bg-[#E8751A]/10 flex items-center justify-center shrink-0">
                        <IconPreview className="w-3.5 h-3.5 text-[#E8751A]" />
                      </span>
                      {m.name}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-[#6B7280] max-w-xs truncate">{m.tagline}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-[#6B7280]">{m.order}</TableCell>
                  <TableCell className="hidden md:table-cell">{m.active ? <Badge className="bg-green-50 text-green-600 text-xs rounded">Active</Badge> : <Badge variant="secondary" className="text-xs rounded">Inactive</Badge>}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(m)}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => handleDelete(m.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      {(editing || creating) && (
        <ManufacturingItemDialog key={editing?.id ?? 'new'} item={editing} onClose={() => { setEditing(null); setCreating(false) }} onSave={handleSave} />
      )}
    </SectionWrapper>
  )
}

function ManufacturingItemDialog({ item, onClose, onSave }: { item: ManufacturingItem | null; onClose: () => void; onSave: (data: Partial<ManufacturingItem>) => void }) {
  const featuresToText = (features: string) => {
    try {
      const parsed = JSON.parse(features)
      if (Array.isArray(parsed)) return parsed.join('\n')
      return features
    } catch {
      return features
    }
  }
  const [form, setForm] = useState(() => ({
    name: item?.name ?? '',
    tagline: item?.tagline ?? '',
    description: item?.description ?? '',
    image: item?.image ?? '',
    featuresText: featuresToText(item?.features ?? ''),
    icon: item?.icon ?? 'Factory',
    order: item?.order ?? 0,
    active: item?.active ?? true,
  }))
  const [saving, setSaving] = useState(false)

  const IconPreview = MANUFACTURING_ICON_MAP[form.icon] || Factory

  const handleSave = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      return // let the API error surface via onSave throw
    }
    setSaving(true)
    const features = JSON.stringify(form.featuresText.split('\n').map(f => f.trim()).filter(Boolean))
    try {
      await onSave({
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        image: form.image,
        features,
        icon: form.icon,
        order: form.order,
        active: form.active,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-md">
        <DialogHeader><DialogTitle>{item ? 'Edit Manufacturing Card' : 'Add Manufacturing Card'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs font-medium">Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs font-medium">Tagline</Label><Input value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} className="rounded-md h-9 text-sm" placeholder="e.g. Power Control Center" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs font-medium">Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="rounded-md text-sm resize-none" /></div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Features (one per line)</Label>
            <Textarea value={form.featuresText} onChange={e => setForm(f => ({ ...f, featuresText: e.target.value }))} rows={4} className="rounded-md text-sm resize-none" placeholder={'Centralized distribution\nBus bar design up to 6300A'} />
          </div>
          <ImageUpload label="Image URL" value={form.image} onChange={url => setForm(f => ({ ...f, image: url }))} />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Icon</Label>
              <Select value={form.icon} onValueChange={v => setForm(f => ({ ...f, icon: v }))}>
                <SelectTrigger className="rounded-md h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MANUFACTURING_ICON_NAMES.map(name => (
                    <SelectItem key={name} value={name} className="text-sm">{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label className="text-xs font-medium">Order</Label><Input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2.5">
            <span className="w-8 h-8 rounded-md bg-[#E8751A]/10 flex items-center justify-center shrink-0">
              <IconPreview className="w-4 h-4 text-[#E8751A]" />
            </span>
            <span className="text-xs text-[#6B7280]">Icon preview — shown as the badge on the card photo</span>
          </div>
          <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} /><Label className="text-xs font-medium">Active (visible on public page)</Label></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-md">Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-md">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ═══════════════════════════════════════════
   CAREERS SECTION
   ═══════════════════════════════════════════ */
const CAREER_ICON_NAMES = [
  'Briefcase', 'Zap', 'Hammer', 'FlaskConical', 'Building2', 'Lightbulb',
  'Shield', 'Sparkles', 'GraduationCap', 'Users', 'Globe', 'Wrench',
  'Cpu', 'Gauge', 'Factory', 'Target',
]

const CAREER_ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Briefcase, Zap, Hammer, FlaskConical, Building2, Lightbulb, Shield,
  Sparkles, GraduationCap, Users, Globe, Wrench, Cpu, Gauge, Factory, Target,
}

function CareersSection() {
  const { items, setItems, loading, error, load } = useCrud<Career>(() => fetchCareers())
  const [editing, setEditing] = useState<Career | null>(null)
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')
  const { notify } = useToast()

  const departments = useMemo(() => {
    const seen: string[] = []
    for (const c of items) if (c.department && !seen.includes(c.department)) seen.push(c.department)
    return seen
  }, [items])

  const filtered = useMemo(() => items.filter(c =>
    rowMatches([c.title, c.department, c.location, c.experience, c.type], search) &&
    (department === 'all' || c.department === department) && statusFilterMatch(c, 'all')
  ), [items, search, department])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job opening? It will disappear from the public Careers page.')) return
    try { await deleteItem('/careers', id); setItems(prev => prev.filter(c => c.id !== id)); notify('success', 'Job opening deleted') }
    catch (e) { notify('error', `Delete failed: ${(e as Error).message}`) }
  }

  const handleSave = async (data: Partial<Career>) => {
    try {
      if (editing) {
        const updated = await updateItem<Career>('/careers', editing.id, data)
        setItems(prev => prev.map(c => c.id === editing.id ? updated : c))
        notify('success', 'Job opening updated')
      } else {
        const created = await createItem<Career>('/careers', data)
        setItems(prev => [...prev, created])
        notify('success', 'Job opening created')
      }
      setEditing(null); setCreating(false)
    } catch (e) {
      notify('error', `Save failed: ${(e as Error).message}`)
    }
  }

  return (
    <SectionWrapper title="Careers" loading={loading} error={error} onRetry={load} onAdd={() => setCreating(true)}>
      <p className="text-xs text-[#6B7280] mb-3">Job openings shown on the public Careers page — add, edit or deactivate positions anytime.</p>
      <FilterBar placeholder="Search openings…" search={search} onSearch={setSearch} count={filtered.length} total={items.length}>
        <FilterSelect
          value={department}
          onChange={setDepartment}
          label="Department"
          options={[{ value: 'all', label: 'All departments' }, ...departments.map(d => ({ value: d, label: d }))]}
        />
      </FilterBar>
      {items.length === 0 && !loading ? (
        <p className="text-[#6B7280] text-center py-12">No openings yet — click Add to post one.</p>
      ) : (
        <div className="bg-white rounded-md border border-[#E5E7EB] shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F0F4F8]">
                <TableHead className="text-xs font-semibold">Title</TableHead>
                <TableHead className="text-xs font-semibold hidden md:table-cell">Department</TableHead>
                <TableHead className="text-xs font-semibold hidden lg:table-cell">Location</TableHead>
                <TableHead className="text-xs font-semibold hidden lg:table-cell">Experience</TableHead>
                <TableHead className="text-xs font-semibold hidden md:table-cell">Active</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => {
                const IconPreview = CAREER_ICON_MAP[c.icon] || Briefcase
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-sm">
                      <span className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: `${c.accent}14` }}>
                          <IconPreview className="w-3.5 h-3.5" style={{ color: c.accent }} />
                        </span>
                        {c.title}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell"><Badge variant="secondary" className="text-xs rounded">{c.department}</Badge></TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-[#6B7280]">{c.location}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-[#6B7280]">{c.experience}</TableCell>
                    <TableCell className="hidden md:table-cell">{c.active ? <Badge className="bg-green-50 text-green-600 text-xs rounded">Active</Badge> : <Badge variant="secondary" className="text-xs rounded">Inactive</Badge>}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(c)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => handleDelete(c.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
      {(editing || creating) && (
        <CareerDialog key={editing?.id ?? 'new'} item={editing} onClose={() => { setEditing(null); setCreating(false) }} onSave={handleSave} />
      )}
    </SectionWrapper>
  )
}

function CareerDialog({ item, onClose, onSave }: { item: Career | null; onClose: () => void; onSave: (data: Partial<Career>) => void }) {
  const [form, setForm] = useState(() => ({
    title: item?.title ?? '',
    location: item?.location ?? '',
    experience: item?.experience ?? '',
    department: item?.department ?? 'Engineering',
    type: item?.type ?? 'Full-time',
    icon: item?.icon ?? 'Briefcase',
    accent: item?.accent ?? '#1B3A5C',
    order: item?.order ?? 0,
    active: item?.active ?? true,
  }))
  const [saving, setSaving] = useState(false)

  const IconPreview = CAREER_ICON_MAP[form.icon] || Briefcase

  const handleSave = async () => {
    if (!form.title.trim() || !form.location.trim() || !form.experience.trim() || !form.department.trim()) return
    setSaving(true)
    try {
      await onSave({ ...form })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-md">
        <DialogHeader><DialogTitle>{item ? 'Edit Job Opening' : 'Add Job Opening'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5"><Label className="text-xs font-medium">Job Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="rounded-md h-9 text-sm" placeholder="e.g. Senior Electrical Engineer" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs font-medium">Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="rounded-md h-9 text-sm" placeholder="Chennai" /></div>
            <div className="space-y-1.5"><Label className="text-xs font-medium">Experience</Label><Input value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} className="rounded-md h-9 text-sm" placeholder="3-6 years" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs font-medium">Department</Label>
              <Input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="rounded-md h-9 text-sm" placeholder="Engineering" list="career-departments" />
              <datalist id="career-departments">
                <option value="Engineering" /><option value="Operations" /><option value="Design" /><option value="Service" />
              </datalist>
            </div>
            <div className="space-y-1.5"><Label className="text-xs font-medium">Type</Label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                <SelectTrigger className="rounded-md h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Icon</Label>
              <Select value={form.icon} onValueChange={v => setForm(f => ({ ...f, icon: v }))}>
                <SelectTrigger className="rounded-md h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CAREER_ICON_NAMES.map(name => (
                    <SelectItem key={name} value={name} className="text-sm">{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Accent color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.accent}
                  onChange={e => setForm(f => ({ ...f, accent: e.target.value }))}
                  className="w-9 h-9 rounded-md border border-[#E5E7EB] bg-white cursor-pointer p-1"
                  aria-label="Accent color"
                />
                <Input value={form.accent} onChange={e => setForm(f => ({ ...f, accent: e.target.value }))} className="rounded-md h-9 text-sm flex-1" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs font-medium">Order</Label><Input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="rounded-md h-9 text-sm" /></div>
            <div className="flex items-center gap-2 pt-5"><Switch checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} /><Label className="text-xs font-medium">Active</Label></div>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2.5">
            <span className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: `${form.accent}14` }}>
              <IconPreview className="w-4 h-4" style={{ color: form.accent }} />
            </span>
            <span className="text-xs text-[#6B7280]">Card preview — icon and accent color on the public page</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-md">Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-md">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


/* ═══════════════════════════════════════════
   PROJECT RECORDS SECTION
   (the portfolio list shown on the public Projects page)
   ═══════════════════════════════════════════ */
interface ProjectRecordItem {
  id?: string
  sno: number
  customer: string
  voltage: string
  industry: string
  scope: string
  location: string
  state: string
  value: string
  year: string
  imageUrl?: string
}

interface ProjectRecordsResponse {
  total: number
  records: ProjectRecordItem[]
  source: 'supabase' | 'json'
}

/** Prisma row shape returned by PUT /api/project-records/[id] (camelCase columns). */
interface ProjectRecordRow {
  id: string
  sno?: number
  customerName?: string
  voltageLevel?: string
  industry?: string
  scopeOfWork?: string
  location?: string
  state?: string
  projectValue?: string
  year?: string
  imageUrl?: string
}

function RecordsSection() {
  const { notify } = useToast()
  const [records, setRecords] = useState<ProjectRecordItem[]>([])
  const [source, setSource] = useState<'supabase' | 'json'>('supabase')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [voltageFilter, setVoltageFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [brokenThumbs, setBrokenThumbs] = useState<Record<string, boolean>>({})
  const reqIdRef = useRef(0)
  const recordFileRef = useRef<HTMLInputElement>(null)
  const uploadTargetRef = useRef<ProjectRecordItem | null>(null)

  // Debounce the search input (~350ms) before hitting the API.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350)
    return () => clearTimeout(t)
  }, [searchInput])

  const load = useCallback(() => {
    const reqId = ++reqIdRef.current
    setLoading(true)
    setError(false)
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    fetchAPI<ProjectRecordsResponse>(`/project-records?${params.toString()}`)
      .then(data => {
        if (reqId !== reqIdRef.current) return // a newer request superseded this one
        setRecords(data.records || [])
        setSource(data.source)
        setDrafts({})
        setLoading(false)
      })
      .catch(() => {
        if (reqId !== reqIdRef.current) return
        setError(true)
        setLoading(false)
      })
  }, [search])

  // Fetch on mount and whenever the debounced search changes.
  useEffect(() => { load() }, [load])

  const handleSave = async (record: ProjectRecordItem, explicitUrl?: string) => {
    const id = record.id
    if (!id || source !== 'supabase') return
    const imageUrl = (explicitUrl ?? drafts[id] ?? record.imageUrl ?? '').trim()
    setSavingId(id)
    try {
      const updated = await fetchAPI<ProjectRecordRow>(`/project-records/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ imageUrl }),
      })
      // Map the Prisma row (camelCase columns) back to the API record shape.
      const mapped: ProjectRecordItem = {
        id: updated.id,
        sno: updated.sno ?? record.sno,
        customer: updated.customerName ?? record.customer,
        voltage: updated.voltageLevel ?? record.voltage,
        industry: updated.industry ?? record.industry,
        scope: updated.scopeOfWork ?? record.scope,
        location: updated.location ?? record.location,
        state: updated.state ?? record.state,
        value: updated.projectValue ?? record.value,
        year: updated.year ?? record.year,
        imageUrl: updated.imageUrl ?? imageUrl,
      }
      setRecords(prev => prev.map(r => r.id === id ? mapped : r))
      setDrafts(prev => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      notify('success', `Image updated for ${record.customer || `record #${record.sno}`}`)
    } catch (e) {
      notify('error', `Save failed: ${(e as Error).message}`)
    } finally {
      setSavingId(null)
    }
  }

  const setDraft = (id: string, value: string) => {
    setDrafts(prev => ({ ...prev, [id]: value }))
  }

  // Upload a file for a row: pick → POST /api/upload → save the returned
  // /api/images/<id> URL onto that record in one shot.
  const handleRecordUpload = async (file: File) => {
    const record = uploadTargetRef.current
    if (!record?.id) return
    const problem = validateImageFile(file)
    if (problem) { notify('error', problem); return }
    setUploadingId(record.id)
    try {
      const url = await uploadImageFile(file)
      await handleSave(record, url)
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadingId(null)
      uploadTargetRef.current = null
    }
  }

  // Voltage facet from the loaded page of records; filter is client-side
  const voltages = useMemo(() => {
    const seen: string[] = []
    for (const r of records) {
      const v = (r.voltage ?? '').trim()
      if (v && !seen.includes(v)) seen.push(v)
    }
    return seen.sort((a, b) => parseFloat(a) - parseFloat(b))
  }, [records])

  const visibleRecords = useMemo(() =>
    voltageFilter === 'all' ? records : records.filter(r => (r.voltage ?? '').trim() === voltageFilter)
  , [records, voltageFilter])

  return (
    <>
      <input
        ref={recordFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) void handleRecordUpload(f); e.target.value = '' }}
      />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Project Records</h2>
          <p className="text-xs text-[#6B7280] mt-1">The portfolio list on the public Projects page — set each record&apos;s image URL.</p>
        </div>
        <div className="flex items-center gap-2">
          {!loading && !error && (
            <Badge variant="secondary" className="text-xs rounded">{records.length} record{records.length === 1 ? '' : 's'}</Badge>
          )}
          <Button variant="outline" size="sm" onClick={load} className="rounded-md text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      {source === 'json' && !loading && !error && (
        <div className="flex items-start gap-2.5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 mb-4">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">Editing requires the database connection — showing read-only data.</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search customer, industry, location, voltage..."
            className="rounded-md h-9 text-sm pl-9 bg-white"
          />
        </div>
        <FilterSelect
          value={voltageFilter}
          onChange={setVoltageFilter}
          label="Voltage"
          options={[
            { value: 'all', label: 'All voltages' },
            ...voltages.map(v => ({ value: v, label: `${v} KV` })),
          ]}
        />
        <span className="text-xs text-[#9CA3AF] sm:ml-auto shrink-0">{visibleRecords.length} of {records.length}</span>
      </div>

      {loading ? (
        <div className="bg-white rounded-md border border-[#E5E7EB] shadow-sm divide-y divide-[#E5E7EB]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-md shrink-0" />
              <div className="flex-1 space-y-2 min-w-0">
                <Skeleton className="h-4 w-48 max-w-full" />
                <Skeleton className="h-3 w-72 max-w-full" />
              </div>
              <Skeleton className="h-9 flex-1 md:w-[400px] md:flex-none" />
              <Skeleton className="h-9 w-16 shrink-0" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center py-20 text-[#6B7280]">
          <AlertCircle className="w-10 h-10 mb-3" />
          <p className="mb-2">Failed to load project records.</p>
          <Button variant="outline" onClick={load} className="rounded-md">Try Again</Button>
        </div>
      ) : visibleRecords.length === 0 ? (
        <p className="text-[#6B7280] text-center py-12">No project records found{search.trim() ? ` for "${search.trim()}"` : ''}.</p>
      ) : (
        <div className="bg-white rounded-md border border-[#E5E7EB] shadow-sm overflow-x-auto">
          <div className="max-h-[70vh] overflow-y-auto divide-y divide-[#E5E7EB]">
            {visibleRecords.map(r => {
              const key = r.id ?? `sno-${r.sno}`
              const draft = r.id ? (drafts[r.id] ?? r.imageUrl ?? '') : (r.imageUrl ?? '')
              const dirty = draft.trim() !== (r.imageUrl ?? '').trim()
              const saving = !!r.id && savingId === r.id
              const canSave = !!r.id && source === 'supabase' && dirty && !saving
              const thumb = (r.imageUrl ?? '').trim()
              const thumbBroken = brokenThumbs[`${key}:${thumb}`]
              const meta = [r.voltage ? `${r.voltage} KV` : '', r.industry, r.location].filter(Boolean).join(' · ')
              return (
                <div key={key} className="p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4 hover:bg-[#F0F4F8]/60 transition-colors">
                  {/* Thumbnail (64px) */}
                  {thumb && !thumbBroken ? (
                    <img
                      src={thumb}
                      alt={r.customer}
                      className="w-16 h-16 rounded-md object-cover border border-[#E5E7EB] bg-[#F0F4F8] shrink-0"
                      onError={() => setBrokenThumbs(prev => ({ ...prev, [`${key}:${thumb}`]: true }))}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                  {/* Record info */}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-[#1A1A2E] truncate">
                      <span className="text-[#9CA3AF] font-normal mr-1.5">#{r.sno}</span>
                      {r.customer || '—'}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-0.5 truncate">{meta || '—'}</p>
                  </div>
                  {/* Image URL editor (stacks on mobile, side-by-side from sm up) */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:w-[480px] shrink-0">
                    <Input
                      value={draft}
                      onChange={e => { if (r.id) setDraft(r.id, e.target.value) }}
                      placeholder="/images/projects/... or https://..."
                      disabled={!r.id || source !== 'supabase'}
                      className="rounded-md h-9 text-xs w-full flex-1 min-w-0"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { if (!r.id) return; uploadTargetRef.current = r; recordFileRef.current?.click() }}
                      disabled={!r.id || source !== 'supabase' || uploadingId === r.id}
                      className="rounded-md text-xs self-end sm:self-auto shrink-0"
                    >
                      {uploadingId === r.id ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Upload className="w-3.5 h-3.5 mr-1" />}
                      Upload
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSave(r)}
                      disabled={!canSave}
                      className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-md text-xs self-end sm:self-auto shrink-0"
                    >
                      {saving ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Check className="w-3.5 h-3.5 mr-1" />}
                      Save
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!loading && !error && records.length > 0 && source === 'supabase' && (
        <p className="mt-3 text-xs text-[#6B7280]">Changes save directly to the database and appear on the public Projects page immediately.</p>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════
   JOB APPLICATIONS SECTION
   (submitted via the Apply Now form on the public Careers page)
   ═══════════════════════════════════════════ */
interface JobApplication {
  id: string
  jobTitle: string
  name: string
  email: string
  phone: string
  experience: string
  resumeUrl: string
  message: string
  status: string
  createdAt: string
}

const APPLICATION_STATUSES: { value: string; label: string; badge: string }[] = [
  { value: 'new', label: 'New', badge: 'bg-[#E8751A] text-white' },
  { value: 'reviewed', label: 'Reviewed', badge: 'bg-[#1B3A5C]/10 text-[#1B3A5C]' },
  { value: 'shortlisted', label: 'Shortlisted', badge: 'bg-[#0D9488]/10 text-[#0D9488]' },
  { value: 'rejected', label: 'Rejected', badge: 'bg-slate-100 text-slate-500' },
  { value: 'hired', label: 'Hired', badge: 'bg-green-100 text-green-700' },
]

function ApplicationsSection() {
  const { notify } = useToast()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  useEffect(() => {
    fetchAPI<JobApplication[]>('/applications')
      .then(data => { setApplications(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const load = useCallback(() => {
    setLoading(true)
    setError(false)
    fetchAPI<JobApplication[]>('/applications')
      .then(data => { setApplications(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const filtered = useMemo(() => applications.filter(a =>
    rowMatches([a.name, a.email, a.phone, a.jobTitle, a.message], search) &&
    (status === 'all' || a.status === status)
  ), [applications, search, status])

  const setStatusFor = async (application: JobApplication, next: string) => {
    const prev = application.status
    if (next === prev) return
    setApplications(list => list.map(x => x.id === application.id ? { ...x, status: next } : x))
    try {
      await fetchAPI(`/applications/${application.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: next }),
      })
      notify('success', `${application.name} marked ${next}`)
    } catch (e) {
      setApplications(list => list.map(x => x.id === application.id ? { ...x, status: prev } : x))
      notify('error', `Status update failed: ${(e as Error).message}`)
    }
  }

  const handleDelete = async (application: JobApplication) => {
    if (!confirm(`Delete the application from ${application.name}?`)) return
    try {
      await fetchAPI(`/applications/${application.id}`, { method: 'DELETE' })
      setApplications(list => list.filter(x => x.id !== application.id))
      notify('success', 'Application deleted')
    } catch (e) {
      notify('error', `Delete failed: ${(e as Error).message}`)
    }
  }

  return (
    <SectionWrapper title="Job Applications" loading={loading} error={error} onRetry={load}>
      <FilterBar
        placeholder="Search name, email, role…"
        search={search}
        onSearch={setSearch}
        count={filtered.length}
        total={applications.length}
      >
        <FilterSelect
          value={status}
          onChange={setStatus}
          label="Status"
          options={[
            { value: 'all', label: 'All statuses' },
            ...APPLICATION_STATUSES.map(s => ({ value: s.value, label: s.label })),
          ]}
        />
      </FilterBar>
      {filtered.length === 0 ? (
        <p className="text-[#6B7280] text-center py-12">No applications match.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map(a => {
            const meta = APPLICATION_STATUSES.find(s => s.value === a.status) || APPLICATION_STATUSES[0]
            return (
              <div
                key={a.id}
                className={`bg-white rounded-md border shadow-sm p-5 ${a.status === 'new' ? 'border-[#E8751A]/30 bg-[#E8751A]/[0.02]' : 'border-[#E5E7EB]'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm text-[#1A1A2E]">{a.name}</h3>
                      <Badge className={`${meta.badge} text-xs rounded border-0`}>{meta.label}</Badge>
                    </div>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Applied for <span className="font-medium text-[#1B3A5C]">{a.jobTitle}</span>
                    </p>
                  </div>
                  <span className="text-xs text-[#6B7280] shrink-0">
                    {new Date(a.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B7280] mb-2">
                  <a href={`mailto:${a.email}`} className="hover:text-[#E8751A]">{a.email}</a>
                  {a.phone && <a href={`tel:${a.phone}`} className="hover:text-[#E8751A]">{a.phone}</a>}
                  {a.experience && <span>Experience: {a.experience}</span>}
                  {a.resumeUrl && (
                    <a href={a.resumeUrl} target="_blank" rel="noreferrer" className="text-[#1B3A5C] font-medium hover:text-[#E8751A] inline-flex items-center gap-1">
                      <FileText className="w-3 h-3" /> View Resume
                    </a>
                  )}
                </div>
                <p className="text-sm text-[#374151] leading-relaxed mb-3 whitespace-pre-line">{a.message}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={a.status} onValueChange={v => void setStatusFor(a, v)}>
                    <SelectTrigger className="h-8 rounded-md text-xs w-[150px] bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {APPLICATION_STATUSES.map(s => (
                        <SelectItem key={s.value} value={s.value} className="text-xs">{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => void handleDelete(a)}
                    className="rounded-md text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </SectionWrapper>
  )
}

/* ═══════════════════════════════════════════
   MESSAGES SECTION
   ═══════════════════════════════════════════ */
function MessagesSection() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  useEffect(() => {
    fetchAPI<ContactMessage[]>('/contact/messages')
      .then(data => { setMessages(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const filtered = useMemo(() => messages.filter(m =>
    rowMatches([m.name, m.email, m.phone, m.subject, m.message], search) &&
    (status === 'all' || (status === 'unread' ? !m.read : m.read))
  ), [messages, search, status])

  const load = useCallback(() => {
    setLoading(true)
    setError(false)
    fetchAPI<ContactMessage[]>('/contact/messages')
      .then(data => { setMessages(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const markAsRead = async (id: string) => {
    try {
      await fetchAPI<ContactMessage>('/contact/messages', {
        method: 'PATCH',
        body: JSON.stringify({ id, read: true }),
      })
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
    } catch {}
  }

  return (
    <SectionWrapper title="Contact Messages" loading={loading} error={error} onRetry={load}>
      <FilterBar placeholder="Search messages…" search={search} onSearch={setSearch} count={filtered.length} total={messages.length}>
        <FilterSelect
          value={status}
          onChange={setStatus}
          label="Status"
          options={[
            { value: 'all', label: 'All messages' },
            { value: 'unread', label: 'Unread' },
            { value: 'read', label: 'Read' },
          ]}
        />
      </FilterBar>
      {filtered.length === 0 ? (
        <p className="text-[#6B7280] text-center py-12">No messages match.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map(m => (
            <div
              key={m.id}
              className={`bg-white rounded-md border shadow-sm p-5 ${m.read ? 'border-[#E5E7EB]' : 'border-[#E8751A]/30 bg-[#E8751A]/[0.02]'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-sm text-[#1A1A2E]">{m.name}</h3>
                  {!m.read && <Badge className="bg-[#E8751A]/10 text-[#E8751A] text-xs rounded">New</Badge>}
                </div>
                <span className="text-xs text-[#6B7280]">{new Date(m.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#6B7280] mb-2">
                <span>{m.email}</span>
                {m.phone && <span>{m.phone}</span>}
              </div>
              {m.subject && <p className="text-sm font-medium text-[#1A1A2E] mb-1">{m.subject}</p>}
              <p className="text-sm text-[#374151] leading-relaxed mb-3">{m.message}</p>
              {!m.read && (
                <Button size="sm" variant="outline" onClick={() => markAsRead(m.id)} className="rounded-md text-xs">
                  <Check className="w-3.5 h-3.5 mr-1" /> Mark as Read
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  )
}
