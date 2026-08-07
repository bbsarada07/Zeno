import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  InstitutionalTenant,
  StudentProfile,
  UserRole,
  NavigationTab,
  AuthVaultSession,
  HITLPayload,
  CryptographicReceipt,
  WaiverPetition,
  PlacementDrive,
  DigitalTwinPath,
  InterviewReplay,
  RecruiterFeedback,
  PetitionRecord,
  PlacementApplicationDraft,
  MedicalWaiverDraft,
  IntentResult,
} from '../types';
import {
  INSTITUTIONAL_TENANTS,
  MOCK_STUDENT,
  MOCK_HITL_PAYLOAD,
  MOCK_PLACEMENT_DRIVES,
  MOCK_DIGITAL_TWINS,
  MOCK_RECRUITER_FEEDBACK,
  MOCK_INTERVIEW_REPLAYS,
  MOCK_WAIVER_PETITION,
  INITIAL_PENDING_PETITIONS,
} from '../data/mockData';
import { classifyUserIntent } from '../lib/intentClassifier';
import confetti from 'canvas-confetti';

export const COMPANY_DRAFTS: Record<string, PlacementApplicationDraft> = {
  google: {
    companyName: 'Google Inc.',
    roleTitle: 'Software Engineer - AI Systems (L3)',
    candidateName: 'Alex Rivera',
    rollNumber: '2451-22-733-001',
    cgpa: 8.84,
    coverLetterBody: `Dear Google University Relations & Hiring Team,

I am writing to express my enthusiastic application for the Software Engineer - AI Systems (L3) role. As a final-year Computer Science student at Vasavi College of Engineering (CGPA: 8.84/10.0), I specialize in LLM orchestrations, PyTorch neural models, and Qdrant Vector RAG architectures.

My capstone platform, Zeno, leverages autonomous agent topologies and sub-agent token routers to reduce administrative SLA latencies by 84%. I am eager to bring my expertise in distributed AI systems to Google.

Sincerely,
Alex Rivera (2451-22-733-001)
B.Tech CSE, Vasavi College of Engineering`,
  },
  microsoft: {
    companyName: 'Microsoft Corporation',
    roleTitle: 'Full Stack Cloud Engineer (Azure Core)',
    candidateName: 'Alex Rivera',
    rollNumber: '2451-22-733-001',
    cgpa: 8.84,
    coverLetterBody: `Dear Microsoft University Recruiting Team,

I am excited to submit my candidate profile for the Full Stack Cloud Engineer role. With a 8.84 CGPA and extensive hands-on experience building TypeScript microservices on Azure, I have architected high-throughput REST API gateways and real-time state synchronizations.

My engineering background aligns closely with Azure Core's push toward resilient serverless functions and event-driven microservices. I welcome the opportunity to contribute to Microsoft's cloud platform.

Sincerely,
Alex Rivera (2451-22-733-001)
B.Tech CSE, Vasavi College of Engineering`,
  },
  amazon: {
    companyName: 'Amazon Web Services (AWS)',
    roleTitle: 'Systems Development Engineer (SDE-I)',
    candidateName: 'Alex Rivera',
    rollNumber: '2451-22-733-001',
    cgpa: 8.84,
    coverLetterBody: `Dear AWS Campus Recruiting Team,

I am applying for the Systems Development Engineer (SDE-I) position at Amazon Web Services. My technical focus centers on high-availability Linux C++ networking, low-latency kernel memory management, and distributed systems scaling.

I have engineered multi-node backend clusters capable of processing 10,000+ concurrent requests with sub-15ms p99 latencies. I am eager to apply AWS Customer Obsession principles to global cloud infrastructure.

Sincerely,
Alex Rivera (2451-22-733-001)
B.Tech CSE, Vasavi College of Engineering`,
  },
  swiggy: {
    companyName: 'Swiggy',
    roleTitle: 'Backend Platform Engineer',
    candidateName: 'Alex Rivera',
    rollNumber: '2451-22-733-001',
    cgpa: 8.84,
    coverLetterBody: `Dear Swiggy Campus Engineering Team,

I am writing to apply for the Backend Platform Engineer position. My core engineering strengths lie in real-time event streaming via Apache Kafka, Redis caching layers, and high-concurrency Go/TypeScript API gateways.

I have designed event-driven microservices handling dynamic geo-spatial calculations and real-time order dispatch simulation models. I am thrilled at the prospect of optimizing Swiggy's hyper-local delivery engine.

Sincerely,
Alex Rivera (2451-22-733-001)
B.Tech CSE, Vasavi College of Engineering`,
  },
};

