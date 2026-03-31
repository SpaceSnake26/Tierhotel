'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Shift = {
  id: string
  start_time: string
  end_time: string
  role_label: string
  profiles: { full_name: string } | null
}

type Task = {
  id: string
  title: string
  description: string | null
  priority: string
}

type Note = {
  id: string
  content: string
  created_at: string
  profiles: { full_name: string } | null
} | null

export function ScreenClient({
  shifts,
  tasks,
  latestNote,
}: {
  shifts: Shift[]
  tasks: Task[]
  latestNote: Note
}) {
  const router = useRouter()
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    function updateClock() {
      const now = new Date()
      setTime(now.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' }))
      setDate(now.toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long' }))
    }
    updateClock()
    const clockId = setInterval(updateClock, 1000)
    // Refresh server data every 60 seconds
    const refreshId = setInterval(() => router.refresh(), 60_000)
    return () => {
      clearInterval(clockId)
      clearInterval(refreshId)
    }
  }, [router])

  return (
    <div className="bg-surface text-on-surface min-h-screen p-12 pr-16 pl-16 flex flex-col font-headline">
      <header className="flex justify-between items-center border-b-[3px] border-primary pb-8 mb-12">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white font-black text-3xl" aria-hidden="true">
            T5
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter text-[#006B54]">Tierhotel 5 Stern</h1>
            <p className="text-xl uppercase tracking-[0.2em] text-outline font-bold mt-2">Team Info Screen</p>
          </div>
        </div>
        <div className="text-right flex items-center gap-8">
          <div className="text-3xl uppercase tracking-widest font-bold text-outline capitalize">{date || '\u00A0'}</div>
          <div className="h-16 w-[4px] bg-primary" aria-hidden="true"></div>
          <div className="text-7xl font-black text-primary tracking-tighter" aria-live="polite" aria-label={`Uhrzeit: ${time}`}>
            {time || '...'}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-12 flex-1">
        {/* Left: Shifts */}
        <div className="space-y-12">
          <div className="bg-surface-container-lowest rounded-3xl p-10 shadow-lg border-t-8 border-primary">
            <h2 className="text-4xl font-bold flex items-center gap-4 mb-10">
              <span className="material-symbols-outlined text-[48px] text-primary" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }} aria-hidden="true">schedule</span>
              Aktuelle Schichten
            </h2>
            {shifts.length > 0 ? (
              <div className="space-y-6">
                {shifts.map((shift) => {
                  const name = shift.profiles?.full_name ?? 'Unbekannt'
                  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                  const start = new Date(shift.start_time).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
                  const end = new Date(shift.end_time).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
                  return (
                    <div key={shift.id} className="flex items-center gap-8 bg-surface-container-low p-6 rounded-2xl">
                      <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-black shrink-0" aria-hidden="true">
                        {initials}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold">{name}</h3>
                        <p className="text-xl text-outline font-medium mt-1">{shift.role_label}</p>
                      </div>
                      <div className="text-3xl font-black text-primary">{start} – {end}</div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-2xl text-outline font-medium">Keine Schichten für heute eingetragen.</p>
            )}
          </div>
        </div>

        {/* Right: Note + Tasks */}
        <div className="space-y-12 flex flex-col">
          {latestNote && (
            <div className="bg-primary/10 border-l-[12px] border-primary rounded-3xl p-10 shadow-lg">
              <h2 className="text-3xl font-bold flex items-center gap-4 mb-6 text-primary">
                <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }} aria-hidden="true">campaign</span>
                Aktuelle Mitteilung
              </h2>
              <p className="text-2xl text-on-surface leading-relaxed font-medium whitespace-pre-wrap">
                {latestNote.content}
              </p>
              {latestNote.profiles?.full_name && (
                <p className="text-lg text-outline mt-4">— {latestNote.profiles.full_name}</p>
              )}
            </div>
          )}

          {tasks.length > 0 && (
            <div className="bg-surface-container-lowest rounded-3xl p-10 shadow-lg flex-1 border-t-8 border-secondary">
              <h2 className="text-4xl font-bold flex items-center gap-4 mb-10">
                <span className="material-symbols-outlined text-[48px] text-secondary" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }} aria-hidden="true">assignment_late</span>
                Priorität Heute
              </h2>
              <div className="space-y-6">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-6 bg-surface-container-low p-6 rounded-2xl">
                    <span className="material-symbols-outlined text-[40px] text-secondary mt-1" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">error</span>
                    <div>
                      <h3 className="text-3xl font-bold">{task.title}</h3>
                      {task.description && (
                        <p className="text-xl text-on-surface-variant font-medium mt-2">{task.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!latestNote && tasks.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-2xl text-outline font-medium">Keine dringenden Informationen.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
