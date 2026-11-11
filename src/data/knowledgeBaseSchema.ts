export type SheetTabName =
  | 'Personal_Details'
  | 'Work_Experience'
  | 'Tech_Knowledge'
  | 'Projects'
  | 'Articles'
  | 'Social_Media'
  | 'Knowledge_Base'
  | 'Chatbot_FAQ';

export interface SheetColumnDef {
  key: string;
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

export const PORTFOLIO_SHEETS_SCHEMA: SheetTabSchema[] = [
  {
    number: '01',
    name: 'Personal_Details',
    subtitle: 'Identity, introduction and background',
    description:
      'Conversational biography, professional designation, location, education, and career objectives.',
    columns: [
      { key: 'profile_id', purpose: 'Unique ID' },
      { key: 'full_name', purpose: 'Full name' },
      { key: 'professional_title', purpose: 'Professional designation' },
      { key: 'short_bio', purpose: 'Short introduction' },
      { key: 'detailed_bio', purpose: 'Complete introduction' },
      { key: 'location', purpose: 'City / Country' },
      { key: 'education', purpose: 'Educational background' },
      { key: 'interests', purpose: 'Professional interests' },
      { key: 'career_goal', purpose: 'Career objectives' },
      { key: 'languages', purpose: 'Languages known' },
      { key: 'content_visibility', purpose: 'public / private' },
      { key: 'last_updated', purpose: 'Last modification date' },
    ],
  },
  {
    number: '02',
    name: 'Work_Experience',
    subtitle: 'Employment, roles and responsibilities',
    description:
      'One employment record per row detailing responsibilities, accomplishments, and technologies used.',
    columns: [
      { key: 'experience_id', purpose: 'Unique ID' },
      { key: 'company_name', purpose: 'Company' },
      { key: 'job_title', purpose: 'Designation' },
      { key: 'employment_type', purpose: 'Full-time / Internship' },
      { key: 'start_date', purpose: 'Joining date' },
      { key: 'end_date', purpose: 'Leaving date / Present' },
      { key: 'responsibilities', purpose: 'Responsibilities' },
      { key: 'achievements', purpose: 'Accomplishments' },
      { key: 'technologies_used', purpose: 'Technologies' },
      { key: 'team_details', purpose: 'Team information' },
      { key: 'description', purpose: 'Complete experience summary' },
      { key: 'content_visibility', purpose: 'public / private' },
      { key: 'last_updated', purpose: 'Last updated' },
    ],
  },
  {
    number: '03',
    name: 'Tech_Knowledge',
    subtitle: 'Languages, frameworks and expertise',
    description:
      'Detailed explanations of practical engineering experience, use cases, and related projects for RAG retrieval.',
    columns: [
      { key: 'skill_id', purpose: 'Unique ID' },
      { key: 'technology', purpose: 'Technology name' },
      { key: 'category', purpose: 'Programming / AI / Backend / DevOps' },
      { key: 'proficiency', purpose: 'Beginner / Intermediate / Advanced' },
      { key: 'experience', purpose: 'Years or months' },
      { key: 'practical_experience', purpose: 'Where you used it' },
      { key: 'use_cases', purpose: 'What you use it for' },
      { key: 'related_projects', purpose: 'Project IDs' },
      { key: 'description', purpose: 'Detailed explanation' },
      { key: 'content_visibility', purpose: 'public / private' },
      { key: 'last_updated', purpose: 'Last updated' },
    ],
  },
  {
    number: '04',
    name: 'Projects',
    subtitle: 'Project descriptions, architecture and outcomes',
    description:
      'Comprehensive breakdown of problem statements, technical architecture, stacks, challenges, and results.',
    columns: [
      { key: 'project_id', purpose: 'Unique ID' },
      { key: 'project_name', purpose: 'Project name' },
      { key: 'project_type', purpose: 'Personal / Professional / Open Source' },
      { key: 'short_description', purpose: 'One-line overview' },
      { key: 'detailed_description', purpose: 'Full explanation' },
      { key: 'problem_statement', purpose: 'Problem being solved' },
      { key: 'solution', purpose: 'How you solved it' },
      { key: 'architecture', purpose: 'Technical architecture' },
      { key: 'frontend_technologies', purpose: 'Frontend stack' },
      { key: 'backend_technologies', purpose: 'Backend stack' },
      { key: 'ai_technologies', purpose: 'AI / ML stack' },
      { key: 'database', purpose: 'Database used' },
      { key: 'deployment', purpose: 'Hosting / infrastructure' },
      { key: 'key_features', purpose: 'Main features' },
      { key: 'challenges', purpose: 'Challenges faced' },
      { key: 'achievements', purpose: 'Results and outcomes' },
      { key: 'github_url', purpose: 'Repository' },
      { key: 'live_url', purpose: 'Live project' },
      { key: 'related_skills', purpose: 'Skill IDs' },
      { key: 'content_visibility', purpose: 'public / private' },
      { key: 'last_updated', purpose: 'Last updated' },
    ],
  },
  {
    number: '05',
    name: 'Articles',
    subtitle: 'Published articles, blogs and publications',
    description:
      'Published essays and technical writings with full extracts so the assistant can discuss article contents.',
    columns: [
      { key: 'article_id', purpose: 'Unique ID' },
      { key: 'article_title', purpose: 'Article title' },
      { key: 'category', purpose: 'Technical / Tutorial / Opinion' },
      { key: 'short_summary', purpose: 'Short summary' },
      { key: 'detailed_summary', purpose: 'Detailed explanation' },
      { key: 'key_topics', purpose: 'Main topics' },
      { key: 'technologies', purpose: 'Technologies discussed' },
      { key: 'published_date', purpose: 'Publication date' },
      { key: 'platform', purpose: 'Medium / LinkedIn / Other' },
      { key: 'article_url', purpose: 'Article link' },
      { key: 'content_text', purpose: 'Full article text or useful extract' },
      { key: 'content_visibility', purpose: 'public / private' },
      { key: 'last_updated', purpose: 'Last updated' },
    ],
  },
  {
    number: '06',
    name: 'Social_Media',
    subtitle: 'Social profiles and portfolio links',
    description:
      'Verified links for GitHub, LinkedIn, Personal Portfolio, and DevOrbit community channels.',
    columns: [
      { key: 'social_id', purpose: 'Unique ID' },
      { key: 'platform', purpose: 'Platform name' },
      { key: 'profile_name', purpose: 'Username' },
      { key: 'profile_url', purpose: 'Profile link' },
      { key: 'purpose', purpose: 'What you use it for' },
      { key: 'description', purpose: 'Additional information' },
      { key: 'content_visibility', purpose: 'public / private' },
      { key: 'last_updated', purpose: 'Last updated' },
    ],
  },
  {
    number: '07',
    name: 'Knowledge_Base',
    subtitle: 'Consolidated searchable knowledge records (Most important for RAG)',
    description:
      'Independently searchable natural-language knowledge chunks cross-referenced with source sheets.',
    columns: [
      { key: 'knowledge_id', purpose: 'Unique document ID' },
      { key: 'category', purpose: 'Personal / Work / Skills / Projects' },
      { key: 'subcategory', purpose: 'More specific classification' },
      { key: 'title', purpose: 'Document title' },
      { key: 'content', purpose: 'Complete meaningful text' },
      { key: 'keywords', purpose: 'Search keywords' },
      { key: 'related_ids', purpose: 'Related record IDs' },
      { key: 'source_sheet', purpose: 'Original sheet name' },
      { key: 'source_id', purpose: 'Original record ID' },
      { key: 'content_visibility', purpose: 'public / private' },
      { key: 'priority', purpose: 'Importance' },
      { key: 'last_updated', purpose: 'Last modification' },
    ],
  },
  {
    number: '08',
    name: 'Chatbot_FAQ',
    subtitle: 'Predefined questions and verified answers',
    description:
      'High-frequency visitor questions paired with verified, accurate natural-language answers.',
    columns: [
      { key: 'faq_id', purpose: 'Unique FAQ ID' },
      { key: 'question', purpose: 'Visitor question' },
      { key: 'answer', purpose: 'Verified natural-language answer' },
      { key: 'category', purpose: 'General / Projects / Skills / Hiring' },
      { key: 'keywords', purpose: 'Search keywords' },
      { key: 'related_ids', purpose: 'Related record IDs' },
      { key: 'content_visibility', purpose: 'public / private' },
      { key: 'last_updated', purpose: 'Last updated' },
    ],
  },
];

export type SheetRecord = Record<string, string>;
export type PortfolioKnowledgeBaseData = Record<SheetTabName, SheetRecord[]>;

const TODAY = '2026-11-04';

export const DEFAULT_PORTFOLIO_KNOWLEDGE_BASE: PortfolioKnowledgeBaseData = {
  Personal_Details: [
    {
      profile_id: 'PER001',
      full_name: 'Suraj Kumar Yadav',
      professional_title: 'Software Engineer',
      short_bio:
        'Software Engineer specializing in scalable full-stack systems, distributed backends, and Agentic AI applications.',
      detailed_bio:
        'Suraj Kumar Yadav is a results-driven Software Engineer based in Bhubaneswar, Odisha, India, with 1+ year of hands-on industry experience designing, developing, and deploying scalable full-stack systems and AI-powered applications in production environments. He graduated from KIIT Deemed University with a B.Tech in Computer Science and Engineering (CGPA: 8.35/10.0) and is also the founder of the DevOrbit open developer community.',
      location: 'Bhubaneswar, Odisha, India',
      education: 'KIIT Deemed University — B.Tech in Computer Science & Engineering (CGPA: 8.35/10.0)',
      interests:
        'Agentic AI Systems, Full-Stack Architecture, Distributed Systems, RAG & Vector Search, Open-Source Developer Tooling',
      career_goal:
        'Building high-reliability, large-scale distributed systems and AI-powered engineering platforms (open to Software Engineer opportunities including Google Payments).',
      languages: 'English, Hindi',
      content_visibility: 'public',
      last_updated: TODAY,
    },
  ],

  Work_Experience: [
    {
      experience_id: 'EXP001',
      company_name: 'Spotline, Inc.',
      job_title: 'Software Engineer',
      employment_type: 'Full-time',
      start_date: '2025-05',
      end_date: 'Present',
      responsibilities:
        'Architecting enterprise AI automation extensions, database validation platforms, and production-grade Agentic-RAG systems.',
      achievements:
        'Led 3 end-to-end production systems within the first year: VAssureAI ScriptGen Extension, DB-Compare high-performance validation platform, and a LangGraph Agentic-RAG pipeline achieving sub-45ms cache-hit latency.',
      technologies_used: 'Python, FastAPI, LangGraph, Groq, MongoDB Atlas Vector Search, React, Docker',
      team_details: 'Core Platform & Applied AI Engineering Team in Bhubaneswar',
      description:
        'At Spotline, Inc., Suraj serves as a Software Engineer leading end-to-end architecture for VAssureAI (an AI-powered test script generator for Veeva Vault), DB-Compare (high-speed cross-database validation), and an enterprise Agentic-RAG knowledge assistant integrated with Microsoft Teams.',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      experience_id: 'EXP002',
      company_name: 'SmartInternz',
      job_title: 'Salesforce Development Intern',
      employment_type: 'Internship',
      start_date: '2024-05',
      end_date: '2024-06',
      responsibilities:
        'Developing Apex triggers, custom Lightning components, and automated CRM workflows.',
      achievements:
        'Reduced manual data intervention by 30% and streamlined business process automation across CRM pipelines.',
      technologies_used: 'Salesforce CRM, Apex, SOQL, Lightning Web Components, Workflow Automation',
      team_details: 'Virtual CRM Engineering Cohort',
      description:
        'During his internship at SmartInternz, Suraj engineered custom Apex triggers, asynchronous batch jobs, and automated CRM workflows that reduced manual administrative overhead by 30%.',
      content_visibility: 'public',
      last_updated: TODAY,
    },
  ],

  Tech_Knowledge: [
    {
      skill_id: 'SK001',
      technology: 'Python',
      category: 'Programming',
      proficiency: 'Advanced',
      experience: '3+ years',
      practical_experience:
        'Spotline, Inc. production backend services, EVEE voice agent, Aiden AI companion, ZipIgnore CLI on PyPI, and MeDict AI.',
      use_cases:
        'Asynchronous REST APIs with FastAPI, local AI speech pipelines, CLI developer utilities, and ML model orchestration.',
      related_projects: 'PRJ001, PRJ003, PRJ004, PRJ006, PRJ007',
      description:
        'Suraj uses Python as his primary backend and AI systems language, building low-latency FastAPI microservices, packaging open-source CLI utilities on PyPI (ZipIgnore), and orchestrating local speech-to-text and LLM pipelines.',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      skill_id: 'SK002',
      technology: 'LangGraph & Agentic AI',
      category: 'AI / Agentic AI',
      proficiency: 'Advanced',
      experience: '1.5+ years',
      practical_experience:
        'Spotline Enterprise Agentic-RAG system, Aiden Emotionally Intelligent AI Companion, and VAssureAI.',
      use_cases:
        'Stateful multi-step agent graphs, hybrid BM25 + Vector RAG retrieval, tool calling, and persistent memory architectures.',
      related_projects: 'PRJ001, PRJ003, PRJ004',
      description:
        'Suraj architects cyclical, stateful multi-agent workflows using LangGraph, LiteLLM, and Groq, combining deterministic policy engines with semantic vector retrieval in FAISS and MongoDB Atlas.',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      skill_id: 'SK003',
      technology: 'FastAPI',
      category: 'Backend',
      proficiency: 'Advanced',
      experience: '2+ years',
      practical_experience:
        'VAssureAI backend, DB-Compare service, AI Quantitative Stock System, and Aiden API server.',
      use_cases:
        'High-throughput asynchronous REST APIs, Server-Sent Events (SSE) streaming, Pydantic schema validation, and OAuth2/JWT security.',
      related_projects: 'PRJ003, PRJ004, PRJ008',
      description:
        'Suraj builds production Python backends with FastAPI, leveraging async I/O, strict Pydantic validation, background task workers, and SSE streaming for real-time AI inference.',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      skill_id: 'SK004',
      technology: 'React & TypeScript',
      category: 'Frontend',
      proficiency: 'Advanced',
      experience: '2.5+ years',
      practical_experience:
        'Retro Developer Console Portfolio, DevOrbit Community Platform, Travel Together, and Chrome Extension MV3 UIs.',
      use_cases:
        'Interactive single-page applications, custom design systems with Tailwind CSS, real-time dashboards, and 3D/Canvas interfaces.',
      related_projects: 'PRJ002, PRJ004, PRJ005',
      description:
        'Suraj builds responsive, accessible frontend applications using React 19, TypeScript, Vite, Tailwind CSS, and Three.js with clean component modularity.',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      skill_id: 'SK005',
      technology: 'Node.js & Express',
      category: 'Backend',
      proficiency: 'Advanced',
      experience: '2+ years',
      practical_experience:
        'TalkingHead 3D Avatar-as-a-Service server, Travel Together backend, and full-stack web applications.',
      use_cases:
        'Real-time WebSocket/SSE servers, API gateways, Microsoft Edge Neural TTS streaming, and full-stack middleware.',
      related_projects: 'PRJ002, PRJ005',
      description:
        'Suraj uses Node.js and Express to engineer real-time streaming services, OpenAI-compatible proxy APIs, and collaborative web backends.',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      skill_id: 'SK006',
      technology: 'Databases & Vector Search (PostgreSQL, MongoDB, Redis, FAISS)',
      category: 'Backend',
      proficiency: 'Advanced',
      experience: '2+ years',
      practical_experience:
        'DB-Compare validation engine, Spotline Agentic-RAG (MongoDB Atlas + Redis), and Aiden (FAISS semantic memory).',
      use_cases:
        'Relational schema design, sub-45ms semantic caching in Redis, and high-dimensional vector similarity search.',
      related_projects: 'PRJ003, PRJ004, PRJ008',
      description:
        'Suraj designs hybrid storage layers combining PostgreSQL and MongoDB for transactional data with Redis Streams and FAISS/Pinecone for low-latency vector retrieval.',
      content_visibility: 'public',
      last_updated: TODAY,
    },
  ],

  Projects: [
    {
      project_id: 'PRJ001',
      project_name: 'EVEE',
      project_type: 'Open Source',
      short_description:
        'Offline-first voice-controlled PC agent and personal development productivity hub for Windows 11.',
      detailed_description:
        'EVEE is an open-source, privacy-first voice control agent and personal development workspace hub for Windows 11 where wake-word detection, faster-whisper CPU speech recognition, and 55+ command matching run 100% locally with a strict policy engine and optional Groq/Qwen fallback.',
      problem_statement:
        'Cloud-based voice assistants introduce network latency, send private microphone audio to external servers, and lack deterministic safety controls for OS-level developer automation.',
      solution:
        'Engineered a 100% local CPU speech-to-text pipeline using int8-quantized faster-whisper paired with a deterministic command matcher and a 3-tier policy engine (allow/confirm/deny), plus optional Groq Qwen fallback restricted to a strict JSON intent registry.',
      architecture:
        'Wake-Word Listener -> Local faster-whisper (int8 CPU) -> Negation-Aware Command Matcher (1.6ms p95 latency) -> Local Policy Engine (Allow / Confirm / Deny) -> OS Action Executor (with optional Groq Qwen JSON Intent Fallback).',
      frontend_technologies: 'Desktop HUD / CLI status overlay',
      backend_technologies: 'Python, Windows OS Automation APIs, PyAudio',
      ai_technologies: 'faster-whisper (int8 CPU), Groq API (Qwen LLM fallback), Custom Intent Registry',
      database: 'Local JSON / SQLite configuration & audit logs',
      deployment: 'Standalone Windows 11 Local Runtime & Open-Source GitHub Release',
      key_features:
        '1.6ms (p95) command-to-keypress matcher latency; 55+ built-in voice commands with negation checks; zero audio leaves the PC; strict policy engine.',
      challenges:
        'Achieving low-latency speech transcription on CPU without a dedicated GPU and preventing false-positive destructive commands when users say phrases like "don\'t close the window".',
      achievements:
        'Achieved 1.6ms p95 intent matching latency and 100% local audio privacy as a flagship open-source project in the DevOrbit ecosystem.',
      github_url: 'https://github.com/TheSuraj01/EVEE',
      live_url: 'https://github.com/TheSuraj01/EVEE',
      related_skills: 'SK001, SK002',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      project_id: 'PRJ002',
      project_name: 'Travel Together',
      project_type: 'Personal',
      short_description: 'Plan and travel together with your community.',
      detailed_description:
        'Travel Together is a collaborative group trip planning and itinerary coordination platform designed to help friends, developer communities, and hackathon attendees organize shared routes, budgets, and schedules in real time.',
      problem_statement:
        'Coordinating group travel across scattered chat threads and spreadsheets leads to conflicting schedules, lost bookings, and fragmented group decisions.',
      solution:
        'Built a unified collaborative workspace where community members can propose destinations, vote on itinerary stops, coordinate shared expenses, and sync travel timelines in real time.',
      architecture:
        'React + TypeScript SPA client communicating with a Node.js/Express REST & WebSocket backend for live itinerary synchronization.',
      frontend_technologies: 'React, TypeScript, Tailwind CSS',
      backend_technologies: 'Node.js, Express.js, WebSockets',
      ai_technologies: 'Smart route & itinerary suggestion workflows',
      database: 'PostgreSQL / MongoDB',
      deployment: 'Cloud Web Deployment',
      key_features:
        'Collaborative itinerary builder, group voting on destinations, shared expense splitting, and community trip rooms.',
      challenges:
        'Keeping multi-user itinerary edits synchronized without overwriting concurrent participant updates.',
      achievements:
        'Featured in the DevOrbit ecosystem showcase as a community-first collaborative web application.',
      github_url: 'https://github.com/Thesuraj01',
      live_url: '',
      related_skills: 'SK004, SK005',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      project_id: 'PRJ003',
      project_name: 'VAssureAI',
      project_type: 'Professional',
      short_description:
        'AI-powered test script generator and compliance validation suite for Veeva Vault.',
      detailed_description:
        'Architected at Spotline, Inc., VAssureAI (V-Assure ScriptGen Extension) is an AI-powered Chrome Extension (MV3) and FastAPI backend that automatically generates, validates, and formats compliance test scripts from enterprise requirements.',
      problem_statement:
        'Manual creation of validation and compliance test scripts for enterprise Veeva Vault workflows is time-consuming, repetitive, and prone to human formatting errors.',
      solution:
        'Engineered a Chrome Extension (Manifest V3) paired with an asynchronous FastAPI + Groq LLM orchestration backend that extracts requirement context and generates structured, audit-ready test scripts in seconds.',
      architecture:
        'Chrome Extension MV3 UI -> FastAPI Gateway (OAuth2/JWT) -> Context Parser & Prompt Engine -> High-Speed Groq LLM Inference -> Structured Script Exporter.',
      frontend_technologies: 'JavaScript / TypeScript, Chrome Extension API (MV3), HTML5, CSS3',
      backend_technologies: 'Python, FastAPI, REST APIs',
      ai_technologies: 'Groq LLM Inference, Structured Output Prompting, Context-Aware RAG',
      database: 'MongoDB / Redis Cache',
      deployment: 'Enterprise Cloud & Internal Chrome Web Store Distribution',
      key_features:
        'One-click DOM context extraction, automated test step synthesis, compliance formatting validation, and role-based access control.',
      challenges:
        'Enforcing strict enterprise output schemas and deterministic step numbering from generative LLM responses while maintaining sub-second response times.',
      achievements:
        'Deployed into production at Spotline, Inc., drastically accelerating QA and validation script authoring cycles.',
      github_url: 'https://github.com/Thesuraj01',
      live_url: '',
      related_skills: 'SK001, SK002, SK003, SK004',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      project_id: 'PRJ004',
      project_name: 'Aiden',
      project_type: 'Personal',
      short_description:
        'Emotionally Intelligent AI Companion with tree-leaf persistent memory and 11-dimension emotion detection.',
      detailed_description:
        'Aiden is a self-enhancing AI companion featuring a tree-leaf persistent memory architecture, 11-dimension emotion detection with intensity scoring, FAISS semantic memory retrieval, and background autonomous thinking threads.',
      problem_statement:
        'Standard LLM chatbots forget user context across sessions and lack nuanced emotional awareness, resulting in mechanical conversations.',
      solution:
        'Designed a hierarchical tree-leaf memory graph indexed with FAISS vectors and parallel background reflection threads so Aiden recalls long-term personal context with zero latency impact on live chat.',
      architecture:
        'React Frontend -> FastAPI Backend -> 11-Dimension Emotion Classifier + FAISS Vector Memory -> Parallel Groq (8B/70B) Inference & Background Reflection Threads.',
      frontend_technologies: 'React, Tailwind CSS',
      backend_technologies: 'Python, FastAPI, Asyncio Background Threads',
      ai_technologies: 'Groq (Llama 8B/70B), FAISS Vector Search, 11-Dimension Emotion Scorer',
      database: 'FAISS Vector Index + Persistent JSON/Document Store',
      deployment: 'Cloud & Local Hybrid Runtime',
      key_features:
        'Tree-leaf persistent memory architecture, 11-dimension emotion detection with intensity scoring, and autonomous background thinking threads.',
      challenges:
        'Updating long-term semantic memory and emotional state without adding latency to the user-facing response stream.',
      achievements:
        'Zero-latency memory consolidation via non-blocking parallel reflection threads.',
      github_url: 'https://github.com/Thesuraj01',
      live_url: '',
      related_skills: 'SK001, SK002, SK003, SK006',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      project_id: 'PRJ005',
      project_name: 'TalkingHead 3D',
      project_type: 'Open Source',
      short_description:
        'Real-Time 3D Avatar-as-a-Service for AI chatbots with viseme lip-sync and Edge Neural TTS.',
      detailed_description:
        'An open-source 3D talking avatar service that gives any AI assistant or chatbot a lifelike face with real-time viseme lip-sync, 8 emotional moods, 8 hand/body gestures, free Microsoft Edge Neural TTS, and built-in Groq Qwen 3 / OpenAI-compatible APIs.',
      problem_statement:
        'Adding a realistic 3D talking avatar with synchronized speech and facial expressions to web chatbots typically requires expensive proprietary SDKs.',
      solution:
        'Built an embeddable Three.js WebGL avatar runtime paired with a Node.js server that streams free Microsoft Edge Neural TTS audio alongside phoneme/viseme timing events over REST, SSE, or iframe postMessage.',
      architecture:
        'Three.js / WebGL 3D Character Viewport <- SSE / postMessage Bridge <- Node.js Server + Edge Neural TTS + Groq Qwen 3 LLM Proxy.',
      frontend_technologies: 'Three.js, WebGL, JavaScript, HTML5',
      backend_technologies: 'Node.js, Express, Server-Sent Events (SSE)',
      ai_technologies: 'Groq (Qwen 3), Microsoft Edge Neural TTS, Viseme Lip-Sync Engine',
      database: 'Stateless / In-Memory Session Stream',
      deployment: 'Vercel & Open-Source GitHub Repository',
      key_features:
        'Real-time 3D viseme lip-sync, 8 facial moods, 8 body gestures, dynamic camera framing, and single REST/SSE/iframe integration.',
      challenges:
        'Synchronizing audio buffer playback with 60fps Three.js morph-target visemes across browser audio contexts.',
      achievements:
        'Published as a live open-source 3D Avatar-as-a-Service at talking-head-3-d.vercel.app.',
      github_url: 'https://github.com/TheSuraj01/TalkingHead-3D',
      live_url: 'https://talking-head-3-d.vercel.app',
      related_skills: 'SK004, SK005',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      project_id: 'PRJ006',
      project_name: 'ZipIgnore',
      project_type: 'Open Source',
      short_description:
        'Automated Python project packaging CLI utility published on PyPI.',
      detailed_description:
        'ZipIgnore is a Python CLI utility published on PyPI that creates clean distribution ZIP archives while automatically excluding cache files, virtual environments (.venv, node_modules, __pycache__), and sensitive build artifacts.',
      problem_statement:
        'Developers frequently include gigabytes of virtual environments, cache folders, or secret .env files accidentally when zipping projects for sharing or deployment.',
      solution:
        'Created a lightweight, zero-config Python CLI package distributed on PyPI that parses ignore rules and packages clean, reproducible archives in one command.',
      architecture: 'Python CLI Entrypoint -> Ignore Pattern Matcher -> Streaming ZIP Archiver.',
      frontend_technologies: 'Command-Line Interface (CLI)',
      backend_technologies: 'Python, PyPI Packaging',
      ai_technologies: 'N/A (Deterministic DevTool)',
      database: 'Filesystem',
      deployment: 'Published on Official Python Package Index (PyPI)',
      key_features:
        'Automatic exclusion of .venv/__pycache__/node_modules, custom ignore patterns, and cross-platform CLI execution.',
      challenges: 'Handling nested gitignore-style glob patterns efficiently across Windows, macOS, and Linux.',
      achievements: 'Published and publicly installable via pip from PyPI (pypi.org/project/ZipIgnore/).',
      github_url: 'https://pypi.org/project/ZipIgnore/',
      live_url: 'https://pypi.org/project/ZipIgnore/',
      related_skills: 'SK001',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      project_id: 'PRJ007',
      project_name: 'MeDict AI',
      project_type: 'Open Source',
      short_description:
        'Deep learning lung cancer diagnostic system achieving 81% accuracy with VGG16 & multi-model verification.',
      detailed_description:
        'MeDict AI is a deep learning medical imaging diagnostic system achieving 81% accuracy in lung cancer detection from CT scans using a fine-tuned VGG16 model cross-verified against ResNet50, InceptionV3, and EfficientNet ensembles.',
      problem_statement:
        'Manual review of chest CT scans for early pulmonary nodules is time-intensive and benefits from rapid second-opinion AI screening.',
      solution:
        'Trained a transfer-learning pipeline in TensorFlow/Keras with VGG16 and multi-model ensemble verification wrapped in an interactive Streamlit clinical review interface.',
      architecture:
        'Streamlit Diagnostic UI -> Image Preprocessing Pipeline -> VGG16 + ResNet50/InceptionV3/EfficientNet Ensemble -> Confidence & Classification Report.',
      frontend_technologies: 'Streamlit',
      backend_technologies: 'Python',
      ai_technologies: 'TensorFlow, Keras, VGG16, ResNet50, InceptionV3, EfficientNet',
      database: 'Medical CT Dataset Store',
      deployment: 'Streamlit & GitHub Open Source',
      key_features:
        '81% detection accuracy, multi-model cross-verification, and 10-second diagnostic review speed (down from 5 minutes).',
      challenges:
        'Preventing overfitting on limited medical imaging datasets and normalizing CT scan contrast variations.',
      achievements:
        'Reduced diagnostic screening review time from 5 minutes to 10 seconds with 81% validation accuracy.',
      github_url: 'https://github.com/TheSuraj01/MeDict',
      live_url: '',
      related_skills: 'SK001',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      project_id: 'PRJ008',
      project_name: 'Jira Fixer',
      project_type: 'Open Source',
      short_description:
        'Deterministic safety gate plugin for Claude Code and GitHub Copilot in VS Code that investigates Jira tickets and blocks unapproved file edits.',
      detailed_description:
        'Jira Fixer (Jira-Ticket-Fixer) is an open-source, MIT-licensed plugin for Claude Code and GitHub Copilot in VS Code built with Node.js 18+ and zero dependencies. It acts like a careful teammate: it investigates a Jira ticket via Atlassian MCP, proposes a minimal plan with an "At a glance" summary, and uses a deterministic Node.js hook to physically block file edits until the developer clicks Approve.',
      problem_statement:
        'AI coding agents are great at fixing bugs, but when pointed at a Jira ticket they often confidently edit 14 unrelated files without waiting for review, leaving a sprawling diff with a mind of its own.',
      solution:
        'Engineered a zero-dependency Node.js 18+ approval gate hook and plugin for Claude Code and VS Code GitHub Copilot that physically blocks file modifications until the user explicitly approves the proposed plan and file list.',
      architecture:
        'Atlassian MCP Ticket Reader -> Codebase Investigator -> "At a Glance" Plan Generator (Problem, Cause, Fix, Files, Risk) -> Deterministic Node.js Approval Hook Gate -> Scoped File Editor + Failing Regression Test First -> Acceptance Criteria Verifier & PR/Commit Draft Generator.',
      frontend_technologies: 'Claude Code Plugin CLI & VS Code GitHub Copilot Chat Interface',
      backend_technologies: 'Node.js 18+ (Zero Dependencies, No Telemetry)',
      ai_technologies: 'Claude Code, GitHub Copilot, Atlassian MCP, Deterministic Agent Hooks',
      database: 'Local Session Gate State',
      deployment: 'Open-Source Plugin Marketplace (TheSuraj01/Jira-Ticket-Fixer, MIT License)',
      key_features:
        'Physical hook blocking unapproved file edits; "At a glance" summary (problem, cause, fix, files, risk); edits strictly limited to approved files; writes a failing regression test first; drafts Jira comment, commit message, and PR description.',
      challenges:
        'Ensuring the AI agent cannot bypass the review step, self-approve its own plan, or touch files outside the approved allowlist.',
      achievements:
        'Published as an open-source two-command installable plugin for Claude Code and VS Code Copilot with zero dependencies and zero telemetry.',
      github_url: 'https://github.com/TheSuraj01/Jira-Ticket-Fixer',
      live_url: 'https://lnkd.in/p/dwywzxc5',
      related_skills: 'SK002, SK005',
      content_visibility: 'public',
      last_updated: '2026-11-11',
    },
  ],

  Articles: [
    {
      article_id: 'ART001',
      article_title: 'Traveling: The Best Way to Learn About Life',
      category: 'Opinion',
      short_summary:
        'A reflection on how traveling exposes us to new cultures, challenges our perspectives, and serves as the greatest teacher in life.',
      detailed_summary:
        'Explores how stepping outside familiar environments builds adaptability, empathy, and resilience by engaging with diverse people, histories, and ways of thinking.',
      key_topics: 'Travel, Empathy, Personal Growth, Adaptability, Perspective',
      technologies: 'Life & Philosophy',
      published_date: '2024',
      platform: 'LinkedIn',
      article_url:
        'https://www.linkedin.com/pulse/traveling-best-way-learn-life-suraj-kumar-yadav-sy4hc',
      content_text:
        'Traveling is more than just a leisure activity; it is a profound journey of self-discovery and education. When we step outside our comfort zones and immerse ourselves in unfamiliar environments, we open our minds to new ways of thinking and living. Every destination offers a unique classroom. From understanding the historical context of ancient ruins to navigating the bustling streets of a foreign city, travel teaches us adaptability, empathy, and resilience.',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      article_id: 'ART002',
      article_title:
        'The Digital Facade: How Wealthy Individuals Manipulate Public Perception Using Social Media',
      category: 'Opinion',
      short_summary:
        'An analysis of the strategies used by public figures to curate their online presence and shape public opinion.',
      detailed_summary:
        'Examines how curated social media narratives project strategic images of success or relatability, influencing public discourse and creating unrealistic societal benchmarks.',
      key_topics: 'Social Media, Public Perception, Digital Media Literacy, Society',
      technologies: 'Social Platforms & Media Algorithms',
      published_date: '2024',
      platform: 'LinkedIn',
      article_url:
        'https://www.linkedin.com/pulse/digital-facade-how-wealthy-individuals-manipulate-public-yadav-uetqc',
      content_text:
        'In the age of social media, public perception is often carefully engineered. For wealthy individuals and public figures, platforms like Instagram, Twitter, and LinkedIn serve as powerful tools to construct a specific narrative and maintain a digital facade. Recognizing the difference between authentic expression and calculated PR is crucial in navigating the modern digital landscape.',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      article_id: 'ART003',
      article_title:
        'Chandrayaan 3: Unveiling the Triumph of Truth and Our Cosmic Love Story',
      category: 'Technical',
      short_summary:
        "Reflecting on ISRO's Chandrayaan 3 mission, exploring the scientific triumph and humanity's enduring fascination with the cosmos.",
      detailed_summary:
        "Celebrates ISRO's historic lunar south pole landing, highlighting how engineering perseverance and rigorous failure analysis turned a previous setback into a landmark scientific achievement.",
      key_topics: 'ISRO, Chandrayaan 3, Space Exploration, Engineering Resilience',
      technologies: 'Aerospace Engineering, Lunar Lander Systems, Scientific Computing',
      published_date: '2023',
      platform: 'LinkedIn',
      article_url:
        'https://www.linkedin.com/pulse/chandrayaan-3-unveiling-triumph-truth-our-cosmic-love-yadav',
      content_text:
        "The successful landing of Chandrayaan 3 is not just a scientific milestone for India; it is a testament to the power of perseverance and the triumph of truth. After the heartbreak of the previous mission, ISRO's scientists demonstrated unwavering dedication and resilience, analyzing failures and engineering solutions to reach the uncharted lunar southern pole.",
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      article_id: 'ART004',
      article_title:
        'Introducing Jira Fixer: Deterministic Approval Gate for Claude Code & GitHub Copilot',
      category: 'Technical',
      short_summary:
        'How I built Jira Fixer, an open-source plugin that physically blocks AI coding agents from editing files until you approve their minimal plan.',
      detailed_summary:
        'Explains why prompt instructions alone fail to stop AI coding agents from editing 14 unrequested files when fixing Jira tickets, and how Jira Fixer uses a deterministic Node.js hook to enforce human approval, scoped file edits, and regression-test-first workflows.',
      key_topics: 'Open Source, AI Agents, Claude Code, GitHub Copilot, DevEx, Jira Fixer',
      technologies: 'Node.js 18+, Claude Code Plugins, GitHub Copilot Hooks, Atlassian MCP',
      published_date: '2026-11',
      platform: 'LinkedIn',
      article_url: 'https://lnkd.in/p/dwywzxc5',
      content_text:
        'AI coding agents are great at fixing bugs. They are also great at confidently editing 14 files you never asked them to touch. So I built Jira Fixer, an open-source plugin for Claude Code and GitHub Copilot in VS Code. It works like a careful teammate: investigate first, propose a minimal plan, then wait for your approval before touching any code. A hook physically blocks file edits until you click Approve. The agent cannot skip the review or approve its own plan. What you get: an "At a glance" summary (problem, cause, fix, files, risk), edits limited only to approved files, a failing regression test first, and drafts of the Jira comment, commit message, and PR description.',
      content_visibility: 'public',
      last_updated: '2026-11-11',
    },
  ],

  Social_Media: [
    {
      social_id: 'SOC001',
      platform: 'GitHub',
      profile_name: 'Thesuraj01',
      profile_url: 'https://github.com/Thesuraj01',
      purpose: 'Open-source repositories, Jira Fixer, EVEE, TalkingHead 3D, MeDict AI, and code contributions',
      description: 'Primary GitHub profile for Suraj Kumar Yadav and DevOrbit open-source projects.',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      social_id: 'SOC002',
      platform: 'LinkedIn',
      profile_name: 'surajyadav01',
      profile_url: 'https://linkedin.com/in/surajyadav01',
      purpose: 'Professional networking, engineering updates, and published Pulse articles',
      description: 'Official LinkedIn profile of Suraj Kumar Yadav.',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      social_id: 'SOC003',
      platform: 'Personal Portfolio',
      profile_name: 'Suraj Kumar Yadav',
      profile_url: 'https://knowsuraj.ai.studio/',
      purpose: 'Interactive Retro Developer Console Portfolio & AI Assistant',
      description: 'Main personal engineering portfolio website.',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      social_id: 'SOC004',
      platform: 'DevOrbit Community',
      profile_name: 'DevOrbit',
      profile_url: 'https://knowsuraj.ai.studio/devorbit',
      purpose: 'Open developer and open-source community landing page',
      description: 'Discover. Build. Collaborate. Grow. — Open developer community connected to Suraj Yadav.',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      social_id: 'SOC005',
      platform: 'PyPI',
      profile_name: 'ZipIgnore',
      profile_url: 'https://pypi.org/project/ZipIgnore/',
      purpose: 'Published Python CLI packaging utility',
      description: 'Official PyPI package page for ZipIgnore.',
      content_visibility: 'public',
      last_updated: TODAY,
    },
  ],

  Knowledge_Base: [
    {
      knowledge_id: 'KB001',
      category: 'Personal',
      subcategory: 'Biography & Overview',
      title: 'About Suraj Kumar Yadav',
      content:
        'Suraj Kumar Yadav is a Software Engineer at Spotline, Inc. based in Bhubaneswar, Odisha, India. He holds a B.Tech in Computer Science & Engineering from KIIT Deemed University (CGPA: 8.35/10.0). He specializes in building scalable full-stack systems, distributed backends, and Agentic AI applications using Python, FastAPI, React, TypeScript, and LangGraph. He is also the founder of the DevOrbit open developer community.',
      keywords: 'suraj, who is suraj, bio, background, education, kiit, software engineer, location, bhubaneswar',
      related_ids: 'PER001, EXP001',
      source_sheet: 'Personal_Details',
      source_id: 'PER001',
      content_visibility: 'public',
      priority: 'High',
      last_updated: TODAY,
    },
    {
      knowledge_id: 'KB002',
      category: 'Projects',
      subcategory: 'Voice AI & Local Agents',
      title: 'EVEE Architecture & Voice PC Agent',
      content:
        'EVEE is an open-source, offline-first voice control PC agent for Windows 11 built by Suraj Kumar Yadav. It uses int8-quantized faster-whisper on CPU for 100% local speech recognition, matches 55+ voice commands with 1.6ms (p95) latency including negation checks, and enforces a local policy engine (allow/confirm/deny) with optional Groq/Qwen LLM fallback constrained to a strict JSON intent registry.',
      keywords: 'evee, voice agent, faster-whisper, windows 11, local ai, groq, qwen, latency, privacy',
      related_ids: 'PRJ001, SK001, SK002',
      source_sheet: 'Projects',
      source_id: 'PRJ001',
      content_visibility: 'public',
      priority: 'High',
      last_updated: TODAY,
    },
    {
      knowledge_id: 'KB003',
      category: 'Projects',
      subcategory: 'Enterprise AI Automation',
      title: 'VAssureAI Contribution & Architecture',
      content:
        'At Spotline, Inc., Suraj architected VAssureAI (V-Assure ScriptGen Extension), an AI-powered test script generation and automation tool for Veeva Vault. Built with a Chrome Extension (MV3) frontend and a FastAPI + Groq LLM backend, it extracts requirement context and generates compliant validation scripts automatically.',
      keywords: 'vassure, vassureai, scriptgen, spotline, veeva vault, chrome extension, fastapi, groq',
      related_ids: 'PRJ003, EXP001, SK003',
      source_sheet: 'Projects',
      source_id: 'PRJ003',
      content_visibility: 'public',
      priority: 'High',
      last_updated: TODAY,
    },
    {
      knowledge_id: 'KB004',
      category: 'Projects',
      subcategory: '3D WebGL & Speech Synthesis',
      title: 'TalkingHead 3D Avatar-as-a-Service',
      content:
        'TalkingHead 3D is an open-source real-time 3D Avatar-as-a-Service for chatbots created by Suraj Yadav. Built with Three.js, Node.js, free Microsoft Edge Neural TTS, and Groq Qwen 3, it provides real-time viseme lip-sync, 8 emotional moods, and 8 hand/body gestures controllable via REST, Server-Sent Events (SSE), or iframe postMessage.',
      keywords: 'talkinghead, 3d avatar, threejs, lip sync, tts, edge neural tts, chatbot, sse',
      related_ids: 'PRJ005, SK004, SK005',
      source_sheet: 'Projects',
      source_id: 'PRJ005',
      content_visibility: 'public',
      priority: 'High',
      last_updated: TODAY,
    },
    {
      knowledge_id: 'KB005',
      category: 'Work',
      subcategory: 'Production Systems at Spotline',
      title: 'Spotline Software Engineering Experience & RAG Systems',
      content:
        'As a Software Engineer at Spotline, Inc. (May 2025 – Present), Suraj has led 3 end-to-end production systems: VAssureAI ScriptGen Extension, DB-Compare (a high-performance database validation platform), and a production-grade Agentic-RAG system built with LangGraph, MongoDB Atlas Vector Search, and Redis that achieves sub-45ms cache-hit latency.',
      keywords: 'spotline, work experience, agentic rag, db-compare, langgraph, latency, production',
      related_ids: 'EXP001, SK002, SK006',
      source_sheet: 'Work_Experience',
      source_id: 'EXP001',
      content_visibility: 'public',
      priority: 'High',
      last_updated: TODAY,
    },
    {
      knowledge_id: 'KB006',
      category: 'Skills',
      subcategory: 'AI Models & Security',
      title: 'AI Models Integrated & Authentication Architecture',
      content:
        'Suraj has integrated LLMs and deep learning models across production and open-source systems, including Groq (Llama 8B/70B, Qwen 3), LangGraph agent workflows, faster-whisper (int8 CPU speech-to-text), FAISS & MongoDB Atlas vector search, and CNN ensembles (VGG16, ResNet50, InceptionV3, EfficientNet). For authentication and security, he implements OAuth 2.0, JWT bearer tokens, Role-Based Access Control (RBAC), token encryption, and SSO.',
      keywords: 'ai models, llm, authentication, security, oauth, jwt, rbac, groq, whisper, faiss, vgg16',
      related_ids: 'SK001, SK002, PRJ001, PRJ004, PRJ007',
      source_sheet: 'Tech_Knowledge',
      source_id: 'SK002',
      content_visibility: 'public',
      priority: 'High',
      last_updated: TODAY,
    },
    {
      knowledge_id: 'KB007',
      category: 'Projects',
      subcategory: 'Community & Open Source',
      title: 'DevOrbit Community & Travel Together',
      content:
        'DevOrbit (Discover. Build. Collaborate. Grow.) is an open developer community founded by Suraj Yadav where developers explore open-source projects like Jira Fixer, EVEE, TalkingHead 3D, ZipIgnore, and Travel Together (a collaborative community trip planning platform).',
      keywords: 'devorbit, community, travel together, open source, zipignore, jira fixer',
      related_ids: 'PRJ001, PRJ002, PRJ006, PRJ008, SOC004',
      source_sheet: 'Projects',
      source_id: 'PRJ002',
      content_visibility: 'public',
      priority: 'Medium',
      last_updated: TODAY,
    },
    {
      knowledge_id: 'KB008',
      category: 'Projects',
      subcategory: 'AI Agent Safety & Developer Tools',
      title: 'Jira Fixer — Deterministic Safety Gate for Claude Code & GitHub Copilot',
      content:
        'Jira Fixer (github.com/TheSuraj01/Jira-Ticket-Fixer) is an open-source plugin for Claude Code and GitHub Copilot in VS Code built by Suraj Kumar Yadav. Instead of relying on prompts to stop AI agents from editing unrequested files, Jira Fixer uses a zero-dependency Node.js 18+ hook that physically blocks file edits until the developer clicks Approve on a minimal "At a glance" plan (problem, cause, fix, files, risk). Once approved, edits are locked to the approved file list, a failing regression test is written first, every acceptance criterion is verified, and Jira comments, commit messages, and PR descriptions are drafted.',
      keywords: 'jira fixer, jira-ticket-fixer, claude code, github copilot, vs code plugin, ai agents, safety gate, hooks, atlassian mcp',
      related_ids: 'PRJ008, ART004, SK002, SK005',
      source_sheet: 'Projects',
      source_id: 'PRJ008',
      content_visibility: 'public',
      priority: 'High',
      last_updated: '2026-11-11',
    },
  ],

  Chatbot_FAQ: [
    {
      faq_id: 'FAQ001',
      question: 'Tell me about Suraj.',
      answer:
        'Suraj Kumar Yadav is a Software Engineer at Spotline, Inc. based in Bhubaneswar, India, and a Computer Science graduate from KIIT Deemed University (CGPA: 8.35/10.0). He specializes in full-stack engineering, distributed backend systems, and Agentic AI applications using Python, FastAPI, React, TypeScript, and LangGraph.',
      category: 'General',
      keywords: 'tell me about suraj, who is suraj, introduction, summary',
      related_ids: 'PER001, KB001',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      faq_id: 'FAQ002',
      question: 'What is EVEE?',
      answer:
        'EVEE is an open-source, offline-first voice-controlled PC agent for Windows 11 built by Suraj. It runs wake-word detection, int8 faster-whisper speech-to-text on CPU, and 55+ command matching (1.6ms p95 latency) 100% locally with a 3-tier policy engine (allow/confirm/deny) and optional Groq/Qwen fallback.',
      category: 'Projects',
      keywords: 'what is evee, voice agent, evee project',
      related_ids: 'PRJ001, KB002',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      faq_id: 'FAQ003',
      question: 'Which AI models have you integrated?',
      answer:
        'Suraj has integrated Groq LLMs (Llama 3 8B/70B, Qwen 3), Google Gemini models, faster-whisper (int8 local CPU speech-to-text), LangGraph multi-agent workflows, FAISS & MongoDB Atlas vector embeddings, Microsoft Edge Neural TTS, and computer vision ensembles (VGG16, ResNet50, InceptionV3, EfficientNet).',
      category: 'Skills',
      keywords: 'which ai models, llm, models integrated, machine learning',
      related_ids: 'SK002, KB006',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      faq_id: 'FAQ004',
      question: 'What was your contribution to VAssureAI?',
      answer:
        'Suraj architected the VAssureAI (V-Assure ScriptGen) Chrome Extension (MV3) and its FastAPI + Groq LLM backend at Spotline, Inc., automating the generation and validation of enterprise compliance test scripts for Veeva Vault.',
      category: 'Projects',
      keywords: 'vassureai, v-assure, contribution, spotline',
      related_ids: 'PRJ003, EXP001, KB003',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      faq_id: 'FAQ005',
      question: 'How did you implement authentication and security?',
      answer:
        'Across his backend systems and Google Workspace integrations, Suraj implements OAuth 2.0, JWT bearer authentication, Role-Based Access Control (RBAC), token encryption, and Single Sign-On (SSO), plus deterministic local policy engines and physical edit-blocking hooks in autonomous agents like EVEE and Jira Fixer.',
      category: 'Skills',
      keywords: 'authentication, security, oauth, jwt, rbac',
      related_ids: 'KB006, PRJ001, PRJ008',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      faq_id: 'FAQ006',
      question: 'Is Suraj open for hire or new opportunities?',
      answer:
        'Yes! Suraj is open to Software Engineer opportunities (including Google Payments and distributed/AI systems roles). You can reach him directly at thesuraj396@gmail.com or on LinkedIn at linkedin.com/in/surajyadav01.',
      category: 'Hiring',
      keywords: 'hire, available, job, contact, email, opportunities, google payments',
      related_ids: 'PER001, SOC002',
      content_visibility: 'public',
      last_updated: TODAY,
    },
    {
      faq_id: 'FAQ007',
      question: 'What is Jira Fixer?',
      answer:
        'Jira Fixer (github.com/TheSuraj01/Jira-Ticket-Fixer) is an open-source plugin for Claude Code and GitHub Copilot in VS Code built by Suraj. It investigates Jira tickets, proposes a minimal "At a glance" plan, and uses a zero-dependency Node.js hook to physically block file edits until you click Approve—ensuring edits are strictly limited to approved files with a failing regression test written first.',
      category: 'Projects',
      keywords: 'what is jira fixer, jira-ticket-fixer, claude code plugin, github copilot plugin',
      related_ids: 'PRJ008, KB008, ART004',
      content_visibility: 'public',
      last_updated: '2026-11-11',
    },
  ],
};

/**
 * Lightweight RAG Retrieval Engine over the 8-tab Portfolio_Knowledge_Base structure.
 * Filters strictly to `content_visibility === 'public'` (or unspecified) and scores chunks
 * against the user's query so the AI Assistant gets high-signal, structured context.
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

  interface ScoredChunk {
    id: string;
    source: string;
    title: string;
    text: string;
    score: number;
  }

  const chunks: ScoredChunk[] = [];

  const isPublic = (row: SheetRecord) =>
    !row.content_visibility || row.content_visibility.toLowerCase() !== 'private';

  // 1. Chatbot_FAQ
  (kbData.Chatbot_FAQ || []).filter(isPublic).forEach((row) => {
    chunks.push({
      id: row.faq_id || 'FAQ',
      source: 'Chatbot_FAQ',
      title: row.question || 'FAQ',
      text: `Q: ${row.question}\nA: ${row.answer}`,
      score: scoreText(`${row.question} ${row.keywords} ${row.answer}`, tokens) + 3,
    });
  });

  // 2. Knowledge_Base
  (kbData.Knowledge_Base || []).filter(isPublic).forEach((row) => {
    const priorityBoost = row.priority?.toLowerCase() === 'high' ? 2 : 1;
    chunks.push({
      id: row.knowledge_id || 'KB',
      source: `Knowledge_Base (${row.category || 'General'})`,
      title: row.title || 'Knowledge Record',
      text: `${row.title}: ${row.content} (Keywords: ${row.keywords || ''})`,
      score: scoreText(`${row.title} ${row.keywords} ${row.content} ${row.category}`, tokens) + priorityBoost,
    });
  });

  // 3. Projects
  (kbData.Projects || []).filter(isPublic).forEach((row) => {
    const text = [
      `Project: ${row.project_name} (${row.project_type})`,
      `Overview: ${row.detailed_description || row.short_description}`,
      row.problem_statement ? `Problem: ${row.problem_statement}` : '',
      row.solution ? `Solution: ${row.solution}` : '',
      row.architecture ? `Architecture: ${row.architecture}` : '',
      `Stack: ${[row.frontend_technologies, row.backend_technologies, row.ai_technologies, row.database].filter(Boolean).join(', ')}`,
      row.challenges ? `Challenges: ${row.challenges}` : '',
      row.achievements ? `Outcomes: ${row.achievements}` : '',
      row.github_url ? `Repo: ${row.github_url}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    chunks.push({
      id: row.project_id || 'PRJ',
      source: 'Projects',
      title: row.project_name || 'Project',
      text,
      score: scoreText(`${row.project_name} ${text}`, tokens) + 2,
    });
  });

  // 4. Tech_Knowledge
  (kbData.Tech_Knowledge || []).filter(isPublic).forEach((row) => {
    const text = `${row.technology} (${row.category}, ${row.proficiency}, ${row.experience}): ${row.description} Practical use: ${row.practical_experience}. Use cases: ${row.use_cases}.`;
    chunks.push({
      id: row.skill_id || 'SK',
      source: 'Tech_Knowledge',
      title: row.technology || 'Skill',
      text,
      score: scoreText(`${row.technology} ${row.category} ${text}`, tokens) + 1.5,
    });
  });

  // 5. Work_Experience
  (kbData.Work_Experience || []).filter(isPublic).forEach((row) => {
    const text = `${row.job_title} at ${row.company_name} (${row.employment_type}, ${row.start_date} to ${row.end_date}): ${row.description} Achievements: ${row.achievements}. Tech: ${row.technologies_used}.`;
    chunks.push({
      id: row.experience_id || 'EXP',
      source: 'Work_Experience',
      title: `${row.job_title} @ ${row.company_name}`,
      text,
      score: scoreText(`${row.company_name} ${row.job_title} ${text}`, tokens) + 1.5,
    });
  });

  // 6. Articles
  (kbData.Articles || []).filter(isPublic).forEach((row) => {
    const text = `Article "${row.article_title}" (${row.category} on ${row.platform}): ${row.detailed_summary || row.short_summary} Extract: ${row.content_text} URL: ${row.article_url}`;
    chunks.push({
      id: row.article_id || 'ART',
      source: 'Articles',
      title: row.article_title || 'Article',
      text,
      score: scoreText(`${row.article_title} ${row.key_topics} ${text}`, tokens) + 1,
    });
  });

  // 7. Personal_Details & Social_Media
  (kbData.Personal_Details || []).filter(isPublic).forEach((row) => {
    const text = `${row.full_name} — ${row.professional_title} (${row.location}). ${row.detailed_bio} Education: ${row.education}. Career Goal: ${row.career_goal}.`;
    chunks.push({
      id: row.profile_id || 'PER001',
      source: 'Personal_Details',
      title: row.full_name || 'Personal Profile',
      text,
      score: scoreText(text, tokens) + 2,
    });
  });

  chunks.sort((a, b) => b.score - a.score);
  const selected = chunks.slice(0, topK);

  return selected
    .map((c) => `[${c.source} | ${c.id}] ${c.text}`)
    .join('\n\n');
}

function scoreText(haystack: string, queryTokens: string[]): number {
  if (queryTokens.length === 0) return 1;
  const lower = haystack.toLowerCase();
  let score = 0;
  for (const token of queryTokens) {
    if (lower.includes(token)) {
      score += token.length >= 4 ? 3 : 1.5;
    }
  }
  return score;
}
