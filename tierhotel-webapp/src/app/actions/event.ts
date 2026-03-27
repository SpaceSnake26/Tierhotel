'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEvent(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const location = formData.get('location') as string
  const dateTime = formData.get('dateTime') as string

  // Fetch current user
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('events')
    .insert({
      title,
      description,
      location,
      date_time: new Date(dateTime).toISOString(),
      created_by: user?.id, // Will fail if RLS / schema enforces auth
    })

  if (error) {
    console.error('Error creating event:', error)
    throw new Error('Could not create event: ' + error.message)
  }

  revalidatePath('/events')
  redirect('/events')
}
