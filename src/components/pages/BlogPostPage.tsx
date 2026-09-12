'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, ArrowLeft, Clock, BookOpen, ChevronRight, AlertCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/components/Router'
import { fetchBlogs, type Blog } from '@/lib/api'

/* ─── Helpers (kept in sync with BlogPage) ─── */
function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).length
  const mins = Math.max(1, Math.ceil(words / 200))
  return `${mins} min read`
}

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
  Guide: 'bg-[#1B3A5C]/10 text-[#0D1D3A]',
  Insights: 'bg-violet-100 text-violet-800',
}

/* ─── Markdown renderers — styled to the site's editorial look ─── */
const markdownComponents = {
  h1: (props: React.ComponentProps<'h1'>) => <h2 {...props} className="text-2xl md:text-3xl font-bold text-[#1A1A2E] mt-10 mb-4 leading-tight" style={{ fontFamily: 'Georgia, Cambria, serif' }} />,
  h2: (props: React.ComponentProps<'h2'>) => <h2 {...props} className="text-2xl md:text-3xl font-bold text-[#1A1A2E] mt-10 mb-4 leading-tight" style={{ fontFamily: 'Georgia, Cambria, serif' }} />,
  h3: (props: React.ComponentProps<'h3'>) => <h3 {...props} className="text-xl md:text-2xl font-bold text-[#1A1A2E] mt-8 mb-3 leading-snug" />,
  h4: (props: React.ComponentProps<'h4'>) => <h4 {...props} className="text-lg font-bold text-[#1A1A2E] mt-6 mb-2" />,
  p: (props: React.ComponentProps<'p'>) => <p {...props} className="text-[#374151] leading-[1.85] mb-5 text-[16.5px]" />,
  ul: (props: React.ComponentProps<'ul'>) => <ul {...props} className="list-disc pl-6 mb-5 space-y-2 text-[#374151] leading-relaxed" />,
  ol: (props: React.ComponentProps<'ol'>) => <ol {...props} className="list-decimal pl-6 mb-5 space-y-2 text-[#374151] leading-relaxed" />,
  li: (props: React.ComponentProps<'li'>) => <li {...props} className="pl-1" />,
  blockquote: (props: React.ComponentProps<'blockquote'>) => (
    <blockquote {...props} className="border-l-4 border-[#E8751A] bg-[#F8FAFC] pl-5 pr-4 py-3 my-6 rounded-r-lg text-[#374151] italic leading-relaxed" />
  ),
  a: (props: React.ComponentProps<'a'>) => <a {...props} className="text-[#E8751A] font-medium hover:underline" target="_blank" rel="noopener noreferrer" />,
  strong: (props: React.ComponentProps<'strong'>) => <strong {...props} className="font-bold text-[#1A1A2E]" />,
  hr: () => <hr className="my-8 border-[#E5E7EB]" />,
  code: (props: React.ComponentProps<'code'>) => (
    <code {...props} className="bg-[#F0F4F8] text-[#1B3A5C] rounded px-1.5 py-0.5 text-[14px] font-mono" />
  ),
  img: ({ alt = '', ...props }: React.ComponentProps<'img'>) => (
    <img {...props} alt={alt} className="rounded-xl my-6 w-full object-cover" loading="lazy" />
  ),
}

