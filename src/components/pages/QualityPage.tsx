'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, ChevronDown, ArrowRight, X, Lock, ZoomIn,
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
  { title: 'ISO 9001:2015', subtitle: 'Quality Management System', src: '/images/certificates/iso-9001.jpg' },
  { title: 'ISO 14001:2015', subtitle: 'Environmental Management System', src: '/images/certificates/iso-14001.jpg' },
  { title: 'ISO 45001:2018', subtitle: 'Occupational Health & Safety', src: '/images/certificates/iso-45001.jpg' },
  { title: 'ISO 50001:2018', subtitle: 'Energy Management System', src: '/images/certificates/iso-50001.jpg' },
  { title: 'CE Certificate', subtitle: 'European Conformity', src: '/images/certificates/ce-certificate.jpg' },
  { title: 'RoHS Certificate', subtitle: 'Restriction of Hazardous Substances', src: '/images/certificates/rohs-certificate.jpg' },
  { title: 'ZED Bronze', subtitle: 'Zero Defect Zero Effect — MSME', src: '/images/certificates/zed-bronze.jpg' },
]

/* ─── Main Component ─── */
export default function QualityPage() {
  const { navigate } = useRouter()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const [viewing, setViewing] = useState<number | null>(null)

  /* Close viewer on Escape; lock body scroll while open */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setViewing(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => {
    document.body.style.overflow = viewing !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [viewing])
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

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1280px] mx-auto px-5 lg:px-8 pt-[116px] pb-20 md:pb-24">
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
          SECTION 2: CERTIFICATES — view-only gallery (no download)
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24" style={{ background: LIGHT_BG }} onContextMenu={(e) => e.preventDefault()}>
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-3 mb-5 justify-center">
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: NAVY_MID }}>Quality Policy</span>
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold leading-tight tracking-tight mb-4" style={{ color: INK }}>
                Our Certifications
              </h2>
              <p className="text-sm md:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: SLATE }}>
                Internationally accredited and nationally recognised — click any certificate to view the full document.
              </p>
              <div className="inline-flex items-center gap-2 text-xs mt-5 px-3 py-1.5 rounded-full" style={{ background: '#F0F4F8', color: NAVY_MID }}>
                <Lock className="w-3.5 h-3.5" />
                <span>View only — downloading is disabled</span>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {certificates.map((cert, i) => (
              <FadeIn key={cert.title} delay={(i % 4) * 0.06}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${cert.title} certificate`}
                  onClick={() => setViewing(i)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setViewing(i) } }}
                  onContextMenu={(e) => e.preventDefault()}
                  className="h-full bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-[#E8751A]"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden" style={{ background: '#F4F6F9' }}>
                    {/* background-image instead of <img>: no save-as, no drag */}
                    <div
                      className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-[1.03] select-none"
                      style={{ backgroundImage: `url(${cert.src})` }}
                      draggable={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0C2340]/0 group-hover:bg-[#0C2340]/20 transition-colors duration-300">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full p-3" style={{ background: CORAL }}>
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold" style={{ color: INK }}>{cert.title}</h3>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: SLATE }}>{cert.subtitle}</p>
                  </div>
                </div>
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
          CERTIFICATE VIEWER — lightbox, view-only (no download)
          ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {viewing !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8"
            style={{ background: 'rgba(8, 15, 30, 0.94)' }}
            onClick={() => setViewing(null)}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
              <div className="hidden sm:inline-flex items-center gap-2 text-xs text-white/50 px-3 py-1.5 rounded-full border border-white/15">
                <Lock className="w-3.5 h-3.5" />
                <span>View only — download disabled</span>
              </div>
              <button
                onClick={() => setViewing(null)}
                aria-label="Close certificate viewer"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div
              className="relative w-full flex-1 min-h-0 flex items-center justify-center py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={certificates[viewing].src}
                alt={certificates[viewing].title}
                className="max-w-full max-h-full w-auto h-auto object-contain shadow-2xl select-none pointer-events-none"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
            <div className="text-center" onClick={(e) => e.stopPropagation()}>
              <p className="text-white font-semibold text-sm">{certificates[viewing].title}</p>
              <p className="text-white/50 text-xs mt-0.5">{certificates[viewing].subtitle}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}
