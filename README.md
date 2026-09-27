🏥 OnKo — Cancer Healthcare Dashboard

An AI-assisted cancer-care coordination platform connecting patients, doctors, caregivers, and care teams through a shared longitudinal care journey.

1. Project Context

Cancer care is a long-term journey involving:

Appointments

Medical reports

Medicines

Procedures

Follow-ups

Daily milestones

Patient queries

Caregiver involvement

Patient engagement and adherence

Patients may lose track of what comes next, while doctors may lack a unified view of the patient's full journey.

The goal is to build a connected Patient Dashboard + Doctor Dashboard + Backend that bridges the gap between a doctor's care decision and the patient's follow-through.

Core Workflow

Doctor Decision
      ↓
Care Plan / Medicine / Procedure / Milestone
      ↓
Patient Dashboard
      ↓
Patient Activity
      ↓
Backend / Shared Data
      ↓
AI Analysis / Signals
      ↓
Doctor Review
      ↓
Doctor Decision / Action
      ↓
Updated Patient Care Journey

2. Core Product Goal

Patient should be able to answer:

"What is happening in my care journey, and what do I need to do next?"

Doctor should be able to answer:

"What is happening with my patients, what requires my attention, and what action do I need to take?"

System should provide:

A single synchronized care journey connecting both sides.

3. System Architecture

                         CANCER CARE COMPANION
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
       👤 PATIENT            👨‍⚕️ DOCTOR          🤖 AI LAYER
       DASHBOARD             DASHBOARD
             │                    │                    │
             └────────────────────┼────────────────────┘
                                  ▼
                         ⚙️ API / BACKEND
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
                Firestore      Storage       Auth
                    │
                    ▼
             Shared Patient Data

4. Team Structure

The project has 3 members.

Member

Ownership

Primary Responsibility

Person 1

👨‍⚕️ Doctor Dashboard

Doctor-side UI and workflows

Person 2

👤 Patient Dashboard

Patient-side UI and workflows

Person 3

⚙️ API + Backend

Backend, database, authentication, APIs, AI, and integration

5. Person 1 — Doctor Dashboard

Main Responsibility

Build the complete Doctor/Care-Team experience.

doctor-dashboard/
├── components/
├── pages/
├── hooks/
└── types/

Doctor Home / Command Center

Total patients

Active patients

Today's appointments

Pending queries

Pending reviews

Follow-ups

Alerts/signals

Patient progress overview

Patient Management

Patient list

Search

Filtering

Patient profile

Patient status

Current care phase

Last/next appointment

Patient History

Complete longitudinal timeline

Appointments

Medicines

Procedures

Reports

Queries

Milestones

Care-plan events

Care Plan

Doctor can:

Create care plans

Add milestones

Assign activities

Set dates/deadlines

Modify activities

Track completion

Medicines

Doctor can specify:

Medicine name

Dosage

Frequency

Instructions

Start date

End date

Side effects/precautions

Additional notes

Procedures

Doctor can specify:

Procedure name

Date

Cause/reason

Purpose/motive

Details

Follow-up date

Notes

Reports

Doctor can:

View patient reports

Open uploaded documents

Mark reports as reviewed.

Attach reports to patient history.

Add notes

AI must not independently interpret medical reports.

Patient Queries

View unanswered queries

Open conversations

Reply

Mark resolved

Maintain query history

Progress

Display:

Milestone completion

Activity completion

Follow-up adherence

Engagement

Longitudinal progress

Alerts / Signals

Display meaningful non-clinical signals such as:

Missed activities

Repeated delays

Missed follow-ups

Engagement changes

Patient SOS

Doctor reviews the signal and decides the action.

AI Patient Insights

Display:

Patient-history summary

Appointment quick overview

Care-journey summary

Engagement summary

AI-generated signals

6. Person 2 — Patient Dashboard

Main Responsibility

Build the complete Patient experience.

patient-dashboard/
├── components/
├── pages/
├── hooks/
└── types/

Patient Home

Display:

Current care phase

Upcoming appointment

Pending activities

Medicines

Progress

Recent updates

Important notifications

Patient Profile

Personal information

Basic care information

Assigned doctor

Caregiver information

Care Journey

Display:

Current stage

Completed milestones

Upcoming milestones

Pending activities

Timeline

Progress

Medicines

Display doctor-assigned:

Medicine

Dosage

Frequency

Instructions

Side effects/precautions

Start/end dates

Patient should not edit doctor-assigned clinical information.

Procedures

Display:

Procedure

Date

Cause/reason

