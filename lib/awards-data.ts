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
  /** Student is tagged IAU in the LMS. */
  iau: boolean;
  reference: string;
  status: AwardStatus;
  issuer: string;
}

// [name, IAU-tagged]
const STUDENTS: [string, boolean][] = [
  ["Marcus Bell", true], ["Dana Whitfield", false], ["Rafael Ortega", true], ["Priya Nair", true],
  ["Jamal Carter", false], ["Sofia Mendes", true], ["Tyler Brooks", false], ["Hannah Kim", true],
  ["Omar Haddad", true], ["Grace Liu", false], ["Derek Patel", true], ["Kayla Johnson", false],
  ["Luis Ramirez", true], ["Nora Fischer", false], ["Andre Thompson", true], ["Emily Rossi", false],
  ["Victor Chen", true], ["Aisha Bello", false],
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

/** Reference numbers count down per prefix, newest first, like production. */
function refCounter() {
  const next: Record<string, number> = {};
  return (prefix: string, start: number) => {
    next[prefix] = (next[prefix] ?? start + 1) - 1;
    return `${prefix}-${String(next[prefix]).padStart(4, "0")}`;
  };
}

const CERTS = [
  { base: "FSNA", start: 748 },
  { base: "NCSA", start: 196 },
  { base: "FSNP", start: 106 },
];

// IAU students are enrolled in the IAU certificate programs.
const PROGRAMS = {
  iau: [
    { name: "Certificate Full Stack Network Engineer (IAU)", ref: "CFSNE", start: 412 },
    { name: "Certificate Cybersecurity Accelerator (IAU)", ref: "CCA", start: 287 },
  ],
  other: [
    { name: "Full Stack Network Engineer Basic Training", ref: "FSNEB", start: 1530 },
    { name: "Cybersecurity Accelerator", ref: "CSA", start: 902 },
  ],
};

const COURSES = [
  { name: "Ethical Hacking Essentials", ref: "EHE", track: "cyber", start: 318 },
  { name: "Network Defense Essentials", ref: "NDE", track: "cyber", start: 295 },
  { name: "Digital Forensics Essentials", ref: "DFE", track: "cyber", start: 204 },
  { name: "CompTIA Security+ Certification", ref: "SECP", track: "cyber", start: 377 },
  { name: "IP Routing in LANs & WANs", ref: "IPR", track: "network", start: 641 },
  { name: "Server Virtualization and VMware", ref: "VMW", track: "network", start: 512 },
  { name: "Troubleshooting Cisco IOS Networks", ref: "TCIOS", track: "network", start: 488 },
] as const;

const COURSE_PROGRAM = {
  cyber: { iau: "Certificate Cybersecurity Accelerator (IAU)", other: "Cybersecurity Accelerator" },
  network: { iau: "Certificate Full Stack Network Engineer (IAU)", other: "Full Stack Network Engineer Basic Training" },
};

const RECOGNITIONS = [
  { name: "Top Performer of the Month", ref: "REC-TOP", start: 42 },
  { name: "100-Day FSNA Goal Achieved", ref: "REC-100D", start: 133 },
  { name: "Community Helper", ref: "REC-COM", start: 57 },
];

function build(): AwardRecord[] {
  const rows: AwardRecord[] = [];
  const ref = refCounter();

  for (let i = 0; i < 26; i++) {
    const c = pick(CERTS, i, 1);
    const [studentName, iau] = pick(STUDENTS, i, 1);
    rows.push({
      id: `aw-${i}`, tab: "awards", issueDate: isoDaysAgo(Math.floor(i / 3)), studentName, iau,
      award: iau ? `${c.base} (IAU)` : c.base, reference: ref(iau ? `IAU${c.base}` : c.base, c.start),
      status: i === 17 ? "Revoked" : "Valid", issuer: "Terry Kim",
    });
  }

  for (let i = 0; i < 14; i++) {
    const [studentName, iau] = pick(STUDENTS, i, 2);
    const p = pick(iau ? PROGRAMS.iau : PROGRAMS.other, i, 2);
    rows.push({
      id: `cp-${i}`, tab: "completion", level: "program", issueDate: isoDaysAgo(i * 2), studentName, iau,
      award: p.name, reference: ref(`COC-${p.ref}`, p.start), status: "Valid", issuer: "Terry Kim",
    });
  }

  for (let i = 0; i < 32; i++) {
    const c = pick([...COURSES], i, 3);
    const [studentName, iau] = pick(STUDENTS, i, 3);
    rows.push({
      id: `cc-${i}`, tab: "completion", level: "course", issueDate: isoDaysAgo(Math.floor(i / 2)), studentName, iau,
      award: c.name, program: COURSE_PROGRAM[c.track][iau ? "iau" : "other"],
      reference: ref(`COC-${c.ref}`, c.start), status: "Valid", issuer: pick(ISSUERS, i, 3),
    });
  }

  for (let i = 0; i < 9; i++) {
    const r = pick(RECOGNITIONS, i, 4);
    const [studentName, iau] = pick(STUDENTS, i, 4);
    rows.push({
      id: `rc-${i}`, tab: "recognition", issueDate: isoDaysAgo(i * 3), studentName, iau,
      award: r.name, reference: ref(r.ref, r.start), status: "Valid", issuer: "Terry Kim",
    });
  }

  return rows.sort((a, b) => b.issueDate.localeCompare(a.issueDate) || b.reference.localeCompare(a.reference));
}

export const AWARD_RECORDS: AwardRecord[] = build();
