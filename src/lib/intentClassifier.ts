import type { AgentDomain, IntentResult, EventCardData, EmailDraftData, GrievanceStepData } from '../types';

export type AgentType = 'ACADEMIC_GIS' | 'PLACEMENT_PIPELINE' | 'EVENTS_ROUTER' | 'GOVERNANCE_ROUTER';

export function classifyIntent(query: string): AgentType {
  const q = query.toLowerCase();

  // Exact Quick Chip Match & Academic Keywords
  if (
    q.includes('where is my next lab') ||
    q.includes('bunk') ||
    q.includes('section schedule') ||
    q.includes('lab') ||
    q.includes('where') ||
    q.includes('class') ||
    q.includes('room') ||
    q.includes('schedule') ||
    q.includes('timetable')
  ) {
    return 'ACADEMIC_GIS';
  }

  if (
    q.includes('placement') ||
    q.includes('job') ||
    q.includes('resume') ||
    q.includes('drive') ||
    q.includes('package') ||
    q.includes('academic standing') ||
    q.includes('standing') ||
    q.includes('cgpa')
  ) {
    return 'PLACEMENT_PIPELINE';
  }

  if (q.includes('event') || q.includes('hackathon') || q.includes('fest') || q.includes('workshop')) {
    return 'EVENTS_ROUTER';
  }

  return 'GOVERNANCE_ROUTER';
}

