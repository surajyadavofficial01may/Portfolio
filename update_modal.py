import re

with open('src/components/SectionModal.tsx', 'r') as f:
    content = f.read()

# Make SectionModal take full screen below header on mobile
# Old: className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#061B30]/75 backdrop-blur-xs animate-in fade-in duration-200"
# New: className="fixed inset-0 z-[40] lg:z-[60] flex items-start lg:items-center justify-center pt-[76px] pb-[76px] px-0 lg:p-6 bg-[#F4E9D5] dark:bg-[#0A0A0F] lg:bg-[#061B30]/75 lg:backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto lg:overflow-hidden"
content = content.replace(
    'className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#061B30]/75 backdrop-blur-xs animate-in fade-in duration-200"',
    'className="fixed inset-0 z-[40] lg:z-[60] flex items-start lg:items-center justify-center pt-[76px] pb-[76px] px-0 lg:p-6 bg-[#F4E9D5] dark:bg-[#0A0A0F] lg:bg-[#061B30]/75 lg:backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto lg:overflow-hidden"'
)

# Make inner container full size on mobile
# Old: className="w-full max-w-4xl max-h-[90vh] bg-[#F4E9D5] dark:bg-[#0A0A0F] rounded-xl border-2 border-[#092A4A] dark:border-[#3B82F6] shadow-[0_25px_50px_rgba(6,27,48,0.4)] flex flex-col overflow-hidden relative"
# New: className="w-full max-w-4xl h-full lg:max-h-[90vh] bg-[#F4E9D5] dark:bg-[#0A0A0F] rounded-none lg:rounded-xl border-0 lg:border-2 border-[#092A4A] dark:border-[#3B82F6] shadow-none lg:shadow-[0_25px_50px_rgba(6,27,48,0.4)] flex flex-col overflow-hidden relative"
content = content.replace(
    'className="w-full max-w-4xl max-h-[90vh] bg-[#F4E9D5] dark:bg-[#0A0A0F] rounded-xl border-2 border-[#092A4A] dark:border-[#3B82F6] shadow-[0_25px_50px_rgba(6,27,48,0.4)] flex flex-col overflow-hidden relative"',
    'className="w-full max-w-4xl h-full min-h-[calc(100vh-152px)] lg:max-h-[90vh] bg-transparent lg:bg-[#F4E9D5] dark:lg:bg-[#0A0A0F] rounded-none lg:rounded-xl border-0 lg:border-2 border-[#092A4A] dark:border-[#3B82F6] shadow-none lg:shadow-[0_25px_50px_rgba(6,27,48,0.4)] flex flex-col lg:overflow-hidden relative"'
)

# Hide modal window header on mobile, because we have the main header
content = content.replace(
    '<div className="bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] px-4 py-3 sm:px-6 flex items-center justify-between border-b border-[#061B30] dark:border-[#1E3A8A] select-none">',
    '<div className="hidden lg:flex bg-[#092A4A] dark:bg-[#3B82F6] text-[#F4E9D5] dark:text-[#0A0A0F] px-4 py-3 sm:px-6 items-center justify-between border-b border-[#061B30] dark:border-[#1E3A8A] select-none">'
)

# Hide modal close button on mobile, it should be handled by bottom nav? Wait, bottom nav handles switching. But if we hide the close button, we can't close the modal. Wait! If they click "Home" in the bottom nav, it sets activeSection to 'home', which sets modalSection to null!
# So we don't need a close button on mobile!
# Wait, if we hide the modal header on mobile, we also hide the close button. That's fine!

# We should make the inner body overflow-y-auto so it scrolls on mobile and desktop
# Currently the inner body is: <div className="flex-1 overflow-y-auto p-4 sm:p-8" id="modal-content">
# No, wait, if the inner body has overflow-y-auto, on mobile the container is full height, so it scrolls nicely.
# Wait, the modal-content has padding. Let's make it look like the mobile image, which has spacing.
# On mobile, the Projects are just laid out. The title "PROJECTS" is at the top of the content.
# Wait, if we hide the Modal Window Header, we don't see the title on mobile!
# Let's check if the modal body has a title.
# No, it doesn't! We should add a title block that only shows on mobile, OR we can just show the modal header on mobile too, but style it differently?
# Let's look at the image again. The image shows:
# 🛡️ PROJECTS
# Building real solutions for real problems.
#
# That title and subtitle are inside the modal body? No, currently where are they?
# Let's check `SectionModal.tsx` for "PROJECTS".
with open('src/components/SectionModal.tsx', 'w') as f:
    f.write(content)
