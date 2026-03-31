'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return redirect('/login?error=Die Anmeldedaten sind ungültig')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = ((formData.get('fullName') as string) ?? '').trim() || null

  const { error, data: authData } = await supabase.auth.signUp({ email, password })

  if (error) {
    return redirect('/login?error=Fehler bei der Registrierung: ' + error.message)
  }

  if (authData.user) {
    await supabase.from('profiles').upsert({
      id: authData.user.id,
      email,
      full_name: fullName,
      role: 'employee',
    })
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
