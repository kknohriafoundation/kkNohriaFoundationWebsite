/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import CharityWork from './components/CharityWork';
import EventsList from './components/EventsList';
import EventAdmin from './components/EventAdmin';
import AdminAuth from './components/AdminAuth';
import Footer from './components/Footer';
import { supabase, getEvents, addEvent, deleteEventFromDb } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { BaseEvent } from './types';
import { Shield, ArrowLeftRight } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [events, setEvents] = useState<BaseEvent[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const isAdminUser = session?.user?.user_metadata?.role === 'admin';

  useEffect(() => {
    // Detect admin path anywhere in the pathname so base path prefixes work
    // (e.g. when deployed under /kkNohriaFoundationWebsite/ or served at root).
    try {
      setIsAdminRoute(window.location.pathname.includes('/admin'));
    } catch (e) {
      setIsAdminRoute(false);
    }
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      setEventsLoading(true);
      const fetched = await getEvents();
      setEvents(fetched);
      setEventsLoading(false);
    };

    loadEvents();
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setAuthLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Keep local cache in sync so the public site can stay responsive.
  const saveEvents = (updatedEvents: BaseEvent[]) => {
    setEvents(updatedEvents);
    localStorage.setItem('kkn_foundation_events', JSON.stringify(updatedEvents));
  };

  const handleAddEvent = async (newEvent: BaseEvent, rawImageFile?: File) => {
    try {
      const saved = await addEvent(newEvent, rawImageFile);
      saveEvents([saved, ...events]);
    } catch (err) {
      console.error('Event save failed:', err);
      throw err;
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEventFromDb(id);
      const updated = events.filter((e) => e.id !== id);
      saveEvents(updated);
    } catch (err) {
      console.error('Event delete failed:', err);
      alert('Failed to delete the event. Please try again.');
    }
  };

  // Nav scroll controller
  const handleScrollTo = (id: string) => {
    setActiveSection(id);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const handleAdminAuthSuccess = async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-emerald-100 selection:text-emerald-950 font-sans antialiased text-stone-800">
      
      {/* Dynamic Navigation Bar */}
      <Navbar
        onNavigate={handleScrollTo}
        activeSection={activeSection}
      />

      <main className="flex-grow">
        {isAdminRoute ? (
          <div className="bg-stone-50" id="administrative-dashboard">
            {authLoading ? (
              <div className="py-24 text-center text-slate-500 text-sm font-medium">Loading authentication status...</div>
            ) : !session ? (
              <div className="py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto mb-10 text-center">
                <p className="text-[10px] font-mono uppercase tracking-widest text-amber-700 mb-3">Admin Access</p>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Admin Login</h1>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                  This area is for authorized foundation administrators only. Log in to manage events, campaign content, and public listings.
                </p>
              </div>
              <div className="max-w-xl mx-auto">
                <AdminAuth onSuccess={handleAdminAuthSuccess} />
              </div>
            </div>
            ) : !isAdminUser ? (
              <div className="py-20 px-4 sm:px-6 lg:px-8 text-center rounded-xl bg-white border border-slate-200 shadow-sm">
                <h3 className="font-serif font-bold text-slate-900 text-xl mb-3">Access Denied</h3>
                <p className="text-slate-500 text-sm mb-6">
                  Your account is authenticated, but not authorized to manage the foundation dashboard.
                </p>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold bg-amber-700 text-white hover:bg-amber-800"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                {/* Admin Dashboard Header */}
                <div className="bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-center">
                  <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-amber-700 mb-4">Admin Portal</p>
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Foundation Event Management</h1>
                    <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                      Manage event records, upload campaign images, and update public event details from this secure dashboard.
                    </p>
                  </div>
                </div>

                {/* Warning Info Ribbon */}
                <div className="bg-emerald-600 text-stone-100 px-4 py-3.5 text-center text-xs font-mono font-bold uppercase tracking-wider flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 border-b border-emerald-500 shadow-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="w-5 h-5 animate-pulse text-white fill-white/10" />
                    <span>Secure Local Administration Mode Active. Updates reflect instantly to client pages.</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center justify-center px-4 py-2 rounded text-[10px] uppercase tracking-wider font-semibold bg-white text-emerald-700 shadow-sm hover:bg-emerald-50"
                  >
                    Sign out
                  </button>
                </div>

                {/* Admin Input Module */}
                <EventAdmin
                  events={events}
                  onAddEvent={handleAddEvent}
                  onDeleteEvent={handleDeleteEvent}
                />

                {/* Anchor of live view */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <div className="flex items-center space-x-2 text-stone-500 text-xs font-semibold uppercase font-mono pb-2 border-b border-stone-200">
                    <ArrowLeftRight className="w-4 h-4" />
                    <span>Scroll down to verify updates on live components directly</span>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Standard Public Website Sections */
          <>
            <div id="hero">
              <Hero onExplore={handleScrollTo} />
            </div>
            
            <div id="about">
              <About />
            </div>

            <div id="pillars">
              <CharityWork />
            </div>
          </>
        )}

        {/* Dynamic Shared Events Feed (Visible in both modes for immediate updates preview check!) */}
        <div id="events">
          {eventsLoading ? (
            <div className="py-16 text-center text-slate-500 text-sm">Loading events...</div>
          ) : (
            <EventsList events={events} />
          )}
        </div>
      </main>

      {/* Styled Footer with Contact details */}
      <Footer onScrollTo={handleScrollTo} />
    </div>
  );
}
