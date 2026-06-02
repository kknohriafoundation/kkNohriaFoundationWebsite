/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseEvent } from './types';

// Let's use the precise images saved by the generate_image tool
import heroImage from './assets/images/hero_charity_1780322059856.png';
import educationImage from './assets/images/charity_education_1780322132794.png';
import medicalImage from './assets/images/charity_medical_1780322232258.png';

export { heroImage, educationImage, medicalImage };

export const INITIAL_EVENTS: BaseEvent[] = [
  {
    id: 'past-1',
    title: 'Vidyarthi Scholarship Award 2026',
    description: 'We proudly distributed academic support scholarships of up to ₹15,000 each to 35 bright, high-achieving students from government-aided schools. These scholarships cover resource books, calculators, and annual coaching dues to ensure financial hardships do not halt their educational dreams.',
    date: '2026-04-15',
    category: 'Education',
    type: 'past',
    imageUrl: educationImage,
  },
  {
    id: 'past-2',
    title: 'Free Health Screening & Medicine Distribution Camp',
    description: 'Arranged in association with expert physicians. We successfully provided free general physician consultation, blood pressure monitors, blood sugar screenings, and fundamental cardiac checkups to more than 160 senior citizens. Free baseline medicines were supplied for diagnosed conditions.',
    date: '2026-05-12',
    category: 'Medical',
    type: 'past',
    imageUrl: medicalImage,
  },
  {
    id: 'past-3',
    title: 'Jan Seva Documentation and Card Issuance Drive',
    description: 'Our team set up a neighborhood helpdesk to support local workers through paperwork on-site. Helped over 95 citizens apply and complete documentation for the central Medical Scheme cards, Ayushman Bharat registration, and Senior Citizen state transport passes.',
    date: '2026-03-24',
    category: 'Documentation',
    type: 'past',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'upcoming-1',
    title: 'Eldercare Vision Checkup & Free Spectacles Camp',
    description: 'An expert ophthalmologic camp aimed specifically at eye-health screening for older adults. Includes state-of-the-art diagnostic checking for cataracts, glaucoma screening, and custom prescription reading. Free reading glasses will be ordered and delivered directly to patients’ homes.',
    date: '2026-06-18',
    category: 'Medical',
    type: 'upcoming',
    location: 'Community Hall, Sector 4 Block C',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'upcoming-2',
    title: 'School Infrastructure Upgrade: Bench & Desk Distribution',
    description: 'Under our school assistance wing, we will be delivering 50 new dual-desk furniture pieces to replace aging facilities at Gov. Primary School No. 3. This initiative aims to provide students with a comfortable and ergonomically supporting environment to study productively.',
    date: '2026-07-05',
    category: 'Education',
    location: 'Government Primary School No. 3, Civil Lines',
    type: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'upcoming-3',
    title: 'Ration & Pension Benefit Authentication Assistance Camp',
    description: 'Helping elderly citizens activate their biometric files and links required for central pension deposits and monthly food rations. We will host legal and municipal documentation helpers to resolve technical card issues on the spot.',
    date: '2026-06-28',
    category: 'Documentation',
    location: 'Krishan Kumar Nohria Foundation Office, Wing-A Helpdesk',
    type: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600',
  }
];
