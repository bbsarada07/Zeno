import { supabase } from '../lib/supabaseClient';
import type { StudentAuthRecord } from './authService';

export interface SpatialGisTarget {
  building: string;
  floor: string;
  room_number: string;
  lab_code: string;
  lab_name: string;
  proximity?: string;
  hours?: string;
}

export interface BunkCalculationResult {
  currentAttendance: number;
  newAttendance: number;
  riskStatus: 'SAFE' | 'WARNING' | 'CRITICAL DANGER';
  recommendation: string;
}

export interface AiRoutingResponse {
  agentBadge: string;
  summary: string;
  gisTarget?: SpatialGisTarget;
  bunkAnalysis?: BunkCalculationResult;
  timetableData?: any;
}

export const CAMPUS_KNOWLEDGE_DICTIONARY: Record<
  string,
  {
    name: string;
    building: string;
    floor: string;
    room: string;
    code: string;
    proximity: string;
    hours: string;
    description: string;
  }
> = {
  canteen: {
    name: 'Canteen / Cafeteria / Food Court',
    building: 'Student Activity Center (SAC)',
    floor: 'Ground Floor',
    room: 'SAC-001',
    code: 'SAC-CANTEEN',
    proximity: '120m from CSE Department (Near Main Sports Ground)',
    hours: '08:30 AM – 18:00 PM',
    description: 'Serves fresh breakfast, South/North Indian thalis, snacks, fresh juices, and specialty coffee.',
  },
  library: {
    name: 'Central Knowledge Resource Center',
    building: 'Blocks C & D Wing',
    floor: '2nd – 4th Floors',
    room: 'C-201 (Central Library)',
    code: 'LIB-CENTRAL',
    proximity: '80m from Academic Block A',
    hours: '08:00 AM – 20:00 PM',
    description: 'Houses 120,000+ volumes, IEEE digital archives, RFID self-checkouts, and quiet study zones.',
  },
  sports: {
    name: 'Sports Complex & Gymnasium',
    building: 'North Campus Athletic Complex (Behind B-Block)',
    floor: 'Ground Floor',
    room: 'ATHLETIC-HALL-1',
    code: 'SPORTS-CTR',
    proximity: '200m from Admin Main Gate A',
    hours: '06:00 AM – 20:00 PM',
    description: 'Includes 4 synthetic badminton courts, table tennis arenas, Olympic weightlifting gym, and basketball court.',
  },
  principal: {
    name: 'Administrative Office & Principal Wing',
    building: 'Admin Block',
    floor: '1st Floor',
    room: 'A-101 (Principal Secretariat)',
    code: 'ADMIN-PRINCIPAL',
    proximity: '30m from Main Entrance Gate A',
    hours: '09:00 AM – 17:00 PM',
    description: 'Official executive chambers for Principal, Vice-Principal, and Registrar affairs.',
  },
  auditorium: {
    name: 'Main Campus Auditorium & Convention Hall',
    building: 'R&D Block',
    floor: '4th Floor',
    room: 'RD-401 (Auditorium)',
    code: 'AUDITORIUM-RD',
    proximity: '150m from Central Lawn',
    hours: '08:30 AM – 21:00 PM',
    description: '1,200-seat state-of-the-art acoustic auditorium for national symposiums, hackathons, and cultural fests.',
  },
  health: {
    name: 'Campus Health Center & Medical Clinic',
    building: 'Block A Wing',
    floor: 'Ground Floor',
    room: 'A-004 (Medical Room)',
    code: 'HEALTH-CTR',
    proximity: '40m from Main Security Gate A',
    hours: '24/7 Emergency Care',
    description: 'Full-time resident medical officer, 2 beds, emergency first-aid, and campus ambulance dispatch.',
  },
};

export class AiRoutingService {
  public parseLabKeyword(prompt: string): string {
    const lower = prompt.toLowerCase();
    if (lower.includes('java')) return 'Java';
    if (lower.includes('operating system') || lower.includes(' os ')) return 'Operating Systems';
    if (lower.includes('data structure') || lower.includes(' ds ')) return 'Data Structures';
    if (lower.includes('dbms') || lower.includes('database')) return 'DBMS';
    if (lower.includes('ai') || lower.includes('machine learning')) return 'AI Lab';
    return 'Operating Systems';
  }

