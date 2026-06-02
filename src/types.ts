/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CharityCategory = 'Education' | 'Medical' | 'Documentation';

export interface BaseEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: CharityCategory;
  type: 'past' | 'upcoming';
  imageUrl?: string;
  location?: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  message: string;
  category: CharityCategory | 'General';
}
