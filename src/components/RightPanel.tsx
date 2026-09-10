import React from 'react';
import { Briefcase, Code, Layers, Brain, Sparkles, ChevronRight, CheckCircle2, ShieldCheck, Cloud, Terminal } from 'lucide-react';
import { JOURNEY_METRICS, SPECIALTIES, CURRENTLY_BUILDING, RECENT_HIGHLIGHTS } from '../data/portfolioData';
import { soundManager } from '../utils/soundEffects';

interface RightPanelProps {
  onOpenProject?: (projectId: string) => void;
  onExploreSpecialty?: (specialty: string) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ onOpenProject, onExploreSpecialty }) => {
  const getMetricIcon = (name: string) => {
    switch (name) {
      case 'Briefcase':
        return <Briefcase size={16} className="text-[#092A4A] dark:text-[#6EB5F7]" />;
      case 'CodeXml':
        return <Code size={16} className="text-[#092A4A] dark:text-[#6EB5F7]" />;
      case 'Layers':
        return <Layers size={16} className="text-[#092A4A] dark:text-[#6EB5F7]" />;
      case 'Brain':
        return <Brain size={16} className="text-[#092A4A] dark:text-[#6EB5F7]" />;
      default:
        return <Sparkles size={16} className="text-[#092A4A] dark:text-[#6EB5F7]" />;
    }
  };

  const getHighlightIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Terminal size={14} className="text-[#092A4A] dark:text-[#6EB5F7] shrink-0 mt-0.5" />;
      case 1:
        return <Sparkles size={14} className="text-[#D7A93D] shrink-0 mt-0.5" />;
      case 2:
        return <Cloud size={14} className="text-[#123F68] shrink-0 mt-0.5" />;
      case 3:
      default:
        return <ShieldCheck size={14} className="text-[#3DA66B] shrink-0 mt-0.5" />;
    }
  };

  return (
    <aside className="w-full lg:w-[350px] xl:w-[380px] flex flex-col gap-4 sm:gap-5 select-none" id="right-panel">
      {/* My Journey Metrics (4 in a single row matching photo!) */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[#092A4A] dark:text-[#6EB5F7] text-xs">❖</span>
          <h3 className="font-display font-bold text-xs tracking-wider uppercase text-[#092A4A] dark:text-[#6EB5F7]">
            MY JOURNEY
          </h3>
        </div>

        {/* 4 Metric Cards in 1 Row */}
        <div className="grid grid-cols-4 gap-2">
          {JOURNEY_METRICS.map((metric, idx) => (
            <div
              key={idx}
              className="bg-[#F4E9D5] dark:bg-[#0A0A0F] p-2 sm:p-2.5 rounded-lg border border-[#C8B79D] dark:border-[#2B3040] shadow-2xs flex flex-col items-center justify-between text-center hover:border-[#092A4A]/50 dark:border-[#3B82F6]/50 transition-colors"
            >
              <div className="w-6 h-6 rounded bg-[#EADBC3]/70 dark:bg-[#151520]/70 flex items-center justify-center mb-1">
                {getMetricIcon(metric.iconName)}
              </div>
              <span className="font-display font-bold text-lg sm:text-xl text-[#092A4A] dark:text-[#6EB5F7] leading-tight mb-1">
                {metric.value}
              </span>
              <div className="font-mono-tech text-[9px] sm:text-[9.5px] text-[#4B6173] dark:text-[#94A3B8] leading-tight line-clamp-2">
                {metric.label} {metric.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialties Pill Badges */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[#092A4A] dark:text-[#6EB5F7] text-xs">⚙</span>
          <h3 className="font-display font-bold text-xs tracking-wider uppercase text-[#092A4A] dark:text-[#6EB5F7]">
            SPECIALTIES
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SPECIALTIES.map((item, idx) => (
            <span
              key={idx}
              className="font-mono-tech text-[10.5px] px-2.5 py-1 bg-[#F4E9D5] dark:bg-[#0A0A0F] hover:bg-[#092A4A] dark:hover:bg-[#3B82F6] dark:bg-[#3B82F6] text-[#10283F] dark:text-[#E0E6ED] hover:text-[#F4E9D5] dark:text-[#0A0A0F] rounded-lg border border-[#C8B79D] dark:border-[#2B3040] transition-colors duration-150 shadow-2xs whitespace-nowrap cursor-default"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Currently Building Card (Matching photo: light background with dark icon badge!) */}
      <div 
        onClick={() => {
          soundManager.playSelect();
          onOpenProject?.('proj-1');
        }}
        id="currently-building-card"
        className="group bg-[#F4E9D5] dark:bg-[#0A0A0F] hover:bg-[#EADBC3] dark:hover:bg-[#151520] dark:bg-[#151520] p-3 sm:p-3.5 rounded-xl border border-[#C8B79D] dark:border-[#2B3040] shadow-xs flex items-center gap-3 cursor-pointer transition-all duration-150"
      >
        {/* Left Dark Icon Container */}
        <div className="w-10 h-10 rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>

        {/* Right Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[9.5px] font-mono-tech text-[#4B6173] dark:text-[#94A3B8] tracking-wider uppercase font-semibold">
              &lt; CURRENTLY BUILDING
            </span>
            <div className="flex items-center gap-1 bg-[#3DA66B]/15 text-[#257336] px-2 py-0.5 rounded-full border border-[#3DA66B]/30 text-[9.5px] font-mono-tech font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3DA66B] animate-pulse" />
              <span>In Progress</span>
            </div>
          </div>

          <h4 className="font-display font-bold text-sm text-[#092A4A] dark:text-[#6EB5F7] group-hover:text-[#123F68] transition-colors truncate">
            {CURRENTLY_BUILDING.title}
          </h4>

          <p className="font-mono-tech text-[11px] text-[#4B6173] dark:text-[#94A3B8] leading-tight line-clamp-1">
            {CURRENTLY_BUILDING.subtitle}
          </p>
        </div>

        <ChevronRight size={16} className="text-[#092A4A]/50 dark:text-[#6EB5F7]/50 group-hover:text-[#092A4A] dark:text-[#6EB5F7] group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>

      {/* Recent Highlights */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[#092A4A] dark:text-[#6EB5F7] text-xs">❖</span>
          <h3 className="font-display font-bold text-xs tracking-wider uppercase text-[#092A4A] dark:text-[#6EB5F7]">
            RECENT HIGHLIGHTS
          </h3>
        </div>

        <ul className="flex flex-col gap-2">
          {RECENT_HIGHLIGHTS.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs font-mono-tech text-[#10283F] dark:text-[#E0E6ED] leading-snug">
              {getHighlightIcon(idx)}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
