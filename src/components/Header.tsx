import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Terminal } from 'lucide-react';
import { NavSection } from '../types';
import { soundManager } from '../utils/soundEffects';

interface HeaderProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onSelectSection }) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    soundManager.initFromStorage();
    setIsMuted(soundManager.isMuted());
  }, []);

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playSelect();
    }
  };

  const navItems: { id: NavSection; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#092A4A]/10 select-none">
      {/* Left: Pixel Avatar + Name & Title */}
      <div 
        onClick={() => {
          soundManager.playSelect();
          onSelectSection('home');
        }}
        className="flex items-center gap-3.5 cursor-pointer group"
        id="header-brand"
      >
        {/* Pixel Avatar */}
        <div className="w-10 h-10 rounded-sm bg-[#092A4A] p-1 flex items-center justify-center shadow-sm border border-[#061B30] relative overflow-hidden transition-transform group-hover:scale-105">
          <svg className="w-8 h-8 pixelated" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <rect x="6" y="9" width="4" height="3" fill="#F4E9D5" />
            {/* Backpack strap */}
            <rect x="4" y="9" width="1.5" height="5" fill="#C85C57" />
            <rect x="10.5" y="9" width="1.5" height="5" fill="#C85C57" />
          </svg>
          <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#3DA66B] animate-pulse" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg sm:text-xl text-[#092A4A] tracking-tight">
              Suraj Yadav
            </span>
          </div>
          <span className="font-mono-tech text-xs text-[#4B6173] tracking-wide block">
            Software Engineer
          </span>
        </div>
      </div>

      {/* Center: Navigation Bar with Blueprint Framing (matching photo) */}
      <div className="flex items-center gap-2" id="header-nav-container">
        <span className="text-xs font-mono-tech text-[#092A4A]/40 select-none">{'{'}</span>
        <nav 
          className="flex items-center gap-1 sm:gap-2 px-1 py-1 select-none"
          id="header-nav"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => {
                  soundManager.playNavigate();
                  onSelectSection(item.id);
                }}
                className={`font-mono-tech text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'border-b-2 border-[#092A4A] text-[#092A4A] font-bold'
                    : 'text-[#4B6173] hover:text-[#092A4A]'
                }`}
              >
                {isActive ? `[ ${item.label} ]` : item.label}
              </button>
            );
          })}
        </nav>
        <span className="text-xs font-mono-tech text-[#092A4A]/40 select-none">{'}'}</span>
      </div>

      {/* Right: Technical Blueprint Tagline + Audio & Sun Icon (matching photo) */}
      <div className="flex items-center gap-3" id="header-controls">
        <div className="hidden lg:flex items-center gap-1 text-right font-mono-tech text-[10px] text-[#4B6173] leading-tight select-none">
          <span className="text-xs text-[#092A4A]/50">&lt;</span>
          <div className="flex flex-col">
            <span className="text-[#092A4A] font-bold tracking-widest">BUILDING SOLUTIONS</span>
            <span className="tracking-wider text-[9.5px]">ONE LINE AT A TIME</span>
          </div>
          <span className="text-xs text-[#092A4A]/50">&gt;</span>
        </div>

        {/* Audio Toggle */}
        <button
          id="sound-toggle-btn"
          onClick={handleToggleSound}
          title={isMuted ? 'Sound is MUTED (Click to unmute)' : 'Sound is ON (Click to mute)'}
          className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all cursor-pointer ${
            isMuted
              ? 'bg-[#EADBC3] text-[#4B6173] border-[#C8B79D]'
              : 'bg-[#092A4A] text-[#F4E9D5] border-[#061B30] shadow-xs'
          }`}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-[#6FAF75]" />}
        </button>

        {/* Sun / Pixel Ambient Icon matching photo */}
        <div className="w-7 h-7 flex items-center justify-center text-[#092A4A] opacity-80" title="System Normal">
          <svg className="w-5 h-5 pixelated" viewBox="0 0 16 16" fill="currentColor">
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
        </div>
      </div>
    </header>
  );
};
