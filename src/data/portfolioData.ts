import { TechStackItem, Project, Article, JourneyMetric } from '../types';

export const PERSONAL_INFO = {
  name: 'Suraj Kumar Yadav',
  role: 'Software Engineer',
  tagline: 'Building scalable full-stack systems and AI-powered applications.',
  bio: "Results-driven Software Engineer with 1+ year of hands-on industry experience designing, developing, and deploying scalable full-stack systems and AI-powered applications in production environments. Demonstrated expertise in building distributed, secure, and high-performance software solutions.",
  location: 'Bhubaneswar, Odisha, India',
  availability: 'Seeking opportunities at Google Payments',
  education: 'KIIT Deemed University — B.Tech in CSE (CGPA: 8.35/10.0)',
  experienceYears: '1+',
  projectsCount: '10+',
  stacksCount: '15+',
  learningMindset: '100%',
  socials: {
    github: 'https://github.com/Thesuraj01',
    linkedin: 'https://linkedin.com/in/surajyadav01',
    portfolio: 'https://surajkumaryadavin.vercel.app',
    email: 'thesuraj396@gmail.com',
  },
};

export const TECH_STACK: TechStackItem[] = [
  {
    id: 'python',
    name: 'Languages',
    category: 'backend',
    iconKey: 'python',
    proficiency: 95,
    description: 'Python, JavaScript (ES6+), TypeScript, Java, C, C++, SQL',
  },
  {
    id: 'frontend',
    name: 'Frontend',
    category: 'frontend',
    iconKey: 'react',
    proficiency: 92,
    description: 'React.js, Vue.js 3, Next.js, Vite, TailwindCSS, HTML5, CSS3, Three.js, Zustand',
  },
  {
    id: 'backend',
    name: 'Backend',
    category: 'backend',
    iconKey: 'nodejs',
    proficiency: 90,
    description: 'Node.js, Express.js, FastAPI, RESTful APIs, WebSockets, Server-Sent Events (SSE)',
  },
  {
    id: 'ai_ml',
    name: 'AI / ML',
    category: 'backend',
    iconKey: 'brain',
    proficiency: 88,
    description: 'LangGraph, LiteLLM, RAG (BM25/TF-IDF/Vector), TensorFlow, PyTorch, Scikit-Learn, FAISS, Pydantic',
  },
  {
    id: 'database',
    name: 'Databases',
    category: 'database',
    iconKey: 'postgresql',
    proficiency: 86,
    description: 'MongoDB, PostgreSQL, Redis, MongoDB Atlas (Vector Search), Pinecone, TimescaleDB',
  },
  {
    id: 'cloud_devops',
    name: 'Cloud & DevOps',
    category: 'devops',
    iconKey: 'docker',
    proficiency: 85,
    description: 'Docker, Docker Compose, Google Kubernetes Engine (GKE), AWS (Bedrock, EKS), CI/CD',
  },
  {
    id: 'security',
    name: 'Security',
    category: 'backend',
    iconKey: 'security',
    proficiency: 84,
    description: 'OAuth 2.0, JWT, Role-Based Access Control (RBAC), Token Encryption, SSO',
  },
  {
    id: 'tools',
    name: 'Tools',
    category: 'frontend',
    iconKey: 'tools',
    proficiency: 85,
    description: 'Git, GitHub, Chrome Extension API (MV3), Groq, Google Maps API, Kafka, Celery',
  },
];

export const JOURNEY_METRICS: JourneyMetric[] = [
  {
    value: '1+',
    label: 'Years',
    sublabel: 'Experience',
    iconName: 'Briefcase',
  },
  {
    value: '10+',
    label: 'Projects',
    sublabel: 'Completed',
    iconName: 'CodeXml',
  },
  {
    value: '5+',
    label: 'Tech',
    sublabel: 'Stacks',
    iconName: 'Layers',
  },
  {
    value: '100%',
    label: 'Learning',
    sublabel: 'Mindset',
    iconName: 'Brain',
  },
];

export const SPECIALTIES: string[] = [
  'Agentic AI Systems',
  'Full Stack Development',
  'Distributed Systems',
  'System Design',
  'RAG & Vector Search',
  'Chrome Extensions',
  'Database Migrations',
  'Cloud Infrastructure',
];

