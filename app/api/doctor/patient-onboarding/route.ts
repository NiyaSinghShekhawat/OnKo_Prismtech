import { NextRequest, NextResponse } from "next/server";
import { requireDoctor } from "@/backend/api/auth";
import { onboardPatient } from "@/backend/services/patientOnboardingService";
import type { PatientOnboardingInput } from "@/types/patientOnboarding";

export async function POST(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;

  try {
    const form = await request.formData();
    const raw = form.get("payload");
    if (typeof raw !== "string") {
      return NextResponse.json({ error: "Onboarding payload is required." }, { status: 400 });
    }

    const input = JSON.parse(raw) as PatientOnboardingInput;
    const files = form.getAll("reports").filter((value): value is File => value instanceof File);
    const result = await onboardPatient(auth.doctorId, input, files);
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error("POST /api/doctor/patient-onboarding failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to onboard patient." }, { status: 400 });
  }
}