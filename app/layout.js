import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/src/components/home/navigation/header";
import Footer from "@/src/components/home/navigation/footer";
import FloatingContactButtons from "@/src/components/home/navigation/floating-button";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Hardcoded SEO */}
        <title>Kupika Ayurveda | Natural & Authentic Ayurvedic Products</title>
        <meta
          name="description"
          content="Kupika Ayurveda offers authentic Ayurvedic products crafted with natural ingredients to support holistic health and wellness."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}

        {/* Google Sign-In */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />

        <FloatingContactButtons />
        <Footer />
      </body>
    </html>
  );
}
