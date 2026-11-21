import { useEffect, useRef, useCallback } from 'react';

interface UseLiquidScrollOptions {
  disabled?: boolean;
  /** Higher = snappier, Lower = more viscous water-like glide. Default 5.6 */
  damping?: number;
  /** Wheel sensitivity multiplier. Default 0.96 */
  wheelMultiplier?: number;
}

export interface LiquidScrollController {
  /** Smoothed real-time scroll velocity in px/sec (positive = flowing down) */
  velocityRef: React.MutableRefObject<number>;
  /** Normalized scroll progress 0..1 */
  progressRef: React.MutableRefObject<number>;
  /** Smoothly glide to a specific Y coordinate using water-flow easing */
  scrollToY: (y: number, speedDamping?: number) => void;
  /** Smoothly glide to a DOM element ID using water-flow easing */
  scrollToElement: (id: string, offsetPx?: number) => void;
}

function isInsideNativeScrollable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  let el: HTMLElement | null = target;
  while (el && el !== document.body) {
    if (el.hasAttribute('data-native-scroll')) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
}

/**
 * Water-flow inertial smooth scrolling engine.
 * Gives desktop wheel & programmatic navigation a continuous, viscous liquid glide
 * while remaining 100% compatible with native scrollbar dragging, touchscreens, and motion/react useScroll.
 */
