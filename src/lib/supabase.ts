/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { BaseEvent, ContactSubmission } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zjoghveikellhvoevmyg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4EcPXGX2uR_TpxX0xSvXpQ_780LHtnQ';
const storageBucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'event-images';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * SQL SCHEMA FOR SUPABASE SQL EDITOR:
 * Copy and execute the following SQL in your Supabase SQL Editor to initialize the required tables:
 * 
 * -- 1. Create events table
 * CREATE TABLE IF NOT EXISTS public.events (
 *   id TEXT PRIMARY KEY,
 *   title TEXT NOT NULL,
 *   description TEXT NOT NULL,
 *   date DATE NOT NULL,
 *   category TEXT NOT NULL,
 *   type TEXT NOT NULL CHECK (type IN ('past', 'upcoming')),
 *   image_url TEXT,
 *   location TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 * 
 * -- Enable public read access and authenticated write access for events
 * ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Allow public read access on events" ON public.events FOR SELECT USING (true);
 * CREATE POLICY "Allow authenticated full access on events" ON public.events TO authenticated USING (true) WITH CHECK (true);
 * 
 * -- 2. Create contact_submissions table
 * CREATE TABLE IF NOT EXISTS public.contact_submissions (
 *   id BIGSERIAL PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   email TEXT NOT NULL,
 *   phone TEXT,
 *   message TEXT NOT NULL,
 *   category TEXT NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 * 
 * ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Allow anonymous inserts on contact_submissions" ON public.contact_submissions FOR INSERT WITH CHECK (true);
 * CREATE POLICY "Allow authenticated read access on contact_submissions" ON public.contact_submissions TO authenticated FOR SELECT USING (true);
 * 
 * -- 3. Create registrations table
 * CREATE TABLE IF NOT EXISTS public.registrations (
 *   id BIGSERIAL PRIMARY KEY,
 *   event_id TEXT NOT NULL,
 *   event_title TEXT NOT NULL,
 *   name TEXT NOT NULL,
 *   email TEXT NOT NULL,
 *   phone TEXT NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 * 
 * ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Allow anonymous inserts on registrations" ON public.registrations FOR INSERT WITH CHECK (true);
 * CREATE POLICY "Allow authenticated read access on registrations" ON public.registrations TO authenticated FOR SELECT USING (true);
 * 
 * -- 4. Create a public bucket in Supabase storage named "event-images" or set VITE_SUPABASE_STORAGE_BUCKET.
 * --    If you want the browser upload flow to work, the bucket must be accessible from your client key.
 * --    For easiest setup, make the bucket public and use the same Supabase project as the app config.
 */

// Graceful local cache fallback key
const CACHE_KEY = 'kkn_foundation_events_backup';

/**
 * Fetch all events.
 * If fetching fails or table doesn't exist, fallback to cached events or seed INITIAL_EVENTS.
 */
export async function getEvents(): Promise<BaseEvent[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    if (data && data.length > 0) {
      // Map database schema values to BaseEvent
      const mappedEvents: BaseEvent[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        date: item.date,
        category: item.category ?? 'Education',
        type: item.type ?? 'upcoming',
        imageUrl: item.image_url,
        location: item.location
      }));
      // Backup to local storage
      localStorage.setItem(CACHE_KEY, JSON.stringify(mappedEvents));
      return mappedEvents;
    }

    localStorage.setItem(CACHE_KEY, JSON.stringify([]));
    return [];
  } catch (err) {
    console.warn('Supabase fetch failed or table is missing. Falling back to local storage cache.', err);
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return [];
      }
    }
    return [];
  }
}

/**
 * Resize an image file to a target maximum size in kilobytes.
 */
async function resizeImageIfNeeded(file: File, maxSizeKb = 390): Promise<File> {
  if (file.size <= maxSizeKb * 1024) return file;

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });

  const ratio = Math.sqrt((maxSizeKb * 1024) / file.size);
  const targetWidth = Math.max(1, Math.round(image.width * ratio));
  const targetHeight = Math.max(1, Math.round(image.height * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Unable to create canvas context for image resizing.');
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  let quality = 0.9;
  let blob: Blob | null = null;

  while (quality >= 0.3) {
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob) throw new Error('Image resize failed while converting to JPEG.');
    if (blob.size <= maxSizeKb * 1024) break;
    quality -= 0.1;
  }

  if (!blob) throw new Error('Unable to compress image to target size.');

  const fileName = file.name.replace(/\.[^.]+$/, '.jpg');
  return new File([blob], fileName, { type: 'image/jpeg' });
}

/**
 * Upload a campaign image file to Supabase storage.
 * Falls back to returning a base64 string or placeholder URL if upload fails.
 */
