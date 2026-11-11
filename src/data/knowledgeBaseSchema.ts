export type SheetTabName =
  | 'Personal_Details'
  | 'Work_Experience'
  | 'Technical_Skills'
  | 'Projects'
  | 'Articles'
  | 'Social_Links'
  | 'FAQs';

export interface SheetColumnDef {
  key: 'id' | 'title' | 'content' | 'url' | 'active';
  purpose: string;
}

export interface SheetTabSchema {
  number: string;
  name: SheetTabName;
  subtitle: string;
  description: string;
  columns: SheetColumnDef[];
}

export const MASTER_SPREADSHEET_TITLE = 'Portfolio_Knowledge_Base';

const STANDARD_RAG_COLUMNS: SheetColumnDef[] = [
  {
    key: 'id',
    purpose: 'Unique, stable row ID (never reuse or change an existing ID)',
  },
  {
    key: 'title',
    purpose: 'Optional title shown as the source citation',
  },
  {
    key: 'content',
    purpose: 'Complete, standalone fact used verbatim as context by the AI chatbot',
  },
  {
    key: 'url',
    purpose: 'Optional source citation link (GitHub, LinkedIn, Live Demo, etc.)',
  },
  {
    key: 'active',
    purpose: 'TRUE or FALSE (set to FALSE to retire a fact without deleting the row)',
  },
];

export const PORTFOLIO_SHEETS_SCHEMA: SheetTabSchema[] = [
  {
    number: '01',
    name: 'Personal_Details',
    subtitle: 'Identity, introduction, education & career goals',
    description:
      'Standalone biographical facts about Suraj Kumar Yadav, his education at KIIT, location, and engineering focus.',
    columns: STANDARD_RAG_COLUMNS,
  },
  {
    number: '02',
    name: 'Work_Experience',
    subtitle: 'Employment, roles, systems built & outcomes',
    description:
      'Standalone employment records detailing roles, responsibilities, production systems, and measurable impact.',
    columns: STANDARD_RAG_COLUMNS,
  },
  {
    number: '03',
    name: 'Technical_Skills',
    subtitle: 'Languages, frameworks, AI/ML & architecture expertise',
    description:
      'Complete, standalone explanations of Suraj’s technical skills and how he applies them in production and open-source projects.',
    columns: STANDARD_RAG_COLUMNS,
  },
  {
    number: '04',
    name: 'Projects',
    subtitle: 'Projects (latest first), architecture, stack & outcomes',
    description:
      'Comprehensive standalone facts for each project (ordered with latest projects on top), covering problem, solution, stack, and links.',
    columns: STANDARD_RAG_COLUMNS,
  },
  {
    number: '05',
    name: 'Articles',
    subtitle: 'Published technical articles, blogs & essays',
    description:
      'Standalone summaries and key takeaways of Suraj’s published articles and technical posts with source URLs.',
    columns: STANDARD_RAG_COLUMNS,
  },
  {
    number: '06',
    name: 'Social_Links',
    subtitle: 'Official social profiles, GitHub, LinkedIn & DevOrbit',
    description:
      'Verified profile links and contact channels for Suraj Kumar Yadav and the DevOrbit community.',
    columns: STANDARD_RAG_COLUMNS,
  },
  {
    number: '07',
    name: 'FAQs',
    subtitle: 'Predefined visitor questions & verified standalone answers',
    description:
      'High-frequency questions paired with complete, self-contained answers for the portfolio AI chatbot.',
    columns: STANDARD_RAG_COLUMNS,
  },
];

export interface SheetRecord {
  id: string;
  title: string;
  content: string;
  url: string;
  active: 'TRUE' | 'FALSE' | string;
  [key: string]: string;
}

export type PortfolioKnowledgeBaseData = Record<SheetTabName, SheetRecord[]>;

