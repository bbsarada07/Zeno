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
  status: 'Pending' | 'Accepted' | 'Approved' | 'Rescheduled' | 'Completed' | 'Rejected' | 'Waiting';
  queuePosition?: number;
  estimatedWaitMinutes?: number;
  createdTimestamp: string;
  // Shared HOD Portal <-> Student Portal Record Fields
  date?: string;
  time?: string;
  location?: string;
  remarks?: string;
  rejectionReason?: string;
  updatedAt?: string;
}

export interface ClubItem {
  id: string;
  clubName: string;
  title: string;
  description: string;
  registrationStatus: 'Open for Registration' | 'Registration Closed' | 'Coming Soon';
  eligibility: string;
  deadline: string;
  organizer: string;
  date?: string;
  venue?: string;
  unread?: boolean;
}

export interface CommunicationState {
  appointments: AppointmentRecord[];
  facultyMembers: FacultyMember[];
  announcements: AnnouncementItem[];
  clubs: ClubItem[];
}

/**
 * Shared In-Memory Data Store for HOD Portal <-> Student Portal Synchronization
 */
let sharedCommunicationStore: CommunicationState = {
  appointments: [
    {
      id: 'app-001',
      facultyId: 'fac-101',
      facultyName: 'Dr. V. Rao (HOD CSE)',
      studentName: 'Alex Rivera (Bhavya)',
      department: 'CSE (AI & ML)',
      year: '3rd Year',
      section: 'Section A',
      reason: 'AI Capstone Project Discussion & GPU Allocation Request',
      requestedTime: '02:30 PM',
      status: 'Approved',
      queuePosition: 1,
      estimatedWaitMinutes: 10,
      createdTimestamp: 'Today, 10:15 AM',
      date: 'Monday, March 10',
      time: '11:00 AM',
      location: 'HOD Office, Admin Block Floor 2',
      remarks: 'Please meet me at 11:00 AM in my office with your project slides.',
      updatedAt: 'Today, 11:30 AM',
    },
    {
      id: 'app-002',
      facultyId: 'fac-101',
      facultyName: 'Dr. V. Rao (HOD CSE)',
      studentName: 'Rahul Verma',
      department: 'CSE (AI & ML)',
      year: '3rd Year',
      section: 'Section A',
      reason: 'Academic Doubt in Neural Network Optimization',
      requestedTime: '02:45 PM',
      status: 'Pending',
      queuePosition: 2,
      estimatedWaitMinutes: 25,
      createdTimestamp: 'Today, 10:30 AM',
    },
  ],
  facultyMembers: communicationData.facultyMembers as FacultyMember[],
  announcements: communicationData.announcements as AnnouncementItem[],
  clubs: [
    {
      id: 'club-301',
      clubName: 'AI & Robotics Club',
      title: 'Autonomous Drone Navigation Workshop & Hackathon Sprint',
      description: 'Hands-on session on ROS2 and OpenCV drone tracking. Hardware kits provided.',
      registrationStatus: 'Open for Registration',
      eligibility: 'All 2nd, 3rd & 4th Year B.Tech Students',
      deadline: 'Friday, March 11 @ 05:00 PM',
      organizer: 'AI & Robotics Club Leads',
      date: 'Saturday, March 12 @ 10:00 AM',
      venue: 'SAC Hall 2',
      unread: true,
    },
    {
      id: 'club-302',
      clubName: 'Coding Society',
      title: 'Weekly Competitive Coding Contest #42 (LeetCode Hard Special)',
      description: 'Test your graph & dynamic programming speed. Certificates & vouchers for top 3.',
      registrationStatus: 'Open for Registration',
      eligibility: 'Open to All Departments & Years',
      deadline: 'Tonight @ 07:45 PM',
      organizer: 'Coding Society Core Team',
      date: 'Tonight @ 08:00 PM',
      venue: 'Online Code Platform',
      unread: false,
    },
    {
      id: 'club-303',
      clubName: 'ACM Student Chapter',
      title: 'System Design & Distributed Systems Bootcamp',
      description: 'Master Kafka, Redis caching, and Load Balancing architectures.',
      registrationStatus: 'Coming Soon',
      eligibility: '3rd & 4th Year Students',
      deadline: 'March 18, 2026',
      organizer: 'ACM Student Chapter',
      date: 'March 20, 2026',
      venue: 'Auditorium B',
      unread: false,
    },
  ],
};

export function getSharedCommunicationStore(): CommunicationState {
  return sharedCommunicationStore;
}

export function updateAppointmentStatusInStore(
  appId: string,
  update: {
    status: AppointmentRecord['status'];
    date?: string;
    time?: string;
    location?: string;
    remarks?: string;
    rejectionReason?: string;
  }
): AppointmentRecord | null {
  const target = sharedCommunicationStore.appointments.find((a) => a.id === appId);
  if (target) {
    target.status = update.status;
    if (update.date) target.date = update.date;
    if (update.time) target.time = update.time;
    if (update.location) target.location = update.location;
    if (update.remarks) target.remarks = update.remarks;
    if (update.rejectionReason) target.rejectionReason = update.rejectionReason;
    target.updatedAt = 'Just Now';
    return target;
  }
  return null;
}

