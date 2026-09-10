import React, { useState, useEffect, useRef } from 'react';
import { NavSection } from '../types';
import { soundManager } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { GameScreen } from './GameScreen';

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
  const menuOptions: { id: NavSection; label: string; level: string }[] = [
    { id: 'about', label: 'ABOUT', level: 'LV 01' },
    { id: 'projects', label: 'PROJECTS', level: 'LV 02' },
    { id: 'blog', label: 'BLOG', level: 'LV 03' },
    { id: 'contact', label: 'CONTACT', level: 'LV 04' },
  ];

  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [mode, setMode] = useState<'menu' | 'quest'>('menu');
  const [score, setScore] = useState(350);
  const [hearts, setHearts] = useState(3);
  const [characterX, setCharacterX] = useState(50);
  const [characterY, setCharacterY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [collectedGems, setCollectedGems] = useState<number[]>([1]);

  // View modes: 'angle' (default, matches reference photo with 3D profile), 'front', 'interactive'
  const [viewMode, setViewMode] = useState<'front' | 'angle' | 'interactive'>('angle');
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const chassisRef = useRef<HTMLDivElement>(null);

  // Sync selected menu index when activeSection changes externally
  useEffect(() => {
    const idx = menuOptions.findIndex((m) => m.id === activeSection);
    if (idx !== -1) {
      setSelectedMenuIndex(idx);
    }
  }, [activeSection]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== 'interactive' && viewMode !== 'angle') return;
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
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
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
      } else if (e.key === 'Enter' || e.key.toLowerCase() === 'a') {
        e.preventDefault();
        pressA();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'b') {
        e.preventDefault();
        pressB();
      } else if (e.key === ' ') {
        e.preventDefault();
        if (mode === 'quest') {
          jumpCharacter();
        } else {
          pressA();
        }
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
  }, [mode, selectedMenuIndex, characterX, isJumping]);

  const pressDpad = (dir: 'up' | 'down' | 'left' | 'right') => {
    setActiveButton(`dpad-${dir}`);
    soundManager.playNavigate();

    if (mode === 'menu') {
      if (dir === 'up') {
        setSelectedMenuIndex((prev) => (prev === 0 ? menuOptions.length - 1 : prev - 1));
      } else if (dir === 'down') {
        setSelectedMenuIndex((prev) => (prev === menuOptions.length - 1 ? 0 : prev + 1));
      } else if (dir === 'right') {
        setCharacterX((prev) => Math.min(prev + 10, 105));
        setFacing('right');
      } else if (dir === 'left') {
        setCharacterX((prev) => Math.max(prev - 10, 16));
        setFacing('left');
      }
    } else if (mode === 'quest') {
      if (dir === 'left') {
        setCharacterX((prev) => Math.max(prev - 12, 12));
        setFacing('left');
      } else if (dir === 'right') {
        setCharacterX((prev) => {
          const next = Math.min(prev + 12, 165);
          if (next >= 75 && !collectedGems.includes(2)) {
            setCollectedGems((c) => [...c, 2]);
            setScore((s) => s + 100);
            soundManager.playCoin();
          }
          if (next >= 135 && !collectedGems.includes(3)) {
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
    soundManager.playSelect();

    if (mode === 'menu') {
      const selected = menuOptions[selectedMenuIndex];
      onSelectSection(selected.id);
      onOpenSectionDetail(selected.id);
    } else if (mode === 'quest') {
      jumpCharacter();
    }

    setTimeout(() => setActiveButton(null), 150);
  };

  const pressB = () => {
    setActiveButton('btn-b');
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
    soundManager.playSelect();
    setMode((prev) => (prev === 'menu' ? 'quest' : 'menu'));
    setTimeout(() => setActiveButton(null), 150);
  };

  const pressSelect = () => {
    setActiveButton('btn-select');
    soundManager.playNavigate();
    const selected = menuOptions[selectedMenuIndex];
    onSelectSection(selected.id);
    onOpenSectionDetail(selected.id);
    setTimeout(() => setActiveButton(null), 150);
  };

  const get3DTransform = () => {
    if (viewMode === 'angle') {
      const tiltX = 3 + mouseTilt.y * -3;
      const tiltY = -5 + mouseTilt.x * 4;
      return `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
    if (viewMode === 'interactive') {
      const tiltX = mouseTilt.y * -12;
      const tiltY = mouseTilt.x * 14;
      return `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
    return 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
  };

  // Identical Phillips screw head
  const ScrewHead = ({ className }: { className: string }) => (
    <div
      className={`absolute w-3.5 h-3.5 rounded-full bg-[#7A664E] p-0.5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.7)] ${className}`}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-br from-[#E2D6C5] via-[#A8957E] to-[#6E5A44] flex items-center justify-center shadow-xs">
        <div className="w-2 h-0.5 bg-[#3B2E21] rotate-45 relative">
          <div className="w-0.5 h-2 bg-[#3B2E21] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col items-center justify-center select-none py-1"
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

      {/* ── DEVICE BODY ── */}
      <div
        className="transition-transform duration-300 ease-out flex flex-col items-center"
      >
        <div
          style={{
            position: 'relative',
            width: 340,
            background: 'linear-gradient(160deg, #DDD4AC 0%, #C9BB89 40%, #B5A668 70%, #A89058 100%)',
            borderRadius: 28,
            padding: '18px 20px 22px',
            zIndex: 10,
            boxShadow: `
              -7px 0 0 0 #E5DCBA,
              7px 0 0 0 #857448,
              0 6px 0 0 #72632A,
              0 26px 52px rgba(0,0,0,0.6),
              0 8px 18px rgba(0,0,0,0.4)
            `,
          }}
        >
          {/* Left highlight edge */}
          <div style={{ position: 'absolute', left: 0, top: 24, bottom: 24, width: 7, borderRadius: '8px 0 0 8px', background: 'linear-gradient(to right, #EDE4C2, #D9CE9E)', pointerEvents: 'none' }} />
          {/* Right shadow edge */}
          <div style={{ position: 'absolute', right: 0, top: 24, bottom: 24, width: 7, borderRadius: '0 8px 8px 0', background: 'linear-gradient(to right, #9A8A56, #72622A)', pointerEvents: 'none' }} />

          {/* Corner screws */}
          {[[14, 14], [314, 14], [14, 580], [314, 580]].map(([l, t], i) => (
            <div key={i} style={{ position: 'absolute', left: l, top: t, width: 12, height: 12, borderRadius: '50%', background: '#6E5B36', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6)' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 8, height: 1.5, background: '#4A3B2B', transform: 'translate(-50%, -50%) rotate(45deg)' }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 1.5, height: 8, background: '#4A3B2B', transform: 'translate(-50%, -50%) rotate(45deg)' }} />
            </div>
          ))}

          {/* Top label */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 9, fontFamily: 'sans-serif', fontWeight: 800, color: '#6A5C3C', letterSpacing: '0.2em' }}>
              SURAJ PORTFOLIO SYSTEM
            </span>
          </div>

          {/* Screen bezel — recessed cavity */}
          <div style={{ width: '100%', borderRadius: 10, overflow: 'hidden', background: '#080810', padding: 3, boxShadow: '0 4px 6px rgba(255,255,255,0.4), inset 0 6px 12px rgba(0,0,0,0.8)' }}>
            <div style={{ borderRadius: 8, overflow: 'hidden' }}>
              <GameScreen
                activeSection={activeSection}
                selectedMenuIndex={selectedMenuIndex}
                onSelectIndex={(idx) => {
                  setSelectedMenuIndex(idx);
                  onSelectSection(menuOptions[idx].id);
                }}
                onConfirmMenu={() => {
                  const item = menuOptions[selectedMenuIndex];
                  onOpenSectionDetail(item.id);
                }}
                mode={mode}
                characterX={characterX}
                characterY={characterY}
                facing={facing}
                isJumping={isJumping}
                score={score}
                hearts={hearts}
                collectedGems={collectedGems}
              />
            </div>
            
            {/* RGB label under screen inside bezel */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 0 2px' }}>
              <div style={{ width: 6, height: 2, background: '#A13E53', borderRadius: 2, marginRight: 6 }} />
              <div style={{ width: 6, height: 2, background: '#427BA6', borderRadius: 2, marginRight: 6 }} />
              <div style={{ width: 6, height: 2, background: '#4BAA5B', borderRadius: 2, marginRight: 8 }} />
              <span style={{ fontSize: 7.5, fontFamily: 'sans-serif', fontWeight: 600, color: '#A09CA8', letterSpacing: '0.15em' }}>
                RGB 16-BIT DISPLAY
              </span>
            </div>
          </div>

          {/* ── CONTROLS ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 36, padding: '0 10px' }}>
            
            {/* D-PAD */}
            <div style={{ position: 'relative', width: 86, height: 86, background: '#A6976A', borderRadius: '50%', boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.2), 0 2px 2px rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: 70, height: 70 }}>
                {/* UP */}
                <div 
                  className={activeButton === 'dpad-up' ? 'dpad-arm-active' : ''}
                  onPointerDown={() => pressDpad('up')}
                  style={{ position: 'absolute', top: 0, left: 22, width: 26, height: 28, background: '#1C1C24', borderRadius: '4px 4px 0 0', boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.2), -2px 0 2px rgba(0,0,0,0.4), 2px 0 2px rgba(0,0,0,0.4)', cursor: 'pointer', zIndex: 20 }}
                />
                {/* DOWN */}
                <div 
                  className={activeButton === 'dpad-down' ? 'dpad-arm-active' : ''}
                  onPointerDown={() => pressDpad('down')}
                  style={{ position: 'absolute', bottom: 0, left: 22, width: 26, height: 28, background: '#1C1C24', borderRadius: '0 0 4px 4px', boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.8), -2px 0 2px rgba(0,0,0,0.4), 2px 0 2px rgba(0,0,0,0.4)', cursor: 'pointer', zIndex: 20 }}
                />
                {/* LEFT */}
                <div 
                  className={activeButton === 'dpad-left' ? 'dpad-arm-active' : ''}
                  onPointerDown={() => pressDpad('left')}
                  style={{ position: 'absolute', top: 22, left: 0, width: 28, height: 26, background: '#1C1C24', borderRadius: '4px 0 0 4px', boxShadow: 'inset 2px 0 2px rgba(255,255,255,0.1), 0 -2px 2px rgba(0,0,0,0.4), 0 2px 2px rgba(0,0,0,0.4)', cursor: 'pointer', zIndex: 20 }}
                />
                {/* RIGHT */}
                <div 
                  className={activeButton === 'dpad-right' ? 'dpad-arm-active' : ''}
                  onPointerDown={() => pressDpad('right')}
                  style={{ position: 'absolute', top: 22, right: 0, width: 28, height: 26, background: '#1C1C24', borderRadius: '0 4px 4px 0', boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.6), 0 -2px 2px rgba(0,0,0,0.4), 0 2px 2px rgba(0,0,0,0.4)', cursor: 'pointer', zIndex: 20 }}
                />
                {/* CENTER */}
                <div style={{ position: 'absolute', top: 22, left: 22, width: 26, height: 26, background: '#1A1A22', zIndex: 10 }} />
                {/* Center concave dot */}
                <div style={{ position: 'absolute', top: 28, left: 28, width: 14, height: 14, background: '#14141A', borderRadius: '50%', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)', zIndex: 30 }} />
              </div>
            </div>

            {/* A/B buttons */}
            <div style={{ position: 'relative', width: 110, height: 60 }}>
              {/* B Button */}
              <div style={{ position: 'absolute', left: 0, bottom: -10, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onPointerDown={pressB}>
                <div style={{ background: '#A6976A', padding: 3, borderRadius: '50%', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 2px rgba(255,255,255,0.4)' }}>
                  <div 
                    className={`gb-button ${activeButton === 'btn-b' ? 'gb-button-active' : ''}`}
                    style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #A82E49, #6B1C2D)', borderRadius: '50%', border: '2px solid #3A101A', boxShadow: '0 4px 6px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.1s' }} 
                  />
                </div>
                <span style={{ marginTop: 4, fontFamily: 'sans-serif', fontWeight: 800, color: '#4A3B2B', fontSize: 11 }}>B</span>
              </div>
              
              {/* A Button */}
              <div style={{ position: 'absolute', right: 0, top: -10, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onPointerDown={pressA}>
                <div style={{ background: '#A6976A', padding: 3, borderRadius: '50%', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 2px rgba(255,255,255,0.4)' }}>
                  <div 
                    className={`gb-button ${activeButton === 'btn-a' ? 'gb-button-active' : ''}`}
                    style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #A82E49, #6B1C2D)', borderRadius: '50%', border: '2px solid #3A101A', boxShadow: '0 4px 6px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.1s' }} 
                  />
                </div>
                <span style={{ marginTop: 4, fontFamily: 'sans-serif', fontWeight: 800, color: '#4A3B2B', fontSize: 11 }}>A</span>
              </div>
            </div>
          </div>

          {/* Lower controls: SELECT/START + speaker */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, padding: '0 10px' }}>
            {/* SELECT & START */}
            <div style={{ display: 'flex', gap: 16, transform: 'rotate(-15deg)', marginTop: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onPointerDown={pressSelect}>
                <div style={{ background: '#A6976A', padding: 2, borderRadius: 20, boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.3)' }}>
                  <div 
                    className={activeButton === 'btn-select' ? 'gb-button-active' : ''}
                    style={{ width: 44, height: 12, background: '#2E2F38', borderRadius: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.2)', cursor: 'pointer' }} 
                  />
                </div>
                <span style={{ marginTop: 6, fontSize: 8, fontFamily: 'sans-serif', fontWeight: 800, color: '#4A3B2B', letterSpacing: '0.1em' }}>SELECT</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onPointerDown={pressStart}>
                <div style={{ background: '#A6976A', padding: 2, borderRadius: 20, boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.3)' }}>
                  <div 
                    className={activeButton === 'btn-start' ? 'gb-button-active' : ''}
                    style={{ width: 44, height: 12, background: '#2E2F38', borderRadius: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.2)', cursor: 'pointer' }} 
                  />
                </div>
                <span style={{ marginTop: 6, fontSize: 8, fontFamily: 'sans-serif', fontWeight: 800, color: '#4A3B2B', letterSpacing: '0.1em' }}>START</span>
              </div>
            </div>

            {/* Speaker Grille */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, transform: 'rotate(-25deg)', marginRight: 10, marginTop: 15 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ width: 40, height: 4, background: '#121212', borderRadius: 2, boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.4)' }} />
              ))}
            </div>
          </div>

        </div>

        {/* WIDE BEVELED MATTE DOCK PEDESTAL (Bottom Stand) */}
        <div
          className="bg-[#D6C2A5] rounded-2xl border-3 border-[#C8B69A] relative z-0 flex flex-col items-center justify-between py-1 px-5"
          style={{
            width: 360,
            height: 36,
            marginTop: -8,
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
          {/* Top highlight cradle edge */}
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#FFF4E4]/80 to-transparent" />
          <div className="w-24 h-1 bg-[#A58F72]/60 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_1px_1px_rgba(255,255,255,0.4)]" />
          <div className="w-full flex justify-between px-6">
            <div className="w-3 h-0.5 bg-[#A58F72]/50 rounded-full" />
            <div className="w-3 h-0.5 bg-[#A58F72]/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* HELPER CONTROLS GUIDE & QUEST MODE TOGGLE */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 font-mono-tech text-xs text-[#4B6173] dark:text-[#94A3B8]">
        <button
          onPointerDown={pressStart}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EADBC3] dark:bg-[#151520] hover:bg-[#D7C3A6] text-[#092A4A] dark:text-[#6EB5F7] border border-[#C8B79D] dark:border-[#2B3040] transition-colors font-bold shadow-xs cursor-pointer"
        >
          <span>{mode === 'menu' ? '🕹️ Launch Quest Mode' : '📋 Return to RPG Menu'}</span>
        </button>
        <span className="text-[#8E795E] hidden sm:inline">•</span>
        <span className="text-[11px] text-[#5C4A38]">
          Controls: Arrow keys / D-pad to move, [A] / Enter to select, [B] / Esc for back
        </span>
      </div>
    </div>
  );
};
