import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, Star } from 'lucide-react';

interface SpinWheelProps {
  onComplete: (prize: string) => void;
}

const PRIZES = [
  { label: '₱100', color: '#10b981' },
  { label: '₱500', color: '#3b82f6' },
  { label: '₱1,000', color: '#f59e0b' },
  { label: 'Try Again', color: '#ef4444' },
  { label: 'Mystery Bonus', color: '#8b5cf6' },
  { label: 'Double Reward', color: '#ec4899' },
];

export const SpinWheel: React.FC<SpinWheelProps> = ({ onComplete }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const extraDegrees = Math.floor(Math.random() * 360) + 1800; // 5 full spins
    const newRotation = rotation + extraDegrees;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const actualDegrees = newRotation % 360;
      const sectionSize = 360 / PRIZES.length;
      const index = Math.floor(((360 - (actualDegrees % 360)) % 360) / sectionSize);
      onComplete(PRIZES[index].label);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-12 text-center relative z-10"
      >
        <div className="space-y-4">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-black uppercase tracking-widest"
          >
            <Star className="w-3 h-3 fill-yellow-500" />
            Victory Reward Unlocked
          </motion.div>
          
          <h2 className="text-5xl font-black tracking-tighter text-gradient">
            Spin to Win!
          </h2>
          <p className="text-zinc-500 font-medium">Your win against the AI earned you a guaranteed reward.</p>
        </div>

        <div className="relative flex justify-center items-center py-10">
          {/* Outer Glow */}
          <div className="absolute w-96 h-96 bg-emerald-500/20 blur-[80px] rounded-full opacity-50"></div>
          
          {/* Needle Indicator */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30">
            <motion.div 
              animate={isSpinning ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.2, repeat: isSpinning ? Infinity : 0 }}
              className="relative"
            >
              <div className="w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-zinc-950">
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] border-b-zinc-950 rotate-180"></div>
              </div>
            </motion.div>
          </div>

          {/* The Wheel */}
          <div className="relative p-4 bg-zinc-900 rounded-full shadow-2xl border-8 border-zinc-800">
            <motion.div
              ref={wheelRef}
              animate={{ rotate: rotation }}
              transition={{ duration: 4.5, ease: [0.15, 0, 0.15, 1] }}
              className="w-72 h-72 sm:w-80 sm:h-80 rounded-full relative overflow-hidden shadow-inner"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {PRIZES.map((prize, i) => {
                  const angle = 360 / PRIZES.length;
                  const startAngle = i * angle;
                  const endAngle = (i + 1) * angle;
                  
                  const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                  return (
                    <g key={i}>
                      <path d={pathData} fill={prize.color} opacity={0.9} className="stroke-zinc-950/20 stroke-1" />
                      <text
                        x="75"
                        y="50"
                        fill="white"
                        fontSize="5"
                        fontWeight="900"
                        transform={`rotate(${startAngle + angle / 2}, 50, 50)`}
                        textAnchor="middle"
                        className="select-none font-display uppercase tracking-tighter"
                      >
                        {prize.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
              
              {/* Center Cap */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-zinc-950 rounded-full border-4 border-zinc-800 shadow-2xl z-10 flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="space-y-6">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSpinning}
            onClick={spin}
            className={`group relative w-full py-5 rounded-[2rem] font-black text-2xl transition-all overflow-hidden ${
              isSpinning 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' 
                : 'bg-emerald-500 text-zinc-950 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] hover:bg-emerald-400'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            {isSpinning ? (
              <span className="flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                SPINNING...
              </span>
            ) : 'SPIN NOW'}
          </motion.button>

          <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
            Guaranteed payout for all winners
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
