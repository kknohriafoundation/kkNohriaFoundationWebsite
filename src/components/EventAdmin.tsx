/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { PlusCircle, Upload, Trash2, Calendar, MapPin, Image as ImageIcon, BookOpen, HeartPulse, FileText, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import { BaseEvent, CharityCategory } from '../types';

interface EventAdminProps {
  events: BaseEvent[];
  onAddEvent: (newEvent: BaseEvent, rawImageFile?: File) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
}

export default function EventAdmin({ events, onAddEvent, onDeleteEvent }: EventAdminProps) {
  // Navigation Tabs
  const [activeAdminTab, setActiveAdminTab] = useState<'create' | 'manage'>('create');
  const [eventType, setEventType] = useState<'past' | 'upcoming'>('past');

  // Input States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CharityCategory>('Education');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Drag and Drop Image File States
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  // Status flags
  const [isAdded, setIsAdded] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Read File Helper
  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }
    setFileName(file.name);
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag Event Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle Create Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !description) return;

    // Use default illustration fallback if no image is uploaded
    let finalImageUrl = imageUrl;
    if (!finalImageUrl) {
      if (category === 'Education') {
        finalImageUrl = 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=600';
      } else if (category === 'Medical') {
        finalImageUrl = 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600';
      } else {
        finalImageUrl = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600';
      }
    }

    const newEvent: BaseEvent = {
      id: `custom-${Date.now()}`,
      title,
      description,
      date,
      category,
      type: eventType,
      imageUrl: finalImageUrl,
      ...(eventType === 'upcoming' ? { location: location || 'Krishan Kumar Nohria Center' } : {})
    };

    try {
      await onAddEvent(newEvent, imageFile);
      setSaveError(null);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        // Reset inputs
        setTitle('');
        setDate('');
        setDescription('');
        setLocation('');
        setImageUrl('');
        setFileName('');
      }, 2550);
    } catch (err: any) {
      console.error('Event save failed:', err);
      setSaveError(err?.message || 'Failed to save event to Supabase. Please check your permissions and try again.');
    }
  };

  return (
    <section className="bg-slate-100 py-12 border-t border-slate-200" id="admin-board">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        
        {/* Panel Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h2 className="font-serif font-bold text-slate-900 text-2xl tracking-tight">
              Operational Management Dashboard
            </h2>
            <p className="text-[10px] font-mono tracking-wider text-slate-400 mt-1 uppercase">
              Foundation Event Registry Panel
            </p>
          </div>

          <div className="flex gap-1.5 mt-4 md:mt-0 bg-slate-200 p-1 rounded">
            <button
              onClick={() => setActiveAdminTab('create')}
              className={`px-4 py-2 rounded text-xs font-bold transition-all cursor-pointer ${
                activeAdminTab === 'create'
                  ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Post New Event
            </button>
            <button
              onClick={() => setActiveAdminTab('manage')}
              className={`px-4 py-2 rounded text-xs font-bold transition-all cursor-pointer ${
                activeAdminTab === 'manage'
                  ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Manage Database ({events.length})
            </button>
          </div>
        </div>

        {/* Create/Record Form Panel */}
        {activeAdminTab === 'create' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Inputs Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white rounded p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                <div className="p-2 bg-amber-50 text-amber-700 rounded">
                  <PlusCircle className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-serif font-bold text-slate-800 text-lg">Record a New Initiative</h3>
              </div>

              {isAdded && (
                <div className="bg-emerald-50 border border-emerald-150 text-emerald-800 p-4 rounded text-xs sm:text-sm flex items-center space-x-3 font-semibold">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0 animate-bounce" />
                  <span>The campaign event has been successfully compiled and recorded into active registers!</span>
                </div>
              )}

              {saveError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded text-xs sm:text-sm">
                  {saveError}
                </div>
              )}

              {/* Event Workflow Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Campaign Stage</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as 'past' | 'upcoming')}
                    className="w-full px-3 py-2 rounded border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-700 bg-white cursor-pointer"
                  >
                    <option value="past">Completed Event (Archive with photo)</option>
                    <option value="upcoming">Future Event (Upcoming drive/schedule)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Sector / Pillar</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CharityCategory)}
                    className="w-full px-3 py-2 rounded border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-700 bg-white cursor-pointer"
                  >
                    <option value="Education">Education Support & Infrastructure</option>
                    <option value="Medical">Medical Screening Campaign</option>
                    <option value="Documentation">Government Schemes Documentation Help</option>
                  </select>
                </div>
              </div>

              {/* Title input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Event / Seminar Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Free Mobile Dispensary Outreach or Scholar Aid ceremony"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4.5 py-2 rounded border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-700"
                />
              </div>

              {/* Date & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Deployment Date</span>
                  </label>
                  <input
                    required
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 rounded border border-slate-200 text-xs sm:text-sm bg-white cursor-pointer focus:outline-none focus:border-amber-700"
                  />
                </div>

                {eventType === 'upcoming' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Camp Venue / Site Address</span>
                    </label>
                    <input
                      required={eventType === 'upcoming'}
                      type="text"
                      placeholder="e.g. Town Hall Wing B, Opp Civil Station"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2 rounded border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-700"
                    />
                  </div>
                )}
              </div>

              {/* Description body */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Campaign Report Summary</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Draft dynamic briefs regarding scope of the event. Elaborate on the services rendered, support mechanisms, and targets achieved..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-700"
                />
              </div>

              {/* Photo upload UI block */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Attach Campaign Photograph (Required for Past Events)</label>
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded p-6 text-center transition-all ${
                    dragActive 
                      ? 'border-amber-700 bg-amber-50/30' 
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-2.5 bg-white rounded text-slate-400 shadow-sm border border-slate-200">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {fileName ? (
                          <span className="text-amber-800 font-extrabold">✓ Attached: {fileName}</span>
                        ) : (
                          'Drag & drop campaign photo here, or browse storage files'
                        )}
                      </p>
                      <p className="text-[9px] text-slate-400 mt-1 font-mono uppercase">Supports JPEG, PNG up to 5MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={onButtonClick}
                      className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold rounded shadow-sm transition mt-1 uppercase tracking-wider cursor-pointer"
                    >
                      Browse Files
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Submit */}
              <button
                type="submit"
                id="submit-record-btn"
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 border border-transparent rounded text-xs uppercase tracking-wider font-semibold text-white shadow transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4.5 h-4.5" />
                <span>Compile & Post to Foundation Registers</span>
              </button>

            </form>

            {/* Preview Card Showcase - Right */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded p-6 border border-slate-200 shadow-sm">
                <h4 className="font-serif font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 uppercase tracking-wider">
                  Live View Preview
                </h4>
                
                <div className="mt-4 rounded overflow-hidden border border-slate-200 shadow-sm bg-white">
                  <div className="relative aspect-[16/10] bg-slate-50 flex items-center justify-center text-slate-400 border-b border-slate-200">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-[10px] font-mono tracking-wider text-slate-400">
                        <ImageIcon className="w-6 h-6 text-slate-300 mb-1" />
                        <span>No photo attached</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-slate-900/90 text-white font-mono text-[9px] uppercase px-2 py-0.5 rounded border border-slate-800 shadow-sm">
                      {category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'June 1, 2026'}</span>
                    </p>
                    <h3 className="font-serif font-bold text-slate-800 leading-snug text-base line-clamp-1">
                      {title || 'Your Campaign Title'}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 font-sans font-light">
                      {description || 'Provide detailed summaries on the left to see dynamic preview cards reflecting your entries instantly here.'}
                    </p>
                    
                    {eventType === 'upcoming' && (
                      <div className="pt-2 border-t border-slate-105 flex items-center text-[10px] text-slate-500 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-amber-700 mr-1" />
                        <span className="truncate">{location || 'Foundation Main Center'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Brief usage instructions */}
              <div className="bg-amber-50 rounded p-5 border border-amber-100 text-amber-900 space-y-2.5">
                <h4 className="font-serif font-bold text-slate-800 text-sm flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0 animate-pulse" />
                  <span>Interactive Administration Guide</span>
                </h4>
                <div className="text-xs space-y-1.5 text-amber-800 font-sans leading-relaxed">
                  <p>• Any records published here are instantly compiled into local cache layers (`localStorage`) and will show up in the archives below.</p>
                  <p>• Select "Completed Event" to document completed historical campaigns with official photos.</p>
                  <p>• Select "Future Event" to generate upcoming drives with registration parameters.</p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Live Database Manager List with delete switches */
          <div className="bg-white rounded p-6 sm:p-8 border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
            <h3 className="font-serif font-bold text-slate-800 text-lg border-b border-slate-100 pb-3 mb-6 flex items-center justify-between">
              <span>Database Records Registry</span>
              <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">Total Compiled: {events.length}</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" id="manage-records-table">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase font-mono tracking-wider text-slate-400">
                    <th className="pb-3 font-semibold">Campaign Event Title</th>
                    <th className="pb-3 font-semibold">Pillar</th>
                    <th className="pb-3 font-semibold">State</th>
                    <th className="pb-3 font-semibold">Deployment Date</th>
                    <th className="pb-3 font-semibold text-right">Operational Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-sans">
                  {events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50/50 transition duration-150">
                      <td className="py-4 pr-4">
                        <p className="font-bold text-slate-800 line-clamp-1">{ev.title}</p>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{ev.description}</p>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-600 uppercase font-mono border border-slate-200">
                          {ev.category}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          ev.type === 'past' ? 'bg-amber-50 text-amber-800 border border-amber-100' : 'bg-blue-50 text-blue-800 border border-blue-100'
                        }`}>
                          {ev.type}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-slate-500 font-mono text-xs">
                        {new Date(ev.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => onDeleteEvent(ev.id)}
                          className="p-1 px-3 bg-red-50 hover:bg-rose-100 text-rose-700 transition rounded text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 ml-auto cursor-pointer border border-rose-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
