import React from "react";
import { createNote } from "@/app/actions/note";
import Link from "next/link";

export default function NewNotePage() {
  return (
    <div className="p-12 space-y-12 max-w-3xl mx-auto w-full">
      <section className="flex flex-col gap-4 border-none mb-8">
        <Link href="/notes" className="text-primary font-bold flex items-center gap-2 hover:underline w-fit">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Zurück zu Notizen
        </Link>
        <h2 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface">Neue Notiz erstellen</h2>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Verfassen Sie Übergabeprotokolle oder wichtige Tagesinformationen.
        </p>
      </section>

      <form action={createNote} className="bg-surface-container-lowest rounded-xl p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-bold text-on-surface">Inhalt der Notiz *</label>
          <textarea 
            id="content" 
            name="content" 
            required
            rows={6} 
            className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none" 
            placeholder="Was gibt es heute Wichtiges zu berichten? (z.B. Besonderheiten bei Gästen, Vorkommnisse...)" 
          />
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            id="isImportant" 
            name="isImportant" 
            className="w-5 h-5 rounded text-error focus:ring-error cursor-pointer" 
          />
          <label htmlFor="isImportant" className="text-sm font-bold text-on-surface cursor-pointer text-error flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">priority_high</span> Als WICHTIG markieren
          </label>
        </div>

        <div className="pt-6 border-t border-surface-container-high flex justify-end gap-4">
          <Link href="/notes" className="px-6 py-3 rounded font-bold text-on-surface hover:bg-surface-container-high transition-colors">
            Abbrechen
          </Link>
          <button type="submit" className="bg-primary text-on-primary py-3 px-8 rounded shadow flex items-center justify-center gap-2 font-bold hover:scale-[1.02] active:scale-95 transition-transform">
            <span className="material-symbols-outlined">send</span>
            <span>Notiz veröffentlichen</span>
          </button>
        </div>
      </form>
    </div>
  );
}
