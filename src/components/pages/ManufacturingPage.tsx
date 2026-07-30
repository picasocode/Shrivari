'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import {
  ChevronRight, ArrowRight, Zap, Cpu, Gauge, Activity,
  RefreshCw, MonitorPlay, CircuitBoard, ShieldCheck,
  CheckCircle2, Factory, Award, Boxes, FileCheck, Settings,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useRouter } from '@/components/Router'

/* ─── Fade-in helper ─── */
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
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

/* ─── Product Data ─── */
interface Product {
  id: string
  name: string
  tagline: string
  description: string
  image: string
  icon: React.ComponentType<{ className?: string }>
  features: string[]
}

const PRODUCTS: Product[] = [
  {
    id: 'pcc',
    name: 'PCC Panels',
    tagline: 'Power Control Center',
    description: 'Power control center panels designed for efficient and centralized power distribution across industrial and infrastructure installations.',
    image: '/images/manufacturing/pcc.png',
    icon: Zap,
    features: ['Centralized distribution', 'Main incoming breaker', 'Bus bar design up to 6300A', 'Metering & protection'],
  },
  {
    id: 'mcc',
    name: 'MCC Panels',
    tagline: 'Motor Control Center',
    description: 'Motor control center panels for industrial motor operations and process control, engineered for reliability and safety.',
    image: '/images/manufacturing/mcc.png',
    icon: Cpu,
    features: ['Motor starters', 'Contactor & relay logic', 'DOL / Star-Delta / RDF', 'Process interlocks'],
  },
  {
    id: 'apfc',
    name: 'APFC Panels',
    tagline: 'Automatic Power Factor Correction',
    description: 'Automatic power factor correction panels for energy efficiency optimization, reducing kVA demand and penalty charges.',
    image: '/images/manufacturing/apfc.png',
    icon: Gauge,
    features: ['Capacitor banks', 'Reactor harmonics control', 'Automatic controller', 'Step-wise switching'],
  },
  {
    id: 'plc',
    name: 'PLC Automation Panels',
    tagline: 'Programmable Logic Control',
    description: 'Automation and process control panels with advanced PLC integration, enabling smart industrial operations and remote monitoring.',
    image: '/images/manufacturing/plc.png',
    icon: CircuitBoard,
    features: ['PLC integrated control', 'HMI touch interface', 'I/O modules', 'SCADA ready'],
  },
  {
    id: 'sync',
    name: 'Synchronization Panels',
    tagline: 'Generator & Utility Sync',
    description: 'Generator and utility synchronization systems for uninterrupted operations, enabling seamless parallel operation and load sharing.',
    image: '/images/manufacturing/sync.png',
    icon: RefreshCw,
    features: ['Auto / manual sync', 'Load sharing', 'Mains & DG parallel', 'Reverse power protection'],
  },
  {
    id: 'vfd',
    name: 'VFD Panels',
    tagline: 'Variable Frequency Drive',
    description: 'Variable frequency drive panels for motor speed control and energy optimization across pumps, fans, and process loads.',
    image: '/images/manufacturing/vfd.png',
    icon: Activity,
    features: ['Speed control', 'Energy optimization', 'Soft start / stop', 'Harmonics mitigation'],
  },
  {
    id: 'scada',
    name: 'SAS / SCADA Systems',
    tagline: 'Substation Automation & Supervisory Control',
    description: 'Substation automation systems and SCADA solutions for real-time monitoring, control, and data acquisition across electrical networks.',
    image: '/images/manufacturing/scada.png',
    icon: MonitorPlay,
    features: ['Real-time monitoring', 'Remote control', 'Data acquisition', 'Event & alarm logging'],
  },
]

/* ─── Manufacturing Advantages ─── */
const ADVANTAGES = [
  { title: 'Customized Engineering', desc: 'Panels engineered to exact project specifications, load requirements, and site conditions.', icon: Settings },
  { title: 'Quality-Tested Components', desc: 'Only approved, certified switchgear and components from leading global manufacturers.', icon: ShieldCheck },
  { title: 'Compliance with Standards', desc: 'Manufactured to IS/IEC standards with IEC-61439 compliance for safety and reliability.', icon: FileCheck },
  { title: 'Reliable Assembly Processes', desc: 'Disciplined assembly workflows with skilled technicians and structured quality checks.', icon: Boxes },
  { title: 'Factory Testing Procedures', desc: 'Comprehensive routine and type tests at our in-house facility before dispatch.', icon: CheckCircle2 },
  { title: 'Application-Specific Designs', desc: 'Purpose-built solutions tailored to industrial, utility, and infrastructure applications.', icon: Award },
]

