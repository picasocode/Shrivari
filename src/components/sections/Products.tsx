'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { AlertCircle, RefreshCw, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { fetchProducts, type Product } from '@/lib/api'

function ProductCardSkeleton() {
  return (
    <Card className="border-none shadow-md rounded-xl">
      <CardContent className="p-6">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  )
}

export default function Products() {
  const [ltProducts, setLtProducts] = useState<Product[]>([])
  const [htProducts, setHtProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('lt')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const loadProducts = () => {
    setLoading(true)
    setError(null)
    Promise.all([
      fetchProducts('LT Panels'),
      fetchProducts('HT Panels'),
    ])
      .then(([lt, ht]) => {
        setLtProducts(lt)
        setHtProducts(ht)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load products')
        setLoading(false)
      })
  }

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetchProducts('LT Panels'),
      fetchProducts('HT Panels'),
    ])
      .then(([lt, ht]) => {
        if (!cancelled) {
          setLtProducts(lt)
          setHtProducts(ht)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load products')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  const renderProducts = (products: Product[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, i) => {
        const features: string[] = JSON.parse(product.features || '[]')
        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card className="card-hover h-full border-none shadow-md rounded-xl overflow-hidden">
              {/* Gradient header */}
              <div className="h-2 bg-gradient-to-r from-[#0D1B3E] to-[#2196F3]" />
              <CardContent className="p-6">
                <h3 className="text-lg md:text-xl font-medium text-[#0D1B3E] mb-2">
                  {product.name}
                </h3>
                <p className="text-[#718096] text-sm leading-relaxed mb-4">
                  {product.description}
                </p>

                {/* Features accordion */}
                {features.length > 0 && (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="features" className="border-[#E8ECF0]">
                      <AccordionTrigger className="text-sm text-[#2196F3] hover:no-underline py-2">
                        View Features
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-[#2D3748]">
                              <CheckCircle className="w-4 h-4 text-[#2196F3] mt-0.5 shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )

  return (
    <section id="products" className="py-16 md:py-24 bg-[#F8F9FA]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-[28px] md:text-[40px] font-semibold text-[#0D1B3E] mb-4">
            Our Products
          </h2>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-[#718096] text-base md:text-lg max-w-2xl mx-auto">
            High-quality LT and HT panel boards manufactured with ISI certification
          </p>
        </motion.div>

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-[#718096] mx-auto mb-4" />
            <p className="text-[#718096] mb-4">{error}</p>
            <Button variant="outline" onClick={loadProducts}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="flex gap-2">
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {/* Products content */}
        {!loading && !error && (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-center mb-8">
              <TabsList className="bg-[#E8ECF0]">
                <TabsTrigger
                  value="lt"
                  className="data-[state=active]:bg-[#2196F3] data-[state=active]:text-white px-6"
                >
                  LT Panels
                </TabsTrigger>
                <TabsTrigger
                  value="ht"
                  className="data-[state=active]:bg-[#2196F3] data-[state=active]:text-white px-6"
                >
                  HT Panels
                </TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              <TabsContent value="lt" forceMount={activeTab === 'lt'} hidden={activeTab !== 'lt'}>
                <motion.div
                  key="lt"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderProducts(ltProducts)}
                </motion.div>
              </TabsContent>
              <TabsContent value="ht" forceMount={activeTab === 'ht'} hidden={activeTab !== 'ht'}>
                <motion.div
                  key="ht"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderProducts(htProducts)}
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        )}
      </div>
    </section>
  )
}
