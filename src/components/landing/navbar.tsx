"use client";

import Link from "next/link";
import { Brain, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Brain className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              Hire<span className="text-blue-600">MIQ</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              How it Works
            </a>
            <a
              href="#platform"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Platform
            </a>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 font-medium"
              >
                Log in
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pb-4">
          <div className="flex flex-col gap-1 pt-2">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 py-2.5 px-3 rounded-lg hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 py-2.5 px-3 rounded-lg hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}
            >
              How it Works
            </a>
            <a
              href="#platform"
              className="text-sm font-medium text-slate-600 py-2.5 px-3 rounded-lg hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}
            >
              Platform
            </a>
            <hr className="border-slate-100 my-2" />
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-slate-600 font-medium"
              >
                Log in
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="sm"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
