'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageCircle, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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

/* ─── Contact Info ─── */
const contactInfo = [
  { icon: Phone, label: 'Phone', value: '+91 9941905833', href: 'tel:+919941905833', color: 'bg-[#efefef]/10 text-[#efefef]' },
  { icon: Mail, label: 'Email', value: 'srivaari@gmail.com', href: 'mailto:srivaari@gmail.com', color: 'bg-sky-100 text-sky-600' },
  { icon: MapPin, label: 'Address', value: 'Chennai, Tamil Nadu, India', href: null, color: 'bg-rose-100 text-rose-600' },
  { icon: Clock, label: 'Business Hours', value: 'Mon–Sat: 9:30 AM – 6:30 PM', href: null, color: 'bg-amber-100 text-amber-600' },
]

/* ─── Office Locations ─── */
const offices = [
  {
    title: 'Chennai HQ',
    address: 'Chennai, Tamil Nadu, India',
    phone: '+91 9941905833',
    email: 'srivaari@gmail.com',
    hours: 'Mon–Sat: 9:30 AM – 6:30 PM',
    accent: 'from-[#efefef] to-[#d4d4d4]',
  },
  {
    title: 'Regional Office',
    address: 'Coimbatore, Tamil Nadu, India',
    phone: '+91 9941905833',
    email: 'srivaari@gmail.com',
    hours: 'Mon–Sat: 9:30 AM – 6:30 PM',
    accent: 'from-[#E8751A] to-[#F59E3B]',
  },
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
          HERO — Split Navy + Connection Pattern
      ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[340px] md:min-h-[400px]">
          {/* Left: Navy side */}
          <div className="relative flex items-center" style={{ background: 'linear-gradient(160deg, #efefef 0%, #efefef 100%)' }}>
            <div className="relative z-10 px-6 md:px-12 py-16 md:py-20 pt-[100px] md:pt-20">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <div className="flex items-center gap-2 text-sm mb-6">
                  <button onClick={() => navigate('home')} className="text-white/50 hover:text-white/80 transition-colors">Home</button>
                  <ChevronRight className="w-3.5 h-3.5 text-white/25" />
                  <span className="text-[#E8751A] font-medium">Contact</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                  Let&apos;s Start a<br />
                  <span className="text-[#E8751A]">Conversation</span>
                </h1>
                <p className="text-white/50 text-sm md:text-base max-w-sm">
                  Have a project in mind or need expert advice? We&apos;d love to hear from you.
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
          <div className="hidden md:flex items-center justify-center relative" style={{ background: 'linear-gradient(160deg, #d4d4d4 0%, #3A6090 100%)' }}>
            <svg width="340" height="340" viewBox="0 0 340 340" fill="none" className="opacity-20">
              {/* Connection nodes and lines */}
              <circle cx="170" cy="170" r="8" fill="#E8751A" />
              <circle cx="80" cy="80" r="6" fill="white" />
              <circle cx="260" cy="80" r="6" fill="white" />
              <circle cx="80" cy="260" r="6" fill="white" />
              <circle cx="260" cy="260" r="6" fill="white" />
              <circle cx="170" cy="50" r="4" fill="white" />
              <circle cx="170" cy="290" r="4" fill="white" />
              <circle cx="50" cy="170" r="4" fill="white" />
              <circle cx="290" cy="170" r="4" fill="white" />
              <line x1="170" y1="170" x2="80" y2="80" stroke="white" strokeWidth="1.5" />
              <line x1="170" y1="170" x2="260" y2="80" stroke="white" strokeWidth="1.5" />
              <line x1="170" y1="170" x2="80" y2="260" stroke="white" strokeWidth="1.5" />
              <line x1="170" y1="170" x2="260" y2="260" stroke="white" strokeWidth="1.5" />
              <line x1="170" y1="170" x2="170" y2="50" stroke="white" strokeWidth="1" />
              <line x1="170" y1="170" x2="170" y2="290" stroke="white" strokeWidth="1" />
              <line x1="170" y1="170" x2="50" y2="170" stroke="white" strokeWidth="1" />
              <line x1="170" y1="170" x2="290" y2="170" stroke="white" strokeWidth="1" />
              {/* Outer ring */}
              <circle cx="170" cy="170" r="100" stroke="white" strokeWidth="0.75" strokeDasharray="6 4" />
              <circle cx="170" cy="170" r="140" stroke="white" strokeWidth="0.5" strokeDasharray="3 6" />
            </svg>
            {/* Floating connection text */}
            <div className="absolute bottom-8 right-8 text-white/30 text-sm tracking-widest uppercase">Connect</div>
          </div>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0 40V20C360 0 720 0 1080 20C1260 30 1350 35 1440 40H0Z" fill="#F7F9FC" /></svg>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CONTACT FORM + INFO
      ════════════════════════════════════════════ */}
      <section className="bg-[#F7F9FC] py-14 md:py-20">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* ─── Form ─── */}
            <div className="lg:col-span-3">
              <FadeIn>
                <Card className="bg-white rounded-2xl border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    {/* Form header accent */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-[#efefef] via-[#E8751A] to-[#efefef]" />

                    <div className="p-6 md:p-10">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageCircle className="w-5 h-5 text-[#E8751A]" />
                        <span className="text-[#E8751A] text-sm font-semibold uppercase tracking-wider">Get in Touch</span>
                      </div>
                      <h2 className="text-2xl md:text-[28px] font-bold text-[#1A1A2E] mb-2">Send Us a Message</h2>
                      <p className="text-[#4B5563] text-sm mb-8">Fill out the form below and our team will get back to you within 24 hours.</p>

                      {/* Success animation */}
                      <AnimatePresence>
                        {success && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="flex items-center gap-3 bg-[#efefef]/5 border border-[#5A7EA8] text-[#efefef] px-5 py-4 rounded-xl mb-8"
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
                              <p className="text-sm text-[#efefef]">We&apos;ll get back to you soon.</p>
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
                          <FloatingField id="name" label="Name" icon={MapPin} required placeholder="Your full name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
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
                        <p className="text-sm text-[#9CA3AF] mb-0.5 font-medium uppercase tracking-wider">{item.label}</p>
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

              {/* Map Section */}
              <FadeIn delay={0.32}>
                <Card className="rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
                  <div className="relative h-52 bg-gradient-to-br from-[#F0F4F8] to-[#E2E8F0]">
                    {/* Decorative grid pattern */}
                    <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, #efefef 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    {/* Center pin */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        >
                          <div className="w-12 h-12 rounded-full bg-[#efefef] flex items-center justify-center mx-auto shadow-lg shadow-[#efefef]/30">
                            <MapPin className="w-5 h-5 text-white" />
                          </div>
                          <div className="w-3 h-3 bg-[#E8751A] rounded-full mx-auto mt-1" />
                        </motion.div>
                        <p className="text-sm font-bold text-[#1A1A2E] mt-3">Visit Us</p>
                        <p className="text-sm text-[#4B5563]">Chennai, Tamil Nadu, India</p>
                      </div>
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
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="text-[#E8751A] text-sm font-semibold uppercase tracking-wider">Our Offices</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] mt-2">Where to Find Us</h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offices.map((office, i) => (
              <FadeIn key={office.title} delay={i * 0.1}>
                <Card className="overflow-hidden rounded-2xl border-0 shadow-md group hover:shadow-xl transition-shadow duration-300">
                  {/* Top accent bar */}
                  <div className={`h-2 bg-gradient-to-r ${office.accent}`} />
                  <CardContent className="p-6 md:p-8">
                    <h3 className="text-xl font-bold text-[#1A1A2E] mb-4">{office.title}</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[#9CA3AF] mt-0.5 shrink-0" />
                        <span className="text-sm text-[#4B5563]">{office.address}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-[#9CA3AF] mt-0.5 shrink-0" />
                        <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="text-sm text-[#4B5563] hover:text-[#E8751A] transition-colors">{office.phone}</a>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-[#9CA3AF] mt-0.5 shrink-0" />
                        <a href={`mailto:${office.email}`} className="text-sm text-[#4B5563] hover:text-[#E8751A] transition-colors">{office.email}</a>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-[#9CA3AF] mt-0.5 shrink-0" />
                        <span className="text-sm text-[#4B5563]">{office.hours}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          QUICK CONTACT BAR
      ════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-[#efefef] to-[#d4d4d4] py-8">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
              <span className="text-white/70 text-sm font-medium">Quick Contact:</span>
              <div className="flex items-center gap-4 sm:gap-6">
                <a href="tel:+919941905833" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Call Us</span>
                </a>
                <a href="mailto:srivaari@gmail.com" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
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