export const DEFAULT_PORTFOLIO_KNOWLEDGE_BASE: PortfolioKnowledgeBaseData = {
  Personal_Details: [
    {
      id: 'PER001',
      title: 'Suraj Kumar Yadav — Biography & Current Role',
      content:
        'Suraj Kumar Yadav is a Software Engineer based in Bhubaneswar, Odisha, India (currently at Spotline, Inc.) with 1+ year of hands-on industry experience designing, developing, and deploying scalable full-stack web systems, distributed backends, and Agentic AI applications in production environments. He is also the founder of DevOrbit, an open developer and open-source community.',
      url: 'https://knowsuraj.ai.studio/',
      active: 'TRUE',
    },
    {
      id: 'PER002',
      title: 'Education — KIIT Deemed University',
      content:
        'Suraj Kumar Yadav graduated from Kalinga Institute of Industrial Technology (KIIT Deemed University) in Bhubaneswar, India, with a Bachelor of Technology (B.Tech) in Computer Science and Engineering, achieving a CGPA of 8.35 / 10.0. He has also served as a General Volunteer in the National Service Scheme (NSS) since 2022 and holds AWS Academy Cloud Foundations and Cognite Game v4.5 certifications.',
      url: 'https://knowsuraj.ai.studio/',
      active: 'TRUE',
    },
    {
      id: 'PER003',
      title: 'Contact Information & Career Availability',
      content:
        'Suraj Kumar Yadav is open to Software Engineer opportunities, including roles in distributed systems, full-stack engineering, Applied/Agentic AI, and Google Payments. He speaks English and Hindi and can be reached directly via email at thesuraj396@gmail.com, by phone at +91 9508998437, or on LinkedIn at linkedin.com/in/surajyadav01.',
      url: 'https://linkedin.com/in/surajyadav01',
      active: 'TRUE',
    },
  ],

  Work_Experience: [
    {
      id: 'EXP001',
      title: 'Software Engineer at Spotline, Inc. (May 2025 – Present)',
      content:
        'Suraj Kumar Yadav has served as a full-time Software Engineer at Spotline, Inc. in Bhubaneswar since May 2025. Within his first year, he led 3 end-to-end production systems: (1) VAssureAI (V-Assure ScriptGen Extension), an AI-powered Chrome Extension (MV3) and FastAPI/Groq backend that automates compliance test script generation for Veeva Vault; (2) DB-Compare, a high-performance cross-database validation platform; and (3) a production-grade Agentic-RAG system built with LangGraph, MongoDB Atlas Vector Search, and Redis that achieves sub-45ms cache-hit latency and integrates with Microsoft Teams.',
      url: 'https://linkedin.com/in/surajyadav01',
      active: 'TRUE',
    },
    {
      id: 'EXP002',
      title: 'Salesforce Development Intern at SmartInternz (May 2024 – June 2024)',
      content:
        'Suraj Kumar Yadav worked as a Salesforce Development Intern at SmartInternz from May 2024 to June 2024, where he engineered custom Apex triggers, asynchronous batch jobs, SOQL queries, and automated CRM workflows that reduced manual data intervention by 30%.',
      url: 'https://linkedin.com/in/surajyadav01',
      active: 'TRUE',
    },
  ],

  Technical_Skills: [
    {
      id: 'SK001',
      title: 'Python & FastAPI Backend Engineering',
      content:
        'Suraj Kumar Yadav is an advanced Python and FastAPI engineer (3+ years in Python, 2+ years in FastAPI). He uses Python and FastAPI to architect high-throughput asynchronous REST APIs, Server-Sent Events (SSE) streaming pipelines, Pydantic schema validation, OAuth2/JWT authentication, local speech-to-text pipelines (EVEE with faster-whisper), and open-source CLI utilities published on PyPI (ZipIgnore).',
      url: 'https://github.com/Thesuraj01',
      active: 'TRUE',
    },
    {
      id: 'SK002',
      title: 'Agentic AI, LangGraph, LLM Orchestration & Deterministic Agent Hooks',
      content:
        'Suraj Kumar Yadav specializes in Agentic AI and LLM orchestration using LangGraph, LiteLLM, Groq (Llama 8B/70B, Qwen 3), Google Gemini, and Claude Code / GitHub Copilot hooks. He builds stateful multi-agent workflows, hybrid BM25 + Vector RAG systems, tree-leaf persistent memory architectures (Aiden), and deterministic safety gate hooks that physically block unapproved AI file edits (Jira Fixer).',
      url: 'https://github.com/TheSuraj01/Jira-Ticket-Fixer',
      active: 'TRUE',
    },
    {
      id: 'SK003',
      title: 'React, TypeScript, Next.js, Tailwind CSS & Three.js Frontend Architecture',
      content:
        'Suraj Kumar Yadav builds production-grade frontend applications using React 19, TypeScript, Next.js, Vue.js 3, Vite, Tailwind CSS, Zustand, and Three.js/WebGL. His frontend work includes this interactive Retro Developer Console portfolio, the DevOrbit community platform (/devorbit), real-time 3D WebGL talking avatars with viseme lip-sync (TalkingHead 3D), and Manifest V3 Chrome Extensions (VAssureAI).',
      url: 'https://knowsuraj.ai.studio/devorbit',
      active: 'TRUE',
    },
    {
      id: 'SK004',
      title: 'Node.js, Express & Real-Time Streaming Systems',
      content:
        'Suraj Kumar Yadav uses Node.js (18+) and Express.js to build zero-dependency developer CLI/IDE plugins (Jira Fixer), real-time WebSocket and Server-Sent Events (SSE) servers, Microsoft Edge Neural TTS audio/viseme streaming gateways (TalkingHead 3D), and collaborative web backends (Travel Together).',
      url: 'https://github.com/Thesuraj01',
      active: 'TRUE',
    },
    {
      id: 'SK005',
      title: 'Databases, Vector Search & Caching (PostgreSQL, MongoDB Atlas, Redis, FAISS)',
      content:
        'Suraj Kumar Yadav designs hybrid transactional and vector data layers using PostgreSQL, MongoDB, MongoDB Atlas Vector Search, Redis (achieving sub-45ms semantic cache-hit latency in enterprise RAG pipelines), FAISS vector indexes, Pinecone, and TimescaleDB.',
      url: 'https://github.com/Thesuraj01',
      active: 'TRUE',
    },
    {
      id: 'SK006',
      title: 'Cloud, DevOps, Deep Learning & Security (Docker, AWS, GKE, OAuth 2.0, JWT)',
      content:
        'Suraj Kumar Yadav deploys containerized systems with Docker, Docker Compose, Google Kubernetes Engine (GKE), AWS (Bedrock, EKS), Kafka, and Celery. He implements OAuth 2.0, JWT bearer tokens, Role-Based Access Control (RBAC), token encryption, and SSO, and has trained deep learning computer vision ensembles in TensorFlow/Keras and PyTorch (VGG16, ResNet50, InceptionV3, EfficientNet for MeDict AI).',
      url: 'https://github.com/Thesuraj01',
      active: 'TRUE',
    },
  ],

  Projects: [
    {
      id: 'PRJ008',
      title: 'Jira Fixer (Jira-Ticket-Fixer) — Claude Code & GitHub Copilot Safety Gate Plugin',
      content:
        'Jira Fixer (github.com/TheSuraj01/Jira-Ticket-Fixer) is Suraj Kumar Yadav’s latest open-source, MIT-licensed plugin for Claude Code and GitHub Copilot in VS Code, built with Node.js 18+ and zero dependencies. It solves the problem of AI coding agents confidently editing 14 unrelated files when pointed at a Jira ticket: Jira Fixer investigates the ticket via Atlassian MCP, proposes a minimal "At a glance" plan (problem, cause, fix, files, risk), and uses a deterministic Node.js hook to physically block file edits until the developer clicks Approve. Once approved, edits are locked strictly to the approved file list, a failing regression test is written first, every acceptance criterion is verified, and Jira comments, commit messages, and PR descriptions are drafted automatically.',
      url: 'https://github.com/TheSuraj01/Jira-Ticket-Fixer',
      active: 'TRUE',
    },
    {
      id: 'PRJ001',
      title: 'EVEE — Offline-First Voice-Controlled PC Agent for Windows 11',
      content:
        'EVEE (github.com/TheSuraj01/EVEE) is an open-source, offline-first voice-controlled PC agent and personal development workspace hub for Windows 11 built by Suraj Kumar Yadav. Wake-word detection, int8-quantized faster-whisper speech-to-text on CPU, and 55+ command matching (with negation checks like "don’t close the window") run 100% locally with 1.6ms (p95) command-to-keypress matcher latency and a 3-tier local policy engine (allow/confirm/deny), plus optional Groq Qwen LLM fallback constrained to a strict JSON intent registry.',
      url: 'https://github.com/TheSuraj01/EVEE',
      active: 'TRUE',
    },
    {
      id: 'PRJ005',
      title: 'TalkingHead 3D — Real-Time 3D Avatar-as-a-Service for AI Chatbots',
      content:
        'TalkingHead 3D (talking-head-3-d.vercel.app) is an open-source real-time 3D Avatar-as-a-Service built by Suraj Kumar Yadav using Three.js, WebGL, Node.js, free Microsoft Edge Neural TTS, and Groq Qwen 3. It gives any AI chatbot a lifelike 3D talking face with synchronized viseme lip-sync, 8 emotional moods, 8 hand/body gestures, and dynamic camera framing controllable via a single REST call, Server-Sent Events (SSE), or iframe postMessage.',
      url: 'https://talking-head-3-d.vercel.app',
      active: 'TRUE',
    },
    {
      id: 'PRJ003',
      title: 'VAssureAI (V-Assure ScriptGen Extension) — Enterprise AI Test Script Generator',
      content:
        'VAssureAI (V-Assure ScriptGen Extension) is an enterprise AI-powered compliance test script generator for Veeva Vault architected by Suraj Kumar Yadav at Spotline, Inc. Built with a Manifest V3 Chrome Extension frontend and an asynchronous Python FastAPI + Groq LLM backend secured with OAuth2/JWT, it extracts requirement context from the DOM and generates structured, audit-ready validation test scripts in seconds.',
      url: 'https://github.com/Thesuraj01',
      active: 'TRUE',
    },
    {
      id: 'PRJ004',
      title: 'Aiden — Emotionally Intelligent AI Companion with Tree-Leaf Persistent Memory',
      content:
        'Aiden is an emotionally intelligent AI companion engineered by Suraj Kumar Yadav using Python, FastAPI, React, FAISS vector search, and Groq (Llama 8B/70B). It features a hierarchical tree-leaf persistent memory architecture, 11-dimension emotion detection with intensity scoring, and non-blocking autonomous background reflection threads that consolidate long-term personal memory with zero latency impact on live chat.',
      url: 'https://github.com/Thesuraj01',
      active: 'TRUE',
    },
    {
      id: 'PRJ002',
      title: 'Travel Together — Collaborative Community Trip & Itinerary Planner',
      content:
        'Travel Together is a collaborative group trip planning and itinerary coordination web platform built by Suraj Kumar Yadav with React, TypeScript, Tailwind CSS, Node.js, Express, and WebSockets. Featured in the DevOrbit community showcase, it enables friends, hackathon teams, and developer communities to propose destinations, vote on stops, split expenses, and synchronize travel schedules in real time.',
      url: 'https://github.com/Thesuraj01',
      active: 'TRUE',
    },
    {
      id: 'PRJ006',
      title: 'ZipIgnore — Automated Python Packaging CLI Utility on PyPI',
      content:
        'ZipIgnore (pypi.org/project/ZipIgnore) is an open-source Python CLI utility created by Suraj Kumar Yadav and published on the official Python Package Index (PyPI). It packages clean, reproducible project ZIP archives in one command while automatically excluding virtual environments (.venv), node_modules, __pycache__, and gitignore-matched build artifacts.',
      url: 'https://pypi.org/project/ZipIgnore/',
      active: 'TRUE',
    },
    {
      id: 'PRJ007',
      title: 'MeDict AI — Deep Learning Lung Cancer Diagnostic System (81% Accuracy)',
      content:
        'MeDict AI (github.com/TheSuraj01/MeDict) is a deep learning medical imaging diagnostic system built by Suraj Kumar Yadav using Python, TensorFlow, Keras, and Streamlit. It achieves 81% accuracy in detecting pulmonary nodules from chest CT scans using a fine-tuned VGG16 convolutional neural network cross-verified against ResNet50, InceptionV3, and EfficientNet ensembles, reducing diagnostic screening review time from 5 minutes to 10 seconds.',
      url: 'https://github.com/TheSuraj01/MeDict',
      active: 'TRUE',
    },
  ],

  Articles: [
    {
      id: 'ART004',
      title: 'Introducing Jira Fixer: Deterministic Approval Gate for Claude Code & GitHub Copilot',
      content:
        'In his November 2026 LinkedIn post (https://lnkd.in/p/dwywzxc5), Suraj Kumar Yadav introduced Jira Fixer, an open-source plugin for Claude Code and GitHub Copilot in VS Code (https://github.com/TheSuraj01/Jira-Ticket-Fixer). The article explains how AI coding agents often edit 14 unrequested files when fixing a Jira bug, and how Jira Fixer solves this with a zero-dependency Node.js 18+ hook that physically blocks file edits until the developer approves a minimal "At a glance" plan (problem, cause, fix, files, risk), enforces writing a failing regression test first, and drafts the Jira comment, commit message, and PR description.',
      url: 'https://lnkd.in/p/dwywzxc5',
      active: 'TRUE',
    },
    {
      id: 'ART001',
      title: 'Traveling: The Best Way to Learn About Life',
      content:
        'In his LinkedIn Pulse article "Traveling: The Best Way to Learn About Life", Suraj Kumar Yadav reflects on how stepping outside familiar comfort zones and engaging with diverse cultures, histories, and people builds adaptability, empathy, and resilience—making travel one of life’s greatest teachers.',
      url: 'https://www.linkedin.com/pulse/traveling-best-way-learn-life-suraj-kumar-yadav-sy4hc',
      active: 'TRUE',
    },
    {
      id: 'ART002',
      title: 'The Digital Facade: How Wealthy Individuals Manipulate Public Perception Using Social Media',
      content:
        'In his LinkedIn Pulse article "The Digital Facade: How Wealthy Individuals Manipulate Public Perception Using Social Media", Suraj Kumar Yadav analyzes how public figures strategically curate social media narratives on platforms like Instagram, X/Twitter, and LinkedIn to shape public opinion, and emphasizes the importance of digital media literacy.',
      url: 'https://www.linkedin.com/pulse/digital-facade-how-wealthy-individuals-manipulate-public-yadav-uetqc',
      active: 'TRUE',
    },
    {
      id: 'ART003',
      title: 'Chandrayaan 3: Unveiling the Triumph of Truth and Our Cosmic Love Story',
      content:
        'In his LinkedIn Pulse article "Chandrayaan 3: Unveiling the Triumph of Truth and Our Cosmic Love Story", Suraj Kumar Yadav celebrates ISRO’s historic lunar south pole landing, highlighting how rigorous failure analysis and engineering perseverance transformed a prior setback into a landmark scientific triumph for India.',
      url: 'https://www.linkedin.com/pulse/chandrayaan-3-unveiling-triumph-truth-our-cosmic-love-yadav',
      active: 'TRUE',
    },
  ],

  Social_Links: [
    {
      id: 'SOC001',
      title: 'GitHub — @Thesuraj01',
      content:
        'Suraj Kumar Yadav’s official GitHub profile is https://github.com/Thesuraj01, where he maintains open-source repositories including Jira Fixer (Jira-Ticket-Fixer), EVEE, TalkingHead 3D, ZipIgnore, and MeDict AI.',
      url: 'https://github.com/Thesuraj01',
      active: 'TRUE',
    },
    {
      id: 'SOC002',
      title: 'LinkedIn — Suraj Kumar Yadav (@surajyadav01)',
      content:
        'Suraj Kumar Yadav’s official LinkedIn profile is https://linkedin.com/in/surajyadav01, where he shares software engineering updates, open-source launches like Jira Fixer, and published LinkedIn Pulse articles.',
      url: 'https://linkedin.com/in/surajyadav01',
      active: 'TRUE',
    },
    {
      id: 'SOC003',
      title: 'Personal Engineering Portfolio — knowsuraj.ai.studio',
      content:
        'Suraj Kumar Yadav’s interactive Retro Developer Console portfolio website is hosted at https://knowsuraj.ai.studio/, featuring his projects, work experience, arcade mini-games, and AI Assistant companion.',
      url: 'https://knowsuraj.ai.studio/',
      active: 'TRUE',
    },
    {
      id: 'SOC004',
      title: 'DevOrbit Open Developer Community — /devorbit',
      content:
        'DevOrbit ("Discover. Build. Collaborate. Grow.") is an independent open-source developer community founded by Suraj Kumar Yadav, accessible at https://knowsuraj.ai.studio/devorbit.',
      url: 'https://knowsuraj.ai.studio/devorbit',
      active: 'TRUE',
    },
    {
      id: 'SOC005',
      title: 'PyPI — ZipIgnore Package',
      content:
        'Suraj Kumar Yadav’s published Python CLI packaging utility ZipIgnore is available on the official Python Package Index (PyPI) at https://pypi.org/project/ZipIgnore/.',
      url: 'https://pypi.org/project/ZipIgnore/',
      active: 'TRUE',
    },
  ],

  FAQs: [
    {
      id: 'FAQ001',
      title: 'Tell me about Suraj Kumar Yadav.',
      content:
        'Suraj Kumar Yadav is a Software Engineer at Spotline, Inc. based in Bhubaneswar, India, and a B.Tech Computer Science graduate from KIIT Deemed University (CGPA: 8.35/10.0). He specializes in scalable full-stack web applications, distributed backends, and Agentic AI systems using Python, FastAPI, React, TypeScript, Node.js, and LangGraph, and is the founder of the DevOrbit open developer community.',
      url: 'https://knowsuraj.ai.studio/',
      active: 'TRUE',
    },
    {
      id: 'FAQ007',
      title: 'What is Jira Fixer and how does it work?',
      content:
        'Jira Fixer (https://github.com/TheSuraj01/Jira-Ticket-Fixer) is Suraj Kumar Yadav’s latest open-source plugin for Claude Code and GitHub Copilot in VS Code (Node.js 18+, zero dependencies, MIT license). It investigates a Jira ticket via Atlassian MCP, presents a minimal "At a glance" plan (problem, cause, fix, files, risk), and uses a deterministic hook to physically block file edits until the developer clicks Approve. It then restricts edits to the approved file list, writes a failing regression test first, and drafts the Jira comment, commit message, and PR description.',
      url: 'https://github.com/TheSuraj01/Jira-Ticket-Fixer',
      active: 'TRUE',
    },
    {
      id: 'FAQ002',
      title: 'What is EVEE?',
      content:
        'EVEE (https://github.com/TheSuraj01/EVEE) is an open-source, offline-first voice-controlled PC agent for Windows 11 built by Suraj Kumar Yadav. It uses int8-quantized faster-whisper on CPU for 100% local speech recognition, matches 55+ commands with 1.6ms (p95) latency including negation checks, and enforces a 3-tier local policy engine (allow/confirm/deny) with optional Groq/Qwen fallback.',
      url: 'https://github.com/TheSuraj01/EVEE',
      active: 'TRUE',
    },
    {
      id: 'FAQ003',
      title: 'Which AI models and frameworks has Suraj integrated?',
      content:
        'Suraj Kumar Yadav has integrated Groq LLMs (Llama 3 8B/70B, Qwen 3), Google Gemini models, Claude Code and GitHub Copilot agent hooks, LangGraph stateful multi-agent workflows, faster-whisper (int8 local CPU speech-to-text), FAISS and MongoDB Atlas vector search (sub-45ms Redis cache-hit latency), Microsoft Edge Neural TTS, and deep learning computer vision ensembles (VGG16, ResNet50, InceptionV3, EfficientNet).',
      url: 'https://github.com/Thesuraj01',
      active: 'TRUE',
    },
    {
      id: 'FAQ004',
      title: 'What was Suraj’s contribution to VAssureAI at Spotline, Inc.?',
      content:
        'At Spotline, Inc., Suraj Kumar Yadav architected VAssureAI (V-Assure ScriptGen Extension), an enterprise Chrome Extension (Manifest V3) and asynchronous FastAPI + Groq LLM backend that automatically extracts requirement context and generates compliant validation test scripts for Veeva Vault.',
      url: 'https://linkedin.com/in/surajyadav01',
      active: 'TRUE',
    },
    {
      id: 'FAQ005',
      title: 'How does Suraj implement authentication, security, and agent safety?',
      content:
        'Suraj Kumar Yadav implements OAuth 2.0, JWT bearer authentication, Role-Based Access Control (RBAC), token encryption, and Single Sign-On (SSO) across his backend services, alongside deterministic local policy engines (EVEE) and physical edit-blocking approval hooks (Jira Fixer) for AI agents.',
      url: 'https://github.com/TheSuraj01/Jira-Ticket-Fixer',
      active: 'TRUE',
    },
    {
      id: 'FAQ006',
      title: 'How can I contact or hire Suraj Kumar Yadav?',
      content:
        'Suraj Kumar Yadav is open to Software Engineer opportunities (including Google Payments, full-stack, and Applied AI roles). You can contact him via email at thesuraj396@gmail.com, phone at +91 9508998437, or LinkedIn at https://linkedin.com/in/surajyadav01.',
      url: 'https://linkedin.com/in/surajyadav01',
      active: 'TRUE',
    },
  ],
};

