import { executeCentralOrchestrator } from './zenoOrchestrator';

export interface VoiceDispatchResponse {
  agentName: string;
  spokenText: string;
  markdownPayload?: string;
}

export async function processVoiceDispatchAsync(userQuery: string): Promise<VoiceDispatchResponse> {
  const result = await executeCentralOrchestrator({
    message: userQuery,
    inputMode: 'voice',
  });

  return {
    agentName: result.agentBadgeLabel,
    spokenText: result.speechText,
    markdownPayload: result.markdown,
  };
}

export function processVoiceDispatch(userQuery: string): VoiceDispatchResponse {
  // Sync fallback calling classification synchronously
  const q = userQuery.toLowerCase().trim();

  if (q.includes('placement') || q.includes('internship') || q.includes('resume') || q.includes('ats')) {
    return {
      agentName: 'Placement Agent',
      spokenText: 'Activating Placement Agent... I have selected top verified tech internship portals and ATS resume analysis tools.',
      markdownPayload: '### Placement & Internships\n• **TechCorp:** SDE Intern\n• **Innovate Labs:** UI Engineer Intern',
    };
  }

  if (q.includes('hackathon') || q.includes('event') || q.includes('workshop')) {
    return {
      agentName: 'Events Agent',
      spokenText: 'Activating Events Agent... The Annual Campus AI Hackathon is open for registration.',
      markdownPayload: '### Campus Events\n- **Campus Hackathon:** Friday, 10:00 AM @ SAC Hall',
    };
  }

  if (q.includes('where') || q.includes('ece') || q.includes('csm') || q.includes('block')) {
    return {
      agentName: 'Campus GPS Agent',
      spokenText: 'Activating Campus GPS Agent... ECE Block is 240 meters walking distance from your current location.',
      markdownPayload: '### Campus GPS Navigation\n- **Target:** ECE Block (Floor 1)',
    };
  }

  return {
    agentName: 'Academic Agent',
    spokenText: `Activating Academic Agent... Processing query for ${userQuery}`,
    markdownPayload: `### Academic Coursework\nProcessing: "${userQuery}"`,
  };
}
