import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, Star, ShieldCheck, Info } from 'lucide-react';

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
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[160px] rounded-full opacity-50"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full space-y-12 text-center relative z-10"
      >
        <div className="space-y-6">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass border-white/10 text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] shadow-xl"
          >
            <Star className="w-3 h-3 fill-yellow-500" />
            Victory Reward Unlocked
          </motion.div>
          
          <div className="space-y-2">
            <h2 className="text-6xl font-black tracking-tighter text-gradient">
              THE VAULT
            </h2>
            <p className="text-zinc-500 font-medium text-sm">Spin to unlock your guaranteed system reward.</p>
          </div>
        </div>

        <div className="relative flex justify-center items-center py-12">
          {/* Outer Glow */}
          <div className="absolute w-[450px] h-[450px] bg-emerald-500/10 blur-[100px] rounded-full opacity-50 animate-pulse"></div>
          
          {/* Needle Indicator */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30">
            <motion.div 
              animate={isSpinning ? { rotate: [0, -12, 12, -12, 12, 0] } : {}}
              transition={{ duration: 0.15, repeat: isSpinning ? Infinity : 0 }}
              className="relative"
            >
              <div className="w-14 h-14 bg-white rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center border-4 border-zinc-950">
                <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[28px] border-b-zinc-950 rotate-180"></div>
              </div>
            </motion.div>
          </div>

          {/* The Wheel Container */}
          <div className="relative p-6 bg-zinc-900/50 backdrop-blur-3xl rounded-full shadow-[0_0_80px_-20px_rgba(0,0,0,0.5)] border-8 border-white/5">
            <motion.div
              ref={wheelRef}
              animate={{ rotate: rotation }}
              transition={{ duration: 4.5, ease: [0.15, 0, 0.15, 1] }}
              className="w-80 h-80 sm:w-96 sm:h-96 rounded-full relative overflow-hidden shadow-inner border-4 border-white/5"
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
                      <path d={pathData} fill={prize.color} opacity={0.85} className="stroke-zinc-950/30 stroke-[0.5]" />
                      <text
                        x="72"
                        y="50"
                        fill="white"
                        fontSize="4.5"
                        fontWeight="900"
                        transform={`rotate(${startAngle + angle / 2}, 50, 50)`}
                        textAnchor="middle"
                        className="select-none font-sans uppercase tracking-tighter"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                      >
                        {prize.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
              
              {/* Center Cap */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-zinc-950 rounded-full border-4 border-white/10 shadow-2xl z-10 flex items-center justify-center">
                <div className="w-14 h-14 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full flex items-center justify-center border border-white/5">
                  <Trophy className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="space-y-8">
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSpinning}
            onClick={spin}
            className={`group relative w-full py-7 rounded-[2.5rem] font-black text-2xl transition-all overflow-hidden ${
              isSpinning 
                ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/5' 
                : 'bg-white text-zinc-950 shadow-[0_30px_60px_-15px_rgba(255,255,255,0.2)] hover:shadow-[0_40px_80px_-20px_rgba(255,255,255,0.3)]'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            {isSpinning ? (
              <span className="flex items-center justify-center gap-4">
                <Loader2 className="w-7 h-7 animate-spin text-emerald-500" />
                SYSTEM SPINNING...
              </span>
            ) : 'SPIN THE VAULT'}
          </motion.button>

          <div className="flex items-center justify-center gap-4 text-zinc-600">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Guaranteed System Payout</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