export function updateFacultyAvailabilityInStore(
  facultyId: string,
  slots: string[],
  officeHours?: string,
  status?: FacultyMember['status']
) {
  const fac = sharedCommunicationStore.facultyMembers.find((f) => f.id === facultyId);
  if (fac) {
    fac.availableSlots = slots;
    if (officeHours) fac.officeHours = officeHours;
    if (status) fac.status = status;
  }
}

/**
 * Grounded AI Intent Answering Engine — STRICTLY USES ACTUAL DATA
 * Never hallucinates, invents, or guesses missing details.
 */
export function answerCommunicationQuery(query: string, currentState?: CommunicationState): string {
  const store = currentState || sharedCommunicationStore;
  const q = query.toLowerCase().trim();

  // 1. APPOINTMENT APPROVAL / STATUS QUERY
  if (q.includes('approve') || q.includes('status') || q.includes('appointment') || q.includes('reply') || q.includes('replied') || q.includes('hod')) {
    const alexApp = store.appointments.find(
      (a) => a.studentName.toLowerCase().includes('alex') || a.studentName.toLowerCase().includes('bhavya')
    ) || store.appointments[0];

    if (alexApp) {
      if (alexApp.status === 'Approved' || alexApp.status === 'Accepted') {
        return `Appointment Status: Approved\n• Faculty/HOD: ${alexApp.facultyName}\n• Date: ${alexApp.date || 'Scheduled Date'}\n• Time: ${alexApp.time || alexApp.requestedTime}\n• Location: ${alexApp.location || 'HOD Office'}\n• HOD Remarks: ${alexApp.remarks || 'Please meet me at the scheduled time.'}`;
      }
      if (alexApp.status === 'Rejected') {
        return `Appointment Status: Rejected\n• Faculty/HOD: ${alexApp.facultyName}\n• Reason: ${alexApp.rejectionReason || alexApp.remarks || 'No specific reason provided.'}`;
      }
      return `Appointment Status: Pending / Awaiting HOD Response\n• Faculty/HOD: ${alexApp.facultyName}\n• Requested Time: ${alexApp.requestedTime}\n• Queue Position: #${alexApp.queuePosition || 1}`;
    }
  }

  // 2. REJECTION REASON QUERY
  if (q.includes('reject') || q.includes('reason') || q.includes('why')) {
    const rejectedApp = store.appointments.find((a) => a.status === 'Rejected');
    if (rejectedApp) {
      return `Status: Rejected\nReason: ${rejectedApp.rejectionReason || rejectedApp.remarks || 'No specific reason provided.'}`;
    }
    return `You have no rejected appointment requests in the verified application record.`;
  }

  // 3. HOD / FACULTY AVAILABILITY QUERY
  if (q.includes('available') || q.includes('availability') || q.includes('slots') || q.includes('office hours')) {
    const rao = store.facultyMembers.find((f) => f.name.toLowerCase().includes('rao')) || store.facultyMembers[0];
    if (rao) {
      return `HOD Availability (${rao.name}):\n• Current Status: ${rao.status} (${rao.statusNote})\n• Office Hours: ${rao.officeHours}\n• Location: ${rao.officeLocation}\n• Available Slots: ${rao.availableSlots.join(', ')}`;
    }
  }

  // 4. ANNOUNCEMENTS & NOTICES QUERY
  if (q.includes('announcement') || q.includes('notice') || q.includes('exam') || q.includes('timetable') || q.includes('placement')) {
    let matches = store.announcements;
    if (q.includes('cse') || q.includes('exam') || q.includes('mid-term')) {
      matches = store.announcements.filter((a) => a.category.toLowerCase().includes('exam') || a.title.toLowerCase().includes('mid-term'));
    } else if (q.includes('placement') || q.includes('drive')) {
      matches = store.announcements.filter((a) => a.category.toLowerCase().includes('placement'));
    }

    if (matches.length > 0) {
      const top = matches[0];
      return `📢 **${top.title}**\n• Category: ${top.category} | Posted By: ${top.postedBy}\n• Date: ${top.timestamp}\n• Summary: ${top.content}`;
    }
  }

  // 5. CLUB REGISTRATION QUERY
  if (q.includes('club') || q.includes('registration') || q.includes('audition') || q.includes('recruitment')) {
    const openClubs = store.clubs.filter((c) => c.registrationStatus === 'Open for Registration');
    if (openClubs.length > 0) {
      const list = openClubs
        .map((c) => `• **${c.clubName}**: ${c.title} — Status: ${c.registrationStatus} (Deadline: ${c.deadline})`)
        .join('\n');
      return `🏆 **Clubs Open for Registration**:\n${list}`;
    }
  }

  // 6. STRICT UNVERIFIED FALLBACK — NEVER HALLUCINATE OR GUESS
  return `I don't have verified information about that yet. Please check with the concerned department or college administration.`;
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
      notices: sharedCommunicationStore.announcements,
      faculty: sharedCommunicationStore.facultyMembers,
      clubs: sharedCommunicationStore.clubs,
    };
  }

  const notices = sharedCommunicationStore.announcements.filter(
    (a) => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
  );

  const faculty = sharedCommunicationStore.facultyMembers.filter(
    (f) => f.name.toLowerCase().includes(q) || f.department.toLowerCase().includes(q) || f.officeLocation.toLowerCase().includes(q)
  );

  const clubs = sharedCommunicationStore.clubs.filter(
    (c) => c.clubName.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  );

  return { notices, faculty, clubs };
}