Purpose

Details

Follow-up

Reports

Patient can:

Upload reports

View uploaded reports

View report status

Access previous reports

Query / Chat

Patient can:

Create query

Send message

View doctor's response.

View conversation history

Appointments

Display:

Upcoming appointments

Previous appointments

Date/time

Doctor

Appointment status

Daily Milestones

Display:

Today's activities

Upcoming activities

Completed activities

Pending activities

Completion status

Progress

Display:

Journey progress

Milestone completion

Activity completion

Follow-up status

Engagement

Caregiver

Support:

Invite → Consent → Assign → Coordinate → Switch

Caregiver access must be permission/consent based.

SOS

Patient can trigger an SOS that follows the configured escalation workflow.

7. Person 3 — API + Backend

Main Responsibility

Build the infrastructure connecting the Patient and Doctor dashboards.

backend/
├── api/
├── firebase/
├── services/
├── middleware/
└── types/

Authentication

Implement:

Patient authentication

Doctor authentication

Role-based access

Session handling

Protected routes

Database

Use Firestore for:

users
doctors
patients
appointments
medicines
procedures
reports
queries
milestones
carePlans
progress
engagementSignals
caregivers
aiSummaries
auditLogs

Storage

Use Firebase Storage for:

Medical reports

Documents

Attachments

APIs / Services

Create reusable services for:

patientService
doctorService
appointmentService
medicineService
procedureService
reportService
queryService
milestoneService
carePlanService
progressService
caregiverService
notificationService
aiService

Avoid putting database logic directly inside UI components.

8. Real-Time Data Flow

The backend must eventually support:

Doctor
  │
  ▼
Assign Medicine
  │
  ▼
Firestore
  │
  ▼
Patient Dashboard

And:

Patient
  │
  ▼
Upload Report
  │
  ▼
Firebase Storage
  │
  ▼
Firestore
  │
  ▼
Doctor Dashboard

And:

Patient completes milestone
        ↓
Firestore
        ↓
Progress updated
        ↓
Doctor Dashboard

The goal is for both dashboards to operate on the same underlying patient data, rather than maintaining duplicate records.

9. AI / Neural Layer

The AI layer supports the system but does not replace the doctor.

AI Features

Patient History Summary

Appointments
Reports metadata
Medicines
Procedures
Queries
Milestones
        ↓
       AI
        ↓
Patient History Summary

Appointment Summary

Appointment information
        ↓
       AI
        ↓
Quick Overview

Engagement Signals

Patient activity
       ↓
Pattern detection
       ↓
Meaningful engagement/adherence signal
       ↓
Doctor review

Doctor AI Library

Doctor Query
      ↓
Medical Knowledge Base
      ↓
RAG Retrieval
      ↓
Relevant Information
      ↓
AI Summary
      ↓
Doctor Review

AI Boundary

AI can:

Summarize

Organize information

Identify engagement patterns

Generate reminders

Surface non-clinical signals

Retrieve relevant reference information.

AI must not independently:

Diagnose

Prescribe treatment

Make clinical decisions

Modify the care plan.

Interpret medical reports

Calculate clinical risk

Required Workflow

AI Signal
   ↓
Human Review
   ↓
Doctor Decision
   ↓
Action
   ↓
Audit Record

10. Progress Model

Progress should not be a single arbitrary medical score.

Track observable care-journey metrics:

Milestone Completion
Activity Completion
Follow-up Adherence
Engagement
Upcoming / Pending Activities

Example:

Care Journey       ████████░░ 80%
Milestones         █████████░ 90%
Activities         ███████░░░ 70%
Follow-ups         ████████░░ 80%

11. Alerts & Escalation

The system should distinguish between:

Informational

New report uploaded
New patient query
Appointment approaching

Review Signal

Repeated missed activity
Delayed follow-up
Change in engagement

Immediate Escalation

Patient SOS
Doctor-defined distress trigger

SOS/escalation should follow predefined protocols rather than being treated as a normal AI recommendation.

12. Care Journey States

The system should support clinician-controlled states:

Active Treatment
      ↓
Remission / Survivorship
      ↓
Relapse
      ↓
Transfer of Care
      ↓
Palliative / End-of-Life
      ↓
Deceased

These states are set by the care team, not automatically inferred by AI.

Changing the state may change:

Reminder frequency

Engagement behavior

Care-plan behavior

Notifications

Patient interface

13. Caregiver System

Caregiver access follows:

Invite
  ↓
Consent
  ↓
Assign Responsibilities
  ↓
