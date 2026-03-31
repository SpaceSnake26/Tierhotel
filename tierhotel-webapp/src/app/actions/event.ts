'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEvent(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const location = formData.get('location') as string
  const dateTime = formData.get('dateTime') as string

  if (!title?.trim() || !dateTime) {
    throw new Error('Titel und Datum sind Pflichtfelder.')
  }

  const parsedDate = new Date(dateTime)
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Ungültiges Datum.')
  }

  const { error } = await supabase
    .from('events')
    .insert({
      title: title.trim(),
      description: description?.trim() || null,
      location: location?.trim() || null,
      date_time: parsedDate.toISOString(),
      created_by: user.id,
    })

  if (error) {
    throw new Error('Termin konnte nicht erstellt werden. Bitte versuchen Sie es erneut.')
  }

  revalidatePath('/events')
  redirect('/events')
}
