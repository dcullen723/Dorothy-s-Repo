
import React from 'react';
import { SearchConfig } from '../types';

interface SettingsPanelProps {
  config: SearchConfig;
  onChange: (config: SearchConfig) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, onChange, onRefresh, isLoading }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 h-fit sticky top-20">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <i className="fas fa-sliders-h text-indigo-600"></i>
        Feed Controls
      </h2>

      <div className="space-y-6">
        <section>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Target Locations</label>
          <div className="flex flex-wrap gap-2">
            {config.locations.map(loc => (
              <span key={loc} className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1.5 rounded-md flex items-center gap-2">
                {loc}
                <button className="hover:text-red-500"><i className="fas fa-times"></i></button>
              </span>
            ))}
            <button className="text-indigo-600 text-xs font-semibold hover:underline">+ Add Region</button>
          </div>
        </section>

        <section>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Exclusions (Global)</label>
          <p className="text-[10px] text-slate-500 mb-2">Always filter out titles containing:</p>
          <div className="flex flex-wrap gap-2">
            {config.excludedKeywords.map(word => (
              <span key={word} className="bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1.5 rounded-md flex items-center gap-2 border border-red-100">
                {word}
                <i className="fas fa-ban text-[10px]"></i>
              </span>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Connected Sources</label>
          <div className="space-y-2">
            {['LinkedIn', 'Indeed', 'CLOC', 'BuiltInSF'].map(src => (
              <div key={src} className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors">
                <span className="text-sm text-slate-700">{src}</span>
                <div className="w-8 h-4 bg-indigo-600 rounded-full relative">
                  <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 ${
            isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
          }`}
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-sync-alt"></i>
          )}
          {isLoading ? 'Scanning Sources...' : 'Refresh Feed Now'}
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
