import React, { useState } from 'react';
import { Film, ArrowRight, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StoryboardShot } from '../types';
import { synth } from '../utils/audio';

interface StoryboardsProps {
  soundOn: boolean;
}

const INITIAL_SHOTS: StoryboardShot[] = [
  {
    id: 'shot-1',
    type: 'Establishing Shot',
    framing: 'Extremely Wide (EWS)',
    angle: 'High Angle View',
    description: 'Sebuah gedung pencakar langit tua di tengah kabut kota Jakarta malam hari.',
    imageSeed: 'city',
  },
  {
    id: 'shot-2',
    type: 'Medium Close-Up',
    framing: 'Medium Close (MCU)',
    angle: 'Eye-Level',
    description: 'Karakter utama berdiri di atap, air mata memantulkan cahaya lampu kota.',
    imageSeed: 'face',
  },
  {
    id: 'shot-3',
    type: 'Over-The-Shoulder',
    framing: 'Over Shoulder (OTS)',
    angle: 'Low Angle',
    description: 'Melihat ke arah kamera video tua yang bertengger di atas tripod di ujung atap.',
    imageSeed: 'camera',
  },
  {
    id: 'shot-4',
    type: 'Dolly Zoom Vertigo',
    framing: 'Extreme Close (ECU)',
    angle: 'Dutch Angle',
    description: 'Lensa kamera melakukan push-in sementara latar belakang terdistorsi menjauh.',
    imageSeed: 'tunnel',
  },
];

