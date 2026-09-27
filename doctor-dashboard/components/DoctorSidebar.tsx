"use client";

import { usePathname } from "next/navigation";
import type { DoctorNavEntry } from "../types/doctor";

const navItems: Array<DoctorNavEntry & { href: string; match?: string }> = [
  { id: "overview", label: "Overview", icon: "⌂", href: "/doctor", match: "/doctor" },
  { id: "ai", label: "AI Command Center", icon: "✦", href: "/doctor/ai", match: "/doctor/ai" },
  { id: "patients", label: "Patient Management", icon: "♙", href: "/doctor#patients" },
  { id: "onboarding", label: "Patient Onboarding", icon: "+", href: "/doctor/onboarding", match: "/doctor/onboarding" },
  { id: "queries", label: "Queries / Triage", icon: "?", href: "/doctor#queries" },
  { id: "reports", label: "Reports", icon: "▤", href: "/doctor#reports" },
  { id: "care-plans", label: "Care Plans", icon: "✓", href: "/doctor#care-plans" },
  { id: "alerts", label: "Alerts & Signals", icon: "!", href: "/doctor/signals", match: "/doctor/signals" },
  { id: "caregivers", label: "Caregivers", icon: "♧", href: "/doctor#caregivers" },
  { id: "audit", label: "Audit / Emergency", icon: "◈", href: "/doctor#audit" },
];

export default function DoctorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="doctor-sidebar">
      <div className="doctor-brand">
        <div className="doctor-brand-mark">O</div>
        <div>
          <div className="doctor-brand-name">OnKo</div>
          <div className="doctor-brand-subtitle">Care coordination</div>
        </div>
      </div>

      <div className="doctor-section-label">Doctor workspace</div>

      <nav className="doctor-sidebar-nav" aria-label="Doctor dashboard">
        {navItems.map((item) => {
          const active = item.match ? pathname === item.match : false;

          return (
            <a
              key={item.id}
              href={item.href}
              className={`doctor-sidebar-link${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className="doctor-sidebar-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="doctor-security">
        <strong>Human-in-the-loop</strong>
        <span>
          AI surfaces summaries and non-clinical signals. Clinical decisions
          remain with the care team.
        </span>
      </div>
    </aside>
  );
}
