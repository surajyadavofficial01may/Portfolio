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
 * Only the exact 3 initial projects requested in the specification,
 * with zero fabricated stars, dates, tech stacks, or fake URLs.
 */
export const DEVORBIT_PROJECTS: DevOrbitProject[] = [
  {
    id: 'evee',
    name: 'EVEE',
    shortDescription: 'My personal development workspace and productivity hub.',
    techStack: ['Python'],
    categories: ['AI & ML', 'Developer Tools', 'Automation', 'Open Source'],
    availability: 'Public Repository',
    ownershipNote: 'Personal Portfolio Project · Suraj Kumar Yadav',
    githubRepo: 'TheSuraj01/EVEE',
    githubUrl: 'https://github.com/TheSuraj01/EVEE',
    iconType: 'evee',
  },
  {
    id: 'vassureai',
    name: 'VAssureAI',
    shortDescription: 'AI-powered script generation and automation tools.',
    techStack: [],
    categories: ['AI & ML', 'Automation', 'Developer Tools'],
    availability: 'Private Project',
    ownershipNote: 'Personal Engineering Work · Suraj Kumar Yadav',
    iconType: 'vassure',
  },
  {
    id: 'travel-together',
    name: 'Travel Together',
    shortDescription: 'Plan and travel together with your community.',
    techStack: [],
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
