"use client";

import { useState } from "react";
import clsx from "clsx";
import { Briefcase, Check, Pencil, X } from "lucide-react";

export interface IauProgramDetails {
  programOfStudy: string;
  iauProgramType: string;
  ngtSpecialization: string;
  vaBenefitChapter: string;
  iauSchoolTerm: string;
}

interface FieldDef {
  key: keyof IauProgramDetails;
  label: string;
}

const FIELDS: FieldDef[] = [
  { key: "programOfStudy", label: "Program of Study" },
  { key: "iauProgramType", label: "IAU Program Type" },
  { key: "ngtSpecialization", label: "NGT Specialization" },
  { key: "vaBenefitChapter", label: "VA Benefit Chapter" },
  { key: "iauSchoolTerm", label: "IAU School Term" },
];

export function IauProgramDetailsPanel({ details }: { details: IauProgramDetails }) {
  const [saved, setSaved] = useState<IauProgramDetails>(details);
  const [draft, setDraft] = useState<IauProgramDetails>(details);
  const [editing, setEditing] = useState(false);

  const startEdit = () => {
    setDraft(saved);
    setEditing(true);
  };

  const cancel = () => {
    setDraft(saved);
    setEditing(false);
  };

  const save = () => {
    setSaved(draft);
    setEditing(false);
  };

  const set = <K extends keyof IauProgramDetails>(key: K, value: IauProgramDetails[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

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
        {FIELDS.map(({ key, label }) => (
          <div
            key={key}
            className="flex items-baseline gap-3 py-2 border-b border-ngt-line last:border-b-0"
          >
            <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold w-[40%]">
              {label}
            </div>
            <div className="text-sm text-ngt-text font-medium flex-1 min-w-0">
              {editing ? (
                <input
                  value={draft[key]}
                  onChange={(e) => set(key, e.target.value)}
                  className="w-full h-9 px-2.5 rounded-md border border-ngt-line text-sm focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40"
                />
              ) : (
                saved[key] || "—"
              )}
            </div>
          </div>
        ))}
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
            className={clsx(
              "h-8 px-4 rounded-md text-[11px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 transition",
              "bg-ngt-yellow hover:bg-ngt-yellowDark text-black"
            )}
          >
            <Check size={12} /> Save
          </button>
        </footer>
      )}
    </div>
  );
}
