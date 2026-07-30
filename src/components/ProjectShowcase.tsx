import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Play, Pause, Film, Calendar, Compass, X,
  ChevronRight, Star, Volume2, VolumeX, Maximize2, Minimize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { synth } from '../utils/audio';

/* ─── DATA ─────────────────────────────────────────────── */
const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'ABADI DALAM MOMEN: DOKUMENTASI PERNIKAHAN',
    category: 'Dokumentasi',
    year: '2024',
    client: 'Keluarga Mempelai — Ende, NTT',
    role: 'Videografer & Editor Utama',
    camera: 'Sony ZV-E10 / Kamera Sekolah',
    lens: 'Kit Lens 16–50mm',
    description: 'Dokumentasi lengkap hari pernikahan — dari prosesi adat hingga resepsi — yang mengabadikan setiap momen emosional dengan pendekatan sinematik natural.',
    story: 'Proyek ini menantang saya untuk bekerja dalam kondisi pencahayaan yang terus berubah: dari cahaya terang prosesi luar ruangan hingga pencahayaan hangat ballroom resepsi. Saya mengutamakan momen-momen spontan — tatapan, tawa, air mata — yang tidak bisa diulang. Pendekatan editing berfokus pada alur cerita yang emosional, dengan transisi lembut dan musik yang mengiringi setiap babak.',
    thumbnail: '/saifulduka1.jpg',
    videoSrc: '/AcaraPernikahan.mp4',
    stills: ['/saifulduka1.jpg'],
    colorPalette: ['#0a0a0a', '#2c2c2c', '#5a5a5a', '#a0a0a0', '#f0f0f0'],
    aspectRatio: '16:9 Widescreen',
    duration: 'Full Day',
    featured: true,
  },
  {
    id: 'proj-2',
    title: 'LANGKAH BARU: WISUDA MAK NENDE ANGKATAN 5',
    category: 'Dokumentasi',
    year: '2024',
    client: 'MAK Negri Ende — Angkatan 5',
    role: 'Videografer & Colorist',
    camera: 'Sony ZV-E10 / Kamera Sekolah',
    lens: 'Kit Lens 16–50mm',
    description: 'Liputan resmi upacara wisuda Madrasah Aliya Kejuruan Negri Ende Angkatan ke-5 — mengabadikan kebanggaan siswa, keluarga, dan sekolah dalam satu momen bersejarah.',
    story: 'Wisuda adalah puncak dari perjuangan bertahun-tahun. Saya mendokumentasikan setiap detail: pemasangan topi wisuda, prosesi masuk, sambutan, hingga tangis haru keluarga di tribun penonton. Tantangan terbesar adalah menangkap ekspresi autentik dari ratusan wajah dalam satu hari besar. Hasil akhir adalah kenangan visual yang akan diingat selamanya oleh seluruh Angkatan 5.',
    thumbnail: '/saifulduka1.jpg',
    videoSrc: '/AcaraWisudaMAKNENDEANGKATAN5.mp4',
    stills: ['/saifulduka1.jpg'],
    colorPalette: ['#050505', '#1e1e1e', '#4a4a4a', '#9a9a9a', '#efefef'],
    aspectRatio: '16:9 Widescreen',
    duration: 'Full Event',
    featured: false,
  },
  {
    id: 'proj-3',
    title: 'JIWA PRAMUKA: KEGIATAN PRAMUKA MAK NENDE',
    category: 'Kegiatan Sekolah',
    year: '2024',
    client: 'Gugus Depan MAK Negri Ende',
    role: 'Videografer Lapangan',
    camera: 'Sony ZV-E10 / Kamera Sekolah',
    lens: 'Kit Lens 16–50mm',
    description: 'Rekaman dinamis kegiatan Pramuka MAK Nende — menapak jejak latihan fisik, ketangkasan, berkemah, dan semangat korsa yang membara.',
    story: 'Merekam kegiatan Pramuka berarti bergerak cepat mengikuti dinamika lapangan: lari lintas medan, baris berbaris, api unggun malam, dan aktivitas bertahan hidup. Saya bekerja dengan pendekatan dokumenter — kamera di tangan, selalu siap — untuk menangkap energi dan semangat anggota Pramuka yang sesungguhnya, bukan yang direkayasa.',
    thumbnail: '/saifulduka1.jpg',
    videoSrc: '/KegiatanPramukaMAKNENDE.mp4',
    stills: ['/saifulduka1.jpg'],
    colorPalette: ['#030903', '#172417', '#3a5c3a', '#7a9a7a', '#d0ead0'],
    aspectRatio: '16:9 Widescreen',
    duration: 'Multi-Hari',
    featured: false,
  },
  {
    id: 'proj-4',
    title: 'SATU GOL SATU CERITA: FUTSAL MAK NENDE',
    category: 'Kegiatan Sekolah',
    year: '2024',
    client: 'Tim Futsal MAK Negri Ende',
    role: 'Videografer & Editor',
    camera: 'Sony ZV-E10 / Kamera Sekolah',
    lens: 'Kit Lens 16–50mm',
    description: 'Liputan pertandingan futsal antar-kelas MAK Nende yang penuh semangat — tangkap aksi, gol, sorak-sorai, dan solidaritas tim dalam satu video kompak.',
    story: 'Olahraga adalah soal momen sepersekian detik: percepatan, tendangan, ekspresi setelah gol. Saya memposisikan kamera di sudut rendah lapangan untuk mendapatkan perspektif dramatis dari setiap aksi. Editing mengikuti ritme permainan — cepat saat menyerang, lambat saat selebrasi — agar penonton merasakan intensitas pertandingan.',
    thumbnail: '/saifulduka1.jpg',
    videoSrc: '/FutsalMAKNENDE.mp4',
    stills: ['/saifulduka1.jpg'],
    colorPalette: ['#030308', '#151528', '#303060', '#6060a0', '#d0d0ff'],
    aspectRatio: '16:9 Widescreen',
    duration: 'Tournament Cut',
    featured: false,
  },
  {
    id: 'proj-5',
    title: 'EKSPRESI TANPA BATAS: KARYA SENI MAK NENDE',
    category: 'Seni & Budaya',
    year: '2024',
    client: 'Jurusan DKV — MAK Negri Ende',
    role: 'Videografer & Editor Kreatif',
    camera: 'Sony ZV-E10 / Kamera Sekolah',
    lens: 'Kit Lens 16–50mm',
    description: 'Pameran dan pertunjukan karya seni siswa DKV MAK Nende — dari lukisan, desain grafis, instalasi, hingga penampilan seni pertunjukan yang memukau.',
    story: 'Ini adalah proyek paling dekat dengan jiwa DKV saya. Mendokumentasikan karya seni berarti memahami intensi kreatornya — saya berbicara dengan setiap siswa sebelum merekam karya mereka. Pengambilan gambar dilakukan dengan gerakan kamera yang tenang dan puitis untuk menghormati detail setiap karya, sementara segmen pertunjukan direkam dengan energi yang lebih dinamis.',
    thumbnail: '/saifulduka1.jpg',
    videoSrc: '/KaryaSENIMAKNENDE.mp4',
    stills: ['/saifulduka1.jpg'],
    colorPalette: ['#080508', '#201520', '#503050', '#9060a0', '#f0c0ff'],
    aspectRatio: '16:9 Widescreen',
    duration: 'Exhibition Cut',
    featured: false,
  },
];

