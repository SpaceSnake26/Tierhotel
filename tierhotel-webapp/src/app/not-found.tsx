import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center px-6 max-w-md">
        <span className="material-symbols-outlined text-outline text-6xl mb-4 block">search_off</span>
        <h1 className="font-headline text-2xl font-bold text-on-surface mb-2">Seite nicht gefunden</h1>
        <p className="text-on-surface-variant text-sm mb-6">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
        <Link
          href="/dashboard"
          className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors inline-block"
        >
          Zum Dashboard
        </Link>
      </div>
    </div>
  )
}
