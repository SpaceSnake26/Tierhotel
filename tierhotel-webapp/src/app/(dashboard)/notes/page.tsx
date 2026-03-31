import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function NotesPage() {
  const supabase = await createClient()

  const { data: notes } = await supabase
    .from('daily_notes')
    .select('id, content, status, created_at, profiles!daily_notes_author_id_fkey(full_name)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto w-full">
      <section className="flex flex-col md:flex-row justify-between items-end gap-8 border-none">
        <div className="space-y-2 max-w-2xl">
          <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px]">Kommunikation</p>
          <h2 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Notizen</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Wichtige Tagesinformationen und Übergabeprotokolle für alle Abteilungen.
          </p>
        </div>
        <Link href="/notes/new" className="bg-primary text-on-primary py-3 px-6 rounded shadow-lg flex items-center gap-2 font-bold tracking-tight hover:scale-[1.02] active:scale-95 transition-transform">
          <span className="material-symbols-outlined" aria-hidden="true">add</span>
          Neue Notiz
        </Link>
      </section>

      {notes && notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map((note) => {
            const author = (note.profiles as { full_name: string } | null)?.full_name ?? 'Unbekannt'
            const initials = author.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
            const createdAt = new Date(note.created_at).toLocaleString('de-CH', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
            })
            const isDraft = note.status === 'draft'
            return (
              <div key={note.id} className="bg-surface-container-lowest rounded-xl p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${isDraft ? 'bg-surface-variant text-on-surface-variant' : 'bg-primary-fixed/30 text-primary'}`}>
                      {isDraft ? 'Entwurf' : 'Veröffentlicht'}
                    </span>
                    <span className="text-outline text-xs">{createdAt}</span>
                  </div>
                  <p className="text-on-surface whitespace-pre-wrap">{note.content}</p>
                </div>
                <div className="mt-8 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-xs font-bold" aria-hidden="true">
                    {initials}
                  </div>
                  <span className="text-xs font-medium text-outline">Erstellt von {author}</span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-outline">
          <span className="material-symbols-outlined text-4xl block mb-2" aria-hidden="true">sticky_note_2</span>
          <p className="font-medium">Noch keine Notizen vorhanden.</p>
          <Link href="/notes/new" className="text-primary font-bold text-sm hover:underline mt-2 inline-block">
            Erste Notiz erstellen
          </Link>
        </div>
      )}
    </div>
  )
}
