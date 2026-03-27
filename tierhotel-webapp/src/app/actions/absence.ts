'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createAbsence(formData: FormData) {
  const supabase = await createClient()
  
  const type = formData.get('type') as string
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string

  // Fetch current user (if any)
  const { data: { user } } = await supabase.auth.getUser()

  // Insert absence
  const { error } = await supabase
    .from('absences')
    .insert({
      user_id: user?.id, // NOTE: this will fail if user is not authenticated and NOT NULL constraint exists.
      type: type || 'other',
      start_date: startDate,
      end_date: endDate,
      status: 'pending'
    })

  if (error) {
    console.error('Error creating absence:', error)
    throw new Error('Could not create absence. Ensure you are logged in and RLS is configured: ' + error.message)
  }

  revalidatePath('/absences')
  redirect('/absences')
}
