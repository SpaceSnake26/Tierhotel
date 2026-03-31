import React from "react";
import { createTask } from "@/app/actions/task";
import Link from "next/link";

export default function NewTaskPage() {
  return (
    <div className="p-12 space-y-12 max-w-3xl mx-auto w-full">
      <section className="flex flex-col gap-4 border-none mb-8">
        <Link href="/tasks" className="text-primary font-bold flex items-center gap-2 hover:underline w-fit">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Zurück zu Aufgaben
        </Link>
        <h2 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface">Neue Aufgabe erstellen</h2>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Tragen Sie eine neue Aufgabe für sich oder Ihr Team ein.
        </p>
      </section>

      <form action={createTask} className="bg-surface-container-lowest rounded-xl p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-bold text-on-surface">Titel der Aufgabe *</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            required 
            className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none" 
            placeholder="z.B. VIP Suite Endreinigung" 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-bold text-on-surface">Beschreibung</label>
          <textarea 
            id="description" 
            name="description" 
            rows={4} 
            className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none" 
            placeholder="Details zur Aufgabe..." 
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-bold text-on-surface">Priorität</label>
            <select
              id="priority"
              name="priority"
              defaultValue="medium"
              className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none"
            >
              <option value="low">Niedrig</option>
              <option value="medium">Normal</option>
              <option value="high">Hoch</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-bold text-on-surface">Fällig bis (Optional)</label>
            <input 
              type="date" 
              id="dueDate" 
              name="dueDate" 
              className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none" 
            />
          </div>
        </div>

        <div className="pt-6 border-t border-surface-container-high flex justify-end gap-4">
          <Link href="/tasks" className="px-6 py-3 rounded font-bold text-on-surface hover:bg-surface-container-high transition-colors">
            Abbrechen
          </Link>
          <button type="submit" className="bg-primary text-on-primary py-3 px-8 rounded shadow flex items-center justify-center gap-2 font-bold hover:scale-[1.02] active:scale-95 transition-transform">
            <span className="material-symbols-outlined">save</span>
            <span>Aufgabe speichern</span>
          </button>
        </div>
      </form>
    </div>
  );
}
