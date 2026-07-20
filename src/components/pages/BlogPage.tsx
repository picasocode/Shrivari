'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Calendar, User, ArrowRight, Clock, BookOpen, ChevronRight, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useRouter } from '@/components/Router'
import { fetchBlogs, type Blog } from '@/lib/api'

/* ─── Fade-in observer ─── */
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Estimate reading time ─── */
function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).length
  const mins = Math.max(1, Math.ceil(words / 200))
  return `${mins} min read`
}

/* ─── Category tag pool (derived from title keywords) ─── */
function categoryTag(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('solar') || t.includes('energy') || t.includes('power')) return 'Energy'
  if (t.includes('safety') || t.includes('protection')) return 'Safety'
  if (t.includes('industr') || t.includes('manufactur')) return 'Industry'
  if (t.includes('smart') || t.includes('automat') || t.includes('iot')) return 'Technology'
  if (t.includes('tips') || t.includes('guide') || t.includes('how')) return 'Guide'
  return 'Insights'
}

const TAG_COLORS: Record<string, string> = {
  Energy: 'bg-amber-100 text-amber-800',
  Safety: 'bg-rose-100 text-rose-800',
  Industry: 'bg-slate-100 text-slate-700',
  Technology: 'bg-cyan-100 text-cyan-800',
  Guide: 'bg-[#334155]/10 text-[#475569]',
  Insights: 'bg-violet-100 text-violet-800',
}

