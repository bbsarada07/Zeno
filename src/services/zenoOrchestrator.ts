/**
 * Zeno Central Multi-Agent Orchestrator & Intent Classifier
 * SINGLE SOURCE OF TRUTH FOR VOICE & TEXT QUERIES
 */

import { searchResourceCatalog, formatResourceMarkdownResponse } from './resourceService';

export type AgentType =
  | 'academic'
  | 'placement'
  | 'communication'
  | 'service'
  | 'event'
  | 'campus_gps'
  | 'resource'
  | 'governance'
  | 'general'
  | 'multi_intent';

export interface IntentClassification {
  intent: AgentType;
  primaryAgent: AgentType;
  secondaryAgent?: AgentType;
  confidence: number;
  reason: string;
  isMultiIntent: boolean;
  needsClarification: boolean;
  clarificationQuestion?: string;
  topic?: string;
}

export interface UnifiedChatRequest {
  message: string;
  inputMode: 'text' | 'voice';
  studentId?: string;
  conversationId?: string;
  userProfile?: any;
  requestId?: string;
}

export interface StructuredAgentResponse {
  success: boolean;
  agent: AgentType;
  agentLabel: string;
  primaryAgent?: AgentType;
  secondaryAgent?: AgentType;
  agentBadgeLabel: string;
  confidence: number;
  topic?: string;
  markdown: string;
  speechText: string;
  response: string;
  resourceRequired: boolean;
  resources?: Array<{ title: string; url: string; category: string }>;
  actions?: Array<{ label: string; actionType: string; payload?: any }>;
  gisTarget?: { building: string; floor: number; room: string };
  telemetry?: Record<string, any>;
  timestamp: string;
  conversationId: string;
  retryable?: boolean;
  errorDetails?: string;
}

// Conversation Context Store for Follow-up Memory
interface ConversationContext {
  previousQuery?: string;
  previousAgent?: AgentType;
  previousTopic?: string;
}

const contextMemory: Map<string, ConversationContext> = new Map();

/**
 * 1. INTENT CLASSIFICATION ENGINE
 */
