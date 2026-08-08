import React, { useState } from 'react';
import {
  BookOpen,
  Upload,
  FileText,
  CheckCircle2,
  Sparkles,
  Zap,
  Brain,
  Layers,
  Award,
  AlertTriangle,
  RotateCcw,
  BookMarked,
  Calendar,
  HelpCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  FileCheck,
  Search,
} from 'lucide-react';
import type { StudyDocument, TopicProficiency, ExamPredictorTopic, FlashcardItem, QuizQuestionItem, StudyPlanDay } from '../../types';

const INITIAL_DOCUMENTS: StudyDocument[] = [
  {
    id: 'doc-1',
    filename: 'Data_Structures_Notes.pdf',
    sizeMb: 3.2,
    pageCount: 142,
    uploadTimestamp: 'Today, 09:30 AM',
    chunkCount: 42,
    status: 'ready',
    fileType: 'pdf',
  },
  {
    id: 'doc-2',
    filename: 'Question_Paper_2025.pdf',
    sizeMb: 1.8,
    pageCount: 8,
    uploadTimestamp: 'Today, 09:32 AM',
    chunkCount: 12,
    status: 'ready',
    fileType: 'pdf',
  },
];

const INITIAL_PROFICIENCY: TopicProficiency[] = [
  { id: 'top-1', topicName: 'Arrays & Vectors', scorePct: 92, statusLevel: 'MASTERED', color: '#10B981', subtopics: ['Contiguous Allocation', '2D Matrix Traversal'] },
  { id: 'top-2', topicName: 'Linked Lists & Stacks', scorePct: 78, statusLevel: 'LEARNING', color: '#00F0FF', subtopics: ['Doubly Linked', 'Skip Lists', 'Stack Operations'] },
  { id: 'top-3', topicName: 'Trees & BST Rotations', scorePct: 41, statusLevel: 'WEAK', color: '#F59E0B', subtopics: ['AVL Balance Factor', 'RR & LR Rotations', 'B-Trees'] },
  { id: 'top-4', topicName: 'Graph Traversals (BFS/DFS)', scorePct: 28, statusLevel: 'CRITICAL DANGER', color: '#F43F5E', subtopics: ['Adjacency Matrix', 'Cycle Detection', 'Dijkstra'] },
];

const INITIAL_EXAM_PREDICTOR: ExamPredictorTopic[] = [
  { id: 'pred-1', topicName: 'Trees & AVL Rotations', ratingStars: 5, appearancesCount: 3, avgMarks: 10, predictedPriority: 'Critical' },
  { id: 'pred-2', topicName: 'Graph Traversals (BFS/DFS)', ratingStars: 5, appearancesCount: 2, avgMarks: 8, predictedPriority: 'Critical' },
  { id: 'pred-3', topicName: 'Dynamic Programming & Recurrence', ratingStars: 4, appearancesCount: 1, avgMarks: 5, predictedPriority: 'High' },
  { id: 'pred-4', topicName: 'Hash Tables & Open Addressing', ratingStars: 3, appearancesCount: 1, avgMarks: 4, predictedPriority: 'Medium' },
];

const SAMPLE_QUIZ: QuizQuestionItem = {
  id: 'q-avl-rotations',
  topic: 'Trees & BST Rotations',
  question: 'What is the balance factor threshold for an AVL Tree node before a rotation is required?',
  options: [
    { label: 'A', text: '0', isCorrect: false },
    { label: 'B', text: '± 1', isCorrect: false },
    { label: 'C', text: 'Greater than +1 or less than -1', isCorrect: true },
    { label: 'D', text: 'Always 2', isCorrect: false },
  ],
  explanation: 'In an AVL Tree, balance factor = height(left) - height(right). If balance factor is > +1 or < -1, the node is unbalanced and requires rotation.',
};

