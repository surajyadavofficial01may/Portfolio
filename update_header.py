import re

with open('src/components/Header.tsx', 'r') as f:
    content = f.read()

# Change flex-col md:flex-row to flex-row and keep it one line
content = content.replace(
    'className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#092A4A]/10 dark:border-[#3B82F6]/10 select-none"',
    'className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-6 flex flex-row items-center justify-between gap-2 sm:gap-4 border-b border-[#092A4A]/10 dark:border-[#3B82F6]/10 select-none"'
)

# Hide center nav on mobile
content = content.replace(
    '<div className="flex items-center gap-2 sm:gap-6" id="top-nav">',
    '<div className="hidden md:flex items-center gap-6" id="top-nav">'
)

with open('src/components/Header.tsx', 'w') as f:
    f.write(content)
