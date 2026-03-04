import React from 'react';
import { motion } from 'motion/react';
import { Trophy, ArrowRight, Star, ShieldCheck, Zap, Users, Gift } from 'lucide-react';

interface WelcomeProps {
  onStart: () => void;
}

const RECENT_WINNERS = [
  { name: 'Maria S.', prize: '₱1,000', time: '2m ago' },
  { name: 'John D.', prize: '₱500', time: '5m ago' },
  { name: 'Riza L.', prize: '₱1,000', time: '12m ago' },
  { name: 'Kevin M.', prize: '₱100', time: '15m ago' },
];

export const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full space-y-12 text-center relative z-10"
      >
        <div className="space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest"
          >
            <Zap className="w-3 h-3 fill-emerald-400" />
            Limited Time Challenge
          </motion.div>
          
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-none">
            WIN REAL <br />
            <span className="text-gradient">REWARDS.</span>
          </h1>
          
          <p className="text-zinc-400 text-lg sm:text-xl max-w-xl mx-auto font-medium leading-relaxed">
            Beat our AI in a game of Tic-Tac-Toe and unlock a guaranteed prize spin. 
            <span className="text-white"> No catch, just skill.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-[2rem] space-y-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <Trophy className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-black text-sm uppercase tracking-wider">Play & Win</h3>
            <p className="text-zinc-500 text-xs font-medium">Defeat the AI to qualify for a reward.</p>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-[2rem] space-y-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <Gift className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="font-black text-sm uppercase tracking-wider">Spin Wheel</h3>
            <p className="text-zinc-500 text-xs font-medium">Guaranteed prizes from ₱100 to ₱1,000.</p>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-[2rem] space-y-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-black text-sm uppercase tracking-wider">Instant Pay</h3>
            <p className="text-zinc-500 text-xs font-medium">Securely transfer winnings to your ID.</p>
          </div>
        </div>

        <div className="space-y-8">
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="group relative inline-flex items-center gap-4 px-12 py-6 bg-white text-zinc-950 rounded-[2.5rem] font-black text-2xl shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:bg-zinc-100"
          >
            START CHALLENGE
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </motion.button>

          <div className="flex items-center justify-center gap-8 text-zinc-500">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">10k+ Winners</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-xs font-bold uppercase tracking-widest">4.9/5 Rating</span>
            </div>
          </div>
        </div>

        {/* Recent Winners Section */}
        <div className="pt-12 border-t border-zinc-900">
          <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-8">Live Winning Feed</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {RECENT_WINNERS.map((winner, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-zinc-900/30 border border-zinc-800/50 px-4 py-3 rounded-2xl flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-black">
                  {winner.name[0]}
                </div>
                <div className="text-left">
                  <p className="text-xs font-black">{winner.name}</p>
                  <p className="text-[10px] text-emerald-500 font-bold">Won {winner.prize}</p>
                </div>
                <span className="text-[9px] text-zinc-600 font-bold ml-2">{winner.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
