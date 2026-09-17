'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  ChevronRight, ChevronDown, ArrowRight, ShieldCheck,
  BadgeCheck, Leaf,
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
]

/* ─── Main Component ─── */
export default function QualityPage() {
  const { navigate } = useRouter()
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
            </div>
          </FadeIn>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {policyPillars.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <FadeIn key={pillar.title} delay={(i % 3) * 0.08}>
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

    </>
  )
}
