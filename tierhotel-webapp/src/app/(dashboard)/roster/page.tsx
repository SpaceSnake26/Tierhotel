import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

function getWeekBounds(weekParam?: string): { monday: Date; friday: Date; label: string } {
  const base = weekParam ? new Date(weekParam) : new Date()
  if (isNaN(base.getTime())) {
    return getWeekBounds(undefined)
  }
  // Shift to Monday
  const day = base.getDay() // 0=Sun
  const diff = (day === 0 ? -6 : 1 - day)
  const monday = new Date(base)
  monday.setDate(base.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  const friday = new Date(monday)
  friday.setDate(monday.getDate() + 6) // include full weekend for >=lte
  friday.setHours(23, 59, 59, 999)

  const label = monday.toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' })
  return { monday, friday, label }
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

const DAYS_DE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']

export default async function RosterPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>
}) {
  const { week: weekParam } = await searchParams
  const supabase = await createClient()

  const { monday, friday, label } = getWeekBounds(weekParam)

  const prevMonday = new Date(monday)
  prevMonday.setDate(monday.getDate() - 7)
  const nextMonday = new Date(monday)
  nextMonday.setDate(monday.getDate() + 7)

  const weekDays: Date[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })

  const today = isoDate(new Date())

  const [{ data: profiles }, { data: shifts }, { data: absences }] = await Promise.all([
    supabase.from('profiles').select('id, full_name').order('full_name'),
    supabase
      .from('shifts')
      .select('id, user_id, start_time, end_time, role_label, status')
      .gte('start_time', monday.toISOString())
      .lte('start_time', friday.toISOString()),
    supabase
      .from('absences')
      .select('id, user_id, type, start_date, end_date, status')
      .lte('start_date', isoDate(friday))
      .gte('end_date', isoDate(monday)),
  ])

  // Index: userId -> day-string -> shift[]
  const shiftMap: Record<string, Record<string, Array<{ id: string; start_time: string; end_time: string; role_label: string }>>> = {}
  for (const shift of shifts ?? []) {
    const day = isoDate(new Date(shift.start_time))
    if (!shiftMap[shift.user_id]) shiftMap[shift.user_id] = {}
    if (!shiftMap[shift.user_id][day]) shiftMap[shift.user_id][day] = []
    shiftMap[shift.user_id][day].push(shift)
  }

  // Index: userId -> Set of absence dates
  const absenceMap: Record<string, Set<string>> = {}
  for (const absence of absences ?? []) {
    if (!absenceMap[absence.user_id]) absenceMap[absence.user_id] = new Set()
    const start = new Date(absence.start_date)
    const end = new Date(absence.end_date)
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      absenceMap[absence.user_id].add(isoDate(new Date(d)))
    }
  }

  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto w-full">
      <section className="flex flex-col md:flex-row justify-between items-end gap-8 border-none">
        <div className="space-y-2 max-w-2xl">
          <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px]">Planung</p>
          <h2 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Dienstplan</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">Wochenplanung für das gesamte Personal.</p>
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <Link
            href={`/roster?week=${isoDate(prevMonday)}`}
            className="bg-surface-container-high text-on-surface py-3 px-6 rounded shadow flex items-center gap-2 font-bold tracking-tight hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
            Vorherige Woche
          </Link>
          <span className="text-sm font-bold text-outline px-2">KW {label}</span>
          <Link
            href={`/roster?week=${isoDate(nextMonday)}`}
            className="bg-surface-container-high text-on-surface py-3 px-6 rounded shadow flex items-center gap-2 font-bold tracking-tight hover:bg-surface-container-highest transition-colors"
          >
            Nächste Woche
            <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
          </Link>
          <Link
            href="/roster/new"
            className="bg-primary text-on-primary py-3 px-6 rounded shadow flex items-center gap-2 font-bold tracking-tight hover:scale-[1.02] active:scale-95 transition-colors ml-2"
          >
            <span className="material-symbols-outlined" aria-hidden="true">add</span>
            Schicht eintragen
          </Link>
        </div>
      </section>

      <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
        {profiles && profiles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-surface-container-high">
                  <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider min-w-[160px]">
                    Mitarbeiter
                  </th>
                  {weekDays.map((day, i) => {
                    const dayStr = isoDate(day)
                    const isToday = dayStr === today
                    return (
                      <th
                        key={dayStr}
                        className={`p-4 font-headline font-bold text-xs tracking-wider ${isToday ? 'text-primary' : 'text-outline'}`}
                      >
                        <div>{DAYS_DE[i]}</div>
                        <div className={`text-lg font-black ${isToday ? 'text-primary' : 'text-on-surface'}`}>
                          {day.getDate()}.
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {profiles.map((profile) => {
                  const initials = (profile.full_name ?? '?').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                  return (
                    <tr key={profile.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-4 font-bold flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                          {initials}
                        </div>
                        {profile.full_name ?? 'Unbekannt'}
                      </td>
                      {weekDays.map((day) => {
                        const dayStr = isoDate(day)
                        const dayShifts = shiftMap[profile.id]?.[dayStr] ?? []
                        const isAbsent = absenceMap[profile.id]?.has(dayStr) ?? false
                        return (
                          <td key={dayStr} className="p-4">
                            {isAbsent && dayShifts.length === 0 ? (
                              <div className="bg-error/10 text-error text-xs font-bold px-3 py-2 rounded">Abwesend</div>
                            ) : dayShifts.length > 0 ? (
                              dayShifts.map((s) => {
                                const start = new Date(s.start_time).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
                                const end = new Date(s.end_time).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
                                return (
                                  <div key={s.id} className="bg-primary/10 text-primary text-xs font-bold px-3 py-2 rounded mb-1">
                                    {start} – {end}
                                    <div className="font-normal text-[10px] opacity-70">{s.role_label}</div>
                                  </div>
                                )
                              })
                            ) : (
                              <div className="bg-surface-variant text-on-surface-variant text-xs font-bold px-3 py-2 rounded">Frei</div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-outline">
            <span className="material-symbols-outlined text-4xl block mb-2" aria-hidden="true">group</span>
            <p className="font-medium">Keine Mitarbeitenden gefunden.</p>
            <Link href="/users/new" className="text-primary font-bold text-sm hover:underline mt-2 inline-block">
              Ersten Benutzer einladen
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
