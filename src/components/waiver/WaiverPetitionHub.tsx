import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCheck, AlertTriangle, ShieldCheck, ArrowRight, FileText, PlusCircle, CheckCircle2, Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WaiverPetitionHub: React.FC = () => {
  const { student, waiverPetition, setIsHitlDrawerOpen, submitPetition } = useApp();

  const [showNewModal, setShowNewModal] = useState(false);
  const [category, setCategory] = useState<'Medical Waiver' | 'Sports Duty' | 'Academic Condonation'>('Medical Waiver');
  const [dates, setDates] = useState('05 August 2026 – 07 August 2026');
  const [classesMissed, setClassesMissed] = useState(12);
  const [shortfall, setShortfall] = useState(2.5);
  const [hospital, setHospital] = useState('Yashoda Hospitals, Somajiguda');
  const [doctor, setDoctor] = useState('Dr. A. P. Reddy (MD)');
  const [letterText, setLetterText] = useState(`Respected Head of Department,

I am writing to formally submit my medical attendance condensation petition for 12 missed lecture hours due to acute gastroenteritis under treatment at Yashoda Hospitals.

Requesting your signoff to condone attendance to meet the mandatory 75% threshold.

Thanking you,
Alex Rivera (2451-22-733-001)`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPetition({
      studentName: student?.name || 'Alex Rivera',
      rollNumber: student?.rollNumber || '2451-22-733-001',
      department: student?.department || 'Computer Science & Engineering',
      category,
      datesAffected: dates,
      classesMissed,
      currentAttendance: 72.5,
      postWaiverAttendance: 75.2,
      shortfallPercentage: shortfall,
      status: 'Pending HOD Approval',
      hospitalName: hospital,
      doctorName: doctor,
      ocrScore: 97,
      ocrDetails: `OCR Verified (${hospital} Certificate #YSH-2026-9901)`,
      documentFileName: `${hospital.split(' ')[0]}_Medical_Certificate_2026.pdf`,
      petitionLetter: letterText,
    });
    setShowNewModal(false);
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-6 bg-transparent text-slate-100 font-sans select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 zeno-glass-card">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Attendance Shortage Alert • 72.5% (Threshold: 75.0%)</span>
          </div>
          <h2 className="text-xl font-bold text-white">Medical Attendance Waiver & Condensation Hub</h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated OCR verification and HOD condensation petition workflow for Alex Rivera ({student?.rollNumber}).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center space-x-2 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit New Petition</span>
          </button>

          <button
            onClick={() => setIsHitlDrawerOpen(true)}
            className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition-all flex items-center space-x-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Review & Dispatch via HITL</span>
          </button>
        </div>
      </div>

      {/* Grid Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Attendance Condensation Math */}
        <div className="p-5 zeno-glass-card space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Attendance Percentage</span>
            <span className="font-mono text-amber-400 font-bold">Shortfall: -2.5%</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-mono text-white">{waiverPetition.currentAttendance}%</span>
              <span className="text-xs text-slate-400">Target: 75.0%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${(waiverPetition.currentAttendance / 100) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center justify-between font-mono">
            <span>Post-Waiver Condensation:</span>
            <span className="font-bold text-sm">{waiverPetition.postWaiverAttendance}% ✅</span>
          </div>
        </div>

        {/* Card 2: OCR Document Verification */}
        <div className="p-5 zeno-glass-card space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Medical Certificate OCR Status</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/30">
              VERIFIED 96%
            </span>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <FileText className="w-8 h-8 text-cyan-400" />
            <div className="overflow-hidden text-ellipsis">
              <div className="text-xs font-semibold text-white truncate">{waiverPetition.documentFileName}</div>
              <div className="text-[11px] text-slate-400">{waiverPetition.hospitalName}</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Attending Physician:</span>
              <span className="font-semibold text-white">{waiverPetition.doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span>Dates Missed:</span>
              <span className="font-mono text-amber-400">{waiverPetition.datesAffected}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Petition Workflow Status */}
        <div className="p-5 zeno-glass-card space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Workflow Pipeline Status</span>
            <span className="text-xs font-mono font-bold text-cyan-400">{waiverPetition.status}</span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center space-x-3 text-xs">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] border border-emerald-500/30">
                1
              </div>
              <span className="text-slate-400 line-through">Medical Certificate OCR Scan</span>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] border border-emerald-500/30">
                2
              </div>
              <span className="text-slate-400 line-through">Faculty Advisor Recommendation</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-semibold text-white">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px] shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                3
              </div>
              <span>HOD Governance Action Approval</span>
            </div>
          </div>

          <button
            onClick={() => setIsHitlDrawerOpen(true)}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl border border-slate-700 transition-all flex items-center justify-center space-x-2"
          >
            <span>Open HITL Approval Drawer</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* New Petition Modal */}
      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#090D14] border border-slate-800 rounded-3xl p-6 space-y-4 text-slate-100 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Draft & Submit New Condonation Petition</span>
                </h3>
                <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-slate-400">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none"
                  >
                    <option value="Medical Waiver">Medical Waiver</option>
                    <option value="Sports Duty">Sports Duty</option>
                    <option value="Academic Condonation">Academic Condonation</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400">Dates Affected</label>
                    <input
                      type="text"
                      value={dates}
                      onChange={(e) => setDates(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400">Classes Missed (Hours)</label>
                    <input
                      type="number"
                      value={classesMissed}
                      onChange={(e) => setClassesMissed(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400">Hospital / Institution</label>
                    <input
                      type="text"
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400">Doctor / Issuing Authority</label>
                    <input
                      type="text"
                      value={doctor}
                      onChange={(e) => setDoctor(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Petition Letter Body</label>
                  <textarea
                    value={letterText}
                    onChange={(e) => setLetterText(e.target.value)}
                    className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit to HOD Governance Pipeline</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
