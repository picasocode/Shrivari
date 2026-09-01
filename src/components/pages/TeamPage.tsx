'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  ChevronRight, ArrowRight, ChevronDown, Clock, Users, Building2, Globe,
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

/* ─── Leadership data — photos matched to team members (order = seniority) ─── */
const leaders = [
  { name: 'Mr. Rengarajan', designation: 'Managing Director', photo: '/images/team/team-rangarajan.jpg' },
  { name: 'Mr. Sivagami Nathan', designation: 'Executive Director', photo: '/images/team/team-sivagaminathan.jpg' },
  { name: 'Mr. Rakesh Kumar', designation: 'Operations Director', photo: '/images/team/team-rakesh-kumar.jpg' },
  { name: 'Mr. Ambalarajan', designation: 'Director - Projects', photo: '/images/team/team-ambalarajan.jpg' },
  { name: 'Mr. Anand Purushothaman', designation: 'Technical Director', photo: '/images/team/team-anand-purushothaman.jpg' },
  { name: 'Mr. Manjari', designation: 'Project Director', photo: '/images/team/team-manjari.jpg' },
  { name: 'Mrs. Harini', designation: 'Director', photo: '/images/team/team-harini.jpg' },
]

/* ─── Main Component ─── */
export default function TeamPage() {
  const { navigate } = useRouter()

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          SECTION 1: HERO — Clean editorial, navy bg, coral hairline only
          ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, ${NAVY_MID} 50%, ${NAVY} 100%)` }}>
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }} />
          {/* Single subtle navy glow */}
          <div className="absolute top-[10%] right-[5%] w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
        </motion.div>

        {/* Content */}
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
            <span className="text-white/70">Team</span>
          </motion.div>

          {/* Centered editorial headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.05]">
              Leadership that
              <br />
              <span style={{ color: CORAL }}>powers excellence.</span>
            </h1>

            {/* Coral hairline divider — the ONLY coral element in hero */}
            <div className="w-16 h-[2px] mb-6" style={{ background: CORAL }} />

            <p className="text-sm md:text-base text-white/45 max-w-xl leading-relaxed">
              Meet the people behind SVEPL&apos;s 29-year journey — from managing EHV projects to pioneering renewable energy solutions across South India.
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
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
          SECTION 2: LEADERSHIP GRID — clean centered cards:
          circular photo + name + designation (reference format)
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: LIGHT_BG }}>
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 relative z-10">

          {/* Centered section intro */}
          <FadeIn>
            <div className="text-center mb-14 md:mb-16">
              <div className="inline-flex items-center gap-3 mb-5 justify-center">
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: NAVY_MID }}>Our Leadership</span>
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold leading-tight tracking-tight mb-4" style={{ color: INK }}>
                Introducing the Leadership Team
                <br className="hidden md:block" />
                {' '}at Shri Vaari Electricals
              </h2>
              <p className="text-sm md:text-base max-w-xl mx-auto leading-relaxed" style={{ color: SLATE }}>
                Seasoned professionals with deep expertise across electrical engineering, operations, finance, and renewable energy — steering SVEPL&apos;s growth since 1998.
              </p>
            </div>
          </FadeIn>

          {/* Leadership grid — 3 columns, centered cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {leaders.map((leader, i) => (
              <FadeIn key={leader.name} delay={(i % 3) * 0.08}>
                <div className="group flex flex-col items-center text-center max-w-[440px] mx-auto">
                  {/* Circular portrait — square source, round mask */}
                  <div className="relative mb-5 w-full max-w-[200px] lg:max-w-[240px] aspect-square">
                    <div className="h-full w-full overflow-hidden rounded-full ring-1 ring-slate-200/80 shadow-sm">
                      <img
                        src={leader.photo}
                        alt={leader.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                      />
                    </div>
                    {/* Coral hairline under portrait on hover — subtle brand accent */}
                    <div
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-[2px] w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: CORAL }}
                    />
                  </div>

                  {/* Name */}
                  <h3 className="text-xl lg:text-2xl font-bold leading-snug mb-1.5" style={{ color: INK }}>
                    {leader.name}
                  </h3>
                  {/* Designation */}
                  <p className="text-base lg:text-lg leading-relaxed" style={{ color: SLATE }}>
                    {leader.designation}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3: CTA — navy bg, single coral button
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
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Careers</span>
                <div className="w-8 h-[2px]" style={{ background: CORAL }} />
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                Join our team.
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-white/55 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Be part of a 364+ strong team that&apos;s powering India&apos;s infrastructure. We offer challenging projects, growth opportunities, and a culture of excellence.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={() => navigate('careers')}
                  className="rounded-xl px-8 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ background: CORAL, color: '#FFFFFF' }}
                >
                  View Open Positions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={() => navigate('about')}
                  variant="outline"
                  className="rounded-xl px-8 h-12 text-base font-semibold backdrop-blur-sm transition-all duration-300 border-white/25 text-white hover:bg-white/10"
                  style={{ background: 'transparent', color: '#FFFFFF' }}
                >
                  Learn About SVEPL
                </Button>
              </div>
            </FadeIn>

            {/* Mini stats row — clean */}
            <FadeIn delay={0.4}>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-10 pt-8 border-t border-white/10">
                {[
                  { label: '29+ Years', icon: Clock },
                  { label: '364+ Team', icon: Users },
                  { label: '8 Offices', icon: Building2 },
                  { label: '6 Countries', icon: Globe },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-white/50">
                    <item.icon className="w-4 h-4" strokeWidth={1.5} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}