export const RECENT_HIGHLIGHTS = [
  'Architected V-Assure ScriptGen Extension using FastAPI & Groq',
  'Engineered DB-Compare, a high-performance DB validation platform',
  'Led a production-grade Agentic-RAG system achieving sub-45ms cache-hit latency',
  'Built Aiden, an Emotionally Intelligent AI Companion with persistent memory',
];

export const CURRENTLY_BUILDING = {
  title: 'AI Quantitative Stock Intelligence System',
  subtitle: 'Institutional-grade predictive analytics platform with 100+ technical indicators.',
  status: 'Active Design',
  tech: ['Python', 'FastAPI', 'PyTorch', 'Kafka', 'Redis'],
};

export const PROJECTS: Project[] = [
  {
    id: 'proj-1',
    code: 'PROJECT 001',
    title: 'Aiden',
    subtitle: 'Emotionally Intelligent AI Companion',
    description: 'Built a self-enhancing AI companion featuring a tree-leaf persistent memory architecture, 11-dimension emotion detection with intensity scoring, and an evolving personality system adapting across sessions.',
    techStack: ['Python', 'FastAPI', 'React', 'FAISS', 'Groq (8B/70B)'],
    features: [
      'Tree-leaf persistent memory architecture',
      '11-dimension emotion detection with intensity scoring',
      'FAISS-based semantic memory retrieval and background autonomous thinking threads',
    ],
    metrics: 'Zero-latency Impact via Parallel Threads',
    githubUrl: 'https://github.com/Thesuraj01',
    demoUrl: 'https://github.com/Thesuraj01',
    badge: 'LLM Agents',
    level: 'LV 01',
  },
  {
    id: 'proj-2',
    code: 'PROJECT 002',
    title: 'AI Quantitative Stock System',
    subtitle: 'Institutional-grade Predictive Analytics',
    description: 'Designing a predictive analytics platform aggregating 100+ technical indicators (RSI, MACD, VWAP) with an ML ensemble forecasting engine (LSTM, Transformer, XGBoost, Reinforcement Learning).',
    techStack: ['Python', 'FastAPI', 'PyTorch', 'Kafka', 'Redis'],
    features: [
      'Multi-factor confluence intelligence engine',
      'Real-time event-driven streaming via Kafka + Redis Streams',
      'Backtesting infrastructure and explainable AI reasoning',
    ],
    metrics: 'Sub-100ms Analytical Latency',
    githubUrl: 'https://github.com/Thesuraj01',
    level: 'LV 02',
  },
  {
    id: 'proj-3',
    code: 'PROJECT 003',
    title: 'MeDict AI',
    subtitle: 'Deep Learning Lung Cancer Detection',
    description: 'Designed a deep learning diagnostic system achieving 81% accuracy in lung cancer detection using VGG16, with cross-verification via ResNet50, InceptionV3, and EfficientNet ensemble models.',
    techStack: ['Python', 'TensorFlow', 'Streamlit', 'VGG16'],
    features: [
      '81% detection accuracy using fine-tuned VGG16 architecture',
      'Streamlit UI reducing diagnosis review from 5 min to 10 sec',
      'Multi-model cross-verification',
    ],
    metrics: '10s Diagnostic Speed',
    githubUrl: 'https://github.com/TheSuraj01/MeDict',
    level: 'LV 03',
  },
  {
    id: 'proj-4',
    code: 'PROJECT 004',
    title: 'ZipIgnore',
    subtitle: 'Automated Python Project Packaging Utility',
    description: 'A Python-based CLI utility published on PyPI that simplifies project packaging by creating ZIP archives while automatically excluding files and directories that should not be distributed, such as cache files, virtual environments, and build artifacts.',
    techStack: ['Python', 'CLI', 'PyPI', 'Automation'],
    features: [
      'Automated exclusion of unwanted files and folders to reduce archive size',
      'Consistent packaging across development teams',
      'Improved security by preventing accidental inclusion of non-essential files',
    ],
    metrics: 'Published Open Source Tool',
    githubUrl: 'https://pypi.org/project/ZipIgnore/',
    demoUrl: 'https://pypi.org/project/ZipIgnore/',
    badge: 'DevTools',
    level: 'LV 04',
  },
];

export const EXPERIENCES = [
  {
    role: 'Software Engineer',
    company: 'Spotline, Inc. | Bhubaneswar',
    period: 'May 2025 – Present',
    description: 'Architected V-Assure ScriptGen Extension, engineered DB-Compare for high-performance DB validation, led a production-grade Agentic-RAG system with LangGraph & MongoDB Atlas, and contributed to a MS Teams AI Knowledge Bot.',
  },
  {
    role: 'Salesforce Development Intern',
    company: 'SmartInternz (Virtual)',
    period: 'May 2024 – Jun 2024',
    description: 'Developed Apex triggers and automated workflows on Salesforce CRM, reducing manual intervention by 30% and optimizing business process automation.',
  },
];

