'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Phone, Mail, MapPin, Send, CheckCircle, ChevronRight,
  Building2, Factory,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/components/Router'
import { submitContact } from '@/lib/api'

/* ────────────────────────────────────────────────────────────
   Design tokens
   ──────────────────────────────────────────────────────────── */
const INK = '#1A1A2E'
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
   Offices — single source of truth (uniform cards, no images)
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
  kind: 'head' | 'regional' | 'manufacturing'
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
    kind: 'head',
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
    kind: 'regional',
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
    kind: 'regional',
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
    kind: 'regional',
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
    kind: 'regional',
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
    kind: 'regional',
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
    kind: 'regional',
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
    kind: 'manufacturing',
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
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-[100px] pb-12 md:pb-16">
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
          ENQUIRY FORM — centered, focused, full attention
          ════════════════════════════════════════════════════════ */}
      <section id="enquiry-form" className="bg-white pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 md:p-12">
              {/* Header */}
              <div className="mb-8 md:mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-[2px]" style={{ background: CORAL }} />
                  <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-slate-500">
                    Enquiry Form
                  </span>
                </div>
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
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          OUR OFFICES — clean directory list (no grid, no images)
          ════════════════════════════════════════════════════════ */}
      <section className="bg-[#F8FAFC] py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="mb-12 md:mb-14">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-[2px]" style={{ background: CORAL }} />
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-slate-500">
                  Pan-India Presence
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: INK }}>
                Our Offices
              </h2>
              <p className="text-slate-500 text-base md:text-lg max-w-2xl leading-relaxed">
                A head office, six regional branches and a dedicated manufacturing
                unit — eight locations serving projects across India.
              </p>
            </div>
          </FadeIn>

          {/* Directory list */}
          <div className="space-y-3">
            {OFFICES.map((office, i) => (
              <FadeIn key={office.id} delay={i * 0.04}>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 p-5 md:p-7"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-start">
                    {/* Identity */}
                    <div className="md:col-span-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2.5"
                        style={{
                          background:
                            office.kind === 'head'
                              ? CORAL
                              : office.kind === 'manufacturing'
                                ? 'rgba(21,45,79,0.1)'
                                : 'rgba(232,117,26,0.1)',
                          color:
                            office.kind === 'head' ? '#FFFFFF' : office.kind === 'manufacturing' ? '#152D4F' : CORAL,
                        }}
                      >
                        {office.kind === 'manufacturing' ? (
                          <Factory className="w-3 h-3" />
                        ) : (
                          <Building2 className="w-3 h-3" />
                        )}
                        {office.label}
                      </span>
                      <h3 className="font-bold text-base leading-tight" style={{ color: INK }}>
                        {office.company}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: CORAL }} />
                        <span className="text-sm font-semibold" style={{ color: INK }}>
                          {office.city}, {office.state}
                        </span>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="md:col-span-5 md:border-l md:border-slate-100 md:pl-6">
                      <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400 mb-1.5">
                        Address
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {office.address}
                      </p>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-3 md:border-l md:border-slate-100 md:pl-6">
                      {office.phones.length > 0 && (
                        <div className="mb-3">
                          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400 mb-1.5">
                            Phone
                          </p>
                          <div className="space-y-1">
                            {office.phones.map(p => (
                              <a
                                key={p}
                                href={telLink(p)}
                                className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#1A1A2E] transition-colors"
                              >
                                <Phone className="w-3 h-3 shrink-0" style={{ color: CORAL }} />
                                {p}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {office.emails.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400 mb-1.5">
                            Email
                          </p>
                          <div className="space-y-1">
                            {office.emails.map(em => (
                              <a
                                key={em}
                                href={`mailto:${em}`}
                                className="flex items-center gap-2 text-xs text-slate-600 hover:text-[#1A1A2E] transition-colors break-all"
                              >
                                <Mail className="w-3 h-3 shrink-0" style={{ color: CORAL }} />
                                {em}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
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
