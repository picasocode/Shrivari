import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://tech.shrivaarielectricals.com";

/* Primary keywords as supplied by the client, plus supporting long-tail
   terms that match the company's actual service lines and location. */
const SEO_KEYWORDS = [
  // ── Primary (client-supplied) ──
  "Electrical EPC Company",
  "Electrical Infrastructure Solutions",
  "HT LT Panel Manufacturer",
  "Substation EPC Contractor",
  "Electrical Engineering Company",
  "Industrial Electrification Company",
  "AIS GIS Substation Solutions",
  "Electrical Testing Commissioning",
  "Solar EPC Company",
  "Utility Liaison Services",
  // ── Supporting ──
  "LT Panel Manufacturing",
  "HT Panel Manufacturing",
  "Electrical Panel Manufacturer India",
  "Electrical Contractors in Chennai",
  "Industrial Electrical Contractors Tamil Nadu",
  "Turnkey Electrical Projects",
  "Transformer Erection Services",
  "Solar Rooftop EPC",
  "Solar Power Plant Installation",
  "Annual Maintenance Contract Electrical",
  "Power Distribution Panels",
  "VCB Panels",
  "PCC MCC Panels",
  "Electrical Design to Commissioning",
  "33kV Substation",
  "Shri Vaari Electricals",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title:
    "Shri Vaari Electricals Pvt Ltd | Electrical EPC Company, HT LT Panel Manufacturer & Solar EPC",
  description:
    "Shri Vaari Electricals Pvt Ltd — a trusted Electrical EPC company in Chennai offering electrical infrastructure solutions, HT/LT panel manufacturing, substation EPC contracting (AIS & GIS), industrial electrification, electrical testing & commissioning, solar EPC and utility liaison services. Concept to commissioning since 1997.",
  keywords: SEO_KEYWORDS,
  applicationName: "Shri Vaari Electricals",
  authors: [{ name: "Shri Vaari Electricals Pvt Ltd" }],
  creator: "Shri Vaari Electricals Pvt Ltd",
  publisher: "Shri Vaari Electricals Pvt Ltd",
  category: "Electrical Engineering",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Shri Vaari Electricals Pvt Ltd",
    title:
      "Shri Vaari Electricals Pvt Ltd | Electrical EPC Company, HT LT Panel Manufacturer & Solar EPC",
    description:
      "Electrical EPC company delivering HT/LT panels, substation EPC (AIS & GIS), industrial electrification, testing & commissioning, solar EPC and utility liaison — concept to commissioning.",
    images: [
      {
        url: "/images/logo.png",
        width: 700,
        height: 186,
        alt: "Shri Vaari Electricals Pvt Ltd logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Shri Vaari Electricals Pvt Ltd | Electrical EPC Company & HT LT Panel Manufacturer",
    description:
      "Electrical EPC company delivering HT/LT panels, substation EPC, industrial electrification, testing & commissioning, solar EPC and utility liaison services.",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/* JSON-LD structured data — helps Google associate the brand with its
   service lines (EPC, panels, substations, solar) and Chennai location. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ElectricalContractor",
  name: "Shri Vaari Electricals Pvt Ltd",
  alternateName: "Shri Vaari Electricals",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  image: `${SITE_URL}/images/logo.png`,
  description:
    "Electrical EPC company offering HT/LT panel manufacturing, substation EPC (AIS & GIS), industrial electrification, electrical testing & commissioning, solar EPC, transformer erection and utility liaison services.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  areaServed: "India",
  sameAs: [
    "https://www.linkedin.com/company/shri-vaari-electricals-pvt-ltd/",
    "https://www.instagram.com/shrivaari_electricals",
    "https://www.youtube.com/watch?v=PMmcF3lzoKk",
  ],
  knowsAbout: SEO_KEYWORDS,
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Electrical EPC Contracts" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "HT & LT Panel Manufacturing" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Substation EPC — AIS & GIS" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Industrial Electrification" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Electrical Testing & Commissioning" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Solar EPC" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Transformer Erection" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Utility Liaison Services" } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
