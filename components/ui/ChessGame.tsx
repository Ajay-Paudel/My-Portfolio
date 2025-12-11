import React, { useState, useCallback, useRef, useEffect } from 'react';
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
// Convert board position to FEN
const boardToFEN = (board: Board, turn: PieceColor, castlingRights: { whiteKing: boolean, whiteQueen: boolean, blackKing: boolean, blackQueen: boolean }): string => {
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
  
  let castling = '';
  if (castlingRights.whiteKing) castling += 'K';
  if (castlingRights.whiteQueen) castling += 'Q';
  if (castlingRights.blackKing) castling += 'k';
  if (castlingRights.blackQueen) castling += 'q';
  if (castling === '') castling = '-';
  
  fen += ` ${turn === 'white' ? 'w' : 'b'} ${castling} - 0 1`;
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
  // Castling rights: track if king/rooks have moved
  const [castlingRights, setCastlingRights] = useState({
    whiteKing: true,   // Can white castle king-side?
    whiteQueen: true,  // Can white castle queen-side?
    blackKing: true,   // Can black castle king-side?
    blackQueen: true,  // Can black castle queen-side?
  });
  
  const stockfishWorker = useRef<Worker | null>(null);
  const engineMoveResolve = useRef<((move: string | null) => void) | null>(null);
  const [engineLoaded, setEngineLoaded] = useState(false);

  // Initialize Stockfish Engine
  useEffect(() => {
    try {
      const worker = new Worker('./stockfish.js');
      stockfishWorker.current = worker;
      
      worker.onmessage = (event) => {
        const line = event.data;
        // console.log('Stockfish:', line);
        
        if (line === 'uciok') {
          setEngineLoaded(true);
        } else if (line === 'readyok') {
          setApiStatus('connected');
        } else if (line.startsWith('bestmove')) {
          const move = line.split(' ')[1];
          if (engineMoveResolve.current) {
            engineMoveResolve.current(move);
            engineMoveResolve.current = null;
          }
          setIsThinking(false);
        } else if (line.startsWith('info') && line.includes('score cp')) {
          const parts = line.split(' ');
          const scoreIndex = parts.indexOf('cp');
          if (scoreIndex !== -1 && parts[scoreIndex + 1]) {
            const cp = parseInt(parts[scoreIndex + 1]);
            // Engine score is from engine's perspective, need to invert if black to show white advantage?
            // Usually CP is absolute or relative to side to move. Stockfish is usually relative.
            // If it's black's turn (AI), positive score means black is winning.
            // visual evaluation usually expects positive = white winning.
            // So if black to move, invert.
            setEvaluation(currentTurn === 'black' ? -cp : cp);
          }
        } else if (line.startsWith('info') && line.includes('score mate')) {
             // Handle mate score if needed
        }
      };

      worker.postMessage('uci');
      
      return () => {
        worker.terminate();
      };
    } catch (error) {
      console.error('Failed to load Stockfish:', error);
      setApiStatus('error');
    }
  }, []);

  // Get valid moves for a piece
  const getValidMoves = useCallback((board: Board, row: number, col: number): [number, number][] => {
    const piece = board[row][col];
    if (!piece) return [];
    
    const moves: [number, number][] = [];
    const { type, color } = piece;

    const isValidSquare = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
    const isEmpty = (r: number, c: number) => board[r][c] === null;
    const isEnemy = (r: number, c: number) => board[r][c]?.color !== color;
    const canMoveTo = (r: number, c: number) => isValidSquare(r, c) && (isEmpty(r, c) || isEnemy(r, c));

    switch (type) {
      case 'pawn':
        const direction = color === 'white' ? -1 : 1;
        // Move forward 1
        if (isValidSquare(row + direction, col) && isEmpty(row + direction, col)) {
          moves.push([row + direction, col]);
          // Move forward 2
          const startRow = color === 'white' ? 6 : 1;
          if (row === startRow && isEmpty(row + direction * 2, col)) {
            moves.push([row + direction * 2, col]);
          }
        }
        // Captures
        for (const dc of [-1, 1]) {
          if (isValidSquare(row + direction, col + dc) && isEnemy(row + direction, col + dc)) {
            moves.push([row + direction, col + dc]);
          }
        }
        break;

      case 'knight':
        for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
          if (canMoveTo(row + dr, col + dc)) moves.push([row + dr, col + dc]);
        }
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
        // Castling moves will be added separately since we need game state
        break;
    }

    return moves;
  }, []);

  // Check if a king is in check
  const isKingInCheck = useCallback((board: Board, color: PieceColor): boolean => {
    // Find king
    let kingPos: [number, number] | null = null;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c]?.type === 'king' && board[r][c]?.color === color) {
          kingPos = [r, c];
          break;
        }
      }
      if (kingPos) break;
    }

    if (!kingPos) return false; // Should not happen

    // Check if any enemy piece can attack king
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

  // Get legal moves (including castling for kings)
  const getLegalMoves = useCallback((board: Board, row: number, col: number): [number, number][] => {
    const piece = board[row][col];
    if (!piece) return [];
    
    const validMoves = getValidMoves(board, row, col);
    const legalMoves = validMoves.filter(([toRow, toCol]) => {
      const newBoard = board.map(r => [...r]);
      newBoard[toRow][toCol] = newBoard[row][col];
      newBoard[row][col] = null;
      return !isKingInCheck(newBoard, piece.color);
    });

    // Add castling moves for king
    if (piece.type === 'king') {
      const kingRow = piece.color === 'white' ? 7 : 0;
      
      // Only check if king is on starting position
      if (row === kingRow && col === 4) {
        // Check not in check currently
        if (!isKingInCheck(board, piece.color)) {
          // King-side castling (O-O)
          const canKingSide = piece.color === 'white' ? castlingRights.whiteKing : castlingRights.blackKing;
          if (canKingSide) {
            // Check squares between king and rook are empty
            if (!board[kingRow][5] && !board[kingRow][6]) {
              // Check rook is still there
              const rook = board[kingRow][7];
              if (rook?.type === 'rook' && rook?.color === piece.color) {
                // Check king doesn't pass through check (f1/f8) and end in check (g1/g8)
                const testBoard1 = board.map(r => [...r]);
                testBoard1[kingRow][5] = testBoard1[kingRow][4];
                testBoard1[kingRow][4] = null;
                
                const testBoard2 = board.map(r => [...r]);
                testBoard2[kingRow][6] = testBoard2[kingRow][4];
                testBoard2[kingRow][4] = null;
                
                if (!isKingInCheck(testBoard1, piece.color) && !isKingInCheck(testBoard2, piece.color)) {
                  legalMoves.push([kingRow, 6]); // King moves to g1/g8
                }
              }
            }
          }
          
          // Queen-side castling (O-O-O)
          const canQueenSide = piece.color === 'white' ? castlingRights.whiteQueen : castlingRights.blackQueen;
          if (canQueenSide) {
            // Check squares between king and rook are empty
            if (!board[kingRow][1] && !board[kingRow][2] && !board[kingRow][3]) {
              // Check rook is still there
              const rook = board[kingRow][0];
              if (rook?.type === 'rook' && rook?.color === piece.color) {
                // Check king doesn't pass through check (d1/d8) and end in check (c1/c8)
                const testBoard1 = board.map(r => [...r]);
                testBoard1[kingRow][3] = testBoard1[kingRow][4];
                testBoard1[kingRow][4] = null;
                
                const testBoard2 = board.map(r => [...r]);
                testBoard2[kingRow][2] = testBoard2[kingRow][4];
                testBoard2[kingRow][4] = null;
                
                if (!isKingInCheck(testBoard1, piece.color) && !isKingInCheck(testBoard2, piece.color)) {
                  legalMoves.push([kingRow, 2]); // King moves to c1/c8
                }
              }
            }
          }
        }
      }
    }

    return legalMoves;
  }, [getValidMoves, isKingInCheck, castlingRights]);

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

  // Make AI move
  const makeAIMove = useCallback(async (board: Board, diff: Difficulty) => {
    if (!stockfishWorker.current) return;
    
    setIsThinking(true);
    setApiStatus('connected');
    
    const fen = boardToFEN(board, 'black', castlingRights);
    const config = DIFFICULTY_CONFIG[diff];
    const depth = diff === 'custom' ? customDepth : config.depth;
    
    // Send info to worker
    stockfishWorker.current.postMessage('position fen ' + fen);
    stockfishWorker.current.postMessage('go depth ' + depth);
    
    // Use promise to wait for move from worker flow
    const movePromise = new Promise<string | null>((resolve) => {
      engineMoveResolve.current = resolve;
      // Fallback timeout
      setTimeout(() => {
        if (engineMoveResolve.current) {
          console.warn('Stockfish timeout, making random move');
          engineMoveResolve.current(null); // Will trigger fallback
          engineMoveResolve.current = null;
        }
      }, 20000);
    });

    const move = await movePromise;
    
    if (move && move.length >= 4) {
      const fromSquare = move.substring(0, 2);
      const toSquare = move.substring(2, 4);
      const promotion = move.length > 4 ? move[4] : null;
      
      const [fromRow, fromCol] = algebraicToCoords(fromSquare);
      const [toRow, toCol] = algebraicToCoords(toSquare);
      
      const newBoard = board.map(r => [...r]);
      const capturedPiece = newBoard[toRow][toCol];
      const movedPiece = newBoard[fromRow][fromCol];
      
      let notation = '';
      const files = 'abcdefgh';
      
      // Check if this is a castling move (king moving 2 squares)
      const isCastling = movedPiece?.type === 'king' && Math.abs(toCol - fromCol) === 2;
      
      if (isCastling) {
        // Execute castling for AI (black)
        const isKingSide = toCol > fromCol;
        if (isKingSide) {
          // King-side: King to g8, Rook from h8 to f8
          newBoard[0][6] = movedPiece;
          newBoard[0][4] = null;
          newBoard[0][5] = newBoard[0][7];
          newBoard[0][7] = null;
          notation = 'O-O';
        } else {
          // Queen-side: King to c8, Rook from a8 to d8
          newBoard[0][2] = movedPiece;
          newBoard[0][4] = null;
          newBoard[0][3] = newBoard[0][0];
          newBoard[0][0] = null;
          notation = 'O-O-O';
        }
        // Remove all castling rights for black
        setCastlingRights(prev => ({ ...prev, blackKing: false, blackQueen: false }));
      } else {
        // Normal move
        // Handle promotion
        if (promotion && movedPiece?.type === 'pawn') {
          const promotionTypes: Record<string, PieceType> = { q: 'queen', r: 'rook', b: 'bishop', n: 'knight' };
          newBoard[toRow][toCol] = { type: promotionTypes[promotion] || 'queen', color: 'black' };
        } else {
          newBoard[toRow][toCol] = movedPiece;
        }
        newBoard[fromRow][fromCol] = null;
        notation = `${movedPiece?.type === 'pawn' ? '' : movedPiece?.type[0].toUpperCase()}${files[fromCol]}${8 - fromRow}-${files[toCol]}${8 - toRow}`;
        
        // Update castling rights based on moved piece
        if (movedPiece?.type === 'king') {
          setCastlingRights(prev => ({ ...prev, blackKing: false, blackQueen: false }));
        } else if (movedPiece?.type === 'rook') {
          if (fromCol === 0) setCastlingRights(prev => ({ ...prev, blackQueen: false }));
          if (fromCol === 7) setCastlingRights(prev => ({ ...prev, blackKing: false }));
        }
      }
      
      if (capturedPiece) {
        setCapturedPieces(prev => ({ ...prev, black: [...prev.black, capturedPiece] }));
        // If capturing a rook in corner, remove that castling right for white
        if (capturedPiece.type === 'rook') {
          if (toRow === 7 && toCol === 0) setCastlingRights(prev => ({ ...prev, whiteQueen: false }));
          if (toRow === 7 && toCol === 7) setCastlingRights(prev => ({ ...prev, whiteKing: false }));
        }
      }

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
       // Fallback: Random move
       setApiStatus('error');
       const allMoves = getAllLegalMoves(board, 'black');
       if (allMoves.length > 0) {
          const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
          const newBoard = board.map(r => [...r]);
          // Simplified execution for random move (no castling/promotion checks for random fallback usually needed or acceptable risk)
          // Actually let's use the main logic if possible, but we don't have notation.
          // Let's just do a basic move.
          const fromR = randomMove.from[0];
          const fromC = randomMove.from[1];
          const toR = randomMove.to[0];
          const toC = randomMove.to[1];
          
          newBoard[toR][toC] = newBoard[fromR][fromC];
          newBoard[fromR][fromC] = null;
          
          setBoard(newBoard);
          setCurrentTurn('white');
          
          const files = 'abcdefgh';
          const notation = `${files[fromC]}${8 - fromR}-${files[toC]}${8 - toR}`;
          setMoveHistory(prev => [...prev, notation]);
       }
    }
    
    setIsThinking(false);
  }, [checkGameEnd, addXP, customDepth, getAllLegalMoves, castlingRights]);

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
        
        let notation = '';
        const files = 'abcdefgh';
        
        // Check if this is a castling move (king moving 2 squares)
        const isCastling = movedPiece?.type === 'king' && Math.abs(col - selCol) === 2;
        
        if (isCastling) {
          // Execute castling
          const isKingSide = col > selCol;
          if (isKingSide) {
            // King-side: King to g1, Rook from h1 to f1
            newBoard[row][6] = movedPiece;
            newBoard[row][4] = null;
            newBoard[row][5] = newBoard[row][7];
            newBoard[row][7] = null;
            notation = 'O-O';
          } else {
            // Queen-side: King to c1, Rook from a1 to d1
            newBoard[row][2] = movedPiece;
            newBoard[row][4] = null;
            newBoard[row][3] = newBoard[row][0];
            newBoard[row][0] = null;
            notation = 'O-O-O';
          }
          // Remove all castling rights for white
          setCastlingRights(prev => ({ ...prev, whiteKing: false, whiteQueen: false }));
        } else {
          // Normal move
          // Pawn promotion
          if (movedPiece?.type === 'pawn' && row === 0) {
            newBoard[row][col] = { type: 'queen', color: 'white' };
          } else {
            newBoard[row][col] = movedPiece;
          }
          newBoard[selRow][selCol] = null;
          notation = `${movedPiece?.type === 'pawn' ? '' : movedPiece?.type[0].toUpperCase()}${files[selCol]}${8 - selRow}-${files[col]}${8 - row}`;
          
          // Update castling rights based on moved piece
          if (movedPiece?.type === 'king') {
            setCastlingRights(prev => ({ ...prev, whiteKing: false, whiteQueen: false }));
          } else if (movedPiece?.type === 'rook') {
            if (selCol === 0) setCastlingRights(prev => ({ ...prev, whiteQueen: false }));
            if (selCol === 7) setCastlingRights(prev => ({ ...prev, whiteKing: false }));
          }
        }
        
        if (capturedPiece) {
          setCapturedPieces(prev => ({ ...prev, white: [...prev.white, capturedPiece] }));
          addXP(PIECE_VALUES[capturedPiece.type], `chess_capture_${Date.now()}`);
          // If capturing a rook in corner, remove that castling right for black
          if (capturedPiece.type === 'rook') {
            if (row === 0 && col === 0) setCastlingRights(prev => ({ ...prev, blackQueen: false }));
            if (row === 0 && col === 7) setCastlingRights(prev => ({ ...prev, blackKing: false }));
          }
        }

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
    // Reset castling rights
    setCastlingRights({
      whiteKing: true,
      whiteQueen: true,
      blackKing: true,
      blackQueen: true,
    });
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
                  <div className="text-slate-300">{currentTurn === 'white' ? 'You' : 'Stockfish'} win!</div>
                  {currentTurn !== 'white' && difficulty === 'dark' && (
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
