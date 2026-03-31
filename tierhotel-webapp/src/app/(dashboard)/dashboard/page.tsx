import { createClient } from '@/utils/supabase/server'
import { LiveClockDisplay } from '@/components/LiveClock'
import Link from 'next/link'

export default async function Dashboard() {
  const supabase = await createClient()

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const [{ data: shifts }, { data: absences }, { data: tasks }] = await Promise.all([
    supabase
      .from('shifts')
      .select('id, start_time, end_time, role_label, status, profiles(full_name)')
      .gte('start_time', todayStart.toISOString())
      .lte('start_time', todayEnd.toISOString())
      .order('start_time'),
    supabase
      .from('absences')
      .select('id, type, start_date, end_date, status, profiles(full_name)')
      .lte('start_date', todayEnd.toISOString().slice(0, 10))
      .gte('end_date', todayStart.toISOString().slice(0, 10))
      .order('start_date'),
    supabase
      .from('tasks')
      .select('id, title, priority, due_date, status')
      .eq('status', 'open')
      .eq('priority', 'high')
      .order('due_date', { nullsFirst: false })
      .limit(3),
  ])

  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto w-full">
      <section className="flex flex-col md:flex-row justify-between items-end gap-8 border-none">
        <div className="space-y-2 max-w-2xl">
          <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px]">Herzlich Willkommen</p>
          <h2 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Dashboard Übersicht</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Verwalten Sie heute die exklusiven Aufenthalte Ihrer Gäste. Der Fokus liegt auf Exzellenz und Detailgenauigkeit.
          </p>
        </div>
        <LiveClockDisplay />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Today's Shifts */}
        <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 transition-all border-none">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" aria-hidden="true">schedule</span>
              <h3 className="text-xl font-headline font-bold">Heutige Schichten</h3>
            </div>
            <Link href="/roster" className="text-[11px] font-bold tracking-widest text-primary uppercase hover:underline">
              Gesamter Plan
            </Link>
          </div>
          {shifts && shifts.length > 0 ? (
            <div className="space-y-4">
              {shifts.map((shift) => {
                const name = (shift.profiles as { full_name: string } | null)?.full_name ?? 'Unbekannt'
                const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                const start = new Date(shift.start_time).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
                const end = new Date(shift.end_time).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
                return (
                  <div key={shift.id} className="flex items-center gap-6 p-4 rounded-lg bg-surface-container-low/40 hover:bg-surface-container-low transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-on-surface">{name}</h4>
                      <p className="text-xs text-outline">{shift.role_label}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-headline font-bold text-primary">{start} - {end}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-bold uppercase">Aktiv</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-outline">
              <span className="material-symbols-outlined text-4xl block mb-2" aria-hidden="true">calendar_today</span>
              <p className="font-medium">Keine Schichten für heute eingetragen.</p>
              <Link href="/roster/new" className="text-primary font-bold text-sm hover:underline mt-2 inline-block">
                Schicht eintragen
              </Link>
            </div>
          )}
        </div>

        {/* Absences */}
        <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-8 flex flex-col border-none relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-secondary" aria-hidden="true">person_off</span>
            <h3 className="text-xl font-headline font-bold">Abwesenheiten</h3>
          </div>
          {absences && absences.length > 0 ? (
            <div className="space-y-4 flex-1">
              {absences.map((absence) => {
                const name = (absence.profiles as { full_name: string } | null)?.full_name ?? 'Unbekannt'
                const typeMap: Record<string, string> = { sick: 'Krank', vacation: 'Ferien', other: 'Abwesend' }
                return (
                  <div key={absence.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold">{name}</span>
                      <span className="text-xs text-secondary font-bold">{typeMap[absence.type] ?? absence.type}</span>
                    </div>
                    <p className="text-xs text-outline">
                      {new Date(absence.start_date).toLocaleDateString('de-CH')} – {new Date(absence.end_date).toLocaleDateString('de-CH')}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-outline flex-1 flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-3xl block mb-2" aria-hidden="true">check_circle</span>
              <p className="text-sm font-medium">Keine Abwesenheiten heute.</p>
            </div>
          )}
        </div>

        {/* High Priority Tasks */}
        {tasks && tasks.length > 0 && (
          <div className="md:col-span-12 bg-surface-container-lowest rounded-xl p-8 border-none">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-error" aria-hidden="true">assignment_late</span>
              <h3 className="text-xl font-headline font-bold">Dringende Aufgaben</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 rounded-lg bg-error/5 border border-error/20">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-error/10 text-error font-bold uppercase">Hoch</span>
                  <h4 className="font-bold mt-2 text-on-surface">{task.title}</h4>
                  {task.due_date && (
                    <p className="text-xs text-outline mt-1">
                      Fällig: {new Date(task.due_date).toLocaleDateString('de-CH')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
