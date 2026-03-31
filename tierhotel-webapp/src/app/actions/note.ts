'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createNote(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const content = formData.get('content') as string

  if (!content?.trim()) {
    throw new Error('Notizinhalt ist ein Pflichtfeld.')
  }

  const { error } = await supabase
    .from('daily_notes')
    .insert({
      content: content.trim(),
      status: 'published',
      author_id: user.id,
    })

  if (error) {
    throw new Error('Notiz konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.')
  }

  revalidatePath('/notes')
  redirect('/notes')
}
