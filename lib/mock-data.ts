import type {
  Student,
  Program,
  Course,
  CertRecord,
  ProgressStatus,
  Milestone,
  ProgramEnrollment,
} from "./types";

// =====================================================================
// Mock data for the prototype.
// Designed to look like a realistic NGT.Academy student roster so the
// dev team can visualize *all* the fields they'll need to surface.
// =====================================================================

const PROGRAMS: Record<string, Program> = {
  "csa-accel": {
    id: "csa-accel",
    name: "Cybersecurity Accelerator",
    courses: [
      {
        id: "sec-plus",
        name: "CompTIA Security+ Certification",
        modules: [
          { id: "secp-m1", name: "Threats, Attacks & Vulnerabilities", progressPct: 100 },
          { id: "secp-m2", name: "Architecture & Design", progressPct: 100 },
          { id: "secp-m3", name: "Implementation", progressPct: 78 },
          { id: "secp-m4", name: "Operations & Incident Response", progressPct: 45 },
          { id: "secp-m5", name: "Governance, Risk & Compliance", progressPct: 0 },
        ],
      },
      {
        id: "ncsa",
        name: "NGT Cyber Security Associate (NCSA)",
        modules: [
          { id: "ncsa-m1", name: "Network Fundamentals", progressPct: 100 },
          { id: "ncsa-m2", name: "Defensive Security", progressPct: 88 },
          { id: "ncsa-m3", name: "Offensive Security Primer", progressPct: 30 },
          { id: "ncsa-m4", name: "SOC Workflows", progressPct: 0 },
        ],
      },
      {
        id: "nde",
        name: "Network Defense Essentials",
        modules: [
          { id: "nde-m1", name: "Defense in Depth", progressPct: 60 },
          { id: "nde-m2", name: "IDS / IPS", progressPct: 12 },
          { id: "nde-m3", name: "Hardening & Patching", progressPct: 0 },
        ],
      },
      {
        id: "ehe",
        name: "Ethical Hacking Essentials",
        modules: [
          { id: "ehe-m1", name: "Recon", progressPct: 100 },
          { id: "ehe-m2", name: "Network Attacks", progressPct: 64 },
          { id: "ehe-m3", name: "Web App Attacks", progressPct: 18 },
          { id: "ehe-m4", name: "Wireless & Mobile", progressPct: 0 },
        ],
      },
      {
        id: "dfe",
        name: "Digital Forensics Essentials",
        modules: [
          { id: "dfe-m1", name: "Forensics Foundations", progressPct: 22 },
          { id: "dfe-m2", name: "Disk & Memory Analysis", progressPct: 0 },
        ],
      },
    ],
  },
  "fsne-basic": {
    id: "fsne-basic",
    name: "Full Stack Network Engineer Basic Training (FSNA)",
    courses: [
      {
        id: "net-plus",
        name: "CompTIA Network+ Certification",
        modules: [
          { id: "netp-m1", name: "Networking Fundamentals", progressPct: 100 },
          { id: "netp-m2", name: "Network Implementations", progressPct: 100 },
          { id: "netp-m3", name: "Network Operations", progressPct: 92 },
          { id: "netp-m4", name: "Network Security", progressPct: 70 },
          { id: "netp-m5", name: "Network Troubleshooting", progressPct: 40 },
        ],
      },
      {
        id: "ccna",
        name: "Cisco CCNA Certification",
        modules: [
          { id: "ccna-m1", name: "Network Fundamentals", progressPct: 100 },
          { id: "ccna-m2", name: "Network Access", progressPct: 85 },
          { id: "ccna-m3", name: "IP Connectivity", progressPct: 55 },
          { id: "ccna-m4", name: "IP Services", progressPct: 25 },
          { id: "ccna-m5", name: "Security & Automation", progressPct: 0 },
        ],
      },
    ],
  },
  "fsne-adv": {
    id: "fsne-adv",
    name: "Full Stack Network Engineer Advanced (FSNP)",
    courses: [
      {
        id: "ccnp-en",
        name: "Cisco CCNP Enterprise",
        modules: [
          { id: "ccnp-m1", name: "Architecture", progressPct: 40 },
          { id: "ccnp-m2", name: "Virtualization", progressPct: 15 },
          { id: "ccnp-m3", name: "Infrastructure", progressPct: 0 },
        ],
      },
      {
        id: "automation",
        name: "Network Automation w/ Python",
        modules: [
          { id: "auto-m1", name: "Python for NetOps", progressPct: 60 },
          { id: "auto-m2", name: "Ansible & NETCONF", progressPct: 0 },
        ],
      },
    ],
  },
};

