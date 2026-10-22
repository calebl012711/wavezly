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
