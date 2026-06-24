"use client";

import { useState } from "react";
import clsx from "clsx";
import { Briefcase, Check, Pencil, X } from "lucide-react";
import { formatDate } from "@/lib/format";

export interface IauProgramDetails {
  programOfStudy: string;
  iauProgramType: string;
  ngtSpecialization: string;
  iauSchoolTerm: string;
}

interface FieldDef {
  key: keyof IauProgramDetails;
  label: string;
  options: string[];
}

// IAU school terms and the semester dates each one drives. Selecting a term
// updates the Semester Start / Semester End shown in the Dates panel.
const TERMS: Record<string, { start: string; end: string }> = {
  "Spring 2026": { start: "2026-01-13", end: "2026-05-09" },
  "Summer 2026": { start: "2026-05-18", end: "2026-08-15" },
  "Fall 2026": { start: "2026-08-24", end: "2026-12-12" },
  "Spring 2027": { start: "2027-01-12", end: "2027-05-08" },
  "Summer 2027": { start: "2027-05-17", end: "2027-08-14" },
  "Fall 2027": { start: "2027-08-23", end: "2027-12-11" },
};

const FIELDS: FieldDef[] = [
  {
    key: "programOfStudy",
    label: "Program of Study",
    options: [
      "Cybersecurity Accelerator",
      "Full Stack Network Engineer Basic",
      "Full Stack Network Engineer Advanced",
    ],
  },
  {
    key: "iauProgramType",
    label: "IAU Program Type",
    options: [
      "Associate of Applied Science",
      "Bachelor of Science",
      "Certificate",
    ],
  },
  {
    key: "ngtSpecialization",
    label: "NGT Specialization",
    options: ["Cyber Security", "Networking", "Network Engineering"],
  },
  {
    key: "iauSchoolTerm",
    label: "IAU School Term",
    options: Object.keys(TERMS),
  },
];

// Ensures the current value is always selectable even if it isn't one of
// the predefined options (e.g. legacy or custom data).
function optionsWithCurrent(options: string[], current: string) {
  return current && !options.includes(current) ? [current, ...options] : options;
}

export function IauProgramDetailsPanel({
  details,
  semester,
}: {
  details: IauProgramDetails;
  semester: { start?: string; end?: string };
}) {
  const [saved, setSaved] = useState<IauProgramDetails>(details);
  const [draft, setDraft] = useState<IauProgramDetails>(details);
  const [editing, setEditing] = useState(false);
  const [termDates, setTermDates] = useState({
    start: semester.start,
    end: semester.end,
  });

  const startEdit = () => {
    setDraft(saved);
    setEditing(true);
  };

  const cancel = () => {
    setDraft(saved);
    setEditing(false);
  };

  const save = () => {
    if (draft.iauSchoolTerm !== saved.iauSchoolTerm && TERMS[draft.iauSchoolTerm]) {
      setTermDates({
        start: TERMS[draft.iauSchoolTerm].start,
        end: TERMS[draft.iauSchoolTerm].end,
      });
    }
    setSaved(draft);
    setEditing(false);
  };

  const set = <K extends keyof IauProgramDetails>(key: K, value: IauProgramDetails[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const draftTermDates = TERMS[draft.iauSchoolTerm];

  return (
      <div className="bg-white border border-ngt-line rounded-lg shadow-card">
        <header className="px-4 py-3 border-b border-ngt-line flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-ngt-bg text-ngt-muted grid place-items-center">
                <Briefcase size={14} />
              </div>
              <h3 className="font-bold text-sm">IAU / Program details</h3>
            </div>
            <p className="text-[11px] text-ngt-muted mt-1">
              Sourced from HubSpot today · should be native LMS
            </p>
          </div>
          {!editing && (
            <button
              type="button"
              onClick={startEdit}
              className="shrink-0 inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11px] font-bold uppercase tracking-widest text-ngt-yellowDark border border-ngt-yellow hover:bg-ngt-yellow/10 transition"
            >
              <Pencil size={11} /> Edit
            </button>
          )}
        </header>

        <div className="px-4 py-2">
          {FIELDS.map(({ key, label, options }) => (
            <div
              key={key}
              className="flex items-baseline gap-3 py-2 border-b border-ngt-line last:border-b-0"
            >
              <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold w-[40%]">
                {label}
              </div>
              <div className="text-sm text-ngt-text font-medium flex-1 min-w-0">
                {editing ? (
                  <>
                    <select
                      value={draft[key]}
                      onChange={(e) => set(key, e.target.value)}
                      className={clsx(
                        "w-full h-9 px-2.5 rounded-md border border-ngt-line text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40",
                        draft[key] === "" && "text-ngt-muted"
                      )}
                    >
                      <option value="">—</option>
                      {optionsWithCurrent(options, draft[key]).map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    {key === "iauSchoolTerm" && draftTermDates && (
                      <p className="text-[11px] text-ngt-muted mt-1">
                        Term dates: {formatDate(draftTermDates.start)} –{" "}
                        {formatDate(draftTermDates.end)}
                      </p>
                    )}
                  </>
                ) : (
                  saved[key] || "—"
                )}
              </div>
            </div>
          ))}

          <DatesRow label="Semester Start" value={formatDate(termDates.start)} />
          <DatesRow label="Semester End" value={formatDate(termDates.end)} />
        </div>

        {editing && (
          <footer className="px-4 py-3 border-t border-ngt-line bg-ngt-bg/60 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={cancel}
              className="h-8 px-3 rounded-md text-[11px] font-bold uppercase tracking-widest text-ngt-muted hover:text-ngt-text border border-ngt-line hover:bg-white inline-flex items-center gap-1.5"
            >
              <X size={12} /> Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="h-8 px-4 rounded-md text-[11px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 transition bg-ngt-yellow hover:bg-ngt-yellowDark text-black"
            >
              <Check size={12} /> Save
            </button>
          </footer>
        )}
      </div>
  );
}

function DatesRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3 py-2 border-b border-ngt-line last:border-b-0">
      <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold w-[40%]">
        {label}
      </div>
      <div className="text-sm text-ngt-text font-medium flex-1 min-w-0">{value || "—"}</div>
    </div>
  );
}
