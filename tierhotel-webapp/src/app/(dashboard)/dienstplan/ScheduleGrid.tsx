'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { upsertDayPlan, deleteDayPlan, type DayPlanInput } from '@/app/actions/dayplan'

// ─── Types ────────────────────────────────────────────────────────────────────

type ShiftType = { id: string; code: string; name: string; color: string; total_hours: number; morning_start: string; morning_end: string; afternoon_start: string; afternoon_end: string }
type WorkArea  = { id: string; code: string; name: string; is_training_position: boolean }
type AbsenceMarker = { type: string; hours: number }
type DayPlan   = { id: string; employee_id: string; date: string; shift_type_id: string | null; work_area_id: string | null; planned_hours: number; is_day_off: boolean; absence_markers: AbsenceMarker[] }
type Employee  = { id: string; full_name: string | null; employee_type: string | null; contract_hours_per_day: number | null }

// Absence marker colours (keep compact since cells are small)
const ABSENCE_COLORS: Record<string, string> = {
  FT:  'bg-green-100 text-green-800',
  FTK: 'bg-blue-100 text-blue-800',
  UEZ: 'bg-cyan-100 text-cyan-800',
  K:   'bg-red-100 text-red-800',
  UF:  'bg-orange-100 text-orange-800',
  S:   'bg-purple-100 text-purple-800',
  UEK: 'bg-indigo-100 text-indigo-800',
  W:   'bg-amber-100 text-amber-800',
  WK:  'bg-slate-100 text-slate-700',
  UU:  'bg-rose-100 text-rose-800',
  X:   'bg-gray-100 text-gray-600',
  IN:  'bg-gray-100 text-gray-600',
  EX:  'bg-gray-100 text-gray-600',
}

const ABSENCE_TYPES = ['FT','FTK','UEZ','K','UF','S','UEK','W','WK','UU','X','IN','EX']
const ABSENCE_LABELS: Record<string,string> = {
  FT:'Ferientag', FTK:'Ferienkompensation', UEZ:'Überzeit', K:'Krank',
  UF:'Unfall', S:'Schule', UEK:'ÜK', W:'Weiterbildung',
  WK:'WK/Zivil', UU:'Unbezahlter Urlaub', X:'Sonstiges', IN:'Intern', EX:'Extern',
}

const EMPLOYEE_TYPE_LABELS: Record<string,string> = { EFZ:'EFZ', TP:'TP', AZUBI:'Azubi', RESERVE:'Reserve' }

// ─── Cell display ─────────────────────────────────────────────────────────────

function CellContent({ plan, shiftType }: { plan: DayPlan | undefined; shiftType: ShiftType | undefined }) {
  if (!plan) return <div className="min-h-[52px]" />

  if (plan.is_day_off) {
    return (
      <div className="min-h-[52px] flex items-center justify-center">
        <span className="text-xs font-bold text-outline">x</span>
      </div>
    )
  }

  return (
    <div className="min-h-[52px] space-y-0.5 p-0.5">
      {/* Row 1: hours with shift colour */}
      {plan.planned_hours > 0 && (
        <div
          className="text-[11px] font-bold leading-none px-1 py-0.5 rounded text-white truncate"
          style={{ backgroundColor: shiftType?.color ?? '#6b7280' }}
        >
          {plan.planned_hours}h
        </div>
      )}
      {/* Row 2: work area code */}
      {plan.work_area_id && (
        <div className="text-[11px] font-medium text-on-surface-variant leading-none px-1">
          {/* Will be resolved by parent */}
          {(plan as DayPlan & { work_area_code?: string }).work_area_code ?? ''}
        </div>
      )}
      {/* Row 3: absence markers */}
      {plan.absence_markers.map((m, i) => (
        <span key={i} className={`text-[9px] font-bold px-1 py-0.5 rounded leading-none inline-block mr-0.5 ${ABSENCE_COLORS[m.type] ?? 'bg-gray-100 text-gray-600'}`}>
          {m.type}
        </span>
      ))}
    </div>
  )
}

// ─── Cell editor modal ────────────────────────────────────────────────────────

type EditState = {
  shiftTypeId: string
  workAreaId: string
  plannedHours: string
  isDayOff: boolean
  absenceMarkers: string[]   // just the type codes
}

