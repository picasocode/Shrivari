'use client'

import {
  Phone, Mail, MapPin, Clock, Globe,
  Linkedin, Youtube, Facebook, Instagram, Twitter,
  ArrowRight, Award,
} from 'lucide-react'
import { useRouter, type PageName } from '@/components/Router'

const quickLinks: { label: string; page: PageName }[] = [
  { label: 'Home', page: 'home' },
  { label: 'About Us', page: 'about' },
  { label: 'Services', page: 'services' },
  { label: 'Products', page: 'products' },
  { label: 'Projects', page: 'projects' },
  { label: 'Manufacturing', page: 'manufacturing' },
  { label: 'Careers', page: 'careers' },
  { label: 'Contact', page: 'contact' },
]

const socialLinks = [
  { label: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com' },
  { label: 'YouTube', icon: Youtube, href: 'https://www.youtube.com' },
  { label: 'Facebook', icon: Facebook, href: 'https://www.facebook.com' },
  { label: 'Instagram', icon: Instagram, href: 'https://www.instagram.com' },
  { label: 'Twitter', icon: Twitter, href: 'https://www.twitter.com' },
]

export default function Footer() {
  const { navigate } = useRouter()
  return (
    <footer className="bg-[#0D1D3A] text-white">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ─── Trusted By ─── */}
          <div className="lg:col-span-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8751A]/15 border border-[#E8751A]/25 mb-4">
              <Award className="w-3.5 h-3.5 text-[#E8751A]" />
              <span className="text-xs font-bold tracking-[0.15em] text-[#E8751A] uppercase">Trusted By</span>
            </div>
            <h4 className="text-base font-bold text-white mb-3 leading-snug">
              Leading Industries &amp; Infrastructure Organizations
            </h4>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Shri Vaari Electricals has successfully partnered with leading industrial and infrastructure organizations such as{' '}
              <span className="text-[#E8751A] font-semibold">SCHNEIDER ELECTRIC</span>{' '}
              by delivering reliable, safe, and high-performance electrical engineering solutions.
            </p>
            <img src="/images/logo.png" alt="Shri Vaari Electricals" className="h-9 w-auto object-contain mt-2" />
          </div>

          {/* ─── Quick Links ─── */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white/90">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(l => (
                <li key={l.page}>
                  <button
                    onClick={() => navigate(l.page)}
                    className="group flex items-center gap-2 text-white/50 hover:text-[#E8751A] text-sm transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Contact Information ─── */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white/90">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E8751A] mt-0.5 shrink-0" />
                <div className="text-white/60 text-sm leading-relaxed">
                  <p className="font-semibold text-white/80">Shri Vaari Electricals Private Limited</p>
                  <p>C-37, Thiru-Vi-Ka Industrial Estate,</p>
                  <p>Guindy – 600 032</p>
                  <p>Chennai, Tamil Nadu</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#E8751A] mt-0.5 shrink-0" />
                <a href="tel:+914422500241" className="text-white/60 hover:text-[#E8751A] text-sm transition-colors">
                  044 2250 0241 / 250 913 / 4350 2914
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#E8751A] mt-0.5 shrink-0" />
                <a href="mailto:enquiries@shrivaarielectricals.com" className="text-white/60 hover:text-[#E8751A] text-sm transition-colors break-all">
                  enquiries@shrivaarielectricals.com
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-[#E8751A] mt-0.5 shrink-0" />
                <a href="https://www.shrivaarielectricals.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#E8751A] text-sm transition-colors">
                  www.shrivaarielectricals.com
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#E8751A] mt-0.5 shrink-0" />
                <span className="text-white/60 text-sm">Mon–Sat: 9:30 AM – 6:30 PM</span>
              </div>
            </div>
          </div>

          {/* ─── Social Links ─── */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white/90">Social Links</h4>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Connect with us on social media for the latest updates, project highlights, and industry insights.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map(social => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="group w-10 h-10 rounded-xl bg-white/5 hover:bg-[#E8751A] border border-white/10 hover:border-[#E8751A] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                  >
                    <Icon className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                  </a>
                )
              })}
            </div>

            {/* Quick CTA */}
            <button
              onClick={() => navigate('contact')}
              className="mt-6 inline-flex items-center gap-2 bg-[#E8751A] hover:bg-[#D4691A] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-lg shadow-[#E8751A]/20"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Bottom Bar ─── */}
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs text-center md:text-left">
            © {new Date().getFullYear()} Shri Vaari Electricals Private Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <button onClick={() => navigate('about')} className="hover:text-white/70 transition-colors">About</button>
            <span className="text-white/20">|</span>
            <button onClick={() => navigate('services')} className="hover:text-white/70 transition-colors">Services</button>
            <span className="text-white/20">|</span>
            <button onClick={() => navigate('contact')} className="hover:text-white/70 transition-colors">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