/* ─── HELPERS ───────────────────────────────────────────── */
const CATEGORY_COLORS: Record<string, string> = {
  'Dokumentasi':     'bg-amber-950 text-amber-300 border-amber-800',
  'Kegiatan Sekolah':'bg-emerald-950 text-emerald-300 border-emerald-800',
  'Seni & Budaya':   'bg-purple-950 text-purple-300 border-purple-800',
};

function VideoCard({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const seek = () => { v.currentTime = 1; };
    v.addEventListener('loadeddata', seek, { once: true });
    return () => v.removeEventListener('loadeddata', seek);
  }, [src]);
  return (
    <video
      ref={ref}
      src={src}
      muted loop playsInline preload="auto"
      onMouseEnter={() => ref.current?.play()}
      onMouseLeave={() => { if (ref.current) { ref.current.pause(); ref.current.currentTime = 1; } }}
      className={className}
    />
  );
}

/* ─── PROPS ─────────────────────────────────────────────── */
interface ProjectShowcaseProps {
  onSelectProject: (proj: Project) => void;
  soundOn: boolean;
}

/* ─── MAIN COMPONENT ────────────────────────────────────── */
export default function ProjectShowcase({ onSelectProject, soundOn }: ProjectShowcaseProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory]   = useState<string>('Semua');
  const [isPlaying, setIsPlaying]             = useState(false);
  const [isMuted, setIsMuted]                 = useState(false);
  const [isFullscreen, setIsFullscreen]       = useState(false);
  const [progress, setProgress]               = useState(0);
  const [currentTime, setCurrentTime]         = useState(0);
  const [duration, setDuration]               = useState(0);

  const videoRef     = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const categories = ['Semua', 'Dokumentasi', 'Kegiatan Sekolah', 'Seni & Budaya'];

  /* reset semua state video ketika proyek berubah */
  const openProject = useCallback((proj: Project) => {
    if (soundOn) synth.playShutter();
    setSelectedProject(proj);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setIsFullscreen(false);
    setIsMuted(false);
    onSelectProject(proj);
  }, [soundOn, onSelectProject]);

  const closeProject = useCallback(() => {
    if (soundOn) synth.playFocusBeep();
    videoRef.current?.pause();
    setSelectedProject(null);
    setIsPlaying(false);
    setIsFullscreen(false);
  }, [soundOn]);

  /* play / pause */
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) { v.pause(); setIsPlaying(false); }
    else { v.play().catch(() => setIsPlaying(false)); setIsPlaying(true); }
  };

  /* mute */
  const toggleMute = () => {
    if (videoRef.current) videoRef.current.muted = !isMuted;
    setIsMuted(p => !p);
  };

  /* fullscreen toggle — native API */
  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  /* lock body scroll saat modal terbuka */
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  /* listen for native fullscreen exit (Esc key) */
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  /* Esc key closes modal */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !document.fullscreenElement) closeProject(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeProject]);

  /* progress bar */
  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setCurrentTime(v.currentTime);
    setProgress((v.currentTime / v.duration) * 100);
  };
  const onLoaded = () => { if (videoRef.current) setDuration(videoRef.current.duration); };
  const onEnded  = () => setIsPlaying(false);

  const scrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(Math.max((e.clientX - left) / width, 0), 1);
    v.currentTime = pct * v.duration;
    setProgress(pct * 100);
  };

  const fmt = (t: number) => {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = String(Math.floor(t % 60)).padStart(2, '0');
    return `${m}:${s}`;
  };

  const showFeatured     = activeCategory === 'Semua';
  const featuredProject  = PORTFOLIO_PROJECTS[0];
  const filteredProjects = activeCategory === 'Semua'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter(p => p.category === activeCategory);

  return (
    <div className="w-full flex flex-col gap-10">

      {/* ── FEATURED HERO ── */}
      {showFeatured && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl cursor-pointer group"
          onClick={() => openProject(featuredProject)}
        >
          <video src={featuredProject.videoSrc} autoPlay muted loop playsInline
            className="w-full aspect-video object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute top-5 left-5  w-5 h-5 border-t-2 border-l-2 border-white/60" />
          <div className="absolute top-5 right-5 w-5 h-5 border-t-2 border-r-2 border-white/60" />
          <div className="absolute bottom-20 left-5  w-5 h-5 border-b-2 border-l-2 border-white/60" />
          <div className="absolute bottom-20 right-5 w-5 h-5 border-b-2 border-r-2 border-white/60" />
          <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white text-black text-[10px] font-mono font-bold px-3 py-1 rounded-full tracking-widest uppercase">
            <Star size={10} className="fill-black" /> KARYA UTAMA
          </div>
          <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col gap-2">
            <span className={`self-start text-[9px] font-mono px-2.5 py-1 rounded border ${CATEGORY_COLORS[featuredProject.category]}`}>
              {featuredProject.category.toUpperCase()}
            </span>
            <h2 className="font-black text-xl md:text-2xl uppercase tracking-tight text-white leading-tight">
              {featuredProject.title}
            </h2>
            <p className="text-zinc-300 text-xs max-w-xl leading-relaxed line-clamp-2 font-sans">{featuredProject.description}</p>
            <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-zinc-400">
              <span className="flex items-center gap-1"><Calendar size={10} />{featuredProject.year}</span>
              <span>·</span><span>{featuredProject.client}</span>
              <span>·</span><span>{featuredProject.aspectRatio}</span>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center">
              <Play size={22} className="text-white fill-white ml-1" />
            </div>
          </div>
        </motion.div>
      )}

      {/* ── TABS ── */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-900 pb-4">
        {categories.map(cat => (
          <button key={cat}
            onClick={() => { if (soundOn) synth.playTick(); setActiveCategory(cat); }}
            className={`px-4 py-2 text-xs font-mono tracking-widest uppercase transition-all rounded-md ${
              activeCategory === cat
                ? 'bg-white text-black font-bold'
                : 'bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-900'
            }`}>
            {cat === 'Semua' ? 'SEMUA KARYA' : cat}
          </button>
        ))}
      </div>

      {/* ── GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(showFeatured ? PORTFOLIO_PROJECTS.slice(1) : filteredProjects).map((proj, idx) => (
          <motion.div key={proj.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`flex flex-col group cursor-pointer rounded-xl overflow-hidden border border-zinc-900 hover:border-zinc-500 transition-colors shadow-lg bg-zinc-950`}
            onClick={() => openProject(proj)}
          >
            <div className="relative overflow-hidden aspect-video w-full bg-black">
              <VideoCard src={proj.videoSrc}
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
              <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className={`absolute top-3 left-3 text-[8px] font-mono px-2 py-0.5 rounded border ${CATEGORY_COLORS[proj.category]}`}>
                {proj.category.toUpperCase()}
              </span>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-11 h-11 rounded-full bg-black/60 border border-white/30 flex items-center justify-center">
                  <Play size={14} className="text-white fill-white ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/80 text-[8px] font-mono px-1.5 py-0.5 rounded text-zinc-400">
                {proj.duration}
              </span>
            </div>
            <div className="p-4 flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
                <span>{proj.client}</span>
                <span className="flex items-center gap-1"><Calendar size={9} />{proj.year}</span>
              </div>
              <h3 className="font-bold text-sm tracking-tight text-white uppercase leading-snug">{proj.title}</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2 font-sans mt-0.5">{proj.description}</p>
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-600 mt-1">
                <Film size={10} /><span>{proj.role}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── MODAL via Portal — render langsung ke document.body ── */}
      {createPortal(
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 99999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '12px',
                background: 'rgba(0,0,0,0.96)',
                backdropFilter: 'blur(8px)',
              }}
              onClick={closeProject}
            >
              <motion.div
                initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
                transition={{ type: 'spring', damping: 24, stiffness: 260 }}
                style={{
                  width: '100%', maxWidth: '900px',
                  height: 'min(88vh, 660px)',
                  display: 'flex', flexDirection: 'row',
                  background: '#09090b',
                  border: '1px solid #27272a',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
                  color: 'white',
                }}
                onClick={e => e.stopPropagation()}
              >

              {/* ── LEFT: video + story ── */}
              <div className="flex flex-col gap-4 border-r border-zinc-900 overflow-y-auto min-h-0"
                style={{ width: '58%', flexShrink: 0 }}>

                {/* top bar */}
                <div className="flex justify-between items-center px-5 pt-5">
                  <span className={`text-[9px] font-mono px-2.5 py-1 rounded border ${CATEGORY_COLORS[selectedProject.category]}`}>
                    {selectedProject.category.toUpperCase()}
                  </span>
                  <button onClick={closeProject}
                    className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>

                {/* VIDEO PLAYER */}
                <div ref={containerRef}
                  className="relative w-full bg-black overflow-hidden"
                  style={{ aspectRatio: '16/9' }}
                >
                  <video
                    key={selectedProject.id}          /* key penting: paksa re-mount tiap proyek baru */
                    ref={videoRef}
                    src={selectedProject.videoSrc}
                    muted={isMuted}
                    playsInline
                    onTimeUpdate={onTimeUpdate}
                    onLoadedMetadata={onLoaded}
                    onEnded={onEnded}
                    className="w-full h-full object-contain bg-black"
                  />

                  {/* Viewfinder corners */}
                  <div className="absolute top-3 left-3  w-4 h-4 border-t border-l border-white/30 pointer-events-none" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/30 pointer-events-none" />
                  <div className="absolute bottom-10 left-3  w-4 h-4 border-b border-l border-white/30 pointer-events-none" />
                  <div className="absolute bottom-10 right-3 w-4 h-4 border-b border-r border-white/30 pointer-events-none" />

                  {/* Big play overlay when paused */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                      onClick={togglePlay}>
                      <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
                        className="w-16 h-16 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center shadow-xl">
                        <Play size={24} className="text-white fill-white ml-1" />
                      </motion.div>
                    </div>
                  )}

                  {/* Control bar */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 pb-3 pt-6 flex flex-col gap-2">
                    {/* Progress scrubber */}
                    <div className="w-full h-1.5 bg-zinc-700/60 rounded-full cursor-pointer group/bar" onClick={scrub}>
                      <div className="h-full bg-white rounded-full transition-all duration-100 relative"
                        style={{ width: `${progress}%` }}>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    {/* Buttons row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button onClick={togglePlay}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                        <button onClick={toggleMute}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </button>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {fmt(currentTime)} / {fmt(duration)}
                        </span>
                      </div>
                      {/* Fullscreen button */}
                      <button onClick={toggleFullscreen}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        title="Perbesar video">
                        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Color Palette */}
                <div className="flex flex-col gap-2 px-5">
                  <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">TONE PALETTE</span>
                  <div className="flex gap-1.5 h-7 rounded-lg overflow-hidden border border-zinc-800 p-1 bg-black">
                    {selectedProject.colorPalette.map((c, i) => (
                      <div key={i} className="flex-1 h-full rounded" style={{ backgroundColor: c }} title={c} />
                    ))}
                  </div>
                </div>

                {/* Story / Proses Kreatif */}
                <div className="flex flex-col gap-3 border-t border-zinc-900 px-5 pb-6 pt-4">
                  <h4 className="font-bold text-xs tracking-widest uppercase text-zinc-300 flex items-center gap-2">
                    <Compass size={13} className="text-zinc-500" /> PROSES KREATIF
                  </h4>
                  <p className="text-[12px] text-zinc-300 leading-relaxed font-sans">
                    {selectedProject.story}
                  </p>
                </div>
              </div>

              {/* ── RIGHT: specs ── */}
              <div className="flex flex-col gap-4 overflow-y-auto min-h-0 p-5"
                style={{ width: '42%', background: 'rgba(9,9,11,0.7)' }}>

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">JUDUL PROYEK</span>
                  <h2 className="font-bold text-base md:text-lg tracking-tight leading-snug uppercase text-white border-b border-zinc-900 pb-3 mt-1">
                    {selectedProject.title}
                  </h2>
                </div>

                <div className="flex flex-col gap-3 font-mono text-xs">
                  {[
                    { label: 'CLIENT / ACARA', val: selectedProject.client },
                    { label: 'PERAN',           val: selectedProject.role },
                    { label: 'KAMERA',          val: selectedProject.camera },
                    { label: 'LENSA',           val: selectedProject.lens },
                    { label: 'FORMAT',          val: selectedProject.aspectRatio },
                    { label: 'DURASI',          val: selectedProject.duration },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between items-start border-b border-zinc-900/60 pb-2.5 gap-4">
                      <span className="text-zinc-500 shrink-0">{label}</span>
                      <span className="text-white font-bold text-right text-[11px]">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Deskripsi singkat */}
                <div className="border border-zinc-900 rounded-xl p-4 bg-zinc-950/60">
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-zinc-900">
                  <button
                    onClick={() => {
                      closeProject();
                      setTimeout(() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }), 200);
                    }}
                    className="w-full bg-white hover:bg-zinc-200 text-black py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                  >
                    <span>Ajukan Proyek Serupa</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </div>
  );
}
