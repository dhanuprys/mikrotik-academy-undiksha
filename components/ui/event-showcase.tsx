'use client'
import { MagneticButton } from './layout-animations'

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

// ── ELEGANT EVENT CARD (Soft Light Theme with Parallax Poster) ──
export function ElegantEventCard({
  activeEvent,
  registrationStatus,
  deadlineLabel,
}: {
  activeEvent: any
  registrationStatus: string
  deadlineLabel: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Parallax for the poster image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Slow elegant parallax scale & translateY
  const imgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1])

  // Consume the sticky scroll progress if it exists
  const stickyScrollProgress = useContext(EventScrollContext)
  // Use either the sticky scroll progress (if wrapped) or a fallback value of 0
  const lightSweepX = useTransform(
    stickyScrollProgress || scrollYProgress,
    [0, 1],
    ['-100%', '200%']
  )

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-6xl"
    >
      <div className="relative flex flex-col gap-8 overflow-hidden rounded-[2rem] border border-slate-100 bg-white/90 p-4 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.05)] backdrop-blur-2xl sm:rounded-[3rem] sm:p-6 lg:flex-row lg:gap-16">
        {/* Poster Side with Window Parallax */}
        {activeEvent.posterPath && (
          <div className="relative min-h-[300px] overflow-hidden rounded-[1.5rem] bg-slate-50 sm:min-h-[480px] sm:rounded-[2.5rem] lg:w-1/2">
            <motion.img
              style={{ y: imgY, scale: imgScale }}
              src="/api/events/active?poster=true"
              alt={activeEvent.title}
              className="absolute inset-0 h-[120%] w-full origin-center object-cover"
            />
            {/* Elegant vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-slate-900/10 mix-blend-multiply" />

            <div className="absolute top-8 left-8">
              <span className="rounded-full border border-white/20 bg-white/90 px-4 py-1.5 text-xs font-bold tracking-widest text-slate-800 uppercase shadow-sm backdrop-blur-md">
                Sesi Resmi
              </span>
            </div>
          </div>
        )}

        {/* Content Side */}
        <div
          className={`relative z-10 flex flex-col justify-center p-4 sm:p-8 lg:p-12 lg:pl-0 ${activeEvent.posterPath ? 'lg:w-1/2' : 'w-full'}`}
        >
          <div className="mb-8">
            {registrationStatus === 'open' ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100/50 bg-emerald-50 px-3 py-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">
                  Pendaftaran Dibuka
                </span>
              </div>
            ) : registrationStatus === 'upcoming' ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-100/50 bg-amber-50 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span className="text-xs font-semibold tracking-wide text-amber-700 uppercase">
                  Segera Hadir
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
                  Ditutup
                </span>
              </div>
            )}
          </div>

          <h2 className="mb-6 text-3xl leading-[1.15] font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {activeEvent.title}
          </h2>

          {activeEvent.description && (
            <p className="mb-12 max-w-lg text-base leading-relaxed font-medium whitespace-pre-line text-slate-500 sm:text-lg">
              {activeEvent.description}
            </p>
          )}

          {/* Action Footer */}
          <div className="mt-auto flex flex-col justify-between gap-6 border-t border-slate-100 pt-8 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-slate-50 p-2.5 text-slate-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                  Batas Akhir
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {deadlineLabel.replace('Batas akhir ', '').replace('Dibuka ', '')}
                </p>
              </div>
            </div>

            {registrationStatus === 'open' && (
              <MagneticButton
                href="/register"
                className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-slate-900 px-8 py-4 font-medium text-white transition-all duration-300 hover:bg-slate-800 hover:shadow-[0_0_30px_rgba(15,23,42,0.4)]"
              >
                <span className="relative z-10 tracking-wide">Amankan Kursi</span>
                <svg
                  className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
                {/* Scroll-driven intense light sweep effect */}
                <motion.div
                  style={{ x: lightSweepX }}
                  className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent mix-blend-overlay"
                />
              </MagneticButton>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── INTERACTIVE EVENT SHOWCASE (Sticky Scroll Background) ──
export function InteractiveEventShowcase({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track the scroll progress of the entire 150vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Smooth out the scroll progress for buttery background animations
  const smoothProgress = useSpring(scrollYProgress, { damping: 30, stiffness: 100 })

  // Parallax calculations for massive glowing background blobs
  const blueY = useTransform(smoothProgress, [0, 1], ['-80%', '80%'])
  const blueX = useTransform(smoothProgress, [0, 1], ['-30%', '50%'])
  const blueScale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1.5, 0.8])

  const violetY = useTransform(smoothProgress, [0, 1], ['80%', '-80%'])
  const violetX = useTransform(smoothProgress, [0, 1], ['50%', '-30%'])
  const violetScale = useTransform(smoothProgress, [0, 0.5, 1], [1.2, 0.8, 1.2])

  const emeraldRot = useTransform(smoothProgress, [0, 1], [0, 180])
  const emeraldScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.4, 1])

  return (
    <div ref={containerRef} className="relative -my-16 h-[250vh] bg-[#f8fafc]">
      {/* Sticky container stays fixed for 100vh while user scrolls through the 250vh parent */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Animated Ambient Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Subtle grid pattern to anchor the floating shapes */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Floating Blue Blob - Made much more vibrant and visible */}
          <motion.div
            style={{ x: blueX, y: blueY, scale: blueScale }}
            className="absolute top-1/4 left-1/4 h-[60vw] max-h-[800px] w-[60vw] max-w-[800px] rounded-full bg-blue-500/40 mix-blend-multiply blur-[120px]"
          />
          {/* Floating Violet Blob */}
          <motion.div
            style={{ x: violetX, y: violetY, scale: violetScale }}
            className="absolute right-1/4 bottom-1/4 h-[50vw] max-h-[600px] w-[50vw] max-w-[600px] rounded-full bg-violet-500/40 mix-blend-multiply blur-[120px]"
          />
          {/* Central Rotating Emerald Blob */}
          <motion.div
            style={{ rotate: emeraldRot, scale: emeraldScale }}
            className="absolute top-1/2 left-1/2 h-[40vw] max-h-[500px] w-[40vw] max-w-[500px] origin-center -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/40 mix-blend-multiply blur-[100px]"
          />
        </div>

        {/* Card Content Wrapper */}
        <div className="relative z-10 w-full px-5 sm:px-8">
          <EventScrollContext.Provider value={smoothProgress}>
            {children}
          </EventScrollContext.Provider>
        </div>
      </div>
    </div>
  )
}
