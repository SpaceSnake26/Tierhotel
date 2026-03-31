export default function Loading() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin block mb-3">progress_activity</span>
        <p className="text-on-surface-variant text-sm font-medium">Wird geladen...</p>
      </div>
    </div>
  )
}
