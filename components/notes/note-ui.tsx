"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronDown, Pencil, Pin, PinOff, Search, Trash2, X } from "lucide-react";
import type { NoteCategory, StudentNote } from "@/lib/types";
import { CURRENT_SSM_ID, NOTE_CATEGORIES, NOTE_CATEGORY_STYLES } from "@/lib/notes-data";
import { findSsm } from "@/lib/mock-data";
import { SsmAvatar } from "@/components/assigned-ssm";
import { formatDateTime } from "@/lib/format";

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

export function CategoryChip({ category }: { category: NoteCategory }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
        NOTE_CATEGORY_STYLES[category]
      )}
    >
      {category}
    </span>
  );
}

/** Wraps every occurrence of each query word in <mark>. */
export function Highlight({ text, query }: { text: string; query: string }) {
  const words = query.split(/\s+/).filter(Boolean).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!words.length) return <>{text}</>;
  const re = new RegExp(`(${words.join("|")})`, "gi");
  return (
    <>
      {text.split(re).map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="bg-ngt-yellow/40 text-inherit rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative flex-1 min-w-[220px]">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ngt-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 pl-9 pr-8 rounded-md border border-ngt-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-ngt-muted hover:text-ngt-text"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function SelectField({
  value,
  onChange,
  children,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <span className="relative inline-flex">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 pl-3 pr-8 appearance-none rounded-md border border-ngt-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40"
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ngt-muted"
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Composer (new note + edit)                                          */
/* ------------------------------------------------------------------ */

export function NoteComposer({
  initialBody = "",
  initialCategory = "General",
  submitLabel = "Add note",
  autoFocus,
  onSubmit,
  onCancel,
}: {
  initialBody?: string;
  initialCategory?: NoteCategory;
  submitLabel?: string;
  autoFocus?: boolean;
  onSubmit: (body: string, category: NoteCategory) => void;
  onCancel?: () => void;
}) {
  const [body, setBody] = useState(initialBody);
  const [category, setCategory] = useState<NoteCategory>(initialCategory);
  const ref = useRef<HTMLTextAreaElement>(null);
  const canSubmit = body.trim().length > 0;

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  const submit = () => {
    if (!canSubmit) return;
    onSubmit(body, category);
    if (!onCancel) setBody(""); // new-note composer resets; edit composer closes
  };

  return (
    <div className="bg-white border border-ngt-line rounded-lg shadow-card p-3">
      <textarea
        ref={ref}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            submit();
          }
          if (e.key === "Escape" && onCancel) onCancel();
        }}
        rows={3}
        placeholder="Write a note about this student… (visible to staff only)"
        className="w-full resize-y rounded-md border border-ngt-line p-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ngt-yellow/40"
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <SelectField label="Category" value={category} onChange={(v) => setCategory(v as NoteCategory)}>
          {NOTE_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </SelectField>
        <span className="text-[11px] text-ngt-muted hidden sm:inline">⌘/Ctrl + Enter to save</span>
        <div className="ml-auto flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="h-9 px-3 rounded-md text-[11px] font-bold uppercase tracking-widest text-ngt-muted hover:text-ngt-text"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="h-9 px-4 rounded-md text-[11px] font-bold uppercase tracking-widest bg-ngt-yellow hover:bg-ngt-yellowDark text-black disabled:bg-ngt-line disabled:text-ngt-muted"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Note card                                                           */
/* ------------------------------------------------------------------ */

export function NoteCard({
  note,
  query = "",
  student,
  onUpdate,
  onDelete,
  onTogglePin,
}: {
  note: StudentNote;
  query?: string;
  /** When set (My Notes page), show which student the note is about. */
  student?: { id: string; fullName: string };
  onUpdate: (body: string, category: NoteCategory) => void;
  onDelete: () => void;
  onTogglePin: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const author = findSsm(note.authorSsmId);
  const mine = note.authorSsmId === CURRENT_SSM_ID;

  if (editing) {
    return (
      <NoteComposer
        initialBody={note.body}
        initialCategory={note.category}
        submitLabel="Save"
        autoFocus
        onSubmit={(body, category) => {
          onUpdate(body, category);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <article
      className={clsx(
        "group bg-white border rounded-lg shadow-card p-4",
        note.pinned ? "border-ngt-yellow/60" : "border-ngt-line"
      )}
    >
      <header className="flex items-start gap-3">
        {author && <SsmAvatar ssm={author} size="sm" />}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
            <span className="font-semibold">{author?.name ?? "Unknown"}</span>
            {mine && <span className="text-[11px] text-ngt-muted">(you)</span>}
            <CategoryChip category={note.category} />
            {note.pinned && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-ngt-yellowDark">
                <Pin size={11} /> Pinned
              </span>
            )}
          </div>
          <div className="text-[11px] text-ngt-muted mt-0.5">
            {formatDateTime(note.createdAt)}
            {note.updatedAt && <span title={formatDateTime(note.updatedAt)}> · edited</span>}
            {student && (
              <>
                {" · on "}
                <Link
                  href={`/ssm/students/${student.id}/#notes`}
                  className="font-semibold text-ngt-text hover:text-ngt-yellowDark"
                >
                  <Highlight text={student.fullName} query={query} />
                </Link>
              </>
            )}
          </div>
        </div>
        {mine && (
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition">
            <IconButton label={note.pinned ? "Unpin note" : "Pin note"} onClick={onTogglePin}>
              {note.pinned ? <PinOff size={14} /> : <Pin size={14} />}
            </IconButton>
            <IconButton label="Edit note" onClick={() => setEditing(true)}>
              <Pencil size={14} />
            </IconButton>
            <IconButton label="Delete note" onClick={onDelete} danger>
              <Trash2 size={14} />
            </IconButton>
          </div>
        )}
      </header>
      <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">
        <Highlight text={note.body} query={query} />
      </p>
    </article>
  );
}

function IconButton({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={clsx(
        "w-8 h-8 grid place-items-center rounded-md text-ngt-muted hover:bg-ngt-bg",
        danger ? "hover:text-rose-600" : "hover:text-ngt-text"
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Delete with undo                                                    */
/* ------------------------------------------------------------------ */

export function useUndoDelete(restore: (note: StudentNote) => void) {
  const [deleted, setDeleted] = useState<StudentNote | null>(null);

  useEffect(() => {
    if (!deleted) return;
    const t = setTimeout(() => setDeleted(null), 6000);
    return () => clearTimeout(t);
  }, [deleted]);

  const banner = deleted ? (
    <div
      role="status"
      className="flex items-center justify-between gap-3 rounded-md bg-ngt-ink text-white text-[13px] px-4 py-2.5"
    >
      <span>Note deleted</span>
      <button
        type="button"
        onClick={() => {
          restore(deleted);
          setDeleted(null);
        }}
        className="font-bold text-ngt-yellow hover:underline"
      >
        Undo
      </button>
    </div>
  ) : null;

  return { onDeleted: (n: StudentNote | undefined) => n && setDeleted(n), banner };
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-dashed border-ngt-line rounded-lg px-6 py-10 text-center text-sm text-ngt-muted">
      {children}
    </div>
  );
}
