import React, { useState, useCallback, useRef } from 'react';
import { X, RotateCcw, Wifi, WifiOff, SlidersHorizontal } from 'lucide-react';

interface ChessGameProps {
  onClose: () => void;
  addXP: (amount: number, reason: string) => void;
}

type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
type PieceColor = 'white' | 'black';
type Piece = { type: PieceType; color: PieceColor } | null;
type Board = Piece[][];
type Difficulty = 'easy' | 'medium' | 'hard' | 'dark' | 'custom';

const PIECE_SYMBOLS: Record<PieceColor, Record<PieceType, string>> = {
  white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
  black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' },
};

// SVG piece images
const PIECE_SVG: Record<PieceColor, Record<PieceType, string>> = {
  white: { 
    king: '/image/pieces-svg/king-w.svg', 
    queen: '/image/pieces-svg/queen-w.svg', 
    rook: '/image/pieces-svg/rook-w.svg', 
    bishop: '/image/pieces-svg/bishop-w.svg', 
    knight: '/image/pieces-svg/knight-w.svg', 
    pawn: '/image/pieces-svg/pawn-w.svg' 
  },
  black: { 
    king: '/image/pieces-svg/king-b.svg', 
    queen: '/image/pieces-svg/queen-b.svg', 
    rook: '/image/pieces-svg/rook-b.svg', 
    bishop: '/image/pieces-svg/bishop-b.svg', 
    knight: '/image/pieces-svg/knight-b.svg', 
    pawn: '/image/pieces-svg/pawn-b.svg' 
  },
};

const PIECE_VALUES: Record<PieceType, number> = {
  pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 100
};

const PIECE_LETTERS: Record<PieceType, string> = {
  pawn: 'p', knight: 'n', bishop: 'b', rook: 'r', queen: 'q', king: 'k'
};

const createInitialBoard = (): Board => {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  board[0] = [
    { type: 'rook', color: 'black' }, { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' },
  ];
  board[1] = Array(8).fill(null).map(() => ({ type: 'pawn' as PieceType, color: 'black' as PieceColor }));
  
  board[6] = Array(8).fill(null).map(() => ({ type: 'pawn' as PieceType, color: 'white' as PieceColor }));
  board[7] = [
    { type: 'rook', color: 'white' }, { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' },
  ];
  
  return board;
};

// Convert board position to FEN
const boardToFEN = (board: Board, turn: PieceColor): string => {
  let fen = '';
  
  for (let row = 0; row < 8; row++) {
    let emptyCount = 0;
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }
        let letter = PIECE_LETTERS[piece.type];
        if (piece.color === 'white') letter = letter.toUpperCase();
        fen += letter;
      }
    }
    if (emptyCount > 0) fen += emptyCount;
    if (row < 7) fen += '/';
  }
  
  fen += ` ${turn === 'white' ? 'w' : 'b'} KQkq - 0 1`;
  return fen;
};

// Convert algebraic notation to board coordinates
const algebraicToCoords = (algebraic: string): [number, number] => {
  const col = algebraic.charCodeAt(0) - 'a'.charCodeAt(0);
  const row = 8 - parseInt(algebraic[1]);
  return [row, col];
};

const DIFFICULTY_CONFIG = {
  easy: { depth: 5, label: 'Easy', description: 'Beginner friendly', color: 'bg-green-600', thinkTime: 50 },
  medium: { depth: 10, label: 'Medium', description: 'Casual player', color: 'bg-yellow-600', thinkTime: 50 },
  hard: { depth: 14, label: 'Hard', description: 'Advanced tactics', color: 'bg-orange-600', thinkTime: 80 },
  dark: { depth: 18, label: '💀 DARK', description: 'Stockfish maximum', color: 'bg-purple-900', thinkTime: 100 },
  custom: { depth: 12, label: '🏚️ Custom', description: 'Choose your depth', color: 'bg-cyan-600', thinkTime: 50 },
};

const MAX_API_DEPTH = 18;

