'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, ArrowRight, ShieldCheck, Globe as Google } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@amdox.corp');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[440px] px-6"
      >
        <div className="glass-darker p-10 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Amdox<span className="text-primary font-light">ERP</span></h1>
            <p className="text-slate-400 mt-2 text-sm font-medium">Enterprise Security Protocol Active</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Corporate Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all font-medium"
                  placeholder="name@amdox.corp"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  defaultValue="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="group relative w-full h-14 bg-primary rounded-2xl font-bold text-white shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all overflow-hidden"
            >
              <div className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-300",
                loading ? "translate-y-0" : "translate-y-[-100%]"
              )}>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
              <div className={cn(
                "flex items-center justify-center space-x-2 transition-all duration-300",
                loading ? "translate-y-[100%]" : "translate-y-0"
              )}>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </form>

          <div className="mt-8 flex items-center space-x-4">
             <div className="h-px flex-1 bg-white/5" />
             <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">or SSO with</span>
             <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center space-x-2 text-white hover:bg-white/10 transition-all">
              <Google className="w-4 h-4" />
              <span className="text-xs font-bold">Google</span>
            </button>
            <button className="h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center space-x-2 text-white hover:bg-white/10 transition-all">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold">Microsoft</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-500 text-xs font-medium">
          New tenant? <button className="text-primary font-bold hover:underline">Register your organization</button>
        </p>
      </motion.div>
    </div>
  );
}
