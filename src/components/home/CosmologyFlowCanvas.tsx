import * as React from 'react';
import { BLEACH_REALMS } from './realmData';

interface CosmologyFlowCanvasProps {
  velocityRef: React.MutableRefObject<number>;
  progressRef: React.MutableRefObject<number>;
}

interface FlowParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
  kind: 'droplet' | 'mote' | 'streak';
}

interface WaterRibbon {
  xRatio: number;
  amplitude: number;
  wavelength: number;
  speed: number;
  width: number;
  phase: number;
  alpha: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function sampleRealmColors(progress: number): {
  primary: [number, number, number];
  secondary: [number, number, number];
} {
  const count = BLEACH_REALMS.length;
  const scaled = Math.min(count - 1, Math.max(0, progress * (count - 1)));
  const idx = Math.floor(scaled);
  const nextIdx = Math.min(count - 1, idx + 1);
  const t = scaled - idx;
  // Smoothstep for silkier color transitions between realms
  const s = t * t * (3 - 2 * t);

  const a = BLEACH_REALMS[idx];
  const b = BLEACH_REALMS[nextIdx];

  return {
    primary: [
      Math.round(lerp(a.accentRgb[0], b.accentRgb[0], s)),
      Math.round(lerp(a.accentRgb[1], b.accentRgb[1], s)),
      Math.round(lerp(a.accentRgb[2], b.accentRgb[2], s)),
    ],
    secondary: [
      Math.round(lerp(a.secondaryRgb[0], b.secondaryRgb[0], s)),
      Math.round(lerp(a.secondaryRgb[1], b.secondaryRgb[1], s)),
      Math.round(lerp(a.secondaryRgb[2], b.secondaryRgb[2], s)),
    ],
  };
}

export function CosmologyFlowCanvas({
  velocityRef,
  progressRef,
}: CosmologyFlowCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Subtle pointer wake (like trailing a hand in flowing water)
    const pointer = { x: -9999, y: -9999, smoothX: -9999, smoothY: -9999, active: false };
    const handlePointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const handlePointerLeave = () => {
      pointer.active = false;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // Flowing vertical water / Reishi ribbons framing the page edges & central spine
    const ribbons: WaterRibbon[] = [
      { xRatio: 0.055, amplitude: 22, wavelength: 340, speed: 0.95, width: 1.6, phase: 0.2, alpha: 0.2 },
      { xRatio: 0.095, amplitude: 16, wavelength: 260, speed: 1.25, width: 1.0, phase: 2.1, alpha: 0.14 },
      { xRatio: 0.495, amplitude: 26, wavelength: 420, speed: 0.8, width: 1.25, phase: 4.0, alpha: 0.12 },
      { xRatio: 0.875, amplitude: 20, wavelength: 310, speed: 1.1, width: 1.5, phase: 1.4, alpha: 0.18 },
      { xRatio: 0.925, amplitude: 14, wavelength: 240, speed: 1.35, width: 0.9, phase: 3.3, alpha: 0.13 },
    ];

    // Water droplets & realm Reishi particles
    const particleCount = width < 768 ? 38 : 68;
    const particles: FlowParticle[] = Array.from({ length: particleCount }, (_, i) => {
      const kinds: FlowParticle['kind'][] = ['droplet', 'mote', 'streak'];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 10,
        vy: 28 + Math.random() * 58,
        size: 1.1 + Math.random() * 2.4,
        alpha: 0.18 + Math.random() * 0.48,
        phase: Math.random() * Math.PI * 2,
        kind: kinds[i % 3],
      };
    });

    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let flowOffset = 0;

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += dt;

      const vel = velocityRef.current || 0;
      const progress = progressRef.current || 0;
      const speedBoost = Math.max(-2.5, Math.min(4.2, vel / 480));
      flowOffset += dt * (72 + speedBoost * 85);

      if (pointer.active) {
        if (pointer.smoothX < -1000) {
          pointer.smoothX = pointer.x;
          pointer.smoothY = pointer.y;
        } else {
          pointer.smoothX += (pointer.x - pointer.smoothX) * 0.12;
          pointer.smoothY += (pointer.y - pointer.smoothY) * 0.12;
        }
      }

      const { primary, secondary } = sampleRealmColors(progress);
      const [pr, pg, pb] = primary;
      const [sr, sg, sb] = secondary;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw silky vertical flowing liquid ribbons (Reishi waterfall currents)
      const segments = 28;
      const stepY = height / segments;

      for (let r = 0; r < ribbons.length; r++) {
        const rb = ribbons[r];
        const baseX = rb.xRatio * width;

        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, `rgba(${pr},${pg},${pb},0)`);
        grad.addColorStop(0.2, `rgba(${pr},${pg},${pb},${rb.alpha})`);
        grad.addColorStop(0.55, `rgba(${sr},${sg},${sb},${rb.alpha * 1.15})`);
        grad.addColorStop(0.85, `rgba(${pr},${pg},${pb},${rb.alpha * 0.9})`);
        grad.addColorStop(1, `rgba(${pr},${pg},${pb},0)`);

        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const y = i * stepY;
          const wave1 = Math.sin((y - flowOffset * rb.speed) / rb.wavelength * Math.PI * 2 + rb.phase);
          const wave2 = Math.cos((y * 0.55 - flowOffset * rb.speed * 0.65) / rb.wavelength * Math.PI * 2 + elapsed * 0.7);
          let x = baseX + (wave1 * 0.68 + wave2 * 0.32) * rb.amplitude;

          // Subtle water parting deflection near cursor
          if (pointer.active) {
            const dx = x - pointer.smoothX;
            const dy = y - pointer.smoothY;
            const distSq = dx * dx + dy * dy;
            const radius = 150;
            if (distSq < radius * radius && distSq > 1) {
              const dist = Math.sqrt(distSq);
              const force = (1 - dist / radius) * 26;
              x += (dx / dist) * force;
            }
          }

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = grad;
        ctx.lineWidth = rb.width + Math.min(1.2, Math.abs(speedBoost) * 0.35);
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // 2. Draw realm-morphing flowing water droplets & Reishi streaks
      const isHellZone = progress > 0.82;
      const isKarakuraRain = progress > 0.38 && progress < 0.66;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // In Hell, half the embers gently drift upward like volcanic sparks while the rest sink
        const hellRise = isHellZone && i % 3 === 0 ? -1 : 1;
        const moveY = (p.vy * hellRise + vel * 0.24) * dt;
        const swayX = Math.sin(elapsed * 1.15 + p.phase) * 14 * dt + p.vx * dt;

        p.x += swayX;
        p.y += moveY;

        if (p.y > height + 30) {
          p.y = -24;
          p.x = Math.random() * width;
        } else if (p.y < -30) {
          p.y = height + 24;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        const useSecondary = i % 2 === 0;
        const cr = useSecondary ? sr : pr;
        const cg = useSecondary ? sg : pg;
        const cb = useSecondary ? sb : pb;

        const shimmer = 0.65 + 0.35 * Math.sin(elapsed * 2.2 + p.phase);
        const alpha = p.alpha * shimmer;

        // Stretch particles smoothly into fluid water streaks when scrolling or in Karakura rain
        const stretch =
          (p.kind === 'streak' || isKarakuraRain ? 12 : 4) +
          Math.min(34, Math.abs(vel) * 0.022);

        if (stretch > 7 || p.kind === 'streak') {
          const dir = moveY >= 0 ? -1 : 1;
          const tailY = p.y + dir * stretch;
          const lineGrad = ctx.createLinearGradient(p.x, p.y, p.x, tailY);
          lineGrad.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`);
          lineGrad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, tailY);
          ctx.strokeStyle = lineGrad;
          ctx.lineWidth = Math.max(0.85, p.size * 0.62);
          ctx.lineCap = 'round';
          ctx.stroke();
        } else {
          // Soft luminous Reishi water droplet
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha * 0.85})`;
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [velocityRef, progressRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-20 pointer-events-none"
    />
  );
}
