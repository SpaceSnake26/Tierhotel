import React from "react";
import { createShift } from "@/app/actions/shift";
import Link from "next/link";

export default function NewShiftPage() {
  return (
    <div className="p-12 space-y-12 max-w-3xl mx-auto w-full">
      <section className="flex flex-col gap-4 border-none mb-8">
        <Link href="/roster" className="text-primary font-bold flex items-center gap-2 hover:underline w-fit">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Zurück zum Dienstplan
        </Link>
        <h2 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface">Neue Schicht zuweisen</h2>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Tragen Sie Arbeitszeiten für Mitarbeitende ein.
        </p>
      </section>

      <form action={createShift} className="bg-surface-container-lowest rounded-xl p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <label htmlFor="employeeId" className="text-sm font-bold text-on-surface">Mitarbeiter UUID *</label>
          <input 
            type="text" 
            id="employeeId" 
            name="employeeId" 
            required
            className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none" 
            placeholder="UUID (muss im System registriert sein)" 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="roleLabel" className="text-sm font-bold text-on-surface">Schicht Bezeichnung *</label>
          <select 
            id="roleLabel" 
            name="roleLabel" 
            className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none"
          >
            <option value="Morgenschicht">Morgenschicht</option>
            <option value="Spätschicht">Spätschicht</option>
            <option value="Nachtschicht">Nachtschicht</option>
            <option value="Ersatz">Ersatz</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-bold text-on-surface">Datum *</label>
            <input 
              type="date" 
              id="date" 
              name="date" 
              required
              className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="startTime" className="text-sm font-bold text-on-surface">Von *</label>
            <input 
              type="time" 
              id="startTime" 
              name="startTime" 
              defaultValue="07:00"
              required
              className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none" 
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="endTime" className="text-sm font-bold text-on-surface">Bis *</label>
            <input 
              type="time" 
              id="endTime" 
              name="endTime" 
              defaultValue="15:30"
              required
              className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none" 
            />
          </div>
        </div>

        <div className="pt-6 border-t border-surface-container-high flex justify-end gap-4">
          <Link href="/roster" className="px-6 py-3 rounded font-bold text-on-surface hover:bg-surface-container-high transition-colors">
            Abbrechen
          </Link>
          <button type="submit" className="bg-primary text-on-primary py-3 px-8 rounded shadow flex items-center justify-center gap-2 font-bold hover:scale-[1.02] active:scale-95 transition-transform">
            <span className="material-symbols-outlined">save</span>
            <span>Schicht eintragen</span>
          </button>
        </div>
      </form>
    </div>
  );
}
