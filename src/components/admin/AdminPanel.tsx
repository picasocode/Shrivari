'use client'

import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react'
import {
  X, Package, Wrench, Users, MessageSquareQuote, FileText, FolderKanban,
  Mail, Settings, Plus, Pencil, Trash2, Check, RefreshCw,
  Loader2, AlertCircle, LogOut, Shield, CheckCircle2, XCircle, Youtube,
} from 'lucide-react'
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
import {
  fetchProducts, fetchServices, fetchClients, fetchTestimonials,
  fetchBlogs, fetchProjects, fetchSettings, fetchAPI,
  createItem, updateItem, deleteItem,
  type Product, type Service, type Client, type Testimonial,
  type Blog, type Project, type SiteSettings,
} from '@/lib/api'
import { useAuth } from '@/lib/auth'

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

/* ─── types ─── */
type Section = 'products' | 'services' | 'clients' | 'testimonials' | 'blogs' | 'projects' | 'messages' | 'settings'

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
  { key: 'products', label: 'Products', icon: Package },
  { key: 'services', label: 'Services', icon: Wrench },
  { key: 'clients', label: 'Clients', icon: Users },
  { key: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { key: 'blogs', label: 'Blogs', icon: FileText },
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'messages', label: 'Messages', icon: Mail },
  { key: 'settings', label: 'Settings', icon: Settings },
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
  const [activeSection, setActiveSection] = useState<Section>('products')
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    onClose()
  }

  return (
    <ToastProvider>
    <div className="fixed inset-0 z-[100] bg-white flex">
      {/* Sidebar */}
      <div className="w-56 bg-[#455a64] flex flex-col shrink-0">
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
              <p className="text-white/40 text-sm truncate">{user.email}</p>
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
      <div className="flex-1 overflow-y-auto bg-[#eceff1]">
        <div className="p-6 md:p-8">
          {activeSection === 'products' && <ProductsSection />}
          {activeSection === 'services' && <ServicesSection />}
          {activeSection === 'clients' && <ClientsSection />}
          {activeSection === 'testimonials' && <TestimonialsSection />}
          {activeSection === 'blogs' && <BlogsSection />}
          {activeSection === 'projects' && <ProjectsSection />}
          {activeSection === 'messages' && <MessagesSection />}
          {activeSection === 'settings' && <SettingsSection />}
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
          <Button variant="outline" size="sm" onClick={onRetry} className="rounded-md text-sm">
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </Button>
          {onAdd && (
            <Button size="sm" onClick={onAdd} className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-md text-sm">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add
            </Button>
          )}
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[#37474f] animate-spin" /></div>
      ) : error ? (
        <div className="flex flex-col items-center py-20 text-[#546e7a]">
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
   PRODUCTS SECTION
   ═══════════════════════════════════════════ */
function ProductsSection() {
  const { items, setItems, loading, error, load } = useCrud<Product>(() => fetchProducts())
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const { notify } = useToast()

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
      <div className="bg-white rounded-md border border-[#cfd8dc] shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#eceff1]">
              <TableHead className="text-sm font-semibold">Name</TableHead>
              <TableHead className="text-sm font-semibold hidden md:table-cell">Category</TableHead>
              <TableHead className="text-sm font-semibold hidden lg:table-cell">Active</TableHead>
              <TableHead className="text-sm font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium text-sm">{p.name}</TableCell>
                <TableCell className="hidden md:table-cell"><Badge variant="secondary" className="text-sm rounded">{p.category}</Badge></TableCell>
                <TableCell className="hidden lg:table-cell">{p.active ? <Badge className="bg-green-50 text-green-600 text-sm rounded">Active</Badge> : <Badge variant="secondary" className="text-sm rounded">Inactive</Badge>}</TableCell>
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

  useEffect(() => {
    if (item) {
      setForm({ name: item.name, slug: item.slug, category: item.category, description: item.description, features: item.features, imageUrl: item.imageUrl, order: item.order, active: item.active })
    } else {
      setForm({ name: '', slug: '', category: 'LT Panels', description: '', features: '', imageUrl: '', order: 0, active: true })
    }
  }, [item])

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-md">
        <DialogHeader><DialogTitle>{item ? 'Edit Product' : 'Add Product'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-sm font-medium">Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-medium">Slug</Label><Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-sm font-medium">Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger className="rounded-md h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="LT Panels">LT Panels</SelectItem><SelectItem value="HT Panels">HT Panels</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label className="text-sm font-medium">Order</Label><Input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-sm font-medium">Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="rounded-md text-sm resize-none" /></div>
          <div className="space-y-1.5"><Label className="text-sm font-medium">Features (JSON array or comma-separated)</Label><Textarea value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} rows={3} className="rounded-md text-sm resize-none" /></div>
          <div className="space-y-1.5"><Label className="text-sm font-medium">Image URL</Label><Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
          <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} /><Label className="text-sm font-medium">Active</Label></div>
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
  const { notify } = useToast()

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
      <div className="bg-white rounded-md border border-[#cfd8dc] shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#eceff1]">
              <TableHead className="text-sm font-semibold">Name</TableHead>
              <TableHead className="text-sm font-semibold hidden md:table-cell">Slug</TableHead>
              <TableHead className="text-sm font-semibold hidden lg:table-cell">Active</TableHead>
              <TableHead className="text-sm font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium text-sm">{s.name}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-[#546e7a]">{s.slug}</TableCell>
                <TableCell className="hidden lg:table-cell">{s.active ? <Badge className="bg-green-50 text-green-600 text-sm rounded">Active</Badge> : <Badge variant="secondary" className="text-sm rounded">Inactive</Badge>}</TableCell>
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

  useEffect(() => {
    if (item) {
      setForm({ name: item.name, slug: item.slug, description: item.description, icon: item.icon, features: item.features, imageUrl: item.imageUrl, order: item.order, active: item.active })
    } else {
      setForm({ name: '', slug: '', description: '', icon: '', features: '', imageUrl: '', order: 0, active: true })
    }
  }, [item])

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-md">
        <DialogHeader><DialogTitle>{item ? 'Edit Service' : 'Add Service'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-sm font-medium">Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-medium">Slug</Label><Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-sm font-medium">Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="rounded-md text-sm resize-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-sm font-medium">Icon</Label><Input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-medium">Order</Label><Input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-sm font-medium">Features (JSON array or comma-separated)</Label><Textarea value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} rows={3} className="rounded-md text-sm resize-none" /></div>
          <div className="space-y-1.5"><Label className="text-sm font-medium">Image URL</Label><Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
          <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} /><Label className="text-sm font-medium">Active</Label></div>
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
  const { notify } = useToast()

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
      <div className="bg-white rounded-md border border-[#cfd8dc] shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#eceff1]">
              <TableHead className="text-sm font-semibold">Name</TableHead>
              <TableHead className="text-sm font-semibold hidden md:table-cell">Industry</TableHead>
              <TableHead className="text-sm font-semibold hidden lg:table-cell">Location</TableHead>
              <TableHead className="text-sm font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-medium text-sm">{c.name}</TableCell>
                <TableCell className="hidden md:table-cell"><Badge variant="secondary" className="text-sm rounded">{c.industry}</Badge></TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-[#546e7a]">{c.location}</TableCell>
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

  useEffect(() => {
    if (item) {
      setForm({ name: item.name, industry: item.industry, location: item.location, logoUrl: item.logoUrl, description: item.description, order: item.order, active: item.active })
    } else {
      setForm({ name: '', industry: '', location: '', logoUrl: '', description: '', order: 0, active: true })
    }
  }, [item])

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-md">
        <DialogHeader><DialogTitle>{item ? 'Edit Client' : 'Add Client'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-sm font-medium">Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-medium">Industry</Label><Input value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-sm font-medium">Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-medium">Order</Label><Input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-sm font-medium">Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="rounded-md text-sm resize-none" /></div>
          <div className="space-y-1.5"><Label className="text-sm font-medium">Logo URL</Label><Input value={form.logoUrl} onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
          <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} /><Label className="text-sm font-medium">Active</Label></div>
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
  const { notify } = useToast()

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
      <div className="bg-white rounded-md border border-[#cfd8dc] shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#eceff1]">
              <TableHead className="text-sm font-semibold">Name</TableHead>
              <TableHead className="text-sm font-semibold hidden md:table-cell">Company</TableHead>
              <TableHead className="text-sm font-semibold hidden lg:table-cell">Rating</TableHead>
              <TableHead className="text-sm font-semibold hidden md:table-cell">Video</TableHead>
              <TableHead className="text-sm font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(t => (
              <TableRow key={t.id}>
                <TableCell className="font-medium text-sm">{t.name}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-[#546e7a]">{t.company}</TableCell>
                <TableCell className="hidden lg:table-cell"><Badge className="bg-[#E8751A]/10 text-[#E8751A] text-sm rounded">{t.rating}/5</Badge></TableCell>
                <TableCell className="hidden md:table-cell">
                  {t.videoUrl ? (
                    <Badge className="bg-red-50 text-red-600 text-sm rounded gap-1"><Youtube className="w-3 h-3" /> YouTube</Badge>
                  ) : (
                    <span className="text-sm text-[#9CA3AF]">—</span>
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

  useEffect(() => {
    if (item) {
      setForm({ name: item.name, company: item.company, designation: item.designation, content: item.content, rating: item.rating, videoUrl: item.videoUrl || '', imageUrl: item.imageUrl || '', order: item.order, active: item.active })
    } else {
      setForm({ name: '', company: '', designation: '', content: '', rating: 5, videoUrl: '', imageUrl: '', order: 0, active: true })
    }
  }, [item])

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
            <div className="space-y-1.5"><Label className="text-sm font-medium">Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-medium">Company</Label><Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-sm font-medium">Designation</Label><Input value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-medium">Rating</Label><Input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseInt(e.target.value) || 5 }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-sm font-medium">Content</Label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={4} className="rounded-md text-sm resize-none" /></div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium flex items-center gap-1.5"><Youtube className="w-3.5 h-3.5 text-red-600" /> YouTube Video URL</Label>
            <Input value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." className="rounded-md h-9 text-sm" />
            <p className="text-[11px] text-[#546e7a]">Paste a YouTube link to show this testimonial as a video review on the website. Supported: youtube.com/watch?v=, youtu.be/, embed/</p>
            {ytId && (
              <div className="mt-2 rounded-md overflow-hidden border border-[#cfd8dc]">
                <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt="Video preview" className="w-full h-24 object-cover" />
                <div className="px-2 py-1 bg-green-50 text-green-700 text-[11px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Valid YouTube video — preview above</div>
              </div>
            )}
            {form.videoUrl && !ytId && (
              <p className="text-[11px] text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Not a valid YouTube URL</p>
            )}
          </div>
          <div className="space-y-1.5"><Label className="text-sm font-medium">Image URL (optional avatar)</Label><Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-sm font-medium">Order</Label><Input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="rounded-md h-9 text-sm" /></div>
            <div className="flex items-center gap-2 pt-5"><Switch checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} /><Label className="text-sm font-medium">Active</Label></div>
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
  const { notify } = useToast()

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
      <div className="bg-white rounded-md border border-[#cfd8dc] shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#eceff1]">
              <TableHead className="text-sm font-semibold">Title</TableHead>
              <TableHead className="text-sm font-semibold hidden md:table-cell">Author</TableHead>
              <TableHead className="text-sm font-semibold hidden lg:table-cell">Published</TableHead>
              <TableHead className="text-sm font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(b => (
              <TableRow key={b.id}>
                <TableCell className="font-medium text-sm max-w-xs truncate">{b.title}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-[#546e7a]">{b.author}</TableCell>
                <TableCell className="hidden lg:table-cell">{b.published ? <Badge className="bg-green-50 text-green-600 text-sm rounded">Published</Badge> : <Badge variant="secondary" className="text-sm rounded">Draft</Badge>}</TableCell>
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
        <BlogDialog item={editing} onClose={() => { setEditing(null); setCreating(false) }} onSave={handleSave} />
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

  useEffect(() => {
    if (item) {
      setForm({ title: item.title, slug: item.slug, excerpt: item.excerpt, content: item.content, coverImageUrl: item.coverImageUrl, author: item.author, published: item.published })
    } else {
      setForm({ title: '', slug: '', excerpt: '', content: '', coverImageUrl: '', author: '', published: false })
    }
  }, [item])

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-md">
        <DialogHeader><DialogTitle>{item ? 'Edit Blog Post' : 'Add Blog Post'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-sm font-medium">Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-medium">Slug</Label><Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-sm font-medium">Author</Label><Input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-medium">Cover Image URL</Label><Input value={form.coverImageUrl} onChange={e => setForm(f => ({ ...f, coverImageUrl: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-sm font-medium">Excerpt</Label><Textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} className="rounded-md text-sm resize-none" /></div>
          <div className="space-y-1.5"><Label className="text-sm font-medium">Content</Label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={6} className="rounded-md text-sm resize-none" /></div>
          <div className="flex items-center gap-2"><Switch checked={form.published} onCheckedChange={v => setForm(f => ({ ...f, published: v }))} /><Label className="text-sm font-medium">Published</Label></div>
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
   PROJECTS SECTION
   ═══════════════════════════════════════════ */
function ProjectsSection() {
  const { items, setItems, loading, error, load } = useCrud<Project>(() => fetchProjects())
  const [editing, setEditing] = useState<Project | null>(null)
  const [creating, setCreating] = useState(false)
  const { notify } = useToast()

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    try { await deleteItem('/projects', id); setItems(prev => prev.filter(p => p.id !== id)); notify('success', 'Project deleted') }
    catch (e) { notify('error', `Delete failed: ${(e as Error).message}`) }
  }

  const handleSave = async (data: Partial<Project>) => {
    try {
      if (editing) {
        const updated = await updateItem<Project>('/projects', editing.id, data)
        setItems(prev => prev.map(p => p.id === editing.id ? updated : p))
        notify('success', 'Project updated')
      } else {
        const created = await createItem<Project>('/projects', data)
        setItems(prev => [...prev, created])
        notify('success', 'Project created')
      }
      setEditing(null); setCreating(false)
    } catch (e) {
      notify('error', `Save failed: ${(e as Error).message}`)
    }
  }

  return (
    <SectionWrapper title="Projects" loading={loading} error={error} onRetry={load} onAdd={() => setCreating(true)}>
      <div className="bg-white rounded-md border border-[#cfd8dc] shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#eceff1]">
              <TableHead className="text-sm font-semibold">Name</TableHead>
              <TableHead className="text-sm font-semibold hidden md:table-cell">Client</TableHead>
              <TableHead className="text-sm font-semibold hidden lg:table-cell">Category</TableHead>
              <TableHead className="text-sm font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium text-sm">{p.name}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-[#546e7a]">{p.client}</TableCell>
                <TableCell className="hidden lg:table-cell"><Badge variant="secondary" className="text-sm rounded">{p.category}</Badge></TableCell>
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
        <ProjectDialog item={editing} onClose={() => { setEditing(null); setCreating(false) }} onSave={handleSave} />
      )}
    </SectionWrapper>
  )
}

function ProjectDialog({ item, onClose, onSave }: { item: Project | null; onClose: () => void; onSave: (data: Partial<Project>) => void }) {
  const [form, setForm] = useState(() =>
    item
      ? { name: item.name, client: item.client, location: item.location, description: item.description, imageUrl: item.imageUrl, category: item.category, order: item.order, active: item.active }
      : { name: '', client: '', location: '', description: '', imageUrl: '', category: 'ongoing', order: 0, active: true }
  )

  useEffect(() => {
    if (item) {
      setForm({ name: item.name, client: item.client, location: item.location, description: item.description, imageUrl: item.imageUrl, category: item.category, order: item.order, active: item.active })
    } else {
      setForm({ name: '', client: '', location: '', description: '', imageUrl: '', category: 'ongoing', order: 0, active: true })
    }
  }, [item])

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-md">
        <DialogHeader><DialogTitle>{item ? 'Edit Project' : 'Add Project'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-sm font-medium">Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-medium">Client</Label><Input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-sm font-medium">Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-sm font-medium">Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger className="rounded-md h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="ongoing">Ongoing</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5"><Label className="text-sm font-medium">Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="rounded-md text-sm resize-none" /></div>
          <div className="space-y-1.5"><Label className="text-sm font-medium">Image URL</Label><Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} className="rounded-md h-9 text-sm" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-sm font-medium">Order</Label><Input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="rounded-md h-9 text-sm" /></div>
            <div className="flex items-center gap-2 pt-5"><Switch checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} /><Label className="text-sm font-medium">Active</Label></div>
          </div>
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
   MESSAGES SECTION
   ═══════════════════════════════════════════ */
function MessagesSection() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchAPI<ContactMessage[]>('/contact/messages')
      .then(data => { setMessages(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

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
      {messages.length === 0 ? (
        <p className="text-[#546e7a] text-center py-12">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map(m => (
            <div
              key={m.id}
              className={`bg-white rounded-md border shadow-sm p-5 ${m.read ? 'border-[#cfd8dc]' : 'border-[#E8751A]/30 bg-[#E8751A]/[0.02]'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-sm text-[#1A1A2E]">{m.name}</h3>
                  {!m.read && <Badge className="bg-[#E8751A]/10 text-[#E8751A] text-sm rounded">New</Badge>}
                </div>
                <span className="text-sm text-[#546e7a]">{new Date(m.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#546e7a] mb-2">
                <span>{m.email}</span>
                {m.phone && <span>{m.phone}</span>}
              </div>
              {m.subject && <p className="text-sm font-medium text-[#1A1A2E] mb-1">{m.subject}</p>}
              <p className="text-sm text-[#374151] leading-relaxed mb-3">{m.message}</p>
              {!m.read && (
                <Button size="sm" variant="outline" onClick={() => markAsRead(m.id)} className="rounded-md text-sm">
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

/* ═══════════════════════════════════════════
   SETTINGS SECTION
   ═══════════════════════════════════════════ */
function SettingsSection() {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
      .then(data => { setSettings(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const load = useCallback(() => {
    setLoading(true)
    setError(false)
    fetchSettings()
      .then(data => { setSettings(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetchAPI('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      })
    } catch {}
    setSaving(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[#37474f] animate-spin" /></div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-20 text-[#546e7a]">
        <AlertCircle className="w-10 h-10 mb-3" />
        <p className="mb-2">Failed to load settings.</p>
        <Button variant="outline" onClick={load} className="rounded-md">Try Again</Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1A1A2E]">Settings</h2>
        <Button onClick={handleSave} disabled={saving} className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-md">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Save All
        </Button>
      </div>
      <div className="bg-white rounded-md border border-[#cfd8dc] shadow-sm p-6 space-y-5">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="space-y-1.5">
            <Label className="text-sm font-medium text-[#1A1A2E]">{key}</Label>
            <Textarea
              value={value}
              onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
              rows={2}
              className="rounded-md text-sm resize-none"
            />
          </div>
        ))}
      </div>
    </>
  )
}
