import { createClient } from '@/utils/supabase/server'
import { saveProfile } from '@/app/actions/settings'
import { createShiftType, createWorkArea, createHoliday, deleteShiftType, deleteWorkArea, deleteHoliday } from '@/app/actions/dayplan'
import Link from 'next/link'

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab: activeTab = 'schichten' } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [
    { data: profile },
    { data: shiftTypes },
    { data: workAreas },
    { data: holidays },
  ] = await Promise.all([
    user ? supabase.from('profiles').select('full_name, email, role').eq('id', user.id).single() : Promise.resolve({ data: null }),
    supabase.from('shift_types').select('id, code, name, morning_start, morning_end, afternoon_start, afternoon_end, total_hours, color').order('name'),
    supabase.from('work_areas').select('id, code, name, is_training_position').order('code'),
    supabase.from('public_holidays').select('id, date, name, year').order('date').gte('date', `${new Date().getFullYear() - 1}-01-01`),
  ])

  const tabs = [
    { id: 'schichten',    label: 'Schichten' },
    { id: 'bereiche',     label: 'Arbeitsbereiche' },
    { id: 'feiertage',   label: 'Feiertage' },
    { id: 'profil',      label: 'Mein Profil' },
  ]

  const ROLE_LABELS: Record<string, string> = { super_admin:'Super Admin', admin:'Admin / GL', employee:'Mitarbeitende', screen:'Nur-Lese Screen' }

  return (
    <div className="p-12 space-y-8 max-w-5xl mx-auto w-full">
      <section className="space-y-2">
        <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px]">Konfiguration</p>
        <h2 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Einstellungen</h2>
        <p className="text-on-surface-variant text-lg">Systemkonfiguration und Stammdaten</p>
      </section>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-surface-container-high -mb-2">
        {tabs.map(t => (
          <Link
            key={t.id}
            href={`/settings?tab=${t.id}`}
            className={`px-5 py-3 text-sm font-bold transition-colors border-b-2 -mb-px ${
              activeTab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-outline hover:text-on-surface'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* ── Tab: Schichten ──────────────────────────────────────────────────── */}
      {activeTab === 'schichten' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-outline">Definierte Schichttypen für den Einsatzplan</p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container-high">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-surface-container-low border-b border-surface-container-high">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold text-outline uppercase tracking-wider">Kürzel</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-outline uppercase tracking-wider">Bezeichnung</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-outline uppercase tracking-wider">Zeiten</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-outline uppercase tracking-wider">Stunden</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-outline uppercase tracking-wider">Farbe</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {(shiftTypes ?? []).map(st => (
                  <tr key={st.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-xs font-bold px-2 py-1 rounded text-white" style={{ backgroundColor: st.color }}>{st.code}</span>
                    </td>
                    <td className="px-5 py-3 font-medium">{st.name}</td>
                    <td className="px-5 py-3 text-outline text-xs">
                      {st.morning_start}–{st.morning_end} / {st.afternoon_start}–{st.afternoon_end}
                    </td>
                    <td className="px-5 py-3 tabular-nums">{st.total_hours}</td>
                    <td className="px-5 py-3">
                      <span className="w-5 h-5 rounded-full inline-block border border-outline/20" style={{ backgroundColor: st.color }} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <form action={deleteShiftType.bind(null, st.id)}>
                        <button type="submit" className="text-error hover:underline text-xs font-bold">Löschen</button>
                      </form>
                    </td>
                  </tr>
                ))}
                {(shiftTypes ?? []).length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-outline">Keine Schichttypen erfasst.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add shift type form */}
          <form action={createShiftType} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high space-y-4">
            <h4 className="font-bold text-on-surface">Neuen Schichttyp hinzufügen</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1"><label className="text-xs font-bold text-outline">Kürzel *</label><input name="code" required placeholder="z.B. FRUEH" className="w-full bg-surface-container-low border border-outline/20 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none" /></div>
              <div className="space-y-1"><label className="text-xs font-bold text-outline">Bezeichnung *</label><input name="name" required placeholder="z.B. Früh" className="w-full bg-surface-container-low border border-outline/20 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none" /></div>
              <div className="space-y-1"><label className="text-xs font-bold text-outline">Gesamtstunden *</label><input name="total_hours" type="number" step="0.5" required placeholder="8.5" className="w-full bg-surface-container-low border border-outline/20 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none" /></div>
              <div className="space-y-1"><label className="text-xs font-bold text-outline">Morgen Beginn *</label><input name="morning_start" type="time" required className="w-full bg-surface-container-low border border-outline/20 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none" /></div>
              <div className="space-y-1"><label className="text-xs font-bold text-outline">Morgen Ende *</label><input name="morning_end" type="time" required className="w-full bg-surface-container-low border border-outline/20 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none" /></div>
              <div className="space-y-1"><label className="text-xs font-bold text-outline">Farbe</label><input name="color" type="color" defaultValue="#3B82F6" className="w-full h-10 bg-surface-container-low border border-outline/20 rounded-md px-2 py-1 focus:ring-1 focus:ring-primary focus:outline-none" /></div>
              <div className="space-y-1"><label className="text-xs font-bold text-outline">Nachmittag Beginn *</label><input name="afternoon_start" type="time" required className="w-full bg-surface-container-low border border-outline/20 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none" /></div>
              <div className="space-y-1"><label className="text-xs font-bold text-outline">Nachmittag Ende *</label><input name="afternoon_end" type="time" required className="w-full bg-surface-container-low border border-outline/20 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none" /></div>
            </div>
            <button type="submit" className="bg-primary text-on-primary px-6 py-2.5 rounded font-bold text-sm hover:bg-primary/90 transition-colors">
              Schicht hinzufügen
            </button>
          </form>
        </div>
      )}

      {/* ── Tab: Arbeitsbereiche ─────────────────────────────────────────────── */}
      {activeTab === 'bereiche' && (
        <div className="space-y-6">
          <p className="text-sm text-outline">Arbeitsbereiche, die im Einsatzplan zugewiesen werden können</p>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container-high">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-surface-container-low border-b border-surface-container-high">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold text-outline uppercase tracking-wider">Kürzel</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-outline uppercase tracking-wider">Bezeichnung</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-outline uppercase tracking-wider">Ausbildungsplatz</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {(workAreas ?? []).map(wa => (
                  <tr key={wa.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-xs font-bold bg-surface-container px-2 py-1 rounded text-on-surface">{wa.code}</span>
                    </td>
                    <td className="px-5 py-3 font-medium">{wa.name}</td>
                    <td className="px-5 py-3">
                      {wa.is_training_position
                        ? <span className="text-xs font-bold text-primary bg-primary-fixed/30 px-2 py-0.5 rounded">Ja</span>
                        : <span className="text-xs text-outline">—</span>
                      }
                    </td>
                    <td className="px-5 py-3 text-right">
                      <form action={deleteWorkArea.bind(null, wa.id)}>
                        <button type="submit" className="text-error hover:underline text-xs font-bold">Löschen</button>
                      </form>
                    </td>
                  </tr>
                ))}
                {(workAreas ?? []).length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-outline">Keine Arbeitsbereiche erfasst.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <form action={createWorkArea} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high space-y-4">
            <h4 className="font-bold text-on-surface">Neuen Arbeitsbereich hinzufügen</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1"><label className="text-xs font-bold text-outline">Kürzel *</label><input name="code" required placeholder="z.B. A" className="w-full bg-surface-container-low border border-outline/20 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none" /></div>
              <div className="space-y-1"><label className="text-xs font-bold text-outline">Bezeichnung *</label><input name="name" required placeholder="z.B. Kundendienst" className="w-full bg-surface-container-low border border-outline/20 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none" /></div>
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input name="is_training_position" type="checkbox" className="w-4 h-4 text-primary focus:ring-primary rounded" />
                <span className="text-sm font-medium">Ausbildungsplatz</span>
              </label>
            </div>
            <button type="submit" className="bg-primary text-on-primary px-6 py-2.5 rounded font-bold text-sm hover:bg-primary/90 transition-colors">
              Bereich hinzufügen
            </button>
          </form>
        </div>
      )}

      {/* ── Tab: Feiertage ───────────────────────────────────────────────────── */}
      {activeTab === 'feiertage' && (
        <div className="space-y-6">
          <p className="text-sm text-outline">Gesetzliche Feiertage beeinflussen die Soll-Zeit-Berechnung</p>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container-high">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-surface-container-low border-b border-surface-container-high">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold text-outline uppercase tracking-wider">Datum</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-outline uppercase tracking-wider">Bezeichnung</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-outline uppercase tracking-wider">Jahr</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {(holidays ?? []).map(h => (
                  <tr key={h.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-3 font-mono">{new Date(h.date).toLocaleDateString('de-CH', { day:'numeric', month:'long', year:'numeric' })}</td>
                    <td className="px-5 py-3 font-medium">{h.name}</td>
                    <td className="px-5 py-3 text-outline">{h.year}</td>
                    <td className="px-5 py-3 text-right">
                      <form action={deleteHoliday.bind(null, h.id)}>
                        <button type="submit" className="text-error hover:underline text-xs font-bold">Löschen</button>
                      </form>
                    </td>
                  </tr>
                ))}
                {(holidays ?? []).length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-outline">Keine Feiertage erfasst.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <form action={createHoliday} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high space-y-4">
            <h4 className="font-bold text-on-surface">Feiertag hinzufügen</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-xs font-bold text-outline">Datum *</label><input name="date" type="date" required className="w-full bg-surface-container-low border border-outline/20 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none" /></div>
              <div className="space-y-1"><label className="text-xs font-bold text-outline">Bezeichnung *</label><input name="name" required placeholder="z.B. Neujahr" className="w-full bg-surface-container-low border border-outline/20 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none" /></div>
            </div>
            <button type="submit" className="bg-primary text-on-primary px-6 py-2.5 rounded font-bold text-sm hover:bg-primary/90 transition-colors">
              Feiertag hinzufügen
            </button>
          </form>
        </div>
      )}

      {/* ── Tab: Profil ──────────────────────────────────────────────────────── */}
      {activeTab === 'profil' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form action={saveProfile} className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-surface-container-high space-y-6">
            <h3 className="text-xl font-bold border-b border-surface-container-high pb-4">Mein Profil</h3>
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-bold">Vollständiger Name</label>
              <input type="text" id="fullName" name="fullName" required defaultValue={profile?.full_name ?? ''} className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-2 focus:ring-1 focus:ring-primary focus:outline-none" placeholder="Vor- und Nachname" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">E-Mail</label>
              <input type="email" value={profile?.email ?? user?.email ?? ''} disabled className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-2 text-outline cursor-not-allowed" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Rolle</label>
              <input type="text" value={ROLE_LABELS[profile?.role ?? ''] ?? profile?.role ?? '—'} disabled className="w-full bg-surface-container-low border border-outline/20 rounded-md px-4 py-2 text-outline cursor-not-allowed" />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-primary text-on-primary py-2.5 px-6 rounded font-bold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm" aria-hidden="true">save</span>
                Speichern
              </button>
            </div>
          </form>

          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-surface-container-high">
            <h3 className="text-xl font-bold border-b border-surface-container-high pb-4">System-Info</h3>
            <div className="space-y-4 text-sm text-on-surface-variant mt-4">
              <div className="flex justify-between"><span className="font-bold text-on-surface">Plattform</span><span>Tierhotel 5 Stern</span></div>
              <div className="flex justify-between"><span className="font-bold text-on-surface">Sprache</span><span>Deutsch (Schweiz)</span></div>
              <div className="flex justify-between"><span className="font-bold text-on-surface">Screen URL</span><span className="text-primary font-mono text-xs">/screen</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
