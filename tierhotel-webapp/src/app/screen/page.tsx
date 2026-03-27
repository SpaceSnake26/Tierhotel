import React from "react";

export default function InfoScreenPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen p-12 pr-16 pl-16 flex flex-col font-headline">
      {/* Header */}
      <header className="flex justify-between items-center border-b-[3px] border-primary pb-8 mb-12">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white font-black text-3xl">
              T5
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tighter text-[#006B54]">Tierhotel 5 Stern</h1>
              <p className="text-xl uppercase tracking-[0.2em] text-outline font-bold mt-2">Team Info Screen</p>
            </div>
        </div>
        <div className="text-right flex items-center gap-8">
          <div className="text-3xl uppercase tracking-widest font-bold text-outline">Heute</div>
          <div className="h-16 w-[4px] bg-primary"></div>
          <div className="text-7xl font-black text-primary tracking-tighter">09:42</div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-12 flex-1">
        
        {/* Left Column: Shifts & Absences */}
        <div className="space-y-12">
          {/* Active Shifts */}
          <div className="bg-surface-container-lowest rounded-3xl p-10 shadow-lg h-full border-t-8 border-primary">
            <h2 className="text-4xl font-bold flex items-center gap-4 mb-10">
              <span className="material-symbols-outlined text-[48px] text-primary" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>schedule</span>
              Aktuelle Schichten
            </h2>
            <div className="space-y-8">
              <div className="flex items-center gap-8 bg-surface-container-low p-6 rounded-2xl">
                <div className="w-20 h-20 rounded-full bg-secondary text-white flex items-center justify-center text-2xl font-black">EF</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold">Elena Fischer</h3>
                  <p className="text-xl text-outline font-medium mt-1">Morgenschicht</p>
                </div>
                <div className="text-3xl font-black text-primary">07:00 - 15:30</div>
              </div>
              <div className="flex items-center gap-8 bg-surface-container-low p-6 rounded-2xl">
                <div className="w-20 h-20 rounded-full bg-surface-variant text-on-surface flex items-center justify-center text-2xl font-black">LM</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold">Lukas Meier (Ersatz)</h3>
                  <p className="text-xl text-outline font-medium mt-1">Morgenschicht</p>
                </div>
                <div className="text-3xl font-black text-primary">07:00 - 15:30</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: News & Priority Tasks */}
        <div className="space-y-12 flex flex-col">
          {/* Important Notice */}
          <div className="bg-error/10 border-l-[12px] border-error rounded-3xl p-10 shadow-lg">
             <h2 className="text-3xl font-bold flex items-center gap-4 mb-6 text-error">
              <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>campaign</span>
              Wichtige Mitteilung
            </h2>
            <h3 className="text-4xl font-black mb-4">Wartung Klimaanlage in Trakt B</h3>
            <p className="text-2xl text-on-surface-variant leading-relaxed font-medium">
              Heute zwischen 09:00 und 11:00 kommt der Techniker. Bitte in dieser Zeit keine neuen Hunde in den ersten Boxen unterbringen!
            </p>
          </div>

          {/* Priority Tasks */}
           <div className="bg-surface-container-lowest rounded-3xl p-10 shadow-lg flex-1 border-t-8 border-secondary">
            <h2 className="text-4xl font-bold flex items-center gap-4 mb-10">
              <span className="material-symbols-outlined text-[48px] text-secondary" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>assignment_late</span>
              Priorität Heute
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-6 bg-surface-container-low p-6 rounded-2xl">
                <span className="material-symbols-outlined text-[40px] text-secondary mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                <div>
                  <h3 className="text-3xl font-bold">VIP Suite Endreinigung</h3>
                  <p className="text-xl text-on-surface-variant font-medium mt-2">Zimmer 402 - Erwartet um 14:00 Uhr</p>
                </div>
              </div>
               <div className="flex items-start gap-6 bg-surface-container-low p-6 rounded-2xl">
                <span className="material-symbols-outlined text-[40px] text-primary mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                <div>
                  <h3 className="text-3xl font-bold">Willkommen Golden Retriever 'Bello'</h3>
                  <p className="text-xl text-on-surface-variant font-medium mt-2">Neuer VIP Gast - Sehr menschenbezogen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
