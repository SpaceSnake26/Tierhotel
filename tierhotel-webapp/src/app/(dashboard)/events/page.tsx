import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function EventsPage() {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from('events')
    .select('id, title, description, location, date_time, internal_only')
    .order('date_time', { ascending: true })

  const colors = ['bg-primary-fixed/30 text-primary', 'bg-secondary-fixed/30 text-secondary', 'bg-tertiary/20 text-on-surface']

  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto w-full">
      <section className="flex flex-col md:flex-row justify-between items-end gap-8 border-none">
        <div className="space-y-2 max-w-2xl">
          <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px]">Übersicht</p>
          <h2 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Kalender / Events</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Geplante Veranstaltungen, Besichtigungen und Teamevents im Boutique-Hotel.
          </p>
        </div>
        <Link href="/events/new" className="bg-primary text-on-primary py-3 px-6 rounded shadow-lg flex items-center gap-2 font-bold tracking-tight hover:scale-[1.02] active:scale-95 transition-transform">
          <span className="material-symbols-outlined" aria-hidden="true">add</span>
          Neuer Event
        </Link>
      </section>

      <div className="bg-surface-container-low rounded-xl p-8 border-none">
        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {events.map((event, idx) => {
              const dt = new Date(event.date_time)
              const dayNum = dt.toLocaleDateString('de-CH', { day: 'numeric' })
              const monthStr = dt.toLocaleDateString('de-CH', { month: 'short' }).toUpperCase()
              const timeStr = dt.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
              const colorClass = colors[idx % colors.length]
              return (
                <div key={event.id} className="bg-surface-container-lowest p-6 rounded-lg flex gap-6 hover:shadow transition-shadow">
                  <div className={`flex flex-col items-center justify-center rounded-lg px-6 py-4 min-w-[90px] ${colorClass}`}>
                    <span className="text-xs font-bold uppercase tracking-widest">{monthStr}</span>
                    <span className="text-3xl font-headline font-black">{dayNum}</span>
                  </div>
                  <div className="flex-1 space-y-2 flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xl">{event.title}</h4>
                      {event.internal_only && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant font-bold uppercase">Intern</span>
                      )}
                    </div>
                    <p className="text-sm text-outline flex items-center gap-2 flex-wrap">
                      <span className="material-symbols-outlined text-[16px]" aria-hidden="true">schedule</span>
                      <span>{timeStr}</span>
                      {event.location && (
                        <>
                          <span className="material-symbols-outlined text-[16px] ml-2" aria-hidden="true">location_on</span>
                          <span>{event.location}</span>
                        </>
                      )}
                    </p>
                    {event.description && (
                      <p className="text-sm mt-2 text-on-surface-variant">{event.description}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-outline">
            <span className="material-symbols-outlined text-4xl block mb-2" aria-hidden="true">event</span>
            <p className="font-medium">Keine Events geplant.</p>
            <Link href="/events/new" className="text-primary font-bold text-sm hover:underline mt-2 inline-block">
              Ersten Event erstellen
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
