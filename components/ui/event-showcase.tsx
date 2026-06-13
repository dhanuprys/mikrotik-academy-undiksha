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

// ── ELEGANT EVENT CARD (Soft Light Theme with Parallax Poster) ──
export function ElegantEventCard({ 
  activeEvent, 
  registrationStatus, 
  deadlineLabel 
}: {
  activeEvent: any;
  registrationStatus: string;
  deadlineLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Parallax for the poster image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })
  
  // Slow elegant parallax scale & translateY
  const imgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1])
  
  // Consume the sticky scroll progress if it exists
  const stickyScrollProgress = useContext(EventScrollContext)
  // Use either the sticky scroll progress (if wrapped) or a fallback value of 0
  const lightSweepX = useTransform(stickyScrollProgress || scrollYProgress, [0, 1], ['-100%', '200%'])
  
  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-6xl mx-auto"
    >
      <div className="relative bg-white/90 backdrop-blur-2xl rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-6 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex flex-col lg:flex-row gap-8 lg:gap-16">
        
        {/* Poster Side with Window Parallax */}
        {activeEvent.posterPath && (
          <div className="relative lg:w-1/2 min-h-[300px] sm:min-h-[480px] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden bg-slate-50">
            <motion.img 
              style={{ y: imgY, scale: imgScale }}
              src="/api/events/active?poster=true" 
              alt={activeEvent.title} 
              className="absolute inset-0 w-full h-[120%] object-cover origin-center" 
            />
            {/* Elegant vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-slate-900/10 mix-blend-multiply" />
            
            <div className="absolute top-8 left-8">
              <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-slate-800 tracking-widest uppercase shadow-sm border border-white/20">
                Sesi Resmi
              </span>
            </div>
          </div>
        )}

        {/* Content Side */}
        <div className={`relative z-10 p-4 sm:p-8 lg:p-12 lg:pl-0 flex flex-col justify-center ${activeEvent.posterPath ? 'lg:w-1/2' : 'w-full'}`}>
          <div className="mb-8">
            {registrationStatus === 'open' ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">Pendaftaran Dibuka</span>
              </div>
            ) : registrationStatus === 'upcoming' ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100/50">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-xs font-semibold text-amber-700 tracking-wide uppercase">Segera Hadir</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Ditutup</span>
              </div>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.15] mb-6 tracking-tight">
            {activeEvent.title}
          </h2>
          
          {activeEvent.description && (
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed mb-12 whitespace-pre-line max-w-lg font-medium">
              {activeEvent.description}
            </p>
          )}

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-auto pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-full bg-slate-50 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Batas Akhir</p>
                <p className="text-sm font-semibold text-slate-700">{deadlineLabel.replace('Batas akhir ', '').replace('Dibuka ', '')}</p>
              </div>
            </div>
            
            {registrationStatus === 'open' && (
              <MagneticButton href="/register" className="relative overflow-hidden px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(15,23,42,0.4)] flex items-center gap-3 group">
                <span className="relative z-10 tracking-wide">Amankan Kursi</span>
                <svg className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                {/* Scroll-driven intense light sweep effect */}
                <motion.div 
                  style={{ x: lightSweepX }}
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent mix-blend-overlay pointer-events-none" 
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
    offset: ['start end', 'end start'] 
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
    <div ref={containerRef} className="relative h-[250vh] bg-[#f8fafc] -my-16">
      {/* Sticky container stays fixed for 100vh while user scrolls through the 250vh parent */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Animated Ambient Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle grid pattern to anchor the floating shapes */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          
          {/* Floating Blue Blob - Made much more vibrant and visible */}
          <motion.div 
            style={{ x: blueX, y: blueY, scale: blueScale }}
            className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-blue-500/40 rounded-full blur-[120px] mix-blend-multiply" 
          />
          {/* Floating Violet Blob */}
          <motion.div 
            style={{ x: violetX, y: violetY, scale: violetScale }}
            className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-violet-500/40 rounded-full blur-[120px] mix-blend-multiply" 
          />
          {/* Central Rotating Emerald Blob */}
          <motion.div 
            style={{ rotate: emeraldRot, scale: emeraldScale }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-emerald-400/40 rounded-full blur-[100px] mix-blend-multiply origin-center" 
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
