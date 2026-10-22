import React, { useEffect, useRef } from 'react';

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
  shape: 'rect' | 'circle' | 'strip';
}

interface ConfettiCanvasProps {
  durationMs?: number;
  particleCount?: number;
}

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({
  durationMs = 4000,
  particleCount = 90,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      '#ff5500', // Signal Orange
      '#ea580c', // Darker Orange
      '#16a34a', // Emerald/Lime
      '#0284c7', // Precision Cyan
      '#f59e0b', // Gold / Amber
      '#8b5cf6', // Violet
      '#ffffff', // Crisp White
    ];

    const particles: ConfettiParticle[] = [];

    // Burst from two positions (left and right) for cinematic DTC celebration
    for (let i = 0; i < particleCount; i++) {
      const fromLeft = i % 2 === 0;
      const originX = fromLeft ? width * 0.15 : width * 0.85;
      const angle = fromLeft
        ? -Math.PI / 4 + (Math.random() - 0.5) * 0.6
        : -3 * (Math.PI / 4) + (Math.random() - 0.5) * 0.6;
      const speed = Math.random() * 14 + 10;

      particles.push({
        x: originX,
        y: height * 0.35,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
        vy: Math.sin(angle) * speed - Math.random() * 5,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.12 + 0.05,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : Math.random() > 0.5 ? 'strip' : 'circle',
      });
    }

    let animationFrameId: number;
    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      const fadeStart = durationMs * 0.65;
      const progress = Math.min(elapsed / durationMs, 1);

      let aliveCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // Gravity
        p.vx *= 0.985; // Air friction
        p.rotation += p.vRot;
        p.wobble += p.wobbleSpeed;

        if (elapsed > fadeStart) {
          p.opacity = Math.max(0, 1 - (elapsed - fadeStart) / (durationMs - fadeStart));
        }

        if (p.y < height + 40 && p.opacity > 0) {
          aliveCount++;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.scale(Math.cos(p.wobble), 1);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          } else if (p.shape === 'strip') {
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size * 1.5, p.size * 0.35);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }

      if (aliveCount > 0 && progress < 1) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [durationMs, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
};
