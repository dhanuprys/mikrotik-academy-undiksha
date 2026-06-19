'use client'
import { NetworkGrid } from "./layout-animations";
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


const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]
// ── SCROLL ZOOM HERO ──
export function ScrollZoomHero({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.88])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const borderRadius = useTransform(scrollYProgress, [0, 0.5], [0, 24])

  return (
    <section ref={ref} className="hero-section">
      <motion.div className="absolute inset-0 origin-center will-change-transform" style={{ scale, borderRadius, overflow: 'hidden' }}>
        <div className="hero-bg-gradient" />
        <NetworkGrid />
      </motion.div>
      <motion.div className="relative z-10 w-full will-change-transform" style={{ opacity }}>
        {children}
      </motion.div>
    </section>
  )
}

// ── HERO PARALLAX LAYER ──
export function HeroParallaxLayer({ children, speed = 1, className = '' }: { children: React.ReactNode; speed?: number; className?: string }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, -80 * speed])
  return <motion.div className={className} style={{ y }}>{children}</motion.div>
}

// ── SCROLL-VELOCITY MARQUEE ──
export function ScrollLinkedMarquee({ children, baseSpeed = 1 }: { children: React.ReactNode; baseSpeed?: number }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 300 })
  const velocityFactor = useTransform(smoothVelocity, [-1000, 0, 1000], [4, 1, 4])
  const skewX = useTransform(smoothVelocity, [-500, 0, 500], [-2, 0, 2])

  const directionFactor = useRef(1)
  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseSpeed * (delta / 1000) * 60
    const vf = velocityFactor.get()
    moveBy *= vf
    baseX.set(baseX.get() + moveBy * -1)
    if (baseX.get() < -50) baseX.set(0)
  })

  const x = useTransform(baseX, (v) => `${v}%`)

  return (
    <div className="overflow-hidden">
      <motion.div className="flex whitespace-nowrap gap-8" style={{ x, skewX }}>
        {children}{children}{children}{children}
      </motion.div>
    </div>
  )
}

// ── DARK TEXT REVEAL SECTION (for the new black section) ──
export function DarkTextReveal({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Track scroll through the dark section
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ['start end', 'end start'] 
  })
  
  // Smooth the scroll for the spotlight
  const smoothProgress = useSpring(scrollYProgress, { damping: 30, stiffness: 100 })
  
  // The spotlight moves from the top (connected to the previous section) all the way to the bottom
  const spotlightY = useTransform(smoothProgress, [0, 1], ['-20%', '120%'])
  const spotlightScale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1.2, 0.8])

  return (
    <div ref={containerRef} className="relative bg-slate-950 text-white pb-32 pt-40 overflow-hidden">
      {/* Scroll-following Spotlight that looks like it leaked from the previous section */}
      <motion.div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] max-w-[1200px] h-[800px] pointer-events-none rounded-full blur-[140px] mix-blend-screen opacity-40"
        style={{ 
          background: 'radial-gradient(ellipse at center, rgba(37,99,235,1) 0%, rgba(139,92,246,0.5) 50%, transparent 100%)',
          y: spotlightY,
          scale: spotlightScale
        }} 
      />
      
      {/* Ambient static glow at the very top edge to blend the seam */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-5 sm:px-8 relative z-10">
        {children}
      </div>
    </div>
  )
}

export function RevealParagraph({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'start 0.3'],
  })
  
  const opacity = useTransform(scrollYProgress, [0, 1], [0.15, 1])
  const y = useTransform(scrollYProgress, [0, 1], [20, 0])

  return (
    <motion.p
      ref={ref}
      style={{ opacity, y }}
      className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-16 last:mb-0"
    >
      {children}
    </motion.p>
  )
}

// ── SCROLL PROGRESS TIMELINE ──
export function ScrollProgressTimeline({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Progress line */}
      <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-slate-100">
        <motion.div
          initial={{ height: '0%' }}
          whileInView={{ height: '100%' }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="w-full bg-gradient-to-b from-blue-600 to-cyan-500 origin-top"
        />
      </div>
      {children}
    </div>
  )
}

// ── SCROLL TIMELINE ITEM ──
export function ScrollTimelineItem({ children, index, className = '' }: {
  children: React.ReactNode; index: number; className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.6, ease, delay: index * 0.15 }}
      className={`timeline-item ${className}`}
    >
      <motion.div
        initial={{ scale: 0.5, backgroundColor: '#ffffff' }}
        whileInView={{ scale: 1, backgroundColor: '#2563eb' }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.4, delay: 0.3 + index * 0.15 }}
        className="timeline-dot"
      />
      {children}
    </motion.div>
  )
}

// ── SCROLL PRODI CARD ──
export function ScrollProdiCard({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease, delay: index * 0.1 }}
      className="prodi-card overflow-hidden"
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 4 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease, delay: 0.2 + index * 0.1 }}
        className="absolute left-0 top-[20%] bottom-[20%] rounded bg-gradient-to-b from-blue-600 to-cyan-500"
      />
      {children}
    </motion.div>
  )
}
