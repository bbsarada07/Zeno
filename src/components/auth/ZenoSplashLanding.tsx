import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, ArrowRight, Zap, Radio, ShieldCheck, Sparkles, Activity, Layers } from 'lucide-react';

interface ZenoSplashLandingProps {
  onEnter: () => void;
}

export const ZenoSplashLanding: React.FC<ZenoSplashLandingProps> = ({ onEnter }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [isHoveredCta, setIsHoveredCta] = useState<boolean>(false);
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

    // 1. Primary Network Topology Nodes (Static resting positions)
    const nodeCount = 65;
    const nodes: Array<{
      originX: number;
      originY: number;
      x: number;
      y: number;
      radius: number;
      alpha: number;
    }> = Array.from({ length: nodeCount }, () => {
      const rx = Math.random() * (canvas.width || 1200);
      const ry = Math.random() * (canvas.height || 800);
      return {
        originX: rx,
        originY: ry,
        x: rx,
        y: ry,
        radius: 1.5 + Math.random() * 2.2,
        alpha: 0.25 + Math.random() * 0.45,
      };
    });

    // 2. Secondary Static Ambient Dust Layer
    const dustCount = 80;
    const dustParticles: Array<{
      originX: number;
      originY: number;
      x: number;
      y: number;
      radius: number;
      alpha: number;
    }> = Array.from({ length: dustCount }, () => {
      const rx = Math.random() * (canvas.width || 1200);
      const ry = Math.random() * (canvas.height || 800);
      return {
        originX: rx,
        originY: ry,
        x: rx,
        y: ry,
        radius: 0.6 + Math.random() * 1.2,
        alpha: 0.1 + Math.random() * 0.3,
      };
    });

    let globalTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      globalTime += 0.02;

      const w = canvas.width;
      const h = canvas.height;
      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;

      // 1. CRT Cybernetic Grid Pattern
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.18)';
      ctx.lineWidth = 0.5;
      const gridSize = 52;
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

      // 2. Render Secondary Ambient Dust Layer (Static by default, gentle cursor shift)
      ctx.fillStyle = '#00F0FF';
      for (let d = 0; d < dustParticles.length; d++) {
        const dust = dustParticles[d];
        const dxMouse = dust.originX - mx;
        const dyMouse = dust.originY - my;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        let targetX = dust.originX;
        let targetY = dust.originY;

        if (distMouse < 140 && distMouse > 0) {
          const force = (140 - distMouse) / 140;
          targetX = dust.originX + (dxMouse / distMouse) * force * 20;
          targetY = dust.originY + (dyMouse / distMouse) * force * 20;
        }

        // Soft ease-out transition back to origin
        dust.x += (targetX - dust.x) * 0.08;
        dust.y += (targetY - dust.y) * 0.08;

        ctx.globalAlpha = dust.alpha * 0.5;
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // 3. Render Network Topology Mesh (Static by default, cursor-driven reaction)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Magnetic displacement ONLY upon cursor proximity
        const dxMouse = node.originX - mx;
        const dyMouse = node.originY - my;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        let targetX = node.originX;
        let targetY = node.originY;

        if (distMouse < 180 && distMouse > 0) {
          const force = (180 - distMouse) / 180;
          targetX = node.originX + (dxMouse / distMouse) * force * 35;
          targetY = node.originY + (dyMouse / distMouse) * force * 35;
        }

        // Soft ease-out transition back to resting origin position
        node.x += (targetX - node.x) * 0.08;
        node.y += (targetY - node.y) * 0.08;

        // Draw Glowing Constellation Node
        ctx.fillStyle = `rgba(0, 240, 255, ${node.alpha})`;
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Faint Connecting Vector Lines + Traveling Light Data Packets
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = node.x - n2.x;
          const dy = node.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const lineAlpha = (1 - dist / 150) * 0.25;
            ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();

            // Traveling Light Data Packet along connection line
            const packetProgress = (globalTime * 0.6 + (i + j) * 0.2) % 1;
            const px = node.x + (n2.x - node.x) * packetProgress;
            const py = node.y + (n2.y - node.y) * packetProgress;

            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = '#00F0FF';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(px, py, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
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
    }, 550);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: isInitializing ? 0 : 1, scale: isInitializing ? 1.15 : 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full relative overflow-hidden select-none bg-[#05070A] flex flex-col items-center justify-between"
    >
      {/* Background Interactive Topology Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-auto" />

      {/* Cybernetic Scanlines CRT Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none opacity-25 z-10" />

      {/* Ambient Radial Deep Space Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cyan-500/10 blur-[180px] pointer-events-none" />

      {/* CORNER SCI-FI TELEMETRY TAGS */}
      <div className="absolute top-6 left-6 z-20 font-mono text-[10px] text-slate-400 flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>SYSTEM ONLINE // PORT 8000 LIVE</span>
      </div>

      <div className="absolute top-6 right-6 z-20 font-mono text-[10px] text-cyan-400 flex items-center space-x-2">
        <Activity className="w-3.5 h-3.5 animate-pulse" />
        <span>INITIALIZING NEURAL MESH... [AES-256]</span>
      </div>

      <div className="absolute bottom-6 left-6 z-20 font-mono text-[10px] text-slate-500">
        ZENO CAMPUSOS v2.5.0 // CORE ORCHESTRATOR
      </div>

      <div className="absolute bottom-6 right-6 z-20 font-mono text-[10px] text-slate-500 flex items-center space-x-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
        <span>ENCLAVE DISPATCHER: ACTIVE</span>
      </div>

      {/* TOP BRANDING PILL */}
      <div className="relative z-20 pt-10 sm:pt-14 px-6 flex items-center justify-center w-full">
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="px-4 py-2 rounded-full bg-slate-950/90 border border-cyan-500/30 text-xs font-mono font-bold text-slate-200 backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.25)] flex items-center space-x-2.5"
        >
          <Cpu className="w-4 h-4 text-cyan-400 animate-pulse flex-shrink-0" />
          <span className="tracking-wider">ZENO MULTI-AGENT TOPOLOGY ENGINE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        </motion.div>
      </div>

      {/* HERO BRANDING & CENTERPIECE (HERO TITLE & TAGLINE) */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-4xl space-y-4 my-auto">
        {/* Scanning Light Assembly Entrance for ZENO Hero Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, clipPath: 'inset(0 100% 0 0)' }}
          animate={{ opacity: 1, scale: 1, clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleStartInitialize}
          className="cursor-pointer group relative"
        >
          <h1 className="text-8xl sm:text-[11rem] font-extrabold tracking-widest font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-200 to-cyan-400 drop-shadow-[0_0_55px_rgba(0,240,255,0.75)] group-hover:scale-105 transition-transform duration-500 leading-none">
            ZENO
          </h1>
          
          {/* Subtle Breathing System Light Sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent blur-xl animate-pulse pointer-events-none" />
        </motion.div>

        {/* Tagline Entrance */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="text-lg sm:text-2xl font-normal font-mono text-slate-200 tracking-wide"
        >
          The CampusOS for Student Success
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-3 text-xs font-mono text-slate-300"
        >
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md flex items-center space-x-1.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>5-Domain Enclave Routing</span>
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md flex items-center space-x-1.5 shadow-md">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Photorealistic 3D Digital Twin</span>
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md flex items-center space-x-1.5 shadow-md">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>AES-256 Cryptographic Receipts</span>
          </span>
        </motion.div>

        {/* CALL TO ACTION BUTTON (INITIALIZE ZENO) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="pt-8"
        >
          <div className="relative group">
            {/* Pulsing Shockwave Ripple Ring on Hover */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

            <button
              onClick={handleStartInitialize}
              onMouseEnter={() => setIsHoveredCta(true)}
              onMouseLeave={() => setIsHoveredCta(false)}
              className="relative px-10 py-4.5 rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 text-slate-950 font-mono font-extrabold text-base sm:text-lg shadow-[0_0_35px_rgba(0,240,255,0.7)] hover:shadow-[0_0_60px_rgba(0,240,255,1)] transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Radio className="w-5 h-5 text-slate-950 animate-pulse flex-shrink-0" />
              <span>INITIALIZE ZENO ↗</span>
              <ArrowRight className="w-5 h-5 text-slate-950 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM SPACING */}
      <div className="h-12" />
    </motion.div>
  );
};
