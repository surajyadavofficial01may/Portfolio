# Dark Theme Contrast, Surface Elevation & Visual Hierarchy Overhaul

This plan resolves the Dark Theme visibility issue where cards, panels, borders, icons, and text labels blended into the pitch-black background, replacing them with a cohesive **Deep Navy Slate** multi-elevation surface system while preserving the signature beige 3D Retro Console.

## User Review & Critical Decisions

> [!IMPORTANT]
> All core visual preferences from our clarification questions have been locked into this plan:

- **Confirmed Decision 1 (Dark Theme Palette & Elevation)**: Transition from flat pitch-black (`#0A0A0F` cards on `#0A0A0F` background) to a layered **Deep Navy Slate** palette (`#0B1320` canvas → `#111E32` panel containers → `#172942` elevated interactive cards) with luminous slate-blue borders (`#2E4C75`, hover `#60A5FA`).
- **Confirmed Decision 2 (3D Console & Robot Chassis)**: Preserve the classic warm beige retro hardware aesthetic for both the 3D Retro Console and AI Robot Companion across Light and Dark themes, while upgrading the surrounding helper buttons and control captions for high-contrast readability on dark backgrounds.
- **Confirmed Decision 3 (Borders, Icons & Muted Labels)**: Upgrade all dark-mode borders, technical blueprint corner markers, SVG icons, and secondary text labels to WCAG AA+ contrast (`#F8FAFC` primary text, `#E2E8F0` body prose, `#CBD5E1` secondary metadata, and `#FFFFFF` icons on `#2563EB` action buttons).

---

## 1. Overview & Core Concept

- **What It Does**: Establishes a distinct 3-tier surface elevation hierarchy in Dark Mode so every panel, card, badge, icon, and modal section is immediately distinguishable against the dark technical blueprint grid.
- **Root Cause Identified**: Previously, both the root page canvas (`.dark .bg-tech-grid`) and individual cards (`Location`, `Availability`, `Tech Stack` items, `Journey Metrics`, `Currently Building`, and `SectionModal` cards) used the exact same `#0A0A0F` background color with dim `#2B3040` borders, causing cards to visually disappear into the background when switching to Dark Theme. Furthermore, primary action buttons in dark mode used dark `#0A0A0F` text/icons on `#3B82F6` backgrounds instead of crisp white (`#FFFFFF`).
- **Key Value**: Toggling between Light and Dark themes delivers an intentional, high-contrast "Deep Navy Blueprint" experience on both mobile and desktop without losing any card boundaries or text legibility.

---

## 2. User Experience & Visual Design

- **Visual Identity & Multi-Tier Dark Surface Tokens**:
  - **Tier 0 — Page Canvas (`--bg-canvas`)**: `#0B1320` (Deep Navy Slate) with subtle cyan-blue technical grid lines (`rgba(96, 165, 250, 0.08)`).
  - **Tier 1 — Panel Containers (`--bg-panel`)**: `#111E32/90` with dashed blueprint framing (`border-[#3B82F6]/40`) and bright corner markers (`┌ ┐ └ ┘` in `#60A5FA`).
  - **Tier 2 — Interactive Cards (`--bg-card`)**: `#172942` (hover `#1E3554`) with `1px solid #2E4C75` borders (hover `#60A5FA`) and subtle elevation shadow (`0 4px 14px rgba(0, 0, 0, 0.35)`).
  - **Tier 3 — Active / Highlight Surfaces & Buttons**: Royal Blue (`#2563EB` hover `#3B82F6`) with crisp `#FFFFFF` foreground text and icons; emerald status accents (`#34D399`).
- **Typography & Contrast Hierarchy**:
  - **Display Headings & Metric Values**: Crisp Ice-Blue (`#7DD3FC`) and Pure White (`#F8FAFC`).
  - **Body Copy & Descriptions**: High-contrast Cool Slate (`#E2E8F0`).
  - **Secondary Labels & Captions**: Legible Silver-Slate (`#CBD5E1`)—eliminating dim `#4B6173` / `#5C4A38` text that vanished on dark backgrounds.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Distinct 3-Tier Surface Luminance Delta in Dark Mode**
  - *Chosen Approach*: Enforce a clear luminance step between the `#0B1320` page background, `#111E32` panels, and `#172942` cards, paired with `#2E4C75` borders.
  - *Why*: Relying on faint borders alone on a matching `#0A0A0F` background makes cards look invisible on mobile and OLED screens. Stepping surface luminance guarantees instant visual separation.
  - *Alternatives Considered*: Inverting colors via CSS filters (rejected because it distorts the retro console and CRT colors).
- **Decision 2: White Foreground Icons/Text on Dark-Mode Primary Buttons**
  - *Chosen Approach*: Use `dark:bg-[#2563EB] dark:hover:bg-[#3B82F6] dark:text-white` on primary CTAs, social buttons, active navigation states, and modal buttons.
  - *Why*: Crisp white icons and labels on royal blue provide significantly higher legibility and visual punch in Dark Mode than dark `#0A0A0F` text on mid-blue.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

```
┌───────────────────────────────────────────────────────────────────────────┐
│                    Theme Controller (Header & Root DOM)                   │
│       Toggles <html class="dark"> + persists localStorage.theme           │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│   Tier 0: Canvas      │   │  Tier 1: Panels & Nav │   │  Tier 2: Cards & UI   │
│  #0B1320 Blueprint    │   │  #111E32 Surfaces     │   │  #172942 Elevated     │
│  Grid + Footer Line   │   │  + #3B82F6/40 Borders │   │  + #2E4C75 Borders    │
├───────────────────────┤   ├───────────────────────┤   ├───────────────────────┤
│ • App Root Wrapper    │   │ • Sticky Top Header   │   │ • Location/Avail Cards│
│ • Blueprint Grid CSS  │   │ • Mobile Nav Drawer   │   │ • 8 Tech Stack Cards  │
│ • Console Helper Text │   │ • Mobile Bottom Nav   │   │ • 4 Journey Metrics   │
│ • Footer Divider      │   │ • Left & Right Panels │   │ • Specialties & Modal │
└───────────────────────┘   └───────────────────────┘   └───────────────────────┘
```

- **Interactive Component & State Mapping**:
  - **Header & Mobile Navigation**: Top bar, mobile drawer, and bottom navigation bar use `#0B1320/95` backdrop surfaces with `#2E4C75` borders, `#F8FAFC` / `#7DD3FC` active labels, and `#2563EB` active badges with `#FFFFFF` text.
  - **Left Panel (Hero, Socials, Tech Stack)**: Panel container uses `#111E32/80` with `#60A5FA/40` dashed blueprint border; `Location`, `Availability`, and all 8 `Tech Stack` cards use `#172942` (hover `#1E3554`) with `#2E4C75` borders and bright `#7DD3FC` / `#F8FAFC` labels.
  - **Right Panel (Journey Metrics, Specialties, Currently Building, Highlights)**: Metric cards, Specialties buttons, and Currently Building card use `#172942` elevated surfaces with `#2E4C75` borders and `#CBD5E1` / `#F8FAFC` text; Recent Highlights use `#E2E8F0` text.
  - **Retro Console Wrapper & Section Modal**: Console keeps its classic beige hardware body while its bottom helper controls bar uses `#172942` button surface and `#CBD5E1` instructions; `SectionModal` (`About`, `Projects`, `Blog`, `Contact`) uses `#0B1320` modal canvas with `#172942` cards, `#111E32` form inputs, `#2E4C75` borders, and `#FFFFFF` button labels.