const SAMPLE_FLASHCARDS: FlashcardItem[] = [
  {
    id: 'fc-1',
    topic: 'Trees & BST',
    questionFront: 'What is the worst-case time complexity for searching in an unbalanced Binary Search Tree?',
    answerBack: 'O(n) — occurs when the tree degenerates into a linear linked list structure.',
    sourceCitation: 'Data_Structures_Notes.pdf | Page 32 | Section: BST Complexity',
  },
  {
    id: 'fc-2',
    topic: 'AVL Rotations',
    questionFront: 'When is a Left-Right (LR) rotation performed in an AVL tree?',
    answerBack: 'When a node is inserted into the right subtree of the left child of an unbalanced node.',
    sourceCitation: 'Data_Structures_Notes.pdf | Page 48 | Section: AVL Rotations',
  },
];

const INITIAL_STUDY_PLAN: StudyPlanDay[] = [
  { dayNumber: 1, title: 'Trees & AVL Rotations', priorityStars: 5, topics: ['AVL Insertions', 'Single & Double Rotations', 'BST In-Order'], isWeaknessFocus: true },
  { dayNumber: 2, title: 'Graph Traversals (BFS & DFS)', priorityStars: 5, topics: ['Adjacency Matrix', 'Cycle Detection', 'Dijkstra'], isWeaknessFocus: false },
  { dayNumber: 3, title: 'Dynamic Programming', priorityStars: 4, topics: ['Memoization', 'Knapsack 0/1', 'LCS'], isWeaknessFocus: false },
  { dayNumber: 4, title: 'Full Mock Assessment & Flashcards', priorityStars: 4, topics: ['Active Recall Flashcards', '2025 Past Paper Practice'], isWeaknessFocus: false },
];

