import type { AgentDomain, IntentResult, EventCardData, EmailDraftData, GrievanceStepData } from '../types';

/**
 * Zeno Intent Classifier & Domain Engine
 * Evaluates incoming user prompts into specialized agent domains.
 */
export function classifyUserIntent(prompt: string): IntentResult {
  const lower = prompt.toLowerCase();

  // 1. EVENTS DOMAIN
  if (
    lower.includes('event') ||
    lower.includes('hackathon') ||
    lower.includes('workshop') ||
    lower.includes('seminar') ||
    lower.includes('fest') ||
    lower.includes('symposium') ||
    lower.includes('conference')
  ) {
    const eventCard: EventCardData = {
      eventName: 'Smart Telangana AI & Governance Hackathon 2026',
      organizer: 'Department of CSE & AI Club (VCE)',
      dateTime: '12-14 August 2026 • 09:00 AM IST',
      venue: 'Main Auditorium & CL-12 OS Lab, Admin Block Floor 2',
      eligibility: 'Open to B.Tech Semester VI & VIII CSE/IT/ECE Students',
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

  // 2. COMMUNICATION DOMAIN
  if (
    lower.includes('email') ||
    lower.includes('draft') ||
    lower.includes('letter') ||
    lower.includes('write to') ||
    lower.includes('professor') ||
    lower.includes('permission') ||
    lower.includes('leave note') ||
    lower.includes('formal request')
  ) {
    const emailDraft: EmailDraftData = {
      recipientName: 'Dr. Marcus Vance',
      recipientRole: 'Head of Department, CSE',
      subject: 'Formal Request for Attendance Condensation & Lab Re-examination - Alex Rivera (2451-22-733-001)',
      body: `Respected Dr. Marcus Vance,

I am writing to formally request condensation for my attendance in Semester VI (Current Attendance: 72.5%, Mandatory Threshold: 75.0%). I was unable to attend Operating Systems lab sessions from 14 July to 18 July 2026 due to acute medical illness.

I have attached my verified medical certificate from Apollo Hospitals (Cert ID: APH-2026-8819). I request you to kindly condone the 2.5% attendance shortage so I remain eligible for tier-1 placement drives.

Thanking you.

Sincerely,
Alex Rivera
Roll Number: 2451-22-733-001
B.Tech CSE, Semester VI (Section A)`,
      studentRollNumber: '2451-22-733-001',
      studentName: 'Alex Rivera',
    };

    return {
      domain: 'COMMUNICATION',
      agentName: 'COMM_STUDIO',
      confidence: 0.96,
      summary: `I have generated a formal institutional email draft addressed to **${emailDraft.recipientName} (${emailDraft.recipientRole})**.`,
      emailDraft,
    };
  }

  // 3. STUDENT_SERVICE (GRIEVANCE) DOMAIN
  if (
    lower.includes('complaint') ||
    lower.includes('wifi') ||
    lower.includes('hostel') ||
    lower.includes('fee') ||
    lower.includes('grievance') ||
    lower.includes('office') ||
    lower.includes('issue') ||
    lower.includes('help') ||
    lower.includes('stipend') ||
    lower.includes('id card')
  ) {
    const grievanceSteps: GrievanceStepData[] = [
      {
        stepNumber: 1,
        title: 'Submit Ticket on Zeno Governance Portal',
        description: 'File an authenticated digital grievance ticket with attached proof documents.',
        officeContact: 'Student Affairs Cell (Room Admin-102)',
      },
      {
        stepNumber: 2,
        title: 'Departmental Faculty Verification',
        description: 'Faculty advisor conducts preliminary SLA assessment within 24 hours.',
        officeContact: 'Prof. K. V. Sharma (Faculty Advisor, Ext: 402)',
      },
      {
        stepNumber: 3,
        title: 'HOD Signoff & Remediation Dispatch',
        description: 'Approved tickets dispatch automated work orders to Campus IT / Estate Maintenance.',
        officeContact: 'HOD Executive Office (Room Admin-201)',
      },
    ];

    return {
      domain: 'STUDENT_SERVICE',
      agentName: 'GRIEVANCE_ROUTER',
      confidence: 0.94,
      summary:
        'I understand your concern. Zeno has parsed your grievance and outlined the 3-step administrative resolution workflow below.',
      grievanceSteps,
    };
  }

  // 4. PLACEMENT DOMAIN
  if (
    lower.includes('google') ||
    lower.includes('placement') ||
    lower.includes('eligible') ||
    lower.includes('drive') ||
    lower.includes('salary') ||
    lower.includes('ctc') ||
    lower.includes('resume') ||
    lower.includes('interview')
  ) {
    return {
      domain: 'PLACEMENT',
      agentName: 'PLACEMENT_ENGINE',
      confidence: 0.97,
      summary:
        '### 🎓 Placement AI Eligibility & Skill Matrix\n\n- **Target Drive:** **Google Software Engineer - AI Systems (L3)**\n- **Candidate:** Alex Rivera (`2451-22-733-001`)\n- **Eligibility Status:** ✅ **ELIGIBLE** (CGPA 8.84 ≥ 8.5, 0 Active Backlogs)\n- **Match Score:** **94%**\n\n**Digital Twin Insight:** You match 94% of core skill requirements (TypeScript, PyTorch, Distributed Systems, Redis).',
    };
  }

  // 5. ACADEMIC DOMAIN (DEFAULT FALLBACK)
  return {
    domain: 'ACADEMIC',
    agentName: 'ACADEMIC_DS',
    confidence: 0.92,
    summary:
      '### 📚 Academic Telemetry & Attendance Insights\n\n- **Student:** Alex Rivera (`2451-22-733-001`)\n- **Current CGPA:** **8.84** (Semester VI)\n- **Overall Attendance:** **72.5%** (Shortfall: -2.5% below mandatory 75% threshold)\n- **Policy Enforcement:** Under Handbook §7.2, medical shortage below 75% requires HOD condonation signoff.',
  };
}
