import React from 'react';

/**
 * Small glowing orbital planet logo used in the top navigation bar and footer
 */
export const DevOrbitLogo: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="logoPlanetGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#6CE5FF" />
        <stop offset="50%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#0D1B42" />
      </radialGradient>
      <linearGradient id="logoRingGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#36C8FF" />
        <stop offset="50%" stopColor="#9657FF" />
        <stop offset="100%" stopColor="#FFBF47" />
      </linearGradient>
    </defs>
    {/* Rounded dark badge container */}
    <rect x="2" y="2" width="60" height="60" rx="14" fill="#08122B" stroke="#3578FF" strokeOpacity="0.45" strokeWidth="1.5" />
    {/* Stars */}
    <circle cx="14" cy="15" r="1" fill="#F5F7FF" opacity="0.8" />
    <circle cx="50" cy="48" r="1.2" fill="#36C8FF" opacity="0.85" />
    <circle cx="48" cy="14" r="1" fill="#FFBF47" opacity="0.7" />
    {/* Back half of ring */}
    <path
      d="M10 42 C 18 28, 46 14, 54 22"
      stroke="url(#logoRingGrad)"
      strokeWidth="3.5"
      strokeLinecap="round"
      opacity="0.55"
    />
    {/* Planet sphere */}
    <circle cx="32" cy="32" r="14" fill="url(#logoPlanetGrad)" />
    {/* Pixel-art shading bands on planet */}
    <rect x="22" y="25" width="12" height="2.5" rx="1" fill="#6CE5FF" opacity="0.35" />
    <rect x="26" y="34" width="14" height="2.5" rx="1" fill="#1E3A8A" opacity="0.6" />
    {/* Front half of orbital ring */}
    <path
      d="M10 42 C 18 50, 46 36, 54 22"
      stroke="url(#logoRingGrad)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Glowing orbital node */}
    <circle cx="49" cy="27" r="2.5" fill="#FFBF47" />
  </svg>
);

/**
 * Pixel-art ringed planet placed next to the main "DevOrbit" hero heading
 */
export const PixelRingedPlanet: React.FC<{ className?: string }> = ({ className = 'w-20 h-16 sm:w-28 sm:h-22' }) => (
  <svg
    className={`${className} pixelated select-none`}
    viewBox="0 0 88 68"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Outer glow */}
    <circle cx="44" cy="34" r="26" fill="#3578FF" opacity="0.18" />
    {/* Back ring pixels */}
    <rect x="64" y="12" width="10" height="4" fill="#FFBF47" />
    <rect x="70" y="16" width="8" height="4" fill="#FF9E2C" />
    <rect x="12" y="42" width="8" height="4" fill="#9657FF" />
    {/* Pixel planet body */}
    <rect x="32" y="12" width="24" height="4" fill="#6CE5FF" />
    <rect x="26" y="16" width="36" height="4" fill="#36C8FF" />
    <rect x="22" y="20" width="44" height="6" fill="#3578FF" />
    <rect x="20" y="26" width="48" height="8" fill="#2563EB" />
    <rect x="20" y="34" width="48" height="8" fill="#1D4ED8" />
    <rect x="22" y="42" width="44" height="6" fill="#1E3A8A" />
    <rect x="26" y="48" width="36" height="4" fill="#172554" />
    <rect x="32" y="52" width="24" height="4" fill="#0F172A" />
    {/* Pixel surface highlights */}
    <rect x="28" y="20" width="10" height="4" fill="#93C5FD" />
    <rect x="24" y="26" width="8" height="4" fill="#60A5FA" />
    <rect x="44" y="36" width="14" height="4" fill="#3B82F6" opacity="0.6" />
    {/* Front diagonal pixel ring */}
    <rect x="8" y="46" width="10" height="4" fill="#A855F7" />
    <rect x="16" y="44" width="12" height="4" fill="#C084FC" />
    <rect x="26" y="40" width="14" height="4" fill="#E9D5FF" />
    <rect x="38" y="36" width="14" height="4" fill="#FDE68A" />
    <rect x="50" y="30" width="14" height="4" fill="#FFBF47" />
    <rect x="62" y="24" width="12" height="4" fill="#F59E0B" />
    <rect x="72" y="20" width="8" height="4" fill="#D97706" />
    {/* Sparkle pixels */}
    <rect x="16" y="14" width="3" height="3" fill="#6CE5FF" />
    <rect x="70" y="46" width="3" height="3" fill="#FFBF47" />
  </svg>
);

/**
 * Right-side Hero Space Illustration:
 * Features a glowing Earth/exoplanet, sweeping multi-color orbital rings,
 * a friendly futuristic astronaut with `^ ^` visor sitting on an asteroid ridge
 * holding a glowing GitHub laptop, a futuristic developer settlement/space station
 * with a DevOrbit flag, floating asteroids, stars, and "Code Together, Grow Together".
 */