interface AppContextType {
  // Theme Engine
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Demo Override Mode
  isDemoMode: boolean;
  toggleDemoMode: () => void;

  // Auth Vault Session
  authSession: AuthVaultSession | null;
  selectedTenant: InstitutionalTenant;
  setSelectedTenant: (tenant: InstitutionalTenant) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  loginWithOtp: (tenantCode: string, role: UserRole, mobile: string, otp: string) => boolean;
  logoutSession: () => void;
  isLoggingOut: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Navigation Tabs
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;

  // Student Profile
  student: StudentProfile;

  // GIS Location Map Modal
  isGisModalOpen: boolean;
  setIsGisModalOpen: (open: boolean) => void;
  openGisNavigation: () => void;

  // Placement AI Workspace & 4 Company Drafts
  placementDrives: PlacementDrive[];
  digitalTwins: DigitalTwinPath[];
  recruiterFeedback: RecruiterFeedback;
  interviewReplays: InterviewReplay[];
  isRecruiterModalOpen: boolean;
  setIsRecruiterModalOpen: (open: boolean) => void;
  isInterviewModalOpen: boolean;
  setIsInterviewModalOpen: (open: boolean) => void;
  placementDraft: PlacementApplicationDraft;
  setPlacementDraft: React.Dispatch<React.SetStateAction<PlacementApplicationDraft>>;
  triggerPlacementApplication: (companyKey: string) => void;

  // Waiver Petition & HOD Action Pipeline
  waiverPetition: WaiverPetition;
  petitions: PetitionRecord[];
  medicalWaiverDraft: MedicalWaiverDraft;
  setMedicalWaiverDraft: React.Dispatch<React.SetStateAction<MedicalWaiverDraft>>;
  triggerMedicalWaiverApplication: () => void;
  submitPetition: (newPet: Omit<PetitionRecord, 'id' | 'submittedAt'>) => void;
  approvePetition: (id: string, notes?: string) => void;
  rejectPetition: (id: string, notes?: string) => void;
  batchApprovePetitions: () => void;
  resetDemoState: () => void;

  // HITL Approval & Cryptographic Proof Receipt
  hitlPayload: HITLPayload;
  isHitlDrawerOpen: boolean;
  setIsHitlDrawerOpen: (open: boolean) => void;
  isReceiptModalOpen: boolean;
  setIsReceiptModalOpen: (open: boolean) => void;
  cryptographicReceipt: CryptographicReceipt | null;
  approveHitlAction: (editedBody?: string) => void;
  rejectHitlAction: () => void;

  // Chat Canvas
  messages: Array<{
    id: string;
    sender: 'user' | 'agent';
    text: string;
    timestamp: string;
    intentResult?: IntentResult;
    quickActionType?: 'gis' | 'placement' | 'waiver';
  }>;
  sendMessage: (text: string) => void;

  // Notifications
  unreadCount: number;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;

