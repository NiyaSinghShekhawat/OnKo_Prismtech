import type { CareJourneyState } from "@/types/patient";

export interface PatientOnboardingMedicine {
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  sideEffects: string[];
  startDate: string;
  endDate?: string;
}

export interface PatientOnboardingProcedure {
  name: string;
  date: string;
  reason?: string;
  purpose?: string;
  details?: string;
  followUpDate?: string;
  notes?: string;
  status: "scheduled" | "completed" | "cancelled";
}

export interface PatientOnboardingAppointment {
  title: string;
  date: string;
  time: string;
  location?: string;
  instructions?: string;
  status: "scheduled" | "completed" | "cancelled" | "missed";
}

export interface PatientOnboardingMilestone {
  title: string;
  description?: string;
  dueDate: string;
  status: "pending" | "completed" | "overdue" | "cancelled";
}

export interface PatientOnboardingCaregiver {
  name: string;
  relationship: string;
  contact?: string;
  permissions: string[];
}

export interface PatientOnboardingReport {
  title: string;
  reportType?: string;
  notes?: string;
  fileIndex?: number;
}

export interface PatientOnboardingInput {
  name: string;
  age?: number;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  diagnosisLabel?: string;
  currentCarePhase: CareJourneyState;
  journeyProgress: number;
  medicines: PatientOnboardingMedicine[];
  procedures: PatientOnboardingProcedure[];
  appointments: PatientOnboardingAppointment[];
  milestones: PatientOnboardingMilestone[];
  caregivers: PatientOnboardingCaregiver[];
  reports: PatientOnboardingReport[];
}

export interface PatientOnboardingResult {
  patientId: string;
  authUid: string;
  email: string;
  temporaryPassword: string;
  created: {
    medicines: number;
    procedures: number;
    appointments: number;
    milestones: number;
    caregivers: number;
    reports: number;
  };
  storagePath: string;
}