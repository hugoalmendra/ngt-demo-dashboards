"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import type { NoteCategory } from "@/lib/types";
import { CURRENT_SSM_ID, NOTE_CATEGORIES } from "@/lib/notes-data";
import { STUDENTS, findSsm, findStudent } from "@/lib/mock-data";
import { matchesQuery, sortNotes, useNotes } from "@/components/notes/notes-store";
import { EmptyState, NoteCard, SearchInput, SelectField, useUndoDelete } from "@/components/notes/note-ui";

const ALL = "All";
type Scope = "mine" | "all";

export function MyNotes() {
  const { notes, update, remove, restore, togglePin } = useNotes();
  const [scope, setScope] = useState<Scope>("mine");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL);
  const [studentId, setStudentId] = useState<string>(ALL);
  const { onDeleted, banner } = useUndoDelete(restore);
  const me = findSsm(CURRENT_SSM_ID);

  const inScope = useMemo(
    () => (scope === "mine" ? notes.filter((n) => n.authorSsmId === CURRENT_SSM_ID) : notes),
    [notes, scope]
  );

  // Only offer students that actually have notes in the current scope.
  const studentOptions = useMemo(() => {
    const ids = new Set(inScope.map((n) => n.studentId));
    return STUDENTS.filter((s) => ids.has(s.id)).sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [inScope]);

  const visible = useMemo(
    () =>
      sortNotes(
        inScope.filter((n) => {
          const student = findStudent(n.studentId);
          return (
            (category === ALL || n.category === category) &&
            (studentId === ALL || n.studentId === studentId) &&
            matchesQuery(query, n.body, n.category, student?.fullName, findSsm(n.authorSsmId)?.name)
          );
        })
      ),
    [inScope, query, category, studentId]
  );

  const filtering = query.trim() !== "" || category !== ALL || studentId !== ALL;
  const studentCount = new Set(inScope.map((n) => n.studentId)).size;

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold">Internal · SSM</div>
          <h1 className="text-2xl font-black">{scope === "mine" ? "My Notes" : "All Notes"}</h1>
          <p className="text-sm text-ngt-muted mt-1">
            {scope === "mine"
              ? `Notes written by ${me?.name ?? "you"}`
              : "Notes written by every SSM"}{" "}
            · {inScope.length} note{inScope.length === 1 ? "" : "s"} on {studentCount} student
            {studentCount === 1 ? "" : "s"}
          </p>
        </div>
        <div role="tablist" aria-label="Whose notes" className="inline-flex rounded-md border border-ngt-line bg-white p-0.5">
          {(["mine", "all"] as Scope[]).map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={scope === s}
              onClick={() => {
                setScope(s);
                setStudentId(ALL);
              }}
              className={clsx(
                "h-8 px-3 rounded text-[11px] font-bold uppercase tracking-widest transition",
                scope === s ? "bg-ngt-ink text-white" : "text-ngt-muted hover:text-ngt-text"
              )}
            >
              {s === "mine" ? "My notes" : "All SSMs"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput value={query} onChange={setQuery} placeholder="Search notes, students, categories…" />
        <SelectField label="Filter by student" value={studentId} onChange={setStudentId}>
          <option value={ALL}>All students</option>
          {studentOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.fullName}
            </option>
          ))}
        </SelectField>
        <SelectField label="Filter by category" value={category} onChange={setCategory}>
          <option value={ALL}>All categories</option>
          {NOTE_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </SelectField>
        {filtering && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory(ALL);
              setStudentId(ALL);
            }}
            className="h-9 px-2.5 text-[11px] font-semibold uppercase tracking-widest text-ngt-muted hover:text-ngt-text"
          >
            Clear
          </button>
        )}
      </div>

      {filtering && (
        <div className="text-[12px] text-ngt-muted">
          {visible.length} of {inScope.length} notes
        </div>
      )}

      {banner}

      {visible.length > 0 ? (
        <div className="space-y-3">
          {visible.map((n) => {
            const s = findStudent(n.studentId);
            return (
              <NoteCard
                key={n.id}
                note={n}
                query={query}
                student={s ? { id: s.id, fullName: s.fullName } : { id: n.studentId, fullName: n.studentId }}
                onUpdate={(body, cat: NoteCategory) => update(n.id, { body, category: cat })}
                onDelete={() => onDeleted(remove(n.id))}
                onTogglePin={() => togglePin(n.id)}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState>
          {filtering
            ? "No notes match your search."
            : "You haven't written any notes yet. Open a student's profile and use the Notes tab."}
        </EmptyState>
      )}
    </div>
  );
}
