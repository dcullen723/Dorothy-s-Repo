
import React from 'react';
import { JobListing } from '../types';

interface JobCardProps {
  job: JobListing;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'linkedin': return 'fab fa-linkedin';
      case 'indeed': return 'fas fa-briefcase';
      case 'cloc': return 'fas fa-university';
      case 'builtinsf': return 'fas fa-rocket';
      default: return 'fas fa-globe';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {job.title}
          </h3>
          <p className="text-slate-600 font-medium">{job.company}</p>
        </div>
        <div className="flex gap-2">
          {job.isRemote && (
            <span className="bg-green-50 text-green-700 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
              Remote
            </span>
          )}
          <span className="bg-indigo-50 text-indigo-700 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
            {job.source}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
        <div className="flex items-center gap-1.5">
          <i className="fas fa-map-marker-alt text-slate-400"></i>
          {job.location}
        </div>
        <div className="flex items-center gap-1.5">
          <i className="far fa-clock text-slate-400"></i>
          {job.postedDate || 'Recent'}
        </div>
      </div>

      <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
        {job.summary}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <a 
          href={job.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-indigo-600 text-sm font-semibold hover:underline flex items-center gap-1"
        >
          View Listing
          <i className="fas fa-external-link-alt text-xs"></i>
        </a>
        <button className="text-slate-400 hover:text-pink-500 transition-colors p-1">
          <i className="far fa-heart text-lg"></i>
        </button>
      </div>
    </div>
  );
};

export default JobCard;
