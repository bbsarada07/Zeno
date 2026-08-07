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

interface AppContextType {
  // Theme
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

  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;

  // Student Profile
  student: StudentProfile;

  // GIS Location Map Modal
  isGisModalOpen: boolean;
  setIsGisModalOpen: (open: boolean) => void;
  openGisNavigation: () => void;

  // Placement AI Workspace
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

  // Waiver Petition & HOD Action Pipeline
  waiverPetition: WaiverPetition;
  petitions: PetitionRecord[];
  medicalWaiverDraft: MedicalWaiverDraft;
  setMedicalWaiverDraft: React.Dispatch<React.SetStateAction<MedicalWaiverDraft>>;
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

  // Robust Logout Flow (localStorage.clear() & clean React re-render)
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

  // Student Profile
  const [student] = useState<StudentProfile>(MOCK_STUDENT);

  // Workflow Template Isolation Drafts
  const [placementDraft, setPlacementDraft] = useState<PlacementApplicationDraft>({
    companyName: 'Google Inc.',
    roleTitle: 'Software Engineer - AI Systems (L3)',
    candidateName: 'Alex Rivera',
    rollNumber: '2451-22-733-001',
    cgpa: 8.84,
    coverLetterBody: `Dear University Relations & Hiring Team at Google,

I am writing to express my enthusiastic application for the Software Engineer - AI Systems (L3) position. As a final-year Computer Science student at Vasavi College of Engineering (CGPA: 8.84/10.0, 0 Active Backlogs), I have developed hands-on expertise in distributed PyTorch model training, TypeScript API engines, and vector indexing.

My portfolio includes Zeno—an autonomous smart campus governance platform utilizing multi-agent LangGraph workflows and Qdrant vector retrieval. I am eager to contribute to Google's next-generation AI infrastructure.

Sincerely,
Alex Rivera (2451-22-733-001)`,
  });

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
        waiverPetition,
        petitions,
        medicalWaiverDraft,
        setMedicalWaiverDraft,
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
