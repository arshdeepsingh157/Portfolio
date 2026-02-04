import { useEffect, useMemo, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number };

export function SocBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const nodes = useMemo(() => {
    const arr: Node[] = [];
    for (let i = 0; i < 36; i++) {
      arr.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.015,
        vy: (Math.random() - 0.5) * 0.015,
      });
    }
    return arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // faint vignette
      const g = ctx.createRadialGradient(w * 0.5, h * 0.1, 0, w * 0.5, h * 0.1, Math.max(w, h) * 0.85);
      g.addColorStop(0, "rgba(60, 255, 210, 0.06)");
      g.addColorStop(0.35, "rgba(140, 90, 255, 0.05)");
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // update nodes
      for (const n of nodes) {
        n.x += n.vx * 0.6;
        n.y += n.vy * 0.6;
        if (n.x < 0) n.x = 1;
        if (n.x > 1) n.x = 0;
        if (n.y < 0) n.y = 1;
        if (n.y > 1) n.y = 0;
      }

      // lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]!;
          const b = nodes[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.22) {
            const alpha = (1 - dist / 0.22) * 0.12;
            ctx.strokeStyle = `rgba(120, 255, 220, ${alpha})`;
            ctx.lineWidth = 1 * dpr;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }

      // dots
      for (const n of nodes) {
        const x = n.x * w;
        const y = n.y * h;
        ctx.fillStyle = "rgba(160, 255, 230, 0.12)";
        ctx.beginPath();
        ctx.arc(x, y, 2.2 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    raf = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [nodes]);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="mesh-bg noise scanline absolute inset-0" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-[0.55]"
        aria-hidden="true"
      />
    </div>
  );
}
