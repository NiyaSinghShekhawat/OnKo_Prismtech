"use client";

import { useMemo, useState } from "react";
import type { PatientOnboardingInput } from "@/types/patientOnboarding";
import { authenticatedFetch } from "@/lib/api/authenticatedFetch";

const emptyInput: PatientOnboardingInput = {
  name: "", currentCarePhase: "active-treatment", journeyProgress: 0,
  medicines: [], procedures: [], appointments: [], milestones: [], caregivers: [], reports: [],
};

const phaseLabels = {
  "active-treatment": "Active Treatment",
  "remission-survivorship": "Remission / Survivorship",
  relapse: "Relapse",
  "transfer-of-care": "Transfer of Care",
  "palliative-end-of-life": "Palliative / End-of-Life",
  deceased: "Deceased",
} as const;

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="onboarding-section"><div className="onboarding-section-heading"><h2>{title}</h2><p>{description}</p></div>{children}</section>;
}

export default function PatientOnboarding() {
  const [input, setInput] = useState<PatientOnboardingInput>(emptyInput);
  const [reportFiles, setReportFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{email:string;temporaryPassword:string;patientId:string}|null>(null);
  const [error, setError] = useState("");

  const update = <K extends keyof PatientOnboardingInput>(key: K, value: PatientOnboardingInput[K]) => setInput((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    setSaving(true); setError(""); setResult(null);
    try {
      const uploadedFiles: File[] = [];
      const reports = input.reports.map((report, i) => {
        const file = reportFiles[i];
        if (!file) return { ...report, fileIndex: undefined };
        const fileIndex = uploadedFiles.push(file) - 1;
        return { ...report, fileIndex };
      });
      const payload = { ...input, reports };
      const form = new FormData();
      form.set("payload", JSON.stringify(payload));
      uploadedFiles.forEach((file) => form.append("reports", file));
      const response = await authenticatedFetch("/api/doctor/patient-onboarding", { method: "POST", body: form });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to onboard patient.");
      setResult(body.data);
      setInput(emptyInput); setReportFiles([]);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to onboard patient."); }
    finally { setSaving(false); }
  };

  const addRow = <K extends "medicines"|"procedures"|"appointments"|"milestones"|"caregivers"|"reports">(key: K, value: PatientOnboardingInput[K][number]) => {
    update(key, [...input[key], value] as PatientOnboardingInput[K]);
  };
  const removeRow = <K extends "medicines"|"procedures"|"appointments"|"milestones"|"caregivers"|"reports">(key: K, index: number) => {
    update(key, input[key].filter((_, i) => i !== index) as PatientOnboardingInput[K]);
  };

  const canSubmit = useMemo(() => input.name.trim().length > 1 && input.currentCarePhase.length > 0, [input.name, input.currentCarePhase]);

  return <div className="patient-onboarding">
    <div className="onboarding-hero"><div><span className="doctor-eyebrow">NEW PATIENT</span><h1>Patient Onboarding</h1><p>Create the patient's secure OnKo account and initialize the patient dashboard from one doctor-controlled workflow.</p></div><span className="onboarding-badge">Doctor-controlled provisioning</span></div>

    <Section title="1. Patient profile" description="Core identity and contact information used by the patient portal.">
      <div className="onboarding-grid">
        <input placeholder="Full name *" value={input.name} onChange={e=>update("name",e.target.value)} />
        <input type="number" min="0" max="120" placeholder="Age" value={input.age ?? ""} onChange={e=>update("age",e.target.value ? Number(e.target.value) : undefined)} />
        <input type="date" value={input.dateOfBirth ?? ""} onChange={e=>update("dateOfBirth",e.target.value)} />
        <input placeholder="Gender" value={input.gender ?? ""} onChange={e=>update("gender",e.target.value)} />
        <input placeholder="Phone" value={input.phone ?? ""} onChange={e=>update("phone",e.target.value)} />
        <input placeholder="Address" value={input.address ?? ""} onChange={e=>update("address",e.target.value)} />
        <input placeholder="Emergency contact name" value={input.emergencyContactName ?? ""} onChange={e=>update("emergencyContactName",e.target.value)} />
        <input placeholder="Emergency contact phone" value={input.emergencyContactPhone ?? ""} onChange={e=>update("emergencyContactPhone",e.target.value)} />
        <input className="onboarding-wide" placeholder="Diagnosis / care label" value={input.diagnosisLabel ?? ""} onChange={e=>update("diagnosisLabel",e.target.value)} />
      </div>
    </Section>

    <Section title="2. Care journey" description="Set the starting state and progress shown in the patient dashboard.">
      <div className="onboarding-grid">
        <label>Care phase<select value={input.currentCarePhase} onChange={e=>update("currentCarePhase",e.target.value as PatientOnboardingInput["currentCarePhase"])}>{Object.entries(phaseLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
        <label>Journey progress<input type="number" min="0" max="100" value={input.journeyProgress} onChange={e=>update("journeyProgress",Number(e.target.value))}/></label>
      </div>
    </Section>

    <Section title="3. Initial medicines" description="These become visible in the patient's Medicine page.">
      {input.medicines.map((m,i)=><div className="onboarding-row" key={i}><input placeholder="Medicine" value={m.name} onChange={e=>{const a=[...input.medicines];a[i]={...m,name:e.target.value};update("medicines",a)}}/><input placeholder="Dosage" value={m.dosage} onChange={e=>{const a=[...input.medicines];a[i]={...m,dosage:e.target.value};update("medicines",a)}}/><input placeholder="Frequency" value={m.frequency} onChange={e=>{const a=[...input.medicines];a[i]={...m,frequency:e.target.value};update("medicines",a)}}/><input placeholder="Instructions" value={m.instructions} onChange={e=>{const a=[...input.medicines];a[i]={...m,instructions:e.target.value};update("medicines",a)}}/><button type="button" onClick={()=>removeRow("medicines",i)}>Remove</button></div>)}
      <button type="button" onClick={()=>addRow("medicines",{name:"",dosage:"",frequency:"",instructions:"",sideEffects:[],startDate:new Date().toISOString().slice(0,10)})}>+ Add medicine</button>
    </Section>

    <Section title="4. Procedures" description="Initialize surgery, chemotherapy, immunotherapy, or other care procedures.">
      {input.procedures.map((p,i)=><div className="onboarding-row" key={i}><input placeholder="Procedure" value={p.name} onChange={e=>{const a=[...input.procedures];a[i]={...p,name:e.target.value};update("procedures",a)}}/><input type="date" value={p.date} onChange={e=>{const a=[...input.procedures];a[i]={...p,date:e.target.value};update("procedures",a)}}/><select value={p.status} onChange={e=>{const a=[...input.procedures];a[i]={...p,status:e.target.value as typeof p.status};update("procedures",a)}}><option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select><input placeholder="Purpose / details" value={p.purpose ?? ""} onChange={e=>{const a=[...input.procedures];a[i]={...p,purpose:e.target.value};update("procedures",a)}}/><button type="button" onClick={()=>removeRow("procedures",i)}>Remove</button></div>)}
      <button type="button" onClick={()=>addRow("procedures",{name:"",date:new Date().toISOString().slice(0,10),status:"scheduled"})}>+ Add procedure</button>
    </Section>

    <Section title="5. Appointments" description="Seed upcoming or historical appointments into the patient dashboard.">
      {input.appointments.map((a,i)=><div className="onboarding-row" key={i}><input placeholder="Appointment title" value={a.title} onChange={e=>{const x=[...input.appointments];x[i]={...a,title:e.target.value};update("appointments",x)}}/><input type="date" value={a.date} onChange={e=>{const x=[...input.appointments];x[i]={...a,date:e.target.value};update("appointments",x)}}/><input placeholder="Time" value={a.time} onChange={e=>{const x=[...input.appointments];x[i]={...a,time:e.target.value};update("appointments",x)}}/><input placeholder="Location" value={a.location ?? ""} onChange={e=>{const x=[...input.appointments];x[i]={...a,location:e.target.value};update("appointments",x)}}/><button type="button" onClick={()=>removeRow("appointments",i)}>Remove</button></div>)}
      <button type="button" onClick={()=>addRow("appointments",{title:"",date:new Date().toISOString().slice(0,10),time:"",status:"scheduled"})}>+ Add appointment</button>
    </Section>

    <Section title="6. Milestones" description="Add clinician-defined care journey milestones.">
      {input.milestones.map((m,i)=><div className="onboarding-row" key={i}><input placeholder="Milestone" value={m.title} onChange={e=>{const x=[...input.milestones];x[i]={...m,title:e.target.value};update("milestones",x)}}/><input placeholder="Description" value={m.description ?? ""} onChange={e=>{const x=[...input.milestones];x[i]={...m,description:e.target.value};update("milestones",x)}}/><input type="date" value={m.dueDate} onChange={e=>{const x=[...input.milestones];x[i]={...m,dueDate:e.target.value};update("milestones",x)}}/><button type="button" onClick={()=>removeRow("milestones",i)}>Remove</button></div>)}
      <button type="button" onClick={()=>addRow("milestones",{title:"",dueDate:new Date().toISOString().slice(0,10),status:"pending"})}>+ Add milestone</button>
    </Section>

    <Section title="7. Caregiver access" description="Invite the caregiver relationship that the patient dashboard already supports.">
      {input.caregivers.map((c,i)=><div className="onboarding-row" key={i}><input placeholder="Caregiver name" value={c.name} onChange={e=>{const x=[...input.caregivers];x[i]={...c,name:e.target.value};update("caregivers",x)}}/><input placeholder="Relationship" value={c.relationship} onChange={e=>{const x=[...input.caregivers];x[i]={...c,relationship:e.target.value};update("caregivers",x)}}/><input placeholder="Contact" value={c.contact ?? ""} onChange={e=>{const x=[...input.caregivers];x[i]={...c,contact:e.target.value};update("caregivers",x)}}/><button type="button" onClick={()=>removeRow("caregivers",i)}>Remove</button></div>)}
      <button type="button" onClick={()=>addRow("caregivers",{name:"",relationship:"",permissions:["appointments","milestones","notifications"]})}>+ Add caregiver</button>
    </Section>

    <Section title="8. Reports / documents" description="Upload initial reports directly into the patient's cloud storage and link them to the patient dashboard.">
      {input.reports.map((r,i)=><div className="onboarding-row" key={i}><input placeholder="Report title" value={r.title} onChange={e=>{const x=[...input.reports];x[i]={...r,title:e.target.value};update("reports",x)}}/><input placeholder="Report type" value={r.reportType ?? ""} onChange={e=>{const x=[...input.reports];x[i]={...r,reportType:e.target.value};update("reports",x)}}/><input type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={e=>{const files=[...reportFiles];files[i]=e.target.files?.[0] as File;setReportFiles(files)}}/><button type="button" onClick={()=>{removeRow("reports",i);setReportFiles(reportFiles.filter((_,x)=>x!==i))}}>Remove</button></div>)}
      <button type="button" onClick={()=>addRow("reports",{title:"",reportType:""})}>+ Add report</button>
    </Section>

    {error && <div className="onboarding-error">{error}</div>}
    {result && <div className="onboarding-success"><strong>Patient account created.</strong><span>Patient ID: {result.patientId}</span><span>Email: {result.email}</span><span>Temporary password: {result.temporaryPassword}</span><small>Save these credentials securely. The password is shown only after provisioning and is not stored in Firestore.</small></div>}
    <div className="onboarding-actions"><button type="button" disabled={!canSubmit||saving} onClick={()=>void submit()}>{saving ? "Creating patient account…" : "Create Patient & Open Dashboard"}</button></div>

    <style jsx>{`
      .patient-onboarding{padding:18px 24px 40px;max-width:1180px}
      .onboarding-hero{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:16px}.onboarding-hero h1{margin:5px 0;font-size:23px;color:var(--onko-ink)}.onboarding-hero p{margin:0;color:var(--onko-muted);font-size:11px;max-width:760px;line-height:1.55}.onboarding-badge{font-size:8px;font-weight:800;color:var(--onko-teal);background:var(--onko-teal-soft);padding:7px 9px;border-radius:99px;white-space:nowrap}
      .onboarding-section{background:#fff;border:1px solid var(--onko-line);border-radius:10px;padding:15px;margin-bottom:12px}.onboarding-section-heading{margin-bottom:11px}.onboarding-section-heading h2{margin:0;font-size:12px;color:var(--onko-ink)}.onboarding-section-heading p{margin:4px 0 0;font-size:8px;color:var(--onko-muted)}
      .onboarding-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.onboarding-grid input,.onboarding-grid select,.onboarding-grid label{font-size:8px}.onboarding-grid input,.onboarding-grid select{width:100%;box-sizing:border-box;border:1px solid var(--onko-line);border-radius:6px;padding:8px}.onboarding-grid label{display:grid;gap:5px;color:var(--onko-muted);font-weight:700}.onboarding-wide{grid-column:1/-1}
      .onboarding-row{display:grid;grid-template-columns:1.2fr 1fr 1fr 1.2fr auto;gap:7px;margin-bottom:7px;align-items:center}.onboarding-row input,.onboarding-row select{min-width:0;border:1px solid var(--onko-line);border-radius:6px;padding:8px;font-size:8px}.onboarding-row button,.onboarding-section>button{border:1px solid var(--onko-line);background:#fff;border-radius:6px;padding:7px 9px;font-size:8px;color:var(--onko-teal);font-weight:700}.onboarding-actions{display:flex;justify-content:flex-end}.onboarding-actions button{border:0;border-radius:7px;padding:10px 15px;background:var(--onko-teal);color:#fff;font-size:9px;font-weight:800}.onboarding-actions button:disabled{opacity:.5}.onboarding-error{padding:10px;border-radius:7px;background:#fff1f1;color:#a33a3a;font-size:9px;margin-bottom:10px}.onboarding-success{display:grid;gap:5px;padding:12px;border-radius:8px;background:var(--onko-teal-soft);border:1px solid var(--onko-line);font-size:9px;color:var(--onko-ink);margin-bottom:10px}.onboarding-success small{color:var(--onko-muted)}@media(max-width:900px){.onboarding-grid{grid-template-columns:1fr 1fr}.onboarding-row{grid-template-columns:1fr 1fr}}@media(max-width:600px){.patient-onboarding{padding:12px}.onboarding-grid{grid-template-columns:1fr}.onboarding-wide{grid-column:auto}.onboarding-hero{flex-direction:column}}
    `}</style>
  </div>;
}