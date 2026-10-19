import React, { useState, useEffect, useRef } from 'react';
import '@google/model-viewer';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Film, 
  Camera, 
  Layers, 
  Compass, 
  Mail, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause,
  Maximize,
  Undo,
  ArrowRight,
  MonitorPlay,
  Github,
  Globe,
  Instagram,
  Clapperboard
} from 'lucide-react';

// Subcomponents
import CameraViewfinder from './components/CameraViewfinder';
import ProjectShowcase from './components/ProjectShowcase';
import InteractiveGrader from './components/InteractiveGrader';
import Storyboards from './components/Storyboards';
import CertificateShowcase from './components/CertificateShowcase';
import ClapperboardContact from './components/ClapperboardContact';
import ThreeDCard from './components/ThreeDCard';

// Synthesized Sound FX
import { synth } from './utils/audio';

// Generated cinematic assets as static URLs
const faceImg = '/src/assets/images/videographer_face_1784174656219.jpg';
const musicImg = '/src/assets/images/music_video_thumbnail_1784174671197.jpg';
const shortImg = '/src/assets/images/short_film_thumbnail_1784174682927.jpg';
const commImg = '/src/assets/images/commercial_thumbnail_1784174696915.jpg';

// Orbiting digital creation tools list for Saiful's branding
const BRANDING_TOOLS = [
  { name: 'Adobe Photoshop', short: 'Ps', color: 'text-blue-400 border-blue-500/20' },
  { name: 'Adobe Illustrator', short: 'Ai', color: 'text-amber-500 border-amber-500/20' },
  { name: 'Adobe Lightroom', short: 'Lr', color: 'text-sky-400 border-sky-500/20' },
  { name: 'CapCut', short: 'Cc', color: 'text-zinc-300 border-zinc-500/20' },
  { name: 'After Effects', short: 'Ae', color: 'text-indigo-400 border-indigo-500/20' }
];

// Multilingual Greetings for Saiful Duka
const INTRO_LANGUAGES = [
  {
    lang: "Indonesia",
    greeting: "HALO SAYA ADALAH SAIFUL DUKA",
    role: "SAYA SEORANG VIDIOGRAPHER DAN DESIGNER"
  },
  {
    lang: "English",
    greeting: "HELLO, I AM SAIFUL DUKA",
    role: "I AM A VIDEOGRAPHER & DESIGNER"
  },
  {
    lang: "Japanese",
    greeting: "こんにちは、サイフル・ドゥカです",
    role: "ビデオグラファー兼デザイナーです"
  },
  {
    lang: "French",
    greeting: "BONJOUR, JE SUIS SAIFUL DUKA",
    role: "JE SUIS VIDÉASTE ET DESIGNER"
  },
  {
    lang: "German",
    greeting: "HALLO, ICH BIN SAIFUL DUKA",
    role: "ICH BIN VIDEOGRAF UND DESIGNER"
  },
  {
    lang: "Spanish",
    greeting: "HOLA, SOY SAIFUL DUKA",
    role: "SOY VIDEÓGRAFO Y DISEÑADOR"
  }
];

