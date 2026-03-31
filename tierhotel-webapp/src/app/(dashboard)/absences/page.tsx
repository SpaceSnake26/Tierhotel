import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

const TYPE_LABELS: Record<string, string> = { sick: 'Krank', vacation: 'Ferien', other: 'Anderes' }
const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-surface-variant text-on-surface-variant',
  approved: 'bg-primary/10 text-primary',
  rejected: 'bg-error/10 text-error',
}
const STATUS_LABELS: Record<string, string> = {
  pending: 'Ausstehend',
  approved: 'Genehmigt',
  rejected: 'Abgelehnt',
}
const TYPE_STYLES: Record<string, string> = {
  sick: 'bg-error/10 text-error',
  vacation: 'bg-secondary/10 text-secondary',
  other: 'bg-surface-variant text-on-surface-variant',
}

export default async function AbsencesPage() {
  const supabase = await createClient()

  const { data: absences } = await supabase
    .from('absences')
    .select('id, type, start_date, end_date, status, profiles(full_name)')
    .order('start_date', { ascending: false })

  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto w-full">
      <section className="flex flex-col md:flex-row justify-between items-end gap-8 border-none">
        <div className="space-y-2 max-w-2xl">
          <p className="text-secondary font-bold uppercase tracking-[0.3em] text-[11px]">Personalwesen</p>
          <h2 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">Abwesenheiten</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Krankheitsmeldungen, Ferienanträge und Absenzen verwalten.
          </p>
        </div>
        <Link
          href="/absences/new"
          className="bg-primary text-on-primary py-3 px-6 rounded shadow-lg flex items-center gap-2 font-bold tracking-tight hover:scale-[1.02] active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined" aria-hidden="true">add</span>
          Neue Abwesenheit
        </Link>
      </section>

      <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
        {absences && absences.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-surface-container-high">
                <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider">Mitarbeiter</th>
                <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider">Typ</th>
                <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider">Zeitraum</th>
                <th className="p-4 font-headline font-bold text-outline uppercase text-xs tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {absences.map((absence) => {
                const name = (absence.profiles as { full_name: string } | null)?.full_name ?? 'Unbekannt'
                const start = new Date(absence.start_date).toLocaleDateString('de-CH', { day: 'numeric', month: 'long' })
                const end = new Date(absence.end_date).toLocaleDateString('de-CH', { day: 'numeric', month: 'long' })
                return (
                  <tr key={absence.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-bold">{name}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${TYPE_STYLES[absence.type] ?? 'bg-surface-variant text-on-surface-variant'}`}>
                        {TYPE_LABELS[absence.type] ?? absence.type}
                      </span>
                    </td>
                    <td className="p-4">{start} – {end}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLES[absence.status] ?? 'bg-surface-variant text-on-surface-variant'}`}>
                        {STATUS_LABELS[absence.status] ?? absence.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-16 text-outline">
            <span className="material-symbols-outlined text-4xl block mb-2" aria-hidden="true">person_off</span>
            <p className="font-medium">Keine Abwesenheiten erfasst.</p>
            <Link href="/absences/new" className="text-primary font-bold text-sm hover:underline mt-2 inline-block">
              Erste Abwesenheit eintragen
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
