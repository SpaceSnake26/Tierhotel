import React from "react";
import Link from "next/link";

export default function RosterPage() {
  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto w-full">
      <section className="flex flex-col md:flex-row justify-between items-end gap-8 border-none">
        <div className="space-y-2 max-w-2xl">
          <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px]">Planung</p>
          <h2 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Dienstplan</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Wochenplanung für das gesamte Personal.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="bg-surface-container-high text-on-surface py-3 px-6 rounded shadow flex items-center justify-center gap-2 font-bold tracking-tight hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
            <span>Vorherige Woche</span>
          </button>
          <button className="bg-surface-container-high text-on-surface py-3 px-6 rounded shadow flex items-center justify-center gap-2 font-bold tracking-tight hover:bg-surface-container-highest transition-colors">
            <span>Nächste Woche</span>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
          <Link href="/roster/new" className="bg-primary text-on-primary py-3 px-6 rounded shadow flex items-center justify-center gap-2 font-bold tracking-tight hover:scale-[1.02] active:scale-95 transition-colors ml-4">
            <span className="material-symbols-outlined">add</span>
            <span>Schicht eintragen</span>
          </Link>
        </div>
      </section>

      <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-surface-container-high">
                <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider">Mitarbeiter</th>
                <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider">Montag (Heute)</th>
                <th className="p-4 font-headline font-bold text-outline text-xs tracking-wider">Dienstag</th>
                <th className="p-4 font-headline font-bold text-outline text-xs tracking-wider">Mittwoch</th>
                <th className="p-4 font-headline font-bold text-outline text-xs tracking-wider">Donnerstag</th>
                <th className="p-4 font-headline font-bold text-outline text-xs tracking-wider">Freitag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="p-4 font-bold flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">LM</div>
                  Lukas Meier
                </td>
                <td className="p-4">
                  <div className="bg-error/10 text-error text-xs font-bold px-3 py-2 rounded">Krank gemeldet</div>
                </td>
                <td className="p-4">
                  <div className="bg-error/10 text-error text-xs font-bold px-3 py-2 rounded">Krank gemeldet</div>
                </td>
                <td className="p-4">
                  <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-2 rounded">07:00 - 15:30 (Ersatz)</div>
                </td>
                <td className="p-4">
                  <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-2 rounded">07:00 - 15:30</div>
                </td>
                <td className="p-4">
                  <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-2 rounded">07:00 - 15:30</div>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="p-4 font-bold flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-xs font-bold">EF</div>
                  Elena Fischer
                </td>
                <td className="p-4">
                  <div className="bg-primary hover:bg-primary-fixed hover:text-primary transition-colors text-on-primary text-xs font-bold px-3 py-2 rounded shadow-sm">07:00 - 15:30</div>
                </td>
                <td className="p-4">
                  <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-2 rounded">07:00 - 15:30</div>
                </td>
                <td className="p-4">
                  <div className="bg-surface-variant text-on-surface-variant text-xs font-bold px-3 py-2 rounded">Frei</div>
                </td>
                <td className="p-4">
                  <div className="bg-surface-variant text-on-surface-variant text-xs font-bold px-3 py-2 rounded">Frei</div>
                </td>
                <td className="p-4">
                  <div className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-2 rounded">11:00 - 19:30</div>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="p-4 font-bold flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center text-xs font-bold">JS</div>
                  Julia Steiner
                </td>
                <td className="p-4">
                  <div className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-2 rounded">11:00 - 19:30</div>
                </td>
                <td className="p-4">
                  <div className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-2 rounded">11:00 - 19:30</div>
                </td>
                <td className="p-4">
                  <div className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-2 rounded">11:00 - 19:30</div>
                </td>
                <td className="p-4">
                  <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-2 rounded">07:00 - 15:30</div>
                </td>
                <td className="p-4">
                  <div className="bg-surface-variant text-on-surface-variant text-xs font-bold px-3 py-2 rounded">Frei</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