export const HeroSpaceIllustration: React.FC = () => (
  <div className="relative w-full max-w-[650px] mx-auto select-none">
    {/* Ambient background glow behind planet & astronaut */}
    <div
      className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-55 pointer-events-none"
      style={{
        background:
          'radial-gradient(circle at 52% 46%, rgba(54, 200, 255, 0.38), rgba(150, 87, 255, 0.25) 50%, rgba(5, 11, 29, 0) 78%)',
      }}
      aria-hidden="true"
    />

    <svg
      viewBox="0 0 760 540"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto drop-shadow-[0_16px_48px_rgba(37,99,235,0.3)]"
      role="img"
      aria-label="Futuristic astronaut coding on a laptop with a GitHub emblem on an asteroid overlooking a glowing planet and space settlement, with the phrase Code Together, Grow Together"
    >
      <defs>
        {/* Glowing Earth / Exoplanet gradient */}
        <radialGradient id="earthCore" cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#7CF2FF" />
          <stop offset="28%" stopColor="#2998FF" />
          <stop offset="65%" stopColor="#1B3C87" />
          <stop offset="100%" stopColor="#091332" />
        </radialGradient>

        {/* Planet atmospheric rim glow */}
        <linearGradient id="planetRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6CE5FF" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#3578FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#9657FF" stopOpacity="0.8" />
        </linearGradient>

        {/* Orbital Ring Gradient 1 */}
        <linearGradient id="orbitRingCyan" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B9E" />
          <stop offset="35%" stopColor="#FFBF47" />
          <stop offset="70%" stopColor="#36C8FF" />
          <stop offset="100%" stopColor="#9657FF" />
        </linearGradient>

        {/* Orbital Ring Gradient 2 */}
        <linearGradient id="orbitRingPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#36C8FF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#9657FF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#38E69B" stopOpacity="0.7" />
        </linearGradient>

        {/* Rocky terrain gradient */}
        <linearGradient id="asteroidRock" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#334168" />
          <stop offset="45%" stopColor="#1B2544" />
          <stop offset="100%" stopColor="#090F24" />
        </linearGradient>

        {/* Astronaut suit gradient */}
        <linearGradient id="suitWhite" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#D8E3F8" />
          <stop offset="100%" stopColor="#8EA4D2" />
        </linearGradient>

        {/* Laptop back gradient */}
        <linearGradient id="laptopShell" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E294B" />
          <stop offset="100%" stopColor="#0B1126" />
        </linearGradient>
      </defs>

      {/* Background Nebula Clouds & Starfield */}
      <g opacity="0.85">
        <circle cx="72" cy="88" r="1.5" fill="#F5F7FF" />
        <circle cx="145" cy="54" r="2" fill="#36C8FF" />
        <circle cx="230" cy="40" r="1.2" fill="#F5F7FF" />
        <circle cx="560" cy="42" r="1.8" fill="#FFBF47" />
        <circle cx="670" cy="180" r="1.5" fill="#36C8FF" />
        <circle cx="110" cy="240" r="2" fill="#9657FF" />
        <circle cx="62" cy="330" r="1.5" fill="#38E69B" />
        {/* Four-point twinkling stars */}
        <path d="M190 95 L193 102 L200 105 L193 108 L190 115 L187 108 L180 105 L187 102 Z" fill="#6CE5FF" opacity="0.85" />
        <path d="M590 70 L592 75 L597 77 L592 79 L590 84 L588 79 L583 77 L588 75 Z" fill="#F5F7FF" opacity="0.75" />
        <path d="M85 185 L87 190 L92 192 L87 194 L85 199 L83 194 L78 192 L83 190 Z" fill="#FFBF47" opacity="0.8" />
      </g>

      {/* Back half of sweeping Planetary Orbit Rings */}
      <g transform="rotate(-18 395 235)">
        <ellipse
          cx="395"
          cy="235"
          rx="275"
          ry="58"
          stroke="url(#orbitRingCyan)"
          strokeWidth="5"
          strokeDasharray="16 8"
          opacity="0.45"
        />
        <ellipse
          cx="395"
          cy="235"
          rx="248"
          ry="46"
          stroke="url(#orbitRingPurple)"
          strokeWidth="3"
          opacity="0.5"
        />
      </g>

      {/* Giant Glowing Earth / Exoplanet */}
      <g>
        <circle cx="385" cy="235" r="168" fill="#36C8FF" opacity="0.12" />
        <circle cx="385" cy="235" r="156" fill="url(#earthCore)" stroke="url(#planetRim)" strokeWidth="3" />

        {/* Continents & Glowing City Lights Network on Planet */}
        <path
          d="M280 155 C305 140, 345 148, 360 172 C375 196, 350 225, 325 238 C300 250, 268 232, 260 205 C255 185, 265 165, 280 155 Z"
          fill="#38E69B"
          opacity="0.32"
        />
        <path
          d="M395 125 C430 120, 470 142, 485 178 C495 205, 468 230, 442 222 C415 214, 385 190, 382 160 C380 140, 385 128, 395 125 Z"
          fill="#36C8FF"
          opacity="0.28"
        />
        <path
          d="M315 280 C340 272, 378 288, 388 315 C395 335, 370 362, 342 358 C312 354, 295 322, 302 298 Z"
          fill="#38E69B"
          opacity="0.25"
        />
        {/* Glowing golden/cyan city node clusters */}
        <circle cx="315" cy="185" r="2.5" fill="#FFBF47" />
        <circle cx="335" cy="195" r="2" fill="#6CE5FF" />
        <circle cx="350" cy="180" r="1.8" fill="#FFBF47" />
        <line x1="315" y1="185" x2="335" y2="195" stroke="#6CE5FF" strokeWidth="1" opacity="0.6" />
        <line x1="335" y1="195" x2="350" y2="180" stroke="#FFBF47" strokeWidth="1" opacity="0.6" />

        {/* Atmospheric cloud swirls */}
        <path
          d="M250 190 Q320 165 400 195 T515 185"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.22"
        />
        <path
          d="M242 255 Q335 235 425 262 T520 250"
          stroke="#6CE5FF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.25"
        />
      </g>

      {/* Front Arc of Orbital Rings */}
      <g transform="rotate(-18 395 235)">
        <path
          d="M 120 235 A 275 58 0 0 0 670 235"
          stroke="url(#orbitRingCyan)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 147 235 A 248 46 0 0 0 643 235"
          stroke="#6CE5FF"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* Orbiting data nodes */}
        <circle cx="195" cy="272" r="5" fill="#FFBF47" />
        <circle cx="575" cy="268" r="4" fill="#36C8FF" />
      </g>

      {/* Floating Asteroids */}
      {/* Top-left asteroid */}
      <g transform="translate(155, 118)">
        <polygon
          points="18,2 36,8 42,24 30,38 12,36 2,22"
          fill="#283558"
          stroke="#60A5FA"
          strokeWidth="1.5"
        />
        <circle cx="16" cy="16" r="4" fill="#17203A" />
        <circle cx="28" cy="24" r="5" fill="#17203A" />
        <circle cx="22" cy="30" r="2.5" fill="#17203A" />
      </g>

      {/* Bottom-left asteroid */}
      <g transform="translate(175, 345)">
        <polygon
          points="22,0 44,10 50,30 34,46 12,42 0,24"
          fill="#253152"
          stroke="#9657FF"
          strokeWidth="1.5"
        />
        <circle cx="18" cy="18" r="5" fill="#141C33" />
        <circle cx="33" cy="28" r="6" fill="#141C33" />
        <circle cx="16" cy="32" r="3" fill="#141C33" />
      </g>

      {/* Far-right asteroid */}
      <g transform="translate(675, 265)">
        <polygon
          points="14,0 30,6 34,20 22,32 6,28 0,14"
          fill="#232F4E"
          stroke="#36C8FF"
          strokeWidth="1.2"
        />
        <circle cx="14" cy="14" r="3.5" fill="#121A30" />
        <circle cx="23" cy="20" r="4" fill="#121A30" />
      </g>

      {/* Handwritten-Style Phrase: "Code Together, Grow Together" in top-right */}
      <g transform="translate(555, 58) rotate(-7)">
        <text
          x="0"
          y="24"
          fill="#F5F7FF"
          fontFamily="'Space Grotesk', cursive, sans-serif"
          fontSize="24"
          fontWeight="600"
          fontStyle="italic"
          letterSpacing="0.02em"
        >
          Code Together,
        </text>
        <text
          x="10"
          y="54"
          fill="#F5F7FF"
          fontFamily="'Space Grotesk', cursive, sans-serif"
          fontSize="24"
          fontWeight="600"
          fontStyle="italic"
          letterSpacing="0.02em"
        >
          Grow Together
        </text>
        {/* Golden hand-drawn underline swish */}
        <path
          d="M18 66 Q95 58 168 64 L145 72"
          stroke="#FFBF47"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Futuristic Developer Settlement / Space Station on Right Ridge */}
      <g transform="translate(515, 175)">
        {/* Tall spire tower */}
        <rect x="66" y="45" width="6" height="55" fill="#60A5FA" />
        <circle cx="69" cy="42" r="4.5" fill="#FFBF47" />
        {/* Waving DevOrbit Flag */}
        <g transform="translate(72, 50)">
          <path
            d="M0 0 C18 -4, 34 6, 52 2 L52 34 C34 38, 18 28, 0 32 Z"
            fill="#1D4ED8"
            stroke="#6CE5FF"
            strokeWidth="1.5"
          />
          {/* Small ringed planet emblem on flag */}
          <circle cx="26" cy="17" r="7" fill="#36C8FF" />
          <ellipse cx="26" cy="17" rx="13" ry="3.5" transform="rotate(-20 26 17)" stroke="#FFBF47" strokeWidth="2" />
        </g>

        {/* Secondary left spire */}
        <rect x="30" y="75" width="4" height="40" fill="#93C5FD" />
        <circle cx="32" cy="73" r="3.5" fill="#FFBF47" />

        {/* Settlement modular buildings */}
        <rect x="52" y="95" width="34" height="45" rx="4" fill="#D8E3F8" stroke="#3578FF" strokeWidth="1.5" />
        <rect x="58" y="103" width="22" height="8" rx="2" fill="#0F172A" />
        <rect x="61" y="105" width="6" height="4" fill="#36C8FF" />
        <rect x="70" y="105" width="6" height="4" fill="#FFBF47" />

        {/* Left module */}
        <rect x="16" y="110" width="40" height="55" rx="4" fill="#BACCEB" stroke="#3578FF" strokeWidth="1.5" />
        <rect x="24" y="120" width="10" height="10" rx="2" fill="#FFBF47" />
        <rect x="38" y="120" width="10" height="10" rx="2" fill="#36C8FF" />
        <rect x="24" y="136" width="24" height="8" rx="2" fill="#1E293B" />

        {/* Right module */}
        <rect x="80" y="118" width="38" height="48" rx="4" fill="#94B0DA" stroke="#3578FF" strokeWidth="1.5" />
        <rect x="90" y="128" width="8" height="12" rx="2" fill="#38E69B" />
        <rect x="102" y="128" width="8" height="12" rx="2" fill="#36C8FF" />

        {/* Base platform */}
        <rect x="6" y="158" width="122" height="18" rx="4" fill="#475569" stroke="#64748B" strokeWidth="1.5" />

        {/* Cute Pixel-Inspired Trees around settlement */}
        <g transform="translate(-8, 142)">
          <rect x="8" y="18" width="4" height="8" fill="#78350F" />
          <circle cx="10" cy="12" r="9" fill="#22C55E" />
          <circle cx="7" cy="9" r="5" fill="#4ADE80" />
        </g>
        <g transform="translate(118, 146)">
          <rect x="8" y="16" width="4" height="8" fill="#78350F" />
          <circle cx="10" cy="11" r="8" fill="#16A34A" />
          <circle cx="12" cy="8" r="4.5" fill="#4ADE80" />
        </g>
      </g>

      {/* Foreground Rocky Asteroid / Planetary Ridge */}
      <g>
        <path
          d="M 190 485 L 235 395 L 305 370 L 445 362 L 560 335 L 655 345 L 715 435 L 745 495 L 155 495 Z"
          fill="url(#asteroidRock)"
          stroke="#47649E"
          strokeWidth="2"
        />
        {/* Ridge facet highlights */}
        <polygon points="235,395 305,370 330,425 220,445" fill="#3B4F7D" opacity="0.55" />
        <polygon points="445,362 560,335 585,405 460,420" fill="#2A3B63" opacity="0.65" />
        <polygon points="305,370 445,362 460,420 330,425" fill="#465E94" opacity="0.45" />
        {/* Glowing golden moss / crystal accents on ridge */}
        <circle cx="275" cy="392" r="3" fill="#FFBF47" opacity="0.85" />
        <circle cx="290" cy="385" r="2" fill="#38E69B" opacity="0.85" />
        <circle cx="515" cy="365" r="3" fill="#38E69B" opacity="0.8" />
        {/* Bottom horizon glow */}
        <ellipse cx="445" cy="495" rx="310" ry="12" fill="#36C8FF" opacity="0.35" />
      </g>

      {/* Cute Futuristic Astronaut Sitting on the Asteroid with GitHub Laptop */}
      <g transform="translate(325, 118)">
        {/* Astronaut Backpack (PLSS Life Support) */}
        <rect
          x="132"
          y="105"
          width="54"
          height="92"
          rx="12"
          fill="#475569"
          stroke="#94A3B8"
          strokeWidth="2"
        />
        <rect x="144" y="118" width="32" height="22" rx="4" fill="#1E293B" />
        <circle cx="154" cy="129" r="3.5" fill="#38E69B" />
        <circle cx="166" cy="129" r="3.5" fill="#36C8FF" />

        {/* Astronaut Helmet */}
        <rect
          x="52"
          y="2"
          width="116"
          height="102"
          rx="48"
          fill="url(#suitWhite)"
          stroke="#60A5FA"
          strokeWidth="2.5"
        />
        {/* Helmet ear comm pods */}
        <rect x="42" y="36" width="14" height="34" rx="7" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
        <rect x="164" y="36" width="14" height="34" rx="7" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
        <circle cx="171" cy="53" r="4" fill="#36C8FF" />

        {/* Helmet Visor (Dark glass with glowing happy `^ ^` eyes) */}
        <rect
          x="64"
          y="18"
          width="88"
          height="68"
          rx="32"
          fill="#091128"
          stroke="#36C8FF"
          strokeWidth="2.5"
        />
        {/* Visor reflection */}
        <path d="M78 28 Q105 22 132 28" stroke="#6CE5FF" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
        {/* Happy LED Pixel Eyes `^ ^` */}
        <path
          d="M82 56 L92 42 L102 56"
          stroke="#6CE5FF"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M114 56 L124 42 L134 56"
          stroke="#6CE5FF"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Astronaut Torso & Arms */}
        <rect
          x="64"
          y="100"
          width="94"
          height="92"
          rx="26"
          fill="url(#suitWhite)"
          stroke="#94A3B8"
          strokeWidth="2"
        />
        {/* Chest control badge */}
        <rect x="92" y="118" width="36" height="24" rx="5" fill="#1E293B" stroke="#60A5FA" strokeWidth="1.5" />
        <rect x="98" y="124" width="12" height="4" fill="#36C8FF" />
        <rect x="98" y="132" width="22" height="4" fill="#FFBF47" />
        {/* Shoulder patch */}
        <rect x="142" y="116" width="12" height="8" rx="2" fill="#EF4444" />
        <rect x="142" y="122" width="12" height="4" fill="#3B82F6" />

        {/* Right Arm reaching to laptop keyboard */}
        <path
          d="M148 126 C168 145, 162 178, 126 184"
          stroke="url(#suitWhite)"
          strokeWidth="26"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left Arm supporting laptop */}
        <path
          d="M72 126 C52 145, 56 175, 84 184"
          stroke="url(#suitWhite)"
          strokeWidth="24"
          strokeLinecap="round"
          fill="none"
        />

        {/* Sitting Astronaut Legs & Segmented Space Boots */}
        {/* Left Leg */}
        <rect x="36" y="196" width="46" height="68" rx="20" transform="rotate(-12 36 196)" fill="url(#suitWhite)" stroke="#64748B" strokeWidth="2" />
        {/* Left Boot sole */}
        <rect x="20" y="212" width="32" height="58" rx="12" transform="rotate(-8 20 212)" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
        <line x1="26" y1="228" x2="46" y2="226" stroke="#6CE5FF" strokeWidth="2" />
        <line x1="26" y1="242" x2="46" y2="240" stroke="#6CE5FF" strokeWidth="2" />

        {/* Right Leg */}
        <rect x="96" y="198" width="48" height="68" rx="20" transform="rotate(-10 96 198)" fill="url(#suitWhite)" stroke="#64748B" strokeWidth="2" />
        {/* Right Boot sole */}
        <rect x="82" y="216" width="32" height="58" rx="12" transform="rotate(-6 82 216)" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
        <line x1="88" y1="232" x2="108" y2="230" stroke="#6CE5FF" strokeWidth="2" />
        <line x1="88" y1="246" x2="108" y2="244" stroke="#6CE5FF" strokeWidth="2" />

        {/* Astronaut Laptop with Glowing GitHub Octocat Emblem */}
        <g transform="translate(18, 122)">
          {/* Laptop base keyboard deck */}
          <path
            d="M42 74 L122 70 L138 80 L30 82 Z"
            fill="#334155"
            stroke="#6CE5FF"
            strokeWidth="1.5"
          />
          {/* Laptop Lid */}
          <path
            d="M8 6 L96 2 L112 72 L24 76 Z"
            fill="url(#laptopShell)"
            stroke="#36C8FF"
            strokeWidth="2.5"
          />
          {/* Glowing GitHub Emblem on Laptop Lid */}
          <g transform="translate(44, 22)">
            <circle cx="16" cy="16" r="18" fill="#36C8FF" opacity="0.22" />
            <circle cx="16" cy="16" r="14" fill="#6CE5FF" />
            {/* Octocat silhouette */}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16 4C9.37 4 4 9.37 4 16C4 21.3 7.44 25.8 12.2 27.38C12.8 27.49 13.02 27.12 13.02 26.8C13.02 26.52 13.01 25.76 13.01 24.76C9.67 25.48 8.97 23.15 8.97 23.15C8.42 21.76 7.63 21.39 7.63 21.39C6.54 20.65 7.71 20.66 7.71 20.66C8.92 20.75 9.55 21.9 9.55 21.9C10.62 23.73 12.36 23.2 13.05 22.89C13.16 22.11 13.47 21.58 13.81 21.28C11.15 20.98 8.35 19.95 8.35 15.35C8.35 14.04 8.82 12.97 9.59 12.13C9.46 11.83 9.05 10.61 9.71 8.96C9.71 8.96 10.72 8.64 13.01 10.19C13.97 9.92 15 9.79 16.02 9.79C17.04 9.79 18.07 9.92 19.03 10.19C21.32 8.64 22.33 8.96 22.33 8.96C22.99 10.61 22.58 11.83 22.45 12.13C23.22 12.97 23.69 14.04 23.69 15.35C23.69 19.96 20.88 20.97 18.21 21.27C18.64 21.64 19.02 22.38 19.02 23.51C19.02 25.13 19.01 26.43 19.01 26.8C19.01 27.12 19.23 27.5 19.83 27.38C24.58 25.79 28 21.3 28 16C28 9.37 22.63 4 16 4Z"
              fill="#091128"
            />
          </g>
        </g>
      </g>
    </svg>
  </div>
);

