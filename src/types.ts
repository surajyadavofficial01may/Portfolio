export type NavSection = 'home' | 'about' | 'projects' | 'blog' | 'contact';

export interface TechStackItem {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'ai';
  iconKey: string;
  proficiency: number; // 0-100
  description: string;
}

export interface Project {
  id: string;
  code: string; // e.g. "PROJECT 001"
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  features: string[];
  metrics?: string;
  githubUrl: string;
  demoUrl?: string;
  badge?: string;
  level: string;
}

export interface Article {
  id: string;
  code: string; // e.g. "01"
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
  link?: string;
}

export interface JourneyMetric {
  value: string;
  label: string;
  sublabel: string;
  iconName: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface GameEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  facing: 'left' | 'right';
  animFrame: number;
}
