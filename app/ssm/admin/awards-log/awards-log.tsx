"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronDown, ChevronLeft, Download, Search, X } from "lucide-react";
import {
  AWARD_RECORDS,
  type AwardRecord,
  type AwardTab,
  type CompletionLevel,
} from "@/lib/awards-data";

const PAGE_SIZE = 10;
const ALL = "All";

const TABS: { key: AwardTab; label: string }[] = [
  { key: "awards", label: "Awards" },
  { key: "completion", label: "Certificate of Completion" },
  { key: "recognition", label: "Recognition Award" },
];

/** Name of the "award" column / filter for the current view. */
function awardLabel(tab: AwardTab, level: CompletionLevel) {
  if (tab === "awards") return "Certification";
  if (tab === "recognition") return "Award";
  return level === "course" ? "Course" : "Program";
}

/** Production shows dates as MM-DD-YYYY. */
const formatIssueDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${m}-${d}-${y}`;
};

export function AwardsLog() {
  const [tab, setTab] = useState<AwardTab>("awards");
  const [level, setLevel] = useState<CompletionLevel>("program");
  const [award, setAward] = useState(ALL);
  const [issuer, setIssuer] = useState(ALL);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE_SIZE);

  // Deep links: #completion-course, #completion-program, #recognition, #awards
  const [hashRead, setHashRead] = useState(false);
  useEffect(() => {
    const apply = () => {
      const [t, l] = window.location.hash.slice(1).split("-");
      if (t === "awards" || t === "completion" || t === "recognition") setTab(t);
      if (l === "course" || l === "program") setLevel(l);
    };
    apply();
    setHashRead(true);
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  // Keep the URL in sync so the current view can be shared — only after the
  // incoming hash has been read, or the default tab would overwrite it.
  useEffect(() => {
    if (!hashRead) return;
    const hash = tab === "completion" ? `#completion-${level}` : `#${tab}`;
    if (window.location.hash !== hash) window.history.replaceState(null, "", hash);
  }, [tab, level, hashRead]);

  // Changing view resets filters that don't apply to it.
  const resetFilters = () => {
    setAward(ALL);
    setIssuer(ALL);
    setFrom("");
    setTo("");
    setQuery("");
    setShown(PAGE_SIZE);
  };

  const inView = useMemo(
    () => AWARD_RECORDS.filter((r) => r.tab === tab && (tab !== "completion" || r.level === level)),
    [tab, level]
  );

  const awardOptions = useMemo(() => [ALL, ...Array.from(new Set(inView.map((r) => r.award))).sort()], [inView]);
  const issuerOptions = useMemo(() => [ALL, ...Array.from(new Set(inView.map((r) => r.issuer))).sort()], [inView]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inView.filter(
      (r) =>
        (award === ALL || r.award === award) &&
        (issuer === ALL || r.issuer === issuer) &&
        (!from || r.issueDate >= from) &&
        (!to || r.issueDate <= to) &&
        (!q || r.studentName.toLowerCase().includes(q) || r.reference.toLowerCase().includes(q))
    );
  }, [inView, award, issuer, from, to, query]);

  const counts = useMemo(
    () => ({
      program: AWARD_RECORDS.filter((r) => r.tab === "completion" && r.level === "program").length,
      course: AWARD_RECORDS.filter((r) => r.tab === "completion" && r.level === "course").length,
    }),
    []
  );

  const filtering = award !== ALL || issuer !== ALL || !!from || !!to || !!query.trim();
  const label = awardLabel(tab, level);
  const isCourse = tab === "completion" && level === "course";

  const exportCsv = () => {
    const header = ["Issue Date", "Student Name", label, ...(isCourse ? ["Program"] : []), "Reference", "Status", "Issuer"];
    const lines = rows.map((r) =>
      [formatIssueDate(r.issueDate), r.studentName, r.award, ...(isCourse ? [r.program ?? ""] : []), r.reference, r.status, r.issuer]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const slug = tab === "completion" ? `${level}-certificates` : tab;
    a.href = url;
    a.download = `awards-log-${slug}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/ssm/admin"
          className="inline-flex items-center gap-1 text-[12px] uppercase tracking-widest font-semibold text-ngt-muted hover:text-ngt-text"
        >
          <ChevronLeft size={14} /> Admin
        </Link>
        <h1 className="text-2xl font-black mt-1">Awards Log</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-ngt-line">
        <div className="flex items-center gap-8" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => {
                setTab(t.key);
                resetFilters();
              }}
              className={clsx(
                "relative py-3 text-[12px] font-bold uppercase tracking-widest transition",
                tab === t.key ? "text-ngt-text" : "text-ngt-muted hover:text-ngt-text"
              )}
            >
              {t.label}
              {tab === t.key && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-ngt-yellow rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* Program / Course selector — only on Certificate of Completion */}
      {tab === "completion" && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-ngt-muted">Certificate type</span>
          <div role="radiogroup" aria-label="Certificate type" className="inline-flex rounded-md border border-ngt-line bg-white p-0.5">
            {(["program", "course"] as CompletionLevel[]).map((l) => (
              <button
                key={l}
                type="button"
                role="radio"
                aria-checked={level === l}
                onClick={() => {
                  setLevel(l);
                  resetFilters();
                }}
                className={clsx(
                  "h-8 px-4 rounded text-[11px] font-bold uppercase tracking-widest transition inline-flex items-center gap-2",
                  level === l ? "bg-ngt-ink text-white" : "text-ngt-muted hover:text-ngt-text"
                )}
              >
                {l === "program" ? "Program completion" : "Course completion"}
                <span
                  className={clsx(
                    "min-w-[20px] h-[18px] px-1 rounded-full text-[10px] grid place-items-center",
                    level === l ? "bg-white/15" : "bg-ngt-bg"
                  )}
                >
                  {counts[l]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <Field label={label}>
          <Select value={award} onChange={(v) => { setAward(v); setShown(PAGE_SIZE); }} options={awardOptions} wide />
        </Field>
        <Field label="Issuer">
          <Select value={issuer} onChange={(v) => { setIssuer(v); setShown(PAGE_SIZE); }} options={issuerOptions} />
        </Field>
        <Field label="Date range">
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              aria-label="From date"
              value={from}
              onChange={(e) => { setFrom(e.target.value); setShown(PAGE_SIZE); }}
              className="h-10 px-3 rounded-md border border-ngt-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40"
            />
            <span className="text-ngt-muted">–</span>
            <input
              type="date"
              aria-label="To date"
              value={to}
              onChange={(e) => { setTo(e.target.value); setShown(PAGE_SIZE); }}
              className="h-10 px-3 rounded-md border border-ngt-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40"
            />
          </div>
        </Field>
        <button
          type="button"
          onClick={resetFilters}
          disabled={!filtering}
          className="h-10 px-4 rounded-md border border-ngt-line bg-white text-[11px] font-bold uppercase tracking-widest text-ngt-text disabled:text-ngt-muted/50"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={exportCsv}
          disabled={rows.length === 0}
          className="h-10 px-4 rounded-md bg-ngt-yellow hover:bg-ngt-yellowDark text-black text-[11px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 disabled:bg-ngt-line disabled:text-ngt-muted"
        >
          <Download size={14} /> Export CSV
        </button>
        <div className="relative ml-auto w-full sm:w-[300px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ngt-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShown(PAGE_SIZE); }}
            placeholder="Search student or reference"
            className="w-full h-10 pl-9 pr-8 rounded-md border border-ngt-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40"
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ngt-muted hover:text-ngt-text">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-ngt-line rounded-lg shadow-card overflow-x-auto">
        <table className="w-full min-w-[960px] text-sm">
          <thead>
            <tr className="bg-ngt-bg/60 text-[11px] uppercase tracking-widest text-ngt-muted text-left">
              <Th>Issue date</Th>
              <Th>Student name</Th>
              <Th>{label}</Th>
              {isCourse && <Th>Program</Th>}
              <Th>Reference</Th>
              <Th>Status</Th>
              <Th>Issuer</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ngt-line">
            {rows.slice(0, shown).map((r) => (
              <Row key={r.id} r={r} isCourse={isCourse} />
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={isCourse ? 7 : 6} className="px-5 py-10 text-center text-ngt-muted">
                  No records match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="text-[12px] text-ngt-muted">
          Showing {Math.min(shown, rows.length)} of {rows.length}
          {filtering && ` (filtered from ${inView.length})`}
        </div>
        {shown < rows.length && (
          <button
            type="button"
            onClick={() => setShown((s) => s + PAGE_SIZE)}
            className="h-10 px-8 rounded-md border border-ngt-line bg-white text-[11px] font-bold uppercase tracking-widest text-ngt-muted hover:text-ngt-text"
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ r, isCourse }: { r: AwardRecord; isCourse: boolean }) {
  return (
    <tr className="hover:bg-ngt-bg/40">
      <Td className="whitespace-nowrap tabular-nums">{formatIssueDate(r.issueDate)}</Td>
      <Td>{r.studentName}</Td>
      <Td>{r.award}</Td>
      {isCourse && <Td className="text-ngt-muted">{r.program}</Td>}
      <Td className="whitespace-nowrap tabular-nums">{r.reference}</Td>
      <Td className={r.status === "Valid" ? "text-emerald-600" : "text-rose-600"}>{r.status}</Td>
      <Td className="whitespace-nowrap">{r.issuer}</Td>
    </tr>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 font-semibold whitespace-nowrap">{children}</th>;
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={clsx("px-5 py-3.5 align-top", className)}>{children}</td>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] uppercase tracking-widest font-semibold text-ngt-muted">{label}</span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
  wide,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  wide?: boolean;
}) {
  return (
    <span className="relative inline-flex">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(
          "h-10 pl-3 pr-9 appearance-none rounded-md border border-ngt-line bg-white text-sm truncate focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40",
          wide ? "w-[240px]" : "w-[170px]"
        )}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ngt-muted" />
    </span>
  );
}