/**
 * Feature Card 1 Illustration: Floating Pixel-Art Island with GitHub Symbol
 */
export const FeatureIslandOpenSource: React.FC = () => (
  <svg viewBox="0 0 160 120" className="w-32 h-24 mx-auto select-none" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Subtle glow */}
    <ellipse cx="80" cy="70" rx="52" ry="26" fill="#36C8FF" opacity="0.15" />
    {/* Floating rocky bottom */}
    <polygon points="34,72 80,94 126,72 114,98 80,112 46,98" fill="#475569" />
    <polygon points="46,78 80,94 80,112 46,98" fill="#334155" />
    {/* Isometric green grass top */}
    <polygon points="30,68 80,48 130,68 80,90" fill="#22C55E" />
    <polygon points="30,68 80,90 80,96 30,74" fill="#16A34A" />
    <polygon points="130,68 80,90 80,96 130,74" fill="#15803D" />
    {/* Small pixel pine trees */}
    <polygon points="44,54 38,68 50,68" fill="#4ADE80" />
    <polygon points="116,54 110,68 122,68" fill="#4ADE80" />
    {/* Giant GitHub Emblem standing on island */}
    <circle cx="80" cy="44" r="24" fill="#0B1430" stroke="#F5F7FF" strokeWidth="3" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M80 24C68.95 24 60 32.95 60 44C60 52.84 65.73 60.33 73.68 62.98C74.68 63.16 75.05 62.55 75.05 62.02C75.05 61.55 75.03 60.28 75.03 58.61C69.47 59.82 68.3 55.93 68.3 55.93C67.39 53.62 66.07 53 66.07 53C64.26 51.76 66.21 51.79 66.21 51.79C68.22 51.93 69.28 53.85 69.28 53.85C71.07 56.91 73.97 56.03 75.11 55.52C75.29 54.22 75.81 53.34 76.38 52.84C71.94 52.34 67.28 50.62 67.28 42.95C67.28 40.76 68.06 38.97 69.34 37.57C69.13 37.07 68.45 35.04 69.54 32.29C69.54 32.29 71.22 31.75 75.04 34.34C76.64 33.9 78.35 33.68 80.05 33.68C81.75 33.68 83.46 33.9 85.06 34.34C88.88 31.75 90.56 32.29 90.56 32.29C91.65 35.04 90.97 37.07 90.76 37.57C92.04 38.97 92.82 40.76 92.82 42.95C92.82 50.64 88.14 52.33 83.69 52.82C84.41 53.44 85.05 54.67 85.05 56.55C85.05 59.25 85.03 61.42 85.03 62.02C85.03 62.55 85.4 63.18 86.41 62.98C94.35 60.32 100 52.84 100 44C100 32.95 91.05 24 80 24Z"
      fill="#F5F7FF"
    />
  </svg>
);

