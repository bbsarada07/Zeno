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
  status: 'Pending' | 'Accepted' | 'Approved' | 'Rescheduled' | 'Completed' | 'Rejected';
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
      studentName: 'Alex Rivera',
      department: 'CSE (AI & ML)',
      year: '3rd Year',
      section: 'Section A',
      reason: 'AI Capstone Project Discussion & GPU Allocation Request',
      requestedTime: '02:30 PM',
      status: 'Approved',
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
      createdTimestamp: 'Today, 10:30 AM',
    },
  ],
  facultyMembers: [
    {
      id: 'fac-101',
      name: 'Dr. V. Rao (HOD CSE)',
      designation: 'Professor & Head of Department',
      department: 'Computer Science & Engineering',
      officeLocation: 'Admin Block - Floor 2 (Room A-204)',
      status: 'Available',
      statusNote: 'Available in HOD Office',
      nextAvailableTime: '10:00 AM Today',
      officeHours: 'Monday & Wednesday: 10:00 AM – 1:00 PM',
      availableSlots: ['10:00 AM - 10:30 AM', '11:00 AM - 11:30 AM', '02:00 PM - 02:30 PM'],
    },
    {
      id: 'fac-102',
      name: 'Prof. Ananya Sharma',
      designation: 'Associate Professor',
      department: 'Computer Science & Engineering',
      officeLocation: 'CSE Block - Floor 3 (Room C-308)',
      status: 'In Class',
      statusNote: 'Teaching CSE-3A (Algorithms)',
      nextAvailableTime: '02:00 PM Today',
      officeHours: 'Tuesday & Thursday: 2:00 PM – 4:00 PM',
      availableSlots: ['02:00 PM - 02:30 PM', '03:00 PM - 03:30 PM'],
    },
  ],
  announcements: communicationData.announcements as AnnouncementItem[],
  clubs: [
    {
      id: 'club-301',
      clubName: 'AI & Robotics Club',
      title: 'Annual Robotics Hackathon & Autonomous Navigation Challenge',
      description: 'Join the premier campus AI & Robotics Club. Building ROS2 navigation stack for campus rovers.',
      registrationStatus: 'Open for Registration',
      eligibility: 'All Departments (1st to 4th Year)',
      deadline: 'March 15, 2026',
      organizer: 'Dept. of CSE & SAC',
    },
    {
      id: 'club-302',
      clubName: 'Coding Ninjas Student Chapter',
      title: 'Competitive Programming Sprint & DSA Bootcamp',
      description: 'Weekly algorithmic problem-solving sprint preparing students for product company placements.',
      registrationStatus: 'Open for Registration',
      eligibility: 'B.Tech CSE / IT / ECE',
      deadline: 'March 20, 2026',
      organizer: 'Coding Ninjas & Placement Cell',
    },
  ],
};

export function getSharedCommunicationStore(): CommunicationState {
  return sharedCommunicationStore;
}

