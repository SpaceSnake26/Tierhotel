import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

const ABSENCE_LABELS: Record<string,string> = {
  FT:'FT', FTK:'FTK', UEZ:'UEZ', K:'K', UF:'UF',
  S:'S', UEK:'UEK', W:'W', WK:'WK', UU:'UU', X:'X', IN:'IN', EX:'EX',
}
const ABSENCE_TYPES = ['FT','FTK','UEZ','K','UF','S','UEK','W','WK','UU','X','IN','EX']
const ABSENCE_COLORS: Record<string,string> = {
  FT:'text-green-700',  FTK:'text-blue-700', UEZ:'text-cyan-700',
  K:'text-red-700',     UF:'text-orange-700', S:'text-purple-700',
  UEK:'text-indigo-700',W:'text-amber-700',  WK:'text-slate-600',
  UU:'text-rose-700',   X:'text-gray-500',   IN:'text-gray-500', EX:'text-gray-500',
}

const MONTHS_DE = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez']

export default async function JahresregisterPage({
  searchParams,
}: {
  searchParams: Promise<{ y?: string }>
}) {
  const { y } = await searchParams
  const now  = new Date()
  const year = y ? parseInt(y) : now.getFullYear()

  const supabase = await createClient()

  const yearStart = `${year}-01-01`
  const yearEnd   = `${year}-12-31`

  const [{ data: employees }, { data: dayPlans }, { data: holidays }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, employee_type, contract_hours_per_day, vacation_entitlement_ft, vacation_entitlement_ftk')
      .eq('is_active', true)
      .order('sort_order')
      .order('full_name'),
    supabase
      .from('day_plans')
      .select('employee_id, date, planned_hours, is_day_off, absence_markers(type, hours)')
      .gte('date', yearStart)
      .lte('date', yearEnd),
    supabase
      .from('public_holidays')
      .select('date')
      .gte('date', yearStart)
      .lte('date', yearEnd),
  ])

  const holidayDates = new Set((holidays ?? []).map(h => h.date as string))

  // Count working days per month for this year
  function workingDaysInMonth(yr: number, mo: number): number {
    const days = new Date(yr, mo + 1, 0).getDate()
    let count = 0
    for (let d = 1; d <= days; d++) {
      const date = `${yr}-${String(mo + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
      const dow = new Date(date).getDay()
      if (dow !== 0 && dow !== 6 && !holidayDates.has(date)) count++
    }
    return count
  }
  const workingDaysPerMonth = Array.from({ length: 12 }, (_, mo) => workingDaysInMonth(year, mo))
  const totalWorkingDays = workingDaysPerMonth.reduce((a, b) => a + b, 0)

  // Index plans by employee
  type PlanRow = { employee_id: string; date: string; planned_hours: number; is_day_off: boolean; absence_markers: { type: string; hours: number }[] }
  const plansByEmployee = new Map<string, PlanRow[]>()
  for (const p of dayPlans ?? []) {
    const list = plansByEmployee.get(p.employee_id) ?? []
    list.push({ ...p, absence_markers: Array.isArray(p.absence_markers) ? p.absence_markers : [] })
    plansByEmployee.set(p.employee_id, list)
  }

  function calcStats(empId: string, contractH: number) {
    const plans = plansByEmployee.get(empId) ?? []
    const istZeit = plans.reduce((sum, p) => sum + (p.planned_hours ?? 0), 0)
    const sollZeit = totalWorkingDays * contractH

    const absenceTotals: Record<string, number> = {}
    for (const p of plans) {
      for (const m of p.absence_markers) {
        absenceTotals[m.type] = (absenceTotals[m.type] ?? 0) + m.hours
      }
    }
    return { istZeit, sollZeit, diff: istZeit - sollZeit, absenceTotals }
  }

  return (
    <div className="p-6 md:p-12 space-y-12 max-w-full">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px]">Auswertung</p>
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Jahresregister</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Jahresübersicht Abwesenheiten, FT/FTK-Anspruch und Soll-/Ist-Stunden.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/jahresregister?y=${year - 1}`} className="bg-surface-container-high text-on-surface py-2.5 px-5 rounded shadow flex items-center gap-1.5 font-bold hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined text-base" aria-hidden="true">chevron_left</span>
            {year - 1}
          </Link>
          <span className="px-5 py-2.5 bg-surface-container-lowest rounded shadow font-headline font-black text-primary text-xl">{year}</span>
          <Link href={`/jahresregister?y=${year + 1}`} className="bg-surface-container-high text-on-surface py-2.5 px-5 rounded shadow flex items-center gap-1.5 font-bold hover:bg-surface-container-highest transition-colors">
            {year + 1}
            <span className="material-symbols-outlined text-base" aria-hidden="true">chevron_right</span>
          </Link>
        </div>
      </section>

      {employees && employees.length > 0 ? (
        <>
          {/* ── Ist/Soll/Diff Table ── */}
          <section>
            <h3 className="text-xl font-headline font-bold mb-4">Arbeitszeit-Übersicht ({year})</h3>
            <div className="overflow-x-auto rounded-xl shadow-sm border border-surface-container-high bg-surface-container-lowest">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-surface-container-high bg-surface-container-low">
                    <th className="sticky left-0 bg-surface-container-low px-4 py-3 text-left font-bold text-outline uppercase text-xs tracking-wider min-w-[160px]">Mitarbeiter</th>
                    <th className="px-4 py-3 text-right font-bold text-outline uppercase text-xs tracking-wider">Soll (h)</th>
                    <th className="px-4 py-3 text-right font-bold text-outline uppercase text-xs tracking-wider">Ist (h)</th>
                    <th className="px-4 py-3 text-right font-bold text-outline uppercase text-xs tracking-wider">Diff (h)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {employees.map(emp => {
                    const { istZeit, sollZeit, diff } = calcStats(emp.id, emp.contract_hours_per_day ?? 8.5)
                    return (
                      <tr key={emp.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="sticky left-0 bg-surface-container-lowest px-4 py-3 font-bold">{emp.full_name ?? '—'}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{sollZeit.toFixed(1)}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{istZeit.toFixed(1)}</td>
                        <td className={`px-4 py-3 text-right font-bold tabular-nums ${diff >= 0 ? 'text-green-700' : 'text-error'}`}>
                          {diff >= 0 ? '+' : ''}{diff.toFixed(1)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── FT / FTK Anspruch ── */}
          <section>
            <h3 className="text-xl font-headline font-bold mb-4">FT / FTK Anspruch ({year})</h3>
            <div className="overflow-x-auto rounded-xl shadow-sm border border-surface-container-high bg-surface-container-lowest">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-surface-container-high bg-surface-container-low">
                    <th className="sticky left-0 bg-surface-container-low px-4 py-3 text-left font-bold text-outline uppercase text-xs tracking-wider min-w-[160px]">Mitarbeiter</th>
                    <th className="px-4 py-3 text-right font-bold text-green-700 uppercase text-xs tracking-wider">FT Anspruch</th>
                    <th className="px-4 py-3 text-right font-bold text-green-700 uppercase text-xs tracking-wider">FT Geplant</th>
                    <th className="px-4 py-3 text-right font-bold text-green-700 uppercase text-xs tracking-wider">FT Verbleibend</th>
                    <th className="px-4 py-3 text-right font-bold text-blue-700 uppercase text-xs tracking-wider">FTK Anspruch</th>
                    <th className="px-4 py-3 text-right font-bold text-blue-700 uppercase text-xs tracking-wider">FTK Geplant</th>
                    <th className="px-4 py-3 text-right font-bold text-blue-700 uppercase text-xs tracking-wider">FTK Verbleibend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {employees.map(emp => {
                    const { absenceTotals } = calcStats(emp.id, emp.contract_hours_per_day ?? 8.5)
                    const ftGeplant  = absenceTotals['FT']  ?? 0
                    const ftkGeplant = absenceTotals['FTK'] ?? 0
                    const ftRest     = (emp.vacation_entitlement_ft  ?? 0) - ftGeplant
                    const ftkRest    = (emp.vacation_entitlement_ftk ?? 0) - ftkGeplant
                    return (
                      <tr key={emp.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="sticky left-0 bg-surface-container-lowest px-4 py-3 font-bold">{emp.full_name ?? '—'}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{(emp.vacation_entitlement_ft ?? 0).toFixed(1)}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{ftGeplant.toFixed(1)}</td>
                        <td className={`px-4 py-3 text-right font-bold tabular-nums ${ftRest < 0 ? 'text-error' : 'text-green-700'}`}>{ftRest.toFixed(1)}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{(emp.vacation_entitlement_ftk ?? 0).toFixed(1)}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{ftkGeplant.toFixed(1)}</td>
                        <td className={`px-4 py-3 text-right font-bold tabular-nums ${ftkRest < 0 ? 'text-error' : 'text-blue-700'}`}>{ftkRest.toFixed(1)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Abwesenheitsübersicht ── */}
          <section>
            <h3 className="text-xl font-headline font-bold mb-4">Abwesenheiten nach Typ ({year})</h3>
            <div className="overflow-x-auto rounded-xl shadow-sm border border-surface-container-high bg-surface-container-lowest">
              <table className="text-sm border-collapse" style={{ minWidth: `${160 + ABSENCE_TYPES.length * 56}px` }}>
                <thead>
                  <tr className="border-b-2 border-surface-container-high bg-surface-container-low">
                    <th className="sticky left-0 bg-surface-container-low px-4 py-3 text-left font-bold text-outline uppercase text-xs tracking-wider min-w-[160px]">Mitarbeiter</th>
                    {ABSENCE_TYPES.map(type => (
                      <th key={type} className={`px-3 py-3 text-right font-bold uppercase text-xs tracking-wider ${ABSENCE_COLORS[type] ?? 'text-outline'}`}>
                        {ABSENCE_LABELS[type]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {employees.map(emp => {
                    const { absenceTotals } = calcStats(emp.id, emp.contract_hours_per_day ?? 8.5)
                    return (
                      <tr key={emp.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="sticky left-0 bg-surface-container-lowest px-4 py-3 font-bold">{emp.full_name ?? '—'}</td>
                        {ABSENCE_TYPES.map(type => {
                          const val = absenceTotals[type] ?? 0
                          return (
                            <td key={type} className={`px-3 py-3 text-right tabular-nums ${val > 0 ? (ABSENCE_COLORS[type] ?? '') : 'text-outline'}`}>
                              {val > 0 ? val.toFixed(1) : '—'}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Monthly working days reference ── */}
          <section>
            <h3 className="text-xl font-headline font-bold mb-4">Arbeitstage pro Monat ({year})</h3>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-3">
              {workingDaysPerMonth.map((days, mo) => (
                <div key={mo} className="bg-surface-container-lowest rounded-xl p-4 text-center shadow-sm border border-surface-container-high">
                  <div className="text-xs text-outline font-bold uppercase">{MONTHS_DE[mo]}</div>
                  <div className="text-2xl font-headline font-black text-primary mt-1">{days}</div>
                  <div className="text-[10px] text-outline mt-0.5">Tage</div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="text-center py-20 text-outline bg-surface-container-lowest rounded-xl">
          <span className="material-symbols-outlined text-5xl block mb-3" aria-hidden="true">group_off</span>
          <p className="font-bold text-lg">Keine aktiven Mitarbeitenden gefunden.</p>
        </div>
      )}
    </div>
  )
}
