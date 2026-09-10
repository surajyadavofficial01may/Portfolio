import React, { useState } from 'react';
import { X, ExternalLink, Github, Send, Terminal, BookOpen, Layers, CheckCircle2, Copy } from 'lucide-react';
import { NavSection, Project, Article } from '../types';
import { PROJECTS, ARTICLES, PERSONAL_INFO, TECH_STACK, SPECIALTIES, EXPERIENCES, EDUCATION_INFO } from '../data/portfolioData';
import { soundManager } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface SectionModalProps {
  section: NavSection | null;
  onClose: () => void;
}

export const SectionModal: React.FC<SectionModalProps> = ({ section, onClose }) => {
  if (!section || section === 'home') return null;

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transmissionSuccess, setTransmissionSuccess] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

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
    } catch (err) {
      soundManager.playSuccess();
      setTransmissionSuccess(`TX-${Math.floor(100000 + Math.random() * 900000)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#061B30]/75 backdrop-blur-xs animate-in fade-in duration-200"
      id="section-modal-backdrop"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-[#F4E9D5] dark:bg-[#0A0A0F] rounded-xl border-2 border-[#092A4A] dark:border-[#3B82F6] shadow-[0_25px_50px_rgba(6,27,48,0.4)] flex flex-col overflow-hidden relative"
        id="section-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Window Header */}
        <div className="bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] px-4 py-3 sm:px-6 flex items-center justify-between border-b border-[#061B30] dark:border-[#1E3A8A] select-none">
          <div className="flex items-center gap-2 font-mono-tech text-xs tracking-wider">
            <span className="text-[#D7A93D]">SYS://SURaj.EXE</span>
            <span className="text-[#6FAF75]">&gt;&gt;</span>
            <span className="uppercase font-bold tracking-widest">{section} DOSSIER</span>
          </div>

          <button
            onClick={handleClose}
            id="close-modal-btn"
            title="Close [ESC / B]"
            className="flex items-center gap-1 text-xs font-mono-tech px-2 py-1 bg-[#123F68] dark:bg-[#2563EB] hover:bg-[#C85C57] text-[#F4E9D5] dark:text-[#0A0A0F] rounded transition-colors"
          >
            <span>ESC / [B]</span>
            <X size={15} />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* ABOUT SECTION */}
          {section === 'about' && (
            <div className="space-y-6">
              {/* Header block */}
              <div className="border-b border-[#092A4A]/15 dark:border-[#3B82F6]/15 pb-4">
                <div className="inline-block font-mono-tech text-xs bg-[#EADBC3] dark:bg-[#151520] text-[#092A4A] dark:text-[#6EB5F7] px-2.5 py-0.5 rounded border border-[#C8B79D] dark:border-[#2B3040] mb-2 font-semibold">
                  LV 01 • DEVELOPER PROFILE
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#092A4A] dark:text-[#6EB5F7]">
                  Engineering Philosophy & Background
                </h2>
                <p className="font-mono-tech text-sm text-[#4B6173] dark:text-[#94A3B8] mt-2 leading-relaxed">
                  I specialize in designing and engineering high-reliability software. From distributed backends to fluid user interfaces, my focus is on clarity, modular architecture, and systems that scale.
                </p>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#EADBC3]/50 dark:bg-[#151520]/50 p-4 rounded border border-[#C8B79D] dark:border-[#2B3040]">
                  <div className="font-display font-bold text-base text-[#092A4A] dark:text-[#6EB5F7] mb-1.5 flex items-center gap-2">
                    <span className="text-[#D7A93D]">01 //</span> Scalability First
                  </div>
                  <p className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] leading-relaxed">
                    Architecting resilient services with microservices, Redis caching layers, and asynchronous task queues.
                  </p>
                </div>

                <div className="bg-[#EADBC3]/50 dark:bg-[#151520]/50 p-4 rounded border border-[#C8B79D] dark:border-[#2B3040]">
                  <div className="font-display font-bold text-base text-[#092A4A] dark:text-[#6EB5F7] mb-1.5 flex items-center gap-2">
                    <span className="text-[#3DA66B]">02 //</span> Tactile Interfaces
                  </div>
                  <p className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] leading-relaxed">
                    Crafting memorable, tactile frontends that bridge interactive physical aesthetics with modern responsive web standards.
                  </p>
                </div>

                <div className="bg-[#EADBC3]/50 dark:bg-[#151520]/50 p-4 rounded border border-[#C8B79D] dark:border-[#2B3040]">
                  <div className="font-display font-bold text-base text-[#092A4A] dark:text-[#6EB5F7] mb-1.5 flex items-center gap-2">
                    <span className="text-[#092A4A] dark:text-[#6EB5F7]">03 //</span> Autonomous AI
                  </div>
                  <p className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] leading-relaxed">
                    Integrating cyclical agent graphs, vector search retrieval, and LLM orchestration to automate complex workflows.
                  </p>
                </div>
              </div>

              {/* Experience / Internships Timeline */}
              <div className="bg-[#EADBC3]/40 dark:bg-[#151520]/40 p-5 rounded-lg border border-[#C8B79D] dark:border-[#2B3040]">
                <h3 className="font-display font-bold text-lg text-[#092A4A] dark:text-[#6EB5F7] mb-3">
                  Experience & Internships
                </h3>
                <div className="space-y-4 font-mono-tech text-xs text-[#10283F] dark:text-[#E0E6ED]">
                  {EXPERIENCES.map((exp, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="text-[#092A4A] dark:text-[#6EB5F7] font-bold shrink-0 bg-[#F4E9D5] dark:bg-[#0A0A0F] px-2 py-0.5 rounded border border-[#C8B79D] dark:border-[#2B3040] text-[10px]">
                        {exp.period}
                      </span>
                      <div>
                        <div className="font-semibold text-sm text-[#092A4A] dark:text-[#6EB5F7]">
                          {exp.role} • <span className="text-[#123F68]">{exp.company}</span>
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
                <div className="bg-[#EADBC3]/40 dark:bg-[#151520]/40 p-4 rounded-lg border border-[#C8B79D] dark:border-[#2B3040]">
                  <h4 className="font-display font-bold text-sm text-[#092A4A] dark:text-[#6EB5F7] mb-2 uppercase">
                    🎓 Education
                  </h4>
                  <div className="font-mono-tech text-xs text-[#092A4A] dark:text-[#6EB5F7] font-semibold">
                    {EDUCATION_INFO.institution}
                  </div>
                  <div className="font-mono-tech text-[11px] text-[#4B6173] dark:text-[#94A3B8] mt-0.5">
                    {EDUCATION_INFO.degree}
                  </div>
                  <div className="mt-2 text-[10.5px] font-mono-tech text-[#123F68]">
                    {EDUCATION_INFO.extracurricular[0]}
                  </div>
                </div>

                <div className="bg-[#EADBC3]/40 dark:bg-[#151520]/40 p-4 rounded-lg border border-[#C8B79D] dark:border-[#2B3040]">
                  <h4 className="font-display font-bold text-sm text-[#092A4A] dark:text-[#6EB5F7] mb-2 uppercase">
                    📜 Certifications
                  </h4>
                  <ul className="space-y-1.5 font-mono-tech text-[11px] text-[#10283F] dark:text-[#E0E6ED]">
                    {EDUCATION_INFO.certifications.map((cert, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#3DA66B] font-bold">✓</span>
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Comprehensive Tech Stack */}
              <div className="bg-[#EADBC3]/40 dark:bg-[#151520]/40 p-5 rounded-lg border border-[#C8B79D] dark:border-[#2B3040]">
                <h3 className="font-display font-bold text-lg text-[#092A4A] dark:text-[#6EB5F7] mb-3">
                  Comprehensive Tech Stack
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TECH_STACK.map((tech) => (
                    <div key={tech.id} className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#092A4A] dark:text-[#6EB5F7] font-bold font-mono-tech text-[11px] uppercase bg-[#092A4A]/10 dark:bg-[#3B82F6]/10 px-1.5 py-0.5 rounded">
                          {tech.name}
                        </span>
                      </div>
                      <p className="font-mono-tech text-[11px] text-[#4B6173] dark:text-[#94A3B8] leading-relaxed pl-1">
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
            <div className="space-y-6">
              <div className="border-b border-[#092A4A]/15 dark:border-[#3B82F6]/15 pb-4">
                <div className="inline-block font-mono-tech text-xs bg-[#EADBC3] dark:bg-[#151520] text-[#092A4A] dark:text-[#6EB5F7] px-2.5 py-0.5 rounded border border-[#C8B79D] dark:border-[#2B3040] mb-2 font-semibold">
                  LV 02 • MISSION CATALOGUE
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#092A4A] dark:text-[#6EB5F7]">
                  Engineered Projects & Systems
                </h2>
                <p className="font-mono-tech text-sm text-[#4B6173] dark:text-[#94A3B8] mt-2">
                  Each project represents a distinct challenge in full-stack engineering, performance scaling, or intelligent agent orchestration.
                </p>
              </div>

              {/* Project Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROJECTS.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-[#EADBC3]/50 dark:bg-[#151520]/50 p-5 rounded-lg border border-[#C8B79D] dark:border-[#2B3040] flex flex-col justify-between hover:border-[#092A4A] dark:border-[#3B82F6] transition-colors shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono-tech text-[10px] text-[#092A4A] dark:text-[#6EB5F7] font-bold tracking-widest bg-[#F4E9D5] dark:bg-[#0A0A0F] px-2 py-0.5 rounded border border-[#C8B79D] dark:border-[#2B3040]">
                          {proj.code}
                        </span>
                        <span className="font-pixel text-[9px] text-[#D7A93D]">{proj.level}</span>
                      </div>

                      <h3 className="font-display font-bold text-lg text-[#092A4A] dark:text-[#6EB5F7] mb-1">
                        {proj.title}
                      </h3>
                      <h4 className="font-mono-tech text-xs text-[#123F68] font-medium mb-3">
                        {proj.subtitle}
                      </h4>

                      <p className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] leading-relaxed mb-4">
                        {proj.description}
                      </p>

                      {/* Tech stack pills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {proj.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="font-mono-tech text-[10px] px-2 py-0.5 bg-[#F4E9D5] dark:bg-[#0A0A0F] text-[#092A4A] dark:text-[#6EB5F7] rounded border border-[#C8B79D] dark:border-[#2B3040]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Key features */}
                      <ul className="space-y-1 mb-4">
                        {proj.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs font-mono-tech text-[#10283F] dark:text-[#E0E6ED]">
                            <span className="text-[#3DA66B] font-bold">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Links */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#092A4A]/10 dark:border-[#3B82F6]/10 mt-2">
                      {proj.metrics && (
                        <span className="font-mono-tech text-[10px] text-[#3DA66B] font-semibold">
                          ⚡ {proj.metrics}
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => soundManager.playNavigate()}
                          className="flex items-center gap-1 text-xs font-mono-tech px-2.5 py-1 bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] rounded hover:bg-[#123F68] dark:hover:bg-[#2563EB] dark:bg-[#2563EB] transition-colors"
                        >
                          <Github size={13} />
                          <span>Code</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLOG SECTION */}
          {section === 'blog' && (
            <div className="space-y-6">
              <div className="border-b border-[#092A4A]/15 dark:border-[#3B82F6]/15 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-block font-mono-tech text-xs bg-[#EADBC3] dark:bg-[#151520] text-[#092A4A] dark:text-[#6EB5F7] px-2.5 py-0.5 rounded border border-[#C8B79D] dark:border-[#2B3040] mb-2 font-semibold">
                    LV 03 • ARTICLE DATABASE
                  </div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#092A4A] dark:text-[#6EB5F7]">
                    Engineering Articles & Notes
                  </h2>
                  <p className="font-mono-tech text-sm text-[#4B6173] dark:text-[#94A3B8] mt-1">
                    Technical deep-dives on deep learning, real-time web architecture, and algorithms.
                  </p>
                </div>

                <a
                  href={PERSONAL_INFO.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#092A4A] dark:bg-[#3B82F6] hover:bg-[#123F68] dark:hover:bg-[#2563EB] dark:bg-[#2563EB] text-[#F4E9D5] dark:text-[#0A0A0F] text-xs font-mono-tech rounded border border-[#061B30] dark:border-[#1E3A8A] transition-colors"
                >
                  <ExternalLink size={13} />
                  <span>LinkedIn Articles</span>
                </a>
              </div>

              {selectedArticle ? (
                /* Full Article View */
                <div className="bg-[#EADBC3]/50 dark:bg-[#151520]/50 p-6 rounded-lg border border-[#C8B79D] dark:border-[#2B3040] space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        soundManager.playBack();
                        setSelectedArticle(null);
                      }}
                      className="font-mono-tech text-xs text-[#092A4A] dark:text-[#6EB5F7] hover:underline flex items-center gap-1 font-semibold"
                    >
                      ← BACK TO ARTICLE LIST
                    </button>

                    <a
                      href={selectedArticle.link || PERSONAL_INFO.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono-tech text-[#092A4A] dark:text-[#6EB5F7] hover:underline flex items-center gap-1"
                    >
                      <span>Share / Discuss on LinkedIn</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  <div className="flex items-center gap-3 font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8]">
                    <span className="bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] px-2 py-0.5 rounded font-bold">
                      DOC {selectedArticle.code}
                    </span>
                    <span>{selectedArticle.category}</span>
                    <span>•</span>
                    <span>{selectedArticle.readTime}</span>
                    <span>•</span>
                    <span className="text-[#092A4A] dark:text-[#6EB5F7] font-semibold">By {PERSONAL_INFO.name}</span>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-[#092A4A] dark:text-[#6EB5F7]">
                    {selectedArticle.title}
                  </h3>

                  <div className="font-mono-tech text-xs sm:text-sm text-[#10283F] dark:text-[#E0E6ED] leading-relaxed whitespace-pre-line pt-4 border-t border-[#092A4A]/15 dark:border-[#3B82F6]/15">
                    {selectedArticle.content}
                  </div>

                  <div className="pt-4 border-t border-[#092A4A]/15 dark:border-[#3B82F6]/15 flex items-center justify-between">
                    <span className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8]">
                      Author: {PERSONAL_INFO.name} • Software Engineer
                    </span>
                    <a
                      href={selectedArticle.link || PERSONAL_INFO.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] text-xs font-mono-tech rounded hover:bg-[#123F68] dark:hover:bg-[#2563EB] dark:bg-[#2563EB]"
                    >
                      {selectedArticle.link ? "Read on LinkedIn" : "Connect on LinkedIn"}
                    </a>
                  </div>
                </div>
              ) : (
                /* Article Directory */
                <div className="space-y-3">
                  {ARTICLES.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => {
                        soundManager.playSelect();
                        setSelectedArticle(art);
                      }}
                      className="group bg-[#EADBC3]/40 dark:bg-[#151520]/40 hover:bg-[#EADBC3] dark:hover:bg-[#151520] dark:bg-[#151520] p-4 sm:p-5 rounded-lg border border-[#C8B79D] dark:border-[#2B3040] hover:border-[#092A4A] dark:border-[#3B82F6] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 font-mono-tech text-xs">
                          <span className="text-[#092A4A] dark:text-[#6EB5F7] font-bold">DOC {art.code}</span>
                          <span className="text-[#4B6173] dark:text-[#94A3B8]">/</span>
                          <span className="text-[#3DA66B] font-semibold">{art.category}</span>
                          <span className="text-[#4B6173] dark:text-[#94A3B8]">({art.readTime})</span>
                        </div>
                        <h4 className="font-display font-bold text-base sm:text-lg text-[#092A4A] dark:text-[#6EB5F7] group-hover:text-[#123F68] transition-colors">
                          {art.title}
                        </h4>
                        <p className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] line-clamp-2">
                          {art.summary}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-1 font-mono-tech text-xs text-[#092A4A] dark:text-[#6EB5F7] font-semibold group-hover:translate-x-1 transition-transform">
                        <span>READ DOC</span>
                        <span>→</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONTACT SECTION */}
          {section === 'contact' && (
            <div className="space-y-6">
              <div className="border-b border-[#092A4A]/15 dark:border-[#3B82F6]/15 pb-4">
                <div className="inline-block font-mono-tech text-xs bg-[#EADBC3] dark:bg-[#151520] text-[#092A4A] dark:text-[#6EB5F7] px-2.5 py-0.5 rounded border border-[#C8B79D] dark:border-[#2B3040] mb-2 font-semibold">
                  LV 04 • TRANSMISSION CHANNEL
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#092A4A] dark:text-[#6EB5F7]">
                  Transmit a Message
                </h2>
                <p className="font-mono-tech text-sm text-[#4B6173] dark:text-[#94A3B8] mt-2">
                  Open to full-time roles, engineering consultations, and innovative web projects. Send a direct transmission below.
                </p>
              </div>

              {transmissionSuccess ? (
                <div className="bg-[#EADBC3]/70 dark:bg-[#151520]/70 p-6 rounded-lg border-2 border-[#3DA66B] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#3DA66B] text-[#F4E9D5] dark:text-[#0A0A0F] flex items-center justify-center mx-auto">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#092A4A] dark:text-[#6EB5F7]">
                    Transmission Confirmed!
                  </h3>
                  <div className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8]">
                    Receipt ID: <span className="font-bold text-[#092A4A] dark:text-[#6EB5F7]">{transmissionSuccess}</span>
                  </div>
                  <p className="font-mono-tech text-xs text-[#10283F] dark:text-[#E0E6ED] max-w-md mx-auto">
                    Your transmission has been logged directly into Suraj's developer terminal. He will reply via your provided email shortly!
                  </p>
                  <button
                    onClick={() => setTransmissionSuccess(null)}
                    className="font-mono-tech text-xs px-4 py-2 bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] rounded hover:bg-[#123F68] dark:hover:bg-[#2563EB] dark:bg-[#2563EB]"
                  >
                    SEND ANOTHER TRANSMISSION
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Direct Contact info card */}
                  <div className="bg-[#EADBC3]/50 dark:bg-[#151520]/50 p-5 rounded-lg border border-[#C8B79D] dark:border-[#2B3040] space-y-4">
                    <div className="font-display font-bold text-base text-[#092A4A] dark:text-[#6EB5F7]">
                      Direct Dispatch
                    </div>
                    <div className="space-y-2 text-xs font-mono-tech">
                      <div className="text-[#4B6173] dark:text-[#94A3B8]">Direct Email:</div>
                      <div className="bg-[#F4E9D5] dark:bg-[#0A0A0F] p-2 rounded border border-[#C8B79D] dark:border-[#2B3040] break-all font-semibold text-[#092A4A] dark:text-[#6EB5F7]">
                        {PERSONAL_INFO.socials.email}
                      </div>
                      <button
                        onClick={handleCopyEmail}
                        className="flex items-center gap-1.5 text-xs text-[#092A4A] dark:text-[#6EB5F7] hover:underline pt-0.5 font-semibold cursor-pointer"
                      >
                        <Copy size={13} />
                        <span>{copiedEmail ? 'Copied to clipboard!' : 'Copy Email Address'}</span>
                      </button>

                      {/* Phone block removed */}
                    </div>

                    <div className="pt-2 border-t border-[#092A4A]/10 dark:border-[#3B82F6]/10 flex items-center gap-2">
                      <a
                        href={PERSONAL_INFO.socials.github}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-[#F4E9D5] dark:bg-[#0A0A0F] border border-[#C8B79D] dark:border-[#2B3040] rounded text-xs font-mono-tech text-[#092A4A] dark:text-[#6EB5F7] hover:bg-[#092A4A] dark:hover:bg-[#3B82F6] dark:bg-[#3B82F6] hover:text-[#F4E9D5] dark:text-[#0A0A0F] transition-colors"
                      >
                        GitHub
                      </a>
                      <a
                        href={PERSONAL_INFO.socials.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-[#F4E9D5] dark:bg-[#0A0A0F] border border-[#C8B79D] dark:border-[#2B3040] rounded text-xs font-mono-tech text-[#092A4A] dark:text-[#6EB5F7] hover:bg-[#092A4A] dark:hover:bg-[#3B82F6] dark:bg-[#3B82F6] hover:text-[#F4E9D5] dark:text-[#0A0A0F] transition-colors"
                      >
                        LinkedIn
                      </a>
                    </div>

                    <div className="pt-2 border-t border-[#092A4A]/10 dark:border-[#3B82F6]/10 font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] leading-relaxed">
                      📍 Location: <span className="text-[#092A4A] dark:text-[#6EB5F7] font-semibold">{PERSONAL_INFO.location}</span><br />
                      🎓 University: <span className="text-[#092A4A] dark:text-[#6EB5F7] font-semibold">KIIT Deemed University</span><br />
                      ⚡ Response SLA: <span className="text-[#3DA66B] font-semibold">&lt; 24 Hours</span>
                    </div>
                  </div>

                  {/* Transmission Form */}
                  <form onSubmit={handleSendTransmission} className="md:col-span-2 space-y-4">
                    <div>
                      <label className="block font-mono-tech text-xs font-semibold text-[#092A4A] dark:text-[#6EB5F7] mb-1">
                        Callsign / Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Alex Vance"
                        className="w-full font-mono-tech text-sm px-3.5 py-2.5 bg-[#F4E9D5] dark:bg-[#0A0A0F] border border-[#C8B79D] dark:border-[#2B3040] rounded text-[#10283F] dark:text-[#E0E6ED] placeholder-[#4B6173]/60 focus:outline-none focus:border-[#092A4A] dark:border-[#3B82F6] focus:ring-1 focus:ring-[#092A4A]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono-tech text-xs font-semibold text-[#092A4A] dark:text-[#6EB5F7] mb-1">
                        Reply Vector / Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g. alex@company.com"
                        className="w-full font-mono-tech text-sm px-3.5 py-2.5 bg-[#F4E9D5] dark:bg-[#0A0A0F] border border-[#C8B79D] dark:border-[#2B3040] rounded text-[#10283F] dark:text-[#E0E6ED] placeholder-[#4B6173]/60 focus:outline-none focus:border-[#092A4A] dark:border-[#3B82F6] focus:ring-1 focus:ring-[#092A4A]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono-tech text-xs font-semibold text-[#092A4A] dark:text-[#6EB5F7] mb-1">
                        Transmission Content / Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Let's build scalable web applications together..."
                        className="w-full font-mono-tech text-sm px-3.5 py-2.5 bg-[#F4E9D5] dark:bg-[#0A0A0F] border border-[#C8B79D] dark:border-[#2B3040] rounded text-[#10283F] dark:text-[#E0E6ED] placeholder-[#4B6173]/60 focus:outline-none focus:border-[#092A4A] dark:border-[#3B82F6] focus:ring-1 focus:ring-[#092A4A] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 bg-[#092A4A] dark:bg-[#3B82F6] hover:bg-[#123F68] dark:hover:bg-[#2563EB] dark:bg-[#2563EB] disabled:opacity-70 text-[#F4E9D5] dark:text-[#0A0A0F] font-mono-tech font-bold text-sm rounded transition-all shadow-xs flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <Send size={16} />
                      <span>{isSubmitting ? 'TRANSMITTING PACKETS...' : 'SEND TRANSMISSION'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
