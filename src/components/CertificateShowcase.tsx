import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, X, ZoomIn, Calendar, MapPin, CheckCircle2, Medal } from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  category: string;
  year: string;
  description: string;
  detail: string;
  file: string;
  badge: string;
  badgeColor: string;
  borderColor: string;
  glowColor: string;
}

const CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    title: '50 BESAR LOMBA VIDEOGRAFER NASIONAL',
    issuer: 'Kementerian Agama Republik Indonesia',
    category: 'Prestasi Kompetisi',
    year: '2024',
    description:
      'Penghargaan sebagai 50 Finalis terbaik tingkat nasional dalam bidang video kreatif yang diselenggarakan oleh Kementerian Agama RI — ajang bergengsi yang diikuti ribuan peserta dari seluruh Indonesia.',
    detail:
      'Kompetisi ini menguji kemampuan videografi, storytelling, dan editing video secara menyeluruh. Berhasil masuk 50 besar dari ribuan peserta se-Indonesia merupakan bukti nyata kompetensi di bidang produksi video kreatif tingkat nasional.',
    file: '/sertifikat50besarlombavidiographer.jpeg',
    badge: '50',
    badgeColor: 'text-amber-300',
    borderColor: 'border-amber-700/40',
    glowColor: 'rgba(217,119,6,0.15)',
  },
  {
    id: 'cert-2',
    title: 'SERTIFIKAT TKA — KOMPETENSI KEAHLIAN DKV',
    issuer: 'Madrasah Aliya Kejuruan Negri Ende',
    category: 'Sertifikasi Akademik',
    year: '2024',
    description:
      'Sertifikat Uji Kompetensi Keahlian (TKA) bidang Desain Komunikasi Visual dari MAK Negri Ende — bukti formal kelulusan uji kompetensi di bidang DKV yang mencakup desain grafis dan produksi media visual.',
    detail:
      'TKA (Tes Kompetensi Akademik) adalah ujian standar nasional yang mengukur penguasaan kompetensi keahlian siswa SMK/MAK. Sertifikat ini menegaskan kemampuan dalam bidang DKV meliputi desain grafis, videografi, dan produksi konten visual.',
    file: '/sertifikattka.jpg',
    badge: 'TKA',
    badgeColor: 'text-sky-300',
    borderColor: 'border-sky-700/40',
    glowColor: 'rgba(14,165,233,0.15)',
  },
];

