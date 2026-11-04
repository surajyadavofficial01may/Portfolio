import React, { useEffect, useRef, useState, useCallback } from 'react';
import { soundManager } from '../utils/soundEffects';

export type ArcadeGameId =
  | 'snake'
  | 'tetris'
  | 'invaders'
  | 'breakout'
  | 'pacman'
  | 'racing';

export type ArcadeControlAction =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'a'
  | 'b'
  | 'start'
  | 'select';

export interface ArcadeGameMeta {
  id: ArcadeGameId;
  title: string;
  shortTitle: string;
  genre: string;
  color: string;
  controlsHint: string;
}

export const ARCADE_GAMES: ArcadeGameMeta[] = [
  {
    id: 'snake',
    title: 'SNAKE_OS',
    shortTitle: 'SNAKE',
    genre: 'ARCADE',
    color: '#5FD182',
    controlsHint: 'D-PAD: Turn · A: Boost',
  },
  {
    id: 'tetris',
    title: 'TETRA_BLK',
    shortTitle: 'TETRIS',
    genre: 'PUZZLE',
    color: '#38BDF8',
    controlsHint: 'L/R: Move · UP/A: Rotate · DN: Drop',
  },
  {
    id: 'invaders',
    title: 'SPACE_INV',
    shortTitle: 'INVADERS',
    genre: 'SHOOTER',
    color: '#F43F5E',
    controlsHint: 'L/R: Steer · A/UP: Fire Laser',
  },
  {
    id: 'breakout',
    title: 'BRICK_BRK',
    shortTitle: 'BREAKOUT',
    genre: 'ACTION',
    color: '#F59E0B',
    controlsHint: 'L/R: Paddle · A/UP: Launch Ball',
  },
  {
    id: 'pacman',
    title: 'PAC_MAZE',
    shortTitle: 'PAC-MAZE',
    genre: 'MAZE',
    color: '#FACC15',
    controlsHint: 'D-PAD: Navigate Maze & Eat Dots',
  },
  {
    id: 'racing',
    title: 'RETRO_GP',
    shortTitle: 'RACING',
    genre: 'RACING',
    color: '#A855F7',
    controlsHint: 'L/R: Lane · A/UP: Nitro Boost',
  },
];

function getHighScore(gameId: ArcadeGameId): number {
  try {
    const val = localStorage.getItem(`suraj_arcade_hi_${gameId}`);
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function saveHighScore(gameId: ArcadeGameId, score: number): number {
  const prev = getHighScore(gameId);
  const next = Math.max(prev, score);
  try {
    localStorage.setItem(`suraj_arcade_hi_${gameId}`, String(next));
  } catch {}
  return next;
}

interface ArcadeModuleProps {
  activeGame: ArcadeGameId | null;
  selectedGameIndex: number;
  onSelectGameIndex: (index: number) => void;
  onLaunchGame: (gameId: ArcadeGameId) => void;
  onExitToLauncher: () => void;
  onExitToPortfolioMenu: () => void;
  controlSignal: { action: ArcadeControlAction; seq: number } | null;
}

export const ArcadeModule: React.FC<ArcadeModuleProps> = ({
  activeGame,
  selectedGameIndex,
  onSelectGameIndex,
  onLaunchGame,
  onExitToLauncher,
  onExitToPortfolioMenu,
  controlSignal,
}) => {
  if (!activeGame) {
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, #071526 0%, #0D2542 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '8px 10px',
          fontFamily: "'Press Start 2P', monospace",
          color: '#F4E9D5',
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(95,209,130,0.35)',
            paddingBottom: 5,
          }}
        >
          <span style={{ fontSize: 8.5, color: '#5FD182', letterSpacing: '0.06em' }}>
            ARCADE 6-IN-1
          </span>
          <button
            type="button"
            onClick={() => {
              soundManager.playBack();
              onExitToPortfolioMenu();
            }}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(244,233,213,0.3)',
              borderRadius: 3,
              padding: '2px 5px',
              fontSize: 7,
              color: '#F4E9D5',
              fontFamily: "'Press Start 2P', monospace",
              cursor: 'pointer',
            }}
          >
            [B] MENU
          </button>
        </div>

        {/* 6 Cartridge Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 5,
            margin: '4px 0',
            flex: 1,
            alignContent: 'center',
          }}
        >
          {ARCADE_GAMES.map((g, idx) => {
            const isSelected = idx === selectedGameIndex;
            const hi = getHighScore(g.id);
            return (
              <button
                key={g.id}
                type="button"
                onMouseEnter={() => onSelectGameIndex(idx)}
                onClick={() => {
                  soundManager.playSelect();
                  onLaunchGame(g.id);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '6px 7px',
                  borderRadius: 4,
                  background: isSelected ? 'rgba(18, 57, 85, 0.95)' : 'rgba(6, 20, 36, 0.78)',
                  border: isSelected
                    ? `2px solid ${g.color}`
                    : '1px solid rgba(148, 163, 184, 0.25)',
                  boxShadow: isSelected ? `0 0 8px ${g.color}44` : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: "'Press Start 2P', monospace",
                  transition: 'transform 0.1s',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: 7.5,
                      color: isSelected ? '#FFFFFF' : '#CBD5E1',
                      fontWeight: 'bold',
                    }}
                  >
                    {g.shortTitle}
                  </span>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 1,
                      background: g.color,
                      display: 'inline-block',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 5,
                  }}
                >
                  <span style={{ fontSize: 6, color: '#94A3B8' }}>{g.genre}</span>
                  <span style={{ fontSize: 6, color: g.color }}>HI:{hi}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer instruction */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 6.5,
            color: '#94A3B8',
            borderTop: '1px solid rgba(148,163,184,0.2)',
            paddingTop: 4,
          }}
        >
          <span>D-PAD: MOVE</span>
          <span style={{ color: '#5FD182' }}>SELECT / [A]: PLAY</span>
        </div>
      </div>
    );
  }

  return (
    <ActiveArcadeCanvas
      gameId={activeGame}
      onExitToLauncher={onExitToLauncher}
      controlSignal={controlSignal}
    />
  );
};

