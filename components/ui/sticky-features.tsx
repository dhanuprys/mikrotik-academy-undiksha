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
// ── STICKY FEATURE SHOWCASE (split layout: heading left, cards right) ──
export function StickyFeatureShowcase({
  children,
  itemCount,
  heading,
  subheading,
  description,
}: {
  children: React.ReactNode
  itemCount: number
  heading: string
  subheading: string
  description: string
}) {
  const isMobile = useMediaQuery('(max-width: 1024px)')
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  // Current active index (0-based)
  const activeIndex = useTransform(scrollYProgress, [0, 0.999], [0, itemCount - 0.01])
  const [currentStep, setCurrentStep] = useState(0)
  useEffect(() => activeIndex.on('change', (v) => setCurrentStep(Math.floor(v))), [activeIndex])

  // Progress ring
  const circumference = 2 * Math.PI * 20
  const strokeDashoffset = useTransform(scrollYProgress, [0, 1], [circumference, 0])

  if (isMobile) {
    return (
      <div className="px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-3">{subheading}</p>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">{heading}</h2>
          <p className="text-slate-500">{description}</p>
        </div>
        <div className="space-y-5">{children}</div>
      </div>
    )
  }

  return (
    <div ref={containerRef} style={{ height: `${(itemCount + 1) * 100}vh` }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-12 gap-12 items-center">
          {/* Left: Pinned heading + step counter */}
          <div className="col-span-5">
            <p className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-4">{subheading}</p>
            <h2 className="text-4xl xl:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              {heading}
            </h2>
            <p className="text-slate-500 leading-relaxed mb-10">{description}</p>

            {/* Progress ring + step counter */}
            <div className="flex items-center gap-5">
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="20" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
                  <motion.circle cx="22" cy="22" r="20" fill="none" stroke="url(#progressGrad)" strokeWidth="2.5"
                    strokeLinecap="round" strokeDasharray={circumference} style={{ strokeDashoffset }} />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563eb" /><stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900">
                  {currentStep + 1}/{itemCount}
                </span>
              </div>
              {/* Step dots */}
              <div className="flex gap-2">
                {Array.from({ length: itemCount }).map((_, i) => (
                  <motion.div key={i} className="w-2 h-2 rounded-full"
                    animate={{ backgroundColor: i <= currentStep ? '#2563eb' : '#cbd5e1', scale: i === currentStep ? 1.4 : 1 }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Stacking cards viewport */}
          <div className="col-span-7 relative h-[420px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── STICKY FEATURE CARD ──
export function StickyFeatureCard({
  children,
  index,
  total,
  className = '',
}: {
  children: React.ReactNode
  index: number
  total: number
  className?: string
}) {
  const isMobile = useMediaQuery('(max-width: 1024px)')
  const containerRef = useRef<HTMLDivElement>(null)

  // Find the parent scroll container (StickyFeatureShowcase)
  const [parentEl, setParentEl] = useState<HTMLDivElement | null>(null)
  useEffect(() => {
    if (containerRef.current) {
      let el = containerRef.current.parentElement
      while (el && !el.style.height?.includes('vh')) {
        el = el.parentElement
      }
      if (el) setParentEl(el as HTMLDivElement)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: parentEl ? { current: parentEl } : undefined,
    offset: ['start start', 'end end'],
  })

  // Apply a spring to the scroll progress for buttery smooth, physics-based transitions
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 300, damping: 30, restDelta: 0.001 })

  const segmentSize = 1 / total
  const start = index * segmentSize
  const end = start + segmentSize

  // Complex 3D Card Deck Animation mappings
  const opacity = useTransform(smoothProgress, 
    [Math.max(0, start - 0.1), start + 0.05, end - 0.05, Math.min(1, end + 0.1)],
    [0, 1, 1, index === total - 1 ? 1 : 0]
  )
  const scale = useTransform(smoothProgress,
    [Math.max(0, start - 0.1), start + 0.05, end - 0.05, Math.min(1, end + 0.1)],
    [0.85, 1, 1, index === total - 1 ? 1 : 0.9]
  )
  const y = useTransform(smoothProgress,
    [Math.max(0, start - 0.1), start + 0.05, end - 0.05, Math.min(1, end + 0.1)],
    [100, 0, 0, index === total - 1 ? 0 : -60]
  )
  const rotateX = useTransform(smoothProgress,
    [Math.max(0, start - 0.1), start + 0.05, end - 0.05, Math.min(1, end + 0.1)],
    [15, 0, 0, index === total - 1 ? 0 : -10]
  )
  const blurValue = useTransform(smoothProgress,
    [Math.max(0, start - 0.1), start + 0.05, end - 0.05, Math.min(1, end + 0.1)],
    [10, 0, 0, index === total - 1 ? 0 : 6]
  )
  const filter = useTransform(blurValue, v => `blur(${v}px)`)
  const zIndex = useTransform(smoothProgress,
    [Math.max(0, start - 0.1), start + 0.05],
    [0, 10]
  )

  if (isMobile) {
    return (
      <FadeIn>
        <TiltCard className={className}>{children}</TiltCard>
      </FadeIn>
    )
  }

  return (
    <motion.div
      ref={containerRef}
      className={`absolute inset-0 origin-bottom ${className}`}
      style={{ opacity, scale, y, rotateX, filter, zIndex, transformPerspective: 1000 }}
    >
      <TiltCard className="h-full">{children}</TiltCard>
    </motion.div>
  )
}
