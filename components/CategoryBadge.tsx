import React from 'react';
import { VendorCategory } from '../types';

const COLOR_MAP: Record<VendorCategory, string> = {
  'Contracting': 'bg-blue-100 text-blue-800',
  'Research': 'bg-green-100 text-green-800',
  'Workflow': 'bg-yellow-100 text-yellow-800',
  'eDiscovery': 'bg-purple-100 text-purple-800',
  'Productivity': 'bg-orange-100 text-orange-800',
  'Document Management': 'bg-teal-100 text-teal-800',
  'Training': 'bg-pink-100 text-pink-800',
};

interface CategoryBadgeProps {
  category: VendorCategory;
  size?: 'sm' | 'xs';
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'sm' }) => {
  const colors = COLOR_MAP[category];
  const sizeClass = size === 'xs' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colors} ${sizeClass} whitespace-nowrap`}>
      {category}
    </span>
  );
};

export default CategoryBadge;
