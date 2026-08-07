import type {
  InstitutionalTenant,
  StudentProfile,
  ScheduleSlot,
  GraphNode,
  GraphEdge,
  TraceLogItem,
  HITLPayload,
  PlacementDrive,
  DigitalTwinPath,
  SkillRadarItem,
  RecruiterFeedback,
  InterviewReplay,
  WaiverPetition,
  CryptographicReceipt
} from '../types';

export const INSTITUTIONAL_TENANTS: InstitutionalTenant[] = [
  {
    id: 'vce-hyd',
    name: 'Vasavi College of Engineering',
    code: 'VCE-HYD-500031',
    location: 'Ibrahimbagh, Hyderabad',
    logo: '🏛️',
    primaryAccent: '#3B82F6',
    secondaryAccent: '#1D4ED8',
    academicYears: ['2023-2024', '2024-2025', '2025-2026'],
  },
  {
    id: 'cbit-hyd',
    name: 'Chaitanya Bharathi Institute of Technology',
    code: 'CBIT-HYD-500075',
    location: 'Gandipet, Hyderabad',
    logo: '🎓',
    primaryAccent: '#10B981',
    secondaryAccent: '#047857',
    academicYears: ['2024-2025', '2025-2026'],
  },
  {
    id: 'iith-hyd',
    name: 'Indian Institute of Technology Hyderabad',
    code: 'IITH-HYD-502285',
    location: 'Kandi, Sangareddy',
    logo: '🏛️',
    primaryAccent: '#8B5CF6',
    secondaryAccent: '#6D28D9',
    academicYears: ['2024-2025', '2025-2026'],
  },
];

export const MOCK_STUDENT: StudentProfile = {
  id: 'std-2451-22-733-001',
  rollNumber: '2451-22-733-001',
  name: 'Alex Rivera',
  role: 'student',
  department: 'Computer Science & Engineering',
  year: '3rd Year (Semester VI)',
  section: 'CSE-A',
  title: 'Autonomous System Enthusiast & AI Researcher',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  email: 'alex.rivera@vce.ac.in',
  mobileNumber: '+91 98765 43210',
  cgpa: 8.84,
  attendancePercentage: 72.5,
  activeBacklogs: 0,
  resumeScore: 88,
  technicalScore: 92,
  interviewScore: 84,
  overallPlacementScore: 88,
  skills: [
    'TypeScript',
    'Python (PyTorch)',
    'Next.js 14',
    'Distributed Systems',
    'PostgreSQL',
    'Docker & Kubernetes',
    'Tailwind CSS',
  ],
};

export const MOCK_SCHEDULE: ScheduleSlot[] = [
  {
    id: 'sched-1',
    subject: 'Operating Systems Laboratory',
    code: 'CS-302-LAB',
    facultyName: 'Dr. K. Srinivas',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    building: 'Admin Block',
    floor: 2,
    roomNumber: 'CL-12',
    isCurrentNext: true,
  },
  {
    id: 'sched-2',
    subject: 'Database Management Systems',
    code: 'CS-304',
    facultyName: 'Prof. Ananya Rao',
    startTime: '01:00 PM',
    endTime: '02:00 PM',
    building: 'Ramanujan Block',
    floor: 1,
    roomNumber: 'R-104',
    isCurrentNext: false,
  },
  {
    id: 'sched-3',
    subject: 'Artificial Intelligence & Neural Nets',
    code: 'CS-306',
    facultyName: 'Dr. Marcus Vance',
    startTime: '02:15 PM',
    endTime: '03:15 PM',
    building: 'Visvesvaraya Block',
    floor: 3,
    roomNumber: 'V-301',
    isCurrentNext: false,
  },
];