export default function Storyboards({ soundOn }: StoryboardsProps) {
  const [shots, setShots] = useState<StoryboardShot[]>(INITIAL_SHOTS);

  const moveLeft = (index: number) => {
    if (index === 0) return;
    if (soundOn) synth.playTick();
    const newShots = [...shots];
    const temp = newShots[index];
    newShots[index] = newShots[index - 1];
    newShots[index - 1] = temp;
    setShots(newShots);
  };

  const moveRight = (index: number) => {
    if (index === shots.length - 1) return;
    if (soundOn) synth.playTick();
    const newShots = [...shots];
    const temp = newShots[index];
    newShots[index] = newShots[index + 1];
    newShots[index + 1] = temp;
    setShots(newShots);
  };

  const randomizeSequence = () => {
    if (soundOn) synth.playShutter();
    const shuffled = [...shots].sort(() => Math.random() - 0.5);
    setShots(shuffled);
  };

  const resetSequence = () => {
    if (soundOn) synth.playFocusBeep();
    setShots(INITIAL_SHOTS);
  };

  // Get dynamic director feedback based on the arrangement of shot IDs
  const getDirectorAnalysis = () => {
    const order = shots.map((s) => s.id).join('-');

    if (order === 'shot-1-shot-2-shot-3-shot-4') {
      return {
        title: 'Alur Klasik Hollywood (Hollywood Narrative)',
        description: 'Orientasi geografis yang sempurna. Anda mengenalkan ruang (Jakarta) sebelum memfokuskan penderitaan batin karakter (MCU), kemudian mengenalkan objek misterius (Tripod) sebelum diakhiri dengan distorsi psikologis ekstrem Dolly Zoom.',
        pacing: 'Sangat Mulus & Mudah Dipahami (A+',
      };
    }

    if (order === 'shot-4-shot-2-shot-3-shot-1') {
      return {
        title: 'Alur Kilas Balik / Eksperimental (In Media Res)',
        description: 'Luar biasa berani! Film langsung diawali dengan disorientasi mental (Dolly Zoom Vertigo) untuk memicu kepanikan klien/penonton. Baru kemudian meraba siapa pelakunya (MCU), memandang objek (Tripod), dan diakhiri dengan kekosongan kota metropolitan.',
        pacing: 'Dramatis & Penuh Ketegangan (Suspenseful)',
      };
    }

    if (shots[0].id === 'shot-4') {
      return {
        title: 'Pembuka Subjektif (Subjective Intro)',
        description: 'Memulai dengan Dolly Zoom Vertigo di shot pertama langsung menenggelamkan penonton ke dalam alam bawah sadar karakter. Ini gaya sinematografi psiko-analisis modern.',
        pacing: 'Cepat & Disorientatif',
      };
    }

    if (shots[3].id === 'shot-1') {
      return {
        title: 'Ending Kosong (Exotic Exit)',
        description: 'Mengakhiri sekuens dengan shot gedung jakarta di kejauhan menyiratkan bahwa masalah karakter bersifat kerdil di tengah megahnya dunia luar. Sunyi dan filosofis.',
        pacing: 'Melankolis & Kontemplatif',
      };
    }

    return {
      title: 'Montase Kontemporer (Rhythmic Collage)',
      description: 'Sekuens ini bergantian melompat dari ruang subjektif ke ruang objektif. Pola penyuntingan dinamis ini memicu ritme visual yang cepat, sangat ideal untuk format Video Musik atau Iklan Seni DKV.',
      pacing: 'Ekspresif & Modern',
    };
  };

  const analysis = getDirectorAnalysis();

  return (
    <div id="storyboard-sequencer" className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl flex flex-col gap-6 text-white font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2.5">
          <Film className="text-white" size={18} />
          <div>
            <h3 className="font-bold text-sm tracking-wider uppercase">Shot Director Sequencer</h3>
            <p className="text-[10px] text-zinc-500 font-mono">URUTKAN SHOT UNTUK MENENTUKAN RITME NALARIA SINEMA</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={randomizeSequence}
            className="flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white transition-colors uppercase border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-md font-mono"
          >
            Acak Urutan
          </button>
          <button
            onClick={resetSequence}
            className="flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white transition-colors uppercase border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-md font-mono"
            title="Reset ke struktur klasik"
          >
            <RefreshCw size={10} /> Reset
          </button>
        </div>
      </div>

      {/* Main Draggable/Swappable Shot Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2">
        <AnimatePresence mode="popLayout">
          {shots.map((shot, index) => {
            // High-contrast SVG-based simple icons representing shot styles
            return (
              <motion.div
                key={shot.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="bg-black border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between group hover:border-zinc-500 transition-colors"
              >
                {/* Visual Thumbnail simulation (Monochrome line art or abstract representation) */}
                <div className="aspect-video bg-zinc-900 relative flex items-center justify-center p-4 overflow-hidden border-b border-zinc-900">
                  <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 pointer-events-none" />
                  
                  {/* Mock Camera Viewfinder Overlay */}
                  <div className="absolute top-1.5 left-1.5 text-[7px] font-mono text-zinc-500">CH {index + 1}</div>
                  <div className="absolute top-1.5 right-1.5 text-[7px] font-mono text-zinc-500">24FPS</div>
                  
                  {/* Dynamic Abstract Graphics based on Shot type */}
                  {shot.id === 'shot-1' && (
                    <svg className="w-16 h-12 text-zinc-600 opacity-60" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M10 50 L30 30 L40 40 L70 10 L90 50 Z" />
                      <path d="M5 50 H95" />
                      <circle cx="80" cy="20" r="4" strokeDasharray="2 2" />
                    </svg>
                  )}
                  {shot.id === 'shot-2' && (
                    <svg className="w-16 h-12 text-zinc-600 opacity-60" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="50" cy="25" r="10" />
                      <path d="M30 50 C30 40, 70 40, 70 50" />
                    </svg>
                  )}
                  {shot.id === 'shot-3' && (
                    <svg className="w-16 h-12 text-zinc-600 opacity-60" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="25" cy="20" r="6" />
                      <path d="M15 35 C15 28, 35 28, 35 35" />
                      <rect x="55" y="15" width="25" height="15" rx="2" />
                      <circle cx="67" cy="35" r="3" />
                    </svg>
                  )}
                  {shot.id === 'shot-4' && (
                    <svg className="w-16 h-12 text-zinc-600 opacity-60" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="50" cy="30" r="15" strokeDasharray="3 3" />
                      <circle cx="50" cy="30" r="8" />
                      <circle cx="50" cy="30" r="3" />
                      <line x1="20" y1="10" x2="80" y2="50" />
                    </svg>
                  )}
                  
                  {/* Indicator Title Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 bg-black/80 px-2 py-1 border border-zinc-800 rounded text-[9px] font-mono text-zinc-300">
                    {shot.framing}
                  </div>
                </div>

                {/* Content info */}
                <div className="p-3 flex flex-col gap-1.5 grow justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase">{shot.angle}</span>
                    <h4 className="font-bold text-xs text-white mb-1 group-hover:text-zinc-300 transition-colors">{shot.type}</h4>
                    <p className="text-[10px] text-zinc-400 leading-normal">{shot.description}</p>
                  </div>

                  {/* Left-Right Swap Buttons */}
                  <div className="flex justify-between items-center border-t border-zinc-900 pt-2.5 mt-2">
                    <button
                      onClick={() => moveLeft(index)}
                      disabled={index === 0}
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        index === 0 
                          ? 'text-zinc-700 cursor-not-allowed' 
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                      }`}
                    >
                      &larr; Kiri
                    </button>
                    <span className="text-[9px] font-mono text-zinc-600 font-bold">POSISI 0{index + 1}</span>
                    <button
                      onClick={() => moveRight(index)}
                      disabled={index === shots.length - 1}
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        index === shots.length - 1 
                          ? 'text-zinc-700 cursor-not-allowed' 
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                      }`}
                    >
                      Kanan &rarr;
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Narrative flow connectors */}
      <div className="hidden md:flex justify-around items-center px-8 text-zinc-700">
        <ArrowRight size={14} className="animate-pulse" />
        <ArrowRight size={14} className="animate-pulse" />
        <ArrowRight size={14} className="animate-pulse" />
      </div>

      {/* ANALYSIS BOARD */}
      <div className="bg-black border border-zinc-800 p-5 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-col gap-1 md:w-3/4">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-white animate-pulse" />
            <h4 className="text-xs font-bold font-mono text-zinc-300 uppercase tracking-wider">
              Analis Ritme Sutradara (Shot Sequence Evaluation)
            </h4>
          </div>
          <span className="text-white font-bold text-sm tracking-tight mt-1">{analysis.title}</span>
          <p className="text-xs text-zinc-400 leading-relaxed mt-1">
            {analysis.description}
          </p>
        </div>

        <div className="flex flex-col bg-zinc-900/60 border border-zinc-800 p-3 rounded-lg md:text-right text-left shrink-0 font-mono">
          <span className="text-[9px] text-zinc-500">PACE & KETEGANAN</span>
          <span className="text-white text-xs font-bold mt-0.5">{analysis.pacing}</span>
          <span className="text-[8px] text-zinc-600 mt-1">DKV JAKARTA FILM DEPT</span>
        </div>
      </div>
    </div>
  );
}