const certs = (overrides: Partial<Record<CertRecord["code"], Partial<CertRecord>>> = {}): CertRecord[] => {
  const base: CertRecord[] = [
    { code: "CCNA", label: "Cisco CCNA", progressPct: 0, earned: false },
    { code: "FSNA", label: "Full Stack Network Associate", progressPct: 0, earned: false },
    { code: "FSNP", label: "Full Stack Network Professional", progressPct: 0, earned: false },
    { code: "NCSA", label: "NGT Cyber Security Associate", progressPct: 0, earned: false },
    { code: "NetworkPlus", label: "CompTIA Network+", progressPct: 0, earned: false },
    { code: "SecurityPlus", label: "CompTIA Security+", progressPct: 0, earned: false },
  ];
  return base.map((c) => ({ ...c, ...(overrides[c.code] ?? {}) }));
};

const AVATAR_PALETTE = [
  "bg-amber-500", "bg-emerald-500", "bg-sky-500", "bg-rose-500",
  "bg-violet-500", "bg-orange-500", "bg-teal-500", "bg-pink-500",
];

const pickAvatar = (i: number) => AVATAR_PALETTE[i % AVATAR_PALETTE.length];

// ---------------------------------------------------------------------
// Milestone factories — pick a realistic mix per program
// ---------------------------------------------------------------------
const milestonesCSA = (overrides: Partial<Record<string, Partial<Milestone>>> = {}): Milestone[] => {
  const base: Milestone[] = [
    {
      id: "csa-ncsa-written",
      name: "NCSA Written Exam",
      type: "Exam",
      status: "Complete",
      dueDate: "2026-02-04",
      description:
        "Complete your NCSA Written Exam by clicking the link in this milestone. 60 questions, multiple choice, 2-day re-take.",
      link: "https://learn.nexgent.com/exam/ncsa-written",
      submittedAt: "2026-02-02",
      completedAt: "2026-02-04",
      programId: "csa-accel",
    },
    {
      id: "csa-secp-lab",
      name: "Security+ Defensive Lab",
      type: "Technical",
      status: "Ready for Review",
      dueDate: "2026-05-20",
      description:
        "Configure SIEM rules to detect a simulated brute-force attack. Submit your config files and a short writeup.",
      link: "https://bit.ly/sec-plus-lab",
      submittedAt: "2026-05-18",
      programId: "csa-accel",
    },
    {
      id: "csa-soc-project",
      name: "Capstone: SOC Playbook",
      type: "Project",
      status: "Incomplete",
      dueDate: "2026-06-30",
      description:
        "Author a SOC incident-response playbook for a fictional mid-size enterprise. Includes triage, escalation and post-incident review.",
      programId: "csa-accel",
    },
    {
      id: "csa-secp-written",
      name: "Security+ Written Exam",
      type: "Exam",
      status: "Sent Back",
      dueDate: "2026-04-15",
      description:
        "Sit the Security+ written exam. If sent back, review the feedback and re-submit your exam voucher.",
      link: "https://learn.nexgent.com/exam/secplus-written",
      submittedAt: "2026-04-12",
      feedback: "Voucher upload was incomplete — please re-upload page 2 of the result PDF.",
      programId: "csa-accel",
    },
  ];
  return base.map((m) => ({ ...m, ...(overrides[m.id] ?? {}) }));
};

const milestonesFSNE = (overrides: Partial<Record<string, Partial<Milestone>>> = {}): Milestone[] => {
  const base: Milestone[] = [
    {
      id: "fsne-net-written",
      name: "Network+ Written Exam",
      type: "Exam",
      status: "Complete",
      dueDate: "2025-09-14",
      description: "60-question multiple-choice exam covering Network+ fundamentals.",
      link: "https://learn.nexgent.com/exam/netplus-written",
      submittedAt: "2025-09-10",
      completedAt: "2025-09-14",
      programId: "fsne-basic",
    },
    {
      id: "fsne-fsna-written",
      name: "FSNA Written Exam",
      type: "Exam",
      status: "Overdue",
      dueDate: "2026-05-14",
      description:
        "Complete your FSNA Written Exam by clicking the link in this milestone to begin your exam. This exam is 60 questions multiple choice, 2-day re-take.",
      link: "https://learn.nexgent.com/exam/fsna-written",
      programId: "fsne-basic",
    },
    {
      id: "fsne-ccna-project",
      name: "CCNA Capstone Build",
      type: "Project",
      status: "Ready for Review",
      dueDate: "2026-05-25",
      description:
        "Stand up a 4-router multi-area OSPF topology in GNS3 and submit your config + a short demo video.",
      link: "https://bit.ly/ccna-capstone",
      submittedAt: "2026-05-24",
      programId: "fsne-basic",
    },
    {
      id: "fsne-fsna-sqc",
      name: "FSNA SQC",
      type: "Technical",
      status: "Incomplete",
      dueDate: "2026-06-12",
      description:
        "Perform your FSNA SQC to demonstrate end-to-end network engineering competency. Submit a Loom walkthrough of your lab.",
      link: "https://bit.ly/fsnasqc",
      programId: "fsne-basic",
    },
  ];
  return base.map((m) => ({ ...m, ...(overrides[m.id] ?? {}) }));
};

