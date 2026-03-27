import Link from "next/link";
import Image from "next/image";

export function Sidebar() {
  return (
    <aside className="h-screen w-72 flex-col flex sticky top-0 left-0 bg-[#f3f4f5] border-none font-headline antialiased tracking-tight">
      <div className="flex flex-col h-full py-8">
        <div className="px-8 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              T5
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter text-[#006B54]">Tierhotel 5 Stern</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-outline">The Modern Concierge</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <Link href="/dashboard" className="text-[#006B54] font-extrabold flex items-center gap-3 py-3 px-8 bg-white/50 hover:bg-white/30 transition-colors duration-200">
            <span className="material-symbols-outlined shrink-0">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/roster" className="text-slate-500 font-medium flex items-center gap-3 py-3 px-8 hover:bg-white/30 transition-colors duration-200">
            <span className="material-symbols-outlined shrink-0">calendar_today</span>
            <span>Dienstplan</span>
          </Link>
          <Link href="/absences" className="text-slate-500 font-medium flex items-center gap-3 py-3 px-8 hover:bg-white/30 transition-colors duration-200">
            <span className="material-symbols-outlined shrink-0">person_off</span>
            <span>Abwesenheiten</span>
          </Link>
          <Link href="/tasks" className="text-slate-500 font-medium flex items-center gap-3 py-3 px-8 hover:bg-white/30 transition-colors duration-200">
            <span className="material-symbols-outlined shrink-0">assignment</span>
            <span>Aufgaben</span>
          </Link>
          <Link href="/notes" className="text-slate-500 font-medium flex items-center gap-3 py-3 px-8 hover:bg-white/30 transition-colors duration-200">
            <span className="material-symbols-outlined shrink-0">sticky_note_2</span>
            <span>Notizen</span>
          </Link>
          <Link href="/events" className="text-slate-500 font-medium flex items-center gap-3 py-3 px-8 hover:bg-white/30 transition-colors duration-200">
            <span className="material-symbols-outlined shrink-0">event</span>
            <span>Kalender</span>
          </Link>
          <Link href="/users" className="text-slate-500 font-medium flex items-center gap-3 py-3 px-8 hover:bg-white/30 transition-colors duration-200">
            <span className="material-symbols-outlined shrink-0">group</span>
            <span>Benutzer</span>
          </Link>
          <Link href="/settings" className="text-slate-500 font-medium flex items-center gap-3 py-3 px-8 hover:bg-white/30 transition-colors duration-200">
            <span className="material-symbols-outlined shrink-0">settings</span>
            <span>Einstellungen</span>
          </Link>
        </nav>
        <div className="px-8 mt-auto">
          <button className="w-full bg-primary text-on-primary py-4 rounded shadow-lg flex items-center justify-center gap-2 font-bold tracking-tight hover:scale-[1.02] active:scale-95 transition-transform">
            <span className="material-symbols-outlined shrink-0">add</span>
            <span>Neuer Eintrag</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
