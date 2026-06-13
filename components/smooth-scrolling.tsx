'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Lenis for smooth, "heavy" scroll inertia
    const lenis = new Lenis({
      lerp: 0.04, // Lower value creates heavier/slower inertia (default 0.1)
      wheelMultiplier: 0.7, // Slows down the actual scroll distance per tick
      smoothWheel: true,
      syncTouch: true, // Also smooths touch scrolling on mobile
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