export function classifyUserIntent(prompt: string): IntentResult {
  const agentType = classifyIntent(prompt);
  const q = prompt.toLowerCase();

  // Extract user session context from localStorage
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
      if (parsed.roll_number || parsed.rollNumber) userRoll = parsed.roll_number || parsed.rollNumber;
      if (parsed.department_name || parsed.department) userBranch = parsed.department_name || parsed.department;
      if (parsed.cgpa) userCgpa = String(parsed.cgpa);
      if (parsed.attendance_percentage) userAttendance = `${parsed.attendance_percentage}%`;
    }
  } catch (e) {
    console.warn('[INTENT CLASSIFIER] localStorage parse fallback:', e);
  }

  // -------------------------------------------------------------
  // AGENT 1: ACADEMIC_GIS (Labs, Classrooms, Schedules, Bunk Calculator)
  // -------------------------------------------------------------
  if (agentType === 'ACADEMIC_GIS') {
    // Quick Chip 1: "Where is my next lab?"
    if (q.includes('where is my next lab') || q.includes('next lab')) {
      const gisTarget = {
        building: 'Admin Block',
        floor: 'Floor 2',
        room_number: 'CL-12',
        lab_code: 'LAB-OS-201',
        lab_name: 'Operating Systems Laboratory',
      };

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('zeno:spatial_gis_trigger', {
            detail: gisTarget,
          })
        );
      }

      return {
        domain: 'ACADEMIC_GIS',
        agentName: 'ACADEMIC_GIS',
        confidence: 0.99,
        summary: `📍 **Spatial Indoor GIS Routing & Next Lab Schedule**\n\n- **Lab Name:** **Operating Systems Laboratory**\n- **Room Number:** **Room CL-12**\n- **Building & Floor:** **Admin Block, Floor 2**\n- **Timing Slot:** **10:00 AM – 12:00 PM**\n- **Faculty In-Charge:** Dr. K. Srinivas (Associate Professor)\n\n*The interactive spatial indoor campus map has automatically panned and zoomed to highlight your route to **Room CL-12**.*`,
      };
    }

    // Quick Chip 2: "Can I bunk Java Lab today?"
    if (q.includes('bunk') || q.includes('skip') || q.includes('java lab')) {
      const attended = 101.5;
      const total = 140;
      const newAttendance = ((attended / (total + 1)) * 100).toFixed(1);

      return {
        domain: 'ACADEMIC_GIS',
        agentName: 'ACADEMIC_GIS',
        confidence: 0.98,
        summary: `⚠️ **Predictive Bunk Risk Alert & Attendance Impact**\n\n- **Student:** ${userName} (\`${userRoll}\`)\n- **Current Attendance:** **72.5%** (${attended}/${total} classes attended)\n- **Projected Attendance if Missed:** **${newAttendance}%** (${attended}/${total + 1} classes)\n- **Risk Status:** 🛑 **CRITICAL DANGER**\n\n**Warning Assessment:** Skipping this class drops your overall attendance below 72.0% (${newAttendance}%), which violates the mandatory 75.0% Handbook §7.2 policy! Medical waiver condensation will be required.`,
      };
    }

    // Quick Chip 3: "Show today's section schedule"
    if (q.includes('section schedule') || q.includes('today\'s schedule') || q.includes('timetable') || q.includes('schedule')) {
      return {
        domain: 'ACADEMIC_GIS',
        agentName: 'ACADEMIC_GIS',
        confidence: 0.97,
        summary: `📅 **Today's Section Schedule (B.Tech ${userBranch}, Section A)**\n\n- 🕒 **09:00 AM – 10:00 AM:** Operating Systems Theory (Lecture Hall A-201)\n- 🕒 **10:00 AM – 12:00 PM:** Operating Systems Laboratory (Admin Block Floor 2, Room CL-12)\n- 🕒 **01:00 PM – 02:00 PM:** Machine Learning & Vector AI (Lecture Hall A-201)\n- 🕒 **02:00 PM – 04:00 PM:** Web Development Lab (Admin Block Floor 2, Room CL-14)`,
      };
    }

    // General Academic GIS Query
    return {
      domain: 'ACADEMIC_GIS',
      agentName: 'ACADEMIC_GIS',
      confidence: 0.94,
      summary: `📚 **Academic GIS & Timetable Intelligence**\n\n- **Student:** ${userName} (\`${userRoll}\`)\n- **Department:** ${userBranch}\n- **Current Class Slot:** Operating Systems Lab (10:00 AM – 12:00 PM, Room CL-12)\n- **Attendance:** **${userAttendance}** (Shortfall: -2.5% below 75% threshold)`,
    };
  }

  // -------------------------------------------------------------
  // AGENT 2: PLACEMENT_PIPELINE
  // -------------------------------------------------------------
  if (agentType === 'PLACEMENT_PIPELINE') {
    // Quick Chip 4: "Check academic standing & attendance"
    if (q.includes('academic standing') || q.includes('standing')) {
      return {
        domain: 'PLACEMENT_PIPELINE',
        agentName: 'PLACEMENT_PIPELINE',
        confidence: 0.99,
        summary: `📊 **Academic Standing & Placement Readiness Breakdown**\n\n- **Student Candidate:** ${userName} (\`${userRoll}\`)\n- **Cumulative CGPA:** **8.84 / 10.0** (0 Active Backlogs)\n- **Overall Attendance:** **72.5%** (Medical Waiver Petition Drafted)\n- **Target Career Role:** **Software Engineer - AI Systems (L3)**\n- **ATS Resume Score:** **88%**\n- **Placement Readiness Match Rate:** **94% Match Rate**`,
      };
    }

    return {
      domain: 'PLACEMENT_PIPELINE',
      agentName: 'PLACEMENT_PIPELINE',
      confidence: 0.96,
      summary: `🎓 **Placement Pipeline & Drive Intelligence**\n\n- **Target Drive:** **Google Software Engineer - AI Systems (L3)**\n- **Candidate:** ${userName} (\`${userRoll}\`)\n- **Eligibility Status:** ✅ **ELIGIBLE** (CGPA ${userCgpa} ≥ 8.5)\n- **Match Score:** **94% Match**\n\n*Click "Apply via Agent (HITL Gate)" in the Placement tab to dispatch your tailored cover letter.*`,
    };
  }

  // -------------------------------------------------------------
  // AGENT 3: EVENTS_ROUTER
  // -------------------------------------------------------------
  if (agentType === 'EVENTS_ROUTER') {
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
      domain: 'EVENTS_ROUTER',
      agentName: 'EVENTS_ROUTER',
      confidence: 0.98,
      summary: `🎪 **Campus Event Telemetry & Hackathon Registration**\n\nI have queried the campus event schedule engine and retrieved active event telemetry for **${eventCard.eventName}**.`,
      eventCard,
    };
  }

  // -------------------------------------------------------------
  // AGENT 4: GOVERNANCE_ROUTER
  // -------------------------------------------------------------
  if (q.includes('email') || q.includes('draft') || q.includes('letter') || q.includes('leave') || q.includes('permission')) {
    const emailDraft: EmailDraftData = {
      recipientName: 'Dr. Marcus Vance',
      recipientRole: `Head of Department, ${userBranch}`,
      subject: `Formal Request for Attendance Condensation - ${userName} (${userRoll})`,
      body: `Respected Dr. Marcus Vance,\n\nI am writing to formally request condensation for my attendance in Semester VI (Current: 72.5%, Required: 75.0%). I was unable to attend lab sessions from 14 July to 18 July 2026 due to severe medical fever.\n\nI have attached my verified medical certificate from Apollo Hospitals (Cert ID: APH-2026-8819).\n\nSincerely,\n${userName} (${userRoll})`,
      studentRollNumber: userRoll,
      studentName: userName,
    };

    return {
      domain: 'GOVERNANCE_ROUTER',
      agentName: 'GOVERNANCE_ROUTER',
      confidence: 0.97,
      summary: `🏛️ **Governance Router & Formal Institutional Draft**\n\nI have generated a formal institutional email draft addressed to **${emailDraft.recipientName} (${emailDraft.recipientRole})**.`,
      emailDraft,
    };
  }

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
      description: 'Dispatches work order to Campus IT / Estate Maintenance.',
      officeContact: 'Campus Administration Office (Room Admin-104)',
    },
  ];

  return {
    domain: 'GOVERNANCE_ROUTER',
    agentName: 'GOVERNANCE_ROUTER',
    confidence: 0.92,
    summary: `🏛️ **Governance Router Administrative Resolution Steps**\n\nI have parsed your administrative query for **${userName}** (\`${userRoll}\`). Below are the resolution steps:`,
    grievanceSteps,
  };
}