interface ActiveArcadeCanvasProps {
  gameId: ArcadeGameId;
  onExitToLauncher: () => void;
  controlSignal: { action: ArcadeControlAction; seq: number } | null;
}

const CANVAS_W = 280;
const CANVAS_H = 190;

const ActiveArcadeCanvas: React.FC<ActiveArcadeCanvasProps> = ({
  gameId,
  onExitToLauncher,
  controlSignal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameMeta = ARCADE_GAMES.find((g) => g.id === gameId) || ARCADE_GAMES[0];

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => getHighScore(gameId));
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState<'PLAYING' | 'PAUSED' | 'GAME_OVER'>('PLAYING');
  const [restartToken, setRestartToken] = useState(0);

  // Refs for mutable game state inside requestAnimationFrame
  const statusRef = useRef<'PLAYING' | 'PAUSED' | 'GAME_OVER'>('PLAYING');
  statusRef.current = status;

  const updateScore = useCallback(
    (deltaOrNew: number, isAbsolute = false) => {
      setScore((prev) => {
        const next = isAbsolute ? deltaOrNew : prev + deltaOrNew;
        const hi = saveHighScore(gameId, next);
        setHighScore(hi);
        return next;
      });
    },
    [gameId]
  );

  const triggerGameOver = useCallback(() => {
    soundManager.playGameOver();
    statusRef.current = 'GAME_OVER';
    setStatus('GAME_OVER');
  }, []);

  const handleRestart = useCallback(() => {
    soundManager.playSelect();
    setScore(0);
    setLives(gameId === 'snake' || gameId === 'tetris' ? 1 : 3);
    statusRef.current = 'PLAYING';
    setStatus('PLAYING');
    setRestartToken((t) => t + 1);
  }, [gameId]);

  // Action dispatcher ref populated by the active game loop
  const actionHandlerRef = useRef<(action: ArcadeControlAction) => void>(() => {});

  // Forward console button signals to active game
  useEffect(() => {
    if (!controlSignal) return;
    const { action } = controlSignal;

    if (action === 'b') {
      soundManager.playBack();
      onExitToLauncher();
      return;
    }

    if (action === 'start') {
      if (statusRef.current === 'GAME_OVER') {
        handleRestart();
      } else {
        const next = statusRef.current === 'PAUSED' ? 'PLAYING' : 'PAUSED';
        statusRef.current = next;
        setStatus(next);
        soundManager.playSelect();
      }
      return;
    }

    if (statusRef.current === 'GAME_OVER') {
      if (action === 'a') {
        handleRestart();
      }
      return;
    }

    if (statusRef.current === 'PAUSED') {
      if (action === 'a') {
        statusRef.current = 'PLAYING';
        setStatus('PLAYING');
      }
      return;
    }

    actionHandlerRef.current(action);
  }, [controlSignal, handleRestart, onExitToLauncher]);

  // Keyboard listener for smooth gameplay (WASD / Arrows / Space / Enter)
  const keysHeldRef = useRef<{ [key: string]: boolean }>({});
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      const k = e.key.toLowerCase();
      keysHeldRef.current[k] = true;

      if (k === ' ' || k === 'enter' || k === 'z') {
        e.preventDefault();
        if (statusRef.current === 'GAME_OVER') {
          handleRestart();
        } else {
          actionHandlerRef.current('a');
        }
      } else if (k === 'escape' || k === 'backspace') {
        e.preventDefault();
        onExitToLauncher();
      } else if (k === 'p') {
        e.preventDefault();
        const next = statusRef.current === 'PAUSED' ? 'PLAYING' : 'PAUSED';
        statusRef.current = next;
        setStatus(next);
      } else if (k === 'w') {
        actionHandlerRef.current('up');
      } else if (k === 's') {
        actionHandlerRef.current('down');
      } else if (k === 'd') {
        actionHandlerRef.current('right');
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysHeldRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [handleRestart, onExitToLauncher]);

  // Initialize game loop based on gameId
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setScore(0);
    setHighScore(getHighScore(gameId));
    setLives(gameId === 'snake' || gameId === 'tetris' ? 1 : 3);
    statusRef.current = 'PLAYING';
    setStatus('PLAYING');

    let rafId = 0;
    let lastTime = performance.now();

    // =========================================================================
    // 1. SNAKE GAME
    // =========================================================================
    if (gameId === 'snake') {
      const COLS = 20;
      const ROWS = 13;
      const CELL = 14;
      let snake = [
        { x: 10, y: 6 },
        { x: 9, y: 6 },
        { x: 8, y: 6 },
      ];
      let dir = { x: 1, y: 0 };
      let nextDir = { x: 1, y: 0 };
      let food = { x: 15, y: 6, bonus: false };
      let stepTimer = 0;
      let stepInterval = 135;

      const spawnFood = () => {
        while (true) {
          const fx = Math.floor(Math.random() * COLS);
          const fy = Math.floor(Math.random() * ROWS);
          if (!snake.some((s) => s.x === fx && s.y === fy)) {
            food = { x: fx, y: fy, bonus: Math.random() < 0.2 };
            break;
          }
        }
      };

      actionHandlerRef.current = (act) => {
        if (act === 'up' && dir.y === 0) nextDir = { x: 0, y: -1 };
        else if (act === 'down' && dir.y === 0) nextDir = { x: 0, y: 1 };
        else if (act === 'left' && dir.x === 0) nextDir = { x: -1, y: 0 };
        else if (act === 'right' && dir.x === 0) nextDir = { x: 1, y: 0 };
        else if (act === 'a') stepTimer += stepInterval * 0.6;
      };

      const loop = (now: number) => {
        const dt = now - lastTime;
        lastTime = now;

        if (statusRef.current === 'PLAYING') {
          stepTimer += dt;
          if (stepTimer >= stepInterval) {
            stepTimer = 0;
            dir = nextDir;
            const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

            // Wall or self collision
            if (
              head.x < 0 ||
              head.x >= COLS ||
              head.y < 0 ||
              head.y >= ROWS ||
              snake.some((s) => s.x === head.x && s.y === head.y)
            ) {
              triggerGameOver();
            } else {
              snake.unshift(head);
              if (head.x === food.x && head.y === food.y) {
                soundManager.playCoin();
                updateScore(food.bonus ? 25 : 10);
                stepInterval = Math.max(65, stepInterval - 2);
                spawnFood();
              } else {
                snake.pop();
              }
            }
          }
        }

        // Render Snake
        ctx.fillStyle = '#071628';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Subtle grid
        ctx.strokeStyle = 'rgba(30, 58, 95, 0.35)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= COLS; x++) {
          ctx.beginPath();
          ctx.moveTo(x * CELL, 0);
          ctx.lineTo(x * CELL, ROWS * CELL);
          ctx.stroke();
        }
        for (let y = 0; y <= ROWS; y++) {
          ctx.beginPath();
          ctx.moveTo(0, y * CELL);
          ctx.lineTo(COLS * CELL, y * CELL);
          ctx.stroke();
        }

        // Draw Food
        ctx.fillStyle = food.bonus ? '#FACC15' : '#F43F5E';
        ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(food.x * CELL + 4, food.y * CELL + 4, 2, 2);

        // Draw Snake
        snake.forEach((seg, i) => {
          ctx.fillStyle = i === 0 ? '#6EE087' : i % 2 === 0 ? '#48A060' : '#3B8750';
          ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
          if (i === 0) {
            ctx.fillStyle = '#071628';
            ctx.fillRect(seg.x * CELL + 4, seg.y * CELL + 4, 2, 2);
            ctx.fillRect(seg.x * CELL + 8, seg.y * CELL + 4, 2, 2);
          }
        });

        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    }

    // =========================================================================
    // 2. TETRIS GAME
    // =========================================================================
    if (gameId === 'tetris') {
      const COLS = 10;
      const ROWS = 14;
      const CELL = 13;
      const OFFSET_X = 75;
      const OFFSET_Y = 4;

      const SHAPES: { m: number[][]; c: string }[] = [
        { m: [[1, 1, 1, 1]], c: '#38BDF8' }, // I
        {
          m: [
            [1, 1],
            [1, 1],
          ],
          c: '#FACC15',
        }, // O
        {
          m: [
            [0, 1, 0],
            [1, 1, 1],
          ],
          c: '#A855F7',
        }, // T
        {
          m: [
            [0, 1, 1],
            [1, 1, 0],
          ],
          c: '#4ADE80',
        }, // S
        {
          m: [
            [1, 1, 0],
            [0, 1, 1],
          ],
          c: '#F43F5E',
        }, // Z
        {
          m: [
            [1, 0, 0],
            [1, 1, 1],
          ],
          c: '#60A5FA',
        }, // J
        {
          m: [
            [0, 0, 1],
            [1, 1, 1],
          ],
          c: '#FB923C',
        }, // L
      ];

      const board: (string | null)[][] = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(null)
      );

      let linesCleared = 0;
      let nextIdx = Math.floor(Math.random() * SHAPES.length);
      let cur = {
        m: SHAPES[0].m,
        c: SHAPES[0].c,
        x: 3,
        y: 0,
      };

      const collides = (m: number[][], px: number, py: number) => {
        for (let r = 0; r < m.length; r++) {
          for (let c = 0; c < m[r].length; c++) {
            if (!m[r][c]) continue;
            const nx = px + c;
            const ny = py + r;
            if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
            if (ny >= 0 && board[ny][nx]) return true;
          }
        }
        return false;
      };

      const spawnPiece = () => {
        const template = SHAPES[nextIdx];
        nextIdx = Math.floor(Math.random() * SHAPES.length);
        cur = {
          m: template.m.map((row) => [...row]),
          c: template.c,
          x: Math.floor((COLS - template.m[0].length) / 2),
          y: 0,
        };
        if (collides(cur.m, cur.x, cur.y)) {
          triggerGameOver();
        }
      };
      spawnPiece();

      const rotateMatrix = (m: number[][]) =>
        m[0].map((_, index) => m.map((row) => row[index]).reverse());

      const lockPiece = () => {
        for (let r = 0; r < cur.m.length; r++) {
          for (let c = 0; c < cur.m[r].length; c++) {
            if (cur.m[r][c]) {
              const by = cur.y + r;
              const bx = cur.x + c;
              if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
                board[by][bx] = cur.c;
              }
            }
          }
        }
        soundManager.playBounce();

        // Check full lines
        let cleared = 0;
        for (let r = ROWS - 1; r >= 0; r--) {
          if (board[r].every((cell) => cell !== null)) {
            board.splice(r, 1);
            board.unshift(Array(COLS).fill(null));
            cleared++;
            r++;
          }
        }
        if (cleared > 0) {
          linesCleared += cleared;
          const pts = [0, 100, 300, 500, 800][cleared] || 200;
          updateScore(pts);
          soundManager.playCoin();
        } else {
          updateScore(10);
        }
        spawnPiece();
      };

      let dropTimer = 0;

      actionHandlerRef.current = (act) => {
        if (act === 'left') {
          if (!collides(cur.m, cur.x - 1, cur.y)) cur.x--;
        } else if (act === 'right') {
          if (!collides(cur.m, cur.x + 1, cur.y)) cur.x++;
        } else if (act === 'down') {
          if (!collides(cur.m, cur.x, cur.y + 1)) {
            cur.y++;
            dropTimer = 0;
          } else {
            lockPiece();
          }
        } else if (act === 'up' || act === 'a') {
          const rot = rotateMatrix(cur.m);
          if (!collides(rot, cur.x, cur.y)) {
            cur.m = rot;
            soundManager.playNavigate();
          } else if (!collides(rot, cur.x - 1, cur.y)) {
            cur.x--;
            cur.m = rot;
            soundManager.playNavigate();
          } else if (!collides(rot, cur.x + 1, cur.y)) {
            cur.x++;
            cur.m = rot;
            soundManager.playNavigate();
          }
        }
      };

      const loop = (now: number) => {
        const dt = now - lastTime;
        lastTime = now;

        const dropInterval = Math.max(180, 520 - Math.floor(linesCleared / 5) * 45);

        if (statusRef.current === 'PLAYING') {
          dropTimer += dt;
          if (dropTimer >= dropInterval) {
            dropTimer = 0;
            if (!collides(cur.m, cur.x, cur.y + 1)) {
              cur.y++;
            } else {
              lockPiece();
            }
          }
        }

        // Render Tetris
        ctx.fillStyle = '#061322';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Well background
        ctx.fillStyle = '#0B1E36';
        ctx.fillRect(OFFSET_X, OFFSET_Y, COLS * CELL, ROWS * CELL);
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(OFFSET_X - 1, OFFSET_Y - 1, COLS * CELL + 2, ROWS * CELL + 2);

        // Grid lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
        ctx.lineWidth = 1;
        for (let c = 1; c < COLS; c++) {
          ctx.beginPath();
          ctx.moveTo(OFFSET_X + c * CELL, OFFSET_Y);
          ctx.lineTo(OFFSET_X + c * CELL, OFFSET_Y + ROWS * CELL);
          ctx.stroke();
        }
        for (let r = 1; r < ROWS; r++) {
          ctx.beginPath();
          ctx.moveTo(OFFSET_X, OFFSET_Y + r * CELL);
          ctx.lineTo(OFFSET_X + COLS * CELL, OFFSET_Y + r * CELL);
          ctx.stroke();
        }

        // Locked cells
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const color = board[r][c];
            if (color) {
              ctx.fillStyle = color;
              ctx.fillRect(OFFSET_X + c * CELL + 1, OFFSET_Y + r * CELL + 1, CELL - 2, CELL - 2);
            }
          }
        }

        // Ghost Y
        let ghostY = cur.y;
        while (!collides(cur.m, cur.x, ghostY + 1)) {
          ghostY++;
        }

        // Draw Ghost & Current Piece
        for (let r = 0; r < cur.m.length; r++) {
          for (let c = 0; c < cur.m[r].length; c++) {
            if (cur.m[r][c]) {
              // Ghost
              ctx.strokeStyle = 'rgba(255,255,255,0.22)';
              ctx.strokeRect(
                OFFSET_X + (cur.x + c) * CELL + 1,
                OFFSET_Y + (ghostY + r) * CELL + 1,
                CELL - 2,
                CELL - 2
              );
              // Active block
              ctx.fillStyle = cur.c;
              ctx.fillRect(
                OFFSET_X + (cur.x + c) * CELL + 1,
                OFFSET_Y + (cur.y + r) * CELL + 1,
                CELL - 2,
                CELL - 2
              );
            }
          }
        }

        // Left side stats
        ctx.fillStyle = '#94A3B8';
        ctx.font = "7px 'Press Start 2P', monospace";
        ctx.fillText('LINES', 8, 28);
        ctx.fillStyle = '#38BDF8';
        ctx.fillText(String(linesCleared), 8, 42);

        ctx.fillStyle = '#94A3B8';
        ctx.fillText('LEVEL', 8, 70);
        ctx.fillStyle = '#5FD182';
        ctx.fillText(String(Math.floor(linesCleared / 5) + 1), 8, 84);

        // Right side NEXT preview
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('NEXT', 214, 28);
        ctx.strokeStyle = 'rgba(148,163,184,0.3)';
        ctx.strokeRect(212, 34, 56, 44);
        const nextShape = SHAPES[nextIdx];
        for (let r = 0; r < nextShape.m.length; r++) {
          for (let c = 0; c < nextShape.m[r].length; c++) {
            if (nextShape.m[r][c]) {
              ctx.fillStyle = nextShape.c;
              ctx.fillRect(220 + c * 10, 44 + r * 10, 9, 9);
            }
          }
        }

        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    }

    // =========================================================================
    // 3. SPACE INVADERS
    // =========================================================================
    if (gameId === 'invaders') {
      let playerX = CANVAS_W / 2 - 12;
      const PLAYER_W = 22;
      const PLAYER_Y = CANVAS_H - 18;
      let bullets: { x: number; y: number }[] = [];
      let enemyBullets: { x: number; y: number }[] = [];
      let alienDir = 1;
      let alienSpeed = 18;
      let shootCooldown = 0;
      let playerLives = 3;

      interface Alien {
        x: number;
        y: number;
        row: number;
        alive: boolean;
      }
      let aliens: Alien[] = [];

      const initWave = (speedBoost = 0) => {
        aliens = [];
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 7; c++) {
            aliens.push({
              x: 26 + c * 32,
              y: 18 + r * 20,
              row: r,
              alive: true,
            });
          }
        }
        alienSpeed = 20 + speedBoost;
      };
      initWave();

      // 3 Bunkers
      const bunkers = [
        { x: 45, y: CANVAS_H - 42, hp: 8 },
        { x: 124, y: CANVAS_H - 42, hp: 8 },
        { x: 203, y: CANVAS_H - 42, hp: 8 },
      ];

      const fireBullet = () => {
        if (shootCooldown <= 0 && bullets.length < 3) {
          bullets.push({ x: playerX + PLAYER_W / 2, y: PLAYER_Y - 4 });
          shootCooldown = 220;
          soundManager.playLaser();
        }
      };

      actionHandlerRef.current = (act) => {
        if (act === 'left') playerX = Math.max(8, playerX - 14);
        else if (act === 'right') playerX = Math.min(CANVAS_W - PLAYER_W - 8, playerX + 14);
        else if (act === 'a' || act === 'up') fireBullet();
      };

      const loop = (now: number) => {
        const dt = Math.min(50, now - lastTime);
        lastTime = now;

        if (statusRef.current === 'PLAYING') {
          shootCooldown = Math.max(0, shootCooldown - dt);

          if (keysHeldRef.current['arrowleft'] || keysHeldRef.current['a']) {
            playerX = Math.max(8, playerX - 0.14 * dt);
          }
          if (keysHeldRef.current['arrowright'] || keysHeldRef.current['d']) {
            playerX = Math.min(CANVAS_W - PLAYER_W - 8, playerX + 0.14 * dt);
          }

          // Move aliens
          let hitEdge = false;
          const aliveAliens = aliens.filter((a) => a.alive);
          if (aliveAliens.length === 0) {
            soundManager.playSuccess();
            updateScore(250);
            initWave(10);
          } else {
            const step = ((alienSpeed + (28 - aliveAliens.length) * 1.2) * dt) / 1000;
            for (const a of aliveAliens) {
              a.x += step * alienDir;
              if (a.x > CANVAS_W - 24 && alienDir > 0) hitEdge = true;
              if (a.x < 10 && alienDir < 0) hitEdge = true;
            }
            if (hitEdge) {
              alienDir *= -1;
              for (const a of aliveAliens) {
                a.y += 8;
                if (a.y >= PLAYER_Y - 12) {
                  triggerGameOver();
                }
              }
            }

            // Enemy fire
            if (Math.random() < 0.018 && enemyBullets.length < 3) {
              const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
              enemyBullets.push({ x: shooter.x + 8, y: shooter.y + 12 });
            }
          }

          // Update player bullets
          bullets.forEach((b) => {
            b.y -= 0.24 * dt;
            // Check alien hit
            for (const a of aliens) {
              if (
                a.alive &&
                b.x >= a.x &&
                b.x <= a.x + 18 &&
                b.y >= a.y &&
                b.y <= a.y + 13
              ) {
                a.alive = false;
                b.y = -99;
                soundManager.playCoin();
                updateScore((4 - a.row) * 15);
                break;
              }
            }
          });
          bullets = bullets.filter((b) => b.y > 0);

          // Update enemy bullets
          enemyBullets.forEach((eb) => {
            eb.y += 0.12 * dt;
            // Check bunker hit
            for (const bk of bunkers) {
              if (
                bk.hp > 0 &&
                eb.x >= bk.x &&
                eb.x <= bk.x + 28 &&
                eb.y >= bk.y &&
                eb.y <= bk.y + 12
              ) {
                bk.hp--;
                eb.y = 999;
                soundManager.playBounce();
              }
            }
            // Check player hit
            if (
              eb.x >= playerX &&
              eb.x <= playerX + PLAYER_W &&
              eb.y >= PLAYER_Y &&
              eb.y <= PLAYER_Y + 12
            ) {
              eb.y = 999;
              playerLives--;
              setLives(playerLives);
              soundManager.playBack();
              if (playerLives <= 0) {
                triggerGameOver();
              }
            }
          });
          enemyBullets = enemyBullets.filter((eb) => eb.y < CANVAS_H);
        }

        // Render Space Invaders
        ctx.fillStyle = '#050D1A';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Bunkers
        bunkers.forEach((bk) => {
          if (bk.hp > 0) {
            ctx.fillStyle = bk.hp > 4 ? '#4ADE80' : '#FACC15';
            ctx.fillRect(bk.x, bk.y, 28, 10);
            ctx.fillStyle = '#050D1A';
            ctx.fillRect(bk.x + 8, bk.y + 6, 12, 5);
          }
        });

        // Aliens
        const rowColors = ['#F43F5E', '#FB923C', '#FACC15', '#38BDF8'];
        aliens.forEach((a) => {
          if (!a.alive) return;
          ctx.fillStyle = rowColors[a.row % rowColors.length];
          ctx.fillRect(a.x + 2, a.y, 14, 10);
          ctx.fillRect(a.x, a.y + 3, 18, 5);
          ctx.fillStyle = '#050D1A';
          ctx.fillRect(a.x + 4, a.y + 3, 2, 2);
          ctx.fillRect(a.x + 12, a.y + 3, 2, 2);
        });

        // Player Ship
        ctx.fillStyle = '#5FD182';
        ctx.fillRect(playerX, PLAYER_Y + 4, PLAYER_W, 8);
        ctx.fillRect(playerX + 6, PLAYER_Y + 1, PLAYER_W - 12, 4);
        ctx.fillRect(playerX + 9, PLAYER_Y - 2, 4, 3);

        // Bullets
        ctx.fillStyle = '#FACC15';
        bullets.forEach((b) => ctx.fillRect(b.x - 1, b.y, 3, 7));

        ctx.fillStyle = '#F43F5E';
        enemyBullets.forEach((eb) => ctx.fillRect(eb.x - 1, eb.y, 3, 7));

        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    }

    // =========================================================================
    // 4. BRICK BREAKER (BREAKOUT)
    // =========================================================================
    if (gameId === 'breakout') {
      let paddleX = CANVAS_W / 2 - 26;
      const PADDLE_W = 52;
      const PADDLE_Y = CANVAS_H - 16;
      let ball = { x: CANVAS_W / 2, y: PADDLE_Y - 6, vx: 0, vy: 0, launched: false };
      let playerLives = 3;

      interface Brick {
        x: number;
        y: number;
        w: number;
        h: number;
        color: string;
        pts: number;
        alive: boolean;
      }

      const bricks: Brick[] = [];
      const rowColors = ['#F43F5E', '#FB923C', '#FACC15', '#4ADE80', '#38BDF8'];
      const initBricks = () => {
        bricks.length = 0;
        const cols = 8;
        const bw = 31;
        const bh = 10;
        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < cols; c++) {
            bricks.push({
              x: 8 + c * (bw + 2.5),
              y: 16 + r * (bh + 3),
              w: bw,
              h: bh,
              color: rowColors[r],
              pts: (5 - r) * 10,
              alive: true,
            });
          }
        }
      };
      initBricks();

      const launchBall = () => {
        if (!ball.launched) {
          ball.launched = true;
          ball.vx = (Math.random() > 0.5 ? 1 : -1) * 0.11;
          ball.vy = -0.145;
          soundManager.playJump();
        }
      };

      actionHandlerRef.current = (act) => {
        if (act === 'left') paddleX = Math.max(6, paddleX - 20);
        else if (act === 'right') paddleX = Math.min(CANVAS_W - PADDLE_W - 6, paddleX + 20);
        else if (act === 'a' || act === 'up') launchBall();
      };

      const loop = (now: number) => {
        const dt = Math.min(40, now - lastTime);
        lastTime = now;

        if (statusRef.current === 'PLAYING') {
          if (keysHeldRef.current['arrowleft'] || keysHeldRef.current['a']) {
            paddleX = Math.max(6, paddleX - 0.2 * dt);
          }
          if (keysHeldRef.current['arrowright'] || keysHeldRef.current['d']) {
            paddleX = Math.min(CANVAS_W - PADDLE_W - 6, paddleX + 0.2 * dt);
          }

          if (!ball.launched) {
            ball.x = paddleX + PADDLE_W / 2;
            ball.y = PADDLE_Y - 5;
          } else {
            ball.x += ball.vx * dt;
            ball.y += ball.vy * dt;

            // Walls
            if (ball.x < 5) {
              ball.x = 5;
              ball.vx = Math.abs(ball.vx);
              soundManager.playBounce();
            } else if (ball.x > CANVAS_W - 5) {
              ball.x = CANVAS_W - 5;
              ball.vx = -Math.abs(ball.vx);
              soundManager.playBounce();
            }
            if (ball.y < 6) {
              ball.y = 6;
              ball.vy = Math.abs(ball.vy);
              soundManager.playBounce();
            }

            // Paddle bounce
            if (
              ball.vy > 0 &&
              ball.y >= PADDLE_Y - 4 &&
              ball.y <= PADDLE_Y + 8 &&
              ball.x >= paddleX - 4 &&
              ball.x <= paddleX + PADDLE_W + 4
            ) {
              const hitOffset = (ball.x - (paddleX + PADDLE_W / 2)) / (PADDLE_W / 2);
              ball.vx = hitOffset * 0.16;
              ball.vy = -Math.max(0.13, Math.abs(ball.vy));
              soundManager.playBounce();
            }

            // Brick collision
            for (const b of bricks) {
              if (
                b.alive &&
                ball.x >= b.x - 3 &&
                ball.x <= b.x + b.w + 3 &&
                ball.y >= b.y - 3 &&
                ball.y <= b.y + b.h + 3
              ) {
                b.alive = false;
                ball.vy *= -1;
                soundManager.playCoin();
                updateScore(b.pts);
                break;
              }
            }

            if (bricks.every((b) => !b.alive)) {
              soundManager.playSuccess();
              updateScore(200);
              initBricks();
              ball.launched = false;
            }

            // Bottom miss
            if (ball.y > CANVAS_H + 6) {
              playerLives--;
              setLives(playerLives);
              soundManager.playBack();
              if (playerLives <= 0) {
                triggerGameOver();
              } else {
                ball.launched = false;
              }
            }
          }
        }

        // Render Breakout
        ctx.fillStyle = '#071426';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        bricks.forEach((b) => {
          if (!b.alive) return;
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.fillStyle = 'rgba(255,255,255,0.28)';
          ctx.fillRect(b.x, b.y, b.w, 2);
        });

        // Paddle
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(paddleX, PADDLE_Y, PADDLE_W, 8);
        ctx.fillStyle = '#E0F2FE';
        ctx.fillRect(paddleX + 4, PADDLE_Y + 1, PADDLE_W - 8, 2);

        // Ball
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 4, 0, Math.PI * 2);
        ctx.fill();

        if (!ball.launched && statusRef.current === 'PLAYING') {
          ctx.fillStyle = '#FACC15';
          ctx.font = "7px 'Press Start 2P', monospace";
          ctx.fillText('PRESS [A] TO LAUNCH', 72, 125);
        }

        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    }

    // =========================================================================
    // 5. PAC-MAZE GAME
    // =========================================================================
    if (gameId === 'pacman') {
      const COLS = 19;
      const ROWS = 13;
      const TILE = 14;
      const OX = 7;
      const OY = 4;

      // 1 = wall, 0 = dot, 2 = power pellet, 3 = empty
      const rawMap = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 1],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 1, 1, 3, 3, 3, 3, 3, 1, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        [1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ];

      let grid = rawMap.map((r) => [...r]);
      let pac = { x: 9, y: 9, dx: 0, dy: 0, nextDx: 0, nextDy: 0 };
      let powerTimer = 0;
      let playerLives = 3;

      const ghosts = [
        { x: 8, y: 6, dx: 1, dy: 0, color: '#F43F5E' },
        { x: 9, y: 6, dx: 0, dy: -1, color: '#38BDF8' },
        { x: 10, y: 6, dx: -1, dy: 0, color: '#F472B6' },
      ];

      actionHandlerRef.current = (act) => {
        if (act === 'up') {
          pac.nextDx = 0;
          pac.nextDy = -1;
        } else if (act === 'down') {
          pac.nextDx = 0;
          pac.nextDy = 1;
        } else if (act === 'left') {
          pac.nextDx = -1;
          pac.nextDy = 0;
        } else if (act === 'right') {
          pac.nextDx = 1;
          pac.nextDy = 0;
        }
      };

      let stepTimer = 0;
      const STEP_MS = 165;

      const canMove = (tx: number, ty: number) =>
        ty >= 0 && ty < ROWS && tx >= 0 && tx < COLS && grid[ty][tx] !== 1;

      const loop = (now: number) => {
        const dt = now - lastTime;
        lastTime = now;

        if (statusRef.current === 'PLAYING') {
          powerTimer = Math.max(0, powerTimer - dt);
          stepTimer += dt;

          if (stepTimer >= STEP_MS) {
            stepTimer = 0;

            if (
              (pac.nextDx !== 0 || pac.nextDy !== 0) &&
              canMove(pac.x + pac.nextDx, pac.y + pac.nextDy)
            ) {
              pac.dx = pac.nextDx;
              pac.dy = pac.nextDy;
            }
            if (canMove(pac.x + pac.dx, pac.y + pac.dy)) {
              pac.x += pac.dx;
              pac.y += pac.dy;
            }

            // Eat dot / power pellet
            const cell = grid[pac.y][pac.x];
            if (cell === 0) {
              grid[pac.y][pac.x] = 3;
              updateScore(10);
              soundManager.playNavigate();
            } else if (cell === 2) {
              grid[pac.y][pac.x] = 3;
              powerTimer = 6000;
              updateScore(50);
              soundManager.playCoin();
            }

            // Check win
            if (!grid.some((r) => r.some((c) => c === 0 || c === 2))) {
              soundManager.playSuccess();
              updateScore(300);
              grid = rawMap.map((r) => [...r]);
              pac = { x: 9, y: 9, dx: 0, dy: 0, nextDx: 0, nextDy: 0 };
            }

            // Move ghosts
            ghosts.forEach((g) => {
              const dirs = [
                { dx: 1, dy: 0 },
                { dx: -1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: 0, dy: -1 },
              ].filter(
                (d) =>
                  canMove(g.x + d.dx, g.y + d.dy) &&
                  !(d.dx === -g.dx && d.dy === -g.dy)
              );
              const pick =
                dirs[Math.floor(Math.random() * dirs.length)] || {
                  dx: -g.dx,
                  dy: -g.dy,
                };
              if (canMove(g.x + pick.dx, g.y + pick.dy)) {
                g.dx = pick.dx;
                g.dy = pick.dy;
                g.x += g.dx;
                g.y += g.dy;
              }

              // Collision with Pac
              if (g.x === pac.x && g.y === pac.y) {
                if (powerTimer > 0) {
                  g.x = 9;
                  g.y = 6;
                  updateScore(200);
                  soundManager.playCoin();
                } else {
                  playerLives--;
                  setLives(playerLives);
                  soundManager.playBack();
                  if (playerLives <= 0) {
                    triggerGameOver();
                  } else {
                    pac.x = 9;
                    pac.y = 9;
                    pac.dx = 0;
                    pac.dy = 0;
                  }
                }
              }
            });
          }
        }

        // Render Pac-Maze
        ctx.fillStyle = '#050C18';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const val = grid[r][c];
            const px = OX + c * TILE;
            const py = OY + r * TILE;
            if (val === 1) {
              ctx.fillStyle = '#1E3A8A';
              ctx.fillRect(px + 1, py + 1, TILE - 2, TILE - 2);
            } else if (val === 0) {
              ctx.fillStyle = '#FDE68A';
              ctx.fillRect(px + 6, py + 6, 2, 2);
            } else if (val === 2) {
              ctx.fillStyle = '#FACC15';
              ctx.beginPath();
              ctx.arc(px + TILE / 2, py + TILE / 2, 4, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Draw Pac
        ctx.fillStyle = '#FACC15';
        ctx.beginPath();
        ctx.arc(
          OX + pac.x * TILE + TILE / 2,
          OY + pac.y * TILE + TILE / 2,
          5.5,
          0.2 * Math.PI,
          1.8 * Math.PI
        );
        ctx.lineTo(OX + pac.x * TILE + TILE / 2, OY + pac.y * TILE + TILE / 2);
        ctx.fill();

        // Draw Ghosts
        ghosts.forEach((g) => {
          const gx = OX + g.x * TILE + 2;
          const gy = OY + g.y * TILE + 2;
          ctx.fillStyle = powerTimer > 0 ? '#3B82F6' : g.color;
          ctx.fillRect(gx, gy + 3, TILE - 4, TILE - 6);
          ctx.beginPath();
          ctx.arc(gx + (TILE - 4) / 2, gy + 4, (TILE - 4) / 2, Math.PI, 0);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(gx + 2, gy + 3, 2, 2);
          ctx.fillRect(gx + 6, gy + 3, 2, 2);
        });

        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    }

    // =========================================================================
    // 6. RETRO RACING (RETRO GP)
    // =========================================================================
    if (gameId === 'racing') {
      const LANES = [82, 130, 178];
      let playerLane = 1;
      const PLAYER_Y = CANVAS_H - 36;
      let roadScroll = 0;
      let nitroTimer = 0;
      let playerLives = 3;
      let scoreAccum = 0;

      interface TrafficCar {
        lane: number;
        y: number;
        color: string;
        isFuel?: boolean;
      }
      let traffic: TrafficCar[] = [];
      let spawnTimer = 0;

      actionHandlerRef.current = (act) => {
        if (act === 'left') {
          playerLane = Math.max(0, playerLane - 1);
          soundManager.playNavigate();
        } else if (act === 'right') {
          playerLane = Math.min(2, playerLane + 1);
          soundManager.playNavigate();
        } else if (act === 'a' || act === 'up') {
          nitroTimer = 1400;
          soundManager.playJump();
        }
      };

      const loop = (now: number) => {
        const dt = Math.min(45, now - lastTime);
        lastTime = now;

        const isNitro = nitroTimer > 0;
        const speed = isNitro ? 0.24 : 0.145;

        if (statusRef.current === 'PLAYING') {
          nitroTimer = Math.max(0, nitroTimer - dt);
          roadScroll = (roadScroll + speed * dt) % 28;
          scoreAccum += dt * (isNitro ? 0.05 : 0.025);
          if (scoreAccum >= 5) {
            const add = Math.floor(scoreAccum);
            scoreAccum -= add;
            updateScore(add);
          }

          spawnTimer += dt;
          if (spawnTimer >= (isNitro ? 480 : 720)) {
            spawnTimer = 0;
            const lane = Math.floor(Math.random() * 3);
            const isFuel = Math.random() < 0.22;
            const colors = ['#38BDF8', '#FACC15', '#FB923C', '#A855F7'];
            traffic.push({
              lane,
              y: -30,
              color: isFuel ? '#4ADE80' : colors[Math.floor(Math.random() * colors.length)],
              isFuel,
            });
          }

          traffic.forEach((t) => {
            t.y += speed * 0.78 * dt;
            if (
              t.lane === playerLane &&
              t.y + 24 >= PLAYER_Y &&
              t.y <= PLAYER_Y + 24
            ) {
              if (t.isFuel) {
                t.y = 999;
                nitroTimer = 1800;
                updateScore(100);
                soundManager.playCoin();
              } else {
                t.y = 999;
                playerLives--;
                setLives(playerLives);
                soundManager.playBack();
                if (playerLives <= 0) {
                  triggerGameOver();
                }
              }
            }
          });
          traffic = traffic.filter((t) => t.y < CANVAS_H + 30);
        }

        // Render Retro Racing
        // Grass sides
        ctx.fillStyle = '#14532D';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Asphalt Highway
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(58, 0, 164, CANVAS_H);

        // Red/White Rumble Curbs
        for (let y = -28; y < CANVAS_H + 28; y += 14) {
          const offset = y + roadScroll;
          ctx.fillStyle = Math.floor((y + 28) / 14) % 2 === 0 ? '#EF4444' : '#F8FAFC';
          ctx.fillRect(52, offset, 6, 14);
          ctx.fillRect(222, offset, 6, 14);

          // Lane dividers
          ctx.fillStyle = 'rgba(248, 250, 252, 0.5)';
          ctx.fillRect(112, offset, 3, 8);
          ctx.fillRect(165, offset, 3, 8);
        }

        // Traffic & Fuel
        traffic.forEach((t) => {
          const tx = LANES[t.lane];
          if (t.isFuel) {
            ctx.fillStyle = '#4ADE80';
            ctx.fillRect(tx + 2, t.y + 4, 16, 16);
            ctx.fillStyle = '#052E16';
            ctx.font = "7px 'Press Start 2P', monospace";
            ctx.fillText('N', tx + 6, t.y + 15);
          } else {
            ctx.fillStyle = t.color;
            ctx.fillRect(tx, t.y, 20, 28);
            ctx.fillStyle = '#0F172A';
            ctx.fillRect(tx + 3, t.y + 5, 14, 7);
          }
        });

        // Player F1 / Turbo Car
        const px = LANES[playerLane];
        ctx.fillStyle = '#F43F5E';
        ctx.fillRect(px, PLAYER_Y, 20, 28);
        ctx.fillStyle = '#FDE047';
        ctx.fillRect(px + 7, PLAYER_Y, 6, 28);
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(px + 3, PLAYER_Y + 7, 14, 7);

        // Nitro flames
        if (isNitro) {
          ctx.fillStyle = '#FACC15';
          ctx.fillRect(px + 4, PLAYER_Y + 28, 4, 7);
          ctx.fillRect(px + 12, PLAYER_Y + 28, 4, 7);
        }

        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    }
  }, [gameId, restartToken, triggerGameOver, updateScore]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#050D1A',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: "'Press Start 2P', monospace",
        overflow: 'hidden',
      }}
    >
      {/* Top HUD Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '5px 8px',
          background: 'rgba(6, 18, 34, 0.95)',
          borderBottom: '1px solid rgba(95, 209, 130, 0.3)',
          fontSize: 7.5,
          color: '#F4E9D5',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: gameMeta.color, fontWeight: 'bold' }}>
            {gameMeta.shortTitle}
          </span>
          <span>SCR:{score}</span>
          <span style={{ color: '#94A3B8', fontSize: 6.5 }}>HI:{highScore}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {lives > 1 && (
            <span style={{ color: '#F43F5E', fontSize: 7 }}>
              {'♥'.repeat(Math.max(0, lives))}
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              soundManager.playBack();
              onExitToLauncher();
            }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 3,
              padding: '2px 4px',
              fontSize: 6.5,
              color: '#F4E9D5',
              fontFamily: "'Press Start 2P', monospace",
              cursor: 'pointer',
            }}
          >
            EXIT
          </button>
        </div>
      </div>

      {/* Main Playable Canvas */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            imageRendering: 'pixelated',
          }}
        />

        {/* Pause / Game Over Overlay */}
        {status !== 'PLAYING' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(5, 13, 26, 0.88)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: 12,
              textAlign: 'center',
              zIndex: 30,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: status === 'GAME_OVER' ? '#F43F5E' : '#FACC15',
                letterSpacing: '0.08em',
              }}
            >
              {status === 'GAME_OVER' ? 'GAME OVER' : 'PAUSED'}
            </div>
            <div style={{ fontSize: 8, color: '#F4E9D5' }}>
              SCORE: <span style={{ color: '#5FD182' }}>{score}</span> · BEST: {highScore}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => {
                  if (status === 'GAME_OVER') {
                    handleRestart();
                  } else {
                    statusRef.current = 'PLAYING';
                    setStatus('PLAYING');
                  }
                }}
                style={{
                  background: '#48A060',
                  border: '2px solid #6EE087',
                  borderRadius: 4,
                  padding: '5px 8px',
                  fontSize: 7.5,
                  color: '#051525',
                  fontWeight: 'bold',
                  fontFamily: "'Press Start 2P', monospace",
                  cursor: 'pointer',
                }}
              >
                {status === 'GAME_OVER' ? '[A] RETRY' : '[A] RESUME'}
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playBack();
                  onExitToLauncher();
                }}
                style={{
                  background: '#1E293B',
                  border: '1px solid #64748B',
                  borderRadius: 4,
                  padding: '5px 8px',
                  fontSize: 7.5,
                  color: '#F4E9D5',
                  fontFamily: "'Press Start 2P', monospace",
                  cursor: 'pointer',
                }}
              >
                [B] GAMES
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Hint Bar */}
      <div
        style={{
          padding: '3px 8px',
          background: 'rgba(6, 18, 34, 0.95)',
          borderTop: '1px solid rgba(148, 163, 184, 0.2)',
          fontSize: 6,
          color: '#94A3B8',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {gameMeta.controlsHint}
      </div>
    </div>
  );
};
