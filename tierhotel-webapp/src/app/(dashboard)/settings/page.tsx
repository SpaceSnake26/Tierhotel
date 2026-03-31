import { createClient } from '@/utils/supabase/server'
import { saveProfile } from '@/app/actions/settings'

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('full_name, email, role').eq('id', user.id).single()
    : { data: null }

  const ROLE_LABELS: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin / GL',
    employee: 'Mitarbeitende',
    screen: 'Nur-Lese Screen',
  }

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
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <form action={saveProfile} className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6 border-b border-surface-container-high pb-4">Mein Profil</h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-bold">Vollständiger Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                defaultValue={profile?.full_name ?? ''}
                className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-2 focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="Vor- und Nachname"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">E-Mail Adresse</label>
              <input
                type="email"
                value={profile?.email ?? user?.email ?? ''}
                disabled
                className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-2 text-outline cursor-not-allowed"
              />
              <p className="text-xs text-outline">Die E-Mail-Adresse kann nicht geändert werden.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Zugriffsrolle</label>
              <input
                type="text"
                value={ROLE_LABELS[profile?.role ?? ''] ?? profile?.role ?? '—'}
                disabled
                className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-2 text-outline cursor-not-allowed"
              />
              <p className="text-xs text-outline">Die Rolle kann nur von einem Administrator geändert werden.</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="bg-primary text-on-primary py-3 px-6 rounded shadow flex items-center gap-2 font-bold hover:scale-[1.02] active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined" aria-hidden="true">save</span>
              Speichern
            </button>
          </div>
        </form>

        {/* Info Card */}
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6 border-b border-surface-container-high pb-4">System-Info</h3>
          <div className="space-y-4 text-sm text-on-surface-variant">
            <div className="flex justify-between">
              <span className="font-bold text-on-surface">Plattform</span>
              <span>Tierhotel 5 Stern</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-on-surface">Sprache</span>
              <span>Deutsch (Schweiz)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-on-surface">Screen URL</span>
              <span className="text-primary font-mono text-xs">/screen</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
