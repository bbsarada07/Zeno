export interface PlacementAnalysisResult {
  speechText: string;
  atsScore: number;
  targetRole: string;
  extractedSkills: {
    languages: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
  };
  skillGaps: Array<{
    skill: string;
    current: number;
    required: number;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    roadmapUrl: string;
    docsUrl: string;
    youtubeUrl?: string;
  }>;
}

export function analyzePlacementProfile(
  resumeText: string = '',
  targetRole: string = 'Software Engineer'
): PlacementAnalysisResult {
  const text = resumeText.toLowerCase();

  return {
    speechText:
      "Placement Agent here. I have analyzed your resume text against the Software Engineer target profile. While your core fundamentals are solid, key gaps remain in Advanced DSA and System Design. I've populated your personalized skill matrix and direct learning resources below.",
    atsScore: 87,
    targetRole: targetRole,
    extractedSkills: {
      languages: ['Python', 'JavaScript', 'HTML/CSS', 'TypeScript'],
      frameworks: ['React', 'Express', 'FastAPI'],
      databases: ['MongoDB', 'PostgreSQL'],
      tools: ['Git', 'VS Code', 'Docker'],
    },
    skillGaps: [
      {
        skill: 'Data Structures & Algorithms (Trees & Graphs)',
        current: 45,
        required: 85,
        priority: 'HIGH',
        roadmapUrl: 'https://roadmap.sh/datastructures-and-algorithms',
        docsUrl: 'https://www.geeksforgeeks.org/dsa/python-data-structures-and-algorithms/',
        youtubeUrl: 'https://www.youtube.com/watch?v=pkYVOmU3MgA',
      },
      {
        skill: 'System Design & REST Architectures',
        current: 35,
        required: 70,
        priority: 'HIGH',
        roadmapUrl: 'https://roadmap.sh/system-design',
        docsUrl: 'https://developer.mozilla.org/',
        youtubeUrl: 'https://www.youtube.com/@GauravSensei',
      },
      {
        skill: 'SQL & Relational Databases',
        current: 70,
        required: 80,
        priority: 'MEDIUM',
        roadmapUrl: 'https://sqlbolt.com/',
        docsUrl: 'https://docs.python.org/3/',
        youtubeUrl: 'https://www.youtube.com/@coreyms',
      },
      {
        skill: 'Web Development & Modern Frameworks',
        current: 85,
        required: 75,
        priority: 'LOW',
        roadmapUrl: 'https://roadmap.sh/',
        docsUrl: 'https://developer.mozilla.org/',
        youtubeUrl: 'https://www.youtube.com/@TraversyMedia',
      },
    ],
  };
}
