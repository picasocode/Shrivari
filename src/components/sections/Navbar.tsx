'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, Phone, LogOut, Shield, ChevronDown, PenTool, Hammer, FlaskConical, BarChart3, ShieldCheck, RefreshCw, FileCheck, Building2, Sun, ArrowRight, Users, Briefcase, LayoutGrid, Info, FolderKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { useRouter, type PageName } from '@/components/Router'
import { AnimatePresence, motion } from 'framer-motion'

interface NavbarProps {
  onAdminClick: () => void
  isLoggedIn?: boolean
  onLogout?: () => void
}

const serviceDropdownItems = [
  { label: 'Design & Engineering', slug: 'design-engineering', icon: PenTool, desc: 'Complete electrical system design from concept to detailed engineering' },
  { label: 'Project Execution', slug: 'project-execution', icon: Hammer, desc: 'End-to-end project execution from procurement to commissioning' },
  { label: 'Testing', slug: 'testing', icon: FlaskConical, desc: 'Comprehensive testing and commissioning of electrical installations' },
  { label: 'Energy & Harmonic Audit', slug: 'energy-harmonic-audit', icon: BarChart3, desc: 'Energy audits and harmonic analysis for industrial facilities' },
  { label: 'AMC', slug: 'amc', icon: ShieldCheck, desc: 'Annual maintenance contracts for electrical installations' },
  { label: 'HT/LT Panel Retrofitting', slug: 'ht-lt-panel-retrofitting', icon: RefreshCw, desc: 'Retrofitting and upgrading existing panels with modern switchgear' },
  { label: 'Liasion with CEIG', slug: 'liasion-ceig', icon: FileCheck, desc: 'Liaison with Chief Electrical Inspector for statutory approvals' },
  { label: 'Liasion with TNEB/KPTCL/APTRANSCO/TSTRANSCO', slug: 'liasion-utilities', icon: Building2, desc: 'Liaison with state electricity utilities for approvals' },
  { label: 'Solar Works', slug: 'solar-works', icon: Sun, desc: 'Complete solar EPC solutions from design to commissioning' },
]

const companyDropdownItems = [
  { label: 'About Us', slug: 'about', icon: Info, desc: 'Our story, mission, vision and 29+ years of excellence' },
  { label: 'Team', slug: 'team', icon: Users, desc: 'Meet the leadership driving our success' },
  { label: 'Key Sectors We Serve', slug: 'sectors', icon: LayoutGrid, desc: 'Industries and sectors we power across India' },
  { label: 'Careers', slug: 'careers', icon: Briefcase, desc: 'Join our 364+ strong team and grow with us' },
]

const clientsDropdownItems = [
  { label: 'Our Clients', slug: 'clients', icon: Users, desc: 'Trusted by leading industries across India' },
  { label: 'Projects', slug: 'projects', icon: FolderKanban, desc: 'Browse 150+ executed projects with full details' },
]

const navLinks: { label: string; page: PageName; hasDropdown?: boolean }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Company', page: 'about', hasDropdown: true },
  { label: 'Products', page: 'products' },
  { label: 'Services', page: 'services' },
  { label: 'Clients', page: 'clients', hasDropdown: true },
  { label: 'Testimonials', page: 'testimonials' },
  { label: 'Blog', page: 'blog' },
  { label: 'Contact', page: 'contact' },
]

