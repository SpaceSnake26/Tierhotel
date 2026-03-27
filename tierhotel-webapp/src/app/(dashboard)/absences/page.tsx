import React from "react";
import Link from "next/link";

export default function AbsencesPage() {
  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto w-full">
      <section className="flex flex-col md:flex-row justify-between items-end gap-8 border-none">
        <div className="space-y-2 max-w-2xl">
          <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px]">Personalwesen</p>
          <h2 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Abwesenheiten</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Krankheitsmeldungen, Ferienanträge und Absenzen verwalten.
          </p>
        </div>
        <Link href="/absences/new" className="bg-primary text-on-primary py-3 px-6 rounded shadow-lg flex items-center justify-center gap-2 font-bold tracking-tight hover:scale-[1.02] active:scale-95 transition-transform">
          <span className="material-symbols-outlined">add</span>
          <span>Neue Abwesenheit</span>
        </Link>
      </section>

      <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-surface-container-high">
              <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider">Mitarbeiter</th>
              <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider">Typ</th>
              <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider">Zeitraum</th>
              <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider">Status</th>
              <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider text-right">Aktion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high">
            <tr className="hover:bg-surface-container-low transition-colors">
              <td className="p-4 font-bold">Lukas Meier</td>
              <td className="p-4"><span className="bg-error/10 text-error text-xs font-bold px-3 py-1 rounded-full">Krank</span></td>
              <td className="p-4">12. Mai - 16. Mai</td>
              <td className="p-4"><span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">Genehmigt</span></td>
              <td className="p-4 text-right"><span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">edit</span></td>
            </tr>
            <tr className="hover:bg-surface-container-low transition-colors">
              <td className="p-4 font-bold">Julia Steiner</td>
              <td className="p-4"><span className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full">Ferien</span></td>
              <td className="p-4">01. Juni - 14. Juni</td>
              <td className="p-4"><span className="bg-surface-variant text-on-surface-variant text-xs font-bold px-3 py-1 rounded-full">Ausstehend</span></td>
              <td className="p-4 text-right"><span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">edit</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
