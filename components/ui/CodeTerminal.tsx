import React, { useState, useRef, useEffect } from 'react';
import { Terminal, RefreshCw, Trophy, Zap } from 'lucide-react';
import { AI_CONTEXT, OPENROUTER_API_KEY, OPENROUTER_MODEL, PROJECTS } from '../../constants';
import { TicTacToe } from './TicTacToe';
import { useGamification } from '../../hooks/useGamification';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { DinoGame } from './DinoGame';
import { ChessGame } from './ChessGame';
import { EncryptedChat } from './EncryptedChat';

// --- Types & Constants ---
type Theme = 'dark' | 'light' | 'neon' | 'hacker';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system' | 'ai';
  content: React.ReactNode;
}

// ... (ASCII Art & Components omitted for brevity, keeping existing) ...
// --- ASCII Art & Data ---
const ASCII_LOGO = String.raw`
    _    _             
   / \  (_) __ _ _   _ 
  / _ \ | |/ _' | | | |
 / ___ \| | (_| | |_| |
/_/   \_\ |\__,_|\__, |
        |_|     |___/ 
`;

const RESUME_ASCII = `
+--------------------------------------------------+
|                  AJAY PAUDEL                     |
|        Frontend Developer & UI/UX Designer       |
+--------------------------------------------------+
| CONTACT: ajayindrapaudel@gmail.com               |
| LOCATION: Kathmandu, Nepal                       |
+--------------------------------------------------+
| SKILLS:                                          |
| • React, Next.js, TypeScript                     |
| • Tailwind CSS, Figma                            |
| • C, JavaScript                                  |
+--------------------------------------------------+
| EXPERIENCE:                                      |
| • Built E-commerce platforms                     |
| • Developed News Portals                         |
| • Created Travel Booking Systems                 |
+--------------------------------------------------+
`;

// --- Components ---

// Matrix Rain Effect Component
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) drops[x] = 1;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-30" />;
};

// Snake Game Component
type Difficulty = 'easy' | 'medium' | 'hard';



