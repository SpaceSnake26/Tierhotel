'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type DayPlanInput = {
  employeeId: string
  date: string          // ISO date string YYYY-MM-DD
  shiftTypeId: string | null
  workAreaId: string | null
  plannedHours: number
  isDayOff: boolean
  absenceMarkers: { type: string; hours: number }[]
}

export async function upsertDayPlan(input: DayPlanInput) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { employeeId, date, shiftTypeId, workAreaId, plannedHours, isDayOff, absenceMarkers } = input

  // Upsert the day plan
  const { data: plan, error: planError } = await supabase
    .from('day_plans')
    .upsert(
      {
        employee_id: employeeId,
        date,
        shift_type_id: shiftTypeId || null,
        work_area_id: workAreaId || null,
        planned_hours: plannedHours,
        is_day_off: isDayOff,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'employee_id,date' }
    )
    .select('id')
    .single()

  if (planError || !plan) {
    throw new Error('Einsatzplan konnte nicht gespeichert werden.')
  }

  // Replace absence markers: delete existing, insert new
  await supabase.from('absence_markers').delete().eq('day_plan_id', plan.id)

  if (absenceMarkers.length > 0) {
    const { error: markerError } = await supabase.from('absence_markers').insert(
      absenceMarkers.map((m) => ({ day_plan_id: plan.id, type: m.type, hours: m.hours }))
    )
    if (markerError) {
      throw new Error('Abwesenheitsmarkierung konnte nicht gespeichert werden.')
    }
  }

  revalidatePath('/dienstplan')
}

export async function deleteDayPlan(employeeId: string, date: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('day_plans')
    .delete()
    .eq('employee_id', employeeId)
    .eq('date', date)

  revalidatePath('/dienstplan')
}

export async function createShiftType(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('shift_types').insert({
    code: (formData.get('code') as string).toUpperCase().trim(),
    name: (formData.get('name') as string).trim(),
    morning_start:   formData.get('morning_start') as string,
    morning_end:     formData.get('morning_end') as string,
    afternoon_start: formData.get('afternoon_start') as string,
    afternoon_end:   formData.get('afternoon_end') as string,
    total_hours:     parseFloat(formData.get('total_hours') as string),
    color:           (formData.get('color') as string) || '#3B82F6',
  })

  if (error) throw new Error('Schichttyp konnte nicht erstellt werden.')
  revalidatePath('/settings')
}

export async function createWorkArea(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('work_areas').insert({
    code: (formData.get('code') as string).toUpperCase().trim(),
    name: (formData.get('name') as string).trim(),
    is_training_position: formData.get('is_training_position') === 'on',
  })

  if (error) throw new Error('Arbeitsbereich konnte nicht erstellt werden.')
  revalidatePath('/settings')
}

export async function createHoliday(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const date = formData.get('date') as string
  const { error } = await supabase.from('public_holidays').insert({
    date,
    name: (formData.get('name') as string).trim(),
    year: new Date(date).getFullYear(),
  })

  if (error) throw new Error('Feiertag konnte nicht erstellt werden.')
  revalidatePath('/settings')
}

export async function deleteShiftType(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  await supabase.from('shift_types').delete().eq('id', id)
  revalidatePath('/settings')
}

export async function deleteWorkArea(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  await supabase.from('work_areas').delete().eq('id', id)
  revalidatePath('/settings')
}

export async function deleteHoliday(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  await supabase.from('public_holidays').delete().eq('id', id)
  revalidatePath('/settings')
}
