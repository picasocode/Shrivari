'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle, ChevronRight,
  Building2, ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/components/Router'
import { submitContact } from '@/lib/api'

/* ────────────────────────────────────────────────────────────
   Design tokens
   ──────────────────────────────────────────────────────────── */
const INK = '#1A1A2E'
const NAVY = '#152D4F'
const CORAL = '#E8751A'

/* ────────────────────────────────────────────────────────────
   Fade-in helper
   ──────────────────────────────────────────────────────────── */
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
  const isInView = useInView(ref, { once: true, margin: '-50px' })
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

/* ────────────────────────────────────────────────────────────
   Phone → tel: helper (Indian format)
   ──────────────────────────────────────────────────────────── */
function telLink(phone: string): string {
  const cleaned = phone.replace(/[\s\-]/g, '')
  if (cleaned.startsWith('+')) return `tel:${cleaned}`
  if (cleaned.startsWith('044') || cleaned.startsWith('0413')) return `tel:+91${cleaned}`
  if (cleaned.length === 10) return `tel:+91${cleaned}`
  return `tel:${cleaned}`
}

/* ────────────────────────────────────────────────────────────
   Offices — single source of truth (Chennai HQ is the featured
   card; no separate "Corporate Office" section needed)
   ──────────────────────────────────────────────────────────── */
interface Office {
  id: string
  label: string
  company: string
  address: string
  city: string
  state: string
  phones: string[]
  emails: string[]
  featured?: boolean
}

const OFFICES: Office[] = [
  {
    id: 'chennai-hq',
    label: 'Head Office',
    company: 'Shri Vaari Electricals Private Limited',
    address: 'C-37, Thiru-Vi-Ka Industrial Estate, Guindy – 600 032, Chennai, Tamil Nadu',
    city: 'Chennai',
    state: 'Tamil Nadu',
    phones: ['044 2250 0241', '044 2250 0913', '044 4350 2914'],
    emails: ['enquiries@shrivaarielectricals.com'],
    featured: true,
  },
  {
    id: 'hyderabad',
    label: 'Regional Office',
    company: 'Shri Vaari Electrotech Pvt Ltd.',
    address: 'Plot No. D8, Phase I, IDA Pashamailaram, Pattancheru, Sangareddy District, Telangana – 502 307',
    city: 'Hyderabad',
    state: 'Telangana',
    phones: ['75400 88953'],
    emails: ['enquiries@shrivarielctrotech.com'],
  },
  {
    id: 'bangalore',
    label: 'Regional Office',
    company: 'Shrivaari Electricals Pvt Ltd',
    address: '2nd Floor, #690, 11th Main Road B, 2nd Block, Rajaji Nagar, Bangalore – 560 010',
    city: 'Bangalore',
    state: 'Karnataka',
    phones: ['81478 25481'],
    emails: ['technical.blr@shrivaarielectricals.com'],
  },
  {
    id: 'trivandrum',
    label: 'Regional Office',
    company: 'Shri Vaari Electricals Pvt. Ltd',
    address: '1st Floor, TC V/1837 (1), TRRA-185-A, Aaditya, Nadukkavu Lane, Ambalamukku, Peroorkada PO, Thiruvananthapuram, Kerala – 695 005',
    city: 'Thiruvananthapuram',
    state: 'Kerala',
    phones: ['95513 66695'],
    emails: [],
  },
  {
    id: 'pondicherry',
    label: 'Regional Office',
    company: 'Sri Vaari Electricals Agencies',
    address: '#2, ECR Main Road, Lawspet, Puducherry – 605 008',
    city: 'Puducherry',
    state: 'Puducherry',
    phones: ['0413 2256 174', '98439 29232'],
    emails: ['srivaari.pdy@gmail.com'],
  },
  {
    id: 'hosur',
    label: 'Regional Office',
    company: 'Sri Vaari Electricals Pvt. Ltd.',
    address: '#315, 1st Floor, Mahalakshmi Tower, Rayakottai Road, Hosur – 635 109',
    city: 'Hosur',
    state: 'Tamil Nadu',
    phones: ['99943 72426'],
    emails: ['shrivaari.hsr@gmail.com'],
  },
  {
    id: 'goa',
    label: 'Regional Office',
    company: 'Shri Vaari Electricals Pvt Ltd.',
    address: 'Shri Ganesh Krupa, H.No. 51/1-B, Birmottem, Bastora, Bardez, Mapusa, North Goa – 403 507',
    city: 'Mapusa',
    state: 'Goa',
    phones: ['98809 94281', '92847 76364'],
    emails: ['projects.blr@shrivaarielectricals.com'],
  },
  {
    id: 'chettipedu',
    label: 'Manufacturing Unit',
    company: 'Infinite Electrotech Pvt Ltd',
    address: 'No. 100, Kuthambakkam Road, Chettipedu, Sriperumbudur TK, Kancheepuram – 602 105',
    city: 'Chettipedu',
    state: 'Tamil Nadu',
    phones: ['95510 47711'],
    emails: [],
  },
]

