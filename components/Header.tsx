import React from 'react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddVendor: () => void;
  vendorCount: number;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, onAddVendor, vendorCount }) => (
  <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div className="px-4 h-16 flex items-center gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <i className="fa-solid fa-scale-balanced text-white text-lg" />
        </div>
        <div className="leading-tight">
          <h1 className="text-base font-bold text-slate-900 tracking-tight">Legal AI</h1>
          <p className="text-xs text-indigo-600 font-medium -mt-0.5">Vendor Tracker</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={`Search ${vendorCount} vendor${vendorCount !== 1 ? 's' : ''}...`}
          aria-label="Search vendors"
          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        )}
      </div>

      {/* Add Vendor */}
      <button
        onClick={onAddVendor}
        className="ml-auto flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <i className="fa-solid fa-plus text-xs" />
        Add Vendor
      </button>
    </div>
  </header>
);

export default Header;
