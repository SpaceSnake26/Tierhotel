'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const fullName = (formData.get('fullName') as string)?.trim()

  if (!fullName) {
    throw new Error('Name darf nicht leer sein.')
  }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id)

  if (error) {
    throw new Error('Profil konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.')
  }

  revalidatePath('/settings')
  revalidatePath('/', 'layout')
}
