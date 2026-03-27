'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string
  const dueDate = formData.get('dueDate') as string

  // Fetch current user (if any)
  const { data: { user } } = await supabase.auth.getUser()

  // Insert task
  const { error } = await supabase
    .from('tasks')
    .insert({
      title,
      description,
      priority: priority || 'medium',
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      created_by: user?.id || null, // Allow null for MVP simplicity if Auth isn't strictly enforced
    })

  if (error) {
    console.error('Error creating task:', error)
    throw new Error('Could not create task: ' + error.message)
  }

  revalidatePath('/tasks')
  redirect('/tasks')
}
