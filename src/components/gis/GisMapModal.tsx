import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation, Compass, Layers, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_SCHEDULE } from '../../data/mockData';

export const GisMapModal: React.FC = () => {
  const { isGisModalOpen, setIsGisModalOpen } = useApp();

  if (!isGisModalOpen) return null;

  const currentClass = MOCK_SCHEDULE[0]; // Admin Block, Floor 2, Room CL-12

  const navigationSteps = [
    'Enter Admin Block Main Entrance Gate A',
    'Take Central Elevator B2 to Floor 2',
    'Turn right into CSE Department East Wing Corridor',
    'Proceed 25 meters past Network Systems Lab',
    'Arrive at Room CL-12 (Operating Systems Laboratory) on the Left',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-foreground flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <span>Spatial Campus GIS Indoor Map Engine</span>
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {currentClass.building} • Floor {currentClass.floor} • Room {currentClass.roomNumber} ({currentClass.subject})
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGisModalOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Floor Plan Canvas Preview + Turn-by-Turn Directions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Left: SVG / Canvas Floor Plan Map */}
          <div className="lg:col-span-8 p-6 bg-background relative flex items-center justify-center border-b lg:border-b-0 lg:border-r border-border min-h-[300px]">
            <svg viewBox="0 0 600 400" className="w-full h-full max-h-[360px] select-none">
              {/* Outer Building Perimeter */}
              <rect x="30" y="30" width="540" height="340" rx="16" fill="rgba(39, 39, 42, 0.2)" stroke="rgba(161, 161, 170, 0.3)" strokeWidth="2" />

              {/* Rooms Grid */}
              {/* Entrance */}
              <rect x="50" y="310" width="100" height="40" rx="8" fill="rgba(59, 130, 246, 0.1)" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.5" />
              <text x="100" y="335" textAnchor="middle" fill="#3B82F6" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Elevator B2</text>

              {/* Corridor */}
              <path d="M 100 310 L 100 200 L 450 200" fill="none" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="4" strokeDasharray="6 6" className="animate-pulse" />

              {/* Adjacent Labs */}
              <rect x="180" y="60" width="110" height="110" rx="8" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
              <text x="235" y="120" textAnchor="middle" fill="#A1A1AA" fontSize="10" fontFamily="sans-serif">CL-10 Networks</text>

              <rect x="310" y="60" width="110" height="110" rx="8" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
              <text x="365" y="120" textAnchor="middle" fill="#A1A1AA" fontSize="10" fontFamily="sans-serif">CL-11 Systems</text>

              {/* Target Room CL-12 */}
              <rect x="440" y="60" width="110" height="110" rx="8" fill="rgba(16, 185, 129, 0.15)" stroke="#10B981" strokeWidth="2.5" />
              <text x="495" y="110" textAnchor="middle" fill="#10B981" fontSize="12" fontWeight="bold" fontFamily="sans-serif">CL-12 OS LAB</text>
              <text x="495" y="130" textAnchor="middle" fill="#A1A1AA" fontSize="9" fontFamily="sans-serif">Dr. K. Srinivas</text>

              {/* Route Destination Marker */}
              <circle cx="495" cy="180" r="8" fill="#10B981" className="animate-ping" />
              <circle cx="495" cy="180" r="5" fill="#10B981" />
            </svg>
          </div>

          {/* Right: Step-by-Step Directions */}
          <div className="lg:col-span-4 p-6 bg-card space-y-4 overflow-y-auto">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Navigation className="w-4 h-4 text-primary" />
              <span>Turn-by-Turn Indoor Route</span>
            </div>

            <div className="space-y-3">
              {navigationSteps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-[10px] shrink-0 border border-primary/20 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <button
                onClick={() => setIsGisModalOpen(false)}
                className="w-full py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-xl hover:opacity-90 transition-all"
              >
                Close Map Navigation
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