function CellEditor({
  employeeId, date, plan, shiftTypes, workAreas,
  contractHours, onClose, onSaved,
}: {
  employeeId: string; date: string; plan: DayPlan | undefined
  shiftTypes: ShiftType[]; workAreas: WorkArea[]
  contractHours: number; onClose: () => void; onSaved: () => void
}) {
  const [state, setState] = useState<EditState>({
    shiftTypeId:   plan?.shift_type_id  ?? '',
    workAreaId:    plan?.work_area_id   ?? '',
    plannedHours:  String(plan?.planned_hours ?? contractHours),
    isDayOff:      plan?.is_day_off     ?? false,
    absenceMarkers: plan?.absence_markers.map(m => m.type) ?? [],
  })
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const selectedShift = shiftTypes.find(s => s.id === state.shiftTypeId)

  function handleShiftChange(id: string) {
    const shift = shiftTypes.find(s => s.id === id)
    setState(prev => ({
      ...prev,
      shiftTypeId: id,
      plannedHours: shift ? String(shift.total_hours) : prev.plannedHours,
    }))
  }

  function toggleAbsence(type: string) {
    setState(prev => ({
      ...prev,
      absenceMarkers: prev.absenceMarkers.includes(type)
        ? prev.absenceMarkers.filter(t => t !== type)
        : [...prev.absenceMarkers, type],
    }))
  }

  function handleSave() {
    startTransition(async () => {
      try {
        const input: DayPlanInput = {
          employeeId,
          date,
          shiftTypeId:   state.shiftTypeId   || null,
          workAreaId:    state.workAreaId     || null,
          plannedHours:  parseFloat(state.plannedHours) || 0,
          isDayOff:      state.isDayOff,
          absenceMarkers: state.absenceMarkers.map(type => ({ type, hours: contractHours })),
        }
        await upsertDayPlan(input)
        onSaved()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Fehler beim Speichern.')
      }
    })
  }

  function handleClear() {
    startTransition(async () => {
      try {
        await deleteDayPlan(employeeId, date)
        onSaved()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Fehler beim Löschen.')
      }
    })
  }

  const d = new Date(date)
  const dayLabel = d.toLocaleDateString('de-CH', { weekday:'short', day:'numeric', month:'short' })

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="bg-surface-container-lowest rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:w-[420px] max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container-high">
          <div>
            <p className="text-xs text-outline uppercase tracking-widest font-bold">Einsatz bearbeiten</p>
            <p className="font-headline font-bold text-on-surface">{dayLabel}</p>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface transition-colors" aria-label="Schliessen">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {error && (
            <div className="bg-error/10 text-error text-sm font-bold px-4 py-2 rounded-lg">{error}</div>
          )}

          {/* Day off toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={state.isDayOff}
              onChange={e => setState(prev => ({ ...prev, isDayOff: e.target.checked, shiftTypeId: '', workAreaId: '' }))}
              className="w-5 h-5 rounded text-primary focus:ring-primary"
            />
            <span className="font-bold text-sm">Freier Tag (x)</span>
          </label>

          {!state.isDayOff && (
            <>
              {/* Shift type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">Schicht</label>
                <select
                  value={state.shiftTypeId}
                  onChange={e => handleShiftChange(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline/20 rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="">— keine Schicht —</option>
                  {shiftTypes.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.morning_start}–{s.morning_end} / {s.afternoon_start}–{s.afternoon_end}, {s.total_hours}h)
                    </option>
                  ))}
                </select>
                {selectedShift && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: selectedShift.color }} />
                    <span className="text-xs text-outline">{selectedShift.name}</span>
                  </div>
                )}
              </div>

              {/* Work area */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">Arbeitsbereich</label>
                <select
                  value={state.workAreaId}
                  onChange={e => setState(prev => ({ ...prev, workAreaId: e.target.value }))}
                  className="w-full bg-surface-container-low border border-outline/20 rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="">— kein Bereich —</option>
                  {workAreas.map(w => (
                    <option key={w.id} value={w.id}>{w.code} — {w.name}</option>
                  ))}
                </select>
              </div>

              {/* Planned hours */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-outline">Geplante Stunden</label>
                <input
                  type="number"
                  min="0" max="24" step="0.5"
                  value={state.plannedHours}
                  onChange={e => setState(prev => ({ ...prev, plannedHours: e.target.value }))}
                  className="w-full bg-surface-container-low border border-outline/20 rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Absence markers */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-outline">Abwesenheitsmarkierungen</label>
            <div className="flex flex-wrap gap-2">
              {ABSENCE_TYPES.map(type => {
                const active = state.absenceMarkers.includes(type)
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleAbsence(type)}
                    className={`text-xs font-bold px-2 py-1 rounded transition-all ${active ? ABSENCE_COLORS[type] ?? 'bg-gray-200 text-gray-700' : 'bg-surface-container-high text-outline hover:bg-surface-container-highest'}`}
                    title={ABSENCE_LABELS[type]}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-surface-container-high gap-3">
          {plan ? (
            <button
              onClick={handleClear}
              disabled={pending}
              className="text-error text-sm font-bold hover:underline disabled:opacity-50"
            >
              Eintrag löschen
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-on-surface hover:bg-surface-container-high rounded-lg transition-colors">
              Abbrechen
            </button>
            <button
              onClick={handleSave}
              disabled={pending}
              className="px-5 py-2 text-sm font-bold bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {pending && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Summary row ──────────────────────────────────────────────────────────────

function SummaryCell({ plans, workingDays, contractHoursPerDay }: { plans: DayPlan[]; workingDays: number; contractHoursPerDay: number }) {
  const istZeit = plans.reduce((sum, p) => sum + (p.planned_hours ?? 0), 0)
  const sollZeit = workingDays * contractHoursPerDay
  const diff = istZeit - sollZeit

  return (
    <div className="sticky right-0 bg-surface-container-low border-l border-surface-container-high px-3 py-2 text-right min-w-[110px]">
      <div className="text-xs text-outline font-bold">Ist: <span className="text-on-surface">{istZeit.toFixed(1)}</span></div>
      <div className="text-xs text-outline font-bold">Soll: <span className="text-on-surface">{sollZeit.toFixed(1)}</span></div>
      <div className={`text-xs font-bold ${diff >= 0 ? 'text-green-700' : 'text-error'}`}>
        Diff: {diff >= 0 ? '+' : ''}{diff.toFixed(1)}
      </div>
    </div>
  )
}

// ─── Main grid ────────────────────────────────────────────────────────────────

export function ScheduleGrid({
  employees, dayPlans, shiftTypes, workAreas, year, month, holidayDates
}: {
  employees: Employee[]
  dayPlans: (DayPlan & { work_area_code?: string })[]
  shiftTypes: ShiftType[]
  workAreas: WorkArea[]
  year: number
  month: number   // 0-indexed
  holidayDates: Set<string>
}) {
  const router = useRouter()
  const [editCell, setEditCell] = useState<{ employeeId: string; date: string } | null>(null)

  // Build lookup: "${employeeId}-${date}" → DayPlan
  const planMap = new Map<string, DayPlan & { work_area_code?: string }>()
  for (const p of dayPlans) {
    const workArea = workAreas.find(w => w.id === p.work_area_id)
    planMap.set(`${p.employee_id}-${p.date}`, { ...p, work_area_code: workArea?.code })
  }

  // Build shiftType lookup
  const shiftMap = new Map(shiftTypes.map(s => [s.id, s]))

  // Generate all days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date().toISOString().slice(0, 10)

  const days: { date: string; dayNum: number; isWeekend: boolean; isHoliday: boolean }[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dow = new Date(date).getDay() // 0=Sun
    const isWeekend = dow === 0 || dow === 6
    days.push({ date, dayNum: d, isWeekend, isHoliday: holidayDates.has(date) })
  }

  // Count working days for Soll-Zeit
  const workingDays = days.filter(d => !d.isWeekend && !d.isHoliday).length

  // Group employees by type
  const groups: { type: string; label: string; members: Employee[] }[] = [
    { type: 'EFZ',     label: 'EFZ',        members: [] },
    { type: 'TP',      label: 'TP',         members: [] },
    { type: 'AZUBI',   label: 'Azubi',      members: [] },
    { type: 'RESERVE', label: 'Reserve',    members: [] },
    { type: 'other',   label: 'Weitere',    members: [] },
  ]
  for (const emp of employees) {
    const g = groups.find(g => g.type === (emp.employee_type ?? 'other')) ?? groups[4]
    g.members.push(emp)
  }

  const editingPlan = editCell ? planMap.get(`${editCell.employeeId}-${editCell.date}`) : undefined
  const editingEmployee = editCell ? employees.find(e => e.id === editCell.employeeId) : undefined

  const DOW_SHORT = ['So','Mo','Di','Mi','Do','Fr','Sa']

  return (
    <div className="relative">
      {/* Scrollable grid */}
      <div className="overflow-x-auto rounded-xl shadow-sm border border-surface-container-high bg-surface-container-lowest">
        <table className="border-collapse text-xs" style={{ minWidth: `${120 + daysInMonth * 42 + 120}px` }}>
          <thead>
            <tr>
              {/* Employee name header */}
              <th className="sticky left-0 z-20 bg-surface-container-low border-b border-r border-surface-container-high px-3 py-3 text-left min-w-[140px]">
                <span className="text-xs font-bold text-outline uppercase tracking-wider">Mitarbeiter</span>
              </th>
              {/* Day headers */}
              {days.map(({ date, dayNum, isWeekend, isHoliday }) => {
                const dow = new Date(date).getDay()
                const isToday = date === today
                return (
                  <th
                    key={date}
                    className={`border-b border-r border-surface-container-high px-1 py-2 text-center w-[42px] ${isWeekend || isHoliday ? 'bg-surface-container text-outline' : ''} ${isToday ? 'bg-primary/10' : ''}`}
                  >
                    <div className={`text-[9px] font-bold ${isToday ? 'text-primary' : 'text-outline'}`}>{DOW_SHORT[dow]}</div>
                    <div className={`text-xs font-black ${isToday ? 'text-primary' : ''}`}>{dayNum}</div>
                  </th>
                )
              })}
              {/* Summary header */}
              <th className="sticky right-0 z-20 bg-surface-container-low border-b border-l border-surface-container-high px-3 py-3 text-right min-w-[110px]">
                <span className="text-xs font-bold text-outline uppercase tracking-wider">Zusammenfassung</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {groups.map(group => {
              if (group.members.length === 0) return null
              return (
                <>
                  {/* Group divider */}
                  <tr key={`group-${group.type}`}>
                    <td colSpan={daysInMonth + 2} className="bg-surface-container px-3 py-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-outline">{group.label}</span>
                    </td>
                  </tr>
                  {group.members.map(emp => {
                    const empPlans = dayPlans.filter(p => p.employee_id === emp.id)
                    const contractH = emp.contract_hours_per_day ?? 8.5
                    return (
                      <tr key={emp.id} className="group/row hover:bg-surface-container-low/50 transition-colors border-b border-surface-container-high">
                        {/* Employee name */}
                        <td className="sticky left-0 z-10 bg-surface-container-lowest group/row-hover:bg-surface-container-low border-r border-surface-container-high px-3 py-1 min-w-[140px]">
                          <div className="font-bold text-on-surface truncate">{emp.full_name ?? '—'}</div>
                          <div className="text-[10px] text-outline">{EMPLOYEE_TYPE_LABELS[emp.employee_type ?? ''] ?? ''} · {contractH}h</div>
                        </td>
                        {/* Day cells */}
                        {days.map(({ date, isWeekend, isHoliday }) => {
                          const plan = planMap.get(`${emp.id}-${date}`)
                          const shiftType = plan?.shift_type_id ? shiftMap.get(plan.shift_type_id) : undefined
                          const isToday = date === today
                          return (
                            <td
                              key={date}
                              onClick={() => setEditCell({ employeeId: emp.id, date })}
                              className={`border-r border-surface-container-high cursor-pointer transition-colors align-top ${isWeekend || isHoliday ? 'bg-surface-container/60' : ''} ${isToday ? 'bg-primary/5' : ''} hover:bg-primary/10`}
                              style={{ minWidth: '42px', width: '42px' }}
                            >
                              <CellContent plan={plan} shiftType={shiftType} />
                            </td>
                          )
                        })}
                        {/* Summary */}
                        <td className="p-0">
                          <SummaryCell plans={empPlans} workingDays={workingDays} contractHoursPerDay={contractH} />
                        </td>
                      </tr>
                    )
                  })}
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <span className="text-xs font-bold text-outline uppercase tracking-widest">Schichten:</span>
        {shiftTypes.map(s => (
          <span key={s.id} className="flex items-center gap-1 text-xs font-bold">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            {s.name}
          </span>
        ))}
        <span className="ml-4 text-xs font-bold text-outline uppercase tracking-widest">Wochenende/Feiertag:</span>
        <span className="w-5 h-3 bg-surface-container rounded flex-shrink-0" />
      </div>

      {/* Edit modal */}
      {editCell && (
        <CellEditor
          employeeId={editCell.employeeId}
          date={editCell.date}
          plan={editingPlan}
          shiftTypes={shiftTypes}
          workAreas={workAreas}
          contractHours={editingEmployee?.contract_hours_per_day ?? 8.5}
          onClose={() => setEditCell(null)}
          onSaved={() => { setEditCell(null); router.refresh() }}
        />
      )}
    </div>
  )
}
