import { getActiveEvent, getProdiList } from '@/lib/cache'
import Link from 'next/link'
import { connection } from 'next/server'
import { Suspense } from 'react'
import {
  FadeIn, FloatingNav, HeroTitle, HeroParallaxLayer, TiltCard,
  MagneticButton, FloatingStatCards, ScrollZoomHero,
  ScrollLinkedMarquee, StickyFeatureShowcase, StickyFeatureCard,
  DarkTextReveal, RevealParagraph, ScrollProgressTimeline, ScrollTimelineItem,
  ScrollProdiCard, ParallaxFooter, ElegantEventCard, InteractiveEventShowcase
} from '@/components/home-animations'
import SmoothScrolling from '@/components/smooth-scrolling'

async function HomeContent() {
  const [activeEvent, prodis] = await Promise.all([getActiveEvent(), getProdiList()])
  await connection()

  let registrationStatus = 'no-event'
  let ctaText = ''
  let deadlineLabel = ''

  if (activeEvent) {
    const now = new Date()
    if (now < activeEvent.startDate) {
      registrationStatus = 'upcoming'
      deadlineLabel = `Dibuka ${new Date(activeEvent.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
      ctaText = 'Pendaftaran Belum Dibuka'
    } else if (now > activeEvent.endDate) {
      registrationStatus = 'closed'
      ctaText = 'Pendaftaran Telah Ditutup'
      deadlineLabel = 'Periode telah berakhir'
    } else {
      registrationStatus = 'open'
      deadlineLabel = `Batas akhir ${new Date(activeEvent.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
      ctaText = 'Daftar Sertifikasi'
    }
  }

  const marqueeItems = [
    'MTCNA Certified', 'RouterOS', 'Network Security', 'Firewall',
    'VLAN', 'OSPF Routing', 'VPN Tunneling', 'QoS', 'Wireless',
    'BGP', 'MPLS', 'IPv6', 'Bandwidth Management',
  ]

  const features = [
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
      iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
      title: 'Sertifikasi Resmi',
      desc: 'Ikuti ujian sertifikasi MTCNA yang diakui di lebih dari 150 negara langsung dari MikroTik Latvia.',
      tags: ['MTCNA', 'Global', 'Official'],
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />,
      iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600',
      title: 'Praktik Langsung',
      desc: 'Studi kasus nyata dengan perangkat RouterBoard MikroTik. Bukan simulasi — konfigurasi jaringan sungguhan.',
      tags: ['Lab', 'RouterBoard'],
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
      iconBg: 'bg-amber-50', iconColor: 'text-amber-600',
      title: 'Peluang Karir',
      desc: 'Network Engineer kompeten yang dicari perusahaan telekomunikasi dan ISP berskala nasional maupun internasional.',
      tags: ['Career', 'Industry'],
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />,
      iconBg: 'bg-violet-50', iconColor: 'text-violet-600',
      title: 'Instruktur Tersertifikasi',
      desc: 'Dibimbing langsung oleh certified MikroTik trainer berpengalaman di infrastruktur jaringan enterprise.',
      tags: ['Expert', 'Certified'],
    },
  ]

  const requirements = [
    { title: 'Mahasiswa Aktif FTK', desc: 'Terdaftar sebagai mahasiswa aktif di Fakultas Teknik dan Kejuruan, Universitas Pendidikan Ganesha.' },
    { title: 'Lulus Mata Kuliah Prasyarat', desc: 'Telah menempuh dan lulus mata kuliah prasyarat yang ditentukan oleh masing-masing Program Studi.' },
    { title: 'Kartu Tanda Mahasiswa', desc: 'Melampirkan KTM yang masih berlaku sebagai bukti identitas dan status mahasiswa aktif.' },
    { title: 'Bukti Pembayaran', desc: 'Membayar biaya sertifikasi dan mengunggah bukti pembayaran yang sah saat pendaftaran.' },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <FloatingNav />

      {/* ═══ HERO — Scroll-to-shrink ═══ */}
      <ScrollZoomHero>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-20 sm:pt-36 sm:pb-28">
          <div className="max-w-3xl">
            <HeroParallaxLayer speed={0.3}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-slate-200/60 text-[13px] font-semibold text-slate-600 shadow-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                MikroTik Academy · FTK Undiksha
              </span>
            </HeroParallaxLayer>

            <HeroParallaxLayer speed={0.6}>
              <HeroTitle />
            </HeroParallaxLayer>

            <HeroParallaxLayer speed={0.9}>
              <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-xl mb-10">
                Dapatkan sertifikasi MTCNA resmi dari MikroTik Latvia. 
                Pelatihan intensif dengan perangkat langsung untuk mahasiswa FTK Undiksha.
              </p>
            </HeroParallaxLayer>

            <HeroParallaxLayer speed={1.2}>
              <div className="flex flex-wrap items-center gap-4">
                {registrationStatus === 'open' ? (
                  <MagneticButton href="/register" className="cta-btn">
                    {ctaText}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </MagneticButton>
                ) : (
                  <button disabled className="cta-btn bg-slate-300! !shadow-none !cursor-not-allowed">{ctaText}</button>
                )}
                {activeEvent && <span className="text-sm text-slate-400 font-medium">{deadlineLabel}</span>}
              </div>
            </HeroParallaxLayer>
          </div>
          <FloatingStatCards />
        </div>
      </ScrollZoomHero>

      {/* ═══ VELOCITY MARQUEE ═══ */}
      <div className="border-y border-slate-200 bg-white py-4">
        <ScrollLinkedMarquee baseSpeed={0.8}>
          <div className="flex items-center gap-8">
            {marqueeItems.map((item, i) => (
              <span key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />{item}
              </span>
            ))}
          </div>
        </ScrollLinkedMarquee>
      </div>

      {/* ═══ FEATURES — Sticky split: heading left, cards cycle right ═══ */}
      <section className="relative mt-8 md:mt-0">
        <StickyFeatureShowcase
          itemCount={features.length}
          subheading="Mengapa Kami"
          heading="Investasi Terbaik untuk Masa Depan Karir Anda"
          description="MikroTik Academy Undiksha dirancang untuk mempersiapkan mahasiswa menjadi profesional jaringan yang kompetitif."
        >
          {features.map((f, i) => {
            const glowColors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500'];
            const iconColors = ['text-blue-400', 'text-emerald-400', 'text-amber-400', 'text-violet-400'];
            
            return (
              <StickyFeatureCard key={i} index={i} total={features.length} className="group">
                <div className="relative h-full flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl transition-all duration-500 group-hover:shadow-3xl group-hover:border-slate-700">
                  {/* Glowing Orb Background */}
                  <div className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-[90px] opacity-30 transition-opacity duration-700 group-hover:opacity-60 ${glowColors[i]}`} />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg backdrop-blur-md bg-white/10 border border-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${iconColors[i]}`}>
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {f.icon}
                      </svg>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-extrabold mb-5 tracking-tight drop-shadow-sm text-white">
                      {f.title}
                    </h3>
                    <p className="text-lg leading-relaxed text-slate-300 font-medium max-w-lg">
                      {f.desc}
                    </p>
                  </div>
                  
                  <div className="relative z-10 flex items-center gap-3 mt-12 flex-wrap">
                    {f.tags.map((t) => (
                      <span key={t} className="px-4 py-2 rounded-full text-sm font-bold bg-white/10 border border-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-colors shadow-sm">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Large Watermark Number */}
                  <div className="absolute -bottom-8 -right-4 text-[180px] font-black text-white/5 select-none pointer-events-none tracking-tighter leading-none transition-transform duration-700 group-hover:-translate-y-4 group-hover:scale-105">
                    0{i + 1}
                  </div>
                </div>
              </StickyFeatureCard>
            )
          })}
        </StickyFeatureShowcase>
      </section>
      
      {/* ═══ ELEGANT EVENT SHOWCASE (Sticky Scroll Background) ═══ */}
      {activeEvent && (
        <InteractiveEventShowcase>
          <ElegantEventCard 
            activeEvent={activeEvent} 
            registrationStatus={registrationStatus} 
            deadlineLabel={deadlineLabel} 
          />
        </InteractiveEventShowcase>
      )}

      {/* ═══ ROUTER OS CAPABILITIES (Dark Section) ═══ */}
      <DarkTextReveal>
        <p className="text-sm font-bold text-blue-500 tracking-widest uppercase mb-12">Kurikulum MTCNA</p>
        
        <RevealParagraph>
          Kuasai arsitektur <span className="text-blue-400">RouterOS</span> dari dasar. Kami memastikan Anda memahami konsep routing dan firewall.
        </RevealParagraph>
        
        <RevealParagraph>
          Implementasikan <span className="text-emerald-400">Quality of Service (QoS)</span> yang cerdas untuk memanajemen bandwidth jaringan enterprise skala besar.
        </RevealParagraph>
        
        <RevealParagraph>
          Bangun sistem <span className="text-amber-400">Tunneling &amp; VPN</span> yang aman untuk menghubungkan multi-branch office di seluruh dunia.
        </RevealParagraph>
        
        <RevealParagraph>
          Pelajari manajemen <span className="text-violet-400">Wireless Network</span>, mencakup point-to-point, CAPsMAN, dan keamanan nirkabel.
        </RevealParagraph>
      </DarkTextReveal>

      {/* ═══ REQUIREMENTS — Scroll-linked timeline ═══ */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <FadeIn direction="left">
                <p className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-3">Persyaratan</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-10">Syarat &amp; Ketentuan</h2>
              </FadeIn>
              <ScrollProgressTimeline>
                <div className="space-y-8">
                  {requirements.map((item, i) => (
                    <ScrollTimelineItem key={i} index={i}>
                      <h4 className="text-base font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </ScrollTimelineItem>
                  ))}
                </div>
              </ScrollProgressTimeline>
            </div>

            <div>
              <FadeIn direction="right">
                <p className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-3">Program Studi</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-10">Prasyarat per Prodi</h2>
              </FadeIn>
              <div className="space-y-3">
                {prodis.map((prodi, i) => (
                  <ScrollProdiCard key={prodi.id} index={i}>
                    <p className="font-bold text-slate-800 text-[15px]">{prodi.name}</p>
                    <p className="text-[13px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                      </svg>
                      Lulus: <span className="text-slate-600 font-medium">{prodi.requiredCourses}</span>
                    </p>
                  </ScrollProdiCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER — Parallax layers ═══ */}
      <ParallaxFooter>
        <div className="flex justify-center items-center gap-3 mb-5">
          <div className="nav-logo !shadow-none bg-white rounded-full p-1">
            <img src="/undiksha-logo.png" alt="Undiksha Logo" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">MikroTik Academy</span>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
          Program sertifikasi jaringan resmi di bawah naungan Fakultas Teknik dan Kejuruan, Universitas Pendidikan Ganesha.
        </p>
        <div className="mt-8 pt-8 border-t border-slate-800">
          <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} FTK Undiksha. All rights reserved.</p>
        </div>
      </ParallaxFooter>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="nav-logo animate-pulse">
            <img src="/undiksha-logo.png" alt="Undiksha Logo" />
          </div>
          <p className="text-sm text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <SmoothScrolling>
        <HomeContent />
      </SmoothScrolling>
    </Suspense>
  )
}