export default function CertificateShowcase() {
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [imgZoomed, setImgZoomed] = useState(false);

  return (
    <div className="w-full flex flex-col gap-12">

      {/* ── Header strip ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-px h-8 bg-zinc-700" />
          <div>
            <p className="text-[9px] font-mono text-zinc-500 tracking-[0.3em] uppercase">
              REKAM JEJAK PRESTASI &bull; SAIFUL DUKA
            </p>
            <h3 className="text-white font-bold text-lg uppercase tracking-tight mt-0.5">
              Sertifikat & Penghargaan
            </h3>
          </div>
        </div>
        <p className="text-xs text-zinc-500 font-sans leading-relaxed max-w-xl">
          Kumpulan sertifikat resmi yang diraih melalui kompetisi nasional dan uji kompetensi akademik di bidang Desain Komunikasi Visual dan Videografi.
        </p>
      </div>

      {/* ── Two-column cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CERTIFICATES.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.5 }}
            className={`group relative flex flex-col rounded-2xl border ${cert.borderColor} bg-zinc-950 overflow-hidden cursor-pointer hover:border-opacity-80 transition-all duration-300`}
            style={{ boxShadow: `0 0 40px ${cert.glowColor}` }}
            onClick={() => setSelected(cert)}
          >
            {/* Certificate image preview */}
            <div className="relative w-full overflow-hidden bg-black"
              style={{ aspectRatio: '4/3' }}>
              <img
                src={cert.file}
                alt={cert.title}
                className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />
              {/* Dark overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

              {/* Viewfinder corners */}
              <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-white/30 group-hover:border-white/70 transition-colors" />
              <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-white/30 group-hover:border-white/70 transition-colors" />
              <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-white/30 group-hover:border-white/70 transition-colors" />
              <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-white/30 group-hover:border-white/70 transition-colors" />

              {/* Category badge top-left */}
              <span className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 border border-zinc-700 text-[9px] font-mono text-zinc-300 px-3 py-1 rounded-full tracking-widest uppercase">
                {cert.category}
              </span>

              {/* Big badge number/text center-bottom */}
              <div className="absolute bottom-5 left-6 flex items-end gap-3">
                <span className={`font-black text-5xl leading-none ${cert.badgeColor} drop-shadow-lg`}>
                  {cert.badge}
                </span>
              </div>

              {/* Zoom hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur border border-white/30 flex items-center justify-center">
                  <ZoomIn size={16} className="text-white" />
                </div>
              </div>
            </div>

            {/* Info block */}
            <div className="p-6 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-bold text-sm text-white uppercase tracking-tight leading-snug">
                  {cert.title}
                </h4>
                <Medal size={18} className={`shrink-0 mt-0.5 ${cert.badgeColor}`} />
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-zinc-500">
                <span className="flex items-center gap-1"><Award size={10} /> {cert.issuer}</span>
                <span className="flex items-center gap-1"><Calendar size={10} /> {cert.year}</span>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans line-clamp-3">
                {cert.description}
              </p>

              <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-600 border-t border-zinc-900 pt-3 mt-1">
                <CheckCircle2 size={11} className="text-green-500" />
                <span>Terverifikasi &bull; Klik untuk lihat detail</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-4 border border-zinc-900 rounded-2xl p-6 bg-zinc-950/40">
        {[
          { num: '2', label: 'Sertifikat Resmi' },
          { num: '50', label: 'Besar Nasional' },
          { num: '1', label: 'Uji Kompetensi Lulus' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
            <span className="font-black text-3xl text-white">{stat.num}</span>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── MODAL LIGHTBOX ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-10"
            onClick={() => { if (!imgZoomed) { setSelected(null); setImgZoomed(false); } }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 30 }}
              transition={{ type: 'spring', damping: 22 }}
              className="bg-zinc-950 border border-zinc-800 max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={e => e.stopPropagation()}
            >
              {/* LEFT: Image */}
              <div
                className={`relative w-full md:w-3/5 bg-black flex items-center justify-center overflow-hidden cursor-zoom-in transition-all duration-300 ${imgZoomed ? 'md:w-full' : ''}`}
                onClick={() => setImgZoomed(!imgZoomed)}
              >
                <img
                  src={selected.file}
                  alt={selected.title}
                  className={`object-contain transition-all duration-500 ${imgZoomed ? 'w-full h-auto max-h-[90vh]' : 'w-full h-full max-h-[480px]'}`}
                />
                {/* Corners */}
                <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-white/40 pointer-events-none" />
                <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-white/40 pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-white/40 pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-white/40 pointer-events-none" />
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/40 tracking-widest">
                  {imgZoomed ? 'KLIK UNTUK PERKECIL' : 'KLIK UNTUK PERBESAR'}
                </span>
              </div>

              {/* RIGHT: Detail — hidden when zoomed */}
              {!imgZoomed && (
                <div className="w-full md:w-2/5 p-7 flex flex-col gap-5 bg-zinc-950/80 justify-between">
                  <div className="flex justify-end">
                    <button
                      onClick={() => { setSelected(null); setImgZoomed(false); }}
                      className="p-2 border border-zinc-800 hover:border-zinc-500 rounded-full text-zinc-400 hover:text-white transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-5">
                    {/* Badge */}
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-xl border ${selected.borderColor} bg-black flex items-center justify-center`}
                        style={{ boxShadow: `0 0 20px ${selected.glowColor}` }}>
                        <span className={`font-black text-xl ${selected.badgeColor}`}>{selected.badge}</span>
                      </div>
                      <div>
                        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{selected.category}</p>
                        <p className="text-white font-bold text-xs mt-0.5">{selected.year}</p>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="border-b border-zinc-900 pb-4">
                      <h2 className="font-black text-base text-white uppercase leading-tight tracking-tight">
                        {selected.title}
                      </h2>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-col gap-2.5 font-mono text-xs">
                      <div className="flex justify-between border-b border-zinc-900/60 pb-2">
                        <span className="text-zinc-500">PENERBIT</span>
                        <span className="text-white font-bold text-right text-[11px] max-w-[55%]">{selected.issuer}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900/60 pb-2">
                        <span className="text-zinc-500">TAHUN</span>
                        <span className="text-white font-bold">{selected.year}</span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span className="text-zinc-500">STATUS</span>
                        <span className="text-green-400 font-bold flex items-center gap-1">
                          <CheckCircle2 size={11} /> TERVERIFIKASI
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                      {selected.detail}
                    </p>
                  </div>

                  {/* Download / view full */}
                  <a
                    href={selected.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white hover:bg-zinc-200 text-black py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <ZoomIn size={13} /> Lihat Sertifikat Penuh
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