function ToolLogo({ short }: { short: string }) {
  if (short === 'Ps') {
    return (
      <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-[#001c3a] border border-[#00c8ff]/50 flex items-center justify-center shadow-[0_4px_12px_rgba(0,200,255,0.2)] relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00c8ff]/15 to-transparent" />
        <span className="font-sans font-black text-sm md:text-base text-[#00c8ff] tracking-tight">Ps</span>
      </div>
    );
  }
  if (short === 'Ai') {
    return (
      <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-[#261300] border border-[#ff9a00]/50 flex items-center justify-center shadow-[0_4px_12px_rgba(255,154,0,0.2)] relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff9a00]/15 to-transparent" />
        <span className="font-sans font-black text-sm md:text-base text-[#ff9a00] tracking-tight">Ai</span>
      </div>
    );
  }
  if (short === 'Lr') {
    return (
      <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-[#00213d] border border-[#31a8ff]/50 flex items-center justify-center shadow-[0_4px_12px_rgba(49,168,255,0.2)] relative overflow-hidden select-none p-1.5">
        <img src="/lightroom.svg" alt="Lightroom" className="w-full h-full object-contain" />
      </div>
    );
  }
  if (short === 'Cc') {
    return (
      <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-zinc-950 border border-white/20 flex items-center justify-center shadow-lg relative overflow-hidden select-none p-1.5">
        <img src="/capcut.svg" alt="CapCut" className="w-full h-full object-contain" />
      </div>
    );
  }
  if (short === 'Ae') {
    return (
      <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-[#1a0033] border border-[#d400ff]/50 flex items-center justify-center shadow-[0_4px_12px_rgba(212,0,255,0.2)] relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d400ff]/15 to-transparent" />
        <span className="font-sans font-black text-sm md:text-base text-[#d400ff] tracking-tight">Ae</span>
      </div>
    );
  }
  return null;
}

export default function App() {
  const [zoomValue, setZoomValue] = useState<number>(1.0);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<'showcase' | 'grader' | 'sequencer' | 'contact'>('showcase');
  const [flashActive, setFlashActive] = useState<boolean>(false);

  // Multilingual Intro Animation states
  const [isIntroActive, setIsIntroActive] = useState<boolean>(true);
  const [introLangIndex, setIntroLangIndex] = useState<number>(0);
  const [introProgress, setIntroProgress] = useState<number>(0);
  
  // Interactive 3D Face Portrait tilt states
  const [tiltX, setTiltX] = useState<number>(0);
  const [tiltY, setTiltY] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // 3D Orbit angle for creative software tools
  const [orbitAngle, setOrbitAngle] = useState<number>(0);
  const [orbitRadius, setOrbitRadius] = useState({ x: 180, y: 35, z: 140 });

  // Handle responsive orbit dimensions to beautifully encircle the face
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOrbitRadius({ x: 300, y: 55, z: 240 });
      } else if (window.innerWidth >= 768) {
        setOrbitRadius({ x: 260, y: 48, z: 200 });
      } else if (window.innerWidth >= 640) {
        setOrbitRadius({ x: 220, y: 42, z: 170 });
      } else {
        setOrbitRadius({ x: 180, y: 35, z: 140 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Continuous loop for smooth 3D Orbiting
  useEffect(() => {
    let frameId: number;
    const speed = 28; // degrees per second
    let lastTime = performance.now();
    
    const update = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      setOrbitAngle(prev => (prev + speed * delta) % 360);
      frameId = requestAnimationFrame(update);
    };
    
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Multilingual Intro timer effects
  useEffect(() => {
    if (!isIntroActive) return;

    const intervalTime = 1600; // ms per language
    const totalDuration = INTRO_LANGUAGES.length * intervalTime;
    const updateFreq = 30; // update loading bar smooth factor

    const langInterval = setInterval(() => {
      setIntroLangIndex((prev) => {
        if (prev >= INTRO_LANGUAGES.length - 1) {
          clearInterval(langInterval);
          setTimeout(() => {
            setIsIntroActive(false);
            if (soundOn) {
              synth.playShutter();
            }
          }, 350);
          return prev;
        }
        if (soundOn) {
          synth.playTick();
        }
        return prev + 1;
      });
    }, intervalTime);

    const progressInterval = setInterval(() => {
      setIntroProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(prev + (100 / (totalDuration / updateFreq)), 100);
      });
    }, updateFreq);

    return () => {
      clearInterval(langInterval);
      clearInterval(progressInterval);
    };
  }, [isIntroActive, soundOn]);

  // Auto-sway camera shake animation when mouse is idle / not hovering
  useEffect(() => {
    if (isHovered) return;
    
    let frameId: number;
    const update = () => {
      const time = Date.now() * 0.0012; // slow organic frequency
      const xVal = Math.sin(time * 1.5) * 3.5 + Math.cos(time * 0.7) * 1.5;
      const yVal = Math.cos(time * 1.2) * 3.5 + Math.sin(time * 0.8) * 1.5;
      setTiltX(xVal);
      setTiltY(yVal);
      frameId = requestAnimationFrame(update);
    };
    
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isHovered]);

  const handleMouseMove3D = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // max 12deg tilt
    const rotY = ((x - centerX) / centerX) * 12;
    const rotX = -((y - centerY) / centerY) * 12;
    setTiltX(rotX);
    setTiltY(rotY);
  };

  const handleMouseLeave3D = () => {
    setIsHovered(false);
    setTiltX(0);
    setTiltY(0);
  };
  
  // Real Video Player States for the Hero Showreel
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [reelVolume, setReelVolume] = useState<boolean>(true);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Scroll to Zoom implementation for immersive viewfinder landing page
  useEffect(() => {
    if (isUnlocked) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoomValue((prev) => {
        // Scroll down (positive delta) zooms in, scroll up zooms out
        const delta = e.deltaY > 0 ? 0.08 : -0.08;
        const nextZoom = Math.min(Math.max(prev + delta, 1.0), 3.0);
        
        if (soundOn && Math.abs(nextZoom - prev) > 0.01 && Math.random() > 0.5) {
          synth.playTick();
        }
        return nextZoom;
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isUnlocked, soundOn]);

  // Sync play/pause state with real HTML5 video element
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => {
          console.log("Video playback failed/blocked:", err);
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync volume state with real HTML5 video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !reelVolume;
    }
  }, [reelVolume]);

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setVideoCurrentTime(videoRef.current.currentTime);
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress || 0);
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnded = () => {
    if (soundOn) synth.playShutter();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  const handleProgressBarScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && videoDuration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const scrubPercent = Math.min(Math.max(clickX / width, 0), 1);
      const newTime = scrubPercent * videoDuration;
      videoRef.current.currentTime = newTime;
      setVideoCurrentTime(newTime);
      setVideoProgress(scrubPercent * 100);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === Infinity) return "00:00";
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const triggerShutterFlash = () => {
    setFlashActive(true);
    if (soundOn) {
      synth.playShutter();
    }
    setTimeout(() => {
      setFlashActive(false);
    }, 450);
  };

  const handleEnterCore = () => {
    triggerShutterFlash();
    setIsUnlocked(true);
  };

  const handleReturnToViewfinder = () => {
    triggerShutterFlash();
    setZoomValue(1.0);
    setIsUnlocked(false);
  };

  const handleTogglePlayReel = () => {
    if (soundOn) {
      synth.playFocusBeep();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReelVolumeToggle = () => {
    if (soundOn) {
      synth.playTick();
    }
    setReelVolume(!reelVolume);
  };

  // Math and lists for 3D Orbiting creation tools wrapping around the face
  const toolsWithPositions = BRANDING_TOOLS.map((tool, index) => {
    const toolAngle = (orbitAngle + (index * 360) / BRANDING_TOOLS.length) % 360;
    const rad = (toolAngle * Math.PI) / 180;
    
    // Orbit around Y-axis with a tilted plane (radiusX, radiusY, radiusZ)
    const x = Math.sin(rad) * orbitRadius.x;
    const z = Math.cos(rad) * orbitRadius.z;
    const y = Math.cos(rad) * orbitRadius.y;
    
    // Normalized Z for depth-scaling and opacity (Z ranges from -radiusZ to +radiusZ)
    const normZ = (z + orbitRadius.z) / (2 * orbitRadius.z); // 0 to 1
    
    const scale = 0.75 + normZ * 0.35; // 0.75 to 1.10
    const opacity = 0.3 + normZ * 0.7;  // 0.3 to 1.0
    const isBehind = z < 0;
    
    return {
      tool,
      x,
      y,
      scale,
      opacity,
      isBehind
    };
  });

  const behindTools = toolsWithPositions.filter(t => t.isBehind);
  const frontTools = toolsWithPositions.filter(t => !t.isBehind);

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col selection:bg-white selection:text-black md:border-[12px] border-zinc-900">
      {/* 1. Global Film Grain texture */}
      <div className="film-grain" />

      {/* 1a. Multilingual Intro Screen Overlay */}
      <AnimatePresence>
        {isIntroActive && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 bg-black z-[99999] flex flex-col justify-between p-8 overflow-hidden select-none"
          >
            {/* Cinematic crop lines for cinematic aspect ratio inside loading screen */}
            <div className="absolute top-0 inset-x-0 h-[10vh] bg-zinc-950/80 border-b border-zinc-900 flex items-center px-8 justify-between font-mono text-[9px] text-zinc-500 tracking-wider">
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" /> SYSTEM BOOT SEQUENCE</span>
              <span>LENS ASPECT: 2.39:1 CINEMASCOPE</span>
            </div>
            
            <div className="absolute bottom-0 inset-x-0 h-[10vh] bg-zinc-950/80 border-t border-zinc-900 flex items-center px-8 justify-between font-mono text-[9px] text-zinc-500 tracking-wider">
              <span>PROJECTION: ON / AUDIO SYNC ACTIVE</span>
              <span>EST. RENDER: 100% READY</span>
            </div>

            {/* Vintage CRT scanlines & Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] z-10" />
            <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />

            {/* Main Typographic Greeting Sequence */}
            <div className="flex-1 flex flex-col items-center justify-center text-center z-20 px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={introLangIndex}
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="flex flex-col gap-4 max-w-4xl"
                >
                  <span className="text-[10px] md:text-xs font-mono text-zinc-500 tracking-[0.4em] uppercase font-bold">
                    {INTRO_LANGUAGES[introLangIndex].lang}
                  </span>
                  <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight uppercase text-white font-display leading-tight">
                    "{INTRO_LANGUAGES[introLangIndex].greeting}"
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base font-mono text-zinc-400 tracking-wider uppercase mt-2 max-w-2xl mx-auto leading-relaxed">
                    {INTRO_LANGUAGES[introLangIndex].role}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Loading Meter and Skip Button */}
            <div className="w-full max-w-xl mx-auto flex flex-col gap-4 items-center z-20 mb-[12vh]">
              {/* Progress bar */}
              <div className="w-full flex justify-between items-center text-[10px] font-mono text-zinc-500 px-1">
                <span className="flex items-center gap-1.5 animate-pulse">
                  <span className="w-1 h-1 bg-white rounded-full" /> 
                  MENYIAPKAN PENGALAMAN 3D
                </span>
                <span>{Math.round(introProgress)}%</span>
              </div>
              <div className="w-full h-1 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white animate-pulse"
                  style={{ width: `${introProgress}%` }}
                />
              </div>

              {/* Direct Enter/Skip CTA */}
              <button
                onClick={() => {
                  setIsIntroActive(false);
                  if (soundOn) {
                    synth.playShutter();
                  }
                }}
                className="mt-2 px-6 py-2.5 bg-white text-black border border-white hover:bg-black hover:text-white rounded-xl font-bold font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.35)] cursor-pointer"
              >
                LEWATI INTRO / MASUK PORTO
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1b. Global Radial Vignette Overlay for Elegant Dark lens feel */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)] z-10" />

      {/* 2. Transition Flash Overlays (Camera Shutter simulation) */}
      <AnimatePresence>
        {flashActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, times: [0, 0.2, 0.8, 1] }}
            className="fixed inset-0 bg-white z-[9999] pointer-events-none mix-blend-difference"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          
          /* VIEW_ONE: VIEW_ONE: Immersive Camera Viewfinder and Face Zoom Landing */
          <motion.div
            key="viewfinder-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black"
          >
            {/* Elegant Dark Viewfinder Corners */}
            <div className="viewfinder-corner tl hidden md:block"></div>
            <div className="viewfinder-corner tr hidden md:block"></div>
            <div className="viewfinder-corner bl hidden md:block"></div>
            <div className="viewfinder-corner br hidden md:block"></div>

            {/* Elegant Dark Vertical Metadata Markers */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 vertical-text font-mono text-[9px] uppercase tracking-[0.5em] opacity-35 select-none pointer-events-none hidden lg:block">
              ISO 800 / 24FPS / 1.8f &bull; RAW 16-BIT
            </div>
            <div className="absolute right-10 top-1/2 -translate-y-1/2 vertical-text font-mono text-[9px] uppercase tracking-[0.5em] opacity-35 select-none pointer-events-none hidden lg:block">
              SYSTEM STANDBY &bull; REC READY
            </div>

            {/* Cinematic Background Lines / Focal rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] border border-white rounded-full"></div>
              <div className="w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] border border-white rounded-full absolute"></div>
            </div>

            {/* THE ZOOMABLE FACE PORTRAIT CONTAINER */}
            <div 
              className="relative w-[90vw] h-[90vw] sm:w-[75vh] sm:h-[75vh] max-w-[600px] max-h-[600px] flex items-center justify-center z-20"
              style={{
                perspective: '1000px',
                transform: `scale(${1 + (zoomValue - 1) * 0.15})`,
              }}
            >
              {/* 1. BEHIND TOOLS (Rendered behind the face, z-index 10) */}
              <div className="absolute inset-0 pointer-events-none z-10 font-mono">
                {behindTools.map(({ tool, x, y, scale, opacity }) => (
                  <div
                    key={tool.name}
                    className="absolute left-1/2 top-1/2 pointer-events-auto"
                    style={{
                      transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0px) scale(${scale * 1.5})`,
                      opacity: opacity * 0.95,
                      filter: `blur(${Math.max(0, (1 - opacity) * 2.5)}px)`,
                    }}
                  >
                    <div className="group cursor-pointer hover:scale-110 transition-all duration-200 relative">
                      <ToolLogo short={tool.short} />
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-950 border border-zinc-800 text-[8px] uppercase tracking-widest px-2 py-0.5 rounded whitespace-nowrap z-50 text-white pointer-events-none shadow-xl">
                        {tool.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. 3D TILTABLE CONTAINER (Z-INDEX 20) */}
              <motion.div 
                className="relative w-full h-full cursor-grab active:cursor-grabbing z-20 overflow-visible"
                style={{
                  rotateX: tiltX,
                  rotateY: tiltY,
                  transformStyle: 'preserve-3d',
                }}
                onMouseMove={handleMouseMove3D}
                onMouseLeave={handleMouseLeave3D}
              >
                <ThreeDCard imageSrc="/idcards.png" />
              </motion.div>

              {/* 3. FRONT TOOLS (Rendered in front of the face, z-index 30) */}
              <div className="absolute inset-0 pointer-events-none z-30 font-mono">
                {frontTools.map(({ tool, x, y, scale, opacity }) => (
                  <div
                    key={tool.name}
                    className="absolute left-1/2 top-1/2 pointer-events-auto"
                    style={{
                      transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0px) scale(${scale * 1.6})`,
                      opacity: opacity,
                    }}
                  >
                    <div className="group cursor-pointer hover:scale-115 transition-all duration-200 relative shadow-[0_12px_24px_rgba(0,0,0,0.6)]">
                      <ToolLogo short={tool.short} />
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-950 border border-zinc-800 text-[8px] uppercase tracking-widest px-2 py-0.5 rounded whitespace-nowrap z-50 text-white pointer-events-none shadow-xl">
                        {tool.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CAMERA HUD LAYER */}
            <CameraViewfinder
              zoomValue={zoomValue}
              setZoomValue={setZoomValue}
              onEnterCore={handleEnterCore}
              soundOn={soundOn}
              setSoundOn={setSoundOn}
            />

            {/* Instruction Overlay — tetap di atas, di bawah border viewfinder */}
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-center pointer-events-none z-30 font-mono">
              <div className="bg-black/60 backdrop-blur-sm px-4 py-1.5 rounded-lg border border-white/10 flex flex-col items-center gap-0.5">
                <span className="text-[11px] font-bold tracking-[0.2em] text-white uppercase font-display">
                  SAIFUL DUKA
                </span>
                <span className="text-[8px] tracking-[0.15em] text-zinc-400 uppercase">
                  VIDEOGRAPHER & DESIGNER
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          
          /* VIEW_TWO: Core Portfolio Site */
          <motion.div
            key="portfolio-site"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col font-sans"
          >
            {/* PORTFOLIO NAVIGATION HEADER */}
            <header className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-zinc-900 z-40 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {/* Simulated clapper icon */}
                <div 
                  onClick={handleReturnToViewfinder} 
                  className="w-8 h-8 rounded border border-zinc-800 flex items-center justify-center cursor-pointer hover:border-white transition-colors text-zinc-400 hover:text-white"
                  title="Kembali ke Viewfinder Zoom"
                >
                  <Undo size={14} />
                </div>
                <div>
                  <h1 className="font-bold text-xs tracking-widest uppercase font-display">SAIFUL DUKA</h1>
                  <p className="text-[8px] font-mono text-zinc-500 tracking-wider">VIDEOGRAPHY & DESIGN</p>
                </div>
              </div>

              {/* Section Tabs */}
              <nav className="hidden md:flex gap-1.5 text-xs font-mono">
                <button
                  onClick={() => {
                    if (soundOn) synth.playTick();
                    setActiveSection('showcase');
                    window.scrollTo(0, 0);
                  }}
                  className={`px-4 py-2 rounded-md transition-all uppercase tracking-wider ${
                    activeSection === 'showcase' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Showcase
                </button>
                <button
                  onClick={() => {
                    if (soundOn) synth.playTick();
                    setActiveSection('grader');
                    window.scrollTo(0, 0);
                  }}
                  className={`px-4 py-2 rounded-md transition-all uppercase tracking-wider ${
                    activeSection === 'grader' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Grading Lab
                </button>
                <button
                  onClick={() => {
                    if (soundOn) synth.playTick();
                    setActiveSection('sequencer');
                    window.scrollTo(0, 0);
                  }}
                  className={`px-4 py-2 rounded-md transition-all uppercase tracking-wider ${
                    activeSection === 'sequencer' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Sertifikat
                </button>
                <button
                  onClick={() => {
                    if (soundOn) synth.playTick();
                    setActiveSection('contact');
                    window.scrollTo(0, 0);
                  }}
                  className={`px-4 py-2 rounded-md transition-all uppercase tracking-wider ${
                    activeSection === 'contact' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Brief Slate
                </button>
              </nav>

              {/* Sound/Header CTA settings */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const next = !soundOn;
                    setSoundOn(next);
                    synth.enabled = next;
                    if (next) synth.playFocusBeep();
                  }}
                  className="p-2 border border-zinc-800 hover:border-zinc-500 rounded text-zinc-400 hover:text-white transition-colors"
                  title={soundOn ? "Mute SFX" : "Unmute SFX"}
                >
                  {soundOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
                </button>

                <button
                  onClick={handleReturnToViewfinder}
                  className="hidden sm:flex items-center gap-2 border border-white/20 hover:border-white px-4 py-2 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-all hover:bg-white/5 cursor-pointer"
                >
                  <Camera size={12} />
                  <span>Lock Lens (Zoom Out)</span>
                </button>
              </div>
            </header>

            {/* MOBILE BOTTOM NAV STRIP */}
            <div className="md:hidden fixed bottom-0 inset-x-0 bg-black/95 backdrop-blur border-t border-zinc-900 z-40 p-2 flex justify-around">
              <button
                onClick={() => {
                  if (soundOn) synth.playTick();
                  setActiveSection('showcase');
                  window.scrollTo(0, 0);
                }}
                className={`flex flex-col items-center gap-1 p-2 grow rounded text-[10px] font-mono tracking-tight ${
                  activeSection === 'showcase' ? 'text-white font-bold' : 'text-zinc-500'
                }`}
              >
                <Film size={14} />
                <span>Showcase</span>
              </button>
              <button
                onClick={() => {
                  if (soundOn) synth.playTick();
                  setActiveSection('grader');
                  window.scrollTo(0, 0);
                }}
                className={`flex flex-col items-center gap-1 p-2 grow rounded text-[10px] font-mono tracking-tight ${
                  activeSection === 'grader' ? 'text-white font-bold' : 'text-zinc-500'
                }`}
              >
                <Layers size={14} />
                <span>Grading</span>
              </button>
              <button
                onClick={() => {
                  if (soundOn) synth.playTick();
                  setActiveSection('sequencer');
                  window.scrollTo(0, 0);
                }}
                className={`flex flex-col items-center gap-1 p-2 grow rounded text-[10px] font-mono tracking-tight ${
                  activeSection === 'sequencer' ? 'text-white font-bold' : 'text-zinc-500'
                }`}
              >
                <Compass size={14} />
                <span>Sertifikat</span>
              </button>
              <button
                onClick={() => {
                  if (soundOn) synth.playTick();
                  setActiveSection('contact');
                  window.scrollTo(0, 0);
                }}
                className={`flex flex-col items-center gap-1 p-2 grow rounded text-[10px] font-mono tracking-tight ${
                  activeSection === 'contact' ? 'text-white font-bold' : 'text-zinc-500'
                }`}
              >
                <Mail size={14} />
                <span>Slate</span>
              </button>
            </div>

            {/* MAIN PORTFOLIO CORE VIEWER */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-12 flex flex-col gap-8 md:gap-12 pb-24 md:pb-16">
              
              {/* SECTION HEADER BLOCK */}
              <div className="flex flex-col gap-4 border-b border-zinc-900 pb-6 md:pb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                  <div className="flex flex-col gap-2 max-w-xl">
                    <span className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase">
                      DKV ARCHIVE &bull; PORTFOLIO 2026
                    </span>
                    
                    {activeSection === 'showcase' && (
                      <>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight font-display text-white uppercase leading-tight">
                          Galeri Rekaman Sinematik
                        </h2>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                          Kumpulan karya visual videografi DKV — penyuntingan hitam-putih, kontras tinggi, dan penceritaan ritmik.
                        </p>
                      </>
                    )}

                    {activeSection === 'grader' && (
                      <>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight font-display text-white uppercase leading-tight">
                          Color Grading Lab
                        </h2>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                          Simulasi color grader pasca-produksi DKV. Atur kontras, exposure, grain, dan vignette secara langsung.
                        </p>
                      </>
                    )}

                    {activeSection === 'sequencer' && (
                      <>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight font-display text-white uppercase leading-tight">
                          Sertifikat & Penghargaan
                        </h2>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                          Rekam jejak prestasi di bidang Videografi dan DKV — dari kompetisi nasional hingga uji kompetensi akademik.
                        </p>
                      </>
                    )}

                    {activeSection === 'contact' && (
                      <>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight font-display text-white uppercase leading-tight">
                          Hollywood Brief Slate
                        </h2>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                          Ajukan ide videografi melalui clapperboard custom. Kunci frame dan kirim brief proyek sinematik Anda.
                        </p>
                      </>
                    )}
                  </div>

                  {/* Technical profile details — compact on mobile */}
                  <div className="flex gap-3 sm:gap-4 border border-zinc-900 p-3 sm:p-4 rounded-xl bg-zinc-950/40 shrink-0 font-mono text-[9px] sm:text-[10px] text-zinc-400 w-full sm:w-auto">
                    <div className="flex flex-col">
                      <span className="text-zinc-600">SEKOLAH</span>
                      <span className="text-white font-bold text-[9px] sm:text-[10px]">MAK NEGRI ENDE</span>
                    </div>
                    <div className="w-px bg-zinc-900 self-stretch"></div>
                    <div className="flex flex-col">
                      <span className="text-zinc-600">JURUSAN</span>
                      <span className="text-white font-bold">DKV</span>
                    </div>
                    <div className="w-px bg-zinc-900 self-stretch hidden sm:block"></div>
                    <div className="hidden sm:flex flex-col">
                      <span className="text-zinc-600">BIDANG</span>
                      <span className="text-white font-bold">DESAIN GRAFIS & VIDEOGRAFI</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CORE CONDITIONAL RENDER PANELS */}
              <div className="grow overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    {activeSection === 'showcase' && (
                  <div className="flex flex-col gap-12">
                    
                    {/* GIANT DYNAMIC CINEMATIC SHOWREEL PLAYER SIMULATION */}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                        <span className="flex items-center gap-1.5"><MonitorPlay size={11} /> FEATURED SHOWREEL 2026</span>
                        <span>ASPECT: 2.39:1 CINEMASCOPE</span>
                      </div>

                      <div className="relative aspect-[2.39/1] w-full bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
                        
                        {/* Real Widescreen Video Player */}
                        <video
                          ref={videoRef}
                          src="/AcaraPernikahan.mp4"
                          onClick={handleTogglePlayReel}
                          onTimeUpdate={handleVideoTimeUpdate}
                          onLoadedMetadata={handleVideoLoadedMetadata}
                          onEnded={handleVideoEnded}
                          playsInline
                          muted={!reelVolume}
                          className="w-full h-full object-cover cursor-pointer"
                        />

                        {/* Simulated overlay lines / dust particles */}
                        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                        
                        {/* Lens crosshair overlay */}
                        <div className="absolute top-4 right-4 text-[9px] font-mono text-white/50 bg-black/60 px-2 py-0.5 rounded border border-zinc-800">
                          RAW LOG 24p
                        </div>

                        {/* Center interactive play prompt */}
                        {!isPlaying && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40">
                            <button
                              onClick={handleTogglePlayReel}
                              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] cursor-pointer"
                            >
                              <Play size={20} className="fill-black ml-1" />
                            </button>
                            
                            <div className="text-center">
                              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-300">
                                MULAI REEL TEATER
                              </span>
                              <span className="block text-[8px] font-mono text-zinc-500 mt-0.5">
                                DURASI FULL: 02:40 &bull; RESOLUSI: 4K
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Animated Soundwave overlay when playing */}
                        {isPlaying && (
                          <div className="absolute bottom-4 left-4 flex gap-0.5 items-end h-6 pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                              <motion.div
                                key={`wave-${i}`}
                                animate={{ height: [4, 20, 4] }}
                                transition={{ repeat: Infinity, duration: 0.6 + i * 0.1, ease: 'easeInOut' }}
                                className="w-1 bg-white rounded-full"
                              />
                            ))}
                          </div>
                        )}

                        {/* Video timeline controllers bottom bar */}
                        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/90 to-transparent p-4 flex items-center justify-between opacity-80">
                          {/* Left: Play/pause button */}
                          <button onClick={handleTogglePlayReel} className="text-white hover:text-zinc-300">
                            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                          </button>

                          {/* Middle: Progress bar (scrubbable) */}
                          <div onClick={handleProgressBarScrub} className="grow mx-4 relative h-1 bg-zinc-800 rounded-full overflow-hidden cursor-pointer">
                            <div 
                              className="absolute left-0 h-full bg-white transition-all duration-300"
                              style={{ width: `${videoProgress}%` }}
                            />
                          </div>

                          {/* Right: volume indicator & duration tag */}
                          <div className="flex items-center gap-3 font-mono text-[9px]">
                            <button onClick={handleReelVolumeToggle} className="text-white hover:text-zinc-300">
                              {reelVolume ? <Volume2 size={12} /> : <VolumeX size={12} />}
                            </button>
                            <span className="text-zinc-400">
                              {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PROJECT PORTFOLIO GRID */}
                    <div className="flex flex-col gap-4">
                      <h3 className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
                        ARsip Sinematografi Terpilih (Selected Works)
                      </h3>
                      <ProjectShowcase 
                        onSelectProject={(proj) => {
                          if (soundOn) synth.playTick();
                        }} 
                        soundOn={soundOn} 
                      />
                    </div>

                    {/* SECTION TENTANG DIRINYA (ABOUT ME) */}
                    <div className="flex flex-col gap-6 border-t border-zinc-900 pt-12 mt-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                          PROFIL SINEMATIK &bull; TENTANG DIRINYA (ABOUT ME)
                        </h3>
                        <span className="text-[9px] font-mono text-zinc-600 bg-zinc-950 px-2 py-0.5 border border-zinc-900 rounded">
                          DKV PORTRAIT
                        </span>
                      </div>

                      {/* Modern Bento Grid Layout */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {/* Column 1: Biografi */}
                        <div className="md:col-span-2 flex flex-col gap-4 border border-zinc-900/60 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-zinc-950 to-black group hover:border-zinc-700 transition-colors duration-300">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full border border-white/10 overflow-hidden shrink-0">
                              <img src={faceImg} alt="Saiful Portrait" className="w-full h-full object-cover filter grayscale contrast-125" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-white tracking-wide uppercase">Saiful Duka</h4>
                              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Videographer & Designer</p>
                            </div>
                          </div>
                          
                          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                            Halo! Saya <strong className="text-zinc-200">Saiful Duka</strong>, siswa <strong className="text-zinc-200">kelas XII DKV 1</strong> di <strong className="text-zinc-200">Madrasah Aliyah Kejuruan (MAK)</strong> dengan minat di desain grafis, videografi, dan produksi konten kreatif.
                          </p>
                          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                            Aktif mengembangkan keterampilan melalui proyek sekolah, dokumentasi acara, kelas industri, dan kompetisi — termasuk menjadi <strong className="text-zinc-200">finalis lomba video kreatif tingkat nasional</strong>.
                          </p>

                          <div className="grid grid-cols-2 gap-3 mt-1 border-t border-zinc-900 pt-3">
                            <div>
                              <span className="block text-[8px] font-mono text-zinc-600 uppercase">SEKOLAH</span>
                              <span className="text-[11px] text-zinc-300 font-medium">MAK Negri Ende</span>
                            </div>
                            <div>
                              <span className="block text-[8px] font-mono text-zinc-600 uppercase">JURUSAN</span>
                              <span className="text-[11px] text-zinc-300 font-medium">DKV</span>
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Keahlian */}
                        <div className="flex flex-col gap-4 border border-zinc-900/60 p-4 sm:p-6 rounded-2xl bg-zinc-950/40 hover:border-zinc-700 transition-colors duration-300">
                          <h4 className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase">KEAHLIAN KUNCI</h4>
                          <div className="flex flex-col gap-3">
                            {[
                              { title: 'Color Grading & LUTS', desc: 'Transformasi RAW/LOG ke monokromatis dramatis.' },
                              { title: 'Rhythmic Montage', desc: 'Pemotongan sekuens berdasarkan ketukan audio.' },
                              { title: 'Composition & Frame Lock', desc: 'Framing anamorfis 2.39:1 dengan rule of thirds.' },
                              { title: '3D & Motion Compositing', desc: 'Elemen motion graphic After Effects.' }
                            ].map((skill, index) => (
                              <div key={index} className="flex flex-col gap-0.5 border-b border-zinc-900 pb-2 last:border-0 last:pb-0">
                                <span className="text-[11px] font-bold text-white uppercase tracking-tight">{skill.title}</span>
                                <span className="text-[10px] text-zinc-500 leading-normal">{skill.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Philosophy of Work (3 Pillars) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mt-2">
                        {[
                          { num: '01', title: 'CONTRAST IS EMOTION', desc: 'Pencahayaan kontras tinggi mengungkap esensi subjek tanpa distraksi warna.' },
                          { num: '02', title: 'RHYTHMIC PACE', desc: 'Setiap pergantian shot dan keheningan audio diatur presisi untuk memandu penonton.' },
                          { num: '03', title: 'CAMERA AS OBSERVER', desc: 'Menangkap kejujuran momen — bukan memaksakan drama.' }
                        ].map((pillar) => (
                          <div key={pillar.num} className="border border-zinc-900 p-4 sm:p-5 rounded-xl bg-zinc-950/20 hover:bg-zinc-950/50 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-mono font-black text-lg sm:text-xl text-zinc-800">{pillar.num}</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                            </div>
                            <h5 className="font-bold text-[11px] text-white tracking-wide uppercase mb-1">{pillar.title}</h5>
                            <p className="text-[10px] text-zinc-500 leading-relaxed">{pillar.desc}</p>
                          </div>
                        ))}
                      </div>

                      {/* Software Toolkit & Certifications */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-2">
                        <div className="border border-zinc-900 p-4 sm:p-6 rounded-2xl bg-zinc-950/30">
                          <h4 className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase mb-3 sm:mb-4">SOFTWARE TOOLS PIPELINE</h4>
                          <div className="grid grid-cols-2 gap-y-3 gap-x-4 sm:gap-y-4 sm:gap-x-6 text-[10px] sm:text-[11px] font-mono">
                            {[
                              { label: 'Adobe Photoshop', desc: 'Storyboard & Visual Asset' },
                              { label: 'Adobe Illustrator', desc: 'Layout & Tipografi Vektor' },
                              { label: 'Adobe Lightroom', desc: 'Color Grading & Photo Edit' },
                              { label: 'CapCut Studio', desc: 'Editing & Potongan Cepat' },
                              { label: 'After Effects', desc: 'VFX & Motion Graphics' }
                            ].map((tool, i) => (
                              <div key={i} className="flex flex-col gap-0.5 border-l border-zinc-800 pl-3">
                                <span className="text-zinc-300 font-bold">{tool.label}</span>
                                <span className="text-[8px] sm:text-[9px] text-zinc-600 uppercase">{tool.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border border-zinc-900 p-4 sm:p-6 rounded-2xl bg-zinc-950/30 flex flex-col justify-between gap-4">
                          <div>
                            <h4 className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase mb-3 sm:mb-4">PENGALAMAN & PRESTASI</h4>
                            <div className="flex flex-col gap-2 sm:gap-3 text-[11px]">
                              {[
                                { title: '50 Finalis Lomba Video Kreatif Nasional', sub: 'KEMENTRIAN AGAMA RI' },
                                { title: 'Kelas Industri di Crocodic', sub: 'BIDANG DESAIN GRAFIS' },
                                { title: 'Tim Unit Produksi Sekolah', sub: 'MAK NEGRI ENDE' },
                                { title: 'Dokumentasi Foto & Video', sub: 'PRAMUKA, HARI SANTRI & ACARA SEKOLAH' },
                              ].map((item, i) => (
                                <div key={i} className="flex flex-col border-b border-zinc-900 pb-2 last:border-0 last:pb-0">
                                  <span className="font-bold text-zinc-300">{item.title}</span>
                                  <span className="text-[9px] text-zinc-600 font-mono">{item.sub}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-600 border-t border-zinc-900 pt-3 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span>TERBUKA UNTUK KOLABORASI & KESEMPATAN MAGANG KREATIF</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* COLOR GRADING INTERACTIVE LAB */}
                {activeSection === 'grader' && (
                  <InteractiveGrader 
                    sceneImage="/saifulduka1.jpg" 
                    soundOn={soundOn} 
                  />
                )}

                {/* CERTIFICATE SHOWCASE PANEL */}
                {activeSection === 'sequencer' && (
                  <CertificateShowcase />
                )}

                {/* CONTACT BOARD CLAPPER FORM */}
                {activeSection === 'contact' && (
                  <div className="flex flex-col gap-6" id="contact-section">
                    <ClapperboardContact 
                      soundOn={soundOn} 
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

            {/* HIGH END BRANDING FOOTER */}
            <footer className="bg-black border-t border-zinc-900 py-8 sm:py-12 px-4 sm:px-6 mt-8 sm:mt-12 text-zinc-400 font-mono text-xs">
              <div className="max-w-7xl w-full mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                
                {/* Column 1: Designer specs */}
                <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
                  <h3 className="font-bold text-white text-sm font-display tracking-wider">SAIFUL DUKA</h3>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">
                    Siswa MAK jurusan DKV dengan fokus pada Videografi, Desain Grafis, dan Dokumentasi Kreatif.
                  </p>
                  <span className="text-[9px] text-zinc-600 mt-1">ENDE, NUSA TENGGARA TIMUR</span>
                </div>

                {/* Column 2: Navigation */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] text-zinc-600 uppercase tracking-widest">NAVIGASI</span>
                  <button onClick={() => setActiveSection('showcase')} className="text-left text-zinc-400 hover:text-white transition-colors text-[11px]">01 / Showcase</button>
                  <button onClick={() => setActiveSection('grader')} className="text-left text-zinc-400 hover:text-white transition-colors text-[11px]">02 / Grading Lab</button>
                  <button onClick={() => setActiveSection('sequencer')} className="text-left text-zinc-400 hover:text-white transition-colors text-[11px]">03 / Sertifikat</button>
                  <button onClick={() => setActiveSection('contact')} className="text-left text-zinc-400 hover:text-white transition-colors text-[11px]">04 / Contact</button>
                </div>

                {/* Column 3: Toolkit — hidden on small mobile, show on sm+ */}
                <div className="hidden sm:flex flex-col gap-2">
                  <span className="text-[9px] text-zinc-600 uppercase tracking-widest">TOOLS</span>
                  <span className="text-zinc-400 text-[11px]">Adobe Photoshop</span>
                  <span className="text-zinc-400 text-[11px]">Adobe Lightroom</span>
                  <span className="text-zinc-400 text-[11px]">After Effects</span>
                  <span className="text-zinc-400 text-[11px]">CapCut Studio</span>
                </div>

                {/* Column 4: Contact & Social */}
                <div className="flex flex-col gap-3">
                  <span className="text-[9px] text-zinc-600 uppercase tracking-widest">KONTAK</span>
                  <div className="flex gap-2 sm:gap-3">
                    <a href="https://instagram.com/ifulduka" target="_blank" rel="noopener noreferrer" className="p-2 border border-zinc-800 hover:border-zinc-500 rounded text-zinc-400 hover:text-white transition-colors">
                      <Instagram size={13} />
                    </a>
                    <a href="mailto:saifulduka48@gmail.com" className="p-2 border border-zinc-800 hover:border-zinc-500 rounded text-zinc-400 hover:text-white transition-colors">
                      <Mail size={13} />
                    </a>
                  </div>
                  <span className="text-[9px] text-zinc-600 leading-relaxed">saifulduka48@gmail.com</span>
                  <span className="text-[9px] text-zinc-600">082260446768</span>
                  <span className="text-[9px] text-zinc-700 mt-1">© 2026 Saiful Duka</span>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
