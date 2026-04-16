"use client";

import { AppNavbar } from "@/components/layout/app-navbar";
import { useSession } from "next-auth/react";
import { User, Bell, Shield, CreditCard, Palette, Globe } from "lucide-react";

const sections = [
  {
    icon: User,
    title: "Profile",
    description: "Manage your name, email, and profile photo.",
    badge: "Coming soon",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Control email and in-app notification preferences.",
    badge: "Coming soon",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Password, two-factor authentication, and active sessions.",
    badge: "Coming soon",
  },
  {
    icon: CreditCard,
    title: "Billing & Plan",
    description: "View your current plan, usage, and payment history.",
    href: "/billing",
  },
  {
    icon: Palette,
    title: "Appearance",
    description: "Switch between light and dark mode.",
    badge: "Coming soon",
  },
  {
    icon: Globe,
    title: "Integrations",
    description: "Connect Naukri, LinkedIn, and other job platforms.",
    badge: "Coming soon",
  },
];

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <>
      <AppNavbar title="Settings" />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-3xl mx-auto space-y-6">

          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {(session?.user?.name || session?.user?.email || "U")[0].toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">
                {session?.user?.name || session?.user?.email?.split("@")[0] || "Recruiter"}
              </p>
              <p className="text-sm text-slate-500">{session?.user?.email || "—"}</p>
            </div>
          </div>

          {/* Settings sections */}
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
            {sections.map(({ icon: Icon, title, description, badge, href }) => (
              <div
                key={title}
                className={[
                  "flex items-center justify-between px-6 py-4 group",
                  href ? "cursor-pointer hover:bg-slate-50 transition-colors" : "opacity-60",
                ].join(" ")}
                onClick={() => href && (window.location.href = href)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                  </div>
                </div>
                {badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {badge}
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400">
            HireMIQ v0.1.0 · Built with ❤️ for recruiters
          </p>
        </div>
      </div>
    </>
  );
}
