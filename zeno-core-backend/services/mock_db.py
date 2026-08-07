"""
Mock Data Fixtures for Zeno Autonomous Campus Governance Engine.
Contains Alex Rivera student profile, Placement Drives, Campus GIS, Timetable, Peer Directory, and Notices.
"""

STUDENT_PROFILE = {
    "user_id": "2451-22-733-001",
    "name": "Alex Rivera",
    "roll_no": "2451-22-733-001",
    "department": "CSE",
    "year": "3rd Year",
    "semester": 6,
    "cgpa": 8.84,
    "attendance_percentage": 72.5,
    "total_classes_conducted": 160,
    "total_classes_attended": 116,
    "active_backlogs": 0,
    "skills": ["Python", "React", "FastAPI", "Data Structures & Algorithms", "Machine Learning", "TailwindCSS"],
    "target_roles": ["AI Engineer", "Backend Developer"],
    "resume_text": """
    Alex Rivera - Full Stack & AI Enthusiast
    Email: alex.rivera@campus.edu | Phone: +91 9876543210
    
    EDUCATION:
    B.Tech in Computer Science & Engineering - GPA: 8.84 / 10.0 (3rd Year)
    
    SKILLS:
    Languages: Python, JavaScript, TypeScript, C++
    Frameworks: React, FastAPI, Node.js, PyTorch, LangChain
    Databases: PostgreSQL, MongoDB, Qdrant
    Tools: Git, Docker, Linux, VS Code
    
    PROJECTS:
    1. Zeno Campus Platform: Autonomous multi-agent governance platform built with React, Vite, and FastAPI.
    2. Smart Resume Ranker: NLP powered resume evaluation model using transformer embeddings.
    
    CERTIFICATIONS:
    - AWS Certified Cloud Practitioner
    - Deep Learning Specialization (Coursera)
    """
}

PLACEMENT_DRIVES = [
    {
        "id": "drive_google_2026",
        "company": "Google",
        "role": "Software Development Engineer - I",
        "min_cgpa": 8.5,
        "max_backlogs": 0,
        "allowed_branches": ["CSE", "ECE", "IT"],
        "ctc_lpa": 32.0,
        "status": "Registration Open",
        "deadline": "2026-08-15"
    },
    {
        "id": "drive_microsoft_2026",
        "company": "Microsoft",
        "role": "Software Engineer",
        "min_cgpa": 8.0,
        "max_backlogs": 0,
        "allowed_branches": ["CSE", "ECE", "EEE", "IT"],
        "ctc_lpa": 28.0,
        "status": "Registration Open",
        "deadline": "2026-08-20"
    },
    {
        "id": "drive_aws_2026",
        "company": "AWS",
        "role": "Cloud Solutions Architect",
        "min_cgpa": 7.5,
        "max_backlogs": 1,
        "allowed_branches": ["CSE", "ECE", "EEE", "MECH", "CIVIL"],
        "ctc_lpa": 24.0,
        "status": "Registration Open",
        "deadline": "2026-08-25"
    },
    {
        "id": "drive_swiggy_2026",
        "company": "Swiggy",
        "role": "Backend Engineer",
        "min_cgpa": 7.0,
        "max_backlogs": 2,
        "allowed_branches": ["CSE", "IT", "ECE"],
        "ctc_lpa": 18.0,
        "status": "Registration Open",
        "deadline": "2026-08-30"
    }
]

TIMETABLE_AND_GIS = {
    "OS Lab": {
        "building": "Admin Block",
        "floor": "Floor 2",
        "room": "Room CL-12",
        "coordinates": {"x": 340, "y": 180},
        "floorplan_path": "M 50 100 L 340 100 L 340 180 Z",
        "svg_nodes": [
            {"id": "entry_gate", "label": "Main Entrance", "x": 50, "y": 50},
            {"id": "admin_lobby", "label": "Admin Block Lobby", "x": 180, "y": 100},
            {"id": "cl_12", "label": "OS Lab (CL-12)", "x": 340, "y": 180}
        ],
        "time": "14:00 - 16:00 Mon/Wed"
    },
    "DBMS Lecture": {
        "building": "Tech Tower",
        "floor": "Floor 1",
        "room": "Hall TT-301",
        "coordinates": {"x": 210, "y": 90},
        "floorplan_path": "M 50 50 L 210 50 L 210 90 Z",
        "svg_nodes": [
            {"id": "entry_gate", "label": "Main Entrance", "x": 50, "y": 50},
            {"id": "tt_301", "label": "DBMS Lecture Hall (TT-301)", "x": 210, "y": 90}
        ],
        "time": "10:00 - 11:00 Tue/Thu"
    },
    "AI Systems Seminar": {
        "building": "R&D Hub",
        "floor": "Floor 3",
        "room": "Auditorium RD-A3",
        "coordinates": {"x": 500, "y": 320},
        "floorplan_path": "M 100 200 L 500 200 L 500 320 Z",
        "svg_nodes": [
            {"id": "rd_hub", "label": "R&D Entrance", "x": 100, "y": 200},
            {"id": "rd_a3", "label": "Auditorium (RD-A3)", "x": 500, "y": 320}
        ],
        "time": "11:30 - 13:00 Fri"
    }
}

