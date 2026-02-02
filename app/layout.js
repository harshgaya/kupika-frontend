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

export const metadata = {
  metadataBase: new URL("https://softplix.com/"),
  title: "SoftPlix: Website & Mobile App Development Company",
  description:
    "SoftPlix provides innovative software solutions to empower businesses worldwide with cutting-edge technology and exceptional service.",
  keywords:
    "SoftPlix, Software Solutions, Business Technology, Innovative Software, IT Services,Mobile App Development Company, Website Development Company, Custom Software Development, Technology Consulting",
  authors: [{ name: "SoftPlix", url: "https://softplix.com/" }],
  creator: "SoftPlix: Website & Mobile App Development Company",
  openGraph: {
    title: "SoftPlix: Website & Mobile App Development Company",
    description:
      "SoftPlix provides innovative software solutions to empower businesses worldwide with cutting-edge technology and exceptional service.",
    url: "https://softplix.com/",
    type: "website",
    siteName: "SoftPlix: Website & Mobile App Development Company",
    images: [
      {
        url: "/home/header/softplix-logo.png",
        width: 1200,
        height: 630,
        alt: "SoftPlix Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "Kupika",
    title: "Kupika Ayurveda | Natural & Authentic Ayurvedic Products",
    description:
      "Kupika Ayurveda offers authentic Ayurvedic products crafted with natural ingredients to support holistic health and wellness.",
    images: ["/home/header/softplix-logo.png"],
  },
  icons: {
    icon: "/home/header/softplix-logo.png",
    apple: "/home/header/softplix-logo.png",
  },
  alternates: {
    canonical: "https://kupkika.in/",
    languages: {
      en: "https://kupkika.in/",
    },
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
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
