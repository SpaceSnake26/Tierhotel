import React from "react";

export default function SettingsPage() {
  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto w-full">
      <section className="flex flex-col md:flex-row justify-between items-end gap-8 border-none">
        <div className="space-y-2 max-w-2xl">
          <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px]">Präferenzen</p>
          <h2 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Einstellungen</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Allgemeine Systemeinstellungen und Konfigurationen für die Plattform.
          </p>
        </div>
        <button className="bg-primary text-on-primary py-3 px-6 rounded shadow-lg flex items-center justify-center gap-2 font-bold tracking-tight hover:scale-[1.02] active:scale-95 transition-transform">
          <span className="material-symbols-outlined">save</span>
          <span>Speichern</span>
        </button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6 border-b border-surface-container-high pb-4">Profil & Anzeige</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Name des Hotels</label>
              <input type="text" className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-2" defaultValue="Tierhotel 5 Stern" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold">Sprache</label>
              <select className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-2">
                <option>Deutsch (Schweiz)</option>
                <option>Englisch</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6 border-b border-surface-container-high pb-4">Benachrichtigungen</h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary focus:ring-primary" />
              <span>Neue Aufgaben Benachrichtigung</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary focus:ring-primary" />
              <span>Tägliche Zusammenfassung per Email</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary" />
              <span>Dienstplan-Änderungen sofort melden</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
