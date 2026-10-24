import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ExternalLink,
  Copy,
  Check,
  Film,
  Sparkles,
} from 'lucide-react';

export interface BragVideo {
  id: string;
  number: number;
  title: string;
  tagline: string;
  tone: string;
  duration: number; // in seconds
  aspectRatio: '16:9' | '9:16' | '1:1';
  musicFile: string;
  bgmPath: string;
  compositionPath: string;
  tags: string[];
  keyVisual: string;
  launchPost: string;
  storyboard: {
    time: string;
    label: string;
    description: string;
  }[];
}

export const BRAG_VIDEOS: BragVideo[] = [
  {
    id: 'anim1-amazon-launch',
    number: 1,
    title: 'The Amazon of 3D Printing Launch',
    tagline: 'What if Amazon was engineered from scratch for on-demand 3D printing?',
    tone: 'Polished',
    duration: 18,
    aspectRatio: '16:9',
    musicFile: 'Happy Beats Business Moves Vol. 1',
    bgmPath: '/assets/audio/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3',
    compositionPath: '/brag-output/anim1-amazon-launch/index.html',
    tags: ['#3DPrinting', '#HardwareStartup', '#AdditiveManufacturing', '#MadeInUSA', '#ProductLaunch'],
    keyVisual: 'Amazon Smile-Swoosh Logo Lockup + 4-Quad Department Cards + Parametric Customizer',
    launchPost: `What if Amazon was built from scratch for on-demand 3D printing?

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
    storyboard: [
      { time: '0.0s - 3.0s', label: 'Hook', description: 'Bold text: WHAT IF AMAZON WAS BUILT FOR 3D PRINTING? Wavezly amber logo locks into view.' },
      { time: '3.0s - 7.5s', label: 'The Departments', description: 'Amazon 4-Quad department cards fly in: Trending 3D, Kitchen, Electronics, Custom Studio (4.9 ★ 4,180 reviews).' },
      { time: '7.5s - 13.0s', label: 'The Additive Engine', description: 'Real-time 3D parametric customizer wireframe slicing + Boise Idaho farm telemetry HUD.' },
      { time: '13.0s - 18.0s', label: 'Prime Guarantee', description: '100% Fit Guarantee badge + 48-Hour Domestic Dispatch payoff lockup.' },
    ],
  },
  {
    id: 'anim2-viral-gadgets',
    number: 2,
    title: 'Trending 3D Toys & Viral Gadgets',
    tagline: 'Print-in-place articulation. Zero assembly. Straight to your doorstep.',
    tone: 'Chaotic / Viral TikTok',
    duration: 15,
    aspectRatio: '9:16',
    musicFile: 'Happy Beats Business Moves Vol. 10',
    bgmPath: '/assets/audio/happy-beats-business-moves-vol-10-by-ende-dot-app.mp3',
    compositionPath: '/brag-output/anim2-viral-gadgets/index.html',
    tags: ['#3DPrinting', '#FidgetToy', '#ArticulatedDragon', '#TikTokMadeMeBuyIt', '#PrintInPlace'],
    keyVisual: 'Silk Rainbow Articulated Dragon + Dual-Axis Gyro Cube + Low-Poly Planter',
    launchPost: `STOP SCROLLING: This was 3D printed in ONE single piece without assembly 🐉✨

No screws. No glue. 100% print-in-place articulation.

We hooked up high-speed 3D printers directly to an Amazon-style storefront.
Pick your finish (Silk Tri-Color Rainbow, Matte Sandstone, Carbon Black) and it lands on your doorstep in 48 hours.

Drop what we should print next in the replies 👇

Shop viral gadgets → wavezly.com/trending

#3DPrinting #FidgetToy #ArticulatedDragon #TikTokMadeMeBuyIt #Satisfying #OddlySatisfying #PrintInPlace`,
    storyboard: [
      { time: '0.0s - 2.5s', label: 'Alert Hook', description: 'Red warning: DO NOT BUY A 3D PRINTER! Articulated dragon leaps onto screen.' },
      { time: '2.5s - 6.5s', label: 'Dragon Articulation', description: 'Print-in-place multi-segment joints bend smoothly; 42 sold this hour ticker.' },
      { time: '6.5s - 10.5s', label: 'Kinetic Fidgets', description: 'Dual-Axis Gyro Cube spins at 60fps; Low-Poly self-watering planter drops in.' },
      { time: '10.5s - 15.0s', label: 'The Punchline', description: 'No calibration. No bed leveling. Just unbox and enjoy. Ships in 48h.' },
    ],
  },
  {
    id: 'anim3-measure-customizer',
    number: 3,
    title: 'Measure Anything in 3D',
    tagline: 'Stop settling for "almost fits". Custom millimeter-precision organizers in 30 seconds.',
    tone: 'App-Store Precision',
    duration: 16,
    aspectRatio: '16:9',
    musicFile: 'Happy Beats Business Moves Vol. 11',
    bgmPath: '/assets/audio/happy-beats-business-moves-vol-11-by-ende-dot-app.mp3',
    compositionPath: '/brag-output/anim3-measure-customizer/index.html',
    tags: ['#DeskSetup', '#OrganizationHacks', '#IKEAOrganizers', '#IKEAAlex', '#Productivity'],
    keyVisual: 'Tape Measure Snap + IKEA Alex Preset + Millimeter Tolerance Caliper HUD',
    launchPost: `The dirty secret of drawer organization:
"Standard sizes" never fit standard drawers. There’s always an awkward 1.5-inch gap where things slide around.

Wavezly fixed this with parametric code:
1. Enter your exact drawer dimensions (or tap your IKEA Alex preset)
2. Choose your slot matrix and wall thickness
3. We 3D print it to the exact millimeter in Boise, ID
4. Ships in 48 hours

100% Fit Guarantee: If it wiggles by even 1mm, we reprint it for free.

Design yours in 30 seconds → wavezly.com/customizer

#DeskSetup #OrganizationHacks #IKEAOrganizers #IKEAAlex #Productivity #MinimalistDesk #Workspace`,
    storyboard: [
      { time: '0.0s - 3.0s', label: 'Problem Hook', description: 'Tape measure animation: STOP SETTLING FOR ALMOST FITS.' },
      { time: '3.0s - 7.5s', label: 'IKEA Alex Preset', description: 'One-tap Alex selection: Width 295mm × Depth 524mm × Height 65mm.' },
      { time: '7.5s - 12.0s', label: 'Zero-Gap Mesh', description: 'Parametric grid locks into the drawer with 0.1mm tolerance.' },
      { time: '12.0s - 16.0s', label: 'Fit Guarantee', description: 'If it wiggles by 1mm, we reprint free. 100% Fit Guarantee.' },
    ],
  },
  {
    id: 'anim4-kitchen-asmr',
    number: 4,
    title: 'Kitchen & Home Reset ASMR',
    tagline: 'Sculpted cutlery slots, dedicated espresso valets, and zero rattle.',
    tone: 'Satisfying ASMR',
    duration: 18,
    aspectRatio: '1:1',
    musicFile: 'Happy Beats Business Moves Vol. 12',
    bgmPath: '/assets/audio/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3',
    compositionPath: '/brag-output/anim4-kitchen-asmr/index.html',
    tags: ['#KitchenReset', '#OrganizationASMR', '#CoffeeSetup', '#EspressoPorn', '#CleanTok'],
    keyVisual: 'Cutlery Matrix Drawer Slide + Barista Portafilter Dock + Basalt Coasters',
    launchPost: `Sunday Kitchen Reset ASMR 🧼☕✨

Say goodbye to loose cutlery rattling in drawers and espresso gear scattered across the counter.

• Wavezly Cutlery Matrix: Precision sculpted slots for every knife, spoon, and fork. Zero rattle.
• Barista Espresso Valet: Dedicated docks for 54mm/58mm portafilters, tampers, and WDT needles.
• Basalt Desk & Counter Coasters: Hydrophobic matte finish with magnetic drop-in alignment.

Made from food-safe, dishwasher-safe biopolymers.

Reset your space → wavezly.com/kitchen

#KitchenReset #OrganizationASMR #CoffeeSetup #EspressoPorn #CleanTok #HomeAesthetics #InteriorDetails`,
    storyboard: [
      { time: '0.0s - 3.0s', label: 'Before & After', description: 'Cluttered silverware drawer vs. sculpted Wavezly matrix.' },
      { time: '3.0s - 8.0s', label: 'Cutlery Lock-in', description: 'Chefs knives, soup spoons, salad forks nest without an ounce of wiggle.' },
      { time: '8.0s - 13.0s', label: 'Barista Valet', description: '58mm stainless portafilter + WDT needle dock neatly next to espresso machine.' },
      { time: '13.0s - 18.0s', label: 'Living Reset', description: 'Food-safe biopolymers. Dishwasher tested. Wavezly Home.' },
    ],
  },
  {
    id: 'anim5-wavezly-prime',
    number: 5,
    title: 'Wavezly Prime: Made in USA in 48 Hours',
    tagline: 'Traditional manufacturing takes 6 weeks. Wavezly Prime takes 48 hours.',
    tone: 'Cinematic Trailer',
    duration: 20,
    aspectRatio: '16:9',
    musicFile: 'Happy Beats Business Moves Vol. 9',
    bgmPath: '/assets/audio/happy-beats-business-moves-vol-9-by-ende-dot-app.mp3',
    compositionPath: '/brag-output/anim5-wavezly-prime/index.html',
    tags: ['#AmericanManufacturing', '#AdditiveManufacturing', '#LocalProduction', '#SupplyChain', '#Wavezly'],
    keyVisual: 'CoreXY Nozzle Glow + Boise Idaho Print Farm Telemetry + Domestic Map Dispatch',
    launchPost: `Global supply chains take 8 to 12 weeks.
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
    storyboard: [
      { time: '0.0s - 4.0s', label: 'Trailer Hook', description: 'Nozzle heat glow: TRADITIONAL MANUFACTURING TAKES 6 WEEKS. WE TAKE 48 HOURS.' },
      { time: '4.0s - 9.0s', label: 'The Print Farm', description: 'Boise Idaho automated studio: 250+ CoreXY units, 0.05mm layer precision.' },
      { time: '9.0s - 14.5s', label: 'Logistics Route', description: 'Door-to-door domestic route map with USPS Priority telemetry.' },
      { time: '14.5s - 20.0s', label: 'The Anthem', description: 'Wavezly Prime: The future of additive manufacturing is local. wavezly.com' },
    ],
  },
];

export const WavezlyBragReels: React.FC = () => {
  const [selectedAnim, setSelectedAnim] = useState<BragVideo>(BRAG_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(performance.now());

  // Handle play/pause and time updates
  useEffect(() => {
    let active = true;
    const tick = () => {
      if (!active) return;
      const now = performance.now();
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + delta * playbackSpeed;
          if (next >= selectedAnim.duration) {
            return 0; // Loop
          }
          return next;
        });
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };

    lastTickRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, selectedAnim.duration]);

  // Handle audio play/sync
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = playbackSpeed;
    if (isPlaying && !isMuted) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isMuted, playbackSpeed]);

  // Reset time on animation switch
  const handleSelectAnim = (anim: BragVideo) => {
    setSelectedAnim(anim);
    setCurrentTime(0);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (!isMuted) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const handleCopyPost = () => {
    navigator.clipboard.writeText(selectedAnim.launchPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val % (audioRef.current.duration || selectedAnim.duration);
    }
  };

  // Find active storyboard segment
  const activeStoryboardIndex = Math.min(
    Math.floor((currentTime / selectedAnim.duration) * selectedAnim.storyboard.length),
    selectedAnim.storyboard.length - 1
  );

  return (
    <section className="max-w-[1520px] mx-auto px-3 sm:px-6 mb-12">
      <div className="bg-[#131921] text-white rounded-lg border border-[#232f3e] shadow-xl overflow-hidden">
        {/* Top Header Strip */}
        <div className="bg-[#232f3e] px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#374151]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#febd69]/10 border border-[#febd69]/30 text-[#febd69]">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-[#febd69] bg-[#febd69]/10 px-2 py-0.5 rounded">
                  Wavezly Motion Studio
                </span>
                <span className="text-xs text-gray-400">• Hyperframes Engine</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 mt-0.5">
                5 Official X / TikTok Style Launch Animations
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyPost}
              className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded bg-[#374151] hover:bg-[#4b5563] text-gray-200 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Post Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy X Launch Post</span>
                </>
              )}
            </button>
            <a
              href={selectedAnim.compositionPath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] transition shadow-xs cursor-pointer"
            >
              <span>Full Screen</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Animation Tab Pills */}
        <div className="px-4 sm:px-8 py-3 bg-[#1a2332] border-b border-[#2d3748] flex items-center gap-2 overflow-x-auto scrollbar-none">
          {BRAG_VIDEOS.map((anim) => {
            const isSelected = selectedAnim.id === anim.id;
            return (
              <button
                key={anim.id}
                type="button"
                onClick={() => handleSelectAnim(anim)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#febd69] text-[#131921] shadow-md font-bold'
                    : 'bg-[#232f3e] text-gray-300 hover:bg-[#2d3748] hover:text-white'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  isSelected ? 'bg-[#131921] text-[#febd69]' : 'bg-[#374151] text-gray-300'
                }`}>
                  {anim.number}
                </span>
                <span>{anim.title}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                  isSelected ? 'bg-black/20 text-[#131921]' : 'bg-black/30 text-gray-400'
                }`}>
                  {anim.tone}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Studio Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left: The Motion Canvas / Player (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between bg-black/40 border-b lg:border-b-0 lg:border-r border-[#2d3748]">
            <div className="relative w-full rounded-lg overflow-hidden bg-[#0a0f18] border border-[#2d3748] shadow-inner aspect-video flex items-center justify-center">
              {/* Live Preview Screen */}
              <iframe
                title={selectedAnim.title}
                src={selectedAnim.compositionPath}
                className="w-full h-full border-0 pointer-events-auto"
                allow="autoplay"
              />

              {/* Aspect Ratio Badge */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-gray-300 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Hyperframes • {selectedAnim.aspectRatio}</span>
              </div>

              {/* Tone Badge */}
              <div className="absolute top-3 right-3 z-10 bg-[#ff9900]/90 text-black px-2.5 py-1 rounded text-[11px] font-black uppercase tracking-wider shadow-sm">
                Tone: {selectedAnim.tone}
              </div>
            </div>

            {/* Scrubber & Controls */}
            <div className="mt-4 bg-[#1a2332] p-4 rounded-lg border border-[#2d3748] space-y-3">
              {/* Timeline Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="text-[#febd69] font-bold">{currentTime.toFixed(1)}s</span>
                  <span>{selectedAnim.duration.toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={selectedAnim.duration}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-[#2d3748] rounded-lg appearance-none cursor-pointer accent-[#febd69]"
                />
              </div>

              {/* Playback Controls Row */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-md bg-[#febd69] hover:bg-[#f3a847] text-[#131921] transition cursor-pointer font-bold"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTime(0);
                      setIsPlaying(true);
                      if (audioRef.current) audioRef.current.currentTime = 0;
                    }}
                    className="p-2 rounded-md bg-[#232f3e] hover:bg-[#2d3748] text-gray-300 transition cursor-pointer"
                    title="Restart"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-md bg-[#232f3e] hover:bg-[#2d3748] text-gray-300 transition cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#febd69]" />}
                  </button>
                </div>

                {/* Speed Toggle */}
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span>Speed:</span>
                  {[1, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition cursor-pointer ${
                        playbackSpeed === spd
                          ? 'bg-[#febd69] text-[#131921]'
                          : 'bg-[#232f3e] text-gray-300 hover:bg-[#2d3748]'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hidden Audio Player for BGM */}
            <audio
              ref={audioRef}
              src={selectedAnim.bgmPath}
              loop
              preload="auto"
            />
          </div>

          {/* Right: Storyboard & X/Twitter Launch Post (5 cols) */}
          <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col justify-between bg-[#131921] space-y-6">
            {/* Storyboard Progression */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-gray-400">
                  Live Storyboard Beats
                </span>
                <span className="text-xs font-mono text-[#febd69]">
                  {selectedAnim.duration}s Cut
                </span>
              </div>

              <div className="space-y-2">
                {selectedAnim.storyboard.map((beat, idx) => {
                  const isActive = idx === activeStoryboardIndex;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded border transition ${
                        isActive
                          ? 'bg-[#1e293b] border-[#febd69] text-white shadow-md'
                          : 'bg-[#1a2332]/50 border-[#2d3748] text-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={`font-mono font-bold ${isActive ? 'text-[#febd69]' : 'text-gray-500'}`}>
                          {beat.time}
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                          isActive ? 'bg-[#febd69]/20 text-[#febd69]' : 'bg-black/30 text-gray-500'
                        }`}>
                          {beat.label}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed">
                        {beat.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Formatted X / Twitter Launch Post */}
            <div className="space-y-2 pt-2 border-t border-[#2d3748]">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-gray-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#febd69]" />
                  <span>X / Twitter Launch Post</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyPost}
                  className="text-xs text-[#febd69] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-3 bg-[#0a0f18] rounded border border-[#2d3748] text-xs font-mono text-gray-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {selectedAnim.launchPost}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
