/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, HeartHandshake, ShieldAlert, CheckCircle2, Ruler, BookOpen, Clock, Users } from 'lucide-react';
import { educationImage, medicalImage } from '../data';

export default function CharityWork() {
  const pillars = [
    {
      id: 'education-pillar',
      icon: <GraduationCap className="w-6 h-6 text-slate-800" />,
      title: 'Education & Student Support',
      tagline: 'Illuminating futures through scholarly assistance and upgraded classroom structures.',
      image: educationImage,
      color: 'border-slate-200 bg-white hover:border-amber-200',
      tagColor: 'bg-amber-50 text-amber-800 border border-amber-100',
      highlights: [
        'Vidyarthi Scholarships covering 100% of study coaching costs.',
        'Distribution of textbook kits, geometry aids, and reference materials.',
        'Infrastructure support: classroom roofing, benches, and clean drinking water networks.',
        'Special mentorship programs linking scholars with career educators.'
      ],
      stats: '250+ Students Supported Annualy'
    },
    {
      id: 'medical-pillar',
      icon: <HeartHandshake className="w-6 h-6 text-slate-800" />,
      title: 'Medical Camps & Elder Care',
      tagline: 'Direct healthcare deployments and sustaining support services for older citizens.',
      image: medicalImage,
      color: 'border-slate-200 bg-white hover:border-amber-200',
      tagColor: 'bg-amber-50 text-amber-800 border border-amber-100',
      highlights: [
        'Free multi-diagnostic general medical camps in remote blocks.',
        'Eye checkup drives providing customized prescription lenses.',
        'Complimentary distribution of life-saving baseline medications.',
        'Senior Citizen aid: providing walking sticks, wheelchairs, and dietary help.'
      ],
      stats: '1,500+ Patients Treated This Year'
    },
    {
      id: 'documentation-pillar',
      icon: <ShieldAlert className="w-6 h-6 text-slate-800" />,
      title: 'Scheme Documentation Helpdesk',
      tagline: 'Bridging the awareness divides to help marginal citizens access welfare rights.',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600',
      color: 'border-slate-200 bg-white hover:border-amber-200',
      tagColor: 'bg-amber-50 text-amber-800 border border-amber-100',
      highlights: [
        'End-to-end guidance and filing of Ayushman Bharat Health Guard cards.',
        'Correcting Ration Card linkages to secure mandatory subsidized wheat/pulses.',
        'Assisting widows and elderly through state pension application processing.',
        'Establishing persistent bilingual help centers for general paper filings.'
      ],
      stats: '950+ Successfully Filed Claims'
    }
  ];

  return (
    <section className="bg-white py-20" id="pillars">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-800 font-mono text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 bg-amber-50 rounded border border-amber-100 animate-fade-in">
            How We Give Back
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 tracking-tight mt-4 mb-4">
            Our Key Areas of Charity
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-light font-sans max-w-xl mx-auto">
            We focus on structured, measurable initiatives that provide immediate relief and long-term socio-economic elevation to those in extreme need.
          </p>
          <div className="w-12 h-[2px] bg-amber-700 mx-auto mt-6" />
        </div>

        {/* Pillars List */}
        <div className="space-y-12">
          {pillars.map((pillar, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={pillar.id}
                id={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center p-6 sm:p-8 rounded border transition-all duration-300 hover:shadow-md ${pillar.color}`}
              >
                {/* Image Panel - alternate styling on desktop */}
                <div className={`col-span-1 lg:col-span-5 order-last ${isEven ? 'lg:order-first' : ''}`}>
                  <div className="relative rounded overflow-hidden shadow-sm bg-white border border-slate-200 aspect-[4/3]">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {/* Floating Statistic Accent */}
                    <div className="absolute top-4 left-4 bg-slate-900/95 backdrop-blur-sm text-white px-3 py-1 rounded text-[9px] font-mono shadow-sm border border-slate-800 uppercase tracking-wider">
                      {pillar.stats}
                    </div>
                  </div>
                </div>

                {/* Information Content Panel */}
                <div className="col-span-1 lg:col-span-7 space-y-5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-slate-100 rounded border border-slate-200">
                      {pillar.icon}
                    </div>
                    <span className={`text-[9px] font-mono tracking-wider font-extrabold uppercase px-2 py-0.5 rounded ${pillar.tagColor}`}>
                      Pillar {idx + 1}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl text-slate-800 tracking-tight">
                    {pillar.title}
                  </h3>

                  <p className="text-slate-600 font-sans font-light text-xs sm:text-sm leading-relaxed">
                    {pillar.tagline}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {pillar.highlights.map((bullet, checkIdx) => (
                      <div key={checkIdx} className="flex items-start space-x-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-4.5 h-4.5 text-amber-700 flex-shrink-0 mt-0.5" />
                        <span className="font-sans leading-tight">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
