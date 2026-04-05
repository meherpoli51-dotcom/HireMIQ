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
  title: "HireMIQ — AI Recruitment Intelligence Platform",
  description:
    "AI Recruitment Intelligence Platform for Recruiters and Staffing Agencies. Convert messy JDs into recruiter-ready sourcing and outreach workflows in minutes.",
  metadataBase: new URL("https://hiremiq.com"),
  openGraph: {
    title: "HireMIQ — AI Recruitment Intelligence Platform",
    description:
      "AI-powered recruitment intelligence. Turn messy job descriptions into recruiter-ready sourcing workflows in minutes.",
    url: "https://hiremiq.com",
    siteName: "HireMIQ",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HireMIQ — AI Recruitment Intelligence Platform",
    description:
      "AI Recruitment Intelligence Platform. 6 intelligence modules. Candidate scoring. Automated assessments.",
  },
  keywords: [
    "AI recruitment",
    "job description analysis",
    "boolean search strings",
    "recruiter tools",
    "staffing agency software",
    "talent sourcing",
    "candidate outreach",
    "recruitment intelligence",
    "HR tech",
    "hiring platform",
  ],
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
