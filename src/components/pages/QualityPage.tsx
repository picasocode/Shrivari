'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, ChevronDown, ChevronLeft, ArrowRight, Eye, X, ShieldCheck,
  BadgeCheck, Leaf, Gauge, FileBadge2, Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/components/Router'

/* ─── Brand Tokens (strictly navy + coral, 2 colors only) ─── */
const NAVY_DEEP = '#0C2340'
const NAVY = '#152D4F'
const NAVY_MID = '#1B3A5C'
const CORAL = '#E8751A'
const INK = '#1A1A2E'
const SLATE = '#6B7280'
const LIGHT_BG = '#FAFAFA'

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

/* ─── Certificates — rendered as view-only images (no download) ─── */
const certificates = [
  { title: 'ISO 9001:2015', subtitle: 'Quality Management System', src: '/images/certificates/cert-iso-9001.jpg' },
  { title: 'ISO 14001:2015', subtitle: 'Environmental Management System', src: '/images/certificates/cert-iso-14001.jpg' },
  { title: 'ISO 45001:2018', subtitle: 'Occupational Health & Safety', src: '/images/certificates/cert-iso-45001.jpg' },
  { title: 'ISO 50001:2018', subtitle: 'Energy Management System', src: '/images/certificates/cert-iso-50001.jpg' },
  { title: 'CE Certification', subtitle: 'European Conformity', src: '/images/certificates/cert-ce.jpg' },
  { title: 'RoHS Compliance', subtitle: 'Restriction of Hazardous Substances', src: '/images/certificates/cert-rohs.jpg' },
  { title: 'ZED Bronze', subtitle: 'MSME ZED Certification', src: '/images/certificates/cert-zed-bronze.jpg' },
]

const policyPillars = [
  {
    icon: BadgeCheck,
    title: 'Quality First',
    text: 'Right-first-time engineering and rigorous quality checks at every stage — from design and panel manufacture to commissioning and maintenance.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety Always',
    text: 'A zero-harm workplace culture governed by our ISO 45001:2018 certified occupational health and safety management system.',
  },
  {
    icon: Leaf,
    title: 'Environmental Care',
    text: 'Responsible manufacturing under ISO 14001:2015 — minimising our environmental footprint across every project we execute.',
  },
  {
    icon: Gauge,
    title: 'Energy Efficiency',
    text: 'ISO 50001:2018 certified energy management — helping our customers and our own facilities use power smarter and cleaner.',
  },
]

