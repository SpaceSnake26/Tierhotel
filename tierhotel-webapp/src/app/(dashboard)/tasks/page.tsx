import { createClient } from '@/utils/supabase/server'
import { updateTaskStatus } from '@/app/actions/task'
import Link from 'next/link'

const PRIORITY_STYLES: Record<string, string> = {
  high: 'bg-error/10 text-error',
  medium: 'bg-surface-variant text-on-surface',
  low: 'bg-secondary/10 text-secondary',
}
const PRIORITY_LABELS: Record<string, string> = { high: 'Hoch', medium: 'Normal', low: 'Niedrig' }

type Task = {
  id: string
  title: string
  description: string | null
  priority: string
  due_date: string | null
  status: string
  profiles: { full_name: string } | null
}

function TaskCard({ task }: { task: Task }) {
  const initials = task.profiles?.full_name
    ? task.profiles.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : null

  const dueLabel = task.due_date
    ? new Date(task.due_date).toLocaleDateString('de-CH', { day: 'numeric', month: 'short' })
    : null

  return (
    <div className={`bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow ${task.status === 'done' ? 'opacity-70' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${PRIORITY_STYLES[task.priority] ?? 'bg-surface-variant text-on-surface'}`}>
          {PRIORITY_LABELS[task.priority] ?? task.priority}
        </span>
        {dueLabel && <span className="text-outline text-xs">{dueLabel}</span>}
      </div>
      <h4 className={`font-bold mb-1 ${task.status === 'done' ? 'line-through text-outline' : ''}`}>{task.title}</h4>
      {task.description && (
        <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{task.description}</p>
      )}
      <div className="flex justify-between items-center mt-3">
        {initials ? (
          <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-xs font-bold" title={task.profiles?.full_name}>
            {initials}
          </div>
        ) : (
          <div />
        )}
        {task.status !== 'done' && (
          <div className="flex gap-2">
            {task.status === 'open' && (
              <form action={async () => {
                'use server'
                await updateTaskStatus(task.id, 'in_progress')
              }}>
                <button type="submit" className="text-[10px] px-2 py-1 rounded bg-secondary/10 text-secondary font-bold hover:bg-secondary/20 transition-colors">
                  Starten
                </button>
              </form>
            )}
            {task.status === 'in_progress' && (
              <form action={async () => {
                'use server'
                await updateTaskStatus(task.id, 'done')
              }}>
                <button type="submit" className="text-[10px] px-2 py-1 rounded bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors">
                  Erledigt
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default async function TasksPage() {
  const supabase = await createClient()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, title, description, priority, due_date, status, profiles!tasks_created_by_fkey(full_name)')
    .order('due_date', { nullsFirst: false })
    .order('created_at', { ascending: false })

  const open = (tasks ?? []).filter((t) => t.status === 'open')
  const inProgress = (tasks ?? []).filter((t) => t.status === 'in_progress')
  const done = (tasks ?? []).filter((t) => t.status === 'done')

  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto w-full">
      <section className="flex flex-col md:flex-row justify-between items-end gap-8 border-none">
        <div className="space-y-2 max-w-2xl">
          <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px]">Operations</p>
          <h2 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Aufgaben</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Offene und erledigte Aufgaben für das Team. Priorisieren Sie die Gästebetreuung.
          </p>
        </div>
        <Link href="/tasks/new" className="bg-primary text-on-primary py-3 px-6 rounded shadow-lg flex items-center gap-2 font-bold tracking-tight hover:scale-[1.02] active:scale-95 transition-transform">
          <span className="material-symbols-outlined" aria-hidden="true">add</span>
          Neue Aufgabe
        </Link>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Open */}
        <div className="bg-surface-container-low rounded-xl p-6 border-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-headline font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" aria-hidden="true">circle</span>
              Offen
            </h3>
            <span className="bg-surface-container-highest text-on-surface text-xs font-bold px-2 py-1 rounded-full">{open.length}</span>
          </div>
          {open.length > 0 ? (
            <div className="space-y-4">
              {open.map((task) => <TaskCard key={task.id} task={task as Task} />)}
            </div>
          ) : (
            <p className="text-sm text-outline text-center py-8">Keine offenen Aufgaben.</p>
          )}
        </div>

        {/* In Progress */}
        <div className="bg-surface-container-low rounded-xl p-6 border-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-headline font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" aria-hidden="true">pending</span>
              In Bearbeitung
            </h3>
            <span className="bg-surface-container-highest text-on-surface text-xs font-bold px-2 py-1 rounded-full">{inProgress.length}</span>
          </div>
          {inProgress.length > 0 ? (
            <div className="space-y-4">
              {inProgress.map((task) => <TaskCard key={task.id} task={task as Task} />)}
            </div>
          ) : (
            <p className="text-sm text-outline text-center py-8">Keine Aufgaben in Bearbeitung.</p>
          )}
        </div>

        {/* Done */}
        <div className="bg-surface-container-low rounded-xl p-6 border-none opacity-80">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-headline font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container" aria-hidden="true">check_circle</span>
              Erledigt
            </h3>
            <span className="bg-surface-container-highest text-on-surface text-xs font-bold px-2 py-1 rounded-full">{done.length}</span>
          </div>
          {done.length > 0 ? (
            <div className="space-y-4">
              {done.map((task) => <TaskCard key={task.id} task={task as Task} />)}
            </div>
          ) : (
            <p className="text-sm text-outline text-center py-8">Noch keine erledigten Aufgaben.</p>
          )}
        </div>
      </div>
    </div>
  )
}
