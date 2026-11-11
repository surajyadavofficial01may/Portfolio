import React, { useState, useEffect } from 'react';
import {
  Lock,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import { NavSection } from './types';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { RetroConsole } from './components/RetroConsole';
import { RightPanel } from './components/RightPanel';
import { SectionModal } from './components/SectionModal';
import { AIAssistantCompanion } from './components/AIAssistantCompanion';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DevOrbitPage } from './components/devorbit/DevOrbitPage';
import { KnowledgeBaseStudioModal } from './components/KnowledgeBaseStudioModal';
import { verifyAdminPasswordServerSide } from './services/supabaseKnowledgeBaseService';
import { soundManager } from './utils/soundEffects';

type AppRoute = 'portfolio' | 'devorbit' | 'admin';

function resolveCurrentRoute(): AppRoute {
  if (typeof window === 'undefined') return 'portfolio';
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  const hash = window.location.hash.toLowerCase();
  if (path === '/admin' || hash.startsWith('#/admin')) {
    return 'admin';
  }
  if (path === '/devorbit' || hash.startsWith('#/devorbit')) {
    return 'devorbit';
  }
  return 'portfolio';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => resolveCurrentRoute());
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [modalSection, setModalSection] = useState<NavSection | null>(null);

  // /admin Route Authentication State (verified against ADMIN_PASSWORD env variable via backend)
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = resolveCurrentRoute();
      setCurrentRoute(nextRoute);
      if (nextRoute !== 'admin') {
        setAdminToken(null);
        setAdminPasswordInput('');
        setAdminAuthError('');
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateToDevOrbit = () => {
    setAdminToken(null);
    window.history.pushState({}, '', '/devorbit');
    setCurrentRoute('devorbit');
  };

  const navigateToPortfolio = (section: 'home' | 'contact' = 'home') => {
    setAdminToken(null);
    setAdminPasswordInput('');
    setAdminAuthError('');
    window.history.pushState({}, '', '/');
    setCurrentRoute('portfolio');
    if (section === 'contact') {
      setActiveSection('contact');
      setModalSection('contact');
    } else {
      setActiveSection('home');
      setModalSection(null);
    }
  };

  const handleAdminAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPasswordInput.trim() || isVerifyingAdmin) return;

    setIsVerifyingAdmin(true);
    setAdminAuthError('');

    try {
      const result = await verifyAdminPasswordServerSide(adminPasswordInput);
      if (result.authenticated && result.token) {
        soundManager.playSelect();
        setAdminToken(result.token);
        setAdminPasswordInput('');
        setAdminAuthError('');
      } else {
        soundManager.playBack();
        setAdminAuthError(
          result.error || 'Invalid administrator password. Access denied.'
        );
      }
    } catch {
      soundManager.playBack();
      setAdminAuthError('Unable to verify administrator password. Please try again.');
    } finally {
      setIsVerifyingAdmin(false);
    }
  };

  const handleLockAdmin = () => {
    soundManager.playBack();
    setAdminToken(null);
    setAdminPasswordInput('');
    setAdminAuthError('');
  };

  const handleSelectSection = (section: NavSection) => {
    setActiveSection(section);
  };

  const handleOpenSectionDetail = (section: NavSection) => {
    setActiveSection(section);
    if (section !== 'home') {
      setModalSection(section);
    } else {
      setModalSection(null);
    }
  };

  const handleCloseModal = () => {
    setModalSection(null);
    setActiveSection('home');
  };

  // PROTECTED /admin ROUTE GATE:
  // Keeps KnowledgeBaseStudioModal unmounted and hidden from the DOM until ADMIN_PASSWORD is verified
  if (currentRoute === 'admin') {
    if (!adminToken) {
      return (
        <div className="min-h-screen w-full bg-[#050B1D] text-[#F5F7FF] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
          <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 z-10">
            <button
              type="button"
              onClick={() => {
                soundManager.playNavigate();
                navigateToPortfolio('home');
              }}
              className="min-h-[42px] px-4 py-2 rounded-xl border border-[#36C8FF]/40 bg-[#0B1733]/90 hover:bg-[#132854] text-[#F5F7FF] font-mono-tech text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft size={15} className="text-[#36C8FF]" />
              <span>Back to Portfolio</span>
            </button>

            <span className="font-mono-tech text-xs text-[#7F90B2]">
              SYS://SUPABASE_KB_ADMIN · /admin
            </span>
          </header>

          <main className="flex-1 flex items-center justify-center z-10 my-8">
            <div className="w-full max-w-md rounded-2xl border-2 border-[#36C8FF]/45 bg-[#0B1430]/95 p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.75)] space-y-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#38E69B]/15 border border-[#38E69B]/40 flex items-center justify-center text-[#38E69B] shrink-0">
                  <Lock size={22} />
                </div>
                <div>
                  <span className="font-mono-tech text-[11px] uppercase tracking-widest text-[#38E69B] font-bold block">
                    Restricted Endpoint · /admin
                  </span>
                  <h1 className="font-display font-bold text-xl text-[#F5F7FF]">
                    Admin Authentication Required
                  </h1>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-mono-tech text-[#AAB7D2] leading-relaxed">
                This knowledge base studio (<code className="text-[#36C8FF]">Portfolio_Knowledge_Base</code>) is restricted. Enter the administrator password configured in <code className="text-[#38E69B]">ADMIN_PASSWORD</code> to unlock the 7-tab Supabase knowledge base.
              </p>

              <form onSubmit={handleAdminAuthenticate} className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-route-password-input"
                    className="block font-mono-tech text-xs font-semibold text-[#CBD5E1] mb-1.5"
                  >
                    Administrator Password
                  </label>
                  <div className="relative">
                    <KeyRound
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#36C8FF] pointer-events-none"
                    />
                    <input
                      id="admin-route-password-input"
                      type={showAdminPassword ? 'text' : 'password'}
                      value={adminPasswordInput}
                      onChange={(e) => {
                        setAdminPasswordInput(e.target.value);
                        if (adminAuthError) setAdminAuthError('');
                      }}
                      placeholder="Enter ADMIN_PASSWORD..."
                      autoFocus
                      className="w-full min-h-[44px] pl-10 pr-11 py-2.5 rounded-xl bg-[#050B1D] border border-[#4191FF]/40 focus:border-[#38E69B] text-sm font-mono-tech text-[#F5F7FF] placeholder-[#64748B] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword((prev) => !prev)}
                      aria-label={showAdminPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#AAB7D2] hover:text-white rounded-lg cursor-pointer"
                    >
                      {showAdminPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {adminAuthError && (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-mono-tech flex items-center gap-2">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>{adminAuthError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifyingAdmin || !adminPasswordInput.trim()}
                  className="w-full min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#36C8FF] to-[#3578FF] hover:opacity-95 disabled:opacity-50 text-[#050B1D] font-display font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <ShieldCheck size={17} />
                  <span>
                    {isVerifyingAdmin ? 'Verifying ADMIN_PASSWORD...' : 'Authenticate & Unlock /admin'}
                  </span>
                </button>
              </form>
            </div>
          </main>

          <footer className="w-full max-w-5xl mx-auto text-center py-2 font-mono-tech text-[11px] text-[#7F90B2]">
            PROTECTED ROUTE · SURAJ YADAV PORTFOLIO ADMIN
          </footer>
        </div>
      );
    }

    return (
      <KnowledgeBaseStudioModal
        isOpen={true}
        adminToken={adminToken}
        onLock={handleLockAdmin}
        onClose={() => navigateToPortfolio('home')}
      />
    );
  }

  if (currentRoute === 'devorbit') {
    return <DevOrbitPage onNavigatePortfolio={navigateToPortfolio} />;
  }

  return (
    <div className="min-h-screen w-full max-w-[100vw] bg-tech-grid text-[#10283F] dark:text-[#F1F5F9] flex flex-col relative overflow-x-hidden selection:bg-[#092A4A] dark:selection:bg-[#2563EB] selection:text-[#F4E9D5] dark:selection:text-white pb-24 lg:pb-4 pt-16 sm:pt-[76px]">
      {/* Header Navigation */}
      <Header
        activeSection={activeSection}
        onSelectSection={(sec) => {
          if (sec === 'home') {
            setActiveSection('home');
            setModalSection(null);
          } else {
            handleOpenSectionDetail(sec);
          }
        }}
        onOpenDevOrbit={navigateToDevOrbit}
      />

      {/* Main 3-Column Portfolio Stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-4 xl:gap-8 py-4 sm:py-7 flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between gap-6 sm:gap-8 lg:gap-4">
        {/* Left Column: Developer Identity, Bio, Tech Stack & Socials */}
        <div className="w-full lg:w-[300px] xl:w-[370px] shrink-0 flex justify-center lg:justify-start order-1 lg:order-1">
          <LeftPanel
            onSelectSkill={() => handleOpenSectionDetail('about')}
            onOpenProjects={() => handleOpenSectionDetail('projects')}
            onOpenContact={() => handleOpenSectionDetail('contact')}
          />
        </div>

        {/* Center Hero: 3D Retro Gaming Console */}
        <div className="w-full lg:flex-1 min-w-0 flex justify-center order-2 lg:order-2">
          <RetroConsole
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
            onOpenSectionDetail={handleOpenSectionDetail}
          />
        </div>

        {/* Right Column: Journey Metrics, Specialties, Currently Building & Highlights */}
        <div className="w-full lg:w-[300px] xl:w-[370px] shrink-0 flex justify-center lg:justify-end order-3">
          <RightPanel
            onOpenProject={() => handleOpenSectionDetail('projects')}
            onExploreSpecialty={() => handleOpenSectionDetail('about')}
            onOpenBlog={() => handleOpenSectionDetail('blog')}
          />
        </div>
      </main>

      {/* Full Dossier Section Modal for About, Projects, Blog, Contact */}
      <SectionModal section={modalSection} onClose={handleCloseModal} />

      {/* Sticky Companion AI Assistant */}
      <AIAssistantCompanion />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeSection={activeSection}
        onSelectSection={(sec) => {
          if (sec === 'home') {
            setActiveSection('home');
            setModalSection(null);
          } else {
            handleOpenSectionDetail(sec);
          }
        }}
      />

      {/* Blueprint Bottom Footer Line: THE JOURNEY CONTINUES... */}
      <footer className="w-full max-w-7xl mx-auto py-5 px-4 flex items-center justify-center gap-2 sm:gap-3 font-mono-tech text-[10px] sm:text-[11px] text-[#4B6173] dark:text-[#CBD5E1] select-none">
        <span className="text-xs text-[#092A4A]/40 dark:text-[#7DD3FC]/70 shrink-0" aria-hidden="true">+</span>
        <div className="flex-1 max-w-[40px] sm:max-w-[160px] h-px bg-[#092A4A]/20 dark:bg-[#3B82F6]/45" />
        <span className="tracking-widest font-semibold text-[#665440] dark:text-[#E2E8F0] text-center truncate">
          THE JOURNEY CONTINUES...
        </span>
        <div className="flex-1 max-w-[40px] sm:max-w-[160px] h-px bg-[#092A4A]/20 dark:bg-[#3B82F6]/45" />
        <span className="text-xs text-[#092A4A]/40 dark:text-[#7DD3FC]/70 shrink-0" aria-hidden="true">+</span>
      </footer>
    </div>
  );
}
