import React from "react";
import { inviteUser } from "@/app/actions/user";
import Link from "next/link";

export default function NewUserPage() {
  return (
    <div className="p-12 space-y-12 max-w-3xl mx-auto w-full">
      <section className="flex flex-col gap-4 border-none mb-8">
        <Link href="/users" className="text-primary font-bold flex items-center gap-2 hover:underline w-fit">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Zurück zu Benutzern
        </Link>
        <h2 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface">Neuen Benutzer einladen</h2>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Laden Sie neue Teammitglieder per E-Mail zur Plattform ein.
        </p>
      </section>

      <div className="bg-error/10 border-l-[6px] border-error rounded-r-lg p-6 mb-8 text-on-surface">
        <h3 className="font-bold flex items-center gap-2 text-error mb-2">
          <span className="material-symbols-outlined">info</span>
          Entwickler Hinweis
        </h3>
        <p className="text-sm">
          Das Einladen von Benutzern über das Admin-Panel erfordert den <strong>Supabase Service Role Key</strong>, um die Auth-API sicher anzusprechen. Dieser Key darf nicht im Client sichtbar sein. In diesem MVP wird der Request simuliert validiert, aber nicht an Supabase gesendet, solange der Service Key fehlt.
        </p>
      </div>

      <form action={inviteUser} className="bg-surface-container-lowest rounded-xl p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-bold text-on-surface">Vollständiger Name *</label>
          <input 
            type="text" 
            id="fullName" 
            name="fullName" 
            required
            className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none" 
            placeholder="z.B. Max Mustermann" 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-bold text-on-surface">E-Mail Adresse *</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required
            className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none" 
            placeholder="max.m@tierhotel.ch" 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-bold text-on-surface">Zugriffsrolle *</label>
          <select 
            id="role" 
            name="role" 
            className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-3 focus:ring-1 focus:ring-primary focus:outline-none"
          >
            <option value="employee">Mitarbeitende</option>
            <option value="admin">Administrator (GL)</option>
            <option value="screen">Nur-Lese Screen</option>
          </select>
        </div>

        <div className="pt-6 border-t border-surface-container-high flex justify-end gap-4">
          <Link href="/users" className="px-6 py-3 rounded font-bold text-on-surface hover:bg-surface-container-high transition-colors">
            Abbrechen
          </Link>
          <button type="submit" className="bg-primary text-on-primary py-3 px-8 rounded shadow flex items-center justify-center gap-2 font-bold hover:scale-[1.02] active:scale-95 transition-transform">
            <span className="material-symbols-outlined">mail</span>
            <span>Einladung senden</span>
          </button>
        </div>
      </form>
    </div>
  );
}