const SnakeGame = ({ onExit, addXP }: { onExit: () => void; addXP: (amount: number, reason: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const velocityRef = useRef({ x: 0, y: 0 });

  const difficultySettings = {
    easy: { speed: 150, label: 'Easy', color: 'bg-green-500 hover:bg-green-400', description: 'Slower snake' },
    medium: { speed: 100, label: 'Medium', color: 'bg-yellow-500 hover:bg-yellow-400', description: 'Normal speed' },
    hard: { speed: 60, label: 'Hard', color: 'bg-red-500 hover:bg-red-400', description: 'Fast snake' },
  };

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setGameStarted(true);
    setScore(0);
    setGameOver(false);
    velocityRef.current = { x: 0, y: 0 };
  };

  const changeDirection = (direction: 'up' | 'down' | 'left' | 'right') => {
    const { x: velocityX, y: velocityY } = velocityRef.current;
    switch (direction) {
      case 'left': if (velocityX !== 1) { velocityRef.current = { x: -1, y: 0 }; } break;
      case 'up': if (velocityY !== 1) { velocityRef.current = { x: 0, y: -1 }; } break;
      case 'right': if (velocityX !== -1) { velocityRef.current = { x: 1, y: 0 }; } break;
      case 'down': if (velocityY !== -1) { velocityRef.current = { x: 0, y: 1 }; } break;
    }
  };

  useEffect(() => {
    if (!gameStarted || !difficulty) return;
    
    // ... context and vars ...
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = 20;
    const tileCount = 20; 
    let playerX = 10;
    let playerY = 10;
    let appleX = 15;
    let appleY = 15;
    let trail: { x: number; y: number }[] = [];
    let tail = 5;

    const speed = difficultySettings[difficulty].speed;

    let isGameOver = false;

    const gameLoop = setInterval(() => {
      if (isGameOver) return;

      const { x: velocityX, y: velocityY } = velocityRef.current;
      playerX += velocityX;
      playerY += velocityY;

      if (playerX < 0) playerX = tileCount - 1;
      if (playerX > tileCount - 1) playerX = 0;
      if (playerY < 0) playerY = tileCount - 1;
      if (playerY > tileCount - 1) playerY = 0;

      // Draw Background
      ctx.fillStyle = '#1E1E1E';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Snake
      ctx.fillStyle = 'lime';
      for (let i = 0; i < trail.length; i++) {
        ctx.fillRect(trail[i].x * gridSize, trail[i].y * gridSize, gridSize - 2, gridSize - 2);
        if (trail[i].x === playerX && trail[i].y === playerY && (velocityX !== 0 || velocityY !== 0)) {
           isGameOver = true;
           setGameOver(true);
           return;
        }
      }

      trail.push({ x: playerX, y: playerY });
      while (trail.length > tail) {
        trail.shift();
      }

      // Draw Apple
      if (appleX === playerX && appleY === playerY) {
        tail++;
        setScore(s => s + 1);
        
        // Award XP on apple eat
        let xpGain = 1;
        if (difficulty === 'medium') xpGain = 2;
        if (difficulty === 'hard') xpGain = 5;
        
        addXP(xpGain, 'snake_eat');

        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
      }

      ctx.fillStyle = 'red';
      ctx.fillRect(appleX * gridSize, appleY * gridSize, gridSize - 2, gridSize - 2);
    }, speed);

   // ... rest of useEffect
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case 'ArrowLeft': changeDirection('left'); break;
        case 'ArrowUp': changeDirection('up'); break;
        case 'ArrowRight': changeDirection('right'); break;
        case 'ArrowDown': changeDirection('down'); break;
        case 'Escape': onExit(); break;
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      clearInterval(gameLoop);
      document.removeEventListener('keydown', handleKey);
    };

  }, [gameStarted, difficulty, onExit, addXP]);

  // ... (render remains same) ...
  // Need to copy Full render if I replace the component def.
  // Actually, I should use multi replace carefully or just rewrite the component.
  // Given I need to change the prop in signature, I must replace the signature.
  // And the useEffect deps.
  
  // Let's just return the full component code block to be safe.
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 font-mono bg-black text-white p-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-400 mb-2">🐍 SNAKE</h2>
          <p className="text-slate-400 text-sm">Select Difficulty</p>
        </div>
        
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {(Object.keys(difficultySettings) as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => startGame(diff)}
              className={`${difficultySettings[diff].color} text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 active:scale-95`}
            >
              <div className="text-lg">{difficultySettings[diff].label}</div>
              <div className="text-xs opacity-80">{difficultySettings[diff].description}</div>
            </button>
          ))}
        </div>
         {/* ... */}
         <button onClick={onExit} className="text-slate-500 hover:text-slate-300 text-sm underline mt-4">Back to Terminal</button>
      </div>
    );
  }

  const ControlButton = ({ direction, symbol }: { direction: 'up' | 'down' | 'left' | 'right', symbol: string }) => (
    <button
      onTouchStart={(e) => { e.preventDefault(); changeDirection(direction); }}
      onClick={() => changeDirection(direction)}
      className="w-12 h-12 bg-slate-700/80 hover:bg-slate-600 active:bg-green-600 rounded-lg flex items-center justify-center text-xl font-bold text-white select-none transition-colors touch-manipulation"
    >
      {symbol}
    </button>
  );

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-2 font-mono bg-black text-white p-2 md:p-4">
      <div className="text-lg md:text-xl text-green-400">SCORE: {score}</div>
      <canvas ref={canvasRef} width="400" height="400" className="border-2 border-slate-700 bg-black max-w-full" style={{ maxHeight: '250px', width: 'auto' }} />
       {/* ... Controls ... */}
      <div className="flex flex-col items-center gap-1 md:hidden">
        <ControlButton direction="up" symbol="▲" />
        <div className="flex gap-8">
          <ControlButton direction="left" symbol="◀" />
          <ControlButton direction="right" symbol="▶" />
        </div>
        <ControlButton direction="down" symbol="▼" />
      </div>
      
      <div className="hidden md:block text-sm text-slate-400">Use Arrow Keys to Move | Press ESC to Exit</div>
      
      <div className="md:hidden text-xs text-slate-400 text-center">
        <button onClick={onExit} className="text-red-400 underline">Tap here to Exit</button>
      </div>
      
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="text-center">
            <h3 className="text-red-500 text-2xl md:text-3xl font-bold mb-4">GAME OVER</h3>
            <button onClick={onExit} className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600">
              Return to Terminal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export const CodeTerminal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { id: '1', type: 'system', content: 'Welcome to Ajay\'s Portfolio Terminal v2.0' },
    { id: '2', type: 'system', content: 'Type "help" to see available commands.' },
  ]);
  const [theme, setTheme] = useState<Theme>('dark');
  const [isMatrix, setIsMatrix] = useState(false);
  const [showChess, setShowChess] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [gameMode, setGameMode] = useState<'none' | 'snake' | 'tictactoe' | 'guess' | 'guess_select' | 'dino'>('none');
  const [guessGame, setGuessGame] = useState<{ target: number; tries: number; maxRange: number } | null>(null);

  // Gamification & Leaderboard
  const { level, xp, progress, isLevelUp, addXP, resetLevelUp, resetProgress } = useGamification();
  const { leaderboard, submitScore, userRank, loading: loadingLeaderboard, userId } = useLeaderboard();



  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const addToHistory = (type: TerminalLine['type'], content: React.ReactNode) => {
    setHistory(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), type, content }]);
  };

  const processCommand = async (rawCmd: string) => {
    const command = rawCmd.trim().toLowerCase();
    const args = command.split(' ');
    // Validation
    if (!command) return;
    
    addToHistory('input', `user@portfolio:~$ ${rawCmd}`);

    let isValidCommand = true;

    const cmd = args[0]; 
    const argText = args.slice(1).join(' '); 

    // Handle Guess Game Difficulty Selection

    if (gameMode === 'guess_select') {
      const choice = cmd.toLowerCase().trim();
      if (choice === 'exit') {
        setGameMode('none');
        addToHistory('system', 'Exited game selection.');
        return;
      }
      
      const difficulties: { [key: string]: { range: number, label: string } } = {
        'easy': { range: 10, label: 'Easy (1-10)' },
        'medium': { range: 50, label: 'Medium (1-50)' },
        'hard': { range: 100, label: 'Hard (1-100)' },
        '1': { range: 10, label: 'Easy (1-10)' },
        '2': { range: 50, label: 'Medium (1-50)' },
        '3': { range: 100, label: 'Hard (1-100)' },
      };
      
      if (difficulties[choice]) {
        const { range, label } = difficulties[choice];
        const target = Math.floor(Math.random() * range) + 1;
        setGuessGame({ target, tries: 0, maxRange: range });
        setGameMode('guess');
        addToHistory('system', `🎮 ${label} mode selected!`);
        addToHistory('system', `I picked a number between 1 and ${range}. Guess it!`);
        addXP(5, 'start_guess');
      } else {
        addToHistory('error', 'Please type: easy, medium, hard (or 1, 2, 3)');
        isValidCommand = false;
      }
      return;
    }

    // Handle Guess Game Logic
    if (gameMode === 'guess') {
      const num = parseInt(cmd);
      if (isNaN(num)) {
        if (cmd.toLowerCase() === 'exit') {
          setGameMode('none');
          setGuessGame(null);
          addToHistory('system', 'Exited guessing game.');
        } else {
           addToHistory('error', 'Please enter a valid number or type "exit" to quit.');
        }
        return;
      }

      if (!guessGame) return;

      addXP(1, 'guess_attempt'); // Small pity XP

      if (num === guessGame.target) {
        // Calculate dynamic XP
        // Base: Easy=20, Medium=50, Hard=100
        // Penalty: 5 per try
        let base = 20;
        if (guessGame.maxRange === 50) base = 50;
        if (guessGame.maxRange === 100) base = 100;
        
        let winXP = base - (guessGame.tries * 5);
        if (winXP < 5) winXP = 5; // Minimum reward

        addToHistory('system', `🎉 CORRECT! The number was ${guessGame.target}. You won in ${guessGame.tries + 1} tries.`);
        addToHistory('system', `You earned ${winXP} XP!`);
        addXP(winXP); // No decay for winning
        
        setGameMode('none');
        setGuessGame(null);
      } else if (num < guessGame.target) {
        addToHistory('output', 'Too low! Try again.');
        setGuessGame(prev => prev ? { ...prev, tries: prev.tries + 1 } : null);
      } else {
        addToHistory('output', 'Too high! Try again.');
        setGuessGame(prev => prev ? { ...prev, tries: prev.tries + 1 } : null);
      }
      return;
    }

    // Standard Commands
    switch (cmd) {
      case 'help':
        addXP(10, 'help');
        addToHistory('output', (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="text-yellow-400 col-span-2 md:col-span-1">--- General ---</div>
            <div className="text-yellow-400 col-span-2 md:col-span-1 md:block hidden">--- Fun & Tools ---</div>
            
            <div><span className="text-blue-400">about</span> : Who is Ajay?</div>
            <div className="md:hidden text-yellow-400 mt-2">--- Fun & Tools ---</div>
            <div><span className="text-blue-400">theme [mode]</span> : dark/light/neon/hacker</div>
            <div><span className="text-blue-400">skills</span> : Technical stack</div>
            <div><span className="text-blue-400">game [name]</span> : snake, guess, tictactoe, dino</div>
            <div><span className="text-blue-400">projects</span> : View work</div>
            <div><span className="text-blue-400">leaderboard</span> : View Top 10</div>
            <div><span className="text-blue-400">stats</span> : Server Status</div>
            <div><span className="text-blue-400">matrix</span> : Toggle rain</div>
            <div><span className="text-blue-400">resume</span> : View CV</div>
            <div><span className="text-blue-400">hack</span> : Simulate breach</div>
            <div><span className="text-blue-400">ResetXP</span> : Reset Gamification</div>
            <div><span className="text-blue-400">contact</span> : Get in touch</div>
            <div><span className="text-blue-400">ai [msg]</span> : Ask AI assistant</div>
            <div><span className="text-blue-400">clear</span> : Clear screen</div>
            <div><span className="text-blue-400">ascii [txt]</span> : Generate Text Art</div>
          </div>
        ));
        break;

      case 'about':
        addXP(10, 'about');
        addToHistory('output', (
          <div className="p-2 border-l-2 border-blue-500 bg-blue-500/10">
            <div className="font-bold text-lg">👨‍💻 Ajay Paudel</div>
            <div className="text-slate-300">Frontend Developer & UI/UX Designer</div>
            <p className="mt-1 text-sm">Passionate about building intuitive, scalable web applications. Currently mastering the MERN stack and exploring AI integrations. I love turning complex problems into simple, beautiful designs.</p>
          </div>
        ));
        break;

      case 'skills':
        addXP(10, 'skills');
        addToHistory('output', (
          <div className="space-y-2 border p-2 border-dashed border-slate-600 rounded">
            <div><span className="text-green-400 font-bold">Frontend:</span> React, Next.js, Tailwind, HTML, CSS</div>
            <div><span className="text-blue-400 font-bold">Languages:</span> JavaScript, C</div>
            <div><span className="text-purple-400 font-bold">Tools:</span> Git, Figma, VS Code, OpenRouter AI</div>
          </div>
        ));
        break;

      case 'projects':
        addXP(10, 'projects');
        addToHistory('output', (
          <div className="space-y-2">
            {PROJECTS.map((p, i) => (
              <div key={p.id}>
                {i + 1}. <span className="font-bold text-white">{p.title}</span> - {p.description.substring(0, 50)}...
              </div>
            ))}
            <div className="text-xs text-slate-500">Check the Projects section for full details.</div>
          </div>
        ));
        break;

      case 'resume':
        addXP(10, 'resume');
        addToHistory('output', <pre className="text-[10px] md:text-xs leading-none text-slate-300 font-mono overflow-x-auto">{RESUME_ASCII}</pre>);
        break;
      
      case 'contact':
        addXP(10, 'contact');
        addToHistory('output', '📧 Email: ajayindrapaudel@gmail.com | 📍 Location: Kathmandu');
        break;

      case 'clear':
        addXP(2, 'clear'); // Low base XP
        setHistory([]);
        break;
      
      case 'resetxp':
        resetProgress();
        addToHistory('system', 'XP and Level reset to 0.');
        break;

      case 'theme':
        if (['dark', 'light', 'neon', 'hacker'].includes(argText)) {
          setTheme(argText as Theme);
          addToHistory('system', `Theme switched to ${argText}`);
          addXP(10, 'theme');
        } else {
          addToHistory('error', 'Usage: theme [dark | light | neon | hacker]');
        }
        break;

      case 'matrix':
        setIsMatrix(!isMatrix);
        addToHistory('system', `Matrix mode ${!isMatrix ? 'ENABLED' : 'DISABLED'}`);
        addXP(10, 'matrix');
        break;

      case 'ascii':
        if (!argText) {
          addToHistory('error', 'Usage: ascii [text]');
        } else {
           addXP(15, 'ascii'); // Creative command
           addToHistory('output', (
             <div className="text-2xl md:text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 uppercase my-2">
               {argText}
             </div>
           ));
        }
        break;

      case 'game':
        if (argText === 'snake') {
          setGameMode('snake');
          addToHistory('system', 'Starting Snake...');
          addXP(5, 'start_snake');
        } else if (argText.includes('tic')) {
            setGameMode('tictactoe');
            addToHistory('system', 'Starting Tic-Tac-Toe...');
            addXP(5, 'start_tic');
        } else if (argText === 'guess') {
          setGameMode('guess_select');
          addToHistory('system', '🎯 NUMBER GUESSING GAME');
          addToHistory('output', (
            <div className="space-y-1">
              <div className="text-yellow-400">Select Difficulty:</div>
              <div><span className="text-green-400">1. Easy</span> - Guess 1-10</div>
              <div><span className="text-yellow-400">2. Medium</span> - Guess 1-50</div>
              <div><span className="text-red-400">3. Hard</span> - Guess 1-100</div>
              <div className="text-slate-500 text-xs mt-2">Type: easy, medium, hard (or 1, 2, 3)</div>
            </div>
          ));
          addXP(5, 'start_guess');
        } else if (argText === 'dino') {
            setGameMode('dino');
            addToHistory('system', '🦖 Starting Dino Runner...');
            addXP(5, 'start_dino');
        } else {
          addToHistory('error', 'Available games: snake, guess, tictactoe, dino');
        }
        break;

      case 'hack':
        addXP(50, 'hack'); // Easter egg, rarely repeated ideally
        const hackSteps = [
          "Initiating handshake...",
          "Bypassing firewall...",
          "Accessing mainframe...",
          "Downloading sensitive data...",
          "ACCESS GRANTED."
        ];
        hackSteps.forEach((step, i) => {
          setTimeout(() => {
            addToHistory('system', <span className="text-green-500 font-bold">{step}</span>);
          }, i * 800);
        });
        break;

      case 'ai':
        if (!argText) {
          addToHistory('error', 'Usage: ai [your message]');
          break;
        }
        addXP(20, 'ai');
        addToHistory('system', 'Contacting OpenRouter API...');
        try {
          const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": window.location.href,
            },
            body: JSON.stringify({
              "model": OPENROUTER_MODEL,
              "messages": [
                { "role": "system", "content": AI_CONTEXT },
                { "role": "user", "content": argText }
              ]
            })
          });
          const data = await res.json();
          const aiText = data.choices?.[0]?.message?.content || "No response.";
          addToHistory('ai', aiText);
        } catch (e) {
          addToHistory('error', 'Failed to connect to AI.');
        }
        break;

      // Fun Commands
      case 'coffee': addToHistory('output', '☕ Here is your coffee. Be careful, it\'s hot!'); addXP(5, 'fun'); break;
      case 'joke': addToHistory('output', 'Why do programmers prefer dark mode? Because light attracts bugs.'); addXP(5, 'fun'); break;
      case 'ping': addToHistory('output', 'Pong! 🏓'); addXP(5, 'fun'); break;
      case 'ajay?': addToHistory('output', 'He is the one writing this code right now.'); addXP(5, 'fun'); break;
      case 'sudo': addToHistory('error', 'Permission denied: You are not root.'); addXP(1, 'sudo'); break;
      case 'rickroll': 
        addToHistory('output', 'Never gonna give you up, never gonna let you down... 🎵'); 
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
        addXP(50, 'rickroll'); 
        break;

      case 'whoami': addToHistory('output', 'guest_user'); addXP(5, 'whoami'); break;

      case 'leaderboard':
        const lbAction = argText.split(' ')[0]; // top, join, etc.
        const lbName = argText.split(' ').slice(1).join(' ');

        if (lbAction === 'join') {
          if (!lbName) {
            addToHistory('error', 'Usage: leaderboard join [YourName]');
            break;
          }
          if (xp < 50) {
             addToHistory('error', 'You need at least 50 XP to join the leaderboard!');
             break;
          }
          addToHistory('system', 'Submitting score...');
          const res = await submitScore(lbName, xp);
          if (res.success) {
            addToHistory('system', `✅ ${res.message}`);
            addXP(20, 'leaderboard_join');
          } else {
            addToHistory('error', `❌ ${res.message}`);
          }
        } else {
          // Display
          if (loadingLeaderboard) {
            addToHistory('system', 'Fetching leaderboard data...');
          }
          
          // Small delay or re-render might be needed if loading, but for now we assume fast fetch or stale data ok
          // Actually hooks update state, so re-render happens. But command output is static once added history.
          // Getting CURRENT state from hook is fine.
          
          const lbData = leaderboard.slice(0, 10); // Top 10 by default

          addToHistory('output', (
            <div className="w-full max-w-md border border-slate-700 rounded bg-slate-900/50 p-2 text-xs md:text-sm shadow-xl">
               <div className="flex justify-between border-b border-slate-700 pb-1 mb-2 text-yellow-500 font-bold">
                 <span>RANK</span>
                 <span>PLAYER</span>
                 <span>XP</span>
               </div>
               {lbData.length === 0 ? (
                 <div className="text-slate-500 italic">No records yet. Be the first!</div>
               ) : (
                 lbData.map((entry, i) => {
                   let rankColor = 'text-slate-300';
                   let rankIcon = '';
                   if (i === 0) { rankColor = 'text-yellow-400 font-bold'; rankIcon = '👑 '; }
                   if (i === 1) { rankColor = 'text-slate-200 font-bold'; rankIcon = '🥈 '; }
                   if (i === 2) { rankColor = 'text-amber-600 font-bold'; rankIcon = '🥉 '; }

                   return (
                     <div key={entry.id} className="flex justify-between py-1 border-b border-slate-800/50 hover:bg-white/5 px-1">
                       <span className={`${rankColor} w-10`}>#{i + 1}</span>
                       <span className={`flex-1 ${entry.id === userId ? 'text-green-400 font-bold' : 'text-slate-300'}`}>
                         {rankIcon}{entry.name} {entry.id === userId && '(YOU)'}
                       </span>
                       <span className="text-blue-400 font-mono">{entry.score}</span>
                     </div>
                   );
                 })
               )}
               <div className="mt-2 text-[10px] text-slate-500 border-t border-slate-700 pt-1 flex justify-between">
                 <span>Your Rank: {userRank ? `#${userRank}` : 'Unranked'}</span>
                 <span>Type 'leaderboard join [name]' to submit</span>
               </div>
            </div>
          ));
        }
        break;

      case 'stats':
        addXP(5, 'stats');
        addToHistory('system', 'Fetching server statistics...');
        try {
          const { get, ref } = await import('firebase/database');
          const { database } = await import('../../firebase');
          
          if (!database) throw new Error('DB not connected');

          const connectionsSnap = await get(ref(database, 'visitors/connections'));
          const totalSnap = await get(ref(database, 'visitors/total'));

          const online = connectionsSnap.exists() ? connectionsSnap.size : 0;
          const visits = totalSnap.exists() ? totalSnap.val() : 0;

          addToHistory('output', (
            <div className="border border-green-500/30 bg-green-900/10 p-2 rounded text-green-400 font-mono">
              <div>📡 SYSTEM STATUS: ONLINE</div>
              <div>-------------------------</div>
              <div className="flex justify-between w-48">
                <span>Active Users:</span>
                <span className="font-bold text-white">{online}</span>
              </div>
              <div className="flex justify-between w-48">
                <span>Total Visits:</span>
                <span className="font-bold text-white">{visits}</span>
              </div>
            </div>
          ));
        } catch (e) {
          addToHistory('error', 'Failed to retrieve stats.');
        }
        break;

        break;

      case 'chat':
        if (xp >= 15) {
          addXP(-15, 'chat_access');
          setShowChat(true);
          addToHistory('system', 'INITIALIZING SECURE LINK...');
          addToHistory('system', 'ACCESS GRANTED. [ -15 XP ]');
          addToHistory('system', 'Launching P2P Relay Node...');
        } else {
          addToHistory('error', 'ACCESS DENIED: Insufficient processing power.');
          addToHistory('system', `Required: 15 XP | Current: ${xp} XP`);
        }
        break;

      default:
        isValidCommand = false;
        addToHistory('error', `Command not found: ${command}. Type 'help' for options.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    }
  };

  // Theme Config
  const getThemeStyles = () => {
    switch (theme) {
      case 'light': return { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300', prompt: 'text-blue-600' };
      case 'neon': return { bg: 'bg-[#0a0a1f]', text: 'text-pink-400', border: 'border-pink-500', prompt: 'text-cyan-400' };
      case 'hacker': return { bg: 'bg-black', text: 'text-green-500', border: 'border-green-600', prompt: 'text-green-400' };
      default: return { bg: 'bg-[#1E1E1E]', text: 'text-slate-200', border: 'border-slate-700', prompt: 'text-green-400' }; // Dark
    }
  };
  const themeStyles = getThemeStyles();

  return (
    <div className={`w-full h-[500px] rounded-xl overflow-hidden shadow-2xl border flex flex-col relative transition-colors duration-300 ${themeStyles.bg} ${themeStyles.border} font-mono text-sm`}>
      {isMatrix && <MatrixRain />}

      {/* Level Up Notification Overlay */}
      {isLevelUp && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 animate-in fade-in duration-500">
           <Trophy className="w-20 h-20 text-yellow-400 animate-bounce mb-4" />
           <h2 className="text-4xl font-bold text-yellow-500 mb-2">LEVEL UP!</h2>
           <p className="text-white text-xl">You reached Level {level}</p>
           <button 
             onClick={resetLevelUp}
             className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition-colors"
           >
             CONTINUE
           </button>
        </div>
      )}
      
      {/* Header */}
      <div className={`px-4 py-2 flex items-center justify-between border-b ${themeStyles.border} bg-black/10 backdrop-blur-sm z-10`}>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 cursor-pointer hover:ring-2 hover:ring-green-400 hover:ring-offset-1 hover:ring-offset-black transition-all" onClick={() => setShowChess(true)} title="🤫"></div>
        </div>
        
        {/* Title & XP Bar */}
        <div className="flex items-center gap-4">
           {/* Mobile hidden title */}
           <div className={`hidden md:block text-xs opacity-70 ${themeStyles.text}`}>
             <Terminal className="w-3 h-3 inline mr-1" /> bash — 80x24
           </div>

           {/* XP Widget */}
           <div className={`flex items-center gap-2 px-2 py-0.5 rounded border border-slate-700/50 bg-black/20 ${themeStyles.text} text-xs`}>
             <span className="font-bold text-yellow-500">LVL {level}</span>
             <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ease-out"
                 style={{ width: `${progress}%` }}
               />
             </div>
             <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
           </div>
        </div>

        <div className={`text-xs opacity-70 ${themeStyles.text} flex gap-2`}>
           <RefreshCw className="w-3 h-3 cursor-pointer hover:rotate-180 transition-transform" onClick={() => setHistory([])} title="Clear" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {gameMode === 'snake' && (
          <SnakeGame onExit={() => setGameMode('none')} addXP={addXP} />
        )}
        {gameMode === 'tictactoe' && (
          <TicTacToe onExit={() => setGameMode('none')} addXP={addXP} />
        )}
        {gameMode === 'dino' && (
          <DinoGame onExit={() => setGameMode('none')} addXP={addXP} />
        )}
        {(gameMode === 'none' || gameMode === 'guess' || gameMode === 'guess_select') && ( // Render terminal for none and guess modes
          <div 
            ref={containerRef}
            className={`absolute inset-0 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 ${themeStyles.text}`}
          >
            <div className="mb-4 opacity-50 select-none">
              <p>Type 'help' to start.</p>
            </div>

            {history.map((line) => (
              <div key={line.id} className="mb-1 break-words">
                {line.type === 'input' && <span className="mr-2 opacity-50">➜</span>}
                {line.type === 'error' && <span className="text-red-500 mr-2">✖</span>}
                {line.type === 'ai' && <span className="text-purple-400 mr-2">🤖</span>}
                {line.content}
              </div>
            ))}

            <div className="flex items-center mt-2 z-20 relative">
              <span className={`${themeStyles.prompt} mr-2`}>
                {gameMode === 'guess' ? `guess(1-${guessGame?.maxRange || '?'})?` : gameMode === 'guess_select' ? 'select_difficulty?' : 'visitor@portfolio:~$'}
              </span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`flex-1 bg-transparent outline-none ${themeStyles.text}`}
                placeholder={gameMode === 'guess' ? 'Enter a number...' : 'Type command...'}
                autoComplete="off"
              />
            </div>
          </div>
        )}
      </div>

      {/* Hidden Chess Game Easter Egg */}
      {showChess && (
        <ChessGame 
          onClose={() => setShowChess(false)} 
          addXP={addXP}
        />
      )}

      {/* Encrypted Chat Interface */}
      {showChat && (
        <EncryptedChat 
          onClose={() => setShowChat(false)}
          currentUserXP={xp}
        />
      )}
    </div>
  );
};