/* ─── Stats ─── */
const STATS = [
  { value: '20,000', suffix: ' sq ft', label: 'Manufacturing Facility' },
  { value: '10,000', suffix: '+', label: 'LT Panels Installed' },
  { value: 'IEC', suffix: '-61439', label: 'Certified Standards' },
  { value: '29', suffix: '+ Years', label: 'Manufacturing Experience' },
]

export default function ManufacturingPage() {
  const { navigate } = useRouter()

  /* Parallax hero */
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          HERO — Navy gradient with image overlay
          ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B3A5C 0%, #152D4F 50%, #0D1D3A 100%)' }}>
        {/* Background image with parallax */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image
            src="/images/manufacturing/hero.png"
            alt="HT & LT Panel Manufacturing Facility"
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1D3A] via-[#0D1D3A]/70 to-transparent" />
        </motion.div>

        {/* Ambient coral glow */}
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E8751A 0%, transparent 70%)' }}
        />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 pt-[100px] pb-16 md:pb-20">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm mb-8"
          >
            <button onClick={() => navigate('home')} className="text-white/50 hover:text-white/80 transition-colors">
              Home
            </button>
            <ChevronRight className="w-4 h-4 text-white/25" />
            <span className="text-[#E8751A] font-medium">Manufacturing</span>
          </motion.div>

          <motion.div style={{ opacity: heroOpacity }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Badge className="mb-5 bg-[#E8751A]/15 text-[#E8751A] border border-[#E8751A]/30 px-4 py-1.5 text-sm font-semibold rounded-full backdrop-blur-sm">
                <Factory className="w-3.5 h-3.5 mr-1.5" />
                HT & LT Panel Manufacturing
              </Badge>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5 max-w-3xl tracking-tight"
            >
              Engineered for{' '}
              <span className="relative inline-block">
                Reliability
                <motion.span
                  className="absolute -bottom-1 left-0 h-1 rounded-full bg-[#E8751A]"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                />
              </span>{' '}
              Built for Performance
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-lg text-white/70 max-w-2xl mb-8 leading-relaxed"
            >
              Shri Vaari Electricals manufactures high-performance HT and LT panels engineered for reliability, operational safety, and long-term performance across industrial and infrastructure applications.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap items-center gap-3"
            >
              <button
                onClick={() => navigate('contact')}
                className="inline-flex items-center gap-2 bg-[#E8751A] hover:bg-[#D4691A] text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-lg shadow-[#E8751A]/25"
              >
                Request a Quote
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('services')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Explore Services
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-[#0D1D3A]/50 backdrop-blur-sm">
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                  className="text-center md:text-left"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {stat.value}<span className="text-[#E8751A]">{stat.suffix}</span>
                  </div>
                  <div className="text-xs md:text-sm text-white/50 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          INTRODUCTION
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — Image */}
            <FadeIn>
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-full h-full rounded-lg border-2 border-[#E8751A]/20 -z-0 hidden md:block" />
                <div className="relative rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src="/images/manufacturing/hero.png"
                    alt="Panel Manufacturing Facility"
                    width={1344}
                    height={768}
                    className="w-full object-cover min-h-[320px] md:min-h-[400px]"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E8751A]/10 flex items-center justify-center">
                        <Factory className="w-5 h-5 text-[#E8751A]" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-[#1A1A2E] leading-tight">Guindy, Chennai</p>
                        <p className="text-xs text-[#6B7280]">20,000 sq ft Facility</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right — Text */}
            <FadeIn delay={0.15}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8751A]/10 border border-[#E8751A]/25 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8751A]" />
                <span className="text-xs font-bold tracking-[0.2em] text-[#E8751A] uppercase">Introduction</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-5 leading-tight tracking-tight">
                Precision Manufacturing for{' '}
                <span className="text-[#E8751A]">Critical Infrastructure</span>
              </h2>
              <p className="text-[#374151] leading-relaxed mb-4">
                Shri Vaari Electricals manufactures high-performance HT and LT panels engineered for reliability, operational safety, and long-term performance across industrial and infrastructure applications.
              </p>
              <p className="text-[#374151] leading-relaxed mb-6">
                From our state-of-the-art 20,000 sq ft manufacturing facility at Guindy, Chennai, we deliver custom-built panels and bus duct systems certified to IEC-61439 international standards — serving clients across India and overseas markets.
              </p>

              {/* Quick highlights */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: ShieldCheck, label: 'IEC-61439 Certified' },
                  { icon: Boxes, label: 'Custom Design' },
                  { icon: Settings, label: 'In-house Testing' },
                  { icon: Award, label: '29+ Years Experience' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB] px-3 py-2.5">
                    <item.icon className="w-4 h-4 text-[#E8751A] flex-shrink-0" />
                    <span className="text-sm font-medium text-[#1A1A2E]">{item.label}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PRODUCT RANGE — Image-forward cards
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-[#F8FAFC] relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        {/* Ambient coral glow */}
        <div className="absolute top-1/3 -left-32 w-[28rem] h-[28rem] bg-[#E8751A]/[0.05] blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 -right-32 w-[28rem] h-[28rem] bg-[#E8751A]/[0.04] blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 items-end">
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8751A]/10 border border-[#E8751A]/25 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8751A]" />
                  <span className="text-xs font-bold tracking-[0.2em] text-[#E8751A] uppercase">Product Range</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A2E] mb-3 leading-tight tracking-tight">
                  Our Panel &amp;<br />
                  <span className="text-[#E8751A]">System Portfolio</span>
                </h2>
              </div>
              <p className="text-[#6B7280] text-sm leading-relaxed lg:max-w-xs">
                A comprehensive range of HT and LT panels, automation systems, and bus duct solutions — each engineered, manufactured, and tested in-house for demanding applications.
              </p>
            </div>
          </FadeIn>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((product, i) => {
              const Icon = product.icon
              return (
                <FadeIn key={product.id} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="group relative h-full overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-[#E8751A]/40 shadow-sm hover:shadow-2xl hover:shadow-[#E8751A]/10 transition-all duration-500"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden h-48 md:h-52">
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        initial={false}
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {/* Coral accent line */}
                      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#E8751A] group-hover:w-full transition-all duration-500 ease-out" />
                      {/* Icon badge */}
                      <div className="absolute top-4 right-4 w-11 h-11 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-md">
                        <Icon className="w-5 h-5 text-[#E8751A]" />
                      </div>
                      {/* Number badge */}
                      <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-md">
                        <span className="text-sm font-bold text-[#E8751A] tabular-nums">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 md:p-6">
                      <span className="block text-[10px] font-bold tracking-[0.2em] text-[#E8751A] uppercase mb-1">
                        {product.tagline}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-[#1A1A2E] mb-2 leading-tight tracking-tight group-hover:text-[#E8751A] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[#6B7280] text-sm leading-relaxed mb-4">
                        {product.description}
                      </p>

                      {/* Features */}
                      <ul className="space-y-1.5">
                        {product.features.map((feature, fi) => (
                          <li key={fi} className="flex items-center gap-2 text-xs text-[#374151]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#E8751A] flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MANUFACTURING ADVANTAGES
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8751A]/10 border border-[#E8751A]/25 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8751A]" />
                <span className="text-xs font-bold tracking-[0.2em] text-[#E8751A] uppercase">Why Choose Us</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A2E] mb-3 leading-tight tracking-tight">
                Manufacturing <span className="text-[#E8751A]">Advantages</span>
              </h2>
              <p className="text-[#6B7280] text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                Six pillars that ensure every panel leaving our facility meets the highest standards of performance, safety, and reliability.
              </p>
            </div>
          </FadeIn>

          {/* Advantages grid — 3x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ADVANTAGES.map((adv, i) => {
              const Icon = adv.icon
              return (
                <FadeIn key={adv.title} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="group relative h-full p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#E8751A]/40 shadow-sm hover:shadow-xl hover:shadow-[#E8751A]/5 transition-all duration-500"
                  >
                    {/* Number watermark */}
                    <span className="absolute top-4 right-5 text-5xl font-bold text-[#E8751A]/[0.06] group-hover:text-[#E8751A]/10 transition-colors tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-[#E8751A]/10 flex items-center justify-center mb-4 group-hover:bg-[#E8751A] transition-colors duration-300">
                        <Icon className="w-6 h-6 text-[#E8751A] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="text-lg font-bold text-[#1A1A2E] mb-2 leading-tight tracking-tight">
                        {adv.title}
                      </h3>
                      <p className="text-[#6B7280] text-sm leading-relaxed">
                        {adv.desc}
                      </p>
                    </div>
                    {/* Coral bottom accent */}
                    <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-[#E8751A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA BANNER
          ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B3A5C 0%, #152D4F 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #E8751A, transparent 70%)' }}
          />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #E8751A, transparent 70%)' }}
          />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 py-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Need a Custom Panel Solution?
            </h2>
            <p className="text-white/60 max-w-lg mx-auto mb-6">
              Our engineering team designs and manufactures panels tailored to your exact project specifications and industry requirements.
            </p>
            <button
              onClick={() => navigate('contact')}
              className="inline-flex items-center gap-2 bg-[#E8751A] hover:bg-[#D4691A] text-white font-semibold px-7 py-3 rounded-full transition-colors shadow-lg shadow-[#E8751A]/25"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
