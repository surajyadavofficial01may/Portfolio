import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Compass,
  ExternalLink,
  FolderGit2,
  GitFork,
  GitPullRequest,
  Globe,
  Home,
  Info,
  Layers,
  Linkedin,
  Lock,
  Mail,
  Menu,
  MessageSquare,
  Moon,
  Play,
  Rocket,
  Search,
  Sparkles,
  Star,
  Sun,
  Terminal,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import {
  COMMUNITY_GUIDELINES_TEXT,
  CONTRIBUTION_STEPS,
  CONTRIBUTOR_CATEGORIES,
  DEVORBIT_LINKS,
  DEVORBIT_PROJECTS,
  DEVORBIT_RESOURCES,
  DevOrbitProject,
  DevOrbitProjectCategory,
  PROJECT_CATEGORIES,
} from '../../data/devorbitData';
import {
  CommunityOrbitIllustration,
  DevOrbitLogo,
  FeatureIslandBuild,
  FeatureIslandCommunity,
  FeatureIslandLearning,
  FeatureIslandOpenSource,
  HeroSpaceIllustration,
  PixelHeartIcon,
  PixelRingedPlanet,
  ProjectCardIcon,
  RocketLaunchIllustration,
} from './DevOrbitIllustrations';

interface DevOrbitPageProps {
  onNavigatePortfolio: (section?: string) => void;
}

interface LiveRepoMetrics {
  stars: number;
  forks: number;
  updatedAt: string;
  language?: string;
}

interface GitHubCachePayload {
  timestamp: number;
  repos: Record<string, LiveRepoMetrics>;
  userPublicRepos: number | null;
}

const GITHUB_CACHE_KEY = 'devorbit_github_live_cache_v2';
const GITHUB_CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

