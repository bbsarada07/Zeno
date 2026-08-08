export interface VoiceDispatchResponse {
  agentName: 'Academic Agent' | 'Placement Agent' | 'Events Agent' | 'Service Agent' | 'Communication Agent';
  spokenText: string;
  markdownPayload?: string;
}

export function processVoiceDispatch(userQuery: string): VoiceDispatchResponse {
  const q = userQuery.toLowerCase().trim();

  // 1. Academic Agent
  if (
    q.includes('attendance') ||
    q.includes('marks') ||
    q.includes('class') ||
    q.includes('grade') ||
    q.includes('timetable') ||
    q.includes('syllabus') ||
    q.includes('exam') ||
    q.includes('lecture')
  ) {
    return {
      agentName: 'Academic Agent',
      spokenText:
        'This voice agent is active. Activating Academic Agent... Your overall attendance is currently at 88%. You have 92% in Data Structures and 84% in Database Management Systems.',
      markdownPayload:
        '### Academic Telemetry\n- **Data Structures:** 92%\n- **DBMS:** 84%\n- **Overall Attendance:** 88% (Eligible for all exams)',
    };
  }

  // 2. Placement Agent
  if (
    q.includes('placement') ||
    q.includes('internship') ||
    q.includes('resume') ||
    q.includes('ats') ||
    q.includes('job') ||
    q.includes('drive')
  ) {
    return {
      agentName: 'Placement Agent',
      spokenText:
        'This voice agent is active. Activating Placement Agent... Two new software engineering internship drives were posted yesterday by TechCorp and Innovate Labs. Application closes this Friday.',
      markdownPayload:
        '### Placement Drives\n- **TechCorp:** SDE Intern (Apply by Friday)\n- **Innovate Labs:** AI/ML Intern (Apply by Saturday)',
    };
  }

  // 3. Service Agent
  if (
    q.includes('cafeteria') ||
    q.includes('food') ||
    q.includes('canteen') ||
    q.includes('ac') ||
    q.includes('shuttle') ||
    q.includes('hostel') ||
    q.includes('maintenance') ||
    q.includes('repair')
  ) {
    return {
      agentName: 'Service Agent',
      spokenText:
        'This voice agent is active. Activating Service Agent... Yes, the main campus cafeteria is open until 10:00 PM today.',
      markdownPayload:
        '### Service Status\n- **Main Canteen:** Open (08:00 AM - 10:00 PM)\n- **Shuttle Express:** Next departure in 12 minutes from Gate 2',
    };
  }

  // 4. Events Agent
  if (
    q.includes('hackathon') ||
    q.includes('event') ||
    q.includes('fest') ||
    q.includes('workshop') ||
    q.includes('club') ||
    q.includes('sports')
  ) {
    return {
      agentName: 'Events Agent',
      spokenText:
        'This voice agent is active. Activating Events Agent... The Annual Campus Hackathon is scheduled for this Friday at 10:00 AM in the SAC Hall.',
      markdownPayload:
        '### Upcoming Campus Events\n- **Campus Hackathon:** Friday, 10:00 AM @ Student Activity Center\n- **AI Workshop:** Saturday, 2:00 PM @ Auditorium B',
    };
  }

  // 5. Communication Agent (Fallback / General)
  return {
    agentName: 'Communication Agent',
    spokenText:
      'This voice agent is active. Activating Communication Agent... There is one urgent alert: the main campus library will close early today at 6:00 PM for maintenance.',
    markdownPayload: '📢 **Campus Notification:** Main Library closing early at 6:00 PM today for IT maintenance.',
  };
}