interface IndexedChunk {
  id: string;
  tab: SheetTabName;
  title: string;
  content: string;
  url: string;
  normalizedSearchable: string;
  baseBoost: number;
}

const TAB_BOOST: Record<SheetTabName, number> = {
  FAQs: 3.0,
  Projects: 2.5,
  Work_Experience: 2.0,
  Technical_Skills: 2.0,
  Personal_Details: 2.0,
  Articles: 1.5,
  Social_Links: 1.2,
};

const indexedKnowledgeCache = new WeakMap<PortfolioKnowledgeBaseData, IndexedChunk[]>();

function isRowActive(row: SheetRecord): boolean {
  const activeVal = String(row.active ?? 'TRUE').trim().toUpperCase();
  return activeVal !== 'FALSE' && activeVal !== '0' && activeVal !== 'NO';
}

function getIndexedChunks(kbData: PortfolioKnowledgeBaseData): IndexedChunk[] {
  const cached = indexedKnowledgeCache.get(kbData);
  if (cached) return cached;

  const indexed: IndexedChunk[] = [];
  for (const schemaTab of PORTFOLIO_SHEETS_SCHEMA) {
    const tabName = schemaTab.name;
    const rows = kbData[tabName] || [];
    const baseBoost = TAB_BOOST[tabName] || 1;

    rows.filter(isRowActive).forEach((row) => {
      const id = row.id || tabName;
      const title = row.title || '';
      const content = row.content || '';
      const url = row.url || '';
      indexed.push({
        id,
        tab: tabName,
        title,
        content,
        url,
        normalizedSearchable: `${id} ${title} ${content} ${url}`.toLowerCase(),
        baseBoost,
      });
    });
  }

  indexedKnowledgeCache.set(kbData, indexed);
  return indexed;
}

