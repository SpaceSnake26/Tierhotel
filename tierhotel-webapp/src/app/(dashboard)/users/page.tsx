import React from "react";

export default function UsersPage() {
  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto w-full">
      <section className="flex flex-col md:flex-row justify-between items-end gap-8 border-none">
        <div className="space-y-2 max-w-2xl">
          <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px]">System</p>
          <h2 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Benutzer</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Verwalten Sie Systemzugriffe, Rollen und Personalakten der Mitarbeitenden.
          </p>
        </div>
        <button className="bg-primary text-on-primary py-3 px-6 rounded shadow-lg flex items-center justify-center gap-2 font-bold tracking-tight hover:scale-[1.02] active:scale-95 transition-transform">
          <span className="material-symbols-outlined">person_add</span>
          <span>Neuer Benutzer</span>
        </button>
      </section>

      <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-surface-container-high">
              <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider">Name</th>
              <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider">Rolle</th>
              <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider">Letzter Login</th>
              <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider text-right">Aktion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high">
            <tr className="hover:bg-surface-container-low transition-colors">
              <td className="p-4 font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">ML</div>
                <div>
                  Maria Leitung
                  <div className="text-xs text-outline font-normal">leitung@tierhotel.ch</div>
                </div>
              </td>
              <td className="p-4"><span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">Admin / GL</span></td>
              <td className="p-4 text-sm text-outline">Vor 2 Stunden</td>
              <td className="p-4 text-right"><span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">edit</span></td>
            </tr>
            <tr className="hover:bg-surface-container-low transition-colors">
              <td className="p-4 font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-variant text-on-surface flex items-center justify-center text-xs font-bold">EF</div>
                <div>
                  Elena Fischer
                  <div className="text-xs text-outline font-normal">e.fischer@tierhotel.ch</div>
                </div>
              </td>
              <td className="p-4"><span className="bg-surface-variant text-on-surface-variant text-xs font-bold px-3 py-1 rounded-full border border-outline/20">Mitarbeitende</span></td>
              <td className="p-4 text-sm text-outline">Gestern, 07:05</td>
              <td className="p-4 text-right"><span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">edit</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