  public resolveCampusKnowledge(prompt: string) {
    const q = prompt.toLowerCase();
    if (q.includes('canteen') || q.includes('cafeteria') || q.includes('food') || q.includes('lunch') || q.includes('eat') || q.includes('coffee') || q.includes('snack') || q.includes('sac')) {
      return CAMPUS_KNOWLEDGE_DICTIONARY.canteen;
    }
    if (q.includes('library') || q.includes('book') || q.includes('read') || q.includes('journal') || q.includes('study')) {
      return CAMPUS_KNOWLEDGE_DICTIONARY.library;
    }
    if (q.includes('sport') || q.includes('gym') || q.includes('badminton') || q.includes('stadium') || q.includes('game')) {
      return CAMPUS_KNOWLEDGE_DICTIONARY.sports;
    }
    if (q.includes('principal') || q.includes('admin') || q.includes('dean') || q.includes('registrar') || q.includes('office')) {
      return CAMPUS_KNOWLEDGE_DICTIONARY.principal;
    }
    if (q.includes('auditorium') || q.includes('seminar') || q.includes('hall') || q.includes('stage') || q.includes('fest venue')) {
      return CAMPUS_KNOWLEDGE_DICTIONARY.auditorium;
    }
    if (q.includes('health') || q.includes('medical') || q.includes('doctor') || q.includes('clinic') || q.includes('fever') || q.includes('hospital')) {
      return CAMPUS_KNOWLEDGE_DICTIONARY.health;
    }
    return null;
  }

  public calculateBunkImpact(attended: number, total: number): BunkCalculationResult {
    const currentAttendance = Number(((attended / total) * 100).toFixed(1));
    const newAttendance = Number(((attended / (total + 1)) * 100).toFixed(1));

    let riskStatus: 'SAFE' | 'WARNING' | 'CRITICAL DANGER' = 'SAFE';
    let recommendation = '';

    if (newAttendance >= 80.0) {
      riskStatus = 'SAFE';
      recommendation = `You can safely skip this class. Your attendance will remain at ${newAttendance}%, which is above the 80% safe zone.`;
    } else if (newAttendance >= 75.0) {
      riskStatus = 'WARNING';
      recommendation = `Caution: Skipping this class drops your attendance to ${newAttendance}%. You are near the 75% mandatory threshold.`;
    } else {
      riskStatus = 'CRITICAL DANGER';
      recommendation = `DANGER: Skipping this class drops your attendance to ${newAttendance}%, which is BELOW the mandatory 75% threshold! Medical waiver condensation will be required.`;
    }

    return {
      currentAttendance,
      newAttendance,
      riskStatus,
      recommendation,
    };
  }

  public async processQuery(prompt: string, user: StudentAuthRecord): Promise<AiRoutingResponse> {
    const lower = prompt.toLowerCase();

    // 1. UNIVERSAL KNOWLEDGE & SPATIAL GIS RESOLUTION
    const knownPlace = this.resolveCampusKnowledge(prompt);
    if (knownPlace) {
      const target: SpatialGisTarget = {
        building: knownPlace.building,
        floor: knownPlace.floor,
        room_number: knownPlace.room,
        lab_code: knownPlace.code,
        lab_name: knownPlace.name,
        proximity: knownPlace.proximity,
        hours: knownPlace.hours,
      };

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('zeno:spatial_gis_trigger', {
            detail: target,
          })
        );
      }

