export type VendorCategory =
  | 'Contracting'
  | 'Research'
  | 'Workflow'
  | 'eDiscovery'
  | 'Productivity'
  | 'Document Management'
  | 'Training';

export const ALL_CATEGORIES: VendorCategory[] = [
  'Contracting',
  'Research',
  'Workflow',
  'eDiscovery',
  'Productivity',
  'Document Management',
  'Training',
];

export type ActivityType = 'Demo' | 'Call' | 'Meeting' | 'Email';

export interface VendorContact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedIn: string;
  notes: string;
}

export interface VendorActivity {
  id: string;
  type: ActivityType;
  date: string;
  summary: string;
  attendees: string[];
  notes: string;
}

export interface GroundingSource {
  web: {
    uri: string;
    title: string;
  };
}

export interface AIIntelligence {
  latestRelease: string;
  aiModels: string[];
  recentFeatures: string[];
  lastFetched: string | null;
  sources: GroundingSource[];
}

export interface Vendor {
  id: string;
  name: string;
  website: string;
  description: string;
  categories: VendorCategory[];
  dataSources: string[];
  integrations: string[];
  contacts: VendorContact[];
  activities: VendorActivity[];
  intelligence: AIIntelligence;
  createdAt: string;
  updatedAt: string;
}

export interface AppFilters {
  searchQuery: string;
  selectedCategory: VendorCategory | 'All';
}