export default function Navbar({ onAdminClick, isLoggedIn, onLogout }: NavbarProps) {
  const { router, navigate } = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [companyOpen, setCompanyOpen] = useState(false)
  const [clientsOpen, setClientsOpen] = useState(false)
  const [mobileServicesExpanded, setMobileServicesExpanded] = useState(false)
  const [mobileCompanyExpanded, setMobileCompanyExpanded] = useState(false)
  const [mobileClientsExpanded, setMobileClientsExpanded] = useState(false)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const companyTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const clientsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavigate = (page: PageName, params?: Record<string, string>) => {
    setServicesOpen(false)
    setCompanyOpen(false)
    setClientsOpen(false)
    setMobileServicesExpanded(false)
    setMobileCompanyExpanded(false)
    setMobileClientsExpanded(false)
    navigate(page, params)
  }

  const handleMouseEnterServices = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
      dropdownTimeoutRef.current = null
    }
    setServicesOpen(true)
  }

  const handleMouseLeaveServices = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setServicesOpen(false)
    }, 150)
  }

  const handleMouseEnterCompany = () => {
    if (companyTimeoutRef.current) {
      clearTimeout(companyTimeoutRef.current)
      companyTimeoutRef.current = null
    }
    setCompanyOpen(true)
  }

  const handleMouseLeaveCompany = () => {
    companyTimeoutRef.current = setTimeout(() => {
      setCompanyOpen(false)
    }, 150)
  }

  const handleMouseEnterClients = () => {
    if (clientsTimeoutRef.current) {
      clearTimeout(clientsTimeoutRef.current)
      clientsTimeoutRef.current = null
    }
    setClientsOpen(true)
  }

  const handleMouseLeaveClients = () => {
    clientsTimeoutRef.current = setTimeout(() => {
      setClientsOpen(false)
    }, 150)
  }

  const handleServiceClick = (slug: string) => {
    handleNavigate('service-detail', { slug })
  }

  const isServicesActive = router.page === 'services' || router.page === 'service-detail'
  const isCompanyActive = router.page === 'about' || router.page === 'team' || router.page === 'sectors' || router.page === 'careers'
  const isClientsActive = router.page === 'clients' || router.page === 'projects'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-[0_1px_12px_rgba(0,0,0,0.06)]'
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      {/* Top bar */}
      <div className="bg-[#0D1D3A] text-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex items-center justify-between h-9 text-xs">
          <div className="flex items-center gap-4">
            <a href="tel:+919941905833" className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors">
              <Phone className="w-3 h-3" /> +91 9941905833
            </a>
            <a href="mailto:enquiries@shrivaarielectricals.com" className="text-white/80 hover:text-white transition-colors hidden sm:inline">
              enquiries@shrivaarielectricals.com
            </a>
          </div>
          <span className="text-white/60 hidden md:inline">Mon–Sat: 9:30 AM – 6:30 PM</span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => handleNavigate('home')} className="flex items-center gap-2.5">
            <img
              src="https://www.shrivaarielectricals.com/img/logo/logo.png"
              alt="Shri Vaari Electricals"
              className="h-10 w-auto object-contain"
            />
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.page === 'services' ? (
                /* Services dropdown */
                <div
                  key={link.page}
                  className="relative"
                  onMouseEnter={handleMouseEnterServices}
                  onMouseLeave={handleMouseLeaveServices}
                >
                  <button
                    onClick={() => handleNavigate('services')}
                    className={`flex items-center gap-1 px-3.5 py-2 text-[13.5px] font-medium transition-colors rounded-md ${
                      isServicesActive
                        ? 'text-[#E8751A] bg-[#E8751A]/5'
                        : 'text-[#374151] hover:text-[#1B3A5C] hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                        onMouseEnter={handleMouseEnterServices}
                        onMouseLeave={handleMouseLeaveServices}
                      >
                        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 w-[720px] p-6">
                          <div className="grid grid-cols-3 gap-3">
                            {serviceDropdownItems.map((item) => {
                              const IconComponent = item.icon
                              return (
                                <button
                                  key={item.slug}
                                  onClick={() => handleServiceClick(item.slug)}
                                  className="flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-150 hover:bg-[#F0F4F8] group"
                                >
                                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#1B3A5C]/[0.07] flex items-center justify-center group-hover:bg-[#E8751A]/10 transition-colors">
                                    <IconComponent className="w-4 h-4 text-[#1B3A5C] group-hover:text-[#E8751A] transition-colors" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-[13px] font-semibold text-[#1B3A5C] group-hover:text-[#E8751A] transition-colors leading-tight">
                                      {item.label}
                                    </div>
                                    <div className="text-[11px] text-[#6B7280] mt-0.5 leading-snug line-clamp-2">
                                      {item.desc}
                                    </div>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-center">
                            <button
                              onClick={() => handleNavigate('services')}
                              className="flex items-center gap-1.5 text-[13px] font-semibold text-[#E8751A] hover:text-[#D4691A] transition-colors"
                            >
                              View All Services
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : link.hasDropdown && link.page === 'about' ? (
                /* Company dropdown */
                <div
                  key={link.page}
                  className="relative"
                  onMouseEnter={handleMouseEnterCompany}
                  onMouseLeave={handleMouseLeaveCompany}
                >
                  <button
                    onClick={() => handleNavigate('about')}
                    className={`flex items-center gap-1 px-3.5 py-2 text-[13.5px] font-medium transition-colors rounded-md ${
                      isCompanyActive
                        ? 'text-[#E8751A] bg-[#E8751A]/5'
                        : 'text-[#374151] hover:text-[#1B3A5C] hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${companyOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {companyOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                        onMouseEnter={handleMouseEnterCompany}
                        onMouseLeave={handleMouseLeaveCompany}
                      >
                        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 w-[340px] p-4">
                          <div className="space-y-1">
                            {companyDropdownItems.map((item) => {
                              const IconComponent = item.icon
                              return (
                                <button
                                  key={item.slug}
                                  onClick={() => handleNavigate(item.slug as PageName)}
                                  className="w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-150 hover:bg-[#F0F4F8] group"
                                >
                                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#1B3A5C]/[0.07] flex items-center justify-center group-hover:bg-[#E8751A]/10 transition-colors">
                                    <IconComponent className="w-4 h-4 text-[#1B3A5C] group-hover:text-[#E8751A] transition-colors" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-[13px] font-semibold text-[#1B3A5C] group-hover:text-[#E8751A] transition-colors leading-tight">
                                      {item.label}
                                    </div>
                                    <div className="text-[11px] text-[#6B7280] mt-0.5 leading-snug line-clamp-2">
                                      {item.desc}
                                    </div>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : link.hasDropdown && link.page === 'clients' ? (
                /* Clients dropdown */
                <div
                  key={link.page}
                  className="relative"
                  onMouseEnter={handleMouseEnterClients}
                  onMouseLeave={handleMouseLeaveClients}
                >
                  <button
                    onClick={() => handleNavigate('clients')}
                    className={`flex items-center gap-1 px-3.5 py-2 text-[13.5px] font-medium transition-colors rounded-md ${
                      isClientsActive
                        ? 'text-[#E8751A] bg-[#E8751A]/5'
                        : 'text-[#374151] hover:text-[#1B3A5C] hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${clientsOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {clientsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                        onMouseEnter={handleMouseEnterClients}
                        onMouseLeave={handleMouseLeaveClients}
                      >
                        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 w-[340px] p-4">
                          <div className="space-y-1">
                            {clientsDropdownItems.map((item) => {
                              const IconComponent = item.icon
                              return (
                                <button
                                  key={item.slug}
                                  onClick={() => handleNavigate(item.slug as PageName)}
                                  className="w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-150 hover:bg-[#F0F4F8] group"
                                >
                                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#1B3A5C]/[0.07] flex items-center justify-center group-hover:bg-[#E8751A]/10 transition-colors">
                                    <IconComponent className="w-4 h-4 text-[#1B3A5C] group-hover:text-[#E8751A] transition-colors" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-[13px] font-semibold text-[#1B3A5C] group-hover:text-[#E8751A] transition-colors leading-tight">
                                      {item.label}
                                    </div>
                                    <div className="text-[11px] text-[#6B7280] mt-0.5 leading-snug line-clamp-2">
                                      {item.desc}
                                    </div>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  key={link.page}
                  onClick={() => handleNavigate(link.page)}
                  className={`px-3.5 py-2 text-[13.5px] font-medium transition-colors rounded-md ${
                    router.page === link.page
                      ? 'text-[#E8751A] bg-[#E8751A]/5'
                      : 'text-[#374151] hover:text-[#1B3A5C] hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </button>
              )
            )}
          </div>

          {/* CTA + Mobile */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Button
                  onClick={onAdminClick}
                  className="hidden md:inline-flex bg-[#1B3A5C] hover:bg-[#0D1D3A] text-white text-xs font-semibold rounded-md px-5 h-9 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 mr-1.5" />
                  Dashboard
                </Button>
                <Button
                  onClick={onLogout}
                  variant="outline"
                  className="hidden md:inline-flex border-[#E5E7EB] text-[#6B7280] hover:text-red-600 hover:border-red-200 text-xs font-semibold rounded-md px-5 h-9 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={onAdminClick}
                className="hidden md:inline-flex bg-[#1B3A5C] hover:bg-[#0D1D3A] text-white text-xs font-semibold rounded-md px-5 h-9 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                Admin
              </Button>
            )}
            <Button
              onClick={() => handleNavigate('contact')}
              className="hidden md:inline-flex bg-[#E8751A] hover:bg-[#D4691A] text-white text-xs font-semibold rounded-md px-5 h-9 transition-colors"
            >
              Get a Quote
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-[#374151] w-9 h-9">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white w-[280px] p-0">
                <div className="p-5 border-b border-gray-100">
                  <img
                    src="https://www.shrivaarielectricals.com/img/logo/logo.png"
                    alt="Logo"
                    className="h-9 w-auto object-contain"
                  />
                </div>
                <div className="p-4 space-y-0.5 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {navLinks.map((link) =>
                    link.page === 'services' ? (
                      <div key={link.page}>
                        <button
                          onClick={() => setMobileServicesExpanded(!mobileServicesExpanded)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            isServicesActive
                              ? 'text-[#E8751A] bg-[#E8751A]/5'
                              : 'text-[#374151] hover:bg-gray-50'
                          }`}
                        >
                          {link.label}
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileServicesExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {mobileServicesExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              className="overflow-hidden"
                            >
                              <div className="pl-3 py-1 space-y-0.5">
                                {serviceDropdownItems.map((item) => {
                                  const IconComponent = item.icon
                                  return (
                                    <SheetClose asChild key={item.slug}>
                                      <button
                                        onClick={() => {
                                          setMobileServicesExpanded(false)
                                          handleNavigate('service-detail', { slug: item.slug })
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left text-[13px] text-[#374151] hover:bg-[#F0F4F8] hover:text-[#E8751A] transition-colors"
                                      >
                                        <IconComponent className="w-4 h-4 text-[#1B3A5C] flex-shrink-0" />
                                        <span className="font-medium">{item.label}</span>
                                      </button>
                                    </SheetClose>
                                  )
                                })}
                                <SheetClose asChild>
                                  <button
                                    onClick={() => {
                                      setMobileServicesExpanded(false)
                                      handleNavigate('services')
                                    }}
                                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-[13px] font-semibold text-[#E8751A] hover:bg-[#E8751A]/5 transition-colors"
                                  >
                                    View All Services
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                </SheetClose>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : link.hasDropdown && link.page === 'about' ? (
                      <div key={link.page}>
                        <button
                          onClick={() => setMobileCompanyExpanded(!mobileCompanyExpanded)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            isCompanyActive
                              ? 'text-[#E8751A] bg-[#E8751A]/5'
                              : 'text-[#374151] hover:bg-gray-50'
                          }`}
                        >
                          {link.label}
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileCompanyExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {mobileCompanyExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              className="overflow-hidden"
                            >
                              <div className="pl-3 py-1 space-y-0.5">
                                {companyDropdownItems.map((item) => {
                                  const IconComponent = item.icon
                                  return (
                                    <SheetClose asChild key={item.slug}>
                                      <button
                                        onClick={() => {
                                          setMobileCompanyExpanded(false)
                                          handleNavigate(item.slug as PageName)
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left text-[13px] text-[#374151] hover:bg-[#F0F4F8] hover:text-[#E8751A] transition-colors"
                                      >
                                        <IconComponent className="w-4 h-4 text-[#1B3A5C] flex-shrink-0" />
                                        <span className="font-medium">{item.label}</span>
                                      </button>
                                    </SheetClose>
                                  )
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : link.hasDropdown && link.page === 'clients' ? (
                      <div key={link.page}>
                        <button
                          onClick={() => setMobileClientsExpanded(!mobileClientsExpanded)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            isClientsActive
                              ? 'text-[#E8751A] bg-[#E8751A]/5'
                              : 'text-[#374151] hover:bg-gray-50'
                          }`}
                        >
                          {link.label}
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileClientsExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {mobileClientsExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              className="overflow-hidden"
                            >
                              <div className="pl-3 py-1 space-y-0.5">
                                {clientsDropdownItems.map((item) => {
                                  const IconComponent = item.icon
                                  return (
                                    <SheetClose asChild key={item.slug}>
                                      <button
                                        onClick={() => {
                                          setMobileClientsExpanded(false)
                                          handleNavigate(item.slug as PageName)
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left text-[13px] text-[#374151] hover:bg-[#F0F4F8] hover:text-[#E8751A] transition-colors"
                                      >
                                        <IconComponent className="w-4 h-4 text-[#1B3A5C] flex-shrink-0" />
                                        <span className="font-medium">{item.label}</span>
                                      </button>
                                    </SheetClose>
                                  )
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <SheetClose asChild key={link.page}>
                        <button
                          onClick={() => handleNavigate(link.page)}
                          className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            router.page === link.page
                              ? 'text-[#E8751A] bg-[#E8751A]/5'
                              : 'text-[#374151] hover:bg-gray-50'
                          }`}
                        >
                          {link.label}
                        </button>
                      </SheetClose>
                    )
                  )}
                </div>
                <div className="p-4 border-t border-gray-100 space-y-2">
                  {isLoggedIn ? (
                    <>
                      <Button onClick={() => { onAdminClick(); setMobileOpen(false) }} className="w-full bg-[#1B3A5C] hover:bg-[#0D1D3A] text-white rounded-md text-sm">
                        <Shield className="w-3.5 h-3.5 mr-1.5" />
                        Dashboard
                      </Button>
                      <Button onClick={() => { onLogout?.(); setMobileOpen(false) }} variant="outline" className="w-full border-[#E5E7EB] text-[#6B7280] rounded-md text-sm">
                        <LogOut className="w-3.5 h-3.5 mr-1.5" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => { onAdminClick(); setMobileOpen(false) }} className="w-full bg-[#1B3A5C] hover:bg-[#0D1D3A] text-white rounded-md text-sm">
                      <Shield className="w-3.5 h-3.5 mr-1.5" />
                      Admin Login
                    </Button>
                  )}
                  <Button onClick={() => { handleNavigate('contact'); setMobileOpen(false) }} variant="outline" className="w-full border-[#E8751A] text-[#E8751A] rounded-md text-sm">
                    Get a Quote
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}
