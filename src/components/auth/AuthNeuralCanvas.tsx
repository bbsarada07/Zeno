import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Cpu, Activity, Zap, CheckCircle2, Radio } from 'lucide-react';
import type { UserRole } from '../../types';

export interface AgentNodeData {
  id: string;
  label: string;
  code: string;
  latency: string;
  status: 'ACTIVE' | 'OPERATIONAL' | 'STANDBY';
  description: string;
  roles: UserRole[];
  angle: number; // Angle around core hub in radians
  distanceRatio: number; // Radial offset ratio (0.35 to 0.42)
}

const SUB_AGENT_NODES: AgentNodeData[] = [
  {
    id: 'placement',
    label: 'PLACEMENT_ENGINE',
    code: 'AGENT_NODE_01',
    latency: '0.12ms',
    status: 'ACTIVE',
    description: 'ATS Scoring, Career Twin & Recruiter Feedback',
    roles: ['student', 'hod'],
    angle: (0 * Math.PI) / 3,
    distanceRatio: 0.36,
  },
  {
    id: 'academic',
    label: 'ACADEMIC_OS',
    code: 'AGENT_NODE_02',
    latency: '0.08ms',
    status: 'ACTIVE',
    description: 'Semester CGPA Telemetry, Course Credit & Condonations',
    roles: ['student', 'faculty', 'hod'],
    angle: (1 * Math.PI) / 3,
    distanceRatio: 0.38,
  },
  {
    id: 'events',
    label: 'EVENTS_HUNTER',
    code: 'AGENT_NODE_03',
    latency: '0.19ms',
    status: 'ACTIVE',
    description: 'Campus Hackathons, Workshop Registrations & Grants',
    roles: ['hod'],
    angle: (2 * Math.PI) / 3,
    distanceRatio: 0.36,
  },
  {
    id: 'grievance',
    label: 'GRIEVANCE_ROUTER',
    code: 'AGENT_NODE_04',
    latency: '0.14ms',
    status: 'ACTIVE',
    description: 'Anonymous Faculty Petitions & Department Escalate',
    roles: ['faculty', 'hod'],
    angle: (3 * Math.PI) / 3,
    distanceRatio: 0.38,
  },
  {
    id: 'spatial',
    label: 'SPATIAL_GIS',
    code: 'AGENT_NODE_05',
    latency: '0.10ms',
    status: 'ACTIVE',
    description: 'Indoor Floor Maps, Class Navigation & Lab Routing',
    roles: ['student', 'hod'],
    angle: (4 * Math.PI) / 3,
    distanceRatio: 0.36,
  },
  {
    id: 'hitl',
    label: 'HITL_GATEKEEPER',
    code: 'AGENT_NODE_06',
    latency: '0.05ms',
    status: 'ACTIVE',
    description: 'Attendance Condensation & Cryptographic Receipts',
    roles: ['student', 'faculty', 'hod'],
    angle: (5 * Math.PI) / 3,
    distanceRatio: 0.38,
  },
];

interface AuthNeuralCanvasProps {
  activeRole: UserRole;
  accentColor: string;
  isBackendLive?: boolean;
}

