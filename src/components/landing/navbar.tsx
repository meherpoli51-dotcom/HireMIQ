"use client";

import Link from "next/link";
import { Brain, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Hire<span className="text-blue-600">MIQ</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </a>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-600">
                Log in
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pb-4">
          <div className="flex flex-col gap-3 pt-2">
            <a href="#features" className="text-sm text-slate-600 py-2" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#how-it-works" className="text-sm text-slate-600 py-2" onClick={() => setMobileOpen(false)}>How it Works</a>
            <a href="#pricing" className="text-sm text-slate-600 py-2" onClick={() => setMobileOpen(false)}>Pricing</a>
            <hr className="border-slate-200" />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="w-full justify-start text-slate-600">Log in</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
