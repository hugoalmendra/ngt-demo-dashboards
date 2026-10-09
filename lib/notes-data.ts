import type { NoteCategory, StudentNote } from "./types";

// The SSM "logged in" to the prototype. Notes they write are attributed to them.
export const CURRENT_SSM_ID = "ssm-jordan";

export const NOTE_CATEGORIES: NoteCategory[] = ["General", "Call", "Email", "Academic", "Follow-up"];

export const NOTE_CATEGORY_STYLES: Record<NoteCategory, string> = {
  General: "bg-slate-100 text-slate-700",
  Call: "bg-sky-50 text-sky-700",
  Email: "bg-violet-50 text-violet-700",
  Academic: "bg-amber-50 text-amber-800",
  "Follow-up": "bg-rose-50 text-rose-700",
};

// Seed notes so the demo has something to search on first load.
export const SEED_NOTES: StudentNote[] = [
  {
    id: "n-01", studentId: "kevin-stewart", authorSsmId: "ssm-jordan", category: "Call", pinned: true,
    body: "Weekly check-in call. Kevin is aiming to sit Security+ before the end of the term and wants a mock exam next week. Confident on networking, weaker on cryptography.",
    createdAt: "2026-10-06T15:20:00Z",
  },
  {
    id: "n-02", studentId: "kevin-stewart", authorSsmId: "ssm-jordan", category: "Follow-up", pinned: false,
    body: "Send Security+ practice exam link and the crypto cheat sheet. Check back on Friday.",
    createdAt: "2026-10-06T15:32:00Z",
  },
  {
    id: "n-03", studentId: "kevin-stewart", authorSsmId: "ssm-taylor", category: "Academic", pinned: false,
    body: "Covered for Jordan: Security+ Defensive Lab submission looked good, left two small comments on firewall rules.",
    createdAt: "2026-09-29T10:05:00Z",
  },
  {
    id: "n-04", studentId: "a-sanders", authorSsmId: "ssm-jordan", category: "Email", pinned: false,
    body: "Emailed about the overdue FSNA Written Exam. Student replied that work hours changed; proposed a new study schedule of 1h/day on weekdays.",
    createdAt: "2026-10-03T18:40:00Z",
  },
  {
    id: "n-05", studentId: "a-sanders", authorSsmId: "ssm-jordan", category: "Follow-up", pinned: true,
    body: "Extend FSNA milestone by 14 days if no progress by Oct 10. Talk to Andrew before extending again.",
    createdAt: "2026-10-03T18:45:00Z",
  },
  {
    id: "n-06", studentId: "steven-thomas", authorSsmId: "ssm-jordan", category: "Call", pinned: false,
    body: "Intro call. Steven has a help-desk background and wants to move into network engineering. Recommended starting with the FSNA labs before CCNA.",
    createdAt: "2026-09-22T14:00:00Z",
  },
  {
    id: "n-07", studentId: "steven-thomas", authorSsmId: "ssm-jordan", category: "General", pinned: false,
    body: "Prefers text over phone calls. Best time to reach is after 6pm ET.",
    createdAt: "2026-09-22T14:10:00Z",
  },
  {
    id: "n-08", studentId: "marcus-cylar", authorSsmId: "ssm-taylor", category: "Academic", pinned: false,
    body: "Marcus finished the CCNA practice exam with 82%. Ready to book the real exam.",
    createdAt: "2026-10-01T09:30:00Z",
  },
  {
    id: "n-09", studentId: "georgey-thankachan", authorSsmId: "ssm-taylor", category: "Email", pinned: false,
    body: "Asked about VA benefit paperwork; forwarded to the VA certifying official.",
    createdAt: "2026-09-27T16:15:00Z",
  },
  {
    id: "n-10", studentId: "luis-ramos", authorSsmId: "ssm-morgan", category: "Call", pinned: false,
    body: "Luis wants to pause for two weeks (family travel). Explained pause policy; he will confirm by email.",
    createdAt: "2026-10-02T13:00:00Z",
  },
  {
    id: "n-11", studentId: "nestor-roque", authorSsmId: "ssm-morgan", category: "Follow-up", pinned: false,
    body: "Re-check FSNA SQC resubmission after feedback on the Loom walkthrough.",
    createdAt: "2026-10-05T11:45:00Z",
  },
  {
    id: "n-12", studentId: "michael-bell", authorSsmId: "ssm-jordan", category: "General", pinned: false,
    body: "No SSM assigned yet. Reached out as a courtesy; student is active and on track. Suggest assigning to Morgan.",
    createdAt: "2026-10-07T17:05:00Z",
  },
];
