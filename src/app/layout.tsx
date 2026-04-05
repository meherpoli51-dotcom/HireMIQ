import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HireMIQ — Decode JDs. Find Better Talent.",
  description:
    "AI Recruitment Intelligence Platform for Recruiters and Staffing Agencies. Convert messy JDs into recruiter-ready sourcing and outreach workflows in minutes.",
  metadataBase: new URL("https://hiremiq.com"),
  openGraph: {
    title: "HireMIQ — Decode JDs. Find Better Talent.",
    description:
      "AI-powered recruitment intelligence. Turn messy job descriptions into recruiter-ready sourcing workflows in minutes.",
    url: "https://hiremiq.com",
    siteName: "HireMIQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireMIQ — Decode JDs. Find Better Talent.",
    description:
      "AI Recruitment Intelligence Platform. 6 intelligence modules. Boolean strings. Candidate outreach. All from one JD.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
