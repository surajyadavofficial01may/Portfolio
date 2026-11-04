import React from 'react';
import { Home, User, Briefcase, FileText, Mail } from 'lucide-react';
import { NavSection } from '../types';
import { soundManager } from '../utils/soundEffects';

interface MobileBottomNavProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeSection, onSelectSection }) => {
  const items = [
    { id: 'home', label: 'Home', icon: <Home size={19} /> },
    { id: 'about', label: 'About', icon: <User size={19} /> },
    { id: 'projects', label: 'Projects', icon: <Briefcase size={19} /> },
    { id: 'blog', label: 'Blog', icon: <FileText size={19} /> },
    { id: 'contact', label: 'Contact', icon: <Mail size={19} /> },
  ] as const;

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#F4E9D5]/95 dark:bg-[#0A0A0F]/95 backdrop-blur-md border-t border-[#C8B79D] dark:border-[#2B3040] grid grid-cols-5 items-center px-1 py-1 z-[60] shadow-[0_-4px_12px_rgba(0,0,0,0.08)] pb-safe"
    >
      {items.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            type="button"
            id={`mobile-bottom-nav-${item.id}`}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.label}
            onClick={() => {
              soundManager.playSelect();
              onSelectSection(item.id);
            }}
            className={`relative flex flex-col items-center justify-center gap-0.5 min-h-[48px] min-w-0 py-1 rounded-lg transition-colors cursor-pointer ${
              isActive
                ? 'text-[#092A4A] dark:text-[#6EB5F7] bg-[#092A4A]/8 dark:bg-[#3B82F6]/15'
                : 'text-[#4B6173] dark:text-[#94A3B8] hover:text-[#092A4A] dark:hover:text-[#6EB5F7]'
            }`}
          >
            {item.icon}
            <span className={`text-[10px] font-mono-tech leading-tight truncate max-w-full px-0.5 ${isActive ? 'font-bold' : ''}`}>
              {item.label}
            </span>
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-b-sm bg-[#092A4A] dark:bg-[#6EB5F7]" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
