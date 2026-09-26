import re

with open('src/components/Header.tsx', 'r') as f:
    content = f.read()

# Make header fixed
content = content.replace(
    '<header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-6 flex flex-row items-center justify-between gap-2 sm:gap-4 border-b border-[#092A4A]/10 dark:border-[#3B82F6]/10 select-none">',
    '<div className="fixed top-0 left-0 right-0 z-50 bg-[#F4E9D5]/95 dark:bg-[#0A0A0F]/95 backdrop-blur-sm border-b border-[#092A4A]/10 dark:border-[#3B82F6]/10 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]">\n      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-5 flex flex-row items-center justify-between gap-2 sm:gap-4 select-none">'
)
content = content.replace(
    '    </header>\n  );\n};',
    '    </header>\n    </div>\n  );\n};'
)

with open('src/components/Header.tsx', 'w') as f:
    f.write(content)
