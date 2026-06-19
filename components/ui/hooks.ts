'use client'

import { useEffect, useState } from 'react'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]
// ── MEDIA QUERY HOOK ──
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    // Defer initial match check to avoid synchronous setState during render cycle
    let mounted = true
    setTimeout(() => {
      if (mounted) setMatches(mql.matches)
    }, 0)
    mql.addEventListener('change', handler)
    return () => {
      mounted = false
      mql.removeEventListener('change', handler)
    }
  }, [query])
  return matches
}