export const AcademicStudyEnclave: React.FC = () => {
  const [documents, setDocuments] = useState<StudyDocument[]>(INITIAL_DOCUMENTS);
  const [proficiency, setProficiency] = useState<TopicProficiency[]>(INITIAL_PROFICIENCY);
  const [examPredictor] = useState<ExamPredictorTopic[]>(INITIAL_EXAM_PREDICTOR);
  const [studyPlan, setStudyPlan] = useState<StudyPlanDay[]>(INITIAL_STUDY_PLAN);

  // Upload Loader State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStepIndex, setUploadStepIndex] = useState(0);

  // Quiz State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Flashcard State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Auto-adapt Notification State
  const [adaptNotice, setAdaptNotice] = useState<string | null>(null);

  // Seed Demo Data Button Handler
  const handleSeedDemoData = () => {
    setIsUploading(true);
    setUploadStepIndex(0);

    const steps = [
      'Uploading files...',
      'Parsing Text / OCR Engine...',
      'Vector Chunking (54 Chunks)...',
      'Generating Embeddings (text-embedding-004)...',
      'Indexing Ready ✓',
    ];

    steps.forEach((_, idx) => {
      setTimeout(() => {
        setUploadStepIndex(idx);
        if (idx === steps.length - 1) {
          setIsUploading(false);
          setDocuments(INITIAL_DOCUMENTS);
        }
      }, (idx + 1) * 450);
    });
  };

  // Custom File Drop Handler Simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStepIndex(0);

    const steps = [
      `Uploading ${file.name}...`,
      'Parsing Text & Structural Layout...',
      'Splitting into 512-token Overlapping Chunks...',
      'Generating Dense Embeddings via Gemini API...',
      'Qdrant Vector Database Indexing Complete ✓',
    ];

    steps.forEach((_, idx) => {
      setTimeout(() => {
        setUploadStepIndex(idx);
        if (idx === steps.length - 1) {
          setIsUploading(false);
          const newDoc: StudyDocument = {
            id: `doc-${Date.now()}`,
            filename: file.name,
            sizeMb: Number((file.size / (1024 * 1024)).toFixed(1)) || 1.5,
            pageCount: 24,
            uploadTimestamp: 'Just Now',
            chunkCount: 36,
            status: 'ready',
            fileType: file.name.endsWith('.pptx') ? 'pptx' : file.name.endsWith('.docx') ? 'docx' : 'pdf',
          };
          setDocuments((prev) => [newDoc, ...prev]);
        }
      }, (idx + 1) * 500);
    });
  };

  // Quiz Option Click Handler
  const handleSelectQuizOption = (label: string) => {
    if (quizSubmitted) return;
    setSelectedOption(label);
  };

  // Submit Quiz & Trigger Auto-Adaptation if Score Low
  const handleSubmitQuiz = () => {
    if (!selectedOption) return;
    setQuizSubmitted(true);

    const isCorrect = SAMPLE_QUIZ.options.find((o) => o.label === selectedOption)?.isCorrect;

    if (!isCorrect) {
      // Trigger Auto-Adaptation message
      setAdaptNotice(
        '⚠️ You struggled with AVL Tree Rotations (41%). Automatically shifting Trees & AVL Rotations to Day 1 of your Adaptive Study Plan.'
      );

      // Update study plan to prioritize Trees & AVL Rotations
      setStudyPlan((prev) =>
        prev.map((day) =>
          day.dayNumber === 1 ? { ...day, isWeaknessFocus: true, priorityStars: 5 } : day
        )
      );

      // Update Topic Proficiency
      setProficiency((prev) =>
        prev.map((p) => (p.topicName.includes('Trees') ? { ...p, scorePct: 41, statusLevel: 'WEAK' } : p))
      );
    } else {
      setProficiency((prev) =>
        prev.map((p) => (p.topicName.includes('Trees') ? { ...p, scorePct: 75, statusLevel: 'LEARNING' } : p))
      );
    }
  };

  const uploadStepsLabels = [
    'Uploading File',
    'Parsing Text / OCR',
    'Vector Chunking',
    'Generating Embeddings',
    'Indexing Ready',
  ];

  return (
    <div className="space-y-6 font-sans select-none text-slate-100 pb-8">
      {/* Top Header Banner */}
      <div className="zeno-glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-white">Academic Study Enclave</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                [AGENT: ACADEMIC_STUDY_ENCLAVE]
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Grounded Document RAG • Understanding Score • Exam Predictor • Active Recall Flashcards
            </p>
          </div>
        </div>

        <button
          onClick={handleSeedDemoData}
          disabled={isUploading}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all flex items-center space-x-2 shrink-0 disabled:opacity-50"
        >
          <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
          <span>⚡ Load Demo Dataset (Data Structures)</span>
        </button>
      </div>

      {/* Auto-Adapt Trigger Alert Notice Banner */}
      {adaptNotice && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center justify-between animate-fadeIn shadow-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{adaptNotice}</span>
          </div>
          <button onClick={() => setAdaptNotice(null)} className="text-xs text-slate-400 hover:text-white underline">
            Dismiss
          </button>
        </div>
      )}

      {/* MAIN 4-MODULE GRID WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: MODULE A (RAG & Upload) & MODULE B (Proficiency & Knowledge Graph) */}
        <div className="lg:col-span-7 space-y-6">
          {/* ------------------------------------------------------------- */}
          {/* MODULE A: Universal Document Intelligence & RAG Pipeline */}
          {/* ------------------------------------------------------------- */}
          <div className="zeno-glass-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Module A: Universal Document Intelligence & Vector RAG</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                QDRANT INDEX READY
              </span>
            </div>

            {/* Dropzone Component */}
            <div className="relative border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 rounded-2xl p-6 text-center bg-slate-950/60 transition-all cursor-pointer">
              <input
                type="file"
                accept=".pdf,.pptx,.docx,.png,.jpg"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-200">
                  Drag & Drop Course Documents, Syllabi, Notes, or Question Papers
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Supports .pdf, .pptx, .docx, .png, .jpg</div>
              </div>
            </div>

            {/* Multi-Stage Upload Processing Loader */}
            {isUploading && (
              <div className="p-4 rounded-xl bg-slate-900 border border-purple-500/40 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-purple-300 font-bold">
                  <span className="flex items-center space-x-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                    <span>{uploadStepsLabels[uploadStepIndex]}</span>
                  </span>
                  <span>{((uploadStepIndex + 1) * 20)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${(uploadStepIndex + 1) * 20}%` }}
                  />
                </div>
              </div>
            )}

            {/* Indexed Documents List */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-400 font-bold">Active Vector Index Documents ({documents.length}):</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center space-x-2 truncate">
                      <BookMarked className="w-4 h-4 text-purple-400 shrink-0" />
                      <div className="truncate">
                        <div className="font-bold text-white truncate">{doc.filename}</div>
                        <div className="text-[10px] text-slate-500">{doc.sizeMb} MB • {doc.chunkCount} Chunks</div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Grounded Citation Preview Badge */}
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-mono space-y-1">
              <div className="text-purple-300 font-bold flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Grounded RAG Citation Guardrail Active</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Sample Citation: <span className="text-cyan-300 font-bold">[Source: Data_Structures_Notes.pdf | Page 32 | Section: Binary Search Trees]</span>
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* MODULE B: Understanding Score & Interactive Knowledge Map */}
          {/* ------------------------------------------------------------- */}
          <div className="zeno-glass-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Module B: Understanding Score & Knowledge Map Widget</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">REALTIME TELEMETRY</span>
            </div>

            {/* Telemetry Gauge List */}
            <div className="space-y-3 font-mono">
              {proficiency.map((top) => (
                <div key={top.id} className="p-3 rounded-xl bg-slate-950 border border-slate-850 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{top.topicName}</span>
                    <span className="font-extrabold" style={{ color: top.color }}>
                      {top.scorePct}% ({top.statusLevel})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${top.scorePct}%`, backgroundColor: top.color }} />
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center space-x-2 pt-0.5">
                    <span>Subtopics:</span>
                    <span>{top.subtopics.join(' • ')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual SVG Knowledge Graph Node */}
            <div className="p-4 rounded-2xl bg-[#05070A] border border-slate-800 text-center space-y-2 relative overflow-hidden">
              <div className="text-xs font-mono text-slate-400 font-bold">Interactive Topic Knowledge Node Mesh</div>
              <svg viewBox="0 0 500 200" className="w-full h-40">
                {/* Connection Lines */}
                <line x1="250" y1="100" x2="100" y2="50" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="250" y1="100" x2="250" y2="40" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="250" y1="100" x2="400" y2="50" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="250" y1="100" x2="350" y2="160" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4 4" />

                {/* Central Parent Node */}
                <g transform="translate(250, 100)">
                  <circle r="24" fill="rgba(168,85,247,0.2)" stroke="#A855F7" strokeWidth="3" />
                  <text y="4" fill="#A855F7" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    DSA CORE
                  </text>
                </g>

                {/* Child Topic Nodes */}
                <g transform="translate(100, 50)">
                  <circle r="18" fill="rgba(16,185,129,0.2)" stroke="#10B981" strokeWidth="2" />
                  <text y="3" fill="#10B981" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    Arrays (92%)
                  </text>
                </g>

                <g transform="translate(250, 40)">
                  <circle r="18" fill="rgba(0,240,255,0.2)" stroke="#00F0FF" strokeWidth="2" />
                  <text y="3" fill="#00F0FF" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    LinkedLists (78%)
                  </text>
                </g>

                <g transform="translate(400, 50)">
                  <circle r="18" fill="rgba(245,158,11,0.2)" stroke="#F59E0B" strokeWidth="2" />
                  <text y="3" fill="#F59E0B" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    Trees (41%)
                  </text>
                </g>

                <g transform="translate(350, 160)">
                  <circle r="18" fill="rgba(244,63,94,0.2)" stroke="#F43F5E" strokeWidth="2" />
                  <text y="3" fill="#F43F5E" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    Graphs (28%)
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MODULE C (Exam Predictor) & MODULE D (Adaptive Study Planner, Quiz & Flashcards) */}
        <div className="lg:col-span-5 space-y-6">
          {/* ------------------------------------------------------------- */}
          {/* MODULE C: Exam Predictor & Past Question Paper Analyzer */}
          {/* ------------------------------------------------------------- */}
          <div className="zeno-glass-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Module C: Exam Question Predictor</span>
              </h3>
              <span className="text-[10px] font-mono text-amber-400 font-bold">2024-2025 CROSS-CORRELATED</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {examPredictor.map((pred) => (
                <div key={pred.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{pred.topicName}</div>
                    <div className="text-[10px] text-slate-400">
                      Tested {pred.appearancesCount}x • Avg {pred.avgMarks} Marks
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-400 font-bold">{'★'.repeat(pred.ratingStars)}</div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      {pred.predictedPriority}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mandatory Exam Predictor Notice Banner */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 italic text-center">
              *AI-generated study priority based on uploaded past papers, not guaranteed exam leak.*
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* MODULE D: Adaptive Study Planner & Interactive Flashcards/Quiz */}
          {/* ------------------------------------------------------------- */}
          <div className="zeno-glass-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Module D: Adaptive Study Planner & Flashcards</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">ACTIVE RECALL</span>
            </div>

            {/* Dynamic Day-by-Day Study Plan */}
            <div className="space-y-2 font-mono text-xs">
              <div className="font-bold text-slate-300">Adaptive 4-Day Exam Roadmap:</div>
              {studyPlan.map((day) => (
                <div
                  key={day.dayNumber}
                  className={`p-3 rounded-xl border transition-all ${
                    day.isWeaknessFocus
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>Day {day.dayNumber}: {day.title}</span>
                    <span className="text-amber-400">{'★'.repeat(day.priorityStars)}</span>
                  </div>
                  <div className="text-[10px] opacity-75 mt-1">{day.topics.join(' • ')}</div>
                </div>
              ))}
            </div>

            {/* Interactive UI Quiz Card Widget */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="font-bold text-purple-400 flex items-center space-x-1.5">
                  <HelpCircle className="w-4 h-4 text-purple-400" />
                  <span>Adaptive Quiz: {SAMPLE_QUIZ.topic}</span>
                </span>
                <span className="text-[10px] text-slate-500">Q1 of 1</span>
              </div>

              <div className="text-xs text-white font-bold">{SAMPLE_QUIZ.question}</div>

              <div className="space-y-1.5 text-xs">
                {SAMPLE_QUIZ.options.map((opt) => {
                  const isSelected = selectedOption === opt.label;
                  let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-purple-500/50';

                  if (quizSubmitted) {
                    if (opt.isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    else if (isSelected && !opt.isCorrect) btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold';
                  }

                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleSelectQuizOption(opt.label)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center space-x-2 ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-[10px] font-bold">
                        {opt.label}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={!selectedOption}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-40"
                >
                  Submit & Calculate Score
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div className="font-bold text-white">Explanation:</div>
                  <div>{SAMPLE_QUIZ.explanation}</div>
                </div>
              )}
            </div>

            {/* Flippable Active Recall Flashcard Widget */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="font-bold text-cyan-400 flex items-center space-x-1.5">
                  <RotateCcw className="w-4 h-4 text-cyan-400" />
                  <span>Active Recall Flashcard ({currentCardIndex + 1}/{SAMPLE_FLASHCARDS.length})</span>
                </span>
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 font-bold"
                >
                  {isFlipped ? 'Show Front' : 'Flip Card ↺'}
                </button>
              </div>

              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 min-h-[100px] flex flex-col justify-between cursor-pointer transition-all hover:border-cyan-500/40"
              >
                {!isFlipped ? (
                  <div>
                    <div className="text-[10px] text-cyan-400 font-bold uppercase mb-1">FRONT (QUESTION):</div>
                    <div className="text-xs text-white font-bold">{SAMPLE_FLASHCARDS[currentCardIndex].questionFront}</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1">BACK (ANSWER):</div>
                    <div className="text-xs text-emerald-200 font-bold">{SAMPLE_FLASHCARDS[currentCardIndex].answerBack}</div>
                    <div className="text-[9px] text-slate-500 mt-2 border-t border-slate-800 pt-1">
                      {SAMPLE_FLASHCARDS[currentCardIndex].sourceCitation}
                    </div>
                  </div>
                )}
              </div>

              {/* Spaced Repetition Buttons */}
              <div className="grid grid-cols-4 gap-1.5 text-[10px]">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentCardIndex((prev) => (prev + 1) % SAMPLE_FLASHCARDS.length);
                  }}
                  className="py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold"
                >
                  Again
                </button>
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentCardIndex((prev) => (prev + 1) % SAMPLE_FLASHCARDS.length);
                  }}
                  className="py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold"
                >
                  Hard
                </button>
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentCardIndex((prev) => (prev + 1) % SAMPLE_FLASHCARDS.length);
                  }}
                  className="py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold"
                >
                  Good
                </button>
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentCardIndex((prev) => (prev + 1) % SAMPLE_FLASHCARDS.length);
                  }}
                  className="py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold"
                >
                  Easy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
