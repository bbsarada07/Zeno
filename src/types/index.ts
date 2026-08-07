export type UserRole = 'student' | 'faculty' | 'hod';
export type NavigationTab = 'dashboard' | 'gis' | 'placement' | 'waivers';

export interface InstitutionalTenant {
  id: string;
  name: string;
  code: string;
  location: string;
  logo: string;
  primaryAccent: string;
  secondaryAccent: string;
  academicYears: string[];
}

export type UserProfile = StudentProfile;

export interface StudentProfile {
  id: string;
  rollNumber: string;
  name: string;
  role: UserRole;
  department: string;
  year: string;
  section: string;
  title: string;
  avatar: string;
  email: string;
  mobileNumber?: string;
  cgpa: number;
  attendancePercentage: number;
  activeBacklogs: number;
  resumeScore: number;
  technicalScore: number;
  interviewScore: number;
  overallPlacementScore: number;
  skills: string[];
}

export interface AuthVaultSession {
  isAuthenticated: boolean;
  tenantCode: string;
  role: UserRole;
  studentRollNumber?: string;
  mobileNumber?: string;
  authTimestamp: string;
}

export interface ScheduleSlot {
  id: string;
  subject: string;
  code: string;
  facultyName: string;
  startTime: string;
  endTime: string;
  building: string;
  floor: number;
  roomNumber: string;
  isCurrentNext: boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'agent' | 'tool' | 'gate' | 'output';
  status: 'idle' | 'running' | 'completed' | 'waiting';
  latencyMs?: number;
  description: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface TraceLogItem {
  id: string;
  timestamp: string;
  agentName: string;
  action: string;
  status: 'info' | 'success' | 'warning' | 'error';
  latencyMs: number;
  tokenCount: number;
  details?: string;
}

export interface HITLPayload {
  id: string;
  title: string;
  description: string;
  targetRecipient: string;
  recipientEmail: string;
  editableBody: string;
  status: 'pending' | 'approved' | 'rejected';
  metadata: {
    type: 'medical_waiver' | 'placement_enrollment' | 'exam_hall_ticket' | 'lab_booking';
    studentName: string;
    rollNumber: string;
    daysMissed?: number;
    companyName?: string;
    txHash?: string;
  };
}

export interface CryptographicReceipt {
  actionId: string;
  txHash: string;
  blockHeight: number;
  timestamp: string;
  tenantCode: string;
  studentRollNumber: string;
  targetRecipient: string;
  payloadSummary: string;
  verifiedBySignature: string;
}

export interface PlacementDrive {
  id: string;
  companyName: string;
  logo: string;
  roleTitle: string;
  ctc: string;
  eligibilityCgpa: number;
  maxBacklogs: number;
  location: string;
  deadline: string;
  skillsRequired: string[];
  matchScore: number;
  status: 'eligible' | 'review' | 'ineligible' | 'applied';
}

export interface DigitalTwinPath {
  id: string;
  title: string;
  roleCategory: string;
  readinessPercentage: number;
  missingSkillCount: number;
  avgSalaryRange: string;
  industryDemand: 'High' | 'Very High' | 'Critical';
  missingSkills: string[];
  recommendedCertifications: string[];
}

export interface SkillRadarItem {
  skill: string;
  currentLevel: number;
  targetLevel: number;
}

export interface RecruiterFeedback {
  category: string;
  score: number;
  strengths: string[];
  concerns: string[];
  rejectionRisk: number;
}

export interface InterviewReplay {
  questionId: string;
  questionText: string;
  userAnswerSummary: string;
  aiSuggestedAnswer: string;
  ratingScore: number;
  improvementTip: string;
}

export interface XaiBadgeData {
  agentSource: string;
  reasoningTrace: string;
  dataPointsEvaluated: number;
  confidenceScore: number;
}

export interface WaiverPetition {
  id: string;
  title: string;
  category: 'Medical' | 'Sports' | 'Academic Event';
  datesAffected: string;
  classesMissed: number;
  currentAttendance: number;
  postWaiverAttendance: number;
  status: 'Draft' | 'Submitted' | 'HOD Approved' | 'Rejected';
  hospitalName?: string;
  doctorName?: string;
  ocrVerified: boolean;
  documentFileName: string;
}

export interface PetitionRecord {
  id: string;
  studentName: string;
  rollNumber: string;
  department: string;
  category: 'Medical Waiver' | 'Sports Duty' | 'Academic Condonation';
  datesAffected: string;
  classesMissed: number;
  currentAttendance: number;
  postWaiverAttendance: number;
  shortfallPercentage: number;
  status: 'Pending HOD Approval' | 'Recommended by Faculty' | 'HOD Approved' | 'Rejected';
  hospitalName?: string;
  doctorName?: string;
  ocrScore: number;
  ocrDetails: string;
  documentFileName: string;
  petitionLetter: string;
  submittedAt: string;
}

export type AgentDomain =
  | 'ACADEMIC_GIS'
  | 'PLACEMENT_PIPELINE'
  | 'EVENTS_ROUTER'
  | 'GOVERNANCE_ROUTER'
  | 'ACADEMIC'
  | 'PLACEMENT'
  | 'EVENTS'
  | 'COMMUNICATION'
  | 'STUDENT_SERVICE';

export interface EventCardData {
  eventName: string;
  organizer: string;
  dateTime: string;
  venue: string;
  eligibility: string;
  deadline: string;
  description: string;
}

export interface EmailDraftData {
  recipientName: string;
  recipientRole: string;
  subject: string;
  body: string;
  studentRollNumber: string;
  studentName: string;
}

export interface GrievanceStepData {
  stepNumber: number;
  title: string;
  description: string;
  officeContact: string;
}

export interface IntentResult {
  domain: AgentDomain;
  agentName: string;
  confidence: number;
  summary: string;
  eventCard?: EventCardData;
  emailDraft?: EmailDraftData;
  grievanceSteps?: GrievanceStepData[];
}

export interface PlacementApplicationDraft {
  companyName: string;
  roleTitle: string;
  candidateName: string;
  rollNumber: string;
  cgpa: number;
  coverLetterBody: string;
}

export interface MedicalWaiverDraft {
  category: string;
  datesAffected: string;
  classesMissed: number;
  currentAttendance: number;
  postWaiverAttendance: number;
  hospitalName: string;
  doctorName: string;
  petitionLetter: string;
}

export interface GisRouteStep {
  stepNumber: number;
  instruction: string;
  distance: string;
  icon: string;
}
