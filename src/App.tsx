import React, { useState } from 'react';
import { NavSection } from './types';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { RetroConsole } from './components/RetroConsole';
import { RightPanel } from './components/RightPanel';
import { SectionModal } from './components/SectionModal';
import { AIAssistantCompanion } from './components/AIAssistantCompanion';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [modalSection, setModalSection] = useState<NavSection | null>(null);

  const handleSelectSection = (section: NavSection) => {
    setActiveSection(section);
  };

  const handleOpenSectionDetail = (section: NavSection) => {
    setActiveSection(section);
    if (section !== 'home') {
      setModalSection(section);
    }
  };

  const handleCloseModal = () => {
    setModalSection(null);
  };

  return (
    <div className="min-h-screen bg-tech-grid text-[#10283F] dark:text-[#E0E6ED] flex flex-col relative overflow-x-hidden selection:bg-[#092A4A] dark:bg-[#3B82F6] selection:text-[#F4E9D5] dark:text-[#0A0A0F]">
      {/* Header Navigation */}
      <Header
        activeSection={activeSection}
        onSelectSection={(sec) => {
          if (sec === 'home') {
            setActiveSection('home');
            setModalSection(null);
          } else {
            handleOpenSectionDetail(sec);
          }
        }}
      />

      {/* Main 3-Column Portfolio Stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between gap-8 sm:gap-10">
        {/* Left Column: Developer Identity, Bio, Tech Stack & Socials */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-start order-2 lg:order-1">
          <LeftPanel
            onSelectSkill={(skillId) => {
              // Can trigger modal or question
              handleOpenSectionDetail('about');
            }}
            onOpenContact={() => handleOpenSectionDetail('contact')}
          />
        </div>

        {/* Center Hero: 3D Retro Gaming Console */}
        <div className="w-full lg:flex-1 flex justify-center order-1 lg:order-2">
          <RetroConsole
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
            onOpenSectionDetail={handleOpenSectionDetail}
          />
        </div>

        {/* Right Column: Journey Metrics, Specialties, Currently Building & Highlights */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end order-3">
          <RightPanel
            onOpenProject={(projId) => handleOpenSectionDetail('projects')}
            onExploreSpecialty={(spec) => handleOpenSectionDetail('about')}
          />
        </div>
      </main>

      {/* Full Dossier Section Modal for About, Projects, Blog, Contact */}
      <SectionModal section={modalSection} onClose={handleCloseModal} />

      {/* Sticky Companion AI Assistant (bottom-right matching photo) */}
      <AIAssistantCompanion />

      {/* Blueprint Bottom Line: THE JOURNEY CONTINUES... (matching photo) */}
      <div className="w-full max-w-7xl mx-auto py-6 px-4 flex items-center justify-center gap-3 font-mono-tech text-[11px] text-[#4B6173] dark:text-[#94A3B8] select-none">
        <span className="text-xs text-[#092A4A]/40 dark:text-[#6EB5F7]/40">+</span>
        <div className="w-24 sm:w-48 h-px bg-[#092A4A]/20 dark:bg-[#3B82F6]/20" />
        <span className="tracking-widest font-semibold text-[#665440]">THE JOURNEY CONTINUES...</span>
        <div className="w-24 sm:w-48 h-px bg-[#092A4A]/20 dark:bg-[#3B82F6]/20" />
        <span className="text-xs text-[#092A4A]/40 dark:text-[#6EB5F7]/40">+</span>
      </div>
    </div>
  );
}
