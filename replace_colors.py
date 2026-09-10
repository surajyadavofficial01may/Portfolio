import os
import re

replacements = {
    r'bg-\[#F4E9D5\]': r'bg-[#F4E9D5] dark:bg-[#0A0A0F]',
    r'text-\[#F4E9D5\]': r'text-[#F4E9D5] dark:text-[#0A0A0F]',
    r'fill="#F4E9D5"': r'fill="currentColor"',
    r'bg-\[#EADBC3\]': r'bg-[#EADBC3] dark:bg-[#151520]',
    r'hover:bg-\[#EADBC3\]': r'hover:bg-[#EADBC3] dark:hover:bg-[#151520]',
    r'text-\[#10283F\]': r'text-[#10283F] dark:text-[#E0E6ED]',
    r'text-\[#092A4A\]': r'text-[#092A4A] dark:text-[#6EB5F7]',
    r'bg-\[#092A4A\]': r'bg-[#092A4A] dark:bg-[#3B82F6]', # Made bg accent a bit deeper than text
    r'hover:bg-\[#092A4A\]': r'hover:bg-[#092A4A] dark:hover:bg-[#3B82F6]',
    r'border-\[#092A4A\]': r'border-[#092A4A] dark:border-[#3B82F6]',
    r'text-\[#4B6173\]': r'text-[#4B6173] dark:text-[#94A3B8]',
    r'border-\[#C8B79D\]': r'border-[#C8B79D] dark:border-[#2B3040]',
    r'bg-\[#123F68\]': r'bg-[#123F68] dark:bg-[#2563EB]',
    r'hover:bg-\[#123F68\]': r'hover:bg-[#123F68] dark:hover:bg-[#2563EB]',
    r'border-\[#061B30\]': r'border-[#061B30] dark:border-[#1E3A8A]',
    r'text-\[#092A4A\]/': r'text-[#092A4A]/', # Need to handle opacities specially
    r'bg-\[#092A4A\]/': r'bg-[#092A4A]/',
    r'border-\[#092A4A\]/': r'border-[#092A4A]/',
}

opacity_replacements = {
    r'text-\[#092A4A\]/(\d+)': r'text-[#092A4A]/\1 dark:text-[#6EB5F7]/\1',
    r'bg-\[#092A4A\]/(\d+)': r'bg-[#092A4A]/\1 dark:bg-[#3B82F6]/\1',
    r'border-\[#092A4A\]/(\d+)': r'border-[#092A4A]/\1 dark:border-[#3B82F6]/\1',
    r'bg-\[#EADBC3\]/(\d+)': r'bg-[#EADBC3]/\1 dark:bg-[#151520]/\1',
    r'text-\[#4B6173\]/(\d+)': r'text-[#4B6173]/\1 dark:text-[#94A3B8]/\1',
}

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
                
            for k, v in replacements.items():
                if not '/' in k: # Handle non-opacity separately
                    # Avoid replacing if it has opacity suffix
                    content = re.sub(k + r'(?!/)', v, content)
            
            for k, v in opacity_replacements.items():
                content = re.sub(k, v, content)
                
            with open(filepath, 'w') as f:
                f.write(content)
