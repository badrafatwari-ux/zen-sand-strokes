import { useRef, useState, useCallback, useEffect } from 'react';

export type SoundType = 'ocean' | 'wind' | 'chimes' | 'none';

export function useZenSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const [activeSound, setActiveSound] = useState<SoundType>('none');
  const [enabled, setEnabled] = useState(false);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return ctxRef.current;
  }, []);

  const stopAll = useCallback(() => {
    nodesRef.current.forEach(n => {
      try { (n as OscillatorNode).stop?.(); } catch {}
      try { n.disconnect(); } catch {}
    });
    nodesRef.current = [];
  }, []);

  const playOcean = useCallback((ctx: AudioContext) => {
    const bufSize = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = ctx.createGain();
    gain.gain.value = 0.35;

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    lfo.start();
    src.start();

    nodesRef.current.push(src, filter, lfo, lfoGain, gain);
  }, []);

  const playWind = useCallback((ctx: AudioContext) => {
    const bufSize = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 0.5;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 350;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = ctx.createGain();
    gain.gain.value = 0.22;

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    lfo.start();
    src.start();

    nodesRef.current.push(src, filter, lfo, lfoGain, gain);
  }, []);

  const scheduleChime = useCallback((ctx: AudioContext) => {
    const freqs = [523.25, 659.25, 783.99, 1046.50, 880, 698.46];
    const now = ctx.currentTime;
    const delay = Math.random() * 6 + 2;

    const freq = freqs[Math.floor(Math.random() * freqs.length)];
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, now + delay);
    env.gain.linearRampToValueAtTime(0.28, now + delay + 0.02);
    env.gain.exponentialRampToValueAtTime(0.001, now + delay + 2.5);

    osc.connect(env);
    env.connect(ctx.destination);
    osc.start(now + delay);
    osc.stop(now + delay + 2.5);
    nodesRef.current.push(osc, env);

    const timerId = setTimeout(() => scheduleChime(ctx), (delay + 2.5) * 1000 * 0.6);
    return timerId;
  }, []);

  const play = useCallback((sound: SoundType) => {
    stopAll();
    if (sound === 'none') { setActiveSound('none'); return; }
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    if (sound === 'ocean') playOcean(ctx);
    else if (sound === 'wind') playWind(ctx);
    else if (sound === 'chimes') scheduleChime(ctx);

    setActiveSound(sound);
  }, [stopAll, getCtx, playOcean, playWind, scheduleChime]);

  const toggle = useCallback((sound: SoundType) => {
    if (!enabled) {
      setEnabled(true);
      play(sound);
    } else if (activeSound === sound) {
      stopAll();
      setActiveSound('none');
    } else {
      play(sound);
    }
  }, [enabled, activeSound, play, stopAll]);

  useEffect(() => () => stopAll(), [stopAll]);

  return { activeSound, enabled, toggle, stopAll };
}
