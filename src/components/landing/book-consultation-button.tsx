"use client";

import { useEffect } from "react";
import { Calendar } from "lucide-react";

/**
 * BookConsultationButton
 * ─────────────────────
 * Opens a Calendly popup overlay when clicked.
 *
 * HOW TO SET UP:
 * 1. Go to https://calendly.com and create a free account
 * 2. Create a new "Event Type" (e.g. "30-min Free Consultation")
 * 3. Copy your event URL (e.g. https://calendly.com/hiremiq/consultation)
 * 4. Replace CALENDLY_URL below with your actual link
 */

const CALENDLY_URL = "https://calendly.com/hiremiq/consultation";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

export function BookConsultationButton({ className }: { className?: string }) {
  // Load Calendly widget scripts
  useEffect(() => {
    // Load Calendly CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);

    // Load Calendly JS
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  const openCalendly = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      // Fallback: open in new tab if widget not loaded
      window.open(CALENDLY_URL, "_blank");
    }
  };

  return (
    <button
      onClick={openCalendly}
      className={
        className ||
        "inline-flex items-center justify-center px-8 py-3.5 bg-[#5B4FBF] hover:bg-[#4f3da8] text-white font-semibold rounded-xl transition-colors text-base gap-2 shadow-lg shadow-[#5B4FBF]/20 cursor-pointer"
      }
    >
      <Calendar className="w-4 h-4" />
      Book a free consultation
    </button>
  );
}