export const MOCK_GRAPH_NODES: GraphNode[] = [
  { id: 'node-orch', label: 'Orchestrator Core', type: 'agent', status: 'idle', latencyMs: 14, description: 'Routes intent & coordinates sub-agents' },
  { id: 'node-gis', label: 'Spatial GIS Agent', type: 'agent', status: 'idle', latencyMs: 22, description: 'Resolves indoor campus location & floor plan' },
  { id: 'node-place', label: 'Placement Supervisor', type: 'agent', status: 'idle', latencyMs: 35, description: 'Calculates readiness & digital twin paths' },
  { id: 'node-ats', label: 'ATS Resume Agent', type: 'agent', status: 'idle', latencyMs: 48, description: 'Analyzes resume keywords vs job descriptions' },
  { id: 'node-twin', label: 'Skill Digital Twin', type: 'agent', status: 'idle', latencyMs: 30, description: 'Simulates Path A (AI) vs Path B (Backend)' },
  { id: 'node-recruiter', label: 'Recruiter Simulator', type: 'agent', status: 'idle', latencyMs: 65, description: 'Identifies candidate rejection risks' },
  { id: 'node-hitl', label: 'HITL Gatekeeper', type: 'gate', status: 'idle', latencyMs: 5, description: 'Halts execution for human approval' },
  { id: 'node-dispatch', label: 'Crypto Dispatcher', type: 'tool', status: 'idle', latencyMs: 120, description: 'Generates PDF & cryptographic receipt' },
];

export const MOCK_GRAPH_EDGES: GraphEdge[] = [
  { id: 'e1', source: 'node-orch', target: 'node-gis', animated: true },
  { id: 'e2', source: 'node-orch', target: 'node-place', animated: true },
  { id: 'e3', source: 'node-place', target: 'node-ats' },
  { id: 'e4', source: 'node-place', target: 'node-twin' },
  { id: 'e5', source: 'node-place', target: 'node-recruiter' },
  { id: 'e6', source: 'node-place', target: 'node-hitl' },
  { id: 'e7', source: 'node-hitl', target: 'node-dispatch' },
];

export const MOCK_TRACE_LOGS: TraceLogItem[] = [
  {
    id: 'tr-101',
    timestamp: '10:42:01.120',
    agentName: 'Orchestrator Core',
    action: 'Intent Classification: Query resolved to [GIS_LOCATION_LOOKUP]',
    status: 'info',
    latencyMs: 14,
    tokenCount: 48,
    details: 'User prompt: "Where is my OS Lab class?" matched to Schedule ID sched-1.',
  },
  {
    id: 'tr-102',
    timestamp: '10:42:01.145',
    agentName: 'Spatial GIS Agent',
    action: 'Resolved Room CL-12 -> Building: Admin Block, Floor: 2, Coordinates: (x: 420, y: 180)',
    status: 'success',
    latencyMs: 22,
    tokenCount: 112,
    details: 'Calculated shortest route from Central Elevator B2 to Door CL-12.',
  },
  {
    id: 'tr-103',
    timestamp: '10:42:05.410',
    agentName: 'Placement Supervisor',
    action: 'Triggered Digital Twin Matrix calculation for Student 2451-22-733-001',
    status: 'info',
    latencyMs: 35,
    tokenCount: 180,
    details: 'Evaluating CGPA 8.84, Resume 88%, Technical 92% against 4 active tier-1 hiring drives.',
  },
  {
    id: 'tr-104',
    timestamp: '10:42:05.520',
    agentName: 'HITL Gatekeeper',
    action: 'Halted dispatch: Action [MEDICAL_WAIVER_SUBMISSION] requires HOD signoff',
    status: 'warning',
    latencyMs: 5,
    tokenCount: 22,
    details: 'Awaiting human authorization before sending email payload to CSE-HOD-MASTER.',
  },
];

