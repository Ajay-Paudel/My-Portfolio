import React, { useRef, useEffect, useState, useCallback } from 'react';

interface DinoGameProps {
  onExit: () => void;
  addXP: (amount: number, reason: string) => void;
}

export const DinoGame: React.FC<DinoGameProps> = ({ onExit, addXP }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [displayScore, setDisplayScore] = useState(0);
  
  // Use a ref to track if the effect has already been set up (StrictMode protection)
  const effectRanRef = useRef(false);
  const animationIdRef = useRef<number>(0);
  const gameLoopRef = useRef<(() => void) | null>(null);

  // Constants
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 200;
  const GROUND_Y = 170;
  const DINO_SIZE = 25;
  const DINO_X = 50;

  const jump = useCallback(() => {
    if (!containerRef.current) return;
    const jumpEvent = new CustomEvent('dinojump');
    containerRef.current.dispatchEvent(jumpEvent);
  }, []);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && gameState === 'playing') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, jump]);

  // Main game logic
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // StrictMode guard - prevent double initialization
    if (effectRanRef.current) return;
    effectRanRef.current = true;

    // Game state - all mutable, managed imperatively
    let dinoY = GROUND_Y - DINO_SIZE;
    let dinoVelY = 0;
    let isGrounded = true;
    let obstacles: Array<{x: number, height: number}> = [];
    let frame = 0;
    let score = 0;
    let speed = 4;
    let isGameOver = false;

    const JUMP_POWER = -11;
    const GRAVITY = 0.55;

    // Jump handler
    const handleJump = () => {
      if (isGrounded && !isGameOver) {
        dinoVelY = JUMP_POWER;
        isGrounded = false;
      }
    };

    container.addEventListener('dinojump', handleJump);

    const gameLoop = () => {
      if (isGameOver) return;

      // Clear
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Ground
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
      ctx.stroke();

      // Dino physics
      if (!isGrounded) {
        dinoVelY += GRAVITY;
        dinoY += dinoVelY;
      }

      if (dinoY >= GROUND_Y - DINO_SIZE) {
        dinoY = GROUND_Y - DINO_SIZE;
        dinoVelY = 0;
        isGrounded = true;
      }

      // Draw dino
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(DINO_X, dinoY, DINO_SIZE, DINO_SIZE);
      // Eye
      ctx.fillStyle = '#000';
      ctx.fillRect(DINO_X + DINO_SIZE - 7, dinoY + 5, 3, 3);

      // Spawn obstacles (grace period at start)
      if (frame > 100 && frame % 80 === 0 && Math.random() > 0.2) {
        const h = 15 + Math.random() * 25;
        obstacles.push({ x: CANVAS_WIDTH, height: h });
      }

      // Update obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= speed;

        // Draw
        const obsTop = GROUND_Y - obs.height;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(obs.x, obsTop, 18, obs.height);

        // Collision (with small padding for fairness)
        const dinoLeft = DINO_X + 3;
        const dinoRight = DINO_X + DINO_SIZE - 3;
        const dinoTop = dinoY + 3;
        const dinoBottom = dinoY + DINO_SIZE;
        
        const obsLeft = obs.x;
        const obsRight = obs.x + 18;
        const obsBottom = GROUND_Y;

        if (
          dinoRight > obsLeft &&
          dinoLeft < obsRight &&
          dinoBottom > obsTop &&
          dinoTop < obsBottom
        ) {
          isGameOver = true;
          effectRanRef.current = false;
          const earnedXP = Math.floor(score / 5);
          if (earnedXP > 0) addXP(earnedXP, 'dino_run');
          setDisplayScore(score);
          setGameState('gameover');
          return;
        }

        // Remove passed obstacles & score
        if (obs.x + 18 < 0) {
          obstacles.splice(i, 1);
          score++;
          setDisplayScore(score);
          if (score % 5 === 0) speed = Math.min(speed + 0.25, 12);
        }
      }

      // HUD
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`Score: ${score}`, 10, 20);
      ctx.fillText(`Speed: ${speed.toFixed(1)}`, CANVAS_WIDTH - 90, 20);

      frame++;
      animationIdRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = gameLoop;
    animationIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      isGameOver = true;
      effectRanRef.current = false;
      container.removeEventListener('dinojump', handleJump);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [gameState, addXP]);

  const handleStart = () => {
    effectRanRef.current = false;
    setDisplayScore(0);
    setGameState('playing');
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center p-4 h-full bg-black/95 text-green-400 font-mono">
      {gameState === 'start' && (
        <div className="text-center animate-in fade-in duration-300">
          <h2 className="text-3xl font-bold mb-4">🦖 DINO RUNNER</h2>
          <p className="mb-2 text-slate-400">Jump over obstacles to earn XP!</p>
          <p className="mb-6 text-slate-500 text-sm">Press SPACE / ↑ or tap JUMP</p>
          <button 
            onClick={handleStart}
            className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all text-xl font-bold shadow-lg hover:shadow-green-500/25 hover:scale-105 active:scale-95"
          >
            ▶ START GAME
          </button>
          <div className="mt-8">
            <button onClick={onExit} className="text-slate-500 hover:text-slate-300 underline text-sm">
              Back to Terminal
            </button>
          </div>
        </div>
      )}

      {(gameState === 'playing' || gameState === 'gameover') && (
        <div className="relative">
          <canvas 
            ref={canvasRef} 
            width={CANVAS_WIDTH} 
            height={CANVAS_HEIGHT}
            className="border-2 border-green-500/30 rounded-lg shadow-lg"
          />
        </div>
      )}

      {gameState === 'playing' && (
        <>
          <button
            onMouseDown={jump}
            onTouchStart={(e) => { e.preventDefault(); jump(); }}
            className="mt-6 px-12 py-5 bg-green-600 hover:bg-green-500 active:bg-green-400 text-white font-bold text-2xl rounded-2xl transition-all touch-manipulation select-none shadow-xl active:scale-95"
          >
            🦘 JUMP
          </button>
          <p className="mt-3 text-sm text-slate-500">Press SPACE or tap to jump</p>
        </>
      )}

      {gameState === 'gameover' && (
        <div className="text-center mt-6 animate-in fade-in duration-300">
          <h3 className="text-3xl text-red-500 mb-3 font-bold">💀 GAME OVER</h3>
          <p className="text-slate-200 mb-6 text-xl">
            Score: <span className="text-green-400 font-bold text-2xl">{displayScore}</span>
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={handleStart}
              className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 active:scale-95"
            >
              🔄 Play Again
            </button>
            <button 
              onClick={onExit}
              className="px-8 py-3 border-2 border-red-500 text-red-400 hover:bg-red-500/10 rounded-xl font-bold text-lg transition-all"
            >
              Exit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
