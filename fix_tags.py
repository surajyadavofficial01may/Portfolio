import re

with open('src/components/SectionModal.tsx', 'r') as f:
    content = f.read()

# Remove the tags mapping block
tags_block = '''                        <div className="flex flex-wrap gap-1.5">
                          {article.tags.map((tag) => (
                            <span key={tag} className="font-mono-tech text-[9.5px] px-2 py-0.5 bg-[#EADBC3]/50 dark:bg-[#151520] text-[#4B6173] dark:text-[#94A3B8] rounded-full border border-[#C8B79D] dark:border-[#2B3040]">
                              {tag}
                            </span>
                          ))}
                        </div>'''

content = content.replace(tags_block, '')

with open('src/components/SectionModal.tsx', 'w') as f:
    f.write(content)
