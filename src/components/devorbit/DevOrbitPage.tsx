import React, { useState, useEffect, useMemo } from 'react';
import {
  Home,
  Box,
  Users,
  BookOpen,
  Trophy,
  Mail,
  Github,
  ArrowRight,
  Rocket,
  Star,
  GitFork,
  Globe,
  CheckCircle2,
  Search,
  ExternalLink,
  Terminal,
  Code2,
  Cpu,
  Cloud,
  Sparkles,
  Menu,
  X,
  Play,
  Linkedin,
  Send,
  ShieldCheck,
  Sun,
  Moon,
  ArrowLeft,
} from 'lucide-react';
import {
  DEVORBIT_LINKS,
  DEVORBIT_PROJECTS,
  PROJECT_CATEGORIES,
  DEVORBIT_RESOURCES,
  CONTRIBUTION_STEPS,
  CONTRIBUTOR_CATEGORIES,
  COMMUNITY_GUIDELINES_TEXT,
  DevOrbitProjectCategory,
} from '../../data/devorbitData';
import {
  DevOrbitLogo,
  PixelRingedPlanet,
  HeroSpaceIllustration,
  FeatureIslandOpenSource,
  FeatureIslandCommunity,
  FeatureIslandLearning,
  FeatureIslandBuild,
  ProjectCardIcon,
  RocketLaunchIllustration,
  PixelHeartIcon,
} from './DevOrbitIllustrations';

interface DevOrbitPageProps {
  onNavigatePortfolio?: (section?: 'home' | 'contact') => void;
}

interface RepoLiveStats {
  stars: number;
  forks: number;
  updatedAt: string;
}

const GITHUB_CACHE_KEY = 'devorbit_github_stats_cache_v1';
const GITHUB_CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

const DiscordIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Recently updated';
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  if (diffDays === 0) return 'Updated today';
  if (diffDays === 1) return 'Updated 1d ago';
  if (diffDays < 30) return `Updated ${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `Updated ${diffMonths}mo ago`;
  return `Updated ${Math.floor(diffMonths / 12)}y ago`;
}

export const DevOrbitPage: React.FC<DevOrbitPageProps> = ({ onNavigatePortfolio }) => {
  const [activeNav, setActiveNav] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<DevOrbitProjectCategory>('All Projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [selectedResourceCategory, setSelectedResourceCategory] = useState<string>('All');
  const [activeContributorTab, setActiveContributorTab] = useState<string>('core');
  const [guidelinesModalOpen, setGuidelinesModalOpen] = useState(false);

  // Live GitHub public data state (honest metrics, cached with fallback)
  const [repoStats, setRepoStats] = useState<Record<string, RepoLiveStats>>({});
  const [userPublicRepos, setUserPublicRepos] = useState<number | null>(null);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [contactFeedback, setContactFeedback] = useState('');

  // Configure SEO metadata & dark theme on mount
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'DevOrbit | Discover. Build. Collaborate. Grow.';

    const setMetaTag = (selector: string, attr: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (selector.includes('property=')) {
          const propMatch = selector.match(/property="([^"]+)"/);
          if (propMatch) el.setAttribute('property', propMatch[1]);
        } else if (selector.includes('name=')) {
          const nameMatch = selector.match(/name="([^"]+)"/);
          if (nameMatch) el.setAttribute('name', nameMatch[1]);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, content);
    };

    const desc =
      'DevOrbit is an open developer community where beginners, software engineers, AI enthusiasts, and open-source contributors discover projects, collaborate, and grow together.';
    setMetaTag('meta[name="description"]', 'content', desc);
    setMetaTag('meta[property="og:title"]', 'content', 'DevOrbit | Discover. Build. Collaborate. Grow.');
    setMetaTag('meta[property="og:description"]', 'content', desc);
    setMetaTag('meta[property="og:url"]', 'content', `${DEVORBIT_LINKS.domain}${DEVORBIT_LINKS.canonicalPath}`);
    setMetaTag('meta[name="twitter:title"]', 'content', 'DevOrbit | Discover. Build. Collaborate. Grow.');
    setMetaTag('meta[name="twitter:description"]', 'content', desc);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${DEVORBIT_LINKS.domain}${DEVORBIT_LINKS.canonicalPath}`);

    // Default to dark navy visual theme unless user explicitly chose light
    const storedTheme = localStorage.getItem('devorbit_theme');
    if (storedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    return () => {
      document.title = prevTitle;
    };
  }, []);

  // Fetch & cache real GitHub public repository data
  useEffect(() => {
    let isMounted = true;

    async function loadGitHubData() {
      try {
        const cachedRaw = localStorage.getItem(GITHUB_CACHE_KEY);
        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw);
          if (parsed && Date.now() - parsed.timestamp < GITHUB_CACHE_TTL_MS) {
            if (isMounted) {
              setRepoStats(parsed.repoStats || {});
              setUserPublicRepos(parsed.userPublicRepos ?? null);
            }
            return;
          }
        }

        const userRes = await fetch('https://api.github.com/users/Thesuraj01');
        let publicReposCount: number | null = null;
        if (userRes.ok) {
          const userData = await userRes.json();
          if (typeof userData.public_repos === 'number') {
            publicReposCount = userData.public_repos;
          }
        }

        const reposToFetch = DEVORBIT_PROJECTS.filter((p) => p.githubRepo).map((p) => p.githubRepo!);
        const statsMap: Record<string, RepoLiveStats> = {};

        await Promise.all(
          reposToFetch.map(async (repoFullName) => {
            try {
              const res = await fetch(`https://api.github.com/repos/${repoFullName}`);
              if (res.ok) {
                const data = await res.json();
                statsMap[repoFullName] = {
                  stars: typeof data.stargazers_count === 'number' ? data.stargazers_count : 0,
                  forks: typeof data.forks_count === 'number' ? data.forks_count : 0,
                  updatedAt: data.pushed_at || data.updated_at || '',
                };
              }
            } catch {
              // Graceful fallback if individual repo call fails
            }
          })
        );

        if (isMounted) {
          setRepoStats(statsMap);
          setUserPublicRepos(publicReposCount);
          localStorage.setItem(
            GITHUB_CACHE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              repoStats: statsMap,
              userPublicRepos: publicReposCount,
            })
          );
        }
      } catch {
        // Gracefully fall back to honest static placeholders if offline or rate-limited
      }
    }

    loadGitHubData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Scroll spy for active navigation item
  useEffect(() => {
    const sectionIds = ['home', 'about', 'projects', 'community', 'resources', 'contributors', 'contact'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveNav(sectionIds[i] === 'about' ? 'home' : sectionIds[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleTheme = () => {
    if (isDark) {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('devorbit_theme', 'light');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('devorbit_theme', 'dark');
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filtered projects
  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const matching = DEVORBIT_PROJECTS.filter((project) => {
      const matchesCat =
        selectedCategory === 'All Projects' || project.categories.includes(selectedCategory);
      const matchesQuery =
        !query ||
        project.name.toLowerCase().includes(query) ||
        project.shortDescription.toLowerCase().includes(query) ||
        project.fullDescription.toLowerCase().includes(query) ||
        project.techStack.some((t) => t.toLowerCase().includes(query));
      return matchesCat && matchesQuery;
    });

    if (!showAllProjects && selectedCategory === 'All Projects' && !query) {
      return matching.slice(0, 3);
    }
    return matching;
  }, [selectedCategory, searchQuery, showAllProjects]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    if (selectedResourceCategory === 'All') return DEVORBIT_RESOURCES;
    return DEVORBIT_RESOURCES.filter((r) => r.category === selectedResourceCategory);
  }, [selectedResourceCategory]);

  // Live aggregated stars across verified repos (honest fallback if 0 or not yet fetched)
  const totalLiveStars = useMemo(() => {
    const values = Object.values(repoStats) as RepoLiveStats[];
    if (values.length === 0) return null;
    const sum = values.reduce((acc, item) => acc + (item.stars || 0), 0);
    return sum > 0 ? `${sum}` : 'Growing';
  }, [repoStats]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;
    setContactStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          message: `[DevOrbit Community] ${contactMessage.trim()}`,
        }),
      });
      if (res.ok) {
        setContactStatus('sent');
        setContactFeedback('Thank you! Your message has been received by the DevOrbit team.');
        setContactName('');
        setContactEmail('');
        setContactMessage('');
      } else {
        setContactStatus('error');
        setContactFeedback('Unable to send right now. Please connect with us via GitHub or LinkedIn.');
      }
    } catch {
      setContactStatus('error');
      setContactFeedback('Unable to send right now. Please connect with us via GitHub or LinkedIn.');
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={15} /> },
    { id: 'projects', label: 'Projects', icon: <Box size={15} /> },
    { id: 'community', label: 'Community', icon: <Users size={15} /> },
    { id: 'resources', label: 'Resources', icon: <BookOpen size={15} /> },
    { id: 'contributors', label: 'Contributors', icon: <Trophy size={15} /> },
    { id: 'contact', label: 'Contact', icon: <Mail size={15} /> },
  ];

  return (
    <div
      className={`min-h-screen w-full max-w-[100vw] overflow-x-hidden transition-colors duration-200 font-sans ${
        isDark
          ? 'bg-[#050B1D] text-[#F5F7FF] selection:bg-[#36C8FF] selection:text-[#050B1D]'
          : 'bg-[#F3F6FC] text-[#0B1430] selection:bg-[#3578FF] selection:text-white'
      }`}
    >
      {/* Subtle Cosmic Perspective Grid & Starfield Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          backgroundImage: isDark
            ? `radial-gradient(circle at 18% 12%, rgba(150, 87, 255, 0.14) 0%, transparent 40%),
               radial-gradient(circle at 82% 22%, rgba(54, 200, 255, 0.14) 0%, transparent 45%),
               radial-gradient(circle at 50% 80%, rgba(53, 120, 255, 0.10) 0%, transparent 50%),
               linear-gradient(to right, rgba(65, 145, 255, 0.04) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(65, 145, 255, 0.04) 1px, transparent 1px)`
            : `radial-gradient(circle at 18% 12%, rgba(53, 120, 255, 0.08) 0%, transparent 40%),
               linear-gradient(to right, rgba(11, 20, 48, 0.04) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(11, 20, 48, 0.04) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 48px 48px, 48px 48px',
        }}
      />

      {/* TOP NAVIGATION BAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors ${
          isDark
            ? 'bg-[#050B1D]/90 border-[#4191FF]/25 shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
            : 'bg-white/90 border-slate-200 shadow-xs'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[74px] flex items-center justify-between gap-3">
          {/* Left: DevOrbit Brand Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
              }}
              className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-[#36C8FF] rounded-lg min-w-0"
              aria-label="DevOrbit Home - Discover. Build. Collaborate. Grow."
            >
              <DevOrbitLogo className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 transition-transform duration-200 group-hover:scale-105" />
              <div className="min-w-0">
                <span
                  className={`font-display font-bold text-lg sm:text-xl tracking-tight block leading-none ${
                    isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                  }`}
                >
                  Dev<span className="text-[#36C8FF]">Orbit</span>
                </span>
                <span
                  className={`text-[10.5px] sm:text-xs block truncate mt-1 ${
                    isDark ? 'text-[#AAB7D2]' : 'text-slate-600'
                  }`}
                >
                  Discover. Build. Collaborate. Grow.
                </span>
              </div>
            </a>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav
            aria-label="DevOrbit Primary Navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative px-3.5 py-2.5 min-h-[44px] inline-flex items-center gap-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? isDark
                        ? 'text-[#F5F7FF] bg-[#3578FF]/15 shadow-[0_8px_20px_-6px_rgba(54,200,255,0.45)]'
                        : 'text-[#3578FF] bg-blue-50 font-semibold'
                      : isDark
                      ? 'text-[#AAB7D2] hover:text-[#F5F7FF] hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className={isActive ? 'text-[#36C8FF]' : ' opacity-80'}>{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-gradient-to-r from-[#36C8FF] via-[#3578FF] to-[#9657FF] shadow-[0_0_12px_#36C8FF]"
                      aria-hidden="true"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Far Right: Back to Portfolio, Join Discord CTA, GitHub Icon, Theme Toggle, Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <a
              href={DEVORBIT_LINKS.personalPortfolio}
              onClick={(e) => {
                if (onNavigatePortfolio) {
                  e.preventDefault();
                  onNavigatePortfolio('home');
                }
              }}
              aria-label="Return to Suraj Yadav's Main Portfolio"
              title="Return to Main Portfolio"
              className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 min-h-[40px] sm:min-h-[42px] rounded-full text-xs sm:text-sm font-semibold border transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isDark
                  ? 'bg-[#11264A]/85 hover:bg-[#193566] text-[#36C8FF] hover:text-[#F5F7FF] border-[#36C8FF]/45 shadow-[0_0_16px_rgba(54,200,255,0.2)]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
              }`}
            >
              <ArrowLeft size={15} className="shrink-0" />
              <span>Portfolio</span>
            </a>

            <a
              href={DEVORBIT_LINKS.discordInvite}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:inline-flex items-center gap-2 px-4 py-2 min-h-[42px] rounded-full text-xs sm:text-sm font-semibold border transition-all whitespace-nowrap shrink-0 ${
                isDark
                  ? 'bg-[#0D1B38]/90 hover:bg-[#11264A] text-[#F5F7FF] border-[#4191FF]/50 shadow-[0_0_20px_rgba(53,120,255,0.28)] hover:border-[#36C8FF]'
                  : 'bg-[#0B1430] hover:bg-[#11264A] text-white border-[#3578FF]'
              }`}
            >
              <DiscordIcon className="w-4 h-4 text-[#6CE5FF]" />
              <span>Join Discord</span>
              <ArrowRight size={14} className="text-[#36C8FF]" />
            </a>

            <a
              href={DEVORBIT_LINKS.githubOrg}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open DevOrbit GitHub"
              title="Explore on GitHub"
              className={`hidden sm:flex w-10 h-10 sm:w-11 sm:h-11 rounded-full border items-center justify-center transition-all ${
                isDark
                  ? 'bg-[#0D1B38]/80 hover:bg-[#11264A] text-[#F5F7FF] border-[#4191FF]/35 hover:border-[#36C8FF]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
              }`}
            >
              <Github size={19} />
            </a>

            <button
              type="button"
              onClick={handleToggleTheme}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#0D1B38]/80 hover:bg-[#11264A] text-[#36C8FF] border-[#4191FF]/35'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="devorbit-mobile-menu"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className={`lg:hidden w-11 h-11 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#0D1B38] text-[#F5F7FF] border-[#4191FF]/40 hover:border-[#36C8FF]'
                  : 'bg-slate-100 text-slate-900 border-slate-300'
              }`}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div
            id="devorbit-mobile-menu"
            className={`lg:hidden border-b px-4 pt-3 pb-5 space-y-3 ${
              isDark ? 'bg-[#08122B]/98 border-[#4191FF]/30' : 'bg-white border-slate-200'
            }`}
          >
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`min-h-[44px] px-3.5 py-2.5 rounded-xl border text-left flex items-center gap-2.5 text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#3578FF]/20 text-[#36C8FF] border-[#36C8FF]/60 font-semibold'
                        : isDark
                        ? 'bg-[#0D1B38]/80 text-[#AAB7D2] border-[#4191FF]/20 hover:text-white'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="text-[#36C8FF]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <a
                href={DEVORBIT_LINKS.discordInvite}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3578FF] to-[#9657FF] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <DiscordIcon className="w-4 h-4" />
                <span>Join DevOrbit Discord</span>
                <ArrowRight size={15} />
              </a>

              <a
                href={DEVORBIT_LINKS.personalPortfolio}
                onClick={(e) => {
                  if (onNavigatePortfolio) {
                    e.preventDefault();
                    onNavigatePortfolio('home');
                  }
                }}
                className={`min-h-[44px] px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-[#0D1B38] text-[#AAB7D2] border-[#4191FF]/30 hover:text-white'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <ArrowLeft size={15} />
                <span>Suraj&apos;s Portfolio</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="relative z-10 pt-20 sm:pt-24 pb-16">
        {/* 4. HERO SECTION — PRIMARY VISUAL EXPERIENCE */}
        <section
          id="home"
          aria-labelledby="devorbit-hero-heading"
          className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-8 lg:pb-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            {/* LEFT COLUMN: Brand Introduction & Primary CTAs */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Glowing Status Badge */}
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-medium mb-5 ${
                  isDark
                    ? 'bg-[#0B2928]/80 border-[#38E69B]/45 text-[#38E69B] shadow-[0_0_20px_rgba(56,230,155,0.18)]'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                }`}
              >
                <span aria-hidden="true">🚀</span>
                <span>Open Developer Community</span>
              </div>

              {/* Pixel Planet + Main Pixel Display Heading: DevOrbit */}
              <div className="flex items-center gap-3 sm:gap-5 mb-4 max-w-full">
                <PixelRingedPlanet className="w-16 h-14 sm:w-24 sm:h-20 shrink-0" />
                <h1
                  id="devorbit-hero-heading"
                  className="font-pixel text-2xl min-[380px]:text-3xl sm:text-5xl xl:text-[54px] tracking-tight leading-none select-none"
                >
                  <span className={isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'}>Dev</span>
                  <span className="text-[#36C8FF] drop-shadow-[0_0_18px_rgba(54,200,255,0.45)]">
                    Orbit
                  </span>
                </h1>
              </div>

              {/* Multi-Color Pixel/Mono Tagline: Discover. Build. Collaborate. Grow. */}
              <p className="font-pixel text-xs min-[380px]:text-sm sm:text-base xl:text-lg tracking-wide leading-relaxed mb-5">
                <span className="text-[#36C8FF]">Discover.</span>{' '}
                <span className="text-[#C084FC]">Build.</span>{' '}
                <span className="text-[#FFBF47]">Collaborate.</span>{' '}
                <span className="text-[#38E69B]">Grow.</span>
              </p>

              {/* Hero Description */}
              <p
                className={`text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-xl mb-7 ${
                  isDark ? 'text-[#AAB7D2]' : 'text-slate-700'
                }`}
              >
                An open developer community where you can explore projects, contribute to open
                source, learn new skills, and build together with developers from around the world.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
                {/* Button 1: Explore Projects (Cyan-to-Purple Gradient) */}
                <button
                  type="button"
                  onClick={() => scrollToSection('projects')}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-full bg-gradient-to-r from-[#36C8FF] via-[#5B8CFF] to-[#9657FF] text-[#050B1D] font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2.5 shadow-[0_0_28px_rgba(54,200,255,0.4)] hover:shadow-[0_0_36px_rgba(150,87,255,0.6)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  <Github size={18} className="shrink-0" />
                  <span>Explore Projects</span>
                  <ArrowRight size={16} className="shrink-0" />
                </button>

                {/* Button 2: Join Our Community (Purple Gradient) */}
                <a
                  href={DEVORBIT_LINKS.discordInvite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-full bg-gradient-to-r from-[#5B34C9] to-[#8445FF] hover:from-[#6A3DE0] hover:to-[#9657FF] text-white font-semibold text-sm sm:text-base border border-[#A855F7]/50 inline-flex items-center justify-center gap-2.5 shadow-[0_0_24px_rgba(150,87,255,0.35)] hover:shadow-[0_0_32px_rgba(150,87,255,0.55)] hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                >
                  <DiscordIcon className="w-4 h-4 shrink-0" />
                  <span>Join Our Community</span>
                  <ArrowRight size={16} className="shrink-0" />
                </a>

                {/* Secondary Action: Learn More */}
                <button
                  type="button"
                  onClick={() => scrollToSection('about')}
                  className={`w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-full inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    isDark
                      ? 'text-[#AAB7D2] hover:text-[#F5F7FF]'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  <span className="w-7 h-7 rounded-full border border-[#9657FF]/60 bg-[#9657FF]/15 flex items-center justify-center text-[#C084FC]">
                    <Play size={12} fill="currentColor" />
                  </span>
                  <span>Learn More</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Large Space-Themed Hero Illustration */}
            <div className="lg:col-span-6 w-full flex justify-center">
              <HeroSpaceIllustration />
            </div>
          </div>
        </section>

        {/* 5. COMMUNITY STATISTICS BAR */}
        <section
          aria-label="DevOrbit Community Statistics"
          className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pb-12"
        >
          <div
            className={`rounded-2xl border px-4 py-5 sm:px-6 sm:py-5 backdrop-blur-md transition-all ${
              isDark
                ? 'bg-[#0B1430]/90 border-[#36C8FF]/40 shadow-[0_0_35px_rgba(54,200,255,0.14)]'
                : 'bg-white border-blue-200 shadow-sm'
            }`}
          >
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-0 lg:divide-x lg:divide-[#4191FF]/25">
              {/* Stat 1: Open Source Projects */}
              <div className="flex items-center justify-start lg:justify-center gap-3.5 px-3">
                <div className="w-11 h-11 rounded-xl bg-[#36C8FF]/15 border border-[#36C8FF]/35 flex items-center justify-center text-[#36C8FF] shrink-0">
                  <Rocket size={22} />
                </div>
                <div>
                  <div className="font-display font-bold text-xl sm:text-2xl tabular-nums leading-tight">
                    {userPublicRepos !== null ? `${userPublicRepos}+` : `${DEVORBIT_PROJECTS.length}+`}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-[#AAB7D2]' : 'text-slate-600'}`}>
                    Open Source Projects
                  </div>
                </div>
              </div>

              {/* Stat 2: Community Members */}
              <div className="flex items-center justify-start lg:justify-center gap-3.5 px-3">
                <div className="w-11 h-11 rounded-xl bg-[#3578FF]/15 border border-[#3578FF]/35 flex items-center justify-center text-[#36C8FF] shrink-0">
                  <Users size={22} />
                </div>
                <div>
                  <div className="font-display font-bold text-xl sm:text-2xl tabular-nums leading-tight">
                    Growing
                  </div>
                  <div className={`text-xs ${isDark ? 'text-[#AAB7D2]' : 'text-slate-600'}`}>
                    Community Members
                  </div>
                </div>
              </div>

              {/* Stat 3: GitHub Stars */}
              <div className="flex items-center justify-start lg:justify-center gap-3.5 px-3">
                <div className="w-11 h-11 rounded-xl bg-[#FFBF47]/15 border border-[#FFBF47]/35 flex items-center justify-center text-[#FFBF47] shrink-0">
                  <Star size={22} fill="currentColor" />
                </div>
                <div>
                  <div className="font-display font-bold text-xl sm:text-2xl tabular-nums leading-tight">
                    {totalLiveStars ?? 'Growing'}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-[#AAB7D2]' : 'text-slate-600'}`}>
                    GitHub Stars
                  </div>
                </div>
              </div>

              {/* Stat 4: Total Contributions */}
              <div className="flex items-center justify-start lg:justify-center gap-3.5 px-3">
                <div className="w-11 h-11 rounded-xl bg-[#9657FF]/15 border border-[#9657FF]/35 flex items-center justify-center text-[#C084FC] shrink-0">
                  <GitFork size={22} />
                </div>
                <div>
                  <div className="font-display font-bold text-xl sm:text-2xl tabular-nums leading-tight">
                    Open
                  </div>
                  <div className={`text-xs ${isDark ? 'text-[#AAB7D2]' : 'text-slate-600'}`}>
                    Total Contributions
                  </div>
                </div>
              </div>

              {/* Stat 5: Worldwide Developer Community */}
              <div className="flex items-center justify-start lg:justify-center gap-3.5 px-3 min-[420px]:col-span-2 lg:col-span-1">
                <div className="w-11 h-11 rounded-xl bg-[#38E69B]/15 border border-[#38E69B]/35 flex items-center justify-center text-[#38E69B] shrink-0">
                  <Globe size={22} />
                </div>
                <div>
                  <div className="font-display font-bold text-xl sm:text-2xl leading-tight">
                    Worldwide
                  </div>
                  <div className={`text-xs ${isDark ? 'text-[#AAB7D2]' : 'text-slate-600'}`}>
                    Developer Community
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. ABOUT DEVORBIT SECTION */}
        <section
          id="about"
          aria-labelledby="what-is-devorbit-heading"
          className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* LEFT SIDE: What is DevOrbit? */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="font-pixel text-sm sm:text-base text-[#36C8FF]" aria-hidden="true">
                    &gt;&gt;
                  </span>
                  <h2
                    id="what-is-devorbit-heading"
                    className="font-pixel text-base sm:text-xl leading-snug"
                  >
                    What is <span className="text-[#FFBF47]">DevOrbit?</span>
                  </h2>
                </div>

                <p
                  className={`text-sm sm:text-[15px] leading-relaxed mb-5 ${
                    isDark ? 'text-[#AAB7D2]' : 'text-slate-700'
                  }`}
                >
                  DevOrbit is more than just a community — it&apos;s a place where{' '}
                  <span
                    className={`underline decoration-[#36C8FF]/60 underline-offset-4 ${
                      isDark ? 'text-[#F5F7FF]' : 'text-slate-900 font-medium'
                    }`}
                  >
                    developers come together
                  </span>{' '}
                  to{' '}
                  <span
                    className={`underline decoration-[#36C8FF]/60 underline-offset-4 ${
                      isDark ? 'text-[#F5F7FF]' : 'text-slate-900 font-medium'
                    }`}
                  >
                    learn, share
                  </span>
                  , collaborate, and build amazing things.
                </p>

                <ul className="space-y-3 mb-7">
                  {[
                    'Open-source projects and developer tools',
                    'Collaborative development and discussions',
                    'Learning resources for all skill levels',
                    'A supportive community that grows together',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2
                        size={18}
                        className="text-[#36C8FF] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className={isDark ? 'text-[#F5F7FF]/90' : 'text-slate-800'}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-to-contribute')}
                  className={`min-h-[44px] px-5 py-2.5 rounded-full border text-sm font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
                    isDark
                      ? 'bg-[#0D1B38]/90 hover:bg-[#11264A] text-[#F5F7FF] border-[#36C8FF]/50 shadow-[0_0_18px_rgba(54,200,255,0.2)]'
                      : 'bg-white hover:bg-slate-100 text-[#0B1430] border-blue-400'
                  }`}
                >
                  <span>About DevOrbit</span>
                  <ArrowRight size={15} className="text-[#36C8FF]" />
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: Four Equal-Height Feature Cards with Pixel-Art Floating Islands */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Card 1: Open Source */}
              <div
                className={`group rounded-2xl border p-5 flex flex-col justify-between text-center transition-all duration-200 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-gradient-to-b from-[#0D1B38] to-[#081229] border-[#4191FF]/30 hover:border-[#36C8FF] hover:shadow-[0_10px_30px_rgba(54,200,255,0.18)]'
                    : 'bg-white border-slate-200 hover:border-blue-400 shadow-xs'
                }`}
              >
                <div>
                  <div className="mb-3 transition-transform duration-200 group-hover:scale-105">
                    <FeatureIslandOpenSource />
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg mb-1.5">
                    Open Source
                  </h3>
                  <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-[#AAB7D2]' : 'text-slate-600'}`}>
                    Explore repositories, contribute, and build.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToSection('projects')}
                  className="min-h-[38px] inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#36C8FF] hover:underline cursor-pointer mx-auto"
                >
                  <span>View Projects</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Card 2: Community */}
              <div
                className={`group rounded-2xl border p-5 flex flex-col justify-between text-center transition-all duration-200 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-gradient-to-b from-[#0D1B38] to-[#081229] border-[#4191FF]/30 hover:border-[#9657FF] hover:shadow-[0_10px_30px_rgba(150,87,255,0.2)]'
                    : 'bg-white border-slate-200 hover:border-purple-400 shadow-xs'
                }`}
              >
                <div>
                  <div className="mb-3 transition-transform duration-200 group-hover:scale-105">
                    <FeatureIslandCommunity />
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg mb-1.5">
                    Community
                  </h3>
                  <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-[#AAB7D2]' : 'text-slate-600'}`}>
                    Discuss, ask, share, and connect with developers.
                  </p>
                </div>
                <a
                  href={DEVORBIT_LINKS.discordInvite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[38px] inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#36C8FF] hover:underline mx-auto"
                >
                  <span>Join Discord</span>
                  <ArrowRight size={13} />
                </a>
              </div>

              {/* Card 3: Learning */}
              <div
                className={`group rounded-2xl border p-5 flex flex-col justify-between text-center transition-all duration-200 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-gradient-to-b from-[#0D1B38] to-[#081229] border-[#4191FF]/30 hover:border-[#FFBF47] hover:shadow-[0_10px_30px_rgba(255,191,71,0.16)]'
                    : 'bg-white border-slate-200 hover:border-amber-400 shadow-xs'
                }`}
              >
                <div>
                  <div className="mb-3 transition-transform duration-200 group-hover:scale-105">
                    <FeatureIslandLearning />
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg mb-1.5">
                    Learning
                  </h3>
                  <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-[#AAB7D2]' : 'text-slate-600'}`}>
                    Access guides, tutorials, and technical resources.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToSection('resources')}
                  className="min-h-[38px] inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#36C8FF] hover:underline cursor-pointer mx-auto"
                >
                  <span>Explore Resources</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Card 4: Build Together */}
              <div
                className={`group rounded-2xl border p-5 flex flex-col justify-between text-center transition-all duration-200 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-gradient-to-b from-[#0D1B38] to-[#081229] border-[#4191FF]/30 hover:border-[#38E69B] hover:shadow-[0_10px_30px_rgba(56,230,155,0.18)]'
                    : 'bg-white border-slate-200 hover:border-emerald-400 shadow-xs'
                }`}
              >
                <div>
                  <div className="mb-3 transition-transform duration-200 group-hover:scale-105">
                    <FeatureIslandBuild />
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg mb-1.5">
                    Build Together
                  </h3>
                  <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-[#AAB7D2]' : 'text-slate-600'}`}>
                    Turn ideas into real-world projects.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-to-contribute')}
                  className="min-h-[38px] inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#36C8FF] hover:underline cursor-pointer mx-auto"
                >
                  <span>Start Contributing</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FEATURED PROJECTS SECTION */}
        <section
          id="projects"
          aria-labelledby="featured-projects-heading"
          className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10"
        >
          <div
            className={`rounded-3xl border p-5 sm:p-7 ${
              isDark
                ? 'bg-[#0B1430]/80 border-[#4191FF]/25 shadow-[0_12px_40px_rgba(0,0,0,0.45)]'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="font-pixel text-sm text-[#36C8FF]" aria-hidden="true">
                    &gt;&gt;
                  </span>
                  <h2
                    id="featured-projects-heading"
                    className="font-pixel text-base sm:text-xl tracking-tight"
                  >
                    Featured Projects
                  </h2>
                </div>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-[#AAB7D2]' : 'text-slate-600'}`}>
                  Explore projects built by the DevOrbit ecosystem &amp; Suraj Yadav&apos;s engineering workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAllProjects((prev) => !prev)}
                className="self-start sm:self-auto min-h-[40px] inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#36C8FF] hover:underline cursor-pointer whitespace-nowrap"
              >
                <span>{showAllProjects ? 'Show Initial Featured (3)' : 'View All Projects'}</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Search & Category Filter Controls */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 mb-6">
              {/* Category Segmented Filter Buttons */}
              <div
                className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide"
                role="tablist"
                aria-label="Filter projects by category"
              >
                {PROJECT_CATEGORIES.map((category) => {
                  const active = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCategory(category)}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-[#3578FF] text-white shadow-[0_0_16px_rgba(53,120,255,0.45)]'
                          : isDark
                          ? 'bg-[#0D1B38] text-[#AAB7D2] border border-[#4191FF]/20 hover:text-white hover:border-[#36C8FF]/40'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Search Input */}
              <div className="relative w-full lg:w-72 shrink-0">
                <Search
                  size={15}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                    isDark ? 'text-[#AAB7D2]' : 'text-slate-400'
                  }`}
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects or tech stack..."
                  aria-label="Search projects by name, description, or stack"
                  className={`w-full min-h-[40px] pl-9 pr-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none transition-colors ${
                    isDark
                      ? 'bg-[#0D1B38] border-[#4191FF]/30 text-[#F5F7FF] placeholder-[#AAB7D2]/60 focus:border-[#36C8FF]'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            {/* Project Cards Grid */}
            {filteredProjects.length === 0 ? (
              <div
                className={`rounded-2xl border p-8 text-center ${
                  isDark ? 'bg-[#0D1B38]/60 border-[#4191FF]/20' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <p className="text-sm font-medium mb-2">
                  No projects matched &ldquo;{searchQuery}&rdquo; in {selectedCategory}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All Projects');
                    setSearchQuery('');
                  }}
                  className="text-xs font-semibold text-[#36C8FF] underline cursor-pointer"
                >
                  Reset project filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredProjects.map((project) => {
                  const live = project.githubRepo ? repoStats[project.githubRepo] : undefined;
                  return (
                    <article
                      key={project.id}
                      className={`group rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 ${
                        isDark
                          ? 'bg-gradient-to-br from-[#0D1B38] to-[#081228] border-[#4191FF]/30 hover:border-[#36C8FF] hover:shadow-[0_10px_28px_rgba(54,200,255,0.16)]'
                          : 'bg-slate-50/70 border-slate-200 hover:border-blue-400'
                      }`}
                    >
                      <div>
                        {/* Top row: Icon + Title + Description */}
                        <div className="flex items-start gap-3.5 mb-3.5">
                          <ProjectCardIcon type={project.iconType} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-display font-bold text-base sm:text-lg truncate">
                                {project.name}
                              </h3>
                            </div>
                            <p
                              className={`text-xs sm:text-[13px] leading-relaxed mt-1 ${
                                isDark ? 'text-[#AAB7D2]' : 'text-slate-600'
                              }`}
                            >
                              {project.shortDescription}
                            </p>
                          </div>
                        </div>

                        {/* Unboxed Metadata: Tech Stack & Ownership */}
                        <div
                          className={`text-[11px] font-mono-tech mb-4 leading-relaxed ${
                            isDark ? 'text-[#AAB7D2]/85' : 'text-slate-600'
                          }`}
                        >
                          <span>{project.techStack.join(' · ')}</span>
                          <span aria-hidden="true"> / </span>
                          <span className="text-[#36C8FF]">{project.status}</span>
                        </div>
                      </div>

                      {/* Bottom Footer: Stars / Honest Status + Action Link */}
                      <div
                        className={`pt-3.5 border-t flex items-center justify-between gap-2 ${
                          isDark ? 'border-[#4191FF]/20' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 text-xs">
                          {live ? (
                            <>
                              <span className="inline-flex items-center gap-1 font-semibold text-[#FFBF47] tabular-nums">
                                <Star size={14} fill="currentColor" />
                                <span>{live.stars}</span>
                              </span>
                              <span className={isDark ? 'text-[#AAB7D2]' : 'text-slate-500'}>
                                {formatRelativeTime(live.updatedAt)}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="inline-flex items-center gap-1 font-medium text-[#FFBF47]">
                                <Star size={14} fill="currentColor" />
                                <span>{project.status}</span>
                              </span>
                              <span
                                className={`hidden sm:inline text-[11px] ${
                                  isDark ? 'text-[#AAB7D2]' : 'text-slate-500'
                                }`}
                              >
                                · Suraj Yadav
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open live demo for ${project.name}`}
                              title="Live Demo"
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-colors ${
                                isDark
                                  ? 'bg-[#11264A] text-[#36C8FF] hover:bg-[#3578FF] hover:text-white'
                                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                              }`}
                            >
                              <span>Demo</span>
                              <ExternalLink size={12} />
                            </a>
                          )}

                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`View ${project.name} repository`}
                              title={`Explore ${project.name}`}
                              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                                isDark
                                  ? 'border-[#4191FF]/40 text-[#AAB7D2] group-hover:border-[#36C8FF] group-hover:text-[#F5F7FF] group-hover:bg-[#3578FF]/20'
                                  : 'border-slate-300 text-slate-700 group-hover:border-blue-500'
                              }`}
                            >
                              <ArrowRight size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 8. COMMUNITY SECTION & 12. CLOSING ROCKET CTA SHOWCASE */}
        <section
          id="community"
          aria-labelledby="our-community-heading"
          className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* OUR COMMUNITY SHOWCASE CARD */}
            <div
              className={`lg:col-span-6 rounded-3xl border p-6 sm:p-7 flex flex-col justify-between ${
                isDark
                  ? 'bg-gradient-to-br from-[#0D1B38] to-[#081229] border-[#4191FF]/30 shadow-[0_12px_36px_rgba(0,0,0,0.45)]'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <Users size={22} className="text-[#36C8FF]" />
                  <h2
                    id="our-community-heading"
                    className="font-pixel text-base sm:text-lg tracking-tight"
                  >
                    Our Community
                  </h2>
                </div>

                <p
                  className={`text-sm sm:text-[15px] leading-relaxed mb-5 ${
                    isDark ? 'text-[#AAB7D2]' : 'text-slate-600'
                  }`}
                >
                  A growing community of developers, contributors, engineers, learners, and creators
                  working together.
                </p>

                {/* Honest Founder Attribution + Welcoming Orbital Nodes (No Fake Stranger Avatars) */}
                <div
                  className={`rounded-2xl border p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isDark ? 'bg-[#0B1430]/90 border-[#4191FF]/25' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 overflow-hidden items-center">
                      <img
                        src="https://github.com/Thesuraj01.png"
                        alt="Suraj Kumar Yadav - DevOrbit Founder"
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full border-2 border-[#36C8FF] object-cover bg-[#0D1B38]"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="w-10 h-10 rounded-full border-2 border-[#0B1430] bg-[#11264A] text-[#36C8FF] flex items-center justify-center text-xs font-bold">
                        <Code2 size={16} />
                      </div>
                      <div className="w-10 h-10 rounded-full border-2 border-[#0B1430] bg-[#1E1B4B] text-[#C084FC] flex items-center justify-center text-xs font-bold">
                        <Sparkles size={16} />
                      </div>
                      <div className="w-10 h-10 rounded-full border-2 border-[#36C8FF]/60 bg-[#0D1B38] text-[#36C8FF] flex items-center justify-center font-mono-tech text-xs font-bold">
                        +You
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold">
                        Open to Builders Worldwide
                      </div>
                      <div className={`text-xs ${isDark ? 'text-[#AAB7D2]' : 'text-slate-500'}`}>
                        Code reviews · Open-source mentorship · Architecture discussions
                      </div>
                    </div>
                  </div>
                </div>

                {/* Participation Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#38E69B] shrink-0" />
                    <span>Real-world open-source collaboration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#36C8FF] shrink-0" />
                    <span>Project showcases &amp; peer feedback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#C084FC] shrink-0" />
                    <span>AI, Web &amp; Systems study tracks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#FFBF47] shrink-0" />
                    <span>Inclusive beginner-friendly issues</span>
                  </div>
                </div>
              </div>

              {/* Community Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={DEVORBIT_LINKS.discordInvite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-5 py-2.5 rounded-full bg-gradient-to-r from-[#5B34C9] to-[#8445FF] hover:from-[#6A3DE0] hover:to-[#9657FF] text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-[0_0_20px_rgba(150,87,255,0.35)] transition-all"
                >
                  <span>Join DevOrbit Community</span>
                  <ArrowRight size={15} />
                </a>

                <a
                  href={DEVORBIT_LINKS.githubOrg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`min-h-[44px] px-4 py-2.5 rounded-full border text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors ${
                    isDark
                      ? 'border-[#4191FF]/35 text-[#36C8FF] hover:bg-[#11264A]'
                      : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span>Explore on GitHub</span>
                  <ArrowRight size={14} />
                </a>

                <button
                  type="button"
                  onClick={() => setGuidelinesModalOpen(true)}
                  className={`min-h-[40px] px-3 py-2 text-xs font-medium underline cursor-pointer ${
                    isDark ? 'text-[#AAB7D2] hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Community Guidelines
                </button>
              </div>
            </div>

            {/* 12. COMMUNITY CALL-TO-ACTION SECTION (Futuristic Rocket Launch Card from Reference) */}
            <div
              className={`lg:col-span-6 rounded-3xl border-2 p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between ${
                isDark
                  ? 'bg-gradient-to-br from-[#08152E] via-[#0B1430] to-[#1A103C] border-[#38E69B]/55 shadow-[0_0_35px_rgba(56,230,155,0.15)]'
                  : 'bg-gradient-to-br from-[#0B1430] to-[#1A103C] text-white border-[#38E69B]'
              }`}
            >
              {/* Subtle Corner Accent Details */}
              <span
                className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#38E69B]"
                aria-hidden="true"
              />
              <span
                className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#36C8FF]"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center relative z-10">
                <div className="sm:col-span-7">
                  <div className="font-pixel text-sm text-[#FFBF47] mb-3 select-none">
                    &gt;_
                  </div>
                  <h2 className="font-pixel text-base sm:text-xl text-[#38E69B] leading-relaxed mb-3">
                    Let&apos;s build something amazing together!
                  </h2>
                  <p className="text-xs sm:text-sm text-[#AAB7D2] leading-relaxed mb-4">
                    Your ideas, your skills, and your contributions can help shape the next
                    generation of open-source projects.
                  </p>
                  <div className="mb-4">
                    <PixelHeartIcon className="w-7 h-7" />
                  </div>
                </div>

                <div className="sm:col-span-5 flex justify-center sm:justify-end">
                  <RocketLaunchIllustration className="w-40 h-40 sm:w-44 sm:h-44" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 relative z-10">
                <a
                  href={DEVORBIT_LINKS.discordInvite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-5 py-2.5 rounded-full bg-[#38E69B] hover:bg-[#2AD189] text-[#050B1D] font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(56,230,155,0.4)]"
                >
                  <DiscordIcon className="w-4 h-4" />
                  <span>Join DevOrbit Discord</span>
                </a>

                <a
                  href={DEVORBIT_LINKS.githubOrg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-5 py-2.5 rounded-full bg-[#11264A]/90 hover:bg-[#193566] text-[#F5F7FF] border border-[#36C8FF]/50 font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-all"
                >
                  <Github size={16} />
                  <span>Explore GitHub Organization</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 9. RESOURCES AND LEARNING SECTION */}
        <section
          id="resources"
          aria-labelledby="resources-heading"
          className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="font-pixel text-sm text-[#36C8FF]" aria-hidden="true">
                  &gt;&gt;
                </span>
                <h2
                  id="resources-heading"
                  className="font-pixel text-base sm:text-xl tracking-tight"
                >
                  Learn. Explore. Build.
                </h2>
              </div>
              <p className={`text-sm ${isDark ? 'text-[#AAB7D2]' : 'text-slate-600'}`}>
                Curated engineering documentation, open-source handbooks, and practical learning paths.
              </p>
            </div>

            {/* Resource Category Tabs */}
            <div
              className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide"
              role="tablist"
              aria-label="Resource categories"
            >
              {[
                'All',
                'Getting Started',
                'Development',
                'AI & Machine Learning',
                'Engineering & Infrastructure',
              ].map((cat) => {
                const active = selectedResourceCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedResourceCategory(cat)}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#3578FF] text-white'
                        : isDark
                        ? 'bg-[#0D1B38] text-[#AAB7D2] border border-[#4191FF]/20 hover:text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((res) => {
              const getCategoryIcon = () => {
                switch (res.category) {
                  case 'Getting Started':
                    return <Terminal size={18} className="text-[#36C8FF]" />;
                  case 'Development':
                    return <Code2 size={18} className="text-[#C084FC]" />;
                  case 'AI & Machine Learning':
                    return <Cpu size={18} className="text-[#FFBF47]" />;
                  case 'Engineering & Infrastructure':
                    return <Cloud size={18} className="text-[#38E69B]" />;
                }
              };

              return (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${
                    isDark
                      ? 'bg-[#0D1B38]/85 border-[#4191FF]/25 hover:border-[#36C8FF] hover:shadow-[0_8px_24px_rgba(54,200,255,0.14)]'
                      : 'bg-white border-slate-200 hover:border-blue-400 shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="inline-flex items-center gap-2 text-xs font-medium text-[#36C8FF]">
                        {getCategoryIcon()}
                        <span>{res.category}</span>
                      </div>
                      <span
                        className={`text-[11px] font-mono-tech ${
                          res.skillLevel === 'Beginner'
                            ? 'text-[#38E69B]'
                            : res.skillLevel === 'Intermediate'
                            ? 'text-[#36C8FF]'
                            : 'text-[#FFBF47]'
                        }`}
                      >
                        {res.skillLevel}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base mb-1.5 group-hover:text-[#36C8FF] transition-colors">
                      {res.title}
                    </h3>
                    <p
                      className={`text-xs leading-relaxed mb-4 ${
                        isDark ? 'text-[#AAB7D2]' : 'text-slate-600'
                      }`}
                    >
                      {res.description}
                    </p>
                  </div>

                  <div
                    className={`pt-3 border-t flex items-center justify-between text-xs font-medium ${
                      isDark ? 'border-[#4191FF]/15 text-[#AAB7D2]' : 'border-slate-100 text-slate-600'
                    }`}
                  >
                    <span>Source: {res.sourceLabel}</span>
                    <span className="inline-flex items-center gap-1 text-[#36C8FF] group-hover:translate-x-0.5 transition-transform">
                      <span>Open Guide</span>
                      <ExternalLink size={13} />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* 10. CONTRIBUTORS SECTION — MEET THE BUILDERS */}
        <section
          id="contributors"
          aria-labelledby="contributors-heading"
          className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10"
        >
          <div
            className={`rounded-3xl border p-6 sm:p-8 ${
              isDark
                ? 'bg-[#0B1430]/85 border-[#4191FF]/25'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <Trophy size={20} className="text-[#FFBF47]" />
                  <h2
                    id="contributors-heading"
                    className="font-pixel text-base sm:text-xl tracking-tight"
                  >
                    Meet the Builders
                  </h2>
                </div>
                <p className={`text-sm ${isDark ? 'text-[#AAB7D2]' : 'text-slate-600'}`}>
                  Every contribution matters. Meet the developers helping build the DevOrbit ecosystem.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setGuidelinesModalOpen(true)}
                className="self-start lg:self-auto min-h-[44px] px-5 py-2.5 rounded-full bg-gradient-to-r from-[#36C8FF] to-[#3578FF] text-[#050B1D] font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(54,200,255,0.3)]"
              >
                <span>Become a Contributor</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Recognition Category Selector */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
              role="tablist"
              aria-label="Contributor recognition categories"
            >
              {CONTRIBUTOR_CATEGORIES.map((cat) => {
                const active = activeContributorTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveContributorTab(cat.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      active
                        ? isDark
                          ? 'bg-[#11264A] border-[#36C8FF] shadow-[0_0_20px_rgba(54,200,255,0.2)]'
                          : 'bg-blue-50 border-blue-500'
                        : isDark
                        ? 'bg-[#0D1B38]/60 border-[#4191FF]/20 hover:border-[#4191FF]/50'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-display font-bold text-sm mb-1 flex items-center justify-between">
                      <span>{cat.title}</span>
                      {cat.id === 'core' && (
                        <span className="text-[11px] font-mono-tech text-[#38E69B]">1 Builder</span>
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-[#AAB7D2]' : 'text-slate-600'}`}>
                      {cat.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Contributor Cards & Honest Welcoming Empty State */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Verified Core Maintainer Card */}
              <div
                className={`lg:col-span-5 rounded-2xl border p-5 flex flex-col justify-between ${
                  isDark
                    ? 'bg-[#0D1B38] border-[#36C8FF]/40'
                    : 'bg-slate-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <img
                    src="https://github.com/Thesuraj01.png"
                    alt="Suraj Kumar Yadav (@Thesuraj01)"
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl border-2 border-[#36C8FF] object-cover bg-[#050B1D] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-mono-tech text-[#36C8FF] mb-0.5">
                      Core Maintainer &amp; Founder
                    </div>
                    <h3 className="font-display font-bold text-base sm:text-lg truncate">
                      Suraj Kumar Yadav
                    </h3>
                    <p className={`text-xs font-mono-tech ${isDark ? 'text-[#AAB7D2]' : 'text-slate-600'}`}>
                      @Thesuraj01 · EVEE, TalkingHead 3D, ZipIgnore
                    </p>
                  </div>
                </div>

                <div
                  className={`mt-4 pt-3.5 border-t flex items-center justify-between text-xs ${
                    isDark ? 'border-[#4191FF]/20' : 'border-slate-200'
                  }`}
                >
                  <span className={isDark ? 'text-[#AAB7D2]' : 'text-slate-600'}>
                    {userPublicRepos !== null
                      ? `${userPublicRepos} Public Repositories`
                      : 'Active Maintainer'}
                  </span>
                  <a
                    href={DEVORBIT_LINKS.githubOrg}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-[#36C8FF] hover:underline"
                  >
                    <Github size={14} />
                    <span>GitHub Profile</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Welcoming Empty State for New Community Builders */}
              <div
                className={`lg:col-span-7 rounded-2xl border border-dashed p-6 flex flex-col items-center justify-center text-center ${
                  isDark
                    ? 'bg-[#0D1B38]/40 border-[#4191FF]/40'
                    : 'bg-slate-50 border-slate-300'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#36C8FF]/15 border border-[#36C8FF]/40 flex items-center justify-center text-[#36C8FF] mb-3">
                  <Sparkles size={22} />
                </div>
                <h3 className="font-display font-bold text-base sm:text-lg mb-1">
                  Your name could be here. Start contributing today.
                </h3>
                <p
                  className={`text-xs sm:text-sm max-w-md mb-4 ${
                    isDark ? 'text-[#AAB7D2]' : 'text-slate-600'
                  }`}
                >
                  We only list real, verified contributors who have participated in DevOrbit
                  repositories or community initiatives. Submit a PR, improve documentation, or
                  help fellow builders to join the wall!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGuidelinesModalOpen(true)}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-[#3578FF] hover:bg-[#2563EB] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Become a Contributor</span>
                    <ArrowRight size={14} />
                  </button>
                  <a
                    href={DEVORBIT_LINKS.githubOrg}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`min-h-[40px] px-4 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 ${
                      isDark
                        ? 'border-[#4191FF]/35 text-[#F5F7FF] hover:bg-[#11264A]'
                        : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <Github size={14} />
                    <span>Browse Open Issues</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. HOW TO CONTRIBUTE SECTION */}
        <section
          id="how-to-contribute"
          aria-labelledby="how-to-contribute-heading"
          className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10"
        >
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 font-mono-tech text-xs text-[#36C8FF] mb-2">
              <span>01 — 04 WORKFLOW</span>
            </div>
            <h2
              id="how-to-contribute-heading"
              className="font-pixel text-base sm:text-xl tracking-tight mb-2.5"
            >
              Your Next Contribution Starts Here
            </h2>
            <p className={`text-sm ${isDark ? 'text-[#AAB7D2]' : 'text-slate-600'}`}>
              A clear four-step path from discovering your first repository to growing with the
              community.
            </p>
          </div>

          {/* 4-Step Connected Horizontal Step Timeline (Stacks Vertically on Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative mb-8">
            {CONTRIBUTION_STEPS.map((step, index) => {
              const accentMap = {
                cyan: 'border-[#36C8FF]/45 text-[#36C8FF]',
                purple: 'border-[#9657FF]/45 text-[#C084FC]',
                gold: 'border-[#FFBF47]/45 text-[#FFBF47]',
                green: 'border-[#38E69B]/45 text-[#38E69B]',
              };
              return (
                <div
                  key={step.number}
                  className={`rounded-2xl border p-5 relative flex flex-col justify-between ${
                    isDark
                      ? 'bg-[#0D1B38]/90 border-[#4191FF]/25'
                      : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`font-pixel text-sm px-3 py-1.5 rounded-xl border bg-[#050B1D]/60 ${
                          accentMap[step.accent]
                        }`}
                      >
                        {step.number}
                      </span>
                      {index < CONTRIBUTION_STEPS.length - 1 && (
                        <ArrowRight
                          size={16}
                          className="hidden lg:block text-[#4191FF]/60"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <h3 className="font-display font-bold text-base sm:text-lg mb-1.5">
                      {step.number} — {step.title}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isDark ? 'text-[#AAB7D2]' : 'text-slate-600'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Two Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={DEVORBIT_LINKS.githubOrg}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[46px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[#36C8FF] to-[#3578FF] text-[#050B1D] font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-[0_0_24px_rgba(54,200,255,0.35)] hover:-translate-y-0.5 transition-all"
            >
              <Github size={17} />
              <span>Explore GitHub Projects</span>
            </a>

            <button
              type="button"
              onClick={() => setGuidelinesModalOpen(true)}
              className={`min-h-[46px] px-6 py-2.5 rounded-full border font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#0D1B38] border-[#4191FF]/40 text-[#F5F7FF] hover:border-[#36C8FF]'
                  : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck size={17} className="text-[#38E69B]" />
              <span>Read Contribution Guidelines</span>
            </button>
          </div>
        </section>

        {/* 13. CONTACT SECTION — LET'S CONNECT */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10"
        >
          <div
            className={`rounded-3xl border p-6 sm:p-8 ${
              isDark
                ? 'bg-gradient-to-br from-[#0B1430] to-[#081228] border-[#4191FF]/30'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Verified Community & Founder Channels */}
              <div className="lg:col-span-6">
                <div className="flex items-center gap-2.5 mb-2">
                  <Mail size={20} className="text-[#36C8FF]" />
                  <h2
                    id="contact-heading"
                    className="font-pixel text-base sm:text-xl tracking-tight"
                  >
                    Let&apos;s Connect
                  </h2>
                </div>
                <p
                  className={`text-sm sm:text-[15px] leading-relaxed mb-6 ${
                    isDark ? 'text-[#AAB7D2]' : 'text-slate-600'
                  }`}
                >
                  Have a project idea, want to collaborate, or have something interesting to share?
                  We&apos;d love to hear from you.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 1. GitHub Organization / Repositories */}
                  <a
                    href={DEVORBIT_LINKS.githubOrg}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-[#0D1B38] border-[#4191FF]/25 hover:border-[#36C8FF]'
                        : 'bg-slate-50 border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#36C8FF]/15 text-[#36C8FF] flex items-center justify-center shrink-0">
                      <Github size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-display font-bold text-sm">GitHub Repositories</div>
                      <div className={`text-xs truncate ${isDark ? 'text-[#AAB7D2]' : 'text-slate-500'}`}>
                        github.com/Thesuraj01
                      </div>
                    </div>
                  </a>

                  {/* 2. Discord Invitation */}
                  <a
                    href={DEVORBIT_LINKS.discordInvite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-[#0D1B38] border-[#4191FF]/25 hover:border-[#9657FF]'
                        : 'bg-slate-50 border-slate-200 hover:border-purple-400'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#9657FF]/15 text-[#C084FC] flex items-center justify-center shrink-0">
                      <DiscordIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-display font-bold text-sm">DevOrbit Discord</div>
                      <div className={`text-xs truncate ${isDark ? 'text-[#AAB7D2]' : 'text-slate-500'}`}>
                        Official Community Server
                      </div>
                    </div>
                  </a>

                  {/* 3. LinkedIn Community / Personal Profile */}
                  <a
                    href={DEVORBIT_LINKS.linkedinPersonal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-[#0D1B38] border-[#4191FF]/25 hover:border-[#3578FF]'
                        : 'bg-slate-50 border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#3578FF]/15 text-[#36C8FF] flex items-center justify-center shrink-0">
                      <Linkedin size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-display font-bold text-sm">LinkedIn Network</div>
                      <div className={`text-xs truncate ${isDark ? 'text-[#AAB7D2]' : 'text-slate-500'}`}>
                        linkedin.com/in/surajyadav01
                      </div>
                    </div>
                  </a>

                  {/* 4. Personal Portfolio Contact Page */}
                  <a
                    href={DEVORBIT_LINKS.personalPortfolio}
                    onClick={(e) => {
                      if (onNavigatePortfolio) {
                        e.preventDefault();
                        onNavigatePortfolio('contact');
                      }
                    }}
                    className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-[#0D1B38] border-[#4191FF]/25 hover:border-[#38E69B]'
                        : 'bg-slate-50 border-slate-200 hover:border-emerald-400'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#38E69B]/15 text-[#38E69B] flex items-center justify-center shrink-0">
                      <Globe size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-display font-bold text-sm">Personal Portfolio</div>
                      <div className={`text-xs truncate ${isDark ? 'text-[#AAB7D2]' : 'text-slate-500'}`}>
                        knowsuraj.ai.studio
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Right: Direct Collaboration Message Form */}
              <div className="lg:col-span-6">
                <form
                  onSubmit={handleContactSubmit}
                  className={`rounded-2xl border p-5 space-y-4 ${
                    isDark ? 'bg-[#0D1B38]/90 border-[#4191FF]/25' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="font-display font-bold text-sm sm:text-base">
                    Share a Project Idea or Collaboration Proposal
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="devorbit-contact-name"
                        className={`block text-xs font-medium mb-1 ${
                          isDark ? 'text-[#AAB7D2]' : 'text-slate-700'
                        }`}
                      >
                        Your Name
                      </label>
                      <input
                        id="devorbit-contact-name"
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Ada Lovelace"
                        className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none ${
                          isDark
                            ? 'bg-[#050B1D] border-[#4191FF]/30 text-[#F5F7FF] focus:border-[#36C8FF]'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="devorbit-contact-email"
                        className={`block text-xs font-medium mb-1 ${
                          isDark ? 'text-[#AAB7D2]' : 'text-slate-700'
                        }`}
                      >
                        Your Email
                      </label>
                      <input
                        id="devorbit-contact-email"
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="builder@example.com"
                        className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none ${
                          isDark
                            ? 'bg-[#050B1D] border-[#4191FF]/30 text-[#F5F7FF] focus:border-[#36C8FF]'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="devorbit-contact-message"
                      className={`block text-xs font-medium mb-1 ${
                        isDark ? 'text-[#AAB7D2]' : 'text-slate-700'
                      }`}
                    >
                      Project Idea or Message
                    </label>
                    <textarea
                      id="devorbit-contact-message"
                      rows={3}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Tell us what you're building or how you'd like to collaborate..."
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm outline-none resize-none ${
                        isDark
                          ? 'bg-[#050B1D] border-[#4191FF]/30 text-[#F5F7FF] focus:border-[#36C8FF]'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                      }`}
                    />
                  </div>

                  {contactFeedback && (
                    <p
                      className={`text-xs font-medium ${
                        contactStatus === 'sent' ? 'text-[#38E69B]' : 'text-[#FFBF47]'
                      }`}
                    >
                      {contactFeedback}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={contactStatus === 'sending'}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#36C8FF] to-[#3578FF] text-[#050B1D] font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Send size={15} />
                    <span>{contactStatus === 'sending' ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 14. COMPLETE FOOTER */}
      <footer
        className={`relative z-10 border-t ${
          isDark
            ? 'bg-[#040817] border-[#4191FF]/25 text-[#AAB7D2]'
            : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#4191FF]/20">
            {/* LEFT: Brand Identity & Description */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-3">
                <DevOrbitLogo className="w-10 h-10 shrink-0" />
                <div>
                  <span className="font-display font-bold text-lg text-[#F5F7FF] block leading-none">
                    Dev<span className="text-[#36C8FF]">Orbit</span>
                  </span>
                  <span className="text-xs text-[#36C8FF] block mt-1">
                    Discover. Build. Collaborate. Grow.
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#AAB7D2] max-w-sm leading-relaxed">
                An independent, open developer community connected to Suraj Kumar Yadav&apos;s
                engineering workspace—where developers explore projects, share knowledge, and build
                open-source software together.
              </p>
            </div>

            {/* MIDDLE: Section Navigation */}
            <div className="md:col-span-4">
              <h3 className="font-display font-bold text-sm text-[#F5F7FF] mb-3">
                Navigation
              </h3>
              <ul className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'community', label: 'Community' },
                  { id: 'resources', label: 'Resources' },
                  { id: 'contributors', label: 'Contributors' },
                  { id: 'contact', label: 'Contact' },
                ].map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.id);
                      }}
                      className="hover:text-[#36C8FF] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT: Community & Social Links */}
            <div className="md:col-span-3">
              <h3 className="font-display font-bold text-sm text-[#F5F7FF] mb-3">
                Ecosystem Links
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a
                    href={DEVORBIT_LINKS.githubOrg}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[#36C8FF] transition-colors"
                  >
                    <Github size={14} />
                    <span>GitHub</span>
                  </a>
                </li>
                <li>
                  <a
                    href={DEVORBIT_LINKS.discordInvite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[#36C8FF] transition-colors"
                  >
                    <DiscordIcon className="w-3.5 h-3.5" />
                    <span>Discord</span>
                  </a>
                </li>
                <li>
                  <a
                    href={DEVORBIT_LINKS.linkedinPersonal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[#36C8FF] transition-colors"
                  >
                    <Linkedin size={14} />
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a
                    href={DEVORBIT_LINKS.personalPortfolio}
                    onClick={(e) => {
                      if (onNavigatePortfolio) {
                        e.preventDefault();
                        onNavigatePortfolio('home');
                      }
                    }}
                    className="inline-flex items-center gap-2 hover:text-[#36C8FF] transition-colors"
                  >
                    <Globe size={14} />
                    <span>Personal Portfolio</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* BOTTOM COPYRIGHT & GUIDELINES */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>
              &copy; {new Date().getFullYear()} DevOrbit. Built with collaboration and open-source
              spirit.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setGuidelinesModalOpen(true)}
                className="hover:text-[#36C8FF] underline cursor-pointer"
              >
                Community Guidelines
              </button>
              <button
                type="button"
                onClick={() => setGuidelinesModalOpen(true)}
                className="hover:text-[#36C8FF] underline cursor-pointer"
              >
                Contribution Guidelines
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* COMMUNITY & CONTRIBUTION GUIDELINES MODAL */}
      {guidelinesModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guidelines-modal-title"
          onClick={() => setGuidelinesModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-xl rounded-3xl border p-6 sm:p-7 max-h-[85vh] overflow-y-auto ${
              isDark
                ? 'bg-[#0B1430] border-[#36C8FF]/50 text-[#F5F7FF]'
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[#4191FF]/25">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={20} className="text-[#38E69B]" />
                <h2 id="guidelines-modal-title" className="font-display font-bold text-lg">
                  {COMMUNITY_GUIDELINES_TEXT.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setGuidelinesModalOpen(false)}
                aria-label="Close guidelines modal"
                className="w-9 h-9 rounded-xl border border-[#4191FF]/30 flex items-center justify-center hover:border-[#36C8FF] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              {COMMUNITY_GUIDELINES_TEXT.sections.map((sec, idx) => (
                <div key={idx}>
                  <h3 className="font-display font-bold text-[#36C8FF] mb-1">
                    {sec.heading}
                  </h3>
                  <p className={isDark ? 'text-[#AAB7D2]' : 'text-slate-600'}>{sec.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#4191FF]/25 flex flex-wrap items-center justify-between gap-3">
              <a
                href={DEVORBIT_LINKS.githubOrg}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[42px] px-4 py-2 rounded-xl bg-[#3578FF] text-white text-xs font-semibold inline-flex items-center gap-2"
              >
                <Github size={15} />
                <span>Explore Public Repositories</span>
              </a>
              <button
                type="button"
                onClick={() => setGuidelinesModalOpen(false)}
                className="min-h-[42px] px-4 py-2 rounded-xl border border-[#4191FF]/35 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
