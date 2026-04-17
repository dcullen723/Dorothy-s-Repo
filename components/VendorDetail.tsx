import React, { useState } from 'react';
import { Vendor } from '../types';
import CategoryBadge from './CategoryBadge';
import IntelligenceTab from './IntelligenceTab';
import ContactsTab from './ContactsTab';
import ActivitiesTab from './ActivitiesTab';

type TabId = 'intelligence' | 'contacts' | 'activities';

interface VendorDetailProps {
  vendor: Vendor;
  onUpdate: (updated: Vendor) => void;
  onDelete: (id: string) => void;
  isRefreshing: boolean;
  onRefreshIntelligence: (vendorId: string) => void;
  onEdit: (vendor: Vendor) => void;
}

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'intelligence', label: 'Intelligence', icon: 'fa-solid fa-wand-magic-sparkles' },
  { id: 'contacts', label: 'Contacts', icon: 'fa-solid fa-address-book' },
  { id: 'activities', label: 'Activities', icon: 'fa-solid fa-calendar-days' },
];

const domainOf = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const VendorDetail: React.FC<VendorDetailProps> = ({
  vendor, onUpdate, onDelete, isRefreshing, onRefreshIntelligence, onEdit,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('intelligence');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleContactsUpdate = (contacts: Vendor['contacts']) => {
    onUpdate({ ...vendor, contacts, updatedAt: new Date().toISOString() });
  };

  const handleActivitiesUpdate = (activities: Vendor['activities']) => {
    onUpdate({ ...vendor, activities, updatedAt: new Date().toISOString() });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Vendor Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-slate-900 truncate">{vendor.name}</h2>
            </div>
            {vendor.website && (
              <a
                href={vendor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-500 hover:underline flex items-center gap-1 mb-2"
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
                {domainOf(vendor.website)}
              </a>
            )}
            {vendor.description && (
              <p className="text-sm text-slate-600 leading-relaxed">{vendor.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit(vendor)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Edit vendor"
            >
              <i className="fa-solid fa-pen text-sm" />
            </button>
            {showDeleteConfirm ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-red-600 font-medium">Delete?</span>
                <button
                  onClick={() => onDelete(vendor.id)}
                  className="px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg hover:bg-slate-200 transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete vendor"
              >
                <i className="fa-solid fa-trash text-sm" />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        {vendor.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {vendor.categories.map(cat => (
              <CategoryBadge key={cat} category={cat} />
            ))}
          </div>
        )}

        {/* Data Sources & Integrations */}
        {(vendor.dataSources.length > 0 || vendor.integrations.length > 0) && (
          <div className="mt-3 space-y-2">
            {vendor.dataSources.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium mr-1">Data:</span>
                {vendor.dataSources.map(ds => (
                  <span key={ds} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-100">
                    {ds}
                  </span>
                ))}
              </div>
            )}
            {vendor.integrations.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium mr-1">Integrates:</span>
                {vendor.integrations.map(int => (
                  <span key={int} className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-full border border-purple-100">
                    {int}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tab Bar */}
      <div className="flex border-b border-slate-100 flex-shrink-0 px-6" role="tablist">
        {TABS.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <i className={`${tab.icon} text-xs`} />
            {tab.label}
            {tab.id === 'contacts' && vendor.contacts.length > 0 && (
              <span className="ml-1 bg-slate-100 text-slate-600 text-xs px-1.5 py-0.5 rounded-full">
                {vendor.contacts.length}
              </span>
            )}
            {tab.id === 'activities' && vendor.activities.length > 0 && (
              <span className="ml-1 bg-slate-100 text-slate-600 text-xs px-1.5 py-0.5 rounded-full">
                {vendor.activities.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {activeTab === 'intelligence' && (
          <IntelligenceTab
            vendorName={vendor.name}
            intelligence={vendor.intelligence}
            onRefresh={() => onRefreshIntelligence(vendor.id)}
            isRefreshing={isRefreshing}
          />
        )}
        {activeTab === 'contacts' && (
          <ContactsTab
            contacts={vendor.contacts}
            onUpdate={handleContactsUpdate}
          />
        )}
        {activeTab === 'activities' && (
          <ActivitiesTab
            activities={vendor.activities}
            onUpdate={handleActivitiesUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default VendorDetail;
