import React from 'react';
import { Vendor } from '../types';
import CategoryBadge from './CategoryBadge';

interface VendorCardProps {
  vendor: Vendor;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const freshnessInfo = (lastFetched: string | null): { dot: string; label: string } => {
  if (!lastFetched) return { dot: 'bg-slate-300', label: 'Not fetched' };
  const days = (Date.now() - new Date(lastFetched).getTime()) / (1000 * 60 * 60 * 24);
  if (days <= 30) return { dot: 'bg-green-400', label: 'Fresh' };
  return { dot: 'bg-amber-400', label: 'Stale' };
};

const lastActivityDate = (vendor: Vendor): string | null => {
  if (vendor.activities.length === 0) return null;
  const sorted = [...vendor.activities].sort((a, b) => b.date.localeCompare(a.date));
  return sorted[0].date;
};

const formatDate = (dateStr: string) =>
  new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const domainOf = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const VendorCard: React.FC<VendorCardProps> = ({ vendor, isSelected, onSelect }) => {
  const { dot, label } = freshnessInfo(vendor.intelligence.lastFetched);
  const lastActivity = lastActivityDate(vendor);
  const visibleCategories = vendor.categories.slice(0, 2);
  const extraCount = vendor.categories.length - 2;

  return (
    <button
      onClick={() => onSelect(vendor.id)}
      className={`w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors relative ${
        isSelected ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className={`font-semibold text-sm truncate ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
          {vendor.name}
        </p>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${dot}`} title={label} />
      </div>

      {vendor.website && (
        <p className="text-xs text-slate-400 mb-2 truncate">{domainOf(vendor.website)}</p>
      )}

      <div className="flex flex-wrap gap-1 mb-2">
        {visibleCategories.map(cat => (
          <CategoryBadge key={cat} category={cat} size="xs" />
        ))}
        {extraCount > 0 && (
          <span className="text-xs text-slate-400 px-1.5 py-0.5">+{extraCount} more</span>
        )}
      </div>

      {lastActivity && (
        <p className="text-xs text-slate-400">
          <i className="fa-regular fa-calendar mr-1" />
          Last activity {formatDate(lastActivity)}
        </p>
      )}
    </button>
  );
};

export default VendorCard;
