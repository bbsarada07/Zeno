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
import { useApp } from '../../context/AppContext';
import { MapPin, GraduationCap, FileCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export const ConsoleDashboard: React.FC = () => {
  const { activeTab, student, openGisNavigation, setActiveTab, setIsHitlDrawerOpen } = useApp();

  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden font-sans select-none">
      {/* Executive Clean Header TopBar */}
      <TopBar />

      {/* Main Tab Workspace Container */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'dashboard' && (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* Left Column: Command & Chat Canvas */}
            <div className="lg:col-span-7 h-full overflow-hidden">
              <ChatCanvas />
            </div>

            {/* Right Column: Executive Overview Panel (Zero Telemetry Graph Noise) */}
            <div className="lg:col-span-5 h-full overflow-y-auto p-4 sm:p-6 space-y-4 hidden lg:block border-l border-border bg-card/20">
              {/* Card 1: Student Governance Snapshot */}
              <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">Governance Profile</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
                    ACTIVE SESSION
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="font-bold text-base">{student.name}</div>
                  <div className="text-muted-foreground font-mono">{student.rollNumber} • {student.department}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                    <div className="text-[10px] text-muted-foreground uppercase font-semibold">CGPA</div>
                    <div className="text-sm font-extrabold font-mono text-primary">{student.cgpa}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                    <div className="text-[10px] text-muted-foreground uppercase font-semibold">Attendance</div>
                    <div className="text-sm font-extrabold font-mono text-amber-500">{student.attendancePercentage}%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                    <div className="text-[10px] text-muted-foreground uppercase font-semibold">Placement</div>
                    <div className="text-sm font-extrabold font-mono text-emerald-400">{student.overallPlacementScore}%</div>
                  </div>
                </div>
              </div>

              {/* Card 2: Spatial GIS Class Location */}
              <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
                    <MapPin className="w-4 h-4" />
                    <span>Current Class Location</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">10:00 AM - 12:00 PM</span>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-sm">Operating Systems Laboratory</div>
                  <div className="text-xs text-muted-foreground">Admin Block, Floor 2, Room CL-12</div>
                </div>

                <button
                  onClick={openGisNavigation}
                  className="w-full py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-medium rounded-xl border border-border transition-all flex items-center justify-center space-x-2"
                >
                  <span>Launch Spatial Indoor Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card 3: Placement AI readiness preview */}
              <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                    <GraduationCap className="w-4 h-4" />
                    <span>Placement AI Readiness</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">94% Match</span>
                </div>

                <p className="text-xs text-muted-foreground">
                  Target Drive: <strong>Google AI Engineer (L3)</strong>. 0 Backlogs, ATS Resume Score 88%.
                </p>

                <button
                  onClick={() => setActiveTab('placement')}
                  className="w-full py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-medium rounded-xl border border-border transition-all flex items-center justify-center space-x-2"
                >
                  <span>Open Placement Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card 4: Attendance Condensation Petition */}
              <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
                    <FileCheck className="w-4 h-4" />
                    <span>Attendance Waiver Petition</span>
                  </div>
                  <span className="text-xs font-mono text-amber-500 font-bold">Draft</span>
                </div>

                <p className="text-xs text-muted-foreground">
                  72.5% current attendance. 2.5% condensation petition pending HOD signoff via HITL Approval Drawer.
                </p>

                <button
                  onClick={() => setIsHitlDrawerOpen(true)}
                  className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-xl border border-amber-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Review HITL Approval Drawer</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gis' && (
          <div className="h-full p-4 sm:p-6 overflow-y-auto bg-background">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="p-6 rounded-2xl bg-card border border-border flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <span>Spatial Campus GIS Indoor Map</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Indoor floor plan routing for Admin Block, Floor 2, Room CL-12.
                  </p>
                </div>
                <button
                  onClick={openGisNavigation}
                  className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm"
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
