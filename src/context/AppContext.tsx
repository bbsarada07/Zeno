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
  RecruiterFeedback
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
  MOCK_CRYPTOGRAPHIC_RECEIPT
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface AppContextType {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Auth Vault Session
  authSession: AuthVaultSession | null;
  selectedTenant: InstitutionalTenant;
  setSelectedTenant: (tenant: InstitutionalTenant) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  loginWithOtp: (tenantCode: string, role: UserRole, mobile: string, otp: string) => boolean;
  logoutSession: () => void;
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

  // Waiver Petition
  waiverPetition: WaiverPetition;

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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  // Auth Vault & Session State
  const [selectedTenant, setSelectedTenant] = useState<InstitutionalTenant>(INSTITUTIONAL_TENANTS[0]);
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [authSession, setAuthSession] = useState<AuthVaultSession | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_VAULT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse Zeno_Auth_Vault session:', e);
    }
    // Default to null so user lands directly on the Auth Gateway Page
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(!authSession?.isAuthenticated);

  // Sync auth state to localStorage
  useEffect(() => {
    if (authSession) {
      localStorage.setItem(AUTH_VAULT_STORAGE_KEY, JSON.stringify(authSession));
    } else {
      localStorage.removeItem(AUTH_VAULT_STORAGE_KEY);
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

  const logoutSession = () => {
    setAuthSession(null);
    localStorage.removeItem(AUTH_VAULT_STORAGE_KEY);
    setIsAuthModalOpen(true);
  };

  // Navigation Active Tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Student Profile
  const [student] = useState<StudentProfile>(MOCK_STUDENT);

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

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setIsHitlDrawerOpen(false);

    // Create execution proof receipt
    const receipt: CryptographicReceipt = {
      actionId: `ACT-ZENO-${Math.floor(10000 + Math.random() * 90000)}-VCE`,
      txHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      blockHeight: 18492041 + Math.floor(Math.random() * 500),
      timestamp: new Date().toISOString(),
      tenantCode: selectedTenant.code,
      studentRollNumber: student.rollNumber,
      targetRecipient: hitlPayload.targetRecipient,
      payloadSummary: hitlPayload.title,
      verifiedBySignature: `ed25519:vce-gov-cert-key-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setCryptographicReceipt(receipt);
    setIsReceiptModalOpen(true);
  };

  const rejectHitlAction = () => {
    setHitlPayload((prev) => ({ ...prev, status: 'rejected' }));
    setIsHitlDrawerOpen(false);
  };

  // Chat Canvas Messages
  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'agent';
    text: string;
    timestamp: string;
    quickActionType?: 'gis' | 'placement' | 'waiver';
  }>>([
    {
      id: 'm-welcome',
      sender: 'agent',
      text: `Welcome back, **${student.name}** (${student.rollNumber}).

I am **Zeno**, your Autonomous Smart Campus Governance & GIS Intelligence Platform. 

How can I assist you today? Try typing a query or click one of the quick action buttons above.`,
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

    const lower = text.toLowerCase();

    setTimeout(() => {
      let replyText = '';
      let quickActionType: 'gis' | 'placement' | 'waiver' | undefined = undefined;

      if (lower.includes('os lab') || lower.includes('where is') || lower.includes('class') || lower.includes('room')) {
        replyText = `### 📍 Spatial Campus GIS Location Resolved

- **Course:** Operating Systems Laboratory (\`CS-302-LAB\`)
- **Faculty:** Dr. K. Srinivas
- **Location:** **Admin Block, Floor 2, Room CL-12**
- **Schedule:** 10:00 AM – 12:00 PM (Current Class)

Click the button below to view the interactive indoor floor plan and step-by-step route map.`;
        quickActionType = 'gis';
        openGisNavigation();
      } else if (lower.includes('google') || lower.includes('placement') || lower.includes('eligible') || lower.includes('drive')) {
        replyText = `### 🎓 Placement AI Eligibility & Strategy Matrix

- **Target Drive:** **Google Software Engineer - AI Systems (L3)**
- **Candidate:** Alex Rivera (\`2451-22-733-001\`)
- **Eligibility Status:** ✅ **ELIGIBLE** (CGPA 8.84 ≥ 8.5, 0 Backlogs)
- **Match Score:** **94%**

**Digital Twin Insight:** You match 94% of required skills (TypeScript, PyTorch, Distributed Systems). Click the Placement AI tab or button below to view your readiness dashboard.`;
        quickActionType = 'placement';
        setActiveTab('placement');
      } else if (lower.includes('waiver') || lower.includes('medical') || lower.includes('attendance') || lower.includes('draft')) {
        replyText = `### 📋 Attendance Waiver Petition Drafted

- **Current Attendance:** **72.5%** (Required: 75.0%)
- **Shortage:** 2.5% (14 missed class hours)
- **Reason:** Acute viral illness (Apollo Hospitals Certificate Verified)
- **Target Recipient:** Dr. Marcus Vance (HOD CSE)

I have generated the formal petition payload. Click below to review and approve the request in the HITL Approval Drawer.`;
        quickActionType = 'waiver';
        setActiveTab('waivers');
        setIsHitlDrawerOpen(true);
      } else {
        replyText = `I have processed your query via Zeno's Multi-Agent Intelligence Core. 

**Summary:** All active systems operational. You can use the top navigation tabs to access **Campus GIS**, **Placement AI**, or **Waiver Petitions**.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `agt-${Date.now()}`,
          sender: 'agent',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickActionType,
        },
      ]);
    }, 600);
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
        authSession,
        selectedTenant,
        setSelectedTenant,
        activeRole,
        setActiveRole,
        loginWithOtp,
        logoutSession,
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
        waiverPetition,
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
