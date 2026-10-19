import React, { useEffect, useState } from 'react';
import { Camera, RefreshCw, Volume2, VolumeX, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { synth } from '../utils/audio';

interface CameraViewfinderProps {
  zoomValue: number; // 1 to 3
  setZoomValue: (val: number) => void;
  onEnterCore: () => void;
  soundOn: boolean;
  setSoundOn: (on: boolean) => void;
}

export default function CameraViewfinder({
  zoomValue,
  setZoomValue,
  onEnterCore,
  soundOn,
  setSoundOn,
}: CameraViewfinderProps) {
  const [timecode, setTimecode] = useState('00:00:00:00');
  const [vuLeft, setVuLeft] = useState<number[]>([40, 50, 45, 60]);
  const [vuRight, setVuRight] = useState<number[]>([35, 55, 40, 50]);
  const [isHolding, setIsHolding] = useState(false);
  const [shutterSpeed, setShutterSpeed] = useState('1/50');
  const [aperture, setAperture] = useState('f/1.8');
  const [iso, setIso] = useState('400');

  // Trigger SMPTE style ticking timecode
  useEffect(() => {
    let frames = 0;
    let seconds = 32;
    let minutes = 14;
    let hours = 0;

    const interval = setInterval(() => {
      frames++;
      if (frames >= 24) {
        frames = 0;
        seconds++;
        if (seconds >= 60) {
          seconds = 0;
          minutes++;
          if (minutes >= 60) {
            minutes = 0;
            hours++;
          }
        }
      }

      const hStr = hours.toString().padStart(2, '0');
      const mStr = minutes.toString().padStart(2, '0');
      const sStr = seconds.toString().padStart(2, '0');
      const fStr = frames.toString().padStart(2, '0');

      setTimecode(`${hStr}:${mStr}:${sStr}:${fStr}`);

      // Also animate VU levels randomly for realism
      setVuLeft([
        Math.floor(Math.random() * 60) + 20,
        Math.floor(Math.random() * 70) + 15,
        Math.floor(Math.random() * 80) + 10,
        Math.floor(Math.random() * 50) + 30,
      ]);
      setVuRight([
        Math.floor(Math.random() * 55) + 25,
        Math.floor(Math.random() * 65) + 20,
        Math.floor(Math.random() * 85) + 5,
        Math.floor(Math.random() * 45) + 35,
      ]);
    }, 1000 / 24); // 24 FPS ticker

    return () => clearInterval(interval);
  }, []);

  // Handle holding simulation for auto-zoom
  useEffect(() => {
    let holdInterval: NodeJS.Timeout;
    if (isHolding) {
      if (soundOn) {
        synth.playFocusBeep();
      }
      holdInterval = setInterval(() => {
        setZoomValue(Math.min(zoomValue + 0.05, 3));
        if (soundOn && Math.random() > 0.6) {
          synth.playTick();
        }
      }, 30);
    }
    return () => clearInterval(holdInterval);
  }, [isHolding, zoomValue, setZoomValue, soundOn]);

  // Check if zoom triggers transition
  useEffect(() => {
    if (zoomValue >= 3) {
      setIsHolding(false);
      if (soundOn) {
        synth.playShutter();
      }
      onEnterCore();
    }
  }, [zoomValue, onEnterCore, soundOn]);

  // Toggle sound activation and run initial beep if enabling
  const toggleSound = () => {
    const newVal = !soundOn;
    setSoundOn(newVal);
    synth.enabled = newVal;
    if (newVal) {
      synth.playFocusBeep();
    }
  };

  // Convert scale to cinematic focal lengths (18mm to 135mm)
  const getFocalLength = (zoom: number) => {
    const minFocal = 24;
    const maxFocal = 105;
    const current = Math.round(minFocal + (zoom - 1) * (maxFocal - minFocal) / 2);
    return `${current}mm`;
  };

  const cycleStats = () => {
    if (soundOn) synth.playTick();
    const shutters = ['1/50', '1/100', '1/250', '1/500'];
    const apertures = ['f/1.8', 'f/2.8', 'f/4.0', 'f/8.0'];
    const isos = ['400', '800', '1600', '3200'];

    setShutterSpeed(shutters[(shutters.indexOf(shutterSpeed) + 1) % shutters.length]);
    setAperture(apertures[(apertures.indexOf(aperture) + 1) % apertures.length]);
    setIso(isos[(isos.indexOf(iso) + 1) % isos.length]);
  };

  return (
    <div id="camera-viewfinder" className="absolute inset-2 sm:inset-4 md:inset-10 pointer-events-none select-none flex flex-col justify-between p-2 sm:p-4 md:p-8 z-40 border border-white/25 font-mono text-[10px] md:text-[12px] tracking-wider text-white">
      {/* 1. Camera View Grid (Rule of Thirds) */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-35 border border-white/20 pointer-events-none">
        <div className="border-r border-b border-white/40"></div>
        <div className="border-r border-b border-white/40"></div>
        <div className="border-b border-white/40"></div>
        <div className="border-r border-b border-white/40"></div>
        <div className="border-r border-b border-white/40"></div>
        <div className="border-b border-white/40"></div>
        <div className="border-r border-white/40"></div>
        <div className="border-r border-white/40"></div>
        <div></div>
      </div>

      {/* Center Focus Reticle Bracket */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          animate={{
            scale: 1 + (zoomValue - 1) * 0.2,
            opacity: isHolding ? [0.8, 1, 0.8] : 0.65
          }}
          transition={{
            opacity: { repeat: Infinity, duration: 1.5 }
          }}
          className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center"
        >
          <div className="absolute top-0 left-0 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-l-2 border-white"></div>
          <div className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-r-2 border-white"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-l-2 border-white"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-r-2 border-white"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-85"></div>
        </motion.div>
      </div>

      {/* TOP STATUS BAR */}
      <div className="w-full flex justify-between items-center pointer-events-auto z-20 gap-2">
        
        {/* Kiri: REC + Timecode */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-600 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600"></span>
          </div>
          <span className="text-white text-[9px] font-bold font-sans">REC</span>
          <span className="text-zinc-400 font-mono text-[9px]">{timecode}</span>
          <span className="text-zinc-500 text-[8px] hidden sm:inline">RAW · 4K · 23.976</span>
        </div>

        <div className="flex-1" />

        {/* Kanan: Sound Toggle */}
        <div className="shrink-0">
          <button
            onClick={toggleSound}
            className="p-1.5 sm:p-2 border border-white/10 hover:border-white/40 hover:bg-white/10 text-white rounded transition-colors"
            title={soundOn ? "Matikan Suara" : "Aktifkan Suara"}
          >
            {soundOn ? <Volume2 size={12} /> : <VolumeX size={12} />}
          </button>
        </div>
      </div>

      {/* MIDDLE FLANKING METERS — hidden on small screens to save space */}
      <div className="w-full flex justify-between items-center grow py-4 sm:py-8 pointer-events-auto">
        {/* Left Side: Audio VU Meter — hidden on xs */}
        <div className="hidden sm:flex flex-col gap-2 h-28 sm:h-36 items-start justify-center">
          <span className="text-zinc-500 text-[7px] tracking-widest vertical-rl rotate-180 mb-2">AUDIO L/R</span>
          <div className="flex gap-1 sm:gap-1.5 h-20 sm:h-24 items-end">
            <div className="flex flex-col-reverse h-full w-1.5 sm:w-2 bg-zinc-900 border border-white/5 rounded-sm overflow-hidden">
              {vuLeft.map((val, i) => (
                <motion.div key={`vul-${i}`} animate={{ height: `${val}%` }} transition={{ type: 'spring', damping: 12 }}
                  className={`w-full ${val > 75 ? 'bg-white' : val > 50 ? 'bg-zinc-300' : 'bg-zinc-500'}`} />
              ))}
            </div>
            <div className="flex flex-col-reverse h-full w-1.5 sm:w-2 bg-zinc-900 border border-white/5 rounded-sm overflow-hidden">
              {vuRight.map((val, i) => (
                <motion.div key={`vur-${i}`} animate={{ height: `${val}%` }} transition={{ type: 'spring', damping: 12 }}
                  className={`w-full ${val > 75 ? 'bg-white' : val > 50 ? 'bg-zinc-300' : 'bg-zinc-500'}`} />
              ))}
            </div>
          </div>
          <span className="text-zinc-400 text-[7px]">-12dB</span>
        </div>

        {/* Spacer on mobile */}
        <div className="sm:hidden flex-1" />

        {/* Right Side: Focal Ring — hidden on xs */}
        <div className="hidden sm:flex flex-col gap-2 items-end justify-center">
          <span className="text-zinc-500 text-[7px] tracking-widest rotate-90 mb-4">FOCAL</span>
          <div className="flex flex-col items-center justify-between h-28 sm:h-40 py-2 border-r border-white/10 pr-2">
            <span className="text-[8px] text-zinc-500">105mm</span>
            <span className="text-[8px] text-zinc-500">85mm</span>
            <span className="text-[8px] text-zinc-500">50mm</span>
            <span className="text-[8px] text-zinc-500">35mm</span>
            <span className="text-[8px] text-zinc-500">24mm</span>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROL & HUD STATS */}
      <div className="w-full flex flex-col gap-2 sm:gap-4 pointer-events-auto z-20">
        {/* Interactive Zoom Dial */}
        <div className="w-full max-w-lg mx-auto bg-black/60 backdrop-blur-md border border-white/10 p-2.5 sm:p-4 rounded-xl flex flex-col gap-2 sm:gap-3 items-center">
          <div className="w-full flex justify-between items-center px-1 font-mono text-[8px] sm:text-[9px] text-zinc-500">
            <span>WIDE</span>
            <span className="text-white text-[10px] sm:text-xs font-bold">{getFocalLength(zoomValue)}</span>
            <span>TELE</span>
          </div>

          <div className="w-full flex gap-2 sm:gap-3 items-center">
            <span className="text-zinc-500 text-[8px] sm:text-[10px]">1.0x</span>
            <input
              type="range" min="1" max="3" step="0.01" value={zoomValue}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setZoomValue(val);
                if (soundOn && Math.abs(val - zoomValue) > 0.05) synth.playTick();
              }}
              className="grow accent-white h-[2px] bg-zinc-800 rounded-lg cursor-pointer appearance-none pointer-events-auto"
            />
            <span className="text-zinc-400 text-[8px] sm:text-[10px]">3.0x</span>
          </div>

          <div className="w-full flex gap-3 items-center justify-center">
            <div className="text-zinc-400 text-[9px] flex items-center gap-1.5">
              <Eye size={11} className="text-zinc-400 animate-pulse" />
              <span>Geser slider untuk zoom masuk wajah</span>
            </div>
          </div>
        </div>

        {/* BOTTOM RAW SPECS BAR — simplified on mobile */}
        <div className="w-full border-t border-white/10 pt-2 sm:pt-3">
          {/* Mobile: show only essential 3 stats in compact row */}
          <div className="flex sm:hidden justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="flex flex-col cursor-pointer" onClick={cycleStats}>
                <span className="text-zinc-500 text-[7px]">SHUTTER</span>
                <span className="text-white text-[9px] font-bold">{shutterSpeed}</span>
              </div>
              <div className="flex flex-col cursor-pointer" onClick={cycleStats}>
                <span className="text-zinc-500 text-[7px]">APERTURE</span>
                <span className="text-white text-[9px] font-bold">{aperture}</span>
              </div>
              <div className="flex flex-col cursor-pointer" onClick={cycleStats}>
                <span className="text-zinc-500 text-[7px]">ISO</span>
                <span className="text-white text-[9px] font-bold">{iso}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-zinc-500 text-[7px]">WB</span>
              <span className="text-white text-[9px] font-bold">5600K</span>
            </div>
          </div>

          {/* Desktop: full stats bar */}
          <div className="hidden sm:flex justify-between items-center">
            <div className="flex gap-4 sm:gap-6 items-center">
              <div className="flex flex-col cursor-pointer" onClick={cycleStats}>
                <span className="text-zinc-500 text-[8px]">SHUTTER</span>
                <span className="text-white text-xs hover:text-zinc-300 flex items-center gap-1">
                  {shutterSpeed} <RefreshCw size={9} className="text-zinc-500" />
                </span>
              </div>
              <div className="flex flex-col cursor-pointer" onClick={cycleStats}>
                <span className="text-zinc-500 text-[8px]">APERTURE</span>
                <span className="text-white text-xs hover:text-zinc-300 flex items-center gap-1">
                  {aperture} <RefreshCw size={9} className="text-zinc-500" />
                </span>
              </div>
              <div className="flex flex-col cursor-pointer" onClick={cycleStats}>
                <span className="text-zinc-500 text-[8px]">SENSITIVITY</span>
                <span className="text-white text-xs hover:text-zinc-300 flex items-center gap-1">
                  ISO {iso} <RefreshCw size={9} className="text-zinc-500" />
                </span>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4 items-center">
              <div className="flex flex-col items-end">
                <span className="text-zinc-500 text-[8px]">WHITE BALANCE</span>
                <span className="text-white text-[10px]">5600K (DAYLIGHT)</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-zinc-500 text-[8px]">ND FILTER</span>
                <span className="text-white text-[10px]">0.9 (3-STOP)</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-zinc-500 text-[8px]">BATTERY</span>
                <span className="text-green-500 text-[10px] flex items-center gap-1">88% [█████░]</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
