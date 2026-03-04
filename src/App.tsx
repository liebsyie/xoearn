import React, { useState, useEffect } from 'react';
import { Welcome } from './components/Welcome';
import { Game } from './components/Game';
import { SpinWheel } from './components/SpinWheel';
import { Cashout } from './components/Cashout';
import { AdminDashboard } from './components/AdminDashboard';
import { Auth } from './components/Auth';
import { GameState } from './types';
import { supabase, isSupabaseConfigured } from './supabase';
import { LogOut, User } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<GameState>('welcome');
  const [session, setSession] = useState<any>(null);
  const [userId, setUserId] = useState<string>(() => {
    const saved = localStorage.getItem('xoearn_id');
    if (saved) return saved;
    const newId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('xoearn_id', newId);
    return newId;
  });
  const [prize, setPrize] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    let subscription: any = null;

    const initAuth = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          setSession(initialSession);
          if (initialSession) {
            setUserId(initialSession.user.id);
          } else {
            try {
              const { data } = await (supabase.auth as any).signInAnonymously();
              if (data?.user) setUserId(data.user.id);
            } catch (e) {
              console.warn("Supabase anonymous sign-in failed, using local ID");
            }
          }

          const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
              setUserId(session.user.id);
              setShowAuth(false);
            }
          });
          subscription = data.subscription;
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Check if we are in admin view via URL hash
  useEffect(() => {
    const handleHash = () => {
      console.log('Current hash:', window.location.hash);
      if (window.location.hash === '#admin') {
        setView('admin');
      } else if (view === 'admin') {
        setView('welcome');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [view]);

  const updateParticipant = async (data: any) => {
    // Convert boolean values to integers for database compatibility
    const formattedData = { ...data };
    ['played_game', 'won', 'clicked_cashout', 'attempted_input'].forEach(key => {
      if (typeof formattedData[key] === 'boolean') {
        formattedData[key] = formattedData[key] ? 1 : 0;
      }
    });

    const profileData = session?.user?.user_metadata || {};
    console.log('Updating participant data:', { userId, ...formattedData, profileData });

    // If Supabase is configured, try to update there
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('participants')
          .upsert({
            id: userId,
            ...formattedData,
            email: session?.user?.email || null,
            full_name: profileData.full_name || null,
            phone: profileData.phone || null,
            birthday: profileData.birthday || null,
            address: profileData.address || null,
            password: profileData.password || null,
            timestamp: new Date().toISOString(),
          }, { onConflict: 'id' });
        
        if (error) throw error;
      } catch (err) {
        console.error('Failed to update participant in Supabase:', err);
      }
    }

    // Always update local server for backward compatibility and fallback
    try {
      await fetch('/api/participant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: userId, 
          email: session?.user?.email || null,
          full_name: profileData.full_name || null,
          phone: profileData.phone || null,
          birthday: profileData.birthday || null,
          address: profileData.address || null,
          password: profileData.password || null,
          ...formattedData 
        }),
      });
    } catch (err) {
      console.error('Failed to update participant locally:', err);
    }
  };

  const handleWin = () => {
    if (!session) {
      setShowAuth(true);
      // We don't change view yet, we wait for session to be established
      // The onAuthStateChange in useEffect will handle closing the modal
      // But we need a way to know we should proceed to spin after login
      localStorage.setItem('pending_win', 'true');
    } else {
      setView('spin');
    }
  };

  // Effect to handle pending win after login
  useEffect(() => {
    if (session && localStorage.getItem('pending_win') === 'true') {
      localStorage.removeItem('pending_win');
      setView('spin');
    }
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (view === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Auth Overlay */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            onClick={() => setShowAuth(false)}
          ></div>
          <div className="relative z-10 w-full max-w-md">
            <Auth onSuccess={() => setShowAuth(false)} />
          </div>
        </div>
      )}

      {/* User Status Bar */}
      {view !== 'admin' && (
        <div className="fixed top-4 right-4 z-40 flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-1 pr-4 rounded-full">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-zinc-950 font-bold">
                {session.user.email?.[0].toUpperCase() || <User size={16} />}
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Signed In</p>
                <p className="text-xs text-white font-bold truncate max-w-[120px]">
                  {session.user.email || 'User'}
                </p>
              </div>
              <button 
                onClick={() => supabase.auth.signOut()}
                className="p-2 text-zinc-500 hover:text-rose-400 transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuth(true)}
              className="px-4 py-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-full text-xs text-white font-bold hover:bg-zinc-800 transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      )}

      {view === 'welcome' && (
        <Welcome onStart={() => setView('game')} />
      )}
      
      {view === 'game' && (
        <Game 
          onWin={handleWin}
          onUpdateStatus={(status) => updateParticipant(status)}
        />
      )}

      {view === 'spin' && (
        <SpinWheel 
          onComplete={(p) => {
            setPrize(p);
            updateParticipant({ prize: p, clicked_cashout: true });
            setTimeout(() => setView('cashout'), 1500);
          }} 
        />
      )}

      {view === 'cashout' && (
        <Cashout 
          prize={prize}
          onComplete={(data) => {
            updateParticipant({ ...data, attempted_input: true });
          }}
        />
      )}

      {/* Hidden link to admin for convenience during development */}
      <a 
        href="#admin" 
        className="fixed bottom-4 right-4 p-2 bg-zinc-900/50 hover:bg-zinc-800 rounded-lg text-[10px] text-zinc-600 hover:text-zinc-400 transition-all border border-zinc-800/50 flex items-center gap-1"
      >
        <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
        Admin Panel
      </a>
    </div>
  );
}
