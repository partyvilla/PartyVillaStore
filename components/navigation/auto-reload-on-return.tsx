"use client"

// Automatically reloads the page when the user returns to the tab after it was hidden.
// Includes throttling to avoid reload loops (won't reload again within 15s) and
// ignores very brief (sub 1s) backgroundings like quick tab switches.

import { useEffect, useRef } from 'react'

const HIDE_MIN_DURATION_MS = 1000 // only reload if hidden at least this long
const RELOAD_THROTTLE_MS = 15000  // don't auto-reload more than once within this window
const LAST_RELOAD_KEY = 'pv-last-auto-reload'

export function AutoReloadOnReturn() {
  const hiddenAtRef = useRef<number | null>(null)

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAtRef.current = Date.now()
        return
      }

      // Became visible
      if (hiddenAtRef.current) {
        const hiddenDuration = Date.now() - hiddenAtRef.current
        hiddenAtRef.current = null

        if (hiddenDuration < HIDE_MIN_DURATION_MS) return

        try {
          const lastReloadRaw = sessionStorage.getItem(LAST_RELOAD_KEY)
          const lastReload = lastReloadRaw ? parseInt(lastReloadRaw, 10) : 0
          if (Date.now() - lastReload < RELOAD_THROTTLE_MS) return
          sessionStorage.setItem(LAST_RELOAD_KEY, String(Date.now()))
        } catch (_) {
          // Ignore storage errors and proceed
        }

        // Perform hard reload to fully reset app state
        window.location.reload()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  return null
}

export default AutoReloadOnReturn
