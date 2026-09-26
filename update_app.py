import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
content = content.replace(
    "import { AIAssistantCompanion } from './components/AIAssistantCompanion';",
    "import { AIAssistantCompanion } from './components/AIAssistantCompanion';\nimport { MobileBottomNav } from './components/MobileBottomNav';"
)

# Add pb-24 to main wrapper to account for bottom nav on mobile
content = content.replace(
    '<div className="min-h-screen bg-tech-grid text-[#10283F] dark:text-[#E0E6ED] flex flex-col relative overflow-x-hidden selection:bg-[#092A4A] dark:bg-[#3B82F6] selection:text-[#F4E9D5] dark:text-[#0A0A0F]">',
    '<div className="min-h-screen bg-tech-grid text-[#10283F] dark:text-[#E0E6ED] flex flex-col relative overflow-x-hidden selection:bg-[#092A4A] dark:bg-[#3B82F6] selection:text-[#F4E9D5] dark:text-[#0A0A0F] pb-24 lg:pb-0">'
)

# Render MobileBottomNav before closing div
content = content.replace(
    '      <div className="w-full max-w-7xl mx-auto py-6 px-4 flex items-center justify-center gap-3 font-mono-tech text-[11px] text-[#4B6173] dark:text-[#94A3B8] select-none">',
    '      <MobileBottomNav\n        activeSection={activeSection}\n        onSelectSection={(sec) => {\n          if (sec === \'home\') {\n            setActiveSection(\'home\');\n            setModalSection(null);\n          } else {\n            handleOpenSectionDetail(sec);\n          }\n        }}\n      />\n\n      <div className="w-full max-w-7xl mx-auto py-6 px-4 flex items-center justify-center gap-3 font-mono-tech text-[11px] text-[#4B6173] dark:text-[#94A3B8] select-none">'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
