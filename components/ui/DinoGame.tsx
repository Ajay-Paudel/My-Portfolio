import React, { useRef, useEffect, useState } from 'react';

interface DinoGameProps {
  onExit: () => void;
  addXP: (amount: number, reason: string) => void;
}

export const DinoGame: React.FC<DinoGameProps> = ({ onExit, addXP }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game Variables
    const dino = {
      x: 50,
      y: 150,
      width: 20,
      height: 20,
      dy: 0,
      jumpPower: -10,
      gravity: 0.5,
      grounded: true
    };

    let obstacles: { x: number, width: number, height: number }[] = [];
    let frame = 0;
    let gameSpeed = 3;
    let scoreCount = 0;
    let animationId: number;

    const spawnObstacle = () => {
      // Random height or type? For now just boxes.
      obstacles.push({
        x: canvas.width,
        width: 20,
        height: 20 + Math.random() * 20
      });
    };

    const update = () => {
      // Clear
      ctx.fillStyle = '#111'; // Match terminal dark bg
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ground Line
      ctx.strokeStyle = '#4ade80'; // Green-400
      ctx.beginPath();
      ctx.moveTo(0, 170);
      ctx.lineTo(canvas.width, 170);
      ctx.stroke();

      // Dino Logic
      if (!dino.grounded) {
        dino.dy += dino.gravity;
        dino.y += dino.dy;
      }

      if (dino.y >= 150) {
        dino.y = 150;
        dino.dy = 0;
        dino.grounded = true;
      }

      // Draw Dino
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

      // Obstacles
      if (frame % 100 === 0) {
         // Randomize spawn rate slightly
         if (Math.random() > 0.3) spawnObstacle();
      }

      for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.x -= gameSpeed;

        // Draw Obstacle
        ctx.fillStyle = '#f87171'; // Red-400
        ctx.fillRect(obs.x, 170 - obs.height + 20, obs.width, obs.height);

        // Collision
        if (
          dino.x < obs.x + obs.width &&
          dino.x + dino.width > obs.x &&
          dino.y < 170 - obs.height + 20 + obs.height &&
          dino.y + dino.height > 170 - obs.height + 20
        ) {
          // Game Over
          setGameState('gameover');
          
          // Award XP based on score
          const xpEarned = Math.floor(scoreCount / 10); // 10 XP per 100 points basically
          if (xpEarned > 0) addXP(xpEarned, 'dino_run');
          
          cancelAnimationFrame(animationId);
          return;
        }

        // Cleanup
        if (obs.x + obs.width < 0) {
          obstacles.shift();
          i--;
          scoreCount++;
          setScore(scoreCount);
          // Increase speed slightly
          if (scoreCount % 5 === 0) gameSpeed += 0.2;
        }
      }

      frame++;
      animationId = requestAnimationFrame(update);
    };

    update();

    const handleInput = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && dino.grounded) {
        dino.dy = dino.jumpPower;
        dino.grounded = false;
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleInput);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleInput);
    };
  }, [gameState, addXP]);

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full bg-black/90 text-green-400 font-mono">
      {gameState === 'start' && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">🦖 DINO RUNNER</h2>
          <p className="mb-4 text-slate-400">Jump over obstacles to earn XP!</p>
          <button 
            onClick={() => setGameState('playing')}
            className="px-4 py-2 border border-green-500 hover:bg-green-500/20 rounded translation-colors"
          >
            START GAME
          </button>
        </div>
      )}

      {(gameState === 'playing' || gameState === 'gameover') && (
        <div className="relative">
          <canvas 
            ref={canvasRef} 
            width={600} 
            height={200}
            className="border-2 border-slate-700 bg-slate-900 rounded max-w-full"
          />
          <div className="absolute top-2 right-2 text-xl font-bold">
            SCORE: {score}
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="text-center mt-4">
          <h3 className="text-xl text-red-500 mb-2">GAME OVER</h3>
          <p className="text-slate-300 mb-4">You scored {score} points!</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => { setScore(0); setGameState('playing'); }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-white"
            >
              Try Again
            </button>
            <button 
              onClick={onExit}
              className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500/10 rounded"
            >
              Exit
            </button>
          </div>
        </div>
      )}
      
      {gameState === 'start' && (
         <button onClick={onExit} className="mt-8 text-slate-500 hover:text-white underline text-sm">
           Back to Terminal
         </button>
      )}
    </div>
  );
};
