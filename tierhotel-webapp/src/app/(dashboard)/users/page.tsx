import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

const ROLE_STYLES: Record<string, string> = {
  super_admin: 'bg-error/10 text-error border border-error/20',
  admin: 'bg-primary/10 text-primary border border-primary/20',
  employee: 'bg-surface-variant text-on-surface-variant border border-outline/20',
  screen: 'bg-secondary/10 text-secondary border border-secondary/20',
}
const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin / GL',
  employee: 'Mitarbeitende',
  screen: 'Nur-Lese Screen',
}

export default async function UsersPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .order('full_name')

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
        <Link href="/users/new" className="bg-primary text-on-primary py-3 px-6 rounded shadow-lg flex items-center gap-2 font-bold tracking-tight hover:scale-[1.02] active:scale-95 transition-transform">
          <span className="material-symbols-outlined" aria-hidden="true">person_add</span>
          Neuer Benutzer
        </Link>
      </section>

      <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
        {profiles && profiles.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-surface-container-high">
                <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider">Name</th>
                <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider">Rolle</th>
                <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider">Mitglied seit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {profiles.map((profile) => {
                const initials = (profile.full_name ?? profile.email ?? '?').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                const memberSince = new Date(profile.created_at).toLocaleDateString('de-CH', { month: 'long', year: 'numeric' })
                return (
                  <tr key={profile.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-bold">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0" aria-hidden="true">
                          {initials}
                        </div>
                        <div>
                          <div>{profile.full_name ?? '(kein Name)'}</div>
                          <div className="text-xs text-outline font-normal">{profile.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${ROLE_STYLES[profile.role] ?? 'bg-surface-variant text-on-surface-variant'}`}>
                        {ROLE_LABELS[profile.role] ?? profile.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-outline">{memberSince}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-16 text-outline">
            <span className="material-symbols-outlined text-4xl block mb-2" aria-hidden="true">group</span>
            <p className="font-medium">Noch keine Benutzer vorhanden.</p>
          </div>
        )}
      </div>
    </div>
  )
}
