import React from 'react';
import { TopBar } from './TopBar';
import { ChatCanvas } from './ChatCanvas';
import { HitlDrawer } from './HitlDrawer';
import { CryptographicReceiptModal } from './CryptographicReceiptModal';
import { NotificationDrawer } from './NotificationDrawer';
import { GisMapModal } from '../gis/GisMapModal';
import { Campus3DMap } from '../Campus3DMap';
import { CommunicationDashboard } from '../communication/CommunicationDashboard';
import { PlacementDashboard } from '../placement/PlacementDashboard';
import { PlacementWorkspace } from '../PlacementWorkspace';
import { WaiverPetitionHub } from '../waiver/WaiverPetitionHub';
import { RecruiterPerspectiveModal } from '../placement/RecruiterPerspectiveModal';
import { InterviewCoachModal } from '../placement/InterviewCoachModal';
import { MultiTenantAuthModal } from '../landing/MultiTenantAuthModal';
import { DashboardBackgroundCanvas } from './DashboardBackgroundCanvas';
import { ParticleCanvas } from './ParticleCanvas';
import { SparklineCanvas } from './SparklineCanvas';
import { RaycastCommandPalette } from './RaycastCommandPalette';
import { HodGovernanceInbox } from './HodGovernanceInbox';
import { FacultyDashboardView } from './FacultyDashboardView';
import { AcademicStudyEnclave } from './AcademicStudyEnclave';
import { useApp } from '../../context/AppContext';
import { MapPin, GraduationCap, FileCheck, ShieldCheck, ArrowRight, TrendingUp, BookOpen, Brain } from 'lucide-react';

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
      className="h-screen w-screen bg-[#05070A] dark:bg-[#05070A] html-light:bg-[#F1F5F9] text-slate-100 dark:text-slate-100 html-light:text-slate-900 flex flex-col overflow-x-hidden overflow-y-hidden font-sans select-none relative transition-colors duration-300 text-[15px] leading-relaxed"
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      {/* 60 FPS Cyberpunk Particle Canvas Engine */}
      <ParticleCanvas />

      {/* Deep Space Canvas Ambient Layer & Translucent Dot Grid Mesh */}
      <DashboardBackgroundCanvas />

      {/* Raycast Command Palette (Cmd + K / Ctrl + K) */}
      <RaycastCommandPalette />

      {/* Header Navigation Bar */}
      <TopBar />

      {/* Main Tab Workspace Container */}
      <main className="flex-1 overflow-hidden relative z-10">
        {activeTab === 'dashboard' && (
          <div className="h-full overflow-y-auto p-4 sm:p-6">
            {/* 1. HOD ROLE WORKSPACE: Executive Department Overview & Split-Pane Inbox */}
            {activeRole === 'hod' && <HodGovernanceInbox />}

            {/* 2. FACULTY ROLE WORKSPACE: Class Batch Telemetry & Recommendation Queue */}
            {activeRole === 'faculty' && <FacultyDashboardView />}

            {/* 3. STUDENT ROLE WORKSPACE: Personal CGPA, Attendance & Governance Overview */}
            {activeRole === 'student' && (
              <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
                {/* Left Column: Command & Chat Canvas */}
                <div className="lg:col-span-7 h-full overflow-hidden">
                  <ChatCanvas />
                </div>

                {/* Right Column: Student Executive Overview Panel */}
                <div className="lg:col-span-5 h-full overflow-y-auto space-y-4 hidden lg:block pr-1">
                  {/* Card 1: Student Governance Snapshot */}
                  <div className="zeno-glass-card p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-base uppercase tracking-wider text-slate-300 dark:text-slate-300 html-light:text-slate-800 flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                        <span>Governance Telemetry Profile</span>
                      </h3>
                      <span
                        className="px-3 py-1 rounded-full font-mono text-xs font-bold border uppercase"
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
                      <div className="font-extrabold text-xl text-slate-100 dark:text-white html-light:text-slate-900">{student?.name || 'Alex Rivera'}</div>
                      <div className="text-sm text-slate-400 dark:text-slate-400 html-light:text-slate-600 font-mono">
                        {student?.rollNumber || '2451-22-733-001'} • {student?.department || 'Computer Science & Engineering'}
                      </div>
                    </div>

                    {/* Real-Time Telemetry Sparklines Grid */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {/* Metric 1: CGPA */}
                      <div className="p-3.5 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 html-light:bg-slate-100 border border-slate-800 dark:border-slate-800 html-light:border-slate-300 flex flex-col justify-between">
                        <div className="text-xs text-slate-400 dark:text-slate-400 html-light:text-slate-600 font-mono uppercase font-bold">CGPA</div>
                        <div className="text-2xl font-extrabold font-mono text-cyan-400 py-1">{student?.cgpa ?? 8.84}</div>
                        <SparklineCanvas data={[8.2, 8.4, 8.5, 8.7, 8.84]} color={accentColor} height={26} width={80} />
                      </div>

                      {/* Metric 2: Attendance */}
                      <div className="p-3.5 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 html-light:bg-slate-100 border border-slate-800 dark:border-slate-800 html-light:border-slate-300 flex flex-col justify-between">
                        <div className="text-xs text-slate-400 dark:text-slate-400 html-light:text-slate-600 font-mono uppercase font-bold">Attendance</div>
                        <div className="text-2xl font-extrabold font-mono text-amber-400 py-1">
                          {student?.attendancePercentage ?? 72.5}%
                        </div>
                        <SparklineCanvas data={[88, 84, 79, 75, 72.5]} color="#F59E0B" height={26} width={80} />
                      </div>

                      {/* Metric 3: Placement Readiness */}
                      <div className="p-3.5 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 html-light:bg-slate-100 border border-slate-800 dark:border-slate-800 html-light:border-slate-300 flex flex-col justify-between">
                        <div className="text-xs text-slate-400 dark:text-slate-400 html-light:text-slate-600 font-mono uppercase font-bold">Placement</div>
                        <div className="text-2xl font-extrabold font-mono text-emerald-400 py-1">
                          {student?.overallPlacementScore ?? 88}%
                        </div>
                        <SparklineCanvas data={[70, 78, 85, 90, 94]} color="#10B981" height={26} width={80} />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Spatial GIS Class Location */}
                  <div className="zeno-glass-card p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm font-bold text-cyan-400">
                        <MapPin className="w-4 h-4" />
                        <span>Current Class Location</span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">10:00 AM - 12:00 PM</span>
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold text-base text-slate-100 dark:text-white html-light:text-slate-900">Operating Systems Laboratory</div>
                      <div className="text-sm text-slate-400 dark:text-slate-400 html-light:text-slate-600">Admin Block, Floor 2, Room CL-12</div>
                    </div>

                    <button
                      onClick={openGisNavigation}
                      className="w-full py-3 bg-slate-900 dark:bg-slate-900 html-light:bg-slate-200 hover:bg-slate-800 text-slate-100 dark:text-white html-light:text-slate-900 text-xs font-bold rounded-xl border border-slate-700 dark:border-slate-700 html-light:border-slate-300 transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <span>Launch Spatial Indoor Map</span>
                      <ArrowRight className="w-4 h-4 text-cyan-400" />
                    </button>
                  </div>

                  {/* Card 3: Placement AI readiness preview */}
                  <div className="zeno-glass-card p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm font-bold text-emerald-400">
                        <GraduationCap className="w-4 h-4" />
                        <span>Placement AI Readiness</span>
                      </div>
                      <span className="text-sm font-mono font-bold text-emerald-400">94% Match</span>
                    </div>

                    <p className="text-sm text-slate-300 dark:text-slate-300 html-light:text-slate-700 leading-relaxed">
                      Target Drive: <strong className="text-white dark:text-white html-light:text-slate-900">Google AI Engineer (L3)</strong>. 0 Backlogs, ATS Resume Score 88%.
                    </p>

                    <button
                      onClick={() => setActiveTab('placement')}
                      className="w-full py-3 bg-slate-900 dark:bg-slate-900 html-light:bg-slate-200 hover:bg-slate-800 text-slate-100 dark:text-white html-light:text-slate-900 text-xs font-bold rounded-xl border border-slate-700 dark:border-slate-700 html-light:border-slate-300 transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <span>Open Placement Workspace</span>
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>

                  {/* Card 4: Attendance Condensation Petition */}
                  <div className="zeno-glass-card p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm font-bold text-amber-400">
                        <FileCheck className="w-4 h-4" />
                        <span>Attendance Waiver Petition</span>
                      </div>
                      <span className="text-xs font-mono text-amber-400 font-bold">Draft</span>
                    </div>

                    <p className="text-sm text-slate-300 dark:text-slate-300 html-light:text-slate-700 leading-relaxed">
                      72.5% current attendance. 2.5% condensation petition pending HOD signoff via HITL Approval Drawer.
                    </p>

                    <button
                      onClick={() => setIsHitlDrawerOpen(true)}
                      className="w-full py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 transition-all flex items-center justify-center space-x-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Review HITL Approval Drawer</span>
                    </button>
                  </div>
                  {/* Card 5: Academic Study Enclave Overview */}
                  <div className="zeno-glass-card p-5 space-y-3 border-purple-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm font-bold text-purple-400">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <span>Academic Study Enclave</span>
                      </div>
                      <span className="text-xs font-mono text-purple-400 font-bold">RAG READY</span>
                    </div>

                    <p className="text-sm text-slate-300 dark:text-slate-300 html-light:text-slate-700 leading-relaxed">
                      Data Structures & Algorithms vector store indexed. 2 pre-analyzed files, 41% weak topic in AVL Rotations.
                    </p>

                    <button
                      onClick={() => setActiveTab('study')}
                      className="w-full py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-bold rounded-xl border border-purple-500/40 transition-all flex items-center justify-center space-x-2"
                    >
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span>Open Academic Study Enclave</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'communication' && (
          <div className="h-full p-4 sm:p-6 overflow-y-auto bg-transparent">
            <CommunicationDashboard />
          </div>
        )}

        {activeTab === 'study' && (
          <div className="h-full p-4 sm:p-6 overflow-y-auto bg-transparent">
            <AcademicStudyEnclave />
          </div>
        )}

        {activeTab === 'gis' && (
          <div className="h-full p-4 sm:p-6 overflow-y-auto bg-transparent">
            <Campus3DMap />
          </div>
        )}

        {activeTab === 'placement' && (
          <div className="h-full p-4 sm:p-6 overflow-y-auto bg-transparent space-y-6">
            <PlacementWorkspace />
            <PlacementDashboard />
          </div>
        )}

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
