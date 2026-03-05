import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Circle, RotateCcw, Brain, User, Trophy } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-300/20 blur-[140px] rounded-full opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full space-y-12 relative z-10"
      >
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-[2rem] bg-white/70 backdrop-blur-xl border border-slate-200 shadow-xl">
            <div className={`flex items-center gap-3 transition-all duration-500 ${isPlayerTurn ? 'opacity-100 scale-105' : 'opacity-30 scale-95'}`}>
              <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center border border-emerald-300">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Player</p>
                <p className="text-xs font-black text-slate-900">YOU (X)</p>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-300"></div>
            <div className={`flex items-center gap-3 transition-all duration-500 ${!isPlayerTurn ? 'opacity-100 scale-105' : 'opacity-30 scale-95'}`}>
              <div className="text-right">
                <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest">System</p>
                <p className="text-xs font-black text-slate-900">AI (O)</p>
              </div>
              <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center border border-rose-300">
                <Brain className="w-5 h-5 text-rose-600" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-5xl font-black tracking-tight text-gradient">THE ARENA</h2>
            <p className="text-slate-600 font-medium text-sm">Defeat the system to unlock the prize vault.</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-8 bg-gradient-to-r from-emerald-400/30 to-cyan-400/30 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative grid grid-cols-3 gap-3 bg-white/90 backdrop-blur-lg p-8 rounded-[3rem] shadow-2xl border border-slate-200">
            {board.map((cell, i) => {
              const isWinningSquare = winningLine?.includes(i);
              return (
                <motion.button
                  key={i}
                  whileHover={!cell && !winner ? { scale: 1.05, backgroundColor: '#f3f4f6' } : {}}
                  whileTap={!cell && !winner ? { scale: 0.95 } : {}}
                  onClick={() => handleClick(i)}
                  className={`relative h-24 sm:h-28 rounded-2xl flex items-center justify-center transition-all duration-300 font-black ${
                    cell ? 'bg-slate-50' : 'bg-white hover:bg-gray-100 cursor-pointer'
                  } ${isWinningSquare ? 'ring-4 ring-emerald-500 bg-emerald-50 shadow-lg' : 'border-2 border-slate-300 hover:border-emerald-400'}`}
                >
                  <AnimatePresence mode="wait">
                    {cell === 'X' && (
                      <motion.div
                        initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        className="relative"
                      >
                        <X className={`w-14 h-14 ${isWinningSquare ? 'text-emerald-600' : 'text-emerald-500'}`} strokeWidth={3} />
                      </motion.div>
                    )}
                    {cell === 'O' && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                      >
                        <Circle className={`w-12 h-12 ${isWinningSquare ? 'text-rose-600' : 'text-rose-500'}`} strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="h-12 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {winner === 'X' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex items-center gap-3 text-emerald-600 font-black text-3xl italic tracking-tight"
                >
                  <Trophy className="w-8 h-8" />
                  SYSTEM OVERRIDDEN!
                </motion.div>
              )}
              {winner === 'O' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex items-center gap-3 text-rose-600 font-black text-2xl italic tracking-tight"
                >
                  <Brain className="w-8 h-8" />
                  AI DOMINANCE DETECTED.
                </motion.div>
              )}
              {winner === 'Draw' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex items-center gap-3 text-slate-600 font-black text-2xl italic tracking-tight"
                >
                  <RotateCcw className="w-8 h-8" />
                  STALEMATE. RETRY.
                </motion.div>
              )}
              {!winner && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 px-6 py-2 rounded-full bg-white/70 backdrop-blur-lg border border-slate-200 text-slate-600 font-black uppercase tracking-[0.2em] text-[10px]">
                  {isPlayerTurn ? (
                    <><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span></span> Waiting for Input</>
                  ) : (
                    <><Loader2 className="w-3 h-3 animate-spin text-rose-600" /> System Calculating</>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {(winner === 'O' || winner === 'Draw') && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="flex items-center gap-4 px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-emerald-500/40 hover:bg-emerald-600"
            >
              <RotateCcw className="w-5 h-5" />
              RESTART CHALLENGE
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
