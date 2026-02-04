import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/src/components/home/navigation/header";
import Footer from "@/src/components/home/navigation/footer";
import FloatingContactButtons from "@/src/components/home/navigation/floating-button";
import Script from "next/script";
import ClientTracker from "@/src/components/home/navigation/client-track";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://kupika.in/"),
  title: "Kupika Ayurveda | Natural & Authentic Ayurvedic Products",
  description:
    "Kupika Ayurveda offers authentic Ayurvedic products crafted with natural ingredients to support holistic health, wellness, and daily vitality.",
  keywords:
    "Kupika Ayurveda, Ayurvedic Products, Natural Ayurveda, Herbal Supplements, Holistic Wellness, Authentic Ayurveda, Indian Ayurveda, Health Supplements",
  authors: [{ name: "Kupika Ayurveda", url: "https://kupika.in/" }],
  creator: "Kupika Ayurveda",
  openGraph: {
    title: "Kupika Ayurveda | Natural & Authentic Ayurvedic Products",
    description:
      "Kupika Ayurveda offers authentic Ayurvedic products crafted with natural ingredients to support holistic health, wellness, and daily vitality.",
    url: "https://kupika.in/",
    type: "website",
    siteName: "Kupika Ayurveda",
    images: [
      {
        url: "/home/header/logo.png",
        width: 1200,
        height: 630,
        alt: "Kupika Ayurveda Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@kupikaayurveda",
    title: "Kupika Ayurveda | Natural & Authentic Ayurvedic Products",
    description:
      "Discover authentic Ayurvedic products made with natural ingredients to support holistic health and wellness.",
    images: ["/home/header/logo.png"],
  },
  icons: {
    icon: "/home/header/logo.png",
    apple: "/home/header/logo.png",
  },
  alternates: {
    canonical: "https://kupika.in/",
    languages: {
      en: "https://kupika.in/",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <ClientTracker />
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
