'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Calendar, User, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { fetchBlogs, type Blog } from '@/lib/api'

function BlogCardSkeleton() {
  return (
    <Card className="border-none shadow-md rounded-xl overflow-hidden">
      <Skeleton className="h-40" />
      <CardContent className="p-5">
        <Skeleton className="h-5 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  )
}

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const loadBlogs = () => {
    setLoading(true)
    setError(null)
    fetchBlogs(true)
      .then((data) => {
        setBlogs(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load blog posts')
        setLoading(false)
      })
  }

  useEffect(() => {
    let cancelled = false
    fetchBlogs(true)
      .then((data) => {
        if (!cancelled) {
          setBlogs(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load blog posts')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <section id="blog" className="py-16 md:py-24 bg-[#F8F9FA]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-[28px] md:text-[40px] font-semibold text-[#0D1B3E] mb-4">
            Latest Insights
          </h2>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-[#718096] text-base md:text-lg max-w-2xl mx-auto">
            Stay updated with the latest trends and knowledge in electrical engineering
          </p>
        </motion.div>

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-[#718096] mx-auto mb-4" />
            <p className="text-[#718096] mb-4">{error}</p>
            <Button variant="outline" onClick={loadBlogs}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Blog cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, i) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              >
                <Card className="card-hover h-full border-none shadow-md rounded-xl overflow-hidden flex flex-col">
                  {/* Cover image or gradient */}
                  <div className="h-40 bg-gradient-to-br from-[#0D1B3E] to-[#2196F3] relative flex items-center justify-center">
                    <span className="text-white/20 text-6xl font-bold">
                      {blog.title.charAt(0)}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg md:text-xl font-medium text-[#0D1B3E] mb-2 leading-tight line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-[#718096] text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#E8ECF0]">
                      <div className="flex items-center gap-3 text-xs text-[#718096]">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{blog.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#2196F3] hover:text-[#1E88E5] text-xs p-0 h-auto"
                        onClick={() => setSelectedBlog(blog)}
                      >
                        Read More
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Blog detail dialog */}
        <Dialog
          open={!!selectedBlog}
          onOpenChange={(open) => !open && setSelectedBlog(null)}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#0D1B3E] text-xl md:text-2xl">
                {selectedBlog?.title}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-3 text-sm text-[#718096]">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {selectedBlog?.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedBlog?.createdAt && formatDate(selectedBlog.createdAt)}
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="prose prose-sm max-w-none text-[#2D3748] leading-relaxed mt-4">
              {selectedBlog?.content?.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-3">
                  {paragraph}
                </p>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
