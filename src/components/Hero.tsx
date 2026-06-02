/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, HeartPulse, FileText } from 'lucide-react';
import { heroImage } from '../data';

interface HeroProps {
  onExplore: (section: string) => void;
}

export default function Hero({ onExplore }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-b from-slate-50 to-white overflow-hidden py-16 md:py-24 animate-fade-in" id="home-hero-section">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-50/40 rounded-full filter blur-3xl opacity-60 -z-10 translate-x-1/2 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-100 rounded-full filter blur-3xl opacity-50 -z-10 -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text content - Left column */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col justify-center space-y-8"
            id="hero-left-col"
          >
            <div>
              <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded text-amber-800 text-xs font-semibold uppercase tracking-wider mb-5">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                <span>Serving Humanity Since 2012</span>
              </div>
              <h1 className="font-serif tracking-tight text-slate-900 text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-6">
                Estd. in loving memory of <br />
                <span className="text-amber-700 font-extrabold relative inline-block">
                  Krishan Kumar Nohria
                </span>
              </h1>
              <p className="text-slate-600 text-lg sm:text-xl leading-relaxed max-w-full font-light font-sans">
                Dedicated to the legacy of altruism. We bridge the gap between resources and those in need through specialized initiatives in education, medical welfare, and civil empowerment across underserved communities.
              </p>
            </div>

            {/* Core Pillars Quick Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 border-t border-slate-100 pt-6">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded bg-amber-50 text-amber-700">
                  <BookOpen className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-700">Education Support</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded bg-blue-50 text-blue-700">
                  <HeartPulse className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-700">Medical Services</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded bg-emerald-50 text-emerald-700">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-700">Gov't Schemes Documentation</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onExplore('about')}
                id="hero-explore-btn"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent rounded text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 hover:scale-[1.01] shadow-md transition-all duration-200 group cursor-pointer"
              >
                <span>Read Our Foundation Profile</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onExplore('events')}
                id="hero-events-btn"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-slate-200 rounded text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
              >
                <span>View Event Reports</span>
              </button>
            </div>
          </motion.div>

          {/* Photographic Aspect - Right column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
            id="hero-right-col"
          >
            {/* Main Picture Frame */}
            <div className="relative rounded overflow-hidden shadow-xl border border-slate-200 aspect-square md:aspect-[4/3] lg:aspect-square">
              <img 
                src={heroImage} 
                alt="Krishan Kumar Nohria Foundation work" 
                className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
              
              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded shadow-lg flex items-center space-x-4 border border-slate-150">
                <div className="w-10 h-10 rounded bg-amber-50 flex-shrink-0 flex items-center justify-center text-amber-700">
                  <HeartPulse className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Annual Mission Target</p>
                  <p className="text-slate-800 font-bold text-xs uppercase tracking-tight">Help 10,000+ Underprivileged Citizens</p>
                </div>
              </div>
            </div>

            {/* Side Hanging Card decoration */}
            <div className="absolute -top-6 -left-6 bg-slate-900 text-white rounded p-4 shadow-lg hidden sm:block border border-slate-800">
              <h3 className="font-serif font-bold text-xl">250+</h3>
              <p className="text-[9px] uppercase font-mono tracking-wider opacity-80">Scholarships Awarded</p>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-amber-700 text-white rounded p-4 shadow-lg hidden sm:block border border-amber-600">
              <h3 className="font-serif font-bold text-xl">1,500+</h3>
              <p className="text-[9px] uppercase font-mono tracking-wider opacity-80">Medical Screenings</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