export async function uploadEventImage(file: File): Promise<string> {
  const uploadFile = await resizeImageIfNeeded(file, 390);
  const fileExt = uploadFile.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
  const filePath = `campaign_photos/${fileName}`;
  const bucket = storageBucket;

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, uploadFile, {
        upsert: true,
        cacheControl: '3600'
      });

    if (error || !data) {
      throw error ?? new Error('Supabase storage upload returned no data');
    }

    const publicUrlResult = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    const publicUrlData = publicUrlResult.data;
    if (!publicUrlData?.publicUrl) {
      throw new Error('Failed to retrieve public URL for uploaded file');
    }

    console.log('Uploaded event image to bucket:', bucket, filePath);
    return publicUrlData.publicUrl;
  } catch (err: any) {
    console.error('Supabase storage upload failed. Event save will stop:', err);
    throw new Error(
      `Event image upload failed.
       Confirm bucket '${bucket}' exists, is accessible, and that your Supabase storage settings allow uploads.
       Underlying error: ${err?.message ?? String(err)}`
    );
  }
}

/**
 * Save / insert a new event.
 */
export async function addEvent(event: BaseEvent, rawImageFile?: File): Promise<BaseEvent> {
  let finalImageUrl = event.imageUrl || '';
  
  if (rawImageFile) {
    finalImageUrl = await uploadEventImage(rawImageFile);
  }

  const dbRow: any = {
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    type: event.type,
    image_url: finalImageUrl,
    location: event.location || null
  };

  if (event.category) {
    dbRow.category = event.category;
  }

  try {
    let insertResult = await supabase.from('events').insert([dbRow]);

    if (insertResult.error && /column\s+"category"\s+.*does not exist|Could not find the 'category' column/i.test(insertResult.error.message)) {
      console.warn('Supabase events table has no category column; retrying insert without category.');
      delete dbRow.category;
      insertResult = await supabase.from('events').insert([dbRow]);
    }

    if (insertResult.error) throw insertResult.error;
    console.log('Saved event to database successfully:', event.id);
  } catch (err) {
    console.error('Could not save to Supabase. Event was not persisted.', err);
    throw err;
  }

  const current = await getLocalEvents();
  const updated = [ { ...event, imageUrl: finalImageUrl }, ...current];
  localStorage.setItem(CACHE_KEY, JSON.stringify(updated));

  return { ...event, imageUrl: finalImageUrl };
}


/**
 * Delete an event.
 */
export async function deleteEventFromDb(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
    console.log('Deleted event from database:', id);
  } catch (err) {
    console.error('Could not delete from Supabase.', err);
    throw err;
  }

  const current = await getLocalEvents();
  const updated = current.filter(e => e.id !== id);
  localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
  return true;
}

/**
 * Retrieve local backup cached events.
 */
async function getLocalEvents(): Promise<BaseEvent[]> {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      return [];
    }
  }
  return [];
}

/**
 * Submit general inquiry from bottom contact form.
 */
export async function submitContactSubmission(submission: ContactSubmission): Promise<boolean> {
  try {
    const { error } = await supabase.from('contact_submissions').insert([{
      name: submission.name,
      email: submission.email,
      phone: submission.phone || null,
      message: submission.message,
      category: submission.category
    }]);

    if (error) throw error;
    console.log('Submitted inquiry to Supabase contact_submissions successfully.');
    return true;
  } catch (err) {
    console.error('Failed backend submission of contact inquiry, saving to offline index:', err);
    // Store in a local backup array of contact messages for local recovery preview
    const saved = localStorage.getItem('kkn_contact_submissions') || '[]';
    try {
      const parsed = JSON.parse(saved);
      parsed.push({ ...submission, id: Date.now(), timestamp: new Date().toISOString() });
      localStorage.setItem('kkn_contact_submissions', JSON.stringify(parsed));
    } catch (e) {}
    return true;
  }
}

/**
 * Register interest / volunteer for upcoming outreach event.
 */
export async function submitEventRegistration(registration: {
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
}): Promise<boolean> {
  try {
    const { error } = await supabase.from('registrations').insert([{
      event_id: registration.eventId,
      event_title: registration.eventTitle,
      name: registration.name,
      email: registration.email,
      phone: registration.phone
    }]);

    if (error) throw error;
    console.log('Submitted event registration to Supabase registrations table.');
    return true;
  } catch (err) {
    console.error('Failed database submission of registration, saving to offline backup index:', err);
    const saved = localStorage.getItem('kkn_event_registrations') || '[]';
    try {
      const parsed = JSON.parse(saved);
      parsed.push({ ...registration, id: Date.now(), timestamp: new Date().toISOString() });
      localStorage.setItem('kkn_event_registrations', JSON.stringify(parsed));
    } catch (e) {}
    return false;
  }
}
