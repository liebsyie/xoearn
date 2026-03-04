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
        
        // If auto-confirm is enabled in Supabase, data.session will exist
        // If not, we still call onSuccess to let them proceed in the UI
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
    <div className="w-full max-w-md p-8 bg-zinc-900/90 border border-zinc-800 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl relative">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      )}

      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-2 leading-tight">{mode === 'login' ? title : 'Create Account'}</h2>
        <p className="text-zinc-500 text-sm font-medium">{mode === 'login' ? subtitle : 'Fill in your details to start winning'}</p>
      </div>

      <div className="space-y-4">
        {mode === 'login' && (
          <>
            <button
              onClick={() => handleOAuthLogin('google')}
              className="w-full py-3.5 px-4 bg-white hover:bg-zinc-100 text-zinc-950 font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg"
            >
              <Chrome size={20} />
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuthLogin('facebook')}
              className="w-full py-3.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg"
            >
              <Facebook size={20} />
              Continue with Facebook
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-zinc-900 px-3 text-zinc-500 font-black tracking-[0.2em]">Or use credentials</span>
              </div>
            </div>
          </>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    required={mode === 'register'}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    required={mode === 'register'}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      className="w-full bg-zinc-800/50 border border-zinc-700 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                      required={mode === 'register'}
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-zinc-800/50 border border-zinc-700 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      required={mode === 'register'}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-zinc-800/50 border border-zinc-700 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-zinc-800/50 border border-zinc-700 text-white pl-12 pr-12 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 text-zinc-950 font-black text-lg rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/20"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={20} /></>}
          </button>
        </form>

        <div className="text-center pt-4">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-zinc-400 hover:text-emerald-400 text-sm font-bold transition-colors"
          >
            {mode === 'login' ? "Don't have an account? Register" : "Already have an account? Sign In"}
          </button>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl text-sm font-bold ${
              message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </div>
    </div>
  );
};
