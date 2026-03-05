import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Chrome, Facebook, ArrowRight, Loader2, User, Phone, Calendar, MapPin, Lock, Eye, EyeOff, X } from 'lucide-react';
import { supabase } from '../supabase';

interface AuthProps {
  onSuccess: () => void;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess, onClose, title = "Sign In to Save Progress", subtitle = "Choose your preferred method to continue" }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    birthday: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              phone: formData.phone,
              birthday: formData.birthday,
              address: formData.address,
              password: formData.password // Storing in metadata for simulation purposes
            }
          }
        });
        if (error) throw error;
        onSuccess();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        onSuccess();
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) console.error('OAuth error:', error.message);
  };

  return (
    <div className="w-full max-w-md p-10 glass-card rounded-[3rem] relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none"></div>

      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-zinc-500 hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>
      )}

      <div className="text-center mb-10 relative z-10">
        <h2 className="text-4xl font-black text-white mb-3 tracking-tight leading-tight">
          {mode === 'login' ? title : 'JOIN THE ELITE'}
        </h2>
        <p className="text-zinc-500 text-sm font-medium">
          {mode === 'login' ? subtitle : 'Create your secure profile to claim rewards'}
        </p>
      </div>

      <div className="space-y-6 relative z-10">
        {mode === 'login' && (
          <div className="space-y-3">
            <button
              onClick={() => handleOAuthLogin('google')}
              className="w-full py-4 px-6 bg-white hover:bg-zinc-100 text-zinc-950 font-black rounded-2xl flex items-center justify-center gap-4 transition-all shadow-xl"
            >
              <Chrome size={20} />
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuthLogin('facebook')}
              className="w-full py-4 px-6 bg-[#1877F2] hover:bg-[#166fe5] text-white font-black rounded-2xl flex items-center justify-center gap-4 transition-all shadow-xl"
            >
              <Facebook size={20} />
              Continue with Facebook
            </button>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-zinc-900/50 px-4 text-zinc-600 font-black tracking-[0.3em]">System Access</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-white/[0.02] border border-white/5 text-white placeholder:text-black pl-14 pr-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white/[0.04] transition-all"
                    required={mode === 'register'}
                  />
                </div>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/[0.02] border border-white/5 text-white placeholder:text-black pl-14 pr-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white/[0.04] transition-all"
                    required={mode === 'register'}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      className="w-full bg-white/[0.02] border border-white/5 text-white pl-14 pr-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white/[0.04] transition-all text-sm"
                      required={mode === 'register'}
                    />
                  </div>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-white/[0.02] border border-white/5 text-white placeholder:text-black pl-14 pr-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white/[0.04] transition-all"
                      required={mode === 'register'}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/[0.02] border border-white/5 text-white placeholder:text-black pl-14 pr-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white/[0.04] transition-all"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/[0.02] border border-white/5 text-white placeholder:text-black pl-14 pr-14 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white/[0.04] transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-white text-zinc-950 font-black text-xl rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] hover:shadow-[0_30px_60px_-15px_rgba(255,255,255,0.3)] disabled:bg-zinc-800 disabled:text-zinc-600 disabled:shadow-none"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <>{mode === 'login' ? 'ACCESS SYSTEM' : 'CREATE PROFILE'} <ArrowRight size={24} /></>}
          </button>
        </form>

        <div className="text-center pt-6">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-zinc-500 hover:text-emerald-400 text-xs font-black uppercase tracking-widest transition-colors"
          >
            {mode === 'login' ? "New Player? Register Here" : "Existing Player? Sign In"}
          </button>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-5 rounded-2xl text-xs font-black tracking-tight ${
              message.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </div>
    </div>
  );
};
