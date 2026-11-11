import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(resolveCurrentRoute());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateToDevOrbit = () => {
    window.history.pushState({}, '', '/devorbit');
    setCurrentRoute('devorbit');
  };

  const navigateToPortfolio = (section: 'home' | 'contact' = 'home') => {
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

  if (currentRoute === 'admin') {
    return (
      <KnowledgeBaseStudioModal
        isOpen={true}
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
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-4 xl:px-6 py-4 sm:py-7 flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between gap-6 sm:gap-8 lg:gap-4 xl:gap-8">
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

