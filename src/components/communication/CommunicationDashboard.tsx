import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  UserCheck,
  Bell,
  Sparkles,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Bookmark,
  Languages,
  BookOpen,
  Users,
  ShieldCheck,
  Zap,
  Send,
  X,
  ChevronRight,
  Plus,
  HelpCircle,
  ExternalLink,
  Award,
  Layers,
} from 'lucide-react';
import communicationData from '../../data/communicationData.json';
import {
  summarizeNotice,
  translateNotice,
  predictGrievanceDepartment,
  answerCommunicationQuery,
  getSharedCommunicationStore,
  updateAppointmentStatusInStore,
  updateFacultyAvailabilityInStore,
} from '../../services/communicationAgentService';
import type {
  AnnouncementItem,
  FacultyMember,
  AppointmentRecord,
  ClubItem,
} from '../../services/communicationAgentService';

export const CommunicationDashboard: React.FC = () => {
  // Navigation Sub-Tabs inside Communication Agent Enclave
  const [activeTab, setActiveTab] = useState<'FACULTY_QUEUE' | 'ANNOUNCEMENTS' | 'CLUBS' | 'CLASS_FORUM' | 'GRIEVANCES'>(
    'FACULTY_QUEUE'
  );

  // Dual View Mode: Student View vs Faculty Queue Management View
  const [viewRoleMode, setViewRoleMode] = useState<'STUDENT' | 'FACULTY'>('STUDENT');

  // Shared Datasets State
  const initialStore = getSharedCommunicationStore();
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(initialStore.facultyMembers);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(initialStore.appointments);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(initialStore.announcements);
  const [clubList, setClubList] = useState<ClubItem[]>(initialStore.clubs);
  const [selectedNoticeFilter, setSelectedNoticeFilter] = useState<string>('ALL');
  const [languageMode, setLanguageMode] = useState<'English' | 'Hindi' | 'Telugu'>('English');

  // Search Query State
  const [searchQuery, setSearchQuery] = useState<string>('');

  // HOD Response Modal State
  const [hodModalApp, setHodModalApp] = useState<AppointmentRecord | null>(null);
  const [hodStatusChoice, setHodStatusChoice] = useState<'Approved' | 'Rejected' | 'Pending'>('Approved');
  const [hodDateInput, setHodDateInput] = useState<string>('Monday, March 10');
  const [hodTimeInput, setHodTimeInput] = useState<string>('11:00 AM');
  const [hodLocationInput, setHodLocationInput] = useState<string>('HOD Office, Admin Block Floor 2');
  const [hodRemarksInput, setHodRemarksInput] = useState<string>('Please meet me at 11:00 AM in my office.');
  const [hodRejectionReasonInput, setHodRejectionReasonInput] = useState<string>('Unavailable this week due to accreditation meeting.');

  // Modals & Chat Drawers
  const [activeChatFaculty, setActiveChatFaculty] = useState<FacultyMember | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Dr. V. Rao', text: 'Hello Alex, bring your PyTorch capstone architecture diagram.', time: '10:14 AM' },
  ]);
  const [inputChatMessage, setInputChatMessage] = useState<string>('');

  // Appointment Booking Form State
  const [bookingFaculty, setBookingFaculty] = useState<FacultyMember | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('02:30 PM - 02:45 PM');
  const [appointmentReason, setAppointmentReason] = useState<string>('AI Capstone Project Discussion & GPU Allocation');

  // AI Summarizer Modal State
  const [activeSummaryNotice, setActiveSummaryNotice] = useState<AnnouncementItem | null>(null);

  // Grievance Ticket Form State
  const [grievanceSubject, setGrievanceSubject] = useState<string>('');
  const [grievanceDesc, setGrievanceDesc] = useState<string>('');
  const [suggestedDept, setSuggestedDept] = useState<string>('');
  const [grievanceList, setGrievanceList] = useState(communicationData.grievances);

  // AI Assistant Floating Widget
  const [isAiBotOpen, setIsAiBotOpen] = useState<boolean>(false);
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'Communication Agent AI ready. Ask about your appointment status, HOD availability, CSE notices, or club registrations!',
    },
  ]);
  const [aiInputQuery, setAiInputQuery] = useState<string>('');

  const student = communicationData.studentProfile;

  // Handle Booking Submission
  const handleRequestAppointment = () => {
    if (!bookingFaculty) return;

    const newApp: AppointmentRecord = {
      id: `app-${Date.now()}`,
      facultyId: bookingFaculty.id,
      facultyName: bookingFaculty.name,
      studentName: student.name,
      department: student.department,
      year: student.year,
      section: student.section,
      reason: appointmentReason,
      requestedTime: selectedSlot.split(' - ')[0],
      status: 'Pending',
      createdTimestamp: 'Just Now',
    };

    setAppointments([newApp, ...appointments]);

    setBookingFaculty(null);
  };

  // Save HOD Portal Response to Shared Record
  const handleSaveHodResponse = () => {
    if (!hodModalApp) return;

    const updated = updateAppointmentStatusInStore(hodModalApp.id, {
      status: hodStatusChoice,
      date: hodDateInput,
      time: hodTimeInput,
      location: hodLocationInput,
      remarks: hodRemarksInput,
      rejectionReason: hodRejectionReasonInput,
    });

    if (updated) {
      setAppointments((prev) => prev.map((a) => (a.id === updated.id ? { ...updated } : a)));
    }
    setHodModalApp(null);
  };

  // Grounded AI Chat Bot Execution (STRICT ZERO HALLUCINATION)
  const handleAiBotQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const groundedReply = answerCommunicationQuery(queryText, {
      appointments,
      facultyMembers: facultyList,
      announcements,
      clubs: clubList,
    });

    setAiChatHistory((prev) => [...prev, { sender: 'user', text: queryText }, { sender: 'bot', text: groundedReply }]);
  };

  // Handle New Grievance
  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceSubject || !grievanceDesc) return;

    const dept = predictGrievanceDepartment(grievanceDesc);
    const newGrv = {
      id: `grv-${Date.now()}`,
      category: 'Student Support',
      subject: grievanceSubject,
      status: 'Under Review',
      priority: 'High',
      createdDate: 'Today',
      assignedDepartment: dept,
      timeline: [
        { stage: 'Submitted', timestamp: 'Just now', completed: true },
        { stage: `AI Auto-Routed to ${dept}`, timestamp: 'Just now', completed: true },
        { stage: 'Under Review', timestamp: 'In Progress', completed: false },
        { stage: 'Resolved', timestamp: 'Pending', completed: false },
      ],
    };

    setGrievanceList([newGrv, ...grievanceList]);
    setGrievanceSubject('');
    setGrievanceDesc('');
    setSuggestedDept('');
  };

  return (
    <div className="space-y-6 font-sans select-none text-slate-100 pb-16">
      {/* BRAND HEADER & AUTHENTICATED PROFILE SUMMARY BAR */}
      <div className="p-6 zeno-glass-card border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-950 to-orange-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              <MessageSquare className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-white">ZENO Communication Agent Enclave</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  [AGENT: COMMUNICATION_HUB]
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Clutter-Free Personalized Channel • Faculty Digital Queue • AI Notice Summarizer • Smart Grievances
              </p>
            </div>
          </div>

          {/* Authenticated Student Profile Card */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono flex items-center space-x-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white font-extrabold shadow-md">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-white flex items-center space-x-1.5">
                <span>{student.name}</span>
                <span className="px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-300 text-[9px] font-bold border border-orange-500/30">
                  {student.role}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {student.department} • {student.year} ({student.section})
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Toggle: Student vs Faculty Waiting Queue */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-bold">Role Perspective:</span>
            <button
              onClick={() => setViewRoleMode('STUDENT')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                viewRoleMode === 'STUDENT'
                  ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Student Perspective
            </button>
            <button
              onClick={() => setViewRoleMode('FACULTY')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                viewRoleMode === 'FACULTY'
                  ? 'bg-orange-600 text-white shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Faculty Waiting Queue View (Dr. Rao)
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Authenticated Enrolments: 3 Joined Clubs • 4 Enrolled Courses</span>
          </div>
        </div>
      </div>

      {/* MODULE NAVIGATION TABS */}
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-1 font-mono text-xs">
        <button
          onClick={() => setActiveTab('FACULTY_QUEUE')}
          className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'FACULTY_QUEUE'
              ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400'
              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4 text-orange-400" />
          <span>Faculty & Smart Queue</span>
        </button>

        <button
          onClick={() => setActiveTab('ANNOUNCEMENTS')}
          className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'ANNOUNCEMENTS'
              ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400'
              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-400" />
          <span>College Notices & AI Summarizer</span>
        </button>

        <button
          onClick={() => setActiveTab('CLUBS')}
          className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'CLUBS'
              ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400'
              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-purple-400" />
          <span>Joined Clubs ({student.enrolledClubs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CLASS_FORUM')}
          className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'CLASS_FORUM'
              ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400'
              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Class Forum & Study Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('GRIEVANCES')}
          className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'GRIEVANCES'
              ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400'
              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-rose-400" />
          <span>Grievance & Support Portal</span>
        </button>
      </div>

      {/* MODULE 1: FACULTY COMMUNICATION & SMART DIGITAL QUEUE */}
      {activeTab === 'FACULTY_QUEUE' && (
        <div className="space-y-6">
          {/* STUDENT PERSPECTIVE VIEW */}
          {viewRoleMode === 'STUDENT' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
              {/* Faculty Live Cards List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="zeno-glass-card p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-orange-400" />
                      <span>Faculty Real-Time Availability & Office Hours</span>
                    </h3>
                    <span className="text-[10px] text-blue-400 font-bold">SMART QUEUE ENABLED</span>
                  </div>

                  <div className="space-y-3">
                    {facultyList.map((fac) => {
                      const isBusy = fac.status === 'Busy' || fac.status === 'In Class';
                      return (
                        <div
                          key={fac.id}
                          className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 transition-all space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-bold text-sm text-white flex items-center space-x-2">
                                <span>{fac.name}</span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                    fac.status === 'Available'
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                      : fac.status === 'Busy'
                                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  }`}
                                >
                                  {fac.status}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">{fac.designation} • {fac.officeLocation}</div>
                              <div className="text-[10px] text-orange-300 font-bold mt-1">Status: "{fac.statusNote}"</div>
                            </div>

                            <button
                              onClick={() => setBookingFaculty(fac)}
                              className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs shadow-[0_0_12px_rgba(249,115,22,0.4)] transition-all flex items-center space-x-1"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Request Appointment</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-900">
                            <div>Office Hours: <span className="text-slate-200">{fac.officeHours}</span></div>
                            <div>Next Available: <span className="text-orange-400 font-bold">{fac.nextAvailableTime}</span></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Active Appointment Status & Digital Queue Tracker */}
              <div className="lg:col-span-5 space-y-4">
                <div className="zeno-glass-card p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span>My Active Appointment Queue</span>
                    </h3>
                    <span className="text-[10px] text-emerald-400 font-bold">LIVE POSITION</span>
                  </div>

                  {appointments.length > 0 ? (
                    <div className="space-y-3">
                      {appointments.map((app) => (
                        <div key={app.id} className="p-4 rounded-2xl bg-slate-950 border border-blue-500/40 space-y-3">
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                app.status === 'Approved' || app.status === 'Accepted'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : app.status === 'Rejected'
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              }`}
                            >
                              Appointment Status: {app.status === 'Accepted' ? 'Approved' : app.status}
                            </span>
                            <span className="text-xs font-extrabold text-orange-400">{app.createdTimestamp}</span>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="font-bold text-white text-sm">{app.facultyName}</div>
                            <div className="text-slate-300">Reason: {app.reason}</div>

                            {app.status === 'Approved' || app.status === 'Accepted' ? (
                              <div className="mt-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs space-y-1 font-mono">
                                <div className="font-bold text-emerald-300 flex items-center space-x-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>HOD Response Received (Approved)</span>
                                </div>
                                <div>Date: <span className="text-white font-bold">{app.date || 'Monday, March 10'}</span></div>
                                <div>Time: <span className="text-white font-bold">{app.time || app.requestedTime}</span></div>
                                <div>Location: <span className="text-white font-bold">{app.location || 'HOD Office'}</span></div>
                                <div>HOD Remarks: <span className="text-slate-200 italic">"{app.remarks || 'Please meet me at the scheduled time.'}"</span></div>
                              </div>
                            ) : app.status === 'Rejected' ? (
                              <div className="mt-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs space-y-1 font-mono">
                                <div className="font-bold text-rose-300 flex items-center space-x-1">
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                                  <span>Request Rejected by HOD</span>
                                </div>
                                <div>Reason: <span className="text-slate-200 italic">"{app.rejectionReason || app.remarks || 'Unavailable this week.'}"</span></div>
                              </div>
                            ) : (
                              <div className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-bold flex items-center justify-between font-mono">
                                <div className="flex items-center space-x-1.5">
                                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                                  <span>Pending / Awaiting HOD Response</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 pt-1">
                            <button
                              onClick={() => {
                                const fac = facultyList.find((f) => f.name === app.facultyName);
                                if (fac) setActiveChatFaculty(fac);
                              }}
                              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Open Pre-Appointment Chat</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500 italic">
                      No active appointments. Select a faculty member to request a meeting slot.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* FACULTY PERSPECTIVE VIEW (Waiting Students Queue Dashboard) */
            <div className="zeno-glass-card p-6 space-y-6 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">Faculty & HOD Control Center: Dr. V. Rao</h3>
                    <p className="text-xs text-slate-400">Waiting Students & Appointment Responses Queue</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold">
                    BUSY (IN MEETING)
                  </span>
                  <button
                    onClick={() => {
                      setFacultyList((prev) =>
                        prev.map((f) => (f.id === 'fac-101' ? { ...f, status: 'Available', statusNote: 'Available in Office' } : f))
                      );
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all"
                  >
                    Set Available Now
                  </button>
                </div>
              </div>

              {/* Waiting Students List */}
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-300">
                  Waiting Students Queue ({appointments.length} Student Requests):
                </div>

                <div className="space-y-3">
                  {appointments.map((app, idx) => (
                    <div key={app.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold">
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-white text-sm">{app.studentName}</span>
                          <span className="text-xs text-slate-400">({app.department}, {app.year})</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${app.status === 'Approved' || app.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-300' : app.status === 'Rejected' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 pl-8">Reason: <span className="text-white font-bold">{app.reason}</span></div>
                        <div className="text-[10px] text-slate-400 pl-8">Requested Slot: {app.requestedTime}</div>
                        {app.remarks && <div className="text-[10px] text-emerald-400 pl-8 font-mono">HOD Message: "{app.remarks}"</div>}
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 pl-8 sm:pl-0">
                        <button
                          onClick={() => {
                            setHodModalApp(app);
                            setHodStatusChoice('Approved');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                        >
                          Approve Request
                        </button>
                        <button
                          onClick={() => {
                            setHodModalApp(app);
                            setHodStatusChoice('Rejected');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODULE 2: COLLEGE ANNOUNCEMENTS & AI SUMMARIZER */}
      {activeTab === 'ANNOUNCEMENTS' && (
        <div className="space-y-6 font-mono">
          <div className="zeno-glass-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">College Notices & Emergency Circulars</h3>
              </div>

              {/* Language Selector */}
              <div className="flex items-center space-x-2 text-xs">
                <Languages className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-400">Language:</span>
                {(['English', 'Hindi', 'Telugu'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguageMode(lang)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      languageMode === lang ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Notice Cards List */}
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-blue-500/40 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${ann.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-blue-500/20 text-blue-300 border-blue-500/40'}`}>
                          {ann.priority}
                        </span>
                        <span className="text-xs text-slate-400">[{ann.category}]</span>
                        <span className="text-xs text-slate-500">• {ann.timestamp}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white">{ann.title}</h4>
                    </div>

                    <button
                      onClick={() => setActiveSummaryNotice(ann)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all flex items-center space-x-1 shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>AI Summary</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {translateNotice(ann.content, languageMode)}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-900">
                    <div>Posted by: <span className="text-slate-200">{ann.postedBy}</span></div>
                    <div className="flex items-center space-x-3">
                      <span>Read Receipts: {ann.readCount} Students</span>
                      <button className="text-cyan-400 hover:underline flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Add to Calendar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: JOINED CLUBS COMMUNICATION */}
      {activeTab === 'CLUBS' && (
        <div className="zeno-glass-card p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Personalized Joined Clubs Feed</span>
            </h3>
            <span className="text-[10px] text-purple-400 font-bold">STUDENT ENROLLED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communicationData.clubUpdates.map((club) => (
              <div key={club.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                    {club.clubName}
                  </span>
                  <span className="text-[10px] text-amber-400">{club.date}</span>
                </div>
                <div className="font-bold text-white text-xs">{club.title}</div>
                <div className="text-xs text-slate-300 font-sans">{club.content}</div>
                <div className="text-[10px] text-slate-400">Venue: {club.venue}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 4: CLASS FORUM & STUDY NOTES */}
      {activeTab === 'CLASS_FORUM' && (
        <div className="zeno-glass-card p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Class Forum & Subject Study Resources</span>
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold">3RD YEAR CSE-AIML</span>
          </div>

          <div className="space-y-3">
            {communicationData.classDiscussions.map((disc) => (
              <div key={disc.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400">{disc.subject}</span>
                  <span className="text-[10px] text-slate-500">{disc.timestamp}</span>
                </div>
                <div className="font-bold text-white text-sm">{disc.title}</div>
                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-slate-400">Author: {disc.author}</span>
                  <button className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] hover:bg-emerald-500/30 transition-all flex items-center space-x-1">
                    <FileText className="w-3 h-3" />
                    <span>Download {disc.fileUrl}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 7: STUDENT SUPPORT & GRIEVANCE PORTAL */}
      {activeTab === 'GRIEVANCES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
          {/* Submit New Grievance Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="zeno-glass-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <span>Raise Support Ticket & Grievance</span>
                </h3>
                <span className="text-[10px] text-rose-400 font-bold">AI ROUTED</span>
              </div>

              <form onSubmit={handleGrievanceSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Ticket Subject:</label>
                  <input
                    type="text"
                    value={grievanceSubject}
                    onChange={(e) => setGrievanceSubject(e.target.value)}
                    placeholder="e.g. Wi-Fi router offline in Hostel Block B"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Detailed Description:</label>
                  <textarea
                    value={grievanceDesc}
                    onChange={(e) => {
                      setGrievanceDesc(e.target.value);
                      if (e.target.value.length > 8) {
                        setSuggestedDept(predictGrievanceDepartment(e.target.value));
                      }
                    }}
                    rows={4}
                    placeholder="Provide details about the issue..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500/50"
                  />
                </div>

                {suggestedDept && (
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-bold flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>AI Suggested Department: {suggestedDept}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                >
                  Submit Ticket & Route Instantly
                </button>
              </form>
            </div>
          </div>

          {/* Active Grievances Status List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="zeno-glass-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>My Active Support Tickets</span>
                </h3>
                <span className="text-[10px] text-cyan-400 font-bold">LIVE TRACKING</span>
              </div>

              <div className="space-y-3">
                {grievanceList.map((grv) => (
                  <div key={grv.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{grv.subject}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                        {grv.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400">Assigned: <span className="text-cyan-300 font-bold">{grv.assignedDepartment}</span></div>

                    {/* Timeline Stages */}
                    <div className="grid grid-cols-4 gap-1 pt-2">
                      {grv.timeline.map((tm, idx) => (
                        <div key={idx} className="text-center space-y-1">
                          <div className={`h-1.5 rounded-full ${tm.completed ? 'bg-emerald-400' : 'bg-slate-800'}`} />
                          <div className="text-[9px] text-slate-400 leading-tight">{tm.stage}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPOINTMENT BOOKING MODAL */}
      {bookingFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-mono select-none">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-950 border border-orange-500/40 space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="font-bold text-sm text-white">Request Appointment: {bookingFaculty.name}</div>
              <button onClick={() => setBookingFaculty(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold">Select Preferred Available Slot:</label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold focus:outline-none"
                >
                  {bookingFaculty.availableSlots.map((slot, idx) => (
                    <option key={idx} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-bold">Meeting Purpose / Reason:</label>
                <input
                  type="text"
                  value={appointmentReason}
                  onChange={(e) => setAppointmentReason(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-[11px]">
                ⚡ Your appointment request will be sent to {bookingFaculty.name} — awaiting HOD approval.
              </div>

              <button
                onClick={handleRequestAppointment}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)]"
              >
                Confirm & Join Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI SUMMARY MODAL */}
      {activeSummaryNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-mono select-none">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-950 border border-purple-500/40 space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="font-bold text-sm text-purple-300 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Notice Summarizer Bullet Points</span>
              </div>
              <button onClick={() => setActiveSummaryNotice(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-white">{activeSummaryNotice.title}</div>
              <div className="space-y-1.5 pt-2">
                {activeSummaryNotice.aiSummary.map((pt, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 flex items-start space-x-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1-ON-1 CHAT DRAWER */}
      {activeChatFaculty && (
        <div className="fixed bottom-4 right-4 z-50 w-96 rounded-3xl bg-slate-950 border border-blue-500/40 shadow-2xl p-4 font-mono space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="font-bold text-xs text-white">Chat with {activeChatFaculty.name}</div>
            <button onClick={() => setActiveChatFaculty(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="h-48 overflow-y-auto space-y-2 text-xs">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-850 space-y-1">
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{msg.sender}</span>
                  <span>{msg.time}</span>
                </div>
                <div className="text-white text-xs">{msg.text}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputChatMessage}
              onChange={(e) => setInputChatMessage(e.target.value)}
              placeholder="Type message to faculty..."
              className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
            />
            <button
              onClick={() => {
                if (!inputChatMessage) return;
                setChatMessages([...chatMessages, { sender: 'Bhavya', text: inputChatMessage, time: 'Now' }]);
                setInputChatMessage('');
              }}
              className="p-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FLOATING AI ASSISTANT WIDGET BUTTON */}
      <button
        onClick={() => setIsAiBotOpen(!isAiBotOpen)}
        className="fixed bottom-6 left-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-[0_0_25px_rgba(249,115,22,0.5)] hover:scale-105 transition-all flex items-center space-x-2 font-mono text-xs font-bold"
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span>Communication AI Agent</span>
      </button>

      {/* FLOATING AI ASSISTANT CHAT MODAL */}
      {isAiBotOpen && (
        <div className="fixed bottom-20 left-6 z-50 w-96 rounded-3xl bg-slate-950 border border-orange-500/40 p-4 font-mono shadow-2xl space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="font-bold text-white flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>AI Communication Assistant</span>
            </div>
            <button onClick={() => setIsAiBotOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="h-56 overflow-y-auto space-y-2">
            {aiChatHistory.map((h, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs leading-relaxed ${
                  h.sender === 'user' ? 'bg-blue-600/20 border-blue-500/40 text-blue-200' : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}
              >
                {h.text}
              </div>
            ))}
          </div>

          {/* FAQ Chips */}
          <div className="space-y-1 pt-1">
            <div className="text-[10px] text-slate-400 font-bold">Quick Ask:</div>
            <div className="flex flex-wrap gap-1">
              {[
                'Did my HOD approve my appointment?',
                'When is my HOD available?',
                'Why was my appointment rejected?',
                'What is the latest announcement?',
                'What clubs are open for registration?',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAiBotQuery(chip)}
                  className="px-2 py-1 rounded bg-slate-900 hover:bg-orange-500/20 border border-slate-800 text-[10px] text-slate-300"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HOD RESPONSE EDITING MODAL */}
      {hodModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-orange-500/40 p-6 space-y-4 font-mono shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-orange-400" />
                <h3 className="font-extrabold text-sm text-white">HOD Response Portal — Appointment #{hodModalApp.id}</h3>
              </div>
              <button onClick={() => setHodModalApp(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400">Student:</span> <span className="text-white font-bold">{hodModalApp.studentName}</span> ({hodModalApp.department}, {hodModalApp.year})
              </div>
              <div>
                <span className="text-slate-400">Reason:</span> <span className="text-cyan-300 font-bold">{hodModalApp.reason}</span>
              </div>

              {/* Status Selector */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Set Status:</label>
                <select
                  value={hodStatusChoice}
                  onChange={(e) => setHodStatusChoice(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:border-orange-500"
                >
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Pending">Pending / Awaiting Response</option>
                </select>
              </div>

              {/* Date & Time Selection */}
              {hodStatusChoice === 'Approved' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold">Appointment Date:</label>
                      <input
                        type="text"
                        value={hodDateInput}
                        onChange={(e) => setHodDateInput(e.target.value)}
                        placeholder="e.g. Monday, March 10"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold">Appointment Time:</label>
                      <input
                        type="text"
                        value={hodTimeInput}
                        onChange={(e) => setHodTimeInput(e.target.value)}
                        placeholder="e.g. 11:00 AM"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold">Location / Room:</label>
                    <input
                      type="text"
                      value={hodLocationInput}
                      onChange={(e) => setHodLocationInput(e.target.value)}
                      placeholder="e.g. HOD Office, Admin Block Floor 2"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold">HOD Remarks / Instructions:</label>
                    <textarea
                      rows={2}
                      value={hodRemarksInput}
                      onChange={(e) => setHodRemarksInput(e.target.value)}
                      placeholder="e.g. Please meet me at 11:00 AM with your capstone slides."
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              {hodStatusChoice === 'Rejected' && (
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Rejection Reason:</label>
                  <textarea
                    rows={3}
                    value={hodRejectionReasonInput}
                    onChange={(e) => setHodRejectionReasonInput(e.target.value)}
                    placeholder="Provide specific reason for rejection..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setHodModalApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHodResponse}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg"
              >
                Save & Update Student Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
