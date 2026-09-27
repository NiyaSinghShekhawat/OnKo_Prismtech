export type DoctorNavItem =
  | "overview"
  | "ai"
  | "patients"
  | "queries"
  | "reports"
  | "care-plans"
  | "alerts"
  | "caregivers"
  | "audit"
  | "onboarding";

export interface DoctorNavEntry {
  id: DoctorNavItem;
  label: string;
  icon: string;
}