export const ChessGame: React.FC<ChessGameProps> = ({ onClose, addXP }) => {
  const [board, setBoard] = useState<Board>(createInitialBoard);
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [currentTurn, setCurrentTurn] = useState<PieceColor>('white');
  const [gameStatus, setGameStatus] = useState<'select' | 'playing' | 'checkmate' | 'stalemate'>('select');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [capturedPieces, setCapturedPieces] = useState<{ white: Piece[], black: Piece[] }>({ white: [], black: [] });
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [apiStatus, setApiStatus] = useState<'connected' | 'error' | 'idle'>('idle');
  const [evaluation, setEvaluation] = useState<number | null>(null);
  const [customDepth, setCustomDepth] = useState(12);
  const wsRef = useRef<WebSocket | null>(null);

  // Get valid moves for a piece
  const getValidMoves = useCallback((board: Board, row: number, col: number): [number, number][] => {
    const piece = board[row][col];
    if (!piece) return [];
    
    const moves: [number, number][] = [];
    const { type, color } = piece;
    const direction = color === 'white' ? -1 : 1;

    const isValidSquare = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
    const isEmpty = (r: number, c: number) => isValidSquare(r, c) && !board[r][c];
    const isEnemy = (r: number, c: number) => isValidSquare(r, c) && board[r][c]?.color !== color && board[r][c] !== null;
    const canMoveTo = (r: number, c: number) => isEmpty(r, c) || isEnemy(r, c);

    switch (type) {
      case 'pawn':
        if (isEmpty(row + direction, col)) {
          moves.push([row + direction, col]);
          const startRow = color === 'white' ? 6 : 1;
          if (row === startRow && isEmpty(row + 2 * direction, col)) {
            moves.push([row + 2 * direction, col]);
          }
        }
        if (isEnemy(row + direction, col - 1)) moves.push([row + direction, col - 1]);
        if (isEnemy(row + direction, col + 1)) moves.push([row + direction, col + 1]);
        break;

      case 'knight':
        const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
        knightMoves.forEach(([dr, dc]) => {
          if (canMoveTo(row + dr, col + dc)) moves.push([row + dr, col + dc]);
        });
        break;

      case 'bishop':
        for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
          for (let i = 1; i < 8; i++) {
            const r = row + dr * i, c = col + dc * i;
            if (!isValidSquare(r, c)) break;
            if (isEmpty(r, c)) moves.push([r, c]);
            else if (isEnemy(r, c)) { moves.push([r, c]); break; }
            else break;
          }
        }
        break;

      case 'rook':
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          for (let i = 1; i < 8; i++) {
            const r = row + dr * i, c = col + dc * i;
            if (!isValidSquare(r, c)) break;
            if (isEmpty(r, c)) moves.push([r, c]);
            else if (isEnemy(r, c)) { moves.push([r, c]); break; }
            else break;
          }
        }
        break;

      case 'queen':
        for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
          for (let i = 1; i < 8; i++) {
            const r = row + dr * i, c = col + dc * i;
            if (!isValidSquare(r, c)) break;
            if (isEmpty(r, c)) moves.push([r, c]);
            else if (isEnemy(r, c)) { moves.push([r, c]); break; }
            else break;
          }
        }
        break;

      case 'king':
        for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
          if (canMoveTo(row + dr, col + dc)) moves.push([row + dr, col + dc]);
        }
        break;
    }

    return moves;
  }, []);

  // Check if a king is in check
  const isKingInCheck = useCallback((board: Board, color: PieceColor): boolean => {
    let kingPos: [number, number] | null = null;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c]?.type === 'king' && board[r][c]?.color === color) {
          kingPos = [r, c];
          break;
        }
      }
    }
    if (!kingPos) return false;

    const enemyColor = color === 'white' ? 'black' : 'white';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c]?.color === enemyColor) {
          const moves = getValidMoves(board, r, c);
          if (moves.some(([mr, mc]) => mr === kingPos![0] && mc === kingPos![1])) {
            return true;
          }
        }
      }
    }
    return false;
  }, [getValidMoves]);

  // Get legal moves
  const getLegalMoves = useCallback((board: Board, row: number, col: number): [number, number][] => {
    const piece = board[row][col];
    if (!piece) return [];
    
    const validMoves = getValidMoves(board, row, col);
    return validMoves.filter(([toRow, toCol]) => {
      const newBoard = board.map(r => [...r]);
      newBoard[toRow][toCol] = newBoard[row][col];
      newBoard[row][col] = null;
      return !isKingInCheck(newBoard, piece.color);
    });
  }, [getValidMoves, isKingInCheck]);

  // Check for checkmate or stalemate
  const checkGameEnd = useCallback((board: Board, color: PieceColor): 'checkmate' | 'stalemate' | null => {
    let hasLegalMoves = false;
    for (let r = 0; r < 8 && !hasLegalMoves; r++) {
      for (let c = 0; c < 8 && !hasLegalMoves; c++) {
        if (board[r][c]?.color === color) {
          if (getLegalMoves(board, r, c).length > 0) {
            hasLegalMoves = true;
          }
        }
      }
    }

    if (!hasLegalMoves) {
      return isKingInCheck(board, color) ? 'checkmate' : 'stalemate';
    }
    return null;
  }, [getLegalMoves, isKingInCheck]);

  // Get all legal moves for a color (for fallback)
  const getAllLegalMoves = useCallback((board: Board, color: PieceColor): { from: [number, number], to: [number, number] }[] => {
    const moves: { from: [number, number], to: [number, number] }[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c]?.color === color) {
          const legalMoves = getLegalMoves(board, r, c);
          legalMoves.forEach(([toR, toC]) => {
            moves.push({ from: [r, c], to: [toR, toC] });
          });
        }
      }
    }
    return moves;
  }, [getLegalMoves]);

  // Call Chess API for best move with retry logic
  const getAIMove = useCallback(async (board: Board, diff: Difficulty): Promise<string | null> => {
    const fen = boardToFEN(board, 'black');
    const config = DIFFICULTY_CONFIG[diff];
    const depth = diff === 'custom' ? customDepth : config.depth;
    
    const maxRetries = 3;
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          setApiStatus('idle'); // Show reconnecting
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        }
        
        setApiStatus('connected');
        
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await fetch('https://chess-api.com/v1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fen,
            depth,
            maxThinkingTime: Math.max(50, depth * 5),
          }),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.eval !== undefined) {
          setEvaluation(data.eval);
        }
        
        // The API returns move in format like "e7e5" or "b7b8q" for promotion
        if (data.move || data.lan) {
          setApiStatus('connected');
          return data.move || data.lan;
        }
        
        throw new Error('No move in response');
      } catch (error) {
        lastError = error as Error;
        console.error(`Chess API attempt ${attempt + 1} failed:`, error);
      }
    }
    
    // All retries failed - use fallback random move
    console.warn('All API retries failed, using fallback random move');
    setApiStatus('error');
    
    // Generate a random legal move as fallback
    const allMoves = getAllLegalMoves(board, 'black');
    if (allMoves.length > 0) {
      const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
      const files = 'abcdefgh';
      const fromSquare = `${files[randomMove.from[1]]}${8 - randomMove.from[0]}`;
      const toSquare = `${files[randomMove.to[1]]}${8 - randomMove.to[0]}`;
      return `${fromSquare}${toSquare}`;
    }
    
    return null;
  }, [customDepth, getAllLegalMoves]);

  // Make AI move
  const makeAIMove = useCallback(async (board: Board, diff: Difficulty) => {
    setIsThinking(true);
    
    const move = await getAIMove(board, diff);
    
    if (move && move.length >= 4) {
      const fromSquare = move.substring(0, 2);
      const toSquare = move.substring(2, 4);
      const promotion = move.length > 4 ? move[4] : null;
      
      const [fromRow, fromCol] = algebraicToCoords(fromSquare);
      const [toRow, toCol] = algebraicToCoords(toSquare);
      
      const newBoard = board.map(r => [...r]);
      const capturedPiece = newBoard[toRow][toCol];
      const movedPiece = newBoard[fromRow][fromCol];
      
      // Handle promotion
      if (promotion && movedPiece?.type === 'pawn') {
        const promotionTypes: Record<string, PieceType> = { q: 'queen', r: 'rook', b: 'bishop', n: 'knight' };
        newBoard[toRow][toCol] = { type: promotionTypes[promotion] || 'queen', color: 'black' };
      } else {
        newBoard[toRow][toCol] = movedPiece;
      }
      newBoard[fromRow][fromCol] = null;
      
      if (capturedPiece) {
        setCapturedPieces(prev => ({ ...prev, black: [...prev.black, capturedPiece] }));
      }

      const files = 'abcdefgh';
      const notation = `${movedPiece?.type === 'pawn' ? '' : movedPiece?.type[0].toUpperCase()}${files[fromCol]}${8 - fromRow}-${files[toCol]}${8 - toRow}`;
      setMoveHistory(prev => [...prev, notation]);
      
      setBoard(newBoard);
      
      const gameEnd = checkGameEnd(newBoard, 'white');
      if (gameEnd) {
        setGameStatus(gameEnd);
        if (gameEnd === 'checkmate') {
          addXP(10, 'chess_loss');
        }
      } else {
        setCurrentTurn('white');
      }
    } else {
      setApiStatus('error');
    }
    
    setIsThinking(false);
  }, [getAIMove, checkGameEnd, addXP]);

  // Handle square click
  const handleSquareClick = (row: number, col: number) => {
    if (gameStatus !== 'playing' || currentTurn !== 'white' || isThinking) return;

    const piece = board[row][col];

    if (selectedSquare) {
      const [selRow, selCol] = selectedSquare;
      const legalMoves = getLegalMoves(board, selRow, selCol);
      
      if (legalMoves.some(([r, c]) => r === row && c === col)) {
        const newBoard = board.map(r => [...r]);
        const capturedPiece = newBoard[row][col];
        const movedPiece = newBoard[selRow][selCol];
        
        // Pawn promotion
        if (movedPiece?.type === 'pawn' && row === 0) {
          newBoard[row][col] = { type: 'queen', color: 'white' };
        } else {
          newBoard[row][col] = movedPiece;
        }
        newBoard[selRow][selCol] = null;
        
        if (capturedPiece) {
          setCapturedPieces(prev => ({ ...prev, white: [...prev.white, capturedPiece] }));
          addXP(PIECE_VALUES[capturedPiece.type], `chess_capture_${Date.now()}`);
        }

        const files = 'abcdefgh';
        const notation = `${movedPiece?.type === 'pawn' ? '' : movedPiece?.type[0].toUpperCase()}${files[selCol]}${8 - selRow}-${files[col]}${8 - row}`;
        setMoveHistory(prev => [...prev, notation]);
        
        setBoard(newBoard);
        setSelectedSquare(null);
        
        const gameEnd = checkGameEnd(newBoard, 'black');
        if (gameEnd) {
          setGameStatus(gameEnd);
          if (gameEnd === 'checkmate') {
            let xpReward = 50;
            if (difficulty === 'dark') xpReward = 500;
            else if (difficulty === 'hard') xpReward = 200;
            else if (difficulty === 'medium') xpReward = 100;
            else if (difficulty === 'custom') xpReward = Math.round(customDepth * 25);
            addXP(xpReward, 'chess_win');
          }
        } else {
          setCurrentTurn('black');
          makeAIMove(newBoard, difficulty);
        }
      } else if (piece?.color === 'white') {
        setSelectedSquare([row, col]);
      } else {
        setSelectedSquare(null);
      }
    } else if (piece?.color === 'white') {
      setSelectedSquare([row, col]);
    }
  };

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setBoard(createInitialBoard());
    setSelectedSquare(null);
    setCurrentTurn('white');
    setGameStatus('playing');
    setCapturedPieces({ white: [], black: [] });
    setMoveHistory([]);
    setIsThinking(false);
    setApiStatus('idle');
    setEvaluation(null);
    addXP(2, 'chess_start');
  };

  const resetGame = () => {
    setGameStatus('select');
  };

  const legalMoves = selectedSquare ? getLegalMoves(board, selectedSquare[0], selectedSquare[1]) : [];
  const inCheck = gameStatus === 'playing' && isKingInCheck(board, currentTurn);

  // Difficulty Selection Screen
  if (gameStatus === 'select') {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
        <div className="bg-slate-900 rounded-xl border border-slate-700 shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">♟️</span>
              <div>
                <h2 className="text-xl font-bold text-white">Chess vs Stockfish</h2>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Powered by chess-api.com</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-slate-400 mb-6 text-center">Select Difficulty (Stockfish Depth)</p>

          <div className="space-y-3">
            {/* Preset difficulties */}
            {(['easy', 'medium', 'hard', 'dark'] as Difficulty[]).map((diff) => {
              const config = DIFFICULTY_CONFIG[diff];
              return (
                <button
                  key={diff}
                  onClick={() => startGame(diff)}
                  className={`w-full ${config.color} hover:brightness-110 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${diff === 'dark' ? 'animate-pulse ring-2 ring-purple-500' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg">{config.label}</span>
                    <span className="text-xs opacity-70">Depth {config.depth}</span>
                  </div>
                  <div className="text-xs opacity-80 text-left">{config.description}</div>
                </button>
              );
            })}

            {/* Custom mode with slider */}
            <div className="border-t border-slate-700 pt-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-400 font-bold">Custom Depth</span>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400 text-sm">Depth: <span className="text-cyan-400 font-bold text-lg">{customDepth}</span></span>
                  <span className="text-slate-500 text-xs">Max: {MAX_API_DEPTH}</span>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max={MAX_API_DEPTH}
                  value={customDepth}
                  onChange={(e) => setCustomDepth(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1 (Easy)</span>
                  <span>18 (Max)</span>
                </div>
                
                <button
                  onClick={() => startGame('custom')}
                  className="w-full mt-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Play with Depth {customDepth}
                </button>
              </div>
            </div>
          </div>

          <p className="text-slate-600 text-xs text-center mt-6">
            🟢 You found the hidden chess game!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <div className={`bg-slate-900 rounded-xl border shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-auto ${difficulty === 'dark' ? 'border-purple-600' : 'border-slate-700'}`}>
        {/* Header */}
        <div className={`px-4 py-3 flex items-center justify-between border-b ${difficulty === 'dark' ? 'border-purple-600 bg-purple-900/30' : 'border-slate-700'}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">♟️</span>
            <div>
              <h2 className="text-lg font-bold text-white">Chess vs Stockfish</h2>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded ${DIFFICULTY_CONFIG[difficulty].color}`}>
                  {DIFFICULTY_CONFIG[difficulty].label}
                </span>
                {apiStatus === 'connected' && <Wifi className="w-3 h-3 text-green-400" />}
                {apiStatus === 'error' && <WifiOff className="w-3 h-3 text-red-400" />}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={resetGame} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white" title="Change Difficulty">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 flex flex-col lg:flex-row gap-4">
          {/* Board */}
          <div className="flex-shrink-0">
            <div className="relative inline-block">
              <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-around text-slate-500 text-sm">
                {[8,7,6,5,4,3,2,1].map(n => <span key={n}>{n}</span>)}
              </div>
              
              <div className={`grid grid-cols-8 border-2 rounded overflow-hidden ${difficulty === 'dark' ? 'border-purple-600' : 'border-slate-600'}`}>
                {board.map((row, rowIdx) =>
                  row.map((piece, colIdx) => {
                    const isLight = (rowIdx + colIdx) % 2 === 0;
                    const isSelected = selectedSquare?.[0] === rowIdx && selectedSquare?.[1] === colIdx;
                    const isLegalMove = legalMoves.some(([r, c]) => r === rowIdx && c === colIdx);
                    const isKingCheckSquare = piece?.type === 'king' && piece?.color === currentTurn && inCheck;

                    let bgColor = isLight ? 'bg-amber-100' : 'bg-amber-700';
                    if (difficulty === 'dark') {
                      bgColor = isLight ? 'bg-purple-200' : 'bg-purple-900';
                    }

                    return (
                      <button
                        key={`${rowIdx}-${colIdx}`}
                        onClick={() => handleSquareClick(rowIdx, colIdx)}
                        disabled={isThinking || gameStatus !== 'playing'}
                        className={`
                          w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl
                          transition-all duration-150 relative
                          ${bgColor}
                          ${isSelected ? 'ring-4 ring-blue-500 ring-inset' : ''}
                          ${isKingCheckSquare ? 'bg-red-500/50' : ''}
                          ${isThinking ? 'cursor-wait' : 'cursor-pointer hover:brightness-110'}
                        `}
                      >
                        {piece && (
                          <img 
                            src={PIECE_SVG[piece.color][piece.type]} 
                            alt={`${piece.color} ${piece.type}`}
                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 drop-shadow-md pointer-events-none"
                            draggable={false}
                          />
                        )}
                        {isLegalMove && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`${piece ? 'w-full h-full border-4 border-green-500/50' : 'w-3 h-3 bg-green-500/50 rounded-full'}`} />
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
              
              <div className="flex justify-around text-slate-500 text-sm mt-1 px-1">
                {['a','b','c','d','e','f','g','h'].map(l => <span key={l}>{l}</span>)}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="flex-1 min-w-[200px] space-y-4">
            {/* Status */}
            <div className={`p-3 rounded-lg ${
              gameStatus === 'checkmate' ? 'bg-red-500/20 border border-red-500' :
              gameStatus === 'stalemate' ? 'bg-yellow-500/20 border border-yellow-500' :
              inCheck ? 'bg-orange-500/20 border border-orange-500' :
              difficulty === 'dark' ? 'bg-purple-900/50 border border-purple-600' : 'bg-slate-800'
            }`}>
              {gameStatus === 'checkmate' && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">Checkmate!</div>
                  <div className="text-slate-300">{currentTurn === 'white' ? 'Stockfish' : 'You'} wins!</div>
                  {currentTurn === 'white' && difficulty === 'dark' && (
                    <div className="text-purple-400 text-sm mt-1">The darkness consumed you... 💀</div>
                  )}
                </div>
              )}
              {gameStatus === 'stalemate' && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">Stalemate!</div>
                  <div className="text-slate-300">It's a draw!</div>
                </div>
              )}
              {gameStatus === 'playing' && (
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {isThinking ? (
                      apiStatus === 'error' ? '🔄 Retrying...' : '🤔 Stockfish thinking...'
                    ) : currentTurn === 'white' ? '⚪ Your Turn' : '⚫ AI Turn'}
                  </div>
                  {inCheck && <div className="text-orange-400 font-bold">⚠️ Check!</div>}
                  {evaluation !== null && (
                    <div className="text-xs text-slate-400 mt-1">
                      Eval: {evaluation > 0 ? '+' : ''}{evaluation.toFixed(2)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Captured Pieces */}
            <div className={`rounded-lg p-3 ${difficulty === 'dark' ? 'bg-purple-900/30' : 'bg-slate-800'}`}>
              <div className="text-sm text-slate-400 mb-2">Captured</div>
              <div className="flex flex-wrap items-center gap-1 mb-2">
                <span className="text-xs text-slate-500">You:</span>
                {capturedPieces.white.map((p, i) => (
                  p && <img key={i} src={PIECE_SVG[p.color][p.type]} alt="" className="w-5 h-5" />
                ))}
                {capturedPieces.white.length === 0 && <span className="text-slate-600 text-sm">-</span>}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-xs text-slate-500">AI:</span>
                {capturedPieces.black.map((p, i) => (
                  p && <img key={i} src={PIECE_SVG[p.color][p.type]} alt="" className="w-5 h-5" />
                ))}
                {capturedPieces.black.length === 0 && <span className="text-slate-600 text-sm">-</span>}
              </div>
            </div>

            {/* Move History */}
            <div className={`rounded-lg p-3 max-h-32 overflow-y-auto ${difficulty === 'dark' ? 'bg-purple-900/30' : 'bg-slate-800'}`}>
              <div className="text-sm text-slate-400 mb-2">Moves</div>
              <div className="text-xs text-slate-300 font-mono flex flex-wrap gap-x-2 gap-y-1">
                {moveHistory.length === 0 && <span className="text-slate-600">-</span>}
                {moveHistory.map((move, i) => (
                  <span key={i}>
                    {i % 2 === 0 && <span className="text-slate-500">{Math.floor(i/2)+1}.</span>}
                    {move}
                  </span>
                ))}
              </div>
            </div>

            {/* XP Rewards */}
            <div className="text-xs text-slate-500 space-y-1 border-t border-slate-700 pt-3">
              <p>♙ XP Rewards:</p>
              <p>• Capture pieces: +1-9 XP</p>
              <p>• Win: +{difficulty === 'dark' ? '500' : difficulty === 'hard' ? '200' : difficulty === 'medium' ? '100' : difficulty === 'custom' ? (customDepth * 25) : '50'} XP</p>
              <p className="text-slate-600 mt-2">Powered by chess-api.com (Stockfish 17)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
