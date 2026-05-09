import React from 'react';
import { AIIntelligence } from '../types';

interface IntelligenceTabProps {
  vendorName: string;
  intelligence: AIIntelligence;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const isStale = (lastFetched: string | null): boolean => {
  if (!lastFetched) return true;
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(lastFetched).getTime() > thirtyDaysMs;
};

const formatTimestamp = (ts: string): string => {
  return new Date(ts).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

const IntelligenceTab: React.FC<IntelligenceTabProps> = ({ vendorName, intelligence, onRefresh, isRefreshing }) => {
  const stale = isStale(intelligence.lastFetched);
  const hasData = intelligence.latestRelease || intelligence.aiModels.length > 0 || intelligence.recentFeatures.length > 0;

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {stale ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              <i className="fa-solid fa-circle-exclamation text-xs" />
              {intelligence.lastFetched ? 'Data may be stale (>30 days)' : 'Not yet fetched'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
              <i className="fa-solid fa-circle-check text-xs" />
              Up to date
            </span>
          )}
          {intelligence.lastFetched && (
            <span className="text-xs text-slate-400">Last fetched {formatTimestamp(intelligence.lastFetched)}</span>
          )}
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRefreshing ? (
            <>
              <i className="fa-solid fa-circle-notch fa-spin text-sm" />
              Fetching...
            </>
          ) : (
            <>
              <i className="fa-solid fa-wand-magic-sparkles text-sm" />
              Refresh with AI
            </>
          )}
        </button>
      </div>

      {!hasData && !isRefreshing && (
        <div className="text-center py-10 text-slate-400">
          <i className="fa-solid fa-robot text-3xl mb-3 block" />
          <p className="text-sm">No intelligence data yet.</p>
          <p className="text-xs mt-1">Click "Refresh with AI" to auto-fetch the latest info for {vendorName}.</p>
        </div>
      )}

      {isRefreshing && (
        <div className="text-center py-10 text-indigo-500">
          <i className="fa-solid fa-circle-notch fa-spin text-3xl mb-3 block" />
          <p className="text-sm font-medium">Searching the web for {vendorName}...</p>
          <p className="text-xs mt-1 text-slate-400">This may take a few seconds.</p>
        </div>
      )}

      {hasData && !isRefreshing && (
        <>
          {/* Latest Release */}
          {intelligence.latestRelease && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-rocket text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-1">Latest Release</p>
                  <p className="text-sm text-slate-800">{intelligence.latestRelease}</p>
                </div>
              </div>
            </div>
          )}

          {/* AI Models */}
          {intelligence.aiModels.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">AI Models</p>
              <div className="flex flex-wrap gap-2">
                {intelligence.aiModels.map((model, i) => (
                  <span key={i} className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-medium">
                    {model}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent Features */}
          {intelligence.recentFeatures.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Recent Features</p>
              <ul className="space-y-2">
                {intelligence.recentFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <i className="fa-solid fa-circle-check text-green-500 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sources */}
          {intelligence.sources.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Sources</p>
              <ul className="space-y-1">
                {intelligence.sources.slice(0, 5).map((src, i) => (
                  <li key={i}>
                    <a
                      href={src.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:underline flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
                      {src.web.title || src.web.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IntelligenceTab;
