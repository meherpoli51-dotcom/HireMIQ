"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface StatItem {
  value: string;
  suffix: string;
  label: string;
  numericEnd: number;
}

const stats: StatItem[] = [
  { value: "15", suffix: "+", label: "Years combined recruitment experience", numericEnd: 15 },
  { value: "8", suffix: "", label: "AI intelligence modules", numericEnd: 8 },
  { value: "60", suffix: "s", label: "Average JD analysis time", numericEnd: 60 },
  { value: "10", suffix: "+", label: "Specialist team members", numericEnd: 10 },
];

function AnimatedCounter({ end, suffix, started }: { end: number; suffix: string; started: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;

    let frame: number;
    const duration = 1200;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [started, end]);

  return (
    <span>
      {started ? count : 0}
      {suffix}
    </span>
  );
}

export function TrustBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting) {
      setStarted(true);
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <section ref={ref} className="relative py-8 lg:py-10 bg-white border-y border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-slate-200">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center px-4 lg:px-8"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-500 tracking-tight mb-1">
                <AnimatedCounter end={stat.numericEnd} suffix={stat.suffix} started={started} />
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
