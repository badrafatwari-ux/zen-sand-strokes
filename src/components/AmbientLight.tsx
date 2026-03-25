import React, { useEffect, useRef, useState } from 'react';

interface AmbientLightProps {
  active: boolean;
}

interface Orb {
  id: number;
  x: number;
  y: number;
  r: number;
  opacity: number;
  speed: number;
  angle: number;
  hue: number;
}

const NUM_ORBS = 5;

function makeOrb(id: number): Orb {
  return {
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: 15 + Math.random() * 25,
    opacity: 0.04 + Math.random() * 0.07,
    speed: 0.008 + Math.random() * 0.012,
    angle: Math.random() * Math.PI * 2,
    hue: 30 + Math.random() * 20,
  };
}

const AmbientLight: React.FC<AmbientLightProps> = ({ active }) => {
  const [orbs] = useState<Orb[]>(() =>
    Array.from({ length: NUM_ORBS }, (_, i) => makeOrb(i))
  );
  const rafRef   = useRef<number>(0);
  const stateRef = useRef<Orb[]>(orbs.map(o => ({ ...o })));
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!active) { cancelAnimationFrame(rafRef.current); return; }
    let last = 0;
    const loop = (t: number) => {
      if (t - last > 50) {
        stateRef.current = stateRef.current.map(orb => ({
          ...orb,
          angle: orb.angle + orb.speed * 0.5,
          x: orb.x + Math.cos(orb.angle) * 0.06,
          y: orb.y + Math.sin(orb.angle) * 0.04,
        }));
        forceUpdate(n => n + 1);
        last = t;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {stateRef.current.map(orb => (
        <div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            left:   `${orb.x}%`,
            top:    `${orb.y}%`,
            width:  `${orb.r}vw`,
            height: `${orb.r}vw`,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, hsl(${orb.hue} 55% 78% / ${orb.opacity * 1.5}), transparent 70%)`,
            filter: 'blur(8px)',
            transition: 'left 0.8s ease, top 0.8s ease',
          }}
        />
      ))}
    </div>
  );
};

export default AmbientLight;
