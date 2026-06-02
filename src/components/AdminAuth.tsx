/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, KeyRound, UserCheck, LogIn, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AdminAuthProps {
  onSuccess: () => void;
}

export default function AdminAuth({ onSuccess }: AdminAuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        // Sign In
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        
        setMessage('Successfully logged in! Accessing portal...');
        setTimeout(() => {
          onSuccess();
        }, 1200);
      } else {
        // Sign Up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (signUpError) throw signUpError;

        // In Supabase, if auto-confirm is disabled, user must check email.
        if (data?.user && data.session === null) {
          setMessage('Account registered! Please check your inbox for an email verification link to finalize authentication activation.');
        } else {
          setMessage('Account registered successfully! Welcome to the foundation administration portal.');
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      }
    } catch (err: any) {
      console.error('Authentication process failed:', err);
      setError(err?.message || 'An unexpected authentication exception has occurred. Please confirm records & retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-4 sm:p-0" id="auth-box-container">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded border border-slate-200 shadow-md p-6 sm:p-8 font-sans"
      >
        {/* Toggle Nav Tabs */}
        <div className="flex bg-slate-100 p-1 rounded border border-slate-200 mb-8" id="auth-action-tabs">
          <button
            onClick={() => {
              setIsLogin(true);
              setError(null);
              setMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider cursor-pointer rounded transition-all duration-200 ${
              isLogin
                ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Administrator Log In
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError(null);
              setMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider cursor-pointer rounded transition-all duration-200 ${
              !isLogin
                ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Content Header */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-amber-50 rounded text-amber-700 flex items-center justify-center mx-auto mb-3 border border-amber-100">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-slate-900 text-xl tracking-tight">
            {isLogin ? 'Welcome Back Officer' : 'Register Operator Credentials'}
          </h3>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
            {isLogin 
              ? 'Provide verification details to manage event archives and registrants database.'
              : 'Sign up to register your administrative account for official website operations.'}
          </p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs p-3.5 rounded flex items-start space-x-2.5 mb-6 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
            <span className="leading-normal">{error}</span>
          </div>
        )}

        {message && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-850 text-xs p-3.5 rounded flex items-start space-x-2.5 mb-6 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 mt-0.5" />
            <span className="leading-normal">{message}</span>
          </div>
        )}

        {/* Submission form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Email Link Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@kknohriafoundation.org"
                className="w-full pl-9 pr-4 py-2.5 rounded border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-700 font-sans bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Access Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-700 font-sans bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Guide notes for Password */}
            {!isLogin && (
              <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wide mt-1">Must be at least 6 alphanumeric keys</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-75 transition-all outline-none text-white rounded text-xs uppercase tracking-wider font-semibold shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span>Verify & Verify Login</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Compile Operator Credentials</span>
              </>
            )}
          </button>
        </form>

        {/* Dynamic Footer hints */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
            <span>Secured By Supabase Shield Architecture</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