/**
 * Feature Card 2 Illustration: Floating Crystal Island with Discord Symbol
 */
export const FeatureIslandCommunity: React.FC = () => (
  <svg viewBox="0 0 160 120" className="w-32 h-24 mx-auto select-none" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="80" cy="70" rx="52" ry="26" fill="#9657FF" opacity="0.2" />
    {/* Floating purple rocky base */}
    <polygon points="34,72 80,94 126,72 112,98 80,112 48,98" fill="#4C1D95" />
    <polygon points="48,78 80,94 80,112 48,98" fill="#3B0764" />
    {/* Isometric violet platform top */}
    <polygon points="30,68 80,48 130,68 80,90" fill="#7C3AED" />
    <polygon points="30,68 80,90 80,96 30,74" fill="#6D28D9" />
    <polygon points="130,68 80,90 80,96 130,74" fill="#5B21B6" />
    {/* Discord-inspired icon in 3D style */}
    <g transform="translate(52, 20)">
      <rect x="4" y="6" width="48" height="36" rx="12" fill="#818CF8" stroke="#C7D2FE" strokeWidth="2" />
      <circle cx="19" cy="24" r="4.5" fill="#0B1430" />
      <circle cx="37" cy="24" r="4.5" fill="#0B1430" />
      <path d="M16 34 Q28 39 40 34" stroke="#0B1430" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
);

