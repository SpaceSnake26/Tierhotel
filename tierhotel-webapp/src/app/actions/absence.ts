'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createAbsence(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const type = formData.get('type') as string
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string

  if (!type || !startDate || !endDate) {
    throw new Error('Alle Pflichtfelder müssen ausgefüllt sein.')
  }

  if (new Date(endDate) < new Date(startDate)) {
    throw new Error('Das Enddatum darf nicht vor dem Startdatum liegen.')
  }

  const { error } = await supabase
    .from('absences')
    .insert({
      user_id: user.id,
      type: type || 'other',
      start_date: startDate,
      end_date: endDate,
      status: 'pending'
    })

  if (error) {
    throw new Error('Abwesenheit konnte nicht eingetragen werden. Bitte versuchen Sie es erneut.')
  }

  revalidatePath('/absences')
  redirect('/absences')
}
