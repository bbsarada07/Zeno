import React, { useMemo } from 'react';
import { getCampusLocations } from '../services/dijkstraRouter';
import type { CampusLocation, DijkstraResult } from '../services/dijkstraRouter';
import { MapPin, Navigation, Compass } from 'lucide-react';

interface Campus2DMapProps {
  selectedLocationId: string | null;
  sourceLocationId: string;
  onSelectLocation: (locId: string) => void;
  routeResult: DijkstraResult | null;
}

export const Campus2DMap: React.FC<Campus2DMapProps> = ({
  selectedLocationId,
  sourceLocationId,
  onSelectLocation,
  routeResult,
}) => {
  const locations = useMemo(() => getCampusLocations(), []);

  // Map coordinate bounds to SVG ViewBox (World X: -160 to +160, World Z: -180 to +180)
  // SVG coordinates: Center (400, 300), Width: 800, Height: 600
  const worldToSvg = (x: number, z: number): { cx: number; cy: number } => {
    const cx = 400 + x * 2.1;
    const cy = 300 + z * 1.65;
    return { cx, cy };
  };

  // Find source & destination coordinates
  const sourceLoc = locations.find((l) => l.id === sourceLocationId || l.code.toLowerCase() === sourceLocationId.replace('n_', '').toLowerCase());
  const destLoc = locations.find((l) => l.id === selectedLocationId);

  const sourcePos = sourceLoc ? worldToSvg(sourceLoc.position3D[0], sourceLoc.position3D[2]) : worldToSvg(80, 100);
  const destPos = destLoc ? worldToSvg(destLoc.position3D[0], destLoc.position3D[2]) : null;

  // Build SVG Path for Dijkstra Route
  const routeSvgPoints = useMemo(() => {
    if (!routeResult || routeResult.pathCoordinates.length < 2) return null;
    return routeResult.pathCoordinates
      .map((pt) => {
        const { cx, cy } = worldToSvg(pt[0], pt[2]);
        return `${cx},${cy}`;
      })
      .join(' ');
  }, [routeResult]);

  return (
    <div className="w-full h-full relative select-none overflow-hidden rounded-2xl bg-[#09111E] border border-slate-800 shadow-2xl flex flex-col items-center justify-center font-mono">
      {/* 2D MAP HEADER BAR */}
      <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-xs text-cyan-300 font-bold flex items-center space-x-2 backdrop-blur-md shadow-md">
        <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
        <span>INTERACTIVE 2D CAMPUS GIS MAP</span>
      </div>

      {/* SVG CANVAS FOR ROADS, BUILDINGS, LABELS & ROUTE */}
      <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
        {/* Background Grass & Terrain */}
        <rect x="0" y="0" width="800" height="600" fill="#0B1726" />
        <rect x="40" y="30" width="720" height="540" rx="20" fill="#0D1E30" stroke="#1E293B" strokeWidth="2" />

        {/* Primary Campus Asphalt Roads */}
        <g stroke="#1E293B" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.65">
          {/* Main Entrance Highway */}
          <path d="M 379 520 L 379 430 L 379 260 L 379 170" />
          {/* Ring Road East */}
          <path d="M 379 430 L 568 430 L 673 300 L 673 170 L 568 69 L 379 69" />
          {/* Ring Road West */}
          <path d="M 379 430 L 232 430 L 169 333 L 169 234 L 232 69 L 379 69" />
        </g>

        {/* Secondary Walking Pathways */}
        <g stroke="#334155" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.8">
          <path d="M 378 430 L 494 430 L 568 430" />
          <path d="M 378 333 L 295 333 L 169 333" />
          <path d="M 378 333 L 452 333 L 673 300" />
          <path d="M 378 234 L 232 234" />
          <path d="M 378 234 L 463 234" />
          <path d="M 378 118 L 337 118" />
          <path d="M 378 118 L 463 118" />
        </g>

        {/* 16 CAMPUS BUILDINGS & GROUNDS FOOTPRINTS */}
        {locations.map((loc) => {
          const { cx, cy } = worldToSvg(loc.position3D[0], loc.position3D[2]);
          const isSelected = selectedLocationId === loc.id;
          const isSource = sourceLoc?.id === loc.id;

          const width = loc.dimensions.width * 1.5;
          const height = loc.dimensions.length * 1.2;

          return (
            <g
              key={loc.id}
              onClick={() => onSelectLocation(loc.id)}
              className="cursor-pointer group"
            >
              {/* Building Shadow / Ground Footprint */}
              <rect
                x={cx - width / 2 + 3}
                y={cy - height / 2 + 3}
                width={width}
                height={height}
                rx="6"
                fill="#000000"
                opacity="0.4"
              />

              {/* Building Main Base Shape */}
              <rect
                x={cx - width / 2}
                y={cy - height / 2}
                width={width}
                height={height}
                rx="6"
                fill={isSelected ? '#0284C7' : isSource ? '#0F766E' : '#1E293B'}
                stroke={isSelected ? '#00F0FF' : isSource ? '#14B8A6' : '#475569'}
                strokeWidth={isSelected ? '3' : '1.5'}
                className="transition-all duration-300 group-hover:stroke-cyan-400"
              />

              {/* Dynamic Glow Effect ONLY for Selected Building */}
              {isSelected && (
                <rect
                  x={cx - width / 2 - 4}
                  y={cy - height / 2 - 4}
                  width={width + 8}
                  height={height + 8}
                  rx="10"
                  fill="none"
                  stroke="#00F0FF"
                  strokeWidth="2"
                  opacity="0.8"
                  className="animate-pulse"
                />
              )}

              {/* Readable Building Label */}
              <text
                x={cx}
                y={cy + 3}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isSelected ? '#FFFFFF' : '#E2E8F0'}
                fontSize={width > 70 ? '10' : '8'}
                fontWeight={isSelected ? 'bold' : '600'}
                className="pointer-events-none"
              >
                {loc.name.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* DIJKSTRA 2D ROUTE ANIMATED LINE */}
        {routeSvgPoints && (
          <g>
            {/* Outer Glow Route */}
            <polyline
              points={routeSvgPoints}
              fill="none"
              stroke="#00F0FF"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />

            {/* Core Route Line */}
            <polyline
              points={routeSvgPoints}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 6"
              className="animate-dash"
            />
          </g>
        )}

        {/* SOURCE MARKER (START) */}
        {sourcePos && (
          <g transform={`translate(${sourcePos.cx}, ${sourcePos.cy})`}>
            <circle r="14" fill="#14B8A6" opacity="0.3" className="animate-ping" />
            <circle r="8" fill="#14B8A6" stroke="#FFFFFF" strokeWidth="2" />
            <text x="0" y="-14" textAnchor="middle" fill="#14B8A6" fontSize="10" fontWeight="bold">
              START
            </text>
          </g>
        )}

        {/* DESTINATION MARKER (ONLY FOR ACTIVE SELECTED DESTINATION) */}
        {destPos && destLoc && (
          <g transform={`translate(${destPos.cx}, ${destPos.cy})`}>
            <circle r="18" fill="#EF4444" opacity="0.35" className="animate-ping" />
            <circle r="9" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
            <text x="0" y="-16" textAnchor="middle" fill="#F87171" fontSize="11" fontWeight="bold">
              DESTINATION
            </text>
          </g>
        )}
      </svg>

      {/* 2D MAP FOOTER LEGEND */}
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
          <span>Shortest Path</span>
        </div>
      </div>
    </div>
  );
};
