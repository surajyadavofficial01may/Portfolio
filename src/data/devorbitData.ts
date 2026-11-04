import { PERSONAL_INFO } from './portfolioData';

export const DEVORBIT_LINKS = {
  domain: 'https://knowsuraj.ai.studio',
  canonicalPath: '/devorbit',
  githubOrg: 'https://github.com/Thesuraj01',
  discordInvite: 'https://discord.com/invite/devorbit',
  linkedinPersonal: PERSONAL_INFO.socials.linkedin,
  linkedinCommunity: 'https://linkedin.com/in/surajyadav01',
  personalPortfolio: '/',
  externalPortfolio: 'https://knowsuraj.ai.studio/',
  email: PERSONAL_INFO.socials.email,
};

export type DevOrbitProjectCategory =
  | 'All Projects'
  | 'AI & ML'
  | 'Web Development'
  | 'Backend'
  | 'Developer Tools'
  | 'Automation'
  | 'Open Source';

export interface DevOrbitProject {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  techStack: string[];
  categories: DevOrbitProjectCategory[];
  status: 'Public Open Source' | 'Internal / Production' | 'In Development';
  ownershipNote: string;
  githubRepo?: string; // format: "owner/repo" for live GitHub API lookup
  githubUrl?: string;
  demoUrl?: string;
  iconType: 'evee' | 'vassure' | 'travel' | 'talkinghead' | 'zipignore' | 'medict';
  accentColor: 'purple' | 'cyan' | 'blue' | 'green' | 'gold';
  featuredOrder: number;
}

export const DEVORBIT_PROJECTS: DevOrbitProject[] = [
  {
    id: 'evee',
    name: 'EVEE',
    shortDescription: 'My personal development workspace and productivity hub.',
    fullDescription:
      'An open-source, offline-first voice control and developer workspace agent where wake-word detection, faster-whisper CPU speech recognition, and 55+ command workflows run locally with a strict policy engine.',
    techStack: ['Python', 'faster-whisper', 'Groq (Qwen)', 'Local AI', 'Windows'],
    categories: ['AI & ML', 'Developer Tools', 'Automation', 'Open Source'],
    status: 'Public Open Source',
    ownershipNote: 'Personal Engineering Project by Suraj Yadav',
    githubRepo: 'TheSuraj01/EVEE',
    githubUrl: 'https://github.com/TheSuraj01/EVEE',
    iconType: 'evee',
    accentColor: 'purple',
    featuredOrder: 1,
  },
  {
    id: 'vassureai',
    name: 'VAssureAI',
    shortDescription: 'AI-powered script generation and automation tools.',
    fullDescription:
      'Automated validation and script generation extension powered by FastAPI and high-speed LLM inference, streamlining enterprise compliance and test script workflows.',
    techStack: ['FastAPI', 'Python', 'Groq LLM', 'Chrome Extension MV3', 'Automation'],
    categories: ['AI & ML', 'Automation', 'Backend', 'Developer Tools'],
    status: 'Internal / Production',
    ownershipNote: 'Personal Engineering Architecture by Suraj Yadav',
    githubUrl: 'https://github.com/Thesuraj01',
    iconType: 'vassure',
    accentColor: 'cyan',
    featuredOrder: 2,
  },
  {
    id: 'travel-together',
    name: 'Travel Together',
    shortDescription: 'Plan and travel together with your community.',
    fullDescription:
      'Collaborative trip planning and itinerary coordination platform designed for developer meetups, hackathons, and community group adventures.',
    techStack: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'WebSockets'],
    categories: ['Web Development', 'Backend'],
    status: 'In Development',
    ownershipNote: 'Personal Engineering Project by Suraj Yadav',
    githubUrl: 'https://github.com/Thesuraj01',
    iconType: 'travel',
    accentColor: 'blue',
    featuredOrder: 3,
  },
  {
    id: 'talkinghead-3d',
    name: 'TalkingHead 3D',
    shortDescription: 'Real-time 3D Avatar-as-a-Service for AI chatbots and assistants.',
    fullDescription:
      'Open-source 3D talking avatar service featuring real-time viseme lip-sync, 8 emotional moods, hand gestures, Microsoft Edge Neural TTS, and OpenAI-compatible SSE endpoints.',
    techStack: ['Three.js', 'Node.js', 'Edge Neural TTS', 'Groq Qwen 3', 'SSE'],
    categories: ['AI & ML', 'Web Development', 'Open Source'],
    status: 'Public Open Source',
    ownershipNote: 'Personal Open-Source Project by Suraj Yadav',
    githubRepo: 'TheSuraj01/TalkingHead-3D',
    githubUrl: 'https://github.com/TheSuraj01/TalkingHead-3D',
    demoUrl: 'https://talking-head-3-d.vercel.app',
    iconType: 'talkinghead',
    accentColor: 'green',
    featuredOrder: 4,
  },
  {
    id: 'zipignore',
    name: 'ZipIgnore',
    shortDescription: 'Automated Python project packaging CLI utility published on PyPI.',
    fullDescription:
      'A command-line packaging tool that creates clean distribution ZIP archives while automatically excluding virtual environments, cache directories, and build artifacts.',
    techStack: ['Python', 'CLI', 'PyPI', 'Packaging'],
    categories: ['Developer Tools', 'Automation', 'Open Source'],
    status: 'Public Open Source',
    ownershipNote: 'Published Open-Source Utility by Suraj Yadav',
    githubUrl: 'https://pypi.org/project/ZipIgnore/',
    demoUrl: 'https://pypi.org/project/ZipIgnore/',
    iconType: 'zipignore',
    accentColor: 'gold',
    featuredOrder: 5,
  },
  {
    id: 'medict-ai',
    name: 'MeDict AI',
    shortDescription: 'Deep learning diagnostic system for lung CT scan analysis.',
    fullDescription:
      'Deep learning medical imaging pipeline using fine-tuned VGG16 and multi-model ensemble verification (ResNet50, InceptionV3, EfficientNet) with a Streamlit diagnostic interface.',
    techStack: ['Python', 'TensorFlow', 'VGG16', 'Streamlit'],
    categories: ['AI & ML', 'Open Source'],
    status: 'Public Open Source',
    ownershipNote: 'Personal Research Project by Suraj Yadav',
    githubRepo: 'TheSuraj01/MeDict',
    githubUrl: 'https://github.com/TheSuraj01/MeDict',
    iconType: 'medict',
    accentColor: 'cyan',
    featuredOrder: 6,
  },
];

