'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTask(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string
  const dueDate = formData.get('dueDate') as string

  if (!title?.trim()) {
    throw new Error('Titel ist ein Pflichtfeld.')
  }

  let dueDateIso: string | null = null
  if (dueDate) {
    const parsed = new Date(dueDate)
    if (isNaN(parsed.getTime())) {
      throw new Error('Ungültiges Fälligkeitsdatum.')
    }
    dueDateIso = parsed.toISOString()
  }

  const { error } = await supabase
    .from('tasks')
    .insert({
      title: title.trim(),
      description: description?.trim() || null,
      priority: priority || 'medium',
      due_date: dueDateIso,
      created_by: user.id,
    })

  if (error) {
    throw new Error('Aufgabe konnte nicht erstellt werden. Bitte versuchen Sie es erneut.')
  }

  revalidatePath('/tasks')
  redirect('/tasks')
}

export async function updateTaskStatus(taskId: string, status: 'open' | 'in_progress' | 'done') {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)

  if (error) {
    throw new Error('Aufgabenstatus konnte nicht aktualisiert werden.')
  }

  revalidatePath('/tasks')
}