STUDENT_DIRECTORY = [
    {
        "id": "std_002",
        "name": "Sarah Chen",
        "role": "Frontend Specialist",
        "skills": ["React", "TypeScript", "TailwindCSS", "Figma", "UI/UX"],
        "cgpa": 9.1,
        "availability": "Looking for Hackathon Team"
    },
    {
        "id": "std_003",
        "name": "Rohan Patel",
        "role": "Backend & Cloud Engineer",
        "skills": ["Go", "Docker", "Kubernetes", "PostgreSQL", "AWS"],
        "cgpa": 8.6,
        "availability": "Available"
    },
    {
        "id": "std_004",
        "name": "Aarav Sharma",
        "role": "Data Scientist & ML",
        "skills": ["Python", "PyTorch", "OpenCV", "Scikit-Learn"],
        "cgpa": 8.9,
        "availability": "Looking for AI Research Projects"
    }
]

ELECTIVE_COURSES = [
    {
        "code": "CSE-412",
        "title": "Deep Learning & Neural Networks",
        "workload": "Medium-High",
        "historical_avg_grade": "A-",
        "match_keywords": ["Python", "Machine Learning", "AI Engineer", "PyTorch"],
        "credits": 4
    },
    {
        "code": "CSE-418",
        "title": "Distributed Systems & Microservices",
        "workload": "High",
        "historical_avg_grade": "B+",
        "match_keywords": ["FastAPI", "Backend Developer", "Docker", "PostgreSQL"],
        "credits": 4
    },
    {
        "code": "CSE-425",
        "title": "Cloud Computing Architecture",
        "workload": "Medium",
        "historical_avg_grade": "A",
        "match_keywords": ["AWS", "DevOps", "Docker", "FastAPI"],
        "credits": 3
    }
]

CAMPUS_NOTICES = [
    {
        "id": "notice_001",
        "title": "CRITICAL: Semester Examination Time Table Released",
        "date": "2026-08-05",
        "priority": "Critical",
        "content": "All 3rd Year CSE students are hereby informed that the End-Sem Examinations commence on September 10, 2026. Practical exams start August 28, 2026. Hall tickets will be issued only to students with >= 75% attendance."
    },
    {
        "id": "notice_002",
        "title": "Hackathon 2026: Smart Campus Innovation Challenge",
        "date": "2026-08-06",
        "priority": "High",
        "content": "Registrations open for Smart Campus Innovation Hackathon. Event dates: August 28-30, 2026. Cash prizes up to $5,000. Team size 2-4 members."
    },
    {
        "id": "notice_003",
        "title": "Hostel Maintenance & Wi-Fi Upgrade",
        "date": "2026-08-04",
        "priority": "Medium",
        "content": "Wi-Fi access points in Block B Hostel will undergo maintenance on Saturday between 02:00 AM and 06:00 AM."
    }
]

KNOWLEDGE_DOCS = [
    {
        "id": "doc_os_unit3",
        "title": "Operating Systems - Unit 3: Process Synchronization & Deadlocks",
        "content": "Semaphores, Mutexes, and Banker's Algorithm. Banker's algorithm checks safe state by simulating resource allocation for maximum declared needs before granting requests. Avoidance versus prevention."
    },
    {
        "id": "doc_dbms_unit4",
        "title": "DBMS - Unit 4: Transaction Processing & Concurrency Control",
        "content": "ACID Properties, Two-Phase Locking (2PL), Serializability, and Isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable). Strict 2PL prevents cascading rollbacks."
    },
    {
        "id": "doc_placement_policy",
        "title": "Campus Placement Policy 2026",
        "content": "Students eligible for Placement Drives must maintain minimum 75% aggregate attendance and have no active backlogs for Tier-1 companies (Google, Microsoft). One student one job policy applies once an offer >= 15 LPA is accepted."
    }
]
