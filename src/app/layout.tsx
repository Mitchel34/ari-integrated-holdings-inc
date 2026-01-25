import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ari Integrated Holdings Inc.",
  description: "Building the Strategic Reserve of the Digital Age.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning>
        <div className="layout-wrapper">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
