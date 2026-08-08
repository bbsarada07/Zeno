import React, { useMemo } from 'react';
import { getCampusLocations } from '../services/dijkstraRouter';
import type { DijkstraResult } from '../services/dijkstraRouter';
import { Compass } from 'lucide-react';

interface Campus2DMapProps {
  selectedLocationId: string | null;
  sourceLocationId: string;
  onSelectLocation: (locId: string) => void;
  routeResult: DijkstraResult | null;
  activeStepIndex?: number;
}

export const Campus2DMap: React.FC<Campus2DMapProps> = ({
  selectedLocationId,
  sourceLocationId,
  onSelectLocation,
  routeResult,
  activeStepIndex = 0,
}) => {
  const locations = useMemo(() => getCampusLocations(), []);

  // Map 3D world coords → SVG canvas coords
  const worldToSvg = (x: number, z: number): { cx: number; cy: number } => ({
    cx: 400 + x * 2.1,
    cy: 300 + z * 1.65,
  });

  const sourceLoc = locations.find(
    (l) => l.id === sourceLocationId || l.code.toLowerCase() === sourceLocationId.replace('n_', '').toLowerCase()
  );
  const destLoc = locations.find((l) => l.id === selectedLocationId);

  const sourcePos = sourceLoc ? worldToSvg(sourceLoc.position3D[0], sourceLoc.position3D[2]) : worldToSvg(80, 100);
  const destPos = destLoc ? worldToSvg(destLoc.position3D[0], destLoc.position3D[2]) : null;

  // Build list of SVG [cx, cy] points along the Dijkstra route
  const routePoints = useMemo(() => {
    if (!routeResult || routeResult.pathCoordinates.length < 2) return [];
    return routeResult.pathCoordinates.map((pt) => worldToSvg(pt[0], pt[2]));
  }, [routeResult]);

  const routePolylineStr = routePoints.map((p) => `${p.cx},${p.cy}`).join(' ');

  // Midpoints + direction angles for each route segment (for arrow placement)
  const segmentArrows = useMemo(() => {
    const arrows: { x: number; y: number; angle: number; isActive: boolean }[] = [];
    for (let i = 0; i < routePoints.length - 1; i++) {
      const a = routePoints[i];
      const b = routePoints[i + 1];
      const mx = (a.cx + b.cx) / 2;
      const my = (a.cy + b.cy) / 2;
      const angle = Math.atan2(b.cy - a.cy, b.cx - a.cx) * (180 / Math.PI) + 90;
      arrows.push({ x: mx, y: my, angle, isActive: i === activeStepIndex });
    }
    return arrows;
  }, [routePoints, activeStepIndex]);

  // Active step highlight node
  const activeStepCoord = useMemo(() => {
    if (!routeResult || routePoints.length === 0) return null;
    const idx = Math.min(activeStepIndex, routePoints.length - 1);
    return routePoints[idx] ?? null;
  }, [routePoints, activeStepIndex, routeResult]);

  return (
    <div className="w-full h-full relative select-none overflow-hidden rounded-2xl bg-[#09111E] border border-slate-800 shadow-2xl flex flex-col items-center justify-center font-mono">
      {/* HEADER */}
      <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-xs text-cyan-300 font-bold flex items-center space-x-2 backdrop-blur-md shadow-md">
        <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
        <span>INTERACTIVE 2D CAMPUS GIS MAP</span>
      </div>

      <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Arrow marker for route direction */}
          <marker
            id="route-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0,0 8,4 0,8 2,4" fill="#00f0ff" opacity="0.9" />
          </marker>

          {/* Active step arrow marker (brighter) */}
          <marker
            id="route-arrow-active"
            markerWidth="9"
            markerHeight="9"
            refX="4.5"
            refY="4.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0,0 9,4.5 0,9 2,4.5" fill="#ffffff" opacity="1" />
          </marker>

          {/* Glow filter for active step node */}
          <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Campus terrain background */}
        <rect x="0" y="0" width="800" height="600" fill="#0B1726" />
        <rect x="40" y="30" width="720" height="540" rx="20" fill="#0D1E30" stroke="#1E293B" strokeWidth="2" />

        {/* ── CAMPUS ROAD NETWORK ───────────────────────────────── */}
        <g stroke="#1a2840" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Main entrance highway (N-S spine) */}
          <path d="M 379 530 L 379 130 L 379 69" />
          {/* East ring */}
          <path d="M 379 299 L 568 299 L 673 180 L 568 69 L 379 69" />
          {/* West ring */}
          <path d="M 379 299 L 232 299 L 169 200 L 232 69 L 379 69" />
          {/* Hostel connector */}
          <path d="M 379 133 L 673 133" />
          {/* Sports / stadium spine */}
          <path d="M 493 232 L 673 160 L 673 82" />
        </g>

        {/* Centre lane stripes */}
        <g stroke="#253548" strokeWidth="3" strokeLinecap="round" strokeDasharray="16 14" fill="none" opacity="0.7">
          <path d="M 379 530 L 379 69" />
          <path d="M 379 299 L 568 299" />
          <path d="M 379 299 L 232 299" />
          <path d="M 379 133 L 580 133" />
        </g>

        {/* Secondary walking pathways */}
        <g stroke="#233042" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.85">
          <path d="M 379 299 L 379 232 L 295 232 L 169 232" />
          <path d="M 379 232 L 463 232 L 580 200" />
          <path d="M 379 166 L 337 166" />
          <path d="M 379 166 L 463 166" />
          <path d="M 379 349 L 493 349 L 673 299" />
        </g>

        {/* ── BUILDINGS ─────────────────────────────────────────── */}
        {locations.map((loc) => {
          const { cx, cy } = worldToSvg(loc.position3D[0], loc.position3D[2]);
          const isSelected = selectedLocationId === loc.id;
          const isSource = sourceLoc?.id === loc.id;
          const w = loc.dimensions.width * 1.5;
          const h = loc.dimensions.length * 1.2;

          return (
            <g key={loc.id} onClick={() => onSelectLocation(loc.id)} className="cursor-pointer group">
              {/* Drop shadow */}
              <rect
                x={cx - w / 2 + 3} y={cy - h / 2 + 3}
                width={w} height={h} rx="6"
                fill="#000000" opacity="0.35"
              />
              {/* Building base */}
              <rect
                x={cx - w / 2} y={cy - h / 2}
                width={w} height={h} rx="6"
                fill={isSelected ? '#0284C7' : isSource ? '#0F766E' : '#1E293B'}
                stroke={isSelected ? '#00F0FF' : isSource ? '#14B8A6' : '#475569'}
                strokeWidth={isSelected ? '3' : '1.5'}
                className="transition-all duration-300 group-hover:stroke-cyan-400"
              />
              {/* Pulse glow — selected only */}
              {isSelected && (
                <rect
                  x={cx - w / 2 - 4} y={cy - h / 2 - 4}
                  width={w + 8} height={h + 8} rx="10"
                  fill="none" stroke="#00F0FF" strokeWidth="2"
                  opacity="0.75"
                  className="animate-pulse"
                />
              )}
              {/* Label */}
              <text
                x={cx} y={cy + 3}
                textAnchor="middle" dominantBaseline="central"
                fill={isSelected ? '#FFFFFF' : '#E2E8F0'}
                fontSize={w > 70 ? '10' : '8'}
                fontWeight={isSelected ? 'bold' : '600'}
                className="pointer-events-none"
              >
                {loc.name.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* ── DIJKSTRA ROUTE ────────────────────────────────────── */}
        {routePoints.length >= 2 && (
          <g>
            {/* Outer glow */}
            <polyline
              points={routePolylineStr}
              fill="none" stroke="#00F0FF" strokeWidth="9"
              strokeLinecap="round" strokeLinejoin="round"
              opacity="0.28"
            />
            {/* Core animated route line with mid-point arrow markers */}
            <polyline
              points={routePolylineStr}
              fill="none" stroke="#38BDF8" strokeWidth="4"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="10 7"
              markerMid="url(#route-arrow)"
              className="animate-dash"
            />
          </g>
        )}

        {/* ── SEGMENT ARROW CONES (explicit midpoint triangles) ─── */}
        {segmentArrows.map((arrow, idx) => (
          <g key={idx} transform={`translate(${arrow.x}, ${arrow.y}) rotate(${arrow.angle})`}>
            <polygon
              points="0,-7 5,5 -5,5"
              fill={arrow.isActive ? '#ffffff' : '#00f0ff'}
              opacity={arrow.isActive ? 1 : 0.8}
              stroke={arrow.isActive ? '#06b6d4' : 'none'}
              strokeWidth="1"
              filter={arrow.isActive ? 'url(#glow-cyan)' : undefined}
            />
          </g>
        ))}

        {/* ── ACTIVE STEP POSITION HIGHLIGHT ───────────────────── */}
        {activeStepCoord && routePoints.length > 1 && (
          <g>
            <circle
              cx={activeStepCoord.cx} cy={activeStepCoord.cy}
              r="16" fill="#06b6d4" opacity="0.2"
              className="animate-ping"
              filter="url(#glow-cyan)"
            />
            <circle
              cx={activeStepCoord.cx} cy={activeStepCoord.cy}
              r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="2"
              filter="url(#glow-cyan)"
            />
            <text
              x={activeStepCoord.cx} y={activeStepCoord.cy - 16}
              textAnchor="middle" fill="#06b6d4"
              fontSize="9" fontWeight="bold"
              className="pointer-events-none"
            >
              STEP {activeStepIndex + 1}
            </text>
          </g>
        )}

        {/* ── SOURCE MARKER ─────────────────────────────────────── */}
        {sourcePos && (
          <g transform={`translate(${sourcePos.cx}, ${sourcePos.cy})`}>
            <circle r="14" fill="#14B8A6" opacity="0.25" className="animate-ping" />
            <circle r="8" fill="#14B8A6" stroke="#FFFFFF" strokeWidth="2" />
            <text x="0" y="-15" textAnchor="middle" fill="#14B8A6" fontSize="10" fontWeight="bold">
              START
            </text>
          </g>
        )}

        {/* ── DESTINATION MARKER ───────────────────────────────── */}
        {destPos && destLoc && (
          <g transform={`translate(${destPos.cx}, ${destPos.cy})`}>
            <circle r="18" fill="#EF4444" opacity="0.3" className="animate-ping" />
            <circle r="9" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
            <text x="0" y="-17" textAnchor="middle" fill="#F87171" fontSize="11" fontWeight="bold">
              DEST
            </text>
          </g>
        )}
      </svg>

      {/* FOOTER LEGEND */}
      <div className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] text-slate-300 flex items-center space-x-4 backdrop-blur-md">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
          <span>Source</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Destination</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-4 h-1 rounded bg-cyan-400" />
          <span>Route</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-cyan-300 font-bold">▲</span>
          <span>Direction</span>
        </div>
      </div>
    </div>
  );
};
