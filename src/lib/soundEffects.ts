/**
 * FORMGRID TACTILE AUDIO & HAPTIC SYSTEM
 * Zero-dependency Web Audio API procedural sound synthesis.
 * Emulates Dieter Rams / Braun tactile microswitches, rotary encoders,
 * precision relays, and industrial laboratory confirmations.
 */

export type SoundType =
  | 'tick'
  | 'snap'
  | 'success'
  | 'toggle'
  | 'tab'
  | 'cart'
  | 'download';

const STORAGE_KEY = 'formgrid_audio_muted';
const MUTE_EVENT = 'formgrid:audio-mute-change';

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let lastTickTime = 0;

/**
 * Safely initialize or return the shared singleton AudioContext.
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return null;

    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(1.0, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }

  // Resume context if browser suspended it due to autoplay policies
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {
      // Ignored if user hasn't interacted yet
    });
  }

  return audioCtx;
}

/**
 * Check if the global sound system is muted.
 */
export function isSoundMuted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'true';
  } catch {
    return false;
  }
}

/**
 * Set the global mute state and persist to localStorage.
 */
export function setSoundMuted(muted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, muted ? 'true' : 'false');
    window.dispatchEvent(
      new CustomEvent(MUTE_EVENT, { detail: { muted } })
    );
  } catch {
    // Local storage unavailable
  }
}

/**
 * Toggle the global sound mute state.
 * @returns {boolean} The new mute state (true = muted, false = unmuted).
 */
export function toggleSoundMute(): boolean {
  const nextState = !isSoundMuted();
  setSoundMuted(nextState);
  if (!nextState) {
    // Play an immediate affirmation snap when unmuting
    playClickSound('snap');
  }
  return nextState;
}

/**
 * Subscribe to mute state changes across components.
 */
export function subscribeToMuteState(callback: (muted: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => {
    const custom = e as CustomEvent<{ muted: boolean }>;
    callback(custom.detail?.muted ?? isSoundMuted());
  };

  window.addEventListener(MUTE_EVENT, handler);
  return () => {
    window.removeEventListener(MUTE_EVENT, handler);
  };
}

/**
 * Procedural synthesizers for Dieter Rams / Braun tactile microswitches.
 */

/**
 * Synthesizes a rapid micro-tick (~14ms) for slider ratchets and micro-steppers.
 * Frequency sweep 2400Hz -> 380Hz with snappy exponential decay.
 */
function synthesizeTick(ctx: AudioContext, destination: AudioNode): void {
  const now = ctx.currentTime;

  // Rate-limit micro-ticks to 20ms to prevent buffer buzzing during high-speed drag
  if (now - lastTickTime < 0.02) return;
  lastTickTime = now;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  // Bandpass filter to give plastic-on-metal microswitch enclosure resonance
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1800, now);
  filter.Q.setValueAtTime(2.2, now);

  // Fast downward frequency sweep
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(2600, now);
  osc.frequency.exponentialRampToValueAtTime(320, now + 0.013);

  // Short 14ms exponential decay envelope
  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.014);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  osc.start(now);
  osc.stop(now + 0.015);
}

/**
 * Synthesizes a tactile leaf-spring snap (~18ms) for tab switches and toggles.
 * Dual-stage transient: initial contact click + housing bottom-out resonance.
 */
