'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { submitContact } from '@/lib/api'

interface FormState {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const { toast } = useToast()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!form.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      await submitContact({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        subject: form.subject || undefined,
        message: form.message,
      })
      toast({
        title: 'Message Sent!',
        description: 'Thank you for contacting us. We will get back to you soon.',
      })
      setForm(initialForm)
      setErrors({})
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 9941905833',
      href: 'tel:+919941905833',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'srivaari@gmail.com',
      href: 'mailto:srivaari@gmail.com',
    },
    {
      icon: Clock,
      label: 'Business Hours',
      value: 'Mon-Sat: 9:30am to 6:30pm',
      href: null,
    },
  ]

  return (
    <section id="contact" className="py-16 md:py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-[28px] md:text-[40px] font-semibold text-[#0D1B3E] mb-4">
            Get In Touch
          </h2>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-[#718096] text-base md:text-lg max-w-2xl mx-auto">
            Have a project in mind? We would love to hear from you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="border-none shadow-lg rounded-xl">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[#2D3748] text-sm font-medium">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={`rounded-lg ${errors.name ? 'border-red-400' : ''}`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#2D3748] text-sm font-medium">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={`rounded-lg ${errors.email ? 'border-red-400' : ''}`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#2D3748] text-sm font-medium">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="rounded-lg"
                      />
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-[#2D3748] text-sm font-medium">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[#2D3748] text-sm font-medium">
                      Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project..."
                      rows={5}
                      className={`rounded-lg resize-none ${errors.message ? 'border-red-400' : ''}`}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#2196F3] hover:bg-[#1E88E5] text-white py-6 rounded-xl text-base font-medium transition-all hover:shadow-lg hover:shadow-[#2196F3]/25"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <Card key={info.label} className="border-none shadow-md rounded-xl card-hover">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#2196F3]/10 flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-[#2196F3]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#718096] mb-0.5">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-[#0D1B3E] font-medium hover:text-[#2196F3] transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-[#0D1B3E] font-medium">{info.value}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Quick info card */}
              <Card className="border-none shadow-md rounded-xl bg-gradient-to-br from-[#0D1B3E] to-[#1a3a6e]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-[#2196F3]" />
                    <h3 className="text-white font-medium">Why Choose Us?</h3>
                  </div>
                  <ul className="space-y-2">
                    {[
                      '25+ Years of Experience',
                      'ISI Certified Products',
                      'Pan-India Presence',
                      '24/7 Customer Support',
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-white/80 text-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-[#2196F3]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