export const EDUCATION_INFO = {
  institution: 'KIIT Deemed University',
  degree: 'Bachelor of Technology — Computer Science & Engineering (CGPA: 8.35 / 10.0)',
  certifications: [
    'AWS Academy Graduate — Introduction to Cloud Foundations',
    'Cognite Game v4.5 — Certified (Cognite)',
  ],
  extracurricular: [
    'Led 3 end-to-end production systems at Spotline Inc. within the first year as an SE',
    'National Service Scheme (NSS) | General Volunteer (2022 – Present)',
  ],
};

export const ARTICLES: Article[] = [
  {
    id: 'art-1',
    code: '01',
    title: 'Traveling: The Best Way to Learn About Life',
    category: 'Life & Experiences',
    date: 'Published',
    readTime: '4 min read',
    summary:
      'A deep dive into how traveling exposes us to new cultures, challenges our perspectives, and serves as the greatest teacher in life.',
    content: `Traveling is more than just a leisure activity; it is a profound journey of self-discovery and education. When we step outside our comfort zones and immerse ourselves in unfamiliar environments, we open our minds to new ways of thinking and living.

Every destination offers a unique classroom. From understanding the historical context of ancient ruins to navigating the bustling streets of a foreign city, travel teaches us adaptability, empathy, and resilience. It challenges our preconceived notions and forces us to confront our biases. 

By meeting people from diverse backgrounds and listening to their stories, we gain a broader perspective on the world and our place within it. Ultimately, traveling is the best way to learn about life because it teaches us about ourselves.`,
    link: 'https://www.linkedin.com/pulse/traveling-best-way-learn-life-suraj-kumar-yadav-sy4hc'
  },
  {
    id: 'art-2',
    code: '02',
    title: 'The Digital Facade: How Wealthy Individuals Manipulate Public Perception Using Social Media',
    category: 'Society & Tech',
    date: 'Published',
    readTime: '5 min read',
    summary:
      'An analysis of the strategies used by the affluent to curate their online presence, shape public opinion, and maintain a facade of perfection.',
    content: `In the age of social media, public perception is often carefully engineered. For wealthy individuals and public figures, platforms like Instagram, Twitter, and LinkedIn serve as powerful tools to construct a specific narrative and maintain a 'digital facade.'

This curated online presence goes beyond mere vanity. It is a strategic effort to shape public opinion, deflect criticism, and project an image of success, philanthropy, or relatability. By controlling the narrative, they can influence everything from stock prices to political discourse.

However, this digital manipulation can also create unrealistic standards and foster a sense of inadequacy among the general public. Recognizing the difference between authentic expression and calculated PR is crucial in navigating the modern digital landscape.`,
    link: 'https://www.linkedin.com/pulse/digital-facade-how-wealthy-individuals-manipulate-public-yadav-uetqc'
  },
  {
    id: 'art-3',
    code: '03',
    title: 'Chandrayaan 3: Unveiling the Triumph of Truth and Our Cosmic Love Story',
    category: 'Space & Science',
    date: 'Published',
    readTime: '6 min read',
    summary:
      'Reflecting on ISRO\'s Chandrayaan 3 mission, exploring the scientific triumph, the resilience of the human spirit, and humanity\'s enduring fascination with the cosmos.',
    content: `The successful landing of Chandrayaan 3 is not just a scientific milestone for India; it is a testament to the power of perseverance and the triumph of truth. After the heartbreak of the previous mission, ISRO's scientists demonstrated unwavering dedication and resilience, analyzing failures and engineering solutions.

This mission represents more than just a technological achievement. It embodies our intrinsic human curiosity and our enduring 'cosmic love story' with the universe. The moon, a constant companion in our night sky, has inspired poets, philosophers, and scientists for millennia.

By reaching its uncharted southern pole, Chandrayaan 3 expands our understanding of the lunar surface and paves the way for future exploration. It is a reminder that when we reach for the stars with truth and dedication, we can achieve the extraordinary.`,
    link: 'https://www.linkedin.com/pulse/chandrayaan-3-unveiling-triumph-truth-our-cosmic-love-yadav'
  },
];