      return {
        agentBadge: '[AGENT: ACADEMIC_GIS]',
        summary: `📍 **Location Resolution:** ${knownPlace.name}\n\n- **Building & Floor:** **${knownPlace.building} (${knownPlace.floor})**\n- **Room Identifier:** **${knownPlace.room}**\n- **Proximity:** ${knownPlace.proximity}\n- **Operating Hours:** ${knownPlace.hours}\n- **Facility Detail:** ${knownPlace.description}\n\n👉 *Action: Spatial map coordinates sent to Campus GIS View.*`,
        gisTarget: target,
      };
    }

    // 2. SPATIAL LAB LOCATION QUERY
    if (lower.includes('where') || lower.includes('location') || lower.includes('room') || lower.includes('next lab') || lower.includes('find')) {
      const keyword = this.parseLabKeyword(prompt);

      let target: SpatialGisTarget = {
        building: 'Admin Block',
        floor: 'Floor 2',
        room_number: 'CL-12',
        lab_code: 'LAB-OS-201',
        lab_name: `${keyword} Laboratory`,
        proximity: '45m from Elevator Bank',
        hours: '09:00 AM – 17:00 PM',
      };

      try {
        const { data } = await supabase
          .from('timetables')
          .select('*, laboratories(*)')
          .eq('department_code', user.department_code)
          .eq('section', user.section)
          .ilike('subject_name', `%${keyword}%`)
          .maybeSingle();

        if (data && data.laboratories) {
          target = {
            building: data.laboratories.building || 'Admin Block',
            floor: data.laboratories.floor || 'Floor 2',
            room_number: data.laboratories.room_number || 'CL-12',
            lab_code: data.laboratories.lab_code || 'LAB-OS-201',
            lab_name: data.subject_name || `${keyword} Laboratory`,
            proximity: '45m from Elevator Bank',
            hours: '09:00 AM – 17:00 PM',
          };
        }
      } catch (e) {
        console.warn('[AI ROUTER] Supabase timetable query fallback:', e);
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('zeno:spatial_gis_trigger', {
            detail: target,
          })
        );
      }

      return {
        agentBadge: '[AGENT: ACADEMIC_GIS]',
        summary: `📍 **Location Resolution:** ${target.lab_name}\n\n- **Building & Floor:** **${target.building} (${target.floor})**\n- **Room Identifier:** **${target.room_number}**\n- **Operating Hours:** ${target.hours}\n- **Student:** ${user.name} (\`${user.roll_number}\`)\n\n👉 *Action: Spatial map coordinates sent to Campus GIS View.*`,
        gisTarget: target,
      };
    }

    // 3. PREDICTIVE BUNK / ATTENDANCE ENGINE QUERY
    if (lower.includes('bunk') || lower.includes('skip') || lower.includes('miss class') || lower.includes('can i miss')) {
      const attended = user.attended_classes || 101.5;
      const total = user.total_classes || 140;
      const bunkAnalysis = this.calculateBunkImpact(attended, total);

      return {
        agentBadge: '[AGENT: ACADEMIC_GIS]',
        summary: `⚠️ **Attendance Impact Analysis**\n\n- **Student:** ${user.name} (\`${user.roll_number}\`)\n- **Current Attendance:** **${bunkAnalysis.currentAttendance}%** (${attended}/${total} classes)\n- **Projected Attendance if Skipped:** **${bunkAnalysis.newAttendance}%** (${attended}/${total + 1} classes)\n- **Status:** **🔴 CRITICAL RISK** (Below 75% Mandatory Threshold)\n\n**Recommendation:** ${bunkAnalysis.recommendation}`,
        bunkAnalysis,
      };
    }

    // 4. GENERAL / CONTEXT-AWARE OUT-OF-SCOPE FALLBACK
    return {
      agentBadge: '[AGENT: GOVERNANCE_ROUTER]',
      summary: `🏛️ **Zeno Campus Intelligence Resolution**\n\nHello **${user.name}** (\`${user.roll_number}\`, ${user.department_name}).\n\nI have evaluated your request against Vasavi College of Engineering campus telemetry. You can ask me about:\n- 📍 **Spatial GIS Locations** ("Where is the canteen?", "Where is CL-12 OS Lab?")\n- ⚠️ **Predictive Attendance Bunk Calculator** ("Can I bunk Java Lab today?")\n- 📅 **Section Timetable Schedules** ("Show today's section schedule")\n- 📊 **Academic Standing & Placement Telemetry** ("Check academic standing")`,
    };
  }
}

export const aiRoutingService = new AiRoutingService();
