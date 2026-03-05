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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-300/30 blur-[160px] rounded-full opacity-40"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-300/20 blur-[140px] rounded-full opacity-30"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl w-full space-y-16 text-center relative z-10"
      >
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/70 backdrop-blur-lg border border-emerald-300 text-emerald-700 text-[10px] font-black uppercase tracking-[0.3em] shadow-lg"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            Live Challenge Active
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-7xl sm:text-9xl font-black tracking-[-0.05em] leading-[0.85] text-gradient">
              PLAY. WIN. <br />
              <span className="text-gradient-emerald">EARN.</span>
            </h1>
            
            <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              The ultimate high-stakes Tic-Tac-Toe arena. Defeat the system,
              unlock the vault, and claim your rewards instantly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Trophy, title: 'Elite Skill', desc: 'Defeat our advanced AI system.', color: 'emerald', bgColor: 'bg-emerald-100', borderColor: 'border-emerald-300', iconColor: 'text-emerald-700', textColor: 'text-slate-700' },
            { icon: Gift, title: 'Instant Loot', desc: 'Unlock guaranteed prize drops.', color: 'cyan', bgColor: 'bg-cyan-100', borderColor: 'border-cyan-300', iconColor: 'text-cyan-700', textColor: 'text-slate-700' },
            { icon: ShieldCheck, title: 'Secure Vault', desc: 'Encrypted payout processing.', color: 'purple', bgColor: 'bg-purple-100', borderColor: 'border-purple-300', iconColor: 'text-purple-700', textColor: 'text-slate-700' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-white/80 backdrop-blur-lg p-8 rounded-[2.5rem] text-left group hover:shadow-lg transition-all border border-slate-200"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${item.bgColor} ${item.borderColor} border group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-6 h-6 ${item.iconColor}`} />
              </div>
              <h3 className="font-black text-lg mb-2 tracking-tight text-slate-900">{item.title}</h3>
              <p className={`${item.textColor} text-sm font-medium leading-relaxed`}>{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-10">
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="group relative inline-flex items-center gap-6 px-16 py-8 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-[3rem] font-black text-2xl shadow-lg shadow-emerald-500/40 transition-all hover:shadow-xl hover:shadow-emerald-500/60"
          >
            ENTER THE ARENA
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </motion.button>

          <div className="flex items-center justify-center gap-12">
            <div className="flex flex-col items-center gap-2">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">12.4k Active Players</span>
            </div>
            <div className="h-8 w-px bg-slate-300"></div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-emerald-500 text-emerald-500" />)}
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Top Rated Platform</span>
            </div>
          </div>
        </div>

        {/* Live Winning Feed */}
        <div className="pt-16 border-t border-slate-300">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px w-12 bg-slate-400"></div>
            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Live Payout Stream</h4>
            <div className="h-px w-12 bg-slate-400"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {RECENT_WINNERS.map((winner, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="bg-white/70 backdrop-blur-lg px-6 py-4 rounded-3xl flex items-center gap-4 border border-slate-300 hover:border-emerald-300 transition-colors shadow-sm"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center text-xs font-black border border-slate-200 text-white">
                  {winner.name[0]}
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-slate-900">{winner.name}</p>
                  <p className="text-[10px] text-emerald-600 font-bold tracking-tight">Claimed {winner.prize}</p>
                </div>
                <div className="ml-4 px-2 py-1 bg-slate-100 rounded-lg text-[8px] font-black text-slate-600 uppercase">
                  {winner.time}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
