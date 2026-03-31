'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center px-6 max-w-md">
        <span className="material-symbols-outlined text-error text-6xl mb-4 block">error</span>
        <h1 className="font-headline text-2xl font-bold text-on-surface mb-2">Etwas ist schiefgelaufen</h1>
        <p className="text-on-surface-variant text-sm mb-6">
          Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut.
        </p>
        <button
          onClick={unstable_retry}
          className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
        >
          Erneut versuchen
        </button>
      </div>
    </div>
  )
}
