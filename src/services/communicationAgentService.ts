import communicationData from '../data/communicationData.json';

export interface AnnouncementItem {
  id: string;
  title: string;
  category: string;
  priority: string;
  timestamp: string;
  postedBy: string;
  readCount: number;
  isBookmarked: boolean;
  content: string;
  aiSummary: string[];
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  officeLocation: string;
  status: 'Available' | 'Busy' | 'In Class' | 'In Meeting' | 'Offline' | 'Available Soon';
  statusNote: string;
  nextAvailableTime: string;
  officeHours: string;
  waitingCount: number;
  availableSlots: string[];
}

export interface AppointmentRecord {
  id: string;
  facultyId: string;
  facultyName: string;
  studentName: string;
  department: string;
  year: string;
  section: string;
  reason: string;
  requestedTime: string;
  status: 'Waiting' | 'Accepted' | 'Rescheduled' | 'Completed' | 'Rejected';
  queuePosition: number;
  estimatedWaitMinutes: number;
  createdTimestamp: string;
}

/**
 * AI Announcement Bullet Point Summarizer
 */
export function summarizeNotice(content: string): string[] {
  if (content.length < 50) return [content];

  const sentences = content.split('. ').filter((s) => s.trim().length > 0);
  return sentences.map((s, idx) => `Key Action ${idx + 1}: ${s.trim()}${s.endsWith('.') ? '' : '.'}`);
}

/**
 * AI Regional Language Translator Simulation
 */
export function translateNotice(
  content: string,
  targetLang: 'English' | 'Hindi' | 'Telugu'
): string {
  if (targetLang === 'Hindi') {
    return `[हिंदी अनुवाद]: ${content.replace('commence on', 'शुरू होगी').replace('commence', 'प्रारंभ').replace('Examination', 'परीक्षा')}`;
  }
  if (targetLang === 'Telugu') {
    return `[తెలుగు అనువాదం]: ${content.replace('commence on', 'ప్రారంభమవుతుంది').replace('Examination', 'పరీక్షలు')}`;
  }
  return content;
}

/**
 * AI Department Routing Predictor for Student Grievances
 */
export function predictGrievanceDepartment(description: string): string {
  const desc = description.toLowerCase();
  if (desc.includes('wifi') || desc.includes('net') || desc.includes('laptop') || desc.includes('portal')) return 'Campus IT Infrastructure Cell';
  if (desc.includes('hostel') || desc.includes('room') || desc.includes('water') || desc.includes('mess')) return 'Hostel Administration & Chief Warden Office';
  if (desc.includes('exam') || desc.includes('marks') || desc.includes('grade') || desc.includes('hall ticket')) return 'Controller of Examinations Cell';
  if (desc.includes('bus') || desc.includes('shuttle') || desc.includes('transport')) return 'Campus Transport Division';
  if (desc.includes('fee') || desc.includes('scholarship') || desc.includes('challan')) return 'Finance & Accounts Department';
  return 'General Student Welfare Cell';
}

/**
 * AI Smart Search across Notices, Faculty, Clubs, and Class Discussions
 */
export function searchCommunicationHub(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) {
    return {
      notices: communicationData.announcements as AnnouncementItem[],
      faculty: communicationData.facultyMembers as FacultyMember[],
    };
  }

  const notices = (communicationData.announcements as AnnouncementItem[]).filter(
    (a) => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
  );

  const faculty = (communicationData.facultyMembers as FacultyMember[]).filter(
    (f) => f.name.toLowerCase().includes(q) || f.department.toLowerCase().includes(q) || f.officeLocation.toLowerCase().includes(q)
  );

  return { notices, faculty };
}
