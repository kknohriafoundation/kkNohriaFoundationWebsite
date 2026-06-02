/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Heart, ArrowRight, CheckCircle, Info } from 'lucide-react';
import { CharityCategory } from '../types';
import { submitContactSubmission } from '../lib/supabase';

interface FooterProps {
  onScrollTo: (section: string) => void;
}

export default function Footer({ onScrollTo }: FooterProps) {
  // Query contact form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<CharityCategory | 'General'>('General');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    try {
      await submitContactSubmission({
        name,
        email,
        phone,
        message,
        category,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setCategory('General');
      }, 4000);
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900 font-sans" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          
          {/* Foundation Profile Summary - Left Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded bg-slate-850 flex items-center justify-center text-white font-bold text-lg border border-slate-800">
                <Heart className="w-4.5 h-4.5 text-amber-500 fill-amber-500/20" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-white text-lg tracking-tight">KKN Foundation</h4>
                <p className="text-[9px] font-mono tracking-widest text-amber-600 uppercase mt-0.5">Krishan Kumar Nohria Foundation</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed font-sans">
              Carrying forward the selfless legacy of social duty and support. Registered non-profit organization dedicated to fostering education, primary public health, and active governance integration since 2012.
            </p>

            {/* Direct Contact specs */}
            <div className="space-y-3 pt-2 text-xs sm:text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4.5 h-4.5 text-amber-700 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 font-light leading-relaxed">
                  Krishan Kumar Nohria Foundation, <br />
                  602, Civil Lines Road, <br />
                  Bathinda, Punjab - 151001, India
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4.5 h-4.5 text-amber-700 flex-shrink-0" />
                <a href="tel:+919417216550" className="text-slate-300 hover:text-white font-mono font-light transition">
                  +91 94172 16550
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4.5 h-4.5 text-amber-700 flex-shrink-0" />
                <a href="mailto:contact@kknohriafoundation.org" className="text-slate-300 hover:text-white font-mono font-light transition">
                  contact@kknohriafoundation.org
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Nav - Middle Panel */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="font-serif font-bold text-white text-xs uppercase tracking-wider border-b border-slate-900 pb-2">
              Sectors & Utilities
            </h4>
            <div className="flex flex-col space-y-3.5 text-xs sm:text-sm">
              <button onClick={() => onScrollTo('about')} className="text-left text-slate-400 hover:text-white font-light transition flex items-center space-x-1 group cursor-pointer">
                <ArrowRight className="w-3 h-3 text-amber-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                <span>About Shri K.K. Nohria</span>
              </button>
              <button onClick={() => onScrollTo('pillars')} className="text-left text-slate-400 hover:text-white font-light transition flex items-center space-x-1 group cursor-pointer">
                <ArrowRight className="w-3 h-3 text-amber-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                <span>Educational Grants</span>
              </button>
              <button onClick={() => onScrollTo('pillars')} className="text-left text-slate-400 hover:text-white font-light transition flex items-center space-x-1 group cursor-pointer">
                <ArrowRight className="w-3 h-3 text-amber-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                <span>Medical Screening Camps</span>
              </button>
              <button onClick={() => onScrollTo('pillars')} className="text-left text-slate-400 hover:text-white font-light transition flex items-center space-x-1 group cursor-pointer">
                <ArrowRight className="w-3 h-3 text-amber-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                <span>Documents & Governance Help</span>
              </button>
              <button onClick={() => onScrollTo('events')} className="text-left text-slate-400 hover:text-white font-light transition flex items-center space-x-1 group cursor-pointer">
                <ArrowRight className="w-3 h-3 text-amber-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                <span>Past Milestones</span>
              </button>
            </div>
          </div>

          {/* Fully-functional Query Form - Right Panel */}
          <div className="lg:col-span-5 bg-slate-900/60 p-6 rounded border border-slate-850">
            <h4 className="font-serif font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-amber-700" />
              <span>Submit General Inquiry</span>
            </h4>

            {success ? (
              <div className="bg-amber-950/20 border border-amber-900/40 p-4 rounded text-slate-200 text-[11px] sm:text-xs space-y-2 flex flex-col items-center justify-center py-6 font-sans">
                <CheckCircle className="w-7 h-7 text-amber-600 stroke-[2.5]" />
                <p className="font-serif font-bold text-center text-slate-100">Inquiry Deposited Successfully!</p>
                <p className="text-[10px] text-center text-slate-400 font-light max-w-[280px]">
                  Our administration officer will reply to your registered email address soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuery} className="space-y-3 font-sans" id="footer-contact-form">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3 py-2 text-slate-200 bg-slate-950 border border-slate-800 rounded text-xs focus:outline-none focus:border-amber-700"
                  />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    className="w-full px-3 py-2 text-slate-200 bg-slate-950 border border-slate-800 rounded text-xs focus:outline-none focus:border-amber-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone (Optional)"
                    className="w-full px-3 py-2 text-slate-200 bg-slate-950 border border-slate-800 rounded text-xs focus:outline-none focus:border-amber-700"
                  />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CharityCategory | 'General')}
                    className="w-full px-3 py-2 text-slate-400 bg-slate-950 border border-slate-800 rounded text-xs focus:outline-none focus:border-amber-700 cursor-pointer"
                  >
                    <option value="General">General Inquiry</option>
                    <option value="Education">Scholarship / Education</option>
                    <option value="Medical">Medical Camps / Treatment</option>
                    <option value="Documentation">Government Scheme Help</option>
                  </select>
                </div>

                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our foundation assist you?"
                  className="w-full px-3 py-2 text-slate-200 bg-slate-950 border border-slate-800 rounded text-xs focus:outline-none focus:border-amber-700"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 disabled:opacity-75 transition duration-200 text-white text-xs uppercase tracking-wider font-semibold rounded cursor-pointer"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Message Enquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Divider and copyright */}
        <div className="border-t border-slate-905 pt-8 mt-8 flex flex-col md:flex-row md:items-center md:justify-between text-xs text-slate-500 text-center md:text-left">
          <p>© {new Date().getFullYear()} Krishan Kumar Nohria Foundation. All rights reserved.</p>
          <p className="mt-2 md:mt-0 font-light flex items-center justify-center md:justify-start">
            <span>Made with deep gratitude to all supporters and families</span>
            <Heart className="w-3.5 h-3.5 text-amber-700 fill-amber-700 ml-1.5 animate-pulse" />
          </p>
        </div>

      </div>
    </footer>
  );
}
