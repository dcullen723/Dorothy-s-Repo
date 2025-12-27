
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <i className="fas fa-gavel text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            LegalOps <span className="text-indigo-600 font-normal">Navigator</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            <i className="fas fa-bell mr-2"></i>
            Daily Feed Active
          </button>
          <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500 font-semibold text-xs">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