export const AuthNeuralCanvas: React.FC<AuthNeuralCanvasProps> = ({
  activeRole,
  accentColor,
  isBackendLive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<AgentNodeData | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Store node positions calculated during canvas render
  const nodePositionsRef = useRef<Map<string, { x: number; y: number; radius: number }>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle Background Initialization
    const particleCount = 45;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }> = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: 1 + Math.random() * 1.5,
      alpha: 0.15 + Math.random() * 0.35,
    }));

    let pulseTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pulseTime += 0.015;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const baseRadius = Math.min(width, height) * 0.38;

      // 1. Draw Particle Mesh Background
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.1;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 2. Draw Concentric Orbit Rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 0.95, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 0.65, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Compute Node Coordinates & Store for Interaction
      const currentPositions = new Map<string, { x: number; y: number; radius: number }>();

      SUB_AGENT_NODES.forEach((node) => {
        // Orbit rotation over time
        const dynamicAngle = node.angle + pulseTime * 0.04;
        const nx = centerX + Math.cos(dynamicAngle) * (baseRadius * 0.95);
        const ny = centerY + Math.sin(dynamicAngle) * (baseRadius * 0.95);
        const nodeRadius = 24;

        currentPositions.set(node.id, { x: nx, y: ny, radius: nodeRadius });

        const isNodeActiveForRole = node.roles.includes(activeRole);
        const isHovered = hoveredNode?.id === node.id;

        // 4. Draw Vector Laser Lines from Core Hub to Node
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(nx, ny);

        if (isNodeActiveForRole) {
          ctx.strokeStyle = isHovered ? '#FFFFFF' : accentColor;
          ctx.lineWidth = isHovered ? 2.5 : 1.5;
          ctx.shadowColor = accentColor;
          ctx.shadowBlur = 12;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Laser Data Packet Pulse traveling along vector line
        const packetProgress = (pulseTime * 0.8 + node.angle * 0.5) % 1;
        const packetX = centerX + (nx - centerX) * packetProgress;
        const packetY = centerY + (ny - centerY) * packetProgress;

        ctx.fillStyle = isNodeActiveForRole ? accentColor : '#FFFFFF';
        ctx.beginPath();
        ctx.arc(packetX, packetY, isNodeActiveForRole ? 3.5 : 2, 0, Math.PI * 2);
        ctx.fill();

        // 5. Draw Orbiting Sub-Agent Node Circle
        ctx.beginPath();
        ctx.arc(nx, ny, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = isNodeActiveForRole ? 'rgba(7, 10, 15, 0.95)' : 'rgba(15, 23, 42, 0.7)';
        ctx.fill();

        ctx.lineWidth = isHovered ? 3 : isNodeActiveForRole ? 2 : 1;
        ctx.strokeStyle = isHovered ? '#FFFFFF' : isNodeActiveForRole ? accentColor : 'rgba(148, 163, 184, 0.3)';
        ctx.stroke();

        // Node Pulsing Halo if Active
        if (isNodeActiveForRole) {
          const haloRadius = nodeRadius + 6 + Math.sin(pulseTime * 3 + node.angle) * 3;
          ctx.beginPath();
          ctx.arc(nx, ny, haloRadius, 0, Math.PI * 2);
          ctx.strokeStyle = accentColor;
          ctx.globalAlpha = 0.3;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }

        // Inner Dot Icon
        ctx.fillStyle = isNodeActiveForRole ? accentColor : 'rgba(148, 163, 184, 0.5)';
        ctx.beginPath();
        ctx.arc(nx, ny, 4, 0, Math.PI * 2);
        ctx.fill();

        // Node Label Typography
        ctx.font = '600 11px monospace';
        ctx.fillStyle = isHovered ? '#FFFFFF' : isNodeActiveForRole ? '#F8FAFC' : 'rgba(148, 163, 184, 0.6)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.label, nx, ny + nodeRadius + 8);
      });

      nodePositionsRef.current = currentPositions;

      // 6. Draw Central Hub Node: ZENO_CORE_ORCHESTRATOR
      const coreRadius = 42;

      // Outer Core Glow Ring
      const coreGlow = coreRadius + 8 + Math.sin(pulseTime * 2) * 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreGlow, 0, Math.PI * 2);
      ctx.strokeStyle = accentColor;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Core Background Fill
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#05070A';
      ctx.fill();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Core Hub Label Text
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ZENO_CORE', centerX, centerY - 6);

      ctx.font = '500 9px monospace';
      ctx.fillStyle = accentColor;
      ctx.fillText('ORCHESTRATOR', centerX, centerY + 8);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeRole, accentColor, hoveredNode]);

  // Mouse Move Event Listener for Node Hover Tooltip
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    let foundHover: AgentNodeData | null = null;
    nodePositionsRef.current.forEach((pos, nodeId) => {
      const dx = x - pos.x;
      const dy = y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= pos.radius + 10) {
        const nodeObj = SUB_AGENT_NODES.find((n) => n.id === nodeId);
        if (nodeObj) foundHover = nodeObj;
      }
    });

    setHoveredNode(foundHover);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="w-full h-full relative overflow-hidden select-none bg-[#05070A] flex flex-col justify-between"
    >
      {/* Background Radial Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 opacity-25"
        style={{ backgroundColor: accentColor }}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main HTML5 Neural Canvas */}
      <canvas ref={canvasRef} className="w-full h-full absolute inset-0 z-10" />

      {/* Floating Hover Glass Tooltip */}
      {hoveredNode && (
        <div
          className="absolute z-30 pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-full mb-4 px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl max-w-xs space-y-1"
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        >
          <div className="flex items-center justify-between space-x-3">
            <span className="font-mono text-xs font-bold text-white tracking-wider">
              {hoveredNode.label}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              {hoveredNode.latency} // {hoveredNode.status}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">{hoveredNode.description}</p>
          <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800">
            <span>CODE: {hoveredNode.code}</span>
            <span style={{ color: accentColor }}>
              ROUTING: {hoveredNode.roles.includes(activeRole) ? 'ACTIVE' : 'STANDBY'}
            </span>
          </div>
        </div>
      )}

      {/* Top Left Header Badge */}
      <div className="relative z-20 p-6 flex items-center space-x-3">
        <div className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono font-medium text-slate-300 backdrop-blur-md flex items-center space-x-2 shadow-lg">
          <Cpu className="w-3.5 h-3.5" style={{ color: accentColor }} />
          <span>ZENO MULTI-AGENT TOPOLOGY ENGINE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Floating Telemetry Overlay (Bottom Left) */}
      <div className="relative z-20 p-6 space-y-2">
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl space-y-2 max-w-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-200">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>SECURE_CHANNEL_AUTH // PORT 8000 LIVE // AES-256-GCM</span>
            </div>
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
              style={{
                color: accentColor,
                backgroundColor: `${accentColor}15`,
                borderColor: `${accentColor}40`,
              }}
            >
              ROLE: {activeRole.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-slate-400 font-mono">
            Hover over nodes or select persona keys to inspect routing topology.
          </p>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>LANGGRAPH_ASYNC_ENGINE</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>QDRANT_VECTOR_DB</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
