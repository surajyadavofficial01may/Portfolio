import re

with open('src/components/SectionModal.tsx', 'r') as f:
    content = f.read()

# Find the start and end of the Projects grid
start_idx = content.find('{/* Project Cards Grid */}')
end_idx = content.find('{/* BLOG SECTION */}')

if start_idx != -1 and end_idx != -1:
    new_grid = '''{/* Project Cards Grid */}
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

          '''
    content = content[:start_idx] + new_grid + content[end_idx:]
    
    with open('src/components/SectionModal.tsx', 'w') as f:
        f.write(content)
    print("Replaced Projects successfully")
else:
    print("Failed to find boundaries")
