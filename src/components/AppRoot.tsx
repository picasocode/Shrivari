'use client'

import { RouterProvider, useRouter } from '@/components/Router'
import { AuthProvider, useAuth } from '@/lib/auth'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import HomePage from '@/components/pages/HomePage'
import AboutPage from '@/components/pages/AboutPage'
import ProductsPage from '@/components/pages/ProductsPage'
import ManufacturingPage from '@/components/pages/ManufacturingPage'
import ServicesPage from '@/components/pages/ServicesPage'
import ServiceDetailPage from '@/components/pages/ServiceDetailPage'
import ClientsPage from '@/components/pages/ClientsPage'
import ProjectsPage from '@/components/pages/ProjectsPage'
import TestimonialsPage from '@/components/pages/TestimonialsPage'
import BlogPage from '@/components/pages/BlogPage'
import BlogPostPage from '@/components/pages/BlogPostPage'
import ContactPage from '@/components/pages/ContactPage'
import SectorsPage from '@/components/pages/SectorsPage'
import CareersPage from '@/components/pages/CareersPage'
import TeamPage from '@/components/pages/TeamPage'
import QualityPage from '@/components/pages/QualityPage'
import AdminPanel from '@/components/admin/AdminPanel'
import LoginPage from '@/components/pages/LoginPage'

function AppContent() {
  const { router, goHome } = useRouter()
  const { user, loading } = useAuth()

  const pages: Record<string, React.ReactNode> = {
    home: <HomePage />,
    about: <AboutPage />,
    products: <ProductsPage />,
    manufacturing: <ManufacturingPage />,
    services: <ServicesPage />,
    'service-detail': <ServiceDetailPage slug={router.params.slug || ''} />,
    clients: <ClientsPage />,
    projects: <ProjectsPage />,
    testimonials: <TestimonialsPage />,
    blog: <BlogPage />,
    'blog-post': <BlogPostPage slug={router.params.slug || ''} />,
    contact: <ContactPage />,
    sectors: <SectorsPage />,
    careers: <CareersPage />,
    team: <TeamPage />,
    quality: <QualityPage />,
    // /admin deep link: logged-in users get the panel, everyone else the login/setup screen
    admin: user
      ? <AdminPanel onClose={goHome} />
      : <LoginPage onClose={goHome} />,
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
      <Navbar />
      <main className="flex-1">{pages[router.page] || <HomePage />}</main>
      <Footer />
    </div>
  )
}

export default function AppRoot({ initialPath }: { initialPath?: string }) {
  return (
    <RouterProvider initialPath={initialPath}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </RouterProvider>
  )
}
