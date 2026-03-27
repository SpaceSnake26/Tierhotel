import React from "react";
import { createAbsence } from "@/app/actions/absence";
import Link from "next/link";

export default function NewAbsencePage() {
  return (
    <div className="p-12 space-y-12 max-w-3xl mx-auto w-full">
      <section className="flex flex-col gap-4 border-none mb-8">
        <Link href="/absences" className="text-primary font-bold flex items-center gap-2 hover:underline w-fit">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Zurück zu Abwesenheiten
        </Link>
        <h2 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface">Neue Abwesenheit melden</h2>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Reichen Sie einen Antrag für Ferien oder eine Krankmeldung ein.
        </p>
      </section>

      <form action={createAbsence} className="bg-surface-container-lowest rounded-xl p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-bold text-on-surface">Art der Abwesenheit</label>
          <select 
            id="type" 
            name="type" 
            className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none"
          >
            <option value="sick">Krankheit</option>
            <option value="vacation">Ferien</option>
            <option value="other">Sonstiges</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-bold text-on-surface">Von *</label>
            <input 
              type="date" 
              id="startDate" 
              name="startDate" 
              required
              className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm font-bold text-on-surface">Bis *</label>
            <input 
              type="date" 
              id="endDate" 
              name="endDate" 
              required
              className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none" 
            />
          </div>
        </div>

        <div className="pt-6 border-t border-surface-container-high flex justify-end gap-4">
          <Link href="/absences" className="px-6 py-3 rounded font-bold text-on-surface hover:bg-surface-container-high transition-colors">
            Abbrechen
          </Link>
          <button type="submit" className="bg-primary text-on-primary py-3 px-8 rounded shadow flex items-center justify-center gap-2 font-bold hover:scale-[1.02] active:scale-95 transition-transform">
            <span className="material-symbols-outlined">send</span>
            <span>Antrag einreichen</span>
          </button>
        </div>
      </form>
    </div>
  );
}
