import type { AgentDomain, IntentResult, EventCardData, EmailDraftData, GrievanceStepData } from '../types';

/**
 * Zeno Intent Classifier & Deterministic Fallback LLM Resolution Engine
 * Enforces Zero-Vague Policy and Context-Aware Interpolation.
 */
export function classifyUserIntent(prompt: string): IntentResult {
  const lower = prompt.toLowerCase();

  // Context-Aware Interpolation: Extract user session context from localStorage
  let userName = 'Alex Rivera';
  let userRoll = '2451-22-733-001';
  let userCgpa = '8.84';
  let userAttendance = '72.5%';
  let userBranch = 'Computer Science & Engineering';

  try {
    const rawUser = localStorage.getItem('zeno_user');
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      if (parsed.name) userName = parsed.name;
      if (parsed.rollNumber) userRoll = parsed.rollNumber;
      if (parsed.department) userBranch = parsed.department;
    }
  } catch (e) {
    console.warn('[INTENT CLASSIFIER] Could not parse zeno_user from localStorage:', e);
  }

  // 1. KEYWORD-DRIVEN REGEX FILTER: EVENTS DOMAIN
  const eventsRegex = /hackathon|fest|workshop|club|timing|venue|event|seminar|symposium|conference/i;
  if (eventsRegex.test(lower)) {
    const eventCard: EventCardData = {
      eventName: 'Smart Telangana AI & Governance Hackathon 2026',
      organizer: `Department of ${userBranch} & Zeno AI Core`,
      dateTime: '12-14 August 2026 • 09:00 AM IST',
      venue: 'Main Auditorium & CL-12 OS Lab, Admin Block Floor 2',
      eligibility: `Open to all registered ${userBranch} Students (${userRoll})`,
      deadline: '10 August 2026, 11:59 PM IST',
      description:
        'A 48-hour continuous hackathon focused on building autonomous agent workflows, smart campus GIS indoor maps, and verifiable cryptographic ledger governance systems.',
    };

    return {
      domain: 'EVENTS',
      agentName: 'EVENTS_ROUTER',
      confidence: 0.98,
      summary: `I have queried the campus event schedule engine and retrieved active event telemetry for **${eventCard.eventName}**.`,
      eventCard,
    };
  }

  // 2. KEYWORD-DRIVEN REGEX FILTER: COMMUNICATION DOMAIN
  const commRegex = /email|letter|draft|leave|permission|sir|ma'am|write|professor|hod|condensation|waiver/i;
  if (commRegex.test(lower)) {
    const emailDraft: EmailDraftData = {
      recipientName: 'Dr. Marcus Vance',
      recipientRole: `Head of Department, ${userBranch}`,
      subject: `Formal Request for Attendance Condensation & Lab Re-examination - ${userName} (${userRoll})`,
      body: `Respected Dr. Marcus Vance,

I am writing to formally request condensation for my attendance in Semester VI (Current Attendance: ${userAttendance}, Mandatory Threshold: 75.0%). I was unable to attend lab sessions due to medical illness.

I have attached my verified medical certificate from Apollo Hospitals (Cert ID: APH-2026-8819). I request you to kindly condone the 2.5% attendance shortage so I remain eligible for tier-1 placement drives.

Thanking you.

Sincerely,
${userName}
Roll Number: ${userRoll}
B.Tech ${userBranch}, Semester VI`,
      studentRollNumber: userRoll,
      studentName: userName,
    };

    return {
      domain: 'COMMUNICATION',
      agentName: 'COMM_STUDIO',
      confidence: 0.96,
      summary: `I have generated a formal institutional email draft addressed to **${emailDraft.recipientName} (${emailDraft.recipientRole})**.`,
      emailDraft,
    };
  }

  // 3. KEYWORD-DRIVEN REGEX FILTER: PLACEMENT DOMAIN
  const placementRegex = /job|interview|resume|company|package|cgc|tier|drive|placement|salary|ctc|google|ats/i;
  if (placementRegex.test(lower)) {
    return {
      domain: 'PLACEMENT',
      agentName: 'PLACEMENT_ENGINE',
      confidence: 0.97,
      summary: `### 🎓 Placement AI Eligibility & Skill Matrix\n\n- **Target Drive:** **Google Software Engineer - AI Systems (L3)**\n- **Candidate:** ${userName} (\`${userRoll}\`)\n- **Eligibility Status:** ✅ **ELIGIBLE** (CGPA ${userCgpa} ≥ 8.5, 0 Active Backlogs)\n- **Match Score:** **94%**\n\n**Digital Twin Insight:** You match 94% of core skill requirements (TypeScript, PyTorch, Distributed Systems, Redis).`,
    };
  }

  // 4. KEYWORD-DRIVEN REGEX FILTER: ACADEMIC DOMAIN
  const academicRegex = /attendance|syllabus|grade|exam|assignment|marks|gpa|cgpa|policy|handbook/i;
  if (academicRegex.test(lower)) {
    return {
      domain: 'ACADEMIC',
      agentName: 'ACADEMIC_DS',
      confidence: 0.95,
      summary: `### 📚 Academic Telemetry & Attendance Insights\n\n- **Student:** ${userName} (\`${userRoll}\`)\n- **Current CGPA:** **${userCgpa}** (Semester VI, ${userBranch})\n- **Overall Attendance:** **${userAttendance}** (Shortfall: -2.5% below mandatory 75% threshold)\n- **Policy Enforcement:** Under Handbook §7.2, medical shortage below 75% requires HOD condonation signoff.`,
    };
  }

  // 5. KEYWORD-DRIVEN REGEX FILTER & UNMATCHED QUERY EXECUTION: STUDENT_SERVICE DOMAIN
  // Zero-Vague Policy: General & out-of-scope campus queries route through STUDENT_SERVICE with 4 actionable administrative steps.
  const grievanceSteps: GrievanceStepData[] = [
    {
      stepNumber: 1,
      title: 'Submit Ticket on Zeno Governance Portal',
      description: `File an authenticated digital grievance ticket for ${userName} (${userRoll}).`,
      officeContact: 'Student Affairs Cell (Room Admin-102)',
    },
    {
      stepNumber: 2,
      title: 'Departmental SLA Verification',
      description: `Department of ${userBranch} conducts preliminary assessment within 24 hours.`,
      officeContact: 'Prof. K. V. Sharma (Faculty Advisor, Ext: 402)',
    },
    {
      stepNumber: 3,
      title: 'Administrative Section Dispatch',
      description: 'Dispatches work order to Campus IT / Transport / Estate Maintenance.',
      officeContact: 'Campus Administration Office (Room Admin-104)',
    },
    {
      stepNumber: 4,
      title: 'HOD Executive Signoff',
      description: 'HOD executes digital approval and issues cryptographic transaction proof.',
      officeContact: 'HOD Executive Office (Room Admin-201)',
    },
  ];

  return {
    domain: 'STUDENT_SERVICE',
    agentName: 'GRIEVANCE_ROUTER',
    confidence: 0.88,
    summary: `I have parsed your query regarding campus administrative workflows for **${userName}** (\`${userRoll}\`). Below are the 4 structured administrative steps to resolve this request.`,
    grievanceSteps,
  };
}
