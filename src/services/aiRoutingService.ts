import { supabase } from '../lib/supabaseClient';
import type { StudentAuthRecord } from './authService';

export interface SpatialGisTarget {
  building: string;
  floor: string;
  room_number: string;
  lab_code: string;
  lab_name: string;
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

    // 1. SPATIAL GIS LOCATION QUERY
    if (lower.includes('where') || lower.includes('location') || lower.includes('room') || lower.includes('next lab') || lower.includes('find')) {
      const keyword = this.parseLabKeyword(prompt);

      let target: SpatialGisTarget = {
        building: 'Admin Block',
        floor: 'Floor 2',
        room_number: 'CL-12',
        lab_code: 'LAB-OS-201',
        lab_name: `${keyword} Laboratory`,
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
          };
        }
      } catch (e) {
        console.warn('[AI ROUTER] Supabase timetable query fallback:', e);
      }

      // Emit custom spatial GIS event to sync map & agent badge
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('zeno:spatial_gis_trigger', {
            detail: target,
          })
        );
      }

      return {
        agentBadge: '[AGENT: SPATIAL_GIS_ENGINE]',
        summary: `📍 **Spatial Indoor GIS Routing Resolved**\n\n- **Target Location:** **${target.lab_name}** (${target.room_number})\n- **Building & Floor:** **${target.building}, ${target.floor}**\n- **Student:** ${user.name} (\`${user.roll_number}\`, ${user.department_code}-${user.section})\n\nThe interactive campus map has been synchronized to highlight your route to **${target.room_number}**.`,
        gisTarget: target,
      };
    }

    // 2. PREDICTIVE BUNK / ATTENDANCE ENGINE QUERY
    if (lower.includes('bunk') || lower.includes('skip') || lower.includes('miss class') || lower.includes('can i miss')) {
      const attended = user.attended_classes || 101.5;
      const total = user.total_classes || 140;
      const bunkAnalysis = this.calculateBunkImpact(attended, total);

      return {
        agentBadge: '[AGENT: ACADEMIC_DS]',
        summary: `⚠️ **Predictive Bunk & Attendance Risk Telemetry**\n\n- **Student:** ${user.name} (\`${user.roll_number}\`)\n- **Current Attendance:** **${bunkAnalysis.currentAttendance}%** (${attended}/${total} classes)\n- **Projected Attendance if Missed:** **${bunkAnalysis.newAttendance}%** (${attended}/${total + 1} classes)\n- **Risk Status:** **${bunkAnalysis.riskStatus}**\n\n**Recommendation:** ${bunkAnalysis.recommendation}`,
        bunkAnalysis,
      };
    }

    // 3. TIMETABLE QUERY
    if (lower.includes('timetable') || lower.includes('schedule') || lower.includes('class today')) {
      return {
        agentBadge: '[AGENT: ACADEMIC_DS]',
        summary: `📅 **Section ${user.section} Timetable Schedule**\n\n- **09:00 AM - 10:00 AM:** Operating Systems (Lecture Hall A-201)\n- **10:00 AM - 12:00 PM:** OS Laboratory (Admin Block Floor 2, CL-12)\n- **01:00 PM - 02:00 PM:** Machine Learning (Lecture Hall A-201)\n- **02:00 PM - 04:00 PM:** Web Development Lab (Admin Block Floor 2, CL-14)`,
      };
    }

    // 4. DEFAULT ACADEMIC TELEMETRY
    return {
      agentBadge: '[AGENT: ACADEMIC_DS]',
      summary: `📊 **Academic Standing & Attendance Telemetry**\n\n- **Student:** ${user.name} (\`${user.roll_number}\`)\n- **Department:** ${user.department_name} (${user.department_code}-${user.section})\n- **CGPA:** **${user.cgpa}** (0 Active Backlogs)\n- **Attendance:** **${user.attendance_percentage}%** (${user.attended_classes}/${user.total_classes} classes attended)`,
    };
  }
}

export const aiRoutingService = new AiRoutingService();