export default function BlogPostPage({ slug }: { slug: string }) {
  const { navigate } = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchBlogs(true)
      .then(data => { setBlogs(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Fresh page = fresh scroll position
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })

  const post = blogs.find(b => b.slug === slug)

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 pt-[120px] pb-20">
          <Skeleton className="h-6 w-40 mb-8" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-2/3 mb-8" />
          <Skeleton className="h-64 md:h-96 w-full rounded-2xl mb-8" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center px-5 pt-[80px] pb-20">
          <AlertCircle className="w-12 h-12 text-[#CBD5E1] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">Post not found</h1>
          <p className="text-[#6B7280] mb-8">This article may have been unpublished or the link is incorrect.</p>
          <Button
            onClick={() => navigate('blog')}
            className="bg-[#E8751A] hover:bg-[#D4691A] text-white rounded-full px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    )
  }

  // Older/newer navigation (list is newest-first)
  const idx = blogs.findIndex(b => b.id === post.id)
  const newer = idx > 0 ? blogs[idx - 1] : null
  const older = idx >= 0 && idx < blogs.length - 1 ? blogs[idx + 1] : null
  const related = blogs.filter(b => b.id !== post.id).slice(0, 3)

  return (
    <div className="bg-white min-h-screen" ref={scrollRef}>
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #1B3A5C 0%, #1B3A5C 40%, #152D4F 100%)' }}>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 120px)' }} />

        <div className="relative max-w-3xl mx-auto px-5 lg:px-8 pt-[100px] pb-12 md:pb-16">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm mb-10"
          >
            <button onClick={() => navigate('home')} className="text-white/50 hover:text-white/80 transition-colors">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-white/25" />
            <button onClick={() => navigate('blog')} className="text-white/50 hover:text-white/80 transition-colors">Blog</button>
            <ChevronRight className="w-3.5 h-3.5 text-white/25" />
            <span className="text-[#E8751A] font-medium truncate max-w-[180px] sm:max-w-xs">{post.title}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-5 ${TAG_COLORS[categoryTag(post.title)]}`}>
              {categoryTag(post.title)}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.15] mb-6" style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}>
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
              {post.author && (
                <span className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#E8751A] flex items-center justify-center text-white text-[11px] font-bold">
                    {post.author.charAt(0).toUpperCase()}
                  </span>
                  {post.author}
                </span>
              )}
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{formatDate(post.createdAt)}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{readingTime(post.content)}</span>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0 48V24C240 0 480 0 720 24C960 48 1200 48 1440 24V48H0Z" fill="white" /></svg>
        </div>
      </section>

      {/* ═══════════ COVER IMAGE ═══════════ */}
      {post.coverImageUrl && (
        <div className="max-w-4xl mx-auto px-5 lg:px-8 -mt-2 md:-mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl overflow-hidden shadow-lg border border-[#E5E7EB]"
          >
            <img src={post.coverImageUrl} alt={post.title} className="w-full max-h-[420px] object-cover" />
          </motion.div>
        </div>
      )}

      {/* ═══════════ ARTICLE BODY ═══════════ */}
      <article className="max-w-3xl mx-auto px-5 lg:px-8 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {post.excerpt && (
            <p className="text-lg md:text-xl text-[#4B5563] leading-relaxed mb-8 pb-8 border-b border-[#E5E7EB]" style={{ fontFamily: 'Georgia, Cambria, serif' }}>
              {post.excerpt}
            </p>
          )}
          <ReactMarkdown components={markdownComponents}>
            {post.content || ''}
          </ReactMarkdown>
        </motion.div>

        {/* Author box */}
        {post.author && (
          <div className="mt-12 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1B3A5C] flex items-center justify-center text-white font-bold text-lg shrink-0">
              {post.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-0.5">Written by</p>
              <p className="font-bold text-[#1A1A2E]">{post.author}</p>
            </div>
          </div>
        )}

        {/* Prev / Next */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {older ? (
            <button
              onClick={() => navigate('blog-post', { slug: older.slug })}
              className="group text-left rounded-xl border border-[#E5E7EB] hover:border-[#E8751A]/50 p-5 transition-colors bg-white"
            >
              <span className="flex items-center gap-1.5 text-xs text-[#9CA3AF] mb-1.5"><ArrowLeft className="w-3.5 h-3.5" /> Older post</span>
              <span className="font-semibold text-sm text-[#1A1A2E] group-hover:text-[#E8751A] transition-colors line-clamp-2">{older.title}</span>
            </button>
          ) : <span className="hidden sm:block" />}
          {newer ? (
            <button
              onClick={() => navigate('blog-post', { slug: newer.slug })}
              className="group sm:text-right rounded-xl border border-[#E5E7EB] hover:border-[#E8751A]/50 p-5 transition-colors bg-white"
            >
              <span className="flex sm:justify-end items-center gap-1.5 text-xs text-[#9CA3AF] mb-1.5">Newer post <ArrowRight className="w-3.5 h-3.5" /></span>
              <span className="font-semibold text-sm text-[#1A1A2E] group-hover:text-[#E8751A] transition-colors line-clamp-2">{newer.title}</span>
            </button>
          ) : <span className="hidden sm:block" />}
        </div>

        {/* Back to blog */}
        <div className="mt-10 text-center">
          <Button
            onClick={() => navigate('blog')}
            variant="outline"
            className="rounded-full px-6 border-[#E5E7EB] text-[#374151] hover:border-[#E8751A]/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all articles
          </Button>
        </div>
      </article>

      {/* ═══════════ RELATED ═══════════ */}
      {related.length > 0 && (
        <section className="bg-[#FAFBFC] py-14 border-t border-[#E5E7EB]">
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#1A1A2E] mb-6 flex items-center gap-2.5" style={{ fontFamily: 'Georgia, Cambria, serif' }}>
              <BookOpen className="w-5 h-5 text-[#E8751A]" />
              Keep reading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(b => (
                <button
                  key={b.id}
                  onClick={() => navigate('blog-post', { slug: b.slug })}
                  className="group text-left bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-md hover:border-[#E8751A]/40 transition-all"
                >
                  <div className="h-36 overflow-hidden bg-[#F0F4F8]">
                    {b.coverImageUrl ? (
                      <img src={b.coverImageUrl} alt={b.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1B3A5C] to-[#152D4F] flex items-center justify-center">
                        <span className="text-4xl font-bold text-white/15">{b.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-[11px] text-[#9CA3AF] mb-2">
                      <Calendar className="w-3 h-3" />{formatDate(b.createdAt)}
                    </div>
                    <h3 className="font-bold text-sm text-[#1A1A2E] leading-snug line-clamp-2 group-hover:text-[#E8751A] transition-colors">{b.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
