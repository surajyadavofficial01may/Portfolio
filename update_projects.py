import re

with open('src/components/SectionModal.tsx', 'r') as f:
    content = f.read()

projects_old = '''              <div className="border-b border-[#092A4A]/15 dark:border-[#3B82F6]/15 pb-4">
                <div className="inline-block font-mono-tech text-xs bg-[#EADBC3] dark:bg-[#151520] text-[#092A4A] dark:text-[#6EB5F7] px-2.5 py-0.5 rounded border border-[#C8B79D] dark:border-[#2B3040] mb-2 font-semibold">
                  LV 02 • MISSION CATALOGUE
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#092A4A] dark:text-[#6EB5F7]">
                  Engineered Projects & Systems
                </h2>
                <p className="font-mono-tech text-sm text-[#4B6173] dark:text-[#94A3B8] mt-2">
                  Each project represents a distinct challenge in full-stack engineering, performance scaling, or intelligent agent orchestration.
                </p>
              </div>'''

projects_new = '''              <div className="pb-2">
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
              </div>'''

content = content.replace(projects_old, projects_new)

with open('src/components/SectionModal.tsx', 'w') as f:
    f.write(content)