  // Preset Scenario Triggers
  triggerScenario1_GIS: () => void;
  triggerScenario2_Placement: () => void;
  triggerScenario3_Waiver: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AUTH_VAULT_STORAGE_KEY = 'Zeno_Auth_Vault';
const PETITIONS_STORAGE_KEY = 'zeno_pending_petitions';
const THEME_STORAGE_KEY = 'zeno_theme_mode';
const DEMO_MODE_STORAGE_KEY = 'zeno_demo_mode';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      console.warn('Could not read zeno_theme_mode:', e);
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Demo Override Mode
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem(DEMO_MODE_STORAGE_KEY) === 'true';
  });

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => {
      const next = !prev;
      localStorage.setItem(DEMO_MODE_STORAGE_KEY, String(next));
      return next;
    });
  };

  // Auth Vault & Session State
  const [selectedTenant, setSelectedTenant] = useState<InstitutionalTenant>(INSTITUTIONAL_TENANTS[0]);
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const [authSession, setAuthSession] = useState<AuthVaultSession | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_VAULT_STORAGE_KEY) || localStorage.getItem('zeno_user_session') || localStorage.getItem('zeno_session');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse Zeno_Auth_Vault session:', e);
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(!authSession?.isAuthenticated);

  // Sync auth session & credentials to localStorage
  useEffect(() => {
    if (authSession) {
      localStorage.setItem(AUTH_VAULT_STORAGE_KEY, JSON.stringify(authSession));
      localStorage.setItem('zeno_user_session', JSON.stringify(authSession));
      localStorage.setItem('zeno_session', JSON.stringify(authSession));
      localStorage.setItem('zeno_user', JSON.stringify({
        name: 'Alex Rivera',
        rollNumber: '2451-22-733-001',
        role: authSession.role,
        tenant: authSession.tenantCode,
        department: 'Computer Science & Engineering',
      }));
    }
  }, [authSession]);

  const loginWithOtp = (tenantCode: string, role: UserRole, mobile: string, _otp: string): boolean => {
    const tenant = INSTITUTIONAL_TENANTS.find((t) => t.code === tenantCode) || INSTITUTIONAL_TENANTS[0];
    setSelectedTenant(tenant);
    setActiveRole(role);

    const newSession: AuthVaultSession = {
      isAuthenticated: true,
      tenantCode: tenant.code,
      role,
      studentRollNumber: '2451-22-733-001',
      mobileNumber: mobile || '+91 98765 43210',
      authTimestamp: new Date().toISOString(),
    };

    setAuthSession(newSession);
    setIsAuthModalOpen(false);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    return true;
  };

  // Fail-Safe Logout Handler: purges localStorage, resets session to null
  const logoutSession = () => {
    localStorage.clear();
    setAuthSession(null);
    setIsLoggingOut(false);
    setIsAuthModalOpen(true);
    setActiveTab('dashboard');
    setPetitions(INITIAL_PENDING_PETITIONS);
  };

  // Navigation Active Tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Reset drawer state on tab switch to prevent template leakage
  useEffect(() => {
    setIsHitlDrawerOpen(false);
  }, [activeTab]);

  // Student Profile
  const [student] = useState<StudentProfile>(MOCK_STUDENT);

  // Placement Draft State
  const [placementDraft, setPlacementDraft] = useState<PlacementApplicationDraft>(COMPANY_DRAFTS.google);

  // Medical Waiver Draft State
  const [medicalWaiverDraft, setMedicalWaiverDraft] = useState<MedicalWaiverDraft>({
    category: 'Medical Waiver',
    datesAffected: '14 July 2026 – 18 July 2026',
    classesMissed: 14,
    currentAttendance: 72.5,
    postWaiverAttendance: 75.2,
    hospitalName: 'Apollo Hospitals, Jubilee Hills',
    doctorName: 'Dr. R. K. Sharma (MD)',
    petitionLetter: `Respected Head of Department,

I am writing to formally request condensation for my attendance in Semester VI (Current: 72.5%, Required: 75.0%). I was unable to attend classes between July 14 and July 18 due to severe viral fever.

I have attached the verified medical certificate from Apollo Hospitals (Cert ID: APH-2026-8819). I request you to kindly approve the 2.5% attendance waiver so I remain eligible for upcoming tier-1 placement drives.

Sincerely,
Alex Rivera (Roll No: 2451-22-733-001)`,
  });

  // Shared Petitions Pipeline State
  const [petitions, setPetitions] = useState<PetitionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(PETITIONS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse zeno_pending_petitions:', e);
    }
    return INITIAL_PENDING_PETITIONS;
  });

  useEffect(() => {
    localStorage.setItem(PETITIONS_STORAGE_KEY, JSON.stringify(petitions));
  }, [petitions]);

  const submitPetition = (newPetData: Omit<PetitionRecord, 'id' | 'submittedAt'>) => {
    const newRecord: PetitionRecord = {
      ...newPetData,
      id: `pet-2026-${Math.floor(100 + Math.random() * 900)}`,
      submittedAt: 'Just Now',
    };
    setPetitions((prev) => [newRecord, ...prev]);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const approvePetition = (id: string, _notes?: string) => {
    setPetitions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'HOD Approved' } : p))
    );

    const pet = petitions.find((p) => p.id === id);

    const receipt: CryptographicReceipt = {
      actionId: `ACT-ZENO-${Math.floor(10000 + Math.random() * 90000)}-VCE`,
      txHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      blockHeight: 18492041 + Math.floor(Math.random() * 500),
      timestamp: new Date().toISOString(),
      tenantCode: selectedTenant?.code || 'VCE-HDO-500031',
      studentRollNumber: pet?.rollNumber || student?.rollNumber || '2451-22-733-001',
      targetRecipient: `Dr. Marcus Vance (HOD CSE)`,
      payloadSummary: pet ? `${pet.category} Condonation (-${pet.shortfallPercentage}%)` : 'Attendance Condensation',
      verifiedBySignature: `ed25519:vce-gov-cert-key-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setCryptographicReceipt(receipt);
    setIsReceiptModalOpen(true);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const rejectPetition = (id: string, _notes?: string) => {
    setPetitions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Rejected' } : p))
    );
  };

  const batchApprovePetitions = () => {
    setPetitions((prev) =>
      prev.map((p) => (p.status !== 'Rejected' ? { ...p, status: 'HOD Approved' } : p))
    );

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const resetDemoState = () => {
    setPetitions(INITIAL_PENDING_PETITIONS);
    localStorage.setItem(PETITIONS_STORAGE_KEY, JSON.stringify(INITIAL_PENDING_PETITIONS));
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // GIS Location Map Modal
  const [isGisModalOpen, setIsGisModalOpen] = useState(false);

  const openGisNavigation = () => {
    setIsGisModalOpen(true);
  };

  // Placement AI Workspace
  const [placementDrives] = useState<PlacementDrive[]>(MOCK_PLACEMENT_DRIVES);
  const [digitalTwins] = useState<DigitalTwinPath[]>(MOCK_DIGITAL_TWINS);
  const [recruiterFeedback] = useState<RecruiterFeedback>(MOCK_RECRUITER_FEEDBACK);
  const [interviewReplays] = useState<InterviewReplay[]>(MOCK_INTERVIEW_REPLAYS);
  const [isRecruiterModalOpen, setIsRecruiterModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  // Waiver Petition
  const [waiverPetition, setWaiverPetition] = useState<WaiverPetition>(MOCK_WAIVER_PETITION);

  // HITL & Cryptographic Proof Receipt
  const [hitlPayload, setHitlPayload] = useState<HITLPayload>(MOCK_HITL_PAYLOAD);
  const [isHitlDrawerOpen, setIsHitlDrawerOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [cryptographicReceipt, setCryptographicReceipt] = useState<CryptographicReceipt | null>(null);

  // Dynamic Trigger 1: Placement Drive Cover Letter Application
  const triggerPlacementApplication = (companyKey: string) => {
    const draft = COMPANY_DRAFTS[companyKey] || COMPANY_DRAFTS.google;
    setPlacementDraft(draft);

    setHitlPayload({
      id: `ACT-PLACEMENT-${Date.now()}`,
      title: `Submit Candidate Application for ${draft.companyName}`,
      description: `Official campus recruitment application for ${draft.roleTitle} at ${draft.companyName}.`,
      targetRecipient: `Campus University Relations - ${draft.companyName}`,
      recipientEmail: `recruiting@${draft.companyName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      status: 'pending',
      editableBody: draft.coverLetterBody,
      metadata: {
        type: 'placement_enrollment',
        studentName: 'Alex Rivera',
        rollNumber: '2451-22-733-001',
        companyName: draft.companyName,
      },
    });

    setIsHitlDrawerOpen(true);
  };

  // Dynamic Trigger 2: Medical Attendance Waiver Petition
  const triggerMedicalWaiverApplication = () => {
    setHitlPayload({
      id: `ACT-WAIVER-${Date.now()}`,
      title: `Submit Attendance Waiver Petition (Apollo Certificate APH-2026-8819)`,
      description: `Formal condonation request for 14 missed classes (2.5% shortage) due to medical fever.`,
      targetRecipient: `Dr. Marcus Vance (HOD CSE)`,
      recipientEmail: `hod.cse@vce.ac.in`,
      status: 'pending',
      editableBody: medicalWaiverDraft.petitionLetter,
      metadata: {
        type: 'medical_waiver',
        studentName: 'Alex Rivera',
        rollNumber: '2451-22-733-001',
        daysMissed: 14,
      },
    });

    setIsHitlDrawerOpen(true);
  };

  const approveHitlAction = (editedBody?: string) => {
    if (editedBody) {
      setHitlPayload((prev) => ({ ...prev, editableBody: editedBody, status: 'approved' }));
    } else {
      setHitlPayload((prev) => ({ ...prev, status: 'approved' }));
    }

    if (hitlPayload.metadata.type === 'medical_waiver') {
      setWaiverPetition((prev) => ({ ...prev, status: 'HOD Approved' }));
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setIsHitlDrawerOpen(false);

    const receipt: CryptographicReceipt = {
      actionId: `ACT-ZENO-${Math.floor(10000 + Math.random() * 90000)}-VCE`,
      txHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      blockHeight: 18492041 + Math.floor(Math.random() * 500),
      timestamp: new Date().toISOString(),
      tenantCode: selectedTenant?.code || 'VCE-HDO-500031',
      studentRollNumber: student?.rollNumber || '2451-22-733-001',
      targetRecipient: hitlPayload?.targetRecipient || 'Dr. Marcus Vance (HOD CSE)',
      payloadSummary: hitlPayload?.title || 'Attendance Shortage Waiver Condensation',
      verifiedBySignature: `ed25519:vce-gov-cert-key-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setCryptographicReceipt(receipt);
    setIsReceiptModalOpen(true);
  };

  const rejectHitlAction = () => {
    setHitlPayload((prev) => ({ ...prev, status: 'rejected' }));
    setIsHitlDrawerOpen(false);
  };

  // Chat Canvas Messages with Dynamic Intent Classification
  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'agent';
    text: string;
    timestamp: string;
    intentResult?: IntentResult;
    quickActionType?: 'gis' | 'placement' | 'waiver';
  }>>([
    {
      id: 'm-welcome',
      sender: 'agent',
      text: `Welcome back, **${MOCK_STUDENT.name}** (${MOCK_STUDENT.rollNumber}).

I am **Zeno**, your Autonomous Smart Campus Governance & Intent Classifier Platform.

Try typing a query about **Attendance**, **Placement Drives**, **Events/Hackathons**, **Email Drafts**, or **Student Complaints**.`,
      timestamp: '10:40 AM',
    },
  ]);

  const sendMessage = (text: string) => {
    const userMsgId = `usr-${Date.now()}`;
    const newMsg = {
      id: userMsgId,
      sender: 'user' as const,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);

    setTimeout(() => {
      const intent = classifyUserIntent(text);

      setMessages((prev) => [
        ...prev,
        {
          id: `agt-${Date.now()}`,
          sender: 'agent',
          text: intent.summary,
          intentResult: intent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 450);
  };

  // Preset Scenario Triggers
  const triggerScenario1_GIS = () => {
    sendMessage('Where is my OS Lab class?');
  };

  const triggerScenario2_Placement = () => {
    sendMessage('Am I eligible for Google Placement Drive?');
  };

  const triggerScenario3_Waiver = () => {
    sendMessage('Draft Medical Attendance Waiver Request');
  };

  // Notifications
  const [unreadCount] = useState(2);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        isDemoMode,
        toggleDemoMode,
        authSession,
        selectedTenant,
        setSelectedTenant,
        activeRole,
        setActiveRole,
        loginWithOtp,
        logoutSession,
        isLoggingOut,
        isAuthModalOpen,
        setIsAuthModalOpen,
        activeTab,
        setActiveTab,
        student,
        isGisModalOpen,
        setIsGisModalOpen,
        openGisNavigation,
        placementDrives,
        digitalTwins,
        recruiterFeedback,
        interviewReplays,
        isRecruiterModalOpen,
        setIsRecruiterModalOpen,
        isInterviewModalOpen,
        setIsInterviewModalOpen,
        placementDraft,
        setPlacementDraft,
        triggerPlacementApplication,
        waiverPetition,
        petitions,
        medicalWaiverDraft,
        setMedicalWaiverDraft,
        triggerMedicalWaiverApplication,
        submitPetition,
        approvePetition,
        rejectPetition,
        batchApprovePetitions,
        resetDemoState,
        hitlPayload,
        isHitlDrawerOpen,
        setIsHitlDrawerOpen,
        isReceiptModalOpen,
        setIsReceiptModalOpen,
        cryptographicReceipt,
        approveHitlAction,
        rejectHitlAction,
        messages,
        sendMessage,
        unreadCount,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        triggerScenario1_GIS,
        triggerScenario2_Placement,
        triggerScenario3_Waiver,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