/**
 * Feature Card 3 Illustration: Floating Island with Stack of Colorful Books
 */
export const FeatureIslandLearning: React.FC = () => (
  <svg viewBox="0 0 160 120" className="w-32 h-24 mx-auto select-none" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="80" cy="70" rx="52" ry="26" fill="#FFBF47" opacity="0.16" />
    {/* Rocky base */}
    <polygon points="34,72 80,94 126,72 114,98 80,112 46,98" fill="#78350F" />
    <polygon points="46,78 80,94 80,112 46,98" fill="#451A03" />
    {/* Green turf top */}
    <polygon points="30,68 80,48 130,68 80,90" fill="#22C55E" />
    <polygon points="30,68 80,90 80,96 30,74" fill="#16A34A" />
    <polygon points="130,68 80,90 80,96 130,74" fill="#15803D" />
    {/* Stack of 3 colorful books */}
    {/* Bottom book (Blue) */}
    <polygon points="50,58 80,46 110,58 80,70" fill="#3B82F6" />
    <polygon points="50,58 80,70 80,78 50,66" fill="#2563EB" />
    <polygon points="110,58 80,70 80,78 110,66" fill="#F8FAFC" />
    {/* Middle book (Gold/Orange) */}
    <polygon points="52,46 80,34 108,46 80,58" fill="#F59E0B" />
    <polygon points="52,46 80,58 80,65 52,53" fill="#D97706" />
    <polygon points="108,46 80,58 80,65 108,53" fill="#FEF3C7" />
    {/* Top book (Red/Coral) */}
    <polygon points="54,34 80,22 106,34 80,46" fill="#EF4444" />
    <polygon points="54,34 80,46 80,53 54,41" fill="#DC2626" />
    <polygon points="106,34 80,46 80,53 106,41" fill="#FEE2E2" />
  </svg>
);

