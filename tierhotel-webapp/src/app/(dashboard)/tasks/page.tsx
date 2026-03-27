import React from "react";
import Link from "next/link";

export default function TasksPage() {
  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto w-full">
      <section className="flex flex-col md:flex-row justify-between items-end gap-8 border-none">
        <div className="space-y-2 max-w-2xl">
          <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px]">Operations</p>
          <h2 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Aufgaben</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Offene und erledigte Aufgaben für das Team. Priorisieren Sie die Gästebetreuung.
          </p>
        </div>
        <Link href="/tasks/new" className="bg-primary text-on-primary py-3 px-6 rounded shadow-lg flex items-center justify-center gap-2 font-bold tracking-tight hover:scale-[1.02] active:scale-95 transition-transform">
          <span className="material-symbols-outlined">add</span>
          <span>Neue Aufgabe</span>
        </Link>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Open Tasks Column */}
        <div className="bg-surface-container-low rounded-xl p-6 border-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-headline font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">circle</span>
              Offen
            </h3>
            <span className="bg-surface-container-highest text-on-surface text-xs font-bold px-2 py-1 rounded-full">3</span>
          </div>
          <div className="space-y-4">
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-error/10 text-error font-bold uppercase">Hoch</span>
                <span className="text-outline text-xs">Heute</span>
              </div>
              <h4 className="font-bold mb-1">VIP Suite Endreinigung</h4>
              <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">Zimmer 402 sorgfältig für den nächsten Gast (Golden Retriever 'Bello') vorbereiten.</p>
              <div className="flex justify-between items-center">
                <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-xs font-bold">LM</div>
                <span className="material-symbols-outlined text-outline hover:text-primary transition-colors">more_horiz</span>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-surface-variant text-on-surface font-bold uppercase">Normal</span>
                <span className="text-outline text-xs">Morgen</span>
              </div>
              <h4 className="font-bold mb-1">Futterbestellung Premium</h4>
              <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">Inventar prüfen und wöchentliche Bestellung auslösen.</p>
              <div className="flex justify-between items-center">
                <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-xs font-bold">JS</div>
                <span className="material-symbols-outlined text-outline hover:text-primary transition-colors">more_horiz</span>
              </div>
            </div>
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-surface-container-low rounded-xl p-6 border-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-headline font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">pending</span>
              In Bearbeitung
            </h3>
            <span className="bg-surface-container-highest text-on-surface text-xs font-bold px-2 py-1 rounded-full">1</span>
          </div>
          <div className="space-y-4">
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-secondary">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-surface-variant text-on-surface font-bold uppercase">Normal</span>
                <span className="text-outline text-xs">Heute</span>
              </div>
              <h4 className="font-bold mb-1">Gassi-Runde Gruppe B</h4>
              <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">Waldweg Route 2 mit Max, Luna und Rocky.</p>
              <div className="flex justify-between items-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">DW</div>
                <span className="material-symbols-outlined text-outline hover:text-primary transition-colors">more_horiz</span>
              </div>
            </div>
          </div>
        </div>

        {/* Done Column */}
        <div className="bg-surface-container-low rounded-xl p-6 border-none opacity-80">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-headline font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">check_circle</span>
              Erledigt
            </h3>
            <span className="bg-surface-container-highest text-on-surface text-xs font-bold px-2 py-1 rounded-full">2</span>
          </div>
          <div className="space-y-4">
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm cursor-pointer opacity-75">
              <h4 className="font-bold mb-1 line-through text-outline">Social Media Update</h4>
              <p className="text-sm text-outline mb-4 line-clamp-1">Post über neue Gäste hochgeladen.</p>
              <div className="flex justify-between items-center">
                <div className="text-[10px] text-outline font-bold">Erledigt um 08:30</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
