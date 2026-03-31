'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createShift(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const employeeId = formData.get('employeeId') as string
  const date = formData.get('date') as string
  const roleLabel = formData.get('roleLabel') as string
  const startTimeStr = formData.get('startTime') as string
  const endTimeStr = formData.get('endTime') as string

  if (!employeeId || !date || !roleLabel || !startTimeStr || !endTimeStr) {
    throw new Error('Alle Pflichtfelder müssen ausgefüllt sein.')
  }

  const startTime = new Date(`${date}T${startTimeStr}:00`)
  const endTime = new Date(`${date}T${endTimeStr}:00`)

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    throw new Error('Ungültiges Datum oder Uhrzeit.')
  }

  const { error } = await supabase
    .from('shifts')
    .insert({
      user_id: employeeId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      role_label: roleLabel,
      status: 'active'
    })

  if (error) {
    throw new Error('Schicht konnte nicht erstellt werden. Bitte versuchen Sie es erneut.')
  }

  revalidatePath('/roster')
  redirect('/roster')
}
