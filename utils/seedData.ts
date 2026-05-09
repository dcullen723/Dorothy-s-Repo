import { Vendor } from '../types';

const now = new Date().toISOString();

export const SEED_VENDORS: Vendor[] = [
  {
    id: 'seed-1',
    name: 'Harvey AI',
    website: 'https://www.harvey.ai',
    description: 'AI platform for legal professionals built on advanced language models, specializing in legal research, drafting, and contract analysis for law firms and corporate legal departments.',
    categories: ['Research', 'Contracting', 'Workflow'],
    dataSources: ['Case law', 'Statutes', 'Regulations', 'Internal documents'],
    integrations: ['Microsoft Word', 'Outlook', 'iManage', 'NetDocuments'],
    contacts: [
      {
        id: 'c-seed-1-1',
        name: 'Winston Peters',
        title: 'Enterprise Account Executive',
        email: 'wpeters@harvey.ai',
        phone: '+1 415-555-0101',
        linkedIn: 'https://linkedin.com/in/winstonpeters',
        notes: 'Primary sales contact. Very responsive via email.',
      },
    ],
    activities: [
      {
        id: 'a-seed-1-1',
        type: 'Demo',
        date: '2026-03-15',
        summary: 'Product demo covering contract analysis and legal research workflows.',
        attendees: ['Sarah Chen (Legal Ops)', 'Mark Liu (IT)', 'Winston Peters (Harvey)'],
        notes: 'Impressive contract redlining speed. Need to evaluate data security controls.',
      },
    ],
    intelligence: {
      latestRelease: '',
      aiModels: [],
      recentFeatures: [],
      lastFetched: null,
      sources: [],
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'seed-2',
    name: 'Ironclad',
    website: 'https://www.ironcladapp.com',
    description: 'Digital contracting platform that streamlines the entire contract lifecycle—from creation and negotiation to execution and management—for legal and business teams.',
    categories: ['Contracting', 'Workflow', 'Document Management'],
    dataSources: ['Contract repositories', 'CRM data', 'ERP data'],
    integrations: ['Salesforce', 'Workday', 'DocuSign', 'Adobe Sign', 'Slack', 'Google Drive'],
    contacts: [
      {
        id: 'c-seed-2-1',
        name: 'Jamie Rodriguez',
        title: 'Solutions Engineer',
        email: 'jrodriguez@ironcladapp.com',
        phone: '+1 628-555-0204',
        linkedIn: 'https://linkedin.com/in/jamierodr',
        notes: 'Technical contact for integration questions.',
      },
    ],
    activities: [
      {
        id: 'a-seed-2-1',
        type: 'Call',
        date: '2026-04-02',
        summary: 'Discovery call to understand our current contract workflow and pain points.',
        attendees: ['Dorothy Wilson (Legal Ops)', 'Jamie Rodriguez (Ironclad)'],
        notes: 'Discussed Salesforce integration and approval workflow automation. Follow-up demo scheduled.',
      },
    ],
    intelligence: {
      latestRelease: '',
      aiModels: [],
      recentFeatures: [],
      lastFetched: null,
      sources: [],
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'seed-3',
    name: 'Relativity',
    website: 'https://www.relativity.com',
    description: 'Leading e-discovery and legal operations platform used by law firms, corporations, and government agencies for document review, case management, and compliance.',
    categories: ['eDiscovery', 'Document Management', 'Workflow'],
    dataSources: ['Email archives', 'Cloud storage', 'Enterprise data repositories', 'Mobile data'],
    integrations: ['Microsoft 365', 'Slack', 'Google Workspace', 'Nuix', 'ZL Technologies'],
    contacts: [],
    activities: [
      {
        id: 'a-seed-3-1',
        type: 'Meeting',
        date: '2026-01-20',
        summary: 'Annual business review and roadmap discussion.',
        attendees: ['Dorothy Wilson (Legal Ops)', 'Tom Baker (IT)', 'Relativity CSM team'],
        notes: 'Reviewed usage stats. CSM shared 2026 roadmap including new AI-assisted review features.',
      },
    ],
    intelligence: {
      latestRelease: '',
      aiModels: [],
      recentFeatures: [],
      lastFetched: null,
      sources: [],
    },
    createdAt: now,
    updatedAt: now,
  },
];