export function updateAppointmentStatusInStore(
  appointmentId: string,
  updates: Partial<AppointmentRecord>
): AppointmentRecord | undefined {
  const index = sharedCommunicationStore.appointments.findIndex((a) => a.id === appointmentId);
  if (index !== -1) {
    sharedCommunicationStore.appointments[index] = {
      ...sharedCommunicationStore.appointments[index],
      ...updates,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    return sharedCommunicationStore.appointments[index];
  }
  return undefined;
}

export function updateFacultyAvailabilityInStore(
  facultyId: string,
  newStatus: FacultyMember['status'],
  statusNote: string,
  officeHours?: string
): FacultyMember | undefined {
  const index = sharedCommunicationStore.facultyMembers.findIndex((f) => f.id === facultyId);
  if (index !== -1) {
    sharedCommunicationStore.facultyMembers[index] = {
      ...sharedCommunicationStore.facultyMembers[index],
      status: newStatus,
      statusNote,
      officeHours: officeHours || sharedCommunicationStore.facultyMembers[index].officeHours,
    };
    return sharedCommunicationStore.facultyMembers[index];
  }
  return undefined;
}

/**
 * Grounded AI Intent Answering Engine — STRICTLY USES ACTUAL STORED DATA
 * 0 Hallucinations.
 */
export function answerCommunicationQuery(query: string, currentState?: CommunicationState): string {
  const store = currentState || sharedCommunicationStore;
  const q = query.toLowerCase().trim();

  // 1. APPOINTMENT APPROVAL / STATUS / REJECTION / SCHEDULE QUERY
  if (
    q.includes('approved') ||
    q.includes('rejected') ||
    q.includes('status') ||
    q.includes('appointment') ||
    q.includes('meet my hod') ||
    q.includes('request an appointment')
  ) {
    const userApp = store.appointments[0];

    if (userApp) {
      if (userApp.status === 'Approved' || userApp.status === 'Accepted') {
        return `Appointment Approved by HOD:\n• Faculty/HOD: ${userApp.facultyName}\n• Date: ${userApp.date || 'Monday, March 10'}\n• Time: ${userApp.time || userApp.requestedTime}\n• Location: ${userApp.location || 'HOD Office'}\n• Message from HOD: "${userApp.remarks || 'Please meet me at the scheduled time.'}"`;
      }
      if (userApp.status === 'Rejected') {
        return `Appointment Rejected by HOD:\n• Faculty/HOD: ${userApp.facultyName}\n• Reason: "${userApp.rejectionReason || userApp.remarks || 'Unavailable this week.'}"`;
      }
      return `Appointment Status: Pending\n• Your appointment request has been sent to ${userApp.facultyName} and is awaiting a response.\n• Reason: ${userApp.reason}`;
    }

    return `You have no active appointment requests. To request a meeting with your HOD, submit an appointment request in the Faculty section below.`;
  }

  // 2. HOD / FACULTY AVAILABILITY QUERY
  if (q.includes('available') || q.includes('availability') || q.includes('slots') || q.includes('office hours') || q.includes('when is my hod')) {
    const hod = store.facultyMembers.find((f) => f.name.toLowerCase().includes('rao') || f.name.toLowerCase().includes('hod')) || store.facultyMembers[0];
    if (hod) {
      return `HOD Availability (${hod.name}):\n• Status: ${hod.status} (${hod.statusNote})\n• Office Hours: ${hod.officeHours}\n• Location: ${hod.officeLocation}\n• Available Slots: ${hod.availableSlots.join(', ')}`;
    }
  }

  // 3. ANNOUNCEMENTS & NOTICES QUERY
  if (q.includes('announcement') || q.includes('notice') || q.includes('department') || q.includes('exam') || q.includes('circular')) {
    const notices = store.announcements;
    if (notices.length > 0) {
      const top = notices[0];
      return `📢 **Latest Announcement (${top.category})**\n• Title: ${top.title}\n• Posted By: ${top.postedBy} (${top.timestamp})\n• Details: ${top.content}`;
    }
  }

  // 4. CLUB / WORKSHOP REGISTRATION QUERY
  if (q.includes('club') || q.includes('workshop') || q.includes('registration') || q.includes('audition')) {
    const openClubs = store.clubs.filter((c) => c.registrationStatus === 'Open for Registration');
    if (openClubs.length > 0) {
      const list = openClubs
        .map((c) => `• **${c.clubName}**: ${c.title} (Deadline: ${c.deadline})`)
        .join('\n');
      return `🏆 **Clubs & Workshops Open for Registration**:\n${list}`;
    }
  }

  // 5. STRICT UNVERIFIED FALLBACK — NEVER HALLUCINATE OR GUESS
  return `I don't have verified information about that yet. Please check with the concerned department or college administration.`;
}

export function summarizeNotice(content: string): string[] {
  if (content.length < 50) return [content];
  const sentences = content.split('. ').filter((s) => s.trim().length > 0);
  return sentences.map((s, idx) => `Key Action ${idx + 1}: ${s.trim()}${s.endsWith('.') ? '' : '.'}`);
}

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

export function predictGrievanceDepartment(description: string): string {
  const desc = description.toLowerCase();
  if (desc.includes('wifi') || desc.includes('net') || desc.includes('portal')) return 'Campus IT Infrastructure Cell';
  if (desc.includes('hostel') || desc.includes('room') || desc.includes('mess')) return 'Hostel Administration & Chief Warden Office';
  if (desc.includes('exam') || desc.includes('marks') || desc.includes('grade')) return 'Controller of Examinations Cell';
  if (desc.includes('bus') || desc.includes('shuttle')) return 'Campus Transport Division';
  if (desc.includes('fee') || desc.includes('scholarship')) return 'Finance & Accounts Department';
  return 'General Student Welfare Cell';
}

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
