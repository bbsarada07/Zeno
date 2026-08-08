import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, ArrowRight, Zap, Radio, ShieldCheck, Sparkles } from 'lucide-react';

interface ZenoSplashLandingProps {
  onEnter: () => void;
}

export const ZenoSplashLanding: React.FC<ZenoSplashLandingProps> = ({ onEnter }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dynamic Network Topology & Particle Mesh
    const nodeCount = 55;
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      pulse: number;
    }> = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 600),
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: 1.5 + Math.random() * 2,
      alpha: 0.2 + Math.random() * 0.4,
      pulse: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;

      // Draw Grid Backdrop Pattern
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.15)';
      ctx.lineWidth = 0.5;
      const gridSize = 48;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Update & Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.02;

        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;

        // Mouse Parallax / Slight Repel Effect
        const dxMouse = node.x - mx;
        const dyMouse = node.y - my;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 140) {
          const force = (140 - distMouse) / 140;
          node.x += (dxMouse / distMouse) * force * 1.5;
          node.y += (dyMouse / distMouse) * force * 1.5;
        }

        // Draw Glowing Node
        const currentAlpha = node.alpha + Math.sin(node.pulse) * 0.15;
        ctx.fillStyle = `rgba(0, 240, 255, ${Math.max(0.1, currentAlpha)})`;
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect Nodes with Topology Lines
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = node.x - n2.x;
          const dy = node.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const lineAlpha = (1 - dist / 140) * 0.22;
            ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleStartInitialize = () => {
    setIsInitializing(true);
    setTimeout(() => {
      onEnter();
    }, 450);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: isInitializing ? 0 : 1, scale: isInitializing ? 1.04 : 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full relative overflow-hidden select-none bg-[#05070A] flex flex-col items-center justify-between"
    >
      {/* Background Interactive Topology Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-auto" />

      {/* Radial Glow Underlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-[160px] pointer-events-none" />

      {/* TOP HEADER BADGE */}
      <div className="relative z-10 pt-8 sm:pt-12 px-6 flex items-center justify-center w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono font-bold text-slate-200 backdrop-blur-xl shadow-2xl flex items-center space-x-2.5"
        >
          <Cpu className="w-4 h-4 text-cyan-400 animate-pulse flex-shrink-0" />
          <span>ZENO MULTI-AGENT TOPOLOGY ENGINE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        </motion.div>
      </div>

      {/* HERO BRANDING & CENTERPIECE */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl space-y-4 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          onClick={handleStartInitialize}
          className="cursor-pointer group"
        >
          <h1 className="text-7xl sm:text-9xl font-extrabold tracking-widest font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 drop-shadow-[0_0_45px_rgba(0,240,255,0.6)] group-hover:scale-105 transition-transform duration-500">
            ZENO
          </h1>
          <p className="text-base sm:text-2xl font-normal font-mono text-slate-300 tracking-wide mt-3">
            The CampusOS for Student Success
          </p>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono text-slate-400"
        >
          <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>5-Domain Enclave Routing</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Photorealistic 3D Digital Twin</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>AES-256 Auth Channel</span>
          </span>
        </motion.div>

        {/* CALL TO ACTION BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="pt-6"
        >
          <button
            onClick={handleStartInitialize}
            className="px-9 py-4 rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 text-slate-950 font-mono font-extrabold text-sm sm:text-base shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:shadow-[0_0_50px_rgba(0,240,255,0.9)] transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <Radio className="w-4 h-4 text-slate-950 animate-pulse flex-shrink-0" />
            <span>INITIALIZE ZENO CAMPUSOS ↗</span>
            <ArrowRight className="w-4 h-4 text-slate-950 flex-shrink-0" />
          </button>
        </motion.div>
      </div>

      {/* FOOTER TELEMETRY BAR */}
      <div className="relative z-10 pb-8 px-6 font-mono text-[11px] text-slate-500 flex items-center justify-between w-full max-w-6xl">
        <span>VCE-HYD-500031 // PORT 8000 LIVE</span>
        <span className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ALL AGENT ENCLAVES OPERATIONAL</span>
        </span>
      </div>
    </motion.div>
  );
};
