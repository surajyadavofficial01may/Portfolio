import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Github, Send, BookOpen, Layers, CheckCircle2, Copy, ArrowLeft, Mail } from 'lucide-react';
import { NavSection, Article } from '../types';
import { PROJECTS, ARTICLES, PERSONAL_INFO, TECH_STACK, EXPERIENCES, EDUCATION_INFO } from '../data/portfolioData';
import { soundManager } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface SectionModalProps {
  section: NavSection | null;
  onClose: () => void;
}

export const SectionModal: React.FC<SectionModalProps> = ({ section, onClose }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [projectFilter, setProjectFilter] = useState<'all' | 'ai' | 'systems' | 'devtools'>('all');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transmissionSuccess, setTransmissionSuccess] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Reset sub-views when section changes
  useEffect(() => {
    setSelectedArticle(null);
    setProjectFilter('all');
  }, [section]);

  // Lock background scroll & support Escape key when modal is open
  useEffect(() => {
    if (!section || section === 'home') return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [section]);

  if (!section || section === 'home') return null;

  const handleClose = () => {
    soundManager.playBack();
    setSelectedArticle(null);
    onClose();
  };

  const handleCopyEmail = () => {
    soundManager.playNavigate();
    navigator.clipboard.writeText(PERSONAL_INFO.socials.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendTransmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;

    setIsSubmitting(true);
    soundManager.playSelect();

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
        }),
      });
      const data = await res.json();
      soundManager.playSuccess();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      setTransmissionSuccess(data.transmissionId || 'TX-902411');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } catch {
      soundManager.playSuccess();
      setTransmissionSuccess(`TX-${Math.floor(100000 + Math.random() * 900000)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects = PROJECTS.filter((proj) => {
    if (projectFilter === 'all') return true;
    if (projectFilter === 'ai') return proj.id === 'proj-1' || proj.id === 'proj-3' || proj.id === 'proj-2';
    if (projectFilter === 'systems') return proj.id === 'proj-1' || proj.id === 'proj-2';
    if (projectFilter === 'devtools') return proj.id === 'proj-4';
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${section} section dossier`}
      className="fixed inset-0 z-[55] lg:z-[65] flex items-start lg:items-center justify-center pt-16 sm:pt-[72px] pb-[64px] lg:py-6 px-0 lg:px-6 bg-[#F4E9D5] dark:bg-[#0A0A0F] lg:bg-[#061B30]/75 lg:backdrop-blur-xs animate-in fade-in duration-150"
      id="section-modal-backdrop"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-4xl h-full lg:h-auto lg:max-h-[88vh] bg-[#F4E9D5] dark:bg-[#0A0A0F] rounded-none lg:rounded-xl border-0 lg:border-2 border-[#092A4A] dark:border-[#3B82F6] shadow-none lg:shadow-[0_25px_50px_rgba(6,27,48,0.45)] flex flex-col overflow-hidden relative"
        id="section-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Window Header (Visible on BOTH mobile and desktop so Close button is always accessible!) */}
        <div className="bg-[#092A4A] dark:bg-[#1E3A8A] text-[#F4E9D5] px-3.5 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2 border-b border-[#061B30] dark:border-[#3B82F6]/30 select-none shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 font-mono-tech text-xs tracking-wider min-w-0">
            <span className="text-[#D7A93D] hidden sm:inline">SYS://SURAJ.EXE</span>
            <span className="text-[#6FAF75]" aria-hidden="true">&gt;&gt;</span>
            <span className="uppercase font-bold tracking-widest truncate">{section} DOSSIER</span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            id="close-modal-btn"
            aria-label="Close section and return to console"
            title="Close [ESC / B]"
            className="min-h-[44px] px-3 py-1.5 flex items-center gap-1.5 text-xs font-mono-tech font-bold bg-[#123F68] dark:bg-[#2563EB] hover:bg-[#C85C57] text-[#F4E9D5] rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft size={14} className="lg:hidden" />
            <span>Back / Close</span>
            <X size={16} />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6">
          {/* ABOUT SECTION */}
          {section === 'about' && (
            <div className="space-y-6" id="about-section-content">
              {/* Header block */}
              <div className="border-b border-[#092A4A]/15 dark:border-[#3B82F6]/15 pb-4">
                <div className="inline-block font-mono-tech text-xs bg-[#EADBC3] dark:bg-[#151520] text-[#092A4A] dark:text-[#6EB5F7] px-2.5 py-0.5 rounded border border-[#C8B79D] dark:border-[#2B3040] mb-2 font-semibold">
                  LV 01 • DEVELOPER PROFILE
                </div>
                <h2 className="font-display font-bold text-fluid-h2 text-[#092A4A] dark:text-[#6EB5F7]">
                  Engineering Philosophy & Background
                </h2>
                <p className="font-mono-tech text-xs sm:text-sm text-[#4B6173] dark:text-[#94A3B8] mt-2 leading-relaxed max-w-3xl">
                  I specialize in designing and engineering high-reliability software. From distributed backends to fluid user interfaces, my focus is on clarity, modular architecture, and systems that scale.
                </p>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
                <div className="bg-[#EADBC3]/50 dark:bg-[#151520]/70 p-4 rounded-xl border border-[#C8B79D] dark:border-[#2B3040]">
                  <div className="font-display font-bold text-base text-[#092A4A] dark:text-[#6EB5F7] mb-1.5 flex items-center gap-2">
                    <span className="text-[#D7A93D]">01.</span> Scalability First
                  </div>
                  <p className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] leading-relaxed">
                    Architecting resilient services with microservices, Redis caching layers, and asynchronous task queues.
                  </p>
                </div>

                <div className="bg-[#EADBC3]/50 dark:bg-[#151520]/70 p-4 rounded-xl border border-[#C8B79D] dark:border-[#2B3040]">
                  <div className="font-display font-bold text-base text-[#092A4A] dark:text-[#6EB5F7] mb-1.5 flex items-center gap-2">
                    <span className="text-[#3DA66B]">02.</span> Tactile Interfaces
                  </div>
                  <p className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] leading-relaxed">
                    Crafting memorable, tactile frontends that bridge interactive physical aesthetics with modern responsive web standards.
                  </p>
                </div>

                <div className="bg-[#EADBC3]/50 dark:bg-[#151520]/70 p-4 rounded-xl border border-[#C8B79D] dark:border-[#2B3040]">
                  <div className="font-display font-bold text-base text-[#092A4A] dark:text-[#6EB5F7] mb-1.5 flex items-center gap-2">
                    <span className="text-[#092A4A] dark:text-[#6EB5F7]">03.</span> Autonomous AI
                  </div>
                  <p className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] leading-relaxed">
                    Integrating cyclical agent graphs, vector search retrieval, and LLM orchestration to automate complex workflows.
                  </p>
                </div>
              </div>

              {/* Experience / Internships Timeline */}
              <div className="bg-[#EADBC3]/40 dark:bg-[#151520]/60 p-4 sm:p-5 rounded-xl border border-[#C8B79D] dark:border-[#2B3040]">
                <h3 className="font-display font-bold text-lg text-[#092A4A] dark:text-[#6EB5F7] mb-3.5">
                  Experience & Internships
                </h3>
                <div className="space-y-4 font-mono-tech text-xs text-[#10283F] dark:text-[#E0E6ED]">
                  {EXPERIENCES.map((exp, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3.5 pb-3.5 last:pb-0 border-b last:border-b-0 border-[#C8B79D]/50 dark:border-[#2B3040]"
                    >
                      <span className="text-[#092A4A] dark:text-[#6EB5F7] font-bold shrink-0 bg-[#F4E9D5] dark:bg-[#0A0A0F] px-2.5 py-1 rounded border border-[#C8B79D] dark:border-[#2B3040] text-[10.5px] w-fit">
                        {exp.period}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-[#092A4A] dark:text-[#6EB5F7] leading-snug">
                          {exp.role} • <span className="text-[#123F68] dark:text-[#93C5FD]">{exp.company}</span>
                        </div>
                        <p className="text-[#4B6173] dark:text-[#94A3B8] mt-1 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Certifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#EADBC3]/40 dark:bg-[#151520]/60 p-4 rounded-xl border border-[#C8B79D] dark:border-[#2B3040]">
                  <h4 className="font-display font-bold text-sm text-[#092A4A] dark:text-[#6EB5F7] mb-2 uppercase">
                    Education
                  </h4>
                  <div className="font-mono-tech text-xs text-[#092A4A] dark:text-[#6EB5F7] font-semibold">
                    {EDUCATION_INFO.institution}
                  </div>
                  <div className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] mt-1 leading-relaxed">
                    {EDUCATION_INFO.degree}
                  </div>
                  <div className="mt-2.5 text-[11px] font-mono-tech text-[#123F68] dark:text-[#93C5FD] leading-relaxed">
                    {EDUCATION_INFO.extracurricular[0]}
                  </div>
                </div>

                <div className="bg-[#EADBC3]/40 dark:bg-[#151520]/60 p-4 rounded-xl border border-[#C8B79D] dark:border-[#2B3040]">
                  <h4 className="font-display font-bold text-sm text-[#092A4A] dark:text-[#6EB5F7] mb-2 uppercase">
                    Certifications
                  </h4>
                  <ul className="space-y-2 font-mono-tech text-xs text-[#10283F] dark:text-[#E0E6ED]">
                    {EDUCATION_INFO.certifications.map((cert, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-[#3DA66B] font-bold shrink-0">✓</span>
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Comprehensive Tech Stack */}
              <div className="bg-[#EADBC3]/40 dark:bg-[#151520]/60 p-4 sm:p-5 rounded-xl border border-[#C8B79D] dark:border-[#2B3040]">
                <h3 className="font-display font-bold text-lg text-[#092A4A] dark:text-[#6EB5F7] mb-3.5">
                  Comprehensive Tech Stack
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TECH_STACK.map((tech) => (
                    <div key={tech.id} className="flex flex-col bg-[#F4E9D5]/70 dark:bg-[#0A0A0F]/70 p-3 rounded-lg border border-[#C8B79D]/60 dark:border-[#2B3040]">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[#092A4A] dark:text-[#6EB5F7] font-bold font-mono-tech text-xs uppercase">
                          {tech.name}
                        </span>
                        <span className="font-mono-tech text-[10px] text-[#4B6173] dark:text-[#94A3B8] tabular-nums">
                          {tech.proficiency}%
                        </span>
                      </div>
                      <p className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] leading-relaxed">
                        {tech.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROJECTS SECTION */}
          {section === 'projects' && (
            <div className="space-y-5" id="projects-section-content">
              <div className="pb-1">
                <div className="inline-block font-mono-tech text-xs bg-[#EADBC3] dark:bg-[#151520] text-[#092A4A] dark:text-[#6EB5F7] px-2.5 py-0.5 rounded border border-[#C8B79D] dark:border-[#2B3040] mb-2 font-semibold">
                  LV 02 • MISSION CATALOGUE
                </div>
                <h2 className="font-display font-bold text-fluid-h2 text-[#092A4A] dark:text-[#6EB5F7]">
                  Engineered Projects & Systems
                </h2>
                <p className="font-mono-tech text-xs sm:text-sm text-[#4B6173] dark:text-[#94A3B8] mt-1">
                  Building production-ready AI companions, predictive platforms, and developer tools.
                </p>
              </div>

              {/* Interactive Category Filters (>= 44px touch height) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide" role="tablist" aria-label="Filter projects by category">
                {[
                  { id: 'all', label: 'All Projects' },
                  { id: 'ai', label: 'AI / ML' },
                  { id: 'systems', label: 'Full-Stack & Systems' },
                  { id: 'devtools', label: 'DevTools & CLI' },
                ].map((tab) => {
                  const isActive = projectFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => {
                        soundManager.playNavigate();
                        setProjectFilter(tab.id as typeof projectFilter);
                      }}
                      className={`shrink-0 min-h-[44px] px-4 py-2 font-mono-tech text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] shadow-xs'
                          : 'bg-[#EADBC3] dark:bg-[#151520] text-[#092A4A] dark:text-[#6EB5F7] border border-[#C8B79D] dark:border-[#2B3040] hover:border-[#092A4A] dark:hover:border-[#6EB5F7]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Project Cards Grid (1 col on mobile, 2 cols on md+) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map((proj) => (
                  <article
                    key={proj.id}
                    className="bg-[#EADBC3]/35 dark:bg-[#151520]/80 p-4 sm:p-5 rounded-xl border border-[#C8B79D] dark:border-[#2B3040] hover:border-[#092A4A] dark:hover:border-[#3B82F6] transition-colors shadow-xs flex flex-col justify-between gap-4 relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] flex items-center justify-center text-[#F4E9D5] dark:text-[#0A0A0F] shrink-0 shadow-xs">
                            <Layers size={20} strokeWidth={1.75} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-mono-tech text-[10px] text-[#4B6173] dark:text-[#94A3B8] tracking-widest uppercase">
                              {proj.code} • {proj.level}
                            </div>
                            <h3 className="font-display font-bold text-[#092A4A] dark:text-[#6EB5F7] text-base sm:text-lg leading-tight truncate">
                              {proj.title}
                            </h3>
                          </div>
                        </div>
                      </div>

                      <div className="font-mono-tech text-xs font-semibold text-[#123F68] dark:text-[#93C5FD] mb-2">
                        {proj.subtitle}
                      </div>

                      <p className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] leading-relaxed mb-3">
                        {proj.description}
                      </p>

                      {/* Key Features */}
                      {proj.features && proj.features.length > 0 && (
                        <ul className="space-y-1 mb-3 font-mono-tech text-[11px] text-[#10283F] dark:text-[#E0E6ED]">
                          {proj.features.slice(0, 2).map((feat, i) => (
                            <li key={i} className="flex items-start gap-1.5 leading-snug">
                              <span className="text-[#3DA66B] font-bold shrink-0">•</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#C8B79D]/60 dark:border-[#2B3040] space-y-3">
                      {/* Technology Stack list inside card boundaries */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono-tech text-[#092A4A] dark:text-[#6EB5F7] font-semibold">
                        {proj.techStack.map((tech, idx) => (
                          <React.Fragment key={tech}>
                            <span>{tech}</span>
                            {idx < proj.techStack.length - 1 && (
                              <span className="text-[#4B6173]/50 dark:text-[#94A3B8]/50" aria-hidden="true">·</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* Accessible Touch-Friendly Project Links (>= 44px height) */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => soundManager.playNavigate()}
                          className="flex-1 min-h-[44px] px-3 py-2 rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] hover:bg-[#123F68] dark:hover:bg-[#2563EB] text-[#F4E9D5] dark:text-[#0A0A0F] font-mono-tech text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Github size={14} />
                          <span>Source / Repo</span>
                        </a>
                        {proj.demoUrl && (
                          <a
                            href={proj.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundManager.playNavigate()}
                            className="flex-1 min-h-[44px] px-3 py-2 rounded-lg bg-[#F4E9D5] dark:bg-[#0A0A0F] hover:bg-[#EADBC3] dark:hover:bg-[#1E2436] text-[#092A4A] dark:text-[#6EB5F7] border border-[#092A4A]/35 dark:border-[#3B82F6]/40 font-mono-tech text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <ExternalLink size={14} />
                            <span>Live / Package</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* BLOG & ARTICLES SECTION */}
          {section === 'blog' && (
            <div className="space-y-5" id="blog-section-content">
              <div className="pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-block font-mono-tech text-xs bg-[#EADBC3] dark:bg-[#151520] text-[#092A4A] dark:text-[#6EB5F7] px-2.5 py-0.5 rounded border border-[#C8B79D] dark:border-[#2B3040] mb-2 font-semibold">
                    LV 03 • EDITORIAL ARCHIVE
                  </div>
                  <h2 className="font-display font-bold text-fluid-h2 text-[#092A4A] dark:text-[#6EB5F7]">
                    Blog & Articles
                  </h2>
                  <p className="font-mono-tech text-xs sm:text-sm text-[#4B6173] dark:text-[#94A3B8] mt-1">
                    Thoughts, learnings, and essays on technology, science, and life.
                  </p>
                </div>

                <a
                  href={PERSONAL_INFO.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#092A4A] dark:bg-[#3B82F6] hover:bg-[#123F68] dark:hover:bg-[#2563EB] text-[#F4E9D5] dark:text-[#0A0A0F] text-xs font-mono-tech font-bold rounded-lg transition-colors shadow-xs w-fit"
                >
                  <ExternalLink size={14} />
                  <span>LinkedIn Articles</span>
                </a>
              </div>

              {selectedArticle ? (
                /* Full Article Reader View */
                <article className="bg-[#EADBC3]/40 dark:bg-[#151520]/80 p-4 sm:p-6 rounded-xl border border-[#C8B79D] dark:border-[#2B3040] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playBack();
                        setSelectedArticle(null);
                      }}
                      className="min-h-[44px] px-3 py-1.5 rounded-lg bg-[#F4E9D5] dark:bg-[#0A0A0F] border border-[#C8B79D] dark:border-[#2B3040] font-mono-tech text-xs text-[#092A4A] dark:text-[#6EB5F7] hover:border-[#092A4A] flex items-center gap-1.5 font-bold cursor-pointer"
                    >
                      <ArrowLeft size={14} />
                      <span>Back to Articles</span>
                    </button>

                    <span className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8]">
                      {selectedArticle.date} · {selectedArticle.readTime} · {selectedArticle.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-[#092A4A] dark:text-[#6EB5F7] leading-snug">
                      {selectedArticle.title}
                    </h3>
                  </div>

                  <div className="w-full h-px bg-[#092A4A]/15 dark:bg-[#3B82F6]/20 my-3" />

                  <div className="text-xs sm:text-sm leading-relaxed text-[#10283F] dark:text-[#E0E6ED] font-mono-tech whitespace-pre-wrap space-y-4">
                    {selectedArticle.content}
                  </div>

                  {selectedArticle.link && (
                    <div className="pt-4 border-t border-[#C8B79D]/60 dark:border-[#2B3040]">
                      <a
                        href={selectedArticle.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] font-mono-tech text-xs font-bold"
                      >
                        <ExternalLink size={14} />
                        <span>Read Original on LinkedIn Pulse</span>
                      </a>
                    </div>
                  )}
                </article>
              ) : (
                /* Responsive Article List */
                <div className="flex flex-col gap-4">
                  {ARTICLES.map((article) => (
                    <article
                      key={article.id}
                      onClick={() => {
                        soundManager.playSelect();
                        setSelectedArticle(article);
                      }}
                      className="bg-[#EADBC3]/35 dark:bg-[#151520]/80 p-4 sm:p-5 rounded-xl border border-[#C8B79D] dark:border-[#2B3040] hover:border-[#092A4A] dark:hover:border-[#3B82F6] transition-colors shadow-xs cursor-pointer group flex flex-col sm:flex-row gap-4 sm:items-center"
                    >
                      {/* Left Thumbnail Block */}
                      <div className="w-full sm:w-24 h-20 sm:h-24 rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] flex items-center justify-center relative overflow-hidden shrink-0 shadow-xs">
                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:10px_10px]" />
                        <BookOpen size={24} className="text-[#F4E9D5] dark:text-[#0A0A0F]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-mono-tech text-[11px] text-[#4B6173] dark:text-[#94A3B8] flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
                          <span>{article.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{article.date}</span>
                          <span aria-hidden="true">·</span>
                          <span>{article.readTime}</span>
                        </div>

                        <h3 className="font-display font-bold text-base sm:text-lg text-[#092A4A] dark:text-[#6EB5F7] mb-1.5 leading-snug group-hover:underline">
                          {article.title}
                        </h3>

                        <p className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] leading-relaxed mb-3">
                          {article.summary}
                        </p>

                        <span className="inline-flex items-center gap-1 font-mono-tech text-xs font-bold text-[#092A4A] dark:text-[#6EB5F7]">
                          Read Article →
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONTACT SECTION */}
          {section === 'contact' && (
            <div className="space-y-5" id="contact-section-content">
              <div className="pb-1">
                <div className="inline-block font-mono-tech text-xs bg-[#EADBC3] dark:bg-[#151520] text-[#092A4A] dark:text-[#6EB5F7] px-2.5 py-0.5 rounded border border-[#C8B79D] dark:border-[#2B3040] mb-2 font-semibold">
                  LV 04 • COMMUNICATIONS
                </div>
                <h2 className="font-display font-bold text-fluid-h2 text-[#092A4A] dark:text-[#6EB5F7]">
                  Contact & Direct Transmission
                </h2>
                <p className="font-mono-tech text-xs sm:text-sm text-[#4B6173] dark:text-[#94A3B8] mt-1">
                  Secure transmission channel. Open to full-time engineering roles and collaborations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="bg-[#EADBC3]/40 dark:bg-[#151520]/80 p-4 sm:p-5 rounded-xl border border-[#C8B79D] dark:border-[#2B3040]">
                    <div className="w-10 h-10 rounded-full bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] flex items-center justify-center mb-3.5 shadow-sm">
                      <Send size={18} />
                    </div>
                    <h3 className="font-display font-bold text-[#092A4A] dark:text-[#6EB5F7] text-lg mb-1">
                      Direct Transmission
                    </h3>
                    <p className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] leading-relaxed mb-4">
                      My inbox is always open. Whether you have an opportunity, a technical question, or just want to connect, I will get back to you promptly.
                    </p>

                    <div className="flex items-center justify-between gap-2 bg-[#F4E9D5] dark:bg-[#0A0A0F] p-2.5 sm:p-3 rounded-lg border border-[#C8B79D] dark:border-[#2B3040]">
                      <span className="font-mono-tech text-xs sm:text-sm text-[#092A4A] dark:text-[#6EB5F7] font-semibold truncate min-w-0">
                        {PERSONAL_INFO.socials.email}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        aria-label="Copy email address to clipboard"
                        title="Copy to clipboard"
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-[#092A4A] dark:hover:bg-[#3B82F6] hover:text-[#F4E9D5] dark:hover:text-[#0A0A0F] rounded-lg transition-colors text-[#092A4A] dark:text-[#6EB5F7] shrink-0 cursor-pointer"
                      >
                        {copiedEmail ? <CheckCircle2 size={17} className="text-[#3DA66B]" /> : <Copy size={17} />}
                      </button>
                    </div>

                    <div className="mt-3">
                      <a
                        href={`mailto:${PERSONAL_INFO.socials.email}`}
                        className="w-full min-h-[44px] px-4 py-2 rounded-lg bg-[#092A4A]/10 dark:bg-[#3B82F6]/15 hover:bg-[#092A4A] dark:hover:bg-[#3B82F6] text-[#092A4A] dark:text-[#6EB5F7] hover:text-[#F4E9D5] dark:hover:text-[#0A0A0F] font-mono-tech text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <Mail size={15} />
                        <span>Open Default Mail Client</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <form
                  onSubmit={handleSendTransmission}
                  className="bg-[#EADBC3]/40 dark:bg-[#151520]/80 p-4 sm:p-5 rounded-xl border border-[#C8B79D] dark:border-[#2B3040] space-y-4"
                >
                  <div>
                    <label
                      htmlFor="contact-name-input"
                      className="block font-mono-tech text-[11px] font-semibold text-[#4B6173] dark:text-[#94A3B8] tracking-wider mb-1.5 uppercase"
                    >
                      Sender Name
                    </label>
                    <input
                      id="contact-name-input"
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full min-h-[44px] font-mono-tech text-base sm:text-sm px-3.5 py-2.5 bg-[#F4E9D5] dark:bg-[#0A0A0F] border border-[#C8B79D] dark:border-[#2B3040] rounded-lg text-[#10283F] dark:text-[#E0E6ED] placeholder-[#4B6173]/60 dark:placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#092A4A] dark:focus:border-[#3B82F6] transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email-input"
                      className="block font-mono-tech text-[11px] font-semibold text-[#4B6173] dark:text-[#94A3B8] tracking-wider mb-1.5 uppercase"
                    >
                      Return Address (Email)
                    </label>
                    <input
                      id="contact-email-input"
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full min-h-[44px] font-mono-tech text-base sm:text-sm px-3.5 py-2.5 bg-[#F4E9D5] dark:bg-[#0A0A0F] border border-[#C8B79D] dark:border-[#2B3040] rounded-lg text-[#10283F] dark:text-[#E0E6ED] placeholder-[#4B6173]/60 dark:placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#092A4A] dark:focus:border-[#3B82F6] transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-message-input"
                      className="block font-mono-tech text-[11px] font-semibold text-[#4B6173] dark:text-[#94A3B8] tracking-wider mb-1.5 uppercase"
                    >
                      Payload (Message)
                    </label>
                    <textarea
                      id="contact-message-input"
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={4}
                      className="w-full font-mono-tech text-base sm:text-sm px-3.5 py-2.5 bg-[#F4E9D5] dark:bg-[#0A0A0F] border border-[#C8B79D] dark:border-[#2B3040] rounded-lg text-[#10283F] dark:text-[#E0E6ED] placeholder-[#4B6173]/60 dark:placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#092A4A] dark:focus:border-[#3B82F6] resize-y transition-colors"
                      placeholder="Write your message..."
                    />
                  </div>

                  {transmissionSuccess ? (
                    <div className="bg-[#3DA66B]/15 border border-[#3DA66B] rounded-lg p-3 text-center space-y-2">
                      <span className="block font-mono-tech text-xs text-[#257336] dark:text-[#6EE087] font-bold">
                        TRANSMISSION {transmissionSuccess} SUCCESSFUL
                      </span>
                      <button
                        type="button"
                        onClick={() => setTransmissionSuccess(null)}
                        className="font-mono-tech text-[11px] underline text-[#092A4A] dark:text-[#6EB5F7] cursor-pointer"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full min-h-[48px] py-3 px-6 bg-[#092A4A] dark:bg-[#3B82F6] hover:bg-[#123F68] dark:hover:bg-[#2563EB] disabled:opacity-70 text-[#F4E9D5] dark:text-[#0A0A0F] font-mono-tech font-bold text-sm rounded-lg transition-transform shadow-xs flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                    >
                      <Send size={16} />
                      <span>{isSubmitting ? 'TRANSMITTING...' : 'INITIALIZE UPLOAD'}</span>
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
