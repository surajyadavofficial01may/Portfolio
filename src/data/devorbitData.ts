import { PERSONAL_INFO } from './portfolioData';

export const DEVORBIT_LINKS = {
  domain: 'https://knowsuraj.ai.studio',
  canonicalPath: '/devorbit',
  // Verified links from the portfolio owner
  githubProfile: PERSONAL_INFO.socials.github, // https://github.com/Thesuraj01
  linkedinPersonal: PERSONAL_INFO.socials.linkedin, // https://linkedin.com/in/surajyadav01
  personalPortfolio: '/',
  externalPortfolio: 'https://knowsuraj.ai.studio/',
  // Community links not yet publicly launched are null (never fake URLs)
  discordInvite: null as string | null,
  linkedinCommunity: null as string | null,
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
  techStack: string[]; // Empty if not yet publicly specified
  categories: DevOrbitProjectCategory[];
  availability: 'Public Repository' | 'Private Project' | 'Coming Soon';
  ownershipNote: string;
  githubRepo?: string; // Exact "owner/repo" on GitHub when a public repo exists
  githubUrl?: string; // Only provided when a real public URL exists
  demoUrl?: string;
  iconType: 'evee' | 'vassure' | 'travel';
}

/**
 * Complete list of portfolio projects for DevOrbit, synchronized with src/data/portfolioData.ts.
 */
