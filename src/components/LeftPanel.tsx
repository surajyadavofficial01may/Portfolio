import React from 'react';
import { MapPin, Github, Linkedin, Globe, Mail, ExternalLink, Cpu } from 'lucide-react';
import { PERSONAL_INFO, TECH_STACK } from '../data/portfolioData';
import { TechIcon } from './TechIcons';
import { soundManager } from '../utils/soundEffects';

interface LeftPanelProps {
  onSelectSkill?: (skillId: string) => void;
  onOpenContact?: () => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ onSelectSkill, onOpenContact }) => {
  return (
    <aside className="w-full lg:w-[350px] xl:w-[380px] flex flex-col gap-5 select-none relative p-3 sm:p-4 rounded-xl border border-dashed border-[#092A4A]/20 bg-[#EADBC3]/20" id="left-panel">
      {/* Blueprint Corner Accents */}
      <span className="absolute -top-1.5 -left-1.5 text-xs font-mono-tech text-[#092A4A]/50 select-none">┌</span>
      <span className="absolute -top-1.5 -right-1.5 text-xs font-mono-tech text-[#092A4A]/50 select-none">┐</span>
      <span className="absolute -bottom-1.5 -left-1.5 text-xs font-mono-tech text-[#092A4A]/50 select-none">└</span>
      <span className="absolute -bottom-1.5 -right-1.5 text-xs font-mono-tech text-[#092A4A]/50 select-none">┘</span>

      {/* Bio / Identity Block */}
      <div className="flex flex-col relative">
        {/* Role Badge */}
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#092A4A]/10 text-[#092A4A] font-mono-tech text-[11px] font-semibold tracking-wider mb-2 w-fit">
          <span>&lt;</span>
          <span>SOFTWARE ENGINEER</span>
          <span>&gt;</span>
        </div>

        {/* Developer Name */}
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#092A4A] tracking-tight leading-tight mb-2">
          {PERSONAL_INFO.name}
        </h1>

        {/* Hero Tagline */}
        <h2 className="font-mono-tech font-bold text-xs sm:text-sm text-[#10283F] leading-snug mb-2">
          {PERSONAL_INFO.tagline}
        </h2>

        {/* Short Bio */}
        <p className="font-mono-tech text-xs text-[#4B6173] leading-relaxed mb-4">
          {PERSONAL_INFO.bio}
        </p>

        {/* Location & Availability Information Cards */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="flex items-center gap-2 bg-[#F4E9D5] p-2 rounded-lg border border-[#C8B79D]">
            <MapPin size={15} className="text-[#092A4A] shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9.5px] font-mono-tech text-[#4B6173] uppercase tracking-wider">Location</span>
              <span className="text-xs font-mono-tech font-semibold text-[#10283F]">India</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#F4E9D5] p-2 rounded-lg border border-[#C8B79D]">
            <span className="relative flex h-2.5 w-2.5 shrink-0 ml-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3DA66B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3DA66B]" />
            </span>
            <div className="flex flex-col">
              <span className="text-[9.5px] font-mono-tech text-[#4B6173] uppercase tracking-wider">Availability</span>
              <span className="text-[10.5px] font-mono-tech font-semibold text-[#10283F] leading-tight">Open to opportunities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Connect With Me */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[#092A4A] text-xs">❖</span>
          <h3 className="font-display font-bold text-xs tracking-wider uppercase text-[#092A4A]">
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
            className="flex items-center justify-center h-10 rounded-lg bg-[#092A4A] hover:bg-[#123F68] text-[#F4E9D5] transition-all duration-150 shadow-xs hover:scale-105 active:scale-95 border border-[#061B30]"
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
            className="flex items-center justify-center h-10 rounded-lg bg-[#092A4A] hover:bg-[#123F68] text-[#F4E9D5] transition-all duration-150 shadow-xs hover:scale-105 active:scale-95 border border-[#061B30]"
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
            className="flex items-center justify-center h-10 rounded-lg bg-[#092A4A] hover:bg-[#123F68] text-[#F4E9D5] transition-all duration-150 shadow-xs hover:scale-105 active:scale-95 border border-[#061B30]"
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
            className="flex items-center justify-center h-10 rounded-lg bg-[#092A4A] hover:bg-[#123F68] text-[#F4E9D5] transition-all duration-150 shadow-xs hover:scale-105 active:scale-95 border border-[#061B30] cursor-pointer"
          >
            <Mail size={18} />
          </button>
        </div>
      </div>

      {/* Tech Stack Block: 4 columns x 2 rows (Matching photo exactly!) */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[#092A4A] text-xs">❖</span>
          <h3 className="font-display font-bold text-xs tracking-wider uppercase text-[#092A4A]">
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
                onSelectSkill?.(tech.id);
              }}
              title={tech.description}
              className="group flex flex-col items-center justify-center p-2 sm:p-2.5 bg-[#F4E9D5] hover:bg-[#EADBC3] rounded-lg border border-[#C8B79D] transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs hover:-translate-y-0.5 text-center"
            >
              <div className="w-7 h-7 flex items-center justify-center mb-1">
                <TechIcon name={tech.id} className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="font-mono-tech font-semibold text-[10.5px] sm:text-[11px] text-[#092A4A] truncate w-full">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pixel Mountain Graphic Accent & Tagline */}
      <div className="flex items-end justify-between pt-2">
        {/* Pixel Mountains SVG matching photo */}
        <svg className="w-24 h-11 pixelated text-[#092A4A]/65" viewBox="0 0 64 24" fill="currentColor">
          <polygon points="12,4 20,16 4,16" opacity="0.4" />
          <polygon points="34,2 48,20 20,20" opacity="0.6" />
          <polygon points="52,6 62,20 42,20" opacity="0.5" />
          <rect x="0" y="20" width="64" height="4" fill="currentColor" opacity="0.8" />
          <rect x="18" y="3" width="3" height="3" fill="#F4E9D5" opacity="0.9" />
          <rect x="33" y="2" width="4" height="3" fill="#F4E9D5" opacity="0.9" />
        </svg>

        <div className="flex items-center gap-1 text-[11px] font-mono-tech text-[#4B6173]">
          <span>+</span>
          <span className="tracking-wider">Code / Build / Grow →</span>
        </div>
      </div>
    </aside>
  );
};
