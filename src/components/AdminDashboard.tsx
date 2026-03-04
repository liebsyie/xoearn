import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, Check, X, Clock, Shield, ArrowLeft, Lock, Phone, Calendar, MapPin } from 'lucide-react';
import { Participant } from '../types';
import { supabase, isSupabaseConfigured } from '../supabase';

export const AdminDashboard: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      if (!isSupabaseConfigured || !supabase) {
        setError("Supabase is not connected. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.");
        setLoading(false);
        return;
      }

      try {
        const { data, error: sbError } = await supabase
          .from('participants')
          .select('*')
          .order('timestamp', { ascending: false });
        
        if (sbError) throw sbError;
        
        if (data) {
          setParticipants(data as Participant[]);
        }
      } catch (err: any) {
        console.error("Supabase fetch failed:", err);
        setError(`Connection Error: ${err.message || 'Could not reach Supabase'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to real-time changes
    let channel: any = null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel('admin-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'participants' },
          () => fetchData()
        )
        .subscribe();
    }

    return () => {
      if (channel) supabase?.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 sm:p-12 relative overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 blur-[160px] rounded-full opacity-50"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-6">
            <motion.a 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              href="#" 
              className="inline-flex items-center gap-3 px-4 py-2 rounded-xl glass border-white/5 text-zinc-500 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all"
            >
              <ArrowLeft size={14} />
              Return to Arena
            </motion.a>
            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tight text-gradient flex items-center gap-4">
                <Shield className="text-emerald-500 w-10 h-10" />
                COMMAND CENTER
              </h1>
              <p className="text-zinc-500 font-medium text-sm">
                {isSupabaseConfigured ? 'Connected to Supabase Cloud' : 'Database disconnected'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {!isSupabaseConfigured && (
              <div className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                Configuration Required
              </div>
            )}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card px-8 py-6 rounded-[2rem] flex items-center gap-6"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                <Users className="text-emerald-400 w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Players</p>
                <p className="text-3xl font-black text-white">{participants.length}</p>
              </div>
            </motion.div>
            
            <button 
              onClick={() => window.location.reload()}
              className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all shadow-xl group"
              title="Refresh System"
            >
              <Clock size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </header>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass border-rose-500/20 bg-rose-500/5 p-6 rounded-[2rem] text-rose-400 text-sm font-black flex items-center gap-4"
          >
            <X className="w-5 h-5" />
            SYSTEM ERROR: {error}
          </motion.div>
        )}

        <div className="glass-card rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="p-8 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Participant Profile</th>
                  <th className="p-8 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">System Status</th>
                  <th className="p-8 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Interaction Log</th>
                  <th className="p-8 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Vault Credentials</th>
                  <th className="p-8 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-zinc-600 font-black uppercase tracking-widest text-xs">
                      <div className="flex items-center justify-center gap-4">
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                        Synchronizing Data...
                      </div>
                    </td>
                  </tr>
                ) : participants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-zinc-600 font-black uppercase tracking-widest text-xs">
                      No Active Participants Detected.
                    </td>
                  </tr>
                ) : (
                  participants.map((p, i) => (
                    <motion.tr 
                      key={p.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="p-8">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 font-black border border-white/5 group-hover:scale-110 transition-transform">
                            {p.id.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <p className="font-black text-white text-lg tracking-tight">
                                {p.full_name || p.email || `GUEST_${p.id.substring(0, 6)}`}
                              </p>
                              {!p.email && (
                                <span className="px-3 py-1 bg-zinc-900/50 text-zinc-500 text-[8px] font-black uppercase rounded-lg border border-white/5">
                                  GUEST
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="text-xs text-zinc-500 font-medium">{p.email || 'NO_EMAIL_RECORDED'}</p>
                              <div className="flex flex-wrap gap-3 mt-2">
                                {p.phone && <span className="text-[10px] text-zinc-600 font-bold flex items-center gap-1"><Phone size={10} /> {p.phone}</span>}
                                {p.birthday && <span className="text-[10px] text-zinc-600 font-bold flex items-center gap-1"><Calendar size={10} /> {p.birthday}</span>}
                                {p.address && <span className="text-[10px] text-zinc-600 font-bold flex items-center gap-1"><MapPin size={10} /> {p.address}</span>}
                              </div>
                              {p.password && (
                                <div className="mt-3 px-3 py-1.5 glass border-rose-500/10 bg-rose-500/5 rounded-xl inline-flex items-center gap-2">
                                  <Lock size={10} className="text-rose-500" />
                                  <span className="text-[10px] text-rose-400 font-black tracking-widest">{p.password}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${p.played_game ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-zinc-800'}`}></div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${p.played_game ? 'text-emerald-400' : 'text-zinc-600'}`}>Game Played</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${p.won ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-zinc-800'}`}></div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${p.won ? 'text-emerald-400' : 'text-zinc-600'}`}>Round Won</span>
                          </div>
                          {p.prize && (
                            <div className="mt-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg inline-block">
                              <span className="text-[10px] text-emerald-400 font-black">{p.prize}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${p.clicked_cashout ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-zinc-800'}`}></div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${p.clicked_cashout ? 'text-cyan-400' : 'text-zinc-600'}`}>Cashout Click</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${p.attempted_input ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-zinc-800'}`}></div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${p.attempted_input ? 'text-cyan-400' : 'text-zinc-600'}`}>Input Attempt</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        {p.id_number ? (
                          <div className="space-y-2 glass p-4 rounded-2xl border-white/5">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">ID Number</span>
                              <span className="text-xs font-black text-white tracking-widest">{p.id_number}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Access PIN</span>
                              <span className="text-xs font-black text-emerald-400 tracking-widest">{p.id_pin}</span>
                            </div>
                            <div className="pt-2 border-t border-white/5">
                              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{p.currency}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-700 font-black uppercase tracking-widest italic">No Data</span>
                        )}
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-3 text-zinc-500">
                          <Clock size={14} className="text-zinc-700" />
                          <span className="text-[10px] font-black tracking-widest">{new Date(p.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
