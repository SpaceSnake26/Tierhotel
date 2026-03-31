import { createClient } from '@/utils/supabase/server'
import { ScreenClient } from './ScreenClient'

export default async function InfoScreenPage() {
  const supabase = await createClient()

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const [{ data: shifts }, { data: tasks }, { data: notes }] = await Promise.all([
    supabase
      .from('shifts')
      .select('id, start_time, end_time, role_label, profiles(full_name)')
      .gte('start_time', todayStart.toISOString())
      .lte('start_time', todayEnd.toISOString())
      .order('start_time'),
    supabase
      .from('tasks')
      .select('id, title, description, priority')
      .in('status', ['open', 'in_progress'])
      .eq('priority', 'high')
      .order('due_date', { nullsFirst: false })
      .limit(4),
    supabase
      .from('daily_notes')
      .select('id, content, created_at, profiles!daily_notes_author_id_fkey(full_name)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1),
  ])

  const latestNote = notes?.[0] ?? null

  return (
    <ScreenClient
      shifts={shifts ?? []}
      tasks={tasks ?? []}
      latestNote={latestNote}
    />
  )
}
