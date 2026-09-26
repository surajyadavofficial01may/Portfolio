import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="min-h-screen bg-tech-grid text-[#10283F] dark:text-[#E0E6ED] flex flex-col relative overflow-x-hidden selection:bg-[#092A4A] dark:bg-[#3B82F6] selection:text-[#F4E9D5] dark:text-[#0A0A0F] pb-24 lg:pb-0">',
    '<div className="min-h-screen bg-tech-grid text-[#10283F] dark:text-[#E0E6ED] flex flex-col relative overflow-x-hidden selection:bg-[#092A4A] dark:bg-[#3B82F6] selection:text-[#F4E9D5] dark:text-[#0A0A0F] pb-24 lg:pb-0 pt-[76px] sm:pt-[88px]">'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