export const MOCK_HITL_PAYLOAD: HITLPayload = {
  id: 'hitl-req-9042',
  title: 'Medical Attendance Shortage Waiver Petition',
  description: 'Requesting attendance condensation (72.5% -> 75.0% threshold) due to acute viral illness supported by Apollo Hospitals medical certificate.',
  targetRecipient: 'Dr. Marcus Vance (Head of Department, CSE)',
  recipientEmail: 'hod.cse@vce.ac.in',
  editableBody: `Respected Head of Department,

I am writing to formally request condensation for my attendance in Semester VI (Current: 72.5%, Required: 75.0%). I was unable to attend classes between July 14 and July 18 due to severe viral fever.

I have attached the verified medical certificate from Apollo Hospitals (Cert ID: APH-2026-8819). I request you to kindly approve the 2.5% attendance waiver so I remain eligible for upcoming placement drives.

Thank you.
Sincerely,
Alex Rivera (Roll No: 2451-22-733-001)`,
  status: 'pending',
  metadata: {
    type: 'medical_waiver',
    studentName: 'Alex Rivera',
    rollNumber: '2451-22-733-001',
    daysMissed: 4,
    txHash: '0x7f9a2b8e4c1d3f5a6b0c9d8e7f6a5b4c3d2e1f0a',
  },
};

export const MOCK_PLACEMENT_DRIVES: PlacementDrive[] = [
  {
    id: 'drive-google',
    companyName: 'Google',
    logo: '🌐',
    roleTitle: 'Software Engineer - AI Systems (L3)',
    ctc: '₹34.5 LPA',
    eligibilityCgpa: 8.5,
    maxBacklogs: 0,
    location: 'Hyderabad / Bengaluru',
    deadline: 'Tomorrow, 5:00 PM',
    skillsRequired: ['Python', 'C++', 'Distributed Systems', 'PyTorch'],
    matchScore: 94,
    status: 'eligible',
  },
  {
    id: 'drive-microsoft',
    companyName: 'Microsoft',
    logo: '🪟',
    roleTitle: 'Full Stack Cloud Engineer',
    ctc: '₹28.0 LPA',
    eligibilityCgpa: 8.0,
    maxBacklogs: 0,
    location: 'Hyderabad',
    deadline: 'In 3 Days',
    skillsRequired: ['TypeScript', 'Next.js', 'Azure', 'C# .NET'],
    matchScore: 89,
    status: 'eligible',
  },
  {
    id: 'drive-aws',
    companyName: 'Amazon Web Services',
    logo: '☁️',
    roleTitle: 'Systems Development Engineer',
    ctc: '₹31.2 LPA',
    eligibilityCgpa: 8.2,
    maxBacklogs: 0,
    location: 'Bengaluru',
    deadline: 'In 5 Days',
    skillsRequired: ['Java', 'Distributed Databases', 'AWS', 'Linux'],
    matchScore: 86,
    status: 'eligible',
  },
  {
    id: 'drive-swiggy',
    companyName: 'Swiggy',
    logo: '🛵',
    roleTitle: 'Backend Platform Engineer',
    ctc: '₹22.0 LPA',
    eligibilityCgpa: 7.5,
    maxBacklogs: 1,
    location: 'Remote / Bengaluru',
    deadline: 'In 1 Week',
    skillsRequired: ['Go', 'Redis', 'Kafka', 'PostgreSQL'],
    matchScore: 82,
    status: 'eligible',
  },
];

export const MOCK_DIGITAL_TWINS: DigitalTwinPath[] = [
  {
    id: 'dt-path-a',
    title: 'Path A: AI & LLM Systems Engineer',
    roleCategory: 'Artificial Intelligence / Deep Learning',
    readinessPercentage: 92,
    missingSkillCount: 1,
    avgSalaryRange: '₹32 LPA - ₹40 LPA',
    industryDemand: 'Critical',
    missingSkills: ['LangChain / LlamaIndex Vector RAG'],
    recommendedCertifications: ['AWS Certified Machine Learning Specialist', 'NVIDIA Deep Learning Institute'],
  },
  {
    id: 'dt-path-b',
    title: 'Path B: High-Throughput Backend Architect',
    roleCategory: 'Distributed Systems & Cloud Platform',
    readinessPercentage: 86,
    missingSkillCount: 2,
    avgSalaryRange: '₹26 LPA - ₹34 LPA',
    industryDemand: 'Very High',
    missingSkills: ['Apache Kafka Event Streaming', 'gRPC Protocol Buffers'],
    recommendedCertifications: ['Certified Kubernetes Application Developer (CKAD)', 'HashiCorp Terraform'],
  },
];

