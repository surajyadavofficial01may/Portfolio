/**
 * Web Audio API based 8-bit retro sound synthesizer
 * Zero external audio assets required; runs seamlessly in browser.
 */

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundManager = {
  isMuted: () => isMuted,
  setMuted: (muted: boolean) => {
    isMuted = muted;
    try {
      localStorage.setItem('suraj_audio_muted', muted ? '1' : '0');
    } catch {}
  },
  toggleMute: () => {
    isMuted = !isMuted;
    try {
      localStorage.setItem('suraj_audio_muted', isMuted ? '1' : '0');
    } catch {}
    return isMuted;
  },
  initFromStorage: () => {
    try {
      const stored = localStorage.getItem('suraj_audio_muted');
      if (stored !== null) {
        isMuted = stored === '1';
      }
    } catch {}
  },

  // Menu navigation blip
  playNavigate: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(520, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  },

  // 'A' button / Select chime
  playSelect: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
      osc.frequency.setValueAtTime(1046.5, now + 0.18); // C6
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.33);
    } catch {}
  },

  // 'B' button / Back sound
  playBack: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.15);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.16);
    } catch {}
  },

  // Jump sound
  playJump: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.14);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.15);
    } catch {}
  },

  // Coin / Gem collected sound
  playCoin: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.3);
    } catch {}
  },

  // Success fanfare (transmission sent)
  playSuccess: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + idx * 0.08;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.06, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.26);
      });
    } catch {}
  },
};
