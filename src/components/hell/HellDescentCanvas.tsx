import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import anime from 'animejs';

interface HellDescentCanvasProps {
  onComplete: () => void;
}

export const HellDescentCanvas: React.FC<HellDescentCanvasProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  const handleComplete = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      window.scrollTo({ top: 0, behavior: 'instant' as any });
      onComplete();
    }
  };

  useEffect(() => {
    // 1. Create Anime.js Timeline
    const tl = anime.timeline({
      easing: 'easeOutExpo',
      complete: () => {
        handleComplete();
      },
    });

    // Animate glowing Hell Gate concentric rings expanding outwards (tunnel effect)
    tl.add({
      targets: ringsRef.current?.querySelectorAll('.hell-ring'),
      scale: [0.2, 3.5],
      opacity: [
        { value: 0.9, duration: 300 },
        { value: 0, duration: 900 },
      ],
      rotate: () => anime.random(-180, 180),
      delay: anime.stagger(120),
      duration: 1400,
    })
      .add(
        {
          targets: particlesRef.current?.querySelectorAll('.hell-particle'),
          scale: [
            { value: [0, 2], duration: 400 },
            { value: 6, duration: 800 },
          ],
          translateY: () => [0, anime.random(-400, 400)],
          translateX: () => [0, anime.random(-500, 500)],
          opacity: [1, 0],
          delay: anime.stagger(15),
          duration: 1200,
        },
        '-=1200'
      )
      .add(
        {
          targets: textRef.current,
          scale: [0.8, 1.15],
          opacity: [0, 1, 1, 0],
          duration: 1400,
        },
        '-=1400'
      );

    // Fallback safety timer
    const timer = setTimeout(() => {
      handleComplete();
    }, 1600);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return ReactDOM.createPortal(
    <div
      ref={containerRef}
      onClick={handleComplete}
      className="fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-center pointer-events-auto select-none overflow-hidden cursor-pointer"
    >
      {/* Background Volcanic Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600/40 via-red-950/60 to-slate-950 pointer-events-none" />

      {/* Anime.js Concentric Hell Gate Rings */}
      <div ref={ringsRef} className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="hell-ring absolute rounded-full border-2 border-red-500/70 shadow-[0_0_40px_rgba(239,35,60,0.8)]"
            style={{
              width: `${(i + 1) * 120}px`,
              height: `${(i + 1) * 120}px`,
              borderStyle: i % 2 === 0 ? 'dashed' : 'solid',
            }}
          />
        ))}
      </div>

      {/* Anime.js Swirling Embers Container */}
      <div ref={particlesRef} className="absolute inset-0 flex items-center justify-center pointer-events-none z-15">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="hell-particle absolute w-3 h-3 rounded-full shadow-[0_0_15px_rgba(255,102,0,0.9)]"
            style={{
              backgroundColor: i % 3 === 0 ? '#ff3300' : i % 3 === 1 ? '#ffb703' : '#d90429',
              left: `${50 + (Math.random() - 0.5) * 20}%`,
              top: `${50 + (Math.random() - 0.5) * 20}%`,
            }}
          />
        ))}
      </div>

      {/* HUD Text Display */}
      <div ref={textRef} className="relative z-30 text-center space-y-4 pointer-events-none px-6 opacity-0">
        <div className="font-inter text-xs tracking-[0.4em] uppercase text-red-500 font-bold animate-pulse">
          HELL GATES UNSEALED // 地獄の門
        </div>
        <h2 className="font-podium text-4xl sm:text-6xl text-white uppercase tracking-tight leading-none drop-shadow-[0_0_35px_rgba(255,34,0,1)]">
          DESCENDING INTO JIGOKU...
        </h2>
        <p className="text-xs sm:text-sm font-inter text-red-300 tracking-widest max-w-md mx-auto uppercase">
          Click anywhere to skip transition
        </p>
      </div>
    </div>,
    document.body
  );
};
