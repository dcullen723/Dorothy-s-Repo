
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import JobCard from './components/JobCard';
import SettingsPanel from './components/SettingsPanel';
import { JobListing, SearchConfig } from './types';
import { fetchLegalOpsJobs } from './services/geminiService';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  const [config, setConfig] = useState<SearchConfig>({
    keywords: ['Legal Operations', 'Legal Technology', 'Legal Project Manager', 'Legal Systems'],
    locations: ['SF Bay Area', 'Remote'],
    excludedKeywords: ['Counsel', 'Attorney', 'Lawyer', 'Associate'],
    sources: ['LinkedIn', 'Indeed', 'CLOC', 'BuiltInSF']
  });

  const refreshFeed = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchLegalOpsJobs(config);
    setJobs(result.jobs);
    setSources(result.sources);
    setLastUpdated(new Date().toLocaleTimeString());
    setIsLoading(false);
  }, [config]);

  useEffect(() => {
    refreshFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopyEmail = () => {
    const jobListText = jobs.map(j => `
      ${j.title} at ${j.company} (${j.location})
      ${j.summary}
      View: ${j.url}
    `).join('\n---\n');
    
    const emailBody = `Daily LegalOps Job Feed - ${new Date().toLocaleDateString()}\n\nHere are your curated jobs:\n\n${jobListText}`;
    
    navigator.clipboard.writeText(emailBody);
    alert('Email draft copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Feed */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Today's Curated Feed</h2>
                <p className="text-slate-500 text-sm mt-1">
                  {isLoading ? 'Scanning reputable sources...' : `Found ${jobs.length} relevant positions for your profile.`}
                </p>
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Last Synced</span>
                <span className="text-sm text-slate-600 font-medium">{lastUpdated || 'Never'}</span>
              </div>
            </div>

            {isLoading ? (
              <div className="grid gap-6">
                {[1, 2, 3].map(n => (
                  <div key={n} className="bg-white rounded-xl border border-slate-200 p-8 animate-pulse">
                    <div className="h-4 bg-slate-100 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2 mb-8"></div>
                    <div className="h-3 bg-slate-100 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-100 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6">
                {jobs.length > 0 ? (
                  jobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-search text-slate-300 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No new matches today</h3>
                    <p className="text-slate-500 mt-1 max-w-sm mx-auto text-sm">
                      We couldn't find any fresh postings that meet your specific filters. Try widening your location or check back tomorrow.
                    </p>
                  </div>
                )}
              </div>
            )}

            {sources.length > 0 && (
              <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Data Sources & Grounding</h4>
                <div className="flex flex-wrap gap-4 px-2">
                  {sources.slice(0, 5).map((s, idx) => (
                    <a 
                      key={idx} 
                      href={s.web?.uri} 
                      target="_blank" 
                      rel="noopener"
                      className="text-[11px] text-slate-500 hover:text-indigo-600 truncate max-w-[200px]"
                    >
                      <i className="fas fa-link mr-1"></i>
                      {s.web?.title || 'External Source'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <SettingsPanel 
              config={config} 
              onChange={setConfig} 
              onRefresh={refreshFeed}
              isLoading={isLoading}
            />

            <div className="bg-indigo-900 rounded-xl p-6 text-white shadow-xl shadow-indigo-900/20">
              <h3 className="font-bold text-lg mb-2">Email Workflow</h3>
              <p className="text-indigo-200 text-xs mb-4 leading-relaxed">
                Your daily feed is ready. Click below to copy a pre-formatted email draft of today's best matches.
              </p>
              <button 
                onClick={handleCopyEmail}
                className="w-full bg-white text-indigo-900 font-bold py-2.5 rounded-lg text-sm hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                <i className="fas fa-envelope"></i>
                Draft Daily Email
              </button>
              
              <div className="mt-6 pt-6 border-t border-indigo-800 space-y-4">
                <div className="flex items-center gap-3 text-xs text-indigo-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-800 flex items-center justify-center">
                    <i className="fas fa-check text-[10px]"></i>
                  </div>
                  SF Bay Area / Remote only
                </div>
                <div className="flex items-center gap-3 text-xs text-indigo-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-800 flex items-center justify-center">
                    <i className="fas fa-check text-[10px]"></i>
                  </div>
                  Strict non-attorney filtering
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      {/* Floating Action for Mobile */}
      <button 
        onClick={refreshFeed}
        className="lg:hidden fixed bottom-6 right-6 bg-indigo-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-xl z-50 active:scale-90 transition-transform"
      >
        <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-sync-alt'}`}></i>
      </button>
    </div>
  );
};

export default App;
