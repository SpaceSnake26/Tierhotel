import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto w-full">
      {/* Hero Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-8 border-none">
        <div className="space-y-2 max-w-2xl">
          <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px]">Herzlich Willkommen</p>
          <h2 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Dashboard Übersicht</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Verwalten Sie heute die exklusiven Aufenthalte Ihrer Gäste. Der Fokus liegt auf Exzellenz und Detailgenauigkeit.
          </p>
        </div>
        <div className="bg-surface-container-low px-8 py-6 rounded-xl flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs uppercase tracking-widest font-bold text-outline">Aktuelles Datum</div>
            <div className="text-xl font-headline font-bold">Heute</div>
          </div>
          <div className="h-10 w-[2px] bg-primary"></div>
          <div className="text-4xl font-headline font-black text-primary">09:42</div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Today's Shifts (Large Card) */}
        <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 transition-all border-none">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">schedule</span>
              <h3 className="text-xl font-headline font-bold">Heutige Schichten</h3>
            </div>
            <button className="text-[11px] font-bold tracking-widest text-primary uppercase hover:underline">Gesamter Plan</button>
          </div>
          <div className="space-y-4">
            {/* Shift Items (Mocked for now) */}
            <div className="flex items-center gap-6 p-4 rounded-lg bg-surface-container-low/40 hover:bg-surface-container-low transition-colors group">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-slate-200"></div>
              <div className="flex-1">
                <h4 className="font-bold text-on-surface">Elena Fischer</h4>
                <p className="text-xs text-outline">Lead Concierge • Morgenschicht</p>
              </div>
              <div className="text-right">
                <div className="font-headline font-bold text-primary">07:00 - 15:30</div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-bold uppercase">Aktiv</span>
              </div>
            </div>
          </div>
        </div>

        {/* Absences (Small Card) */}
        <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-8 flex flex-col border-none relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-secondary">person_off</span>
            <h3 className="text-xl font-headline font-bold">Abwesenheiten</h3>
          </div>
          <div className="space-y-6 flex-1">
            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">Lukas Meier</span>
                <span className="text-xs text-secondary font-bold">Krank</span>
              </div>
              <p className="text-xs text-outline">Bis Freitag</p>
            </div>
          </div>
        </div>
        
        {/* Further Dashboard Widgets (Tasks, Events) can go here */}
      </div>
    </div>
  );
}