export const PROJECT_CATEGORIES: DevOrbitProjectCategory[] = [
  'All Projects',
  'AI & ML',
  'Web Development',
  'Backend',
  'Developer Tools',
  'Automation',
  'Open Source',
];

export interface DevOrbitResource {
  id: string;
  category: 'Getting Started' | 'Development' | 'AI & Machine Learning' | 'Engineering & Infrastructure';
  title: string;
  description: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  url: string;
  sourceLabel: string;
}

export const DEVORBIT_RESOURCES: DevOrbitResource[] = [
  // 1. Getting Started
  {
    id: 'res-git-basics',
    category: 'Getting Started',
    title: 'Git & GitHub Foundations',
    description: 'Official documentation covering repositories, branching workflows, commits, and pull requests.',
    skillLevel: 'Beginner',
    url: 'https://docs.github.com/en/get-started',
    sourceLabel: 'GitHub Docs',
  },
  {
    id: 'res-oss-guide',
    category: 'Getting Started',
    title: 'How to Contribute to Open Source',
    description: 'Practical guide on finding beginner-friendly issues, submitting pull requests, and collaborating respectfully.',
    skillLevel: 'Beginner',
    url: 'https://opensource.guide/how-to-contribute/',
    sourceLabel: 'OpenSource.guide',
  },
  {
    id: 'res-dev-env',
    category: 'Getting Started',
    title: 'Developer Environment Setup',
    description: 'Configure VS Code, terminal shells, SSH keys, and workspace extensions for modern software development.',
    skillLevel: 'Beginner',
    url: 'https://code.visualstudio.com/docs/setup/setup-overview',
    sourceLabel: 'VS Code Docs',
  },

  // 2. Development
  {
    id: 'res-frontend-react',
    category: 'Development',
    title: 'Modern Frontend Architecture with React & TypeScript',
    description: 'Component design, hooks, state management, and accessible UI engineering from the official React documentation.',
    skillLevel: 'Intermediate',
    url: 'https://react.dev/learn',
    sourceLabel: 'React.dev',
  },
  {
    id: 'res-backend-fastapi',
    category: 'Development',
    title: 'High-Performance Backend Engineering with FastAPI',
    description: 'Build asynchronous REST APIs, Pydantic data validation schemas, and OpenAPI services in Python.',
    skillLevel: 'Intermediate',
    url: 'https://fastapi.tiangolo.com/tutorial/',
    sourceLabel: 'FastAPI Docs',
  },
  {
    id: 'res-python-core',
    category: 'Development',
    title: 'Python Programming & Standard Library Reference',
    description: 'Master data structures, async concurrency, packaging, and idiomatic Python patterns.',
    skillLevel: 'Beginner',
    url: 'https://docs.python.org/3/tutorial/',
    sourceLabel: 'Python.org',
  },
  {
    id: 'res-web-apis',
    category: 'Development',
    title: 'HTTP, REST APIs & Web Architecture',
    description: 'Comprehensive reference on HTTP semantics, WebSockets, Server-Sent Events, and web security.',
    skillLevel: 'Intermediate',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP',
    sourceLabel: 'MDN Web Docs',
  },

  // 3. AI & Machine Learning
  {
    id: 'res-llm-apps',
    category: 'AI & Machine Learning',
    title: 'Building LLM Applications & Structured Outputs',
    description: 'Patterns for prompt engineering, tool calling, streaming responses, and multi-modal AI workflows.',
    skillLevel: 'Intermediate',
    url: 'https://ai.google.dev/gemini-api/docs',
    sourceLabel: 'Google AI Docs',
  },
  {
    id: 'res-agentic-ai',
    category: 'AI & Machine Learning',
    title: 'Agentic AI & Stateful Multi-Agent Workflows',
    description: 'Architect autonomous reasoning loops, persistent memory graphs, and human-in-the-loop agents with LangGraph.',
    skillLevel: 'Advanced',
    url: 'https://langchain-ai.github.io/langgraph/',
    sourceLabel: 'LangGraph Docs',
  },
  {
    id: 'res-rag-vector',
    category: 'AI & Machine Learning',
    title: 'RAG & High-Dimensional Vector Similarity Search',
    description: 'Implement dense embedding indexing, hybrid retrieval, and low-latency similarity search using FAISS.',
    skillLevel: 'Advanced',
    url: 'https://faiss.ai/',
    sourceLabel: 'FAISS Documentation',
  },

  // 4. Engineering & Infrastructure
  {
    id: 'res-docker-containers',
    category: 'Engineering & Infrastructure',
    title: 'Docker & Containerized Microservices',
    description: 'Package reproducible application environments using multi-stage Dockerfiles and Docker Compose.',
    skillLevel: 'Intermediate',
    url: 'https://docs.docker.com/get-started/',
    sourceLabel: 'Docker Docs',
  },
  {
    id: 'res-cicd-actions',
    category: 'Engineering & Infrastructure',
    title: 'CI/CD Pipelines with GitHub Actions',
    description: 'Automate testing, linting, container builds, and deployment workflows on every pull request.',
    skillLevel: 'Intermediate',
    url: 'https://docs.github.com/en/actions',
    sourceLabel: 'GitHub Actions',
  },
  {
    id: 'res-cloud-k8s',
    category: 'Engineering & Infrastructure',
    title: 'Cloud Native Orchestration & Kubernetes',
    description: 'Understand cluster architecture, pods, service discovery, and scalable workload deployments.',
    skillLevel: 'Advanced',
    url: 'https://kubernetes.io/docs/concepts/',
    sourceLabel: 'Kubernetes.io',
  },
];

