import React from 'react';
import { Briefcase, Code, Layers, Brain, Sparkles, ChevronRight, ShieldCheck, Cloud, Terminal, BookOpen } from 'lucide-react';
import { JOURNEY_METRICS, SPECIALTIES, CURRENTLY_BUILDING, RECENT_HIGHLIGHTS } from '../data/portfolioData';
import { soundManager } from '../utils/soundEffects';

interface RightPanelProps {
  onOpenProject?: (projectId: string) => void;
  onExploreSpecialty?: (specialty: string) => void;
  onOpenBlog?: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  onOpenProject,
  onExploreSpecialty,
  onOpenBlog,
}) => {
  const getMetricIcon = (name: string) => {
    switch (name) {
      case 'Briefcase':
        return <Briefcase size={16} className="text-[#092A4A] dark:text-[#7DD3FC]" />;
      case 'CodeXml':
        return <Code size={16} className="text-[#092A4A] dark:text-[#7DD3FC]" />;
      case 'Layers':
        return <Layers size={16} className="text-[#092A4A] dark:text-[#7DD3FC]" />;
      case 'Brain':
        return <Brain size={16} className="text-[#092A4A] dark:text-[#7DD3FC]" />;
      default:
        return <Sparkles size={16} className="text-[#092A4A] dark:text-[#7DD3FC]" />;
    }
  };

  const getHighlightIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Terminal size={14} className="text-[#092A4A] dark:text-[#7DD3FC] shrink-0 mt-0.5" />;
      case 1:
        return <Sparkles size={14} className="text-[#D7A93D] dark:text-[#FBBF24] shrink-0 mt-0.5" />;
      case 2:
        return <Cloud size={14} className="text-[#123F68] dark:text-[#60A5FA] shrink-0 mt-0.5" />;
      case 3:
      default:
        return <ShieldCheck size={14} className="text-[#3DA66B] dark:text-[#34D399] shrink-0 mt-0.5" />;
    }
  };

  return (
    <aside
      aria-label="Journey Metrics, Specialties and Highlights"
      className="w-full flex flex-col gap-4 sm:gap-5 select-none relative p-3.5 sm:p-4 lg:p-3.5 xl:p-4 rounded-xl border border-dashed border-[#092A4A]/25 dark:border-[#3B82F6]/50 bg-[#EADBC3]/25 dark:bg-[#111E32]/90 dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
      id="right-panel"
    >
      {/* Blueprint Corner Accents */}
      <span className="absolute -top-1.5 -left-1.5 text-xs font-mono-tech text-[#092A4A]/50 dark:text-[#7DD3FC] select-none pointer-events-none" aria-hidden="true">┌</span>
      <span className="absolute -top-1.5 -right-1.5 text-xs font-mono-tech text-[#092A4A]/50 dark:text-[#7DD3FC] select-none pointer-events-none" aria-hidden="true">┐</span>
      <span className="absolute -bottom-1.5 -left-1.5 text-xs font-mono-tech text-[#092A4A]/50 dark:text-[#7DD3FC] select-none pointer-events-none" aria-hidden="true">└</span>
      <span className="absolute -bottom-1.5 -right-1.5 text-xs font-mono-tech text-[#092A4A]/50 dark:text-[#7DD3FC] select-none pointer-events-none" aria-hidden="true">┘</span>

      {/* My Journey Metrics (2x2 on very narrow screens <380px, 4-in-a-row on >=380px) */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[#092A4A] dark:text-[#7DD3FC] text-xs" aria-hidden="true">❖</span>
          <h3 className="font-display font-bold text-xs tracking-wider uppercase text-[#092A4A] dark:text-[#7DD3FC]">
            MY JOURNEY
          </h3>
        </div>

        <div className="grid grid-cols-2 min-[380px]:grid-cols-4 gap-2">
          {JOURNEY_METRICS.map((metric, idx) => (
            <div
              key={idx}
              className="bg-[#F4E9D5] dark:bg-[#172942] p-2.5 rounded-lg border border-[#C8B79D] dark:border-[#2E4C75] shadow-2xs dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)] flex flex-col items-center justify-between text-center hover:border-[#092A4A]/50 dark:hover:border-[#60A5FA] transition-colors"
            >
              <div className="w-6 h-6 rounded bg-[#EADBC3]/70 dark:bg-[#0B1320] flex items-center justify-center mb-1">
                {getMetricIcon(metric.iconName)}
              </div>
              <span className="font-display font-bold text-lg sm:text-xl text-[#092A4A] dark:text-[#F8FAFC] leading-tight mb-0.5 tabular-nums">
                {metric.value}
              </span>
              <div className="font-mono-tech text-[10px] text-[#4B6173] dark:text-[#CBD5E1] leading-tight">
                {metric.label} {metric.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialties Interactive Tags */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[#092A4A] dark:text-[#7DD3FC] text-xs" aria-hidden="true">⚙</span>
          <h3 className="font-display font-bold text-xs tracking-wider uppercase text-[#092A4A] dark:text-[#7DD3FC]">
            SPECIALTIES
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SPECIALTIES.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                soundManager.playSelect();
                onExploreSpecialty?.(item);
              }}
              className="font-mono-tech text-[11px] font-medium px-2.5 py-1.5 min-h-[36px] bg-[#F4E9D5] dark:bg-[#172942] hover:bg-[#092A4A] dark:hover:bg-[#2563EB] text-[#10283F] dark:text-[#F1F5F9] hover:text-[#F4E9D5] dark:hover:text-white rounded-lg border border-[#C8B79D] dark:border-[#2E4C75] dark:hover:border-[#60A5FA] transition-colors duration-150 shadow-2xs cursor-pointer text-left"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Currently Building Card */}
      <button
        type="button"
        onClick={() => {
          soundManager.playSelect();
          onOpenProject?.('proj-2');
        }}
        id="currently-building-card"
        className="w-full text-left group bg-[#F4E9D5] dark:bg-[#172942] hover:bg-[#EADBC3] dark:hover:bg-[#1E3554] p-3.5 rounded-xl border border-[#C8B79D] dark:border-[#2E4C75] dark:hover:border-[#60A5FA] shadow-xs dark:shadow-[0_4px_14px_rgba(0,0,0,0.35)] flex items-center gap-3 cursor-pointer transition-all duration-150"
      >
        {/* Left Dark Icon Container */}
        <div className="w-11 h-11 rounded-lg bg-[#092A4A] dark:bg-[#2563EB] text-[#F4E9D5] dark:text-white border border-transparent dark:border-[#60A5FA]/60 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>

        {/* Right Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
            <span className="text-[9.5px] font-mono-tech text-[#4B6173] dark:text-[#CBD5E1] tracking-wider uppercase font-semibold">
              &lt; CURRENTLY BUILDING
            </span>
            <span className="inline-flex items-center gap-1 text-[#257336] dark:text-[#34D399] text-[10px] font-mono-tech font-semibold">
              <span>• In Progress</span>
            </span>
          </div>

          <h4 className="font-display font-bold text-sm text-[#092A4A] dark:text-[#F8FAFC] group-hover:text-[#123F68] dark:group-hover:text-[#7DD3FC] transition-colors truncate">
            {CURRENTLY_BUILDING.title}
          </h4>

          <p className="font-mono-tech text-[11px] text-[#4B6173] dark:text-[#CBD5E1] leading-snug line-clamp-2 mt-0.5">
            {CURRENTLY_BUILDING.subtitle}
          </p>
        </div>

        <ChevronRight
          size={16}
          className="text-[#092A4A]/50 dark:text-[#7DD3FC] group-hover:text-[#092A4A] dark:group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0"
        />
      </button>

      {/* Recent Highlights & Quick Articles Link */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[#092A4A] dark:text-[#7DD3FC] text-xs" aria-hidden="true">❖</span>
            <h3 className="font-display font-bold text-xs tracking-wider uppercase text-[#092A4A] dark:text-[#7DD3FC]">
              RECENT HIGHLIGHTS
            </h3>
          </div>
          {onOpenBlog && (
            <button
              type="button"
              onClick={() => {
                soundManager.playSelect();
                onOpenBlog();
              }}
              className="inline-flex items-center gap-1 font-mono-tech text-[11px] font-bold text-[#092A4A] dark:text-[#7DD3FC] hover:underline cursor-pointer py-0.5"
            >
              <BookOpen size={12} />
              <span>Articles →</span>
            </button>
          )}
        </div>

        <ul className="flex flex-col gap-2">
          {RECENT_HIGHLIGHTS.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs font-mono-tech text-[#10283F] dark:text-[#E2E8F0] leading-relaxed"
            >
              {getHighlightIcon(idx)}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