Coordinate
  ↓
Switch / Remove

Access must be:

Explicit

Consent-based

Role-controlled

Revocable

14. Security & Privacy

Every developer must consider:

Authentication

Authorization

Role-based access

Patient data isolation

Secure file access

Environment variables

No API keys in frontend code

Firestore security rules

Storage security rules

Audit logs

Never commit:

.env
Firebase private keys
API keys
Service-account credentials
Real patient data

Use:

.env.example

for required environment variables.

15. Shared Code Rules

Controlled Directories

components/shared/
lib/
app/
package.json
tsconfig.json
.env.example

Do not modify these casually.

Naming Convention

Use descriptive names:

DoctorPatientCard.tsx
PatientMedicineCard.tsx
DoctorPatientProfile.tsx
PatientReportCard.tsx

Avoid ambiguous names:

Card.tsx
Dashboard.tsx
utils.ts
service.ts

unless genuinely shared.

16. Git Workflow

Each member works on their own branch:

main
│
├── feature/doctor-dashboard
├── feature/patient-dashboard
└── feature/backend

Workflow:

Pull the latest main
      ↓
Work only in the assigned area.
      ↓
Test locally
      ↓
Commit
      ↓
Push
      ↓
Pull Request
      ↓
Review
      ↓
Merge

Never directly push experimental work to main.

17. Merge-Conflict Rules

Person 1

Primarily modifies:

doctor-dashboard/

Person 2

Primarily modifies:

patient-dashboard/

Person 3

Primarily modifies:

backend/
lib/

Shared Directories

Before changing:

app/
components/shared/
package.json
tsconfig.json

Coordinate with the team first.

18. Frontend ↔ Backend Contract

Before implementing a backend feature, define:

INPUT
 ↓
API / Service
 ↓
DATABASE
 ↓
OUTPUT

Example:

Assign Medicine

Doctor UI
   ↓
medicineService.assign()
   ↓
Firestore
   ↓
Patient Medicine Page

The frontend should not make assumptions about undocumented backend fields.

Shared TypeScript types should be used wherever possible.

19. Development Order

Phase 1 — Patient

P1 → Project/UI Foundation
P2 → Patient Core
P3 → Medicines / Procedures / Reports
P4 → Queries / Appointments / Milestones
P5 → Progress / Caregiver / SOS

Phase 2 — Doctor

D1 → Doctor Foundation
D2 → Patient Management
D3 → History / Reports / Care Plan
D4 → Medicines / Procedures / Milestones
D5 → Progress / Queries / Alerts
D6 → AI Patient Insights

Phase 3 — Integration

B1 → Firebase Auth
B2 → Firestore
B3 → Storage
B4 → API / Services
B5 → Real-time synchronization
B6 → AI / RAG
B7 → Notifications / WhatsApp
B8 → Audit logs
B9 → Security
B10 → End-to-end testing

20. End-to-End Test

The final system must demonstrate:

DOCTOR
  │
  ├── Assigns medicine
  ├── Creates milestone
  ├── Creates procedure
  └── Creates care-plan activity
           │
           ▼
        BACKEND
           │
           ▼
       PATIENT
           │
  ├── Views medicine
  ├── Views procedure
  ├── Completes milestone
  ├── Uploads report
  └── Sends query
           │
           ▼
        BACKEND
           │
           ▼
        DOCTOR
           │
  ├── Sees progress update
  ├── Sees new report
  ├── Sees query
  └── Receives relevant signal

If this complete loop works, the core product works.

21. Definition of Done

A feature is not complete merely because its UI exists.

A feature is complete when:

UI
 ↓
Data Model
 ↓
Backend
 ↓
Database
 ↓
Correct Permissions
 ↓
Real-time Update (where required)
 ↓
Error Handling
 ↓
Tested on Both Dashboards

22. Final Product

                 🏥 CANCER CARE COMPANION
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
      👤 PATIENT       👨‍⚕️ DOCTOR       🤖 AI
      DASHBOARD        DASHBOARD        LAYER
          │                │                │
          └────────────────┼────────────────┘
                           ▼
                     ⚙️ BACKEND
                           │
                  🔥 FIREBASE
                           │
                 SHARED CARE DATA
                           │
                           ▼
              🔄 REAL-TIME SYNCHRONIZATION

Core Principle

The Patient Dashboard shows the patient what to do and what is happening. The Doctor Dashboard shows the doctor what is happening across patients and what requires attention. The Backend keeps both sides synchronized, while AI provides supporting summaries and signals under human clinical oversight.