export const CONTRIBUTION_STEPS = [
  {
    number: '01',
    title: 'Explore',
    description: 'Discover projects and choose something interesting.',
    accent: 'cyan' as const,
  },
  {
    number: '02',
    title: 'Understand',
    description: 'Read the documentation, guidelines, and open issues.',
    accent: 'purple' as const,
  },
  {
    number: '03',
    title: 'Contribute',
    description: 'Submit ideas, report bugs, improve documentation, or create pull requests.',
    accent: 'gold' as const,
  },
  {
    number: '04',
    title: 'Grow',
    description: 'Collaborate with maintainers, learn from feedback, and build your developer experience.',
    accent: 'green' as const,
  },
];

export const CONTRIBUTOR_CATEGORIES = [
  {
    id: 'core',
    title: 'Core Maintainers',
    description: 'Architecting repositories, reviewing pull requests, and guiding technical direction.',
  },
  {
    id: 'active',
    title: 'Active Contributors',
    description: 'Developers shipping code, features, bug fixes, and technical improvements.',
  },
  {
    id: 'first-time',
    title: 'First-Time Contributors',
    description: 'Builders making their very first open-source pull request in the DevOrbit ecosystem.',
  },
  {
    id: 'helpers',
    title: 'Community Helpers',
    description: 'Members answering questions, improving docs, and welcoming new developers.',
  },
];

export const COMMUNITY_GUIDELINES_TEXT = {
  title: 'DevOrbit Community & Contribution Guidelines',
  sections: [
    {
      heading: '1. Our Open Community Philosophy',
      body: 'DevOrbit welcomes beginners, experienced engineers, students, and AI enthusiasts alike. We prioritize constructive feedback, curiosity, and respectful technical collaboration.',
    },
    {
      heading: '2. How to Propose Changes or Pick an Issue',
      body: 'Browse our public GitHub repositories, check open issues or create a discussion thread before starting major architectural changes. Small bug fixes, test coverage, and documentation improvements are always welcome.',
    },
    {
      heading: '3. Pull Request Standards',
      body: 'Keep pull requests focused on a single concern. Include a clear summary of what changed, how you verified it locally, and avoid committing secrets, API keys, or build artifacts.',
    },
    {
      heading: '4. Respect & Attribution',
      body: 'Every meaningful contribution—whether code, bug reports, documentation, or helping another developer debug—is valued and recognized with transparent public attribution.',
    },
  ],
};
