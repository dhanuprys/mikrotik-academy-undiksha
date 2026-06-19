'use client'

import { useActionState, useState } from 'react'
import { registerAction } from '@/app/actions/register'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import { motion } from 'framer-motion'

function SubmitButton({ isAgreed }: { isAgreed: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending || !isAgreed}
      className="w-full rounded-2xl bg-slate-900 px-6 py-4 font-bold text-white shadow-lg shadow-slate-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-600/25 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Memproses Pendaftaran...
        </span>
      ) : (
        'Daftar Sekarang'
      )}
    </button>
  )
}

function FileUploadField({
  label,
  name,
  accept,
  fileName,
  onChange,
}: {
  label: string
  name: string
  accept: string
  fileName: string | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div
      className={`group relative rounded-2xl border-2 border-dashed p-6 text-center backdrop-blur-xl transition-all ${fileName ? 'border-blue-400 bg-blue-50/60 shadow-inner' : 'border-slate-300/60 bg-white/40 hover:border-blue-400 hover:bg-white/60'}`}
    >
      <input
        required
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
      />
      <div className="pointer-events-none flex flex-col items-center justify-center space-y-3">
        {fileName ? (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-sm">
              <p className="line-clamp-1 px-2 font-semibold text-blue-800">{fileName}</p>
              <p className="mt-0.5 text-blue-500">Klik untuk mengganti file</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition-colors group-hover:text-blue-500">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-bold text-slate-700">{label}</p>
              <p className="mt-1 text-slate-500">Maks. 5MB (JPG/PNG/PDF)</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function RegisterPage({ prodis }: { prodis: any[] }) {
  const [state, formAction] = useActionState(registerAction, null)
  const [isAgreed, setIsAgreed] = useState(false)

  const [paymentFileName, setPaymentFileName] = useState<string | null>(null)
  const [ktmFileName, setKtmFileName] = useState<string | null>(null)

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      setter(file.name)
    } else {
      setter(null)
    }
  }

  if (state?.success) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4 font-sans">
        <motion.div
          className="pointer-events-none absolute top-1/4 left-1/4 h-[50vw] w-[50vw] rounded-full bg-emerald-300/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-white bg-white/60 p-10 text-center shadow-xl shadow-slate-200/50 backdrop-blur-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/30"
          >
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </motion.div>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900">
            Pendaftaran Berhasil!
          </h2>
          <p className="mb-8 leading-relaxed text-slate-600">
            Terima kasih telah mendaftar. Kami akan memverifikasi berkas Anda dan menghubungi Anda
            melalui WhatsApp untuk informasi selanjutnya.
          </p>
          <Link
            href="/"
            className="inline-block w-full rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f7f9] px-4 py-16 font-sans sm:px-6 lg:px-8">
      {/* === INTERACTIVE BACKGROUND BLOBS === */}
      <motion.div
        className="pointer-events-none fixed top-[-10%] left-[-10%] h-[60vw] w-[60vw] rounded-full bg-blue-400/20 mix-blend-multiply blur-[100px]"
        animate={{ x: [0, 80, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none fixed right-[-10%] bottom-[-10%] h-[70vw] w-[70vw] rounded-full bg-cyan-300/20 mix-blend-multiply blur-[100px]"
        animate={{ x: [0, -60, 0], y: [0, -80, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none fixed top-[40%] left-[60%] h-[30vw] w-[30vw] rounded-full bg-violet-400/15 mix-blend-multiply blur-[80px]"
        animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* === FLAT / GLASS FORM WRAPPER === */}
      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <div className="px-4 py-8 sm:px-12">
          <div className="mb-12 text-center">
            <Link href="/" className="mb-8 inline-flex items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -4 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 flex h-16 w-16 items-center justify-center"
              >
                <img
                  src="/undiksha-logo.png"
                  alt="Undiksha Logo"
                  className="h-10 w-10 object-contain mix-blend-multiply"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-black text-slate-400 select-none"
              >
                ✕
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 flex h-16 items-center justify-center px-5"
              >
                <img
                  src="/mikrotik-logo.png"
                  alt="Mikrotik Logo"
                  className="h-6 object-contain opacity-90"
                />
              </motion.div>
            </Link>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm sm:text-5xl">
              Formulir Pendaftaran
            </h1>
            <p className="text-lg font-medium text-slate-600">
              Pelatihan & Sertifikasi MikroTik Academy FTK
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            {state?.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-600 shadow-sm backdrop-blur-md"
              >
                <svg
                  className="mt-0.5 mr-3 h-5 w-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                {state.error}
              </motion.div>
            )}

            <div>
              <label className="mb-2 ml-1 block text-sm font-bold text-slate-700">
                NIM (Nomor Induk Mahasiswa)
              </label>
              <input
                required
                type="text"
                name="nim"
                className="w-full rounded-2xl border border-white/60 bg-white/60 px-5 py-4 font-medium text-slate-900 shadow-sm backdrop-blur-xl transition-all outline-none hover:bg-white/90 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-400/10"
                placeholder="Contoh: 2015101010"
              />
            </div>

            <div>
              <label className="mb-2 ml-1 block text-sm font-bold text-slate-700">
                Nama Lengkap (Sesuai KTM)
              </label>
              <input
                required
                type="text"
                name="name"
                className="w-full rounded-2xl border border-white/60 bg-white/60 px-5 py-4 font-medium text-slate-900 shadow-sm backdrop-blur-xl transition-all outline-none hover:bg-white/90 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-400/10"
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 ml-1 block text-sm font-bold text-slate-700">
                  No. WhatsApp Aktif
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center gap-2 pl-4">
                    <span className="text-lg leading-none">🇮🇩</span>
                    <span className="border-r border-slate-300 py-1 pr-2 font-bold text-slate-500">
                      +62
                    </span>
                  </div>
                  <input
                    required
                    type="text"
                    name="phone"
                    className="w-full rounded-2xl border border-white/60 bg-white/60 py-4 pr-5 pl-24 font-medium text-slate-900 shadow-sm backdrop-blur-xl transition-all outline-none hover:bg-white/90 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-400/10"
                    placeholder="81234567890"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 ml-1 block text-sm font-bold text-slate-700">
                  Program Studi
                </label>
                <select
                  required
                  name="programStudiId"
                  className="w-full cursor-pointer appearance-none rounded-2xl border border-white/60 bg-white/60 px-5 py-4 font-medium text-slate-900 shadow-sm backdrop-blur-xl transition-all outline-none hover:bg-white/90 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-400/10"
                >
                  <option value="" className="text-slate-400">
                    Pilih Program Studi...
                  </option>
                  {prodis.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="mb-4 ml-1 text-sm font-bold text-slate-700">Berkas Persyaratan</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FileUploadField
                  label="Bukti Pembayaran"
                  name="paymentFile"
                  accept="image/jpeg,image/png,application/pdf"
                  fileName={paymentFileName}
                  onChange={(e) => handleFileChange(e, setPaymentFileName)}
                />
                <FileUploadField
                  label="Kartu Tanda Mahasiswa"
                  name="ktmFile"
                  accept="image/jpeg,image/png,application/pdf"
                  fileName={ktmFileName}
                  onChange={(e) => handleFileChange(e, setKtmFileName)}
                />
              </div>
            </div>

            <div className="pt-6">
              <label className="group flex cursor-pointer items-start space-x-4 rounded-2xl border border-transparent p-5 backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/40">
                <div className="flex-shrink-0 pt-0.5">
                  <input
                    type="checkbox"
                    required
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="h-5 w-5 cursor-pointer rounded border-slate-300 text-blue-600 shadow-sm focus:ring-blue-500 focus:ring-offset-0"
                  />
                </div>
                <span className="text-sm leading-relaxed font-medium text-slate-600 select-none">
                  Saya menyatakan bahwa data yang diisikan adalah benar, dan bersedia mengikuti
                  rangkaian kegiatan Sertifikasi MikroTik Academy ini dengan disiplin.
                </span>
              </label>
            </div>

            <div className="pt-4">
              <SubmitButton isAgreed={isAgreed} />
            </div>
          </form>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="group inline-flex items-center text-sm font-bold text-slate-400 transition-colors hover:text-slate-800"
            >
              <svg
                className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
