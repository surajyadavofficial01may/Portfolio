import React, { useEffect, useState } from 'react';
import { NavSection } from '../types';

interface GameScreenProps {
  activeSection: NavSection;
  selectedMenuIndex: number;
  onSelectIndex: (index: number) => void;
  onConfirmMenu: () => void;
  mode: 'menu' | 'quest';
  characterX: number;
  characterY: number;
  facing: 'left' | 'right';
  isJumping: boolean;
  score: number;
  hearts: number;
  collectedGems: number[];
}

export const GameScreen: React.FC<GameScreenProps> = ({
  activeSection,
  selectedMenuIndex,
  onSelectIndex,
  onConfirmMenu,
  mode,
  characterX,
  characterY,
  facing,
  isJumping,
  score,
  hearts,
  collectedGems,
}) => {
  const [breathTick, setBreathTick] = useState(0);
  const [walkTick, setWalkTick] = useState(0);

  const menuItems = [
    { id: 'about', label: 'ABOUT' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'blog', label: 'BLOG' },
    { id: 'contact', label: 'CONTACT' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setBreathTick((prev) => (prev + 1) % 4);
      setWalkTick((prev) => (prev + 1) % 2);
    }, 280);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '270px',
        background: '#0A1F38',
        overflow: 'hidden',
        fontFamily: "'Press Start 2P', monospace",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      className="select-none"
    >
      {/* Sky gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0C223E, #153960, #1E4C7B)', pointerEvents: 'none' }} />

      {/* Stars */}
      {[[10, 4, false], [36, 8, false], [64, 5, false], [72, 10, true]].map(([l, t, right], i) => (
        <div key={i} style={{ position: 'absolute', top: `${t}px`, [right ? 'right' : 'left']: `${l}px`, width: 4, height: 4, background: 'rgba(255,255,255,0.6)', pointerEvents: 'none' }} />
      ))}

      {/* Mountains SVG */}
      <svg style={{ position: 'absolute', bottom: 32, left: 0, right: 0, width: '100%', height: 160, pointerEvents: 'none' }} viewBox="0 0 320 160" preserveAspectRatio="none" fill="none">
        <g opacity="0.4">
          <polygon points="10,160 55,45 110,160" fill="#1C3F65" />
          <polygon points="120,160 170,35 230,160" fill="#183759" />
          <polygon points="210,160 265,60 315,160" fill="#1C3F65" />
        </g>
        <g>
          <polygon points="25,160 65,28 65,160" fill="#DDE7F0" />
          <polygon points="45,70 65,28 65,160" fill="#FFFFFF" />
          <polygon points="65,28 120,160 65,160" fill="#142B47" />
          <polygon points="105,160 148,18 148,160" fill="#E2ECF5" />
          <polygon points="130,50 148,18 148,160" fill="#FFFFFF" />
          <polygon points="148,18 205,160 148,160" fill="#0F243E" />
          <polygon points="230,160 270,40 270,160" fill="#D6E2EE" />
          <polygon points="270,40 320,160 270,160" fill="#112742" />
        </g>
        <polygon points="0,160 0,115 6,112 12,116 18,111 24,115 30,110 36,114 42,109 48,115 54,111 60,116 66,110 72,115 78,112 84,117 90,111 96,116 102,110 108,115 114,112 120,117 126,110 132,116 138,111 144,117 150,110 156,116 162,112 168,118 174,111 180,117 186,110 192,116 198,112 204,117 210,110 216,116 222,111 228,117 234,112 240,118 246,111 252,116 258,110 264,117 270,112 276,118 282,111 288,116 294,110 300,117 306,112 312,118 320,113 320,160" fill="#0E2840" />
      </svg>

      {/* Status bar */}
      <div style={{ position: 'relative', zIndex: 30, padding: '10px 14px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, color: '#F4E9D5', letterSpacing: '0.1em' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 'bold' }}>LV 01</span>
          {mode === 'quest' && (
            <span style={{ color: '#6FAF75', background: 'rgba(6,27,48,0.85)', padding: '2px 4px', borderRadius: 2, border: '1px solid rgba(111,175,117,0.4)', fontSize: 8 }}>
              {score} PTS
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <svg key={i} viewBox="0 0 10 9" style={{ width: 14, height: 14, fill: i < hearts ? '#E53E3E' : '#4A5568', opacity: i < hearts ? 1 : 0.35 }}>
              <path d="M0,2 L0,4 L1,5 L2,6 L3,7 L4,8 L5,9 L6,8 L7,7 L8,6 L9,5 L10,4 L10,2 L9,1 L8,1 L7,1 L5,3 L3,1 L2,1 L1,1 Z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Main stage */}
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden', padding: '0 8px' }}>
        {/* Ground ledge */}
        <div style={{ position: 'absolute', left: 0, bottom: 20, width: '52%', pointerEvents: 'none', zIndex: 10 }}>
          <div style={{ width: '100%', height: 16, background: '#3CA552', borderTop: '2px solid #6EE087' }}>
            <div style={{ position: 'absolute', top: 8, left: 0, right: 0, height: 6, background: '#257336' }} />
          </div>
          <div style={{ width: '100%', height: 56, background: '#5C3C20', borderRight: '2px solid #382210' }}>
            <div style={{ position: 'absolute', top: 8, left: 0, right: 0, height: 16, background: '#4A3018' }} />
            <div style={{ position: 'absolute', top: 32, left: 0, right: 0, height: 20, background: '#382210' }} />
          </div>
        </div>

        {/* Character */}
        <div style={{
          position: 'absolute',
          left: `${characterX}px`,
          bottom: `${20 + characterY}px`,
          zIndex: 20,
          transform: `scaleX(${facing === 'left' ? -1 : 1})`,
          transition: 'transform 0.1s, left 0.1s linear, bottom 0.1s linear',
          pointerEvents: 'none',
        }}>
          <svg viewBox="0 0 24 32" style={{ width: 52, height: 68, imageRendering: 'pixelated', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.6))', transform: `translateY(${(!isJumping && breathTick % 2 === 1) ? -1 : 0}px)` }}>
            <rect x="3" y="11" width="5" height="11" fill="#B93E3A" rx="1" />
            <rect x="2" y="13" width="2" height="7" fill="#8C2C28" />
            <path d="M7,4 L16,4 L17,6 L18,9 L16,10 L15,8 L13,8 L12,10 L10,8 L8,9 L7,7 L6,8 L5,6 Z" fill="#0B1624" />
            <rect x="8" y="7" width="8" height="6.5" fill="#F8E5D0" rx="1" />
            <rect x="13" y="8.5" width="2" height="2.5" fill="#0A1828" />
            <rect x="6" y="14" width="9" height="9" fill="#173B63" rx="1" />
            <rect x="9" y="14" width="4" height="7.5" fill="#F2EDE4" />
            <rect x="5" y="15" width="2.5" height="6" fill="#173B63" />
            <rect x="13" y="15" width="2.5" height="6" fill="#173B63" />
            <rect x="8" y="22.5" width="3" height="5.5" fill="#152438" />
            <rect x="12" y="22.5" width="3" height="5.5" fill="#152438" />
            <rect x="7.5" y="27.5" width="3.5" height="2.5" fill="#5C4229" style={{ transform: walkTick === 1 ? 'translateY(-1px)' : 'none' }} />
            <rect x="12" y="27.5" width="3.5" height="2.5" fill="#5C4229" style={{ transform: walkTick === 0 ? 'translateY(-1px)' : 'none' }} />
          </svg>
          <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'rgba(6,27,48,0.9)', padding: '2px 4px', borderRadius: 3, border: '1px solid rgba(110,224,135,0.5)', fontSize: 6.5, color: '#6EE087', whiteSpace: 'nowrap', fontFamily: "'Press Start 2P', monospace" }}>
            SURAJ
          </div>
        </div>

        {/* Gems */}
        {mode === 'quest' && [2, 3].map((gemId) => {
          const isCollected = collectedGems.includes(gemId);
          if (isCollected) return null;
          return (
            <div
              key={gemId}
              style={{
                position: 'absolute',
                left: gemId === 2 ? 80 : 140,
                bottom: 24,
                width: 14,
                height: 14,
                background: '#5FD182',
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                animation: 'bounce 2s infinite',
                boxShadow: '0 0 10px rgba(95,209,130,0.8)',
              }}
            />
          );
        })}

        {/* RPG Menu */}
        {mode === 'menu' && (
          <div style={{ position: 'absolute', top: 28, right: 12, zIndex: 30, minWidth: 130, background: 'rgba(7,25,44,0.94)', border: '2px solid #48A060', borderRadius: 6, padding: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.6)' }}>
            <div style={{ border: '1px solid rgba(72,160,96,0.3)', borderRadius: 4, padding: 4 }}>
              {menuItems.map((item, idx) => {
                const isSel = selectedMenuIndex === idx;
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => onSelectIndex(idx)}
                    onClick={() => {
                      onSelectIndex(idx);
                      onConfirmMenu();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 8px',
                      borderRadius: 4,
                      cursor: 'pointer',
                      border: isSel ? '2px solid #5FD182' : '2px solid transparent',
                      background: isSel ? '#123955' : 'transparent',
                      color: isSel ? '#F8E5D0' : '#CAD9E8',
                      fontWeight: isSel ? 'bold' : 'normal',
                      fontSize: 9,
                      letterSpacing: '0.1em',
                      fontFamily: "'Press Start 2P', monospace",
                    }}
                  >
                    <span style={{ color: '#5FD182', opacity: isSel ? 1 : 0, fontSize: 8 }}>&gt;</span>
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom prompt */}
      <div style={{ position: 'relative', zIndex: 30, padding: '0 12px 8px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(5,21,37,0.8)', padding: '2px 10px', borderRadius: 4, border: '1px solid rgba(22,56,91,0.6)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 8.5, color: '#F4E9D5', fontFamily: "'Press Start 2P', monospace" }}>
          {mode === 'menu' ? 'Choose your path...' : 'Explore mode active...'}
          <span style={{ width: 6, height: 10, background: '#5FD182', display: 'inline-block', animation: 'blink 1s step-end infinite' }} />
        </div>
      </div>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      `}</style>
    </div>
  );
};
