import React from "react";
import Link from "next/link";

export default function NotesPage() {
  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto w-full">
      <section className="flex flex-col md:flex-row justify-between items-end gap-8 border-none">
        <div className="space-y-2 max-w-2xl">
          <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px]">Kommunikation</p>
          <h2 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Notizen</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Wichtige Tagesinformationen und Übergabeprotokolle für alle Abteilungen.
          </p>
        </div>
        <Link href="/notes/new" className="bg-primary text-on-primary py-3 px-6 rounded shadow-lg flex items-center justify-center gap-2 font-bold tracking-tight hover:scale-[1.02] active:scale-95 transition-transform">
          <span className="material-symbols-outlined">add</span>
          <span>Neue Notiz</span>
        </Link>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="bg-primary-fixed/30 text-primary text-xs font-bold px-3 py-1 rounded-full">Allgemein</span>
              <span className="text-outline text-xs">Heute, 08:00</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Willkommen Golden Retriever 'Bello'</h3>
            <p className="text-on-surface-variant">
              Bitte achten Sie darauf, dass Bello sein spezielles Diät-Futter erhält. 
              Er ist sehr menschenbezogen und benötigt viel Aufmerksamkeit in den ersten Stunden.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-xs font-bold">ML</div>
            <span className="text-xs font-medium text-outline">Erstellt von Maria Leitung</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="bg-error/10 text-error text-xs font-bold px-3 py-1 rounded-full">Wichtig</span>
              <span className="text-outline text-xs">Gestern, 18:30</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Wartung Klimaanlage in Trakt B</h3>
            <p className="text-on-surface-variant">
              Morgen früh zwischen 09:00 und 11:00 kommt der Techniker für die Klimaanlage.
              Bitte in dieser Zeit keine neuen Hunde in den ersten beiden Boxen unterbringen.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-xs font-bold">DW</div>
            <span className="text-xs font-medium text-outline">Erstellt von Dieter Wartung</span>
          </div>
        </div>
      </div>
    </div>
  );
}
