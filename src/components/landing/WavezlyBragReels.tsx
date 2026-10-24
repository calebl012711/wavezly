/**
 * WAVEZLY BRAG REELS & X-STYLE LAUNCH ANIMATIONS SHOWCASE
 * Features 5 distinct high-converting launch animations built with /brag & Hyperframes:
 * 1. "The Amazon of 3D Printing Launch" (Tone: polished, 18s)
 * 2. "Trending 3D Toys & Viral Gadgets" (Tone: chaotic, 15s)
 * 3. "Measure Anything in 3D" (Tone: app-store, 16s)
 * 4. "Kitchen & Home Reset ASMR" (Tone: default, 18s)
 * 5. "Wavezly Prime: Made in USA in 48 Hours" (Tone: cinematic, 20s)
 *
 * Provides real-time scrubbing, play/pause, soundtrack audio playback,
 * speed adjustments, and instant 1-click X/Twitter share copy copy-to-clipboard.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Share2,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Tv,
} from 'lucide-react';
import { playClickSound } from '../../lib/soundEffects';

export interface BragReel {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  tone: 'polished' | 'chaotic' | 'app-store' | 'default' | 'cinematic';
  toneLabel: string;
  toneColor: string;
  aspect: '16:9' | '9:16' | '1:1';
  duration: number; // in seconds
  audioSrc: string;
  videoSrc?: string;
  features: string[];
  xCopy: string;
  tags: string[];
}

export const BRAG_REELS: BragReel[] = [
  {
    id: 'anim1-amazon-launch',
    number: 1,
    title: 'The Amazon of 3D Printing Launch',
    subtitle: 'Over 200,000 custom organizer variations & viral toys with 48-hour USA dispatch.',
    tone: 'polished',
    toneLabel: 'Polished Launch',
    toneColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    aspect: '16:9',
    duration: 18,
    audioSrc: '/assets/audio/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3',
    videoSrc: '/assets/videos/anim1-amazon-launch.mp4',
    features: [
      'Amazon dark navigation & Prime 48h badge',
      'Quad Department Cards with Lightning Deal ticker',
      'Boise, Idaho 250+ CoreXY Print Farm Telemetry',
      '100% Fit Guarantee & Slicing Engine',
    ],
    xCopy: `What if Amazon was built from scratch for on-demand 3D printing?

Meet @Wavezly. 🌊

Instead of cheap overseas injection molds that sit in warehouses for 6 months:
• 200,000+ custom modular organizers
• Real-time 3D parametric customizer (zero CAD required)
• High-speed USA print farm cluster in Boise, Idaho
• 48-hour door-to-door domestic dispatch
• 100% Fit Guarantee

Traditional manufacturing is officially obsolete.

Try the customizer live → wavezly.com

#3DPrinting #HardwareStartup #AdditiveManufacturing #MadeInUSA #ProductLaunch #IndustrialDesign`,
    tags: ['#3DPrinting', '#HardwareStartup', '#AdditiveManufacturing'],
  },
  {
    id: 'anim2-viral-gadgets',
    number: 2,
    title: 'Trending 3D Toys & Viral Gadgets',
    subtitle: 'Articulated Gem Dragon & Sensory Fidgets printed in one piece with zero assembly.',
    tone: 'chaotic',
    toneLabel: 'High-Retention TikTok',
    toneColor: 'bg-red-500/10 text-red-400 border-red-500/30',
    aspect: '9:16',
    duration: 15,
    audioSrc: '/assets/audio/happy-beats-business-moves-vol-10-by-ende-dot-app.mp3',
    videoSrc: '/assets/videos/anim2-viral-gadgets.mp4',
    features: [
      'Red alert hook: "DO NOT BUY A 3D PRINTER"',
      'Print-in-Place Multi-Segment Gem Dragon',
      'Kinetic Gyro Cube & Self-Watering Low-Poly Planters',
      'Rapid TikTok cuts with uppercase Impact titles',
    ],
    xCopy: `STOP SCROLLING: This was 3D printed in ONE single piece without assembly 🐉✨

No screws. No glue. 100% print-in-place articulation.

We hooked up high-speed 3D printers directly to an Amazon-style storefront.
Pick your finish (Silk Tri-Color Rainbow, Matte Sandstone, Carbon Black) and it lands on your doorstep in 48 hours.

Drop what we should print next in the replies 👇

Shop viral gadgets → wavezly.com/trending

#3DPrinting #FidgetToy #ArticulatedDragon #TikTokMadeMeBuyIt #Satisfying #OddlySatisfying #PrintInPlace`,
    tags: ['#TikTokMadeMeBuyIt', '#ArticulatedDragon', '#OddlySatisfying'],
  },
  {
    id: 'anim3-measure-customizer',
    number: 3,
    title: 'Measure Anything in 3D',
    subtitle: 'Millimeter-precise customizer for IKEA Alex drawers with 100% Fit Guarantee.',
    tone: 'app-store',
    toneLabel: 'App-Store Tech Demo',
    toneColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    aspect: '16:9',
    duration: 16,
    audioSrc: '/assets/audio/happy-beats-business-moves-vol-11-by-ende-dot-app.mp3',
    videoSrc: '/assets/videos/anim3-measure-customizer.mp4',
    features: [
      'Visualized 55mm dead gap problem',
      'IKEA Alex One-Tap Preset & slider animations',
      'Real-time parametric 3D grid wireframe',
      '100% Fit Guarantee zero-wiggle promise',
    ],
    xCopy: `The dirty secret of drawer organization:
"Standard sizes" never fit standard drawers. There’s always an awkward 1.5-inch gap where things slide around.

Wavezly fixed this with parametric code:
1. Enter your exact drawer dimensions (or tap your IKEA Alex preset)
2. Choose your slot matrix and wall thickness
3. We 3D print it to the exact millimeter in Boise, ID
4. Ships in 48 hours

100% Fit Guarantee: If it wiggles by even 1mm, we reprint it for free.

Design yours in 30 seconds → wavezly.com/customizer

#DeskSetup #OrganizationHacks #IKEAOrganizers #IKEAAlex #Productivity #MinimalistDesk #Workspace`,
    tags: ['#DeskSetup', '#OrganizationHacks', '#IKEAAlex'],
  },
  {
    id: 'anim4-kitchen-asmr',
    number: 4,
    title: 'Kitchen & Home Reset ASMR',
    subtitle: 'Zero-rattle Cutlery Matrix & Barista Espresso Valet drop-in satisfaction.',
    tone: 'default',
    toneLabel: 'Organization ASMR',
    toneColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    aspect: '16:9',
    duration: 18,
    audioSrc: '/assets/audio/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3',
    features: [
      'Deep sculpted Cutlery Matrix channels',
      'Food-safe & dishwasher-safe biopolymers',
      'Barista Espresso Valet with 54mm/58mm docks',
      'Basalt magnetic coasters zero-slip base',
    ],
    xCopy: `Sunday Kitchen Reset ASMR 🧼☕✨

Say goodbye to loose cutlery rattling in drawers and espresso gear scattered across the counter.

• Wavezly Cutlery Matrix: Precision sculpted slots for every knife, spoon, and fork. Zero rattle.
• Barista Espresso Valet: Dedicated docks for 54mm/58mm portafilters, tampers, and WDT needles.
• Basalt Desk & Counter Coasters: Hydrophobic matte finish with magnetic drop-in alignment.

Made from food-safe, dishwasher-safe biopolymers.

Reset your space → wavezly.com/kitchen

#KitchenReset #OrganizationASMR #CoffeeSetup #EspressoPorn #CleanTok #HomeAesthetics #InteriorDetails`,
    tags: ['#KitchenReset', '#OrganizationASMR', '#EspressoPorn'],
  },
  {
    id: 'anim5-wavezly-prime',
    number: 5,
    title: 'Wavezly Prime: Made in USA in 48 Hours',
    subtitle: 'Cinematic trailer exploring the Boise, Idaho automated additive print studio.',
    tone: 'cinematic',
    toneLabel: 'Cinematic Trailer',
    toneColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    aspect: '16:9',
    duration: 20,
    audioSrc: '/assets/audio/happy-beats-business-moves-vol-9-by-ende-dot-app.mp3',
    features: [
      'Trailer hook: "6 Weeks vs 48 Hours"',
      'Inside the Boise, Idaho 250+ unit print farm',
      'Domestic transit nodes: Sliced to Delivered in 48h',
      'Wavezly Prime Gold Crest & American Additive Anthem',
    ],
    xCopy: `Global supply chains take 8 to 12 weeks.
Wavezly Prime takes 48 hours.

Inside our Boise, Idaho print studio:
• 250+ automated CoreXY industrial 3D printers
• Aerospace-grade PETG and biodegradable biopolymers
• Continuous automated bed clearing and real-time AI optical inspection
• Shipped directly to your door via domestic Priority Mail

No overseas container ships. No minimum order quantities. No wasted warehouse stock.
Just pure additive precision on demand.

Welcome to Wavezly Prime.

Experience local manufacturing → wavezly.com

#AmericanManufacturing #AdditiveManufacturing #LocalProduction #SupplyChain #CoreXY #TechTrailer #Wavezly`,
    tags: ['#AmericanManufacturing', '#AdditiveManufacturing', '#CoreXY'],
  },
];

interface WavezlyBragReelsProps {
  onNavigateToCustomizer?: () => void;
  onNavigateToShop?: () => void;
}

export const WavezlyBragReels: React.FC<WavezlyBragReelsProps> = ({
  onNavigateToCustomizer,
  onNavigateToShop,
}) => {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5>(1);
  const [isMuted, setIsMuted] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'interactive' | 'video'>('interactive');

  const activeReel = BRAG_REELS[activeReelIndex];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Sync Audio playback with playback state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime;
      if (isPlaying && !isMuted) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted, activeReelIndex]);

  // Audio track change on reel switch
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(true);
  }, [activeReelIndex]);

  // Animation Loop / Time update
  useEffect(() => {
    const updateProgress = (timestamp: number) => {
      if (lastTimeRef.current != null && isPlaying) {
        const delta = (timestamp - lastTimeRef.current) / 1000;
        setCurrentTime((prev) => {
          const next = prev + delta * playbackSpeed;
          if (next >= activeReel.duration) {
            return 0; // Loop seamlessly
          }
          return next;
        });
      }
      lastTimeRef.current = timestamp;
      requestRef.current = requestAnimationFrame(updateProgress);
    };

    requestRef.current = requestAnimationFrame(updateProgress);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, playbackSpeed, activeReel.duration]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const togglePlay = () => {
    playClickSound();
    setIsPlaying(!isPlaying);
  };

  const handleCopyX = (reel: BragReel) => {
    playClickSound();
    navigator.clipboard.writeText(reel.xCopy);
    setCopiedId(reel.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Render Scene Graphics based on activeReel and currentTime
  const renderInteractiveScene = () => {
    const t = currentTime;

    if (viewMode === 'video' && activeReel.videoSrc) {
      return (
        <video
          src={activeReel.videoSrc}
          controls
          autoPlay={isPlaying}
          muted={isMuted}
          className="w-full h-full object-contain"
        />
      );
    }

    switch (activeReel.id) {
      case 'anim1-amazon-launch': {
        // 4 Phases: Hook (0-4.5s), Quad (4.5-9s), Engine (9-14s), Outro (14-18s)
        if (t < 4.5) {
          return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-radial from-slate-900 via-[#131921] to-black transition-all">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
                ✦ The Next Industrial Revolution
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight max-w-2xl">
                WHAT IF <span className="text-[#ff9900] drop-shadow-[0_0_25px_rgba(255,153,0,0.6)]">AMAZON</span> WAS BUILT FOR <span className="text-[#ff9900] drop-shadow-[0_0_25px_rgba(255,153,0,0.6)]">3D PRINTING</span>?
              </h2>
              <p className="text-zinc-400 mt-4 text-sm sm:text-base max-w-lg">
                Zero overseas molds. Direct USA additive manufacturing delivered in 48 hours.
              </p>
            </div>
          );
        } else if (t < 9.0) {
          return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-[#131921]">
              <div className="text-center mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  ⚡ Lightning Deals • 84% Claimed
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Trending 3D Departments
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl">
                {[
                  { title: 'Articulated Dragon', price: '$24.99', img: '/assets/products/crystal-dragon-hero.svg', tag: '#1 Best Seller' },
                  { title: 'IKEA Alex Matrix', price: '$38.00', img: '/assets/products/drawer-matrix-hero.svg', tag: 'Amazon Choice' },
                  { title: 'Barista Valet', price: '$38.00', img: '/assets/products/pourover-coffee-tray-hero.svg', tag: 'Kitchen Icon' },
                  { title: 'Gyro Cube', price: '$18.00', img: '/assets/products/gyro-cube-hero.svg', tag: 'Trending' },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-800/90 border border-slate-700 rounded-lg p-2.5 flex flex-col items-center shadow-lg transform transition hover:scale-105">
                    <span className="text-[10px] font-bold bg-[#b12704] text-white px-2 py-0.5 rounded self-start mb-1">
                      {item.tag}
                    </span>
                    <div className="w-20 h-20 bg-slate-900/60 rounded flex items-center justify-center my-1 overflow-hidden">
                      <img src={item.img} alt={item.title} className="max-w-[85%] max-h-[85%] object-contain" />
                    </div>
                    <span className="text-xs font-bold text-zinc-100 text-center truncate w-full">{item.title}</span>
                    <div className="flex items-center justify-between w-full mt-2">
                      <span className="text-xs font-extrabold text-amber-400">{item.price}</span>
                      <span className="text-[10px] font-black text-[#00a8e1]">Prime 48h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        } else if (t < 14.0) {
          return (
            <div className="w-full h-full flex flex-col sm:flex-row items-center justify-center p-6 gap-6 bg-[#0f172a]">
              <div className="flex-1 text-left space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  AUTOMATED SLICING ENGINE
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  ZERO CAD SKILLS.<br />
                  <span className="text-[#ff9900]">EXACT MILLIMETER FIT.</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Custom STL generated dynamically in your browser. Sliced directly for Boise Idaho print farm cluster.
                </p>
              </div>
              <div className="w-full sm:w-72 bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl font-mono text-xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-zinc-300">FARM TELEMETRY</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> ONLINE
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-800/80 p-2 rounded border border-slate-700/50">
                    <div className="text-lg font-black text-amber-400">250+</div>
                    <div className="text-[9px] text-zinc-400">CoreXY Units</div>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded border border-slate-700/50">
                    <div className="text-lg font-black text-sky-400">0.05mm</div>
                    <div className="text-[9px] text-zinc-400">Layer Precision</div>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded border border-slate-700/50">
                    <div className="text-lg font-black text-emerald-400">48h</div>
                    <div className="text-[9px] text-zinc-400">Domestic Ship</div>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded border border-slate-700/50">
                    <div className="text-lg font-black text-yellow-300">100%</div>
                    <div className="text-[9px] text-zinc-400">USA Made</div>
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-radial from-slate-900 to-black">
              <img src="/assets/logo/wavezly-logo.png" alt="Wavezly" className="h-14 sm:h-16 mb-3 object-contain drop-shadow-lg" />
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs uppercase tracking-wider mb-2">
                Wavezly Prime • Made in USA
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white max-w-xl leading-tight">
                THE FUTURE OF 3D PRINTING IS ON YOUR DOORSTEP.
              </h3>
              <button
                type="button"
                onClick={onNavigateToShop}
                className="mt-4 px-6 py-2.5 rounded-lg bg-[#ff9900] hover:bg-[#ffaa22] text-black font-extrabold text-sm shadow-[0_0_30px_rgba(255,153,0,0.5)] transition transform hover:scale-105"
              >
                Order Now at wavezly.com →
              </button>
            </div>
          );
        }
      }

      case 'anim2-viral-gadgets': {
        // Vertical 9:16 layout
        return (
          <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#1e1b4b] via-[#090d16] to-black text-center font-sans">
            <div className="w-full flex justify-between items-center text-xs font-bold text-zinc-300 border-b border-indigo-900/50 pb-3">
              <div className="flex items-center gap-1.5">
                <img src="/assets/logo/wavezly-logo.png" alt="Wavezly" className="h-5 w-auto" />
                <span className="text-white font-extrabold">WAVEZLY.COM</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[11px] animate-pulse">
                🔥 42 SOLD THIS HOUR
              </span>
            </div>

            {t < 4.0 ? (
              <div className="my-auto space-y-4">
                <div className="inline-block bg-red-600 text-white font-black text-sm uppercase px-4 py-1.5 rounded-md shadow-lg">
                  ⚠️ DO NOT BUY A 3D PRINTER ⚠️
                </div>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                  WE PRINT THE<br />
                  <span className="text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.6)]">COOLEST TOYS</span><br />
                  FOR YOU.
                </h2>
                <div className="w-40 h-40 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center p-2 animate-bounce">
                  <img src="/assets/products/crystal-dragon-hero.svg" alt="Crystal Dragon" className="w-full h-full object-contain" />
                </div>
              </div>
            ) : t < 8.0 ? (
              <div className="my-auto space-y-3">
                <span className="px-3 py-1 bg-yellow-400 text-black font-black text-xs rounded uppercase">
                  Articulated Gem Dragon
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white leading-tight">
                  PRINTED IN <span className="text-[#ff9900]">ONE PIECE</span>.<br />
                  ZERO ASSEMBLY.
                </h3>
                <div className="w-48 h-48 mx-auto flex items-center justify-center p-2">
                  <img src="/assets/products/crystal-dragon-hero.svg" alt="Crystal Dragon" className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(255,153,0,0.4)]" />
                </div>
                <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-2.5 text-xs text-zinc-300 space-y-1 max-w-xs mx-auto">
                  <div className="flex justify-between"><span>Material</span><strong className="text-amber-400">Silk Tri-Color PLA</strong></div>
                  <div className="flex justify-between"><span>Price</span><strong className="text-emerald-400">$24.99</strong></div>
                </div>
              </div>
            ) : (
              <div className="my-auto space-y-4">
                <div className="bg-amber-500 text-black font-black text-xs uppercase px-3 py-1 rounded">
                  NO CALIBRATION • NO JAMS
                </div>
                <h3 className="text-3xl font-black uppercase text-white leading-tight">
                  JUST UNBOX<br />
                  AND <span className="text-yellow-300">PLAY</span>.
                </h3>
                <div className="flex justify-center gap-4">
                  <div className="w-24 h-24 bg-slate-900 rounded-lg p-2 border border-slate-700">
                    <img src="/assets/products/gyro-cube-hero.svg" alt="Gyro" className="w-full h-full object-contain" />
                  </div>
                  <div className="w-24 h-24 bg-slate-900 rounded-lg p-2 border border-slate-700">
                    <img src="/assets/products/low-poly-planter-hero.svg" alt="Planter" className="w-full h-full object-contain" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onNavigateToShop}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-base uppercase shadow-xl hover:scale-105 transition"
                >
                  SHOP ON WAVEZLY.COM →
                </button>
              </div>
            )}

            <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
              🚀 48-Hour Domestic USA Dispatch
            </div>
          </div>
        );
      }

      case 'anim3-measure-customizer': {
        return (
          <div className="w-full h-full flex flex-col sm:flex-row items-center justify-center p-6 gap-6 bg-gradient-to-br from-[#090d16] to-[#1e293b]">
            <div className="flex-1 space-y-3 text-left">
              <span className="px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/40 text-sky-400 text-xs font-bold uppercase tracking-wider">
                Parametric Customizer
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                STOP SETTLING FOR <span className="text-red-400">"ALMOST FITS"</span>.
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enter your exact drawer millimeters (or pick IKEA Alex presets). 3D parametric engine generates zero-wiggle divider trays.
              </p>
              <div className="bg-slate-900/90 border border-slate-700 rounded-lg p-3 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-zinc-400"><span>Width (X)</span><span className="text-sky-400 font-bold">295 mm</span></div>
                <div className="flex justify-between text-zinc-400"><span>Depth (Y)</span><span className="text-sky-400 font-bold">524 mm</span></div>
                <div className="flex justify-between text-zinc-400"><span>Height (Z)</span><span className="text-sky-400 font-bold">65 mm</span></div>
              </div>
            </div>

            <div className="w-full sm:w-80 h-56 bg-slate-950 border-2 border-sky-500 rounded-xl flex flex-col items-center justify-center p-4 relative shadow-[0_0_40px_rgba(56,189,248,0.2)]">
              <div className="grid grid-cols-3 grid-rows-2 gap-2 w-48 h-32 border-2 border-amber-500 rounded p-2 bg-amber-500/5">
                {[1, 2, 3, 4, 5, 6].map((cell) => (
                  <div key={cell} className="border border-dashed border-amber-400/50 rounded flex items-center justify-center text-[10px] text-amber-300 font-bold">
                    Slot {cell}
                  </div>
                ))}
              </div>
              <div className="absolute bottom-2 text-[10px] text-zinc-400 font-mono">
                Tolerance: <strong className="text-sky-400">±0.1 mm</strong> • Slicing: <strong className="text-emerald-400">Live</strong>
              </div>
            </div>
          </div>
        );
      }

      case 'anim4-kitchen-asmr': {
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-radial from-slate-900 to-[#0f172a]">
            <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/40 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
              ✨ Kitchen Reset ASMR
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight max-w-lg mb-4">
              THE MOST <span className="text-[#ff9900]">SATISFYING</span> ZERO-RATTLE RESET.
            </h3>
            <div className="flex justify-center gap-4 w-full max-w-md">
              <div className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl p-3 flex flex-col items-center">
                <img src="/assets/products/kitchen-cutlery-matrix-hero.svg" alt="Cutlery" className="h-24 object-contain mb-2" />
                <span className="text-xs font-bold text-white">Cutlery Matrix</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Zero Rattle • Food Safe</span>
              </div>
              <div className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl p-3 flex flex-col items-center">
                <img src="/assets/products/pourover-coffee-tray-real.jpg" alt="Barista Valet" className="h-24 w-full object-cover rounded mb-2" />
                <span className="text-xs font-bold text-white">Barista Valet</span>
                <span className="text-[10px] text-amber-400 font-semibold">54mm/58mm Recesses</span>
              </div>
            </div>
          </div>
        );
      }

      case 'anim5-wavezly-prime':
      default: {
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-radial from-blue-950 via-[#050811] to-black relative">
            <span className="text-xs font-extrabold tracking-widest text-[#ff9900] uppercase mb-2">
              WAVEZLY PRIME MANIFESTO
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white max-w-xl leading-tight">
              GLOBAL SUPPLY CHAINS TAKE <span className="text-amber-400">6 WEEKS</span>.<br />
              WAVEZLY TAKES <span className="text-yellow-300">48 HOURS</span>.
            </h3>
            <div className="flex items-center justify-center gap-6 mt-4 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Boise Idaho Studio
              </div>
              <div>•</div>
              <div>250+ CoreXY Printers</div>
              <div>•</div>
              <div className="text-sky-400 font-bold">100% Domestic</div>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <section className="max-w-[1520px] mx-auto px-3 sm:px-6 mb-12">
      {/* Hidden audio element for synchronous soundtrack preview */}
      <audio ref={audioRef} src={activeReel.audioSrc} preload="auto" loop />

      {/* Container Box */}
      <div className="bg-[#131921] border border-[#232f3e] rounded-sm p-4 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-[#ff9900] text-black uppercase tracking-wider">
                X / TIKTOK LAUNCH ENGINE
              </span>
              <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Powered by /brag & Hyperframes
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Wavezly Viral Launch Animations
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-2xl">
              5 high-converting, motion-graphics launch variations engineered for X (Twitter), TikTok, and Reels.
              Scrub timelines, toggle soundtracks, and copy viral share copy in one click.
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex items-center gap-2.5">
            {onNavigateToCustomizer && (
              <button
                type="button"
                onClick={onNavigateToCustomizer}
                className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Sliders className="w-3.5 h-3.5" /> Launch Customizer
              </button>
            )}
            <button
              type="button"
              onClick={() => handleCopyX(activeReel)}
              className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              {copiedId === activeReel.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied X Post!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" /> Copy X Launch Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* 5 Reel Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 my-6">
          {BRAG_REELS.map((reel, idx) => {
            const isCurrent = idx === activeReelIndex;
            return (
              <button
                key={reel.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveReelIndex(idx);
                }}
                className={`p-3 rounded-lg border text-left transition relative flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-[#232f3e] border-[#ff9900] shadow-[0_0_20px_rgba(255,153,0,0.2)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black text-zinc-400">REEL 0{reel.number}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${reel.toneColor}`}>
                      {reel.tone}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{reel.title}</h4>
                </div>
                <div className="flex items-center justify-between mt-3 text-[10px] text-zinc-400">
                  <span>{reel.aspect}</span>
                  <span className="font-mono text-amber-400 font-semibold">{reel.duration}s</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Stage Grid: Player on Left, Telemetry & Share Copy on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Player Preview Screen (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col bg-black rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
            {/* Screen Header Bar */}
            <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                <span className="text-xs font-mono text-zinc-400 ml-2">
                  {activeReel.id} • {activeReel.aspect}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {activeReel.videoSrc && (
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setViewMode(viewMode === 'interactive' ? 'video' : 'interactive');
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border transition ${
                      viewMode === 'video'
                        ? 'bg-amber-500 text-black border-amber-400'
                        : 'bg-slate-800 text-zinc-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Tv className="w-3 h-3" />
                    <span>{viewMode === 'video' ? 'MP4 Video' : 'Live Reel'}</span>
                  </button>
                )}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                  {formatSeconds(currentTime)} / {formatSeconds(activeReel.duration)}
                </span>
              </div>
            </div>

            {/* Video / Interactive Canvas Box */}
            <div
              className={`relative w-full overflow-hidden flex items-center justify-center select-none ${
                activeReel.aspect === '9:16' ? 'h-[460px] sm:h-[520px]' : 'h-[360px] sm:h-[420px]'
              }`}
            >
              {renderInteractiveScene()}
            </div>

            {/* Controls Toolbar */}
            <div className="bg-slate-900 border-t border-slate-800 p-3 sm:p-4 space-y-3">
              {/* Scrub Slider */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-zinc-400 w-10 text-right">
                  {formatSeconds(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={activeReel.duration}
                  step="0.05"
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 accent-[#ff9900] h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono text-zinc-400 w-10">
                  {formatSeconds(activeReel.duration)}
                </span>
              </div>

              {/* Bottom Buttons Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-2 rounded-lg bg-[#ff9900] hover:bg-[#ffaa22] text-black font-bold transition cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setCurrentTime(0);
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-zinc-300 transition cursor-pointer"
                    title="Rewind"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Audio Soundtrack Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setIsMuted(!isMuted);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      !isMuted
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                    title="Toggle Soundtrack"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{isMuted ? 'Muted' : 'Sound On'}</span>
                  </button>

                  {/* Playback Speed */}
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setPlaybackSpeed((prev) => (prev === 1 ? 1.25 : prev === 1.25 ? 1.5 : 1));
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-zinc-300 text-xs font-mono font-bold transition cursor-pointer"
                  >
                    {playbackSpeed}x
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="hidden sm:inline">Tone:</span>
                  <span className="font-bold text-zinc-200 uppercase">{activeReel.tone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reel Metadata, Features & Share Copy Drawer (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Story & Specifications Card */}
            <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${activeReel.toneColor}`}>
                  {activeReel.toneLabel}
                </span>
                <span className="text-xs text-zinc-400 font-mono">Hyperframes v0.8</span>
              </div>
              <h3 className="text-lg font-bold text-white">{activeReel.title}</h3>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{activeReel.subtitle}</p>

              <div className="mt-4 pt-3 border-t border-slate-700/80">
                <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider block mb-2">
                  Composition Beats & Highlights
                </span>
                <ul className="space-y-1.5">
                  {activeReel.features.map((feat, i) => (
                    <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* X / Twitter Launch Copy Card with 1-Click Copy */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#1d9bf0] flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" /> X / Twitter Launch Post
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Ready to Broadcast</span>
                </div>
                <div className="bg-black/60 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {activeReel.xCopy}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1">
                  {activeReel.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] text-sky-400 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyX(activeReel)}
                  className="px-4 py-2 rounded-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer"
                >
                  {copiedId === activeReel.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
