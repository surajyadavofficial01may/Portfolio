import React, { useState } from 'react';
import { MapPin, Github, Linkedin, Globe, Mail, ExternalLink, Cpu, X } from 'lucide-react';
import { PERSONAL_INFO, TECH_STACK } from '../data/portfolioData';
import { TechIcon } from './TechIcons';
import { soundManager } from '../utils/soundEffects';

interface LeftPanelProps {
  onSelectSkill?: (skillId: string) => void;
  onOpenContact?: () => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ onSelectSkill, onOpenContact }) => {
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);

  const activeSkill = TECH_STACK.find(t => t.id === activeSkillId);

  return (
    <aside className="w-full lg:w-[350px] xl:w-[380px] flex flex-col gap-5 select-none relative p-3 sm:p-4 rounded-xl border border-dashed border-[#092A4A]/20 dark:border-[#3B82F6]/20 bg-[#EADBC3]/20 dark:bg-[#151520]/20" id="left-panel">
      {/* Blueprint Corner Accents */}
      <span className="absolute -top-1.5 -left-1.5 text-xs font-mono-tech text-[#092A4A]/50 dark:text-[#6EB5F7]/50 select-none">┌</span>
      <span className="absolute -top-1.5 -right-1.5 text-xs font-mono-tech text-[#092A4A]/50 dark:text-[#6EB5F7]/50 select-none">┐</span>
      <span className="absolute -bottom-1.5 -left-1.5 text-xs font-mono-tech text-[#092A4A]/50 dark:text-[#6EB5F7]/50 select-none">└</span>
      <span className="absolute -bottom-1.5 -right-1.5 text-xs font-mono-tech text-[#092A4A]/50 dark:text-[#6EB5F7]/50 select-none">┘</span>

      {/* Bio / Identity Block */}
      <div className="flex flex-col relative">
        {/* Role Badge */}
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#092A4A]/10 dark:bg-[#3B82F6]/10 text-[#092A4A] dark:text-[#6EB5F7] font-mono-tech text-[11px] font-semibold tracking-wider mb-2 w-fit">
          <span>&lt;</span>
          <span>SOFTWARE ENGINEER</span>
          <span>&gt;</span>
        </div>

        {/* Developer Name */}
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#092A4A] dark:text-[#6EB5F7] tracking-tight leading-tight mb-2">
          {PERSONAL_INFO.name}
        </h1>

        {/* Hero Tagline */}
        <h2 className="font-mono-tech font-bold text-xs sm:text-sm text-[#10283F] dark:text-[#E0E6ED] leading-snug mb-2">
          {PERSONAL_INFO.tagline}
        </h2>

        {/* Short Bio */}
        <p className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] leading-relaxed mb-4">
          {PERSONAL_INFO.bio}
        </p>

        {/* Location & Availability Information Cards */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="flex items-center gap-2 bg-[#F4E9D5] dark:bg-[#0A0A0F] p-2 rounded-lg border border-[#C8B79D] dark:border-[#2B3040]">
            <MapPin size={15} className="text-[#092A4A] dark:text-[#6EB5F7] shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9.5px] font-mono-tech text-[#4B6173] dark:text-[#94A3B8] uppercase tracking-wider">Location</span>
              <span className="text-xs font-mono-tech font-semibold text-[#10283F] dark:text-[#E0E6ED]">India</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#F4E9D5] dark:bg-[#0A0A0F] p-2 rounded-lg border border-[#C8B79D] dark:border-[#2B3040]">
            <span className="relative flex h-2.5 w-2.5 shrink-0 ml-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3DA66B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3DA66B]" />
            </span>
            <div className="flex flex-col">
              <span className="text-[9.5px] font-mono-tech text-[#4B6173] dark:text-[#94A3B8] uppercase tracking-wider">Availability</span>
              <span className="text-[10.5px] font-mono-tech font-semibold text-[#10283F] dark:text-[#E0E6ED] leading-tight">Open to opportunities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Connect With Me */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[#092A4A] dark:text-[#6EB5F7] text-xs">❖</span>
          <h3 className="font-display font-bold text-xs tracking-wider uppercase text-[#092A4A] dark:text-[#6EB5F7]">
            CONNECT WITH ME
          </h3>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          <a
            href={PERSONAL_INFO.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playNavigate()}
            id="social-github-btn"
            title="GitHub Profile"
            className="flex items-center justify-center h-10 rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] hover:bg-[#123F68] dark:hover:bg-[#2563EB] dark:bg-[#2563EB] text-[#F4E9D5] dark:text-[#0A0A0F] transition-all duration-150 shadow-xs hover:scale-105 active:scale-95 border border-[#061B30] dark:border-[#1E3A8A]"
          >
            <Github size={18} />
          </a>

          <a
            href={PERSONAL_INFO.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playNavigate()}
            id="social-linkedin-btn"
            title="LinkedIn Profile"
            className="flex items-center justify-center h-10 rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] hover:bg-[#123F68] dark:hover:bg-[#2563EB] dark:bg-[#2563EB] text-[#F4E9D5] dark:text-[#0A0A0F] transition-all duration-150 shadow-xs hover:scale-105 active:scale-95 border border-[#061B30] dark:border-[#1E3A8A]"
          >
            <Linkedin size={18} />
          </a>

          <a
            href={PERSONAL_INFO.socials.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playNavigate()}
            id="social-x-btn"
            title="Portfolio Website"
            className="flex items-center justify-center h-10 rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] hover:bg-[#123F68] dark:hover:bg-[#2563EB] dark:bg-[#2563EB] text-[#F4E9D5] dark:text-[#0A0A0F] transition-all duration-150 shadow-xs hover:scale-105 active:scale-95 border border-[#061B30] dark:border-[#1E3A8A]"
          >
            <Globe size={18} />
          </a>

          <button
            onClick={() => {
              soundManager.playSelect();
              onOpenContact?.();
            }}
            id="social-email-btn"
            title="Send Email / Contact"
            className="flex items-center justify-center h-10 rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] hover:bg-[#123F68] dark:hover:bg-[#2563EB] dark:bg-[#2563EB] text-[#F4E9D5] dark:text-[#0A0A0F] transition-all duration-150 shadow-xs hover:scale-105 active:scale-95 border border-[#061B30] dark:border-[#1E3A8A] cursor-pointer"
          >
            <Mail size={18} />
          </button>
        </div>
      </div>

      {/* Tech Stack Block: 4 columns x 2 rows (Matching photo exactly!) */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[#092A4A] dark:text-[#6EB5F7] text-xs">❖</span>
          <h3 className="font-display font-bold text-xs tracking-wider uppercase text-[#092A4A] dark:text-[#6EB5F7]">
            TECH STACK
          </h3>
        </div>

        {/* 4x2 Centered Cards */}
        <div className="grid grid-cols-4 gap-2">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.id}
              onClick={() => {
                soundManager.playNavigate();
                setActiveSkillId(activeSkillId === tech.id ? null : tech.id);
              }}
              title={tech.description}
              className={`group flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-lg border transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs hover:-translate-y-0.5 text-center ${
                activeSkillId === tech.id ? 'bg-[#EADBC3] dark:bg-[#151520] border-[#092A4A] dark:border-[#3B82F6] shadow-inner' : 'bg-[#F4E9D5] dark:bg-[#0A0A0F] hover:bg-[#EADBC3] dark:hover:bg-[#151520] dark:bg-[#151520] border-[#C8B79D] dark:border-[#2B3040]'
              }`}
            >
              <div className="w-7 h-7 flex items-center justify-center mb-1">
                <TechIcon name={tech.iconKey} className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="font-mono-tech font-semibold text-[10.5px] sm:text-[11px] text-[#092A4A] dark:text-[#6EB5F7] truncate w-full">
                {tech.name}
              </span>
            </div>
          ))}
        </div>

        {/* Inline Skill Details view */}
        {activeSkill && (
          <div className="mt-3 bg-[#EADBC3]/70 dark:bg-[#151520]/70 p-3 rounded-lg border border-[#092A4A]/20 dark:border-[#3B82F6]/20 relative animate-in fade-in slide-in-from-top-2 duration-200">
            <button 
              onClick={() => setActiveSkillId(null)}
              className="absolute top-2 right-2 text-[#092A4A]/50 dark:text-[#6EB5F7]/50 hover:text-[#092A4A] dark:text-[#6EB5F7] cursor-pointer"
            >
              <X size={14} />
            </button>
            <div className="flex items-center gap-2 mb-1.5">
              <TechIcon name={activeSkill.iconKey} className="w-4 h-4" />
              <span className="font-mono-tech font-bold text-xs text-[#092A4A] dark:text-[#6EB5F7] uppercase">
                {activeSkill.name} Skills
              </span>
            </div>
            <p className="font-mono-tech text-[11.5px] text-[#10283F] dark:text-[#E0E6ED] leading-relaxed pr-4">
              {activeSkill.description}
            </p>
          </div>
        )}
      </div>

      {/* Pixel Mountain Graphic Accent & Tagline */}
      <div className="flex items-end justify-between pt-2">
        {/* Pixel Mountains SVG matching photo */}
        <svg className="w-24 h-11 pixelated text-[#092A4A]/65 dark:text-[#6EB5F7]/65" viewBox="0 0 64 24" fill="currentColor">
          <polygon points="12,4 20,16 4,16" opacity="0.4" />
          <polygon points="34,2 48,20 20,20" opacity="0.6" />
          <polygon points="52,6 62,20 42,20" opacity="0.5" />
          <rect x="0" y="20" width="64" height="4" fill="currentColor" opacity="0.8" />
          <rect x="18" y="3" width="3" height="3" fill="currentColor" opacity="0.9" />
          <rect x="33" y="2" width="4" height="3" fill="currentColor" opacity="0.9" />
        </svg>

        <div className="flex items-center gap-1 text-[11px] font-mono-tech text-[#4B6173] dark:text-[#94A3B8]">
          <span>+</span>
          <span className="tracking-wider">Code / Build / Grow →</span>
        </div>
      </div>
    </aside>
  );
};
