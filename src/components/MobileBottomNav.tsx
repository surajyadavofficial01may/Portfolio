import React from 'react';
import { Home, Menu, Briefcase, FileText, Mail } from 'lucide-react';
import { NavSection } from '../types';
import { soundManager } from '../utils/soundEffects';

interface MobileBottomNavProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeSection, onSelectSection }) => {
  const items = [
    { id: 'home', label: 'Home', icon: <Home size={20} /> },
    { id: 'about', label: 'About', icon: <Menu size={20} /> },
    { id: 'projects', label: 'Projects', icon: <Briefcase size={20} /> },
    { id: 'blog', label: 'Blog', icon: <FileText size={20} /> },
    { id: 'contact', label: 'Contact', icon: <Mail size={20} /> },
  ] as const;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#F4E9D5] dark:bg-[#0A0A0F] border-t border-[#C8B79D] dark:border-[#2B3040] flex items-center justify-around py-3 px-2 z-[60] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pb-safe">
      {items.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              soundManager.playSelect();
              onSelectSection(item.id);
            }}
            className={`relative flex flex-col items-center gap-1 min-w-[60px] transition-colors ${
              isActive ? 'text-[#092A4A] dark:text-[#6EB5F7]' : 'text-[#4B6173] dark:text-[#94A3B8] hover:text-[#092A4A] dark:hover:text-[#6EB5F7]'
            }`}
          >
            {item.icon}
            <span className={`text-[10px] font-mono-tech ${isActive ? 'font-bold' : ''}`}>
              {item.label}
            </span>
            {isActive && (
              <div className="absolute -bottom-3 w-8 h-1 rounded-t-sm bg-[#092A4A] dark:bg-[#6EB5F7]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
