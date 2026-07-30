import React, { useState } from 'react';
import { Sliders, RefreshCw, Layers, Check, ZoomIn } from 'lucide-react';
import { motion } from 'motion/react';
import { GraderSettings } from '../types';
import { synth } from '../utils/audio';

interface InteractiveGraderProps {
  sceneImage: string;
  soundOn: boolean;
}

const DEFAULT_SETTINGS: GraderSettings = {
  contrast: 110,
  exposure: 100,
  filmGrain: 15,
  vignette: 40,
  blur: 0,
  tint: 'neutral',
};

const LUT_PRESETS = [
  { id: 'neutral', name: 'Raw Lineer', desc: 'No grading applied, raw log profile' },
  { id: 'noir', name: 'Film Noir Klasik', desc: 'Shadow pekat, highlight tajam, kontras dramatis ala film 35mm' },
  { id: 'cool', name: 'Silver Cool', desc: 'Moody steel-gray tints, cold urban look' },
  { id: 'warm', name: 'Arang Hangat', desc: 'Graphite kecokelatan, tonal sepia organik yang nostalgik' },
  { id: 'high-key', name: 'Mimpi Kunci Tinggi', desc: 'Highlight terangkat, shadow luntur, cahaya dreamy lembut' },
];

export default function InteractiveGrader({ sceneImage, soundOn }: InteractiveGraderProps) {
  const [settings, setSettings] = useState<GraderSettings>(DEFAULT_SETTINGS);

  const updateSetting = (key: keyof GraderSettings, val: any) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
    if (soundOn && Math.random() > 0.7) {
      synth.playTick();
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    if (soundOn) {
      synth.playShutter();
    }
  };

  const applyPreset = (presetId: 'neutral' | 'cool' | 'warm' | 'high-key' | 'noir') => {
    if (soundOn) {
      synth.playFocusBeep();
    }
    
    switch (presetId) {
      case 'neutral':
        setSettings({ contrast: 100, exposure: 100, filmGrain: 8, vignette: 20, blur: 0, tint: 'neutral' });
        break;
      case 'noir':
        // Classic Noir: portrait foto dengan background rak buku — shadow pekat, highlight tajam
        setSettings({ contrast: 175, exposure: 82, filmGrain: 42, vignette: 72, blur: 0, tint: 'noir' });
        break;
      case 'cool':
        setSettings({ contrast: 115, exposure: 95, filmGrain: 15, vignette: 45, blur: 0, tint: 'cool' });
        break;
      case 'warm':
        // Warm Charcoal: tonal hangat graphite, cocok untuk foto seragam dengan latar buku
        setSettings({ contrast: 118, exposure: 98, filmGrain: 28, vignette: 42, blur: 0, tint: 'warm' });
        break;
      case 'high-key':
        // High Key Dream: portrait terang, highlight lembut, shadow terangkat, glow mimpi
        setSettings({ contrast: 72, exposure: 148, filmGrain: 6, vignette: 8, blur: 2, tint: 'high-key' });
        break;
    }
  };

  // Convert settings to CSS filter style
  const getFilterStyle = () => {
    let contrastVal = settings.contrast;
    let brightnessVal = settings.exposure;
    let blurVal = settings.blur;
    
    let filterString = `contrast(${contrastVal}%) brightness(${brightnessVal}%) blur(${blurVal}px)`;
    
    // Add grading tint adjustments using CSS filters
    if (settings.tint === 'noir') {
      // Classic Noir: grayscale murni + contrast & shadow sangat dalam, mirip film 35mm noir
      filterString = `grayscale(100%) contrast(${contrastVal}%) brightness(${brightnessVal}%) blur(${blurVal}px) saturate(0%)`;
    } else if (settings.tint === 'cool') {
      filterString += ` grayscale(100%) sepia(10%) hue-rotate(200deg) saturate(110%)`;
    } else if (settings.tint === 'warm') {
      // Warm Charcoal: grayscale + sepia hangat ringan, tonal graphite cokelat keabu-abuan
      filterString = `grayscale(85%) sepia(35%) contrast(${contrastVal}%) brightness(${brightnessVal}%) blur(${blurVal}px) saturate(60%)`;
    } else if (settings.tint === 'high-key') {
      // High Key Dream: grayscale terang, shadow diangkat, highlight dreamy, sedikit blur glow
      filterString = `grayscale(100%) contrast(${contrastVal}%) brightness(${brightnessVal}%) blur(${blurVal}px) saturate(0%)`;
    } else {
      // Neutral: grayscale bersih tanpa tint
      filterString += ` grayscale(100%)`;
    }

    return filterString;
  };

  return (
    <div id="interactive-grader" className="bg-black border border-zinc-800 p-6 rounded-2xl flex flex-col lg:flex-row gap-8 items-start w-full text-white font-sans">
      
      {/* LEFT: Live Video Monitor / Canvas Frame */}
      <div className="w-full lg:w-3/5 flex flex-col gap-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
            <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-400">LIVE MONITOR 01</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">LUT: {settings.tint.toUpperCase()}</span>
        </div>

        {/* Cinematic Frame */}
        <div className="relative aspect-[3/4] max-h-[720px] w-full bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl mx-auto">
          {/* Main Scenery Image with dynamically applied CSS Filters */}
          <img
            src={sceneImage}
            alt="Color grading simulator scene"
            className="w-full h-full object-cover object-top transition-all duration-300 pointer-events-none select-none"
            style={{ filter: getFilterStyle() }}
            referrerPolicy="no-referrer"
          />

          {/* Film Grain Noise Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0%25 0%25 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              opacity: settings.filmGrain / 100,
            }}
          />

          {/* Vignette Overlay */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              background: `radial-gradient(circle, transparent ${100 - settings.vignette}%, rgba(0,0,0,0.95) 100%)`,
            }}
          />

          {/* Viewfinder corner lines */}
          <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-white/40"></div>
          <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-white/40"></div>
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-white/40"></div>
          <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-white/40"></div>

          {/* Interactive Exposure meter display */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur border border-white/10 px-3 py-1 rounded text-[9px] font-mono flex items-center gap-2">
            <span className="text-zinc-500">-2</span>
            <span className="text-zinc-500">-1</span>
            <div className="flex gap-0.5 items-center">
              <div className={`w-1 h-2 ${settings.exposure < 80 ? 'bg-white' : 'bg-zinc-700'}`}></div>
              <div className={`w-1 h-3 ${settings.exposure >= 80 && settings.exposure < 110 ? 'bg-white' : 'bg-zinc-700'}`}></div>
              <div className={`w-1 h-2 ${settings.exposure >= 110 ? 'bg-white' : 'bg-zinc-700'}`}></div>
            </div>
            <span className="text-zinc-500">+1</span>
            <span className="text-zinc-500">+2</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 px-1">
          <span>COOKE ANAMORPHIC S2</span>
          <span>BLACK & WHITE SYSTEM 1.0</span>
        </div>
      </div>

      {/* RIGHT: Slider Control Deck */}
      <div className="w-full lg:w-2/5 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-white" />
            <h3 className="font-bold text-sm tracking-wider uppercase">Grading Panel</h3>
          </div>
          <button
            onClick={resetSettings}
            className="flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white transition-colors uppercase border border-zinc-800 hover:border-zinc-600 px-2.5 py-1.5 rounded-md"
          >
            <RefreshCw size={10} /> Reset
          </button>
        </div>

        {/* presets deck */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest flex items-center gap-1.5">
            <Layers size={11} /> Look Up Tables (LUT)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-2 gap-2 mt-1">
            {LUT_PRESETS.map((lut) => (
              <button
                key={lut.id}
                onClick={() => applyPreset(lut.id as any)}
                className={`p-2.5 text-left border rounded-lg transition-all text-xs flex flex-col justify-between ${
                  settings.tint === lut.id
                    ? 'border-white bg-white text-black'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold font-mono text-[10px]">{lut.name}</span>
                  {settings.tint === lut.id && <Check size={11} className="text-black" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders Deck */}
        <div className="flex flex-col gap-4 border-t border-zinc-900 pt-4 grow">
          <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
            Manual Color Corrector
          </span>

          {/* Slider: Contrast */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Contrast</span>
              <span className="text-white">{settings.contrast}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              value={settings.contrast}
              onChange={(e) => updateSetting('contrast', parseInt(e.target.value))}
              className="accent-white h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider: Exposure */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Exposure (Brightness)</span>
              <span className="text-white">{settings.exposure}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={settings.exposure}
              onChange={(e) => updateSetting('exposure', parseInt(e.target.value))}
              className="accent-white h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider: Film Grain */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Film Grain (Noise)</span>
              <span className="text-white">{settings.filmGrain}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="70"
              value={settings.filmGrain}
              onChange={(e) => updateSetting('filmGrain', parseInt(e.target.value))}
              className="accent-white h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider: Vignette */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Vignette (Corner Shadows)</span>
              <span className="text-white">{settings.vignette}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="85"
              value={settings.vignette}
              onChange={(e) => updateSetting('vignette', parseInt(e.target.value))}
              className="accent-white h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider: Blur (Depth-Of-Field) */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Aperture Depth-Of-Field (Blur)</span>
              <span className="text-white">{settings.blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              value={settings.blur}
              onChange={(e) => updateSetting('blur', parseInt(e.target.value))}
              className="accent-white h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Educational Info box */}
        <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg text-[10px] text-zinc-500 leading-relaxed font-mono">
          <div className="text-zinc-400 font-bold mb-1 flex items-center gap-1">
            <ZoomIn size={10} /> DKV INSIGHT:
          </div>
          Preset <strong className="text-zinc-300">Film Noir Klasik</strong> memaksimalkan kontras wajah vs background. <strong className="text-zinc-300">Mimpi Kunci Tinggi</strong> mengangkat seluruh shadow sehingga detail seragam terlihat. <strong className="text-zinc-300">Arang Hangat</strong> memberikan tonal graphite kecokelatan yang cocok untuk foto portrait natural.
        </div>
      </div>
    </div>
  );
}
