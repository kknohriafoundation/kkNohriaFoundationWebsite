/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, Lock } from 'lucide-react';

interface NavbarProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

export default function Navbar({ onNavigate, activeSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'about', label: 'About Us' },
    { id: 'pillars', label: 'Areas of Work' },
    { id: 'events', label: 'Events Archive' },
    { id: 'upcoming', label: 'Future Events' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300" id="main-navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Brand Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleItemClick('hero')} id="nav-brand-logo">
            <div className="w-9 h-9 bg-amber-700 rounded-sm flex items-center justify-center text-white font-serif text-lg font-bold shadow-sm transition-transform duration-300">
              K
            </div>
            <div>
              <p className="font-serif font-bold tracking-tight text-lg text-slate-800 leading-none">
                Krishan Kumar Nohria Foundation
              </p>
              <p className="text-[9px] font-mono tracking-wider text-slate-400 mt-1 uppercase">
                Serving Humanity with Dignity
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1" id="nav-desktop-menu">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  id={`nav-item-${item.id}`}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-amber-700 font-semibold underline underline-offset-4'
                      : 'text-slate-600 hover:text-amber-700'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <div className="h-4 w-[1px] bg-slate-200 mx-2" />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center" id="nav-mobile-hamburger">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-slate-800 p-2 rounded-lg focus:outline-none"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200" id="nav-mobile-dropdown">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded text-base font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-amber-700 bg-amber-50/50 font-semibold'
                      : 'text-slate-600 hover:text-slate-850 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