export function useLiquidScroll(options: UseLiquidScrollOptions = {}): LiquidScrollController {
  const { disabled = false, damping = 5.6, wheelMultiplier = 0.96 } = options;

  const targetYRef = useRef(0);
  const currentYRef = useRef(0);
  const lastWrittenYRef = useRef(0);
  const velocityRef = useRef(0);
  const progressRef = useRef(0);
  const activeDampingRef = useRef(damping);
  const rafIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const isDrivingRef = useRef(false);

  const getMaxScroll = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  const updateProgress = () => {
    const max = getMaxScroll();
    progressRef.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  };

  const stopLoop = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    isDrivingRef.current = false;
  }, []);

  const tick = useCallback(
    (now: number) => {
      const dt = lastFrameTimeRef.current
        ? Math.min((now - lastFrameTimeRef.current) / 1000, 0.05)
        : 1 / 60;
      lastFrameTimeRef.current = now;

      const maxScroll = getMaxScroll();
      if (targetYRef.current > maxScroll) targetYRef.current = maxScroll;
      if (targetYRef.current < 0) targetYRef.current = 0;

      const diff = targetYRef.current - currentYRef.current;
      // Frame-rate independent exponential smoothing for water-like inertia
      const alpha = 1 - Math.exp(-dt * activeDampingRef.current);
      const step = diff * alpha;

      currentYRef.current += step;

      // Instantaneous velocity smoothed gently
      const instVel = dt > 0.0001 ? step / dt : 0;
      velocityRef.current = velocityRef.current * 0.82 + instVel * 0.18;

      if (Math.abs(diff) < 0.35 && Math.abs(velocityRef.current) < 6) {
        currentYRef.current = targetYRef.current;
        velocityRef.current = 0;
        lastWrittenYRef.current = currentYRef.current;
        window.scrollTo(0, currentYRef.current);
        updateProgress();
        rafIdRef.current = null;
        isDrivingRef.current = false;
        activeDampingRef.current = damping;
        return;
      }

      lastWrittenYRef.current = currentYRef.current;
      window.scrollTo(0, currentYRef.current);
      updateProgress();

      rafIdRef.current = requestAnimationFrame(tick);
    },
    [damping]
  );

  const ensureLoop = useCallback(() => {
    if (rafIdRef.current === null) {
      isDrivingRef.current = true;
      lastFrameTimeRef.current = performance.now();
      rafIdRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const scrollToY = useCallback(
    (y: number, speedDamping?: number) => {
      const maxScroll = getMaxScroll();
      const clamped = Math.min(maxScroll, Math.max(0, y));
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) {
        stopLoop();
        currentYRef.current = clamped;
        targetYRef.current = clamped;
        window.scrollTo(0, clamped);
        updateProgress();
        return;
      }

      if (!isDrivingRef.current) {
        currentYRef.current = window.scrollY;
      }
      targetYRef.current = clamped;
      activeDampingRef.current = speedDamping ?? 4.2;
      ensureLoop();
    },
    [ensureLoop, stopLoop]
  );

  const scrollToElement = useCallback(
    (id: string, offsetPx = 0) => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY + offsetPx;
      scrollToY(top, 4.2);
    },
    [scrollToY]
  );

  useEffect(() => {
    currentYRef.current = window.scrollY;
    targetYRef.current = window.scrollY;
    lastWrittenYRef.current = window.scrollY;
    updateProgress();

    if (disabled) {
      stopLoop();
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lastNativeY = window.scrollY;
    let lastNativeTime = performance.now();

    const handleWheel = (e: WheelEvent) => {
      if (reducedMotion || e.ctrlKey || e.metaKey) return;
      if (isInsideNativeScrollable(e.target)) return;

      // Normalize across pixel / line / page modes
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 34;
      else if (e.deltaMode === 2) delta *= window.innerHeight * 0.85;

      // Ignore purely horizontal wheel gestures
      if (Math.abs(delta) < 0.01) return;

      e.preventDefault();

      if (!isDrivingRef.current) {
        currentYRef.current = window.scrollY;
        targetYRef.current = window.scrollY;
      }

      // Softly bound huge single-tick jumps so motion feels silky like flowing water
      const clampedDelta = Math.max(-220, Math.min(220, delta * wheelMultiplier));
      const maxScroll = getMaxScroll();
      targetYRef.current = Math.min(maxScroll, Math.max(0, targetYRef.current + clampedDelta));
      activeDampingRef.current = damping;
      ensureLoop();
    };

    const handleNativeScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      updateProgress();

      // Detect native scroll (scrollbar drag, touch swipe, keyboard)
      if (!isDrivingRef.current || Math.abs(y - lastWrittenYRef.current) > 4.5) {
        stopLoop();
        const dt = Math.max((now - lastNativeTime) / 1000, 0.008);
        const instVel = (y - lastNativeY) / dt;
        velocityRef.current = velocityRef.current * 0.7 + instVel * 0.3;
        currentYRef.current = y;
        targetYRef.current = y;
        lastWrittenYRef.current = y;
      }
      lastNativeY = y;
      lastNativeTime = now;
    };

    const handleInterrupt = () => {
      if (isDrivingRef.current) {
        stopLoop();
        currentYRef.current = window.scrollY;
        targetYRef.current = window.scrollY;
        lastWrittenYRef.current = window.scrollY;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'ArrowDown' ||
        e.key === 'ArrowUp' ||
        e.key === 'PageDown' ||
        e.key === 'PageUp' ||
        e.key === 'Home' ||
        e.key === 'End' ||
        e.key === ' '
      ) {
        handleInterrupt();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleNativeScroll, { passive: true });
    window.addEventListener('touchstart', handleInterrupt, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: true });

    // Gentle passive decay of native velocity when idle
    const decayTimer = window.setInterval(() => {
      if (!isDrivingRef.current && Math.abs(velocityRef.current) > 0.5) {
        velocityRef.current *= 0.8;
        if (Math.abs(velocityRef.current) < 0.5) velocityRef.current = 0;
      }
    }, 32);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleNativeScroll);
      window.removeEventListener('touchstart', handleInterrupt);
      window.removeEventListener('keydown', handleKeyDown);
      window.clearInterval(decayTimer);
      stopLoop();
    };
  }, [disabled, damping, wheelMultiplier, ensureLoop, stopLoop]);

  return {
    velocityRef,
    progressRef,
    scrollToY,
    scrollToElement,
  };
}
