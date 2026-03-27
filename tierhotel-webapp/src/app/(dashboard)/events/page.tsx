import React from "react";
import Link from "next/link";

export default function EventsPage() {
  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto w-full">
      <section className="flex flex-col md:flex-row justify-between items-end gap-8 border-none">
        <div className="space-y-2 max-w-2xl">
          <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px]">Übersicht</p>
          <h2 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Kalender / Events</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Geplante Veranstaltungen, Besichtigungen und Teamevents im Boutique-Hotel.
          </p>
        </div>
        <Link href="/events/new" className="bg-primary text-on-primary py-3 px-6 rounded shadow-lg flex items-center justify-center gap-2 font-bold tracking-tight hover:scale-[1.02] active:scale-95 transition-transform">
          <span className="material-symbols-outlined">add</span>
          <span>Neuer Event</span>
        </Link>
      </section>

      <div className="bg-surface-container-low rounded-xl p-8 border-none">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-surface-container-lowest p-6 rounded-lg flex gap-6 hover:shadow transition-shadow">
            <div className="flex flex-col items-center justify-center bg-primary-fixed/30 rounded-lg px-6 py-4 min-w-[90px]">
              <span className="text-xs font-bold uppercase tracking-widest text-on-primary-fixed-variant">MAI</span>
              <span className="text-3xl font-headline font-black text-primary">15</span>
            </div>
            <div className="flex-1 space-y-2 flex flex-col justify-center">
              <h4 className="font-bold text-xl">Teambildung & Apéro</h4>
              <p className="text-sm text-outline flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">schedule</span> 18:00 - 21:00
                <span className="material-symbols-outlined text-[16px] ml-4">location_on</span> Dachterrasse Lounge
              </p>
              <p className="text-sm mt-2 text-on-surface-variant">Abschluss des Quartals mit einem kleinen Apéro für das gesamte Personal.</p>
            </div>
            <button className="self-center">
              <span className="material-symbols-outlined text-outline hover:text-primary transition-colors text-3xl">more_vert</span>
            </button>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-lg flex gap-6 hover:shadow transition-shadow">
            <div className="flex flex-col items-center justify-center bg-secondary-fixed/30 rounded-lg px-6 py-4 min-w-[90px]">
              <span className="text-xs font-bold uppercase tracking-widest text-on-secondary-fixed-variant">MAI</span>
              <span className="text-3xl font-headline font-black text-secondary">20</span>
            </div>
            <div className="flex-1 space-y-2 flex flex-col justify-center">
              <h4 className="font-bold text-xl">VIP Führung Tierfreunde Schweiz</h4>
              <p className="text-sm text-outline flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">schedule</span> 14:00 - 16:00
                <span className="material-symbols-outlined text-[16px] ml-4">location_on</span> Gesamte Anlage
              </p>
              <p className="text-sm mt-2 text-on-surface-variant">Besichtigung der Anlage durch den Dachverband. Bereich A muss makellos sein.</p>
            </div>
            <button className="self-center">
              <span className="material-symbols-outlined text-outline hover:text-primary transition-colors text-3xl">more_vert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
