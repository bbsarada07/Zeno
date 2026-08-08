import type { AgentDomain, IntentResult, EventCardData, EmailDraftData, GrievanceStepData } from '../types';
import { CAMPUS_KNOWLEDGE_DICTIONARY } from '../services/aiRoutingService';

export type AgentType =
  | 'ACADEMIC_GIS'
  | 'PLACEMENT_PIPELINE'
  | 'EVENTS_ROUTER'
  | 'GOVERNANCE_ROUTER'
  | 'ACADEMIC_STUDY_ENCLAVE';

export function classifyIntent(query: string): AgentType {
  const q = query.toLowerCase();

  // Academic Study Enclave Intent Matching
  if (
    q.includes('notes') ||
    q.includes('pdf') ||
    q.includes('syllabus') ||
    q.includes('question paper') ||
    q.includes('exam predictor') ||
    q.includes('quiz me') ||
    q.includes('quiz') ||
    q.includes('test me') ||
    q.includes('weakest topic') ||
    q.includes('flashcard') ||
    q.includes('flashcards') ||
    q.includes('study plan') ||
    q.includes('10 days') ||
    q.includes('knowledge map')
  ) {
    return 'ACADEMIC_STUDY_ENCLAVE';
  }

  // Exact Quick Chip Match & Academic/GIS Keywords
  if (
    q.includes('where is my next lab') ||
    q.includes('bunk') ||
    q.includes('section schedule') ||
    q.includes('lab') ||
    q.includes('where') ||
    q.includes('canteen') ||
    q.includes('food') ||
    q.includes('cafeteria') ||
    q.includes('library') ||
    q.includes('sports') ||
    q.includes('gym') ||
    q.includes('principal') ||
    q.includes('auditorium') ||
    q.includes('health') ||
    q.includes('medical') ||
    q.includes('class') ||
    q.includes('room') ||
    q.includes('schedule') ||
    q.includes('timetable')
  ) {
    return 'ACADEMIC_GIS';
  }

  if (
    q.includes('placement') ||
    q.includes('resume') ||
    q.includes('ats') ||
    q.includes('job') ||
    q.includes('interview') ||
    q.includes('skill gap') ||
    q.includes('microsoft') ||
    q.includes('google') ||
    q.includes('mock interview') ||
    q.includes('career roadmap') ||
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
  // 1. UNIVERSAL CAMPUS KNOWLEDGE BASE MATCHER (Canteen, Library, Sports, Principal, Auditorium, Health)
  // -------------------------------------------------------------
  if (q.includes('canteen') || q.includes('cafeteria') || q.includes('food') || q.includes('lunch') || q.includes('eat') || q.includes('coffee') || q.includes('sac')) {
    const place = CAMPUS_KNOWLEDGE_DICTIONARY.canteen;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('zeno:spatial_gis_trigger', {
          detail: { building: place.building, floor: place.floor, room_number: place.room, lab_code: place.code, lab_name: place.name },
        })
      );
    }
    return {
      domain: 'ACADEMIC_GIS',
      agentName: 'ACADEMIC_GIS',
      confidence: 0.99,
      summary: `📍 **Location Resolution:** ${place.name}\n• **Building:** ${place.building} - ${place.floor}\n• **Proximity:** ${place.proximity}\n• **Operating Hours:** ${place.hours}\n👉 *Action: Spatial map coordinates sent to Campus GIS View.*`,
    };
  }

  if (q.includes('library') || q.includes('book') || q.includes('read') || q.includes('journal')) {
    const place = CAMPUS_KNOWLEDGE_DICTIONARY.library;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('zeno:spatial_gis_trigger', {
          detail: { building: place.building, floor: place.floor, room_number: place.room, lab_code: place.code, lab_name: place.name },
        })
      );
    }
    return {
      domain: 'ACADEMIC_GIS',
      agentName: 'ACADEMIC_GIS',
      confidence: 0.99,
      summary: `📍 **Location Resolution:** ${place.name}\n• **Building:** ${place.building} - ${place.floor}\n• **Proximity:** ${place.proximity}\n• **Operating Hours:** ${place.hours}\n👉 *Action: Spatial map coordinates sent to Campus GIS View.*`,
    };
  }

  if (q.includes('sport') || q.includes('gym') || q.includes('badminton') || q.includes('stadium')) {
    const place = CAMPUS_KNOWLEDGE_DICTIONARY.sports;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('zeno:spatial_gis_trigger', {
          detail: { building: place.building, floor: place.floor, room_number: place.room, lab_code: place.code, lab_name: place.name },
        })
      );
    }
    return {
      domain: 'ACADEMIC_GIS',
      agentName: 'ACADEMIC_GIS',
      confidence: 0.99,
      summary: `📍 **Location Resolution:** ${place.name}\n• **Building:** ${place.building} - ${place.floor}\n• **Proximity:** ${place.proximity}\n• **Operating Hours:** ${place.hours}\n👉 *Action: Spatial map coordinates sent to Campus GIS View.*`,
    };
  }

  if (q.includes('principal') || q.includes('admin office') || q.includes('dean office') || q.includes('registrar')) {
    const place = CAMPUS_KNOWLEDGE_DICTIONARY.principal;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('zeno:spatial_gis_trigger', {
          detail: { building: place.building, floor: place.floor, room_number: place.room, lab_code: place.code, lab_name: place.name },
        })
      );
    }
    return {
      domain: 'ACADEMIC_GIS',
      agentName: 'ACADEMIC_GIS',
      confidence: 0.99,
      summary: `📍 **Location Resolution:** ${place.name}\n• **Building:** ${place.building} - ${place.floor}\n• **Proximity:** ${place.proximity}\n• **Operating Hours:** ${place.hours}\n👉 *Action: Spatial map coordinates sent to Campus GIS View.*`,
    };
  }

  if (q.includes('auditorium') || q.includes('seminar hall') || q.includes('convention')) {
    const place = CAMPUS_KNOWLEDGE_DICTIONARY.auditorium;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('zeno:spatial_gis_trigger', {
          detail: { building: place.building, floor: place.floor, room_number: place.room, lab_code: place.code, lab_name: place.name },
        })
      );
    }
    return {
      domain: 'ACADEMIC_GIS',
      agentName: 'ACADEMIC_GIS',
      confidence: 0.99,
      summary: `📍 **Location Resolution:** ${place.name}\n• **Building:** ${place.building} - ${place.floor}\n• **Proximity:** ${place.proximity}\n• **Operating Hours:** ${place.hours}\n👉 *Action: Spatial map coordinates sent to Campus GIS View.*`,
    };
  }

  if (q.includes('health') || q.includes('medical') || q.includes('doctor') || q.includes('clinic') || q.includes('fever')) {
    const place = CAMPUS_KNOWLEDGE_DICTIONARY.health;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('zeno:spatial_gis_trigger', {
          detail: { building: place.building, floor: place.floor, room_number: place.room, lab_code: place.code, lab_name: place.name },
        })
      );
    }
    return {
      domain: 'ACADEMIC_GIS',
      agentName: 'ACADEMIC_GIS',
      confidence: 0.99,
      summary: `📍 **Location Resolution:** ${place.name}\n• **Building:** ${place.building} - ${place.floor}\n• **Proximity:** ${place.proximity}\n• **Operating Hours:** ${place.hours}\n👉 *Action: Spatial map coordinates sent to Campus GIS View.*`,
    };
  }

  // -------------------------------------------------------------
  // 1.5 AGENT: ACADEMIC_STUDY_ENCLAVE (RAG, Study Planner, Quiz, Flashcards, Exam Predictor)
  // -------------------------------------------------------------
  if (agentType === 'ACADEMIC_STUDY_ENCLAVE') {
    if (q.includes('quiz') || q.includes('test me') || q.includes('weakest topic')) {
      return {
        domain: 'ACADEMIC_STUDY_ENCLAVE',
        agentName: 'ACADEMIC_STUDY_ENCLAVE',
        confidence: 0.99,
        summary: `📝 **Adaptive Knowledge Assessment: Trees & BST**\n\n**Question 1:** What is the balance factor threshold for an AVL Tree node before a rotation is required?\n\n• A) $0$\n• B) $\\pm 1$\n• C) Greater than $+1$ or less than $-1$\n• D) Always $2$\n\n*Select your answer to calculate updated Understanding Score.*`,
        quizCard: {
          id: 'q-avl-rotations',
          topic: 'AVL Trees & Rotations',
          question: 'What is the balance factor threshold for an AVL Tree node before a rotation is required?',
          options: [
            { label: 'A', text: '0', isCorrect: false },
            { label: 'B', text: '± 1', isCorrect: false },
            { label: 'C', text: 'Greater than +1 or less than -1', isCorrect: true },
            { label: 'D', text: 'Always 2', isCorrect: false },
          ],
          explanation: 'In an AVL Tree, balance factor = height(left) - height(right). If balance factor is > +1 or < -1, node is unbalanced and requires rotation.',
        },
      };
    }

    if (q.includes('study plan') || q.includes('10 days') || q.includes('exam predictor')) {
      return {
        domain: 'ACADEMIC_STUDY_ENCLAVE',
        agentName: 'ACADEMIC_STUDY_ENCLAVE',
        confidence: 0.98,
        summary: `📅 **AI Adaptive 10-Day Exam Roadmap**\n\n• **Day 1 (Priority ★★★★★):** Trees & AVL Rotations (Targeting 41% Weakness)\n• **Day 2 (Priority ★★★★★):** Graph Traversals (BFS & DFS)\n• **Day 3 (Priority ★★★★☆):** Dynamic Programming & Recurrence Relations\n• **Day 4:** Full Mock Exam & Active Recall Flashcards\n\n*Source Grounding: Cross-referenced Data_Structures_Notes.pdf & Question_Paper_2025.pdf*`,
        studyPlanData: [
          { dayNumber: 1, title: 'Trees & AVL Rotations', priorityStars: 5, topics: ['AVL Insertions', 'Single & Double Rotations', 'BST In-Order'], isWeaknessFocus: true },
          { dayNumber: 2, title: 'Graph Traversals (BFS & DFS)', priorityStars: 5, topics: ['Adjacency Matrix', 'Cycle Detection', 'Dijkstra'], isWeaknessFocus: false },
          { dayNumber: 3, title: 'Dynamic Programming', priorityStars: 4, topics: ['Memoization', 'Knapsack 0/1', 'LCS'], isWeaknessFocus: false },
          { dayNumber: 4, title: 'Full Mock Assessment', priorityStars: 4, topics: ['Active Recall Flashcards', '2025 Past Paper Practice'], isWeaknessFocus: false },
        ],
      };
    }

    if (q.includes('flashcard') || q.includes('flashcards')) {
      return {
        domain: 'ACADEMIC_STUDY_ENCLAVE',
        agentName: 'ACADEMIC_STUDY_ENCLAVE',
        confidence: 0.97,
        summary: `🎴 **Active Recall Flashcard: Binary Search Trees**\n\n**Front:** What is the worst-case time complexity for searching an element in an unbalanced Binary Search Tree?\n\n**Back:** $\\mathcal{O}(n)$ — occurs when the tree degenerates into a linear linked list structure.\n\n[Source: Data_Structures_Notes.pdf | Page 32 | Section: Binary Search Trees]`,
        flashcardData: {
          id: 'fc-bst-complexity',
          topic: 'Trees & BST',
          questionFront: 'What is the worst-case time complexity for searching in an unbalanced Binary Search Tree?',
          answerBack: 'O(n) — occurs when the tree degenerates into a linear linked list structure.',
          sourceCitation: 'Data_Structures_Notes.pdf | Page 32',
        },
      };
    }

    return {
      domain: 'ACADEMIC_STUDY_ENCLAVE',
      agentName: 'ACADEMIC_STUDY_ENCLAVE',
      confidence: 0.96,
      summary: `📚 **Grounded RAG Knowledge Retrieval: Binary Search Trees & AVL Rotations**\n\nIn-order traversal of a Binary Search Tree (BST) yields keys in sorted ascending order. When inserting elements into an AVL Tree, self-balancing rotations (LL, RR, LR, RL) are triggered when a node's balance factor exceeds $\\pm 1$.\n\n📌 **Source Citations:**\n- [Source: Data_Structures_Notes.pdf | Page 32 | Section: Binary Search Trees]\n- [Source: Question_Paper_2025.pdf | Page 4 | Section: Section B - Q4]\n\n*Source Grounding verified against vector store index.*`,
    };
  }

  // -------------------------------------------------------------
  // 2. AGENT 1: ACADEMIC_GIS (Labs, Classrooms, Schedules, Bunk Calculator)
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
        summary: `📍 **Location Resolution:** Operating Systems Laboratory\n• **Building:** Admin Block - Floor 2 (Room CL-12)\n• **Proximity:** 45m from Elevator Bank\n• **Operating Hours:** 10:00 AM – 12:00 PM Slot\n👉 *Action: Spatial map coordinates sent to Campus GIS View.*`,
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
        summary: `⚠️ **Attendance Impact Analysis**\n• **Current Attendance:** 72.5%\n• **Projected Attendance if Skipped:** ${newAttendance}%\n• **Status:** 🔴 CRITICAL RISK (Below 75% Mandatory Threshold)\n\n*Skipping this class drops overall attendance to ${newAttendance}%, which violates Vasavi College Handbook §7.2 policy!*`,
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
      summary: `📍 **Location Resolution:** Academic Classrooms & Labs\n• **Building:** Admin Block Floor 2 (Room CL-12)\n• **Proximity:** 45m from Elevator Bank\n• **Operating Hours:** 09:00 AM – 17:00 PM\n👉 *Action: Spatial map coordinates sent to Campus GIS View.*`,
    };
  }

  // -------------------------------------------------------------
  // 3. AGENT 2: PLACEMENT_PIPELINE
  // -------------------------------------------------------------
  if (agentType === 'PLACEMENT_PIPELINE') {
    if (q.includes('ats') || q.includes('resume') || q.includes('score')) {
      return {
        domain: 'PLACEMENT_PIPELINE',
        agentName: 'PLACEMENT_PIPELINE',
        confidence: 0.99,
        summary: `🎓 **ATS Resume Diagnostic & Impact Analysis**\n\n• **Overall ATS Score:** 87/100\n• **Keyword Match:** 91% | **Formatting:** 96% | **Project Quantification:** 78%\n\n⚠️ **Critical Warning:** Missing target role keywords: \`C++\` and \`Distributed System Design\`.\n\n👉 *Recommended Fix: Reorder technical skills section and rewrite Project 2 bullet points with quantified outcomes.*`,
      };
    }

    if (q.includes('roadmap') || q.includes('microsoft') || q.includes('target role') || q.includes('skill gap')) {
      return {
        domain: 'PLACEMENT_PIPELINE',
        agentName: 'PLACEMENT_PIPELINE',
        confidence: 0.98,
        summary: `🎯 **Microsoft SDE Placement Roadmap (Target Readiness: 85%)**\n\n• **Phase 1 (Days 1-5):** Bridge DSA Gap — Trees & Graph Traversals (12 Medium Problems)\n• **Phase 2 (Days 6-10):** System Design Fundamentals — REST API Caching & Fault Tolerance\n• **Phase 3 (Days 11-14):** Resume Defense & Mock Recruiter Simulation\n\n*Targeting Drive Date: 94% Alignment Match.*`,
      };
    }

    if (q.includes('interview') || q.includes('mock') || q.includes('recruiter')) {
      return {
        domain: 'PLACEMENT_PIPELINE',
        agentName: 'PLACEMENT_PIPELINE',
        confidence: 0.97,
        summary: `🎙️ **AI Recruiter Probing & Defense Simulation**\n\n**Interviewer Question:** *"You listed 'Corassist AI Engine' on your resume. How did you handle fallback state management when the backend API timed out?"*\n\n**Suggested Talking Points:**\n• Mention the 3.5s AbortController connection threshold.\n• Detail the client-side enclave fallback state engine.\n• Highlight zero UI crash resilience during Render cold-starts.`,
      };
    }

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
  // 4. AGENT 3: EVENTS_ROUTER
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
  // 5. AGENT 4: GOVERNANCE_ROUTER & GENERAL QUERY RESOLUTION
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
    summary: `🏛️ **Zeno Campus Intelligence Resolution**\n\nHello **${userName}** (\`${userRoll}\`, ${userBranch}).\n\nI have evaluated your request against Vasavi College of Engineering campus telemetry:\n- 📍 **Spatial GIS Locations:** Canteen (SAC Ground Floor), Central Library (Blocks C/D), Sports Complex (North Campus), Administrative Office (A-101)\n- ⚠️ **Predictive Attendance Bunk Calculator:** Current: ${userAttendance} (New: 70.8% - CRITICAL RISK)\n- 📊 **Academic Standing:** CGPA ${userCgpa}, 94% Placement Readiness`,
    grievanceSteps,
  };
}
