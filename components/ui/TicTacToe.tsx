import React, { useState, useEffect, useCallback } from 'react';

type Player = 'X' | 'O';
type SquareValue = Player | null;
type Difficulty = 'easy' | 'medium' | 'hard' | 'pvp';

interface TicTacToeProps {
  onExit: () => void;
  addXP: (amount: number, reason: string) => void;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export const TicTacToe: React.FC<TicTacToeProps> = ({ onExit, addXP }) => {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [aiThinking, setAiThinking] = useState<boolean>(false);
  const [hasAwardedXP, setHasAwardedXP] = useState(false);

  // Sound effects (using standard HTML audio for simplicity or pass props if we want to reuse hook)
  // For now, visual feedback is sufficient for the terminal vibe.

  useEffect(() => {
    if (winner && !hasAwardedXP) {
       setHasAwardedXP(true);
       if (winner === 'X') {
         // Player Won (assuming Player is X)
         let xp = 0;
         if (difficulty === 'easy') xp = 20;
         if (difficulty === 'medium') xp = 50;
         if (difficulty === 'hard') xp = 100;
         if (difficulty === 'pvp') xp = 15; // Small reward for PvP
         
         if (xp > 0) addXP(xp, `Win TicTacToe ${difficulty}`);
       } else if (winner === 'Draw') {
         addXP(5, 'Draw TicTacToe');
       }
    }
  }, [winner, difficulty, hasAwardedXP, addXP]);

  const checkWinner = (squares: SquareValue[]): Player | 'Draw' | null => {
    for (let combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(square => square !== null) ? 'Draw' : null;
  };

  const getBestMove = (squares: SquareValue[], player: Player): number => {
    // Minimax Algorithm
    const opponent = player === 'X' ? 'O' : 'X';
    
    // Check terminal states
    const win = checkWinner(squares);
    if (win === player) return 10;
    if (win === opponent) return -10;
    if (win === 'Draw') return 0;

    const moves = [];
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        const newSquares = [...squares];
        newSquares[i] = player;
        const score = minimax(newSquares, 0, false, player, opponent);
        moves.push({ index: i, score });
      }
    }

    // Sort moves: highest score for max player
    moves.sort((a, b) => b.score - a.score);
    return moves[0].index;
  };

  const minimax = (squares: SquareValue[], depth: number, isMaximizing: boolean, aiPlayer: Player, humanPlayer: Player): number => {
    const result = checkWinner(squares);
    if (result === aiPlayer) return 10 - depth;
    if (result === humanPlayer) return depth - 10;
    if (result === 'Draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = aiPlayer;
          const score = minimax(squares, depth + 1, false, aiPlayer, humanPlayer);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = humanPlayer;
          const score = minimax(squares, depth + 1, true, aiPlayer, humanPlayer);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const makeAiMove = useCallback(() => {
    if (winner || !gameStarted || difficulty === 'pvp') return;

    setAiThinking(true);
    setTimeout(() => {
      let moveIndex = -1;
      const currentBoard = [...board];

      if (difficulty === 'easy') {
        const available = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
        moveIndex = available[Math.floor(Math.random() * available.length)];
      } else if (difficulty === 'medium') {
        // 40% chance to make a random move, else best move
        if (Math.random() > 0.6) {
          const available = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
          moveIndex = available[Math.floor(Math.random() * available.length)];
        } else {
          moveIndex = getBestMove(currentBoard, 'O');
        }
      } else if (difficulty === 'hard') {
        moveIndex = getBestMove(currentBoard, 'O');
      }

      if (moveIndex !== -1) {
        handleMove(moveIndex, 'O');
      }
      setAiThinking(false);
    }, 600); // Simulate thinking time
  }, [board, difficulty, gameStarted, winner]);

  useEffect(() => {
    if (!isXNext && difficulty !== 'pvp' && !winner) {
      makeAiMove();
    }
  }, [isXNext, difficulty, winner, makeAiMove]);

  const handleMove = (index: number, playerOverRide?: Player) => {
    if (board[index] || winner) return;

    const currentPlayer = playerOverRide || (isXNext ? 'X' : 'O');
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    
    const w = checkWinner(newBoard);
    if (w) {
      setWinner(w);
    } else {
      setIsXNext(currentPlayer === 'X' ? false : true);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsXNext(true);
    setHasAwardedXP(false);
  };

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 font-mono text-white p-4">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">⭕ TIC-TAC-TOE ❌</h2>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={() => { setDifficulty('easy'); setGameStarted(true); }} className="bg-green-600 hover:bg-green-500 py-3 rounded text-lg font-bold">Easy (Random)</button>
          <button onClick={() => { setDifficulty('medium'); setGameStarted(true); }} className="bg-yellow-600 hover:bg-yellow-500 py-3 rounded text-lg font-bold">Medium (Balanced)</button>
          <button onClick={() => { setDifficulty('hard'); setGameStarted(true); }} className="bg-red-600 hover:bg-red-500 py-3 rounded text-lg font-bold">Hard (Unbeatable)</button>
          <button onClick={() => { setDifficulty('pvp'); setGameStarted(true); }} className="bg-purple-600 hover:bg-purple-500 py-3 rounded text-lg font-bold">PvP (Multiplayer)</button>
        </div>
        <button onClick={onExit} className="text-slate-500 hover:text-slate-300 underline mt-4">Back to Terminal</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 font-mono select-none">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-300 mb-2">
          Mode: <span className="text-blue-400 uppercase">{difficulty}</span>
        </h2>
        {winner ? (
          <div className={`text-2xl font-bold ${winner === 'Draw' ? 'text-yellow-400' : 'text-green-400'} animate-bounce`}>
            {winner === 'Draw' ? 'GAME DRAW!' : `WINNER: ${winner}`}
          </div>
        ) : (
          <div className="text-lg text-slate-400">
            Turn: <span className={isXNext ? 'text-blue-400' : 'text-red-400'}>{isXNext ? 'PLAYER (X)' : (difficulty === 'pvp' ? 'PLAYER (O)' : 'AI (O)')}</span>
            {aiThinking && <span className="animate-pulse ml-2">...</span>}
          </div>
        )}
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2 bg-slate-700 p-2 rounded-lg shadow-2xl">
        {board.map((val, idx) => (
          <button
            key={idx}
            onClick={() => !aiThinking && handleMove(idx)}
            disabled={!!val || !!winner || (difficulty !== 'pvp' && !isXNext)}
            className={`w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded flex items-center justify-center text-4xl font-bold transition-all transform hover:scale-105 active:scale-95 disabled:hover:scale-100
              ${val === 'X' ? 'text-blue-500' : 'text-red-500'}
              ${!val && !winner && 'hover:bg-slate-800'}
            `}
          >
            {val}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-4">
        <button 
          onClick={resetGame} 
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm"
        >
          Restart Game
        </button>
        <button 
          onClick={() => setGameStarted(false)} 
          className="px-4 py-2 border border-slate-600 hover:bg-slate-800 rounded text-slate-300 text-sm"
        >
          Change Mode
        </button>
        <button 
          onClick={onExit} 
          className="px-4 py-2 text-red-400 hover:text-red-300 underline text-sm"
        >
          Exit
        </button>
      </div>
    </div>
  );
};