/**
 * Retrieve top-K active rows across the 7 knowledge base categories (`Personal_Details`,
 * `Work_Experience`, `Technical_Skills`, `Projects`, `Articles`, `Social_Links`, `FAQs`).
 * Rows with `active === 'FALSE'` are retired and automatically excluded.
 * Returns each matched row's `content` verbatim along with its `[tab | id | title | url]` citation.
 */
export function retrieveKnowledgeForQuery(
  query: string,
  kbData: PortfolioKnowledgeBaseData = DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
  topK = 8
): string {
  const tokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);

  const indexedChunks = getIndexedChunks(kbData);

  const scored = indexedChunks.map((chunk) => ({
    chunk,
    score: scoreNormalizedText(chunk.normalizedSearchable, tokens) + chunk.baseBoost,
  }));

  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, Math.max(1, topK));

  return selected
    .map(({ chunk }) => {
      const citationParts = [chunk.tab, chunk.id, chunk.title, chunk.url]
        .filter(Boolean)
        .join(' | ');
      return `[${citationParts}]\n${chunk.content}`;
    })
    .join('\n\n');
}

function scoreNormalizedText(normalizedHaystack: string, queryTokens: string[]): number {
  if (queryTokens.length === 0) return 1;
  let score = 0;
  for (const token of queryTokens) {
    if (normalizedHaystack.includes(token)) {
      score += token.length >= 4 ? 3 : 1.5;
    }
  }
  return score;
}