const milestonesFSNP = (overrides: Partial<Record<string, Partial<Milestone>>> = {}): Milestone[] => {
  const base: Milestone[] = [
    {
      id: "fsnp-ccnp-lab",
      name: "CCNP Enterprise Lab",
      type: "Technical",
      status: "Sent Back",
      dueDate: "2026-04-30",
      description:
        "Build the prescribed CCNP enterprise topology. SSM will mark Complete once configs are correct.",
      link: "https://bit.ly/ccnp-lab",
      submittedAt: "2026-04-28",
      feedback: "BGP neighbor on R3 is not advertising the correct prefix. Re-check and resubmit.",
      programId: "fsne-adv",
    },
    {
      id: "fsnp-automation-project",
      name: "Network Automation Project",
      type: "Project",
      status: "Incomplete",
      dueDate: "2026-07-01",
      description:
        "Build an Ansible playbook that auto-configures VLANs across 6 switches.",
      programId: "fsne-adv",
    },
    {
      id: "fsnp-sqc",
      name: "FSNP SQC",
      type: "Technical",
      status: "Overdue",
      dueDate: "2026-05-09",
      description:
        "Perform your FSNP SQC to become a Full Stack Network Professional! You have rolled out your first robust projects and it's time to #LevelUp!",
      link: "https://bit.ly/fsnpsqc",
      programId: "fsne-adv",
    },
  ];
  return base.map((m) => ({ ...m, ...(overrides[m.id] ?? {}) }));
};

// ---------------------------------------------------------------------
// Add-on standalone courses (not part of a program path)
// ---------------------------------------------------------------------
const ADD_ON_COURSES: Record<string, Course> = {
  "cloud-plus": {
    id: "cloud-plus",
    name: "CompTIA Cloud+ Certification",
    modules: [
      { id: "cloud-m1", name: "Cloud Architecture & Design", progressPct: 60 },
      { id: "cloud-m2", name: "Cloud Security", progressPct: 30 },
      { id: "cloud-m3", name: "Cloud Operations & Support", progressPct: 0 },
      { id: "cloud-m4", name: "Troubleshooting", progressPct: 0 },
    ],
  },
  "pentest-bootcamp": {
    id: "pentest-bootcamp",
    name: "Pentesting Bootcamp",
    modules: [
      { id: "pt-m1", name: "Reconnaissance & Enumeration", progressPct: 100 },
      { id: "pt-m2", name: "Active Directory Attacks", progressPct: 70 },
      { id: "pt-m3", name: "Reporting & Remediation", progressPct: 0 },
    ],
  },
};

function deriveStatus(deltaDays: number, programPct: number): ProgressStatus {
  if (programPct >= 100) return "Completed";
  if (deltaDays >= 7) return "Ahead";
  if (deltaDays >= 0) return "On Track";
  if (deltaDays >= -7) return "Slightly Behind";
  if (deltaDays >= -21) return "Behind";
  return "At Risk";
}

