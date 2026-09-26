import re

with open('src/components/SectionModal.tsx', 'r') as f:
    content = f.read()

# Find the start and end of the Blog section
start_idx = content.find('{section === \'blog\' && (')
end_idx = content.find('{/* CONTACT SECTION */}')

if start_idx != -1 and end_idx != -1:
    new_blog = '''{section === 'blog' && (
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

                        <div className="flex flex-wrap gap-1.5">
                          {article.tags.map((tag) => (
                            <span key={tag} className="font-mono-tech text-[9.5px] px-2 py-0.5 bg-[#EADBC3]/50 dark:bg-[#151520] text-[#4B6173] dark:text-[#94A3B8] rounded-full border border-[#C8B79D] dark:border-[#2B3040]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          '''
    content = content[:start_idx] + new_blog + content[end_idx:]
    
    with open('src/components/SectionModal.tsx', 'w') as f:
        f.write(content)
    print("Replaced Blog successfully")
else:
    print("Failed to find boundaries")
