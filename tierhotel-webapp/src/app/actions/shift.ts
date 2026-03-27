'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createShift(formData: FormData) {
  const supabase = await createClient()
  
  // Note: For a real app, 'employeeId' would map to `user_id` in the `profiles` table.
  // Because we don't have active users yet, this insert might fail due to the ForeignKey constraint
  // if `employeeId` does not reference a real user.
  const employeeId = formData.get('employeeId') as string
  const date = formData.get('date') as string
  const roleLabel = formData.get('roleLabel') as string
  const startTimeStr = formData.get('startTime') as string // HH:mm
  const endTimeStr = formData.get('endTime') as string // HH:mm

  // Combine date and time
  const startTime = new Date(`${date}T${startTimeStr}:00`).toISOString()
  const endTime = new Date(`${date}T${endTimeStr}:00`).toISOString()

  const { error } = await supabase
    .from('shifts')
    .insert({
      user_id: employeeId || null, 
      start_time: startTime,
      end_time: endTime,
      role_label: roleLabel,
      status: 'active'
    })

  if (error) {
    console.error('Error creating shift:', error)
    throw new Error('Could not create shift. Ensure Employee ID is valid: ' + error.message)
  }

  revalidatePath('/roster')
  redirect('/roster')
}