export function classifyUserIntent(query: string, conversationId?: string): IntentClassification {
  const q = query.toLowerCase().trim();

  // Handle follow-up pronouns ("it", "where can I learn it", "which one is best")
  const ctx = conversationId ? contextMemory.get(conversationId) : undefined;
  let effectiveQuery = q;

  if (ctx && ctx.previousTopic && (q.includes('it') || q.includes('this') || q.includes('where can i learn') || q.includes('which one'))) {
    effectiveQuery = `${q} ${ctx.previousTopic}`;
  }

  // Multi-Intent Check (Placement + GPS)
  const containsPlacement =
    effectiveQuery.includes('placement') ||
    effectiveQuery.includes('interview') ||
    effectiveQuery.includes('resume') ||
    effectiveQuery.includes('ats') ||
    effectiveQuery.includes('job') ||
    effectiveQuery.includes('internship');

  const containsGps =
    effectiveQuery.includes('where is') ||
    effectiveQuery.includes('take me to') ||
    effectiveQuery.includes('how do i reach') ||
    effectiveQuery.includes('room') ||
    effectiveQuery.includes('ece-') ||
    effectiveQuery.includes('csm-');

  if (containsPlacement && containsGps) {
    return {
      intent: 'multi_intent',
      primaryAgent: 'placement',
      secondaryAgent: 'campus_gps',
      confidence: 0.96,
      reason: 'Query requests both interview readiness and physical room navigation',
      isMultiIntent: true,
      needsClarification: false,
    };
  }

  // 1. CAMPUS GPS AGENT
  if (
    effectiveQuery.startsWith('where is') ||
    effectiveQuery.startsWith('take me to') ||
    effectiveQuery.startsWith('how to reach') ||
    effectiveQuery.includes('ece block') ||
    effectiveQuery.includes('csm block') ||
    effectiveQuery.includes('it block') ||
    effectiveQuery.includes('admin block') ||
    effectiveQuery.includes('ece-204') ||
    effectiveQuery.includes('csm-204') ||
    effectiveQuery.includes('location of') ||
    (effectiveQuery.includes('library') && (effectiveQuery.includes('where') || effectiveQuery.includes('reach') || effectiveQuery.includes('direction')))
  ) {
    return {
      intent: 'campus_gps',
      primaryAgent: 'campus_gps',
      confidence: 0.96,
      reason: 'Physical campus location or navigation request',
      isMultiIntent: false,
      needsClarification: false,
      topic: 'Campus GPS Navigation',
    };
  }

  // 2. PLACEMENT AGENT
  if (
    effectiveQuery.includes('resume') ||
    effectiveQuery.includes('ats') ||
    effectiveQuery.includes('placement') ||
    effectiveQuery.includes('internship') ||
    effectiveQuery.includes('job') ||
    effectiveQuery.includes('readiness') ||
    effectiveQuery.includes('mock interview') ||
    effectiveQuery.includes('skill gap') ||
    effectiveQuery.includes('dsa sheet')
  ) {
    return {
      intent: 'placement',
      primaryAgent: 'placement',
      confidence: 0.95,
      reason: 'Career, ATS resume scoring, or placement preparation request',
      isMultiIntent: false,
      needsClarification: false,
      topic: 'Placement & Internships',
    };
  }

  // 3. ACADEMIC AGENT
  if (
    effectiveQuery.includes('normalization') ||
    effectiveQuery.includes('dbms') ||
    effectiveQuery.includes('python') ||
    effectiveQuery.includes('react') ||
    effectiveQuery.includes('recursion') ||
    effectiveQuery.includes('notes') ||
    effectiveQuery.includes('pdf') ||
    effectiveQuery.includes('syllabus') ||
    effectiveQuery.includes('assignment') ||
    effectiveQuery.includes('exam') ||
    effectiveQuery.includes('quiz') ||
    effectiveQuery.includes('bunk') ||
    effectiveQuery.includes('attendance') ||
    effectiveQuery.includes('algorithms') ||
    effectiveQuery.includes('learn') ||
    effectiveQuery.includes('course') ||
    effectiveQuery.includes('operating system')
  ) {
    return {
      intent: 'academic',
      primaryAgent: 'academic',
      confidence: 0.95,
      reason: 'Academic coursework, study material, programming resources, or attendance calculation',
      isMultiIntent: false,
      needsClarification: false,
      topic: effectiveQuery.includes('python') ? 'Python' : effectiveQuery.includes('normalization') ? 'DBMS Normalization' : 'Academic Coursework',
    };
  }

  // 4. COMMUNICATION AGENT
  if (
    effectiveQuery.includes('english') ||
    effectiveQuery.includes('communication') ||
    effectiveQuery.includes('speaking') ||
    effectiveQuery.includes('group discussion') ||
    effectiveQuery.includes('grammar') ||
    effectiveQuery.includes('vocabulary') ||
    effectiveQuery.includes('hr interview')
  ) {
    return {
      intent: 'communication',
      primaryAgent: 'communication',
      confidence: 0.94,
      reason: 'Spoken English practice, grammar evaluation, or HR discussion prep',
      isMultiIntent: false,
      needsClarification: false,
      topic: 'Communication Skills',
    };
  }

  // 5. EVENT AGENT
  if (
    effectiveQuery.includes('hackathon') ||
    effectiveQuery.includes('fest') ||
    effectiveQuery.includes('event') ||
    effectiveQuery.includes('workshop') ||
    effectiveQuery.includes('register') ||
    effectiveQuery.includes('contest')
  ) {
    return {
      intent: 'event',
      primaryAgent: 'event',
      confidence: 0.94,
      reason: 'Campus events, hackathons, or workshop schedules',
      isMultiIntent: false,
      needsClarification: false,
      topic: 'Campus Hackathons & Events',
    };
  }

  // 6. SERVICE AGENT
  if (
    effectiveQuery.includes('bonafide') ||
    effectiveQuery.includes('certificate') ||
    effectiveQuery.includes('fee receipt') ||
    effectiveQuery.includes('complaint') ||
    effectiveQuery.includes('maintenance') ||
    effectiveQuery.includes('shuttle') ||
    effectiveQuery.includes('leave')
  ) {
    return {
      intent: 'service',
      primaryAgent: 'service',
      confidence: 0.93,
      reason: 'Student administrative services, certificates, or operational timings',
      isMultiIntent: false,
      needsClarification: false,
      topic: 'Campus Administrative Services',
    };
  }

  // Ambiguous query check
  if (effectiveQuery.length < 3) {
    return {
      intent: 'general',
      primaryAgent: 'general',
      confidence: 0.5,
      reason: 'Query is underspecified',
      isMultiIntent: false,
      needsClarification: true,
      clarificationQuestion: 'Could you clarify what you need help with (Academic, Placements, Events, Services, or Campus GPS)?',
    };
  }

  return {
    intent: 'general',
    primaryAgent: 'general',
    confidence: 0.85,
    reason: 'General campus inquiry',
    isMultiIntent: false,
    needsClarification: false,
  };
}