function formatRelativeTime(isoDate?: string): string | null {
  if (!isoDate) return null;
  const parsed = new Date(isoDate).getTime();
  if (Number.isNaN(parsed)) return null;
  const diffMs = Date.now() - parsed;
  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  if (days === 0) return 'Updated today';
  if (days === 1) return 'Updated 1d ago';
  if (days < 30) return `Updated ${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `Updated ${months}mo ago`;
  const years = Math.floor(months / 12);
  return `Updated ${years}y ago`;
}

const DiscordIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
);

const GitHubOctocatIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

type NavSectionId = 'home' | 'projects' | 'community' | 'resources' | 'contributors' | 'contact';

export const DevOrbitPage: React.FC<DevOrbitPageProps> = ({ onNavigatePortfolio }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeNav, setActiveNav] = useState<NavSectionId>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Projects directory state
  const [selectedCategory, setSelectedCategory] = useState<DevOrbitProjectCategory>('All Projects');
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjectModal, setSelectedProjectModal] = useState<DevOrbitProject | null>(null);

  // Resources filter state
  const [selectedResourceCategory, setSelectedResourceCategory] = useState<string>('All');
  const [resourceSearch, setResourceSearch] = useState('');

  // Modals for Guidelines and Discord Coming Soon
  const [guidelinesModalOpen, setGuidelinesModalOpen] = useState(false);
  const [discordNoticeOpen, setDiscordNoticeOpen] = useState(false);

  // Live GitHub repository & profile metrics (cached with honest fallback)
  const [repoMetrics, setRepoMetrics] = useState<Record<string, LiveRepoMetrics>>({});
  const [userPublicRepos, setUserPublicRepos] = useState<number | null>(null);

  // Update document title & canonical metadata for /devorbit
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'DevOrbit — Open Developer & Open-Source Community | Discover. Build. Collaborate. Grow.';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  // Fetch & cache real GitHub metrics for public repositories (TheSuraj01/EVEE and user profile)
  useEffect(() => {
    let isMounted = true;

    async function loadGitHubData() {
      try {
        const cachedRaw = sessionStorage.getItem(GITHUB_CACHE_KEY);
        if (cachedRaw) {
          const parsed: GitHubCachePayload = JSON.parse(cachedRaw);
          if (Date.now() - parsed.timestamp < GITHUB_CACHE_TTL_MS) {
            if (isMounted) {
              setRepoMetrics(parsed.repos);
              setUserPublicRepos(parsed.userPublicRepos);
            }
            return;
          }
        }
      } catch {
        // Ignore storage read errors
      }

      const reposMap: Record<string, LiveRepoMetrics> = {};
      let publicReposCount: number | null = null;

      try {
        // Fetch owner profile for verified public repository count
        const userResp = await fetch('https://api.github.com/users/Thesuraj01', {
          headers: { Accept: 'application/vnd.github.v3+json' },
        });
        if (userResp.ok) {
          const userData = await userResp.json();
          if (typeof userData.public_repos === 'number') {
            publicReposCount = userData.public_repos;
          }
        }

        // Fetch verified public repositories in DEVORBIT_PROJECTS
        const publicProjects = DEVORBIT_PROJECTS.filter((p) => Boolean(p.githubRepo));
        await Promise.all(
          publicProjects.map(async (proj) => {
            if (!proj.githubRepo) return;
            const res = await fetch(`https://api.github.com/repos/${proj.githubRepo}`, {
              headers: { Accept: 'application/vnd.github.v3+json' },
            });
            if (res.ok) {
              const repoData = await res.json();
              reposMap[proj.githubRepo] = {
                stars: typeof repoData.stargazers_count === 'number' ? repoData.stargazers_count : 0,
                forks: typeof repoData.forks_count === 'number' ? repoData.forks_count : 0,
                updatedAt: repoData.pushed_at || repoData.updated_at || '',
                language: repoData.language || undefined,
              };
            }
          })
        );

        if (isMounted) {
          setRepoMetrics(reposMap);
          setUserPublicRepos(publicReposCount);
        }

        try {
          const cachePayload: GitHubCachePayload = {
            timestamp: Date.now(),
            repos: reposMap,
            userPublicRepos: publicReposCount,
          };
          sessionStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify(cachePayload));
        } catch {
          // Ignore storage write errors
        }
      } catch {
        // Graceful fallback when offline or rate-limited
      }
    }

    loadGitHubData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Scroll spy for navigation items
  useEffect(() => {
    const sectionIds: NavSectionId[] = [
      'home',
      'projects',
      'community',
      'resources',
      'contributors',
      'contact',
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(`devorbit-${id}`);
        if (el && el.offsetTop <= scrollPos) {
          setActiveNav(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: NavSectionId | 'about' | 'how-to-contribute') => {
    setMobileMenuOpen(false);
    const target = document.getElementById(`devorbit-${id}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (
      id === 'home' ||
      id === 'projects' ||
      id === 'community' ||
      id === 'resources' ||
      id === 'contributors' ||
      id === 'contact'
    ) {
      setActiveNav(id);
    }
  };

  const handleDiscordClick = () => {
    if (DEVORBIT_LINKS.discordInvite) {
      window.open(DEVORBIT_LINKS.discordInvite, '_blank', 'noopener,noreferrer');
    } else {
      setDiscordNoticeOpen(true);
    }
  };

  // Filtered projects for the project directory
  const filteredProjects = useMemo(() => {
    return DEVORBIT_PROJECTS.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All Projects' || project.categories.includes(selectedCategory);
      const query = projectSearch.trim().toLowerCase();
      const matchesQuery =
        !query ||
        project.name.toLowerCase().includes(query) ||
        project.shortDescription.toLowerCase().includes(query) ||
        project.techStack.some((t) => t.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, projectSearch]);

  // Filtered learning resources
  const filteredResources = useMemo(() => {
    return DEVORBIT_RESOURCES.filter((res) => {
      const matchesCat =
        selectedResourceCategory === 'All' || res.category === selectedResourceCategory;
      const q = resourceSearch.trim().toLowerCase();
      const matchesQ =
        !q ||
        res.title.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.skillLevel.toLowerCase().includes(q) ||
        res.sourceLabel.toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
  }, [selectedResourceCategory, resourceSearch]);

  // Honest statistics computed strictly from live GitHub API or honest placeholders (never fabricated numbers)
  const totalLiveStars = useMemo(() => {
    const values = Object.values(repoMetrics) as LiveRepoMetrics[];
    if (values.length === 0) return null;
    const sum = values.reduce((acc, item) => acc + (item.stars || 0), 0);
    return sum > 0 ? String(sum) : null;
  }, [repoMetrics]);

  const isDark = theme === 'dark';

  const navItems: { id: NavSectionId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-4 h-4" /> },
    { id: 'resources', label: 'Resources', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'contributors', label: 'Contributors', icon: <Trophy className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 selection:bg-[#36C8FF]/30 selection:text-[#6CE5FF] ${
        isDark
          ? 'bg-[#050B1D] text-[#F5F7FF]'
          : 'bg-[#F4F7FE] text-[#0B1430]'
      }`}
      style={{
        fontFamily: "'Inter', 'Space Grotesk', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Subtle Space Starfield & Perspective Horizon Grid Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {isDark ? (
          <>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 18% 18%, rgba(53, 120, 255, 0.16), transparent 42%), radial-gradient(circle at 82% 22%, rgba(150, 87, 255, 0.16), transparent 46%), radial-gradient(circle at 50% 80%, rgba(54, 200, 255, 0.08), transparent 55%), linear-gradient(180deg, #050B1D 0%, #091432 52%, #060D21 100%)',
              }}
            />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(53, 120, 255, 0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(53, 120, 255, 0.14) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
              }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 20% 15%, rgba(53, 120, 255, 0.1), transparent 45%), radial-gradient(circle at 80% 25%, rgba(150, 87, 255, 0.1), transparent 45%), linear-gradient(180deg, #F4F7FE 0%, #EBF1FF 100%)',
            }}
          />
        )}
      </div>

      {/* =====================================================================
          3. STICKY NAVIGATION BAR
      ===================================================================== */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors ${
          isDark
            ? 'bg-[#050B1D]/85 border-[#3578FF]/25 shadow-[0_4px_30px_rgba(5,11,29,0.7)]'
            : 'bg-white/85 border-blue-200 shadow-sm'
        }`}
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          {/* Left: Back to Portfolio button + DevOrbit Brand Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigatePortfolio()}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#0D1B38]/90 hover:bg-[#13264E] text-[#6CE5FF] border-[#36C8FF]/40 shadow-[0_0_15px_rgba(54,200,255,0.15)]'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
              }`}
              title="Return to Suraj Kumar Yadav's Personal Portfolio"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Portfolio</span>
            </button>

            <a
              href="#devorbit-home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
              }}
              className="flex items-center gap-3 group focus:outline-none"
            >
              <DevOrbitLogo className="w-10 h-10 sm:w-11 sm:h-11 transition-transform duration-300 group-hover:scale-105" />
              <div className="flex flex-col">
                <span
                  className={`text-lg sm:text-xl font-bold tracking-tight leading-none ${
                    isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                  }`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Dev<span className="text-[#36C8FF]">Orbit</span>
                </span>
                <span
                  className={`text-[10px] sm:text-[11px] mt-1 font-medium tracking-wide hidden sm:inline ${
                    isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
                  }`}
                >
                  Discover. Build. Collaborate. Grow.
                </span>
              </div>
            </a>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav
            aria-label="DevOrbit primary navigation"
            className="hidden xl:flex items-center gap-1"
          >
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? isDark
                        ? 'text-[#F5F7FF] bg-[#3578FF]/15 shadow-[0_0_20px_rgba(54,200,255,0.2)]'
                        : 'text-blue-700 bg-blue-50'
                      : isDark
                      ? 'text-[#BAC8E8] hover:text-[#F5F7FF] hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className={isActive ? 'text-[#36C8FF]' : 'opacity-75'}>{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-gradient-to-r from-[#36C8FF] via-[#3578FF] to-[#9657FF] shadow-[0_0_12px_#36C8FF]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Join Discord CTA, GitHub Icon, Theme Toggle, Mobile Hamburger */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleDiscordClick}
              className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                isDark
                  ? 'bg-[#121D42]/90 hover:bg-[#192858] text-[#F5F7FF] border-[#6366F1]/60 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 shadow-sm'
              }`}
            >
              <DiscordIcon className="w-4 h-4 text-[#818CF8]" />
              <span>Join Discord</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-80" />
            </button>

            <a
              href={DEVORBIT_LINKS.githubProfile}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GitHub Profile"
              title="GitHub (@Thesuraj01)"
              className={`p-2.5 rounded-full border transition-all duration-200 hover:-translate-y-0.5 ${
                isDark
                  ? 'bg-[#0D1B38]/80 hover:bg-[#152952] text-[#F5F7FF] border-[#3578FF]/35'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              <GitHubOctocatIcon className="w-5 h-5" />
            </a>

            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#0D1B38]/80 hover:bg-[#152952] text-[#FFBF47] border-[#3578FF]/35'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              className={`xl:hidden p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#0D1B38] text-[#F5F7FF] border-[#3578FF]/35'
                  : 'bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div
            className={`xl:hidden border-t px-4 pt-3 pb-6 space-y-3 ${
              isDark
                ? 'bg-[#071029]/98 border-[#3578FF]/25'
                : 'bg-white border-slate-200 shadow-lg'
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
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-left transition-all cursor-pointer ${
                      isActive
                        ? isDark
                          ? 'bg-[#3578FF]/20 text-[#6CE5FF] border border-[#36C8FF]/40'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                        : isDark
                        ? 'text-[#BAC8E8] hover:bg-white/5'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleDiscordClick();
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#6D28D9] to-[#9657FF] text-white shadow-md cursor-pointer"
              >
                <DiscordIcon className="w-4 h-4" />
                <span>Join Discord</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigatePortfolio()}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border cursor-pointer ${
                  isDark
                    ? 'border-[#3578FF]/40 text-[#BAC8E8] hover:text-white'
                    : 'border-slate-300 text-slate-700'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Portfolio</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* =====================================================================
            4. HERO SECTION — PRIMARY VISUAL EXPERIENCE
        ===================================================================== */}
        <section
          id="devorbit-home"
          className="pt-8 sm:pt-12 lg:pt-14 pb-10 lg:pb-12 scroll-mt-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
            {/* LEFT COLUMN: Brand Introduction & Primary CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Glowing Status Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#38E69B]/50 bg-[#0A2828]/80 text-[#38E69B] text-xs sm:text-sm font-semibold shadow-[0_0_20px_rgba(56,230,155,0.2)]">
                <span aria-hidden="true">🚀</span>
                <span>Open Developer Community</span>
                <span className="w-2 h-2 rounded-full bg-[#38E69B] animate-pulse" aria-hidden="true" />
              </div>

              {/* Pixel Ringed Planet + Main Heading "DevOrbit" */}
              <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
                <PixelRingedPlanet className="w-20 h-16 sm:w-28 sm:h-22 shrink-0" />
                <h1
                  className="text-3xl sm:text-5xl xl:text-[54px] font-bold tracking-wider leading-tight select-none"
                  style={{
                    fontFamily: "'Press Start 2P', 'Space Grotesk', monospace",
                    textShadow: isDark
                      ? '0 4px 0 #091534, 0 0 28px rgba(54, 200, 255, 0.35)'
                      : '0 3px 0 rgba(15, 23, 42, 0.12)',
                  }}
                >
                  <span className={isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'}>Dev</span>
                  <span className="text-[#36C8FF]">Orbit</span>
                </h1>
              </div>

              {/* Multi-Color Pixel Tagline: Discover. Build. Collaborate. Grow. */}
              <p
                className="text-base sm:text-xl xl:text-[22px] font-bold tracking-wide leading-relaxed"
                style={{ fontFamily: "'Press Start 2P', 'Space Grotesk', monospace" }}
              >
                <span className="text-[#36C8FF]">Discover.</span>{' '}
                <span className="text-[#C084FC]">Build.</span>{' '}
                <span className="text-[#FFBF47]">Collaborate.</span>{' '}
                <span className="text-[#38E69B]">Grow.</span>
              </p>

              {/* Hero Description */}
              <p
                className={`text-base sm:text-lg leading-relaxed max-w-xl ${
                  isDark ? 'text-[#BAC8E8]' : 'text-slate-700'
                }`}
              >
                An open developer community where you can explore projects, contribute to open
                source, learn new skills, and build together with developers from around the world.
              </p>

              {/* Primary Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5 sm:gap-4">
                {/* Button 1: Explore Projects (Cyan-to-purple gradient) */}
                <button
                  type="button"
                  onClick={() => scrollToSection('projects')}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm sm:text-base font-bold text-[#050B1D] bg-gradient-to-r from-[#36C8FF] via-[#60A5FA] to-[#A855F7] hover:brightness-110 transition-all duration-200 hover:-translate-y-0.5 shadow-[0_0_28px_rgba(54,200,255,0.45)] cursor-pointer"
                >
                  <GitHubOctocatIcon className="w-5 h-5 text-[#050B1D]" />
                  <span>Explore Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Button 2: Join Our Community (Purple gradient) */}
                <button
                  type="button"
                  onClick={handleDiscordClick}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#9657FF] border border-[#C084FC]/50 hover:brightness-110 transition-all duration-200 hover:-translate-y-0.5 shadow-[0_0_26px_rgba(150,87,255,0.45)] cursor-pointer"
                >
                  <DiscordIcon className="w-5 h-5 text-white" />
                  <span>Join Our Community</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary Action: Learn More */}
                <button
                  type="button"
                  onClick={() => scrollToSection('about')}
                  className={`inline-flex items-center gap-2.5 px-4 py-3 rounded-full text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                    isDark
                      ? 'text-[#BAC8E8] hover:text-[#F5F7FF]'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span className="w-8 h-8 rounded-full border border-[#9657FF]/60 bg-[#9657FF]/15 flex items-center justify-center text-[#C084FC]">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </span>
                  <span>Learn More</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Large Space-Themed Illustration */}
            <div className="lg:col-span-6">
              <HeroSpaceIllustration />
            </div>
          </div>
        </section>

        {/* =====================================================================
            5. COMMUNITY STATISTICS BAR (100% Honest Data / Placeholders)
        ===================================================================== */}
        <section aria-label="Community Statistics" className="my-6">
          <div
            className={`rounded-2xl border px-4 py-5 sm:px-8 sm:py-6 backdrop-blur-xl transition-all ${
              isDark
                ? 'bg-[#09142E]/90 border-[#36C8FF]/35 shadow-[0_0_35px_rgba(53,120,255,0.18)]'
                : 'bg-white/95 border-blue-200 shadow-md'
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-0 lg:divide-x lg:divide-[#3578FF]/25">
              {/* Stat 1: Open Source Projects */}
              <div className="flex items-center justify-center lg:px-4 gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#36C8FF]/15 border border-[#36C8FF]/40 flex items-center justify-center text-[#36C8FF] shrink-0">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <div
                    className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                      isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                    }`}
                  >
                    {userPublicRepos !== null ? `${userPublicRepos}` : 'Coming Soon'}
                  </div>
                  <div className={`text-xs font-medium ${isDark ? 'text-[#BAC8E8]' : 'text-slate-600'}`}>
                    Open Source Projects
                  </div>
                </div>
              </div>

              {/* Stat 2: Community Members */}
              <div className="flex items-center justify-center lg:px-4 gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#3578FF]/15 border border-[#3578FF]/40 flex items-center justify-center text-[#60A5FA] shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div
                    className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                      isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                    }`}
                  >
                    Growing
                  </div>
                  <div className={`text-xs font-medium ${isDark ? 'text-[#BAC8E8]' : 'text-slate-600'}`}>
                    Community Members
                  </div>
                </div>
              </div>

              {/* Stat 3: GitHub Stars */}
              <div className="flex items-center justify-center lg:px-4 gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#FFBF47]/15 border border-[#FFBF47]/40 flex items-center justify-center text-[#FFBF47] shrink-0">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div
                    className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                      isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                    }`}
                  >
                    {totalLiveStars !== null ? totalLiveStars : 'Coming Soon'}
                  </div>
                  <div className={`text-xs font-medium ${isDark ? 'text-[#BAC8E8]' : 'text-slate-600'}`}>
                    GitHub Stars
                  </div>
                </div>
              </div>

              {/* Stat 4: Total Contributions */}
              <div className="flex items-center justify-center lg:px-4 gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#9657FF]/15 border border-[#9657FF]/40 flex items-center justify-center text-[#C084FC] shrink-0">
                  <GitPullRequest className="w-5 h-5" />
                </div>
                <div>
                  <div
                    className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                      isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                    }`}
                  >
                    Coming Soon
                  </div>
                  <div className={`text-xs font-medium ${isDark ? 'text-[#BAC8E8]' : 'text-slate-600'}`}>
                    Total Contributions
                  </div>
                </div>
              </div>

              {/* Stat 5: Worldwide Developer Community */}
              <div className="flex items-center justify-center lg:px-4 gap-3.5 sm:col-span-2 lg:col-span-1">
                <div className="w-11 h-11 rounded-xl bg-[#38E69B]/15 border border-[#38E69B]/40 flex items-center justify-center text-[#38E69B] shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div
                    className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                      isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                    }`}
                  >
                    Worldwide
                  </div>
                  <div className={`text-xs font-medium ${isDark ? 'text-[#BAC8E8]' : 'text-slate-600'}`}>
                    Developer Community
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            6. ABOUT DEVORBIT SECTION ("What is DevOrbit?")
        ===================================================================== */}
        <section id="devorbit-about" className="py-12 lg:py-16 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* LEFT SIDE: Heading, Description, 4 Checklist Items, Button */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <span
                  className="text-[#36C8FF] font-bold text-xl sm:text-2xl select-none"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                  aria-hidden="true"
                >
                  &gt;&gt;
                </span>
                <h2
                  className="text-xl sm:text-2xl xl:text-[26px] font-bold tracking-wide"
                  style={{ fontFamily: "'Press Start 2P', 'Space Grotesk', monospace" }}
                >
                  <span className={isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'}>What is </span>
                  <span className="text-[#FFBF47]">DevOrbit?</span>
                </h2>
              </div>

              <p
                className={`text-base sm:text-lg leading-relaxed ${
                  isDark ? 'text-[#BAC8E8]' : 'text-slate-700'
                }`}
              >
                DevOrbit is more than just a community — it&apos;s a place where developers come
                together to learn, share, collaborate, and build amazing things.
              </p>

              <ul className="space-y-3.5">
                {[
                  'Open-source projects and developer tools.',
                  'Collaborative development and discussions.',
                  'Learning resources for all skill levels.',
                  'A supportive community that grows together.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#36C8FF] shrink-0 mt-0.5" />
                    <span
                      className={`text-sm sm:text-base font-medium ${
                        isDark ? 'text-[#F5F7FF]' : 'text-slate-800'
                      }`}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection('how-to-contribute')}
                  className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                    isDark
                      ? 'bg-[#091738]/90 hover:bg-[#102454] text-[#F5F7FF] border-[#36C8FF]/55 shadow-[0_0_20px_rgba(54,200,255,0.22)]'
                      : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                  }`}
                >
                  <span>About DevOrbit</span>
                  <ArrowRight className="w-4 h-4 text-[#36C8FF]" />
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: Four Floating Island Feature Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* CARD 1 — OPEN SOURCE */}
              <div
                className={`group rounded-2xl border p-5 flex flex-col justify-between text-center transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-gradient-to-b from-[#0E1E42]/90 to-[#08122B]/95 border-[#3578FF]/35 hover:border-[#36C8FF]/70 shadow-[0_8px_30px_rgba(5,11,29,0.6)]'
                    : 'bg-white border-blue-200 hover:border-blue-400 shadow-sm'
                }`}
              >
                <div>
                  <FeatureIslandOpenSource />
                  <h3
                    className={`mt-3 text-base font-bold ${
                      isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                    }`}
                  >
                    Open Source
                  </h3>
                  <p
                    className={`mt-2 text-xs leading-relaxed ${
                      isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
                    }`}
                  >
                    Explore repositories, contribute, and build.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToSection('projects')}
                  className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#36C8FF] hover:text-[#6CE5FF] transition-colors cursor-pointer"
                >
                  <span>View Projects</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CARD 2 — COMMUNITY */}
              <div
                className={`group rounded-2xl border p-5 flex flex-col justify-between text-center transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-gradient-to-b from-[#141844]/90 to-[#08122B]/95 border-[#9657FF]/35 hover:border-[#C084FC]/70 shadow-[0_8px_30px_rgba(5,11,29,0.6)]'
                    : 'bg-white border-purple-200 hover:border-purple-400 shadow-sm'
                }`}
              >
                <div>
                  <FeatureIslandCommunity />
                  <h3
                    className={`mt-3 text-base font-bold ${
                      isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                    }`}
                  >
                    Community
                  </h3>
                  <p
                    className={`mt-2 text-xs leading-relaxed ${
                      isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
                    }`}
                  >
                    Discuss, ask, share and connect with developers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDiscordClick}
                  className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#36C8FF] hover:text-[#6CE5FF] transition-colors cursor-pointer"
                >
                  <span>Join Discord</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CARD 3 — LEARNING */}
              <div
                className={`group rounded-2xl border p-5 flex flex-col justify-between text-center transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-gradient-to-b from-[#0E1E42]/90 to-[#08122B]/95 border-[#3578FF]/35 hover:border-[#FFBF47]/70 shadow-[0_8px_30px_rgba(5,11,29,0.6)]'
                    : 'bg-white border-amber-200 hover:border-amber-400 shadow-sm'
                }`}
              >
                <div>
                  <FeatureIslandLearning />
                  <h3
                    className={`mt-3 text-base font-bold ${
                      isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                    }`}
                  >
                    Learning
                  </h3>
                  <p
                    className={`mt-2 text-xs leading-relaxed ${
                      isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
                    }`}
                  >
                    Access guides, tutorials and technical resources.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToSection('resources')}
                  className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#36C8FF] hover:text-[#6CE5FF] transition-colors cursor-pointer"
                >
                  <span>Explore Resources</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CARD 4 — BUILD TOGETHER */}
              <div
                className={`group rounded-2xl border p-5 flex flex-col justify-between text-center transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-gradient-to-b from-[#0E1E42]/90 to-[#08122B]/95 border-[#3578FF]/35 hover:border-[#38E69B]/70 shadow-[0_8px_30px_rgba(5,11,29,0.6)]'
                    : 'bg-white border-emerald-200 hover:border-emerald-400 shadow-sm'
                }`}
              >
                <div>
                  <FeatureIslandBuild />
                  <h3
                    className={`mt-3 text-base font-bold ${
                      isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                    }`}
                  >
                    Build Together
                  </h3>
                  <p
                    className={`mt-2 text-xs leading-relaxed ${
                      isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
                    }`}
                  >
                    Turn ideas into real-world projects.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-to-contribute')}
                  className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#36C8FF] hover:text-[#6CE5FF] transition-colors cursor-pointer"
                >
                  <span>Start Contributing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            7 & 8. REFERENCE BOTTOM ROW:
            Featured Projects (EVEE, VAssureAI, Travel Together) +
            Our Community Card + Closing Rocket Terminal Card
        ===================================================================== */}
        <section id="devorbit-projects" className="py-10 lg:py-12 scroll-mt-24">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
            {/* LEFT 7 COLUMNS: Featured Projects Showcase Box (matching reference image) */}
            <div
              className={`xl:col-span-7 rounded-2xl border p-6 flex flex-col justify-between ${
                isDark
                  ? 'bg-[#09142E]/85 border-[#3578FF]/30 shadow-[0_10px_35px_rgba(5,11,29,0.65)]'
                  : 'bg-white border-blue-200 shadow-sm'
              }`}
            >
              {/* Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <span
                    className="text-[#36C8FF] font-bold text-lg select-none"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                    aria-hidden="true"
                  >
                    &gt;&gt;
                  </span>
                  <h2
                    className="text-lg sm:text-xl font-bold tracking-wide"
                    style={{ fontFamily: "'Press Start 2P', 'Space Grotesk', monospace" }}
                  >
                    Featured Projects
                  </h2>
                </div>

                <a
                  href="#devorbit-project-directory"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById('devorbit-project-directory')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#36C8FF] hover:text-[#6CE5FF] transition-colors"
                >
                  <span>View All Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Three Primary Featured Cards: EVEE, VAssureAI, Travel Together */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DEVORBIT_PROJECTS.map((project) => {
                  const live = project.githubRepo ? repoMetrics[project.githubRepo] : undefined;
                  const relUpdated = formatRelativeTime(live?.updatedAt);
                  return (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProjectModal(project)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedProjectModal(project);
                        }
                      }}
                      className={`group rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 cursor-pointer ${
                        isDark
                          ? 'bg-[#0D1B38]/90 hover:bg-[#122449] border-[#3578FF]/30 hover:border-[#36C8FF]/70'
                          : 'bg-slate-50 hover:bg-blue-50/50 border-slate-200 hover:border-blue-400'
                      }`}
                    >
                      <div>
                        <div className="flex items-start gap-3">
                          <ProjectCardIcon type={project.iconType} />
                          <div>
                            <h3
                              className={`text-base font-bold leading-snug ${
                                isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                              }`}
                            >
                              {project.name}
                            </h3>
                            <p
                              className={`mt-1 text-xs leading-relaxed ${
                                isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
                              }`}
                            >
                              {project.shortDescription}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer: Honest live GitHub data or honest availability status */}
                      <div className="mt-5 pt-3 border-t border-[#3578FF]/20 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 text-[11px] font-medium">
                          {live ? (
                            <>
                              <span className="inline-flex items-center gap-1 text-[#FFBF47] font-semibold">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                {live.stars}
                              </span>
                              <span className={isDark ? 'text-[#BAC8E8]' : 'text-slate-500'}>
                                {relUpdated || 'Public Repo'}
                              </span>
                            </>
                          ) : project.availability === 'Public Repository' ? (
                            <span className="inline-flex items-center gap-1 text-[#36C8FF]">
                              <GitHubOctocatIcon className="w-3.5 h-3.5" />
                              <span>Public Repo</span>
                            </span>
                          ) : project.availability === 'Private Project' ? (
                            <span className="inline-flex items-center gap-1 text-[#BAC8E8]">
                              <Lock className="w-3 h-3 text-[#FFBF47]" />
                              <span>Private Project</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[#C084FC]">
                              <Sparkles className="w-3 h-3" />
                              <span>Coming Soon</span>
                            </span>
                          )}
                        </div>

                        <span
                          className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors ${
                            isDark
                              ? 'border-[#36C8FF]/40 text-[#36C8FF] group-hover:bg-[#36C8FF] group-hover:text-[#050B1D]'
                              : 'border-blue-300 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                          }`}
                          aria-hidden="true"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MIDDLE 2.5 COLUMNS: Our Community Card (Uses Designed Illustration instead of fake avatars) */}
            <div
              id="devorbit-community"
              className={`xl:col-span-2 rounded-2xl border p-6 flex flex-col justify-between scroll-mt-24 ${
                isDark
                  ? 'bg-[#09142E]/85 border-[#3578FF]/30 shadow-[0_10px_35px_rgba(5,11,29,0.65)]'
                  : 'bg-white border-blue-200 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#36C8FF]" />
                  <h2
                    className={`text-base sm:text-lg font-bold ${
                      isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                    }`}
                  >
                    Our Community
                  </h2>
                </div>

                {/* Designed Orbital Illustration (Zero fabricated avatars) */}
                <div className="my-3">
                  <CommunityOrbitIllustration className="w-full h-20" />
                </div>

                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
                    isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
                  }`}
                >
                  Join a growing community of developers, contributors, and builders!
                </p>
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleDiscordClick}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#9657FF] hover:brightness-110 transition-all shadow-[0_0_20px_rgba(150,87,255,0.4)] cursor-pointer"
                >
                  <span>Join DevOrbit Community</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* RIGHT 3 COLUMNS: Terminal Rocket Call-to-Action Card */}
            <div
              className={`xl:col-span-3 rounded-2xl border p-6 relative overflow-hidden flex flex-col justify-between ${
                isDark
                  ? 'bg-gradient-to-br from-[#07142B] via-[#0B1B3D] to-[#1A103C] border-[#38E69B]/55 shadow-[0_0_30px_rgba(56,230,155,0.18)]'
                  : 'bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-emerald-400/60 shadow-md'
              }`}
            >
              <div className="relative z-10 space-y-3 max-w-[230px]">
                <div
                  className="text-[#FFBF47] font-bold text-base sm:text-lg"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  &gt;_
                </div>
                <h3
                  className="text-sm sm:text-base font-bold leading-relaxed text-[#38E69B]"
                  style={{ fontFamily: "'Press Start 2P', 'Space Grotesk', monospace" }}
                >
                  Let&apos;s build something amazing together!
                </h3>
                <div className="pt-1 flex items-center gap-3">
                  <PixelHeartIcon className="w-7 h-7" />
                  <button
                    type="button"
                    onClick={() => scrollToSection('how-to-contribute')}
                    className="text-xs font-semibold text-[#6CE5FF] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Start Building</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Rocket Launching Illustration in bottom-right corner */}
              <div className="absolute -right-3 -bottom-3 pointer-events-none opacity-95">
                <RocketLaunchIllustration className="w-36 h-36 sm:w-40 sm:h-40" />
              </div>
            </div>
          </div>

          {/* =====================================================================
              EXPANDED INTERACTIVE PROJECT DIRECTORY (Search + Category Filters)
          ===================================================================== */}
          <div id="devorbit-project-directory" className="mt-10 pt-8 border-t border-[#3578FF]/20 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3
                  className={`text-lg sm:text-xl font-bold ${
                    isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                  }`}
                >
                  Project Directory
                </h3>
                <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-[#BAC8E8]' : 'text-slate-600'}`}>
                  Filter initial projects by category or search by name and technology.
                </p>
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-[#36C8FF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  placeholder="Search projects..."
                  aria-label="Search projects"
                  className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border focus:outline-none transition-colors ${
                    isDark
                      ? 'bg-[#09142E] border-[#3578FF]/35 text-[#F5F7FF] placeholder-[#BAC8E8]/50 focus:border-[#36C8FF]'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
              {PROJECT_CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                      active
                        ? 'bg-gradient-to-r from-[#36C8FF] to-[#3578FF] text-[#050B1D] border-transparent shadow-[0_0_15px_rgba(54,200,255,0.35)]'
                        : isDark
                        ? 'bg-[#09142E]/80 text-[#BAC8E8] border-[#3578FF]/25 hover:border-[#36C8FF]/50 hover:text-white'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Filtered Project Cards Grid */}
            {filteredProjects.length === 0 ? (
              <div
                className={`mt-4 rounded-2xl border p-8 text-center ${
                  isDark
                    ? 'bg-[#09142E]/60 border-[#3578FF]/25 text-[#BAC8E8]'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <p className="text-sm font-medium">
                  No projects match your current filter. Try selecting &ldquo;All Projects&rdquo;.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map((project) => {
                  const live = project.githubRepo ? repoMetrics[project.githubRepo] : undefined;
                  const relUpdated = formatRelativeTime(live?.updatedAt);
                  return (
                    <div
                      key={project.id}
                      className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 ${
                        isDark
                          ? 'bg-[#09142E]/90 border-[#3578FF]/30 hover:border-[#36C8FF]/60 shadow-[0_6px_25px_rgba(5,11,29,0.5)]'
                          : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <ProjectCardIcon type={project.iconType} />
                            <div>
                              <h4
                                className={`text-base font-bold ${
                                  isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                                }`}
                              >
                                {project.name}
                              </h4>
                              <span
                                className={`inline-block mt-0.5 text-[11px] px-2 py-0.5 rounded font-semibold ${
                                  project.availability === 'Public Repository'
                                    ? 'bg-[#38E69B]/15 text-[#38E69B] border border-[#38E69B]/30'
                                    : project.availability === 'Private Project'
                                    ? 'bg-[#FFBF47]/15 text-[#FFBF47] border border-[#FFBF47]/30'
                                    : 'bg-[#9657FF]/15 text-[#C084FC] border border-[#9657FF]/30'
                                }`}
                              >
                                {project.availability}
                              </span>
                            </div>
                          </div>

                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open ${project.name} on GitHub`}
                              className={`p-2 rounded-lg border transition-colors ${
                                isDark
                                  ? 'border-[#3578FF]/30 text-[#BAC8E8] hover:text-white hover:bg-white/5'
                                  : 'border-slate-200 text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>

                        <p
                          className={`mt-3 text-xs sm:text-sm leading-relaxed ${
                            isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
                          }`}
                        >
                          {project.shortDescription}
                        </p>

                        {/* Ownership clarity */}
                        <p
                          className={`mt-2 text-[11px] font-medium ${
                            isDark ? 'text-[#6CE5FF]/80' : 'text-blue-700'
                          }`}
                        >
                          {project.ownershipNote}
                        </p>

                        {/* Tech Stack Tags (only rendered when verified) */}
                        {project.techStack.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {project.techStack.map((tech) => (
                              <span
                                key={tech}
                                className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium ${
                                  isDark
                                    ? 'bg-[#0D1B38] text-[#6CE5FF] border border-[#3578FF]/30'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-5 pt-3 border-t border-[#3578FF]/20 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          {live ? (
                            <>
                              <span className="inline-flex items-center gap-1 text-[#FFBF47] font-semibold">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                {live.stars}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[#BAC8E8]">
                                <GitFork className="w-3.5 h-3.5" />
                                {live.forks}
                              </span>
                              {relUpdated && (
                                <span className={isDark ? 'text-[#BAC8E8]/80' : 'text-slate-500'}>
                                  {relUpdated}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className={isDark ? 'text-[#BAC8E8]/80' : 'text-slate-500'}>
                              {project.availability}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedProjectModal(project)}
                          className="font-semibold text-[#36C8FF] hover:text-[#6CE5FF] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* =====================================================================
            8B. COMMUNITY CHANNELS & GUIDELINES SECTION
        ===================================================================== */}
        <section className="py-10 lg:py-12">
          <div
            className={`rounded-2xl border p-6 sm:p-8 ${
              isDark
                ? 'bg-gradient-to-r from-[#09142E]/95 via-[#0E1E45]/90 to-[#14163B]/95 border-[#3578FF]/35'
                : 'bg-white border-blue-200 shadow-sm'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#36C8FF]">
                  <MessageSquare className="w-4 h-4" />
                  <span>Collaboration Hub</span>
                </div>
                <h2
                  className={`text-xl sm:text-2xl font-bold ${
                    isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                  }`}
                  style={{ fontFamily: "'Press Start 2P', 'Space Grotesk', monospace" }}
                >
                  Connect, Discuss &amp; Build Together
                </h2>
                <p
                  className={`text-sm sm:text-base leading-relaxed ${
                    isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
                  }`}
                >
                  Whether you are making your first open-source pull request, architecting AI
                  agents, or looking for collaborators on a new developer tool, DevOrbit provides a
                  welcoming space to share ideas and grow.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDiscordClick}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#5B21B6] to-[#9657FF] hover:brightness-110 transition-all shadow-md cursor-pointer"
                  >
                    <DiscordIcon className="w-4 h-4" />
                    <span>Join Discord Server</span>
                  </button>

                  <a
                    href={DEVORBIT_LINKS.githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      isDark
                        ? 'bg-[#0D1B38] hover:bg-[#162B56] text-[#F5F7FF] border-[#36C8FF]/40'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    <GitHubOctocatIcon className="w-4 h-4" />
                    <span>GitHub Repositories</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setGuidelinesModalOpen(true)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                      isDark
                        ? 'border-[#3578FF]/30 text-[#6CE5FF] hover:bg-white/5'
                        : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <Info className="w-4 h-4" />
                    <span>Community Guidelines</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    title: 'Open Discussions',
                    desc: 'Ask technical questions, share architecture ideas, and get constructive feedback.',
                    color: 'text-[#36C8FF]',
                  },
                  {
                    title: 'Project Collaboration',
                    desc: 'Find maintainers and contributors for open-source and portfolio projects.',
                    color: 'text-[#C084FC]',
                  },
                  {
                    title: 'Code Reviews',
                    desc: 'Learn best practices through welcoming pull request reviews and mentorship.',
                    color: 'text-[#FFBF47]',
                  },
                  {
                    title: 'Builder Showcases',
                    desc: 'Demo what you are building and celebrate milestones with peers.',
                    color: 'text-[#38E69B]',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className={`rounded-xl border p-4 ${
                      isDark
                        ? 'bg-[#071026]/80 border-[#3578FF]/25'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <h3 className={`text-sm font-bold ${item.color}`}>{item.title}</h3>
                    <p
                      className={`mt-1.5 text-xs leading-relaxed ${
                        isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            9. LEARNING RESOURCES SECTION
        ===================================================================== */}
        <section id="devorbit-resources" className="py-12 lg:py-16 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2.5">
                <span
                  className="text-[#36C8FF] font-bold text-lg select-none"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                  aria-hidden="true"
                >
                  &gt;&gt;
                </span>
                <h2
                  className="text-xl sm:text-2xl font-bold tracking-wide"
                  style={{ fontFamily: "'Press Start 2P', 'Space Grotesk', monospace" }}
                >
                  Learning <span className="text-[#36C8FF]">Resources</span>
                </h2>
              </div>
              <p
                className={`mt-2 text-sm sm:text-base max-w-2xl ${
                  isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
                }`}
              >
                Curated official documentation across software engineering, open-source workflows,
                AI systems, and cloud infrastructure.
              </p>
            </div>

            {/* Resource Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#36C8FF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
                placeholder="Search documentation..."
                aria-label="Search learning resources"
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border focus:outline-none ${
                  isDark
                    ? 'bg-[#09142E] border-[#3578FF]/35 text-[#F5F7FF] placeholder-[#BAC8E8]/50 focus:border-[#36C8FF]'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                }`}
              />
            </div>
          </div>

          {/* 4 Resource Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
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
                  onClick={() => setSelectedResourceCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-[#36C8FF] to-[#9657FF] text-[#050B1D] border-transparent shadow-[0_0_18px_rgba(54,200,255,0.3)]'
                      : isDark
                      ? 'bg-[#09142E]/85 text-[#BAC8E8] border-[#3578FF]/25 hover:border-[#36C8FF]/50 hover:text-white'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Resources Cards Grid */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredResources.map((res) => (
              <a
                key={res.id}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-[#09142E]/90 border-[#3578FF]/30 hover:border-[#36C8FF]/70 shadow-[0_6px_25px_rgba(5,11,29,0.5)]'
                    : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                        res.skillLevel === 'Beginner'
                          ? 'bg-[#38E69B]/15 text-[#38E69B]'
                          : res.skillLevel === 'Intermediate'
                          ? 'bg-[#36C8FF]/15 text-[#36C8FF]'
                          : 'bg-[#9657FF]/20 text-[#C084FC]'
                      }`}
                    >
                      {res.skillLevel}
                    </span>
                    <span className={`text-[11px] font-mono ${isDark ? 'text-[#BAC8E8]/75' : 'text-slate-500'}`}>
                      {res.sourceLabel}
                    </span>
                  </div>

                  <h3
                    className={`mt-3 text-base font-bold group-hover:text-[#36C8FF] transition-colors ${
                      isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                    }`}
                  >
                    {res.title}
                  </h3>

                  <p
                    className={`mt-2 text-xs leading-relaxed ${
                      isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
                    }`}
                  >
                    {res.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#3578FF]/20 flex items-center justify-between text-xs font-semibold text-[#36C8FF]">
                  <span>{res.category}</span>
                  <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Official Docs</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* =====================================================================
            10. CONTRIBUTORS SECTION ("Meet the Builders")
            Strictly honest: No unapproved contributor assignments.
        ===================================================================== */}
        <section id="devorbit-contributors" className="py-12 lg:py-16 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2.5">
                <span
                  className="text-[#FFBF47] font-bold text-lg select-none"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                  aria-hidden="true"
                >
                  &gt;&gt;
                </span>
                <h2
                  className="text-xl sm:text-2xl font-bold tracking-wide"
                  style={{ fontFamily: "'Press Start 2P', 'Space Grotesk', monospace" }}
                >
                  Meet the <span className="text-[#FFBF47]">Builders</span>
                </h2>
              </div>
              <p
                className={`mt-2 text-sm sm:text-base max-w-2xl ${
                  isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
                }`}
              >
                DevOrbit recognizes everyone who helps build, document, test, and support open
                projects. Contributor profiles appear only when real contributions and public
                attribution exist.
              </p>
            </div>
          </div>

          {/* 4 Recognition Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {CONTRIBUTOR_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className={`rounded-xl border p-4 ${
                  isDark
                    ? 'bg-[#09142E]/75 border-[#3578FF]/25'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2 text-[#FFBF47] font-bold text-sm">
                  <Trophy className="w-4 h-4 shrink-0" />
                  <h3>{cat.title}</h3>
                </div>
                <p
                  className={`mt-1.5 text-xs leading-relaxed ${
                    isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
                  }`}
                >
                  {cat.description}
                </p>
              </div>
            ))}
          </div>

          {/* Honest Welcoming Empty State Card (Exact wording from Section 10 of specification) */}
          <div
            className={`rounded-2xl border border-dashed p-8 sm:p-10 flex flex-col items-center justify-center text-center ${
              isDark
                ? 'bg-[#09142E]/60 border-[#36C8FF]/40'
                : 'bg-blue-50/50 border-blue-300'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#36C8FF]/15 border border-[#36C8FF]/40 flex items-center justify-center text-[#36C8FF] mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3
              className={`text-lg sm:text-xl font-bold ${
                isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
              }`}
            >
              Your name could be here. Start contributing today.
            </h3>
            <p
              className={`mt-2 text-xs sm:text-sm max-w-lg leading-relaxed ${
                isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
              }`}
            >
              We never fabricate contributor profiles or assign roles without approval. Pick an open
              repository, improve documentation, or submit a pull request on GitHub to join the
              builders list.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSection('how-to-contribute')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#050B1D] bg-gradient-to-r from-[#36C8FF] to-[#38E69B] hover:brightness-110 transition-all cursor-pointer"
              >
                <span>How to Contribute</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={DEVORBIT_LINKS.githubProfile}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                  isDark
                    ? 'border-[#3578FF]/40 text-[#F5F7FF] hover:bg-white/5'
                    : 'border-slate-300 text-slate-800 hover:bg-white'
                }`}
              >
                <GitHubOctocatIcon className="w-4 h-4" />
                <span>Explore GitHub (@Thesuraj01)</span>
              </a>
            </div>
          </div>
        </section>

        {/* =====================================================================
            11. HOW TO CONTRIBUTE SECTION (4-Step Onboarding Flow)
        ===================================================================== */}
        <section id="devorbit-how-to-contribute" className="py-12 lg:py-16 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#36C8FF]/40 bg-[#36C8FF]/10 text-[#36C8FF] text-xs font-semibold mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Beginner-Friendly Onboarding</span>
            </div>
            <h2
              className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide"
              style={{ fontFamily: "'Press Start 2P', 'Space Grotesk', monospace" }}
            >
              How to <span className="text-[#38E69B]">Contribute</span>
            </h2>
            <p className={`mt-3 text-sm sm:text-base ${isDark ? 'text-[#BAC8E8]' : 'text-slate-600'}`}>
              Four simple steps to go from exploring repositories to shipping meaningful open-source
              contributions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CONTRIBUTION_STEPS.map((step, idx) => {
              const accentStyles = {
                cyan: 'border-[#36C8FF]/40 text-[#36C8FF] bg-[#36C8FF]/10',
                purple: 'border-[#9657FF]/40 text-[#C084FC] bg-[#9657FF]/10',
                gold: 'border-[#FFBF47]/40 text-[#FFBF47] bg-[#FFBF47]/10',
                green: 'border-[#38E69B]/40 text-[#38E69B] bg-[#38E69B]/10',
              }[step.accent];

              const stepIcons = [
                <Compass key="1" className="w-5 h-5" />,
                <BookOpen key="2" className="w-5 h-5" />,
                <Code2 key="3" className="w-5 h-5" />,
                <Rocket key="4" className="w-5 h-5" />,
              ];

              return (
                <div
                  key={step.number}
                  className={`rounded-2xl border p-6 relative flex flex-col justify-between transition-all hover:-translate-y-1 ${
                    isDark
                      ? 'bg-[#09142E]/90 border-[#3578FF]/30 shadow-[0_6px_25px_rgba(5,11,29,0.5)]'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold border ${accentStyles}`}
                        style={{ fontFamily: "'Press Start 2P', monospace" }}
                      >
                        STEP {step.number}
                      </span>
                      <span className={`p-2 rounded-xl border ${accentStyles}`}>
                        {stepIcons[idx]}
                      </span>
                    </div>

                    <h3
                      className={`text-lg font-bold ${
                        isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`mt-2 text-xs sm:text-sm leading-relaxed ${
                        isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#3578FF]/15 flex items-center justify-between text-[11px] font-semibold text-[#36C8FF]">
                    <span>0{idx + 1} / 04</span>
                    <span>DevOrbit Workflow</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            12. CLOSING CALL-TO-ACTION BANNER
        ===================================================================== */}
        <section className="py-8">
          <div
            className={`rounded-3xl border p-8 sm:p-10 lg:p-12 relative overflow-hidden ${
              isDark
                ? 'bg-gradient-to-r from-[#081533] via-[#102048] to-[#1D1242] border-[#38E69B]/50 shadow-[0_0_40px_rgba(54,200,255,0.2)]'
                : 'bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white border-emerald-400'
            }`}
          >
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 text-[#FFBF47] font-mono text-sm font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>&gt;_ READY TO LAUNCH</span>
                </div>
                <h2
                  className="text-xl sm:text-3xl font-bold leading-normal text-[#38E69B]"
                  style={{ fontFamily: "'Press Start 2P', 'Space Grotesk', monospace" }}
                >
                  Let&apos;s build something amazing together!
                </h2>
                <p className="text-sm sm:text-base text-[#BAC8E8] max-w-2xl leading-relaxed">
                  Explore open-source projects, connect with fellow builders, and grow your
                  engineering skills inside the DevOrbit ecosystem.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={handleDiscordClick}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#9657FF] hover:brightness-110 transition-all shadow-[0_0_24px_rgba(150,87,255,0.5)] cursor-pointer"
                  >
                    <DiscordIcon className="w-4 h-4" />
                    <span>Join DevOrbit Community</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={DEVORBIT_LINKS.githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-bold text-[#050B1D] bg-gradient-to-r from-[#36C8FF] to-[#38E69B] hover:brightness-110 transition-all shadow-[0_0_24px_rgba(54,200,255,0.4)]"
                  >
                    <GitHubOctocatIcon className="w-4 h-4" />
                    <span>Explore GitHub</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <RocketLaunchIllustration className="w-44 h-44 sm:w-52 sm:h-52" />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            13. CONTACT & SOCIAL LINKS SECTION ("Let's Connect")
            Strictly honest: Verified links + Coming Soon badges (no fake form or fake URLs)
        ===================================================================== */}
        <section id="devorbit-contact" className="py-12 lg:py-16 scroll-mt-24">
          <div className="mb-8">
            <div className="flex items-center gap-2.5">
              <span
                className="text-[#36C8FF] font-bold text-lg select-none"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
                aria-hidden="true"
              >
                &gt;&gt;
              </span>
              <h2
                className="text-xl sm:text-2xl font-bold tracking-wide"
                style={{ fontFamily: "'Press Start 2P', 'Space Grotesk', monospace" }}
              >
                Let&apos;s <span className="text-[#36C8FF]">Connect</span>
              </h2>
            </div>
            <p
              className={`mt-2 text-sm sm:text-base max-w-2xl ${
                isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
              }`}
            >
              Connect through verified profiles or reach out via the main portfolio contact page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. GitHub link (Verified) */}
            <a
              href={DEVORBIT_LINKS.githubProfile}
              target="_blank"
              rel="noopener noreferrer"
              className={`group rounded-2xl border p-5 flex items-center justify-between transition-all hover:-translate-y-0.5 ${
                isDark
                  ? 'bg-[#09142E]/90 border-[#3578FF]/30 hover:border-[#36C8FF]'
                  : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#36C8FF]/15 border border-[#36C8FF]/40 flex items-center justify-center text-[#36C8FF]">
                  <GitHubOctocatIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold ${isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'}`}>
                      GitHub Profile
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#38E69B]/15 text-[#38E69B] font-semibold">
                      Verified
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-[#BAC8E8]' : 'text-slate-600'}`}>
                    github.com/Thesuraj01
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#36C8FF] shrink-0" />
            </a>

            {/* 2. Personal LinkedIn Profile (Verified) */}
            <a
              href={DEVORBIT_LINKS.linkedinPersonal}
              target="_blank"
              rel="noopener noreferrer"
              className={`group rounded-2xl border p-5 flex items-center justify-between transition-all hover:-translate-y-0.5 ${
                isDark
                  ? 'bg-[#09142E]/90 border-[#3578FF]/30 hover:border-[#36C8FF]'
                  : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#3578FF]/15 border border-[#3578FF]/40 flex items-center justify-center text-[#60A5FA]">
                  <Linkedin className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold ${isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'}`}>
                      Personal LinkedIn Profile
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#38E69B]/15 text-[#38E69B] font-semibold">
                      Verified
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-[#BAC8E8]' : 'text-slate-600'}`}>
                    linkedin.com/in/surajyadav01
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#36C8FF] shrink-0" />
            </a>

            {/* 3. Personal Portfolio Contact Page (Verified) */}
            <button
              type="button"
              onClick={() => onNavigatePortfolio('contact')}
              className={`group rounded-2xl border p-5 flex items-center justify-between text-left transition-all hover:-translate-y-0.5 cursor-pointer ${
                isDark
                  ? 'bg-[#09142E]/90 border-[#3578FF]/30 hover:border-[#38E69B]'
                  : 'bg-white border-slate-200 hover:border-emerald-400 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#38E69B]/15 border border-[#38E69B]/40 flex items-center justify-center text-[#38E69B]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold ${isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'}`}>
                      Personal Portfolio Contact
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#38E69B]/15 text-[#38E69B] font-semibold">
                      Active
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-[#BAC8E8]' : 'text-slate-600'}`}>
                    Open Suraj&apos;s portfolio contact section
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#38E69B] shrink-0" />
            </button>

            {/* 4. Discord Invitation (Honest Coming Soon Status) */}
            <button
              type="button"
              onClick={handleDiscordClick}
              className={`group rounded-2xl border p-5 flex items-center justify-between text-left transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#09142E]/60 border-[#3578FF]/25 hover:border-[#9657FF]/60'
                  : 'bg-slate-50 border-slate-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#9657FF]/15 border border-[#9657FF]/40 flex items-center justify-center text-[#C084FC]">
                  <DiscordIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold ${isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'}`}>
                      Discord Invitation
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#9657FF]/20 text-[#C084FC] font-semibold">
                      Coming Soon
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-[#BAC8E8]' : 'text-slate-600'}`}>
                    Official community server invite launching soon
                  </p>
                </div>
              </div>
              <Info className="w-4 h-4 text-[#C084FC] shrink-0" />
            </button>

            {/* 5. LinkedIn Community Page (Honest Coming Soon Status) */}
            <div
              className={`rounded-2xl border p-5 flex items-center justify-between ${
                isDark
                  ? 'bg-[#09142E]/60 border-[#3578FF]/25'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFBF47]/15 border border-[#FFBF47]/40 flex items-center justify-center text-[#FFBF47]">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold ${isDark ? 'text-[#F5F7FF]' : 'text-[#0B1430]'}`}>
                      LinkedIn Community Page
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFBF47]/20 text-[#FFBF47] font-semibold">
                      Coming Soon
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-[#BAC8E8]' : 'text-slate-600'}`}>
                    Dedicated DevOrbit page in preparation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          14. FOOTER
      ===================================================================== */}
      <footer
        className={`relative z-10 mt-12 border-t transition-colors ${
          isDark
            ? 'bg-[#040817] border-[#3578FF]/25 text-[#BAC8E8]'
            : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#3578FF]/20">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <DevOrbitLogo className="w-10 h-10" />
                <div>
                  <span
                    className="text-xl font-bold text-[#F5F7FF] tracking-tight"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Dev<span className="text-[#36C8FF]">Orbit</span>
                  </span>
                  <p className="text-xs text-[#6CE5FF] font-medium">
                    Discover. Build. Collaborate. Grow.
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#BAC8E8] max-w-sm leading-relaxed">
                An independent, open developer community connected to Suraj Kumar Yadav&apos;s
                engineering portfolio — built for exploring open-source projects, sharing knowledge,
                and building meaningful software together.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FF] mb-3.5">
                Quick Links
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className="text-[#BAC8E8] hover:text-[#36C8FF] transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community & Resources */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FF] mb-3.5">
                Community &amp; Docs
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <button
                    type="button"
                    onClick={handleDiscordClick}
                    className="text-[#BAC8E8] hover:text-[#36C8FF] transition-colors cursor-pointer"
                  >
                    Discord Community (Coming Soon)
                  </button>
                </li>
                <li>
                  <a
                    href={DEVORBIT_LINKS.githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#BAC8E8] hover:text-[#36C8FF] transition-colors"
                  >
                    GitHub (@Thesuraj01)
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setGuidelinesModalOpen(true)}
                    className="text-[#BAC8E8] hover:text-[#36C8FF] transition-colors cursor-pointer"
                  >
                    Contribution Guidelines
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('resources')}
                    className="text-[#BAC8E8] hover:text-[#36C8FF] transition-colors cursor-pointer"
                  >
                    Learning Resources
                  </button>
                </li>
              </ul>
            </div>

            {/* Portfolio Connection */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FF] mb-3.5">
                Personal Portfolio
              </h3>
              <p className="text-xs text-[#BAC8E8] leading-relaxed mb-3">
                Return to Suraj Kumar Yadav&apos;s interactive retro portfolio console.
              </p>
              <button
                type="button"
                onClick={() => onNavigatePortfolio()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#0D1B38] hover:bg-[#152A54] text-[#6CE5FF] border border-[#36C8FF]/40 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>knowsuraj.ai.studio</span>
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#BAC8E8]/80">
            <p>© {new Date().getFullYear()} DevOrbit Community · Connected to Suraj Kumar Yadav.</p>
            <p className="flex items-center gap-1.5">
              <span>Discover. Build. Collaborate. Grow.</span>
            </p>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          PROJECT DETAILS MODAL (Honest Metadata Only)
      ===================================================================== */}
      {selectedProjectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          onClick={() => setSelectedProjectModal(null)}
        >
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 sm:p-7 shadow-2xl ${
              isDark
                ? 'bg-[#09142E] border-[#36C8FF]/50 text-[#F5F7FF]'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <ProjectCardIcon type={selectedProjectModal.iconType} />
                <div>
                  <h3 id="modal-project-title" className="text-xl font-bold">
                    {selectedProjectModal.name}
                  </h3>
                  <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-md bg-[#36C8FF]/15 text-[#36C8FF] font-semibold">
                    {selectedProjectModal.availability}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProjectModal(null)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-[#BAC8E8] hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p
              className={`mt-4 text-sm leading-relaxed ${
                isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
              }`}
            >
              {selectedProjectModal.shortDescription}
            </p>

            <div
              className={`mt-4 p-3.5 rounded-xl border text-xs ${
                isDark
                  ? 'bg-[#050B1D]/70 border-[#3578FF]/25 text-[#BAC8E8]'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className="font-semibold text-[#6CE5FF]">Ownership &amp; Status</div>
              <div className="mt-1">{selectedProjectModal.ownershipNote}</div>
            </div>

            {selectedProjectModal.techStack.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#36C8FF] mb-2">
                  Verified Technology
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProjectModal.techStack.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-3 py-1 rounded-lg bg-[#0D1B38] text-[#6CE5FF] border border-[#3578FF]/35 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-[#3578FF]/25 flex flex-wrap items-center justify-end gap-3">
              {selectedProjectModal.demoUrl &&
                selectedProjectModal.demoUrl !== selectedProjectModal.githubUrl && (
                  <a
                    href={selectedProjectModal.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#F5F7FF] bg-[#3578FF]/25 border border-[#36C8FF]/50 hover:bg-[#3578FF]/40 transition-all"
                  >
                    <Globe className="w-4 h-4 text-[#36C8FF]" />
                    <span>Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

              {selectedProjectModal.githubUrl ? (
                <a
                  href={selectedProjectModal.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#050B1D] bg-gradient-to-r from-[#36C8FF] to-[#38E69B] hover:brightness-110 transition-all"
                >
                  <GitHubOctocatIcon className="w-4 h-4" />
                  <span>
                    {selectedProjectModal.githubUrl.includes('pypi.org')
                      ? 'View on PyPI'
                      : 'View Repository on GitHub'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-xs font-medium text-[#BAC8E8]">
                  {selectedProjectModal.availability === 'Private Project'
                    ? 'Repository is private.'
                    : 'Public repository link coming soon.'}
                </span>
              )}

              <button
                type="button"
                onClick={() => setSelectedProjectModal(null)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-[#3578FF]/35 text-[#BAC8E8] hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          DISCORD COMING SOON MODAL (Honest notice instead of a fake invite link)
      ===================================================================== */}
      {discordNoticeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-discord-title"
          onClick={() => setDiscordNoticeOpen(false)}
        >
          <div
            className={`w-full max-w-md rounded-2xl border p-6 sm:p-7 shadow-2xl ${
              isDark
                ? 'bg-[#09142E] border-[#9657FF]/55 text-[#F5F7FF]'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#9657FF]/20 border border-[#9657FF]/45 flex items-center justify-center text-[#C084FC]">
                  <DiscordIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 id="modal-discord-title" className="text-lg font-bold">
                    Discord Server — Coming Soon
                  </h3>
                  <span className="text-xs text-[#C084FC] font-medium">
                    Official DevOrbit Community
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDiscordNoticeOpen(false)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-[#BAC8E8] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p
              className={`mt-4 text-sm leading-relaxed ${
                isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
              }`}
            >
              The official DevOrbit Discord server is currently being prepared. In the meantime, you
              can explore open repositories on GitHub or connect directly with Suraj on LinkedIn.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <a
                href={DEVORBIT_LINKS.githubProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#050B1D] bg-[#36C8FF] hover:brightness-110 transition-all"
              >
                <GitHubOctocatIcon className="w-4 h-4" />
                <span>GitHub (@Thesuraj01)</span>
              </a>
              <a
                href={DEVORBIT_LINKS.linkedinPersonal}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-[#3578FF]/40 text-[#6CE5FF] hover:bg-white/5 transition-all"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          COMMUNITY GUIDELINES MODAL
      ===================================================================== */}
      {guidelinesModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-guidelines-title"
          onClick={() => setGuidelinesModalOpen(false)}
        >
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 sm:p-7 shadow-2xl ${
              isDark
                ? 'bg-[#09142E] border-[#36C8FF]/50 text-[#F5F7FF]'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#3578FF]/25">
              <h3 id="modal-guidelines-title" className="text-lg font-bold">
                {COMMUNITY_GUIDELINES_TEXT.title}
              </h3>
              <button
                type="button"
                onClick={() => setGuidelinesModalOpen(false)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-[#BAC8E8] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {COMMUNITY_GUIDELINES_TEXT.sections.map((sec) => (
                <div key={sec.heading}>
                  <h4 className="text-sm font-bold text-[#36C8FF]">{sec.heading}</h4>
                  <p
                    className={`mt-1 text-xs sm:text-sm leading-relaxed ${
                      isDark ? 'text-[#BAC8E8]' : 'text-slate-600'
                    }`}
                  >
                    {sec.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#3578FF]/25 flex justify-end">
              <button
                type="button"
                onClick={() => setGuidelinesModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#36C8FF] text-[#050B1D] cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DevOrbitPage;
