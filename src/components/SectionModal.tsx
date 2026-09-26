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
      className="fixed inset-0 z-[40] lg:z-[60] flex items-start lg:items-center justify-center pt-[76px] pb-[76px] px-0 lg:p-6 bg-[#F4E9D5] dark:bg-[#0A0A0F] lg:bg-[#061B30]/75 lg:backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto lg:overflow-hidden"
      id="section-modal-backdrop"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-4xl h-full min-h-[calc(100vh-152px)] lg:max-h-[90vh] bg-transparent lg:bg-[#F4E9D5] dark:lg:bg-[#0A0A0F] rounded-none lg:rounded-xl border-0 lg:border-2 border-[#092A4A] dark:border-[#3B82F6] shadow-none lg:shadow-[0_25px_50px_rgba(6,27,48,0.4)] flex flex-col lg:overflow-hidden relative"
        id="section-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Window Header */}
        <div className="hidden lg:flex bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] px-4 py-3 sm:px-6 items-center justify-between border-b border-[#061B30] dark:border-[#1E3A8A] select-none">
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
              <div className="pb-2">
                <h2 className="font-mono-tech font-bold text-lg text-[#092A4A] dark:text-[#6EB5F7] flex items-center gap-2">
                  <span className="text-xl">🛡️</span> PROJECTS
                </h2>
                <p className="font-mono-tech text-xs sm:text-sm text-[#4B6173] dark:text-[#94A3B8] mt-1">
                  Building real solutions for real problems.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button className="shrink-0 px-4 py-1.5 bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] font-mono-tech text-xs rounded-full shadow-xs">All</button>
                <button className="shrink-0 px-4 py-1.5 bg-[#EADBC3] dark:bg-[#151520] text-[#092A4A] dark:text-[#6EB5F7] font-mono-tech text-xs rounded-full border border-[#C8B79D] dark:border-[#2B3040]">Web Apps</button>
                <button className="shrink-0 px-4 py-1.5 bg-[#EADBC3] dark:bg-[#151520] text-[#092A4A] dark:text-[#6EB5F7] font-mono-tech text-xs rounded-full border border-[#C8B79D] dark:border-[#2B3040]">AI/ML</button>
                <button className="shrink-0 px-4 py-1.5 bg-[#EADBC3] dark:bg-[#151520] text-[#092A4A] dark:text-[#6EB5F7] font-mono-tech text-xs rounded-full border border-[#C8B79D] dark:border-[#2B3040]">Automation</button>
              </div>

              {/* Project Cards Grid */}
              <div className="flex flex-col gap-4">
                {PROJECTS.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-[#F4E9D5] dark:bg-[#0A0A0F] p-4 sm:p-5 rounded-xl border border-[#C8B79D] dark:border-[#2B3040] hover:border-[#092A4A] dark:hover:border-[#3B82F6] transition-colors shadow-sm cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute top-4 right-4 opacity-10">
                      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                    
                    <div className="flex gap-4 relative z-10">
                      {/* Left Icon Block */}
                      <div className="w-12 h-12 rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] flex items-center justify-center text-[#F4E9D5] dark:text-[#0A0A0F] shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        <Layers size={22} strokeWidth={1.5} />
                      </div>
                      
                      {/* Right Details */}
                      <div className="flex-1">
                        <div className="font-mono-tech text-[10px] text-[#4B6173] dark:text-[#94A3B8] tracking-widest uppercase mb-1">
                          {proj.code}
                        </div>
                        <h3 className="font-display font-bold text-[#092A4A] dark:text-[#6EB5F7] text-base leading-tight">
                          {proj.title}
                        </h3>
                        
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {proj.techStack.slice(0, 4).map((tech) => (
                            <span key={tech} className="font-mono-tech text-[9.5px] px-2 py-0.5 bg-[#EADBC3]/50 dark:bg-[#151520] text-[#4B6173] dark:text-[#94A3B8] rounded-full border border-[#C8B79D] dark:border-[#2B3040]">
                              {tech}
                            </span>
                          ))}
                        </div>

                        <p className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] mt-3 leading-relaxed pr-4">
                          {proj.description}
                        </p>
                        
                        <div className="mt-4 flex items-center gap-1 font-mono-tech text-[10.5px] text-[#092A4A] dark:text-[#6EB5F7] font-semibold group-hover:underline">
                          View Project &rarr;
                        </div>
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
              <div className="pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-mono-tech font-bold text-lg text-[#092A4A] dark:text-[#6EB5F7] flex items-center gap-2">
                    <span className="text-xl">✒️</span> BLOG / ARTICLES
                  </h2>
                  <p className="font-mono-tech text-xs sm:text-sm text-[#4B6173] dark:text-[#94A3B8] mt-1">
                    Thoughts, learnings and technical deep-dives.
                  </p>
                </div>

                <a
                  href={PERSONAL_INFO.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#092A4A] dark:bg-[#3B82F6] hover:bg-[#123F68] dark:hover:bg-[#2563EB] text-[#F4E9D5] dark:text-[#0A0A0F] text-xs font-mono-tech rounded-md transition-colors shadow-xs"
                >
                  <ExternalLink size={13} />
                  <span>LinkedIn Articles</span>
                </a>
              </div>

              {selectedArticle ? (
                /* Full Article View */
                <div className="bg-[#F4E9D5] dark:bg-[#0A0A0F] p-6 rounded-xl border border-[#C8B79D] dark:border-[#2B3040] space-y-4">
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
                    
                    <span className="bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] px-2 py-0.5 rounded font-bold text-[10px] font-mono-tech">
                      {selectedArticle.readTime}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-2xl text-[#092A4A] dark:text-[#6EB5F7] mt-2 mb-2">
                      {selectedArticle.title}
                    </h3>
                    <div className="flex items-center gap-3 font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8]">
                      <span>{selectedArticle.date}</span>
                      <span>•</span>
                      <span>{selectedArticle.category}</span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-[#092A4A]/10 dark:bg-[#3B82F6]/10 my-4" />

                  <div className="prose prose-sm max-w-none text-[#10283F] dark:text-[#E0E6ED] font-mono-tech whitespace-pre-wrap">
                    {selectedArticle.content}
                  </div>
                </div>
              ) : (
                /* Article List */
                <div className="flex flex-col gap-4">
                  {ARTICLES.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => {
                        soundManager.playSelect();
                        setSelectedArticle(article);
                      }}
                      className="bg-[#F4E9D5] dark:bg-[#0A0A0F] p-4 sm:p-5 rounded-xl border border-[#C8B79D] dark:border-[#2B3040] hover:border-[#092A4A] dark:hover:border-[#3B82F6] transition-colors shadow-sm cursor-pointer group flex flex-col sm:flex-row gap-4 sm:items-center"
                    >
                      {/* Left Image Placeholder */}
                      <div className="w-full sm:w-24 h-24 rounded-lg bg-[#092A4A] dark:bg-[#3B82F6] flex items-center justify-center relative overflow-hidden shrink-0 shadow-xs group-hover:scale-[1.02] transition-transform">
                         <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:10px_10px]" />
                         <BookOpen size={24} className="text-[#F4E9D5] dark:text-[#0A0A0F]" />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-display font-bold text-base text-[#092A4A] dark:text-[#6EB5F7] mb-1.5 group-hover:underline">
                          {article.title}
                        </h3>
                        <div className="font-mono-tech text-[10px] text-[#4B6173] dark:text-[#94A3B8] flex items-center gap-2 mb-3">
                          <span>{article.date}</span>
                          <span>•</span>
                          <span>{article.category}</span>
                        </div>


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
              <div className="pb-2">
                <h2 className="font-mono-tech font-bold text-lg text-[#092A4A] dark:text-[#6EB5F7] flex items-center gap-2">
                  <span className="text-xl">📫</span> CONTACT
                </h2>
                <p className="font-mono-tech text-xs sm:text-sm text-[#4B6173] dark:text-[#94A3B8] mt-1">
                  Secure transmission channel. Open to new opportunities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="space-y-6">
                  <div className="bg-[#EADBC3]/30 dark:bg-[#151520]/30 p-5 rounded-xl border border-[#C8B79D] dark:border-[#2B3040]">
                    <div className="w-10 h-10 rounded-full bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] flex items-center justify-center mb-4 shadow-sm">
                      <Send size={18} />
                    </div>
                    <h3 className="font-display font-bold text-[#092A4A] dark:text-[#6EB5F7] text-lg mb-1">Direct Transmission</h3>
                    <p className="font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8] mb-4">
                      My inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                    </p>
                    
                    <div className="flex items-center justify-between bg-[#F4E9D5] dark:bg-[#0A0A0F] p-3 rounded-lg border border-[#C8B79D] dark:border-[#2B3040]">
                      <span className="font-mono-tech text-sm text-[#092A4A] dark:text-[#6EB5F7] font-semibold">{PERSONAL_INFO.socials.email}</span>
                      <button 
                        onClick={handleCopyEmail}
                        className="p-1.5 hover:bg-[#092A4A] dark:hover:bg-[#3B82F6] hover:text-[#F4E9D5] dark:hover:text-[#0A0A0F] rounded transition-colors text-[#4B6173] dark:text-[#94A3B8]"
                        title="Copy to clipboard"
                      >
                        {copiedEmail ? <CheckCircle2 size={16} className="text-[#6FAF75]" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <form onSubmit={handleSendTransmission} className="bg-[#EADBC3]/30 dark:bg-[#151520]/30 p-5 rounded-xl border border-[#C8B79D] dark:border-[#2B3040] space-y-4">
                  <div>
                    <label className="block font-mono-tech text-[10px] text-[#4B6173] dark:text-[#94A3B8] tracking-widest mb-1.5 uppercase">Sender Name</label>
                    <input 
                      type="text" 
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full font-mono-tech text-sm px-3.5 py-2.5 bg-[#F4E9D5] dark:bg-[#0A0A0F] border border-[#C8B79D] dark:border-[#2B3040] rounded-lg text-[#10283F] dark:text-[#E0E6ED] placeholder-[#4B6173]/50 focus:outline-none focus:border-[#092A4A] dark:focus:border-[#3B82F6] transition-colors"
                      placeholder="ENTER NAME"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-tech text-[10px] text-[#4B6173] dark:text-[#94A3B8] tracking-widest mb-1.5 uppercase">Return Address</label>
                    <input 
                      type="email" 
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full font-mono-tech text-sm px-3.5 py-2.5 bg-[#F4E9D5] dark:bg-[#0A0A0F] border border-[#C8B79D] dark:border-[#2B3040] rounded-lg text-[#10283F] dark:text-[#E0E6ED] placeholder-[#4B6173]/50 focus:outline-none focus:border-[#092A4A] dark:focus:border-[#3B82F6] transition-colors"
                      placeholder="ENTER EMAIL"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-tech text-[10px] text-[#4B6173] dark:text-[#94A3B8] tracking-widest mb-1.5 uppercase">Payload</label>
                    <textarea 
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={4}
                      className="w-full font-mono-tech text-sm px-3.5 py-2.5 bg-[#F4E9D5] dark:bg-[#0A0A0F] border border-[#C8B79D] dark:border-[#2B3040] rounded-lg text-[#10283F] dark:text-[#E0E6ED] placeholder-[#4B6173]/50 focus:outline-none focus:border-[#092A4A] dark:focus:border-[#3B82F6] resize-none transition-colors"
                      placeholder="ENTER MESSAGE..."
                    />
                  </div>

                  {transmissionSuccess ? (
                    <div className="bg-[#6FAF75]/20 border border-[#6FAF75] rounded-lg p-3 text-center">
                      <span className="font-mono-tech text-xs text-[#6FAF75] font-bold">
                        TRANSMISSION {transmissionSuccess} SUCCESSFUL
                      </span>
                    </div>
                  ) : (
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 bg-[#092A4A] dark:bg-[#3B82F6] hover:bg-[#123F68] dark:hover:bg-[#2563EB] disabled:opacity-70 text-[#F4E9D5] dark:text-[#0A0A0F] font-mono-tech font-bold text-sm rounded-lg transition-transform shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <Send size={16} />
                      {isSubmitting ? 'TRANSMITTING...' : 'INITIALIZE UPLOAD'}
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
