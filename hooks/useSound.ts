import { useCallback } from 'react';

// Singleton context to avoid creating multiple instances
let audioCtx: AudioContext | null = null;

export const useSound = () => {
  const initAudio = () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    // Resume context if suspended (common browser policy)
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  };

  const playClick = useCallback(() => {
    try {
      const ctx = initAudio();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }, []);

  const playHover = useCallback(() => {
    // Only play hover sounds if audio context is explicitly initialized and running
    // This prevents "AudioContext was prevented from starting" warnings on initial page load hover
    if (!audioCtx || audioCtx.state !== 'running') return;

    try {
      const ctx = audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Ignore audio errors
    }
  }, []);

  const playLevelUp = useCallback(() => {
    try {
      const ctx = initAudio();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Simple arpeggio: C4 - E4 - G4 - C5
      const notes = [523.25, 659.25, 783.99, 1046.50];
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + (i * 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

        osc.start(startTime);
        osc.stop(startTime + 0.1);
      });
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }, []);

  return { playClick, playHover, playLevelUp };
};

export const useGameSound = () => {
  const { playClick } = useSound(); // Re-use init logic if needed, but better to duplicate for simplicity or refactor.
  
  // Refactor: We need access to the same audioCtx singleton.
  // Ideally useSound should return all. I'll modify useSound above instead of creating new export.
  return {};
}

// ... actually I should just add it to the existing hook