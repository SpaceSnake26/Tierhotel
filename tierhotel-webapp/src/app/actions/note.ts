'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createNote(formData: FormData) {
  const supabase = await createClient()
  
  const content = formData.get('content') as string
  const isImportant = formData.get('isImportant') === 'on'

  // Fetch current user
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('daily_notes')
    .insert({
      content,
      // If important, we could store it in a different column or status, but for now we trust content
      status: 'published',
      author_id: user?.id,
    })

  if (error) {
    console.error('Error creating note:', error)
    throw new Error('Could not create note: ' + error.message)
  }

  revalidatePath('/notes')
  redirect('/notes')
}
