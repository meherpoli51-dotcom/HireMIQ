import { LandingNavbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TrustBar } from "@/components/landing/trust-bar";
import { Features } from "@/components/landing/features";
import { WhoWeServe } from "@/components/landing/who-we-serve";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNavbar />
      <Hero />
      <TrustBar />
      <Features />
      <WhoWeServe />
      <HowItWorks />
      <Pricing />

      {/* Final CTA */}
      <section className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl" />

        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Ready to hire smarter?
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Join recruiters and staffing agencies across India who save hours
            every week with AI-powered recruitment intelligence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center h-13 px-8 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors text-base shadow-lg shadow-brand-500/20"
            >
              Hire Through Us
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center h-13 px-8 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-colors text-base"
            >
              Try Platform Free
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
