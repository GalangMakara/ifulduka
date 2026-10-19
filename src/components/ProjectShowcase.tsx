import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Play, Pause, Film, Calendar, Compass, X,
  ChevronRight, Star, Volume2, VolumeX, Maximize2, Minimize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { synth } from '../utils/audio';

/* ─── HELPER: ekstrak YouTube ID ─────────────────────────── */
function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

/* ─── HELPERS ───────────────────────────────────────────── */
const CATEGORY_COLORS: Record<string, string> = {
  'Dokumentasi':      'bg-amber-950 text-amber-300 border-amber-800',
  'Kegiatan Sekolah': 'bg-emerald-950 text-emerald-300 border-emerald-800',
  'Seni & Budaya':    'bg-purple-950 text-purple-300 border-purple-800',
};

function VideoCard({ src, className }: { src: string; className?: string }) {
  const youtubeId = getYouTubeId(src);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (youtubeId) return;
    const v = ref.current;
    if (!v) return;
    const seek = () => { v.currentTime = 1; };
    v.addEventListener('loadeddata', seek, { once: true });
    return () => v.removeEventListener('loadeddata', seek);
  }, [src, youtubeId]);

  if (youtubeId) {
    return (
      <img
        src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
        alt="Video thumbnail"
        className={className}
      />
    );
  }

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
  const [projects, setProjects]               = useState<Project[]>([]);
  const [loading, setLoading]                 = useState(true);
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

  /* ── Fetch data dari projects.json ── */
  useEffect(() => {
    fetch('/projects.json')
      .then(res => res.json())
      .then((data: Project[]) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) { v.pause(); setIsPlaying(false); }
    else { v.play().catch(() => setIsPlaying(false)); setIsPlaying(true); }
  };

  const toggleMute = () => {
    if (videoRef.current) videoRef.current.muted = !isMuted;
    setIsMuted(p => !p);
  };

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
    document.body.style.overflow = selectedProject ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  useEffect(() => {
    const onFsChange = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !document.fullscreenElement) closeProject(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeProject]);

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
  const featuredProject  = projects[0];
  const filteredProjects = activeCategory === 'Semua'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Memuat Proyek...</span>
        </div>
      </div>
    );
  }

  if (!featuredProject) return null;

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-10">

      {/* ── FEATURED HERO ── */}
      {showFeatured && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl cursor-pointer group"
          onClick={() => openProject(featuredProject)}
        >
          <video src={featuredProject.videoSrc} autoPlay muted loop playsInline
            className="w-full aspect-video object-cover transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-l-2 border-white/60" />
          <div className="absolute top-3 right-3 sm:top-5 sm:right-5 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-r-2 border-white/60" />
          <div className="absolute top-3 sm:top-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white text-black text-[9px] sm:text-[10px] font-mono font-bold px-2.5 sm:px-3 py-1 rounded-full tracking-widest uppercase whitespace-nowrap">
            <Star size={9} className="fill-black" /> KARYA UTAMA
          </div>
          <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 flex flex-col gap-1.5 sm:gap-2">
            <span className={`self-start text-[8px] sm:text-[9px] font-mono px-2 py-0.5 rounded border ${CATEGORY_COLORS[featuredProject.category]}`}>
              {featuredProject.category.toUpperCase()}
            </span>
            <h2 className="font-black text-base sm:text-xl md:text-2xl uppercase tracking-tight text-white leading-tight line-clamp-2">
              {featuredProject.title}
            </h2>
            <p className="hidden sm:block text-zinc-300 text-[11px] sm:text-xs max-w-xl leading-relaxed line-clamp-2 font-sans">
              {featuredProject.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5 text-[9px] sm:text-[10px] font-mono text-zinc-400">
              <span className="flex items-center gap-1"><Calendar size={9} />{featuredProject.year}</span>
              <span className="text-zinc-600">·</span>
              <span className="truncate max-w-[120px] sm:max-w-none">{featuredProject.client}</span>
              <span className="text-zinc-600 hidden sm:inline">·</span>
              <span className="hidden sm:inline">{featuredProject.aspectRatio}</span>
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
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 sm:gap-2 border-b border-zinc-900 pb-3 sm:pb-4">
        {categories.map(cat => (
          <button key={cat}
            onClick={() => { if (soundOn) synth.playTick(); setActiveCategory(cat); }}
            className={`px-2 sm:px-4 py-1.5 sm:py-2 text-[9px] sm:text-xs font-mono tracking-wider sm:tracking-widest uppercase transition-all rounded-md text-center truncate ${
              activeCategory === cat
                ? 'bg-white text-black font-bold'
                : 'bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-900'
            }`}>
            {cat === 'Semua' ? 'SEMUA' : cat}
          </button>
        ))}
      </div>

      {/* ── GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {(showFeatured ? projects.slice(1) : filteredProjects).map((proj, idx) => (
          <motion.div key={proj.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="flex flex-col group cursor-pointer rounded-xl overflow-hidden border border-zinc-900 hover:border-zinc-500 transition-colors shadow-lg bg-zinc-950"
            onClick={() => openProject(proj)}
          >
            <div className="relative overflow-hidden aspect-video w-full bg-black">
              <VideoCard src={proj.videoSrc} className="w-full h-full object-cover transition-all duration-500" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
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
            <div className="p-3 sm:p-4 flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
                <span className="truncate max-w-[120px] sm:max-w-none">{proj.client}</span>
                <span className="flex items-center gap-1 shrink-0 ml-2"><Calendar size={9} />{proj.year}</span>
              </div>
              <h3 className="font-bold text-[11px] sm:text-sm tracking-tight text-white uppercase leading-snug line-clamp-2">{proj.title}</h3>
              <p className="text-[10px] text-zinc-400 leading-relaxed line-clamp-2 font-sans mt-0.5">{proj.description}</p>
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-600 mt-1">
                <Film size={9} /><span className="truncate">{proj.role}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── MODAL via Portal ── */}
      {createPortal(
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', background: 'rgba(0,0,0,0.96)', backdropFilter: 'blur(8px)' }}
              onClick={closeProject}
            >
              <motion.div
                initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
                transition={{ type: 'spring', damping: 24, stiffness: 260 }}
                onClick={e => e.stopPropagation()}
                className="flex flex-col sm:flex-row w-full bg-[#09090b] border border-zinc-800 rounded-[14px] overflow-hidden shadow-2xl text-white"
                style={{ maxWidth: '900px', maxHeight: '94vh' }}
              >
                {/* ── LEFT: video + story ── */}
                <div className="flex flex-col gap-3 w-full sm:w-[520px] shrink-0 sm:border-r sm:border-zinc-900 overflow-y-auto">

                  <div className="flex justify-between items-center px-4 pt-4">
                    <span className={`text-[8px] sm:text-[9px] font-mono px-2 py-1 rounded border ${CATEGORY_COLORS[selectedProject.category]}`}>
                      {selectedProject.category.toUpperCase()}
                    </span>
                    <button onClick={closeProject}
                      className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
                      <X size={13} />
                    </button>
                  </div>

                  {/* VIDEO PLAYER */}
                  <div ref={containerRef} className="relative w-full bg-black overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    {getYouTubeId(selectedProject.videoSrc) ? (
                      <iframe
                        key={selectedProject.id}
                        src={`https://www.youtube.com/embed/${getYouTubeId(selectedProject.videoSrc)}?rel=0&modestbranding=1`}
                        title={selectedProject.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <>
                        <video key={selectedProject.id} ref={videoRef} src={selectedProject.videoSrc}
                          muted={isMuted} playsInline onTimeUpdate={onTimeUpdate} onLoadedMetadata={onLoaded} onEnded={onEnded}
                          className="w-full h-full object-contain bg-black" />
                        {!isPlaying && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer" onClick={togglePlay}>
                            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
                              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center shadow-xl">
                              <Play size={18} className="text-white fill-white ml-1" />
                            </motion.div>
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-3 pb-2 pt-5 flex flex-col gap-1.5">
                          <div className="w-full h-1 bg-zinc-700/60 rounded-full cursor-pointer group/bar" onClick={scrub}>
                            <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button onClick={togglePlay} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                              </button>
                              <button onClick={toggleMute} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                                {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                              </button>
                              <span className="text-[9px] font-mono text-zinc-400">{fmt(currentTime)} / {fmt(duration)}</span>
                            </div>
                            <button onClick={toggleFullscreen} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                              {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Tone Palette */}
                  <div className="flex flex-col gap-1.5 px-4">
                    <span className="text-[8px] font-mono tracking-widest text-zinc-500 uppercase">TONE PALETTE</span>
                    <div className="flex gap-1 h-5 sm:h-7 rounded-lg overflow-hidden border border-zinc-800 p-1 bg-black">
                      {selectedProject.colorPalette.map((c, i) => (
                        <div key={i} className="flex-1 h-full rounded" style={{ backgroundColor: c }} title={c} />
                      ))}
                    </div>
                  </div>

                  {/* Proses Kreatif — desktop only */}
                  <div className="hidden sm:flex flex-col gap-2 border-t border-zinc-900 px-4 pb-5 pt-3">
                    <h4 className="font-bold text-xs tracking-widest uppercase text-zinc-300 flex items-center gap-2">
                      <Compass size={12} className="text-zinc-500" /> PROSES KREATIF
                    </h4>
                    <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">{selectedProject.story}</p>
                  </div>
                </div>

                {/* ── RIGHT: specs ── */}
                <div className="flex flex-col gap-3 overflow-y-auto p-4 bg-zinc-950/70 flex-1 min-h-0">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">JUDUL PROYEK</span>
                    <h2 className="font-bold text-sm sm:text-base leading-snug uppercase text-white border-b border-zinc-900 pb-2 mt-0.5">
                      {selectedProject.title}
                    </h2>
                  </div>

                  <div className="flex flex-col gap-2 font-mono text-[11px]">
                    {[
                      { label: 'CLIENT',  val: selectedProject.client },
                      { label: 'PERAN',   val: selectedProject.role },
                      { label: 'KAMERA',  val: selectedProject.camera },
                      { label: 'LENSA',   val: selectedProject.lens },
                      { label: 'FORMAT',  val: selectedProject.aspectRatio },
                      { label: 'DURASI',  val: selectedProject.duration },
                    ].map(({ label, val }) => (
                      <div key={label} className="flex justify-between items-start border-b border-zinc-900/60 pb-2 gap-3">
                        <span className="text-zinc-500 shrink-0 text-[9px] sm:text-[10px]">{label}</span>
                        <span className="text-white font-bold text-right text-[10px] sm:text-[11px]">{val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border border-zinc-900 rounded-xl p-3 bg-zinc-950/60">
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-relaxed font-sans">{selectedProject.description}</p>
                  </div>

                  {/* Proses Kreatif — mobile only */}
                  <div className="sm:hidden flex flex-col gap-2 border-t border-zinc-900 pt-3">
                    <h4 className="font-bold text-[10px] tracking-widest uppercase text-zinc-300 flex items-center gap-1.5">
                      <Compass size={11} className="text-zinc-500" /> PROSES KREATIF
                    </h4>
                    <p className="text-[10px] text-zinc-300 leading-relaxed font-sans">{selectedProject.story}</p>
                  </div>

                  <div className="mt-auto pt-3 border-t border-zinc-900">
                    <button
                      onClick={() => {
                        closeProject();
                        setTimeout(() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }), 200);
                      }}
                      className="w-full bg-white hover:bg-zinc-200 text-black py-2.5 rounded-xl font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                    >
                      <span>Ajukan Proyek Serupa</span>
                      <ChevronRight size={12} />
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