export const DEVORBIT_PROJECTS: DevOrbitProject[] = [
  {
    id: 'jira-fixer',
    name: 'Jira Fixer',
    shortDescription:
      'An open-source plugin for Claude Code and GitHub Copilot in VS Code that investigates Jira tickets, proposes a minimal plan with an "At a glance" summary, and uses a deterministic hook to physically block file edits until human approval.',
    techStack: ['Node.js 18+', 'Claude Code', 'GitHub Copilot', 'Atlassian MCP', 'Zero Dependencies'],
    categories: ['AI & ML', 'Developer Tools', 'Automation', 'Open Source'],
    availability: 'Public Repository',
    ownershipNote: 'Open Source Project · Suraj Kumar Yadav (MIT License)',
    githubRepo: 'TheSuraj01/Jira-Ticket-Fixer',
    githubUrl: 'https://github.com/TheSuraj01/Jira-Ticket-Fixer',
    iconType: 'vassure',
  },
  {
    id: 'evee',
    name: 'EVEE',
    shortDescription:
      'An open-source, privacy-first voice control agent for Windows 11 where wake-word detection, faster-whisper CPU speech recognition, and 55+ command matching run 100% locally with a strict policy engine and optional Groq/Qwen fallback.',
    techStack: ['Python', 'faster-whisper', 'Groq (Qwen)', 'Local AI', 'Windows'],
    categories: ['AI & ML', 'Developer Tools', 'Automation', 'Open Source'],
    availability: 'Public Repository',
    ownershipNote: 'Open Source Project · Suraj Kumar Yadav',
    githubRepo: 'TheSuraj01/EVEE',
    githubUrl: 'https://github.com/TheSuraj01/EVEE',
    iconType: 'evee',
  },
  {
    id: 'talkinghead-3d',
    name: 'TalkingHead 3D',
    shortDescription:
      'An open-source 3D talking avatar service that gives any AI assistant or chatbot a lifelike face with real-time lip-sync, 8 facial moods, hand gestures, free Microsoft Edge Neural TTS, and built-in Groq Qwen 3 LLM & OpenAI-compatible APIs.',
    techStack: ['Three.js', 'Node.js', 'Edge Neural TTS', 'Groq (Qwen 3)', 'REST / SSE'],
    categories: ['AI & ML', 'Web Development', 'Backend', 'Open Source'],
    availability: 'Public Repository',
    ownershipNote: 'Open Source Project · Suraj Kumar Yadav',
    githubRepo: 'TheSuraj01/TalkingHead-3D',
    githubUrl: 'https://github.com/TheSuraj01/TalkingHead-3D',
    demoUrl: 'https://talking-head-3-d.vercel.app',
    iconType: 'evee',
  },
  {
    id: 'aiden',
    name: 'Aiden',
    shortDescription:
      'Self-enhancing emotionally intelligent AI companion featuring a tree-leaf persistent memory architecture, 11-dimension emotion detection with intensity scoring, and FAISS-based semantic memory retrieval.',
    techStack: ['Python', 'FastAPI', 'React', 'FAISS', 'Groq (8B/70B)'],
    categories: ['AI & ML', 'Web Development', 'Backend'],
    availability: 'Public Repository',
    ownershipNote: 'Personal Portfolio Project · Suraj Kumar Yadav',
    githubUrl: 'https://github.com/Thesuraj01',
    iconType: 'vassure',
  },
  {
    id: 'ai-quant-stock-system',
    name: 'AI Quantitative Stock System',
    shortDescription:
      'Institutional-grade predictive analytics platform aggregating 100+ technical indicators (RSI, MACD, VWAP) with an ML ensemble forecasting engine (LSTM, Transformer, XGBoost, Reinforcement Learning) and Kafka + Redis Streams.',
    techStack: ['Python', 'FastAPI', 'PyTorch', 'Kafka', 'Redis'],
    categories: ['AI & ML', 'Backend', 'Automation'],
    availability: 'Public Repository',
    ownershipNote: 'Personal Portfolio Project · Suraj Kumar Yadav',
    githubUrl: 'https://github.com/Thesuraj01',
    iconType: 'vassure',
  },
  {
    id: 'zipignore',
    name: 'ZipIgnore',
    shortDescription:
      'A Python-based CLI utility published on PyPI that simplifies project packaging by creating ZIP archives while automatically excluding cache files, virtual environments, and build artifacts.',
    techStack: ['Python', 'CLI', 'PyPI', 'Automation'],
    categories: ['Developer Tools', 'Automation', 'Open Source'],
    availability: 'Public Repository',
    ownershipNote: 'Published Open Source Tool on PyPI · Suraj Kumar Yadav',
    githubUrl: 'https://pypi.org/project/ZipIgnore/',
    demoUrl: 'https://pypi.org/project/ZipIgnore/',
    iconType: 'vassure',
  },
  {
    id: 'medict-ai',
    name: 'MeDict AI',
    shortDescription:
      'Deep learning lung cancer diagnostic system achieving 81% detection accuracy using fine-tuned VGG16, with cross-verification via ResNet50, InceptionV3, and EfficientNet ensemble models and a Streamlit UI.',
    techStack: ['Python', 'TensorFlow', 'Streamlit', 'VGG16'],
    categories: ['AI & ML', 'Web Development', 'Open Source'],
    availability: 'Public Repository',
    ownershipNote: 'Open Source Project · Suraj Kumar Yadav',
    githubRepo: 'TheSuraj01/MeDict',
    githubUrl: 'https://github.com/TheSuraj01/MeDict',
    iconType: 'evee',
  },
  {
    id: 'travel-together',
    name: 'Travel Together',
    shortDescription: 'Plan and travel together with your community.',
    techStack: ['React', 'Node.js', 'WebSockets'],
    categories: ['Web Development'],
    availability: 'Coming Soon',
    ownershipNote: 'Personal Portfolio Project · Suraj Kumar Yadav',
    iconType: 'travel',
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
  category:
    | 'Getting Started'
    | 'Development'
    | 'AI & Machine Learning'
    | 'Engineering & Infrastructure';
  title: string;
  description: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  url: string;
  sourceLabel: string;
}

/**
 * Exact resource topics specified in Section 9 of the prompt,
 * pointing strictly to official documentation (no fake DevOrbit tutorials).
 */
export const DEVORBIT_RESOURCES: DevOrbitResource[] = [
  // 1. Getting Started
  {
    id: 'git-github-basics',
    category: 'Getting Started',
    title: 'Git and GitHub basics',
    description: 'Official Git and GitHub documentation for version control, repositories, and pull requests.',
    skillLevel: 'Beginner',
    url: 'https://docs.github.com/en/get-started',
    sourceLabel: 'docs.github.com',
  },
  {
    id: 'oss-contribution-guides',
    category: 'Getting Started',
    title: 'Open-source contribution guides',
    description: 'Official Open Source Guides on how to find projects, submit issues, and contribute code.',
    skillLevel: 'Beginner',
    url: 'https://opensource.guide/how-to-contribute/',
    sourceLabel: 'opensource.guide',
  },
  {
    id: 'dev-env-setup',
    category: 'Getting Started',
    title: 'Developer environment setup',
    description: 'Official Visual Studio Code setup documentation for configuring your local development workspace.',
    skillLevel: 'Beginner',
    url: 'https://code.visualstudio.com/docs/setup/setup-overview',
    sourceLabel: 'code.visualstudio.com',
  },

  // 2. Development
  {
    id: 'frontend-dev',
    category: 'Development',
    title: 'Frontend development',
    description: 'Official React and MDN Web Docs covering modern UI components, HTML, CSS, and JavaScript.',
    skillLevel: 'Beginner',
    url: 'https://react.dev/learn',
    sourceLabel: 'react.dev',
  },
  {
    id: 'backend-eng',
    category: 'Development',
    title: 'Backend engineering',
    description: 'Official FastAPI documentation for building backend web services and RESTful APIs.',
    skillLevel: 'Intermediate',
    url: 'https://fastapi.tiangolo.com/',
    sourceLabel: 'fastapi.tiangolo.com',
  },
  {
    id: 'python-prog',
    category: 'Development',
    title: 'Python and programming',
    description: 'Official Python language tutorial and standard library reference.',
    skillLevel: 'Beginner',
    url: 'https://docs.python.org/3/tutorial/',
    sourceLabel: 'docs.python.org',
  },
  {
    id: 'apis-system-design',
    category: 'Development',
    title: 'APIs and system design',
    description: 'Official MDN reference on HTTP architecture, web APIs, and client-server communication.',
    skillLevel: 'Intermediate',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP',
    sourceLabel: 'developer.mozilla.org',
  },

  // 3. AI & Machine Learning
  {
    id: 'llm-applications',
    category: 'AI & Machine Learning',
    title: 'LLM applications',
    description: 'Official Google Gemini API documentation for building large language model applications.',
    skillLevel: 'Intermediate',
    url: 'https://ai.google.dev/gemini-api/docs',
    sourceLabel: 'ai.google.dev',
  },
  {
    id: 'agentic-ai',
    category: 'AI & Machine Learning',
    title: 'Agentic AI',
    description: 'Official LangGraph documentation for building stateful, multi-actor AI agent workflows.',
    skillLevel: 'Advanced',
    url: 'https://langchain-ai.github.io/langgraph/',
    sourceLabel: 'langchain-ai.github.io',
  },
  {
    id: 'rag-vector-search',
    category: 'AI & Machine Learning',
    title: 'RAG and vector search',
    description: 'Official FAISS documentation for efficient similarity search and dense vector clustering.',
    skillLevel: 'Advanced',
    url: 'https://faiss.ai/',
    sourceLabel: 'faiss.ai',
  },
  {
    id: 'ai-dev-tools',
    category: 'AI & Machine Learning',
    title: 'AI development tools',
    description: 'Official PyTorch documentation and tutorials for deep learning and AI model development.',
    skillLevel: 'Intermediate',
    url: 'https://pytorch.org/docs/stable/index.html',
    sourceLabel: 'pytorch.org',
  },

  // 4. Engineering & Infrastructure
  {
    id: 'cloud-computing',
    category: 'Engineering & Infrastructure',
    title: 'Cloud computing',
    description: 'Official Google Cloud documentation for cloud architecture, compute, and deployment.',
    skillLevel: 'Intermediate',
    url: 'https://cloud.google.com/docs',
    sourceLabel: 'cloud.google.com',
  },
  {
    id: 'docker-containers',
    category: 'Engineering & Infrastructure',
    title: 'Docker and containers',
    description: 'Official Docker documentation for containerizing applications and multi-container environments.',
    skillLevel: 'Intermediate',
    url: 'https://docs.docker.com/get-started/',
    sourceLabel: 'docs.docker.com',
  },
  {
    id: 'cicd-practices',
    category: 'Engineering & Infrastructure',
    title: 'CI/CD',
    description: 'Official GitHub Actions documentation for automating build, test, and deployment pipelines.',
    skillLevel: 'Intermediate',
    url: 'https://docs.github.com/en/actions',
    sourceLabel: 'docs.github.com',
  },
  {
    id: 'devops-practices',
    category: 'Engineering & Infrastructure',
    title: 'DevOps practices',
    description: 'Official Kubernetes documentation for container orchestration and production operations.',
    skillLevel: 'Advanced',
    url: 'https://kubernetes.io/docs/home/',
    sourceLabel: 'kubernetes.io',
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
    description: 'Maintainers guiding repositories and reviewing pull requests.',
  },
  {
    id: 'active',
    title: 'Active Contributors',
    description: 'Developers contributing code, bug fixes, and technical improvements.',
  },
  {
    id: 'first-time',
    title: 'First-Time Contributors',
    description: 'Builders making their first open-source pull request in the ecosystem.',
  },
  {
    id: 'helpers',
    title: 'Community Helpers',
    description: 'Members helping with discussions, documentation, and peer support.',
  },
];

export const COMMUNITY_GUIDELINES_TEXT = {
  title: 'DevOrbit Community & Contribution Guidelines',
  sections: [
    {
      heading: '1. Open & Welcoming Collaboration',
      body: 'DevOrbit is an open developer community where beginners, experienced developers, software engineers, AI enthusiasts, and open-source contributors can discover projects, share knowledge, collaborate, and build meaningful software.',
    },
    {
      heading: '2. Exploring & Understanding Projects',
      body: 'Start by reading the repository README, documentation, and open issues on GitHub before submitting changes.',
    },
    {
      heading: '3. Submitting Contributions',
      body: 'You can contribute by submitting ideas, reporting bugs, improving documentation, or creating focused pull requests.',
    },
    {
      heading: '4. Honest Attribution',
      body: 'Contributor profiles are displayed only when actual participation and public attribution exist.',
    },
  ],
};
