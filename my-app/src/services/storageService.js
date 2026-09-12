/**
 * SURAKSHA MESH - Storage & Supabase Dual-Mode Service Layer
 * Supports seamless offline/demo operation + real-time Supabase DB sync.
 */

import { createClient } from '@supabase/supabase-js';

// Supabase credentials (can be configured via env vars or default sandbox)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://surakshamesh-mock.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key-suraksha-mesh-2026';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const INITIAL_SEED_CASES = [
  {
    id: 'case-1',
    caseCode: 'SM-2026-84291',
    category: 'ONLINE_GROOMING',
    childAgeBracket: 'UNDER_14',
    language: 'English',
    platform: 'Instagram Direct',
    rawDescription: 'Someone named Alex asked me not to tell my parents about our chats and asked for private photos of me in my room.',
    aiRiskScore: 92,
    aiRiskLevel: 'HIGH',
    urgencyLevel: 'P1 - Immediate Intervention',
    aiSummary: 'Child reported grooming escalation: Trust-building followed by secrecy demand and private media solicitation.',
    behavioralIndicators: ['Secrecy Request', 'Trust Exploitation', 'Private Media Solicitation'],
    evidenceSnippets: [
      'Alex: Do not tell your parents we talk.',
      'Alex: Send me a private photo to prove you trust me.'
    ],
    recommendedAction: 'Immediate counselling outreach; preserve forensic chat timestamps; contact regional cyber child protection cell.',
    status: 'UNDER_REVIEW',
    assignedOrganization: 'Pratham Child Welfare Foundation & Cyber Cell Unit',
    assignedCounsellor: 'Dr. Sunita Sharma (Child Psychologist)',
    regionZone: 'Western Zone / Mumbai Metro',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    timeline: [
      {
        status: 'RECEIVED',
        title: 'Report Received Anonymously',
        time: '4 hours ago',
        actor: 'Encrypted Ingestion Gateway'
      },
      {
        status: 'AI_ANALYZED',
        title: 'AI Pattern Analysis Complete',
        time: '3 hours 55 mins ago',
        actor: 'AI Grooming Radar Engine (92% Risk)'
      },
      {
        status: 'UNDER_REVIEW',
        title: 'Case Triaged by Authorized Officer',
        time: '2 hours ago',
        actor: 'Officer V. Deshmukh (Cyber Cell Triage)'
      }
    ]
  },
  {
    id: 'case-2',
    caseCode: 'SM-2026-39102',
    category: 'CYBERBULLYING',
    childAgeBracket: '14_PLUS',
    language: 'Hinglish / Hindi',
    platform: 'Discord / School Group',
    rawDescription: 'Classmates created an anonymous server and are posting edited abusive photos and threatening to make everyone hate me.',
    aiRiskScore: 84,
    aiRiskLevel: 'HIGH',
    urgencyLevel: 'P1 - Immediate Intervention',
    aiSummary: 'Targeted cyberbullying and extortion: Coercion to ruin social reputation via leaked altered media.',
    behavioralIndicators: ['Extortion & Blackmail', 'Targeted Harassment', 'Reputational Threat'],
    evidenceSnippets: [
      'Troll: I will post your photos everywhere and make everyone hate you.'
    ],
    recommendedAction: 'Engage School Disciplinary Cell & Counselor; issue takedown request.',
    status: 'ASSIGNED',
    assignedOrganization: 'School Mental Health & Disciplinary Committee',
    assignedCounsellor: 'Kiran Rao (Student Counsellor)',
    regionZone: 'Pune East Academic Zone',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    timeline: [
      {
        status: 'RECEIVED',
        title: 'Report Received',
        time: '18 hours ago',
        actor: 'Anonymous SOS'
      },
      {
        status: 'AI_ANALYZED',
        title: 'AI High Risk Threat Flagged',
        time: '17 hours 50 mins ago',
        actor: 'AI Safety Engine'
      },
      {
        status: 'UNDER_REVIEW',
        title: 'Reviewed by Triage Team',
        time: '12 hours ago',
        actor: 'Triage Lead'
      },
      {
        status: 'ASSIGNED',
        title: 'Assigned to School Support Unit',
        time: '6 hours ago',
        actor: 'Assigned to Kiran Rao'
      }
    ]
  },
  {
    id: 'case-3',
    caseCode: 'SM-2026-51204',
    category: 'MALICIOUS_PHISHING',
    childAgeBracket: 'UNDER_14',
    language: 'English',
    platform: 'Roblox / In-Game Chat',
    rawDescription: 'Received a link offering free robux that asked for my password and school location.',
    aiRiskScore: 68,
    aiRiskLevel: 'MEDIUM',
    urgencyLevel: 'P2 - Priority Review',
    aiSummary: 'Credential harvesting link & personal location probing targeted at young gamer.',
    behavioralIndicators: ['Malicious Link Detection', 'Personal Info Harvesting'],
    evidenceSnippets: ['Free reward link: http://login-claim-gems.xyz/gift'],
    recommendedAction: 'Provide cyber hygiene guidance; add domain to national child safety DNS blocklist.',
    status: 'RESOLVED',
    assignedOrganization: 'National Cyber Safety Portal (I4C)',
    assignedCounsellor: 'Cyber Hygiene Team',
    regionZone: 'Goa Coastal Zone',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    timeline: [
      {
        status: 'RECEIVED',
        title: 'Report Received',
        time: '2 days ago',
        actor: 'Anonymous Gateway'
      },
      {
        status: 'AI_ANALYZED',
        title: 'Phishing Pattern Identified',
        time: '2 days ago',
        actor: 'Threat Intelligence Engine'
      },
      {
        status: 'RESOLVED',
        title: 'Domain Blocked & Child Advised',
        time: '1 day ago',
        actor: 'Cyber Safety Team'
      }
    ]
  }
];

const STORAGE_KEY = 'suraksha_mesh_cases_v2';

export const StorageService = {
  getCases() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage error, using memory seed:', e);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_CASES));
    return INITIAL_SEED_CASES;
  },

  getCaseByCode(code) {
    const cases = this.getCases();
    const clean = code.trim().toUpperCase();
    return cases.find(c => c.caseCode.toUpperCase() === clean);
  },

  saveCase(newCase) {
    const cases = this.getCases();
    const fullCase = {
      id: `case-${Date.now()}`,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'RECEIVED',
          title: 'Anonymous Report Received',
          time: 'Just now',
          actor: 'Encrypted Ingestion Gateway'
        },
        {
          status: 'AI_ANALYZED',
          title: `AI Pattern Analysis (${newCase.riskScore || 75}% Risk)`,
          time: 'Just now',
          actor: 'AI Grooming Radar Engine'
        }
      ],
      status: 'UNDER_REVIEW',
      ...newCase
    };
    cases.unshift(fullCase);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    return fullCase;
  },

  updateCaseStatus(caseId, nextStatus, note = '') {
    const cases = this.getCases();
    const target = cases.find(c => c.id === caseId || c.caseCode === caseId);
    if (target) {
      target.status = nextStatus;
      target.timeline.push({
        status: nextStatus,
        title: `Status updated to ${nextStatus.replace('_', ' ')}`,
        time: 'Just now',
        actor: note || 'Authorized Responder Action'
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
      return target;
    }
    return null;
  }
};
