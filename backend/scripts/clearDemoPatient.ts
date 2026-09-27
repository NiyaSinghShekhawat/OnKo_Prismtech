import { getAdminDb } from "@/lib/firebase/admin";

const demoDocs: Record<string, string[]> = {
  patients: ["ONK-DEMO-001", "ONK-DEMO-002", "ONK-DEMO-003", "ONK-DEMO-004", "ONK-DEMO-005"],
  doctors: ["DOC-DEMO-001"],
  appointments: ["APT-DEMO-001", "APT-DEMO-002", "APT-DEMO-003", "APT-DEMO-004", "APT-DEMO-005", "APT-DEMO-006"],
  medicines: ["MED-DEMO-001", "MED-DEMO-002", "MED-DEMO-003"],
  procedures: ["PROC-DEMO-001", "PROC-DEMO-002", "PROC-DEMO-003"],
  reports: ["REP-DEMO-001", "REP-DEMO-002", "REP-DEMO-003", "REP-DEMO-004", "REP-DEMO-005"],
  careJourneys: ["JRN-DEMO-001", "JRN-DEMO-002", "JRN-DEMO-003", "JRN-DEMO-004", "JRN-DEMO-005"],
  milestones: ["MS-DEMO-001", "MS-DEMO-002", "MS-DEMO-003", "MS-DEMO-004", "MS-DEMO-005"],
  queries: ["QRY-DEMO-001", "QRY-DEMO-002", "QRY-DEMO-003"],
  caregivers: ["CG-DEMO-001", "CG-DEMO-002", "CG-DEMO-003"],
  sosEvents: ["SOS-DEMO-001", "SOS-DEMO-002"],
  auditLogs: ["AUDIT-DEMO-001", "AUDIT-DEMO-002", "AUDIT-DEMO-003"],
};

async function main() {
  const db = getAdminDb();
  const batch = db.batch();

  let count = 0;
  for (const [collection, ids] of Object.entries(demoDocs)) {
    for (const id of ids) {
      batch.delete(db.collection(collection).doc(id));
      count++;
    }
  }

  await batch.commit();
  console.log(`Deleted ${count} synthetic demo documents from Firestore.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
