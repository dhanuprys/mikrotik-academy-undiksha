'use client'


import { useEffect, useRef, useState, useCallback, createContext, useContext } from 'react'
import { useMediaQuery } from "./hooks";
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
// ── FLOATING NAV ──
export function FloatingNav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => scrollY.on('change', (v) => setScrolled(v > 80)), [scrollY])

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 h-16"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0)',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(0px)',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
          boxShadow: scrolled ? '0 1px 3px rgba(0,0,0,0.04)' : '0 0 0 transparent',
        }}
        transition={{ duration: 0.35 }}
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 flex justify-between items-center h-full">
        <div className="flex items-center gap-3">
          <motion.div className="nav-logo" whileHover={{ scale: 1.1, rotate: -3 }} whileTap={{ scale: 0.95 }}>
            <img src="/undiksha-logo.png" alt="Undiksha Logo" />
          </motion.div>
          <span className="text-[15px] font-bold tracking-tight text-slate-900">MikroTik Academy</span>
        </div>
        <div className="hidden sm:block">
          <Link href="/register">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Daftar Sekarang
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}

// ── NETWORK GRID ──
export function NetworkGrid() {
  return (
    <div className="network-grid" aria-hidden="true">
      {Array.from({ length: 35 }).map((_, i) => (
        <motion.div key={i} className="grid-dot" style={{ left: `${(i % 7) * 16.66}%`, top: `${Math.floor(i / 7) * 20}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.6, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
        />
      ))}
      <svg className="grid-lines" viewBox="0 0 700 500" preserveAspectRatio="none">
        <path d="M100,100 L250,200 L400,150 L550,250" className="grid-line line-1" />
        <path d="M150,300 L300,200 L450,350 L600,200" className="grid-line line-2" />
        <path d="M50,250 L200,350 L350,200 L500,300 L650,150" className="grid-line line-3" />
      </svg>
    </div>
  )
}

// ── HERO TITLE (staggered chars) ──
export function HeroTitle() {
  return (
    <motion.h1 className="hero-title mb-8" initial="hidden" animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03, delayChildren: 0.2 } } }}>
      {'Bangun Keahlian'.split('').map((c, i) => (
        <motion.span key={`l1-${i}`} className="inline-block"
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}>
          {c === ' ' ? '\u00A0' : c}
        </motion.span>
      ))}
      <br />
      <motion.span className="accent inline-block"
        variants={{ hidden: { opacity: 0, y: 40, scaleX: 0.8 }, visible: { opacity: 1, y: 0, scaleX: 1, transition: { duration: 0.8, ease, delay: 0.4 } } }}>
        Network Engineering
      </motion.span>
      <br />
      {'Bertaraf Global'.split('').map((c, i) => (
        <motion.span key={`l3-${i}`} className="inline-block"
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease, delay: 0.6 + i * 0.02 } } }}>
          {c === ' ' ? '\u00A0' : c}
        </motion.span>
      ))}
    </motion.h1>
  )
}

// ── FADE IN ──
export function FadeIn({ children, className = '', delay = 0, direction = 'up' }: {
  children: React.ReactNode; className?: string; delay?: number; direction?: 'up' | 'down' | 'left' | 'right'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const dirs = { up: { y: 40, x: 0 }, down: { y: -40, x: 0 }, left: { x: 50, y: 0 }, right: { x: -50, y: 0 } }
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, ...dirs[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}} transition={{ duration: 0.7, ease, delay }}>
      {children}
    </motion.div>
  )
}

// ── FLOATING STAT CARDS ──
export function FloatingStatCards() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, -40])
  const y2 = useTransform(scrollY, [0, 500], [0, -65])
  const y3 = useTransform(scrollY, [0, 500], [0, -90])
  const xOut = useTransform(scrollY, [200, 600], [0, 120])
  const opOut = useTransform(scrollY, [200, 600], [1, 0])

  return (
    <motion.div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-5 w-56" style={{ x: xOut, opacity: opOut }}>
      {[{ y: y1, d: 0.5, v: 'MTCNA', l: 'Sertifikasi Internasional', c: 'text-slate-900' },
        { y: y2, d: 0.65, v: '100%', l: 'Hands-on Practice', c: 'text-slate-900' },
        { y: y3, d: 0.8, v: 'RouterOS', l: 'Real Equipment Lab', c: 'text-blue-600' }
      ].map((s, i) => (
        <motion.div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-lg shadow-slate-200/50"
          initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease, delay: s.d }} style={{ y: s.y }}
          whileHover={{ scale: 1.05, boxShadow: '0 16px 40px rgba(37,99,235,0.12)' }}>
          <p className={`text-3xl font-extrabold ${s.c}`}>{s.v}</p>
          <p className="text-sm text-slate-500 mt-1">{s.l}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ── PARALLAX FOOTER ──
export function ParallaxFooter({ children }: { children: React.ReactNode }) {
  return (
    <footer className="site-footer py-16 text-center">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.7, ease }}
        className="max-w-7xl mx-auto px-5 sm:px-8"
      >
        {children}
      </motion.div>
    </footer>
  )
}

// ── TILT CARD ──
export function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 20 })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => { mx.set(0); my.set(0) }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`transition-all duration-200 ease-linear ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  )
}

// ── MAGNETIC BUTTON ──
export function MagneticButton({ children, className = '', href }: { children: React.ReactNode; className?: string; href?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0); const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 })
  const sy = useSpring(y, { stiffness: 200, damping: 15 })

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} className="inline-block"
      onMouseMove={(e) => { const r = ref.current?.getBoundingClientRect(); if (!r) return; x.set((e.clientX - r.left - r.width / 2) * 0.15); y.set((e.clientY - r.top - r.height / 2) * 0.15) }}
      onMouseLeave={() => { x.set(0); y.set(0) }}>
      {href ? <a href={href} className={className}>{children}</a> : <div className={className}>{children}</div>}
    </motion.div>
  )
}
