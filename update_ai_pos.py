import re

with open('src/components/AIAssistantCompanion.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="fixed bottom-4 right-4 z-40 select-none flex flex-col items-end"',
    'className="fixed bottom-20 lg:bottom-4 right-4 z-40 select-none flex flex-col items-end"'
)

with open('src/components/AIAssistantCompanion.tsx', 'w') as f:
    f.write(content)
