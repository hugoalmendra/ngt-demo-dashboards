// =====================================================================
// Domain types — every field here is something the dev team will need
// to surface from LMS / HubSpot / Sheets. This file doubles as a spec.
// =====================================================================

export type CertCode =
  | "CCNA"
  | "FSNA"
  | "FSNP"
  | "NCSA"
  | "NetworkPlus"
  | "SecurityPlus";

export type ProgressStatus =
  | "On Track"
  | "Slightly Behind"
  | "Behind"
  | "At Risk"
  | "Ahead"
  | "Completed";

export interface CertRecord {
  code: CertCode;
  label: string;          // e.g. "CompTIA Security+"
  progressPct: number;    // 0..100 — % completed of the cert curriculum
  earned: boolean;        // industry exam passed
  issuedAt?: string;      // ISO date when issued, if earned
}

export interface Module {
  id: string;
  name: string;
  progressPct: number;
  lastActivityAt?: string;
}

export interface Course {
  id: string;
  name: string;
  modules: Module[];
}

export interface Program {
  id: string;
  name: string;            // e.g. "Cybersecurity Accelerator"
  courses: Course[];
}

// ---------------------------------------------------------------------
// Milestones (mirrors the existing NGT.Academy concept)
// Students submit files; SSMs / coaches review and change status.
// ---------------------------------------------------------------------
export type MilestoneStatus =
  | "Complete"
  | "Sent Back"
  | "Ready for Review"
  | "Overdue"
  | "Incomplete";

export type MilestoneType = "Technical" | "Exam" | "Project";

export interface Milestone {
  id: string;
  name: string;            // e.g. "FSNA Written Exam"
  type: MilestoneType;
  status: MilestoneStatus;
  dueDate: string;         // ISO
  description: string;
  link?: string;           // external link (exam, brief, etc.)
  submittedAt?: string;    // ISO — when student last submitted
  completedAt?: string;    // ISO — when marked Complete
  feedback?: string;       // SSM / coach feedback (visible to student)
  programId?: string;      // which program this milestone belongs to
}

export interface Student {
  id: string;
  fullName: string;
  email: string;
  avatarColor: string;     // tailwind class for the avatar circle bg

  // ---- Contact / shipping info (from LMS profile) ----
  phoneNumber?: string;
  shippingAddress?: string;        // multi-line; render as-is
  tshirtSize?: string;             // "S" | "M" | "L" | "XL" | "N/A"
  signUpMethod?: string;           // "Email" | "Google" | "Facebook" | "SSO" etc.

  // ---- HubSpot / IAU fields requested by Paul/Andrew ----
  programOfStudy: string;          // "Cybersecurity Accelerator"
  iauProgramType: string;          // e.g. "Associate of Applied Science"
  ngtSpecialization: string;       // e.g. "Network Defense"
  vaBenefitChapter?: string;       // e.g. "Chapter 33 (Post-9/11 GI Bill)"
  semesterStartDate?: string;      // ISO
  semesterEndDate?: string;        // ISO
  recentDealCloseDate?: string;    // ISO — most recent HubSpot deal close
  iauSchoolTerm?: string;          // e.g. "Spring 2026"
  accountCreatedDate: string;      // ISO
  lastActiveDate?: string;         // ISO
  daysSinceActive: number;         // computed
  hundredDayGoalPct: number;       // % of 100-Day Goal reached

  // ---- Cert + program progress ----
  programProgressPct: number;      // overall % of program of study
  certs: CertRecord[];

  // FSNA Delta — Paul's "ahead/behind" indicator in days
  // negative = behind, positive = ahead
  fsnaDeltaDays: number;
  progressStatus: ProgressStatus;

  // ---- Cohort ----
  cohort: string;                   // e.g. "FSNE Cybersecurity Path"

  // ---- Primary enrollment status + order ----
  // Most students have just one enrollment; these mirror what an
  // additionalEnrollment carries so the primary can show the same
  // status pill (Active / Paused / Expired / Completed) and order details.
  primaryEnrollmentStatus: EnrollmentStatus;
  primaryOrder?: OrderDetails;

  // ---- Tree (used in detail view + student view) ----
  program: Program;

  // ---- Milestones (per-student state for their enrolled program) ----
  milestones: Milestone[];

  // ---- Additional enrollments ----
  // Most students have just one (their primary, reflected above).
  // After completing a program, students sometimes re-enroll into another
  // program (e.g. CSA → FSNE Basic) or pick up a standalone course as an
  // add-on. This array captures those secondary enrollments.
  additionalEnrollments?: ProgramEnrollment[];
}

// ---------------------------------------------------------------------
// Enrollments
// A Student has 1..N enrollments. The fields directly on Student
// (program, programOfStudy, cohort, programProgressPct, milestones)
// always represent the currently *active* enrollment. Past completed
// programs and add-on courses live in `additionalEnrollments`.
// ---------------------------------------------------------------------
export type EnrollmentStatus = "Active" | "Completed" | "Expired" | "Paused";
export type EnrollmentKind = "Program" | "Course";

export interface ProgramEnrollment {
  id: string;
  kind: EnrollmentKind;
  name: string;                  // display label (program or course name)
  cohort: string;
  status: EnrollmentStatus;
  enrolledAt: string;            // ISO
  completedAt?: string;          // ISO — set when status === "Completed"
  progressPct: number;           // 0..100
  program?: Program;             // when kind === "Program"
  course?: Course;               // when kind === "Course"
  milestones?: Milestone[];      // optional per-enrollment milestones
  certsEarned?: string[];        // human-readable list of certs earned here
  order?: OrderDetails;          // billing / payment plan info
}

// ---------------------------------------------------------------------
// Order details — billing/payment info shown in the existing NGT
// "View Order Detail" modal.
// ---------------------------------------------------------------------
export interface OrderCharge {
  date: string;                  // ISO
  amount: number;                // dollars
  method: string;                // "Credit Card" | "VA Benefits" | etc.
  refunded?: boolean;
}

export interface OrderDetails {
  paymentPlan: string;           // "$1", "$249/mo × 6", "Free", "VA Benefits"
  paymentMethod: string;         // "Credit Card", "VA Benefits", "PO", etc.
  startDate: string;             // ISO
  nextBillingDate?: string;      // ISO; omit if paid-in-full or completed
  amountPaid: number;            // dollars
  balanceDue: number;            // dollars
  charges: OrderCharge[];
}