function synthesizeSnap(ctx: AudioContext, destination: AudioNode): void {
  const now = ctx.currentTime;

  // Stage 1: Sharp contact transient (0 - 8ms)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  const filter1 = ctx.createBiquadFilter();

  filter1.type = 'highpass';
  filter1.frequency.setValueAtTime(800, now);

  osc1.type = 'square';
  osc1.frequency.setValueAtTime(1400, now);
  osc1.frequency.exponentialRampToValueAtTime(300, now + 0.01);

  gain1.gain.setValueAtTime(0.2, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

  osc1.connect(filter1);
  filter1.connect(gain1);
  gain1.connect(destination);

  osc1.start(now);
  osc1.stop(now + 0.013);

  // Stage 2: Mechanical bottom-out body click (3ms - 18ms)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(420, now + 0.003);
  osc2.frequency.exponentialRampToValueAtTime(90, now + 0.018);

  gain2.gain.setValueAtTime(0, now);
  gain2.gain.setValueAtTime(0.15, now + 0.003);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

  osc2.connect(gain2);
  gain2.connect(destination);

  osc2.start(now + 0.003);
  osc2.stop(now + 0.022);
}

/**
 * Synthesizes a refined industrial confirmation tone (~140ms).
 * Initial tactile latch followed by dual-harmonic sine affirmation (587Hz + 880Hz).
 */
function synthesizeSuccess(ctx: AudioContext, destination: AudioNode): void {
  const now = ctx.currentTime;

  // Initial mechanical latch snap
  synthesizeSnap(ctx, destination);

  // Harmonic affirmation chime (Braun ET66 aesthetic, damped precision sine)
  // First harmonic (D5 ~587Hz)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(587.33, now + 0.015);

  gain1.gain.setValueAtTime(0, now);
  gain1.gain.setValueAtTime(0.12, now + 0.015);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc1.connect(gain1);
  gain1.connect(destination);
  osc1.start(now + 0.015);
  osc1.stop(now + 0.13);

  // Second harmonic chime (A5 ~880Hz)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(880, now + 0.045);

  gain2.gain.setValueAtTime(0, now);
  gain2.gain.setValueAtTime(0.1, now + 0.045);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

  osc2.connect(gain2);
  gain2.connect(destination);
  osc2.start(now + 0.045);
  osc2.stop(now + 0.17);
}

/**
 * Synthesizes a high-frequency soft ceramic tap (~40ms).
 * Acoustic signature: dual high-frequency sinusoidal ring (3400Hz + 5600Hz)
 * passing through a bandpass filter with snappy exponential decay.
 */
function synthesizeCeramicTap(ctx: AudioContext, destination: AudioNode): void {
  const now = ctx.currentTime;

  // Primary ceramic fundamental resonance (~3400Hz)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  const filter1 = ctx.createBiquadFilter();

  filter1.type = 'bandpass';
  filter1.frequency.setValueAtTime(3400, now);
  filter1.Q.setValueAtTime(3.8, now);

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(3400, now);
  osc1.frequency.exponentialRampToValueAtTime(3100, now + 0.04);

  gain1.gain.setValueAtTime(0.18, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc1.connect(filter1);
  filter1.connect(gain1);
  gain1.connect(destination);

  osc1.start(now);
  osc1.stop(now + 0.045);

  // Secondary high ceramic overtone (~5600Hz) for crystalline surface clink
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(5600, now);
  osc2.frequency.exponentialRampToValueAtTime(4900, now + 0.025);

  gain2.gain.setValueAtTime(0.09, now);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

  osc2.connect(gain2);
  gain2.connect(destination);

  osc2.start(now);
  osc2.stop(now + 0.03);
}

/**
 * Synthesizes a smooth mechanical wood gliding sound (~220ms).
 * Simulates solid Scandinavian oak drawer on precision ball-bearing runners.
 *
 * @param {boolean} isOpen - Whether drawer is sliding open or closed.
 */
function synthesizeWoodSlide(ctx: AudioContext, destination: AudioNode, isOpen: boolean): void {
  const now = ctx.currentTime;
  const duration = 0.22;

  // 1. Procedural friction noise for wood slide contact
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.Q.setValueAtTime(2.4, now);

  const noiseGain = ctx.createGain();

  if (isOpen) {
    // Sliding open: gentle glide acceleration, filter sweeps 420Hz -> 620Hz
    bandpass.frequency.setValueAtTime(420, now);
    bandpass.frequency.exponentialRampToValueAtTime(620, now + duration * 0.7);

    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  } else {
    // Sliding closed: deceleration glide into flush closure, filter sweeps 650Hz -> 360Hz
    bandpass.frequency.setValueAtTime(650, now);
    bandpass.frequency.exponentialRampToValueAtTime(360, now + duration * 0.75);

    noiseGain.gain.setValueAtTime(0.13, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  }

  noise.connect(bandpass);
  bandpass.connect(noiseGain);
  noiseGain.connect(destination);

  noise.start(now);
  noise.stop(now + duration);

  // 2. Wood drawer acoustic box body resonance (160Hz - 220Hz low warmth)
  const woodBodyOsc = ctx.createOscillator();
  const woodBodyGain = ctx.createGain();

  woodBodyOsc.type = 'triangle';
  woodBodyOsc.frequency.setValueAtTime(isOpen ? 190 : 220, now);
  woodBodyOsc.frequency.exponentialRampToValueAtTime(isOpen ? 140 : 120, now + duration * 0.85);

  woodBodyGain.gain.setValueAtTime(0.07, now);
  woodBodyGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.85);

  woodBodyOsc.connect(woodBodyGain);
  woodBodyGain.connect(destination);

  woodBodyOsc.start(now);
  woodBodyOsc.stop(now + duration);

  // 3. Tactile bottom-out / latch thud at completion
  const latchTime = now + (isOpen ? 0.16 : 0.17);
  const latchOsc = ctx.createOscillator();
  const latchGain = ctx.createGain();

  latchOsc.type = 'sine';
  latchOsc.frequency.setValueAtTime(isOpen ? 240 : 160, latchTime);
  latchOsc.frequency.exponentialRampToValueAtTime(isOpen ? 110 : 80, latchTime + 0.035);

  latchGain.gain.setValueAtTime(0, now);
  latchGain.gain.setValueAtTime(isOpen ? 0.09 : 0.14, latchTime);
  latchGain.gain.exponentialRampToValueAtTime(0.001, latchTime + 0.038);

  latchOsc.connect(latchGain);
  latchGain.connect(destination);

  latchOsc.start(latchTime);
  latchOsc.stop(latchTime + 0.04);
}

/**
 * Primary API: Play a crisp tactile audio feedback event.
 *
 * @param {'tick' | 'snap' | 'success' | 'toggle' | 'tab' | 'cart' | 'download'} type
 */
export function playClickSound(type: SoundType = 'tick'): void {
  if (isSoundMuted()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return;

    switch (type) {
      case 'tick':
        synthesizeTick(ctx, masterGain);
        break;
      case 'snap':
      case 'toggle':
      case 'tab':
        synthesizeSnap(ctx, masterGain);
        break;
      case 'success':
      case 'cart':
      case 'download':
        synthesizeSuccess(ctx, masterGain);
        break;
      default:
        synthesizeTick(ctx, masterGain);
        break;
    }
  } catch (err) {
    // Non-blocking fallback for browsers restricting audio
    console.debug('[AudioSystem] Audio playback blocked or uninitialized:', err);
  }
}

/**
 * Play a smooth mechanical wood gliding sound when the desk drawer slides open or closed.
 * Synthesizes procedural wood-on-wood and precision runner friction + bottom-out latch.
 *
 * @param {boolean} isOpen - True if opening drawer forward, false if sliding flush shut.
 */
export function playDrawerSlideSound(isOpen: boolean): void {
  if (isSoundMuted()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return;
    synthesizeWoodSlide(ctx, masterGain, isOpen);
  } catch (err) {
    console.debug('[AudioSystem] Drawer slide audio blocked:', err);
  }
}

/**
 * Play a crisp tactile mechanical click when a new preset or dimension stepper is pressed.
 * Emulates Dieter Rams / Braun microswitch detent with instant tactile confirmation.
 */
export function playSnapPresetSound(): void {
  if (isSoundMuted()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return;
    synthesizeSnap(ctx, masterGain);
  } catch (err) {
    console.debug('[AudioSystem] Snap preset audio blocked:', err);
  }
}

/**
 * Play a high-frequency soft ceramic tap when a material finish or resin swatch is clicked.
 * Acoustic profile: dual-mode high-Q resonant glass/ceramic surface clink.
 */
export function playMaterialSwitchSound(): void {
  if (isSoundMuted()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return;
    synthesizeCeramicTap(ctx, masterGain);
  } catch (err) {
    console.debug('[AudioSystem] Material tap audio blocked:', err);
  }
}