/**
 * 2. SINGLE UNIFIED QUERY PROCESSOR (USED BY BOTH TEXT AND VOICE)
 */
export async function processUserQuery(req: UnifiedChatRequest): Promise<StructuredAgentResponse> {
  return await executeCentralOrchestrator(req);
}

/**
 * 3. CENTRAL ORCHESTRATOR EXECUTION PIPELINE
 */
export async function executeCentralOrchestrator(req: UnifiedChatRequest): Promise<StructuredAgentResponse> {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const convId = req.conversationId || `conv-${Date.now()}`;
  const q = req.message.trim();

  // Validate empty transcript
  if (!q || q.length < 2) {
    return {
      success: true,
      agent: 'general',
      agentLabel: 'Zeno Assistant',
      agentBadgeLabel: 'ZENO ASSISTANT',
      confidence: 0.5,
      markdown: "🎙 I couldn't clearly understand that. Please try again.",
      speechText: "I couldn't clearly understand that. Please try again.",
      response: "I couldn't clearly understand that. Please try again.",
      resourceRequired: false,
      timestamp,
      conversationId: convId,
    };
  }

  try {
    const classification = classifyUserIntent(q, convId);

    // Save context for follow-up
    contextMemory.set(convId, {
      previousQuery: q,
      previousAgent: classification.primaryAgent,
      previousTopic: classification.topic,
    });

    // Clarification needed for low confidence
    if (classification.needsClarification && classification.clarificationQuestion) {
      return {
        success: true,
        agent: 'general',
        agentLabel: 'Zeno Assistant',
        agentBadgeLabel: 'ZENO ASSISTANT',
        confidence: classification.confidence,
        markdown: `🤔 **Clarification Request**\n\n${classification.clarificationQuestion}`,
        speechText: classification.clarificationQuestion,
        response: classification.clarificationQuestion,
        resourceRequired: false,
        timestamp,
        conversationId: convId,
      };
    }

    // MULTI-INTENT EXECUTION (Placement + Campus GPS)
    if (classification.isMultiIntent) {
      const markdown = `🎯 **Coordinated Multi-Agent Intelligence**\n\nThis voice agent is active. Activating Placement Agent and Campus GPS Agent...\n\n### ✦ Placement Agent Preparation\n• **Target Company:** Microsoft / Tier-1 Software Engineering\n• **Interview Checklist:** Review Binary Search Trees, System Design Caching, & Behavioral STAR Stories.\n• **Practice Sheet:** [Striver's A2Z DSA Sheet ↗](https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/)\n\n### ✦ Campus GPS Agent Navigation\n• **Interview Location:** ECE Block — Room ECE-204 (Floor 1)\n• **Shortest Route:** 280m walking distance from your current location (~4 mins walking time).`;
      const speechText = 'Activating Placement Agent and Campus GPS Agent. I have prepared your interview checklist and located room ECE-204, a 4 minute walk away.';

      return {
        success: true,
        agent: 'multi_intent',
        agentLabel: 'Placement + Campus GPS Agent',
        primaryAgent: 'placement',
        secondaryAgent: 'campus_gps',
        agentBadgeLabel: '✦ PLACEMENT + CAMPUS GPS ACTIVATED',
        confidence: classification.confidence,
        markdown,
        speechText,
        response: speechText,
        resourceRequired: true,
        gisTarget: { building: 'ECE Block', floor: 1, room: 'ECE-204' },
        actions: [{ label: 'Launch 3D GPS Navigation', actionType: 'OPEN_GIS_MAP' }],
        timestamp,
        conversationId: convId,
      };
    }

    // SPECIALIZED SINGLE-AGENT ROUTING
    switch (classification.primaryAgent) {
      case 'academic': {
        const lowerQ = q.toLowerCase();
        const wantsResources = lowerQ.includes('resource') || lowerQ.includes('links') || lowerQ.includes('documentation') || lowerQ.includes('pdf') || lowerQ.includes('notes');

        let markdown = '';
        let speechText = '';

        if (lowerQ.includes('normalization')) {
          markdown = `📚 **Database Management Systems — Normalization**\n\nThis voice agent is active. Activating Academic Agent...\n\n**Normalization** is a systematic database design technique that organizes tables to reduce data redundancy and eliminate undesirable update, insertion, and deletion anomalies.\n\n### Core Normal Forms:\n1. **1NF (First Normal Form):** Ensures atomic values in columns; eliminates duplicate groups.\n2. **2NF (Second Normal Form):** Must be in 1NF and remove partial dependencies on composite keys.\n3. **3NF (Third Normal Form):** Must be in 2NF and remove transitive dependencies (non-key fields depending on other non-key fields).\n4. **BCNF (Boyce-Codd Normal Form):** A stricter 3NF variant where every determinant must be a candidate key.`;
          speechText = 'Normalization is a database design technique that organizes tables to minimize data redundancy and eliminate update anomalies through 1NF, 2NF, 3NF, and BCNF.';
        } else if (lowerQ.includes('python')) {
          markdown = `🐍 **Personalized Learning Path — Python Programming**\n\nThis voice agent is active. Activating Academic Agent...\n\nHere is your structured starting path for Python:\n\n1. **Core Fundamentals:** Variables, Control Flow, Functions, Data Structures (Lists, Dicts, Sets).\n2. **Object-Oriented Programming:** Classes, Inheritance, Decorators, Generators.\n3. **Advanced Applications:** Data Science (Pandas, NumPy) or Web Backends (FastAPI, Django).\n\n### 📚 Relevant Learning Resources\n• [Python Official Documentation ↗](https://docs.python.org/3/)\n• [W3Schools Python Tutorial ↗](https://www.w3schools.com/python/)\n• [freeCodeCamp Python Course ↗](https://www.freecodecamp.org/news/learn-python-free-python-courses-for-beginners/)`;
          speechText = 'Here is a personalized starting path for Python focusing on core syntax, object-oriented concepts, and application frameworks like FastAPI and Pandas.';
        } else {
          markdown = `📚 **Academic Coursework & Learning Guidance**\n\nThis voice agent is active. Activating Academic Agent...\n\nI have analyzed your query for academic coursework:\n\n• **Core Topic:** ${classification.topic || 'Computer Science Subject'}\n• **Key Concepts:** Fundamentals, Problem Solving, & Analytical Exercises.\n\n### 📚 Recommended Verified Resources\n• [NPTEL Online Courses ↗](https://nptel.ac.in/)\n• [GeeksforGeeks CS Tutorials ↗](https://www.geeksforgeeks.org/computer-science-projects/)`;
          speechText = `Activating Academic Agent. Here is the verified learning roadmap for ${classification.topic || 'your coursework'}.`;
        }

        return {
          success: true,
          agent: 'academic',
          agentLabel: 'Academic Agent',
          agentBadgeLabel: '✦ ACADEMIC AGENT ACTIVATED',
          confidence: classification.confidence,
          topic: classification.topic,
          markdown,
          speechText,
          response: speechText,
          resourceRequired: wantsResources || lowerQ.includes('python'),
          timestamp,
          conversationId: convId,
        };
      }

      case 'placement': {
        const lowerQ = q.toLowerCase();
        let markdown = '';
        let speechText = '';

        if (lowerQ.includes('resume') || lowerQ.includes('ats')) {
          markdown = `💼 **ATS Resume Analysis & Optimization**\n\nThis voice agent is active. Activating Placement Agent...\n\nI will analyze your resume against ATS criteria:\n\n• **ATS Compatibility Score:** Target 85%+\n• **Core Keywords:** Quantified metrics (e.g. "Reduced SLA latency by 84%"), Tech stack keywords.\n• **Formatting Rules:** Single-column layout, standard headers, clean bullet points.\n• **Missing Sections:** GitHub links, Live Demo URLs, Certified Skills.\n\n[Upload Resume for ATS Score ↗](#)`;
          speechText = 'Activating Placement Agent. Upload your resume for ATS compatibility analysis, keyword optimization, and placement readiness scoring.';
        } else if (lowerQ.includes('internship') || lowerQ.includes('job') || lowerQ.includes('frontend')) {
          markdown = `💼 **Frontend Software Engineering Internships**\n\nThis voice agent is active. Activating Placement Agent...\n\nI found 2 top verified frontend internship opportunities for you:\n\n1. **TechCorp Inc.** — Frontend React/TypeScript Engineer Intern\n   • Stipend: ₹35,000/mo | Location: Hyderabad / Remote\n   • [View & Apply on TechCorp ↗](https://linkedin.com/jobs)\n\n2. **Innovate Labs** — UI/UX Systems Developer Intern\n   • Stipend: ₹40,000/mo | Location: Bangalore\n   • [View & Apply on Innovate Labs ↗](https://internshala.com/)`;
          speechText = 'Activating Placement Agent. I found two verified frontend internship opportunities at TechCorp and Innovate Labs.';
        } else {
          markdown = `💼 **Placement Preparation & Career Roadmap**\n\nThis voice agent is active. Activating Placement Agent...\n\nHere is your targeted career preparation roadmap:\n\n• **Coding Practice:** [Striver's A2Z DSA Sheet ↗](https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/)\n• **System Design:** Review Caching, Microservices, and REST API standards.\n• **Mock Interview:** Practice top 50 SDE interview questions.`;
          speechText = 'Activating Placement Agent. Here is your placement preparation roadmap including DSA sheets and system design mock practice.';
        }

        return {
          success: true,
          agent: 'placement',
          agentLabel: 'Placement Agent',
          agentBadgeLabel: '✦ PLACEMENT AGENT ACTIVATED',
          confidence: classification.confidence,
          topic: classification.topic,
          markdown,
          speechText,
          response: speechText,
          resourceRequired: true,
          timestamp,
          conversationId: convId,
        };
      }

      case 'communication': {
        const markdown = `🗣️ **English Communication & HR Interview Readiness**\n\nThis voice agent is active. Activating Communication Agent...\n\nHere is your personalized communication improvement plan:\n\n• **Daily Practice:** Speak answer out loud for 3 minutes on technical STAR scenarios.\n• **Evaluation Metrics:** Fluency, Articulation, Professional Vocabulary, & Pace.\n• **HR Discussion Prep:** [freeCodeCamp Public Speaking & HR Prep ↗](https://www.freecodecamp.org/)`;
        const speechText = 'Activating Communication Agent. I am ready to evaluate your HR interview responses, vocabulary, and speaking fluency.';

        return {
          success: true,
          agent: 'communication',
          agentLabel: 'Communication Agent',
          agentBadgeLabel: '✦ COMMUNICATION AGENT ACTIVATED',
          confidence: classification.confidence,
          topic: classification.topic,
          markdown,
          speechText,
          response: speechText,
          resourceRequired: true,
          timestamp,
          conversationId: convId,
        };
      }

      case 'event': {
        const lowerQ = q.toLowerCase();
        let markdown = '';
        let speechText = '';

        if (lowerQ.includes('register') || lowerQ.includes('ai hackathon')) {
          markdown = `🏆 **Campus AI & Robotics Hackathon 2026**\n\nThis voice agent is active. Activating Events Agent...\n\nI found the relevant AI hackathon event:\n\n• **Event:** Annual Campus AI Systems Sprint\n• **Date:** This Friday, 10:00 AM @ Student Activity Center (SAC Hall)\n• **Prize Pool:** ₹1,00,000 + Incubation Support\n\n[🎟 Register for AI Hackathon ↗](https://devfolio.co/hackathons)`;
          speechText = 'Activating Events Agent. The Annual Campus AI Systems Sprint is open for registration. Click register to confirm your team.';
        } else {
          markdown = `🏆 **Upcoming Campus Hackathons & Workshops**\n\nThis voice agent is active. Activating Events Agent...\n\nHere are top active developer events:\n\n1. **Campus AI Hackathon** — Friday @ SAC Hall\n2. **ROS2 Autonomous Drone Workshop** — Saturday @ Auditorium B\n\n### 🔗 Explore Event Portals\n• [Devfolio Hackathon Discovery ↗](https://devfolio.co/hackathons)\n• [Unstop College Contests ↗](https://unstop.com/)`;
          speechText = 'Activating Events Agent. Here are active campus hackathons and workshops available for registration.';
        }

        return {
          success: true,
          agent: 'event',
          agentLabel: 'Events Agent',
          agentBadgeLabel: '✦ EVENT AGENT ACTIVATED',
          confidence: classification.confidence,
          topic: classification.topic,
          markdown,
          speechText,
          response: speechText,
          resourceRequired: true,
          timestamp,
          conversationId: convId,
        };
      }

      case 'service': {
        const markdown = `🏛️ **Student Administrative Services & Certificates**\n\nThis voice agent is active. Activating Service Agent...\n\nHere are the instructions for your administrative request:\n\n• **Bonafide Certificate:** Download pre-signed e-copy or request official stamped hardcopy.\n• **Hostel & AC Maintenance:** Submit service ticket online (SLA: 24 hours).\n• **Canteen Timings:** Open today 08:00 AM – 10:00 PM.\n\n[Open Bonafide Certificate Portal ↗](https://swayam.gov.in/)`;
        const speechText = 'Activating Service Agent. You can apply for a bonafide certificate directly from the Student Cell portal, or submit hostel maintenance tickets online.';

        return {
          success: true,
          agent: 'service',
          agentLabel: 'Service Agent',
          agentBadgeLabel: '✦ SERVICE AGENT ACTIVATED',
          confidence: classification.confidence,
          topic: classification.topic,
          markdown,
          speechText,
          response: speechText,
          resourceRequired: true,
          timestamp,
          conversationId: convId,
        };
      }

      case 'campus_gps': {
        const lowerQ = q.toLowerCase();
        const targetBuilding = lowerQ.includes('ece') ? 'ECE Block' : lowerQ.includes('csm') ? 'CSM Block' : lowerQ.includes('library') ? 'Library / IT Block' : 'CSE Block';

        const markdown = `📍 **Spatial Campus GPS Navigation**\n\nThis voice agent is active. Activating Campus GPS Agent...\n\n• **Target Location:** ${targetBuilding} (Floor 1 / Room 102)\n• **Shortest Route (Dijkstra):** Canteen → Main Walkway → Central Campus Junction → ${targetBuilding} Entrance\n• **Distance:** **240 m** | **Est. Walking Time:** **3.5 mins**\n\n[Start Navigation ↗](#)`;
        const speechText = `Activating Campus GPS Agent. ${targetBuilding} is located 240 meters from your current location, approximately 3.5 minutes walking distance.`;

        return {
          success: true,
          agent: 'campus_gps',
          agentLabel: 'Campus GPS Agent',
          agentBadgeLabel: '✦ CAMPUS GPS AGENT ACTIVATED',
          confidence: classification.confidence,
          topic: classification.topic,
          markdown,
          speechText,
          response: speechText,
          resourceRequired: false,
          gisTarget: { building: targetBuilding, floor: 1, room: '102' },
          actions: [{ label: 'Open Interactive 3D GPS Map', actionType: 'OPEN_GIS_MAP' }],
          timestamp,
          conversationId: convId,
        };
      }

      default: {
        const speechText = 'Hello! I am Zeno, your central multi-agent campus intelligence engine. How can I help you today?';
        return {
          success: true,
          agent: 'general',
          agentLabel: 'Zeno Assistant',
          agentBadgeLabel: '✦ ZENO GENERAL ASSISTANT',
          confidence: classification.confidence,
          markdown: `✦ **Zeno General Assistant**\n\nI am Zeno, your central multi-agent campus assistant. Ask me about Academic Coursework, Placement Drives, Hackathons, Certificates, or Campus Directions!`,
          speechText,
          response: speechText,
          resourceRequired: false,
          timestamp,
          conversationId: convId,
        };
      }
    }
  } catch (error: any) {
    console.error('[ZENO ORCHESTRATOR ERROR]', error);
    const fallbackText = "I couldn't process that request right now. Please try again.";
    return {
      success: false,
      agent: 'general',
      agentLabel: 'Zeno Assistant',
      agentBadgeLabel: '✦ ZENO GENERAL ASSISTANT',
      confidence: 0.0,
      markdown: `⚠️ ${fallbackText}`,
      speechText: fallbackText,
      response: fallbackText,
      resourceRequired: false,
      retryable: true,
      errorDetails: error?.message || 'Internal processing error',
      timestamp,
      conversationId: convId,
    };
  }
}
