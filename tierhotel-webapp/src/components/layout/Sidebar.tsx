'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/roster', icon: 'calendar_today', label: 'Dienstplan' },
  { href: '/absences', icon: 'person_off', label: 'Abwesenheiten' },
  { href: '/tasks', icon: 'assignment', label: 'Aufgaben' },
  { href: '/notes', icon: 'sticky_note_2', label: 'Notizen' },
  { href: '/events', icon: 'event', label: 'Kalender' },
  { href: '/users', icon: 'group', label: 'Benutzer' },
  { href: '/settings', icon: 'settings', label: 'Einstellungen' },
]

export function Sidebar() {
  const pathname = usePathname()

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
        <nav className="flex-1 space-y-1" aria-label="Hauptnavigation">
          {navItems.map(({ href, icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={
                  isActive
                    ? "text-[#006B54] font-extrabold flex items-center gap-3 py-3 px-8 bg-white/50 hover:bg-white/30 transition-colors duration-200"
                    : "text-slate-500 font-medium flex items-center gap-3 py-3 px-8 hover:bg-white/30 transition-colors duration-200"
                }
              >
                <span className="material-symbols-outlined shrink-0" aria-hidden="true">{icon}</span>
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="px-8 mt-auto">
          <Link
            href="/roster/new"
            className="w-full bg-primary text-on-primary py-4 rounded shadow-lg flex items-center justify-center gap-2 font-bold tracking-tight hover:scale-[1.02] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined shrink-0" aria-hidden="true">add</span>
            <span>Neuer Eintrag</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
