import { LandingNavbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNavbar />
      <Hero />
      <Features />
      <HowItWorks />

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to decode your next JD?
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Join recruiters and staffing agencies across India who save hours
            every week with AI-powered recruitment intelligence.
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center h-13 px-10 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl transition-colors text-base"
          >
            Get Started Free
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