/* ────────────────────────────────────────────────────────────
   Project Type options for the enquiry form
   ──────────────────────────────────────────────────────────── */
const PROJECT_TYPES = [
  'Electrical EPC / Turnkey',
  'LT / HT Panel Manufacturing',
  'Substation & Switchgear',
  'Industrial Electrification',
  'Solar / Renewable Energy',
  'Testing & Commissioning',
  'Cabling & Cable Laying',
  'Facility Maintenance',
  'Other',
]

/* ────────────────────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────────────────────── */
export default function ContactPage() {
  const { navigate } = useRouter()
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    projectType: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const setField = (k: keyof typeof form, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      // Map the 6 UI fields onto the API's expected shape:
      // company + projectType go into `subject` so the admin backend
      // still receives them in a single field.
      const subjectParts = [
        form.company ? `Company: ${form.company}` : '',
        form.projectType ? `Project: ${form.projectType}` : '',
      ].filter(Boolean).join(' | ')
      await submitContact({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        subject: subjectParts || undefined,
        message: form.message,
      })
      setSuccess(true)
      setForm({ name: '', company: '', phone: '', email: '', projectType: '', message: '' })
      setTimeout(() => setSuccess(false), 6000)
    } catch {
      setError('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* ════════════════════════════════════════════════════════
          HERO — minimal, clean, lots of air
          ════════════════════════════════════════════════════════ */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-[100px] pb-14 md:pb-20">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm mb-10"
          >
            <button
              onClick={() => navigate('home')}
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-slate-700 font-medium">Contact</span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-[2px]" style={{ background: CORAL }} />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
                Get In Touch
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] mb-5" style={{ color: INK }}>
              Let&apos;s Build
              <br />
              Something Together
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl leading-relaxed">
              Tell us about your project — our engineering and execution team
              will get back to you within one business day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          ENQUIRY FORM + CONTACT ESSENTIALS
          Two-column split. Left = form (6 fields). Right = essentials.
          ════════════════════════════════════════════════════════ */}
      <section className="bg-white pb-16 md:pb-24">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* ── Left: Enquiry form (3 of 5 cols) ── */}
            <FadeIn className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ color: INK }}>
                    Send an Enquiry
                  </h2>
                  <p className="text-slate-500 text-sm md:text-base">
                    Fill in the form below and we&apos;ll respond within one business day.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Row 1: Name + Company Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field
                      label="Name"
                      required
                      value={form.name}
                      onChange={v => setField('name', v)}
                      placeholder="Your full name"
                    />
                    <Field
                      label="Company Name"
                      value={form.company}
                      onChange={v => setField('company', v)}
                      placeholder="Your company"
                    />
                  </div>

                  {/* Row 2: Phone + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field
                      label="Phone Number"
                      type="tel"
                      value={form.phone}
                      onChange={v => setField('phone', v)}
                      placeholder="10-digit mobile"
                    />
                    <Field
                      label="Email Address"
                      type="email"
                      required
                      value={form.email}
                      onChange={v => setField('email', v)}
                      placeholder="you@company.com"
                    />
                  </div>

                  {/* Row 3: Project Type (select) */}
                  <SelectField
                    label="Project Type"
                    value={form.projectType}
                    onChange={v => setField('projectType', v)}
                    options={PROJECT_TYPES}
                    placeholder="Select a project type"
                  />

                  {/* Row 4: Message */}
                  <Field
                    label="Message"
                    required
                    multiline
                    value={form.message}
                    onChange={v => setField('message', v)}
                    placeholder="Tell us about your project scope, location, timeline…"
                  />

                  {/* Error / Success */}
                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                      {error}
                    </p>
                  )}
                  {success && (
                    <div className="flex items-start gap-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Thank you — your enquiry is on its way.</p>
                        <p className="text-green-600 mt-0.5">Our team will respond within one business day.</p>
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={submitting}
                    size="lg"
                    className="w-full h-12 md:h-14 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 group"
                    style={{ background: INK, color: '#FFFFFF' }}
                  >
                    {submitting ? 'Sending…' : 'Send Enquiry'}
                    {!submitting && (
                      <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    )}
                  </Button>
                </form>
              </div>
            </FadeIn>

            {/* ── Right: Contact essentials (2 of 5 cols) ── */}
            <FadeIn delay={0.15} className="lg:col-span-2">
              <div className="space-y-4">
                {/* Essentials card */}
                <div className="rounded-2xl p-6 md:p-8" style={{ background: NAVY }}>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="w-8 h-[2px]" style={{ background: CORAL }} />
                    <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/60">
                      Reach Us
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-6 leading-tight">
                    Shri Vaari Electricals
                  </h3>

                  <div className="space-y-5">
                    {/* Phone */}
                    <a
                      href={telLink('+91 99419 05833')}
                      className="flex items-start gap-4 group"
                    >
                      <span className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(232,117,26,0.15)' }}>
                        <Phone className="w-4 h-4" style={{ color: CORAL }} />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold tracking-wider uppercase text-white/50 mb-0.5">Phone</p>
                        <p className="text-white font-medium text-sm group-hover:text-[#E8751A] transition-colors">
                          +91 99419 05833
                        </p>
                        <p className="text-white/50 text-xs mt-0.5">044 2250 0241 / 0913</p>
                      </div>
                    </a>

                    {/* Email */}
                    <a
                      href="mailto:enquiries@shrivaarielectricals.com"
                      className="flex items-start gap-4 group"
                    >
                      <span className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(232,117,26,0.15)' }}>
                        <Mail className="w-4 h-4" style={{ color: CORAL }} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold tracking-wider uppercase text-white/50 mb-0.5">Email</p>
                        <p className="text-white font-medium text-sm break-all group-hover:text-[#E8751A] transition-colors">
                          enquiries@shrivaarielectricals.com
                        </p>
                      </div>
                    </a>

                    {/* Address */}
                    <div className="flex items-start gap-4">
                      <span className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(232,117,26,0.15)' }}>
                        <MapPin className="w-4 h-4" style={{ color: CORAL }} />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold tracking-wider uppercase text-white/50 mb-0.5">Head Office</p>
                        <p className="text-white font-medium text-sm leading-relaxed">
                          C-37, Thiru-Vi-Ka Industrial Estate, Guindy – 600 032, Chennai, Tamil Nadu
                        </p>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start gap-4">
                      <span className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(232,117,26,0.15)' }}>
                        <Clock className="w-4 h-4" style={{ color: CORAL }} />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold tracking-wider uppercase text-white/50 mb-0.5">Business Hours</p>
                        <p className="text-white font-medium text-sm">Mon – Sat</p>
                        <p className="text-white/50 text-xs">9:30 AM – 6:30 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick CTA card */}
                <div className="rounded-2xl border border-slate-200 p-6 md:p-8 bg-[#F8FAFC]">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4" style={{ color: CORAL }} />
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500">
                      Prefer to talk?
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Speak directly with our engineering team for urgent project enquiries.
                  </p>
                  <a
                    href={telLink('+91 99419 05833')}
                    className="inline-flex items-center gap-2 font-semibold text-sm transition-colors group"
                    style={{ color: INK }}
                  >
                    Call +91 99419 05833
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: CORAL }} />
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          OUR OFFICES — clean grid, Chennai HQ as featured card.
          No separate "Corporate Office" section — no repetition.
          ════════════════════════════════════════════════════════ */}
      <section className="bg-[#F8FAFC] py-16 md:py-24 border-t border-slate-200">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12 md:mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-8 bg-slate-300" />
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-slate-400">
                  Pan-India Presence
                </span>
                <span className="h-px w-8 bg-slate-300" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>
                Our Offices
              </h2>
              <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Eight offices across India — a head office, regional branches,
                and a dedicated manufacturing unit.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {OFFICES.map((office, i) => (
              <FadeIn key={office.id} delay={(i % 4) * 0.08}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`relative h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 ${
                    office.featured
                      ? 'sm:col-span-2 lg:col-span-2'
                      : 'bg-white border border-slate-200 hover:border-slate-300'
                  }`}
                  style={office.featured ? { background: `linear-gradient(160deg, ${NAVY} 0%, #0D1D3A 100%)` } : {}}
                >
                  {/* Featured HQ image header */}
                  {office.featured && (
                    <div className="relative h-40 md:h-48 overflow-hidden">
                      <img
                        src="/images/offices/chennai-hq.jpg"
                        alt={`${office.company} — ${office.city}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1D3A] via-[#0D1D3A]/40 to-transparent" />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Label badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                        style={
                          office.featured
                            ? { background: CORAL, color: '#FFFFFF' }
                            : { background: 'rgba(232,117,26,0.1)', color: CORAL }
                        }
                      >
                        <Building2 className="w-3 h-3" />
                        {office.label}
                      </span>
                      {office.featured && (
                        <span className="text-white/30 text-xs font-medium">{office.state}</span>
                      )}
                    </div>

                    {/* Company name */}
                    <h3
                      className={`font-bold text-base mb-1 leading-tight ${office.featured ? 'text-white' : ''}`}
                      style={office.featured ? {} : { color: INK }}
                    >
                      {office.company}
                    </h3>

                    {/* City, State */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <MapPin className="w-4 h-4 shrink-0" style={{ color: CORAL }} />
                      <span
                        className={`text-sm font-semibold ${office.featured ? 'text-white' : ''}`}
                        style={office.featured ? {} : { color: INK }}
                      >
                        {office.city}, {office.state}
                      </span>
                    </div>

                    {/* Address */}
                    <p className={`text-xs leading-relaxed mb-4 ${office.featured ? 'text-white/60' : 'text-slate-500'}`}>
                      {office.address}
                    </p>

                    {/* Phones */}
                    {office.phones.length > 0 && (
                      <div className="space-y-1 mb-3">
                        {office.phones.map(p => (
                          <a
                            key={p}
                            href={telLink(p)}
                            className={`flex items-center gap-2 text-xs transition-colors ${office.featured ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-[#1A1A2E]'}`}
                          >
                            <Phone className="w-3 h-3 shrink-0" style={{ color: CORAL }} />
                            {p}
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Emails */}
                    {office.emails.length > 0 && (
                      <div className="space-y-1">
                        {office.emails.map(em => (
                          <a
                            key={em}
                            href={`mailto:${em}`}
                            className={`flex items-center gap-2 text-xs transition-colors break-all ${office.featured ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-[#1A1A2E]'}`}
                          >
                            <Mail className="w-3 h-3 shrink-0" style={{ color: CORAL }} />
                            {em}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CLOSING CTA — minimal
          ════════════════════════════════════════════════════════ */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-20 md:py-28 text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="w-8 h-[2px]" style={{ background: CORAL }} />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
                Ready When You Are
              </span>
              <span className="w-8 h-[2px]" style={{ background: CORAL }} />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-5 leading-tight" style={{ color: INK }}>
              Let&apos;s Start a Conversation
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Whether it&apos;s a turnkey EPC project or a single panel —
              we&apos;re here to help you power it forward.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 py-6 text-base font-semibold border-2 transition-all duration-300 group hover:text-white"
              style={{ borderColor: CORAL, color: CORAL }}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const el = document.getElementById('enquiry-form')
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLButtonElement).style.background = CORAL
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              }}
            >
              Send an Enquiry
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Reusable form field components (clean, minimal, accessible)
   ════════════════════════════════════════════════════════════ */

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  multiline,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  required?: boolean
  multiline?: boolean
}) {
  const baseClass =
    'w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-[#1A1A2E] placeholder:text-slate-400 transition-colors focus:border-[#1A1A2E] focus:outline-none focus:ring-0'
  return (
    <div>
      <label className="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">
        {label}
        {required && <span className="ml-0.5" style={{ color: CORAL }}>*</span>}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={4}
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={baseClass}
        />
      )}
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-[#1A1A2E] transition-colors focus:border-[#1A1A2E] focus:outline-none focus:ring-0"
      >
        <option value="">{placeholder || 'Select…'}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}