export const STUDENTS: Student[] = [
  {
    id: "kevin-stewart",
    fullName: "Kevin A. Stewart",
    email: "pause320@gmail.com",
    avatarColor: pickAvatar(0),
    phoneNumber: "904-528-8892",
    shippingAddress: "742 Evergreen Terrace\nJacksonville, FL 32246\nUNITED STATES",
    tshirtSize: "L",
    signUpMethod: "Email",
    primaryEnrollmentStatus: "Active",
    primaryOrder: {
      paymentPlan: "$249/mo × 6",
      paymentMethod: "Credit Card",
      startDate: "2025-11-28",
      nextBillingDate: "2026-06-28",
      amountPaid: 1494,
      balanceDue: 996,
      charges: [
        { date: "2025-11-28", amount: 249, method: "Credit Card" },
        { date: "2025-12-28", amount: 249, method: "Credit Card" },
        { date: "2026-01-28", amount: 249, method: "Credit Card" },
        { date: "2026-02-28", amount: 249, method: "Credit Card" },
        { date: "2026-03-28", amount: 249, method: "Credit Card" },
        { date: "2026-05-28", amount: 249, method: "Credit Card" },
      ],
    },
    programOfStudy: "Cybersecurity Accelerator",
    iauProgramType: "Associate of Applied Science",
    ngtSpecialization: "Cyber Security",
    vaBenefitChapter: "Chapter 33 (Post-9/11 GI Bill)",
    semesterStartDate: "2026-01-13",
    semesterEndDate: "2026-05-09",
    recentDealCloseDate: "2025-11-28",
    iauSchoolTerm: "Spring 2026",
    accountCreatedDate: "2018-09-25",
    lastActiveDate: "2026-05-25",
    daysSinceActive: 2,
    hundredDayGoalPct: 81,
    programProgressPct: 81,
    certs: certs({
      SecurityPlus: { progressPct: 81, earned: false },
      NCSA: { progressPct: 55, earned: false },
      NetworkPlus: { progressPct: 100, earned: true, issuedAt: "2025-08-14" },
    }),
    fsnaDeltaDays: 4,
    progressStatus: deriveStatus(4, 81),
    cohort: "CSA Cybersecurity Path",
    program: PROGRAMS["csa-accel"],
    milestones: milestonesCSA(),
    additionalEnrollments: [
      {
        id: "kevin-cloud-plus",
        kind: "Course",
        name: "CompTIA Cloud+ Certification",
        cohort: "Self-Paced",
        status: "Active",
        enrolledAt: "2026-03-10",
        progressPct: 38,
        course: ADD_ON_COURSES["cloud-plus"],
        order: {
          paymentPlan: "$1 Trial → $349",
          paymentMethod: "Credit Card",
          startDate: "2026-03-10",
          amountPaid: 350,
          balanceDue: 0,
          charges: [
            { date: "2026-03-10", amount: 1, method: "Credit Card" },
            { date: "2026-03-17", amount: 349, method: "Credit Card" },
          ],
        },
        milestones: [
          {
            id: "cloud-written",
            name: "Cloud+ Written Exam",
            type: "Exam",
            status: "Incomplete",
            dueDate: "2026-08-15",
            description: "Sit the CompTIA Cloud+ written exam. 90 questions, 90 minutes.",
            link: "https://learn.nexgent.com/exam/cloudplus-written",
          },
        ],
      },
    ],
  },
  {
    id: "marcus-cylar",
    fullName: "Marcus A. Cylar, DMin",
    email: "mcylar@example.com",
    avatarColor: pickAvatar(1),
    phoneNumber: "813-555-0142",
    shippingAddress: "1208 W Cleveland St\nTampa, FL 33606\nUNITED STATES",
    tshirtSize: "XL",
    signUpMethod: "Email",
    primaryEnrollmentStatus: "Active",
    primaryOrder: {
      paymentPlan: "VA Benefits (Chapter 35)",
      paymentMethod: "VA Benefits",
      startDate: "2025-12-04",
      amountPaid: 4995,
      balanceDue: 0,
      charges: [{ date: "2025-12-04", amount: 4995, method: "VA Benefits" }],
    },
    programOfStudy: "Full Stack Network Engineer Basic",
    iauProgramType: "Associate of Applied Science",
    ngtSpecialization: "Networking",
    vaBenefitChapter: "Chapter 35 (DEA)",
    semesterStartDate: "2026-01-13",
    semesterEndDate: "2026-05-09",
    recentDealCloseDate: "2025-12-04",
    iauSchoolTerm: "Spring 2026",
    accountCreatedDate: "2024-03-02",
    lastActiveDate: "2026-05-21",
    daysSinceActive: 6,
    hundredDayGoalPct: 63,
    programProgressPct: 58,
    certs: certs({
      NetworkPlus: { progressPct: 80, earned: false },
      CCNA: { progressPct: 53, earned: false },
      FSNA: { progressPct: 58, earned: false },
    }),
    fsnaDeltaDays: -3,
    progressStatus: deriveStatus(-3, 58),
    cohort: "FSNE Cybersecurity Path",
    program: PROGRAMS["fsne-basic"],
    milestones: milestonesFSNE(),
  },
  {
    id: "luis-ramos",
    fullName: "Luis A Ramos Jr",
    email: "lramos@example.com",
    avatarColor: pickAvatar(2),
    phoneNumber: "210-555-0188",
    shippingAddress: "4521 Broadway St, Apt 12B\nSan Antonio, TX 78209\nUNITED STATES",
    tshirtSize: "M",
    signUpMethod: "Email",
    primaryEnrollmentStatus: "Active",
    primaryOrder: {
      paymentPlan: "VA Benefits (Chapter 33)",
      paymentMethod: "VA Benefits",
      startDate: "2025-10-15",
      amountPaid: 6995,
      balanceDue: 0,
      charges: [{ date: "2025-10-15", amount: 6995, method: "VA Benefits" }],
    },
    programOfStudy: "Full Stack Network Engineer Advanced",
    iauProgramType: "Bachelor of Science",
    ngtSpecialization: "Network Engineering",
    vaBenefitChapter: "Chapter 33 (Post-9/11 GI Bill)",
    semesterStartDate: "2026-01-13",
    semesterEndDate: "2026-05-09",
    recentDealCloseDate: "2025-10-15",
    iauSchoolTerm: "Spring 2026",
    accountCreatedDate: "2023-07-19",
    lastActiveDate: "2026-04-10",
    daysSinceActive: 47,
    hundredDayGoalPct: 28,
    programProgressPct: 23,
    certs: certs({
      NetworkPlus: { progressPct: 100, earned: true, issuedAt: "2024-11-02" },
      CCNA: { progressPct: 100, earned: true, issuedAt: "2025-04-21" },
      FSNA: { progressPct: 100, earned: true, issuedAt: "2025-06-08" },
      FSNP: { progressPct: 23, earned: false },
    }),
    fsnaDeltaDays: -28,
    progressStatus: deriveStatus(-28, 23),
    cohort: "FSNE CSS-Cohorts Self-Paced",
    program: PROGRAMS["fsne-adv"],
    milestones: milestonesFSNP(),
    additionalEnrollments: [
      {
        id: "luis-fsne-basic-completed",
        kind: "Program",
        name: "Full Stack Network Engineer Basic (FSNA)",
        cohort: "FSNE Cybersecurity Path",
        status: "Completed",
        enrolledAt: "2024-01-10",
        completedAt: "2025-06-08",
        progressPct: 100,
        program: PROGRAMS["fsne-basic"],
        certsEarned: ["CompTIA Network+", "Cisco CCNA", "Full Stack Network Associate"],
        order: {
          paymentPlan: "VA Benefits (Chapter 33)",
          paymentMethod: "VA Benefits",
          startDate: "2024-01-10",
          amountPaid: 4995,
          balanceDue: 0,
          charges: [{ date: "2024-01-10", amount: 4995, method: "VA Benefits" }],
        },
        milestones: milestonesFSNE({
          "fsne-net-written": {
            status: "Complete",
            submittedAt: "2024-11-30",
            completedAt: "2024-12-04",
          },
          "fsne-fsna-written": {
            status: "Complete",
            submittedAt: "2025-04-18",
            completedAt: "2025-04-22",
            dueDate: "2025-04-20",
          },
          "fsne-ccna-project": {
            status: "Complete",
            submittedAt: "2025-03-10",
            completedAt: "2025-03-15",
            dueDate: "2025-03-12",
          },
          "fsne-fsna-sqc": {
            status: "Complete",
            submittedAt: "2025-05-28",
            completedAt: "2025-06-08",
            dueDate: "2025-06-01",
          },
        }),
      },
      {
        id: "luis-cloud-plus-expired",
        kind: "Course",
        name: "CompTIA Cloud+ Certification",
        cohort: "Self-Paced",
        status: "Expired",
        enrolledAt: "2024-08-04",
        progressPct: 12,
        course: ADD_ON_COURSES["cloud-plus"],
        order: {
          paymentPlan: "$1 Trial → $349",
          paymentMethod: "Credit Card",
          startDate: "2024-08-04",
          amountPaid: 1,
          balanceDue: 0,
          charges: [
            { date: "2024-08-04", amount: 1, method: "Credit Card" },
            { date: "2024-08-11", amount: 349, method: "Credit Card", refunded: true },
          ],
        },
      },
    ],
  },
  {
    id: "a-sanders",
    fullName: "A. Sanders",
    email: "asanders@example.com",
    avatarColor: pickAvatar(3),
    phoneNumber: "404-555-0177",
    shippingAddress: "88 Peachtree St NW\nAtlanta, GA 30303\nUNITED STATES",
    tshirtSize: "S",
    signUpMethod: "Google",
    primaryEnrollmentStatus: "Active",
    primaryOrder: {
      paymentPlan: "$1 Trial → $2,495",
      paymentMethod: "Credit Card",
      startDate: "2025-12-19",
      amountPaid: 2496,
      balanceDue: 0,
      charges: [
        { date: "2025-12-19", amount: 1, method: "Credit Card" },
        { date: "2025-12-26", amount: 2495, method: "Credit Card" },
      ],
    },
    programOfStudy: "Cybersecurity Accelerator",
    iauProgramType: "Certificate",
    ngtSpecialization: "Cyber Security",
    semesterStartDate: "2026-01-13",
    semesterEndDate: "2026-05-09",
    recentDealCloseDate: "2025-12-19",
    iauSchoolTerm: "Spring 2026",
    accountCreatedDate: "2025-09-11",
    lastActiveDate: "2026-05-26",
    daysSinceActive: 1,
    hundredDayGoalPct: 94,
    programProgressPct: 91,
    certs: certs({
      NCSA: { progressPct: 100, earned: true, issuedAt: "2026-02-04" },
      SecurityPlus: { progressPct: 91, earned: false },
      NetworkPlus: { progressPct: 100, earned: true, issuedAt: "2025-12-30" },
    }),
    fsnaDeltaDays: 9,
    progressStatus: deriveStatus(9, 91),
    cohort: "CSA Cybersecurity Path",
    program: PROGRAMS["csa-accel"],
    milestones: milestonesCSA({
      "csa-secp-written": { status: "Complete", completedAt: "2026-04-20", submittedAt: "2026-04-12", feedback: undefined },
      "csa-secp-lab": { status: "Complete", completedAt: "2026-05-19", submittedAt: "2026-05-18" },
    }),
  },
  {
    id: "georgey-thankachan",
    fullName: "A. Georgey Thankachan",
    email: "georgey@example.com",
    avatarColor: pickAvatar(4),
    phoneNumber: "832-555-0119",
    shippingAddress: "9210 Westheimer Rd\nHouston, TX 77063\nUNITED STATES",
    tshirtSize: "L",
    signUpMethod: "Email",
    primaryEnrollmentStatus: "Active",
    primaryOrder: {
      paymentPlan: "VA Benefits (Chapter 31)",
      paymentMethod: "VA Benefits",
      startDate: "2024-10-08",
      amountPaid: 4995,
      balanceDue: 0,
      charges: [{ date: "2024-10-08", amount: 4995, method: "VA Benefits" }],
    },
    programOfStudy: "Full Stack Network Engineer Basic",
    iauProgramType: "Associate of Applied Science",
    ngtSpecialization: "Networking",
    vaBenefitChapter: "Chapter 31 (VR&E)",
    semesterStartDate: "2026-01-13",
    semesterEndDate: "2026-05-09",
    recentDealCloseDate: "2026-01-04",
    iauSchoolTerm: "Spring 2026",
    accountCreatedDate: "2024-10-08",
    lastActiveDate: "2026-05-15",
    daysSinceActive: 12,
    hundredDayGoalPct: 55,
    programProgressPct: 49,
    certs: certs({
      NetworkPlus: { progressPct: 100, earned: true, issuedAt: "2025-05-22" },
      CCNA: { progressPct: 49, earned: false },
      FSNA: { progressPct: 49, earned: false },
    }),
    fsnaDeltaDays: -10,
    progressStatus: deriveStatus(-10, 49),
    cohort: "FSNE Cybersecurity Path",
    program: PROGRAMS["fsne-basic"],
    milestones: milestonesFSNE({
      "fsne-fsna-written": { status: "Sent Back", submittedAt: "2026-05-10", feedback: "Exam voucher not attached." },
      "fsne-ccna-project": { status: "Incomplete", submittedAt: undefined },
    }),
  },
  {
    id: "nestor-roque",
    fullName: "Nestor A. Gonzalez Roque",
    email: "ngonzalez@example.com",
    avatarColor: pickAvatar(5),
    phoneNumber: "787-555-0144",
    shippingAddress: "Calle Loíza 1502, Apt 5\nSan Juan, PR 00911\nUNITED STATES",
    tshirtSize: "M",
    signUpMethod: "Facebook",
    // Paused — billing dispute on file, access frozen until resolved.
    primaryEnrollmentStatus: "Paused",
    primaryOrder: {
      paymentPlan: "$199/mo × 12",
      paymentMethod: "Credit Card",
      startDate: "2025-02-22",
      nextBillingDate: undefined,
      amountPaid: 1393,
      balanceDue: 995,
      charges: [
        { date: "2025-02-22", amount: 199, method: "Credit Card" },
        { date: "2025-03-22", amount: 199, method: "Credit Card" },
        { date: "2025-04-22", amount: 199, method: "Credit Card" },
        { date: "2025-05-22", amount: 199, method: "Credit Card" },
        { date: "2025-06-22", amount: 199, method: "Credit Card" },
        { date: "2025-07-22", amount: 199, method: "Credit Card" },
        { date: "2025-08-22", amount: 199, method: "Credit Card" },
      ],
    },
    programOfStudy: "Cybersecurity Accelerator",
    iauProgramType: "Certificate",
    ngtSpecialization: "Cyber Security",
    semesterStartDate: "2026-01-13",
    semesterEndDate: "2026-05-09",
    recentDealCloseDate: "2025-09-30",
    iauSchoolTerm: "Spring 2026",
    accountCreatedDate: "2025-02-22",
    lastActiveDate: "2026-03-02",
    daysSinceActive: 86,
    hundredDayGoalPct: 11,
    programProgressPct: 9,
    certs: certs({
      NCSA: { progressPct: 9, earned: false },
    }),
    fsnaDeltaDays: -62,
    progressStatus: deriveStatus(-62, 9),
    cohort: "CSA Cybersecurity Path",
    program: PROGRAMS["csa-accel"],
    milestones: milestonesCSA({
      "csa-ncsa-written": { status: "Overdue", submittedAt: undefined, completedAt: undefined },
      "csa-secp-lab": { status: "Incomplete", submittedAt: undefined },
      "csa-secp-written": { status: "Incomplete", submittedAt: undefined, feedback: undefined },
    }),
  },
  {
    id: "steven-thomas",
    fullName: "Steven A Thomas",
    email: "sthomas@example.com",
    avatarColor: pickAvatar(6),
    phoneNumber: "619-555-0123",
    shippingAddress: "1234 Pacific Coast Hwy\nSan Diego, CA 92109\nUNITED STATES",
    tshirtSize: "XL",
    signUpMethod: "Email",
    primaryEnrollmentStatus: "Completed",
    primaryOrder: {
      paymentPlan: "VA Benefits (Chapter 33)",
      paymentMethod: "VA Benefits",
      startDate: "2025-08-12",
      amountPaid: 6995,
      balanceDue: 0,
      charges: [{ date: "2025-08-12", amount: 6995, method: "VA Benefits" }],
    },
    programOfStudy: "Full Stack Network Engineer Advanced",
    iauProgramType: "Bachelor of Science",
    ngtSpecialization: "Network Engineering",
    vaBenefitChapter: "Chapter 33 (Post-9/11 GI Bill)",
    semesterStartDate: "2026-01-13",
    semesterEndDate: "2026-05-09",
    recentDealCloseDate: "2025-08-12",
    iauSchoolTerm: "Spring 2026",
    accountCreatedDate: "2022-11-17",
    lastActiveDate: "2026-05-26",
    daysSinceActive: 1,
    hundredDayGoalPct: 100,
    programProgressPct: 100,
    certs: certs({
      NetworkPlus: { progressPct: 100, earned: true, issuedAt: "2023-08-12" },
      CCNA: { progressPct: 100, earned: true, issuedAt: "2024-01-18" },
      FSNA: { progressPct: 100, earned: true, issuedAt: "2024-06-30" },
      FSNP: { progressPct: 100, earned: true, issuedAt: "2026-05-10" },
    }),
    fsnaDeltaDays: 21,
    progressStatus: "Completed",
    cohort: "FSNE CSS-Cohorts Self-Paced",
    program: PROGRAMS["fsne-adv"],
    milestones: milestonesFSNP({
      "fsnp-ccnp-lab": { status: "Complete", completedAt: "2026-05-02", feedback: undefined },
      "fsnp-automation-project": { status: "Complete", completedAt: "2026-05-08", submittedAt: "2026-05-06" },
      "fsnp-sqc": { status: "Complete", completedAt: "2026-05-10", submittedAt: "2026-05-08" },
    }),
    additionalEnrollments: [
      {
        id: "steven-fsne-basic-completed",
        kind: "Program",
        name: "Full Stack Network Engineer Basic (FSNA)",
        cohort: "FSNE Cybersecurity Path",
        status: "Completed",
        enrolledAt: "2022-11-17",
        completedAt: "2024-06-30",
        progressPct: 100,
        program: PROGRAMS["fsne-basic"],
        certsEarned: ["CompTIA Network+", "Cisco CCNA", "Full Stack Network Associate"],
        order: {
          paymentPlan: "VA Benefits (Chapter 33)",
          paymentMethod: "VA Benefits",
          startDate: "2022-11-17",
          amountPaid: 4995,
          balanceDue: 0,
          charges: [{ date: "2022-11-17", amount: 4995, method: "VA Benefits" }],
        },
        milestones: milestonesFSNE({
          "fsne-net-written": {
            status: "Complete",
            submittedAt: "2023-08-08",
            completedAt: "2023-08-12",
            dueDate: "2023-08-15",
          },
          "fsne-ccna-project": {
            status: "Complete",
            submittedAt: "2024-01-12",
            completedAt: "2024-01-18",
            dueDate: "2024-01-20",
          },
          "fsne-fsna-written": {
            status: "Complete",
            submittedAt: "2024-05-20",
            completedAt: "2024-05-24",
            dueDate: "2024-05-25",
          },
          "fsne-fsna-sqc": {
            status: "Complete",
            submittedAt: "2024-06-22",
            completedAt: "2024-06-30",
            dueDate: "2024-06-28",
          },
        }),
      },
      {
        id: "steven-pentest",
        kind: "Course",
        name: "Pentesting Bootcamp",
        cohort: "Self-Paced",
        status: "Active",
        enrolledAt: "2026-04-12",
        progressPct: 56,
        course: ADD_ON_COURSES["pentest-bootcamp"],
        order: {
          paymentPlan: "$99/mo × 3",
          paymentMethod: "Credit Card",
          startDate: "2026-04-12",
          nextBillingDate: "2026-06-12",
          amountPaid: 198,
          balanceDue: 99,
          charges: [
            { date: "2026-04-12", amount: 99, method: "Credit Card" },
            { date: "2026-05-12", amount: 99, method: "Credit Card" },
          ],
        },
        milestones: [
          {
            id: "pentest-ad-lab",
            name: "Active Directory Attack Lab",
            type: "Technical",
            status: "Ready for Review",
            dueDate: "2026-05-22",
            description:
              "Exploit a fictional AD environment via Kerberoasting + AS-REP roasting. Submit your Loom walkthrough and notes.",
            link: "https://bit.ly/ad-attack-lab",
            submittedAt: "2026-05-20",
          },
          {
            id: "pentest-report",
            name: "Final Pentest Report",
            type: "Project",
            status: "Incomplete",
            dueDate: "2026-07-30",
            description:
              "Write an executive-ready pentest report for the simulated client engagement, including remediation guidance.",
          },
        ],
      },
    ],
  },
  {
    id: "michael-bell",
    fullName: "A. Michael Bell",
    email: "mbell@example.com",
    avatarColor: pickAvatar(7),
    phoneNumber: "703-555-0166",
    shippingAddress: "2345 Crystal Dr, Apt 808\nArlington, VA 22202\nUNITED STATES",
    tshirtSize: "M",
    signUpMethod: "Email",
    primaryEnrollmentStatus: "Active",
    primaryOrder: {
      paymentPlan: "$2,495 one-time",
      paymentMethod: "Credit Card",
      startDate: "2025-11-04",
      amountPaid: 2495,
      balanceDue: 0,
      charges: [{ date: "2025-11-04", amount: 2495, method: "Credit Card" }],
    },
    programOfStudy: "Cybersecurity Accelerator",
    iauProgramType: "Associate of Applied Science",
    ngtSpecialization: "Cyber Security",
    vaBenefitChapter: "Chapter 33 (Post-9/11 GI Bill)",
    semesterStartDate: "2026-01-13",
    semesterEndDate: "2026-05-09",
    recentDealCloseDate: "2025-11-04",
    iauSchoolTerm: "Spring 2026",
    accountCreatedDate: "2024-06-30",
    lastActiveDate: "2026-05-23",
    daysSinceActive: 4,
    hundredDayGoalPct: 70,
    programProgressPct: 67,
    certs: certs({
      NetworkPlus: { progressPct: 100, earned: true, issuedAt: "2025-03-19" },
      NCSA: { progressPct: 88, earned: false },
      SecurityPlus: { progressPct: 67, earned: false },
    }),
    fsnaDeltaDays: 1,
    progressStatus: deriveStatus(1, 67),
    cohort: "CSA Cybersecurity Path",
    program: PROGRAMS["csa-accel"],
    milestones: milestonesCSA({
      "csa-secp-lab": { status: "Ready for Review", submittedAt: "2026-05-25" },
      "csa-secp-written": { status: "Incomplete", submittedAt: undefined, feedback: undefined },
    }),
  },
];

// Pick the "current" student for the student-facing view.
export const CURRENT_STUDENT_ID = "kevin-stewart";
export const findStudent = (id: string) => STUDENTS.find((s) => s.id === id);
