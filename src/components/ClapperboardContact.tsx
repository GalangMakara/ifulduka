import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Check, AlertCircle, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { synth } from '../utils/audio';

// ── Konfigurasi EmailJS ──────────────────────────────────
// Isi ketiga nilai ini setelah daftar di emailjs.com
const EJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || '';
const EJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || '';
// ────────────────────────────────────────────────────────

interface ClapperboardContactProps {
  soundOn: boolean;
}

export default function ClapperboardContact({ soundOn }: ClapperboardContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Dokumentasi Acara',
    budget: 'Standard',
    details: '',
  });

  const [isClapping, setIsClapping]   = useState(false);
  const [isSending, setIsSending]     = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [error, setError]             = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.details) {
      setError('Harap isi nama, email, dan detail proyek Anda.');
      if (soundOn) synth.playTick();
      return;
    }

    setError('');
    setIsClapping(true);
    if (soundOn) synth.playClap();

    // Animasi clapper dulu, baru kirim
    setTimeout(async () => {
      setIsClapping(false);
      setIsSending(true);

      try {
        // Kirim email ke saifulduka48@gmail.com via EmailJS
        await emailjs.send(
          EJS_SERVICE_ID,
          EJS_TEMPLATE_ID,
          {
            from_name:    formData.name,
            from_email:   formData.email,
            project_type: formData.projectType,
            budget:       formData.budget,
            message:      formData.details,
            to_email:     'saifulduka48@gmail.com',
          },
          EJS_PUBLIC_KEY
        );

        setIsSending(false);
        setSubmitted(true);
        if (soundOn) synth.playShutter();

      } catch (err) {
        console.error('EmailJS error:', err);
        setIsSending(false);
        setError('Gagal mengirim pesan. Coba lagi atau hubungi langsung via saifulduka48@gmail.com');
        if (soundOn) synth.playTick();
      }
    }, 600);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', projectType: 'Dokumentasi Acara', budget: 'Standard', details: '' });
    setSubmitted(false);
    setError('');
  };

  return (
    <div id="contact-slate" className="max-w-2xl mx-auto w-full text-white font-sans">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* ── CLAPPERBOARD ── */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-visible shadow-2xl flex flex-col">

              {/* Clapper hinge top */}
              <div className="relative h-24 bg-zinc-900 border-b-2 border-black rounded-t-2xl overflow-hidden flex items-end">
                {/* Strip bawah (statis) */}
                <div className="absolute inset-x-0 bottom-0 h-10 bg-zinc-900 flex justify-around overflow-hidden">
                  {[...Array(12)].map((_, i) => (
                    <div key={`strip-b-${i}`} className="w-8 h-16 bg-white/90 transform -skew-x-[35deg] origin-bottom opacity-90" />
                  ))}
                </div>
                {/* Strip atas (animasi clap) */}
                <motion.div
                  initial={{ rotate: -18 }}
                  animate={{ rotate: isClapping ? 0 : -18 }}
                  transition={{ type: 'spring', stiffness: isClapping ? 600 : 150, damping: isClapping ? 12 : 20 }}
                  style={{ originX: 0, originY: 1 }}
                  className="absolute inset-x-0 bottom-10 h-10 bg-zinc-800 border-b-2 border-black flex justify-around overflow-hidden z-10"
                >
                  {[...Array(12)].map((_, i) => (
                    <div key={`strip-t-${i}`} className="w-8 h-16 bg-white/90 transform -skew-x-[35deg] origin-bottom opacity-90" />
                  ))}
                </motion.div>
                {/* Engsel kiri */}
                <div className="absolute left-0 bottom-5 w-4 h-14 bg-zinc-600 border border-zinc-500 rounded-sm z-20" />
                {/* Label CLAP di tengah */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-black/60 border border-white/10 px-3 py-0.5 rounded text-[9px] font-mono text-zinc-300 tracking-widest uppercase whitespace-nowrap">
                  SAIFUL DUKA — CLAP BOARD
                </div>
              </div>

              {/* Slate body */}
              <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-5 bg-black font-mono text-xs rounded-b-2xl border border-t-0 border-zinc-800">

                {/* Metadata header */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-b border-zinc-800 pb-4 gap-4 text-center text-[10px] text-zinc-500">
                  <div className="flex flex-col border-r border-zinc-900">
                    <span>TO</span>
                    <span className="text-white font-bold mt-1 text-[9px]">SAIFUL DUKA</span>
                  </div>
                  <div className="flex flex-col border-r border-zinc-900">
                    <span>FPS</span>
                    <span className="text-white font-bold mt-1">24.00 FPS</span>
                  </div>
                  <div className="flex flex-col border-r border-zinc-900">
                    <span>ROLL</span>
                    <span className="text-white font-bold mt-1 uppercase">A-01</span>
                  </div>
                  <div className="flex flex-col">
                    <span>SHUTTER</span>
                    <span className="text-white font-bold mt-1">180°</span>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                  <div className="flex flex-col gap-1.5 border border-zinc-800 p-3 rounded-lg bg-zinc-950/60 focus-within:border-white transition-colors">
                    <label className="text-[9px] text-zinc-500 tracking-wider">DIRECTOR (NAMA ANDA)</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                      placeholder="Nama lengkap Anda"
                      className="bg-transparent text-white font-bold text-sm outline-none border-none placeholder-zinc-700 w-full" />
                  </div>

                  <div className="flex flex-col gap-1.5 border border-zinc-800 p-3 rounded-lg bg-zinc-950/60 focus-within:border-white transition-colors">
                    <label className="text-[9px] text-zinc-500 tracking-wider">ROLL (EMAIL KONTAK)</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      placeholder="email@anda.com"
                      className="bg-transparent text-white font-bold text-sm outline-none border-none placeholder-zinc-700 w-full" />
                  </div>

                  <div className="flex flex-col gap-1.5 border border-zinc-800 p-3 rounded-lg bg-zinc-950/60 focus-within:border-white transition-colors">
                    <label className="text-[9px] text-zinc-500 tracking-wider">SCENE (JENIS PROYEK)</label>
                    <select name="projectType" value={formData.projectType} onChange={handleChange}
                      className="bg-transparent text-white font-bold text-xs border-none outline-none focus:ring-0 cursor-pointer w-full">
                      <option value="Dokumentasi Acara" className="bg-black">DOKUMENTASI ACARA</option>
                      <option value="Dokumentasi Pernikahan" className="bg-black">DOKUMENTASI PERNIKAHAN</option>
                      <option value="Dokumentasi Wisuda" className="bg-black">DOKUMENTASI WISUDA</option>
                      <option value="Video Kreatif / DKV" className="bg-black">VIDEO KREATIF / DKV</option>
                      <option value="Desain Grafis" className="bg-black">DESAIN GRAFIS</option>
                      <option value="Lainnya" className="bg-black">LAINNYA</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 border border-zinc-800 p-3 rounded-lg bg-zinc-950/60 focus-within:border-white transition-colors">
                    <label className="text-[9px] text-zinc-500 tracking-wider">TAKE (ANGGARAN / ESTIMASI)</label>
                    <select name="budget" value={formData.budget} onChange={handleChange}
                      className="bg-transparent text-white font-bold text-xs border-none outline-none focus:ring-0 cursor-pointer w-full">
                      <option value="Standard" className="bg-black">STANDARD CREATIVE</option>
                      <option value="Premium" className="bg-black">PREMIUM PRODUCTION</option>
                      <option value="Indie / Kolaborasi" className="bg-black">INDIE / KOLABORASI</option>
                      <option value="Diskusi Lebih Lanjut" className="bg-black">DISKUSI LEBIH LANJUT</option>
                    </select>
                  </div>
                </div>

                {/* Textarea */}
                <div className="flex flex-col gap-1.5 border border-zinc-800 p-4 rounded-lg bg-zinc-950/60 focus-within:border-white transition-colors mt-2">
                  <label className="text-[9px] text-zinc-500 tracking-wider">PROD. NOTES (DETAIL KEBUTUHAN)</label>
                  <textarea name="details" rows={4} value={formData.details} onChange={handleChange}
                    placeholder="Ceritakan kebutuhan proyek Anda — acara, tanggal, lokasi, referensi gaya visual..."
                    className="bg-transparent text-white text-xs outline-none border-none placeholder-zinc-700 resize-none w-full leading-relaxed" />
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2 text-red-400 border border-red-900/50 p-3 rounded bg-red-950/30">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span className="text-[10px] leading-relaxed">{error}</span>
                  </div>
                )}

                {/* Note */}
                <div className="text-[9px] text-zinc-600 flex items-start gap-1.5 mt-1">
                  <Info size={11} className="shrink-0 mt-0.5" />
                  <span>Pesan akan dikirim langsung ke <span className="text-zinc-400">saifulduka48@gmail.com</span> setelah klik tombol di bawah.</span>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <button type="submit" disabled={isClapping || isSending}
                className="w-full sm:w-auto bg-white hover:bg-zinc-200 disabled:opacity-60 disabled:cursor-not-allowed text-black px-8 py-3 rounded-xl font-bold font-sans text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSending ? (
                  <><Loader2 size={14} className="animate-spin" /><span>Mengirim Email...</span></>
                ) : isClapping ? (
                  <span>Mengunci Frame...</span>
                ) : (
                  <><Mail size={14} /><span>CLAP & SEND PROJECT</span><span className="text-[9px] bg-black text-white px-1.5 py-0.5 rounded ml-1 font-mono">REC</span></>
                )}
              </button>
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl text-center flex flex-col items-center gap-5 shadow-2xl"
          >
            <div className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-lg">
              <Check size={26} className="stroke-[3]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-bold text-lg tracking-tight">EMAIL TERKIRIM!</h3>
              <p className="text-xs text-zinc-400 font-mono">DIKIRIM KE saifulduka48@gmail.com</p>
            </div>
            <p className="text-sm text-zinc-300 max-w-md leading-relaxed mt-2 font-sans">
              Terima kasih, <strong className="text-white">{formData.name}</strong>. Pesan Anda sudah masuk ke inbox Saiful Duka. Akan dibalas dalam waktu 24 jam.
            </p>
            <div className="w-full max-w-xs border border-zinc-900 rounded-lg p-3.5 bg-black text-left text-[10px] font-mono text-zinc-500 mt-2">
              <span className="block border-b border-zinc-900 pb-1.5 mb-1.5 font-bold uppercase text-white">Detail Terkirim</span>
              <span>DARI: {formData.name} ({formData.email})</span><br />
              <span>PROYEK: {formData.projectType}</span><br />
              <span>ANGGARAN: {formData.budget}</span><br />
              <span>WAKTU: {new Date().toLocaleTimeString('id-ID')}</span>
            </div>
            <button onClick={handleReset}
              className="text-xs text-zinc-400 hover:text-white transition-colors uppercase border border-zinc-800 px-4 py-2 rounded-lg font-mono mt-2">
              Kirim Pesan Baru
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
