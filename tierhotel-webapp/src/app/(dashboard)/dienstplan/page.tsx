import { createClient } from '@/utils/supabase/server'
import { ScheduleGrid } from './ScheduleGrid'
import Link from 'next/link'

function isoMonthStart(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-01`
}
function isoMonthEnd(year: number, month: number) {
  const last = new Date(year, month + 1, 0).getDate()
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(last).padStart(2, '0')}`
}

const MONTH_NAMES = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']

export default async function DienstplanPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; y?: string }>
}) {
  const { m, y } = await searchParams
  const now = new Date()
  const year  = y ? parseInt(y)  : now.getFullYear()
  const month = m ? parseInt(m)  : now.getMonth()   // 0-indexed

  const prevMonth = month === 0  ? { m: 11, y: year - 1 } : { m: month - 1, y: year }
  const nextMonth = month === 11 ? { m: 0,  y: year + 1 } : { m: month + 1, y: year }

  const supabase = await createClient()
  const start = isoMonthStart(year, month)
  const end   = isoMonthEnd(year, month)

  const [
    { data: employees },
    { data: rawPlans },
    { data: shiftTypes },
    { data: workAreas },
    { data: holidays },
  ] = await Promise.all([
    supabase.from('profiles').select('id, full_name, employee_type, contract_hours_per_day').eq('is_active', true).order('sort_order').order('full_name'),
    supabase.from('day_plans').select('id, employee_id, date, shift_type_id, work_area_id, planned_hours, is_day_off, absence_markers(type, hours)').gte('date', start).lte('date', end),
    supabase.from('shift_types').select('id, code, name, color, total_hours, morning_start, morning_end, afternoon_start, afternoon_end').order('name'),
    supabase.from('work_areas').select('id, code, name, is_training_position').order('code'),
    supabase.from('public_holidays').select('date').gte('date', start).lte('date', end),
  ])

  const holidayDates = new Set((holidays ?? []).map(h => h.date))

  // Flatten absence_markers — Supabase returns them nested
  const dayPlans = (rawPlans ?? []).map(p => ({
    ...p,
    absence_markers: Array.isArray(p.absence_markers) ? p.absence_markers : [],
  }))

  return (
    <div className="p-6 md:p-12 space-y-8 max-w-full">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px]">Planung</p>
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Einsatzplan</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Monatliche Einsatz- und Schichtplanung für alle Mitarbeitenden.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href={`/dienstplan?y=${prevMonth.y}&m=${prevMonth.m}`}
            className="bg-surface-container-high text-on-surface py-2.5 px-5 rounded shadow flex items-center gap-1.5 font-bold tracking-tight hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined text-base" aria-hidden="true">chevron_left</span>
            Vorheriger
          </Link>
          <span className="px-4 py-2.5 bg-surface-container-lowest rounded shadow font-headline font-black text-primary text-lg">
            {MONTH_NAMES[month]} {year}
          </span>
          <Link
            href={`/dienstplan?y=${nextMonth.y}&m=${nextMonth.m}`}
            className="bg-surface-container-high text-on-surface py-2.5 px-5 rounded shadow flex items-center gap-1.5 font-bold tracking-tight hover:bg-surface-container-highest transition-colors"
          >
            Nächster
            <span className="material-symbols-outlined text-base" aria-hidden="true">chevron_right</span>
          </Link>
          <Link
            href={`/dienstplan?y=${now.getFullYear()}&m=${now.getMonth()}`}
            className="bg-primary/10 text-primary py-2.5 px-5 rounded font-bold hover:bg-primary/20 transition-colors"
          >
            Heute
          </Link>
        </div>
      </section>

      {/* Grid */}
      {employees && employees.length > 0 ? (
        <ScheduleGrid
          employees={employees}
          dayPlans={dayPlans}
          shiftTypes={shiftTypes ?? []}
          workAreas={workAreas ?? []}
          year={year}
          month={month}
          holidayDates={holidayDates}
        />
      ) : (
        <div className="text-center py-20 text-outline bg-surface-container-lowest rounded-xl">
          <span className="material-symbols-outlined text-5xl block mb-3" aria-hidden="true">group_off</span>
          <p className="font-bold text-lg mb-1">Keine aktiven Mitarbeitenden gefunden.</p>
          <p className="text-sm mb-4">Bitte Mitarbeitende unter Benutzer erfassen.</p>
          <Link href="/users/new" className="text-primary font-bold hover:underline">Ersten Benutzer anlegen</Link>
        </div>
      )}

      {/* Info bar */}
      <div className="flex flex-wrap items-center gap-6 text-xs text-outline">
        <span><span className="font-bold text-on-surface">Klick</span> auf eine Zelle zum Bearbeiten</span>
        <Link href="/settings" className="text-primary font-bold hover:underline flex items-center gap-1">
          <span className="material-symbols-outlined text-sm" aria-hidden="true">settings</span>
          Schichten &amp; Bereiche konfigurieren
        </Link>
      </div>
    </div>
  )
}
