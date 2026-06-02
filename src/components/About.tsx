/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Heart, Landmark, GraduationCap, Scale, Sparkles, Milestone } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: <GraduationCap className="w-5 h-5 text-amber-750" />,
      title: 'Educational Equity',
      desc: 'We believe no bright mind should be dimmed due to economic constraints. Our scholarships are structured to pave easy learning paths.',
    },
    {
      icon: <Heart className="w-5 h-5 text-rose-600" />,
      title: 'Compassionate Care',
      desc: 'Our elderly deserve respect and active health services. We address physical wellness and overall dignity of old senior citizens.',
    },
    {
      icon: <Scale className="w-5 h-5 text-blue-700" />,
      title: 'Civic Empowerment',
      desc: 'Helping people gain access to central and state benefits by demystifying administrative paperwork and bridging bureaucratic divides.',
    },
  ];

  return (
    <section className="bg-slate-50 py-20 border-y border-slate-200" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-800 font-mono text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 bg-amber-50 rounded border border-amber-100">
            Our Origin & Legacy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 tracking-tight mt-4 mb-4">
            About the K.K. Nohria Foundation
          </h2>
          <div className="w-12 h-[2px] bg-amber-700 mx-auto" />
        </div>

        {/* Story Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Legacy Narrative - Left */}
          <div className="lg:col-span-7 space-y-6 text-slate-700">
            <h3 className="font-serif text-2xl text-slate-800 tracking-tight">
              Honoring a Lifelong Mission of Infinite Care
            </h3>
            <p className="leading-relaxed text-slate-600 font-light text-sm font-sans">
              The <strong>Krishan Kumar Nohria Foundation</strong> was founded to honor the enduring memory and benevolent values of late Shri Krishan Kumar Nohria. Throughout his life, Shri Nohria was an ardent champion for the rights of the underprivileged, firmly believing that social advancement is only truly possible when we hoist the weakest rungs of our society.
            </p>
            <p className="leading-relaxed text-slate-600 font-light text-sm font-sans">
              With a deep-rooted commitment to social welfare, our foundation works actively on three critical development sectors. First, we provide scholarships to meritorious students, enabling access to quality higher education and aiding structural enhancements within government-funded schools. Second, we host regional medical camps offering free medicine and essential diagnostic check-ups to rural pockets, alongside robust support programs for senior citizens. Third, we establish on-the-ground documentation assistance counters, helping eligible citizens effortlessly navigate bureaucratic legalities to complete records for welfare schemes.
            </p>
            
            {/* Elegant Callout Quote */}
            <div className="border-l-2 border-amber-700 pl-4 py-1 bg-amber-50/50 rounded-r">
              <p className="font-serif italic text-slate-800 text-sm">
                "Society flourishes only when we ensure that education is accessible to every child, medical care is a fundamental human right, and government protection reaches the remotest doorstep."
              </p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mt-2 font-bold">— Legacy mandate of Shri K.K. Nohria</p>
            </div>
          </div>

          {/* Graphical Frame - Right */}
          <div className="lg:col-span-5 relative" id="about-legacy-card">
            <div className="bg-white rounded p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              {/* Corner Design decoration */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-amber-50/20 rounded-bl-full" />
              
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-amber-50 rounded text-amber-700">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-slate-800 text-base">Trust Framework</h4>
                  <p className="text-[9px] text-slate-400 font-mono">ESTABLISHED 2012 • NON-PROFIT ENTITY</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                  <p className="text-slate-600 font-sans"><span className="font-semibold text-slate-800">Self-Funded Operations</span>: All foundation initiatives are fully funded by the founding family and trustees.</p>
                </div>
                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                  <p className="text-slate-600 font-sans"><span className="font-semibold text-slate-800">Direct Resource Deploy</span>: 100% of available resources are routed straight into student scholarships, medical provisions, and documentation services.</p>
                </div>
                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                  <p className="text-slate-600 font-sans"><span className="font-semibold text-slate-800">On-the-ground Volunteers</span>: A dedicated squad of documentation helpers operating directly across remote municipal corners.</p>
                </div>
              </div>

              {/* Decorative timeline bullet */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <div className="flex items-center space-x-1">
                  <Milestone className="w-3.5 h-3.5" />
                  <span>ISO 9001 Compliant Operations</span>
                </div>
                <span>Regd. 471B/NCR</span>
              </div>
            </div>
          </div>

        </div>

        {/* Key Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, idx) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-6 rounded border border-slate-200/60 hover:border-amber-200 hover:shadow-md transition-all duration-300 group"
              id={`value-card-${idx}`}
            >
              <div className="p-2.5 bg-slate-50 rounded w-fit group-hover:scale-105 group-hover:bg-amber-50 transition-all duration-300 mb-5">
                {v.icon}
              </div>
              <h4 className="font-serif text-base text-slate-800 mb-2 group-hover:text-amber-800 transition-colors">
                {v.title}
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed font-sans">
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
