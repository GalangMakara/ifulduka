export interface Project {
  id: string;
  title: string;
  category: 'Dokumentasi' | 'Event' | 'Kegiatan Sekolah' | 'Seni & Budaya';
  year: string;
  client: string;
  role: string;
  camera: string;
  lens: string;
  description: string;
  story: string;
  thumbnail: string;
  videoSrc: string;
  stills: string[];
  colorPalette: string[];
  aspectRatio: string;
  duration: string;
  featured?: boolean;
}

export interface StoryboardShot {
  id: string;
  type: string;
  description: string;
  angle: string;
  framing: string;
  imageSeed: string;
}

export interface GraderSettings {
  contrast: number;
  exposure: number;
  filmGrain: number;
  vignette: number;
  blur: number;
  tint: 'neutral' | 'cool' | 'warm' | 'high-key' | 'noir';
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}
