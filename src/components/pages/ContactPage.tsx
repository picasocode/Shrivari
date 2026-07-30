'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageCircle, ChevronRight,
  Globe, Building2, Navigation, Printer, Sparkles, Network,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from '@/components/Router'
import { submitContact } from '@/lib/api'

/* ─── Fade-in observer ─── */
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Floating Label Input ─── */
function FloatingField({
  id, label, type = 'text', icon: Icon, required, placeholder, value, onChange, multiline = false,
}: {
  id: string; label: string; type?: string; icon: React.ElementType; required?: boolean
  placeholder: string; value: string; onChange: (v: string) => void; multiline?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const isActive = focused || value.length > 0
  const shared = 'w-full bg-transparent border-0 outline-none text-[#1A1A2E] placeholder:text-transparent pt-5 pb-2 px-4 pl-12 text-sm'
  return (
    <div className="relative group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isActive ? 'text-[#E8751A]' : 'text-[#9CA3AF]'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <label
        htmlFor={id}
        className={`absolute left-12 transition-all duration-200 pointer-events-none ${
          isActive
            ? 'top-1.5 text-[11px] font-semibold text-[#E8751A]'
            : 'top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]'
        }`}
      >
        {label}{required && <span className="text-[#E8751A] ml-0.5">*</span>}
      </label>
      {multiline ? (
        <Textarea
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          rows={4}
          className={`${shared} !pl-12 resize-none rounded-xl border-2 ${focused ? 'border-[#E8751A]/40' : 'border-[#E5E7EB]'} focus:border-[#E8751A]/60 focus:ring-0 transition-colors`}
        />
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          className={`${shared} h-14 rounded-xl border-2 ${focused ? 'border-[#E8751A]/40' : 'border-[#E5E7EB]'} focus:border-[#E8751A]/60 focus:ring-0 transition-colors`}
        />
      )}
      <div className={`absolute bottom-0 left-0 h-0.5 bg-[#E8751A] transition-all duration-300 rounded-full ${focused ? 'w-full' : 'w-0'}`} />
    </div>
  )
}

/* ─── Phone formatting helper ─── */
function telLink(phone: string): string {
  const cleaned = phone.replace(/[\s\-]/g, '')
  if (cleaned.startsWith('+')) return `tel:${cleaned}`
  if (cleaned.startsWith('044') || cleaned.startsWith('0413')) return `tel:+91${cleaned}`
  if (cleaned.length === 10) return `tel:+91${cleaned}`
  return `tel:${cleaned}`
}

/* ─── Quick Contact Cards ─── */
const quickContacts = [
  {
    icon: Phone,
    label: 'Call Us',
    value: '044 2250 0241',
    sub: '044 4357 5635',
    href: 'tel:+914422500241',
    accent: 'bg-[#1B3A5C]/10 text-[#1B3A5C]',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'enquiries@',
    sub: 'shrivaarielectricals.com',
    href: 'mailto:enquiries@shrivaarielectricals.com',
    accent: 'bg-[#E8751A]/10 text-[#E8751A]',
  },
  {
    icon: Globe,
    label: 'Website',
    value: 'www.shrivaari',
    sub: 'electricals.com',
    href: 'https://www.shrivaarielectricals.com',
    accent: 'bg-[#1B3A5C]/10 text-[#1B3A5C]',
  },
  {
    icon: Clock,
    label: 'Business Hours',
    value: 'Mon – Sat',
    sub: '9:30 AM – 6:30 PM',
    href: null,
    accent: 'bg-[#E8751A]/10 text-[#E8751A]',
  },
]

/* ─── Contact Info (sidebar) ─── */
const contactInfo = [
  { icon: Phone, label: 'Phone', value: '+91 99419 05833', href: 'tel:+919941905833', color: 'bg-[#1B3A5C]/10 text-[#1B3A5C]' },
  { icon: Mail, label: 'Email', value: 'enquiries@shrivaarielectricals.com', href: 'mailto:enquiries@shrivaarielectricals.com', color: 'bg-[#E8751A]/10 text-[#E8751A]' },
  { icon: MapPin, label: 'Head Office', value: 'Guindy, Chennai, Tamil Nadu', href: null, color: 'bg-[#1B3A5C]/10 text-[#1B3A5C]' },
  { icon: Clock, label: 'Business Hours', value: 'Mon–Sat: 9:30 AM – 6:30 PM', href: null, color: 'bg-[#E8751A]/10 text-[#E8751A]' },
]

/* ─── Office Locations ─── */
interface Office {
  id: string
  label: string
  company: string
  address: string
  city: string
  state: string
  phones: string[]
  emails: string[]
  website?: string
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
    website: 'www.shrivaarielectricals.com',
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
    address: '2nd Floor, #690, 11th Main Road B, 2nd Block, Rajaji Nagar, Next to Variar Bakery, Bangalore – 560 010',
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
    address: '#2, ECR Main Road, Ground Floor (Opp. Kokku Park Signal), Lawspet, Puducherry – 605 008',
    city: 'Puducherry',
    state: 'Puducherry',
    phones: ['0413 2256 174', '98439 29232'],
    emails: ['srivaari.pdy@gmail.com'],
  },
  {
    id: 'hosur',
    label: 'Regional Office',
    company: 'Sri Vaari Electricals Pvt. Ltd.',
    address: '#315, 1st Floor, Mahalakshmi Tower (Opp. to TNEB), Rayakottai Road, Hosur – 635 109',
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

/* ─── Corporate Office ─── */
const CORPORATE = {
  company: 'Shri Vaari Electricals Private Limited',
  address: 'C-37, Thiru-Vi-Ka Industrial Estate, Guindy – 600 032, Chennai, Tamil Nadu',
  phones: ['044 2250 0241', '044 2250 0913', '044 4350 2914', '044 4357 5635', '+91 99419 05833'],
  email: 'enquiries@shrivaarielectricals.com',
  website: 'www.shrivaarielectricals.com',
}

/* ─── States Covered ─── */
const STATES = [
  { name: 'Tamil Nadu', offices: 3, cities: 'Chennai, Hosur, Chettipedu' },
  { name: 'Telangana', offices: 1, cities: 'Hyderabad' },
  { name: 'Karnataka', offices: 1, cities: 'Bangalore' },
  { name: 'Kerala', offices: 1, cities: 'Thiruvananthapuram' },
  { name: 'Puducherry', offices: 1, cities: 'Puducherry' },
  { name: 'Goa', offices: 1, cities: 'Mapusa' },
]

export default function ContactPage() {
  const { navigate } = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await submitContact({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        subject: form.subject || undefined,
        message: form.message,
      })
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setSuccess(false), 6000)
    } catch {
      setError('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* ════════════════════════════════════════════
          HERO — Navy split with connection pattern
      ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[380px] md:min-h-[440px]">
          {/* Left: Navy side */}
          <div className="relative flex items-center" style={{ background: 'linear-gradient(160deg, #1B3A5C 0%, #152D4F 100%)' }}>
            <div className="relative z-10 px-6 md:px-12 py-16 md:py-20 pt-[110px] md:pt-24">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <div className="flex items-center gap-2 text-sm mb-6">
                  <button onClick={() => navigate('home')} className="text-white/50 hover:text-white/80 transition-colors">Home</button>
                  <ChevronRight className="w-3.5 h-3.5 text-white/25" />
                  <span className="text-[#E8751A] font-medium">Contact</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8751A]/15 border border-[#E8751A]/30 mb-5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E8751A]" />
                  <span className="text-xs font-bold tracking-[0.2em] text-[#E8751A] uppercase">Contact Us</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
                  Let&apos;s Build{' '}
                  <span className="text-[#E8751A]">Together</span>
                </h1>
                <p className="text-white/60 text-sm md:text-base max-w-md leading-relaxed">
                  Get in touch with our engineering and project execution team for electrical EPC solutions, substations, industrial electrification, panel manufacturing, testing &amp; commissioning, and utility coordination services.
                </p>
              </motion.div>
            </div>
            {/* Decorative dot grid */}
            <div className="absolute top-8 right-8 grid grid-cols-4 gap-3 opacity-10">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white" />
              ))}
            </div>
          </div>

          {/* Right: Abstract connection pattern */}
          <div className="hidden md:flex items-center justify-center relative" style={{ background: 'linear-gradient(160deg, #152D4F 0%, #3A6090 100%)' }}>
            <svg width="360" height="360" viewBox="0 0 360 360" fill="none" className="opacity-25">
              {/* Connection nodes and lines */}
              <circle cx="180" cy="180" r="10" fill="#E8751A" />
              <circle cx="80" cy="80" r="7" fill="white" />
              <circle cx="280" cy="80" r="7" fill="white" />
              <circle cx="80" cy="280" r="7" fill="white" />
              <circle cx="280" cy="280" r="7" fill="white" />
              <circle cx="180" cy="50" r="5" fill="white" />
              <circle cx="180" cy="310" r="5" fill="white" />
              <circle cx="50" cy="180" r="5" fill="white" />
              <circle cx="310" cy="180" r="5" fill="white" />
              <line x1="180" y1="180" x2="80" y2="80" stroke="white" strokeWidth="1.5" />
              <line x1="180" y1="180" x2="280" y2="80" stroke="white" strokeWidth="1.5" />
              <line x1="180" y1="180" x2="80" y2="280" stroke="white" strokeWidth="1.5" />
              <line x1="180" y1="180" x2="280" y2="280" stroke="white" strokeWidth="1.5" />
              <line x1="180" y1="180" x2="180" y2="50" stroke="white" strokeWidth="1" />
              <line x1="180" y1="180" x2="180" y2="310" stroke="white" strokeWidth="1" />
              <line x1="180" y1="180" x2="50" y2="180" stroke="white" strokeWidth="1" />
              <line x1="180" y1="180" x2="310" y2="180" stroke="white" strokeWidth="1" />
              {/* Outer rings */}
              <circle cx="180" cy="180" r="110" stroke="white" strokeWidth="0.75" strokeDasharray="6 4" />
              <circle cx="180" cy="180" r="150" stroke="white" strokeWidth="0.5" strokeDasharray="3 6" />
              {/* Pulsing center */}
              <motion.circle
                cx="180" cy="180" r="10"
                fill="none" stroke="#E8751A" strokeWidth="2"
                animate={{ r: [10, 40, 10], opacity: [0.8, 0, 0.8] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute bottom-8 right-8 text-white/30 text-xs tracking-widest uppercase">Connect</div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-[#0D1D3A]/80 backdrop-blur-sm">
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '8', label: 'Offices' },
                { value: '6', label: 'States' },
                { value: '29+', label: 'Years' },
                { value: 'Pan-India', label: 'Presence' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                  className="text-center md:text-left"
                >
                  <div className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          QUICK CONTACT CARDS
      ════════════════════════════════════════════ */}
      <section className="bg-[#F7F9FC] py-10 md:py-12">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickContacts.map((item, i) => (
              <FadeIn key={item.label} delay={i * 0.08}>
                {item.href ? (
                  <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block">
                    <Card className="group bg-white rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                      <CardContent className="p-5 flex flex-col items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.accent} group-hover:scale-110 transition-transform duration-300`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="w-full">
                          <p className="text-xs text-[#9CA3AF] mb-1 font-medium uppercase tracking-wider">{item.label}</p>
                          <p className="text-[#1A1A2E] font-bold text-sm leading-tight">{item.value}</p>
                          <p className="text-[#1A1A2E] font-bold text-sm leading-tight">{item.sub}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ) : (
                  <Card className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm h-full">
                    <CardContent className="p-5 flex flex-col items-start gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.accent}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="w-full">
                        <p className="text-xs text-[#9CA3AF] mb-1 font-medium uppercase tracking-wider">{item.label}</p>
                        <p className="text-[#1A1A2E] font-bold text-sm leading-tight">{item.value}</p>
                        <p className="text-[#1A1A2E] font-bold text-sm leading-tight">{item.sub}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CONTACT FORM + INFO
      ════════════════════════════════════════════ */}
      <section className="bg-[#F7F9FC] pb-14 md:pb-20">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* ─── Form ─── */}
            <div className="lg:col-span-3">
              <FadeIn>
                <Card className="bg-white rounded-2xl border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    {/* Form header accent */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-[#1B3A5C] via-[#E8751A] to-[#1B3A5C]" />

                    <div className="p-6 md:p-10">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageCircle className="w-5 h-5 text-[#E8751A]" />
                        <span className="text-[#E8751A] text-sm font-semibold uppercase tracking-wider">Get in Touch</span>
                      </div>
                      <h2 className="text-2xl md:text-[28px] font-bold text-[#1A1A2E] mb-2">Send Us a Message</h2>
                      <p className="text-[#6B7280] text-sm mb-8">Fill out the form below and our team will get back to you within 24 hours.</p>

                      {/* Success animation */}
                      <AnimatePresence>
                        {success && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="flex items-center gap-3 bg-[#1B3A5C]/5 border border-[#5A7EA8] text-[#1B3A5C] px-5 py-4 rounded-xl mb-8"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
                            >
                              <CheckCircle className="w-6 h-6" />
                            </motion.div>
                            <div>
                              <p className="font-semibold text-sm">Message sent successfully!</p>
                              <p className="text-xs text-[#1B3A5C]">We&apos;ll get back to you soon.</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl mb-8 text-sm">
                          {error}
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FloatingField id="name" label="Name" icon={Navigation} required placeholder="Your full name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
                          <FloatingField id="email" label="Email" icon={Mail} type="email" required placeholder="you@example.com" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FloatingField id="phone" label="Phone" icon={Phone} placeholder="+91 98765 43210" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
                          <FloatingField id="subject" label="Subject" icon={MessageCircle} placeholder="How can we help?" value={form.subject} onChange={v => setForm(f => ({ ...f, subject: v }))} />
                        </div>
                        <FloatingField id="message" label="Message" icon={Send} required multiline placeholder="Tell us about your project..." value={form.message} onChange={v => setForm(f => ({ ...f, message: v }))} />

                        <Button
                          type="submit"
                          disabled={submitting}
                          className="w-full md:w-auto relative overflow-hidden bg-gradient-to-r from-[#E8751A] to-[#F59E3B] hover:from-[#D4691A] hover:to-[#E89030] text-white rounded-xl px-8 h-12 font-semibold text-sm shadow-lg shadow-[#E8751A]/20 transition-all hover:shadow-xl hover:shadow-[#E8751A]/30"
                        >
                          {submitting ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                              Sending...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Send className="w-4 h-4" />
                              Send Message
                            </span>
                          )}
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>

            {/* ─── Contact Info Cards ─── */}
            <div className="lg:col-span-2 space-y-4">
              {contactInfo.map((item, i) => (
                <FadeIn key={item.label} delay={i * 0.08}>
                  <Card className="group bg-white rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#9CA3AF] mb-0.5 font-medium uppercase tracking-wider">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-[#1A1A2E] font-semibold text-sm hover:text-[#E8751A] transition-colors truncate block">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-[#1A1A2E] font-semibold text-sm truncate">{item.value}</p>
                        )}
                      </div>
                      {item.href && (
                        <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#E8751A] transition-colors shrink-0" />
                      )}
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}

              {/* Quick action card */}
              <FadeIn delay={0.32}>
                <Card className="rounded-xl border-0 overflow-hidden shadow-sm" >
                  <div className="bg-gradient-to-br from-[#1B3A5C] to-[#152D4F] p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-5 h-5 text-[#E8751A]" />
                      <span className="text-white font-bold text-sm">Head Office</span>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mb-4">
                      Shri Vaari Electricals Private Limited<br />
                      C-37, Thiru-Vi-Ka Industrial Estate,<br />
                      Guindy – 600 032, Chennai
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a href="tel:+914422500241" className="inline-flex items-center gap-1.5 bg-[#E8751A] hover:bg-[#D4691A] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                      <a href="mailto:enquiries@shrivaarielectricals.com" className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
                        <Mail className="w-3.5 h-3.5" /> Email
                      </a>
                    </div>
                  </div>
                </Card>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          OFFICE LOCATIONS
      ════════════════════════════════════════════ */}
      <section className="bg-white py-14 md:py-20 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #1B3A5C 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8751A]/10 border border-[#E8751A]/25 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8751A]" />
                <span className="text-xs font-bold tracking-[0.2em] text-[#E8751A] uppercase">Our Offices</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-[#1A1A2E] mb-3">
                Pan-India <span className="text-[#E8751A]">Presence</span>
              </h2>
              <p className="text-[#6B7280] text-sm md:text-base max-w-2xl mx-auto">
                Strategically located offices across India to serve our clients with proximity and responsiveness.
              </p>
            </div>
          </FadeIn>

          {/* Office grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {OFFICES.map((office, i) => (
              <FadeIn key={office.id} delay={(i % 4) * 0.08}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`relative h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 ${
                    office.featured
                      ? 'sm:col-span-2 lg:col-span-2 bg-gradient-to-br from-[#1B3A5C] to-[#152D4F] border border-[#1B3A5C]'
                      : 'bg-white border border-[#E5E7EB] hover:border-[#E8751A]/30'
                  }`}
                >
                  {/* Top accent bar */}
                  <div className={`h-1.5 ${office.featured ? 'bg-gradient-to-r from-[#E8751A] to-[#F59E3B]' : 'bg-gradient-to-r from-[#E8751A] to-[#E8751A]/40'}`} />

                  <div className="p-6">
                    {/* Label badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        office.featured
                          ? 'bg-[#E8751A] text-white'
                          : 'bg-[#E8751A]/10 text-[#E8751A]'
                      }`}>
                        <Building2 className="w-3 h-3" />
                        {office.label}
                      </span>
                      {office.featured && (
                        <span className="text-white/30 text-xs font-medium">{office.state}</span>
                      )}
                    </div>

                    {/* Company name */}
                    <h3 className={`font-bold text-base mb-1 leading-tight ${office.featured ? 'text-white' : 'text-[#1A1A2E]'}`}>
                      {office.company}
                    </h3>

                    {/* City, State */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <MapPin className={`w-4 h-4 shrink-0 ${office.featured ? 'text-[#E8751A]' : 'text-[#E8751A]'}`} />
                      <span className={`text-sm font-semibold ${office.featured ? 'text-white' : 'text-[#1A1A2E]'}`}>
                        {office.city}, {office.state}
                      </span>
                    </div>

                    {/* Address */}
                    <p className={`text-xs leading-relaxed mb-4 ${office.featured ? 'text-white/60' : 'text-[#6B7280]'}`}>
                      {office.address}
                    </p>

                    {/* Divider */}
                    <div className={`border-t mb-3 ${office.featured ? 'border-white/10' : 'border-[#E5E7EB]'}`} />

                    {/* Phones */}
                    <div className="space-y-1.5 mb-3">
                      {office.phones.map((phone, idx) => (
                        <a
                          key={idx}
                          href={telLink(phone)}
                          className={`flex items-center gap-2 text-xs transition-colors group/phone ${
                            office.featured ? 'text-white/70 hover:text-[#E8751A]' : 'text-[#4B5563] hover:text-[#E8751A]'
                          }`}
                        >
                          <Phone className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover/phone:opacity-100 transition-opacity" />
                          <span className="font-medium">{phone}</span>
                        </a>
                      ))}
                    </div>

                    {/* Emails */}
                    {office.emails.length > 0 && (
                      <div className="space-y-1.5 mb-3">
                        {office.emails.map((email, idx) => (
                          <a
                            key={idx}
                            href={`mailto:${email}`}
                            className={`flex items-start gap-2 text-xs transition-colors group/email break-all ${
                              office.featured ? 'text-white/70 hover:text-[#E8751A]' : 'text-[#4B5563] hover:text-[#E8751A]'
                            }`}
                          >
                            <Mail className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-60 group-hover/email:opacity-100 transition-opacity" />
                            <span className="font-medium">{email}</span>
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Website */}
                    {office.website && (
                      <a
                        href={`https://${office.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 text-xs transition-colors group/web ${
                          office.featured ? 'text-white/70 hover:text-[#E8751A]' : 'text-[#4B5563] hover:text-[#E8751A]'
                        }`}
                      >
                        <Globe className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover/web:opacity-100 transition-opacity" />
                        <span className="font-medium">{office.website}</span>
                      </a>
                    )}

                    {/* Featured decorative element */}
                    {office.featured && (
                      <div className="absolute top-6 right-6 hidden md:block">
                        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
                          <Network className="w-7 h-7 text-[#E8751A]/60" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom coral accent on hover */}
                  <div className="absolute bottom-0 left-0 h-0.5 bg-[#E8751A] w-0 group-hover:w-full transition-all duration-500" />
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CORPORATE OFFICE BANNER
      ════════════════════════════════════════════ */}
      <section className="relative py-16 md:py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B3A5C 0%, #152D4F 50%, #0D1D3A 100%)' }}>
        {/* Ambient coral glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 70%)' }}
        />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 70%)' }}
        />

        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* Left — Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8751A]/15 border border-[#E8751A]/30 mb-5">
                  <Building2 className="w-3.5 h-3.5 text-[#E8751A]" />
                  <span className="text-xs font-bold tracking-[0.2em] text-[#E8751A] uppercase">Corporate Office</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
                  Shri Vaari Electricals<br />
                  <span className="text-[#E8751A]">Private Limited</span>
                </h2>
                <div className="flex items-start gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-[#E8751A] mt-0.5 shrink-0" />
                  <p className="text-white/70 text-sm md:text-base leading-relaxed">
                    {CORPORATE.address}
                  </p>
                </div>

                {/* Quick actions */}
                <div className="flex flex-wrap gap-3">
                  <a href={`tel:${CORPORATE.phones[0].replace(/[\s\-+]/g, '')}`} className="inline-flex items-center gap-2 bg-[#E8751A] hover:bg-[#D4691A] text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm shadow-lg shadow-[#E8751A]/25">
                    <Phone className="w-4 h-4" /> Call Now
                  </a>
                  <a href={`mailto:${CORPORATE.email}`} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm">
                    <Mail className="w-4 h-4" /> Email Us
                  </a>
                </div>
              </div>

              {/* Right — Contact details card */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
                <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-[#E8751A]" />
                  Contact Details
                </h3>

                {/* Phone numbers */}
                <div className="mb-5">
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Phone</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CORPORATE.phones.map((phone, i) => (
                      <a
                        key={i}
                        href={telLink(phone)}
                        className="flex items-center gap-2 text-white/80 hover:text-[#E8751A] transition-colors text-sm group"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#E8751A]/60 group-hover:text-[#E8751A]" />
                        <span className="font-medium">{phone}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div className="mb-5">
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Email</p>
                  <a href={`mailto:${CORPORATE.email}`} className="flex items-center gap-2 text-white/80 hover:text-[#E8751A] transition-colors text-sm group break-all">
                    <Mail className="w-3.5 h-3.5 text-[#E8751A]/60 group-hover:text-[#E8751A] shrink-0" />
                    <span className="font-medium">{CORPORATE.email}</span>
                  </a>
                </div>

                {/* Website */}
                <div>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Website</p>
                  <a href={`https://${CORPORATE.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/80 hover:text-[#E8751A] transition-colors text-sm group">
                    <Globe className="w-3.5 h-3.5 text-[#E8751A]/60 group-hover:text-[#E8751A]" />
                    <span className="font-medium">{CORPORATE.website}</span>
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          STATES COVERED STRIP
      ════════════════════════════════════════════ */}
      <section className="bg-[#F7F9FC] py-14 md:py-16">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B3A5C]/10 border border-[#1B3A5C]/20 mb-4">
                <Navigation className="w-3.5 h-3.5 text-[#1B3A5C]" />
                <span className="text-xs font-bold tracking-[0.2em] text-[#1B3A5C] uppercase">Our Reach</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] mb-2">
                Serving Across <span className="text-[#E8751A]">India</span>
              </h2>
              <p className="text-[#6B7280] text-sm max-w-xl mx-auto">
                Our regional offices ensure dedicated support and rapid response across multiple states.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STATES.map((state, i) => (
              <FadeIn key={state.name} delay={(i % 6) * 0.06}>
                <div className="group bg-white rounded-xl border border-[#E5E7EB] p-5 text-center hover:border-[#E8751A]/30 hover:shadow-md transition-all duration-300 h-full">
                  <div className="w-10 h-10 rounded-full bg-[#E8751A]/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#E8751A] transition-colors duration-300">
                    <MapPin className="w-5 h-5 text-[#E8751A] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-[#1A1A2E] font-bold text-sm mb-1">{state.name}</h3>
                  <p className="text-[#E8751A] font-bold text-lg">{state.offices}</p>
                  <p className="text-[#9CA3AF] text-[11px] mt-1">{state.offices === 1 ? 'Office' : 'Offices'}</p>
                  <p className="text-[#6B7280] text-[11px] mt-2 leading-tight">{state.cities}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          QUICK CONTACT BAR
      ════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-[#1B3A5C] to-[#152D4F] py-8">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
              <span className="text-white/70 text-sm font-medium">Quick Contact:</span>
              <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
                <a href="tel:+914422500241" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Call Us</span>
                </a>
                <a href="mailto:enquiries@shrivaarielectricals.com" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Email Us</span>
                </a>
                <a href="https://wa.me/919941905833" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">WhatsApp</span>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
