import React, { useState } from 'react';
import { MapPin, Github, Linkedin, Globe, Mail, X, Briefcase, Send } from 'lucide-react';
import { PERSONAL_INFO, TECH_STACK } from '../data/portfolioData';
import { TechIcon } from './TechIcons';
import { soundManager } from '../utils/soundEffects';

interface LeftPanelProps {
  onSelectSkill?: (skillId: string) => void;
  onOpenProjects?: () => void;
  onOpenContact?: () => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  onSelectSkill,
  onOpenProjects,
  onOpenContact,
}) => {
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);

  const activeSkill = TECH_STACK.find((t) => t.id === activeSkillId);

  return (
    <aside
      aria-label="Developer Identity and Tech Stack"
      className="w-full flex flex-col gap-5 select-none relative p-3.5 sm:p-4 lg:p-3.5 xl:p-4 rounded-xl border border-dashed border-[#092A4A]/25 dark:border-[#3B82F6]/25 bg-[#EADBC3]/25 dark:bg-[#151520]/40"
      id="left-panel"
    >
      {/* Blueprint Corner Accents */}
      <span className="absolute -top-1.5 -left-1.5 text-xs font-mono-tech text-[#092A4A]/50 dark:text-[#6EB5F7]/50 select-none pointer-events-none" aria-hidden="true">┌</span>
      <span className="absolute -top-1.5 -right-1.5 text-xs font-mono-tech text-[#092A4A]/50 dark:text-[#6EB5F7]/50 select-none pointer-events-none" aria-hidden="true">┐</span>
      <span className="absolute -bottom-1.5 -left-1.5 text-xs font-mono-tech text-[#092A4A]/50 dark:text-[#6EB5F7]/50 select-none pointer-events-none" aria-hidden="true">└</span>
      <span className="absolute -bottom-1.5 -right-1.5 text-xs font-mono-tech text-[#092A4A]/50 dark:text-[#6EB5F7]/50 select-none pointer-events-none" aria-hidden="true">┘</span>

      {/* Bio / Hero Identity Block */}
      <div className="flex flex-col relative" id="hero-section">
        {/* Role Kicker */}
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#092A4A]/10 dark:bg-[#3B82F6]/15 text-[#092A4A] dark:text-[#6EB5F7] font-mono-tech text-[11px] font-semibold tracking-wider mb-2 w-fit">
          <span aria-hidden="true">&lt;</span>
          <span>SOFTWARE ENGINEER</span>
          <span aria-hidden="true">&gt;</span>
        </div>

        {/* Developer Name */}
        <h1 className="font-display font-bold text-fluid-hero text-[#092A4A] dark:text-[#6EB5F7] tracking-tight mb-2">
          {PERSONAL_INFO.name}
        </h1>

        {/* Hero Tagline */}
        <h2 className="font-mono-tech font-bold text-xs sm:text-sm text-[#10283F] dark:text-[#E0E6ED] leading-snug mb-2.5">
          {PERSONAL_INFO.tagline}
        </h2>

        {/* Short Bio */}
        <p className="font-mono-tech text-fluid-body text-[#4B6173] dark:text-[#94A3B8] mb-4">
          {PERSONAL_INFO.bio}
        </p>

        {/* Primary Hero CTAs (Immediately visible & touch-friendly >= 44px) */}
        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          <button
            type="button"
            id="hero-cta-projects"
            onClick={() => {
              soundManager.playSelect();
              onOpenProjects?.();
            }}
            className="min-h-[44px] px-3 py-2 rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] hover:bg-[#123F68] dark:hover:bg-[#2563EB] text-[#F4E9D5] dark:text-[#0A0A0F] font-mono-tech font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-[0.98]"
          >
            <Briefcase size={14} className="shrink-0" />
            <span className="truncate">View Projects</span>
          </button>

          <button
            type="button"
            id="hero-cta-contact"
            onClick={() => {
              soundManager.playSelect();
              onOpenContact?.();
            }}
            className="min-h-[44px] px-3 py-2 rounded-lg bg-[#F4E9D5] dark:bg-[#0A0A0F] hover:bg-[#EADBC3] dark:hover:bg-[#1E2436] text-[#092A4A] dark:text-[#6EB5F7] border border-[#092A4A]/40 dark:border-[#3B82F6]/40 font-mono-tech font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-[0.98]"
          >
            <Send size={14} className="shrink-0" />
            <span className="truncate">Contact Me</span>
          </button>
        </div>

        {/* Location & Availability Information Cards */}
        <div className="grid grid-cols-1 min-[350px]:grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-[#F4E9D5] dark:bg-[#0A0A0F] p-2.5 rounded-lg border border-[#C8B79D] dark:border-[#2B3040] min-w-0">
            <MapPin size={15} className="text-[#092A4A] dark:text-[#6EB5F7] shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[9.5px] font-mono-tech text-[#4B6173] dark:text-[#94A3B8] uppercase tracking-wider">
                Location
              </span>
              <span className="text-xs font-mono-tech font-semibold text-[#10283F] dark:text-[#E0E6ED] truncate">
                India
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#F4E9D5] dark:bg-[#0A0A0F] p-2.5 rounded-lg border border-[#C8B79D] dark:border-[#2B3040] min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0 ml-0.5" aria-hidden="true">
              <span className=" relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3DA66B]" />
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-[9.5px] font-mono-tech text-[#4B6173] dark:text-[#94A3B8] uppercase tracking-wider">
                Availability
              </span>
              <span className="text-[11px] font-mono-tech font-semibold text-[#10283F] dark:text-[#E0E6ED] leading-tight truncate">
                Open to opportunities
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Connect With Me (44px+ touch targets) */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[#092A4A] dark:text-[#6EB5F7] text-xs" aria-hidden="true">❖</span>
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
            aria-label="GitHub Profile"
            title="GitHub Profile"
            className="flex items-center justify-center min-h-[44px] rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] hover:bg-[#123F68] dark:hover:bg-[#2563EB] text-[#F4E9D5] dark:text-[#0A0A0F] transition-all duration-150 shadow-xs active:scale-95 border border-[#061B30] dark:border-[#1E3A8A]"
          >
            <Github size={18} />
          </a>

          <a
            href={PERSONAL_INFO.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playNavigate()}
            id="social-linkedin-btn"
            aria-label="LinkedIn Profile"
            title="LinkedIn Profile"
            className="flex items-center justify-center min-h-[44px] rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] hover:bg-[#123F68] dark:hover:bg-[#2563EB] text-[#F4E9D5] dark:text-[#0A0A0F] transition-all duration-150 shadow-xs active:scale-95 border border-[#061B30] dark:border-[#1E3A8A]"
          >
            <Linkedin size={18} />
          </a>

          <a
            href={PERSONAL_INFO.socials.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playNavigate()}
            id="social-x-btn"
            aria-label="External Portfolio Website"
            title="Portfolio Website"
            className="flex items-center justify-center min-h-[44px] rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] hover:bg-[#123F68] dark:hover:bg-[#2563EB] text-[#F4E9D5] dark:text-[#0A0A0F] transition-all duration-150 shadow-xs active:scale-95 border border-[#061B30] dark:border-[#1E3A8A]"
          >
            <Globe size={18} />
          </a>

          <button
            type="button"
            onClick={() => {
              soundManager.playSelect();
              onOpenContact?.();
            }}
            id="social-email-btn"
            aria-label="Send Email or Open Contact Form"
            title="Send Email / Contact"
            className="flex items-center justify-center min-h-[44px] rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] hover:bg-[#123F68] dark:hover:bg-[#2563EB] text-[#F4E9D5] dark:text-[#0A0A0F] transition-all duration-150 shadow-xs active:scale-95 border border-[#061B30] dark:border-[#1E3A8A] cursor-pointer"
          >
            <Mail size={18} />
          </button>
        </div>
      </div>

      {/* Tech Stack Block: Responsive 2x4 on tiny screens, 4x2 on >=360px */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[#092A4A] dark:text-[#6EB5F7] text-xs" aria-hidden="true">❖</span>
            <h3 className="font-display font-bold text-xs tracking-wider uppercase text-[#092A4A] dark:text-[#6EB5F7]">
              TECH STACK
            </h3>
          </div>
          <span className="font-mono-tech text-[10px] text-[#4B6173] dark:text-[#94A3B8]">
            Tap to inspect
          </span>
        </div>

        <div className="grid grid-cols-2 min-[360px]:grid-cols-4 gap-2">
          {TECH_STACK.map((tech) => {
            const isSelected = activeSkillId === tech.id;
            return (
              <button
                key={tech.id}
                type="button"
                onClick={() => {
                  soundManager.playNavigate();
                  setActiveSkillId(isSelected ? null : tech.id);
                }}
                aria-expanded={isSelected}
                title={tech.description}
                className={`group flex flex-col items-center justify-center min-h-[64px] p-2 sm:p-2.5 rounded-lg border transition-all duration-150 cursor-pointer shadow-2xs text-center ${
                  isSelected
                    ? 'bg-[#EADBC3] dark:bg-[#1E2436] border-[#092A4A] dark:border-[#6EB5F7] shadow-inner'
                    : 'bg-[#F4E9D5] dark:bg-[#0A0A0F] hover:bg-[#EADBC3] dark:hover:bg-[#151520] border-[#C8B79D] dark:border-[#2B3040]'
                }`}
              >
                <div className="w-7 h-7 flex items-center justify-center mb-1">
                  <TechIcon name={tech.iconKey} className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="font-mono-tech font-semibold text-[10.5px] sm:text-[11px] text-[#092A4A] dark:text-[#6EB5F7] truncate w-full">
                  {tech.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Inline Skill Details view */}
        {activeSkill && (
          <div className="mt-3 bg-[#EADBC3]/80 dark:bg-[#151520]/90 p-3.5 rounded-lg border border-[#092A4A]/25 dark:border-[#3B82F6]/30 relative animate-in fade-in duration-150">
            <button
              type="button"
              aria-label="Close skill details"
              onClick={() => setActiveSkillId(null)}
              className="absolute top-1 right-1 w-9 h-9 flex items-center justify-center text-[#092A4A]/60 dark:text-[#6EB5F7]/60 hover:text-[#092A4A] dark:hover:text-[#6EB5F7] cursor-pointer rounded-md"
            >
              <X size={15} />
            </button>
            <div className="flex items-center gap-2 mb-1.5 pr-8">
              <TechIcon name={activeSkill.iconKey} className="w-4 h-4 shrink-0" />
              <span className="font-mono-tech font-bold text-xs text-[#092A4A] dark:text-[#6EB5F7] uppercase">
                {activeSkill.name} Stack
              </span>
            </div>
            <p className="font-mono-tech text-xs text-[#10283F] dark:text-[#E0E6ED] leading-relaxed mb-2.5">
              {activeSkill.description}
            </p>
            <button
              type="button"
              onClick={() => {
                soundManager.playSelect();
                onSelectSkill?.(activeSkill.id);
              }}
              className="font-mono-tech text-[11px] font-bold text-[#092A4A] dark:text-[#6EB5F7] underline cursor-pointer py-1"
            >
              Open Full Engineering Profile →
            </button>
          </div>
        )}
      </div>

      {/* Pixel Mountain Graphic Accent & Tagline */}
      <div className="flex items-end justify-between pt-1 gap-2">
        <svg
          className="w-20 sm:w-24 h-10 sm:h-11 pixelated text-[#092A4A]/65 dark:text-[#6EB5F7]/65 shrink-0"
          viewBox="0 0 64 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <polygon points="12,4 20,16 4,16" opacity="0.4" />
          <polygon points="34,2 48,20 20,20" opacity="0.6" />
          <polygon points="52,6 62,20 42,20" opacity="0.5" />
          <rect x="0" y="20" width="64" height="4" fill="currentColor" opacity="0.8" />
          <rect x="18" y="3" width="3" height="3" fill="currentColor" opacity="0.9" />
          <rect x="33" y="2" width="4" height="3" fill="currentColor" opacity="0.9" />
        </svg>

        <div className="flex items-center gap-1 text-[11px] font-mono-tech text-[#4B6173] dark:text-[#94A3B8] truncate">
          <span aria-hidden="true">+</span>
          <span className="tracking-wider truncate">Code / Build / Grow →</span>
        </div>
      </div>
    </aside>
  );
};
