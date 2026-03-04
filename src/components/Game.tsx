import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Circle, RotateCcw, Brain, User } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameProps {
  onWin: () => void;
  onUpdateStatus: (status: { played_game: boolean; won: boolean }) => void;
}

type Player = 'X' | 'O' | null;

export const Game: React.FC<GameProps> = ({ onWin, onUpdateStatus }) => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const checkWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    if (squares.every(s => s !== null)) return { winner: 'Draw' as const, line: null };
    return null;
  };

  const handleClick = (i: number) => {
    if (board[i] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
    onUpdateStatus({ played_game: true, won: false });

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      if (result.winner === 'X') handleWin();
    }
  };

  const aiMove = () => {
    if (winner) return;

    const emptyIndices = board.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
    if (emptyIndices.length === 0) return;

    const newBoard = [...board];
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    newBoard[randomIndex] = 'O';
    
    setBoard(newBoard);
    setIsPlayerTurn(true);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
    }
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(aiMove, 800);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner]);

  const handleWin = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    onUpdateStatus({ played_game: true, won: true });
    setTimeout(onWin, 3500);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-10 relative z-10"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl">
            <div className={`flex items-center gap-2 transition-opacity ${isPlayerTurn ? 'opacity-100' : 'opacity-40'}`}>
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">You (X)</span>
            </div>
            <div className="w-px h-4 bg-zinc-800"></div>
            <div className={`flex items-center gap-2 transition-opacity ${!isPlayerTurn ? 'opacity-100' : 'opacity-40'}`}>
              <div className="w-8 h-8 bg-rose-500/20 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-rose-400" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">AI (O)</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-4xl font-black tracking-tight text-gradient">The Challenge</h2>
            <p className="text-zinc-500 font-medium">Beat the AI to unlock the ₱1,000 prize wheel</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative grid grid-cols-3 gap-4 bg-zinc-900/80 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-2xl border border-zinc-800">
            {board.map((cell, i) => {
              const isWinningSquare = winningLine?.includes(i);
              return (
                <motion.button
                  key={i}
                  whileHover={!cell && !winner ? { scale: 1.02, backgroundColor: 'rgba(39, 39, 42, 0.8)' } : {}}
                  whileTap={!cell && !winner ? { scale: 0.95 } : {}}
                  onClick={() => handleClick(i)}
                  className={`relative h-24 sm:h-28 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    cell ? 'bg-zinc-800/50' : 'bg-zinc-800/20 hover:bg-zinc-800/40'
                  } ${isWinningSquare ? 'ring-2 ring-emerald-500/50 bg-emerald-500/10' : ''}`}
                >
                  <AnimatePresence mode="wait">
                    {cell === 'X' && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        className="relative"
                      >
                        <X className={`w-12 h-12 ${isWinningSquare ? 'text-emerald-400' : 'text-emerald-500'}`} strokeWidth={3} />
                        <div className="absolute inset-0 blur-lg bg-emerald-500/20 opacity-50"></div>
                      </motion.div>
                    )}
                    {cell === 'O' && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                      >
                        <Circle className={`w-10 h-10 ${isWinningSquare ? 'text-rose-400' : 'text-rose-500'}`} strokeWidth={3} />
                        <div className="absolute inset-0 blur-lg bg-rose-500/20 opacity-50"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {winner === 'X' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-emerald-400 font-black text-2xl italic tracking-tight">
                  VICTORY UNLOCKED! 🎉
                </motion.div>
              )}
              {winner === 'O' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-rose-400 font-black text-2xl italic tracking-tight">
                  AI DOMINATED. TRY AGAIN.
                </motion.div>
              )}
              {winner === 'Draw' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-zinc-400 font-black text-2xl italic tracking-tight">
                  STALEMATE. REPLAY.
                </motion.div>
              )}
              {!winner && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-zinc-500 font-bold uppercase tracking-widest text-xs">
                  {isPlayerTurn ? (
                    <><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Your Move</>
                  ) : (
                    <><Loader2 className="w-3 h-3 animate-spin" /> AI Processing</>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {(winner === 'O' || winner === 'Draw') && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="flex items-center gap-3 px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl text-white font-bold transition-all shadow-xl"
            >
              <RotateCcw className="w-5 h-5 text-emerald-500" />
              Try Again
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
