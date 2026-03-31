'use client'

import { useState, useEffect } from 'react'

export function LiveClock() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    function update() {
      const now = new Date()
      setTime(now.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' }))
      setDate(now.toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long' }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return { time, date }
}

export function LiveClockDisplay({ large = false }: { large?: boolean }) {
  const { time, date } = LiveClock()

  if (large) {
    return (
      <div className="text-right flex items-center gap-8">
        <div className="text-3xl uppercase tracking-widest font-bold text-outline">{date || '\u00A0'}</div>
        <div className="h-16 w-[4px] bg-primary"></div>
        <div className="text-7xl font-black text-primary tracking-tighter">{time || '...'}</div>
      </div>
    )
  }

  return (
    <div className="bg-surface-container-low px-8 py-6 rounded-xl flex items-center gap-4">
      <div className="text-right">
        <div className="text-xs uppercase tracking-widest font-bold text-outline">Aktuelles Datum</div>
        <div className="text-sm font-headline font-bold capitalize">{date || '\u00A0'}</div>
      </div>
      <div className="h-10 w-[2px] bg-primary"></div>
      <div className="text-4xl font-headline font-black text-primary">{time || '...'}</div>
    </div>
  )
}
