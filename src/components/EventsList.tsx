/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Search, Filter, BookOpen, HeartPulse, FileText, Check, Award, ArrowRight, UserCheck } from 'lucide-react';
import { BaseEvent, CharityCategory } from '../types';
import { submitEventRegistration } from '../lib/supabase';

interface EventsListProps {
  events: BaseEvent[];
}

export default function EventsList({ events }: EventsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CharityCategory | 'All'>('All');
  const [activeTab, setActiveTab] = useState<'past' | 'upcoming'>('past');
  
  // Registration State
  const [registeringEvent, setRegisteringEvent] = useState<BaseEvent | null>(null);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regIsSubmitting, setRegIsSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Group events by type
  const pastEvents = events.filter(e => e.type === 'past');
  const upcomingEvents = events.filter(e => e.type === 'upcoming');

  const getCategoryIcon = (category: CharityCategory) => {
    switch (category) {
      case 'Education':
        return <BookOpen className="w-4 h-4" />;
      case 'Medical':
        return <HeartPulse className="w-4 h-4" />;
      case 'Documentation':
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryTheme = (category: CharityCategory) => {
    switch (category) {
      case 'Education':
        return 'bg-amber-50 text-amber-900 border-amber-155';
      case 'Medical':
        return 'bg-blue-50 text-blue-900 border-blue-155';
      case 'Documentation':
        return 'bg-emerald-50 text-emerald-900 border-emerald-155';
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone || !registeringEvent) return;

    setRegIsSubmitting(true);
    setRegError(null);
    try {
      const success = await submitEventRegistration({
        eventId: registeringEvent.id,
        eventTitle: registeringEvent.title,
        name: regName,
        email: regEmail,
        phone: regPhone,
      });
      if (!success) {
        setRegError('Registration failed. Please try again later.');
        return;
      }
      setRegSuccess(true);
      setTimeout(() => {
        // Clear registrations after showing a nice green checkbox
        setRegisteringEvent(null);
        setRegSuccess(false);
        setRegName('');
        setRegEmail('');
        setRegPhone('');
      }, 3000);
    } catch (err) {
      console.error('Registration failed', err);
      setRegError('Registration failed. Please try again.');
    } finally {
      setRegIsSubmitting(false);
    }
  };

  const displayedEvents = (activeTab === 'past' ? pastEvents : upcomingEvents)
    .filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            e.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

  return (
    <section className="bg-slate-50 py-20 border-t border-slate-200" id={activeTab === 'past' ? 'events' : 'upcoming'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-amber-800 font-mono text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 bg-amber-50 rounded border border-amber-100">
            Activity Timelines
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 tracking-tight mt-4 mb-4">
            Campaigns & Events Dashboard
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-sans font-light">
            Keep track of our past achievements and register to participate in our upcoming outreach camps.
          </p>
          <div className="w-12 h-[2px] bg-amber-700 mx-auto mt-6" />
        </div>

        {/* Dashboard Control Box */}
        <div className="bg-white rounded border border-slate-200 p-4 sm:p-5 shadow-sm mb-12 space-y-4 md:space-y-0 md:flex md:items-center md:flex-row md:justify-between">
          
          {/* Main Select Tabs */}
          <div className="flex bg-slate-100 p-1 rounded border border-slate-200 w-fit" id="event-type-tabs">
            <button
              onClick={() => {
                setActiveTab('past');
              }}
              className={`px-4 py-2 rounded text-xs font-semibold cursor-pointer uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'past'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/40'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Past Milestones ({pastEvents.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('upcoming');
              }}
              className={`px-4 py-2 rounded text-xs font-semibold cursor-pointer uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'upcoming'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/40'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Upcoming ({upcomingEvents.length})
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:w-3/5" id="search-filter-controls">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'past' ? 'past reports' : 'future drives'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-700 font-sans"
              />
            </div>

            {/* Category Select Filters */}
            <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0" id="category-scroller-badges">
              {(['All', 'Education', 'Medical', 'Documentation'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1 border cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-700 text-white border-transparent shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  {cat !== 'All' && getCategoryIcon(cat as CharityCategory)}
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Dynamic Display Grid */}
        {displayedEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded border border-slate-200 p-8 shadow-sm">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-serif text-slate-700">No campaigns found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 font-sans">
              There are currently no events matching "{searchTerm}" under category "{selectedCategory}" in {activeTab === 'past' ? 'Past Reports' : 'Upcoming Schedules'}.
            </p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            id="events-grid-layout"
          >
            <AnimatePresence mode="popLayout">
              {displayedEvents.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  key={item.id}
                  id={`event-card-${item.id}`}
                  className="bg-white rounded overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Event Card Thumbnail representation */}
                    <div className="relative aspect-[16/10] bg-slate-100 border-b border-slate-200 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-mono text-[10px] tracking-wider">
                          NO CAMPAIGN PHOTO
                        </div>
                      )}
                      
                      {/* Floating Category Badge */}
                      <span className={`absolute top-4 left-4 border text-[9px] font-mono tracking-wider font-bold uppercase px-2 py-0.5 rounded shadow-sm ${getCategoryTheme(item.category)}`}>
                        {item.category}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      {/* Date Indicator Row */}
                      <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(item.date).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif font-bold text-slate-800 text-base leading-snug line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Content details */}
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-4 font-sans font-light">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Operational Footer of Event Card */}
                  <div className="px-6 pb-6 pt-3 border-t border-slate-100/80 bg-slate-50/50">
                    {item.type === 'past' ? (
                      <div className="flex items-center text-amber-800 text-[10px] uppercase font-mono tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-2" />
                        <span>Past Campaign Event Logged</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center text-slate-600 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-amber-700 mr-1.5 flex-shrink-0" />
                          <span className="truncate font-sans font-medium text-xs">{item.location || 'Foundation Main Center'}</span>
                        </div>
                        <button
                          onClick={() => setRegisteringEvent(item)}
                          id={`reg-interest-btn-${item.id}`}
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center space-x-1.5 hover:scale-[1.01] cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Register Interest</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Dynamic Modal Drawer for upcoming event registrations */}
        {registeringEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md" id="registration-overlay">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="bg-white rounded p-6 sm:p-8 max-w-md w-full shadow-lg border border-slate-200 relative"
              id="registration-content-modal"
            >
              <h3 className="font-serif font-bold text-slate-900 text-xl tracking-tight mb-2">
                Register for Outreach Drive
              </h3>
              <p className="text-[10px] text-amber-800 font-mono uppercase tracking-wider mb-5">
                {registeringEvent.title}
              </p>

              {regSuccess ? (
                <div className="text-center py-8 space-y-3" id="reg-successbox">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="font-serif font-bold text-slate-800 text-base">Booking Request Submitted!</h4>
                  <p className="text-xs text-slate-500 font-sans font-light leading-relaxed">
                    Your details have been registered. Our help desk officer will coordinate transport logistics and schedules with you.
                  </p>
                </div>
              ) : (
                <>
                  {regError && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs p-3 rounded mb-4">
                      {regError}
                    </div>
                  )}
                  <form onSubmit={handleRegisterSubmit} className="space-y-4" id="registration-form">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Full Name</label>
                    <input
                      required
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Krishan Kumar"
                      className="w-full px-3.5 py-2 rounded border border-slate-200 text-sm focus:outline-none focus:border-amber-700 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Contact Email</label>
                    <input
                      required
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="contact@kknohriafoundation.org"
                      className="w-full px-3.5 py-2 rounded border border-slate-200 text-sm focus:outline-none focus:border-amber-700 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Phone Number</label>
                    <input
                      required
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 rounded border border-slate-200 text-sm focus:outline-none focus:border-amber-700 font-sans"
                    />
                  </div>

                  <div className="flex gap-2.5 pt-4">
                    <button
                      type="button"
                      onClick={() => setRegisteringEvent(null)}
                      className="flex-1 py-2.5 text-slate-600 bg-slate-50 hover:bg-slate-100 rounded text-xs uppercase tracking-wider font-semibold border border-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={regIsSubmitting}
                      className="flex-1 py-2.5 bg-amber-700 hover:bg-amber-800 disabled:opacity-70 text-white rounded text-xs uppercase tracking-wider font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      {regIsSubmitting ? (
                        <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Confirm Slot</span>
                      )}
                    </button>
                  </div>
                </form>
                </>
              )}
            </motion.div>
          </div>
        )}

      </div>
    </section>
  );
}
