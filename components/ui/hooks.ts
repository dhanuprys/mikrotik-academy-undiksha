'use client'

import { useEffect, useRef, useState, useCallback, createContext, useContext } from 'react'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  useVelocity,
  useAnimationFrame,
  MotionValue,
} from 'framer-motion'

// Context to share scroll progress between wrapper and cards
export const EventScrollContext = createContext<MotionValue<number> | null>(null)

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]
// ── MEDIA QUERY HOOK ──
function useMediaQuery(query: string) {
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