export const MOCK_SKILL_RADAR: SkillRadarItem[] = [
  { skill: 'Data Structures & Algorithms', currentLevel: 92, targetLevel: 95 },
  { skill: 'System Design & Architecture', currentLevel: 84, targetLevel: 90 },
  { skill: 'Full Stack Development', currentLevel: 95, targetLevel: 95 },
  { skill: 'AI & Machine Learning', currentLevel: 88, targetLevel: 92 },
  { skill: 'Cloud & DevOps', currentLevel: 76, targetLevel: 85 },
  { skill: 'Communication & Leadership', currentLevel: 89, targetLevel: 90 },
];

export const MOCK_RECRUITER_FEEDBACK: RecruiterFeedback = {
  category: 'Tier 1 Product Companies (Google, Microsoft)',
  score: 88,
  strengths: [
    'Exceptional CGPA (8.84/10) with 0 backlogs',
    'Demonstrated mastery in modern TypeScript and React/Next.js ecosystem',
    'Solid foundation in core computer science subjects (OS, DBMS, AI)',
  ],
  concerns: [
    'Needs 1 large-scale distributed systems project with live benchmark metrics',
    'Lacks formal cloud certification badge on resume header',
  ],
  rejectionRisk: 12,
};

export const MOCK_INTERVIEW_REPLAYS: InterviewReplay[] = [
  {
    questionId: 'q-101',
    questionText: 'Explain how you would design a rate limiter for a distributed API gateway.',
    userAnswerSummary: 'Explained Token Bucket algorithm using Redis INCR and EXPIRE keys with sliding window counter.',
    aiSuggestedAnswer: 'Excellent answer. Highlighting Redis Lua scripts for atomic execution avoids race conditions in multi-threaded nodes.',
    ratingScore: 9.2,
    improvementTip: 'Mention latency impact when handling 100k+ QPS and fallback cache strategy.',
  },
  {
    questionId: 'q-102',
    questionText: 'What happens under the hood when a browser initiates a TLS 1.3 Handshake?',
    userAnswerSummary: 'Detailed Client Hello, Server Hello, Diffie-Hellman Key Exchange, and 1-RTT encrypted tunnel setup.',
    aiSuggestedAnswer: 'Flawless technical explanation with accurate protocol terminology.',
    ratingScore: 9.6,
    improvementTip: 'Point out how Session Resumption (0-RTT) accelerates repeat user visits.',
  },
];

export const MOCK_WAIVER_PETITION: WaiverPetition = {
  id: 'wav-2026-004',
  title: 'Attendance Shortage Condensation Request',
  category: 'Medical',
  datesAffected: '14 July 2026 – 18 July 2026',
  classesMissed: 14,
  currentAttendance: 72.5,
  postWaiverAttendance: 75.2,
  status: 'Draft',
  hospitalName: 'Apollo Hospitals, Jubilee Hills',
  doctorName: 'Dr. R. K. Sharma (MD, Internal Medicine)',
  ocrVerified: true,
  documentFileName: 'Apollo_Medical_Certificate_July2026.pdf',
};

export const MOCK_CRYPTOGRAPHIC_RECEIPT: CryptographicReceipt = {
  actionId: 'ACT-ZENO-99428-VCE',
  txHash: '0x8f7a9d3c2b1e4f5a6b0c9d8e7f6a5b4c3d2e1f0a',
  blockHeight: 18492041,
  timestamp: new Date().toISOString(),
  tenantCode: 'VCE-HYD-500031',
  studentRollNumber: '2451-22-733-001',
  targetRecipient: 'Dr. Marcus Vance (HOD CSE)',
  payloadSummary: 'Attendance Shortage Waiver Condensation (72.5% -> 75.2%)',
  verifiedBySignature: 'ed25519:vce-gov-cert-key-9902',
};
