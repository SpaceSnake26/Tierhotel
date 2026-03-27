import React from "react";
import { createEvent } from "@/app/actions/event";
import Link from "next/link";

export default function NewEventPage() {
  return (
    <div className="p-12 space-y-12 max-w-3xl mx-auto w-full">
      <section className="flex flex-col gap-4 border-none mb-8">
        <Link href="/events" className="text-primary font-bold flex items-center gap-2 hover:underline w-fit">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Zurück zum Kalender
        </Link>
        <h2 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface">Neuen Event anlegen</h2>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Tragen Sie Teamevents, VIP-Besichtigungen oder Schulungen ein.
        </p>
      </section>

      <form action={createEvent} className="bg-surface-container-lowest rounded-xl p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-bold text-on-surface">Titel des Events *</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            required
            className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none" 
            placeholder="z.B. Team Apéro" 
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="dateTime" className="text-sm font-bold text-on-surface">Datum & Zeit *</label>
            <input 
              type="datetime-local" 
              id="dateTime" 
              name="dateTime" 
              required
              className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-bold text-on-surface">Ort</label>
            <input 
              type="text" 
              id="location" 
              name="location" 
              className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none" 
              placeholder="z.B. Dachterrasse"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-bold text-on-surface">Details</label>
          <textarea 
            id="description" 
            name="description" 
            rows={3} 
            className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none" 
            placeholder="Weitere Informationen zum Event..." 
          />
        </div>

        <div className="pt-6 border-t border-surface-container-high flex justify-end gap-4">
          <Link href="/events" className="px-6 py-3 rounded font-bold text-on-surface hover:bg-surface-container-high transition-colors">
            Abbrechen
          </Link>
          <button type="submit" className="bg-primary text-on-primary py-3 px-8 rounded shadow flex items-center justify-center gap-2 font-bold hover:scale-[1.02] active:scale-95 transition-transform">
            <span className="material-symbols-outlined">save</span>
            <span>Event speichern</span>
          </button>
        </div>
      </form>
    </div>
  );
}
