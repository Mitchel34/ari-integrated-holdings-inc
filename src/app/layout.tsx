import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteHeader } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { AuthSessionProvider } from "../components/auth/AuthSessionProvider";
import { CryptoBackground } from "../components/auth/CryptoBackground";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ari Integrated Holdings Inc.",
  description: "Ari Integrated Holdings Inc. is building the strategic reserve of the digital age.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning>
        <AuthSessionProvider>
          <CryptoBackground />
          <div className="layout-wrapper">
            <SiteHeader />
            <main>{children}</main>
            <Footer />
          </div>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
