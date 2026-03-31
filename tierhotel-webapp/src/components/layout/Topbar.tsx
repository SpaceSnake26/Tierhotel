import { logout } from '@/app/actions/auth'

export function Topbar() {
  return (
    <header className="w-full h-16 sticky top-0 z-40 bg-[#f8f9fa]/80 backdrop-blur-xl flex justify-between items-center px-12 ml-auto">
      <div className="flex items-center gap-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm" aria-hidden="true">search</span>
          <input
            className="bg-surface-container-highest border-none rounded-full pl-10 pr-4 py-1.5 text-[11px] font-bold tracking-widest focus:ring-1 focus:ring-primary w-64 placeholder:text-outline uppercase transition-all"
            placeholder="SUCHEN..."
            type="text"
            aria-label="Suchen"
          />
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-6">
          <span className="material-symbols-outlined text-slate-400 hover:text-[#904d00] cursor-pointer transition-colors" aria-label="Benachrichtigungen">notifications</span>
          <span className="material-symbols-outlined text-slate-400 hover:text-[#904d00] cursor-pointer transition-colors" aria-label="Hilfe">help_outline</span>
          <form action={logout}>
            <button
              type="submit"
              className="material-symbols-outlined text-slate-400 hover:text-[#904d00] cursor-pointer transition-colors bg-transparent border-none p-0"
              aria-label="Abmelden"
              title="Abmelden"
            >
              logout
            </button>
          </form>
        </div>
        <div className="h-6 w-[1px] bg-outline-variant/20"></div>
        <div className="text-[11px] font-bold tracking-widest text-primary uppercase">Tierhotel 5 Stern</div>
      </div>
    </header>
  );
}
