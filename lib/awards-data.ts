// =====================================================================
// Awards Log mock data (Admin). Mirrors the production Awards Log:
// Awards (certifications), Certificates of Completion and Recognition
// Awards. Certificates of Completion now cover both programs AND courses.
// Student names are fictional (the demo is public).
// =====================================================================

export type AwardTab = "awards" | "completion" | "recognition";
export type CompletionLevel = "program" | "course";
export type AwardStatus = "Valid" | "Revoked";

export interface AwardRecord {
  id: string;
  tab: AwardTab;
  /** Only for Certificates of Completion. */
  level?: CompletionLevel;
  issueDate: string; // ISO date
  studentName: string;
  /** Certification, program, course or recognition name. */
  award: string;
  /** Course certificates: the program the course belongs to. */
  program?: string;
  reference: string;
  status: AwardStatus;
  issuer: string;
}

const STUDENTS = [
  "Marcus Bell", "Dana Whitfield", "Rafael Ortega", "Priya Nair", "Jamal Carter", "Sofia Mendes",
  "Tyler Brooks", "Hannah Kim", "Omar Haddad", "Grace Liu", "Derek Patel", "Kayla Johnson",
  "Luis Ramirez", "Nora Fischer", "Andre Thompson", "Emily Rossi", "Victor Chen", "Aisha Bello",
];

const ISSUERS = ["Terry Kim", "Zach Elliot"];

/** Deterministic pseudo-random so the demo looks the same on every load. */
function pick<T>(list: T[], i: number, salt: number) {
  // 11 is coprime with every list length used here, so each list is fully cycled.
  return list[(i * 11 + salt * 5) % list.length];
}

function isoDaysAgo(days: number) {
  const d = new Date(Date.UTC(2026, 9, 27)); // Oct 27, 2026
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

const CERTS = [
  { name: "FSNA (IAU)", ref: "IAUFSNA", start: 748 },
  { name: "NCSA (IAU)", ref: "IAUNCSA", start: 196 },
  { name: "FSNP (IAU)", ref: "IAUFSNP", start: 106 },
];

const PROGRAMS = [
  { name: "Certificate Full Stack Network Engineer (IAU)", ref: "CFSNE", start: 412 },
  { name: "Certificate Cybersecurity Accelerator (IAU)", ref: "CCA", start: 287 },
  { name: "Full Stack Network Engineer Basic Training", ref: "FSNEB", start: 1530 },
];

const COURSES = [
  { name: "Ethical Hacking Essentials", ref: "EHE", program: "Certificate Cybersecurity Accelerator (IAU)", start: 318 },
  { name: "Network Defense Essentials", ref: "NDE", program: "Certificate Cybersecurity Accelerator (IAU)", start: 295 },
  { name: "Digital Forensics Essentials", ref: "DFE", program: "Certificate Cybersecurity Accelerator (IAU)", start: 204 },
  { name: "CompTIA Security+ Certification", ref: "SECP", program: "Certificate Cybersecurity Accelerator (IAU)", start: 377 },
  { name: "IP Routing in LANs & WANs", ref: "IPR", program: "Certificate Full Stack Network Engineer (IAU)", start: 641 },
  { name: "Server Virtualization and VMware", ref: "VMW", program: "Certificate Full Stack Network Engineer (IAU)", start: 512 },
  { name: "Troubleshooting Cisco IOS Networks", ref: "TCIOS", program: "Certificate Full Stack Network Engineer (IAU)", start: 488 },
];

const RECOGNITIONS = [
  { name: "Top Performer of the Month", ref: "REC-TOP", start: 42 },
  { name: "100-Day FSNA Goal Achieved", ref: "REC-100D", start: 133 },
  { name: "Community Helper", ref: "REC-COM", start: 57 },
];

const pad = (n: number) => String(n).padStart(4, "0");

function build(): AwardRecord[] {
  const rows: AwardRecord[] = [];

  for (let i = 0; i < 26; i++) {
    const c = pick(CERTS, i, 1);
    rows.push({
      id: `aw-${i}`, tab: "awards", issueDate: isoDaysAgo(Math.floor(i / 3)),
      studentName: pick(STUDENTS, i, 1), award: c.name, reference: `${c.ref}-${pad(c.start - i)}`,
      status: i === 17 ? "Revoked" : "Valid", issuer: "Terry Kim",
    });
  }

  for (let i = 0; i < 14; i++) {
    const p = pick(PROGRAMS, i, 2);
    rows.push({
      id: `cp-${i}`, tab: "completion", level: "program", issueDate: isoDaysAgo(i * 2),
      studentName: pick(STUDENTS, i, 2), award: p.name, reference: `COC-${p.ref}-${pad(p.start - i)}`,
      status: "Valid", issuer: "Terry Kim",
    });
  }

  for (let i = 0; i < 32; i++) {
    const c = pick(COURSES, i, 3);
    rows.push({
      id: `cc-${i}`, tab: "completion", level: "course", issueDate: isoDaysAgo(Math.floor(i / 2)),
      studentName: pick(STUDENTS, i, 3), award: c.name, program: c.program,
      reference: `COC-${c.ref}-${pad(c.start - i)}`, status: "Valid", issuer: pick(ISSUERS, i, 3),
    });
  }

  for (let i = 0; i < 9; i++) {
    const r = pick(RECOGNITIONS, i, 4);
    rows.push({
      id: `rc-${i}`, tab: "recognition", issueDate: isoDaysAgo(i * 3),
      studentName: pick(STUDENTS, i, 4), award: r.name, reference: `${r.ref}-${pad(r.start - i)}`,
      status: "Valid", issuer: "Terry Kim",
    });
  }

  return rows.sort((a, b) => b.issueDate.localeCompare(a.issueDate) || b.reference.localeCompare(a.reference));
}

export const AWARD_RECORDS: AwardRecord[] = build();
