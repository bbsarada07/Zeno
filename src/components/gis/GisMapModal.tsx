import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Campus3DMap } from '../Campus3DMap';

export const GisMapModal: React.FC = () => {
  const { isGisModalOpen, setIsGisModalOpen } = useApp();

  if (!isGisModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 font-sans select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-6xl h-[90vh] bg-[#090D14]/95 border border-slate-800 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col text-slate-100"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center space-x-2">
                <span>Spatial 3D Campus Digital Twin & Indoor Blueprint</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  [AGENT: ACADEMIC_GIS]
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsGisModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto">
          <Campus3DMap />
        </div>
      </motion.div>
    </div>
  );
};