export default function BlogPage() {
  const { navigate } = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    fetchBlogs(true)
      .then(data => { setBlogs(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })

  const featured = blogs[0]
  const rest = blogs.slice(1)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) { setSubscribed(true); setEmail('') }
  }

  return (
    <>
      {/* ════════════════════════════════════════════
          HERO — Editorial Masthead
      ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #efefef 0%, #efefef 40%, #d4d4d4 100%)' }}>
        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 120px)' }} />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 pt-[100px] pb-16 md:pb-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-8">
              <button onClick={() => navigate('home')} className="text-white/50 hover:text-white/80 transition-colors">Home</button>
              <ChevronRight className="w-3.5 h-3.5 text-white/25" />
              <span className="text-[#E8751A] font-medium">Blog</span>
            </div>

            {/* Masthead title */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-24 h-[2px] bg-[#E8751A] mb-6 origin-left"
              />
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}>
                Insights &amp; Knowledge
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-40 h-[2px] bg-[#E8751A] mt-6 origin-right"
              />
              <p className="text-white/60 mt-5 text-base md:text-lg max-w-xl">
                Thought leadership, industry trends, and expert perspectives from the world of electrical engineering.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0 48V24C240 0 480 0 720 24C960 48 1200 48 1440 24V48H0Z" fill="white" /></svg>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURED POST — Hero Card
      ════════════════════════════════════════════ */}
      <section className="bg-white pt-4 pb-10 md:pb-16">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          {loading ? (
            <Skeleton className="h-[340px] md:h-[420px] rounded-2xl" />
          ) : featured ? (
            <FadeIn>
              <Card
                className="overflow-hidden rounded-2xl border-0 shadow-lg cursor-pointer group"
                onClick={() => setSelectedBlog(featured)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Image side */}
                  <div className="relative h-64 md:h-auto md:min-h-[380px] overflow-hidden">
                    {featured.coverImageUrl ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${featured.coverImageUrl})` }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#efefef] to-[#d4d4d4] flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white/20" />
                      </div>
                    )}
                    {/* Featured badge */}
                    <div className="absolute top-4 left-4 bg-[#E8751A] text-white text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Featured
                    </div>
                  </div>
                  {/* Content side */}
                  <CardContent className="p-6 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-sm text-[#4B5563] mb-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${TAG_COLORS[categoryTag(featured.title)]}`}>
                        {categoryTag(featured.title)}
                      </span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(featured.createdAt)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{readingTime(featured.content)}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] mb-3 leading-tight" style={{ fontFamily: 'Georgia, Cambria, serif' }}>
                      {featured.title}
                    </h2>
                    <p className="text-[#4B5563] leading-relaxed mb-5 line-clamp-3">{featured.excerpt}</p>
                    <div className="flex items-center justify-between">
                      {featured.author && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#334155] flex items-center justify-center text-white text-sm font-bold">
                            {featured.author.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-[#1A1A2E]">{featured.author}</span>
                        </div>
                      )}
                      <span className="flex items-center gap-1.5 text-[#E8751A] font-semibold text-sm group-hover:gap-2.5 transition-all">
                        Read More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </FadeIn>
          ) : null}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          BLOG GRID — Magazine Layout
      ════════════════════════════════════════════ */}
      <section className="bg-[#FAFBFC] py-14 md:py-20">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-72 rounded-xl" />)}
            </div>
          ) : rest.length === 0 && !featured ? (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-[#CBD5E1] mx-auto mb-4" />
              <p className="text-[#4B5563] text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : rest.length === 0 ? null : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {rest.map((b, i) => {
                const isEven = i % 2 === 0
                return (
                  <FadeIn key={b.id} delay={i * 0.07}>
                    <Card
                      className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm card-hover cursor-pointer group h-full"
                      onClick={() => setSelectedBlog(b)}
                    >
                      <div className={`grid grid-cols-1 ${isEven ? 'sm:grid-cols-[200px_1fr]' : 'sm:grid-cols-[1fr_200px]'} h-full`}>
                        {/* Image */}
                        <div className={`relative h-48 sm:h-auto overflow-hidden ${!isEven ? 'sm:order-2' : ''}`}>
                          {b.coverImageUrl ? (
                            <div
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                              style={{ backgroundImage: `url(${b.coverImageUrl})` }}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#F0F4F8] to-[#E2E8F0] flex items-center justify-center">
                              <span className="text-4xl font-bold text-[#334155]/10">{b.title.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        {/* Content */}
                        <CardContent className={`p-5 md:p-6 flex flex-col justify-between ${!isEven ? 'sm:order-1' : ''}`}>
                          <div>
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${TAG_COLORS[categoryTag(b.title)]}`}>
                                {categoryTag(b.title)}
                              </span>
                              <span className="flex items-center gap-1 text-[11px] text-[#9CA3AF]"><Clock className="w-3 h-3" />{readingTime(b.content)}</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#1A1A2E] mb-2 leading-snug line-clamp-2 group-hover:text-[#334155] transition-colors">
                              {b.title}
                            </h3>
                            <p className="text-[#4B5563] text-sm leading-relaxed line-clamp-2">{b.excerpt}</p>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F0F4F8]">
                            <div className="flex items-center gap-3 text-sm text-[#9CA3AF]">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(b.createdAt)}</span>
                              {b.author && <span className="flex items-center gap-1"><User className="w-3 h-3" />{b.author}</span>}
                            </div>
                            <span className="flex items-center gap-1 text-[#E8751A] font-semibold text-sm group-hover:gap-2 transition-all">
                              Read <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </span>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </FadeIn>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          NEWSLETTER CTA
      ════════════════════════════════════════════ */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <FadeIn>
            <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #efefef 0%, #d4d4d4 60%, #3A6090 100%)' }}>
              {/* Decorative circles */}
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full border-[24px] border-white/[0.04]" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border-[20px] border-white/[0.04]" />

              <div className="relative px-6 py-12 md:px-14 md:py-16 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                    <Mail className="w-5 h-5 text-[#E8751A]" />
                    <span className="text-[#E8751A] text-sm font-semibold uppercase tracking-wider">Newsletter</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Georgia, Cambria, serif' }}>
                    Stay Updated
                  </h2>
                  <p className="text-white/60 text-sm md:text-base max-w-md">
                    Get the latest insights, industry news, and expert articles delivered straight to your inbox. No spam, unsubscribe anytime.
                  </p>
                </div>

                <div className="w-full md:w-auto md:min-w-[380px]">
                  {subscribed ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-5 text-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#2A5A8A] flex items-center justify-center mx-auto mb-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      </div>
                      <p className="text-white font-semibold">You&apos;re subscribed!</p>
                      <p className="text-white/50 text-sm mt-1">Welcome to our newsletter.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="flex gap-3">
                      <Input
                        type="email"
                        required
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 h-12 rounded-xl focus:border-[#E8751A] focus:ring-[#E8751A]/30"
                      />
                      <Button
                        type="submit"
                        className="bg-[#E8751A] hover:bg-[#D4691A] text-white h-12 px-6 rounded-xl font-semibold shrink-0 transition-colors"
                      >
                        Subscribe
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          BLOG READING DIALOG
      ════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedBlog && (
          <Dialog open={!!selectedBlog} onOpenChange={(open) => { if (!open) setSelectedBlog(null) }}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl p-0">
              {/* Dialog header with gradient */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-[#efefef] to-[#d4d4d4] px-6 pt-6 pb-4 -mx-1 -mt-1 rounded-t-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl md:text-2xl font-bold text-white pr-8 leading-tight" style={{ fontFamily: 'Georgia, Cambria, serif' }}>
                    {selectedBlog.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-4 text-sm text-white/60 mt-3">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{formatDate(selectedBlog.createdAt)}</span>
                  {selectedBlog.author && <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{selectedBlog.author}</span>}
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{readingTime(selectedBlog.content)}</span>
                </div>
              </div>

              <div className="px-6 pb-6 pt-4">
                {selectedBlog.coverImageUrl && (
                  <div className="h-48 md:h-56 rounded-xl bg-cover bg-center mb-6" style={{ backgroundImage: `url(${selectedBlog.coverImageUrl})` }} />
                )}
                <div className="prose prose-sm max-w-none">
                  {selectedBlog.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="text-[#374151] leading-relaxed mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}
