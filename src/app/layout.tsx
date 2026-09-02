import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import { SiteHeader } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { SiteBackground } from "../components/layout/SiteBackground";
import { AuthSessionProvider } from "../components/auth/AuthSessionProvider";
import { ToastProvider } from "../components/ui/Toast";
import { CONTACT, SITE, getSiteUrl } from "../lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.shortName}`,
  },
  description: SITE.description,
  applicationName: SITE.shortName,
  keywords: [
    "Ari Integrated Holdings",
    "digital asset treasury",
    "Bitcoin treasury",
    "BTC ETH SOL allocation",
    "ARKB",
    "FETH",
    "FSOL",
    "investor relations",
  ],
  // Open Graph / Twitter titles and descriptions resolve from each page's own
  // metadata; only the site-wide fields are set here.
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.legalName,
  alternateName: SITE.shortName,
  url: getSiteUrl(),
  logo: `${getSiteUrl()}/brand/ari-mark-512.png`,
  description: SITE.description,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "investor relations",
      email: CONTACT.email,
      name: `${CONTACT.name}, ${CONTACT.title}`,
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#0A1324",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <AuthSessionProvider>
          <ToastProvider>
            <SiteBackground />
            <div className="layout-wrapper">
              <SiteHeader />
              <main id="main-content" tabIndex={-1}>{children}</main>
              <Footer />
            </div>
          </ToastProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
