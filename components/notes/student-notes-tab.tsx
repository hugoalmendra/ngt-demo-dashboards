"use client";

import { useMemo, useState } from "react";
import type { NoteCategory } from "@/lib/types";
import { NOTE_CATEGORIES } from "@/lib/notes-data";
import { findSsm } from "@/lib/mock-data";
import { matchesQuery, sortNotes, useNotes } from "./notes-store";
import { EmptyState, NoteCard, NoteComposer, SearchInput, SelectField, useUndoDelete } from "./note-ui";

const ALL = "All";

/** Notes tab on the SSM student profile: write, search and manage notes about one student. */
export function StudentNotesTab({ studentId, studentName }: { studentId: string; studentName: string }) {
  const { notes, add, update, remove, restore, togglePin } = useNotes();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL);
  const { onDeleted, banner } = useUndoDelete(restore);

  const studentNotes = useMemo(() => notes.filter((n) => n.studentId === studentId), [notes, studentId]);
  const visible = useMemo(
    () =>
      sortNotes(
        studentNotes.filter(
          (n) =>
            (category === ALL || n.category === category) &&
            matchesQuery(query, n.body, n.category, findSsm(n.authorSsmId)?.name)
        )
      ),
    [studentNotes, query, category]
  );
  const filtering = query.trim() !== "" || category !== ALL;

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-6 items-start">
      <div className="space-y-4 min-w-0">
        <NoteComposer onSubmit={(body, cat) => add(studentId, body, cat)} />

        <div className="flex flex-wrap items-center gap-2">
          <SearchInput value={query} onChange={setQuery} placeholder={`Search ${studentName}'s notes…`} />
          <SelectField label="Filter by category" value={category} onChange={setCategory}>
            <option value={ALL}>All categories</option>
            {NOTE_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </SelectField>
          <span className="text-[12px] text-ngt-muted ml-auto">
            {filtering ? `${visible.length} of ${studentNotes.length}` : studentNotes.length} note
            {studentNotes.length === 1 ? "" : "s"}
          </span>
        </div>

        {banner}

        {visible.length > 0 ? (
          <div className="space-y-3">
            {visible.map((n) => (
              <NoteCard
                key={n.id}
                note={n}
                query={query}
                onUpdate={(body, cat: NoteCategory) => update(n.id, { body, category: cat })}
                onDelete={() => onDeleted(remove(n.id))}
                onTogglePin={() => togglePin(n.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState>
            {filtering
              ? "No notes match your search."
              : `No notes yet. Add the first note about ${studentName} above.`}
          </EmptyState>
        )}
      </div>

      <aside className="bg-white border border-ngt-line rounded-lg shadow-card p-4 text-[13px] text-ngt-muted space-y-2 lg:sticky lg:top-6">
        <div className="text-[11px] uppercase tracking-widest font-semibold text-ngt-text">About notes</div>
        <p>Notes are internal. Students never see them.</p>
        <p>Every SSM can read all notes on a student. You can edit, pin or delete only your own.</p>
        <p>Pinned notes stay at the top. Use them for anything the next SSM must know.</p>
      </aside>
    </div>
  );
}