/**
 * Feature Card 4 Illustration: Floating Island with `< />` Code Laptop
 */
export const FeatureIslandBuild: React.FC = () => (
  <svg viewBox="0 0 160 120" className="w-32 h-24 mx-auto select-none" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="80" cy="70" rx="52" ry="26" fill="#38E69B" opacity="0.16" />
    {/* Rocky base */}
    <polygon points="34,72 80,94 126,72 114,98 80,112 46,98" fill="#475569" />
    <polygon points="46,78 80,94 80,112 46,98" fill="#334155" />
    {/* Turf top */}
    <polygon points="30,68 80,48 130,68 80,90" fill="#22C55E" />
    <polygon points="30,68 80,90 80,96 30,74" fill="#16A34A" />
    <polygon points="130,68 80,90 80,96 130,74" fill="#15803D" />
    {/* Laptop screen & base */}
    <polygon points="46,62 84,54 114,66 76,74" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
    <rect x="52" y="20" width="54" height="36" rx="4" fill="#0F172A" stroke="#60A5FA" strokeWidth="2.5" />
    {/* `< />` code symbols on laptop screen */}
    <path d="M68 32 L61 38 L68 44" stroke="#FFBF47" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="82" y1="30" x2="76" y2="46" stroke="#36C8FF" strokeWidth="3" strokeLinecap="round" />
    <path d="M90 32 L97 38 L90 44" stroke="#FFBF47" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Distinct Project Card Icon matching the reference image (EVEE purple star, VAssureAI blue shield, Travel Together cyan plane, etc.)
 */
export const ProjectCardIcon: React.FC<{
  type: 'evee' | 'vassure' | 'travel' | 'talkinghead' | 'zipignore' | 'medict';
}> = ({ type }) => {
  switch (type) {
    case 'evee':
      return (
        <svg viewBox="0 0 56 56" className="w-12 h-12 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="eveeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <path
            d="M28 4 L35 21 L52 28 L35 35 L28 52 L21 35 L4 28 L21 21 Z"
            fill="url(#eveeGrad)"
            stroke="#E9D5FF"
            strokeWidth="1.5"
          />
          <circle cx="28" cy="28" r="5" fill="#F5F7FF" opacity="0.85" />
        </svg>
      );
    case 'vassure':
      return (
        <svg viewBox="0 0 56 56" className="w-12 h-12 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#36C8FF" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          <path
            d="M28 5 L48 13 V27 C48 40 39 48 28 52 C17 48 8 40 8 27 V13 L28 5 Z"
            fill="url(#shieldGrad)"
            stroke="#93C5FD"
            strokeWidth="1.5"
          />
          <path
            d="M20 28 L26 34 L37 22"
            stroke="#050B1D"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'travel':
      return (
        <svg viewBox="0 0 56 56" className="w-12 h-12 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="28" cy="28" r="22" fill="#1D4ED8" stroke="#36C8FF" strokeWidth="1.5" />
          <path
            d="M16 32 L26 26 L22 14 L26 12 L33 23 L42 18 C44 17 46 18 45 20 L36 28 L39 41 L35 43 L30 31 L21 36 L19 41 L16 40 L18 34 L14 31 L16 32 Z"
            fill="#F5F7FF"
          />
        </svg>
      );
    case 'talkinghead':
      return (
        <svg viewBox="0 0 56 56" className="w-12 h-12 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="6" y="6" width="44" height="44" rx="14" fill="#065F46" stroke="#38E69B" strokeWidth="1.5" />
          <circle cx="22" cy="24" r="3" fill="#38E69B" />
          <circle cx="34" cy="24" r="3" fill="#38E69B" />
          <path d="M20 34 Q28 40 36 34" stroke="#38E69B" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'zipignore':
      return (
        <svg viewBox="0 0 56 56" className="w-12 h-12 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="6" y="6" width="44" height="44" rx="14" fill="#78350F" stroke="#FFBF47" strokeWidth="1.5" />
          <path d="M18 22 L25 28 L18 34" stroke="#FFBF47" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="28" y1="34" x2="38" y2="34" stroke="#F5F7FF" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'medict':
    default:
      return (
        <svg viewBox="0 0 56 56" className="w-12 h-12 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="6" y="6" width="44" height="44" rx="14" fill="#0F2942" stroke="#36C8FF" strokeWidth="1.5" />
          <path d="M28 16 V40 M16 28 H40" stroke="#36C8FF" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
  }
};

/**
 * Closing CTA Section Illustration: Pixel-Art Rocket Launching into Space
 */
export const RocketLaunchIllustration: React.FC<{ className?: string }> = ({ className = 'w-44 h-44' }) => (
  <svg
    viewBox="0 0 200 190"
    className={`${className} select-none`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Starry backdrop */}
    <circle cx="35" cy="30" r="1.5" fill="#38E69B" />
    <circle cx="80" cy="22" r="2" fill="#36C8FF" />
    <circle cx="165" cy="38" r="1.5" fill="#FFBF47" />
    <circle cx="48" cy="85" r="1.5" fill="#F5F7FF" />

    {/* Purple nebula clouds at bottom */}
    <path
      d="M10 185 Q45 145 90 168 T185 162 L195 185 Z"
      fill="#6D28D9"
      opacity="0.45"
    />
    {/* Rocky launch cliff */}
    <polygon points="85,185 115,148 175,148 195,185" fill="#1E293B" stroke="#38E69B" strokeWidth="1.5" />
    <polygon points="95,152 165,152 175,158 90,158" fill="#22C55E" />

    {/* Launch gantry tower */}
    <rect x="122" y="88" width="8" height="62" fill="#64748B" />
    <line x1="122" y1="98" x2="140" y2="98" stroke="#94A3B8" strokeWidth="2.5" />
    <line x1="122" y1="116" x2="140" y2="116" stroke="#94A3B8" strokeWidth="2.5" />

    {/* Rocket Flame Plume */}
    <polygon points="142,126 156,126 162,152 136,152" fill="#F59E0B" />
    <polygon points="145,126 153,126 156,146 142,146" fill="#FEF08A" />

    {/* Pixel-Art Rocket Body */}
    <g transform="translate(132, 42)">
      {/* Nose cone */}
      <polygon points="17,0 29,22 5,22" fill="#EF4444" />
      {/* Fuselage */}
      <rect x="5" y="22" width="24" height="54" rx="4" fill="#F8FAFC" stroke="#60A5FA" strokeWidth="1.5" />
      {/* Porthole window */}
      <circle cx="17" cy="40" r="6" fill="#36C8FF" stroke="#1E3A8A" strokeWidth="2" />
      {/* Fins */}
      <polygon points="5,56 -5,78 5,76" fill="#7C3AED" />
      <polygon points="29,56 39,78 29,76" fill="#7C3AED" />
      {/* Booster nozzle */}
      <rect x="9" y="76" width="16" height="8" fill="#334155" />
    </g>
  </svg>
);

/**
 * Pixel Heart Icon shown in the closing CTA box in the reference image
 */
export const PixelHeartIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 16 14"
    className={`${className} pixelated select-none`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="2" y="1" width="4" height="2" fill="#F43F5E" />
    <rect x="10" y="1" width="4" height="2" fill="#F43F5E" />
    <rect x="1" y="3" width="6" height="2" fill="#FB7185" />
    <rect x="9" y="3" width="6" height="2" fill="#F43F5E" />
    <rect x="1" y="5" width="14" height="2" fill="#E11D48" />
    <rect x="2" y="7" width="12" height="2" fill="#E11D48" />
    <rect x="4" y="9" width="8" height="2" fill="#BE123C" />
    <rect x="6" y="11" width="4" height="2" fill="#9F1239" />
    {/* Highlight pixel */}
    <rect x="2" y="3" width="2" height="2" fill="#FFE4E6" />
  </svg>
);

/**
 * Designed Orbital Illustration for the Community Section
 * (Used instead of fabricated contributor avatars when the community is new)
 */
export const CommunityOrbitIllustration: React.FC<{ className?: string }> = ({
  className = 'w-full h-24',
}) => (
  <svg
    viewBox="0 0 360 96"
    className={`${className} select-none`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Connecting orbital arc */}
    <path
      d="M 28 68 Q 180 12 332 68"
      stroke="#36C8FF"
      strokeWidth="2"
      strokeDasharray="6 6"
      opacity="0.55"
    />
    <path
      d="M 56 48 Q 180 86 304 48"
      stroke="#9657FF"
      strokeWidth="1.5"
      opacity="0.45"
    />
    {/* Central glowing planet node */}
    <circle cx="180" cy="48" r="22" fill="#36C8FF" opacity="0.16" />
    <circle cx="180" cy="48" r="14" fill="#1D4ED8" stroke="#36C8FF" strokeWidth="2" />
    <ellipse
      cx="180"
      cy="48"
      rx="24"
      ry="6"
      transform="rotate(-18 180 48)"
      stroke="#FFBF47"
      strokeWidth="2"
    />
    {/* Satellite nodes representing open collaboration */}
    <circle cx="78" cy="48" r="9" fill="#0D1B38" stroke="#38E69B" strokeWidth="2" />
    <circle cx="78" cy="48" r="3" fill="#38E69B" />
    <circle cx="282" cy="48" r="9" fill="#0D1B38" stroke="#C084FC" strokeWidth="2" />
    <circle cx="282" cy="48" r="3" fill="#C084FC" />
    <circle cx="34" cy="64" r="5" fill="#FFBF47" opacity="0.85" />
    <circle cx="326" cy="64" r="5" fill="#36C8FF" opacity="0.85" />
  </svg>
);