/* ─── Main Component ─── */
export default function QualityPage() {
  const { navigate } = useRouter()
  const [lightbox, setLightbox] = useState<number | null>(null)

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  /* Block the context menu on certificate imagery (view-only) */
  const blockContext = useCallback((e: React.MouseEvent) => e.preventDefault(), [])

  /* Lightbox keyboard controls + scroll lock */
  useEffect(() => {
    if (lightbox === null) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox((i) => (i === null ? null : (i + 1) % certificates.length))
      if (e.key === 'ArrowLeft') setLightbox((i) => (i === null ? null : (i - 1 + certificates.length) % certificates.length))
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [lightbox === null])

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          SECTION 1: HERO — navy editorial, same language as Team page
          ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, ${NAVY_MID} 50%, ${NAVY} 100%)` }}>
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }} />
          <div className="absolute top-[10%] right-[5%] w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1280px] mx-auto px-5 lg:px-8 pt-[100px] pb-20 md:pb-24">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-2 text-sm text-white/40 mb-12"
          >
            <button onClick={() => navigate('home')} className="hover:text-white/70 transition-colors">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button onClick={() => navigate('about')} className="hover:text-white/70 transition-colors">Company</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/70">Quality and Policy</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.05]">
              Quality and Policy.
            </h1>
            <div className="w-16 h-[2px] mb-6" style={{ background: CORAL }} />
            <p className="text-sm md:text-base text-white/45 max-w-xl leading-relaxed">
              Our certified commitment to quality, safety, environment and energy management — backed by internationally accredited ISO certifications.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-xs uppercase tracking-[0.2em]">Explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="w-5 h-5 text-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2: QUALITY POLICY STATEMENT + PILLARS
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24" style={{ background: LIGHT_BG }}>
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-3 mb-5 justify-center">
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: NAVY_MID }}>Quality Policy</span>
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold leading-tight tracking-tight mb-5" style={{ color: INK }}>
                Our Commitment to Excellence
              </h2>
              <p className="text-sm md:text-base max-w-3xl mx-auto leading-relaxed" style={{ color: SLATE }}>
                Shri Vaari Electricals Private Limited is committed to delivering reliable, safe and high-performance
                electrical solutions. Our integrated management systems are certified to ISO 9001:2015, ISO 14001:2015,
                ISO 45001:2018 and ISO 50001:2018 — covering the design, manufacture and supply of LT/HT electrical panels,
                electrical contracts from design to commissioning, transformer erection, solar EPC projects and allied
                services, together with annual maintenance of various electrical systems.
              </p>
            </div>
          </FadeIn>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {policyPillars.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <FadeIn key={pillar.title} delay={(i % 4) * 0.08}>
                  <div className="h-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${CORAL}14` }}>
                      <Icon className="w-5 h-5" style={{ color: CORAL }} />
                    </div>
                    <h3 className="text-base font-bold mb-2" style={{ color: INK }}>{pillar.title}</h3>
                    <p className="text-[13px] leading-relaxed" style={{ color: SLATE }}>{pillar.text}</p>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3: CERTIFICATES — VIEW-ONLY GALLERY (download blocked)
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white" onContextMenu={blockContext}>
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10 md:mb-14">
              <div className="inline-flex items-center gap-3 mb-5 justify-center">
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: NAVY_MID }}>Company Certificates</span>
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold leading-tight tracking-tight mb-4" style={{ color: INK }}>
                Our Certifications
              </h2>
              <p className="text-sm md:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: SLATE }}>
                Internationally accredited certificates for our quality, environmental, safety and energy management systems.
              </p>
              <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-slate-100 border border-slate-200">
                <Lock className="w-3.5 h-3.5" style={{ color: NAVY_MID }} />
                <span className="text-xs font-semibold" style={{ color: NAVY_MID }}>
                  View only — downloading is disabled to protect document integrity
                </span>
              </div>
            </div>
          </FadeIn>

          {/* Certificate cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificates.map((cert, i) => (
              <FadeIn key={cert.title} delay={(i % 4) * 0.08}>
                <button
                  onClick={() => setLightbox(i)}
                  onContextMenu={blockContext}
                  className="group w-full text-left bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden focus:outline-none focus-visible:ring-2"
                  aria-label={`View ${cert.title} certificate`}
                >
                  {/* A4 thumbnail */}
                  <div className="relative aspect-[210/297] overflow-hidden bg-slate-50 select-none">
                    <img
                      src={cert.src}
                      alt={`${cert.title} — ${cert.subtitle}`}
                      loading="lazy"
                      draggable={false}
                      onContextMenu={blockContext}
                      onDragStart={(e) => e.preventDefault()}
                      className="absolute inset-0 h-full w-full object-cover object-top pointer-events-none transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                    {/* Hover view overlay */}
                    <div className="absolute inset-0 bg-[#0C2340]/0 group-hover:bg-[#0C2340]/35 transition-colors duration-300 flex items-center justify-center">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-xs font-semibold shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" style={{ color: NAVY_DEEP }}>
                        <Eye className="w-4 h-4" style={{ color: CORAL }} />
                        View Certificate
                      </span>
                    </div>
                  </div>
                  {/* Card footer */}
                  <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold truncate" style={{ color: INK }}>{cert.title}</h3>
                      <p className="text-xs truncate mt-0.5" style={{ color: SLATE }}>{cert.subtitle}</p>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold uppercase tracking-wide" style={{ color: NAVY_MID }}>
                      <Lock className="w-3 h-3" />
                      View Only
                    </span>
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4: CTA — navy, single coral button
          ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-24" style={{ background: NAVY_DEEP }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-3 mb-6 justify-center">
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Work With Us</span>
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                Quality you can certify.
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-white/55 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Partner with a team whose processes are independently audited and certified to the most demanding international standards.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={() => navigate('contact')}
                  className="rounded-xl px-8 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ background: CORAL, color: '#FFFFFF' }}
                >
                  Get a Quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={() => navigate('manufacturing')}
                  variant="outline"
                  className="rounded-xl px-8 h-12 text-base font-semibold backdrop-blur-sm transition-all duration-300 border-white/25 text-white hover:bg-white/10"
                  style={{ background: 'transparent', color: '#FFFFFF' }}
                >
                  Explore Our Facility
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          LIGHTBOX — full-size view-only viewer (context menu blocked)
          ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-[#0C2340]/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 select-none"
            onContextMenu={blockContext}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${certificates[lightbox].title} certificate viewer`}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close certificate viewer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* View-only badge */}
            <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15">
              <Lock className="w-3.5 h-3.5 text-white/70" />
              <span className="text-xs font-semibold text-white/80">View only</span>
            </div>

            {/* Prev / Next */}
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + certificates.length) % certificates.length) }}
              className="absolute left-3 md:left-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Previous certificate"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % certificates.length) }}
              className="absolute right-3 md:right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Next certificate"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Certificate image */}
            <motion.img
              key={certificates[lightbox].src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              src={certificates[lightbox].src}
              alt={`${certificates[lightbox].title} — ${certificates[lightbox].subtitle}`}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              onContextMenu={blockContext}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[82vh] max-w-full w-auto h-auto object-contain rounded-lg shadow-2xl"
            />

            {/* Caption */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
              <p className="text-white text-sm font-semibold">{certificates[lightbox].title}</p>
              <p className="text-white/50 text-xs mt-0.5">{certificates[lightbox].subtitle} · {lightbox + 1} / {certificates.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
