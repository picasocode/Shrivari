'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/components/Router'

const slides = [
  {
    image: '/images/hero-1.jpg',
    title: 'Powering India\'s Electrical Infrastructure',
    subtitle: 'EPC Solutions upto 400KV',
    desc: 'From design to commissioning — comprehensive electrical systems for industries across India with over two decades of excellence.',
  },
  {
    image: '/images/hero-2.jpg',
    title: 'Precision-Built Electrical Panels',
    subtitle: 'LT & HT Panels — 415V to 33KV',
    desc: 'State-of-the-art manufacturing facility producing world-class LT & HT panels, switchboards, and control systems.',
  },
  {
    image: '/images/hero-3.jpg',
    title: 'Trusted Engineering Excellence',
    subtitle: '3000+ Projects Delivered Successfully',
    desc: 'Leading industries rely on us for transmission & distribution, switchyard construction, and electrical services.',
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const { navigate } = useRouter()

  const next = useCallback(() => setCurrent(p => (p + 1) % slides.length), [])
  const prev = useCallback(() => setCurrent(p => (p - 1 + slides.length) % slides.length), [])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden pt-[100px]">
      {/* BG Images — crossfade with CSS only, no flash */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }} />
        </div>
      ))}
      {/* Subtle neutral dark overlay for text readability (no blue tint) */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-5 lg:px-8 w-full py-16 md:py-24">
        <div className="max-w-xl">
          <span
            key={`sub-${current}`}
            className="inline-block text-[#E8751A] text-sm font-semibold mb-4 tracking-wide animate-fade-in-up"
          >
            {slides[current].subtitle}
          </span>
          <h1
            key={`title-${current}`}
            className="text-[32px] md:text-[42px] lg:text-[52px] font-bold text-white leading-tight mb-5 tracking-tight animate-fade-in-up"
          >
            {slides[current].title}
          </h1>
          <p
            key={`desc-${current}`}
            className="text-white/70 text-base md:text-lg mb-8 leading-relaxed max-w-md animate-fade-in-up"
          >
            {slides[current].desc}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => navigate('services')}
              className="bg-[#E8751A] hover:bg-[#D4691A] text-white h-12 px-7 text-sm font-semibold rounded-md transition-colors group"
            >
              Our Services <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button
              size="lg"
              onClick={() => navigate('contact')}
              className="bg-white/15 hover:bg-white/25 text-white h-12 px-7 text-sm font-semibold rounded-md backdrop-blur-sm border border-white/20 transition-colors"
            >
              Contact Us
            </Button>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-8 right-5 lg:right-8 flex items-center gap-3">
          <button onClick={prev} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors" aria-label="Prev">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-500 ${i === current ? 'w-6 h-1.5 bg-[#E8751A]' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button onClick={next} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors" aria-label="Next">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
