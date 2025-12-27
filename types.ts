
export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  source: string;
  url: string;
  summary: string;
  postedDate: string;
  isRemote: boolean;
}

export interface SearchConfig {
  keywords: string[];
  locations: string[];
  excludedKeywords: string[];
  sources: string[];
}

export interface GroundingSource {
  web: {
    uri: string;
    title: string;
  };
}
