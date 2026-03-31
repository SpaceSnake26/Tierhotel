import React from "react";
import { login, signup } from "./actions";
import Link from "next/link";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error: errorMsg } = await searchParams

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-primary-container/40 to-surface pointer-events-none"></div>
      
      <main className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white rounded-xl shadow-[0_20px_40px_rgba(17,28,45,0.06)] overflow-hidden">
          <div className="p-8 pt-12 md:p-10 md:pt-14">
            
            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 bg-primary-fixed rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <span className="material-symbols-outlined text-primary text-3xl">pets</span>
              </div>
              <h1 className="font-headline text-2xl font-extrabold text-primary tracking-tighter mb-1">Tierhotel 5 Stern</h1>
              <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest text-center">
                Plattform für Mitarbeiter
              </p>
            </div>
            
            {errorMsg && (
              <div className="bg-error/10 text-error p-4 rounded-md mb-6 font-bold text-sm border-l-4 border-error">
                {errorMsg}
              </div>
            )}
            
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="email">
                  E-Mail-Adresse
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-lg">mail</span>
                  </div>
                  <input 
                    className="block w-full pl-11 pr-4 py-3 bg-surface-container-low border-none rounded-lg text-on-surface placeholder-outline focus:ring-2 focus:ring-primary-container text-sm transition-all" 
                    id="email" 
                    name="email" 
                    placeholder="mitarbeitende@tierhotel.ch" 
                    type="email"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
               <div className="flex justify-between items-end px-1">
                  <label className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider" htmlFor="password">Passwort</label>
                  <Link className="text-secondary text-xs font-medium hover:underline transition-all" href="#">Passwort vergessen?</Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-lg">lock</span>
                  </div>
                  <input 
                    className="block w-full pl-11 pr-4 py-3 bg-surface-container-low border-none rounded-lg text-on-surface placeholder-outline focus:ring-2 focus:ring-primary-container text-sm transition-all" 
                    id="password" 
                    name="password" 
                    placeholder="••••••••••••" 
                    type="password"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="fullName">
                  Vollständiger Name <span className="text-outline font-normal normal-case tracking-normal">(nur bei Registrierung)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-lg" aria-hidden="true">person</span>
                  </div>
                  <input
                    className="block w-full pl-11 pr-4 py-3 bg-surface-container-low border-none rounded-lg text-on-surface placeholder-outline focus:ring-2 focus:ring-primary-container text-sm transition-all"
                    id="fullName"
                    name="fullName"
                    placeholder="Vor- und Nachname"
                    type="text"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <button 
                  formAction={login}
                  className="w-full bg-primary text-on-primary py-3.5 rounded-lg font-bold tracking-wide hover:bg-primary-fixed hover:text-on-primary-fixed active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Anmelden</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
                <button 
                  formAction={signup}
                  className="w-full bg-surface-container-high text-on-surface py-3.5 rounded-lg font-bold tracking-wide hover:bg-surface-container-highest active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Konto registrieren</span>
                  <span className="material-symbols-outlined text-sm">person_add</span>
                </button>
              </div>
            </form>
            
          </div>
          <div className="bg-surface-container-lowest p-6 text-center border-t border-surface-container-high">
            <p className="text-xs text-outline font-medium">
              Kein Zugang? Wenden Sie sich an die <Link href="#" className="text-primary hover:underline font-bold">IT-Administration</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-outline text-xs font-medium space-x-4">
          <Link href="#" className="hover:text-primary transition-colors">Datenschutz</Link>
          <span>•</span>
          <Link href="#" className="hover:text-primary transition-colors">Impressum</Link>
          <span>•</span>
          <Link href="#" className="hover:text-primary transition-colors">Hilfe</Link>
        </div>
      </main>
    </div>
  );
}
