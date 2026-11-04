import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Home, User, Briefcase, FileText, Mail, Github, Linkedin, Globe } from 'lucide-react';
import { NavSection } from '../types';
import { soundManager } from '../utils/soundEffects';
import { PERSONAL_INFO } from '../data/portfolioData';

interface HeaderProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onSelectSection }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    soundManager.initFromStorage();
    setIsMuted(soundManager.isMuted());

    // Check initial theme
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape or resize to desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playSelect();
    }
  };

  const handleToggleTheme = () => {
    soundManager.playSelect();
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const handleNavigate = (section: NavSection) => {
    soundManager.playNavigate();
    setMobileMenuOpen(false);
    onSelectSection(section);
  };

  const navItems: { id: NavSection; label: string; level: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'home', label: 'Home', level: 'LV 00', icon: <Home size={16} />, desc: '3D Retro Console & Overview' },
    { id: 'about', label: 'About', level: 'LV 01', icon: <User size={16} />, desc: 'Experience, Education & Stack' },
    { id: 'projects', label: 'Projects', level: 'LV 02', icon: <Briefcase size={16} />, desc: 'Aiden, MeDict AI, ZipIgnore' },
    { id: 'blog', label: 'Blog', level: 'LV 03', icon: <FileText size={16} />, desc: 'Articles & Technical Writings' },
    { id: 'contact', label: 'Contact', level: 'LV 04', icon: <Mail size={16} />, desc: 'Direct Transmission Channel' },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#F4E9D5]/95 dark:bg-[#0A0A0F]/95 backdrop-blur-sm border-b border-[#092A4A]/15 dark:border-[#3B82F6]/20 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]">
        <header className="w-full max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-[72px] flex items-center justify-between gap-2 select-none">
          {/* Left: Pixel Avatar + Name & Title */}
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group text-left min-h-[44px] min-w-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#092A4A] dark:focus-visible:outline-[#6EB5F7] rounded-lg"
            id="header-brand"
            aria-label="Suraj Yadav - Return to Home Console"
          >
            {/* Pixel Avatar */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-sm bg-[#092A4A] dark:bg-[#3B82F6] p-1 flex items-center justify-center shadow-sm border border-[#061B30] dark:border-[#1E3A8A] relative overflow-hidden shrink-0 transition-transform group-hover:scale-105">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 pixelated" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                {/* Hair */}
                <rect x="4" y="2" width="8" height="3" fill="#10283F" />
                <rect x="3" y="3" width="2" height="4" fill="#10283F" />
                <rect x="11" y="3" width="2" height="4" fill="#10283F" />
                {/* Face */}
                <rect x="5" y="4" width="6" height="5" fill="#F2E4CC" />
                {/* Eyes */}
                <rect x="6" y="6" width="1" height="2" fill="#092A4A" />
                <rect x="9" y="6" width="1" height="2" fill="#092A4A" />
                {/* Glasses frame */}
                <rect x="5" y="6" width="3" height="1" fill="#D7A93D" opacity="0.9" />
                <rect x="8" y="6" width="3" height="1" fill="#D7A93D" opacity="0.9" />
                <rect x="7.5" y="6" width="1" height="1" fill="#D7A93D" />
                {/* Shirt / Body */}
                <rect x="4" y="9" width="8" height="6" fill="#092A4A" />
                <rect x="6" y="9" width="4" height="3" fill="currentColor" />
                {/* Backpack strap */}
                <rect x="4" y="9" width="1.5" height="5" fill="#C85C57" />
                <rect x="10.5" y="9" width="1.5" height="5" fill="#C85C57" />
              </svg>
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#3DA66B]" />
            </div>

            <div className="min-w-0">
              <span className="font-display font-bold text-base sm:text-xl text-[#092A4A] dark:text-[#6EB5F7] tracking-tight block truncate leading-tight">
                Suraj Yadav
              </span>
              <span className="font-mono-tech text-[11px] sm:text-xs text-[#4B6173] dark:text-[#94A3B8] tracking-wide block truncate">
                Software Engineer
              </span>
            </div>
          </button>

          {/* Center: Desktop Navigation Bar with Blueprint Framing */}
          <div className="hidden lg:flex items-center gap-2" id="header-nav-container">
            <span className="text-xs font-mono-tech text-[#092A4A]/40 dark:text-[#6EB5F7]/40 select-none" aria-hidden="true">{'{'}</span>
            <nav
              className="flex items-center gap-1.5 px-1 py-1 select-none"
              id="header-nav"
              aria-label="Primary Navigation"
            >
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    id={`nav-btn-${item.id}`}
                    onClick={() => handleNavigate(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`font-mono-tech text-sm px-3.5 min-h-[44px] inline-flex items-center justify-center rounded transition-colors duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#092A4A] dark:focus-visible:outline-[#6EB5F7] ${
                      isActive
                        ? 'border-b-2 border-[#092A4A] dark:border-[#3B82F6] text-[#092A4A] dark:text-[#6EB5F7] font-bold bg-[#092A4A]/5 dark:bg-[#3B82F6]/10'
                        : 'text-[#4B6173] dark:text-[#94A3B8] hover:text-[#092A4A] dark:hover:text-[#6EB5F7]'
                    }`}
                  >
                    {isActive ? `[ ${item.label} ]` : item.label}
                  </button>
                );
              })}
            </nav>
            <span className="text-xs font-mono-tech text-[#092A4A]/40 dark:text-[#6EB5F7]/40 select-none" aria-hidden="true">{'}'}</span>
          </div>

          {/* Right: Technical Blueprint Tagline + Audio, Theme & Mobile Menu Toggle */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0" id="header-controls">
            <div className="hidden xl:flex items-center gap-1 text-right font-mono-tech text-[10px] text-[#4B6173] dark:text-[#94A3B8] leading-tight select-none mr-1">
              <span className="text-xs text-[#092A4A]/50 dark:text-[#6EB5F7]/50" aria-hidden="true">&lt;</span>
              <div className="flex flex-col">
                <span className="text-[#092A4A] dark:text-[#6EB5F7] font-bold tracking-widest">BUILDING SOLUTIONS</span>
                <span className="tracking-wider text-[9.5px]">ONE LINE AT A TIME</span>
              </div>
              <span className="text-xs text-[#092A4A]/50 dark:text-[#6EB5F7]/50" aria-hidden="true">&gt;</span>
            </div>

            {/* Audio Toggle (44x44px touch target) */}
            <button
              type="button"
              id="sound-toggle-btn"
              onClick={handleToggleSound}
              aria-label={isMuted ? 'Unmute retro sound effects' : 'Mute retro sound effects'}
              title={isMuted ? 'Sound is MUTED (Click to unmute)' : 'Sound is ON (Click to mute)'}
              className="flex items-center justify-center w-11 h-11 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#092A4A] dark:focus-visible:outline-[#6EB5F7]"
            >
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
                  isMuted
                    ? 'bg-[#EADBC3] dark:bg-[#151520] text-[#4B6173] dark:text-[#94A3B8] border-[#C8B79D] dark:border-[#2B3040]'
                    : 'bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] border-[#061B30] dark:border-[#1E3A8A] shadow-xs'
                }`}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-[#6FAF75] dark:text-[#0A0A0F]" />}
              </span>
            </button>

            {/* Theme Toggle Button (44x44px touch target) */}
            <button
              type="button"
              id="theme-toggle-btn"
              onClick={handleToggleTheme}
              aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="w-11 h-11 flex items-center justify-center text-[#092A4A] dark:text-[#6EB5F7] hover:bg-[#092A4A]/10 dark:hover:bg-[#6EB5F7]/10 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#092A4A] dark:focus-visible:outline-[#6EB5F7]"
            >
              {isDark ? (
                <svg className="w-5 h-5 pixelated" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 1.5C4.4 1.5 1.5 4.4 1.5 8s2.9 6.5 6.5 6.5c3.2 0 5.8-2.3 6.4-5.3-.2 0-.3.1-.5.1-3 0-5.5-2.5-5.5-5.5 0-.3 0-.5.1-.8-.8-.6-1.9-1-3-1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 pixelated" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="7.25" y="1" width="1.5" height="2" rx="0.5" />
                  <rect x="7.25" y="13" width="1.5" height="2" rx="0.5" />
                  <rect x="1" y="7.25" width="2" height="1.5" rx="0.5" />
                  <rect x="13" y="7.25" width="2" height="1.5" rx="0.5" />
                  <rect x="2.8" y="2.8" width="1.5" height="1.5" rx="0.5" transform="rotate(45 3.5 3.5)" />
                  <rect x="11.8" y="11.8" width="1.5" height="1.5" rx="0.5" transform="rotate(45 12.5 12.5)" />
                  <rect x="2.8" y="11.8" width="1.5" height="1.5" rx="0.5" transform="rotate(-45 3.5 12.5)" />
                  <rect x="11.8" y="2.8" width="1.5" height="1.5" rx="0.5" transform="rotate(-45 12.5 3.5)" />
                </svg>
              )}
            </button>

            {/* Mobile Hamburger Menu Button (< 1024px, 44x44px touch target) */}
            <button
              type="button"
              id="mobile-menu-toggle-btn"
              onClick={() => {
                soundManager.playSelect();
                setMobileMenuOpen((prev) => !prev);
              }}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-lg border border-[#C8B79D] dark:border-[#2B3040] bg-[#EADBC3]/70 dark:bg-[#151520] text-[#092A4A] dark:text-[#6EB5F7] hover:bg-[#092A4A] hover:text-[#F4E9D5] dark:hover:bg-[#3B82F6] dark:hover:text-[#0A0A0F] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#092A4A]"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile & Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 sm:top-[72px] z-[58] bg-[#061B30]/60 backdrop-blur-xs flex flex-col justify-between animate-in fade-in duration-150"
          onClick={() => setMobileMenuOpen(false)}
        >
          <nav
            id="mobile-nav-drawer"
            aria-label="Mobile Navigation"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[calc(100dvh-64px)] overflow-y-auto bg-[#F4E9D5] dark:bg-[#0A0A0F] border-b-2 border-[#092A4A] dark:border-[#3B82F6] shadow-2xl px-4 py-4 space-y-2"
          >
            <div className="flex items-center justify-between px-1 pb-2 border-b border-[#C8B79D]/60 dark:border-[#2B3040]">
              <span className="font-mono-tech text-[11px] font-bold tracking-widest uppercase text-[#4B6173] dark:text-[#94A3B8]">
                SYS://SELECT_DESTINATION
              </span>
              <span className="font-mono-tech text-[10px] text-[#3DA66B] font-semibold">
                5 CHANNELS READY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    id={`mobile-drawer-btn-${item.id}`}
                    onClick={() => handleNavigate(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full min-h-[52px] px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] border-[#061B30] dark:border-[#1E3A8A] shadow-sm'
                        : 'bg-[#EADBC3]/60 dark:bg-[#151520] text-[#10283F] dark:text-[#E0E6ED] border-[#C8B79D] dark:border-[#2B3040] hover:border-[#092A4A] dark:hover:border-[#6EB5F7]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-[#F4E9D5]/15 dark:bg-[#0A0A0F]/15 text-[#F4E9D5] dark:text-[#0A0A0F]'
                            : 'bg-[#092A4A]/10 dark:bg-[#3B82F6]/15 text-[#092A4A] dark:text-[#6EB5F7]'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-sm truncate">
                            {item.label}
                          </span>
                          <span
                            className={`font-mono-tech text-[9.5px] px-1.5 py-0.5 rounded ${
                              isActive
                                ? 'bg-[#F4E9D5]/20 dark:bg-[#0A0A0F]/20 text-[#F4E9D5] dark:text-[#0A0A0F]'
                                : 'bg-[#092A4A]/10 dark:bg-[#3B82F6]/10 text-[#4B6173] dark:text-[#94A3B8]'
                            }`}
                          >
                            {item.level}
                          </span>
                        </div>
                        <span
                          className={`font-mono-tech text-[11px] block truncate ${
                            isActive
                              ? 'text-[#F4E9D5]/80 dark:text-[#0A0A0F]/80'
                              : 'text-[#4B6173] dark:text-[#94A3B8]'
                          }`}
                        >
                          {item.desc}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono-tech text-xs font-bold shrink-0">
                      {isActive ? '[ACTIVE]' : '→'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Socials & Direct Actions in Mobile Drawer */}
            <div className="pt-3 mt-2 border-t border-[#C8B79D]/60 dark:border-[#2B3040] flex items-center justify-between gap-2">
              <span className="font-mono-tech text-[11px] text-[#4B6173] dark:text-[#94A3B8]">
                Direct Links:
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={PERSONAL_INFO.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="w-11 h-11 rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] flex items-center justify-center"
                >
                  <Github size={17} />
                </a>
                <a
                  href={PERSONAL_INFO.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="w-11 h-11 rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] flex items-center justify-center"
                >
                  <Linkedin size={17} />
                </a>
                <a
                  href={PERSONAL_INFO.socials.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="External Portfolio Website"
                  className="w-11 h-11 rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] flex items-center justify-center"
                >
                  <Globe size={17} />
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
