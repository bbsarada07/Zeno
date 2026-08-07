import React from 'react';
import { TopBar } from './TopBar';
import { ChatCanvas } from './ChatCanvas';
import { HitlDrawer } from './HitlDrawer';
import { CryptographicReceiptModal } from './CryptographicReceiptModal';
import { NotificationDrawer } from './NotificationDrawer';
import { GisMapModal } from '../gis/GisMapModal';
import { PlacementDashboard } from '../placement/PlacementDashboard';
import { WaiverPetitionHub } from '../waiver/WaiverPetitionHub';
import { RecruiterPerspectiveModal } from '../placement/RecruiterPerspectiveModal';
import { InterviewCoachModal } from '../placement/InterviewCoachModal';
import { MultiTenantAuthModal } from '../landing/MultiTenantAuthModal';
import { DashboardBackgroundCanvas } from './DashboardBackgroundCanvas';
import { SparklineCanvas } from './SparklineCanvas';
import { RaycastCommandPalette } from './RaycastCommandPalette';
import { useApp } from '../../context/AppContext';
import { MapPin, GraduationCap, FileCheck, ShieldCheck, ArrowRight, TrendingUp } from 'lucide-react';

const ROLE_ACCENT_MAP: Record<string, string> = {
  student: '#00F0FF',
  faculty: '#10B981',
  hod: '#F59E0B',
};

export const ConsoleDashboard: React.FC = () => {
  const { activeTab, student, activeRole, openGisNavigation, setActiveTab, setIsHitlDrawerOpen } = useApp();

  const accentColor = ROLE_ACCENT_MAP[activeRole] || '#00F0FF';

  return (
    <div
      className="h-screen w-screen bg-[#05070A] text-slate-100 flex flex-col overflow-hidden font-sans select-none relative"
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      {/* Deep Space Canvas Ambient Layer */}
      <DashboardBackgroundCanvas />

      {/* Raycast Command Palette (Cmd + K / Ctrl + K) */}
      <RaycastCommandPalette />

      {/* Header Navigation Bar */}
      <TopBar />

      {/* Main Tab Workspace Container */}
      <main className="flex-1 overflow-hidden relative z-10">
        {activeTab === 'dashboard' && (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* Left Column: Command & Chat Canvas */}
            <div className="lg:col-span-7 h-full overflow-hidden">
              <ChatCanvas />
            </div>

            {/* Right Column: High-Fidelity Executive Overview Panel */}
            <div className="lg:col-span-5 h-full overflow-y-auto p-4 sm:p-6 space-y-4 hidden lg:block border-l border-slate-800/80 bg-[#070A0F]/60 backdrop-blur-md">
              {/* Card 1: Student Governance Snapshot */}
              <div className="p-5 rounded-2xl bg-[#090D14]/80 border border-slate-800/80 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] hover:border-[var(--accent-color)]/50 transition-all duration-300 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>Governance Telemetry Profile</span>
                  </h3>
                  <span
                    className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border uppercase"
                    style={{
                      color: accentColor,
                      backgroundColor: `${accentColor}15`,
                      borderColor: `${accentColor}40`,
                    }}
                  >
                    {activeRole} SESSION
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-base text-white">{student.name}</div>
                  <div className="text-xs text-slate-400 font-mono">
                    {student.rollNumber} • {student.department}
                  </div>
                </div>

                {/* Real-Time Telemetry Sparklines Grid */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {/* Metric 1: CGPA */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                    <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">CGPA</div>
                    <div className="text-base font-extrabold font-mono text-cyan-400 py-1">{student.cgpa}</div>
                    <SparklineCanvas data={[8.2, 8.4, 8.5, 8.7, 8.84]} color={accentColor} height={24} width={70} />
                  </div>

                  {/* Metric 2: Attendance */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                    <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">Attendance</div>
                    <div className="text-base font-extrabold font-mono text-amber-400 py-1">
                      {student.attendancePercentage}%
                    </div>
                    <SparklineCanvas data={[88, 84, 79, 75, 72.5]} color="#F59E0B" height={24} width={70} />
                  </div>

                  {/* Metric 3: Placement Readiness */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                    <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">Placement</div>
                    <div className="text-base font-extrabold font-mono text-emerald-400 py-1">
                      {student.overallPlacementScore}%
                    </div>
                    <SparklineCanvas data={[70, 78, 85, 90, 94]} color="#10B981" height={24} width={70} />
                  </div>
                </div>
              </div>

              {/* Card 2: Spatial GIS Class Location */}
              <div className="p-5 rounded-2xl bg-[#090D14]/80 border border-slate-800/80 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] hover:border-cyan-500/50 transition-all duration-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400">
                    <MapPin className="w-4 h-4" />
                    <span>Current Class Location</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">10:00 AM - 12:00 PM</span>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-sm text-white">Operating Systems Laboratory</div>
                  <div className="text-xs text-slate-400">Admin Block, Floor 2, Room CL-12</div>
                </div>

                <button
                  onClick={openGisNavigation}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>Launch Spatial Indoor Map</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>

              {/* Card 3: Placement AI readiness preview */}
              <div className="p-5 rounded-2xl bg-[#090D14]/80 border border-slate-800/80 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] hover:border-emerald-500/50 transition-all duration-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                    <GraduationCap className="w-4 h-4" />
                    <span>Placement AI Readiness</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">94% Match</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Target Drive: <strong className="text-white">Google AI Engineer (L3)</strong>. 0 Backlogs, ATS Resume Score 88%.
                </p>

                <button
                  onClick={() => setActiveTab('placement')}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>Open Placement Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>

              {/* Card 4: Attendance Condensation Petition */}
              <div className="p-5 rounded-2xl bg-[#090D14]/80 border border-slate-800/80 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] hover:border-amber-500/50 transition-all duration-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                    <FileCheck className="w-4 h-4" />
                    <span>Attendance Waiver Petition</span>
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-bold">Draft</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  72.5% current attendance. 2.5% condensation petition pending HOD signoff via HITL Approval Drawer.
                </p>

                <button
                  onClick={() => setIsHitlDrawerOpen(true)}
                  className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 transition-all flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Review HITL Approval Drawer</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gis' && (
          <div className="h-full p-4 sm:p-6 overflow-y-auto bg-transparent">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="p-6 rounded-2xl bg-[#090D14]/80 border border-slate-800 backdrop-blur-xl flex items-center justify-between shadow-2xl">
                <div>
                  <h2 className="text-xl font-bold flex items-center space-x-2 text-white">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                    <span>Spatial Campus GIS Indoor Map</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Indoor floor plan routing for Admin Block, Floor 2, Room CL-12.
                  </p>
                </div>
                <button
                  onClick={openGisNavigation}
                  className="px-4 py-2.5 bg-cyan-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                >
                  Open Full Canvas Map Modal
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'placement' && <PlacementDashboard />}

        {activeTab === 'waivers' && <WaiverPetitionHub />}
      </main>

      {/* Floating Interactive Drawers & Modals */}
      <HitlDrawer />
      <CryptographicReceiptModal />
      <NotificationDrawer />
      <GisMapModal />
      <RecruiterPerspectiveModal />
      <InterviewCoachModal />
      <MultiTenantAuthModal />
    </div>
  );
};
