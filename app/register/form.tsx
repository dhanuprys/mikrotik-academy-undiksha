'use client';

import { useActionState, useState } from 'react';
import { registerAction } from '@/app/actions/register';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';

function SubmitButton({ isAgreed }: { isAgreed: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || !isAgreed}
      className="w-full bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Memproses Pendaftaran...
        </span>
      ) : 'Daftar Sekarang'}
    </button>
  );
}

function FileUploadField({ 
  label, 
  name, 
  accept, 
  fileName, 
  onChange 
}: { 
  label: string; 
  name: string; 
  accept: string; 
  fileName: string | null; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void 
}) {
  return (
    <div className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all group backdrop-blur-xl ${fileName ? 'border-blue-400 bg-blue-50/60 shadow-inner' : 'border-slate-300/60 bg-white/40 hover:border-blue-400 hover:bg-white/60'}`}>
      <input 
        required 
        type="file" 
        name={name} 
        accept={accept} 
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
      />
      <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
        {fileName ? (
          <>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-blue-800 line-clamp-1 px-2">{fileName}</p>
              <p className="text-blue-500 mt-0.5">Klik untuk mengganti file</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-white text-slate-400 rounded-full flex items-center justify-center shadow-sm group-hover:text-blue-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-bold text-slate-700">{label}</p>
              <p className="text-slate-500 mt-1">Maks. 5MB (JPG/PNG/PDF)</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage({ prodis }: { prodis: any[] }) {
  const [state, formAction] = useActionState(registerAction, null);
  const [isAgreed, setIsAgreed] = useState(false);
  
  const [paymentFileName, setPaymentFileName] = useState<string | null>(null);
  const [ktmFileName, setKtmFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(file.name);
    } else {
      setter(null);
    }
  };

  if (state?.success) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-50 overflow-hidden font-sans">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-emerald-300/20 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10 bg-white/60 backdrop-blur-2xl border border-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 max-w-md w-full text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-teal-400 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </motion.div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Pendaftaran Berhasil!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Terima kasih telah mendaftar. Kami akan memverifikasi berkas Anda dan menghubungi Anda melalui WhatsApp untuk informasi selanjutnya.
          </p>
          <Link href="/" className="inline-block w-full px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all font-semibold shadow-md hover:shadow-lg">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-[#f4f7f9] font-sans overflow-hidden flex items-center justify-center">
      
      {/* === INTERACTIVE BACKGROUND BLOBS === */}
      <motion.div 
        className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"
        animate={{ x: [0, 80, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="fixed bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-cyan-300/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"
        animate={{ x: [0, -60, 0], y: [0, -80, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="fixed top-[40%] left-[60%] w-[30vw] h-[30vw] bg-violet-400/15 rounded-full blur-[80px] pointer-events-none mix-blend-multiply"
        animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* === FLAT / GLASS FORM WRAPPER === */}
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="px-4 sm:px-12 py-8">
          
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center justify-center gap-4 mb-8">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: -4 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 flex items-center justify-center relative z-10"
              >
                <img src="/undiksha-logo.png" alt="Undiksha Logo" className="w-10 h-10 object-contain mix-blend-multiply" />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 font-black text-lg select-none"
              >
                ✕
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 h-16 flex items-center justify-center  relative z-10"
              >
                <img src="/mikrotik-logo.png" alt="Mikrotik Logo" className="h-6 object-contain opacity-90" />
              </motion.div>
            </Link>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 drop-shadow-sm">Formulir Pendaftaran</h1>
            <p className="text-lg text-slate-600 font-medium">Pelatihan & Sertifikasi MikroTik Academy FTK</p>
          </div>

          <form action={formAction} className="space-y-6">
            {state?.error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50/80 backdrop-blur-md border border-red-200 rounded-2xl text-red-600 text-sm flex items-start shadow-sm"
              >
                <svg className="w-5 h-5 mr-3 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                {state.error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">NIM (Nomor Induk Mahasiswa)</label>
              <input 
                required 
                type="text" 
                name="nim" 
                className="w-full px-5 py-4 rounded-2xl border border-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 bg-white/60 hover:bg-white/90 focus:bg-white text-slate-900 transition-all font-medium shadow-sm backdrop-blur-xl outline-none" 
                placeholder="Contoh: 2015101010" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Nama Lengkap (Sesuai KTM)</label>
              <input 
                required 
                type="text" 
                name="name" 
                className="w-full px-5 py-4 rounded-2xl border border-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 bg-white/60 hover:bg-white/90 focus:bg-white text-slate-900 transition-all font-medium shadow-sm backdrop-blur-xl outline-none" 
                placeholder="Masukkan nama lengkap Anda" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">No. WhatsApp Aktif</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none gap-2 z-10">
                    <span className="text-lg leading-none">🇮🇩</span>
                    <span className="text-slate-500 font-bold border-r border-slate-300 pr-2 py-1">+62</span>
                  </div>
                  <input 
                    required 
                    type="text" 
                    name="phone" 
                    className="w-full pl-24 pr-5 py-4 rounded-2xl border border-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 bg-white/60 hover:bg-white/90 focus:bg-white text-slate-900 transition-all font-medium shadow-sm backdrop-blur-xl outline-none" 
                    placeholder="81234567890" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Program Studi</label>
                <select 
                  required 
                  name="programStudiId" 
                  className="w-full px-5 py-4 rounded-2xl border border-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 bg-white/60 hover:bg-white/90 focus:bg-white text-slate-900 transition-all font-medium appearance-none shadow-sm backdrop-blur-xl outline-none cursor-pointer"
                >
                  <option value="" className="text-slate-400">Pilih Program Studi...</option>
                  {prodis.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-bold text-slate-700 mb-4 ml-1">Berkas Persyaratan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
              <label className="flex items-start space-x-4 cursor-pointer group p-5 rounded-2xl hover:bg-white/40 transition-colors backdrop-blur-sm border border-transparent hover:border-white/50">
                <div className="flex-shrink-0 pt-0.5">
                  <input 
                    type="checkbox" 
                    required 
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer shadow-sm"
                  />
                </div>
                <span className="text-sm text-slate-600 font-medium leading-relaxed select-none">
                  Saya menyatakan bahwa data yang diisikan adalah benar, dan bersedia mengikuti rangkaian kegiatan Sertifikasi MikroTik Academy ini dengan disiplin.
                </span>
              </label>
            </div>

            <div className="pt-4">
              <SubmitButton isAgreed={isAgreed} />
            </div>
          </form>
          
          <div className="mt-12 text-center">
            <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-slate-800 transition-colors group">
              <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
