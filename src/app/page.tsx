import { LandingNavbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to decode your next JD?
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Join hundreds of recruiters who save hours every week with
            AI-powered JD analysis and candidate sourcing.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20"
          >
            Start Free Trial
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
