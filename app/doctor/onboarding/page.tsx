"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { getOnKoRole } from "@/lib/firebase/clientAuth";
import DoctorSidebar from "@/doctor-dashboard/components/DoctorSidebar";
import DoctorHeader from "@/doctor-dashboard/components/DoctorHeader";
import PatientOnboarding from "@/doctor-dashboard/components/PatientOnboarding";

export default function DoctorOnboardingPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let active = true;
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.replace("/login?role=doctor&next=/doctor/onboarding");
        return;
      }
      try {
        const role = await getOnKoRole(user);
        if (!active) return;
        if (role !== "doctor") {
          await auth.signOut();
          router.replace("/login?role=doctor&next=/doctor/onboarding&error=wrong-role");
          return;
        }
        setCheckingAuth(false);
      } catch (error) {
        console.error("Doctor onboarding role verification failed", error);
        if (active) {
          await auth.signOut();
          router.replace("/login?role=doctor&next=/doctor/onboarding&error=session");
        }
      }
    });
    return () => { active = false; unsubscribe(); };
  }, [router]);

  if (checkingAuth) {
    return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f4f8f8", color: "#123f48", fontFamily: "Arial, sans-serif" }}><strong>Opening Patient Onboarding…</strong></main>;
  }

  return <div className="doctor-shell"><DoctorSidebar/><main className="doctor-main"><DoctorHeader/><PatientOnboarding/></main></div>;
}
