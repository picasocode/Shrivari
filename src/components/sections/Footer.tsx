'use client'

import { Phone, Mail, MapPin, Clock, Linkedin } from 'lucide-react'
import { useRouter, type PageName } from '@/components/Router'

const links: { label: string; page: PageName }[] = [
  { label: 'About Us', page: 'about' },
  { label: 'Products', page: 'products' },
  { label: 'Services', page: 'services' },
  { label: 'Clients', page: 'clients' },
  { label: 'Testimonials', page: 'testimonials' },
  { label: 'Blog', page: 'blog' },
  { label: 'Contact Us', page: 'contact' },
]

export default function Footer() {
  const { navigate } = useRouter()
  return (
    <footer className="bg-[#0D1D3A] text-white">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <img src="/images/logo.png" alt="Shri Vaari Electricals" className="h-9 w-auto object-contain mb-4" />
            <p className="text-white/50 text-sm leading-relaxed">
              Professionally managed engineering firm offering EPC solutions, panel manufacturing, and electrical services from design to commissioning.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white/90">Quick Links</h4>
            <ul className="space-y-2">
              {links.map(l => (
                <li key={l.page}><button onClick={() => navigate(l.page)} className="text-white/50 hover:text-white text-sm transition-colors">{l.label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white/90">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5"><Phone className="w-4 h-4 text-[#E8751A] mt-0.5 shrink-0" /><a href="tel:+919941905833" className="text-white/50 hover:text-white text-sm transition-colors">+91 9941905833</a></li>
              <li className="flex items-start gap-2.5"><Mail className="w-4 h-4 text-[#E8751A] mt-0.5 shrink-0" /><a href="mailto:srivaari@gmail.com" className="text-white/50 hover:text-white text-sm transition-colors">srivaari@gmail.com</a></li>
              <li className="flex items-start gap-2.5"><MapPin className="w-4 h-4 text-[#E8751A] mt-0.5 shrink-0" /><span className="text-white/50 text-sm">Chennai, Tamil Nadu, India</span></li>
              <li className="flex items-start gap-2.5"><Clock className="w-4 h-4 text-[#E8751A] mt-0.5 shrink-0" /><span className="text-white/50 text-sm">Mon–Sat: 9:30 AM – 6:30 PM</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white/90">Products</h4>
            <ul className="space-y-2">
              {['LT Panels', 'HT Panels', 'Control & Relay Panels', 'Power Control Centre', 'Motor Control Centre', 'DG Synchronization'].map(p => (
                <li key={p}><button onClick={() => navigate('products')} className="text-white/50 hover:text-white text-sm transition-colors">{p}</button></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-white/30 text-xs">© 2024 Shri Vaari Electricals Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="#" className="text-white/30 hover:text-white/60 transition-colors"><Linkedin className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
