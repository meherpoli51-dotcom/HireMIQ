import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HireMIQ — AI Recruitment Platform for India | Free for 10 JDs",
    template: "%s | HireMIQ",
  },
  description:
    "HireMIQ is India's AI recruitment platform. Analyze job descriptions in 60 seconds, generate Boolean search strings for Naukri & LinkedIn, score candidates, and automate outreach. Free for 10 JDs/month. Pro at ₹499/month.",
  metadataBase: new URL("https://hiremiq.com"),
  openGraph: {
    title: "HireMIQ — AI Recruitment Platform | Free for 10 JDs/month",
    description:
      "Analyze JDs in 60 seconds. Generate Naukri & LinkedIn Boolean strings. Score candidates with AI. Built by recruiters with 15+ years in India's staffing industry.",
    url: "https://hiremiq.com",
    siteName: "HireMIQ",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireMIQ — AI Recruitment Platform for India",
    description:
      "8 AI recruitment modules. JD analysis in 60s. Boolean search for Naukri & LinkedIn. Candidate scoring. Free for 10 JDs/month.",
    creator: "@hiremiq",
  },
  keywords: [
    "AI recruitment platform India",
    "Boolean search generator Naukri",
    "LinkedIn Boolean search tool",
    "job description analyzer",
    "candidate screening AI",
    "recruitment automation software",
    "staffing agency software India",
    "recruiter tools free",
    "HR tech India",
    "AI hiring platform",
    "candidate matching software",
    "recruitment intelligence",
    "JD analysis tool",
    "Boolean search strings free",
    "recruitment software ₹499",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://hiremiq.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
