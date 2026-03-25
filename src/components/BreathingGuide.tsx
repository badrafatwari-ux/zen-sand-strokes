import React, { useEffect, useState } from 'react';

interface BreathingGuideProps {
  active: boolean;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

const PHASES: { phase: Phase; duration: number; label: string; scale: number }[] = [
  { phase: 'inhale', duration: 4000, label: 'Breathe in…',   scale: 1.55 },
  { phase: 'hold',   duration: 2000, label: 'Hold…',          scale: 1.55 },
  { phase: 'exhale', duration: 5000, label: 'Breathe out…',  scale: 1.0  },
  { phase: 'rest',   duration: 1000, label: '',               scale: 1.0  },
];

const BreathingGuide: React.FC<BreathingGuideProps> = ({ active }) => {
  const [phaseIdx, setPhaseIdx] = useState(0);

  useEffect(() => {
    if (!active) { setPhaseIdx(0); return; }
    const current = PHASES[phaseIdx];
    const timer = setTimeout(() => {
      setPhaseIdx(i => (i + 1) % PHASES.length);
    }, current.duration);
    return () => clearTimeout(timer);
  }, [active, phaseIdx]);

  if (!active) return null;

  const current = PHASES[phaseIdx];

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-30">
      <div className="flex flex-col items-center gap-5">
        {/* Ring */}
        <div
          className="rounded-full border-2 transition-all duration-[3000ms] ease-in-out"
          style={{
            width: 100,
            height: 100,
            transform: `scale(${current.scale})`,
            borderColor: 'hsl(var(--amber-accent) / 0.6)',
            background: `radial-gradient(circle, hsl(var(--warm-glow) / 0.18), transparent)`,
            boxShadow: `0 0 ${current.scale > 1.2 ? 30 : 10}px hsl(var(--warm-glow) / 0.3)`,
            transitionDuration: `${current.duration * 0.9}ms`,
          }}
        />
        {/* Label */}
        <p
          className="font-display text-lg tracking-widest transition-opacity duration-700"
          style={{
            color: 'hsl(var(--foreground) / 0.45)',
            opacity: current.label ? 1 : 0,
            letterSpacing: '0.12em',
          }}
        >
          {current.label}
        </p>
      </div>
    </div>
  );
};

export default BreathingGuide;
