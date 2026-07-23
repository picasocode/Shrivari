'use client'

import { useState } from 'react'
import { RouterProvider, useRouter } from '@/components/Router'
import { AuthProvider, useAuth } from '@/lib/auth'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import HomePage from '@/components/pages/HomePage'
import AboutPage from '@/components/pages/AboutPage'
import ProductsPage from '@/components/pages/ProductsPage'
import ServicesPage from '@/components/pages/ServicesPage'
import ServiceDetailPage from '@/components/pages/ServiceDetailPage'
import ClientsPage from '@/components/pages/ClientsPage'
import ProjectsPage from '@/components/pages/ProjectsPage'
import TestimonialsPage from '@/components/pages/TestimonialsPage'
import BlogPage from '@/components/pages/BlogPage'
import ContactPage from '@/components/pages/ContactPage'
import SectorsPage from '@/components/pages/SectorsPage'
import CareersPage from '@/components/pages/CareersPage'
import TeamPage from '@/components/pages/TeamPage'
import AdminPanel from '@/components/admin/AdminPanel'
import LoginPage from '@/components/pages/LoginPage'

function AppContent() {
  const [showAdmin, setShowAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const { router } = useRouter()
  const { user, loading } = useAuth()

  const handleAdminClick = () => {
    if (user) {
      setShowAdmin(true)
    } else {
      setShowLogin(true)
    }
  }

  const pages: Record<string, React.ReactNode> = {
    home: <HomePage />,
    about: <AboutPage />,
    products: <ProductsPage />,
    services: <ServicesPage />,
    'service-detail': <ServiceDetailPage slug={router.params.slug || ''} />,
    clients: <ClientsPage />,
    projects: <ProjectsPage />,
    testimonials: <TestimonialsPage />,
    blog: <BlogPage />,
    contact: <ContactPage />,
    sectors: <SectorsPage />,
    careers: <CareersPage />,
    team: <TeamPage />,
  }

  // Don't render until auth is checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-3 border-[#1F2937] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onAdminClick={handleAdminClick}
        isLoggedIn={!!user}
        onLogout={() => { setShowAdmin(false); setShowLogin(false) }}
      />
      <main className="flex-1">{pages[router.page] || <HomePage />}</main>
      <Footer />
      {showLogin && !user && (
        <LoginPage onClose={() => setShowLogin(false)} />
      )}
      {showAdmin && user && (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      )}
    </div>
  )
}

export default function Home() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </RouterProvider>
  )
}
