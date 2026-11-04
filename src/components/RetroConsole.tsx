import React, { useState, useEffect } from 'react';
import { NavSection } from '../types';
import { soundManager } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { GameScreen } from './GameScreen';
import {
  ARCADE_GAMES,
  ArcadeGameId,
  ArcadeControlAction,
} from './ArcadeGames';

interface RetroConsoleProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  onOpenSectionDetail: (section: NavSection) => void;
}

export const RetroConsole: React.FC<RetroConsoleProps> = ({
  activeSection,
  onSelectSection,
  onOpenSectionDetail,
}) => {
  const menuOptions: { id: NavSection | 'arcade'; label: string; level: string }[] = [
    { id: 'about', label: 'ABOUT', level: 'LV 01' },
    { id: 'projects', label: 'PROJECTS', level: 'LV 02' },
    { id: 'blog', label: 'BLOG', level: 'LV 03' },
    { id: 'contact', label: 'CONTACT', level: 'LV 04' },
    { id: 'arcade', label: 'ARCADE', level: 'LV 05' },
  ];

  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [mode, setMode] = useState<'menu' | 'quest' | 'arcade'>('menu');
  const [activeArcadeGame, setActiveArcadeGame] = useState<ArcadeGameId | null>(null);
  const [selectedArcadeIndex, setSelectedArcadeIndex] = useState(0);
  const [arcadeControlSignal, setArcadeControlSignal] = useState<{
    action: ArcadeControlAction;
    seq: number;
  } | null>(null);
  const [score, setScore] = useState(350);
  const [hearts] = useState(3);
  const [characterX, setCharacterX] = useState(44);
  const [characterY, setCharacterY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [collectedGems, setCollectedGems] = useState<number[]>([1]);
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const emitArcadeSignal = (action: ArcadeControlAction) => {
    setArcadeControlSignal((prev) => ({ action, seq: (prev?.seq ?? 0) + 1 }));
  };

  // Sync selected menu index when activeSection changes externally
  useEffect(() => {
    const idx = menuOptions.findIndex((m) => m.id === activeSection);
    if (idx !== -1) {
      setSelectedMenuIndex(idx);
    }
  }, [activeSection]);

  // Reset console tilt whenever arcade mode is active so the console stays completely steady
  useEffect(() => {
    if (mode === 'arcade') {
      setMouseTilt({ x: 0, y: 0 });
    }
  }, [mode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode === 'arcade') return;
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        pressDpad('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        pressDpad('down');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        pressDpad('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        pressDpad('right');
      } else if (e.key.toLowerCase() === 'a') {
        e.preventDefault();
        pressA();
      } else if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        pressB();
      }
    };

    const handleKeyUp = () => {
      setActiveButton(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [mode, selectedMenuIndex, selectedArcadeIndex, activeArcadeGame, characterX, isJumping]);

  const pressDpad = (dir: 'up' | 'down' | 'left' | 'right') => {
    setActiveButton(`dpad-${dir}`);

    if (mode === 'arcade') {
      if (!activeArcadeGame) {
        soundManager.playNavigate();
        // 2-column grid of 6 games
        setSelectedArcadeIndex((prev) => {
          if (dir === 'right') return (prev + 1) % ARCADE_GAMES.length;
          if (dir === 'left') return (prev - 1 + ARCADE_GAMES.length) % ARCADE_GAMES.length;
          if (dir === 'down') return (prev + 2) % ARCADE_GAMES.length;
          if (dir === 'up') return (prev - 2 + ARCADE_GAMES.length) % ARCADE_GAMES.length;
          return prev;
        });
      } else {
        emitArcadeSignal(dir);
      }
      setTimeout(() => setActiveButton(null), 150);
      return;
    }

    soundManager.playNavigate();

    if (mode === 'menu') {
      if (dir === 'up') {
        setSelectedMenuIndex((prev) => (prev === 0 ? menuOptions.length - 1 : prev - 1));
      } else if (dir === 'down') {
        setSelectedMenuIndex((prev) => (prev === menuOptions.length - 1 ? 0 : prev + 1));
      } else if (dir === 'right') {
        setCharacterX((prev) => Math.min(prev + 10, 95));
        setFacing('right');
      } else if (dir === 'left') {
        setCharacterX((prev) => Math.max(prev - 10, 14));
        setFacing('left');
      }
    } else if (mode === 'quest') {
      if (dir === 'left') {
        setCharacterX((prev) => Math.max(prev - 12, 12));
        setFacing('left');
      } else if (dir === 'right') {
        setCharacterX((prev) => {
          const next = Math.min(prev + 12, 155);
          if (next >= 70 && !collectedGems.includes(2)) {
            setCollectedGems((c) => [...c, 2]);
            setScore((s) => s + 100);
            soundManager.playCoin();
          }
          if (next >= 125 && !collectedGems.includes(3)) {
            setCollectedGems((c) => [...c, 3]);
            setScore((s) => s + 200);
            soundManager.playCoin();
            confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
          }
          return next;
        });
        setFacing('right');
      } else if (dir === 'up') {
        jumpCharacter();
      }
    }

    setTimeout(() => setActiveButton(null), 150);
  };

  const jumpCharacter = () => {
    if (isJumping) return;
    setIsJumping(true);
    soundManager.playJump();
    setCharacterY(24);
    setTimeout(() => {
      setCharacterY(0);
      setIsJumping(false);
    }, 380);
  };

  const pressA = () => {
    setActiveButton('btn-a');

    if (mode === 'arcade') {
      if (!activeArcadeGame) {
        soundManager.playSelect();
        setActiveArcadeGame(ARCADE_GAMES[selectedArcadeIndex].id);
      } else {
        emitArcadeSignal('a');
      }
      setTimeout(() => setActiveButton(null), 150);
      return;
    }

    soundManager.playSelect();

    if (mode === 'menu') {
      const selected = menuOptions[selectedMenuIndex];
      if (selected.id === 'arcade') {
        setMode('arcade');
        setActiveArcadeGame(null);
      } else {
        onSelectSection(selected.id);
        onOpenSectionDetail(selected.id);
      }
    } else if (mode === 'quest') {
      jumpCharacter();
    }

    setTimeout(() => setActiveButton(null), 150);
  };

  const pressB = () => {
    setActiveButton('btn-b');

    if (mode === 'arcade') {
      soundManager.playBack();
      if (activeArcadeGame) {
        setActiveArcadeGame(null);
      } else {
        setMode('menu');
      }
      setTimeout(() => setActiveButton(null), 150);
      return;
    }

    soundManager.playBack();

    if (mode === 'quest') {
      setMode('menu');
    } else {
      onSelectSection('home');
    }

    setTimeout(() => setActiveButton(null), 150);
  };

  const pressStart = () => {
    setActiveButton('btn-start');
    if (mode === 'arcade') {
      if (activeArcadeGame) {
        emitArcadeSignal('start');
      } else {
        soundManager.playSelect();
        setActiveArcadeGame(ARCADE_GAMES[selectedArcadeIndex].id);
      }
      setTimeout(() => setActiveButton(null), 150);
      return;
    }
    soundManager.playSelect();
    setMode('arcade');
    setActiveArcadeGame(null);
    setTimeout(() => setActiveButton(null), 150);
  };

  const pressSelect = () => {
    setActiveButton('btn-select');
    if (mode === 'arcade') {
      soundManager.playSelect();
      if (!activeArcadeGame) {
        // Select & launch the currently highlighted game in the Arcade menu
        setActiveArcadeGame(ARCADE_GAMES[selectedArcadeIndex].id);
      } else {
        // If already playing a game, return to the Arcade game selector
        setActiveArcadeGame(null);
      }
      setTimeout(() => setActiveButton(null), 150);
      return;
    }

    soundManager.playSelect();
    if (mode === 'menu') {
      const selected = menuOptions[selectedMenuIndex];
      if (selected.id === 'arcade') {
        setMode('arcade');
        setActiveArcadeGame(null);
      } else {
        onSelectSection(selected.id);
        onOpenSectionDetail(selected.id);
      }
    } else {
      setMode('menu');
    }
    setTimeout(() => setActiveButton(null), 150);
  };

  const screwPositions = [
    'top-3.5 left-3.5',
    'top-3.5 right-3.5',
    'bottom-3.5 left-3.5',
    'bottom-3.5 right-3.5',
  ];

  return (
    <section
      aria-label="Interactive 3D Retro Gaming Console"
      className="w-full max-w-[356px] lg:max-w-[324px] xl:max-w-[356px] mx-auto flex flex-col items-center justify-center select-none py-1 px-1.5 sm:px-0"
      id="center-console-wrapper"
    >
      <style>{`
        .gb-button:active, .gb-button-active {
          transform: translateY(2px) !important;
          box-shadow: inset 0 3px 6px rgba(0,0,0,0.8) !important;
        }
        .dpad-arm:active, .dpad-arm-active {
          filter: brightness(0.85);
        }
      `}</style>

      {/* ── DEVICE BODY & STAND WRAPPER ── */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            mode !== 'arcade' && (mouseTilt.x !== 0 || mouseTilt.y !== 0)
              ? `perspective(1200px) rotateX(${mouseTilt.y * -6}deg) rotateY(${mouseTilt.x * 8}deg)`
              : 'none',
        }}
        className="w-full flex flex-col items-center transition-transform duration-200 ease-out"
      >
        {/* CHASSIS */}
        <div
          className="relative w-full max-w-[340px] rounded-[26px] sm:rounded-[28px] px-4 sm:px-5 pt-4 sm:pt-[18px] pb-5 sm:pb-[22px] z-10"
          style={{
            background: 'linear-gradient(160deg, #DDD4AC 0%, #C9BB89 40%, #B5A668 70%, #A89058 100%)',
            boxShadow: `
              -5px 0 0 0 #E5DCBA,
              5px 0 0 0 #857448,
              0 6px 0 0 #72632A,
              0 22px 44px rgba(0,0,0,0.55),
              0 6px 14px rgba(0,0,0,0.35)
            `,
          }}
        >
          {/* Left highlight edge */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 24,
              bottom: 24,
              width: 6,
              borderRadius: '8px 0 0 8px',
              background: 'linear-gradient(to right, #EDE4C2, #D9CE9E)',
              pointerEvents: 'none',
            }}
          />
          {/* Right shadow edge */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 24,
              bottom: 24,
              width: 6,
              borderRadius: '0 8px 8px 0',
              background: 'linear-gradient(to right, #9A8A56, #72622A)',
              pointerEvents: 'none',
            }}
          />

          {/* 4 Corner Screws (Responsive CSS positioning) */}
          {screwPositions.map((posClass, i) => (
            <div
              key={i}
              aria-hidden="true"
              className={`absolute ${posClass} w-3 h-3 rounded-full bg-[#6E5B36] shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] pointer-events-none`}
            >
              <div className="absolute top-1/2 left-1/2 w-2 h-[1.5px] bg-[#4A3B2B] -translate-x-1/2 -translate-y-1/2 rotate-45" />
              <div className="absolute top-1/2 left-1/2 w-[1.5px] h-2 bg-[#4A3B2B] -translate-x-1/2 -translate-y-1/2 rotate-45" />
            </div>
          ))}

          {/* Top label */}
          <div className="flex justify-center mb-2.5 sm:mb-3 px-4">
            <span className="text-[8.5px] sm:text-[9px] font-sans font-extrabold text-[#57492C] tracking-[0.18em] text-center truncate">
              SURAJ PORTFOLIO SYSTEM
            </span>
          </div>

          {/* Screen bezel — recessed cavity */}
          <div
            style={{
              width: '100%',
              borderRadius: 10,
              overflow: 'hidden',
              background: '#080810',
              padding: 3,
              boxShadow: '0 4px 6px rgba(255,255,255,0.4), inset 0 6px 12px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ borderRadius: 8, overflow: 'hidden' }}>
              <GameScreen
                activeSection={activeSection}
                selectedMenuIndex={selectedMenuIndex}
                onSelectIndex={(idx) => {
                  setSelectedMenuIndex(idx);
                  const opt = menuOptions[idx];
                  if (opt && opt.id !== 'arcade') {
                    onSelectSection(opt.id);
                  }
                }}
                onConfirmMenu={() => {
                  const item = menuOptions[selectedMenuIndex];
                  if (item.id === 'arcade') {
                    soundManager.playSelect();
                    setMode('arcade');
                    setActiveArcadeGame(null);
                  } else {
                    onOpenSectionDetail(item.id);
                  }
                }}
                mode={mode}
                characterX={characterX}
                characterY={characterY}
                facing={facing}
                isJumping={isJumping}
                score={score}
                hearts={hearts}
                collectedGems={collectedGems}
                activeArcadeGame={activeArcadeGame}
                selectedArcadeIndex={selectedArcadeIndex}
                onSelectArcadeIndex={setSelectedArcadeIndex}
                onLaunchArcadeGame={(gameId) => {
                  const gIdx = ARCADE_GAMES.findIndex((g) => g.id === gameId);
                  if (gIdx !== -1) setSelectedArcadeIndex(gIdx);
                  setMode('arcade');
                  setActiveArcadeGame(gameId);
                }}
                onExitArcadeToLauncher={() => setActiveArcadeGame(null)}
                onExitArcadeToMenu={() => {
                  setActiveArcadeGame(null);
                  setMode('menu');
                }}
                arcadeControlSignal={arcadeControlSignal}
              />
            </div>

            {/* RGB label under screen inside bezel */}
            <div className="flex items-center justify-center pt-1 pb-0.5">
              <div className="w-1.5 h-0.5 bg-[#A13E53] rounded-xs mr-1.5" />
              <div className="w-1.5 h-0.5 bg-[#427BA6] rounded-xs mr-1.5" />
              <div className="w-1.5 h-0.5 bg-[#4BAA5B] rounded-xs mr-2" />
              <span className="text-[7.5px] font-sans font-semibold text-[#A09CA8] tracking-[0.14em]">
                RGB 16-BIT DISPLAY
              </span>
            </div>
          </div>

          {/* ── CONTROLS: D-PAD & A/B BUTTONS ── */}
          <div className="flex justify-between items-center mt-6 sm:mt-8 px-1 sm:px-2">
            {/* D-PAD (with >= 44x44px accessible touch hitboxes) */}
            <div
              className="relative w-[96px] h-[96px] sm:w-[100px] sm:h-[100px] bg-[#A6976A] rounded-full flex items-center justify-center shrink-0"
              style={{
                boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.2), 0 2px 2px rgba(255,255,255,0.4)',
              }}
              role="group"
              aria-label="Directional Pad"
            >
              <div className="relative w-[78px] h-[78px]">
                {/* UP */}
                <button
                  type="button"
                  aria-label="D-Pad Up"
                  onClick={() => pressDpad('up')}
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-11 h-11 flex items-start justify-center pt-2 z-20 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#092A4A] rounded"
                >
                  <span
                    className={`dpad-arm block w-[26px] h-[28px] bg-[#1C1C24] rounded-t-[4px] ${
                      activeButton === 'dpad-up' ? 'dpad-arm-active' : ''
                    }`}
                    style={{
                      boxShadow:
                        'inset 0 2px 2px rgba(255,255,255,0.2), -2px 0 2px rgba(0,0,0,0.4), 2px 0 2px rgba(0,0,0,0.4)',
                    }}
                  />
                </button>

                {/* DOWN */}
                <button
                  type="button"
                  aria-label="D-Pad Down"
                  onClick={() => pressDpad('down')}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-11 h-11 flex items-end justify-center pb-2 z-20 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#092A4A] rounded"
                >
                  <span
                    className={`dpad-arm block w-[26px] h-[28px] bg-[#1C1C24] rounded-b-[4px] ${
                      activeButton === 'dpad-down' ? 'dpad-arm-active' : ''
                    }`}
                    style={{
                      boxShadow:
                        'inset 0 -2px 4px rgba(0,0,0,0.8), -2px 0 2px rgba(0,0,0,0.4), 2px 0 2px rgba(0,0,0,0.4)',
                    }}
                  />
                </button>

                {/* LEFT */}
                <button
                  type="button"
                  aria-label="D-Pad Left"
                  onClick={() => pressDpad('left')}
                  className="absolute top-1/2 -left-2 -translate-y-1/2 w-11 h-11 flex items-center justify-start pl-2 z-20 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#092A4A] rounded"
                >
                  <span
                    className={`dpad-arm block w-[28px] h-[26px] bg-[#1C1C24] rounded-l-[4px] ${
                      activeButton === 'dpad-left' ? 'dpad-arm-active' : ''
                    }`}
                    style={{
                      boxShadow:
                        'inset 2px 0 2px rgba(255,255,255,0.1), 0 -2px 2px rgba(0,0,0,0.4), 0 2px 2px rgba(0,0,0,0.4)',
                    }}
                  />
                </button>

                {/* RIGHT */}
                <button
                  type="button"
                  aria-label="D-Pad Right"
                  onClick={() => pressDpad('right')}
                  className="absolute top-1/2 -right-2 -translate-y-1/2 w-11 h-11 flex items-center justify-end pr-2 z-20 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#092A4A] rounded"
                >
                  <span
                    className={`dpad-arm block w-[28px] h-[26px] bg-[#1C1C24] rounded-r-[4px] ${
                      activeButton === 'dpad-right' ? 'dpad-arm-active' : ''
                    }`}
                    style={{
                      boxShadow:
                        'inset -2px 0 4px rgba(0,0,0,0.6), 0 -2px 2px rgba(0,0,0,0.4), 0 2px 2px rgba(0,0,0,0.4)',
                    }}
                  />
                </button>

                {/* CENTER */}
                <div
                  style={{
                    position: 'absolute',
                    top: 26,
                    left: 26,
                    width: 26,
                    height: 26,
                    background: '#1A1A22',
                    zIndex: 10,
                    pointerEvents: 'none',
                  }}
                />
                {/* Center concave dot */}
                <div
                  style={{
                    position: 'absolute',
                    top: 32,
                    left: 32,
                    width: 14,
                    height: 14,
                    background: '#14141A',
                    borderRadius: '50%',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)',
                    zIndex: 15,
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* A/B buttons (48x64px interactive touch targets) */}
            <div className="relative w-[114px] h-[76px] shrink-0">
              {/* B Button */}
              <button
                type="button"
                aria-label="B Button - Back"
                onClick={pressB}
                className="absolute left-0 bottom-0 min-w-[48px] min-h-[60px] flex flex-col items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#092A4A] rounded-xl"
              >
                <span
                  style={{
                    background: '#A6976A',
                    padding: 3,
                    borderRadius: '50%',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 2px rgba(255,255,255,0.4)',
                    display: 'block',
                  }}
                >
                  <span
                    className={`gb-button block ${activeButton === 'btn-b' ? 'gb-button-active' : ''}`}
                    style={{
                      width: 38,
                      height: 38,
                      background: 'linear-gradient(135deg, #A82E49, #6B1C2D)',
                      borderRadius: '50%',
                      border: '2px solid #3A101A',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.3)',
                      transition: 'all 0.1s',
                    }}
                  />
                </span>
                <span className="mt-1 font-sans font-extrabold text-[#4A3B2B] text-[11px]">B</span>
              </button>

              {/* A Button */}
              <button
                type="button"
                aria-label="A Button - Select or Jump"
                onClick={pressA}
                className="absolute right-0 top-0 min-w-[48px] min-h-[60px] flex flex-col items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#092A4A] rounded-xl"
              >
                <span
                  style={{
                    background: '#A6976A',
                    padding: 3,
                    borderRadius: '50%',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 2px rgba(255,255,255,0.4)',
                    display: 'block',
                  }}
                >
                  <span
                    className={`gb-button block ${activeButton === 'btn-a' ? 'gb-button-active' : ''}`}
                    style={{
                      width: 38,
                      height: 38,
                      background: 'linear-gradient(135deg, #A82E49, #6B1C2D)',
                      borderRadius: '50%',
                      border: '2px solid #3A101A',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.3)',
                      transition: 'all 0.1s',
                    }}
                  />
                </span>
                <span className="mt-1 font-sans font-extrabold text-[#4A3B2B] text-[11px]">A</span>
              </button>
            </div>
          </div>

          {/* Lower controls: SELECT/START + speaker */}
          <div className="flex justify-between items-center mt-6 sm:mt-8 px-1 sm:px-2">
            {/* SELECT & START (min 52x44px touch targets) */}
            <div className="flex gap-2.5 sm:gap-3.5 -rotate-12 mt-1">
              <button
                type="button"
                aria-label="Select Button - Open Current Section"
                onClick={pressSelect}
                className="min-w-[52px] min-h-[44px] flex flex-col items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#092A4A] rounded-lg"
              >
                <span
                  style={{
                    background: '#A6976A',
                    padding: 2,
                    borderRadius: 20,
                    boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.3)',
                    display: 'block',
                  }}
                >
                  <span
                    className={`block ${activeButton === 'btn-select' ? 'gb-button-active' : ''}`}
                    style={{
                      width: 42,
                      height: 12,
                      background: '#2E2F38',
                      borderRadius: 10,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.2)',
                    }}
                  />
                </span>
                <span className="mt-1.5 text-[8px] font-sans font-extrabold text-[#4A3B2B] tracking-widest">
                  SELECT
                </span>
              </button>

              <button
                type="button"
                aria-label="Start Button - Toggle Quest Mode"
                onClick={pressStart}
                className="min-w-[52px] min-h-[44px] flex flex-col items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#092A4A] rounded-lg"
              >
                <span
                  style={{
                    background: '#A6976A',
                    padding: 2,
                    borderRadius: 20,
                    boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.3)',
                    display: 'block',
                  }}
                >
                  <span
                    className={`block ${activeButton === 'btn-start' ? 'gb-button-active' : ''}`}
                    style={{
                      width: 42,
                      height: 12,
                      background: '#2E2F38',
                      borderRadius: 10,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.2)',
                    }}
                  />
                </span>
                <span className="mt-1.5 text-[8px] font-sans font-extrabold text-[#4A3B2B] tracking-widest">
                  START
                </span>
              </button>
            </div>

            {/* Speaker Grille */}
            <div
              aria-hidden="true"
              className="flex flex-col gap-1.5 -rotate-25 mr-2 mt-2 pointer-events-none"
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 36,
                    height: 4,
                    background: '#121212',
                    borderRadius: 2,
                    boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.4)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* WIDE BEVELED MATTE DOCK PEDESTAL (Bottom Stand - fluid width so it never overflows 320px) */}
        <div
          className="w-full max-w-[352px] h-9 -mt-2 bg-[#D6C2A5] rounded-2xl border-3 border-[#C8B69A] relative z-0 flex flex-col items-center justify-between py-1 px-5"
          style={{
            boxShadow: `
              0 16px 32px rgba(45, 30, 15, 0.24),
              0 3px 8px rgba(45, 30, 15, 0.12),
              inset 0 2px 4px #F5E9D6,
              inset 0 -4px 6px #A58F72,
              inset 3px 0 5px #EFE1CC,
              inset -3px 0 5px #BCA78B
            `,
          }}
        >
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFF4E4]/80 to-transparent" />
          <div className="w-24 h-1 bg-[#A58F72]/60 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_1px_1px_rgba(255,255,255,0.4)]" />
          <div className="w-full flex justify-between px-6">
            <div className="w-3 h-0.5 bg-[#A58F72]/50 rounded-full" />
            <div className="w-3 h-0.5 bg-[#A58F72]/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* HELPER CONTROLS GUIDE & ARCADE CARTRIDGE DECK */}
      <div className="mt-4 w-full flex flex-col items-center justify-center gap-2.5 font-mono-tech text-xs text-[#4B6173] dark:text-[#CBD5E1] text-center px-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundManager.playSelect();
              if (mode === 'arcade') {
                setActiveArcadeGame(null);
                setMode('menu');
              } else {
                setMode('arcade');
                setActiveArcadeGame(null);
              }
            }}
            className="min-h-[40px] inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#092A4A] dark:bg-[#2563EB] hover:bg-[#123E6B] dark:hover:bg-[#1D4ED8] text-[#F4E9D5] dark:text-white border border-[#092A4A] dark:border-[#60A5FA]/50 transition-colors font-bold shadow-xs cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{mode === 'arcade' ? 'Return to RPG Menu' : 'Open Arcade (6 Games)'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playSelect();
              setActiveArcadeGame(null);
              setMode((prev) => (prev === 'quest' ? 'menu' : 'quest'));
            }}
            className="min-h-[40px] inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#EADBC3] dark:bg-[#172942] hover:bg-[#D7C3A6] dark:hover:bg-[#1E3A5F] text-[#092A4A] dark:text-[#F8FAFC] border border-[#C8B79D] dark:border-[#3B82F6]/60 transition-colors font-bold shadow-xs cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{mode === 'quest' ? 'Exit Quest' : 'Quest Mode'}</span>
          </button>
        </div>

        {/* Direct 6-Game Cartridge Selector */}
        <div
          className="w-full max-w-[340px] grid grid-cols-3 gap-1.5 pt-1"
          role="group"
          aria-label="Arcade Game Cartridges"
        >
          {ARCADE_GAMES.map((g, idx) => {
            const isPlayingThis = mode === 'arcade' && activeArcadeGame === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  soundManager.playSelect();
                  setSelectedArcadeIndex(idx);
                  setMode('arcade');
                  setActiveArcadeGame(g.id);
                }}
                className={`min-h-[34px] px-2 py-1 rounded-md text-[10px] font-bold tracking-wider transition-colors cursor-pointer whitespace-nowrap truncate border ${
                  isPlayingThis
                    ? 'bg-[#092A4A] text-[#5FD182] border-[#5FD182] dark:bg-[#1E3A5F] dark:text-[#5FD182]'
                    : 'bg-[#F3E9D7]/90 dark:bg-[#0F2137] text-[#10283F] dark:text-[#E2E8F0] border-[#C8B79D] dark:border-[#334155] hover:border-[#092A4A] dark:hover:border-[#60A5FA]'
                }`}
              >
                {g.shortTitle}
              </button>
            );
          })}
        </div>

        <span className="text-[11px] text-[#5C4A38] dark:text-[#CBD5E1] leading-snug max-w-[320px] sm:max-w-none">
          D-Pad / Arrows to move · [A] Action / Start · [B] Back
        </span>
      </div>
    </section>
  );
};
